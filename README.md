# Axis11 Research

Investment research and market commentary by Greg Kang, New Zealand.

Contact: greg.kkang@gmail.com

## Local development

Run `npm ci`, then `npm run dev`. Use `npm run build` for a production build.

## Publishing

GitHub Pages is configured to use GitHub Actions. Changes merged into `main` are built and published automatically at https://gregkkang.github.io/axis11.github.io/. Pull requests build without publishing.

## Writing an article

Articles are markdown files under `content/research/`. One folder per article:

```
content/research/<category>/<article-slug>/
    en.md            → /research/<category>/<article-slug>/
    ko.md            → /research/<category>/<article-slug>/ko/
    <name>.csv       chart data (optional)
    <name>.png       images (optional)
```

`<category>` must match a `slug` in `src/data/research.json` — currently
`global-macro`, `technology`, `equities-bonds`, `commodities`. `<article-slug>`
becomes the URL, so keep it short and stable.

Write one language or both. Whichever exists takes the article's base URL
(English first when both are present) and the other hangs off it as `/ko/`; the
language switch on the page appears only when there is something to switch to.

`content/research/global-macro/writing-for-axis11-research/` is a working
template covering every feature below — copy that folder to start a new piece.
It is marked `draft: true`, so it stays out of the build; set `draft: false` on
it temporarily if you want to see it rendered.

### Frontmatter

```yaml
---
title: "The NZ Inflation Turning Point"   # required
date: 2026-09-20                          # required, YYYY-MM-DD
summary: "One or two sentences."          # optional, shown in lists and previews
tags: [inflation, rbnz]                   # optional
hero: charts/cpi.png                      # optional
draft: false                              # optional, true keeps it unpublished
---
```

Only `title` and `date` are required. `date` sorts the article list, newest
first. If `summary` is omitted it is derived from the opening paragraph.

### Body

Standard markdown: headings, **bold**, lists, tables, block quotes, links
(external ones open in a new tab), and footnotes via `[^name]` / `[^name]:`.

### Charts

A fenced `chart` block renders as an interactive chart:

````markdown
```chart
{
  "type": "line",
  "title": "NZ CPI decomposition",
  "source": "Stats NZ",
  "x": "quarter",
  "format": "percent",
  "series": [
    { "key": "headline", "label": "Headline" },
    { "key": "nontradable", "label": "Non-tradable" }
  ],
  "data": [
    { "quarter": "2026Q1", "headline": 2.8, "nontradable": 4.1 },
    { "quarter": "2026Q2", "headline": 2.5, "nontradable": 3.8 }
  ]
}
```
````

| Field | Notes |
|---|---|
| `type` | `line`, `area`, or `bar` |
| `x` | the field used for the horizontal axis |
| `series` | up to four; `key` must be a field in the data |
| `data` | inline rows, **or** use `dataFile` |
| `dataFile` | a CSV beside the article; first row is the header |
| `format` | `percent` appends `%`; `number` is the default |
| `stacked` | `true` stacks an area or bar chart |
| `height` | plot height in pixels, default 320 |
| `title` / `subtitle` / `source` / `xLabel` / `yLabel` | optional labelling |

Colours come from a four-slot palette checked so that every pair stays
distinguishable under colour-vision deficiency. That is why a chart is capped at
four series — for more, split the chart or group the tail into a single "Other"
series. Every chart also ships a "Show data" table, so the numbers are reachable
without relying on colour or hover.

### Publishing a piece

Commit the folder to `main` and push. The build fails with a specific message if
frontmatter is missing, a category slug is wrong, a chart references a column
that is not in its data, or a chart declares more than four series — so a broken
article cannot reach the site.

## How the build works

```
npm run build
  ├─ scripts/build-content.mjs        markdown → src/data/articles.json
  │                                   (index) + src/data/articles/*.json (bodies)
  ├─ vite build                       → dist/
  └─ scripts/build-research-pages.mjs static shells for every category and
                                      article URL, plus sitemap.xml and rss.xml
```

`src/data/articles.json` and `src/data/articles/` are generated and git-ignored;
`npm run dev`, `build`, `lint`, and `test` all regenerate them first.

GitHub Pages has no server-side routing, so every URL needs a real `index.html`.
`build-research-pages.mjs` writes one per page with that page's own title,
description, canonical URL, Open Graph tags, and `hreflang` links, and the
deploy workflow copies `index.html` to `404.html` as the fallback for anything
else.

Set `SITE_URL` when moving to a custom domain — it feeds the canonical URLs,
sitemap, and RSS feed.

## Homepage article list and local sync

The homepage lists all published articles, newest first, with area, tag and text filters.
`tags` in an article's frontmatter are shown automatically; no manual list needs updating.
Keep existing `content/research/<category>/<article>/` folders and URLs unchanged.
Category pages and existing article links remain available.

After web changes, select this repository and `main` in GitHub Desktop, click
**Fetch origin**, then **Pull origin** when offered. This updates the existing local
folder automatically. Commit or stash any local changes first if Desktop reports a conflict.

### Source notes and chart captions

Use `[^name]` and `[^name]:` for numbered footnotes. For an unnumbered source list,
wrap the markdown in `<section class="article-notes">` and `</section>`, with blank
lines after the opening tag and before the closing tag. An italic paragraph directly
after a chart block is styled as a figure note, matching image captions.
