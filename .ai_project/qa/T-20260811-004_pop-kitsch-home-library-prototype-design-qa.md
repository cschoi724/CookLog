# T-20260811-004 Design QA 재작업 지시

- 검증 Agent: Design QA Agent / Verification Role
- 기록일: 2026-08-11
- 판정: `REWORK_REQUESTED`
- 대상: `design/prototype/app.js`, `design/prototype/styles.css`

## PASS 수용·병합 보류

T-004는 실행 Agent의 자체 검증을 마쳐 `verification_ready` 상태였으나, Design QA의 독립 PASS 판정·Completion 수용·PR #134 병합은 진행하지 않는다.

## 재작업 범위

`design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png`를 Home layout과 information hierarchy의 기준으로 추가 적용한다.

- T-003 Foundation을 Home 화면에 충분히 보강한다. 크림·토마토·버터·코발트 언어를 단순 토큰 교체가 아니라 hierarchy와 표면·장식 구조에 반영한다.
- 큰 CookLog hero와 원본의 팝 키치 보조 그래픽을 Home 상단에 반영한다.
- 중앙 대형 원형 음성 기록 CTA를 적용한다.
- 최근 레시피를 2열 이미지 카드 구조로 정합화한다.
- 작은 비챗봇 AI 요리 도우미 배너를 원본의 위치·위계에 맞춘다.

## 유지 계약

- Home 9개·Library 5개 상태, Home→Log·Home→Library·Library→Recipe/Review routing, recipe lifecycle, 최근 3개 규칙
- AI 비챗봇 표현과 로컬 검색 개인정보 안내
- 390×844·375×667, Accessibility 3, 대비, 최소 44pt, keyboard·VoiceOver·focus, 색 외 상태 단서
- 외부 asset·폰트, iOS·Backend 및 Home/Library 밖 화면 변경 금지

## 다음 인계

Design Lead Agent / Lead Role이 T-004의 재작업 경계·T-003 Foundation 보강 책임·재승인 범위를 조율한 뒤 UI/UX Design Agent에게 재할당해야 한다.
