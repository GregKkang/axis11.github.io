---
title: "Can Machine Learning Forecast the US 10-Year Yield?"
date: 2026-10-08
summary: "A machine-learning model showed modest promise in development but failed to beat a simple benchmark in its final test. The experiment raises a further question: how much history does a model need when interest-rate regimes can last for decades?"
tags: [machine-learning, us-treasuries, rates, research-methods]
draft: false
---

*Testing whether relationships in past data can help forecast the next move in yields*

A reliable forecast of the US 10-year yield would be useful well beyond the bond market. It could inform duration, equity valuations and asset allocation. The difficulty is turning an economic explanation of yields into a forecast that works before the move happens.

This experiment tested whether machine learning could help. Starting with FRED and ALFRED data, I compared models, input transformations and forecast targets, then added information from bond volatility, equities, credit and gold. The strongest candidate was selected during development and tested on the most recent period under rules recorded in advance.

**The improvement seen in development did not carry into the final test.** The model's probability forecasts were slightly worse than a benchmark based on the historical frequency of the event. Its apparently strong 67.9% hit rate also fell short of simply predicting the more common outcome every week.

The result gives AXIS11 no basis for using this model to set duration or position size. It does, however, leave a useful research framework and an unresolved question. Interest-rate trends can last for decades. If most of the training history belongs to a long decline in yields, how well can a model adapt when that environment changes?

## 1. The experiment

The original question was whether the 10-year yield would rise over the next 21 trading days. During development, the study also examined 5-day and 63-day horizons, a decline of at least 10bp over 21 days, and a negative approximate bond excess return. The final model therefore emerged from a comparison of several candidates rather than from a single specification chosen at the outset.

The inputs expanded in three stages:

1. **Market data:** yield momentum, the yield curve, rate volatility, credit spreads, VIX and oil.
2. **Macroeconomic data:** inflation, employment, unemployment and jobless claims.
3. **Additional data:** MOVE, the S&P 500, investment-grade and high-yield option-adjusted spreads (OAS), gold and an economic surprise index.

The economic surprise index and the macroeconomic block were tested during development but excluded from the final primary model.

The study compared logistic regression, Random Forest and XGBoost, using different representations of the inputs, including historical ranks and standard scores. A rank expresses a reading's position within its own historical distribution. This puts variables measured in different units on a common scale and reduces the influence of extreme observations; it does not add information.

The primary model was **L2-regularised logistic regression with rank-transformed inputs**. It used 23 market variables and 10 additional variables to estimate **the probability that the 10-year yield would fall by at least 10bp over the next 21 trading days**.

| Item | Final test design |
|---|---|
| Forecast timing | Close of the last bond-market trading day of each week |
| Primary target | A decline of at least 10bp in the 10-year yield over the next 21 trading days |
| Model | Rank transformation fitted to training data + L2 logistic regression |
| Inputs | 23 market variables + 10 additional variables |
| Baseline | Event frequency in the training window |
| Forecast dates | 1 September 2023 – 21 August 2026 |
| Sample | 156 weekly forecasts with overlapping outcome windows |
| Refits | At the start of the test and on the first forecast date of each subsequent year |

The ten additional variables were constructed as follows:

| Indicator | Inputs | Number |
|---|---|---:|
| MOVE | Log level; 21-day change; log ratio to 10-year realised volatility | 3 |
| S&P 500 | 21-day log return; drawdown from the 252-day high | 2 |
| Investment-grade OAS | 21-day and 63-day changes | 2 |
| Gold | 21-day log return | 1 |
| High-yield OAS | 21-day and 63-day changes | 2 |
| **Total** | | **10** |

*MOVE and 10-year realised volatility measure different instruments and use different constructions. Their ratio is a proxy for the relative volatility environment.*

At each refit, the model used only observations whose outcomes were already known. Once outcomes from the early test period became available, they could enter the next year's training set under the refit procedure specified in advance. This was a historical simulation of sequential forecasting, not a live track record.

## 2. A modest development gain disappeared in the final test

The selected model looked promising during development. Across 973 weekly forecasts from January 2005 to August 2023, it achieved an AUC of 0.592 and reduced the Brier error by 2.71% relative to the historical-frequency baseline. It improved on that baseline in 17 of 19 calendar years.

The evidence was still tentative. The candidate had been selected after comparing models, inputs and targets, and the block-bootstrap confidence interval for its Brier improvement included zero. The final test was intended to establish whether the apparent gain would persist.

| Metric | Development period | Final test |
|---|---:|---:|
| Weekly forecasts | 973 | 156 |
| Model Brier score | 0.2166 | 0.2196 |
| Baseline Brier score | 0.2226 | 0.2175 |
| Brier skill vs baseline | +2.71% | −0.95% |
| AUC | 0.592 | 0.479 |

*Lower Brier scores indicate smaller probability errors. Brier skill is `1 − model Brier / baseline Brier`; a positive value means the model beats the baseline. AUC measures how well the model ranks cases in which the event occurs above those in which it does not. An AUC of 0.5 indicates no ranking ability. Since event frequency affects Brier scores, each period is assessed against its own baseline. Reported scores are rounded.*

