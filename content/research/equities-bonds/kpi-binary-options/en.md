---
title: "Trading Earnings Directly"
date: 2026-10-16
summary: "KPI binary options would let investors trade a company’s reported results directly. Their value depends on whether prices reward legitimate research or access to confidential figures—and whether ordinary investors can trade at a reasonable cost."
tags: [market-structure, derivatives, prediction-markets, insider-trading, regulation]
draft: false
---

An investor can forecast a company’s earnings correctly and still lose money in its shares. Revenue growth may fall short of expectations. Strong quarterly profits may be overshadowed by weak guidance. The share price also responds to interest rates, positioning and sentiment.

The KPI binary options planned by Cboe and Robinhood tie the payout directly to a reported figure. A contract might ask whether quarterly earnings per share will be at least $2.00. It pays $1.00 if the condition is met and nothing otherwise. KPIs—key performance indicators—can include revenue, earnings and segment results. [Cboe product hub](https://www.cboe.com/kpi-binary-options-pipeline-hub/)

This creates a price for a specific earnings outcome, offering a more direct expression of expectations than the share price. It also creates a particularly precise opportunity for someone who already knows the unreleased result. **The market’s value depends on both the accuracy of its prices and the source of the information that makes them accurate.**

## 1. How the contracts work

### The reported figure determines the payout

Consider a contract that pays $1.00 if quarterly EPS is at least $2.00. The **strike is $2.00**. In a conventional equity option, the strike is compared with the share price. Here, it is compared with the reported KPI.

A call pays $1.00 if the KPI is **equal to or above** the strike. A put pays $1.00 if the KPI is **below** it. A reported figure exactly equal to the strike therefore pays the call. [Cboe product hub](https://www.cboe.com/kpi-binary-options-pipeline-hub/)

Here is a hypothetical trade, before costs: 1,000 calls struck at $2.00, bought at $0.60.

| Reported EPS | Cost | Payout | Net |
|---|---:|---:|---:|
| $1.99 | $600 | $0 | −$600 |
| $2.00 | $600 | $1,000 | +$400 |
| $2.80 | $600 | $1,000 | +$400 |

The payout does not increase with the size of the earnings beat. The buyer pays a premium for the conditional payout; the seller receives the premium and takes on the corresponding obligation. Under the draft specification, buyers pay the full purchase price and sellers generally collateralise the maximum payout, with separate margin treatment for offsetting positions. [Draft EPS contract specification](https://cdn.cboe.com/resources/membership/Cboe_KPI_Binary_Options_Contract_Spec_Example_EPS.pdf#page=3)

### Orders go through brokers to the exchange

The planned flow is as follows.

1. Cboe lists a contract, fixing the company, the KPI, the reporting period, the strike and the expiration.
2. Investors submit buy and sell orders through a broker. Robinhood is to be the first retail broker offering the product at launch.
3. Orders execute on Cboe Options and are cleared by Cboe Clear U.S. (CCUS). Market makers quote bids and offers, supplying the liquidity needed to find a counterparty.
4. When the company publishes its results, the contract terms determine whether it pays.

Sources: [Cboe–Robinhood announcement](https://ir.cboe.com/news/news-details/2026/Cboe-and-Robinhood-Announce-Planned-Launch-of-New-KPI-Contracts-Further-Expanding-Prediction-Market-Offerings/default.aspx), [Cboe product hub](https://www.cboe.com/kpi-binary-options-pipeline-hub/). What has and has not been confirmed on approval and launch is set out at the end of this note.

Planned trading hours are 9:30 a.m. to 4:00 p.m. US Eastern Time. For companies reporting after the close, trading generally runs to the close on the day of the release; for companies reporting before the open, to the previous trading day. Specific expirations are set around each company's reporting calendar. [Cboe trading notice](https://www.cboe.com/notices/content/?id=61507), [SEC approval order, trading hours and expiration](https://www.sec.gov/files/rules/sro/cboe/2026/34-106659.pdf#page=27)

The contracts are European-style and cash-settled at expiration. Before then, a holder can close the position by selling, provided a buyer is available. Settlement is normally paid on the next business day; delayed results or a delay in determining the settlement value can postpone payment. [Cboe FAQ](https://cdn.cboe.com/resources/membership/Cboe_KPI_Binary_Options_FAQ.pdf#page=4)

## 2. The accounting definition decides settlement

EPS expresses a company’s profit per share, but the label alone does not identify the figure used to settle a contract.

- **Basic EPS:** earnings attributable to common shareholders divided by the weighted average shares outstanding for the period.
- **Diluted EPS:** adjusted for the effect of instruments that can become shares — convertible bonds, share-based compensation and the like — increasing the share count. Spreading profit across more shares lowers the per-share figure; that effect is "dilution."
- **Adjusted EPS:** calculated by the company or a data provider after adjusting for specific items such as one-off costs.

Dilution concerns the share-count basis; adjustments concern the earnings included in the calculation. Adjusted EPS can therefore also be diluted EPS. A valid comparison must match both. [SEC investor guidance: convertible securities and dilution](https://www.investor.gov/introduction-investing/investing-basics/glossary/convertible-securities), [company example of adjusted diluted EPS](https://www.sec.gov/Archives/edgar/data/1764046/000176404626000090/ex991q22026earningsrelease.htm)

Cboe's Apple EPS specification is drafted to settle on the **diluted earnings per share** figure in the quarterly results materials. That specification is a draft. [Cboe Apple EPS specification](https://cdn.cboe.com/resources/membership/Cboe_KPI_Binary_Options_Contract_Spec_Example_EPS.pdf)

Suppose consensus is $2.10 on an adjusted basis, while the contract settles on a reported figure of $1.90. The difference may reflect accounting adjustments rather than a forecasting error. Consensus must be put on the contract’s settlement basis before it can inform a trade.

The planned launch list includes KPIs beyond EPS.

| Company | Example planned KPIs |
|---|---|
| Apple | Revenue, iPhone revenue, Services revenue, Greater China revenue |
| AMD | Revenue, Data Center revenue, Client and Gaming revenue |

Source: [Cboe planned product listings](https://cdn.cboe.com/resources/membership/Cboe_KPI_Binary_Options_Product_Listings.pdf)

Revenue contracts require the same precision about units and segment scope. Total revenue and data-centre revenue are separate outcomes, even within one company. If reporting segments change or a metric is discontinued, the contract’s settlement provisions govern. [Draft revenue specification](https://cdn.cboe.com/resources/membership/Cboe_KPI_Binary_Options_Contract_Spec_Example_Revenue.pdf)

Settlement normally uses the earnings release attached to the 8-K filed with the SEC, and where necessary the 10-Q or 10-K. Where the same document contains figures at different precision, the more precise value applies. Once a settlement value is determined, a later restatement of the results does not reopen the settled contract. [Cboe FAQ](https://cdn.cboe.com/resources/membership/Cboe_KPI_Binary_Options_FAQ.pdf#page=4), [draft EPS specification](https://cdn.cboe.com/resources/membership/Cboe_KPI_Binary_Options_Contract_Spec_Example_EPS.pdf#page=2)

## 3. What a 60-cent price tells us

For a contract paying $1.00, a purchase price of $0.60 implies a 60% break-even success rate before costs, ignoring discounting. This makes the price a useful starting point for reading market expectations, although it is not necessarily a 60% estimate of the event’s actual probability.

The executable price matters. If the bid is $0.54 and the offer $0.66, the midpoint is $0.60, but an immediate buyer pays $0.66. Before fees and discounting, that buyer needs a success probability above 66% for positive expected value.

Prices also reflect risk-bearing, hedging demand and inventory costs. Investors seeking protection against weak earnings may bid up puts, while market makers require compensation for holding exposure and trading against better-informed counterparties. Prediction-market research examines when prices approximate participants’ average beliefs and how risk aversion and differing views affect that relationship. [Wolfers and Zitzewitz, 2006](https://www.nber.org/papers/w12200)

In a pricing framework, the probability implied after allowing for discounting is a **risk-neutral probability**. The theoretical relationship is:

> Contract price = present value of $1.00 at expiration × risk-neutral probability

For short-dated contracts, discounting has a small effect, so the price is close to the implied probability under that framework. Moving from this price-implied measure to an actual event probability requires assumptions about risk compensation and trading frictions. KPI exposure is difficult to hedge fully with shares, making that distinction particularly relevant.

Prices across strikes reveal more of the implied distribution. If a $2.00 call costs $0.60 and a $2.20 call costs $0.30, the $0.30 difference prices the outcome **$2.00 ≤ EPS < $2.20**. Under the same pricing framework and ignoring discounting, this corresponds to a 30% implied probability for that range. The comparison requires contemporaneous prices and matching reporting periods and settlement terms.

## 4. What KPI prices add to consensus and equity options

Analyst consensus usually provides a mean or median forecast. KPI options price the chance of crossing a particular threshold. Equity options price exposure to the share price, which depends on earnings alongside guidance, discount rates and market conditions.

| Source | What it tells you | What you need to interpret it |
|---|---|---|
| Analyst consensus | The level professionals expect and the dispersion of views | Estimate dates, aggregation method, accounting basis |
| KPI option | The market's price on a specific earnings condition | Strike, settlement basis, trading costs and size |
| Equity option | The price of direction and volatility in the share | The influence of results, guidance, rates and flows |

KPI contract structure: [Cboe product hub](https://www.cboe.com/kpi-binary-options-pipeline-hub/). The table is comparative analysis built on it.

An investor who expects weak quarterly revenue but remains confident in the long-term business could retain the shares and buy a revenue KPI put. That targets the reported revenue outcome directly. It is an imperfect hedge for the shares: the offset depends on the stock’s reaction and the number of contracts held.

Across strikes, KPI prices could also reveal differences hidden by a consensus average. Two companies with mean EPS forecasts of $2.00 may have tightly clustered expectations or sharply divided views. A sufficiently liquid set of contracts could help distinguish those distributions.

## 5. A more direct use for inside information

The most sensitive window is **after results become known inside the company but before they become public**.

Someone using unreleased earnings to trade shares or equity options must still anticipate the market’s reaction. Expectations and guidance can overwhelm the headline result. A KPI contract removes much of that uncertainty: comparing the confidential figure with the strike can identify the payout directly. [Cboe product hub](https://www.cboe.com/kpi-binary-options-pipeline-hub/)

If a final release shows EPS of $2.15, someone with access can assess a $2.00 call with very high confidence. Exact knowledge may not even be necessary. An internal estimate of $2.10–$2.20 could already provide a substantial edge at that strike.

The strength of the information depends on how far the company has progressed through its reporting process.

| Point in time | Nature of the internal information | What still has to be judged |
|---|---|---|
| During the quarter | Partial results — revenue, orders, costs | Remaining operations and estimation error |
| During close and accounting adjustments | Consolidated results and expected adjustments | Provisions, tax, accounting adjustments |
| After the final release is fixed | The figures and language to be published | Changes to the release, settlement interpretation |
| After publication | Results available to the whole market | Speed of processing and interpretation |

Confidential information entering the market may improve its predictions. But the profits behind that apparent accuracy can accrue to those with privileged access rather than superior public-data analysis. **Accurate prices alone do not establish a fair or useful market.**

## 6. How US insider trading law applies

The SEC treats these Cboe contracts as securities options, with the protections of the securities laws applying. The insider trading rules on material non-public information therefore apply to trading them. [SEC approval order](https://www.sec.gov/files/rules/sro/cboe/2026/34-106659.pdf#page=107), [Chairman's statement](https://www.sec.gov/newsroom/speeches-statements/atkins-101326-statement-commissions-approval-proposed-rule-change-permit-listing-binary-options-overlying-key)

The legal analysis starts from how the information was obtained and what duty the trader owed. A corporate insider trading in breach of a duty to shareholders falls under the classical theory. Where an outsider uses confidential information entrusted by a client or employer, the misappropriation theory — breach of a duty to the source of the information — is the relevant framework. [SEC explanation of the doctrines](https://www.sec.gov/newsroom/speeches-statements/ts120111rsk-statement-application-insider-trading-law-trading-members-congress-their-staffs)

Rule 10b5-1 turns in principle on awareness of material non-public information at the time of the trade. Establishing liability involves the related elements — materiality, breach of duty, scienter — along with defences such as a qualifying pre-established trading plan. [Rule 10b5-1](https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.10b5-1)

| Who has access | Principal legal questions |
|---|---|
| Finance and accounting staff | Access to unreleased results, duties to shareholders and the company, circumstances of the trade |
| External accounting, legal and IR service providers | Confidentiality duties to the client and how the information was used |
| Family and acquaintances who were told | Breach and benefit on the tipper's side, the recipient's knowledge, and the other elements of tippee liability |
| Supply-chain and public-data analysts | Legality of how the data was obtained and any confidentiality obligation |

Rule 10b5-2 addresses duties of trust and confidence arising from confidentiality agreements, a history of sharing confidences, and certain family relationships. The source of the information and the relationship are what distinguish someone lawfully analysing public data from someone using company secrets in breach of a duty. [Rule 10b5-2](https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.10b5-2)

Confidential information about another company can also come into scope. The SEC announced that in the 2024 Panuwat case a jury found insider trading liability where the defendant used his employer's acquisition information to buy call options in a comparable company. Investigating trades in related companies likewise means examining the duty owed to the source and the materiality to the security actually traded. [SEC statement on the verdict](https://www.sec.gov/newsroom/speeches-statements/grewal-statement-040524)

In a KPI contract, materiality has to be assessed against the payout of the specific contract. A figure whose effect on overall company value is small can still be material to the investor in a KPI option whose payout it decides.

## 7. Surveillance: connecting trades with access to information

The approved design applies the existing surveillance framework for securities options to KPI contracts. Cboe works with FINRA and reports the relevant information to the Consolidated Audit Trail (CAT), which tracks orders. Through inter-exchange information-sharing arrangements, trading in other markets — shares and options — can be linked into an investigation. [SEC approval order, surveillance](https://www.sec.gov/files/rules/sro/cboe/2026/34-106659.pdf#page=101)

| Mechanism | What applies |
|---|---|
| Member information controls | Written procedures against misuse of material non-public information, with review and supervision of relevant accounts. [Cboe Rules 8.10, 8.16, 9.2](https://cdn.cboe.com/resources/regulation/rule_book/C1_Exchange_Rule_Book.pdf) |
| Position limits | A base limit per class and expiration of 2.5 million KPI contracts: 25,000 standard option contracts, with 100 KPI contracts counted as one standard contract. Positions are not aggregated across classes, and registered market makers have an exemption for certain two-sided selling. [SEC approval order](https://www.sec.gov/files/rules/sro/cboe/2026/34-106659.pdf#page=98) |
| Large position reporting | Reportable from 20,000 KPI contracts on the same side. The OCC provides a large-position reporting service for positions cleared at CCUS. [RC26-016](https://cdn.cboe.com/resources/regulation/circulars/regulatory/RC26-016-2026-Binary-KPI-Options-Position-Limit-Reporting.pdf) |
| Trading halts | The exchange can halt and resume trading on an unofficial disclosure of a KPI. The underlying stock and the KPI option are assessed for halts separately. [SEC approval order](https://www.sec.gov/files/rules/sro/cboe/2026/34-106659.pdf#page=28) |

Order and execution records establish who traded, when, in which direction and in what size. An insider-trading investigation must connect those trades with access to confidential results. Relevant evidence includes document-access logs, release-material distribution times, communications and relationships between accounts.

The binary outcome makes pre-release trading performance straightforward to measure once settlement is determined. Repeatedly profitable, unusually large trades just before announcements can identify accounts for closer review. Establishing misconduct still requires evidence about access, communications and the applicable legal duties.

Position limits and reporting help identify concentrated exposure, but surveillance must also cover smaller trades spread across accounts, strikes and KPIs. Aggregating economically related positions around a single earnings release would help reveal patterns that contract-by-contract monitoring may miss.

Surveillance should be assessed by detection, false positives and investigation time. Investors also face a more immediate test: the price and size available while an investigation is still unresolved. Market makers must quote for the information risk they face today.

## 8. Information risk can make trading more expensive

Suppose a market maker sells a contract for $0.60 when its actual probability of paying $1.00 is 95%. The expected loss is $0.35 before costs. If such trades recur, the market maker has reason to raise offers, lower bids or reduce quoted size. This risk of trading against better-informed counterparties is **adverse selection**.

Market microstructure research shows how informed trading can widen bid–offer spreads. Ordinary investors then pay more to enter and exit. [Glosten and Milgrom, 1985](https://business.columbia.edu/faculty/research/bid-ask-and-transaction-prices-specialist-market-heterogeneously-informed-traders)

Several features of KPI contracts can amplify the risk.

**Equity hedges leave residual exposure.** An EPS threshold can be met even if the shares fall, limiting how effectively the stock hedges a KPI payout. Positions across related KPIs and strikes may offset some exposure, but disclosure can produce abrupt repricing and settlement interpretation can introduce further uncertainty.

**Information risk can peak near disclosure.** Final materials circulate within the company and among advisers before publication. Market makers must allow for the possibility of leakage while meeting applicable quoting obligations.

**Liquidity is divided among contracts.** Revenue, EPS and segment KPIs each have multiple strikes. High aggregate volume does not ensure sufficient depth in the contract an investor wants to trade.

**Liquidity must survive the fee waiver.** Cboe and Robinhood announced no fees through the end of 2026. Sustainable participation depends on market makers’ ability to cover capital costs and losses to informed flow once the promotion ends. [Cboe announcement](https://ir.cboe.com/news/news-details/2026/Cboe-and-Robinhood-Announce-Planned-Launch-of-New-KPI-Contracts-Further-Expanding-Prediction-Market-Offerings/default.aspx)

A market can therefore become more accurate and less accessible at the same time. Informed participants move prices towards the result, while others face wider spreads and smaller quotes. Market quality requires measuring both predictive performance and the cost of executing a meaningful position.

## 9. Policy proposals for reducing misuse of information

The proposals below go beyond the approved framework. Each should be assessed for its effect on information misuse and its cost to legitimate trading.

| Proposal | Intended effect | Cost to weigh |
|---|---|---|
| Name the company's own KPI contracts in its insider trading policy | Clarifies the scope of the prohibition and pre-clearance for staff and related parties | Designing restrictions proportionate to actual information access |
| Lawfully link suspicious trading to results-document access logs | Improves investigation of how information was obtained and passed on | Personal data, company confidentiality, investigative authority |
| Pilot an earlier close of trading before disclosure | Shrinks the window for trading after the final figures are fixed | Fewer hedging opportunities; informed trading shifts earlier |
| Aggregate a company's multiple KPI exposures for surveillance | Identifies risk concentrated on a single earnings release | Treatment of offsetting positions and double counting |
| Record the timing and basis of halts and schedule changes | Allows consistency of market operation around disclosure to be assessed | Balancing transparency against information security |
| Publish anonymised surveillance and market quality statistics | Allows detection performance and trading costs to be tracked | Protecting investigative confidentiality and detection methods |

The objective is to reward legitimate analysis while reducing gains from breaches of confidentiality. Any intervention should be evaluated against trading activity, predictive accuracy, evidence of leakage and execution costs for ordinary investors.

## 10. How to test whether the market adds value

Once trading data are available, three questions should guide the research: do KPI prices improve forecasts, what information drives that improvement, and what does it cost to trade?

### Compare forecasts using the same information cutoff

Record each contract’s company, KPI definition, reporting period, strike and settlement value. Sample quotes 10, 5 and 1 trading days before the release and at the final tradable moment. Compare them with consensus, guidance and public-data models available at each corresponding time.

Express every forecast as the probability that the contract pays. A point consensus estimate can be converted using historical forecast errors, with accounting adjustments and share-count definitions matched to settlement. Establish the earliest public release time by checking company IR, newswire distribution and SEC filing timestamps.

Three metrics are useful.

- **Probability accuracy:** the distance between the predicted probability and the realised 0/1 outcome. The standard measure is the Brier score, the mean of `(predicted probability − outcome)²`.
- **Probability consistency:** whether contracts priced at 70% actually paid about 70% of the time.
- **Tradable return:** the profit and loss from trading a given size, after bid–offer, available size and fees.

The theoretical basis for reading prices as probabilities: [Wolfers and Zitzewitz](https://www.nber.org/papers/w12200). The metrics and sample construction above are proposals.

Specify treatment of stale quotes and thinly traded contracts before testing. Multiple strikes on one release are dependent observations, so uncertainty estimates must account for clustering by company and release. Use chronological development and evaluation samples, retaining the information actually available at each forecast date.

### Link suspicious trading to information access

Public prices can reveal unusual patterns, but investigating leakage requires company or regulatory cooperation. Account-level orders, cancellations and trades must be linked to beneficial owners, access to results materials and relevant communications. Supervisory data such as CAT require authorised access. [SEC description of CAT and FINRA surveillance](https://www.sec.gov/files/rules/sro/cboe/2026/34-106659.pdf#page=102)

The hypotheses to test:

| Hypothesis | Pattern to look for |
|---|---|
| Legitimate analysis improves prediction | Prices improve through trading by many participants after public information is released |
| Non-public information enters the market | Trading and profit concentrate in accounts linked to those with access after internal materials are finalised and circulated |
| Demand and trading conditions distort prices | Order imbalance, gaps in quotes and promotional timing influence prices more than earnings information |

Classify accounts by role, employment and information access before examining performance. Then test whether correctly directed orders and net profits increase after results are finalised or circulated internally, controlling for each account’s usual behaviour and conditions shared by the release.

Include contemporaneous public news and legitimate expertise as alternative explanations. Check unrelated KPIs, other quarters and shifted comparison windows. A statistical pattern supported by actual access records and communications carries more evidential weight than unusual profits alone. Any legal conclusion still depends on the relevant duties and other elements of liability. [Rule 10b5-1](https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.10b5-1)

### Measure the execution cost alongside predictive accuracy

As disclosure approaches, track predictive accuracy alongside spreads and quoted depth. Price movements in a trader’s favour after execution can help estimate adverse-selection costs to liquidity providers. Positions, hedges and fees are needed to assess their net profitability. [Information asymmetry and the spread](https://business.columbia.edu/faculty/research/bid-ask-and-transaction-prices-specialist-market-heterogeneously-informed-traders)

A phased policy change could support a comparison between affected and comparable unaffected contracts before and after implementation. An earlier trading close, for example, should be tested for reduced leakage, higher trading costs and displacement to other markets. Company size and contract popularity must also be accounted for.

The test is who produces the improved forecast and who bears its cost. Better predictions generated by legitimate research, with reasonable execution costs, would support the market’s value. Profits concentrated among people with confidential access, alongside deteriorating liquidity, would strengthen the case for revisiting its controls and design.

## 11. What will determine the market’s value

**For investors, KPI prices could sharpen the picture of earnings expectations.** They add threshold probabilities to consensus and offer targeted exposure to a reported outcome. Using them requires checking the settlement definition, executable price and available size. The contract payout and the stock’s reaction remain separate questions.

**For Cboe and Robinhood, repeat participation matters more than the launch list.** Active traders, retention and net revenue after the fee waiver will reveal more than the number of contracts offered. With a maximum payout of $1.00, contract counts should be read alongside payout notional when assessing scale.

**For market makers, information risk is central to profitability.** Forecasting must be combined with settlement expertise, schedule management and control of exposure across related KPIs. Sustained liquidity requires that quoting remain commercially viable.

**For issuers and regulators, access records become more important.** A single confidential figure can determine a payout, increasing the value of tracking who viewed final materials and when. Connecting those records with trading activity is essential to investigating misuse.

KPI options could reward more precise research into company performance. Whether that becomes their lasting contribution depends on control of pre-release information, effective surveillance and liquidity that remains usable for investors without privileged access.

## 12. What has been confirmed on announcement, approval and launch

As of 16 October 2026, the September announcement and the SEC's October approval of the listing rule are confirmed. The actual start of trading is not.

| Date and item | Confirmed from official sources |
|---|---|
| Cboe announcement, 30 September | Plan to launch KPI contracts on 23 US-listed companies in October, subject to regulatory approval, with Robinhood as the first retail broker. [Release](https://ir.cboe.com/news/news-details/2026/Cboe-and-Robinhood-Announce-Planned-Launch-of-New-KPI-Contracts-Further-Expanding-Prediction-Market-Offerings/default.aspx) |
| SEC approval, 13 October | Release 34-106659 approving SR-CBOE-2026-061, Amendment No. 1. [Approval order](https://www.sec.gov/files/rules/sro/cboe/2026/34-106659.pdf) |
| CCUS clearing agency registration | An amended application of 1 October and a notice of 6 October confirmed. A separate final registration order was not located in this review. [SEC filing](https://www.sec.gov/rules-regulations/commission-orders-notices/other-commission-orders-notices-information/ccus-form-ca-1), [Federal Register](https://www.govinfo.gov/content/pkg/FR-2026-10-09/html/2026-20714.htm) |
| Start of trading | The Cboe hub was marked as pre-launch material when accessed. No official source for a first trading day, execution or volume was located. [Product hub](https://www.cboe.com/kpi-binary-options-pipeline-hub/) |

The approval date follows the SEC approval order. The review covered SEC listing and clearing materials, Cboe product, trading and regulatory notices, and Robinhood's official newsroom.

## Primary sources

- [Cboe–Robinhood announcement, 30 September](https://ir.cboe.com/news/news-details/2026/Cboe-and-Robinhood-Announce-Planned-Launch-of-New-KPI-Contracts-Further-Expanding-Prediction-Market-Offerings/default.aspx)
- [SEC approval order, 13 October: Release 34-106659](https://www.sec.gov/files/rules/sro/cboe/2026/34-106659.pdf)
- [Cboe product hub](https://www.cboe.com/kpi-binary-options-pipeline-hub/), [FAQ](https://cdn.cboe.com/resources/membership/Cboe_KPI_Binary_Options_FAQ.pdf), [trading notice](https://www.cboe.com/notices/content/?id=61507)
- [Planned product listings](https://cdn.cboe.com/resources/membership/Cboe_KPI_Binary_Options_Product_Listings.pdf), [draft EPS specification](https://cdn.cboe.com/resources/membership/Cboe_KPI_Binary_Options_Contract_Spec_Example_EPS.pdf), [draft revenue specification](https://cdn.cboe.com/resources/membership/Cboe_KPI_Binary_Options_Contract_Spec_Example_Revenue.pdf)
- [Cboe rule book](https://cdn.cboe.com/resources/regulation/rule_book/C1_Exchange_Rule_Book.pdf), [position reporting circular RC26-016](https://cdn.cboe.com/resources/regulation/circulars/regulatory/RC26-016-2026-Binary-KPI-Options-Position-Limit-Reporting.pdf)
- [Rule 10b5-1](https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.10b5-1), [Rule 10b5-2](https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.10b5-2)
- [Wolfers and Zitzewitz, Interpreting Prediction Market Prices as Probabilities](https://www.nber.org/papers/w12200)
- [Glosten and Milgrom, Bid, Ask, and Transaction Prices in a Specialist Market with Heterogeneously Informed Traders](https://business.columbia.edu/faculty/research/bid-ask-and-transaction-prices-specialist-market-heterogeneously-informed-traders)
