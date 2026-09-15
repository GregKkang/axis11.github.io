/**
 * Build-time content pipeline.
 *
 * Reads `content/research/<category>/<article>/<lang>.md`, validates the
 * frontmatter, renders the markdown to HTML, resolves any ```chart blocks
 * (including CSV data files sitting next to the article) and writes a single
 * `src/data/articles.json` that the React app consumes.
 *
 * Nothing here ships to the browser — the markdown parser stays in Node.
 */

import { readFile, writeFile, readdir, mkdir, rm, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import footnote from "markdown-it-footnote";
import attrs from "markdown-it-attrs";
import { parse as parseCsv } from "csv-parse/sync";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content", "research");
/** Lightweight index: metadata only, imported by every page. */
const INDEX_FILE = path.join(ROOT, "src", "data", "articles.json");
/** One file per article + language, loaded on demand by the article view. */
const BODY_DIR = path.join(ROOT, "src", "data", "articles");
const CATEGORIES_FILE = path.join(ROOT, "src", "data", "research.json");
/** Article images are copied here so Vite serves and ships them. */
const ASSET_URL_DIR = "research-assets";
const ASSET_DIR = path.join(ROOT, "public", ASSET_URL_DIR);

/** Body payloads are addressed by this key from the client. */
export const bodyKey = (category, slug, lang) => `${category}--${slug}--${lang}`;

/** Languages the site supports. The first is the default / canonical one. */
const LANGUAGES = ["en", "ko"];
const CHART_TYPES = new Set(["line", "area", "bar"]);

/**
 * The categorical palette has four slots, chosen so that every pair stays
 * distinguishable under colour-vision deficiency (worst-case ΔE 15.8 against a
 * threshold of 8). A fifth hue cannot be added without two series becoming
 * hard to tell apart, so the build refuses it rather than silently recycling a
 * colour — split the chart or group the tail into "Other" instead.
 */
const MAX_SERIES = 4;

const problems = [];
const fail = (where, message) => problems.push(`${where}: ${message}`);

/* ------------------------------------------------------------------ */
/* Markdown                                                            */
/* ------------------------------------------------------------------ */

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(footnote)
  .use(attrs);

// Open external links in a new tab without losing referrer safety.
const defaultLinkOpen =
  md.renderer.rules.link_open ||
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = tokens[idx].attrGet("href") ?? "";
  if (/^https?:\/\//i.test(href)) {
    tokens[idx].attrSet("target", "_blank");
    tokens[idx].attrSet("rel", "noopener noreferrer");
  }
  return defaultLinkOpen(tokens, idx, options, env, self);
};

// A source cited more than once renders by default as [4:2], [4:3] — the
// sub-index is an internal detail for back-links. Readers should only ever see
// the footnote's number; the anchor ids keep the sub-index and stay unique.
md.renderer.rules.footnote_caption = (tokens, idx) => `[${Number(tokens[idx].meta.id + 1)}]`;

/* ------------------------------------------------------------------ */
/* Charts                                                              */
/* ------------------------------------------------------------------ */

/**
 * Validate and normalise one ```chart block.
 * Data may be inline (`data`) or loaded from a CSV next to the article
 * (`dataFile`). Numeric-looking CSV cells are coerced to numbers so recharts
 * can scale the axes.
 */
