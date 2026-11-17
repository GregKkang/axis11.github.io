import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.font_manager as fm
import pandas as pd, numpy as np, sys

names = {f.name for f in fm.fontManager.ttflist}
KR = next((n for n in ["Noto Sans CJK KR","Noto Sans CJK JP","Noto Sans CJK HK","Noto Sans CJK SC"] if n in names), "DejaVu Sans")
FONT = {"ko": KR, "en": KR if KR != "DejaVu Sans" else "DejaVu Sans"}

BG="#f7f9fb"; INK="#182e40"; MUTED="#5f7d8c"; GOLD="#b8912f"; TEAL="#0d7d7d"; SLATE="#7b93a3"; GRID="#e3e8ed"; RED="#b1483a"

d = pd.read_csv("hy_oas_dataset.csv", encoding="utf-8-sig")
d.columns = ["date","HY","B","CCC"]
d["date"] = pd.to_datetime(d["date"], format="%d/%m/%Y")
d = d.dropna().reset_index(drop=True)

EPISODES = [("1998-11-20","1998-12-18"), ("2001-03-27","2001-04-24"), ("2008-11-18","2008-12-15"),
            ("2009-01-30","2009-02-26"), ("2015-11-17","2015-12-15"), ("2026-09-22","2026-10-20")]

def idx(ts): return d.index[d.date == pd.Timestamp(ts)][0]

def frame(fig, lang, kicker, title, subtitle, notes):
    f = FONT[lang]
    fig.patch.set_facecolor(BG)
    fig.text(0.035, 0.955, kicker, fontsize=11, color=GOLD, fontweight="bold", family=f)
    fig.text(0.035, 0.895, title, fontsize=21, color=INK, fontweight="bold", family=f, va="top")
    fig.text(0.035, 0.845, subtitle, fontsize=11.5, color=MUTED, family=f, va="top")
    y = 0.075
    for n in notes:
        fig.text(0.035, y, n, fontsize=9.5, color=MUTED, family=f)
        y -= 0.035

def style(ax, lang):
    ax.set_facecolor(BG)
    ax.grid(axis="y", color=GRID, lw=0.9)
    ax.set_axisbelow(True)
    for s in ("top","right"): ax.spines[s].set_visible(False)
    for s in ("left","bottom"): ax.spines[s].set_color(GRID)
    ax.tick_params(colors=MUTED, labelsize=10)
    for t in ax.get_xticklabels()+ax.get_yticklabels(): t.set_family(FONT[lang])

T = {
 "ko": dict(kicker="AXIS11 RESEARCH  /  CREDIT",
   t1="CCC 스프레드만 따로 벌어졌다", s1="미국 하이일드 OAS · 2026년 6월~11월 13일 · 음영은 9월 22일~10월 20일(20거래일)",
   ccc="CCC 이하", b="B 등급", hy="하이일드 전체", ylab="OAS (%)",
   n1="자료  ICE BofA 지수 OAS · FRED. AXIS11 계산.", n2="음영 구간은 20거래일(9월 22일~10월 20일). 축은 0에서 시작하지 않는다.",
   t2="과거 사례와 비교한 20거래일 구간의 확대폭", s2="각 구간 시작일 대비 종료일의 OAS 변화 · 베이시스포인트",
   n3="자료  ICE BofA 지수 OAS · FRED. AXIS11 계산.", n4="모든 구간은 20거래일 기준. 월말 값이 주말에 들어온 구간은 거래일 19일에 월말 관측 1개가 더해진다.",
   t3="구간이 끝난 뒤에도 남는 압력", s3="구간 시작일 대비 CCC OAS 변화 · 거래일 기준 · 세로선은 20거래일 종료 시점",
   xlab3="구간 시작일로부터의 거래일 수", ylab3="CCC OAS 변화 (bp)",
   n5="자료  ICE BofA 지수 OAS · FRED. AXIS11 계산.", n6="2026년 구간은 11월 13일까지 자료가 있어 38거래일에서 끝난다. 80거래일은 구간 종료일로부터 60거래일 뒤다.",
   ep=["1998년 11~12월","2001년 3~4월","2008년 11~12월","2009년 1~2월","2015년 11~12월","2026년 9~10월"],
   lab2015="2015년 11월 17일 시작", lab1998="1998년 11월 20일 시작", lab2026="2026년 9월 22일 시작", ann2015="종료일 대비 +205bp"),
 "en": dict(kicker="AXIS11 RESEARCH  /  CREDIT",
   t1="CCC spreads widened on their own", s1="US high yield OAS · June to 13 November 2026 · shaded: 22 September to 20 October, 20 trading days",
   ccc="CCC and lower", b="B rated", hy="High yield index", ylab="OAS (%)",
   n1="Source  ICE BofA index OAS via FRED. AXIS11 calculations.", n2="The shaded window is 20 trading days (22 Sep–20 Oct). Axes do not start at zero.",
   t2="Widening over a 20-trading-day window, against past episodes", s2="Change in OAS from the first to the last day of each window · basis points",
   n3="Source  ICE BofA index OAS via FRED. AXIS11 calculations.", n4="Every window is 20 trading days. Where a month-end falls on a weekend, it is 19 trading days plus that month-end observation.",
   t3="Pressure that outlasts the window", s3="Change in CCC OAS from the start of each window · trading days · vertical line marks day 20",
   xlab3="Trading days from the start of the window", ylab3="Change in CCC OAS (bp)",
   n5="Source  ICE BofA index OAS via FRED. AXIS11 calculations.", n6="The 2026 window ends at trading day 38, where the data ends. Day 80 is 60 trading days past the window end.",
   ep=["Nov–Dec 1998","Mar–Apr 2001","Nov–Dec 2008","Jan–Feb 2009","Nov–Dec 2015","Sep–Oct 2026"],
   lab2015="from 17 Nov 2015", lab1998="from 20 Nov 1998", lab2026="from 22 Sep 2026", ann2015="+205bp vs the window end"),
}

