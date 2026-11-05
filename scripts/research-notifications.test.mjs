import test from 'node:test';
import assert from 'node:assert/strict';
import { planNotifications } from './research-notifications.mjs';
const config = { mode: 'dry-run', excludedArticleIds: ['technology/old'], sender: { name: 'AXIS11 Research', email: 'greg@axis11research.com' }, segmentIds: { en: 1, ko: 2 } };
const article = (slug = 'new') => ({ category: 'technology', slug, primaryLang: 'en', languages: ['en', 'ko'], versions: { en: { title: 'EN <title>', summary: 'English & summary' }, ko: { title: '한국어 제목', summary: '한국어 요약' } } });
test('one article produces exactly two language campaigns with distinct segments and links', () => {
  const result = planNotifications([article()], config, 'https://example.com/site/');
  assert.equal(result.articleCount, 1);
  assert.equal(result.apiCalls, 0);
  const [en, ko] = result.plans[0].campaigns;
  assert.deepEqual(en.recipients, { segmentIds: [1] });
  assert.deepEqual(ko.recipients, { segmentIds: [2] });
  assert.equal(en.link, 'https://example.com/site/research/technology/new/');
  assert.equal(ko.link, 'https://example.com/site/research/technology/new/ko/');
  assert.match(en.htmlContent, /EN &lt;title&gt;/);
});
test('existing article and edits are excluded', () => {
  const a = article('old'); a.versions.en.title = 'Updated';
  assert.equal(planNotifications([a], config, 'https://example.com/').articleCount, 0);
});
test('one language waits until the pair is published', () => {
  const a = article(); a.languages = ['en'];
  assert.deepEqual(planNotifications([a], config, 'https://example.com/').waiting, ['technology/new']);
  a.languages.push('ko');
  assert.equal(planNotifications([a], config, 'https://example.com/').articleCount, 1);
});
test('Market Pulse is excluded', () => {
  const a = article(); a.category = 'market-pulse';
  assert.equal(planNotifications([a], config, 'https://example.com/').articleCount, 0);
});
test('live mode and malformed identities fail closed', () => {
  assert.throws(() => planNotifications([article()], { ...config, mode: 'live' }, 'https://example.com/'));
  assert.throws(() => planNotifications([article('../bad')], config, 'https://example.com/'));
});
test('duplicate articles fail instead of duplicating campaigns', () => {
  assert.throws(() => planNotifications([article(), article()], config, 'https://example.com/'));
});

test('email uses full first body paragraph instead of the short site summary', () => {
  const a = article();
  const intro = 'This is the full opening paragraph. '.repeat(15);
  a.versions.en.emailIntro = intro;
  a.versions.ko.emailIntro = '한국어 첫 번째 본문 문단 전체입니다.';
  const [en, ko] = planNotifications([a], config, 'https://example.com/').plans[0].campaigns;
  assert.ok(en.htmlContent.includes(intro));
  assert.ok(!en.htmlContent.includes('English &amp; summary'));
  assert.equal(en.previewText, intro);
  assert.ok(ko.htmlContent.includes(a.versions.ko.emailIntro));
});

test('renders four distinct paragraphs and visible article and unsubscribe links', () => {
  const a = article();
  for (const lang of ['en','ko']) a.versions[lang].emailParagraphs = ['First & full', 'Second', 'Third', 'Fourth', 'Fifth'];
  const campaigns = planNotifications([a], config, 'https://example.com/').plans[0].campaigns;
  for (const c of campaigns) {
    assert.ok(c.htmlContent.includes('First &amp; full'));
    for (const text of ['Second','Third','Fourth']) assert.ok(c.htmlContent.includes('>' + text + '</p>'));
    assert.ok(!c.htmlContent.includes('Fifth'));
    assert.ok(c.htmlContent.includes('href="' + c.link + '"'));
    assert.ok(c.htmlContent.includes('href="{{ unsubscribe }}"'));
    assert.ok(c.htmlContent.indexOf('href="{{ unsubscribe }}"') < c.htmlContent.indexOf('First &amp; full'));
    assert.ok(c.htmlContent.lastIndexOf('href="' + c.link + '"') > c.htmlContent.indexOf('Fourth'));
  }
});
