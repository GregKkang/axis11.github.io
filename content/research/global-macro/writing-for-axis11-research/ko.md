---
title: "Axis11 리서치 글쓰기 안내"
date: 2026-09-14
summary: "Axis11 아티클 템플릿 — frontmatter 항목, 서식, 각주, 인터랙티브 차트 사용법."
tags: [template, how-to]
draft: true
---

이 글은 템플릿입니다. 폴더를 복사해 이름을 바꾸고 내용만 교체하면 됩니다.
아래 항목들은 파이프라인이 지원하는 기능을 하나씩 보여줍니다.

## Frontmatter

파일 맨 위 `---` 사이의 블록이 글의 메타데이터입니다.

| 항목 | 필수 | 설명 |
|---|---|---|
| `title` | 예 | 제목이자 브라우저 탭 표시 |
| `date` | 예 | `YYYY-MM-DD`. 목록 정렬 기준 (최신순) |
| `summary` | 아니오 | 카테고리 목록과 링크 미리보기에 사용. 생략하면 첫 문단에서 자동 추출 |
| `tags` | 아니오 | 예: `[inflation, rbnz]` |
| `hero` | 아니오 | 같은 폴더에 둔 이미지 파일명 |
| `draft` | 아니오 | `true`면 빌드에서 제외 |

필수는 `title`과 `date` 둘뿐입니다. 둘 중 하나라도 없으면 빌드가 명확한
메시지와 함께 실패하므로, 실수로 미완성 페이지가 배포될 일은 없습니다.

## 서식

일반 마크다운이 그대로 동작합니다 — **굵게**, *기울임*, `인라인 코드`,
[링크](https://www.rbnz.govt.nz). 외부 링크는 자동으로 새 탭에서 열립니다.

> 인용 블록은 중앙은행 성명이나 기업 공시 문구를 인용할 때 유용합니다.

각주를 쓰면 본문 흐름을 끊지 않고 출처를 남길 수 있습니다[^method].

표는 마크다운 문법 그대로 씁니다.

| 분기 | 헤드라인 | 비교역재 |
|---|---|---|
| 2026Q1 | 2.8 | 4.1 |
| 2026Q2 | 2.5 | 3.8 |
| 2026Q3 | 2.3 | 3.5 |

## 차트

` ```chart ` 블록은 인터랙티브 차트로 바뀝니다. 마우스를 올리면 값이 표시되고,
범례·축·색상은 Axis11 팔레트를 자동으로 따릅니다.

```chart
{
  "type": "line",
  "title": "예시 시계열",
  "subtitle": "시연용 샘플 데이터 — 발행 전 실제 데이터로 교체하세요",
  "source": "Axis11 (예시)",
  "x": "quarter",
  "format": "percent",
  "yLabel": "전년 대비",
  "series": [
    { "key": "headline", "label": "헤드라인" },
    { "key": "nontradable", "label": "비교역재" }
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

시계열이 길면 숫자를 같은 폴더의 CSV에 두고 `data` 배열 대신 `dataFile`로
가리키면 됩니다. 첫 줄이 헤더이고, 열 이름이 `x`와 `series`의 키가 됩니다.

```chart
{
  "type": "bar",
  "title": "CSV에서 데이터 불러오기",
  "subtitle": "차트 문법은 동일, 숫자는 sample-data.csv에 보관",
  "source": "Axis11 (예시)",
  "x": "sector",
  "dataFile": "sample-data.csv",
  "format": "percent",
  "series": [{ "key": "contribution", "label": "성장 기여도" }]
}
```

`"type"`은 `line`, `area`, `bar` 중 하나입니다. `"stacked": true`를 넣으면
누적 차트가 되고, `"height"`로 기본값 320px보다 높게 만들 수 있습니다.

## 발행

폴더를 `main`에 커밋하고 푸시하면 GitHub Actions가 빌드·배포하고, 몇 분 안에
해당 카테고리 페이지에 글이 나타납니다. 작업 중인 글은 `draft: true`로 두면
저장소에는 남되 사이트에는 노출되지 않습니다.

[^method]: 각주는 자동으로 번호가 매겨지고 글 하단에 모입니다.
