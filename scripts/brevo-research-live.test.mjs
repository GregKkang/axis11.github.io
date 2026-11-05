import test from 'node:test';
import assert from 'node:assert/strict';
import { publishNewResearch, makeBrevo, githubLedger } from './brevo-research-live.mjs';
const config = { mode: 'dry-run', excludedArticleIds: ['technology/old'], sender: { name: 'AXIS11 Research', email: 'greg@axis11research.com' }, segmentIds: { en: 1, ko: 2 } };
const article = (slug = 'new') => ({ category: 'technology', slug, primaryLang: 'en', languages: ['en', 'ko'], versions: { en: { title: 'English', summary: 'English summary' }, ko: { title: '한국어', summary: '한국어 요약' } } });
function memory(initial = { schemaVersion: 1, articles: {} }) {
  let value = structuredClone(initial);
  return { async load() { return structuredClone(value); }, async save(v) { value = structuredClone(v); }, read() { return structuredClone(value); } };
}
const run = (articles, store, api, verify = async () => {}) => publishNewResearch(articles, config, 'https://axis11research.com/', store, api, verify, 'commit');
test('activation initializes all currently published identities without API calls', async () => {
  const store = memory(null);
  const result = await run([article()], store, async () => assert.fail('No historical send'));
  assert.equal(result.initialized, true);
  assert.equal(store.read().articles['technology/new'].status, 'baseline');
  await run([article()], store, async () => assert.fail('No historical edit send'));
});
test('a new pair sends once per language with correct segments; edits and reruns do not send', async () => {
  const store = memory(), calls = [];
  const api = async (route, body) => { calls.push({ route, body }); return { id: calls.length }; };
  const result = await run([article()], store, api);
  assert.equal(result.accepted, 2);
  assert.deepEqual(calls[0].body.recipients, { segmentIds: [1] });
  assert.deepEqual(calls[2].body.recipients, { segmentIds: [2] });
  const edited = article(); edited.versions.en.title = 'Edited';
  await run([edited], store, api);
  await run([], store, api);
  await run([edited], store, api);
  assert.equal(calls.length, 4);
});
test('language versions published in separate commits wait, then form one event', async () => {
  const store = memory(); let calls = 0;
  const a = article(); a.languages = ['en'];
  await run([a], store, async () => { calls++; });
  assert.equal(calls, 0);
  await run([article()], store, async () => ({ id: ++calls }));
  assert.equal(calls, 4);
});
test('Market Pulse and configured baseline remain excluded', async () => {
  const pulse = article(); pulse.category = 'market-pulse';
  await run([pulse, article('old')], memory(), async () => assert.fail('Excluded'));
});
test('creation timeout persists intent and prevents another creation on rerun', async () => {
  const store = memory(); let calls = 0;
  await assert.rejects(run([article()], store, async () => { calls++; throw new Error('timeout'); }));
  assert.equal(store.read().articles['technology/new'].campaigns[0].status, 'creating');
  const result = await run([article()], store, async () => { calls++; });
  assert.deepEqual(result.blocked, ['technology/new']);
  assert.equal(calls, 1);
});
test('send timeout preserves campaign ID and prevents another send', async () => {
  const store = memory(); let calls = 0;
  await assert.rejects(run([article()], store, async route => { calls++; if (route.endsWith('/sendNow')) throw new Error('timeout'); return { id: 99 }; }));
  const record = store.read().articles['technology/new'].campaigns[0];
  assert.equal(record.status, 'sending'); assert.equal(record.campaignId, 99);
  await run([article()], store, async () => { calls++; });
  assert.equal(calls, 2);
});
test('partial EN success is not resent when KO creation is uncertain', async () => {
  const store = memory(); let calls = 0;
  await assert.rejects(run([article()], store, async () => { calls++; if (calls === 3) throw new Error('timeout'); return { id: 11 }; }));
  assert.equal(store.read().articles['technology/new'].campaigns[0].status, 'accepted');
  await run([article()], store, async () => { calls++; });
  assert.equal(calls, 3);
});
test('state write failure prevents an external call', async () => {
  const store = memory(); store.save = async () => { throw new Error('write failure'); };
  await assert.rejects(run([article()], store, async () => assert.fail('No API call')));
});
test('state failure after send acceptance leaves sending state and blocks a retry', async () => {
  const store = memory(), save = store.save; let saves = 0, calls = 0;
  store.save = async value => { if (++saves === 5) throw new Error('write failure'); await save(value); };
  await assert.rejects(run([article()], store, async () => ({ id: ++calls })));
  store.save = save;
  await run([article()], store, async () => { calls++; });
  assert.equal(calls, 2);
});
test('failed public link checks prevent draft creation', async () => {
  await assert.rejects(run([article()], memory(), async () => assert.fail('No API call'), async () => { throw new Error('404'); }));
});
test('invalid ledger fails closed', async () => {
  await assert.rejects(run([article()], memory({ schemaVersion: 5 }), async () => assert.fail('No API call')));
});
test('Brevo transport never retries a failed request or leaks its body', async () => {
  let calls = 0;
  const api = makeBrevo('secret', async () => { calls++; return { ok: false, status: 402 }; });
  await assert.rejects(api('/emailCampaigns/1/sendNow', {}), /402/);
  assert.equal(calls, 1);
  await assert.rejects(api('/smtp/email', {}), /Forbidden/);
  assert.equal(calls, 1);
});
test('GitHub ledger uses prior blob SHA to reject concurrent changes', async () => {
  const requests = [];
  const ledger = { schemaVersion: 1, articles: {} };
  const fetcher = async (url, opts) => {
    requests.push({ url, opts });
    const body = url.includes('/git/ref/') ? {} : opts.method === 'GET' ? { sha: 'previous', content: Buffer.from(JSON.stringify(ledger)).toString('base64') } : { content: { sha: 'next' } };
    return { ok: true, status: 200, async json() { return body; } };
  };
  const store = await githubLedger('token', 'owner/repo', 'commit', fetcher);
  await store.load(); await store.save(ledger); await store.save(ledger);
  assert.equal(JSON.parse(requests[2].opts.body).sha, 'previous');
  assert.equal(JSON.parse(requests[3].opts.body).sha, 'next');
});
