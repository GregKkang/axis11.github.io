---
title: "Can an LLM Really Discover a New Factor? (1)"
date: 2026-09-28
summary: "A recent paper asks whether an LLM can generate investment factors without seeing historical returns. The results are intriguing, but the strongest factors tell only part of the story. This note looks at what the experiment actually shows and how AXIS11 plans to test the same idea in equities."
tags: [ai, llm, factors, options, research]
draft: false
---

*From AI-generated investment hypotheses to an AXIS11 equity experiment*

I have been trying to understand where AI might genuinely add value to investment research. Organising information and writing code are already useful applications, but they are largely about doing existing work faster. The more interesting question is whether an LLM can contribute to the investment process itself: can it generate an idea that is worth testing?

That is what makes *Option Return Predictability via Large Language Models*, by Yanchu Liu, Heyang Zhou, Yuhan Cheng, Jie Zou and Tianyi Wang, interesting.

The experiment is unusual. The LLM is not given historical returns and asked to find the combination that fits them best. Instead, it is told what a set of option-market variables means and asked to construct investment factors from that knowledge. Those formulas are then taken to real market data and backtested.

Some of the reported results are exceptionally strong. Others fail badly. That contrast is important because the real question is not whether an LLM can produce one impressive backtest. It is whether this process can generate useful investment hypotheses consistently enough to matter.

This note looks at how the experiment works, what the results actually show, and how AXIS11 plans to apply the same idea to equities. The performance figures below are taken from the paper unless stated otherwise; I have not reproduced the strategies from raw data.

---

## 1. The LLM Generates the Hypothesis, Not the Backtest Result

The cleanest way to understand the paper is to separate **factor generation** from **factor testing**.

The researchers first define the information available to the model. For the US option experiment, that includes bid and ask prices, volume, open interest, implied volatility, delta, gamma, vega, theta, strike, time to expiry and the underlying price.

The LLM is then asked to combine those variables into a factor with an economic rationale and executable code.

| Role | What it does |
|---|---|
| Researchers | Define the variables, constraints and validation framework |
| LLM | Proposes the factor, formula, economic rationale and code |
| Backtest | Applies the formula to market data and measures performance |
| Evaluation | Tests whether the resulting signal adds useful information |

This distinction matters. The LLM is not watching the market and deciding what to trade each day. Nor, in the main experiment, is it repeatedly modifying a formula because the backtest was disappointing.

It is closer to asking an analyst:

**Here are the variables you are allowed to use. Based on what you know about markets, propose a relationship that might predict option returns.**

The resulting formula is therefore a hypothesis. The backtest determines whether the hypothesis survives contact with the data.

---

## 2. What "Data-Free Generation" Actually Means

The authors call this process **data-free factor generation**.

The phrase can be misleading. It does not mean that the investment strategy requires no data. Real option data are obviously needed to calculate the factor and test subsequent returns.

What is data-free is the **generation of the hypothesis**.

The LLM does not see the historical relationship between candidate variables and future option returns before writing the formula. Instead, it works from the meaning of the variables and the financial knowledge embedded in the model.

For example, the model knows that:

| Variable | Economic meaning |
|---|---|
| Bid-ask spread | Trading friction and liquidity |
| Volume | Current trading activity |
| Open interest | Outstanding positions |
| Implied volatility | Volatility priced into the option |
| Delta | Sensitivity to the underlying price |
| Gamma | Sensitivity of delta to the underlying |
| Vega | Sensitivity to implied volatility |
| Theta | Exposure to the passage of time |
| Strike and maturity | Contract structure |

The prompt encourages the model to look for relationships grounded in market microstructure, behavioural finance and non-linear interactions rather than simply recycling a familiar variable such as the level of implied volatility.

That might lead to a hypothesis such as: an unusual increase in volatility could mean something different when it occurs in a liquid, actively traded contract than when it occurs in an illiquid contract with substantial gamma exposure.

The LLM's job is to turn that intuition into a precise formula.

This is different from conventional statistical search. A regression or machine-learning model can search historical data for combinations associated with future returns. Here, the economic idea comes first and the historical test comes afterwards.

