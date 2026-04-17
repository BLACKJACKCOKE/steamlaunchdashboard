# Project S 스팀 론칭 대시보드 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an 8-page executive Steam launch dashboard on Cloudflare Pages that wraps the existing P1~P4 + Appendix HTML files in a shared shell (sidebar + header + currency UI) and iframes external P5~P7.

**Architecture:** Static `index.html` shell hosts a single `<iframe>` whose `src` is swapped via URL hash routing. Internal pages (P1~P4, Appendix, china, russia) are same-origin and receive currency values via `postMessage`. External P5~P7 are cross-origin iframes sized to viewport. Originals are moved to `pages/` and touched with a 3-line injection only (theme.css link + `body class="embed"` + embed.js script).

**Tech Stack:** Vanilla HTML + CSS + JS, Chart.js (already embedded in originals), Node 24 built-in test runner (`node --test`) for pure-JS unit tests, `python3 -m http.server` for local verification, Cloudflare Pages for hosting.

**Spec:** `docs/superpowers/specs/2026-04-17-project-s-dashboard-design.md`

---

## File Structure

**Create:**
- `index.html` — shell (sidebar + header + iframe)
- `assets/theme.css` — common design tokens + `body.embed` overrides
- `assets/shell.css` — sidebar/header/main layout
- `assets/shell.js` — hash routing + currency broadcast + sidebar toggle
- `assets/embed.js` — postMessage listener injected into every internal page
- `_headers` — Cloudflare Pages CSP + security headers
- `tests/shell.test.mjs` — unit tests for pure JS logic
- `README.md` — updated run/deploy instructions (overwrite existing 1-line README)

**Move (git mv, preserves history):**
- `p1_projectsdashboard_gamemarketbigpicture_final.html` → `pages/p1.html`
- `p2_projectsdashboard_steamdeepdive_final.html` → `pages/p2.html`
- `p3_projectsdashboard_milestone_final.html` → `pages/p3.html`
- `p4_projectsdashboard_steampolicyrisk_final.html` → `pages/p4.html`
- `appendix_ccu_calculator.html` → `pages/appendix.html`
- `steam_china.html` → `pages/steam_china.html` (name preserved — P4 hardcodes this path)
- `steam_russia.html` → `pages/steam_russia.html` (name preserved)

**Modify (3-line injection per file — exact line numbers in tasks):**
All 7 `pages/*.html` get `theme.css` link + `body class="embed"` + `embed.js` script.

---

## Task 1: Create feature branch and directory scaffolding

**Files:**
- Create dir: `assets/`
- Create dir: `pages/`
- Create dir: `tests/`

- [ ] **Step 1: Create branch**

```bash
cd /workspaces/steamlaunchdashboard
git checkout -b feat/dashboard-shell
```

- [ ] **Step 2: Create directories**

```bash
mkdir -p assets pages tests
```

- [ ] **Step 3: Verify**

```bash
ls -d assets pages tests
```
Expected: three lines `assets`, `pages`, `tests`.

- [ ] **Step 4: Commit**

```bash
git add -A
git status
# should show only the three empty dirs — git won't track empties, so skip commit if no changes
```
If `git status` shows nothing, proceed to Task 2 without committing. Empty dirs are not tracked.

---

## Task 2: Move originals into `pages/`

**Files:**
- Move: `p1_projectsdashboard_gamemarketbigpicture_final.html` → `pages/p1.html`
- Move: `p2_projectsdashboard_steamdeepdive_final.html` → `pages/p2.html`
- Move: `p3_projectsdashboard_milestone_final.html` → `pages/p3.html`
- Move: `p4_projectsdashboard_steampolicyrisk_final.html` → `pages/p4.html`
- Move: `appendix_ccu_calculator.html` → `pages/appendix.html`
- Move: `steam_china.html` → `pages/steam_china.html`
- Move: `steam_russia.html` → `pages/steam_russia.html`

- [ ] **Step 1: Move files with git**

```bash
git mv p1_projectsdashboard_gamemarketbigpicture_final.html pages/p1.html
git mv p2_projectsdashboard_steamdeepdive_final.html pages/p2.html
git mv p3_projectsdashboard_milestone_final.html pages/p3.html
git mv p4_projectsdashboard_steampolicyrisk_final.html pages/p4.html
git mv appendix_ccu_calculator.html pages/appendix.html
git mv steam_china.html pages/steam_china.html
git mv steam_russia.html pages/steam_russia.html
```

- [ ] **Step 2: Verify**

