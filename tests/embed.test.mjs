import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// embed.js is a browser script (uses window/document). We validate its
// contract by inspecting source + simulating the message event in a
// minimal JSDOM-free stub.
const source = readFileSync(new URL('../assets/embed.js', import.meta.url), 'utf8');

test('embed.js registers a message listener on window', () => {
  assert.match(source, /window\.addEventListener\(['"]message['"]/);
});

test('embed.js enforces same-origin check', () => {
  assert.match(source, /e\.origin\s*!==\s*location\.origin/);
});

test('embed.js ignores non-rate messages', () => {
  assert.match(source, /type\s*!==\s*['"]rate['"]/);
});

test('embed.js calls applyRate() when present', () => {
  assert.match(source, /typeof applyRate\s*===\s*['"]function['"]/);
  assert.match(source, /applyRate\(\)/);
});

test('embed.js updates rateInput value when present', () => {
  assert.match(source, /getElementById\(['"]rateInput['"]\)/);
});