async function resolveChart(spec, articleDir, where) {
  if (!CHART_TYPES.has(spec.type)) {
    fail(where, `chart type must be one of ${[...CHART_TYPES].join(", ")} (got "${spec.type}")`);
    return null;
  }
  if (!spec.x) {
    fail(where, "chart is missing `x` (the field name used for the horizontal axis)");
    return null;
  }
  if (!Array.isArray(spec.series) || spec.series.length === 0) {
    fail(where, "chart needs at least one entry in `series`");
    return null;
  }
  if (spec.series.length > MAX_SERIES) {
    fail(
      where,
      `chart has ${spec.series.length} series but the palette holds ${MAX_SERIES} — ` +
        "split it into two charts, or group the smaller series into a single \"Other\" line",
    );
    return null;
  }

  let data = spec.data;

  if (spec.dataFile) {
    const csvPath = path.join(articleDir, spec.dataFile);
    if (!existsSync(csvPath)) {
      fail(where, `dataFile "${spec.dataFile}" not found next to the article`);
      return null;
    }
    const raw = await readFile(csvPath, "utf8");
    data = parseCsv(raw, { columns: true, skip_empty_lines: true, trim: true }).map((row) => {
      const out = {};
      for (const [key, value] of Object.entries(row)) {
        // Keep the x field as text (e.g. "2026Q1"); coerce the rest when numeric.
        if (key === spec.x) {
          out[key] = value;
        } else if (value === "") {
          // An empty cell is a missing observation, not a zero. Null keeps it
          // out of the plot so the series is never silently invented.
          out[key] = null;
        } else {
          const n = Number(value);
          out[key] = Number.isFinite(n) ? n : value;
        }
      }
      return out;
    });
  }

  if (!Array.isArray(data) || data.length === 0) {
    fail(where, "chart has no data — provide either `data` or `dataFile`");
    return null;
  }

  for (const series of spec.series) {
    if (!series.key) {
      fail(where, "every entry in `series` needs a `key`");
      return null;
    }
    if (!(series.key in data[0])) {
      fail(where, `series key "${series.key}" is not a column in the chart data`);
      return null;
    }
  }

  // A daily series has far too many points to label every one, so with
  // `xType: "date"` the axis is ticked at the first observation of each month.
  // The tick list is computed here rather than in the browser because it is a
  // property of the data, not of the rendering.
  let xTicks = null;
  if (spec.xType === "date") {
    const seen = new Set();
    xTicks = [];
    for (const row of data) {
      const month = String(row[spec.x]).slice(0, 7);
      if (!seen.has(month)) {
        seen.add(month);
        xTicks.push(row[spec.x]);
      }
    }
    if (xTicks.length > 14) {
      // Roughly quarterly once a chart spans more than about a year.
      const step = Math.ceil(xTicks.length / 12);
      xTicks = xTicks.filter((_, i) => i % step === 0);
    }
  }

  return {
    xType: spec.xType === "date" ? "date" : "category",
    xTicks,
    type: spec.type,
    title: spec.title ?? null,
    subtitle: spec.subtitle ?? null,
    source: spec.source ?? null,
    x: spec.x,
    xLabel: spec.xLabel ?? null,
    yLabel: spec.yLabel ?? null,
    // "percent" appends %, "number" leaves values as-is.
    format: spec.format === "percent" ? "percent" : "number",
    height: Number.isFinite(spec.height) ? spec.height : 320,
    stacked: spec.stacked === true,
    yZero: spec.yZero === true,
    series: spec.series.map((s) => ({
      key: s.key,
      label: s.label ?? s.key,
      // Optional explicit override; otherwise the component assigns from the palette.
      color: s.color ?? null,
    })),
    data,
  };
}

/* ------------------------------------------------------------------ */
/* Images                                                              */
/* ------------------------------------------------------------------ */

/**
 * Copy images referenced by an article into `public/` and rewrite their `src`.
 *
 * Images live beside the markdown that uses them, which keeps an article
 * self-contained, but that folder is not served. Each referenced file is copied
 * under a per-article directory and the `src` is rewritten to point there.
 *
 * The site is served from a sub-path, so the rewritten `src` carries a
 * `@@BASE@@` token rather than a hard-coded prefix; the client swaps in the
 * real base URL when it loads the article. Absolute and remote sources are
 * left untouched.
 */
async function withAssets(html, articleDir, assetPrefix, where) {
  const sources = [...html.matchAll(/<img\b[^>]*?\bsrc="([^"]+)"/g)].map((m) => m[1]);
  let out = html;

  for (const src of new Set(sources)) {
    if (/^(?:[a-z]+:)?\/\//i.test(src) || src.startsWith("/") || src.startsWith("data:")) continue;

    const source = path.join(articleDir, src);
    if (!existsSync(source)) {
      fail(where, `image "${src}" was not found next to the article`);
      continue;
    }

    const fileName = path.basename(src);
    const targetDir = path.join(ASSET_DIR, assetPrefix);
    await mkdir(targetDir, { recursive: true });
    await copyFile(source, path.join(targetDir, fileName));

    const replacement = `@@BASE@@${ASSET_URL_DIR}/${assetPrefix}/${fileName}`;
    out = out.replaceAll(`src="${src}"`, `src="${replacement}" loading="lazy" decoding="async"`);
  }

  return out;
}

/**
 * Promote a lone image into a <figure>, absorbing an immediately following
 * all-italic paragraph as its <figcaption>. Markdown has no figure syntax, and
 * the alternative — an image and a caption as two unrelated paragraphs — loses
 * the association for screen readers.
 */
function withFigures(html) {
  return html.replace(
    /<p>(<img\b[^>]*>)<\/p>\s*(?:<p><em>([\s\S]*?)<\/em><\/p>)?/g,
    (_match, img, caption) => {
      // Charts are rendered far wider than the column they sit in, so link the
      // figure to its own source — a reader who needs to read an axis label can
      // open the image at full resolution.
      const src = /\bsrc="([^"]+)"/.exec(img)?.[1];
      const body = src
        ? `<a href="${src}" target="_blank" rel="noopener noreferrer">${img}</a>`
        : img;
      return caption
        ? `<figure>${body}<figcaption>${caption}</figcaption></figure>`
        : `<figure>${body}</figure>`;
    },
  );
}

