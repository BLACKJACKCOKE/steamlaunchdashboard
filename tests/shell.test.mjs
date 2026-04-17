import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../assets/shell.js', import.meta.url), 'utf8');

test('shell.js exports routing table mapping hashes to page configs', () => {
  assert.match(source, /p0/);
  assert.match(source, /p1/);
  assert.match(source, /p2/);
  assert.match(source, /p3/);
  assert.match(source, /p4/);
  assert.match(source, /p5/);
  assert.match(source, /p6/);
  assert.match(source, /p7/);
  assert.match(source, /appendix/);
});

test('shell.js references both internal and external iframe sources', () => {
  assert.match(source, /pages\/p1\.html/);
  assert.match(source, /project-s-dashboard\.pages\.dev/);
  assert.match(source, /pub-4710a252be1249c58617eed8ea869738\.r2\.dev/);
  assert.match(source, /fps-dashboard\.misty-haze-7fc4\.workers\.dev/);
});

test('shell.js validates rate input (number, positive, finite)', () => {
  assert.match(source, /Number\.isFinite/);
  assert.match(source, />\s*0/);
});

test('shell.js reads/writes to localStorage under projectS.rate', () => {
  assert.match(source, /localStorage/);
  assert.match(source, /projectS\.rate/);
});

test('shell.js persists sidebar collapsed state under projectS.sidebar', () => {
  assert.match(source, /projectS\.sidebar/);
});

test('shell.js broadcasts via postMessage with same-origin target', () => {
  assert.match(source, /postMessage/);
  assert.match(source, /location\.origin/);
});

test('shell.js listens for hashchange', () => {
  assert.match(source, /hashchange/);
});
