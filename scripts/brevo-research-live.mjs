import { readFile, appendFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { planNotifications } from './research-notifications.mjs';

const identity = article => `${article.category}/${article.slug}`;
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const accepted = record => record?.status === 'accepted';

export async function publishNewResearch(articles, config, siteUrl, store, api, verifyLinks, sourceSha) {
  // Validate the complete built index even when initializing. Only the Research
  // builder's non-draft versions enter this index.
  const preview = planNotifications(articles, config, siteUrl);
  let ledger = await store.load();
  if (!ledger) {
    ledger = { schemaVersion: 1, initializedAt: new Date().toISOString(), initializedCommit: sourceSha, articles: {} };
    for (const id of new Set([...config.excludedArticleIds, ...articles.map(identity)])) {
      ledger.articles[id] = { status: 'baseline' };
    }
    await store.save(ledger);
    return { initialized: true, accepted: 0, waiting: 0, blocked: [] };
  }
  if (ledger.schemaVersion !== 1 || !ledger.articles || typeof ledger.articles !== 'object' || Array.isArray(ledger.articles)) throw new Error('Invalid production ledger; refusing to send');
  const result = { initialized: false, accepted: 0, waiting: preview.waiting.length, blocked: [] };
  for (const plan of preview.plans) {
    let event = own(ledger.articles, plan.id) ? ledger.articles[plan.id] : null;
    if (event?.status === 'baseline' || event?.status === 'complete') continue;
    if (event && event.status !== 'active') throw new Error(`Invalid article state: ${plan.id}`);
    if (!event) {
      // Freeze both payloads together, so an edit between language sends does
      // not silently change one half of the original publication event.
      event = { status: 'active', sourceSha, campaigns: plan.campaigns.map(payload => ({ status: 'ready', payload })) };
      ledger.articles[plan.id] = event;
      await store.save(ledger);
    }
    if (!Array.isArray(event.campaigns) || event.campaigns.length !== 2 || event.campaigns[0].payload?.lang !== 'en' || event.campaigns[1].payload?.lang !== 'ko') throw new Error('Invalid campaign state');
    if (event.campaigns.some(c => !['ready', 'created', 'accepted'].includes(c.status))) {
      result.blocked.push(plan.id);
      continue;
    }
    await verifyLinks(event.campaigns.map(c => c.payload.link));
    for (const record of event.campaigns) {
      if (accepted(record)) continue;
      if (record.status === 'ready') {
        record.status = 'creating';
        await store.save(ledger);
        const { lang, link, ...payload } = record.payload;
        const created = await api('/emailCampaigns', { ...payload, replyTo: config.sender.email });
        if (!Number.isSafeInteger(created.id) || created.id <= 0) throw new Error('Invalid Brevo campaign ID; reconcile manually');
        record.campaignId = created.id;
        record.status = 'created';
        await store.save(ledger);
      }
      if (!Number.isSafeInteger(record.campaignId) || record.campaignId <= 0) throw new Error('Missing campaign ID');
      record.status = 'sending';
      await store.save(ledger);
      await api(`/emailCampaigns/${record.campaignId}/sendNow`, {});
      record.status = 'accepted';
      record.acceptedAt = new Date().toISOString();
      await store.save(ledger);
      result.accepted++;
    }
    event.status = 'complete';
    await store.save(ledger);
  }
  return result;
}

export function makeBrevo(apiKey, fetcher = fetch) {
  return async (route, body) => {
    if (!apiKey) throw new Error('Missing BREVO_API_KEY');
    if (route !== '/emailCampaigns' && !/^\/emailCampaigns\/[1-9][0-9]*\/sendNow$/.test(route)) throw new Error('Forbidden Brevo route');
    let response;
    try {
      response = await fetcher(`https://api.brevo.com/v3${route}`, {
        method: 'POST', headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body), signal: AbortSignal.timeout(30000),
      });
    } catch { throw new Error('Brevo outcome uncertain. Automatic retry blocked by production ledger; reconcile manually.'); }
    if (!response.ok) throw new Error(`Brevo returned ${response.status}. Inspect campaign and production ledger before retrying.`);
    return response.status === 204 ? {} : response.json();
  };
}

export async function githubLedger(token, repository, sourceSha, fetcher = fetch) {
  const branch = 'research-notification-state';
  const filePath = '.notification-state/production.json';
  let sha;
  async function request(route, method = 'GET', body) {
    const response = await fetcher(`https://api.github.com/repos/${repository}${route}`, {
      method, headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
      body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(20000),
    });
    if (response.status === 404 && method === 'GET') return null;
    if (!response.ok) throw new Error(`Production state request failed (${response.status}); refusing the next API operation`);
    return response.json();
  }
  if (!await request(`/git/ref/heads/${branch}`)) await request('/git/refs', 'POST', { ref: `refs/heads/${branch}`, sha: sourceSha });
  return {
    async load() {
      const file = await request(`/contents/${filePath}?ref=${branch}`);
      if (!file) return null;
      sha = file.sha;
      return JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
    },
    async save(ledger) {
      const result = await request(`/contents/${filePath}`, 'PUT', {
        branch, message: 'Record Research publication notification state',
        content: Buffer.from(JSON.stringify(ledger, null, 2)).toString('base64'), ...(sha ? { sha } : {}),
      });
      sha = result.content.sha;
    },
  };
}

async function main() {
  const env = process.env;
  if (env.GITHUB_EVENT_NAME !== 'push' || env.GITHUB_REF !== 'refs/heads/main' || env.GITHUB_REPOSITORY !== 'GregKkang/axis11.github.io') throw new Error('Production runs require a main push in the expected repository');
  if (!env.GH_TOKEN || !env.BREVO_API_KEY || !env.GITHUB_SHA) throw new Error('Missing production credentials');
  const [indexPath, configPath] = process.argv.slice(2);
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  if (config.productionEnabled !== true) throw new Error('Production sending is disabled');
  if (config.sender?.email !== 'greg@axis11research.com' || config.segmentIds?.en !== 1 || config.segmentIds?.ko !== 2) throw new Error('Unexpected sender or language segments');
  const site = new URL(env.DEPLOYED_SITE_URL);
  if (site.origin !== 'https://axis11research.com') throw new Error('Unexpected deployment URL');
  async function verifyLinks(links) {
    for (const link of links) {
      const response = await fetch(link, { signal: AbortSignal.timeout(20000) });
      if (!response.ok || new URL(response.url).href !== link) throw new Error('Published language link check failed; no send attempted');
    }
  }
  const store = await githubLedger(env.GH_TOKEN, env.GITHUB_REPOSITORY, env.GITHUB_SHA);
  const result = await publishNewResearch(JSON.parse(await readFile(indexPath, 'utf8')), config, site.href, store, makeBrevo(env.BREVO_API_KEY), verifyLinks, env.GITHUB_SHA);
  const summary = `Research notifications\n\nBaseline initialized: ${result.initialized}\nCampaigns accepted by Brevo this run: ${result.accepted}\nWaiting for both languages: ${result.waiting}\nBlocked uncertain events: ${result.blocked.join(', ') || 'none'}\n\nAPI acceptance is not confirmation of inbox delivery.\n`;
  console.log(summary);
  if (env.GITHUB_STEP_SUMMARY) await appendFile(env.GITHUB_STEP_SUMMARY, summary);
  if (result.blocked.length) throw new Error('Uncertain production events require manual reconciliation; no automatic resend');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
