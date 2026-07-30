---
id: T-20260729-009
title: Home·전체 보기·검색·레시피 상태 routing 디자인
status: done
type: feature
priority: P0
priority_reason: 여러 진행 레시피와 완료 레시피를 하나의 목록에서 구분하고 정확한 현재 단계로 복귀하는 흐름은 로컬 제품 구현의 시작점이다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent:
target_role:
required_capabilities:
  - ux_flow
  - ui_design
  - prototyping
depends_on:
  - T-20260729-008
blocks:
  - T-20260729-010
  - T-20260729-002
parallel_group: design-refresh-sequential
allowed_paths:
  - design/prototype/
  - design/figma-build/manifest.json
  - design/exports/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - design/prototype/
created_by: Design Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-30
report_to: .ai_project/reports/T-20260729-009_design-home-search-and-recipe-state-routing-report.md
qa_to: .ai_project/qa/T-20260729-009_design-home-search-and-recipe-state-routing-qa.md
---

# Home·전체 보기·검색·레시피 상태 routing 디자인

## 목적

진행 기록과 완료 레시피를 하나의 최근 목록에 표시하면서 각 상태와 복귀 목적지를 사용자가 즉시 이해하게 한다.

## 실행 범위

- 최근 활동 시간순 최대 3개 Home 목록
- `기록 중`, `AI 정리 중`, `검토 필요`, 완료 레시피 카드
- 제목 없는 기록의 `작성 중인 요리`와 날짜·시간 구분
- 카드 선택 시 STEP Preview, AI Review, Recipe Detail routing
- 진행 기록 `⋯` 메뉴, 영구 삭제 확인과 복구 불가 안내
- 전체 보기의 최근 활동순 목록
- 제목·재료명 로컬 검색, 입력 즉시 결과, 지우기와 결과 없음
- 제목 일치 우선과 재료 일치 결과 표현
- 새 진행 기록 시작 시 기존 기록 보존

## 제외 범위

- STEP Preview 내부 편집
- AI Review 상세 폼
- 의미 검색, 정렬·필터와 서버 검색
- 완료 레시피 직접 삭제 흐름

## 성공 기준

- 모든 상태 카드가 동일한 목록 안에서 구분되며 완료 카드에는 불필요한 완료 배지가 없다.
- 카드 전체가 터치 타깃이고 각 상태에서 제품 문서가 정한 화면으로 이동한다.
- 검색 대상과 제외 대상이 명확하며 검색어가 서버로 전송되는 인상을 주지 않는다.
- 빈 목록, 검색 결과 없음, 여러 진행 기록과 최근 3개 초과 상태를 Prototype에서 확인할 수 있다.
- 진행 기록 영구 삭제 전 확인과 복구 불가 안내가 표현된다.
- Design QA Agent가 상태 구분, routing과 검색 접근성을 독립 검증한다.

## 사용자 결정 필요 항목

- 없음. 카드 정보와 정렬 기준은 제품 문서대로 적용한다.

## 실행 조율

- Product Owner가 2026-07-30 실행을 승인했다.
- 전용 worktree는 `/private/tmp/cooklog-t20260729-009`, 브랜치는 `task/T-20260729-009-design-home-search-and-recipe-state-routing`이다.
- worktree 기준점은 PR #12까지 반영된 최신 `origin/develop` SHA `0a665758de848704b4d8a249828c3ff390db26c5`다.
- UI/UX Design Agent는 작업 시작 전 `git status -sb`와 `git branch --show-current`를 확인하고 Task lock을 획득한 뒤 `approved -> in_progress`로 전환한다.
- 수정은 선언된 `allowed_paths` 안에서만 수행하며 공용 Prototype·Manifest에 후속 T-010 변경을 섞지 않는다.
- 구현과 자체 검증 완료 후 실행 보고서를 작성하고 `verification_ready`로 Design QA Agent에 인계한다.
- commit, push, PR, merge는 별도 Product Owner 승인 전 실행하지 않는다.

## 실행 결과

