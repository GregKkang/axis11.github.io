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

import { readFile, writeFile, readdir, mkdir, rm } from "node:fs/promises";
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
        } else {
          const n = Number(value);
          out[key] = value !== "" && Number.isFinite(n) ? n : value;
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

  return {
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
    series: spec.series.map((s) => ({
      key: s.key,
      label: s.label ?? s.key,
      // Optional explicit override; otherwise the component assigns from the palette.
      color: s.color ?? null,
    })),
    data,
  };
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
async function toBlocks(markdown, articleDir, where) {
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

  const html = md.render(placeholdered);

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

async function readVersion(articleDir, lang, where) {
  const file = path.join(articleDir, `${lang}.md`);
  if (!existsSync(file)) return null;

  const raw = await readFile(file, "utf8");
  const { data: fm, content } = matter(raw);

  if (!fm.title) {
    fail(`${where}/${lang}.md`, "frontmatter is missing `title`");
    return null;
  }
  if (fm.draft === true) return null;

  const blocks = await toBlocks(content, articleDir, `${where}/${lang}.md`);

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
    const version = await readVersion(articleDir, lang, where);
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
