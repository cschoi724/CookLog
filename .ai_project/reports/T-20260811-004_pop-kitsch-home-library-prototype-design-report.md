# T-20260811-004 Concept Rework 실행 보고서

- Task: 팝 키치 레시피 클럽 Foundation·Home·Library 원본 시안 재작업
- 실행 Agent: UI/UX Design Agent / Execution Role
- 실행일: 2026-08-11
- canonical 기준: `origin/develop@e0be523`
- 작업 브랜치: `task/T-20260811-004-concept-rework`
- Draft PR: `#138` (`develop` 대상)
- 작업 경로: `/private/tmp/cooklog-t20260811-004-concept-rework`
- 이전 참고 PR: `#134` — 참고 전용, 병합 보류

## 실행 순서와 변경

### 1. Foundation

- `design/prototype/styles.css`
  - T-003 의미 토큰을 보존하면서 `club-lime`, `club-ink`, `club-paper` 화면군 확장 토큰 추가
  - 큰 `club-display`, 코발트 `club-tape`, 라임 `club-sticker`, 버터 `club-burst` 공통 표현 추가
  - 대형 원형 `record-club-control`, CSS 미디어 카드, 작은 비챗봇 `ai-helper-card` 규격 추가
- `design/prototype/components.html`
  - Home/Library Concept Foundation 검토 섹션 추가
  - 디스플레이·스티커·테이프·원형 CTA·2열 카드·AI 도우미를 Light/Dark에서 검토 가능하게 구성

### 2. Home

- 큰 CookLog hero와 오늘 뭐 먹지 burst·조리도구 낙서·짧은 테이프 라벨 적용
- 중앙 대형 원형 음성 기록 CTA와 한 줄 행동 라벨로 첫 행동을 단순화
- 최근 활동순 최대 3개를 원본 위계의 2열 CSS 미디어 카드로 구성
- 작은 비챗봇 AI 요리도우미를 최근 레시피 뒤에 배치
- 로딩·오류를 포함한 Home 9개 상태에 동일 화면 언어 적용

### 3. Library

- 같은 Foundation을 사용하되 Home hero를 복제하지 않는 Recipe Index intro와 컴팩트 가로 미디어 목록 구성
- 제목·재료 검색, 결과 없음·빈 상태, 검색 초기화와 기기 내 검색 개인정보 안내 유지

## 자체 검증

| 검증 | 결과 |
|---|---|
| JavaScript syntax (`node --check`) | PASS |
| CSS/inline CSS brace 균형 | PASS |
| Home 9개·Library 5개 state 목록 대조 | PASS |
| 최근 활동 `.slice(0, 3)` 규칙 | PASS |
| Home→Log·Home→Library·Library→Recipe/Review routing 계약 | PASS |
| 네트워크 재확인·검색 초기화 selector | PASS |
| AI 비챗봇·기기 내 검색 개인정보 문구 | PASS |
| Foundation 공통 규격 7종 components 대조 | PASS |
| Light 핵심 대비 | 4.63:1~15.98:1, PASS |
| Dark 핵심 대비 | 6.77:1~17.15:1, PASS |
| Light/Dark 라임 스티커 대비 | 13.31:1 / 14.98:1, PASS |
| 44px 이상 기본 action·검색 action | PASS |
| 외부 `@import`/`url()`·asset·font 없음 | PASS |
| Home Light 실제 Safari 렌더 | PASS, 원본 정보 위계 확인 |
| Library 재료 검색 Dark 실제 Safari 렌더 | PASS |
| Foundation Dark 실제 Safari 렌더 | PASS |
| 375×667 Accessibility 3 Home 네트워크 오류 렌더 | PASS, 내부 스크롤 도달 |
| Home 9·Library 5·Foundation query URL | 모두 HTTP 200 |
| 최신 develop 재정렬 | `origin/develop@e0be523`, 충돌 없음 |
| `git diff --check` | PASS |

## 보존 사항

- Home 9개·Library 5개 상태와 recipe lifecycle 유지
- Home→Log, Home→Library, Library→Recipe/Review 목적지 유지
- 최근 활동순 최대 3개와 진행 기록 보존 안내 유지
- AI는 입력창·대화 말풍선·새 action 없는 비챗봇 보조 안내로 한정
- Library 검색은 기기 안 처리·서버/AI 미전송 안내와 제목 우선·재료 일치 의미 유지
- 390×844·375×667, Light/Dark, Accessibility 3, 44pt, keyboard·focus 계약 유지
- 외부 asset·폰트, iOS·Backend 및 Home·Library 밖 구조·행동 변경 없음

## 남은 리스크

- 외부 asset 금지에 따라 음식 사진은 CSS 기반 추상 미디어로 표현했다. 더 높은 사진 수준의 시각 충실도와 Product Owner 시각 승인은 proposed `T-20260811-008` 범위다.
- 14개 상태 전체의 브라우저별 픽셀 회귀, 실제 키보드 탭 순서와 VoiceOver 읽기 순서는 Design QA Agent가 독립 검증해야 한다.
- PR #134는 이전 구현 참고용이며 본 재작업 결과와 혼합하거나 병합하지 않는다.

## 다음 Agent에게 전달할 말

```text
너는 Design QA Agent / Verification Role이야.
Task T-20260811-004 concept rework를 독립 검증해줘.

- 현재 상태: verification_ready
- 기준 상태: origin/develop@e0be523
- Draft PR: https://github.com/cschoi724/CookLog/pull/138
- 작업 경로: /private/tmp/cooklog-t20260811-004-concept-rework
- 변경 대상: design/prototype/styles.css, design/prototype/components.html, design/prototype/app.js
- 실행 보고서: .ai_project/reports/T-20260811-004_pop-kitsch-home-library-prototype-design-report.md
- 검증 범위: Foundation 확장 규격, Home 9개, Library 5개, 원본 concept 정보 위계, Light/Dark, 390×844·375×667, Accessibility 3, 대비, 44pt, keyboard·VoiceOver·focus
- 보존 확인: routing, lifecycle, 최근 3개, AI 비챗봇, 로컬 검색 개인정보, 외부 asset·font 없음, Home·Library 밖 구조·행동 무변경
- 주의: PR #134는 참고 전용·병합 보류. CSS 추상 미디어 이상의 고충실도 리터치는 proposed T-20260811-008과 구분
- 통과 시: Design Lead Agent / Completion Role에 인계하고, 수정 필요 시 구체 항목과 함께 rework_requested로 반환해줘.
```
