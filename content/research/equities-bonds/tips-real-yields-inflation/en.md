---
title: "TIPS Falls While Inflation Rises"
date: 2026-10-09
summary: "TIPS compensate investors for inflation, but higher real yields can more than offset that protection. The contrast between 2021 and 2022 shows why inflation alone is not enough to judge the investment."
tags: [tips, inflation, real-yields, duration, treasuries]
draft: false
---

*Why an inflation-linked bondholder can lose money even in a high-inflation environment*

Buying inflation-linked bonds seems an obvious response to rising prices. US Treasury Inflation-Protected Securities (TIPS) increase their principal with the consumer price index, so higher inflation means larger payments to the holder. Yet their market value can fall, leaving investors with a negative total return even after coupons and inflation adjustments.

**Inflation increases the payments. Higher real yields reduce what investors will pay for them today.** If the price loss is larger than the income and inflation accrual, the holder loses money over that period.

The distinction connects directly to the earlier note, ["The U.S. 10-Year Near 5%: A More Uncomfortable Signal Than Inflation"](/axis11.github.io/research/equities-bonds/us-10y-real-rate-repricing/).[^5] That note examined the real-rate pressure behind rising nominal yields. Here, the question is what that pressure means for an investor holding a bond designed to protect against inflation.

The contrast between 2021 and 2022 makes the mechanism clear. Nominal yields rose in both years. In 2021, almost all of the increase came from breakeven inflation. In 2022, real yields surged while breakeven inflation fell. For TIPS investors, those were very different shocks.

## The long view: nominal yields, real yields and breakeven inflation

![US 10-year nominal yield, TIPS real yield and breakeven, full history](tips_charts/chart1_full_history.png)

*Figure 1. Daily data in per cent, from 2 January 2003 to 7 October 2026, the most recent date on which all three series are observed. The shaded bands mark the two calendar years compared below. Source: FRED DGS10, DFII10 and T10YIE; AXIS11.[^6]*

A rise in nominal yields does not tell us, on its own, how much pressure TIPS face. For these series, **nominal yield = TIPS real yield + breakeven inflation**. The split matters because a rise in inflation compensation has different implications from a rise in the real discount rate.

Breakeven inflation measures the inflation compensation priced into bonds, rather than realised CPI. It also reflects risk premia and relative liquidity. Similarly, the observed TIPS yield includes a real term premium and a liquidity component. These charts show market yields; they do not separate expectations from risk premia as a model such as DKW does.[^2]

## 1. Inflation protection applies to cash flows

TIPS pay a fixed coupon rate on principal that adjusts with US CPI. A bond with $1,000 of principal and a 1% coupon pays $10 a year initially. If inflation raises the principal to $1,050, annual interest rises to $10.50. The principal adjustment accumulates in the bond rather than being paid out in full each period.[^1]

**An increase in adjusted principal does not guarantee an increase in market value.** Principal determines the contractual payments; the market yield determines their present value. Higher required real yields reduce the price investors are willing to pay, potentially more than inflation adds to the principal.

At maturity, the holder receives the greater of the inflation-adjusted principal and the original principal. That floor does not protect the investor's purchase price. If the bond was bought in the secondary market at a premium, or after a long run of accrued inflation adjustments, the floor does not cover the full amount paid.[^1]

TIPS protect the inflation-linked payments promised by the contract. Their resale value still depends on market conditions.

## 2. When the price loss outweighs the inflation adjustment

In real terms, TIPS provide fixed cash flows discounted at the prevailing real yield. Their nominal value then reflects the inflation adjustment.

Suppose an existing bond offers a real yield of 1%, while comparable bonds become available at 2%. The existing bond must fall in price until it offers a competitive yield. Inflation indexation continues, but both bonds have that feature; it does not remove the difference in real yields.

A first-order approximation separates the sources of return:

> **Nominal total return ≈ real carry + inflation accrual over the period − real duration × change in the TIPS real yield**

Real carry includes coupon income and the price moving towards par. Real duration measures price sensitivity to the real yield, rather than simply years to maturity. This approximation omits convexity and interactions between the terms. Curve movements, the lag in CPI indexation, transaction costs and fund fees also affect actual returns.

Assuming annual real carry of 1%, inflation accrual of 5% and a real duration of eight years:

