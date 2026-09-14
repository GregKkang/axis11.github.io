---
title: "Writing for Axis11 Research"
date: 2026-09-14
summary: "A working template for Axis11 articles — frontmatter fields, formatting, footnotes, and interactive charts."
tags: [template, how-to]
draft: true
---

This article is a template. Copy its folder, rename it, and replace the text.
Everything below shows a feature the pipeline supports, so you can see what
renders and how.

## Frontmatter

The block at the top of the file, between the `---` lines, carries the
article's metadata:

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Shown as the headline and in the browser tab |
| `date` | yes | `YYYY-MM-DD`. Sorts the article list, newest first |
| `summary` | no | Used on the category page and in link previews. Auto-derived from the opening paragraph if omitted |
| `tags` | no | A list, e.g. `[inflation, rbnz]` |
| `hero` | no | Image filename sitting next to this file |
| `draft` | no | `true` keeps the article out of the build |

Only `title` and `date` are mandatory. The build fails with a clear message if
either is missing, so a typo can never publish a half-finished page.

## Formatting

Standard markdown works throughout — **bold**, *italic*, `inline code`, and
[links](https://www.rbnz.govt.nz){target=_blank}. External links open in a new
tab automatically.

> Block quotes are useful for pulling out a central bank statement or a line
> from a company filing.

Footnotes keep sourcing out of the way of the prose[^method] without
interrupting the reader.

Tables are written in plain markdown:

| Quarter | Headline | Non-tradable |
|---|---|---|
| 2026Q1 | 2.8 | 4.1 |
| 2026Q2 | 2.5 | 3.8 |
| 2026Q3 | 2.3 | 3.5 |

## Charts

A fenced `chart` block becomes an interactive chart — hover for values, and the
legend, axes, and colours follow the Axis11 palette automatically.

```chart
{
  "type": "line",
  "title": "Illustrative series",
  "subtitle": "Sample data for demonstration — replace before publishing",
  "source": "Axis11 (illustrative)",
  "x": "quarter",
  "format": "percent",
  "yLabel": "Annual change",
  "series": [
    { "key": "headline", "label": "Headline" },
    { "key": "nontradable", "label": "Non-tradable" }
  ],
  "data": [
    { "quarter": "2025Q1", "headline": 4.0, "nontradable": 5.8 },
    { "quarter": "2025Q2", "headline": 3.6, "nontradable": 5.4 },
    { "quarter": "2025Q3", "headline": 3.3, "nontradable": 5.0 },
    { "quarter": "2025Q4", "headline": 3.0, "nontradable": 4.6 },
    { "quarter": "2026Q1", "headline": 2.8, "nontradable": 4.1 },
    { "quarter": "2026Q2", "headline": 2.5, "nontradable": 3.8 },
    { "quarter": "2026Q3", "headline": 2.3, "nontradable": 3.5 }
  ]
}
```

For a longer series, keep the numbers in a CSV next to the article and point
`dataFile` at it instead of pasting a `data` array. The first row is the header,
and column names become the `x` and `series` keys:

```chart
{
  "type": "bar",
  "title": "Loading data from a CSV",
  "subtitle": "Same chart syntax, numbers held in sample-data.csv",
  "source": "Axis11 (illustrative)",
  "x": "sector",
  "dataFile": "sample-data.csv",
  "format": "percent",
  "series": [{ "key": "contribution", "label": "Contribution to growth" }]
}
```

Set `"type"` to `line`, `area`, or `bar`. Add `"stacked": true` to stack an area
or bar chart, and `"height"` to make a chart taller than the 320px default.

## Publishing

Commit the folder to `main` and push. GitHub Actions builds and deploys, and the
article appears on its category page within a couple of minutes. Set
`draft: true` while the piece is still in progress — it stays in the repository
but never reaches the site.

[^method]: Footnotes are numbered automatically and collected at the bottom of the article.
