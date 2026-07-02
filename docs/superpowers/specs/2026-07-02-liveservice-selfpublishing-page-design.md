---
type: reference
title: "설계서 — 자체 퍼블리싱 LiveOps 페이지 (Steam 론칭 대시보드)"
persona: employed
parents:
  - "[[04_EMPLOYED/projects/steam-launch-dashboard/steam-launch-dashboard]]"
domain_top_level: game
hierarchy_level: 5
status: active
created: 2026-07-02
tags: [project-s, steam-launch-dashboard, liveops, self-publishing, spec, design]
target_repo: "BLACKJACKCOKE/steamlaunchdashboard"
port_to: "repo docs/superpowers/specs/ (구현 착수 시)"
---

# 설계서 — 자체 퍼블리싱 LiveOps 페이지

- **대상**: `steamlaunchdashboard` (Cloudflare Pages · 정적 HTML/CSS/JS · shell + iframe)
- **신규 페이지**: 자체 퍼블리싱 LiveOps — "개발 스튜디오에서 종합 게임 컴퍼니로"
- **근거**: 산업 리포트 3종(state_of_industry 53p · whats-next-for-live-service 15p · post_launch_strategies 14p) 정독 + Fact-Check(2026-07-02) 완료
- **Fact-Check 결과 정본**: [[2026-07-02_liveops-fact-check]] (본 문서 §7에 요약)

## 1. 목적
임원 대시보드에 "자체 퍼블리싱을 통한 LiveOps가 회사 가치를 만든다"는 전략 논거를 데이터로 세운다. 회사는 이미 라이브 서비스를 성공시킨 개발사이며, 관건은 그 가치를 **외부 퍼블리셔에 맡길지 vs 자체 퍼블리싱으로 내재화할지**다.

## 2. 관통 메시지
> 회사는 이미 라이브 서비스를 성공시킨 개발사다. 그 가치를 자체 퍼블리싱으로 내재화하면 **개발 스튜디오 → 종합 게임 컴퍼니**로 도약한다. 단, 라이브 서비스는 냉혹하게 어렵고, 그래서 성패는 감이 아니라 **데이터·인프라를 회사가 소유**하느냐에 달렸다.

가치 사슬: 자체 퍼블리싱(데이터·인프라 전제) → 지속 매출·유저 소유·IP 자산 내재화 → 개발 스튜디오 → 종합 게임 컴퍼니 → 회사 가치 제고.

## 3. 설계 원칙 (확정)
1. 한글화 — 고유명사(벤치마크 타이틀명) 외 최대 한글.
2. 사례 풀어쓰기 — 단어만 X, "무엇이 왜 어떻게" 문장.
3. "역량" 과잉강조·"소수 팀" 표현 **배제** → 데이터 기반 운영 + 인프라 필요성.
4. 자체 퍼블리싱 = 가치 내재화 프레임(외부 귀속 → 내재화).
5. 개발 스튜디오 → 종합 게임 컴퍼니 용어 통일.
6. 진단 은폐 없음 — "라이브 서비스는 어렵다"를 정면 명시(②=앵커).
7. 회사 특정 사실(자사 타이틀·퍼블리셔 관계·앞선 모바일 자체 서비스 실패) **공개 페이지 미노출**(추상화). 산업 근거+전략 논리로만.
8. Fact-Check + 1차 출처 직링크 게이트 — 직링크 없는 정량 수치 게재 불가.