| Change in TIPS real yield over one year | Real carry | Inflation accrual | Price effect from the yield change | Approximate nominal total return |
|---|---:|---:|---:|---:|
| Unchanged | +1% | +5% | 0% | +6% |
| +0.5pp | +1% | +5% | −4% | +2% |
| +1.0pp | +1% | +5% | −8% | −2% |
| +1.5pp | +1% | +5% | −12% | −6% |

*Illustrative assumptions, not a return forecast for any product. A first-order approximation holding duration constant and omitting cross terms and convexity.*

With these assumptions, a 1pp rise in real yields produces an approximate 8% price loss. That more than offsets 1% of real carry and 5% of inflation accrual, leaving a nominal total return of about −2%. The investor receives the inflation adjustment and still loses money. The loss in purchasing power is larger.

**An inflation view alone is not enough to judge a TIPS investment. Real yields, duration and the holding period determine how much of that protection survives in the investor's return.**

## 3. How persistent inflation can push real yields higher

Rising inflation and rising real yields are not mutually exclusive. They can occur together when an inflation shock changes the outlook for monetary policy.

Persistent inflation can lead investors to expect later rate cuts or a higher policy-rate path. If expected nominal rates rise by more than expected inflation, expected real short rates rise. The holder then faces two forces at once: more inflation accrual and a higher real rate at which future payments are discounted.

Greater uncertainty about long-run real rates can also raise the real term premium investors demand for holding long-dated bonds. Observed TIPS yields contain a liquidity component as well: if trading conditions deteriorate and investors demand additional yield, that is a further source of downward pressure on prices.[^2]

The earlier note's decomposition helps distinguish these channels:

| Yield component | How it reaches the TIPS investor |
|---|---|
| Expected real short rate | A higher expected path raises the discount rate on existing TIPS |
| Real term premium | More compensation for long real-rate risk lowers existing TIPS prices |
| Expected inflation | Affects expected future indexation and relative value against nominal Treasuries |
| Inflation risk premium | The price of the inflation risk borne by nominal Treasuries; affects the spread to TIPS |
| TIPS liquidity premium | More compensation for illiquidity raises TIPS yields and lowers prices |

Expected real short rates and the real term premium directly affect the real discount rate. Liquidity can add further pressure. An increase in the observed TIPS yield therefore cannot be read simply as an increase in the neutral real rate.[^2]

The earlier note interpreted the 2026 increase as renewed pressure from expected real short rates against a backdrop of an elevated real term premium.[^5] **A higher real discount rate can weigh on both equity valuations and TIPS prices.** Inflation indexation protects the payments from CPI erosion, but leaves this valuation risk in place.

## 4. 2021 and 2022: similar headlines, different yield shocks

The comparison uses calendar-year endpoints: 31 December 2020 to 31 December 2021, then 31 December 2021 to 30 December 2022, the final observation of 2022. The daily paths below show the movements those endpoints conceal.

![Nominal yield, real yield and breakeven through 2021 and 2022](tips_charts/chart2_two_regimes.png)

*Figure 2. The same three yields on a common vertical scale. Plotting the full daily path shows the movement within each year even where the change between year-ends is small. Source: FRED; AXIS11.[^6]*

| Period | 10Y nominal | 10Y TIPS real yield | 10Y breakeven |
|---|---:|---:|---:|
| 2021 | 0.93% → 1.52% | −1.06% → −1.04% | 1.99% → 2.56% |
| Change | **+59bp** | **+2bp** | **+57bp** |
| 2022 | 1.52% → 3.88% | −1.04% → 1.58% | 2.56% → 2.30% |
| Change | **+236bp** | **+262bp** | **−26bp** |

*1bp = 0.01pp. Yields are year-end observations and the changes are the differences between the endpoints.*

### 2021: nominal yields rose, but real yields finished almost unchanged

In 2021, reopening and a strong recovery in demand met supply-chain bottlenecks, constrained labour supply and rising energy prices. US CPI inflation rose from 1.4% year on year in December 2020 to 7.0% in December 2021.[^7][^8]

The Federal Reserve kept its policy rate at 0–0.25%. Its November statement still described much of the inflation pressure as transitory. Asset purchases slowed but continued.[^7][^9] Despite high realised inflation, the 10-year real yield remained deeply negative at year-end.

