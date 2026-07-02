# 자체 퍼블리싱 LiveOps 페이지 — 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Steam 론칭 대시보드에 "자체 퍼블리싱 LiveOps → 종합 게임 컴퍼니 도약" 전략 페이지(`#liveops`)를 P0 다음 두 번째 nav로 추가한다.

**Architecture:** 기존 shell(index.html) + iframe 구조 유지. 신규 내부 페이지 `pages/liveops.html`(자체 head + theme.css 토큰 + 인라인 style + Chart.js) 추가, `assets/shell.js` ROUTES에 `liveops` 등록, `index.html` nav에 P0 다음 삽입 후 후속 항목 nav-idx 재번호. 모든 정량 수치는 검증된 1차 출처 직링크 부착(fact-check 게이트).

**Tech Stack:** 정적 HTML/CSS/JS · Chart.js 4.4.4 + chartjs-plugin-datalabels 2.2.0 (CDN) · Node 빌트인 테스트 러너(`node --test`).

**정본 참조:** 설계서 [[2026-07-02_liveops-page-spec]] (§7 검증 데이터 = 아래 EVIDENCE 표).

**작업 위치:** `steamlaunchdashboard` repo. scratchpad clone은 리셋 위험 → 구현 세션 시작 시 `git clone` 후 작업, 완료마다 commit·push(main = 자동 배포). 본 계획+spec을 repo `docs/superpowers/`로 먼저 복사·commit.

---

## EVIDENCE (게재 허용 데이터 — 이 값·링크만 사용)

| 키 | 값(정확 표기) | 직링크 |
|---|---|---|
| Concord 최고 동접 | 697명 (2024-08-23) | https://steamdb.info/app/2443720/charts/ |
| Payday 3 이탈 | 첫 30일 약 −90% (피크 77,938 → 약 8,444) | https://steamdb.info/app/1272080/charts/ |
| Bungie 손상차손 | 누적 약 7.65억 달러 ($200M+$565M, Sony FY2025, 2026-05-08) | https://www.forbes.com/sites/paultassi/2026/05/08/sony-backs-marathon-even-after-765-million-in-bungie-impairment-losses/ |
| Marathon 동접 | 최고 88,337명(2026-03-06) → 출시 피크의 15% 미만으로 하락 | https://steamdb.info/app/3065800/charts/ |
| 구작 플레이타임 | 6년+ 된 게임이 플레이타임 61% (Newzoo 2024 · 2025년 55%로 수정, 병기) | https://gameworldobserver.com/2024/04/03/newzoo-pc-console-market-report-revenue-playtime-growth |
| 결제 편중 | 극소수(0.15~수 %)가 게임 매출의 약 50% (출처별 상이 → 범위) | https://www.pocketgamer.biz/chart-of-the-week-half-of-in-game-revenue-generated-by-just-015-of-players/ |
| Fortnite 데이터 | 분당 9,200만 이벤트 처리(약 540억/일, 2018) | https://www.datanami.com/2018/07/31/inside-fortnites-massive-data-analytics-pipeline/ |
| 직접 vs 사서 | 외부 기술 주로 채택 48% · 자체 구축 6% · 개발비 절감 기대 63% (Metaplay, 154개 스튜디오) | https://www.metaplay.io/blog/backend-tech-build-or-buy-industry-opinions |

**금지 수치(게재 불가):** "+30% 유지율", "데이터 팀 32%", "인프라 투자 63%"(오해), "크로스플레이 80% 절감", "월 1~5% 손실 80%", "2023 정리해고 1만명", 시장규모 "$321B"·"$13.7B→$22.4B"·"$12.3B→$18.7B". 시장 규모는 재서술 문장만 사용(범위+정의 병기).

---

## File Structure

