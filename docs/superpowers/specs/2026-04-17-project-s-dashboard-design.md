# Project S 스팀 론칭 대시보드 — 설계서

- **작성일**: 2026-04-17
- **목적**: Project S 스팀 론칭 임원진 보고용 통합 웹 대시보드 구축
- **호스팅**: Cloudflare Pages (정적)
- **산출물**: 사이드바 + 환율 UI + 8개 페이지 통합 셸, 원본 HTML 최소 수정

## 1. 목표와 비목표

### 1.1 목표
- 임원진이 **회의실 프레젠테이션**(1920×1080급)과 **개인 노트북 브라우징**(1280~1920)에서 동일하게 쾌적한 UX.
- 좌측 사이드바로 8개 페이지(P1~P7 + Appendix) 간 **원클릭 이동**.
- **USD↔KRW 환율 1곳 수동 입력**이 P1/P2 등 환율-민감 페이지에 일관 적용.
- P1~P4 + Appendix의 원본 HTML은 **구조·JS·DOM 불가침**, 공통 테마 토큰만 수렴해 8페이지 톤 통일.
- P5~P7 외부 URL은 iframe으로 연결해 **뷰포트 전면 채움**.

### 1.2 비목표
- 인쇄/PDF 출력 (화면 브라우징 전용).
- 모바일 폰 퍼스트 (1024px 이하는 best-effort).
- 외부 페이지(P5~P7)의 크로스오리진 데이터 동기화.
- CSV 등 외부 데이터 파일 바인딩 (현재 모든 숫자는 HTML 내 하드코딩).

## 2. 페이지 구성

| # | 코드 | 제목 | 소스 | 타입 |
|---|---|---|---|---|
| 1 | P1 | 글로벌 게임 마켓 | `pages/p1.html` (← `p1_projectsdashboard_gamemarketbigpicture_final.html`) | 내부 iframe |
| 2 | P2 | 스팀 마켓 | `pages/p2.html` | 내부 iframe |
| 3 | P3 | 마일스톤 | `pages/p3.html` | 내부 iframe |
| 4 | P4 | 스팀 정책 & 리스크 | `pages/p4.html` (+ 내부에서 `steam_china.html`, `steam_russia.html` 중첩 iframe) | 내부 iframe |
| 5 | P5 | Pain Point 분석 | `https://project-s-dashboard.pages.dev/` | 외부 iframe |
| 6 | P6 | BM 분석 | `https://pub-4710a252be1249c58617eed8ea869738.r2.dev/images/p6_projectsdashboard_BM.html` | 외부 iframe |
| 7 | P7 | 경쟁작 캘린더 | `https://fps-dashboard.misty-haze-7fc4.workers.dev/` | 외부 iframe |
| 8 | APX | 매치메이킹 CCU 계산기 | `pages/appendix.html` (← `appendix_ccu_calculator.html`) | 내부 iframe |

## 3. 아키텍처

### 3.1 선택
**셸 HTML + 내부 iframe + postMessage 환율 브로드캐스트.** 원본 HTML 불가침 요구·Chart.js 버전 혼재·ID 충돌 리스크를 모두 회피. 런타임 단일 DOM 병합(B안)과 빌드 시 정적 병합(C안)은 원본 수정량·복잡도·유지보수 부담이 커 기각.

### 3.2 파일 레이아웃
```
/
├── index.html
├── assets/
│   ├── theme.css              공통 디자인 토큰 + embed 모드 overrides
│   ├── shell.css              사이드바·헤더·메인 레이아웃
│   ├── shell.js               라우팅·환율·사이드바 토글·postMessage 브로드캐스트
│   └── embed.js               iframe 내부에서 환율 메시지 수신 리스너
├── pages/
│   ├── p1.html                원본에서 이름만 변경
│   ├── p2.html
│   ├── p3.html
│   ├── p4.html
│   ├── appendix.html
│   ├── steam_china.html       P4 내부 중첩 iframe 대상 (이름 유지 필수 — P4 내부 하드코딩 경로)
│   └── steam_russia.html
├── docs/superpowers/specs/
│   └── 2026-04-17-project-s-dashboard-design.md
├── _headers                   Cloudflare Pages 보안/CSP 헤더
├── CLAUDE.md / .claude / .devcontainer
└── README.md
```

### 3.3 런타임 구조
```
┌──────────── index.html (셸) ────────────┐
│ ┌── aside.sidebar ──┐ ┌── main ────────┐│
│ │ 로고/프로젝트명   │ │ header (56px)  ││
│ │ 네비 8개          │ │ ───────────────││
│ │                   │ │ iframe#page-   ││
│ │ 환율 USD→KRW      │ │   frame        ││
│ │ [1400] [적용]     │ │   (내부 or 외부)││
│ └───────────────────┘ └────────────────┘│
└─────────────────────────────────────────┘
```