/**
 * Give every table its own horizontal scroll container.
 *
 * A four-column table of prices cannot shrink to phone width without either
 * overflowing the page or becoming unreadable, so it scrolls inside its own
 * box while the article itself never scrolls sideways. `tabindex` keeps the
 * scrollable region reachable from the keyboard.
 */
function withScrollableTables(html) {
  return html.replace(
    /<table>([\s\S]*?)<\/table>/g,
    (_match, body) =>
      `<div class="table-scroll" tabindex="0" role="region" aria-label="Table"><table>${body}</table></div>`,
  );
}

/**
 * Split markdown into renderable blocks, pulling ```chart fences out so they
 * can be hydrated as React components instead of inert HTML.
 *
 * The document is rendered in a single pass with each chart standing in as an
 * HTML comment, and the resulting HTML is split afterwards. Rendering each
 * segment separately would be simpler but breaks anything whose parts live in
 * different segments — a footnote referenced above a chart and defined below it
 * would never resolve.
 *
 * Returns [{kind:"html", html}, {kind:"chart", chart}, ...]
 */
async function toBlocks(markdown, articleDir, where, assetPrefix) {
  const fence = /^```chart[ \t]*\r?\n([\s\S]*?)\r?\n```[ \t]*$/gm;
  const charts = [];

  const placeholdered = markdown.replace(fence, (_match, body) => {
    let spec;
    try {
      spec = JSON.parse(body);
    } catch (error) {
      fail(where, `chart block is not valid JSON — ${error.message}`);
      return "";
    }
    // Resolved after the replace pass, which cannot be async.
    charts.push({ spec });
    return `\n<!--axis11:chart:${charts.length - 1}-->\n`;
  });

  for (const entry of charts) {
    entry.chart = await resolveChart(entry.spec, articleDir, where);
  }

  const html = withScrollableTables(
    withFigures(await withAssets(md.render(placeholdered), articleDir, assetPrefix, where)),
  );

  const blocks = [];
  const marker = /<!--axis11:chart:(\d+)-->/g;
  let cursor = 0;
  let match;

  const pushHtml = (fragment) => {
    const trimmed = fragment.trim();
    if (trimmed) blocks.push({ kind: "html", html: trimmed });
  };

  while ((match = marker.exec(html)) !== null) {
    pushHtml(html.slice(cursor, match.index));
    const chart = charts[Number(match[1])]?.chart;
    if (chart) blocks.push({ kind: "chart", chart });
    cursor = marker.lastIndex;
  }
  pushHtml(html.slice(cursor));

  return blocks;
}

/* ------------------------------------------------------------------ */
/* Article assembly                                                    */
/* ------------------------------------------------------------------ */

