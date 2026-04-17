# Project S 스팀 론칭 대시보드

임원진 보고용 Steam 론칭 통합 대시보드. 9개 페이지(P0 Flywheel + P1~P7 + Appendix)를 단일 셸에서 제공합니다.

## 구조

```
/
├── index.html              셸 (다크 사이드바 + 헤더 + iframe)
├── assets/
│   ├── theme.css           공통 디자인 토큰 + embed 모드 오버라이드
│   ├── shell.css           사이드바/헤더/메인 레이아웃
│   ├── shell.js            라우팅 + 환율 브로드캐스트 + 사이드바 토글
│   ├── embed.js            iframe 내부 환율 메시지 리스너
│   └── flywheel.png        P0 Flywheel 다이어그램 이미지
├── pages/                  내부 iframe 콘텐츠
│   ├── p0.html             Flywheel 오버뷰
│   ├── p1.html             글로벌 게임 마켓
│   ├── p2.html             스팀 마켓
│   ├── p3.html             마일스톤
│   ├── p4.html             스팀 정책 & 리스크
│   ├── appendix.html       매치메이킹 CCU 계산기
│   ├── steam_china.html    P4 내부 iframe (중국 리스크 상세)
│   └── steam_russia.html   P4 내부 iframe (러시아 리스크 상세)
├── _headers                Cloudflare Pages CSP/보안 헤더
├── tests/                  Node 빌트인 테스트 러너 단위 테스트
└── docs/superpowers/
    ├── specs/              설계서
    └── plans/              실행 계획
```

P5~P7은 외부 URL iframe으로 셸에서 직접 로드됩니다:
- P5 Pain Point 분석: `https://project-s-dashboard.pages.dev/`
- P6 BM 분석: `https://pub-4710a252be1249c58617eed8ea869738.r2.dev/images/p6_projectsdashboard_BM.html`
- P7 경쟁작 캘린더: `https://fps-dashboard.misty-haze-7fc4.workers.dev/`

## 로컬 실행

```bash
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000
```

## 테스트

```bash
node --test 'tests/*.test.mjs'
```

12개 단위 테스트(5 embed + 7 shell) 검증.

## 배포 (Cloudflare Pages)

1. GitHub repo를 Cloudflare Pages에 연결
2. Build command: **없음** (정적 파일)
3. Build output directory: `/` (루트)
4. Production branch: `main`
5. main 푸시 = 자동 배포

`_headers`가 CSP + X-Frame-Options + Referrer-Policy를 자동 적용합니다.

## 환율

사이드바 USD→KRW 박스에 숫자 입력 → 적용. P1/P2의 `data-usd` 속성을 가진 숫자가 KRW로 재계산됩니다. 설정은 `localStorage['projectS.rate']`에 저장되어 세션 간 유지됩니다. 기본값 1500.

## 아키텍처 원칙

원본 페이지는 **3줄만 수정**(theme.css 링크 + `body.embed` 클래스 + embed.js 스크립트) 후 iframe으로 래핑합니다. Chart.js 버전 충돌·CSS 스코프·스크립트 재실행 이슈를 원천 차단합니다. 자세한 내용은 `docs/superpowers/specs/2026-04-17-project-s-dashboard-design.md` 참조.
