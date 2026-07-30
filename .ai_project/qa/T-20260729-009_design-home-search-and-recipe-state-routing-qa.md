# T-20260729-009 Design QA 독립 재검증 보고서

작성일: 2026-07-30
작성자: Design QA Agent
대상 Task: `T-20260729-009`
판정: `verification_passed`

## 1. 재검증 요약

재작업된 `DQA-HIGH-009-001`, `DQA-MEDIUM-009-001~002`의 수용 기준과 기존 통과 항목의 회귀를 로컬 UI Source of Truth 기준으로 독립 재검증했다.

Home 최근 활동순과 삭제 후 보충, 진행 기록 메뉴·영구 삭제 다이얼로그의 키보드 포커스, 제목·재료 검색 상태 전이가 정적 계약뿐 아니라 실제 브라우저 실행 경로에서도 정상 동작했다. 기존 routing, 검색 범위, 완료 badge 부재, Light·Dark, 375×667, 터치 영역과 대비에도 회귀가 없다.

- 기존 결함 해소: 3건
- 신규 결함: 없음
- 최종 상태: `verification_passed`
- 다음 담당: Design Lead Agent
- Task `done` 전환: 수행하지 않음

## 2. 검증 환경과 잔여 Git 위험

- Worktree: `/private/tmp/cooklog-t20260729-009`
- Branch: `task/T-20260729-009-design-home-search-and-recipe-state-routing`
- Task HEAD: `0a665758de848704b4d8a249828c3ff390db26c5`
- `origin/develop`: `8a36f22f111151964fa3a31bda541267e505371e`
- 공통 기준점: `0a665758de848704b4d8a249828c3ff390db26c5`

Task branch는 `origin/develop`보다 3커밋 뒤에 있다. upstream 변경은 첫 출시 STT 정책, Backend 계약, iOS CI와 프로젝트 문서에 한정되며 `design/prototype/`과 Manifest는 변경하지 않는다. 이번 디자인 품질 판정에는 직접 영향이 없지만 동시에 변경된 보드·상위 Task 문서의 정합화와 최신 develop 기준 patch 확인은 병합 전 Git gate로 남긴다.

## 3. 기존 결함 재검증

### DQA-HIGH-009-001 — 영구 삭제 다이얼로그 키보드 포커스

결과: 해소

- 진행 기록 메뉴를 열면 `진행 기록 삭제` 메뉴 항목으로 포커스가 이동한다.
- 메뉴에서 `Escape`를 누르면 메뉴가 닫히고 원래 `⋯` 트리거로 포커스가 복귀한다.
- 영구 삭제 다이얼로그를 열면 안전 행동인 `취소`로 초기 포커스가 이동한다.
- 마지막 행동에서 `Tab`, 첫 행동에서 `Shift+Tab`을 사용하면 다이얼로그 내부에서 순환한다.
- 외부 DOM으로 포커스를 이동해도 `취소`로 되돌아온다.
- `Escape` 취소 후 원래 메뉴 트리거로 포커스가 복귀한다.
- 삭제 확정 후 제거된 트리거 대신 Home의 `10초 요리 기록 시작`으로 포커스가 이동한다.

Chrome headless 동적 재현에서 위 포커스 대상과 다이얼로그 닫힘 상태를 직접 확인했다.

### DQA-MEDIUM-009-001 — Home 최근 활동순과 삭제 후 보충

결과: 해소

- 모든 기록에 `lastActivityAt`이 있으며 `visibleRecipes()`가 삭제되지 않은 기록을 timestamp 내림차순으로 정렬한다.
- Home은 정렬 결과의 상위 3개를 계산한다.
- 초기 실제 표시 순서는 `방금 전 -> 8분 전 -> 어제`다.
- 최상위 `작성 중인 요리`를 삭제한 뒤 `8분 전 -> 어제 -> 7월 27일` 순서로 다음 최근 항목이 보충된다.

초기 목록과 삭제 후 목록을 실제 브라우저 DOM에서 독립 확인했다.

### DQA-MEDIUM-009-002 — 재료 검색 상태 전이