```bash
ls pages/
```
Expected: 7 files: `appendix.html p1.html p2.html p3.html p4.html steam_china.html steam_russia.html`

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: move P1~P4, Appendix, china, russia into pages/"
```

---

## Task 3: Write `assets/theme.css`

**Files:**
- Create: `assets/theme.css`

- [ ] **Step 1: Write the file**

```css
/* assets/theme.css — common design tokens + embed mode overrides */
:root {
  /* Base palette (locked to existing originals) */
  --bg:#ffffff;
  --card-bg:#f3f4f6;
  --card-bg2:#f9fafb;
  --border:#e5e7eb;
  --text-h:#111827;
  --text-sub1:#374151;
  --text-sub2:#6b7280;
  --text-src:#9ca3af;
  --accent:#4f46e5;
  --green:#16a34a;
  --red:#ef4444;
  --amber:#d97706;
  --purple:#7c3aed;
  --teal:#0f766e;
  --radius:12px;
  --shadow:0 1px 4px rgba(0,0,0,.08);

  /* P2-shorthand aliases (so P2's own :root overrides still work) */
  --c1:var(--card-bg);
  --c2:var(--card-bg2);
  --bd:var(--border);
  --h:var(--text-h);
  --s1:var(--text-sub1);
  --s2:var(--text-sub2);
  --sc:var(--text-src);
  --g:var(--green);
  --r:var(--red);
  --a:var(--accent);

  /* Chart palette (fixed order) */
  --chart-1:#4f46e5;
  --chart-2:#0891b2;
  --chart-3:#16a34a;
  --chart-4:#d97706;
  --chart-5:#ef4444;
  --chart-6:#7c3aed;
}

/* Base typography */
body {
  font-family: Pretendard, 'Apple SD Gothic Neo', 'Segoe UI', system-ui, sans-serif;
}
table, .num, .kv, .kpi-value, tbody td, thead th {
  font-variant-numeric: tabular-nums;
}

/* ─── EMBED MODE: hide each original's own top chrome ─── */
body.embed > header,
body.embed > .top-header,
body.embed > .page-nav,
body.embed > .legend-bar { display:none !important; }
body.embed { padding-top:0 !important; }

/* ─── EMBED MODE: chart overflow + label safety ─── */
body.embed .chart-wrap,
body.embed .chart-card canvas,
body.embed .cd canvas { max-width:100%; height:auto !important; }
body.embed canvas { display:block; max-width:100%; }
body.embed .chart-2col,
body.embed .g2 { overflow:hidden; }
body.embed .tw { overflow-x:auto; }
body.embed .kpi-row { overflow-wrap:anywhere; }
body.embed table { font-variant-numeric: tabular-nums; }

/* ─── RUSSIA-SPECIFIC color convergence (steam_russia.html) ─── */
/* Russia uses Playfair + Recharts with its own palette. Keep layout/fonts,
   shift primary accents to the indigo system so it blends with other pages. */
body.embed[data-page="russia"] h1,
body.embed[data-page="russia"] h2,
body.embed[data-page="russia"] h3 { color: var(--text-h) !important; }
body.embed[data-page="russia"] a { color: var(--accent) !important; }
body.embed[data-page="russia"] .recharts-default-legend *,
body.embed[data-page="russia"] [class*="accent"],
body.embed[data-page="russia"] [class*="primary"] { --primary: var(--accent); }
```

- [ ] **Step 2: Verify file exists and has expected content**

```bash
test -f assets/theme.css && grep -c '^--accent:' assets/theme.css
```
Expected exit 0 and output `1` (one definition of `--accent`).

- [ ] **Step 3: Commit**

```bash
git add assets/theme.css
git commit -m "feat: add shared design tokens and embed-mode overrides (theme.css)"
```

---

## Task 4: Write `assets/embed.js` and its unit test

**Files:**
- Create: `tests/embed.test.mjs`
- Create: `assets/embed.js`

- [ ] **Step 1: Write the failing test**

`tests/embed.test.mjs`:

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node --test tests/embed.test.mjs
```
Expected: FAIL because `assets/embed.js` does not exist.

- [ ] **Step 3: Write `assets/embed.js`**

```javascript
/* assets/embed.js — injected into every internal page.
   Receives currency messages from the parent shell and wires them into
   the page's existing rate input + applyRate() pipeline. */
(function () {
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin) return;
    var msg = e.data;
    if (!msg || msg.type !== 'rate' || typeof msg.value !== 'number') return;
    var input = document.getElementById('rateInput');
    if (input) input.value = msg.value;
    if (typeof applyRate === 'function') applyRate();
  });
})();
```

- [ ] **Step 4: Run test to verify it passes**

