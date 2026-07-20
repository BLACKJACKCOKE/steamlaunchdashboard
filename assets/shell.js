/* assets/shell.js — shell controller: routing + currency + sidebar */
(function () {
  'use strict';

  const RATE_KEY = 'projectS.rate';
  const SIDEBAR_KEY = 'projectS.sidebar';
  const DEFAULT_RATE = 1500;

  const ROUTES = {
    p0:       { title: 'Flywheel',                     src: 'pages/p0.html',       internal: true,  num: 'P0' },
    liveops:  { title: '[참고] 2026 Live Service 진단',       src: 'pages/liveops.html',  internal: true,  num: 'REF' },
    p1:       { title: '글로벌 게임 마켓',              src: 'pages/p1.html',       internal: true,  num: 'P1' },
    p2:       { title: '스팀 마켓',                     src: 'pages/p2.html',       internal: true,  num: 'P2' },
    p3:       { title: '마일스톤',                      src: 'pages/p3-exec.html',  internal: true,  num: 'P3' },
    p4:       { title: '스팀 정책 & 리스크',             src: 'pages/p4.html',       internal: true,  num: 'P4' },
    p5:       { title: 'Pain Point 분석',              src: 'https://project-s-dashboard.pages.dev/', internal: false, num: 'P5' },
    p6:       { title: 'BM 분석',                       src: 'https://pub-4710a252be1249c58617eed8ea869738.r2.dev/images/p6_projectsdashboard_BM.html', internal: false, num: 'P6' },
    p7:       { title: '경쟁작 캘린더',                 src: 'https://fps-dashboard.misty-haze-7fc4.workers.dev/', internal: false, num: 'P7' },
    'ccu-calculator': { title: '매치메이킹 CCU 계산기',  src: 'pages/ccu-calculator.html', internal: true,  num: 'APX' },
  };

  // 옛 #appendix 공유 링크 호환 — 신규 라우트로 매핑
  const ROUTE_ALIASES = { appendix: 'ccu-calculator' };

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
    let key = (location.hash || '').replace(/^#/, '').trim();
    if (ROUTE_ALIASES[key]) key = ROUTE_ALIASES[key];
    return ROUTES[key] ? key : DEFAULT_ROUTE;
  }

  // 외부 iframe 페이지는 이 저장소에서 내용을 수정할 수 없다. 작성 시점 이후 전략이 바뀐
  // 페이지는 셸에서 고지 배너를 덧붙여 현행 입장과의 차이를 표시한다 (원문은 이력으로 보존).
  const ROUTE_NOTICES = {
    p5: '이 페이지는 <b>2026.04 시점 검토안</b>입니다. 당시 권고(패키지 B2P · 익스트랙션/협동 PvE)는 현행 입장과 다릅니다 — <b>현행 = F2P 진입 + 프리미엄 하이브리드 · 순수 PvP</b> (P6 및 본 보고서 기준). 페인 포인트 데이터 자체는 유효합니다.',
    p6: '확률형 아이템은 <b>V1(사전 제외)로 확정</b>되었습니다. 본 페이지의 V2·V3(루트박스 포함 안)는 <b>의사결정 이력으로 보존</b>된 것이며 현행 방침이 아닙니다.',
    p7: '경쟁작 캘린더는 <b>2025~2027만 수록</b>되어 있습니다. 론칭 목표 시점(2028.03) 구간은 <b>미수록</b> — 2028 라인업 대부분이 미발표이므로 gamescom 2026 이후 갱신 예정입니다.',
  };

  function renderNotice(key) {
    const wrap = document.querySelector('.frame-wrap');
    if (!wrap) return;
    let el = document.getElementById('route-notice');
    const msg = ROUTE_NOTICES[key];
    if (!msg) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement('div');
      el.id = 'route-notice';
      el.setAttribute('role', 'note');
      el.style.cssText = 'padding:9px 14px;background:#fffbeb;border-bottom:1px solid #fde68a;' +
        'font-size:12.5px;line-height:1.5;color:#92400e;flex:0 0 auto';
      wrap.insertBefore(el, wrap.firstChild);
    }
    el.innerHTML = '⚠️ ' + msg;
  }

  function applyRoute(key) {
    const route = ROUTES[key];
    const frame = document.getElementById('page-frame');
    if (frame.dataset.src !== route.src) {
      frame.dataset.src = route.src;
      frame.src = route.src;
    }
    renderNotice(key);
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
