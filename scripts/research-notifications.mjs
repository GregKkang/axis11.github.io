import { readFile, mkdir, writeFile, appendFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export function planNotifications(articles, config, siteUrl) {
  const site = new URL(siteUrl);
  if (site.protocol !== 'https:') throw new Error('An HTTPS deployment URL is required');
  if (!Array.isArray(articles) || config.mode !== 'dry-run') throw new Error('Only dry-run mode is implemented');
  const baseline = new Set(config.excludedArticleIds);
  const seen = new Set();
  const plans = [];
  const waiting = [];
  for (const article of articles) {
    const { category, slug } = article;
    if (![category, slug].every(x => typeof x === 'string' && /^[a-z0-9-]+$/.test(x))) throw new Error('Invalid article identity');
    const id = `${category}/${slug}`;
    if (seen.has(id)) throw new Error(`Duplicate article: ${id}`);
    seen.add(id);
    if (baseline.has(id)) continue;
    if (category === 'market-pulse') continue;
    if (!['en', 'ko'].every(lang => article.languages?.includes(lang) && article.versions?.[lang])) {
      waiting.push(id);
      continue;
    }
    const campaigns = ['en', 'ko'].map(lang => {
      const version = article.versions[lang];
      if (!version.title || typeof version.summary !== 'string') throw new Error(`Missing metadata: ${id}/${lang}`);
      const paragraphs = version.emailParagraphs ?? [version.emailIntro ?? version.summary];
      if (!Array.isArray(paragraphs) || !paragraphs.length || paragraphs.some(p => typeof p !== 'string' || !p.trim())) throw new Error(`Missing body paragraphs: ${id}/${lang}`);
      const intro = paragraphs[0];
      const excerptHtml = paragraphs.slice(0, 4).map(p => `<p style="margin:0 0 18px;line-height:1.7">${escape(p)}</p>`).join('');
      if (typeof intro !== 'string' || !intro.trim()) throw new Error(`Missing first body paragraph: ${id}/${lang}`);
      const suffix = article.primaryLang === lang ? '' : `${lang}/`;
      const link = new URL(`research/${id}/${suffix}`, site.href.replace(/\/?$/, '/')).href;
      const label = lang === 'ko' ? '리서치 읽기' : 'Read Research';
      return {
        lang,
        name: `AXIS11 ${id} ${lang}`,
        sender: config.sender,
        recipients: { segmentIds: [config.segmentIds[lang]] },
        subject: `[AXIS11 Research] ${version.title}`,
        previewText: intro,
        link,
        htmlContent: `<!doctype html><html lang="${lang}"><body><p>AXIS11 Research · <a href="{{ unsubscribe }}">${lang === 'ko' ? '구독 취소' : 'Unsubscribe'}</a></p><h1><a href="${escape(link)}" style="color:#111;text-decoration:none">${escape(version.title)}</a></h1>${excerptHtml}<p><a href="${escape(link)}" style="display:inline-block;padding:12px 20px;background:#163a36;color:#fff;text-decoration:none;border-radius:6px">${label}</a></p><p><a href="{{ unsubscribe }}">${lang === 'ko' ? '구독 취소' : 'Unsubscribe'}</a></p></body></html>`,
      };
    });
    plans.push({ id, campaigns });
  }
  return { mode: 'dry-run', apiCalls: 0, articleCount: plans.length, plans, waiting };
}

async function main() {
  const [indexPath, configPath, siteUrl, outputDir = 'notification-preview'] = process.argv.slice(2);
  if (!indexPath || !configPath || !siteUrl) throw new Error('Usage: node scripts/research-notifications.mjs INDEX CONFIG SITE_URL [OUTPUT]');
  const result = planNotifications(JSON.parse(await readFile(indexPath, 'utf8')), JSON.parse(await readFile(configPath, 'utf8')), siteUrl);
  await mkdir(outputDir, { recursive: true });
  await writeFile(`${outputDir}/plan.json`, JSON.stringify(result, null, 2));
  for (const plan of result.plans) {
    for (const campaign of plan.campaigns) await writeFile(`${outputDir}/${plan.id.replaceAll('/', '--')}--${campaign.lang}.html`, campaign.htmlContent);
  }
  const summary = `Research notifications: DRY RUN\n\nNew bilingual articles: ${result.articleCount}\nWaiting for both languages: ${result.waiting.length}\nBrevo API calls: 0. No email sent.\n\nThis preview does not mark articles as sent; repeated previews are expected.\n`;
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
