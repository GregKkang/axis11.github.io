import test from 'node:test';
import assert from 'node:assert/strict';
import { sendTestPair, testDraft, TEST_RECIPIENT } from './brevo-research-test.mjs';
const campaign = lang => ({ lang, name: `article ${lang}`, sender: { email: 'greg@axis11research.com', name: 'AXIS11 Research' }, subject: lang, previewText: 'summary', htmlContent: '<p>Article</p>', recipients: { segmentIds: [lang === 'en' ? 1 : 2] }, scheduledAt: '2030-01-01' });
const plan = { id: 'technology/example', campaigns: [campaign('en'), campaign('ko')] };
function state() { const records = new Map(); return { records, async get(k) { return records.get(k); }, async put(k, v) { records.set(k, structuredClone(v)); } }; }
test('test drafts have no subscriber recipients or scheduling', () => {
  const draft = testDraft(campaign('en'));
  assert.equal(draft.recipients, undefined);
  assert.equal(draft.scheduledAt, undefined);
  assert.match(draft.subject, /^\[TEST\]/);
});
test('test pair sends only to the fixed recipient and blocks repeat batches', async () => {
  const store = state(), calls = [];
  const api = async (route, body) => { calls.push({ route, body }); return { id: calls.length }; };
  const result = await sendTestPair(plan, 'initial-test', store, api);
  assert.equal(result.length, 2);
  for (const call of calls.filter(c => c.route.endsWith('/sendTest'))) assert.deepEqual(call.body, { emailTo: [TEST_RECIPIENT] });
  assert.equal(calls.length, 4);
  await sendTestPair(plan, 'initial-test', store, api);
  assert.equal(calls.length, 4);
});
test('creation intent survives uncertain campaign creation and blocks a retry', async () => {
  const store = state(); let calls = 0;
  await assert.rejects(sendTestPair({ ...plan, campaigns: [campaign('en')] }, 'batch', store, async () => { calls++; throw new Error('timeout'); }));
  assert.equal([...store.records.values()][0].status, 'creating');
  await sendTestPair({ ...plan, campaigns: [campaign('en')] }, 'batch', store, async () => { calls++; });
  assert.equal(calls, 1);
});
test('uncertain send records campaign ID and prevents resending', async () => {
  const store = state(); let calls = 0;
  const api = async route => { calls++; if (route.endsWith('/sendTest')) throw new Error('timeout'); return { id: 77 }; };
  const one = { ...plan, campaigns: [campaign('en')] };
  await assert.rejects(sendTestPair(one, 'batch', store, api));
  assert.equal([...store.records.values()][0].campaignId, 77);
  assert.equal([...store.records.values()][0].status, 'sending-test');
  await sendTestPair(one, 'batch', store, api);
  assert.equal(calls, 2);
});
test('state persistence failure prevents API calls', async () => {
  let called = false;
  await assert.rejects(sendTestPair(plan, 'batch', { async get() { return null; }, async put() { throw new Error('write failed'); } }, async () => { called = true; }));
  assert.equal(called, false);
});
