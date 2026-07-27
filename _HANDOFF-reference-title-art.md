# 핸드오프 — 스팀 론칭 대시보드 (2026-07-27 · CLI 세션)

> 토큰 리밋 대비 정리. 리밋 해제 후 **이 파일부터 읽고 이어서 진행.**
> 환경: 이 repo(`Desktop/AI/steamlaunchdashboard`)는 **CLI 세션 전용.** Project S 보고서(`2nd Brain/.../project-s-zerobase`)는 채팅 세션 담당 — 건드리지 말 것.

## ✅ 완료 — Project S 관문 일정 +1개월 순연 (커밋 `d983da4` · push 완료 · Cloudflare 자동배포)

WORKREQ(`2nd Brain/04_EMPLOYED/projects/project-s/보고/project-s-zerobase/_WORKREQ-steamlaunchdashboard-schedule-update.md`) 반영. `pages/p3-exec.html`:
- 전사테스트(P0) 07~08 → **08~09** · FGT 1차 Sep~Oct → **Oct~Nov** · FGT 2차 Nov~Dec → **Dec~Jan'27**
- P0/P1 phase 전체 +1개월 (표시 텍스트 + JS 간트 m0/m1 동시 재계산). 축 m=0=Jun'26·TM=26 **불변**.
- **스토어 에셋 제작은 불변** — L1221~22가 "Dec'26 스팀페이지 오픈 7영업일 전 Valve 제출"로 **불변 P2에 앵커**돼 있어 이동 X (요청서 "P2 이후 그대로"와 정합). ← "전수 확인"이 이걸 잡음.
- 렌더 검증 완료(간트 막대 = 날짜 정렬 · P2 이후 불변 육안 확인). ⚠️ 잔여 플래그: FGT 2차(Dec~Jan)·BM최종(Jan~Feb)이 P2 스팀페이지(Dec~Mar)와 겹침 — 요청서 주의 #3이 "그대로 병행" 허용한 부분.

## 🔜 다음 — 레퍼런스 타이틀 "게임 리소스 항상 사용" (신규 요청 · 스코핑 완료, 미착수)

### 요청 (Ryan 2026-07-27)
> "레퍼런스 타이틀 관련해서 **항상 게임 리소스를 서치해서 사용**해 줘. 아래 두 방식 중 **상황에 따라 더 적합한 것**으로 진행."
> **① 카드형**(첨부1): 대형 키아트 그리드 — 게임 캡슐아트 + 타이틀 + `~XX만 30d 동접` + 장르 속성. 막대=상대 CCU · 카드 클릭=SteamCharts. ⚠️ BF6의 **"아트 준비중" placeholder = 회피 대상**(항상 실아트 fetch).
> ② **테이블형**(첨부2): 순위표 — 소형 썸네일 아이콘 + 타이틀 + 동접(CCU) + 리뷰수 + 긍정률 + 소유자(est) + 속성(premium/f2p · first/third-person/isometric 태그).
> **원칙 = 표준 지시**: 앞으로 대시보드에 레퍼런스 게임 타이틀이 나오면 항상 실제 아트/아이콘을 서치해 사용.

### 실측 현황
- 레퍼런스 게임 = 5개 페이지 **텍스트로만** 126건: **p2(63) · p3-exec(27) · p1(19) · p4(12) · liveops(5)**. 예: p3-exec 벤치마크 표 "Top 1-3 · CS2(~917K avg)·PUBG(~314K avg)".
- steamlaunchdashboard 에 **게임 이미지 인프라 없음**(capsule/appid grep 0).

### 재사용 원천 = game-market-dashboard (`Desktop/AI/game-market-dashboard`)
첨부 두 이미지가 **이 프로젝트 스타일** = 컴포넌트·인프라 이식 원천.
- **Steam 아트 URL (hotlink CDN)**: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/<appid>/header.jpg` (또는 hash 경로/`library_600x900.jpg`). 실측 패턴 확인됨.
- `collectors/steam_attributes.py:61` — appdetails → `header_image`. `dashboard/build_site.py:113` — header_image·owners_est·monetization·perspective 렌더. 카드/테이블 컴포넌트 정본.
- 속성 택소노미(premium/f2p · perspective) · owners_est(SteamSpy) 이미 구현 → 테이블형 컬럼 그대로 이식 가능.

### ⛳ 착수 전 결정 필요 (Ryan or 판단)
1. **스코프 시작점**: 126건 전부(대공사) 아님 — **list/table/card 성격 섹션만**(inline 산문 텍스트 제외). 최우선 후보 = p3-exec FPS 벤치마크 표(카드형 "서브장르 CCU 독식"과 정확히 매칭) → 여기부터 파일럿 권장.
2. **아트 소스**: Steam CDN **hotlink**(간단·라이브·빌드 무 · 단 외부의존·CSP `_headers` 확인) vs **로컬 캐시**(assets/ 다운로드·자기완결·빌드 스텝). 대시보드가 정적+Cloudflare라 hotlink 가 실용적. game-market-dashboard 는 hotlink 사용.
3. **appid 매핑**: 레퍼런스 게임명 → Steam appid 필요(CS2=730·PUBG=578080·Apex=1172470·Warframe=230410 등). game-market-dashboard universe 에 상당수 존재 → 재사용, 없으면 WebSearch/Steam 검색.
4. **카드 vs 테이블 선택 기준**: 소수(≤10) 히어로 비교=카드형 · 순위·다지표(리뷰·긍정률·owners)=테이블형. (Ryan 이 "상황별 판단" 위임함.)

### 재개 첫 스텝 (권장)
p3-exec FPS 벤치마크 섹션 1곳을 파일럿으로 → game-market-dashboard 컴포넌트 이식 + Steam CDN 아트 + appid 매핑 → 렌더 검증 → Ryan 확인 → 나머지 섹션 확산. **엔진/vault 아님 · steamlaunchdashboard repo 에서만 작업.**

## 작업 규율 (이 repo)
- 빌드/렌더: Windows Chrome headless · `--user-data-dir` 격리 · `wslpath -w` · **`taskkill` 금지**(Ryan Chrome). 렌더 후 육안(feedback_render_verify_not_source).
- 커밋 후 `git push` → Cloudflare Pages 자동배포(origin = `BLACKJACKCOKE/steamlaunchdashboard`).
- 변경은 소스 아니라 **렌더로 검증** · 레이아웃 키워 게이트 맞추지 말 것.
