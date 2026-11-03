---
title: "Model and source notes"
---

## What Market Pulse measures

Market Pulse compares each day’s S&P 500 return with an estimate based on historical relationships between non-price news and same-session returns. It is a retrospective analytical tool, not a forecast of the next session or an estimate of fair value. A gap between the market and the model does not establish causation or prove overreaction or underreaction.

## The model

The baseline uses generative summaries of CNBC closing recaps, local BAAI/bge-small-en-v1.5 embeddings and Ridge regression with alpha fixed at 1. It was trained on 750 sessions in 2023–2025. The embedding and regression weights remain fixed for the six briefings dated October 26–November 2, 2026.

In the historical dataset, generative summaries were returned by Claude and checked against source quotations. Selected records received documented source-based edits. For October 30 and November 2, the briefing author applied the same generative-extraction instructions; these inputs were not new responses from the original Claude extractor. This difference in extraction provenance is also identified in those briefings.

Non-price facts, expectations and background are retained, including differences between company-wide and business-unit results. Realized security-price moves are excluded from the model text. Recap sections may discuss prices; those sections are separate from the displayed model input. The article itself was written after market moves, so removing price language does not eliminate all forms of hindsight bias. The source pages may also have been revised after publication.

## Returns and historical error bands

The regression estimates a log return. Published percentages use **100 × (exp(estimated log return) − 1)**. Actual index returns are calculated from consecutive trading-session closes. “Actual minus model” is the difference between simple returns, in percentage points.

All six briefings use the same reference set: 204 independently labeled 2026 evaluation days strictly before October 26. The six briefing sessions are excluded from band calibration. The absolute log-return errors are sorted, and the order statistic at ceil((n+1) × coverage) is used as a symmetric half-width before conversion to simple returns. The 80% and 95% bands describe historical reconstruction errors; they are not guaranteed coverage intervals or intraday trading ranges.

The reported frequency counts how often an absolute model error at least as large occurred in that reference set. It is not a p-value and does not compare only similar events. Differences can reflect missing news, offsetting developments, changing relationships and model error.

## Market data and timing

CNBC is the source for the closing recaps and reported company moves. Available closes were independently checked against [FRED’s S&P 500](https://fred.stlouisfed.org/series/SP500), [Dow](https://fred.stlouisfed.org/series/DJIA) and [Nasdaq Composite](https://fred.stlouisfed.org/series/NASDAQCOM) series. At the source snapshot used here, FRED’s S&P 500 series ran through October 30, its Dow series through November 2, and its Nasdaq series through October 29. Remaining closing levels come from CNBC and are identified in each briefing. Intraday quotes were not used as final closes.

The date attached to each briefing is the **U.S. trading session**, not the publication date. Scheduled after-close earnings are not treated as already known during the regular session. Prior-day policy announcements are distinguished from new releases where the article provides that timing information.

## Evidence and limits

The baseline explained about 5.83% of return variation in the available 207-day 2026 evaluation sample. Its explanatory power is limited and varies across periods. Although 2026 returns were not used to fit coefficients or choose alpha, the extraction process and design were revised after examining 2026 material. This is not a pristine, untouched final test.

Source-quotation checks confirm that quoted evidence exists, not that every summary is complete or every relationship is causal. Neither the historical extraction nor these briefings constitute an independent, exhaustive semantic audit. The model’s index-level residuals should not be interpreted as fair-value assessments of individual stocks.
