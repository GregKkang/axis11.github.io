// The daily publisher supplies standalone HTML, bypassing the React page.
// Apply site-owned layout after each content overlay so daily updates retain it.
import { readFile, writeFile } from "node:fs/promises";
const file = new URL("../dist/market-pulse/index.html", import.meta.url);
const style = `<style id="market-pulse-site-layout">
main { padding-top: 0; }
main > header { padding-top: 7.5rem; }
nav[aria-label="Main navigation"] { background-color: hsl(var(--navy-dark)); border-bottom: 0; }
@media (min-width: 768px) { main > header { padding-top: 9rem; } }
</style>`;
let html = await readFile(file, "utf8");
if (!html.includes('id="daily-update-title"') || !html.includes("</head>")) {
  throw new Error("Unexpected Market Pulse landing page structure");
}
html = html.replace(/<style id="market-pulse-site-layout">[\s\S]*?<\/style>/g, "");
await writeFile(file, html.replace("</head>", style + "</head>"));