## 4. 페이지 구조 (7섹션 · 단일 스크롤)
| # | 섹션 | 메시지 | 시각화 |
|---|---|---|---|
| ① | 한 장 결론 | 검증된 라이브 서비스 역량을 자체 퍼블리싱으로 운영해 가치 내재화 = 도약. 단 이 시장은 어렵고 데이터·인프라가 협상 불가 전제. | 히어로 배너(인디고) + 3 지지문. |
| ② | 냉혹한 진단 (앵커) | 리스크는 라이브 서비스가 아니라 자체 운영 전환. 실패는 자금이 아니라 운영 준비성 부족. | ★히어로1: 이탈 곡선(Chart.js) + 실패 스탯월(직링크) + "왜 어려운가" 리스트. |
| ③ | 왜 자체 퍼블리싱인가 (가치 귀속) | 외부 퍼블리싱=가치 외부 귀속 / 자체 퍼블리싱=회사 내재화 + 개발·퍼블리싱 겸비. | ★히어로2: 외부 vs 자체 2열 가치귀속 다이어그램 + 보조 스탯. |
| ④ | 감이 아니라 데이터 | 자체 퍼블리싱=플레이어 데이터 회사 소유·데이터로 운영. 경쟁우위=수집 아닌 통합. | 순환 루프 도식 + 데이터 5종. |
| ⑤ | 데이터를 성립시키는 인프라 | 퍼블리셔가 대던 운영 스택을 회사가 소유. "백엔드 가동성=매출 연속성". | 레이어 스택 도식(정성 + Payday3/Marathon 인프라 실패 인용). |
| ⑥ | 부담이 아니라 지렛대 (사서 쓰기 vs 직접) | 스택 전부를 직접 X. 인프라·도구는 사서 쓰고 데이터·유저 관계만 소유. | 비교표 + Metaplay 공개 스탯. |
| ⑦ | Project S 적용 | 데이터 인프라 사전 준비·buy/build 결정·테스트 우선순위·무엇을 데이터로 확인·개선. (회사 특정 사실 추상화) | 준비 체크리스트. |

흐름: ②진단 → ③왜 자체 퍼블리싱 → ④⑤⑥ 어떻게(데이터·인프라·사서쓰기) → ⑦ Project S.

