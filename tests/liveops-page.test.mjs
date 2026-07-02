import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../pages/liveops.html', import.meta.url), 'utf8');

test('liveops.html follows embed conventions', () => {
  assert.match(html, /class="embed"/);
  assert.match(html, /data-page="liveops"/);
  assert.match(html, /assets\/theme\.css/);
  assert.match(html, /assets\/embed\.js/);
});

test('page uses honorific (존댓말) tone and emphasizes the 5 success conditions', () => {
  assert.match(html, /성공을 가르는 5가지 조건/);
  assert.match(html, /여전히 유효합니다/);
  assert.match(html, /갈립니다/);
  assert.doesNotMatch(html, /attritionChart/); // 개념 그래프 제거됨
});

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
  assert.doesNotMatch(html, /1만\s*명|10,?500명/);
});

test('value + data sections cite whale range and fortnite source', () => {
  assert.match(html, /pocketgamer\.biz\/chart-of-the-week-half-of-in-game-revenue/);
  assert.match(html, /datanami\.com\/2018\/07\/31\/inside-fortnites-massive-data-analytics-pipeline/);
});

test('build-vs-buy section uses Metaplay public figures + market reframed', () => {
  assert.match(html, /metaplay\.io\/blog\/backend-tech-build-or-buy-industry-opinions/);
  assert.match(html, /48%/); assert.match(html, /6%/);
  assert.match(html, /정의/);
});

test('page is insights-faithful: report-focused, no company/team framing', () => {
  assert.match(html, /\[참고\] Live Service 진단 2026/);
  assert.doesNotMatch(html, /자체 퍼블리싱|종합 게임 컴퍼니|개발 스튜디오|Project S|가치 내재화/);
  assert.match(html, /📄 리포트/);
  assert.match(html, /산업 리포트 3종 종합/);
});

test('the three source reports are cited with IQPC deep links', () => {
  assert.match(html, /iqpc\.com\/events-live-service-gaming-summit\/downloads\/state-of-live-service-gaming-2026-industry-report/);
  assert.match(html, /iqpc\.com\/events-live-service-gaming-summit\/downloads\/industry-report-whats-next-for-live-service-gaming/);
  assert.match(html, /iqpc\.com\/events-live-service-gaming-summit\/downloads\/main-report-live-service-games-key-post-launch-strategies/);
});

test('recent 2025-26 cases are cited with deep links (fact-checked)', () => {
  assert.match(html, /kotaku\.com\/highguard-shutting-down/);         // Highguard
  assert.match(html, /thegamer\.com\/2025-live-service-games-player-analysis/); // 19종 이탈
  assert.match(html, /gamerant\.com\/games-shut-down-2026-list/);      // 52종 종료
  assert.match(html, /marvel\.com\/articles\/games\/marvel-rivals/);   // Marvel Rivals 성공
});

test('data-driven operation is emphasized as the foundation', () => {
  assert.match(html, /관통하는 단 하나의 전제/);
  assert.match(html, /핵심 전제/);
});
