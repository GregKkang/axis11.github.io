// The daily publisher supplies standalone HTML, bypassing the React page.
// Apply site-owned layout after each content overlay so daily updates retain it.
import { readFile, writeFile } from "node:fs/promises";
const file = new URL("../dist/market-pulse/index.html", import.meta.url);
const style = `<style id="market-pulse-site-layout">
main.pt-16 { padding-top: 0; }
main > header.bg-navy-dark { padding-top: 7.5rem; }
nav[aria-label="Main navigation"] { background-color: hsl(var(--navy-dark)); border-bottom: 0; }
@media (min-width: 768px) { main > header.bg-navy-dark { padding-top: 9rem; } }
#market-pulse-explainer { margin-top: 1.5rem; }
#market-pulse-explainer a { color: hsl(var(--gold)); font-size: .875rem; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
#market-pulse-explainer a:hover { color: hsl(var(--gold-light)); }
#market-pulse-explainer p { margin-top: .5rem; font-size: .875rem; line-height: 1.625; color: hsl(var(--primary-foreground) / .6); }
</style>`;
let html = await readFile(file, "utf8");
if (!html.includes('id="daily-update-title"') || !html.includes("</head>")) {
  throw new Error("Unexpected Market Pulse landing page structure");
}
html = html.replace(/<style id="market-pulse-site-layout">[\s\S]*?<\/style>/g, "");
const explainer = "<div id=\"market-pulse-explainer\" class=\"mt-6\"><a href=\"https://axis11research.com/research/equities-bonds/news-explains-markets/\" class=\"text-sm font-semibold text-gold underline underline-offset-4\">How Market Pulse works <span aria-hidden=\"true\">→</span></a><p class=\"mt-2 text-sm leading-relaxed text-primary-foreground/60\">Read the research note behind the model and its daily readings.</p></div>";
html = html.replace(/<div id="market-pulse-explainer"[^>]*>[\s\S]*?<\/div>/g, "");
const introEnd = "Explore how the market narrative is changing and how it relates to observed returns.</p>";
if (!html.includes(introEnd)) throw new Error("Market Pulse introduction not found");
html = html.replace(introEnd, introEnd + explainer);
await writeFile(file, html.replace("</head>", style + "</head>"));
