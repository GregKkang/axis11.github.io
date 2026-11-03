import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "content", "market-pulse");
const bodyDir = path.join(root, "src", "data", "market-pulse");
await mkdir(bodyDir, { recursive: true });
const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
const originalLink = md.renderer.rules.link_open || ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = tokens[idx].attrGet("href") || "";
  if (/^https?:\/\//i.test(href)) {
    tokens[idx].attrSet("target", "_blank");
    tokens[idx].attrSet("rel", "noopener noreferrer");
  }
  return originalLink(tokens, idx, options, env, self);
};
const posts = [];
for (const name of (await readdir(sourceDir)).filter((name) => name.endsWith(".md"))) {
  const { data, content } = matter(await readFile(path.join(sourceDir, name), "utf8"));
  const slug = name.slice(0, -3);
  if (!data.title) throw new Error(`${name}: missing title`);
  const html = md.render(content).replace(/<table>([\s\S]*?)<\/table>/g, '<div class="table-scroll" tabindex="0" role="region" aria-label="Market data table"><table>$1</table></div>');
  await writeFile(path.join(bodyDir, `${slug}.json`), JSON.stringify({ html }) + "\n");
  if (slug === "method") continue;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slug) || data.date !== slug) throw new Error(`${name}: invalid trading date`);
  for (const key of ["actualReturn", "modelReturn", "gap"]) if (typeof data[key] !== "number" || !Number.isFinite(data[key])) throw new Error(`${name}: invalid ${key}`);
  if (Math.abs(data.actualReturn - data.modelReturn - data.gap) > 1e-9) throw new Error(`${name}: inconsistent return gap`);
  if (!data.summary || !data.publishedAt || Number.isNaN(Date.parse(data.publishedAt))) throw new Error(`${name}: missing summary/publication timestamp`);
  posts.push({ date: slug, title: String(data.title), summary: String(data.summary), publishedAt: String(data.publishedAt), actualReturn: data.actualReturn, modelReturn: data.modelReturn, gap: data.gap, readingMinutes: Math.max(1, Math.round(content.replace(/```[\s\S]*?```/g, " ").split(/\s+/).length / 220)) });
}
posts.sort((a, b) => b.date.localeCompare(a.date));
if (new Set(posts.map((p) => p.date)).size !== posts.length) throw new Error("Duplicate Market Pulse trading date");
await writeFile(path.join(root, "src", "data", "market-pulse.json"), JSON.stringify(posts, null, 2) + "\n");
console.log(`✓ Market Pulse: ${posts.length} daily briefing(s)`);