![AUC and Brier skill in development and the final test](axis11_ml_development_final.png)

*Figure 1. Whiskers show 95% block-bootstrap confidence intervals. Higher values are better on both measures. Source: AXIS11 analysis.*

Under the decision rule recorded before evaluation, the final result was `AGAINST`: Brier skill was negative and AUC was below 0.5. The estimates were also imprecise. The 95% interval for Brier skill ranged from approximately **−7.80% to +5.04%**, and the AUC interval from **0.325 to 0.627**.

Those intervals do not establish that the model is statistically worse than the benchmark. They show that the final test failed to demonstrate an improvement.

The sample is smaller than the forecast count might suggest. A forecast made this Friday and another made next Friday both look roughly a month ahead, so much of their outcome periods overlaps. A single sharp move can determine the outcome of several forecasts. **The 156 weekly forecasts are therefore not 156 independent experiments.** The block bootstrap accounts for this time dependence when estimating uncertainty.

## 3. Why a 67.9% hit rate was not an edge

The primary model was correct in 67.9% of the final test cases. That number looks attractive until it is compared with the frequency of the event.

The yield fell by at least 10bp in only 49 of the 156 cases, or **31.4%**. In the other 107 cases, it did not. Predicting “no decline of at least 10bp” every week would therefore have achieved **68.6% accuracy**. That prediction includes rising yields, unchanged yields and declines smaller than 10bp.

| Approach | Correct forecasts | Hit rate |
|---|---:|---:|
| Always predict no decline of at least 10bp | 107/156 | 68.6% |
| Primary model at a 50% probability threshold | 106/156 | 67.9% |

The model assigned a probability above 50% to the event only once, and the event did not occur on that occasion. Its high hit rate largely reflected the prevalence of the other outcome.

