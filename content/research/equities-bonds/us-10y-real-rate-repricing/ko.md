---
title: "5%에 가까운 미국 10년물: 인플레이션보다 더 불편한 신호"
date: 2026-09-16
summary: "2026년 장기금리 상승의 동력은 기대 인플레이션이 아니라 기대 실질 단기금리다. 주식시장에는 실질 할인율의 상승을 의미한다."
tags: [rates, treasuries, term-premium, dkw, equities]
draft: false
---

*DKW 모델로 읽는 2022–2026 금리 체제의 두 단계*

> **Research note**  
> 이 글의 목적은 채권시장의 방향이나 주식시장의 단기 고점을 예측하는 것이 아니다. 현재 시장의 핵심 위험변수인 미국 장기금리를 구성요소별로 나누어, 무엇이 금리의 수준과 변화를 만들고 있는지 이해하려는 시도다. 필자는 채권 전문 운용역이 아니며 채권시장 경험도 상대적으로 제한적이다. 따라서 특정 모형의 추정치를 정답으로 제시하기보다, 여러 연준 계열 모형에서 반복해서 나타나는 신호를 중심으로 해석한다.

## 핵심 결론

2026년 장기금리에서 가장 주목해야 할 변화는 **기대 인플레이션의 급등이 아니라 기대 실질 단기금리의 상승**이다.

2022년 이후의 장기금리 상승은 두 단계로 보는 것이 가장 깔끔하다.

1. **Phase 1 — 2022~2025: 정책금리 재평가에서 구조적 기간 프리미엄으로**  
   이 기간은 전반과 후반의 동력이 다르다. 2022년 한 해에는 기대 실질 단기금리가 142bp 오른 반면 실질 기간 프리미엄은 34bp 상승에 그쳤다. 2022년 말부터 2025년까지는 반대로 기대 실질 단기금리가 11bp 하락했고, 실질 기간 프리미엄이 31bp 오르며 상승 압력의 주된 원천이 됐다. 재정조달 압력, 국채 공급 확대, 연준의 매입 축소와 금리 변동성 확대가 장기 실질채권을 보유하는 데 필요한 보상을 높였다. 특히 2023년 이후 Real Term Premium이 높은 수준으로 재평가된 것은 제로금리·QE 시대와 다른 Treasury pricing regime의 형성으로 볼 수 있다.

2. **Phase 2 — 2026: Expected Real Short Rate의 재상승**  
   2026년 8월까지 DKW fitted 10년물은 57bp 올랐다. 이 중 기대 실질 단기금리가 25bp, 실질 기간 프리미엄이 16bp, 기대 인플레이션이 12bp, 인플레이션 위험 프리미엄이 4bp를 설명한다. 기대 실질금리가 가장 큰 몫이며, “연준이 예상보다 빨리 완화하지 못할 수 있다”는 재평가가 여기에 반영돼 있다. 다만 기간 프리미엄은 높은 수준을 유지한 것이 아니라 함께 상승했다. 시장은 단순히 물가가 더 오를 것이라고 보는 것이 아니라, 향후 실질 정책금리의 평균 경로 자체가 더 높을 가능성을 가격에 반영하고 있다.

따라서 현재 5%에 가까운 10년물 금리를 **inflation story 하나로 설명하는 것은 불충분하다.** 더 불편한 해석은 `real discount rate`가 올라가고 있다는 것이다.

---

## 1. DKW가 금리 하나를 네 개의 이야기로 나누는 방법

10년 명목금리는 개념적으로 다음과 같이 나눌 수 있다.

> **Nominal yield = Expected real short rate + Real term premium + Expected inflation + Inflation risk premium**

- **Expected real short rate**: 향후 만기 동안 예상되는 실질 단기금리의 평균이다. 통화정책 경로뿐 아니라 중립 실질금리, 성장 및 자본수요에 대한 시장의 판단도 포함한다.
- **Real term premium**: 단기채를 반복해서 보유하지 않고 장기 실질채권의 듀레이션 위험을 부담하는 대가다.
- **Expected inflation**: 향후 평균 물가상승률에 대한 기대다.
- **Inflation risk premium**: 실제 물가가 기대에서 벗어날 위험을 부담하는 대가다.

