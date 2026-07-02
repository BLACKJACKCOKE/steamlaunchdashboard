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
