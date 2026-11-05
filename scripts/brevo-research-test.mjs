import { readFile, appendFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { planNotifications } from './research-notifications.mjs';

export const TEST_RECIPIENT = 'greg.kkang@gmail.com';
export function testDraft(campaign) {
  return {
    name: `TEST ${campaign.name}`,
    sender: campaign.sender,
    subject: `[TEST] ${campaign.subject}`,
    previewText: campaign.previewText,
    htmlContent: campaign.htmlContent,
    replyTo: campaign.sender.email,
  };
}

// Persist every intent BEFORE the external operation. Never retry an uncertain
// operation: the stored intent blocks all future attempts with this batch ID.
export async function sendTestPair(plan, batch, store, brevo) {
  if (!/^[a-zA-Z0-9-]{1,64}$/.test(batch)) throw new Error('Invalid test batch');
  const results = [];
  for (const campaign of plan.campaigns) {
    const key = createHash('sha256').update(`test:${batch}:${plan.id}:${campaign.lang}`).digest('hex');
    if (await store.get(key)) {
      results.push({ lang: campaign.lang, status: 'blocked-existing-record' });
      continue;
    }
    const record = { mode: 'test', articleId: plan.id, lang: campaign.lang, batch, status: 'creating', updatedAt: new Date().toISOString() };
    await store.put(key, record);
    const created = await brevo('/emailCampaigns', testDraft(campaign));
    if (!Number.isSafeInteger(created.id) || created.id <= 0) throw new Error('Invalid campaign ID; reconcile with Brevo');
    record.campaignId = created.id;
    record.status = 'sending-test';
    await store.put(key, record);
    await brevo(`/emailCampaigns/${created.id}/sendTest`, { emailTo: [TEST_RECIPIENT] });
    record.status = 'test-accepted';
    await store.put(key, record);
    results.push({ lang: campaign.lang, campaignId: created.id, status: record.status });
  }
  return results;
}

async function main() {
  if (process.env.GITHUB_EVENT_NAME !== 'workflow_dispatch' || process.env.GITHUB_REF !== 'refs/heads/main') throw new Error('Manual main-branch runs only');
  const { BREVO_API_KEY, GH_TOKEN, GITHUB_REPOSITORY, GITHUB_SHA, TEST_ARTICLE_ID, TEST_BATCH } = process.env;
  if (!BREVO_API_KEY || !GH_TOKEN || GITHUB_REPOSITORY !== 'GregKkang/axis11.github.io') throw new Error('Missing credentials or unexpected repository');
  const config = JSON.parse(await readFile('.github/research-notifications.json', 'utf8'));
  const articles = JSON.parse(await readFile('src/data/articles.json', 'utf8'));
  const article = articles.find(a => `${a.category}/${a.slug}` === TEST_ARTICLE_ID);
  if (!article) throw new Error('Select an existing published Research article');
  // This explicit manual test may use an old article without changing the
  // production exclusion list. Test records never mark production as sent.
  const plan = planNotifications([article], { ...config, excludedArticleIds: [] }, 'https://axis11research.com/').plans[0];
  if (!plan) throw new Error('Both language versions must be published');
  for (const campaign of plan.campaigns) {
    const page = await fetch(campaign.link, { signal: AbortSignal.timeout(20000) });
    if (!page.ok || new URL(page.url).origin !== 'https://axis11research.com') throw new Error('Published article link check failed');
  }
  const apiRoot = `https://api.github.com/repos/${GITHUB_REPOSITORY}`;
  async function github(route, method = 'GET', body) {
    const response = await fetch(`${apiRoot}${route}`, {
      method, headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
      body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(20000),
    });
    if (response.status === 404 && method === 'GET') return null;
    if (!response.ok) throw new Error(`GitHub state request failed (${response.status}); no automatic retry`);
    return response.status === 204 ? null : response.json();
  }
  const branch = 'research-notification-state';
  if (!await github(`/git/ref/heads/${branch}`)) await github('/git/refs', 'POST', { ref: `refs/heads/${branch}`, sha: GITHUB_SHA });
  const shas = new Map();
  const store = {
    async get(key) {
      const file = await github(`/contents/.notification-state/test/${key}.json?ref=${branch}`);
      if (!file) return null;
      return JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
    },
    async put(key, record) {
      const result = await github(`/contents/.notification-state/test/${key}.json`, 'PUT', {
        branch, message: `Record Research test ${record.lang}: ${record.status}`,
        content: Buffer.from(JSON.stringify(record, null, 2)).toString('base64'),
        ...(shas.has(key) ? { sha: shas.get(key) } : {}),
      });
      shas.set(key, result.content.sha);
    },
  };
  async function brevo(route, body) {
    // A literal allowlist: a live send endpoint cannot be called here.
    if (route !== '/emailCampaigns' && !/^\/emailCampaigns\/[1-9][0-9]*\/sendTest$/.test(route)) throw new Error('Forbidden Brevo endpoint');
    let response;
    try {
      response = await fetch(`https://api.brevo.com/v3${route}`, { method: 'POST', headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(20000) });
    } catch {
      throw new Error('Brevo response uncertain. Inspect the stored test record and Brevo; do not automatically retry.');
    }
    if (!response.ok) throw new Error(`Brevo request failed (${response.status}). Inspect Brevo before another batch; no automatic retry.`);
    return response.status === 204 ? {} : response.json();
  }
  const result = await sendTestPair(plan, TEST_BATCH, store, brevo);
  const summary = `Brevo Research TEST ONLY\n\n${result.map(r => `${r.lang}: ${r.status}${r.campaignId ? ` (campaign ${r.campaignId})` : ''}`).join('\n')}\n\nNo subscriber campaign was sent. test-accepted means API acceptance, not confirmed inbox delivery.\n`;
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