### 3.4 라우팅
- URL 해시 기반: `#p1` ~ `#p7`, `#appendix`, 기본값 `#p1`.
- `hashchange` 이벤트 → 네비 active 상태 갱신 + `iframe.src` 교체.
- 정적 호스팅만으로 북마크·뒤로가기 정상 작동.

## 4. 디자인 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `--bg` | `#ffffff` | 배경 |
| `--card-bg` | `#f3f4f6` | 카드 |
| `--card-bg2` | `#f9fafb` | 중첩 카드 |
| `--border` | `#e5e7eb` | 보더 |
| `--text-h` | `#111827` | 제목 |
| `--text-sub1` | `#374151` | 본문 |
| `--text-sub2` | `#6b7280` | 서브 |
| `--text-src` | `#9ca3af` | 인용/출처 |
| `--accent` | `#4f46e5` | 인디고 액센트 |
| `--green` / `--red` / `--amber` / `--purple` / `--teal` | `#16a34a` / `#ef4444` / `#d97706` / `#7c3aed` / `#0f766e` | 시맨틱 |
| `--radius` | `12px` | 라운드 |
| `--shadow` | `0 1px 4px rgba(0,0,0,.08)` | 쉐도우 |
| 폰트 | `Pretendard, 'Apple SD Gothic Neo', 'Segoe UI', system-ui` | 본문 |
| 숫자 | `font-variant-numeric: tabular-nums` | 표/KPI |
| 차트 팔레트 (6색) | `#4f46e5, #0891b2, #16a34a, #d97706, #ef4444, #7c3aed` | 그래프 |

**P2 호환 shim**: 공통 `:root`에 `--c1`, `--c2`, `--bd`, `--h`, `--s1`, `--s2`, `--sc`, `--g`, `--r`, `--a` alias 선언해 P2 원본이 무수정으로 동작.

**P3 전용 토큰** (Premium/F2P/OptA/OptB): 원본에만 남겨두고 공통 테마는 건드리지 않음.

## 5. 원본 HTML 최소 수정 규약

각 `pages/*.html`에 가해지는 수정은 **3줄 + 1클래스** 뿐:

1. `<head>` 마지막 `<style>` 뒤에:
   `<link rel="stylesheet" href="../assets/theme.css">`
2. `<body>` 태그에 `class="embed"` 추가.
3. `</body>` 직전에:
   `<script src="../assets/embed.js"></script>`

기존 CSS/JS/DOM은 일체 수정 금지. `body.embed` 셀렉터로 상단 헤더·nav·legend-bar 숨김 처리는 `theme.css`가 담당.

**예외 — `steam_russia.html`**: Playfair/Source Serif/Recharts 사용 중. 폰트는 의도된 세리프 톤이라 보존. `theme.css` 주입 시 색 토큰만 인디고 액센트로 수렴(제목·링크·차트 팔레트). 레이아웃은 불가침.

## 6. 환율 브로드캐스트

### 6.1 데이터 흐름
```
사이드바 입력 → shell.js: localStorage 저장 + 현재 iframe에 postMessage
          → embed.js(iframe): 수신 → #rateInput.value 갱신 → applyRate() 호출
          → P1/P2: 기존 자체 함수가 data-usd 속성 기반으로 KRW 재계산
          → P3/P4/Appendix/중·러: no-op (환율 미사용 페이지)
```

### 6.2 `shell.js` 핵심
- `loadRate()`/`saveRate()` : `localStorage['projectS.rate']`, 기본값 `1400`.
- `broadcastRate(v)` : `iframe.contentWindow.postMessage({type:'rate', value:v}, location.origin)`.
- 입력 UI `change`/`Enter`/`[적용]` 클릭 → 유효성 검증 → 저장 → 브로드캐스트.
- `iframe.addEventListener('load', ...)` → 페이지 전환 때마다 최신 환율 자동 재전파.

### 6.3 `embed.js`
```js
window.addEventListener('message', (e) => {
  if (e.origin !== location.origin) return;
  const m = e.data;
  if (m?.type !== 'rate' || typeof m.value !== 'number') return;
  const input = document.getElementById('rateInput');
  if (input) input.value = m.value;
  if (typeof applyRate === 'function') applyRate();
});
```

### 6.4 외부 iframe(P5~P7)
postMessage 시도 없음. 외부 페이지는 자체 통화 체계 유지.

### 6.5 엣지 케이스
- 비숫자/음수 입력 → 무시, 이전 값 유지.
- iframe 로드 전 환율 변경 → iframe `load` 이벤트에서 재전파 (idempotent).
- `localStorage` 비활성 브라우저 → 세션 유지 실패해도 기본값 1400로 동작.

## 7. 사이드바 & 헤더