Nominal yields rose 59bp, of which 57bp came from breakeven inflation. The TIPS real yield moved just 2bp, from −1.06% to −1.04%. **The increase in nominal yields therefore brought very little change in the year-end real discount rate.**

This left TIPS with inflation accrual and little price pressure from the net change in real yields. For illustration, holding duration constant at eight years gives a first-order yield-driven price effect of about −4.72% for a nominal bond, compared with −0.16% for TIPS. These estimates isolate the discount-rate effect and exclude coupons, indexation, roll-down and convexity.

The daily path was less calm: real yields rose into spring and fell over summer. Nor is DFII10 a bond or fund return series; it is a constant-maturity yield series. The year-end comparison establishes a small net change in the real discount rate, rather than a stable TIPS price throughout the year.

### 2022: tighter policy brought a sharp rise in real yields

Inflation remained high in 2022. CPI ended the year 6.5% above a year earlier, while Russia's invasion of Ukraine added pressure to energy and commodity prices.[^8][^10] The policy response, however, changed sharply.

The Federal Reserve ended net asset purchases in March and began raising rates. Over the year it raised the policy rate by a total of 425bp, to a year-end target range of 4.25–4.50%, and began reducing its balance sheet in June.[^11] Markets now faced sustained tightening rather than continued monetary accommodation.

The 10-year nominal yield rose 236bp, and the TIPS real yield rose more — 262bp. The breakeven actually fell 26bp. **High current inflation, a falling long-run breakeven and a surging real yield occurred at the same time.**

High current CPI describes inflation that has already happened; the 10-year breakeven reflects inflation compensation going forward. Expectations that tightening will contain long-run inflation can combine with concerns about slowing growth, so the two need not move in the same direction. Three time series alone, however, cannot establish how much of the fall in the breakeven came from expected inflation, from risk premia or from liquidity.

Inflation accrual continued, but the real discount rate rose by 262bp. At a constant duration of eight years, that implies a first-order price effect of about −21%. Such a large move changes duration and makes convexity more important, so the estimate is not an actual annual return. It shows why a real-yield shock of this size can overwhelm substantial inflation compensation.

![Decomposition of the 2021 and 2022 yield changes](tips_charts/chart3_change_decomposition.png)

*Figure 3. The +59bp of 2021 is the sum of +2bp of real yield and +57bp of breakeven; the +236bp of 2022 is +262bp of real yield and −26bp of breakeven. This is an arithmetic split of observed yields, not an estimate of the causal effect of policy or of a DKW expected-real-rate contribution. Source: FRED; AXIS11 calculations.[^6]*

Inflation was high in both years. The difference for TIPS was the change in real yields: almost none between the 2021 endpoints, then a sharp increase in 2022. The expected-real-rate and real-term-premium framework in the earlier note provides a way to examine the forces behind that discount rate.

## 5. Duration changes the exposure

The difference is visible in the manager-reported figures for a broad TIPS ETF and an ultra-short TIPS ETF as of 7 October 2026.[^3][^4]

| Fund | Effective duration | Year-to-date NAV total return |
|---|---:|---:|
| iShares TIPS Bond ETF (TIP) | 6.14 years | −1.94% |
| iShares 0–1 Year TIPS Bond ETF (ICPI) | 0.49 years | +3.74% |

*Both as of 7 October 2026. The total returns are manager figures reflecting reinvested distributions, which differ from a simple price change.*

A parallel 1pp rise in the relevant real-yield curve implies a first-order price effect of approximately −6.14% for TIP and −0.49% for ICPI, using the reported durations. Both receive inflation compensation, but the broad fund carries much more real-rate sensitivity.

Duration alone cannot explain the entire return gap. Holdings, curve movements, indexation timing and fees also matter. The comparison nevertheless shows why two investments labelled “TIPS” can behave very differently.

A conventional TIPS ETF replaces bonds as they mature or leave its index, maintaining exposure rather than running down towards a single repayment date. The investor cannot simply wait for that fund to mature as they could with an individual bond. Defined-maturity ETFs are a separate case.

An individual bond held to maturity need not be sold at a depressed interim price. Even so, buying at a negative real yield does not guarantee a positive real return. The inflation adjustment cannot undo the price paid at purchase.

## 6. Turning an inflation view into an investment decision

Three questions help translate an inflation forecast into a choice of TIPS exposure.