- Home에 최근 활동순 최대 3개의 진행·완료 혼합 목록과 빈 상태, 여러 진행 기록, 메뉴, 삭제 확인, 로딩과 오류 상태를 구현했다.
- `기록 중 -> Cooking Log`, `AI 정리 중 -> AI Review Processing`, `검토 필요 -> AI Review Editable`, `완료 -> Recipe Detail` routing을 연결했다.
- 진행 기록 전용 `⋯` 메뉴와 대상·삭제 범위·복구 불가를 명시한 영구 삭제 확인창을 구현했다.
- 전체 보기에서 3개 초과 목록, 제목·재료명 로컬 즉시 검색, 제목 일치 우선, 검색어 지우기, 결과 없음과 STEP Preview 검색 제외 상태를 구현했다.
- Prototype, Gallery, README와 Manifest revision `home-search-routing-20260730`을 동기화했다.
- 정적 검사, 대표 URL 10개 HTTP 응답, Light·Dark와 390×844·375×667 Safari 시각 검증을 통과했다.
- 작업 중 `origin/develop`이 PR #13으로 1커밋 전진했으나 변경은 STT 정책과 프로젝트 문서에 한정되어 Home·검색 디자인에는 영향이 없음을 확인했다. 병합 전 동시 변경된 보드·상위 Task 문서는 최신 develop과 정합화해야 한다.
- `DQA-HIGH-009-001`: 진행 기록 메뉴는 열림 시 메뉴 항목, 닫힘 시 원래 트리거로 포커스를 이동한다. 영구 삭제 다이얼로그는 `취소`를 초기 포커스로 사용하고 `Tab`·`Shift+Tab` 순환, `Escape` 취소, 외부 포커스 이탈 가드와 닫힘 후 트리거 복귀를 제공한다.
- `DQA-MEDIUM-009-001`: 모든 기록에 `lastActivityAt`을 부여하고 삭제되지 않은 기록을 실제 활동 시각 내림차순으로 정렬한 뒤 Home 상위 3개를 계산해, 삭제 후에도 다음 최근 항목이 자동 보충되도록 수정했다.
- `DQA-MEDIUM-009-002`: 실제 검색 결과의 일치 종류로 상태를 계산해 제목 일치가 하나라도 있으면 `Title Search`, 재료만 일치하면 `Ingredient Search`, 결과가 없으면 `No Results`로 전이한다. 이 혼합 결과 정책을 Manifest와 동기화했다.
- 재작업 후 JavaScript·JSON·Figma 스크립트 파싱, 결함 수용 기준 12개 정적 검사, 대표 URL 4개 HTTP 응답, 대비·터치·routing 회귀와 `git diff --check`를 통과했다.

## 상태 전이 기록

- 2026-07-30: 선행 `T-20260729-008`의 develop 병합과 `done`을 확인했다.
- 2026-07-30: Product Owner가 실행을 승인해 `proposed -> approved`로 전환하고 UI/UX Design Agent에 라우팅했다.
- 2026-07-30: UI/UX Design Agent가 전용 worktree와 브랜치, 허용 경로를 확인하고 Task lock을 획득해 `approved -> in_progress`로 전환했다.
- 2026-07-30: UI/UX Design Agent가 Home·전체 보기·검색·상태 routing 구현과 자체 검증을 완료하고 lock을 해제해 `in_progress -> verification_ready`로 전환한 뒤 Design QA Agent에 인계했다.
- 2026-07-30: Design QA Agent가 독립 검증에서 Home 최근 활동순 계산, 영구 삭제 다이얼로그 키보드 포커스, 실제 재료 검색 상태 전이 결함을 확인해 `verification_ready -> rework_requested`로 전환하고 UI/UX Design Agent에 재작업을 요청했다.
- 2026-07-30: Product Owner가 Design QA 결함 3건의 재작업을 승인해 `rework_requested -> approved`로 전환하고 UI/UX Design Agent에 다시 라우팅했다.
- 2026-07-30: UI/UX Design Agent가 전용 worktree에서 재작업 lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-07-30: UI/UX Design Agent가 승인된 결함 3건을 수정하고 자체 회귀 검증을 통과해 lock을 해제한 뒤 `in_progress -> verification_ready`로 전환하고 Design QA Agent에 독립 재검증을 요청했다.
- 2026-07-30: Design QA Agent가 결함 3건 해소와 기존 통과 항목의 무회귀를 실제 브라우저 경로로 독립 재검증해 `verification_ready -> verification_passed`로 전환하고 Design Lead Agent에 인계했다.
- 2026-07-30: Design Lead Agent가 성공 기준, 최종 Design QA, allowed paths, Figma 비차단 근거와 구현 핸드오프 완전성을 검토해 `verification_passed -> completion_review`로 인계했다. develop 통합 전이므로 `done` 전환은 보류했다.
- 2026-07-30: Product Owner 승인에 따라 PR #16을 `develop`에 squash merge했고, merge SHA `44fc8a979e6683133e0fadb4a6580674e0371634`를 확인해 `completion_review -> done`으로 전환했다.