```bash
node --test tests/embed.test.mjs
```
Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add assets/embed.js tests/embed.test.mjs
git commit -m "feat: add embed.js currency message receiver with unit tests"
```

---

## Task 5: Inject shared chrome into `pages/p1.html`

**Files:**
- Modify: `pages/p1.html:162-164` (inject `<link>` after `</style>`, add `class="embed"` to `<body>`)
- Modify: `pages/p1.html:1189` (inject `<script src>` before `</body>`)

- [ ] **Step 1: Add theme.css link after `</style>` on line 162**

Edit `pages/p1.html` using Edit tool:
- Old: `  </style>\n</head>\n<body>`
- New: `  </style>\n  <link rel="stylesheet" href="../assets/theme.css">\n</head>\n<body class="embed">`

- [ ] **Step 2: Add embed.js script before `</body>`**

Edit `pages/p1.html`:
- Old: `</body>\n</html>`
- New: `<script src="../assets/embed.js"></script>\n</body>\n</html>`

- [ ] **Step 3: Verify the 3 injections**

```bash
grep -c 'assets/theme.css' pages/p1.html
grep -c '<body class="embed"' pages/p1.html
grep -c 'assets/embed.js' pages/p1.html
```
Expected: each returns `1`.

- [ ] **Step 4: Commit**

```bash
git add pages/p1.html
git commit -m "feat(p1): inject theme.css + embed.js + body.embed"
```

---

## Task 6: Inject shared chrome into `pages/p2.html`

**Files:**
- Modify: `pages/p2.html:178-180`
- Modify: `pages/p2.html:1881`

- [ ] **Step 1: Add theme.css link**

Edit `pages/p2.html`:
- Old: `</style>\n</head>\n<body>`
- New: `</style>\n<link rel="stylesheet" href="../assets/theme.css">\n</head>\n<body class="embed">`

- [ ] **Step 2: Add embed.js script before `</body>`**

Edit `pages/p2.html`:
- Old: `</body>\n</html>`
- New: `<script src="../assets/embed.js"></script>\n</body>\n</html>`

- [ ] **Step 3: Verify**

```bash
grep -c 'assets/theme.css' pages/p2.html
grep -c '<body class="embed"' pages/p2.html
grep -c 'assets/embed.js' pages/p2.html
```
Expected: each returns `1`.

- [ ] **Step 4: Commit**

```bash
git add pages/p2.html
git commit -m "feat(p2): inject theme.css + embed.js + body.embed"
```

---

## Task 7: Inject shared chrome into `pages/p3.html`

**Files:**
- Modify: `pages/p3.html:442-444`
- Modify: `pages/p3.html:1582`

- [ ] **Step 1: Add theme.css link**

Edit `pages/p3.html`:
- Old: `</style>\n</head>\n<body>`
- New: `</style>\n<link rel="stylesheet" href="../assets/theme.css">\n</head>\n<body class="embed">`

- [ ] **Step 2: Add embed.js script**

Edit `pages/p3.html`:
- Old: `</body>\n</html>`
- New: `<script src="../assets/embed.js"></script>\n</body>\n</html>`

- [ ] **Step 3: Verify**

```bash
grep -c 'assets/theme.css' pages/p3.html
grep -c '<body class="embed"' pages/p3.html
grep -c 'assets/embed.js' pages/p3.html
```
Expected: each returns `1`.

- [ ] **Step 4: Commit**

```bash
git add pages/p3.html
git commit -m "feat(p3): inject theme.css + embed.js + body.embed"
```

---

## Task 8: Inject shared chrome into `pages/p4.html`

**Files:**
- Modify: `pages/p4.html:295-297`
- Modify: `pages/p4.html:1374`

- [ ] **Step 1: Add theme.css link**

Edit `pages/p4.html`:
- Old: `</style>\n</head>\n<body>`
- New: `</style>\n<link rel="stylesheet" href="../assets/theme.css">\n</head>\n<body class="embed">`

- [ ] **Step 2: Add embed.js script**

Edit `pages/p4.html`:
- Old: `</body>\n</html>`
- New: `<script src="../assets/embed.js"></script>\n</body>\n</html>`

- [ ] **Step 3: Confirm china/russia iframe paths still resolve**

P4's existing iframes reference `steam_china.html` and `steam_russia.html` as relative paths. Because we moved those files into the same `pages/` directory as `p4.html`, relative resolution (`steam_china.html` from `pages/p4.html` → `pages/steam_china.html`) works without modification.

```bash
grep -n 'steam_china.html\|steam_russia.html' pages/p4.html
```
Expected: at least 2 matches, paths unchanged (no directory prefix needed).

- [ ] **Step 4: Verify injections**

```bash
grep -c 'assets/theme.css' pages/p4.html
grep -c '<body class="embed"' pages/p4.html
grep -c 'assets/embed.js' pages/p4.html
```
Expected: each returns `1`.

- [ ] **Step 5: Commit**

```bash
git add pages/p4.html
git commit -m "feat(p4): inject theme.css + embed.js + body.embed"
```

---

## Task 9: Inject shared chrome into `pages/appendix.html`

**Files:**
- Modify: `pages/appendix.html:211-213`
- Modify: `pages/appendix.html:940`

- [ ] **Step 1: Add theme.css link**

Edit `pages/appendix.html`:
- Old: `</style>\n</head>\n<body>`
- New: `</style>\n<link rel="stylesheet" href="../assets/theme.css">\n</head>\n<body class="embed">`

- [ ] **Step 2: Add embed.js script**

Edit `pages/appendix.html`:
- Old: `</body>\n</html>`
- New: `<script src="../assets/embed.js"></script>\n</body>\n</html>`

- [ ] **Step 3: Verify**

```bash
grep -c 'assets/theme.css' pages/appendix.html
grep -c '<body class="embed"' pages/appendix.html
grep -c 'assets/embed.js' pages/appendix.html
```
Expected: each returns `1`.

- [ ] **Step 4: Commit**

```bash
git add pages/appendix.html
git commit -m "feat(appendix): inject theme.css + embed.js + body.embed"
```

---

## Task 10: Inject shared chrome into `pages/steam_china.html`

**Files:**
- Modify: `pages/steam_china.html:259-261`
- Modify: `pages/steam_china.html:898`

- [ ] **Step 1: Add theme.css link**

Edit `pages/steam_china.html`:
- Old: `  </style>\n</head>\n<body>`
- New: `  </style>\n  <link rel="stylesheet" href="../assets/theme.css">\n</head>\n<body class="embed" data-page="china">`

- [ ] **Step 2: Add embed.js script**

Edit `pages/steam_china.html`:
- Old: `</body>\n</html>`
- New: `<script src="../assets/embed.js"></script>\n</body>\n</html>`

- [ ] **Step 3: Verify**

```bash
grep -c 'assets/theme.css' pages/steam_china.html
grep -c '<body class="embed" data-page="china"' pages/steam_china.html
grep -c 'assets/embed.js' pages/steam_china.html
```
Expected: each returns `1`.

- [ ] **Step 4: Commit**

```bash
git add pages/steam_china.html
git commit -m "feat(china): inject theme.css + embed.js + body.embed"
```

---

## Task 11: Inject shared chrome into `pages/steam_russia.html`

**Files:**
- Modify: `pages/steam_russia.html:542-544`
- Modify: `pages/steam_russia.html:1048`

- [ ] **Step 1: Add theme.css link after `</style>`**

Edit `pages/steam_russia.html`:
- Old: `    </style>\n</head>\n<body>`
- New: `    </style>\n    <link rel="stylesheet" href="../assets/theme.css">\n</head>\n<body class="embed" data-page="russia">`

- [ ] **Step 2: Add embed.js script before `</body>`**

Edit `pages/steam_russia.html`:
- Old: `</body>\n</html>`
- New: `<script src="../assets/embed.js"></script>\n</body>\n</html>`

- [ ] **Step 3: Verify**

```bash
grep -c 'assets/theme.css' pages/steam_russia.html
grep -c '<body class="embed" data-page="russia"' pages/steam_russia.html
grep -c 'assets/embed.js' pages/steam_russia.html
```
Expected: each returns `1`.

- [ ] **Step 4: Commit**

```bash
git add pages/steam_russia.html
git commit -m "feat(russia): inject theme.css + embed.js + body.embed"
```

---

## Task 12: Write `assets/shell.css`

**Files:**
- Create: `assets/shell.css`

- [ ] **Step 1: Write the file**

```css
/* assets/shell.css — layout for index.html only (not injected into pages/) */
*, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
html, body { height:100%; overflow:hidden; background: var(--bg); }
body {
  color: var(--text-h);
  font-family: Pretendard, 'Apple SD Gothic Neo', 'Segoe UI', system-ui, sans-serif;
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 100vh;
}
body.sidebar-collapsed { grid-template-columns: 60px 1fr; }