def chart1(lang):
    t = T[lang]; f = FONT[lang]
    m = d[(d.date >= "2026-06-01")].reset_index(drop=True)
    fig, (a1, a2) = plt.subplots(2, 1, figsize=(8.8, 6.6), dpi=200, sharex=True,
                                 gridspec_kw=dict(top=0.78, bottom=0.17, left=0.085, right=0.965, hspace=0.22))
    for ax in (a1, a2):
        style(ax, lang)
        ax.axvspan(pd.Timestamp("2026-09-22"), pd.Timestamp("2026-10-20"), color="#dfe7ec", zorder=0)
    a1.plot(m.date, m.CCC, color=GOLD, lw=2.2)
    a1.set_ylabel(t["ylab"], color=MUTED, fontsize=10.5, family=f)
    for ts, va, dx in [("2026-09-22", "top", -2), ("2026-10-20", "bottom", 2)]:
        v = d.CCC[idx(ts)]
        a1.plot([pd.Timestamp(ts)], [v], "o", color=INK, ms=6, zorder=5)
        a1.annotate(f"{v:.2f}", (pd.Timestamp(ts), v), textcoords="offset points",
                    xytext=(dx*6, 12 if va == "bottom" else -18), color=INK, fontsize=11, fontweight="bold",
                    family=f, ha="center")
    v = d.CCC.iloc[-1]
    a1.plot([d.date.iloc[-1]], [v], "o", color=INK, ms=6, zorder=5)
    a1.annotate(f"{v:.2f}", (d.date.iloc[-1], v), textcoords="offset points", xytext=(-6, 12),
                color=INK, fontsize=11, fontweight="bold", family=f, ha="right")
    a1.text(0.985, 0.08, t["ccc"], transform=a1.transAxes, ha="right", color=GOLD,
            fontsize=12, fontweight="bold", family=f)
    a2.plot(m.date, m.B, color=TEAL, lw=2.0)
    a2.plot(m.date, m.HY, color=SLATE, lw=2.0)
    a2.set_ylabel(t["ylab"], color=MUTED, fontsize=10.5, family=f)
    a2.text(0.015, 0.95, t["b"], transform=a2.transAxes, ha="left", va="top", color=TEAL, fontsize=11.5, fontweight="bold", family=f)
    a2.text(0.015, 0.80, t["hy"], transform=a2.transAxes, ha="left", va="top", color=SLATE, fontsize=11.5, fontweight="bold", family=f)
    a2.xaxis.set_major_locator(mdates.MonthLocator())
    a2.xaxis.set_major_formatter(mdates.DateFormatter("%Y-%m"))
    frame(fig, lang, t["kicker"], t["t1"], t["s1"], [t["n1"], t["n2"]])
    fig.savefig(f"out/01-recent-oas{'' if lang=='ko' else '-en'}.png", facecolor=BG)
    plt.close(fig)