- Create: `pages/liveops.html` — 신규 전략 페이지(7섹션, embed 규약, Chart.js).
- Modify: `assets/shell.js` — ROUTES에 `liveops` 추가(P0 다음 순서).
- Modify: `index.html` — nav에 P0 다음 `liveops` 항목 삽입 + 후속 nav-idx/data-short 재번호.
- Modify: `tests/shell.test.mjs` — `liveops` 라우트·페이지 매핑 단언 추가.
- Create: `tests/liveops-page.test.mjs` — embed 마커 + 채택 직링크 8종 존재 + 금지 수치 미포함(게이트 자동 검증).
- Copy: 본 plan + spec → `docs/superpowers/plans/`, `docs/superpowers/specs/`.

---

## Task 0: 작업 환경 · 베이스라인

**Files:** (none — setup)

- [ ] **Step 1: repo 클론 & 기존 테스트 통과 확인**

```bash
git clone https://github.com/BLACKJACKCOKE/steamlaunchdashboard.git
cd steamlaunchdashboard
node --test 'tests/*.test.mjs'
```
Expected: 기존 12개 테스트 PASS (baseline green).

- [ ] **Step 2: 설계 문서 이식 & 커밋**

```bash
mkdir -p docs/superpowers/plans docs/superpowers/specs
# (vault의 2026-07-02_liveops-page-spec.md → docs/superpowers/specs/2026-07-02-liveservice-selfpublishing-page-design.md)
# (vault의 2026-07-02_liveops-page-plan.md → docs/superpowers/plans/2026-07-02-liveservice-selfpublishing-page.md)
git checkout -b feat/liveops-page
git add docs/superpowers
git commit -m "docs: add liveops self-publishing page spec + plan"
```

---

## Task 1: 라우트 + 네비게이션 등록

**Files:**
- Modify: `assets/shell.js` (ROUTES 객체, `p0` 다음)
- Modify: `index.html` (nav, `#p0` 항목 다음)
- Modify: `tests/shell.test.mjs`

- [ ] **Step 1: 실패 테스트 작성** — `tests/shell.test.mjs` 하단에 추가

```js
test('shell.js registers the liveops strategic page route', () => {
  assert.match(source, /liveops:\s*\{[^}]*pages\/liveops\.html/);
  assert.match(source, /자체 퍼블리싱 LiveOps/);
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test tests/shell.test.mjs`
Expected: FAIL — liveops 라우트 없음.

- [ ] **Step 3: shell.js ROUTES에 liveops 추가** — `p0` 항목 바로 다음 줄에 삽입

```js
    p0:       { title: 'Flywheel',                     src: 'pages/p0.html',       internal: true,  num: 'P0' },
    liveops:  { title: '자체 퍼블리싱 LiveOps',         src: 'pages/liveops.html',  internal: true,  num: 'P8' },
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test tests/shell.test.mjs`
Expected: PASS (신규 + 기존 라우트 테스트 모두).

- [ ] **Step 5: index.html nav 삽입 + 재번호** — `#p0` 항목 다음에 삽입하고, 이후 항목들의 `data-short`/`nav-idx`를 02→03…10으로 재번호

```html
    <a class="nav-item" href="#p0"       data-route="p0"       data-short="01"><span class="nav-idx">01</span><span class="nav-label">Flywheel</span></a>
    <a class="nav-item" href="#liveops"  data-route="liveops"  data-short="02"><span class="nav-idx">02</span><span class="nav-label">자체 퍼블리싱 LiveOps</span></a>
    <a class="nav-item" href="#p1"       data-route="p1"       data-short="03"><span class="nav-idx">03</span><span class="nav-label">글로벌 게임 마켓</span></a>
    <a class="nav-item" href="#p2"       data-route="p2"       data-short="04"><span class="nav-idx">04</span><span class="nav-label">스팀 마켓</span></a>
    <a class="nav-item" href="#p3"       data-route="p3"       data-short="05"><span class="nav-idx">05</span><span class="nav-label">마일스톤</span></a>
    <a class="nav-item" href="#p4"       data-route="p4"       data-short="06"><span class="nav-idx">06</span><span class="nav-label">스팀 정책 & 리스크</span></a>
    <a class="nav-item" href="#p5"       data-route="p5"       data-short="07"><span class="nav-idx">07</span><span class="nav-label">Pain Point 분석</span></a>
    <a class="nav-item" href="#p6"       data-route="p6"       data-short="08"><span class="nav-idx">08</span><span class="nav-label">BM 분석</span></a>
    <a class="nav-item" href="#p7"       data-route="p7"       data-short="09"><span class="nav-idx">09</span><span class="nav-label">경쟁작 캘린더</span></a>
    <a class="nav-item" href="#ccu-calculator" data-route="ccu-calculator" data-short="10"><span class="nav-idx">10</span><span class="nav-label">CCU 계산기</span></a>
```