There is an important qualification, however. The LLM itself has been trained on financial knowledge and literature. The researchers also decide which variables are available and how the task is framed. "Data-free" therefore does not mean free from prior knowledge or researcher influence. It means that the factor is generated without directly fitting the formula to the return history used in the backtest.

---

## 3. From an Idea to Executable Code

The process is largely automated.

For each candidate factor, the LLM produces a name, a mathematical expression, an economic explanation and Python code. The code is executed; coding errors can be fed back and corrected before the factor is retained.

The authors also perform a look-ahead test.

Suppose a signal has been calculated using information available through June. The data from July onwards are then randomly changed and the June signal is calculated again. If the June value changes, the formula must have depended on information from the future.

It is a practical way to catch a common implementation error in automatically generated code.

Passing that test does not establish that every aspect of the backtest is free of bias. Data publication timing, execution assumptions, candidate selection and other design choices still matter. But it addresses a particularly important risk when code itself is being generated automatically.

There is also a broader methodological distinction worth keeping in mind.

One could instead show an LLM historical factor values **and** subsequent returns and ask it to discover the best combination. That may also be useful, but it becomes a conventional data-fitting problem and requires strict separation between training, validation and final out-of-sample testing.

That is not the main experiment here. The central question in this paper is narrower:

**Can the financial knowledge already embedded in an LLM be converted into investment hypotheses that subsequently work in real data?**

---

## 4. How the Factors Are Tested

The paper studies major US index options and Chinese equity-index ETF options.

| | United States | China |
|---|---|---|
| Full analysis period | 1 Jan 2015 – 30 Sep 2025 | 1 Jan 2020 – 30 Sep 2025 |
| Out-of-sample period | 30 Sep 2024 – 30 Sep 2025 | 30 Sep 2024 – 30 Sep 2025 |
| Frequency | Daily | Daily |
| Candidates in main results tables | 40 | 40 |

The prompts and available data are adjusted to each market, so the US and Chinese experiments do not amount to taking the same formula from one market and successfully applying it to another. The more accurate interpretation is that the **same factor-generation process** is applied independently in two markets.

The sample is also filtered. Contracts must have valid prices, volume and open interest; moneyness is restricted to 0.8–1.2; extreme embedded leverage is winsorised; and contracts at expiry are excluded.

Once a factor has been calculated, options are ranked by their scores. The authors examine both a long-only portfolio holding the top 10% and a long-short portfolio that buys the top 10% and sells the bottom 10%, with positions rebalanced daily.

### Why delta-hedged returns matter

The paper evaluates the factors using **delta-hedged option returns**.

That is important because otherwise a factor might appear to predict option returns simply because it happened to select options whose underlying assets subsequently moved in the right direction.

If a call has a delta of 0.5, for example, part of its directional exposure can be offset by selling the corresponding amount of the underlying. The remaining return gives a cleaner measure of whether the signal captured something about option pricing rather than simply predicting the direction of the index.

### The IPCA benchmark

The main statistical benchmark is a five-factor **Instrumented Principal Component Analysis, or IPCA, model**.

IPCA uses the same underlying characteristics available to the LLM but estimates their relationship with returns statistically. It extracts common latent factors and estimates how individual options load on them.

That creates a useful comparison.

The LLM begins with economic meaning and constructs a formula. IPCA begins with the data and estimates statistical relationships.

The authors then ask whether returns generated by the LLM factors contain alpha that the IPCA model cannot explain.

That is a meaningful test, but it should be interpreted narrowly. It shows whether the LLM-generated factors contain information beyond this particular statistical benchmark. It does not establish that they outperform every existing option strategy or factor model.

---

## 5. What an LLM-Generated Factor Actually Looks Like

One representative US factor is **Anchored Gamma Friction Shock (AGFS)**:

$$
\begin{aligned}
\text{AGFS}_t = {} &
\frac{\text{IV}_t-\mu^{(N)}_{t-1}(\text{IV})}{\sigma^{(N)}_{t-1}(\text{IV})+\varepsilon}
\times
\frac{\text{Ask}_t-\text{Bid}_t}{(\text{Ask}_t+\text{Bid}_t)/2+\varepsilon}
\\
& \times
\tanh\!\left(\frac{\Gamma_t S_t^2}{\text{Vega}_t+\varepsilon}\right)
\times e^{-\lambda T_t}
\times
\tanh\!\left(\frac{\text{Volume}_t}{\text{OI}_t+1}\right)
\end{aligned}
$$

Here, $S$ is the underlying price, $T$ is time to expiry, $\varepsilon$ prevents division by values close to zero, and $N$ determines the historical window used to normalise implied volatility.

Rather than treating implied volatility, liquidity or gamma independently, AGFS asks when they occur **together**.

| Component | What it captures |
|---|---|
| IV relative to its recent history | Whether current volatility is unusually high or low |
| Relative bid-ask spread | Trading friction |
| Gamma relative to vega | Interaction between underlying-price and volatility sensitivity |
| $e^{-\lambda T}$ | Greater weight on shorter maturities |
| Volume relative to OI | Trading activity relative to existing positions |

The $\tanh$ transformation prevents an extreme observation in one input from allowing that term to grow without bound.

The economic story offered by the paper is that an unusual volatility move may be more informative when it coincides with poor liquidity, strong sensitivity to hedging and concentrated trading activity. Under those conditions, temporary pricing pressure may be more likely to reverse.

That is exactly the kind of conditional relationship that makes the experiment interesting. None of the inputs is new. The potential contribution lies in **how familiar pieces of information are combined**.

But an interpretable formula should not be confused with an identified economic mechanism.

Volume, open interest and option Greeks do not tell us the direction of dealers' actual inventories or hedging trades. And saying that an option is vulnerable to a price adjustment is not by itself enough to establish the direction of the subsequent delta-hedged return.

The formula generates a testable hypothesis. The economic explanation remains a hypothesis as well.

The Chinese experiment provides another example, **GammaOIPressure**:

$$
\begin{aligned}
\text{GammaOIPressure}_t = {} &
-\frac{\text{High}_t-\text{Low}_t}{\text{Amount}_t+\varepsilon}
\times
\tanh\!\left(\frac{\text{OI}_t-\text{OI}_{t-1}}{\text{Volume}_t+1}\right)
\times \tanh(\Delta_t)
\\
& \times
\frac{\ln(1+S_t^2|\Gamma_t|)}{\sqrt{1+|\Theta_t|}}
\times
\frac{1}{\sqrt{1+T_t}}
\end{aligned}
$$

This factor combines the day's price range relative to turnover with changes in open interest, delta, gamma, theta and maturity.

Again, the proposed mechanism is temporary price pressure followed by mean reversion. The point is not that any individual input is novel, but that the model has assembled them into a conditional, computable hypothesis.

---

## 6. The Best Results Are Impressive. The Distribution Is More Complicated.

Some individual factors produce extraordinary results.

| Market and factor | Full-period annualised return | Full-period Sharpe | OOS annualised return | OOS Sharpe |
|---|---:|---:|---:|---:|
| US AGFS | 140.14% | 6.13 | 120.93% | 7.11 |
| US Anchored Vega Spread Pressure | 108.73% | 4.77 | −14.71% | −0.56 |
| US GammaLiquidityStress | 146.61% | 5.47 | −95.59% | −3.76 |
| US HedgeFlow | 40.67% | 2.94 | 32.85% | 4.59 |
| China GammaOIPressure | 124.00% | 3.10 | 66.26% | 4.12 |
| China ReflexGamma10 | 85.06% | 2.57 | 27.13% | 3.55 |

AGFS is the obvious headline result: a full-period Sharpe ratio of 6.13 and an out-of-sample Sharpe of 7.11.

But the neighbouring rows show why looking only at the strongest factor would be misleading.

Anchored Vega Spread Pressure goes from a 108.73% annualised return over the full period to −14.71% out of sample. GammaLiquidityStress deteriorates from +146.61% to −95.59%.

Drawdowns can also be severe. AGFS records a maximum drawdown of −45.28% over the full period, while GammaLiquidityStress reaches −99.52%.