A [report of an HSBC model with 65% accuracy](https://www.marketwatch.com/story/what-this-machine-learning-model-with-65-accuracy-says-is-coming-next-for-the-10-year-treasury-55d76b8f) helped motivate this study. The comparison here shows why a headline accuracy figure is insufficient: the target, sample and baseline all matter. Accuracy on different forecasting problems cannot be compared directly.

The probability estimates also failed to rank outcomes consistently. When forecasts were divided into five groups from lowest to highest predicted probability, the observed event rates were **28.1%, 38.7%, 45.2%, 9.7% and 35.5%**. The highest-probability group had more events than the lowest, but the middle groups broke the expected pattern.

![Mean predicted probability and observed event rate by probability quintile](axis11_ml_probability_quintiles.png)

*Figure 2. Q1 contains the lowest predicted probabilities and Q5 the highest. A useful ranking would generally show event rates increasing across the groups. These groups were constructed after evaluation as a diagnostic, not as a trading rule. Source: AXIS11 analysis.*

The secondary target closest to the original question—whether the yield would be higher after 21 trading days—also produced weak results: **AUC of 0.449 and a hit rate of 41.0%**.

## 4. Additional data did not deliver a durable improvement

On the same final test dates, the rank model using only market variables produced an AUC of **0.543** and Brier skill of **+0.49%**. It performed better than the primary model, but the improvement over the baseline was small and uncertain. Selecting it now because it looks better in the opened test period would not establish an independently validated replacement.

The primary model's Brier error was about **1.45% higher** than that of the market-only model; this difference was not statistically clear either. A secondary specification that converted ranks into normal scores also failed to establish an improvement, with AUC of **0.474** and Brier skill of **−0.46%**.

The annual results were uneven. Primary-model Brier skill was **+5.94%** in the 2023 portion of the test, **+5.18%** in 2024, **−10.47%** in 2025 and **+0.68%** in the 2026 portion. The 2023 and 2026 observations cover partial years.

The conclusion is limited to this forecasting task: adding these variables and refining their transformation did not produce a gain that survived the final test. It does not follow that the data have no economic value or would be unhelpful for every other target.

## 5. Did the model learn the wrong interest-rate environment?

A possible explanation is the mismatch between the long-term environment represented in the training data and the environment encountered later.

US long-term yields declined over several decades from the 1980s. After Covid, inflation and monetary tightening pushed yields sharply away from the low-rate conditions of the preceding years. [Federal Reserve research](https://www.federalreserve.gov/econres/feds/why-have-long-term-treasury-yields-fallen-since-the-1980s-expected-short-rates-and-term-premiums-in-quasi-real-time.htm) examines the expected-rate and term-premium components of that earlier decline. Whether it has ended permanently remains an open question.

The final model's training history begins in 1994. It includes several tightening cycles, but no comparable stretch of the rising, high-inflation environment that preceded the 1980s. A model can therefore have many observations while drawing most of its experience from one broad secular regime.

This matters if the relationships between the inputs and future yield changes have shifted. Patterns learned during a long decline may carry less information in an environment of persistently higher rates or renewed upward pressure.

The distinction between the **level of yields** and the **frequency of short-term increases** is essential, however. Across the entire final test, yields rose over the following 21 trading days in **49.4%** of cases—hardly a uniformly rising market. In the 2026 portion, that share increased to **67.6%**. The primary event, a decline of at least 10bp, occurred in **31.4%** of cases across the full test and **17.6%** in the 2026 portion.

The 2026 figures are consistent with an environment in which increases were more frequent and sizeable declines rarer. They do not establish that a regime change caused the model's failure. Its worst relative performance came in 2025, while its Brier skill was slightly positive in 2026. The training window, refit procedure and model specification could also have contributed.

**Regime change is a hypothesis to test, rather than a conclusion established by this experiment.**

### Why use the latest period if its regime may be different?

The latest period was chosen because the practical question is whether information from the past helps forecast what follows. At the time of an investment decision, we do not know whether historical relationships will persist.

A changed environment may explain why a model struggles, but it is also part of the task the model must handle. Removing the recent period because it differs from the training history would avoid the very question the final test was designed to answer.

### Would a longer history help?

It might. Extending the sample into the rising-rate and high-inflation environment of the 1960s to 1980s could expose a model to a wider range of regimes and transitions. For yields, the relevant measure of historical breadth may be the variety of regimes represented, rather than the number of weekly observations alone.

Older data also introduce problems. Monetary policy frameworks, market structure and the interpretation of economic indicators have changed. Many of the current inputs cannot be extended back several decades with consistent definitions and publication timings. A longer yield series alone would not allow the present 33-variable model to be trained over that entire history.

One useful comparison would be between a simpler model trained across several regimes using a small set of consistently available variables and a model that places more weight on recent observations. The former gains historical variety; the latter may adapt faster when old relationships lose relevance.

Neither approach is necessarily superior. **Whether a broader history improves forecasting more than faster adaptation is a question for the next experiment.**

## 6. What AXIS11 can use from the study

The current forecast is not sufficiently supported for investment use. The procedures developed to test it are useful now, particularly for assessing research hypotheses and the value of additional data.

For example, AXIS11 can ask whether changes in credit spreads add information beyond the yield curve and momentum, or whether employment data improve a forecast already based on market prices. Comparing models with and without those inputs on identical forecast dates provides a direct test of incremental predictive value. It does not establish causality, but it can inform data purchases and research priorities.

The rank-transformed variables also provide a consistent way to describe market conditions. Statements such as “yields have risen quickly while credit spreads remain calm” can be checked against each variable's historical distribution. These summaries could support a search for comparable past episodes, although the selection rule would need separate validation before subsequent outcomes were used as forecasts. A useful description of today's market does not itself establish predictive power.

The evaluation framework can also be applied to analyst judgement. Recording the event, horizon and probability before the outcome allows AXIS11 to assess probability errors, calibration and performance against a simple benchmark. This study's 67.9% hit rate is a reminder that apparently good accuracy can conceal little added information. Until its forecasting value is established, the model's probabilities will not be used to set position size or mechanically combined with analyst estimates.

Other targets remain worth testing: the size of yield moves, the risk of a large rise in yields, or relative equity returns. Each requires an appropriate benchmark and its own out-of-sample evaluation. Volatility forecasts should be tested against a simple realised-volatility model; equity rankings should be assessed for value beyond existing factors and for stability across periods.

| Application | Current assessment |
|---|---|
| Testing the incremental value of a hypothesis or data block | Evaluation procedures available for use |
| Describing variables relative to their history; recording forecast errors | Available for research and review |
| Clustering market states or finding historical analogues | Possible follow-up work; predictive value untested |
| Forecasting move size, loss risk or relative equity returns | Requires a separate design, benchmark and final test |
| Setting duration or position size from the current model | Insufficient evidence for adoption |

## 7. Conclusion

This experiment did not establish a reliable forecast for the US 10-year yield. A modest development gain disappeared in the final test, and the high hit rate failed to beat the simplest classification benchmark.

The result also leaves the role of history unresolved. A model trained largely within a multi-decade decline in yields may struggle when that environment changes. But this study has not isolated that explanation from the effects of the training window, refit procedure or model design. A longer history could help by adding different rate regimes; giving older observations less weight could prove more useful.

AXIS11 will retain the research framework while leaving the forecasting model out of allocation decisions. The next step is to test those competing explanations under rules fixed before evaluation.

The current final test has now been examined and cannot provide an independent verdict on a revised model. It becomes part of the development record. Any follow-up should specify its changes and success criteria in advance, address the remaining data-timing issues, and be evaluated on observations that arrive subsequently.

---

## Scope and limitations

Data processing, model construction, validation and charts were produced by AXIS11. The results are an out-of-sample simulation on historical data, not realised investment returns. The last forecast date was 21 August 2026; its outcome was measured using the following 21 trading days. The study assessed forecast accuracy and probability errors, not profitability after transaction costs.

Confidence intervals use a block bootstrap to account for overlapping outcome windows. Both the number of candidates explored during development and the limited final-test sample affect the strength of the evidence. The final-test probabilities and principal performance figures were reproduced from the same code and data.

Two timing issues remain to be corrected: the publication lag of the effective federal funds rate, and outcome windows for some late development-period forecasts that extend beyond the start of the final test. These qualifications mean the study should not be treated as a fully resolved real-time investment validation. Both should be addressed before evaluating a revised model on new data.