결과: 해소

- 재료 전용 검색어 `애호박` 입력 시 `Ingredient Search` 상태로 전이한다.
- 결과 요약과 카드 label 모두 `재료 일치`로 표시한다.
- 제목 일치와 재료 일치가 섞이는 `두부` 입력 시 Manifest 정책대로 `Title Search`를 유지한다.
- 혼합 결과는 `제목 일치`, `재료 일치` 순서로 표시한다.
- 결과 없음은 `No Results`, 빈 검색어는 `Recent Activity`로 전이한다.

실제 검색 `input` 이벤트를 발생시켜 상태 버튼, 결과 label과 요약 문구를 독립 확인했다.

## 4. 회귀 검증

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| 진행·완료 혼합 목록 | 통과 | 기록 중·AI 정리 중·검토 필요·완료 콘텐츠를 한 목록에서 구분 |
| 상태별 routing | 통과 | Recording→Cooking Log, Organizing→Processing, Review Required→Editable, Complete→Recipe Detail |
| 제목 없는 진행 기록 | 통과 | `작성 중인 요리`, 날짜·시간과 마지막 STEP 정보 제공 |
| 완료 badge 미사용 | 통과 | 완료 카드는 콘텐츠 메타데이터만 표시 |
| 새 기록 보존 안내 | 통과 | 새 기록 시작 시 기존 진행 기록 보존 문구 유지 |
| 삭제 확인 내용 | 통과 | 대상, STEP Preview·임시 저장 범위와 복구 불가 안내 유지 |
| 전체 보기 | 통과 | 3개 초과 기록과 최근 활동순 제공 |
| 검색 범위 | 통과 | Review·Complete의 제목·재료만 검색, STEP Preview·조리 단계·메모 제외 |
| 검색 행동 | 통과 | 즉시 갱신, 제목 우선, 재료 일치, 지우기와 결과 없음 |
| 로컬 처리 안내 | 통과 | 서버·AI로 전송하지 않는다는 문구 유지 |
| 상태 계약 | 통과 | Manifest Home 7개, All Recipes 5개 및 검색·포커스 정책 동기화 |
| Light·Dark | 통과 | Home Light와 Ingredient Search Dark 렌더링 확인 |
| 375×667 | 통과 | Home과 Ingredient Search 작은 화면에서 주요 내용·행동 확인 |
| WCAG AA 대비 | 통과 | Manifest 13개 조합 모두 4.5:1 이상, 최저 4.67:1 |
| 터치·모션 | 통과 | 44pt 행동, `focus-visible`, Reduce Motion 계약 유지 |

## 5. 검증 명령과 실행 확인

- `git status -sb`, `git branch --show-current`: 전용 worktree와 기존 변경 범위 확인
- `node --check design/prototype/app.js`: 통과
- Figma Plugin API 스크립트 9개 `AsyncFunction` 파싱: 통과
- `jq empty design/figma-build/manifest.json design/figma-build/state.json`: 통과
- Manifest 대비 13개 조합 확인: 모두 4.5:1 이상, 최저 4.67:1
- `git diff --check`: 통과
- Chrome headless 동적 검증:
  - 메뉴 초기 포커스와 `Escape` 복귀: 통과
  - 다이얼로그 초기 포커스·양방향 순환·외부 이탈 가드·`Escape` 복귀: 통과
  - 삭제 확정 후 안전한 포커스와 최근 목록 backfill: 통과
  - 재료 전용·제목/재료 혼합 검색 상태와 label: 통과
- Safari 시각 검증:
  - Home · 375×667 · Light: 통과
  - Ingredient Search · 375×667 · Dark: 통과

## 6. 최종 판정

`DQA-HIGH-009-001`, `DQA-MEDIUM-009-001~002`는 모두 해소됐고 기존 통과 항목에도 회귀가 없다.

Task를 `verification_passed`로 전환해 Design Lead Agent에 인계한다. 완료 검토와 `done` 전환은 Design Lead Agent 및 후속 통합 절차로 남긴다.