These figures make the construction of the return series, capital employed and leverage economically important. A very high annualised return does not tell us by itself what a deployable portfolio would have looked like.

The authors report that **26 of 40 US factors and 32 of 40 Chinese factors generate positive and statistically significant alpha relative to IPCA**.

That is an important result, but it is not the same as saying that 26 and 32 strategies respectively had attractive standalone performance. Alpha measures what remains unexplained by the benchmark. Sharpe measures the return relative to the volatility of the strategy itself.

To see the broader distribution, I re-counted the 40 candidates reported in the paper's tables.

| Market and period | Positive annualised return | Positive Sharpe ratio | Median Sharpe |
|---|---:|---:|---:|
| US, full period | 22/40 | 16/40 | −0.17 |
| US, out of sample | 27/40 | 20/40 | 0.10 |
| China, full period | 37/40 | 39/40 | 1.09 |
| China, out of sample | 38/40 | 31/40 | 1.63 |

*Re-counted from Tables 1, 2, 4 and 5 of the paper. These are calculations from the reported table entries, not a reproduction of the backtest from raw returns.*

This gives a more useful picture of the experiment.

The US results are highly uneven. A handful of factors are exceptional, but the median candidate is much less impressive. China looks substantially broader: positive performance appears across a much larger share of the reported candidates.

That distinction matters for how I would judge an AI factor-generation system.

Finding one spectacular formula is interesting. Generating a distribution of useful formulas repeatedly would be much more valuable.

---

## 7. The Model Settings Matter Too

One of the more useful parts of the paper is that the authors do not treat "the LLM" as a single fixed research process. They vary reasoning effort, model and temperature.

### Reasoning effort

The main GPT-5 experiment uses reasoning off. The authors then generate another ten US option factors at each of the low, medium and high reasoning settings.

Their results suggest that more reasoning is not monotonically better. Medium and high reasoning improve parts of the performance distribution, but high reasoning also produces wider dispersion.

That is intuitively important.

A model capable of producing a more elaborate financial argument is not necessarily producing a more robust signal. Greater complexity can create a better hypothesis, but it can also create a more fragile one.

### Different models

The same general prompt is also tested across several LLMs.

| Model | Result reported in this experiment |
|---|---|
| Gemini-2.5-Pro | Strong median performance with relatively contained drawdowns |
| Grok-4 | Several strong factors, but wide dispersion |
| Claude-Sonnet-4.5 | Middle of the group, including some weak candidates |
| DeepSeek-V3.2-exp | Relatively stable but below the stronger models |
| Qwen3-Max | Many low or negative-Sharpe candidates |

These results should not be turned into a general ranking of investment ability across LLMs. The samples are small and the comparison depends on this particular prompt, market and testing framework.

What it does show is that the outcome depends partly on **which model is doing the hypothesis generation**.

### Temperature

Finally, the authors vary temperature across 0, 0.25, 0.5 and 0.75, generating ten factors at each setting.

Lower temperatures tend to reproduce more similar ideas. At 0.5 and 0.75, correlations between the generated factors fall, indicating greater diversity.

That suggests a practical research trade-off.

Low temperature may give more reproducible output. Higher temperature can explore a wider hypothesis space.

But diversity should not be mistaken for quality. Generating ten different ideas is useful only if the additional ideas have enough economic and statistical merit to justify testing them.

---

## 8. What I Would Actually Want an LLM Factor System to Prove

The paper leaves me less interested in whether an LLM can invent something that deserves the label **"new factor"** than in whether it can improve the research process.

There are three tests I would apply.

The first is **incremental information**.

Suppose an LLM combines momentum, profitability and valuation in a complicated non-linear formula. If the result performs no better than a simple weighted average of the three, the complexity has added little.

The interesting case is when the model identifies a conditional relationship: perhaps momentum behaves differently when profitability is improving, valuation is extreme or balance-sheet risk is rising. If that interaction survives out-of-sample testing, the LLM may have extracted more information from familiar variables.

The second is **repeatability**.

A research process should not be judged by its best output. If 100 hypotheses are generated and one works exceptionally well, I want to know what happened to the other 99.

