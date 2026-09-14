/**
 * Post-build static page generation.
 *
 * GitHub Pages has no server-side routing, so every URL the site exposes needs
 * a real index.html on disk. This walks the categories and articles, writes a
 * copy of the built SPA shell at each path with page-specific metadata baked
 * into the <head>, and emits sitemap.xml and rss.xml.
 *
 * Run after `vite build`.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

/** Public origin + base path. Override with SITE_URL when moving domains. */
const SITE_URL = (process.env.SITE_URL ?? "https://gregkkang.github.io/axis11.github.io/").replace(/\/?$/, "/");
const SITE_NAME = "Axis11 Research";
const SITE_DESCRIPTION =
  "Investment research and market commentary from Greg Kang in New Zealand, covering global macro, equities, technology, and commodities.";

const categories = JSON.parse(await readFile(path.join(ROOT, "src", "data", "research.json"), "utf8"));
const articles = JSON.parse(await readFile(path.join(ROOT, "src", "data", "articles.json"), "utf8"));
const shell = await readFile(path.join(DIST, "index.html"), "utf8");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const absolute = (relative) => new URL(relative, SITE_URL).href;

/**
 * Replace the shell's metadata with this page's. Tags are rewritten rather than
 * appended so a crawler never sees two competing titles or descriptions.
 */
function renderShell({ title, description, canonical, type = "website", published, alternates = [] }) {
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    ...alternates.map((alt) => `<link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />`),
    published ? `<meta property="article:published_time" content="${published}" />` : null,
  ].filter(Boolean);

  return shell
    .replace(/<title>[\s\S]*?<\/title>/, "%%META%%")
    .replace(/\s*<meta name="description"[^>]*>/g, "")
    .replace(/\s*<meta property="og:(?:title|description|type)"[^>]*>/g, "")
    .replace(/\s*<meta name="twitter:card"[^>]*>/g, "")
    .replace("%%META%%", tags.join("\n    "));
}

async function writePage(relativePath, html) {
  const dir = path.join(DIST, relativePath);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), html, "utf8");
}

/* ------------------------------------------------------------------ */

const urls = [{ loc: SITE_URL, changefreq: "monthly", priority: "1.0" }];

// Category pages
for (const category of categories) {
  const relative = `research/${category.slug}`;
  const canonical = absolute(`${relative}/`);
  await writePage(
    relative,
    renderShell({
      title: `${category.title} Research | Axis11`,
      description: category.description,
      canonical,
    }),
  );
  urls.push({ loc: canonical, changefreq: "weekly", priority: "0.8" });
}

// Article pages — one per language version
for (const article of articles) {
  const alternates = article.languages.map((lang) => ({
    lang,
    href: absolute(
      lang === article.primaryLang
        ? `research/${article.category}/${article.slug}/`
        : `research/${article.category}/${article.slug}/${lang}/`,
    ),
  }));

  for (const lang of article.languages) {
    const isPrimary = lang === article.primaryLang;
    const relative = isPrimary
      ? `research/${article.category}/${article.slug}`
      : `research/${article.category}/${article.slug}/${lang}`;
    const canonical = absolute(`${relative}/`);
    const version = article.versions[lang];

    await writePage(
      relative,
      renderShell({
        title: `${version.title} | Axis11 Research`,
        description: version.summary,
        canonical,
        type: "article",
        published: `${article.date}T00:00:00Z`,
        alternates,
      }),
    );

    urls.push({ loc: canonical, changefreq: "monthly", priority: isPrimary ? "0.7" : "0.5" });
  }
}

// sitemap.xml
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;
await writeFile(path.join(DIST, "sitemap.xml"), sitemap, "utf8");

// rss.xml — primary-language versions only, newest first
const items = articles.map((article) => {
  const version = article.versions[article.primaryLang];
  const link = absolute(`research/${article.category}/${article.slug}/`);
  return `    <item>
      <title>${escapeHtml(version.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(`${article.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeHtml(version.summary)}</description>
    </item>`;
});

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeHtml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeHtml(SITE_DESCRIPTION)}</description>
    <language>en-nz</language>
    <atom:link href="${absolute("rss.xml")}" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>
`;
await writeFile(path.join(DIST, "rss.xml"), rss, "utf8");

// robots.txt gains the sitemap pointer
const robotsPath = path.join(DIST, "robots.txt");
const robots = await readFile(robotsPath, "utf8").catch(() => "User-agent: *\nAllow: /\n");
if (!robots.includes("Sitemap:")) {
  await writeFile(robotsPath, `${robots.trimEnd()}\n\nSitemap: ${absolute("sitemap.xml")}\n`, "utf8");
}

const pageCount = categories.length + articles.reduce((n, a) => n + a.languages.length, 0);
console.log(`✓ Static pages: ${pageCount} (${categories.length} categories, ${articles.length} articles) + sitemap + RSS`);
