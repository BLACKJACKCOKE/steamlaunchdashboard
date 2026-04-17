/* assets/shell.js — shell controller: routing + currency + sidebar */
(function () {
  'use strict';

  const RATE_KEY = 'projectS.rate';
  const SIDEBAR_KEY = 'projectS.sidebar';
  const DEFAULT_RATE = 1500;

  const ROUTES = {
    p0:       { title: 'Flywheel',                     src: 'pages/p0.html',       internal: true,  num: 'P0' },
    p1:       { title: '글로벌 게임 마켓',              src: 'pages/p1.html',       internal: true,  num: 'P1' },
    p2:       { title: '스팀 마켓',                     src: 'pages/p2.html',       internal: true,  num: 'P2' },
    p3:       { title: '마일스톤',                      src: 'pages/p3.html',       internal: true,  num: 'P3' },
    p4:       { title: '스팀 정책 & 리스크',             src: 'pages/p4.html',       internal: true,  num: 'P4' },
    p5:       { title: 'Pain Point 분석',              src: 'https://project-s-dashboard.pages.dev/', internal: false, num: 'P5' },
    p6:       { title: 'BM 분석',                       src: 'https://pub-4710a252be1249c58617eed8ea869738.r2.dev/images/p6_projectsdashboard_BM.html', internal: false, num: 'P6' },
    p7:       { title: '경쟁작 캘린더',                 src: 'https://fps-dashboard.misty-haze-7fc4.workers.dev/', internal: false, num: 'P7' },
    appendix: { title: '매치메이킹 CCU 계산기',          src: 'pages/appendix.html', internal: true,  num: 'APX' },
  };

  const DEFAULT_ROUTE = 'p0';

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

    // Iframe: rebroadcast on load
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