That means evaluating the full distribution of candidates, the correlations between them, their failure rate and the amount of research required to find the successful ones.

The third is **incremental portfolio value**.

A factor does not need to be completely independent of everything already known. If adding it to an existing factor portfolio improves stock selection, reduces drawdown, diversifies the signal or raises risk-adjusted returns after costs, it can still be useful.

Those are more demanding tests than asking whether an AI-generated formula produced a high historical Sharpe ratio.

They are also closer to how the idea would actually be used in investment management.

---

## 9. The Next AXIS11 Experiment: Move from Options to Equities

AXIS11's next step is not to transplant AGFS or GammaOIPressure into equities.

It is to replicate the **research process**.

The model will be given the meaning of a defined set of equity variables — valuation, profitability, balance-sheet, growth, momentum and price information — together with clear restrictions on what information can be used.

It will then generate stock-selection hypotheses and the formulas required to calculate them.

The key question will be:

**Given the same underlying information, can an LLM find combinations that improve stock selection relative to using conventional factors more simply?**

The evaluation will have two stages.

First, we test the **signal**.

Does a higher factor score predict a higher subsequent return? The initial analysis will focus on rank IC, returns across factor-score buckets, long-short spreads and stability across different periods and market environments.

The portfolio rules at this stage should remain deliberately simple. Otherwise it becomes difficult to distinguish a good signal from a good portfolio optimiser.

Only after that will we test the **portfolio**.

LLM-generated factors will be compared with the market and with portfolios built from conventional factors. Performance will be evaluated after transaction costs, with information ratio, drawdown and turnover considered alongside excess return.

The LLM factors should also be tested both independently and as additions to existing signals. A factor that is mediocre on its own may still be useful if its return pattern is sufficiently different from the signals already in the portfolio.

Portfolio optimisation will be treated separately.

Turning a stock score into an investable portfolio requires decisions about expected returns, correlations, benchmark risk, sector and style exposure, position limits, liquidity and transaction costs. Using a sophisticated optimiser only for the LLM factors would contaminate the comparison.

The same portfolio construction framework and constraints should therefore be applied to both conventional and LLM-generated signals.

The next note will specify the investment universe, variables, generation procedure, data splits, benchmarks and portfolio rules before presenting the results.

That separation matters. The methodology should be fixed before we know which factors worked.

---

## Conclusion

The most interesting part of this paper is not that an LLM produced an option factor with a Sharpe ratio above 6.

It is that the model was able to take the **economic meaning of market variables**, combine them into a hypothesis, express that hypothesis mathematically and turn it into executable code before seeing the return history on which it would ultimately be judged.

That creates a different role for AI in investment research.

Instead of using an LLM only to summarise existing research or implement an analyst's idea, the model can become another source of hypotheses.

The evidence in the paper is promising, but it is also uneven. Some factors perform exceptionally well, while others collapse out of sample. The US results in particular look much less extraordinary once all 40 candidates are considered rather than the best examples alone.

For AXIS11, that makes the next question straightforward.

**Can an LLM use familiar equity information in unfamiliar combinations that improve stock selection — and can it do so consistently enough to matter in a real portfolio?**

That is what the next experiment will test.

---

## Sources and basis of calculation

[1] Yanchu Liu, Heyang Zhou, Yuhan Cheng, Jie Zou and Tianyi Wang, *Option Return Predictability via Large Language Models*, SSRN working paper, 2026. Read from the 43-page PDF of the paper. [Paper page](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6534498).

- Method, prompts, sample and IPCA: pp. 8–13.
- US performance: Tables 1–3, pp. 15, 18–19.
- China performance: Tables 4–6, pp. 22, 25–26.
- Factor correlations and representative formulas: pp. 28–31.
- Reasoning-effort, model and temperature comparisons: pp. 32–38.
- Returns reported as decimals in the paper have been converted to percentages.
- Sharpe ratios, drawdowns and strategy definitions follow the paper.
- Candidate counts and median Sharpe ratios are my calculations from the paper's reported tables, not a reproduction of the underlying backtest.
- The proposed AXIS11 equity experiment is a research design, not a strategy that has already been tested or shown to be profitable.