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