**What happens to real yields?** If persistent inflation delays cuts and pushes real yields higher, long-dated TIPS can lose value. If real yields stabilise or fall, inflation accrual can be reinforced by price appreciation.

**Does the maturity fit the holding period?** Protecting against near-term inflation and securing a real yield over many years are different objectives. Longer-dated TIPS bring greater exposure to changes in real yields along with their inflation protection.

**Which return matters?** Price changes, nominal total returns including income, and returns after inflation answer different questions. A non-dollar investor must also account for currency movements and any hedging costs.

## Conclusion

TIPS can deliver their promised inflation adjustment while leaving the investor with a loss. The mechanism is straightforward: a rise in real yields lowers the value of future payments, and that price decline can exceed coupon income and inflation accrual.

The 2021–2022 comparison shows why current inflation is an incomplete guide. In 2021, higher nominal yields largely reflected higher breakeven inflation. In 2022, real yields rose sharply even as breakeven inflation declined. The second environment imposed a much larger price burden on TIPS.

The same distinction matters when interpreting today's rise in Treasury yields. The earlier note's focus on expected real short rates and the real term premium carries directly into TIPS valuation. **The investment protects against inflation, but its return still depends on the real yield paid at purchase, the duration held and when the investor needs the money.**

---

## References

[^1]: [U.S. Treasury, Treasury Inflation-Protected Securities](https://www.treasurydirect.gov/marketable-securities/tips/) — principal adjustment, fixed coupon, floor at maturity.
[^2]: [Federal Reserve Board, Tips from TIPS: Update and Discussions, 21 May 2019](https://www.federalreserve.gov/econres/notes/feds-notes/tips-from-tips-update-and-discussions-20190521.html) — decomposition of real yields, breakeven inflation and the TIPS liquidity premium.
[^3]: [BlackRock, iShares TIPS Bond ETF (TIP)](https://www.blackrock.com/us/individual/products/239467/ishares-tips-bond-etf) — NAV total return and effective duration as of 7 October 2026.
[^4]: [iShares, iShares 0–1 Year TIPS Bond ETF (ICPI)](https://www.ishares.com/us/products/347171/ishares-0-1-year-tips-bond-etf) — NAV total return and effective duration on the same date.
[^5]: AXIS11 Research, ["The U.S. 10-Year Near 5%: A More Uncomfortable Signal Than Inflation"](/axis11.github.io/research/equities-bonds/us-10y-real-rate-repricing/), 16 September 2026 — linked to the latest revision of that note. This note uses the interpretation of the yield decomposition given there and does not re-estimate the contributions.
[^6]: FRED: [DGS10](https://fred.stlouisfed.org/series/DGS10), [DFII10](https://fred.stlouisfed.org/series/DFII10), [T10YIE](https://fred.stlouisfed.org/series/T10YIE) — downloaded 9 October 2026 NZT. Daily, per cent, not seasonally adjusted. The source CSV begins in 1962, but the three series share a start date of 2 January 2003. The charts use only observation dates on which all three exist, with no interpolation of missing values; 8 October 2026, where only T10YIE is available, is excluded from the comparison charts.
[^7]: [Federal Reserve, Monetary Policy Report, February 2022](https://www.federalreserve.gov/monetarypolicy/2022-02-mpr-summary.htm) — the 2021 recovery in demand, supply bottlenecks, labour supply and the policy background.
[^8]: [BLS, Consumer Price Index: 2022 in review](https://www.bls.gov/opub/ted/2023/consumer-price-index-2022-in-review.htm) — December CPI inflation for 2020, 2021 and 2022.
[^9]: [Federal Reserve, FOMC Statement, 3 November 2021](https://www.federalreserve.gov/newsevents/pressreleases/monetary20211103a.htm) — the inflation assessment at the time, the policy rate and the slowing of asset purchases.
[^10]: [Federal Reserve, Inflation since the Pandemic: Lessons and Challenges](https://www.federalreserve.gov/econres/feds/files/2025070pap.pdf) — supply shocks and the energy and commodity channel of the war in Ukraine.
[^11]: [Federal Reserve, The Federal Reserve's responses to the post-Covid period of high inflation, 14 February 2024](https://www.federalreserve.gov/econres/notes/feds-notes/the-federal-reserves-responses-to-the-post-covid-period-of-high-inflation-20240214.html) — the end of net asset purchases, 425bp of rate increases and the start of balance-sheet reduction in June 2022.