const WORDS_PER_MINUTE = 220;
/** CJK has no spaces, so count characters for Korean and words for English. */
function readingMinutes(markdown, lang) {
  const text = markdown.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_`|-]/g, " ");
  const units = lang === "ko" ? text.replace(/\s/g, "").length / 500 : text.trim().split(/\s+/).length / WORDS_PER_MINUTE;
  return Math.max(1, Math.round(units));
}

function plainSummary(blocks, fallback) {
  if (fallback) return fallback;
  const firstHtml = blocks.find((b) => b.kind === "html")?.html ?? "";
  const text = firstHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.slice(0, 180);
}

async function readVersion(articleDir, lang, where, assetPrefix) {
  const file = path.join(articleDir, `${lang}.md`);
  if (!existsSync(file)) return null;

  const raw = await readFile(file, "utf8");
  const { data: fm, content } = matter(raw);

  if (!fm.title) {
    fail(`${where}/${lang}.md`, "frontmatter is missing `title`");
    return null;
  }
  if (fm.draft === true) return null;

  const blocks = await toBlocks(content, articleDir, `${where}/${lang}.md`, assetPrefix);

  return {
    lang,
    title: String(fm.title),
    summary: plainSummary(blocks, fm.summary ? String(fm.summary) : null),
    readingMinutes: readingMinutes(content, lang),
    blocks,
  };
}

function normaliseDate(value, where) {
  if (!value) {
    fail(where, "frontmatter is missing `date` (use YYYY-MM-DD)");
    return null;
  }
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    fail(where, `\`date\` is not a valid date: ${value}`);
    return null;
  }
  return date.toISOString().slice(0, 10);
}

async function readArticle(categorySlug, articleSlug) {
  const articleDir = path.join(CONTENT_DIR, categorySlug, articleSlug);
  const where = `${categorySlug}/${articleSlug}`;

  const versions = {};
  for (const lang of LANGUAGES) {
    const version = await readVersion(articleDir, lang, where, `${categorySlug}--${articleSlug}`);
    if (version) versions[lang] = version;
  }

  const available = LANGUAGES.filter((lang) => versions[lang]);
  if (available.length === 0) return null; // all drafts, or an empty folder

  // Date, tags and hero are shared across languages; read them from whichever
  // version exists, preferring the default language.
  const primaryLang = available[0];
  const primaryFile = path.join(articleDir, `${primaryLang}.md`);
  const { data: fm } = matter(await readFile(primaryFile, "utf8"));

  const date = normaliseDate(fm.date, `${where}/${primaryLang}.md`);
  if (!date) return null;

  return {
    slug: articleSlug,
    category: categorySlug,
    date,
    tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
    hero: fm.hero ? String(fm.hero) : null,
    languages: available,
    primaryLang,
    versions,
  };
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function listDirs(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function main() {
  const categories = JSON.parse(await readFile(CATEGORIES_FILE, "utf8"));
  const knownCategories = new Set(categories.map((c) => c.slug));

  const articles = [];
  const seen = new Set();

  // Cleared before the articles are read, because reading them is what copies
  // images in — clearing afterwards would delete the assets just written.
  await rm(ASSET_DIR, { recursive: true, force: true });

  for (const categorySlug of await listDirs(CONTENT_DIR)) {
    if (!knownCategories.has(categorySlug)) {
      fail(
        `content/research/${categorySlug}`,
        `no category with this slug exists in src/data/research.json (known: ${[...knownCategories].join(", ")})`,
      );
      continue;
    }

    for (const articleSlug of await listDirs(path.join(CONTENT_DIR, categorySlug))) {
      const key = `${categorySlug}/${articleSlug}`;
      if (seen.has(key)) {
        fail(key, "duplicate article slug within this category");
        continue;
      }
      seen.add(key);

      const article = await readArticle(categorySlug, articleSlug);
      if (article) articles.push(article);
    }
  }

  if (problems.length > 0) {
    console.error("\n✖ Content build failed:\n");
    for (const problem of problems) console.error(`  • ${problem}`);
    console.error("");
    process.exit(1);
  }

  // Newest first.
  articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  // Split the rendered bodies out of the index. The list pages only ever need
  // titles and summaries, so keeping prose and chart data in separate chunks
  // stops the main bundle from growing with every article published.
  await rm(BODY_DIR, { recursive: true, force: true });
  await mkdir(BODY_DIR, { recursive: true });

  const index = [];
  for (const article of articles) {
    const versions = {};
    for (const lang of article.languages) {
      const { blocks, ...meta } = article.versions[lang];
      versions[lang] = meta;
      await writeFile(
        path.join(BODY_DIR, `${bodyKey(article.category, article.slug, lang)}.json`),
        `${JSON.stringify({ blocks })}\n`,
        "utf8",
      );
    }
    index.push({ ...article, versions });
  }

  await mkdir(path.dirname(INDEX_FILE), { recursive: true });
  await writeFile(INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`, "utf8");

  const counts = categories
    .map((c) => `${c.slug}: ${articles.filter((a) => a.category === c.slug).length}`)
    .join(", ");
  console.log(`✓ Content: ${articles.length} article(s) — ${counts}`);
}

await main();