- [ ] **Step 6: 커밋**

```bash
git add assets/shell.js index.html tests/shell.test.mjs
git commit -m "feat: register liveops route + promote to 2nd nav slot"
```

---

## Task 2: liveops.html 스캐폴드 (embed 규약)

**Files:**
- Create: `pages/liveops.html`
- Create: `tests/liveops-page.test.mjs`

- [ ] **Step 1: 실패 테스트 작성** — `tests/liveops-page.test.mjs`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../pages/liveops.html', import.meta.url), 'utf8');

test('liveops.html follows embed conventions', () => {
  assert.match(html, /class="embed"/);
  assert.match(html, /data-page="liveops"/);
  assert.match(html, /assets\/theme\.css/);
  assert.match(html, /assets\/embed\.js/);
  assert.match(html, /chart\.js@4\.4\.4/);
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test tests/liveops-page.test.mjs`
Expected: FAIL — 파일 없음.

- [ ] **Step 3: 스캐폴드 작성** — `pages/liveops.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width,initial-scale=1.0" name="viewport"/>
<title>자체 퍼블리싱 LiveOps — 종합 게임 컴퍼니 도약</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
<link rel="stylesheet" href="../assets/theme.css">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text-h);line-height:1.65}
.sec{padding:44px 40px;max-width:1180px;margin:0 auto}
.sec+.sec{border-top:1px solid var(--border)}
.sn{font-size:11px;font-weight:700;letter-spacing:2px;color:var(--accent);text-transform:uppercase;margin-bottom:4px}
.stt{font-size:21px;font-weight:800;margin-bottom:6px;letter-spacing:-.01em}
.ss{font-size:13px;color:var(--text-sub2);margin-bottom:22px}
.hero{background:linear-gradient(135deg,#4f46e5,#4338ca);color:#fff;border-radius:var(--radius);padding:34px 32px}
.hero h1{font-size:26px;font-weight:800;line-height:1.35;letter-spacing:-.02em}
.hero .subs{display:flex;flex-wrap:wrap;gap:12px;margin-top:18px}
.hero .subs div{flex:1 1 240px;background:rgba(255,255,255,.12);border-radius:10px;padding:12px 14px;font-size:13px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.statwall{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.stat{background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;box-shadow:var(--shadow)}
.stat .v{font-size:24px;font-weight:800;line-height:1.1}
.stat .l{font-size:12px;color:var(--text-sub1);margin-top:4px}
.stat a.src{font-size:11px;color:var(--accent);text-decoration:none;display:inline-block;margin-top:6px}
.stat a.src:hover{text-decoration:underline}
.why{list-style:none;display:flex;flex-direction:column;gap:8px;margin-top:14px}
.why li{background:var(--card-bg2);border-left:3px solid var(--red);border-radius:0 8px 8px 0;padding:9px 13px;font-size:13px;color:var(--text-sub1)}
.attr{background:var(--card-bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:18px}
.chart-wrap{position:relative;height:300px}
.col{background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius);padding:18px}
.col h4{font-size:14px;font-weight:800;margin-bottom:10px}
.col.ext{border-top:4px solid var(--red)}
.col.own{border-top:4px solid var(--green)}
table.cmp{width:100%;border-collapse:collapse;font-size:13px}
table.cmp th,table.cmp td{border:1px solid var(--border);padding:8px 10px;text-align:left}
table.cmp th{background:var(--card-bg);font-weight:700}
.chk{list-style:none;display:flex;flex-direction:column;gap:8px}
.chk li{background:var(--card-bg2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-size:13px}
.note{font-size:11px;color:var(--text-src);margin-top:8px}
a.inline{color:var(--accent);text-decoration:none}a.inline:hover{text-decoration:underline}
</style>
</head>
<body class="embed" data-page="liveops">

<!-- ① 결론 -->
<section class="sec" id="s1"><div class="hero"></div></section>
<!-- ② 냉혹한 진단 -->
<section class="sec" id="s2"></section>
<!-- ③ 가치 귀속 -->
<section class="sec" id="s3"></section>
<!-- ④ 데이터 -->
<section class="sec" id="s4"></section>
<!-- ⑤ 인프라 -->
<section class="sec" id="s5"></section>
<!-- ⑥ 사서 쓰기 vs 직접 -->
<section class="sec" id="s6"></section>
<!-- ⑦ Project S -->
<section class="sec" id="s7"></section>

<script src="../assets/embed.js"></script>
</body>
</html>
```

- [ ] **Step 4: 통과 확인**

Run: `node --test tests/liveops-page.test.mjs`
Expected: PASS.

- [ ] **Step 5: 커밋**

```bash
git add pages/liveops.html tests/liveops-page.test.mjs
git commit -m "feat: scaffold liveops.html with embed conventions"
```

---

## Task 3: ① 결론 + ② 냉혹한 진단 (히어로1)

**Files:** Modify `pages/liveops.html` (`#s1`, `#s2`), `tests/liveops-page.test.mjs`

- [ ] **Step 1: 게이트 테스트 추가** — `tests/liveops-page.test.mjs`

```js
test('diagnosis section cites verified primary sources with deep links', () => {
  assert.match(html, /steamdb\.info\/app\/2443720\/charts\//); // Concord
  assert.match(html, /steamdb\.info\/app\/1272080\/charts\//); // Payday 3
  assert.match(html, /forbes\.com\/sites\/paultassi\/2026\/05\/08\/sony-backs-marathon/); // Bungie
  assert.match(html, /steamdb\.info\/app\/3065800\/charts\//); // Marathon
  assert.match(html, /697/);
});
test('page does not contain removed/unverifiable stats', () => {
  assert.doesNotMatch(html, /\+?30%\s*(더|higher)?\s*유지율/);
  assert.doesNotMatch(html, /32%/);
  assert.doesNotMatch(html, /80%\+?\s*절감/);
  assert.doesNotMatch(html, /\$?321\s*B|3,?210억/);
  assert.doesNotMatch(html, /1만\s*명|10,?500명/); // D5 제거
});
```

- [ ] **Step 2: 실패 확인** — Run: `node --test tests/liveops-page.test.mjs` → FAIL (링크 없음).

- [ ] **Step 3: ①②  구현** — `#s1` hero div 내부 + `#s2` 채움

```html
<!-- #s1 .hero 내부 -->
<h1>이미 성공시킨 라이브 서비스, 이제 자체 퍼블리싱으로 그 가치를 회사가 가진다.</h1>
<div class="subs">
  <div><b>도약</b><br>개발 스튜디오 → 종합 게임 컴퍼니</div>
  <div><b>관건</b><br>"할지"가 아니라 "데이터·인프라를 소유할지"</div>
  <div><b>전제</b><br>이 시장은 냉혹하다 — 그래서 데이터·인프라는 협상 불가</div>
</div>
```

```html
<!-- #s2 -->
<div class="sn">냉혹한 진단</div>
<div class="stt">라이브 서비스는 어렵다 — 실패는 자금이 아니라 운영 준비성에서 온다</div>
<div class="ss">아래는 최근 대형 라이브 서비스가 어떻게 무너졌는지를 보여준다. 공통 원인은 시장 선택이 아니라 준비 없는 자체 운영이다.</div>
<div class="attr"><div class="chart-wrap"><canvas id="attritionChart"></canvas></div>
  <div class="note">출시 시점 최고 동시접속을 100으로 정규화한 잔존 추이(개념 비교). 원자료: SteamDB.</div></div>
<div class="statwall">
  <div class="stat"><div class="v" style="color:var(--red)">697명</div><div class="l">Concord 최고 동시접속 — 무료 경쟁 시장에 유료로 출시, 개발 8년, 2024년 10월 종료</div><a class="src" href="https://steamdb.info/app/2443720/charts/" target="_blank" rel="noopener">↗ SteamDB</a></div>
  <div class="stat"><div class="v" style="color:var(--red)">−90%</div><div class="l">Payday 3 첫 30일 동시접속 감소(피크 77,938 → 약 8,444) — 출시 서버·매칭 실패</div><a class="src" href="https://steamdb.info/app/1272080/charts/" target="_blank" rel="noopener">↗ SteamDB</a></div>
  <div class="stat"><div class="v" style="color:var(--red)">7.65억$</div><div class="l">소니의 Bungie 인수 관련 누적 손상차손 — Destiny 2·Marathon 부진의 회계적 귀결(2026-05)</div><a class="src" href="https://www.forbes.com/sites/paultassi/2026/05/08/sony-backs-marathon-even-after-765-million-in-bungie-impairment-losses/" target="_blank" rel="noopener">↗ Forbes</a></div>
  <div class="stat"><div class="v" style="color:var(--red)">88,337 → &lt;15%</div><div class="l">Marathon 출시 최고 동시접속(2026-03-06)이 몇 주 만에 출시 피크의 15% 미만으로 붕괴</div><a class="src" href="https://steamdb.info/app/3065800/charts/" target="_blank" rel="noopener">↗ SteamDB</a></div>
</div>
<ul class="why">
  <li>성공은 소수 타이틀·회사에 집중된다 — 높은 수익에는 높은 리스크가 따른다.</li>
  <li>신규 게임이 유저의 시간을 얻기 어렵다 — 2024년 조사에서 6년 넘은 게임이 전체 플레이타임의 61%를 차지했다(이후 55%로 수정, <a class="inline" href="https://gameworldobserver.com/2024/04/03/newzoo-pc-console-market-report-revenue-playtime-growth" target="_blank" rel="noopener">Newzoo↗</a>).</li>
  <li>라이브 운영은 게임 개발과 별개의 난이도다 — 새로운 인프라·도구·전문 인력이 필요하고 모두 비용이 든다.</li>
  <li>콘텐츠가 멈추면 게임은 빠르게 죽는다 — 지속 가능한 업데이트 주기가 생존 조건이다.</li>
  <li>남의 성공 공식을 전략 없이 모방하는 것이 가장 위험하다.</li>
</ul>
```

- [ ] **Step 4: 이탈 곡선 차트 스크립트** — `</body>` 앞 `<script src="../assets/embed.js">` **위**에 삽입

```html
<script>
new Chart(document.getElementById('attritionChart'), {
  type: 'line',
  data: {
    labels: ['출시','1주','2주','3주','4주','5주','6주','7주'],
    datasets: [
      { label: 'Payday 3 (잔존 %)', data: [100,55,35,22,10,9,8,8], borderColor: getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim(), tension:.35, fill:false },
      { label: 'Marathon (잔존 %)', data: [100,60,42,30,22,17,15,14], borderColor: getComputedStyle(document.documentElement).getPropertyValue('--chart-5').trim(), tension:.35, fill:false }
    ]
  },
  options: {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{position:'bottom'}, datalabels:{display:false},
      title:{display:true, text:'출시 후 동시접속 잔존율(출시 피크=100)'} },
    scales:{ y:{ min:0, max:100, ticks:{callback:v=>v+'%'} } }
  }
});
</script>
```
Note: 값은 SteamDB 공개 곡선의 개념 정규화(캡션 명시). Payday 3 4주 ≈10%(−90%), Marathon 7주 <15% 반영.

- [ ] **Step 5: 게이트 테스트 통과 확인** — Run: `node --test tests/liveops-page.test.mjs` → PASS.

- [ ] **Step 6: 커밋** — `git add -A && git commit -m "feat: liveops sections ① conclusion + ② diagnosis (attrition chart + sourced stat wall)"`

---

## Task 4: ③ 가치 귀속(히어로2) + ④ 데이터

**Files:** Modify `pages/liveops.html` (`#s3`,`#s4`), `tests/liveops-page.test.mjs`

- [ ] **Step 1: 게이트 테스트 추가**

```js
test('value + data sections cite whale range and fortnite source', () => {
  assert.match(html, /pocketgamer\.biz\/chart-of-the-week-half-of-in-game-revenue/);
  assert.match(html, /datanami\.com\/2018\/07\/31\/inside-fortnites-massive-data-analytics-pipeline/);
});
```

- [ ] **Step 2: 실패 확인** — `node --test tests/liveops-page.test.mjs` → FAIL.

- [ ] **Step 3: ③④ 구현**

```html
<!-- #s3 -->
<div class="sn">왜 자체 퍼블리싱인가</div>
<div class="stt">같은 성공이라도, 가치가 누구에게 귀속되는가가 다르다</div>
<div class="ss">외부 퍼블리싱은 매출 배분·유저 관계·데이터·유통 통제가 외부로 귀속된다. 자체 퍼블리싱은 그 가치를 회사가 내재화하고, 개발과 퍼블리싱을 함께 갖춘 회사로 만든다.</div>
<div class="grid2">
  <div class="col ext"><h4>외부 퍼블리싱</h4><ul class="why" style="margin-top:0">
    <li>매출의 상당 부분이 배분으로 유출</li><li>유저 관계·계정을 퍼블리셔가 보유</li><li>플레이어 데이터 접근·통제가 제한</li><li>유통·마케팅 의사결정권이 외부</li></ul></div>
  <div class="col own"><h4>자체 퍼블리싱</h4><ul class="why" style="margin-top:0">
    <li style="border-left-color:var(--green)">매출을 회사가 직접 확보</li><li style="border-left-color:var(--green)">유저 관계·데이터를 회사가 소유</li><li style="border-left-color:var(--green)">지속 매출·IP가 회사 자산으로 축적</li><li style="border-left-color:var(--green)">개발+퍼블리싱 겸비 = 종합 게임 컴퍼니</li></ul></div>
</div>
<div class="statwall" style="margin-top:16px">
  <div class="stat"><div class="v" style="color:var(--green)">약 50%</div><div class="l">게임 매출의 절반가량을 극소수(0.15~수 %) 결제 유저가 만든다 — 유저 관계를 회사가 쥐어야 하는 이유(비율은 출처별 상이)</div><a class="src" href="https://www.pocketgamer.biz/chart-of-the-week-half-of-in-game-revenue-generated-by-just-015-of-players/" target="_blank" rel="noopener">↗ PocketGamer/Swrve</a></div>
</div>

<!-- #s4 -->
<div class="sn">감이 아니라 데이터</div>
<div class="stt">자체 퍼블리싱은 플레이어 데이터를 회사가 소유하고, 가정이 아니라 데이터로 운영한다는 뜻</div>
<div class="ss">경쟁 우위는 데이터를 모으는 데서 오지 않고, 측정→결정→개선의 운영 흐름에 데이터를 통합하는 데서 온다.</div>
<div class="statwall" style="margin-bottom:14px">
  <div class="stat"><div class="v">9,200만/분</div><div class="l">Fortnite가 처리하는 분당 이벤트(약 540억/일, 2018) — 데이터가 곧 운영 역량이 된 사례</div><a class="src" href="https://www.datanami.com/2018/07/31/inside-fortnites-massive-data-analytics-pipeline/" target="_blank" rel="noopener">↗ Datanami</a></div>
</div>
<table class="cmp"><thead><tr><th>측정</th><th>결정</th><th>개선</th></tr></thead>
<tbody><tr><td>계측 데이터·플레이테스트·접속 로그·커뮤니티·A/B 테스트</td><td>대시보드·세그먼트 분석으로 무엇을 고칠지 판단</td><td>패치·이벤트·밸런스 반영 후 다시 측정(반복 루프)</td></tr></tbody></table>
```

- [ ] **Step 4: 통과 확인 + 커밋** — `node --test tests/liveops-page.test.mjs` PASS → `git add -A && git commit -m "feat: liveops sections ③ value attribution + ④ data-driven"`

---

## Task 5: ⑤ 인프라 + ⑥ 사서 쓰기 + ⑦ Project S + 시장 재서술

**Files:** Modify `pages/liveops.html` (`#s5`,`#s6`,`#s7`), `tests/liveops-page.test.mjs`

- [ ] **Step 1: 게이트 테스트 추가**

```js
test('build-vs-buy section uses Metaplay public figures + market reframed', () => {
  assert.match(html, /metaplay\.io\/blog\/backend-tech-build-or-buy-industry-opinions/);
  assert.match(html, /48%/); assert.match(html, /6%/);
  assert.match(html, /정의/); // 시장규모 정의 병기 문구 존재
});
```

- [ ] **Step 2: 실패 확인** — FAIL.

- [ ] **Step 3: ⑤⑥⑦ 구현**

```html
<!-- #s5 -->
<div class="sn">데이터를 성립시키는 인프라</div>
<div class="stt">퍼블리셔가 대신 운영하던 스택을, 이제 회사가 소유한다</div>
<div class="ss">백엔드 가동성은 곧 매출 연속성이다. 라이브 운영은 DLC와 근본적으로 다르며, 별도의 인프라를 요구한다. Payday 3와 Marathon의 붕괴(②)가 이 부재의 대가를 보여준다.</div>
<ul class="chk">
  <li><b>서버 확장</b> — 동시접속 급증에도 끊기지 않는 동적 확장</li>
  <li><b>매치메이킹</b> — 대기·불균형은 곧 이탈</li>
  <li><b>상시 업데이트 파이프라인</b> — 전체 패치 없이 서버측으로 이벤트·경제 조정</li>
  <li><b>24시간 모니터링·장애 대응</b> — 문제를 조기에 발견·복구</li>
</ul>

<!-- #s6 -->
<div class="sn">부담이 아니라 지렛대</div>
<div class="stt">전부 직접 만들 필요는 없다 — 인프라·도구는 사서 쓰고, 데이터·유저 관계만 회사가 소유</div>
<div class="ss">업계 다수가 백엔드를 직접 구축하지 않는다. 인프라를 지렛대로 삼으면 자체 퍼블리싱 전환의 부담이 낮아진다.</div>
<table class="cmp"><thead><tr><th>선택</th><th>장점</th><th>적합</th></tr></thead><tbody>
  <tr><td>직접 구축</td><td>완전한 통제·맞춤</td><td>대규모·고유 요구</td></tr>
  <tr><td><b>사서 쓰기(권장 다수)</b></td><td>빠른 구축·비용 효율·전담 지원</td><td>운영 소유는 원하되 스택 전부는 부담일 때</td></tr>
  <tr><td>혼합</td><td>핵심 데이터는 내부, 범용은 외부</td><td>데이터·유저 관계 소유 + 효율</td></tr>
</tbody></table>
<div class="statwall" style="margin-top:14px">
  <div class="stat"><div class="v">48% · 6%</div><div class="l">외부 기술을 주로 채택 48% vs 자체 구축 6% — 63%는 외부 기술로 개발비 절감을 기대(154개 스튜디오 조사)</div><a class="src" href="https://www.metaplay.io/blog/backend-tech-build-or-buy-industry-opinions" target="_blank" rel="noopener">↗ Metaplay</a></div>
</div>

<!-- #s7 -->
<div class="sn">Project S 적용</div>
<div class="stt">자체 퍼블리싱 도약을 실제로 성립시키기 위한 준비</div>
<div class="ss">아래는 산업 근거에서 도출한 준비 항목이다. 세부 수치·일정 등 미확정 정보는 포함하지 않는다.</div>
<ul class="chk">
  <li>론칭 전에 데이터 인프라(계측 이벤트 정의·대시보드)를 미리 준비한다.</li>
  <li>인프라·도구의 직접 구축 vs 사서 쓰기를 결정한다(데이터·유저 관계는 회사가 소유).</li>
  <li>테스트를 우선순위화한다 — 늦은 테스트는 검증이 아니라 시연에 그친다.</li>
  <li>무엇을 데이터로 확인하고 개선할지 운영 지표를 사전에 정의한다.</li>
</ul>
<p class="note">시장 규모 참고: 라이브 서비스/GaaS 시장 추정치는 조사기관별로 약 60~130억 달러(2025~26)로 상이하며, 전체 게임 시장은 약 1,880~2,050억 달러(Newzoo)로 추정된다. 상위 퍼블리셔 매출의 다수가 라이브 서비스에서 나온다(Midia). 정의(GaaS 시장 vs 라이브 서비스 매출 비중 vs 전체 시장)가 다르므로 단일 절대값으로 단정하지 않는다.</p>
```

- [ ] **Step 4: 통과 확인 + 커밋** — `node --test tests/liveops-page.test.mjs` PASS → `git add -A && git commit -m "feat: liveops sections ⑤ infra + ⑥ build-vs-buy + ⑦ project S + market reframe"`

---

## Task 6: 전체 검증 + 렌더 확인 + 배포

**Files:** (verification)

- [ ] **Step 1: 전체 테스트** — Run: `node --test 'tests/*.test.mjs'` → 기존 12 + 신규 전부 PASS.

- [ ] **Step 2: 로컬 렌더 확인**

```bash
python3 -m http.server 8000
# 브라우저: http://localhost:8000/#liveops
```
확인: nav 2번째에 "자체 퍼블리싱 LiveOps" 활성 · 7섹션 렌더 · 이탈 곡선 차트 표시 · 모든 stat 카드의 ↗ 링크 클릭 시 1차 출처로 이동 · 다른 페이지(#p1~#p7,#ccu-calculator) 정상.

- [ ] **Step 3: 게이트 최종 확인** — 페이지 내 모든 정량 수치에 직링크가 있는지 육안 + 테스트로 확인. 금지 수치(§EVIDENCE) 미포함 확인.

- [ ] **Step 4: 병합·배포**

```bash
git checkout main && git merge --no-ff feat/liveops-page -m "feat: add self-publishing LiveOps strategic page (#liveops)"
git push origin main   # Cloudflare Pages 자동 배포
```

- [ ] **Step 5: 배포 확인** — https://steamlaunchdashboard.pages.dev/#liveops 렌더·직링크 동작 확인.

---

## Self-Review (계획 작성자 체크)

- **Spec 커버리지**: §4 7섹션 → Task 3~5 전부 매핑 ✓ / §5 통합(라우트·nav) → Task 1 ✓ / §7 evidence·게이트 → Task 3~5 게이트 테스트 ✓ / §8 테스트 → Task 1·2·6 ✓.
- **Placeholder 스캔**: 각 코드 스텝에 실제 코드·데이터·링크 포함. TODO/TBD 없음 ✓.
- **타입/이름 일관성**: 라우트 key `liveops`, 페이지 `pages/liveops.html`, 캔버스 id `attritionChart`, 테스트 파일 `tests/liveops-page.test.mjs` 전 태스크 일치 ✓.
- **주의**: 이탈 곡선 수치는 SteamDB 공개 곡선의 개념 정규화(캡션 명시) — 정확 시계열이 필요하면 SteamDB 스냅샷으로 대체. Newzoo 61%는 55% 수정 병기 필수.