## 5. 대시보드 통합
- 신규 파일: `pages/liveops.html` (`<body class="embed" data-page="liveops">`, theme.css + 인라인 style + Chart.js CDN + embed.js).
- 라우트(`assets/shell.js` ROUTES): `liveops: { title: '자체 퍼블리싱 LiveOps', src: 'pages/liveops.html', internal: true, num: 'P8' }`.
- 네비게이션: **P0 Flywheel 바로 다음 = 두 번째 nav로 승격**(확정). `index.html`에 P0 다음 삽입, 기존 P1~P7+CCU의 nav-idx(02→03…10) 순차 재번호(cosmetic). route key는 `liveops` 유지.
- 디자인 토큰: theme.css :root 사용(--accent #4f46e5 등). 신규 색 하드코딩 금지.
- 차트: Chart.js 4.4.4 + chartjs-plugin-datalabels 2.2.0(CDN, 기존 페이지 동일).
- 환율: 본 페이지 통화 입력 없음 → embed.js 포함하되 no-op(관례 유지).

## 6. 시각화 상세
- ① 인디고 히어로 배너 + 3 지지문.
- ② 이탈 곡선 라인차트(출시 후 시간축 대비 잔존 급락) + 실패 스탯월 카드(각 카드 직링크) + "왜 어려운가" 리스트.
- ③ 외부 vs 자체 2열 가치귀속 도식(매출·유저·데이터·IP 흐름 화살표) + 보조 스탯.
- ④ 측정→결정→개선 순환 SVG + 데이터 5종(계측·플레이테스트·접속로그·커뮤니티·A/B).
- ⑤ 레이어 스택(서버 확장/매치메이킹/상시 업데이트/24h 모니터링).
- ⑥ 비교표(직접/사서/혼합) + Metaplay 스탯 칩.
- ⑦ 준비 게이트 체크리스트.

## 7. 근거 & Fact-Check (게재 게이트 · 2026-07-02 완료)
**원칙**: 모든 정량 수치 = WebSearch 2+ 교차 + 클릭 1차 직링크 없으면 게재 불가.

**✅ 채택 (검증 통과 · 공개 1차 직링크)**
| # | 확정값 | 섹션 | 1차 직링크 | 등급 |
|---|---|---|---|---|
| D1 | Concord 최고 동접 697명(2024-08-23) | ② | https://steamdb.info/app/2443720/charts/ | S |
| D2 | Payday 3 첫 30일 ~−90%(77,938→~8,444) | ② | https://steamdb.info/app/1272080/charts/ | S |
| D3a | Sony·Bungie 손상차손 누적 ~$765M($200M+$565M, FY2025 2026-05-08) | ②③ | https://www.forbes.com/sites/paultassi/2026/05/08/sony-backs-marathon-even-after-765-million-in-bungie-impairment-losses/ | A |
| D3b | Marathon 최고 동접 88,337(2026-03-06)→<15% 붕괴 | ② | https://steamdb.info/app/3065800/charts/ | S |
| D4 | 6년+ 게임이 플레이타임 61%(Newzoo 2024·후 55%로 수정, 병기) | ② | https://gameworldobserver.com/2024/04/03/newzoo-pc-console-market-report-revenue-playtime-growth | S |
| D7 | 고액결제자 편중 — 극소수(0.15~수%)가 매출 ~50%(범위·Swrve 2014) | ③ | https://www.pocketgamer.biz/chart-of-the-week-half-of-in-game-revenue-generated-by-just-015-of-players/ | S |
| D9 | Fortnite 분당 9,200만 이벤트(~54B/day, 2018) | ④ | https://www.datanami.com/2018/07/31/inside-fortnites-massive-data-analytics-pipeline/ | A |
| D11′ | 직접 vs 사서: 외부 채택 48% / 자체 구축 6% / 개발비 절감 기대 63%(Metaplay 154 스튜디오) | ⑥ | https://www.metaplay.io/blog/backend-tech-build-or-buy-industry-opinions | A |

**❌ 제거 (공개 1차 없음 · 은폐 아닌 삭제, 정성 논지만)**
- "+30% 유지율"(D6) · "데이터 팀 32%"(D8) · "63% 인프라 투자"(D10, 공개 63%는 다른 주장) · "크로스플레이 80% 절감"(D12, 공개치 ~20~30%) · "80%가 월 1~5% 손실"(설문).
- **D5 "2023 정리해고 1만명" 제거(off-thesis)** — 산업 전반 침체 지표로 본 페이지 논지와 직접 인과 없음.
- D2 정정: "−60%/30일"→ 첫 30일 ~−90%.

**⚠ 시장 규모 재서술 (절대값 단정 금지)**: "라이브서비스/GaaS 시장 추정 $6~13B(2025~26, 조사기관별 상이) · 전체 게임시장 ~$1,880~2,050억(Newzoo) · 상위 퍼블리셔 매출의 다수가 라이브서비스(Midia, 예 EA FY23 74%)" + 정의 병기. $321B(PwC 2022 stale)·$13.7B/$22.4B 게재 금지.

## 8. 테스트
- `tests/shell.test.mjs` — `liveops` 라우트 + `pages/liveops.html` 매핑 단언 추가.
- 신규 `tests/liveops-page.test.mjs` — liveops.html: embed 마커 존재 + 채택 직링크 8종 존재 + 제거 수치 미포함(정량 직링크 게이트 자동 검증).
- 로컬: `python3 -m http.server` → `#liveops` 로드·차트·직링크 확인. `node --test 'tests/*.test.mjs'` 통과.

## 9. 성공 기준
1. `#liveops` 정상 로드·nav 활성·헤더 타이틀 매핑.
2. 7섹션 렌더 + ②③ 히어로 시각화 동작.
3. 모든 정량 수치에 클릭 직링크(직링크 없는 정량 0건). 시장규모 방향+정의 병기.
4. 원칙 8개 준수(한글화·사례·데이터/인프라·소수팀 표현 0·자체 퍼블리싱·용어·진단 명시·회사 특정 사실 추상화).
5. 기존 디자인 시스템 준수·기존 페이지 회귀 없음.
6. `node --test` 통과.

## 10. 열린 결정 — 없음 (nav = P0 다음 승격 확정)
- 회사 특정 사실은 공개 페이지 밖(내부 자료 별도).