def chart2(lang):
    t = T[lang]; f = FONT[lang]
    rows = []
    for s, e in EPISODES:
        i, j = idx(s), idx(e)
        rows.append([round((d[k][j]-d[k][i])*100) for k in ("CCC","B","HY")])
    rows = np.array(rows)
    fig, ax = plt.subplots(figsize=(8.8, 5.9), dpi=200,
                           gridspec_kw=dict(top=0.78, bottom=0.17, left=0.175, right=0.965))
    style(ax, lang); ax.grid(axis="y", lw=0); ax.grid(axis="x", color=GRID, lw=0.9)
    y = np.arange(len(EPISODES))[::-1]; h = 0.26
    for off, col, key, lab in [(h, GOLD, 0, t["ccc"]), (0, TEAL, 1, t["b"]), (-h, SLATE, 2, t["hy"])]:
        ax.barh(y+off, rows[:, key], height=h, color=col, label=lab)
        for yy, v in zip(y+off, rows[:, key]):
            ax.text(v + (18 if v >= 0 else -18), yy, f"{v:+,}", va="center",
                    ha="left" if v >= 0 else "right", fontsize=9.5, color=INK, family=f)
    ax.set_yticks(y); ax.set_yticklabels(t["ep"], fontsize=11, color=INK)
    for lbl in ax.get_yticklabels(): lbl.set_family(f); lbl.set_fontweight("bold")
    ax.axvline(0, color="#9fb0bd", lw=1)
    ax.set_xlim(-200, 1560)
    leg = ax.legend(loc="lower right", frameon=False, fontsize=10.5, ncol=1)
    for txt in leg.get_texts(): txt.set_family(f); txt.set_color(INK)
    frame(fig, lang, t["kicker"], t["t2"], t["s2"], [t["n3"], t["n4"]])
    fig.savefig(f"out/02-episode-widening{'' if lang=='ko' else '-en'}.png", facecolor=BG)
    plt.close(fig)

def chart3(lang):
    t = T[lang]; f = FONT[lang]
    fig, ax = plt.subplots(figsize=(8.8, 6.1), dpi=200,
                           gridspec_kw=dict(top=0.79, bottom=0.21, left=0.095, right=0.965))
    style(ax, lang)
    series = [("1998-11-20", SLATE, t["lab1998"], 80), ("2015-11-17", TEAL, t["lab2015"], 80), ("2026-09-22", GOLD, t["lab2026"], 80)]
    for start, col, lab, span in series:
        i = idx(start)
        end = min(i+span, len(d)-1)
        x = np.arange(0, end-i+1)
        v = (d.CCC[i:end+1].values - d.CCC[i]) * 100
        ax.plot(x, v, color=col, lw=2.3, label=lab)
        ax.annotate(lab, (x[-1], v[-1]), textcoords="offset points", xytext=(8, 0),
                    color=col, fontsize=10.5, fontweight="bold", family=f, va="center")
    ax.axvline(20, color="#9fb0bd", lw=1.2, ls=(0, (6, 5)))
    ax.axhline(0, color="#9fb0bd", lw=1)
    i15 = idx("2015-11-17"); end15 = (d.CCC[i15+80] - d.CCC[i15]) * 100
    ax.annotate(t["ann2015"], (80, end15), textcoords="offset points", xytext=(0, -26),
                color=TEAL, fontsize=10, family=f, ha="center")
    ax.set_xlim(0, 104); ax.set_xlabel(t["xlab3"], color=MUTED, fontsize=10.5, family=f)
    ax.set_ylabel(t["ylab3"], color=MUTED, fontsize=10.5, family=f)
    frame(fig, lang, t["kicker"], t["t3"], t["s3"], [t["n5"], t["n6"]])
    fig.savefig(f"out/03-after-the-window{'' if lang=='ko' else '-en'}.png", facecolor=BG)
    plt.close(fig)

import os
os.makedirs("out", exist_ok=True)
for lang in ("ko", "en"):
    chart1(lang); chart2(lang); chart3(lang)
print("font:", KR)
print("\n".join(sorted(os.listdir("out"))))