### 7.1 사이드바
- 폭 250px, 기본 펼침. 1024px 이하 자동 접힘(60px 아이콘만).
- 햄버거 토글 버튼(사이드바 상단). 상태 `localStorage['projectS.sidebar']`에 저장.
- 네비 항목: 번호 칩(`P1~P7`, `APX`) + 한글 제목. active 시 인디고 좌측 바 + 배경.
- 하단: 환율 박스 (`USD → KRW`, 숫자 입력 + `[적용]`, 기본 `1400`, 작게 `※ 2026-04-17 임의 입력`).

### 7.2 헤더 (56px)
- 좌측: 현재 페이지 번호 칩 + 한글 제목.
- 우측: `업데이트 2026-04-17` + live dot.

## 8. iframe 정책

| 구분 | height | 보안/로드 |
|---|---|---|
| 내부 (`pages/*.html`) | `100%` (메인 영역 꽉 참) | same-origin, postMessage 수신 |
| 외부 P5~P7 | `calc(100vh - 56px)` | sandbox 없음, referrerpolicy `strict-origin-when-cross-origin` |

내부 iframe은 `scrolling="auto"` 기본, 외부도 동일. 셸 메인은 `overflow:hidden`으로 2중 스크롤 방지.

## 9. 차트 Overflow & 라벨 보정

원본 JS 수정 없이 `theme.css`의 safety CSS로 1차 해결:
```css
body.embed .chart-wrap,
body.embed .chart-card canvas,
body.embed .cd canvas { max-width:100%; height:auto !important; }
body.embed canvas { display:block; }
body.embed .chart-2col,
body.embed .g2 { overflow:hidden; }
body.embed .tw { overflow-x:auto; }
body.embed .kpi-row { overflow-wrap:anywhere; }
```
잔존 라벨 잘림이 있는 차트에 한해 원본 options 객체에 `layout.padding` 1~2라인 패치(**변경 diff 1줄/차트**).

## 10. Cloudflare Pages 배포

### 10.1 `_headers`
```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: frame-src 'self' https://project-s-dashboard.pages.dev https://pub-4710a252be1249c58617eed8ea869738.r2.dev https://fps-dashboard.misty-haze-7fc4.workers.dev; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com
```

### 10.2 배포 절차
1. GitHub → Cloudflare Pages "Connect to Git".
2. Build command: **없음**.
3. Build output: `/` (루트).
4. Production branch: `main`.
5. main 푸시 = 자동 배포.

## 11. 테스트 계획

TDD 단계(writing-plans 이후)에서 각 태스크별 검증을 동반. 수용 기준:

1. 사이드바 8개 네비 클릭 → 해시 변경 + iframe src 전환 + active 하이라이트.
2. 사이드바 토글 → 펼침/접힘 상태 `localStorage` 유지, 새로고침 시 복원.
3. 환율 입력 → P1/P2의 모든 `data-usd` 숫자 즉시 KRW 재계산, 다른 페이지엔 영향 없음.
4. P4 내부 중/러 iframe 로드 확인.
5. P5~P7 외부 iframe 로드 확인, 뷰포트 꽉 참.
6. 차트 라벨 잘림·가로 overflow 없음 (1280/1440/1920 3개 해상도).
7. `#p3` 등 해시로 직접 진입 시 해당 페이지로 초기화.
8. `_headers` CSP가 외부 3개 origin 허용, 그 외 차단.

로컬: `python3 -m http.server 8000` 또는 `npx serve`로 `http://localhost:8000` 검증.

## 12. 리스크 & 완화

| 리스크 | 완화 |
|---|---|
| 외부 P5~P7이 `X-Frame-Options: DENY` 반환 | 발견 시 해당 페이지만 "새 탭 열기" 카드로 폴백. |
| `steam_russia.html`의 Recharts 스타일이 셸 톤과 이질적 | 색 토큰만 수렴, 폰트·레이아웃 보존. 완전 통일은 비목표. |
| Chart.js 원본 스크립트의 캔버스 overflow | safety CSS로 선제 대응, 잔존 시 최소 options 패치. |
| 환율 수동 입력 오타 | 숫자 검증 + 이전 값 유지. 사이드바에 마지막 적용값·일시 작게 표기. |
| P4의 내부 중/러 iframe 경로 변경 | `steam_china.html`/`steam_russia.html` 파일명 고정(스펙에 명시). |

## 13. 다음 단계

1. 사용자 spec 검수 (이 문서).
2. `superpowers:writing-plans` 스킬로 2~5분 단위 실행 계획 작성.
3. `feat/dashboard-shell` 브랜치에서 `superpowers:subagent-driven-development` 플로우로 구현.
4. 각 태스크 완료 시 `superpowers:verification-before-completion` 체크.
5. 통합 후 `superpowers:finishing-a-development-branch` 로 PR/merge.