/* ─── SIDEBAR ─── */
.sidebar {
  background: var(--card-bg2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sidebar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid var(--border);
  min-height: 56px;
}
.sidebar-brand {
  display: flex; align-items: center; gap: 10px;
  font-size: 13px; font-weight: 800; color: var(--text-h);
  white-space: nowrap; overflow: hidden;
}
.sidebar-brand .brand-badge {
  background: var(--accent); color: #fff; font-size: 10px; font-weight: 700;
  padding: 3px 8px; border-radius: 20px; letter-spacing: .5px; flex-shrink: 0;
}
.sidebar-toggle {
  background: transparent; border: 1px solid var(--border); border-radius: 6px;
  width: 28px; height: 28px; cursor: pointer; color: var(--text-sub1); flex-shrink: 0;
}
.sidebar-toggle:hover { background: var(--card-bg); color: var(--text-h); }
body.sidebar-collapsed .sidebar-brand span,
body.sidebar-collapsed .nav-label,
body.sidebar-collapsed .rate-box { display: none; }

.nav {
  flex: 1;
  overflow-y: auto;
  padding: 12px 8px;
  display: flex; flex-direction: column; gap: 2px;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 8px;
  color: var(--text-sub1); font-size: 13px; font-weight: 600;
  text-decoration: none; cursor: pointer;
  border-left: 3px solid transparent;
}
.nav-item:hover { background: var(--card-bg); color: var(--text-h); }
.nav-item.active {
  background: rgba(79,70,229,.08);
  color: var(--accent);
  border-left-color: var(--accent);
}
.nav-num {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px; font-weight: 800; letter-spacing: .5px;
  background: var(--card-bg); color: var(--text-sub2);
  padding: 2px 6px; border-radius: 4px; min-width: 28px; text-align: center;
  flex-shrink: 0;
}
.nav-item.active .nav-num { background: var(--accent); color: #fff; }

.sidebar-foot {
  border-top: 1px solid var(--border);
  padding: 14px 16px;
}
.rate-box { display: flex; flex-direction: column; gap: 6px; }
.rate-label { font-size: 10px; font-weight: 700; color: var(--text-sub2); letter-spacing: 1px; text-transform: uppercase; }
.rate-row { display: flex; gap: 6px; align-items: center; }
.rate-input {
  flex: 1; border: 1px solid var(--border); border-radius: 6px;
  padding: 6px 8px; font-size: 13px; color: var(--text-h);
  font-variant-numeric: tabular-nums; text-align: right; outline: none;
  background: #fff;
}
.rate-input:focus { border-color: var(--accent); }
.rate-btn {
  background: var(--accent); color: #fff; border: 0; border-radius: 6px;
  padding: 6px 10px; font-size: 11px; font-weight: 700; cursor: pointer;
}
.rate-btn:hover { background: #4338ca; }
.rate-meta { font-size: 10px; color: var(--text-src); }

/* ─── MAIN ─── */
.main { display: flex; flex-direction: column; overflow: hidden; }
.header {
  height: 56px; min-height: 56px;
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px;
}
.header-title { display: flex; align-items: center; gap: 10px; min-width: 0; }
.header-num {
  background: var(--accent); color: #fff; font-size: 10px; font-weight: 800;
  letter-spacing: .5px; padding: 3px 9px; border-radius: 20px;
}
.header-text { font-size: 14px; font-weight: 800; color: var(--text-h); }
.header-meta { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-sub2); }
.live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.45} }