[D’Amico–Kim–Wei(DKW) 모델](https://www.federalreserve.gov/econres/notes/feds-notes/tips-from-tips-update-and-discussions-20190521.html)은 명목 국채, TIPS, CPI와 설문 기대를 함께 사용한다. 특히 TIPS 금리를 순수한 실질금리로 보지 않고 TIPS 유동성 프리미엄을 별도로 허용한다. 이 때문에 단순한 `nominal yield − TIPS yield`보다 기대 인플레이션과 인플레이션 위험보상을 더 정교하게 분리할 수 있다. 연준은 [DKW 데이터를 월별로 갱신](https://www.federalreserve.gov/econres/economic-research-data.htm)하며, 현재 공개 자료는 2026년 8월 31일까지다.

DKW의 장점은 명목금리를 네 조각으로 분해한다는 데 있다. 그러나 각 조각은 관측값이 아니라 모형 추정치다. 연준 연구진도 장기 실질금리와 위험 프리미엄은 모형 선택과 구현 방식에 따라 상당히 달라질 수 있다고 명시한다. 따라서 숫자의 소수점보다 **방향과 변화의 조합**이 더 중요하다.

아래 차트는 2022년 1월부터 2026년 8월까지 DKW가 추정한 10년물의 네 구성요소를 월말 기준으로 나타낸다. 네 구성요소의 합은 DKW fitted nominal yield와 일치한다.

```chart
{
  "type": "line",
  "title": "10년물 국채금리의 DKW 분해",
  "subtitle": "2022년 1월 ~ 2026년 8월 월별 · 네 구성요소의 합이 fitted nominal yield",
  "source": "Federal Reserve Board, D'Amico–Kim–Wei model (DKW_updates.csv). AXIS11 calculations.",
  "x": "date",
  "xType": "date",
  "yLabel": "Percent",
  "decimals": 2,
  "height": 420,
  "markers": [{ "x": "2025-12-31", "label": "2026년 재평가" }],
  "series": [
    { "key": "fitted_yield", "label": "10Y fitted nominal yield", "role": "total" },
    { "key": "exp_real_short_rate", "label": "기대 실질 단기금리" },
    { "key": "exp_inflation", "label": "기대 인플레이션" },
    { "key": "real_term_premium", "label": "실질 기간 프리미엄" },
    { "key": "inflation_risk_premium", "label": "인플레이션 위험 프리미엄" }
  ],
  "dataFile": "dkw_10y_components.csv"
}
```

*그림 1. 각 월의 마지막 완전 관측치, 단위 %. 임의의 월에 마우스를 올리면 다섯 값을 모두 읽을 수 있다. fitted nominal yield는 네 구성요소의 합이므로 다섯 번째 구성요소가 아니라 합계로 표시한다. 표시된 값은 반올림돼 있어 합이 정확히 맞지 않을 수 있다. 출처: Federal Reserve Board, AXIS11 계산.*

시계열은 세 국면을 보여준다. 첫째, 2022년 한 해에 Expected Real Short Rate가 142bp 급등하며 금리 정상화를 이끌었다. 둘째, 2022년 말부터 2025년까지는 이 성분이 11bp 되돌려진 대신 Real Term Premium이 31bp 오르며 상승 압력의 중심이 됐다. 셋째, 2026년에는 8월까지의 fitted yield 상승분 57bp를 Expected Real Short Rate 25bp, Real Term Premium 16bp, 기대 인플레이션 12bp, 인플레이션 위험 프리미엄 4bp가 나눠 설명한다.

여기서 중요한 것은 기간 프리미엄이 멈췄다는 것이 아니다. 기간 프리미엄도 계속 오르고 있다. 달라진 점은 기대 실질금리가 **낮은 프리미엄이 아니라 이미 높아진 프리미엄 위에서** 다시 오르고 있다는 것이다. 따라서 두 단계는 완전히 분리된 사건이라기보다 **서로 누적되는 과정**으로 이해하는 편이 정확하다.

## 2. 2026년의 포인트: 기간 프리미엄의 수준보다 기대금리의 변화

DKW 기반으로 2026년 1월 2일부터 7월 31일까지의 10년물 변화를 분석한 Charles Schwab 자료는 최근 상승의 주된 힘을 **higher expected short-term rates**로 해석한다. 기대 인플레이션 상승보다는 기대 실질 단기금리의 상승이 더 중요했다는 결론이다. 이는 “기간 프리미엄이 중요하지 않다”는 뜻이 아니다. 기간 프리미엄은 이미 2022~2025년에 상당히 높아졌고, 2026년에는 그 위에 기대금리 경로의 재평가가 추가됐다는 의미다.

다른 연준 모형에서도 같은 방향을 확인할 수 있다. 다만 기여도의 크기까지 같지는 않다. 샌프란시스코 연은의 Christensen–Rudebusch(CR) 모형은 2025년 9월 15일부터 2026년 9월 14일까지 10년물 상승을 다음과 같이 나눈다.

![10-year yield decomposition](charts/chart1_10y_decomposition.png)

10년물 관측금리는 4.10%에서 4.98%로 88bp 상승했다. 같은 기간 10년 평균 기대 overnight rate는 3.03%에서 3.68%로 **65bp** 올랐고, term premium은 1.07%에서 1.29%로 **22bp** 상승했다.

두 모형은 방향에는 합의하지만 기울기에는 합의하지 않는다. DKW의 네 성분을 CR의 이분법에 맞춰 묶으면 — 기대 = 기대 실질 단기금리 + 기대 인플레이션, 기간 프리미엄 = 실질 TP + 인플레이션 위험 프리미엄 — 2025년 9월 말부터 2026년 8월 말까지 DKW는 기대에 36bp, 기간 프리미엄에 26bp를 배분한다. 약 1.4배다. 같은 성분을 CR은 3배 가까이로 본다. 차이의 일부는 CR 구간이 2주 더 길고 그 기간에 금리가 추가 상승했다는 점에서 온다. 나머지는 모형 자체의 차이다. 이는 6장에서 다루는 구분과 같다. 모형을 넘어 전달되는 것은 각 성분의 **방향**이지 기여도의 크기가 아니다.

![One-year change decomposition](charts/chart2_one_year_change.png)

이 결과의 의미는 명확하다.

- **금리 수준(level)**: 기간 프리미엄 1.29%는 여전히 크며 장기채 약세의 중요한 구조적 배경이다.
- **최근 변화(change)**: 지난 1년 상승분에서는 기대 단기금리 경로의 재평가가 더 큰 몫을 차지했다.

즉 2026년은 Phase 1의 반전이 아니라 **Phase 1 위에 Phase 2가 더해진 상태**다.

## 3. Expected real short rate는 단순한 “Fed forecast”가 아니다

Expected real short rate 상승을 단순히 “다음 FOMC에서 금리를 올린다”로 읽으면 지나치게 좁다. 10년 평균 기대 실질 단기금리는 다음 세 가지를 함께 반영할 수 있다.

1. **Easing 지연**: 인플레이션이 충분히 빠르게 둔화하지 않아 정책금리를 빨리 낮추기 어렵다는 경기순환적 판단.
2. **중립 실질금리 상승**: 재정적자, 공공부문 자금수요, AI 인프라 투자와 생산성 기대가 균형 실질금리를 높였을 가능성.
3. **성장 회복력**: 높은 금리에도 경제가 버티면서 단기적으로 easing 필요성이 낮아지는 현상.

세 요인 중 주식시장과 채권시장에 더 중요한 구조적 변수는 **중립 실질금리의 상승 여부**다. Easing 지연과 성장 회복력은 경기순환에 따라 되돌아갈 수 있지만, 중립 실질금리의 상승은 장기 할인율의 기준 자체가 높아졌다는 의미이기 때문이다.

다만 중립 실질금리는 시장에서 직접 확인할 수 있는 관측값이 아니다. TIPS 실질수익률에도 실질 기간 프리미엄과 유동성 요인이 포함되며, DKW의 Expected Real Short Rate 역시 모형이 이를 분리해 추정한 값이다. 따라서 이를 “실제 중립금리가 얼마다”라고 단정하기보다, **시장이 장기 실질금리의 균형 수준을 상향 조정하고 있다는 간접적인 신호**로 읽는 것이 적절하다.

## 4. 기대 인플레이션이 크게 오르지 않았다는 점이 왜 중요한가

명목금리 상승이 주로 기대 인플레이션 때문이라면 기업의 명목 매출과 이익도 물가와 함께 일정 부분 상승할 수 있다. 물론 마진과 밸류에이션에 부담은 남지만, 할인율 상승의 일부를 명목 이익 증가가 상쇄할 가능성이 있다.

반대로 기대 인플레이션이 안정적인데 실질금리가 오르면 주식시장에는 더 직접적인 부담이다. 미래 현금흐름을 할인하는 실질 기준금리가 올라가지만, 명목 이익의 자동적인 상향 조정은 제한되기 때문이다.

시장에서 직접 관측하는 대표적인 물가 기대 지표는 **Breakeven Inflation(BEI)**, 즉 같은 만기의 명목 국채금리에서 TIPS 금리를 뺀 값이다. 그러나 BEI는 순수한 Expected Inflation과 같지 않다. DKW의 정의에 따르면 BEI에는 Expected Inflation뿐 아니라 Inflation Risk Premium이 포함되고 TIPS Liquidity Premium의 영향도 들어간다. 따라서 아래에서 말하는 Expected Inflation은 BEI 그 자체가 아니라, 이러한 프리미엄을 분리한 **모형 추정 기대 인플레이션**이다.

별도의 Cleveland Fed 모델로 교차 확인하면, 2026년 5월부터 9월까지 10년 기대 인플레이션은 약 2.49%에서 2.57%로 비교적 제한적으로 상승한 반면, 10년 실질금리는 1.63%에서 2.24%로 훨씬 크게 올랐다.

![Real rate versus expected inflation](charts/chart3_real_rate_vs_inflation.png)

이 차트는 DKW 추정치가 아니라 별도 모형의 결과다. 그럼에도 “현재 금리 충격의 핵심은 기대 인플레이션보다 실질 할인율”이라는 방향을 지지한다.

## 5. Inflation risk premium은 별개의 문제다

기대 인플레이션이 안정적이라고 해서 물가 위험이 사라진 것은 아니다. **Expected inflation**은 평균 경로이고, **inflation risk premium**은 그 경로에서 크게 벗어날 위험의 가격이다.

2026년에는 이 위험이 더 복합적이다.

- 원유 공급 충격은 단기 headline inflation과 2차 파급효과를 높일 수 있다.
- 기후·식량 충격은 공급 측 분산을 확대한다.
- AI 인프라 투자는 전력, 데이터센터, 반도체, 구리와 자본조달 수요를 통해 일부 가격을 밀어 올릴 수 있다.

이 요인들은 서로 다른 시차와 전달경로를 가지며 정책 대응도 다르다. 따라서 inflation risk premium은 방향 예측이 특히 어렵고, 기대 인플레이션과 같은 변수로 취급해서는 안 된다. 위험 프리미엄이 오르지 않았다고 물가 충격 가능성이 낮다는 뜻도 아니며, 반대로 위험 프리미엄 상승이 평균 인플레이션 전망의 동일한 상승을 의미하지도 않는다.

## 6. 다른 모델은 무엇을 다르게 보는가

| 모델 | 주된 입력 | 분해 방식 | 강점 | 주요 한계 |
|---|---|---|---|---|
| **DKW** | 명목 국채, TIPS, CPI, 설문 | 기대 실질단기금리, 실질 TP, 기대 인플레이션, 인플레이션 RP | 실질·물가 요인을 가장 세밀하게 분리; TIPS 유동성 조정 | 구조와 추정 가정에 민감; 월별 수정 가능 |
| **ACM** | 명목 Treasury yield curve | 기대 명목 단기금리 + 명목 term premium | 긴 역사와 일별 업데이트; 시장 모니터링에 편리 | TIPS·물가를 직접 사용하지 않아 실질/물가 분리가 불가 |
| **Kim–Wright** | 명목금리 + 금리 설문 | 기대 단기금리 + term premium | 설문을 이용해 장기기대를 제약 | 저금리·ELB 구간과 표본 선택에 민감 |
| **CR** | 명목 off-the-run zero-coupon yields | 기대 overnight rate + term premium | 단순하고 최신 변화의 교차검증에 유용 | 명목 모형이므로 실질금리와 물가위험을 직접 분리하지 않음 |
| **Cleveland Fed** | 국채, inflation swap, 물가·설문 | 실질금리, 기대 인플레이션, 실질·물가 RP | 물가와 실질금리의 월별 교차검증 | DKW와 변수 정의 및 추정 구조가 다름 |

[뉴욕 연은 ACM](https://www.newyorkfed.org/research/data_indicators/term-premia-tabs)과 [샌프란시스코 연은 CR](https://www.frbsf.org/research-and-insights/data-and-indicators/treasury-yield-premiums/)은 숫자가 서로 다를 수 있다. 이는 오류라기보다 관측할 수 없는 기대와 프리미엄을 서로 다른 제약으로 추정하기 때문이다. 따라서 모델 간 절대 수준보다 다음 두 질문이 중요하다.

1. 여러 모델이 기대 단기금리의 방향을 함께 상향 조정하는가?
2. 기대 인플레이션이 크게 오르지 않았는데 명목·실질금리가 동시에 상승하는가?

현재 두 질문에 대한 답은 대체로 **그렇다**에 가깝다.

## 7. 주식시장에 왜 좋지 않은 조합인가

이 조합이 주식시장에 주는 부담은 세 가지다.

첫째, **valuation compression**이다. 실질 할인율 상승은 장기 성장 기대에 높은 가치를 부여받는 기업일수록 현재가치를 더 크게 낮춘다.

둘째, **capital competition**이다. 무위험 실질수익률이 높아지면 주식은 더 높은 earnings yield 또는 더 강한 이익성장을 제공해야 한다. 주식의 상대가 단순한 현금이 아니라 2%를 웃도는 장기 실질수익률이 된다.

셋째, **earnings offset이 약하다.** 기대 인플레이션 상승이 주도한 금리 상승과 달리, 실질금리 상승은 명목 매출 증가로 자연스럽게 상쇄되기 어렵다. 동시에 높은 자금조달비용은 기업 투자와 이자비용에 부담을 준다.

다만 이 분석은 “금리가 높으므로 주식은 즉시 하락한다”는 타이밍 신호가 아니다. 기대 실질금리 상승이 강한 생산성 및 성장 기대를 반영한다면 이익전망 개선이 일부 충격을 상쇄할 수 있다. 핵심은 **earnings revision이 real discount-rate shock을 따라잡을 수 있는가**다.

## 8. 앞으로 확인해야 할 신호

이 해석이 강화되는 조건은 다음과 같다.

- 기대 인플레이션은 안정적이지만 DKW expected real short rate가 계속 상승한다.
- 10년물 상승 시 ACM·CR term premium보다 기대 단기금리 성분의 기여가 더 크다.
- Fed funds futures의 인하 폭이 줄거나 인상 가능성이 장기구간까지 반영된다.
- 실질금리 상승에도 earnings revision이 따라오지 못한다.

반대로 이 해석이 약해지는 조건은 다음과 같다.

- 장기금리 상승의 대부분이 다시 inflation risk premium 또는 term premium으로 이동한다.
- 성장 둔화로 기대 실질 단기금리가 하락하고, 장기금리 상승이 국채 공급 부담만을 반영한다.
- AI 투자와 생산성 개선이 실질금리 상승보다 더 빠른 이익성장으로 연결된다.

## 결론

2022~2025년 미국 장기금리의 핵심 변화는 **장기채를 보유하기 위한 실질 위험보상의 정상화**였다. 2026년에는 그 구조적 변화 위에 **기대 실질 단기금리의 상승**이 추가됐다.

따라서 현재 10년물 5% 부근은 “물가가 다시 오른다”는 단일한 메시지가 아니다. 더 중요한 메시지는 시장이 **완화의 속도, 중립 실질금리, 장기 성장과 자본수요의 균형**을 다시 높게 평가하고 있다는 점이다.

채권시장에서는 높은 term premium과 높은 expected rate가 동시에 존재하고, 주식시장에서는 기대 인플레이션의 큰 상승 없이 real discount rate가 올라가고 있다. **이 조합이 현재 시장 리스크를 분석할 때 가장 주의 깊게 봐야 할 부분이다.**

---

### Data notes and sources

- Federal Reserve Board, [Tips from TIPS: Update and Discussions](https://www.federalreserve.gov/econres/notes/feds-notes/tips-from-tips-update-and-discussions-20190521.html); DKW data through 31 August 2026.
- Federal Reserve Bank of San Francisco, [Treasury Yield Premiums](https://www.frbsf.org/research-and-insights/data-and-indicators/treasury-yield-premiums/); values as of 14 September 2026.
- Federal Reserve Bank of New York, [Treasury Term Premia — ACM](https://www.newyorkfed.org/research/data_indicators/term-premia-tabs).
- Federal Reserve Bank of St. Louis, [10-Year Treasury yield](https://fred.stlouisfed.org/series/DGS10), [10-Year real interest rate](https://fred.stlouisfed.org/series/REAINTRATREARAT10Y), and [10-Year expected inflation](https://fred.stlouisfed.org/series/EXPINF10YR).
- Charles Schwab, [Fed and Treasury Update: Higher-for-Longer Yields](https://www.schwab.com/learn/story/fed-and-treasury-update-higher-longer-yields), 12 August 2026; DKW-based interpretation of the 2026 year-to-date move.