## Design QA 재작업 요청

- `DQA-HIGH-009-001`: 진행 기록 메뉴와 영구 삭제 다이얼로그에 초기 포커스, 포커스 가두기, `Escape` 취소와 닫힘 후 트리거 복귀를 구현한다.
- `DQA-MEDIUM-009-001`: Home 최근 3개를 고정 ID가 아닌 실제 최근 활동순으로 계산하고 삭제 후 다음 최근 항목을 보충한다.
- `DQA-MEDIUM-009-002`: 실제 재료 검색 입력이 `Ingredient Search` 상태로 전이하도록 결과 일치 종류와 상태 계약을 일치시킨다.
- 상세 재현 절차와 수용 기준은 `.ai_project/qa/T-20260729-009_design-home-search-and-recipe-state-routing-qa.md`를 따른다.

## 승인된 재작업 범위

- Product Owner가 2026-07-30 Design QA 결함 3건의 재작업을 승인했다.
- `DQA-HIGH-009-001`, `DQA-MEDIUM-009-001`, `DQA-MEDIUM-009-002`와 해당 회귀 검증만 수행한다.
- 기존 통과 항목, 제품 정책, 후속 `T-20260729-010` 범위는 변경하지 않는다.
- UI/UX Design Agent는 기존 전용 worktree에서 lock을 획득한 뒤 재작업을 시작하고 완료 시 자체 검증 후 Design QA Agent에 독립 재검증을 요청한다.
- 최신 `origin/develop` 정렬과 동시 변경 문서 정합화는 재검증 통과 후 병합 전 Git gate로 유지한다.
- commit, push, PR, merge는 별도 Product Owner 승인 전 실행하지 않는다.

## Design Lead 완료 검토

- Home 최근 활동순 최대 3개, 상태별 routing, 진행 기록 삭제, 전체 보기와 로컬 검색의 성공 기준이 Prototype과 Manifest에 반영됐음을 확인했다.
- 최종 Design QA의 `verification_passed` 판정, 결함 3건 해소와 기존 통과 항목 무회귀 결과를 확인했다.
- 변경 경로는 Task의 `allowed_paths` 안에 있으며 JavaScript·JSON 파싱과 `git diff --check`를 통과했다.
- 로컬 Prototype·Manifest가 UI Source of Truth이고 Figma는 버전 미러이므로 Starter 도구 제한은 완료와 구현 인계를 차단하지 않는다.
- 화면 상태, 카드 routing, 검색 계약, 파괴적 행동의 포커스 규칙과 접근성 기준이 포함되어 후속 `T-20260729-010`과 iOS 구현에 필요한 핸드오프가 준비됐다.
- 현재 브랜치는 최신 `origin/develop`보다 3커밋 뒤에 있다. 최신 develop 정렬, 동시 변경 문서 정합화와 patch 동등성 확인은 병합 전 Git 게이트로 남긴다.
- develop 병합 전에는 `done`으로 전환하지 않으며 `T-20260729-010`은 이 Task의 `done`과 별도 실행 승인 전까지 `proposed`를 유지한다.