.frame-wrap { flex: 1; background: var(--bg); overflow: hidden; }
#page-frame { width: 100%; height: 100%; border: 0; display: block; }

/* ─── RESPONSIVE ─── */
@media (max-width: 1024px) {
  body { grid-template-columns: 60px 1fr; }
  body .sidebar-brand span,
  body .nav-label,
  body .rate-box { display: none; }
  body.sidebar-expanded { grid-template-columns: 250px 1fr; }
  body.sidebar-expanded .sidebar-brand span,
  body.sidebar-expanded .nav-label,
  body.sidebar-expanded .rate-box { display: revert; }
}
```

- [ ] **Step 2: Verify file**

```bash
test -f assets/shell.css && grep -c 'grid-template-columns: 250px 1fr' assets/shell.css
```
Expected: exit 0 and output `1`.

- [ ] **Step 3: Commit**

```bash
git add assets/shell.css
git commit -m "feat: add shell.css with sidebar + header + iframe layout"
```

---

## Task 13: Write `assets/shell.js` and its unit test

**Files:**
- Create: `tests/shell.test.mjs`
- Create: `assets/shell.js`

- [ ] **Step 1: Write the failing test**

`tests/shell.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../assets/shell.js', import.meta.url), 'utf8');

test('shell.js exports routing table mapping hashes to page configs', () => {
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node --test tests/shell.test.mjs
```
Expected: FAIL because `assets/shell.js` does not exist.

- [ ] **Step 3: Write `assets/shell.js`**

```javascript
/* assets/shell.js — shell controller: routing + currency + sidebar */
(function () {
  'use strict';

  const RATE_KEY = 'projectS.rate';
  const SIDEBAR_KEY = 'projectS.sidebar';
  const DEFAULT_RATE = 1400;

  const ROUTES = {
    p1:       { title: 'P1 · 글로벌 게임 마켓',        src: 'pages/p1.html',       internal: true,  num: 'P1' },
    p2:       { title: 'P2 · 스팀 마켓',               src: 'pages/p2.html',       internal: true,  num: 'P2' },
    p3:       { title: 'P3 · 마일스톤',                src: 'pages/p3.html',       internal: true,  num: 'P3' },
    p4:       { title: 'P4 · 스팀 정책 & 리스크',       src: 'pages/p4.html',       internal: true,  num: 'P4' },
    p5:       { title: 'P5 · Pain Point 분석',         src: 'https://project-s-dashboard.pages.dev/', internal: false, num: 'P5' },
    p6:       { title: 'P6 · BM 분석',                 src: 'https://pub-4710a252be1249c58617eed8ea869738.r2.dev/images/p6_projectsdashboard_BM.html', internal: false, num: 'P6' },
    p7:       { title: 'P7 · 경쟁작 캘린더',           src: 'https://fps-dashboard.misty-haze-7fc4.workers.dev/', internal: false, num: 'P7' },
    appendix: { title: '매치메이킹 CCU 계산기',        src: 'pages/appendix.html', internal: true,  num: 'APX' },
  };

  const DEFAULT_ROUTE = 'p1';

  function loadRate() {
    const raw = parseFloat(localStorage.getItem(RATE_KEY));
    return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_RATE;
  }
  function saveRate(v) { localStorage.setItem(RATE_KEY, String(v)); }

  function validRate(v) { return Number.isFinite(v) && v > 0; }

  function broadcastRate(rate) {
    const frame = document.getElementById('page-frame');
    if (!frame || !frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage({ type: 'rate', value: rate }, location.origin);
    } catch (_e) { /* cross-origin (P5~P7): ignore */ }
  }

  function getRouteKey() {
    const key = (location.hash || '').replace(/^#/, '').trim();
    return ROUTES[key] ? key : DEFAULT_ROUTE;
  }

  function applyRoute(key) {
    const route = ROUTES[key];
    const frame = document.getElementById('page-frame');
    if (frame.dataset.src !== route.src) {
      frame.dataset.src = route.src;
      frame.src = route.src;
    }
    document.getElementById('hdr-num').textContent = route.num;
    document.getElementById('hdr-text').textContent = route.title;
    document.querySelectorAll('.nav-item').forEach((el) => {
      el.classList.toggle('active', el.dataset.route === key);
    });
  }

  function loadSidebarState() {
    return localStorage.getItem(SIDEBAR_KEY) === 'collapsed';
  }
  function saveSidebarState(collapsed) {
    localStorage.setItem(SIDEBAR_KEY, collapsed ? 'collapsed' : 'expanded');
  }

  function init() {
    // Sidebar state restore
    const collapsed = loadSidebarState();
    document.body.classList.toggle('sidebar-collapsed', collapsed);

    // Sidebar toggle button
    const toggle = document.getElementById('sidebar-toggle');
    toggle.addEventListener('click', () => {
      const nowCollapsed = !document.body.classList.contains('sidebar-collapsed');
      document.body.classList.toggle('sidebar-collapsed', nowCollapsed);
      saveSidebarState(nowCollapsed);
    });

    // Rate UI
    const rateInput = document.getElementById('rate-input');
    const rateBtn = document.getElementById('rate-apply');
    rateInput.value = loadRate();
    const applyFromInput = () => {
      const v = parseFloat(rateInput.value);
      if (!validRate(v)) { rateInput.value = loadRate(); return; }
      saveRate(v);
      broadcastRate(v);
    };
    rateBtn.addEventListener('click', applyFromInput);
    rateInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyFromInput(); });

    // Iframe: rebroadcast on load (ensures latest rate always reaches newly-loaded pages)
    const frame = document.getElementById('page-frame');
    frame.addEventListener('load', () => broadcastRate(loadRate()));

    // Routing
    window.addEventListener('hashchange', () => applyRoute(getRouteKey()));
    applyRoute(getRouteKey());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

- [ ] **Step 4: Run test to verify it passes**

```bash
node --test tests/shell.test.mjs
```
Expected: 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add assets/shell.js tests/shell.test.mjs
git commit -m "feat: add shell.js routing + currency broadcast + sidebar with tests"
```

---

## Task 14: Write `index.html`

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write the file**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Project S 스팀 론칭 대시보드</title>
<link rel="stylesheet" href="assets/theme.css">
<link rel="stylesheet" href="assets/shell.css">
</head>
<body>
<aside class="sidebar" aria-label="페이지 네비게이션">
  <div class="sidebar-head">
    <div class="sidebar-brand">
      <span class="brand-badge">Project S</span>
      <span>Steam 론칭 대시보드</span>
    </div>
    <button id="sidebar-toggle" class="sidebar-toggle" type="button" aria-label="사이드바 토글">☰</button>
  </div>
  <nav class="nav">
    <a class="nav-item" href="#p1"       data-route="p1"><span class="nav-num">P1</span><span class="nav-label">글로벌 게임 마켓</span></a>
    <a class="nav-item" href="#p2"       data-route="p2"><span class="nav-num">P2</span><span class="nav-label">스팀 마켓</span></a>
    <a class="nav-item" href="#p3"       data-route="p3"><span class="nav-num">P3</span><span class="nav-label">마일스톤</span></a>
    <a class="nav-item" href="#p4"       data-route="p4"><span class="nav-num">P4</span><span class="nav-label">스팀 정책 & 리스크</span></a>
    <a class="nav-item" href="#p5"       data-route="p5"><span class="nav-num">P5</span><span class="nav-label">Pain Point 분석</span></a>
    <a class="nav-item" href="#p6"       data-route="p6"><span class="nav-num">P6</span><span class="nav-label">BM 분석</span></a>
    <a class="nav-item" href="#p7"       data-route="p7"><span class="nav-num">P7</span><span class="nav-label">경쟁작 캘린더</span></a>
    <a class="nav-item" href="#appendix" data-route="appendix"><span class="nav-num">APX</span><span class="nav-label">CCU 계산기</span></a>
  </nav>
  <div class="sidebar-foot">
    <div class="rate-box">
      <div class="rate-label">USD → KRW</div>
      <div class="rate-row">
        <input id="rate-input" class="rate-input" type="number" min="1" step="0.01" value="1400" />
        <button id="rate-apply" class="rate-btn" type="button">적용</button>
      </div>
      <div class="rate-meta">※ 수동 입력 · 2026-04-17 기준 기본값 1400</div>
    </div>
  </div>
</aside>

<main class="main">
  <header class="header">
    <div class="header-title">
      <span id="hdr-num" class="header-num">P1</span>
      <span id="hdr-text" class="header-text">글로벌 게임 마켓</span>
    </div>
    <div class="header-meta">
      <span class="live-dot" aria-hidden="true"></span>
      <span>업데이트 2026-04-17</span>
    </div>
  </header>
  <div class="frame-wrap">
    <iframe id="page-frame" title="대시보드 본문" referrerpolicy="strict-origin-when-cross-origin"></iframe>
  </div>
</main>

<script src="assets/shell.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify structure**

```bash
grep -c 'id="page-frame"' index.html
grep -c 'id="rate-input"' index.html
grep -c 'data-route=' index.html
```
Expected: `1`, `1`, `8`.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add index.html shell with sidebar, header, and iframe"
```

---

## Task 15: Write `_headers` for Cloudflare Pages

**Files:**
- Create: `_headers`

- [ ] **Step 1: Write the file**

```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; frame-src 'self' https://project-s-dashboard.pages.dev https://pub-4710a252be1249c58617eed8ea869738.r2.dev https://fps-dashboard.misty-haze-7fc4.workers.dev; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'
```

- [ ] **Step 2: Verify**

```bash
test -f _headers && grep -c 'Content-Security-Policy' _headers
```
Expected: exit 0 and output `1`.

- [ ] **Step 3: Commit**

```bash
git add _headers
git commit -m "feat: add Cloudflare Pages security + CSP headers"
```

---

## Task 16: Local integration verify — acceptance criteria walkthrough

**Files:**
- No file changes unless a defect is found; defects trigger sub-tasks as encountered.

- [ ] **Step 1: Start local server**

```bash
cd /workspaces/steamlaunchdashboard
python3 -m http.server 8000 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"
```

- [ ] **Step 2: Verify static serving**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/assets/theme.css
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/assets/shell.js
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/pages/p1.html
```
Expected: all four return `200`.

- [ ] **Step 3: Manual browser walkthrough**

Open `http://localhost:8000/` in the Codespaces forwarded port. Step through §11 of the spec:

- [ ] 3.1 Click each of 8 nav items, confirm hash changes (`#p1`…`#appendix`), iframe reloads, header updates, active state highlights correct item.
- [ ] 3.2 Click sidebar hamburger, sidebar collapses to 60px; reload page, collapsed state persists.
- [ ] 3.3 On `#p1`, change rate input to `1500`, click 적용. Confirm KRW numbers in P1 update (spot-check any `.kdyn` or `.krw` number). Switch to `#p2`, verify P2 also reflects 1500. Switch to `#p3`, verify no rate input is rendered inside (P3 has none).
- [ ] 3.4 On `#p4`, scroll to Regional Risk section, confirm china/russia iframes load.
- [ ] 3.5 Visit `#p5`, `#p6`, `#p7`, confirm external iframes load and fill viewport minus the 56px header.
- [ ] 3.6 Resize to 1280px, 1440px, 1920px — confirm no horizontal overflow, chart labels not clipped. Also try 1024px — sidebar collapses automatically.
- [ ] 3.7 Navigate to `http://localhost:8000/#p3` directly in a new tab; confirm page loads on P3 not P1.
- [ ] 3.8 Open devtools Console; confirm no CSP violations and no JS errors.

- [ ] **Step 4: Stop server**

```bash
kill $SERVER_PID
```

- [ ] **Step 5: If any defects found, create a fix task inline and commit separately**

Defects go into follow-up micro-tasks (format: "fix: <describe>" commit). If none, just commit a verification note:

```bash
git commit --allow-empty -m "test: local integration verification passed (8 acceptance criteria)"
```

---

## Task 17: Chart overflow & label residual fine-tuning (conditional)

**Context:** If Task 16 Step 3.6 surfaced truncated labels or charts overflowing despite `theme.css` safety rules, this task applies targeted patches to the specific Chart.js option objects in the affected page. Each patch should be a single line (e.g. adding `layout:{padding:{top:16,right:16}}`) inside the existing options. Skip this task if §11.6 passed cleanly.

**Files:**
- Modify: one or more of `pages/p1.html`, `pages/p2.html`, `pages/p3.html` (only the specific chart options objects)

- [ ] **Step 1: For each affected chart, locate its `options: {…}` block**

Use `grep -n "options:" pages/p1.html` and similar to find the exact line.

- [ ] **Step 2: Add `layout: { padding: { top:16, right:16, bottom:8, left:8 } },` to the options object**

Exact edit depends on the chart; keep the patch minimal and preserve trailing commas.

- [ ] **Step 3: Re-verify the specific chart at 1280/1440/1920 widths**

Restart server, open the affected page in-shell, confirm label is now visible.

- [ ] **Step 4: Commit**

```bash
git add pages/<file>.html
git commit -m "fix(<page>): add layout.padding to <chart-id> options to prevent label clip"
```

---

## Task 18: Update `README.md`

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read current README**

Current content is 1 line (`# steamlaunchdashboard`). Overwrite entirely.

- [ ] **Step 2: Write updated README**

```markdown
# Project S 스팀 론칭 대시보드

임원진 보고용 Steam 론칭 통합 대시보드. 8개 페이지(P1~P7 + Appendix)를 단일 셸에서 제공합니다.

## 구조
- `index.html` — 셸 (사이드바 + 헤더 + iframe)
- `assets/` — 공통 테마·셸·임베드 스크립트
- `pages/` — P1~P4, Appendix, steam_china, steam_russia 원본 HTML (3줄 주입 외 불가침)
- `_headers` — Cloudflare Pages CSP/보안 헤더
- `tests/` — Node 빌트인 테스트 러너 기반 단위 테스트
- `docs/superpowers/specs/` / `docs/superpowers/plans/` — 설계·실행 산출물

## 로컬 실행
```bash
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000
```

## 테스트
```bash
node --test tests/
```

## 배포 (Cloudflare Pages)
1. GitHub repo를 Cloudflare Pages에 연결
2. Build command: (없음)
3. Build output directory: `/`
4. Production branch: `main`
5. main 푸시 = 자동 배포

## 환율
사이드바 USD→KRW 박스에 숫자 입력 → 적용. P1/P2의 `data-usd` 숫자가 KRW로 재계산됩니다. 설정은 `localStorage`에 저장되어 세션 간 유지.
```

- [ ] **Step 3: Verify**

```bash
grep -c 'Cloudflare Pages' README.md
grep -c 'python3 -m http.server' README.md
```
Expected: both return at least `1`.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README with run/test/deploy instructions"
```

---

## Task 19: Run all tests + final commit

**Files:**
- No file changes.

- [ ] **Step 1: Run full test suite**

```bash
cd /workspaces/steamlaunchdashboard
node --test tests/
```
Expected: all tests pass (embed.test.mjs × 5 + shell.test.mjs × 7 = 12).

- [ ] **Step 2: Review git log**

```bash
git log --oneline origin/main..HEAD
```
Expected: ~15-18 commits forming a clean linear history on `feat/dashboard-shell`.

- [ ] **Step 3: Handoff**

Invoke `superpowers:finishing-a-development-branch` skill to choose merge/PR/keep.

---

## Spec coverage checklist

Mapping spec requirements → tasks:

| Spec section | Requirement | Task |
|---|---|---|
| §2 | 8 pages routed correctly | T13, T14 |
| §3.2 | File layout matches | T1, T2, T12, T13, T14, T15 |
| §3.4 | Hash routing | T13 (shell.js), T14 (index.html) |
| §4 | Design tokens adopted | T3 |
| §5 | 3-line injection on all 7 pages | T5–T11 |
| §5 | Russia color convergence without inline edits | T3 (theme.css russia block), T11 (`data-page="russia"`) |
| §6 | postMessage broadcast flow | T4 (embed.js), T13 (shell.js) |
| §6.5 | Edge cases: invalid input, load order | T13 (validRate, frame load listener) |
| §7 | Sidebar + header layout | T12 (shell.css), T14 (index.html) |
| §8 | iframe policy (100% internal / 100vh external) | T12, T14 (CSS `#page-frame` fills wrap) |
| §9 | Chart overflow safety CSS | T3 (embed-mode rules), T17 (residuals) |
| §10 | Cloudflare Pages headers | T15 |
| §11 | 8 acceptance criteria | T16 |
| §12 | Russia color convergence risk | T3 |
| §12 | Chart options residual patches | T17 |

All spec requirements mapped to at least one task. No gaps.
