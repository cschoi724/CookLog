---
schema: aiops.task.v1
id: T-20260805-003
title: iOS Home·전체 보기·검색·상태별 routing 구현
status: verification_ready
type: feature
priority: P0
priority_reason: 저장·진행 Recipe를 다시 찾고 기록 흐름으로 진입하는 첫 화면을 제품 상태 모델과 일치시켜야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: iOS QA Agent
target_role: Verification Role
required_capabilities: [ios_implementation, swiftui, navigation]
depends_on: [T-20260805-002]
blocks: [T-20260805-004, T-20260728-003]
parallel_group:
allowed_paths:
  - apps/ios/CookLog/App/
  - apps/ios/CookLog/Features/Home/
  - apps/ios/CookLogTests/
  - apps/ios/docs/NAVIGATION.md
  - apps/ios/docs/STATUS.md
  - apps/ios/docs/DEVELOPMENT_PLAN.md
  - apps/ios/docs/CHANGELOG.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
  - apps/ios/docs/NAVIGATION.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-05
updated_at: 2026-08-05
report_to: .ai_project/reports/T-20260805-003_ios-home-search-routing-report.md
qa_to: .ai_project/qa/T-20260805-003_ios-home-search-routing-qa.md
---

# iOS Home·전체 보기·검색·상태별 routing 구현

## 범위

- Home 단일 목록, 최근·진행·완료 Recipe 카드와 전체 보기
- 제목·재료 로컬 검색, 빈 상태·로딩·오류·재시도
- 진행 상태별 Cooking Log/AI Review와 완료 Recipe Detail routing
- 기존 NavigationStack·back swipe·복구 동작 보존

## 성공 기준

- 저장·진행 상태가 디자인 계약과 동일한 콘텐츠·CTA·전이를 제공한다.
- 검색과 앱 재실행 후 routing이 올바른 Recipe/draft ID를 유지한다.
- Home 4개 Core Loop 인수 상태와 통합 핸드오프 관련 상태를 검증한다.

## 승인 및 실행 경계

- 2026-08-05: 공용 `develop`에서 선행 `T-20260805-002`의 `done`, PR #77 squash merge
  `3d1d012`와 완료 동기화 merge `ba9bb38`을 확인했다.
- 2026-08-05: Product Owner가 Home·전체 보기·검색·상태별 routing 구현을 별도 승인했다.
  Development Lead Agent가 `proposed -> approved`로 전환하고 iOS Agent에 인계한다.
- 2026-08-05: iOS Agent가 최신 `origin/develop@865f508` 기반 전용 worktree에서 lock을
  획득하고 `approved -> in_progress`로 전환했다.
- 2026-08-05: Home·전체 보기·검색·동일 ID lifecycle routing 구현과 Home 선별 테스트,
  build·전체 XCTest 48개·Simulator 렌더링을 통과해 `in_progress ->
  verification_ready`로 iOS QA Agent에 독립 검증을 인계했다.
- 구현은 Home의 최근·진행·완료 단일 목록과 전체 보기, 제목·재료 로컬 검색, 빈 상태·
  loading·error·retry, lifecycle별 route 연결로 제한한다.
- `draft_step_preview`는 Cooking Log, `draft_ai_review`는 AI Review, `completed`는 Recipe
  Detail로 동일 record ID를 유지해 이동한다. 검색·재실행·refresh 후에도 선택 ID가
  바뀌거나 새 record가 생성되면 안 된다.
- 기존 `NavigationStack`, `AppRoute`, back swipe와 복구 동작을 보존하고 현재 실행 코드와
  디자인 인수 계약의 route 차이는 코드 기준으로 문서와 함께 동기화한다.
- Cooking Log의 10초 기록·STEP 저장, AI Review 편집·저장, Recipe Detail 편집·삭제,
  Audio Guide, 실제 STT·Backend AI·TTS 구현은 T-004~007 또는 후속 Task 범위로 유지한다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 iOS QA Agent / Verification Role이야.
Task T-20260805-003은 구현을 마친 독립 검증 Task야.

- 현재 상태: `verification_ready`
- 기준 상태 ref: `origin/develop@865f508`
- 구현 ref: `task/T-20260805-003-implement-ios-home-search-routing`
- 다음에 해야 할 일: 별도 QA worktree에서 lock을 획득하고 Home 4개 Core Loop 상태,
  전체 보기·검색·동일 record ID routing과 복구 동작을 독립 검증해줘.
- 기준 문서: `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`,
  `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md`, `apps/ios/docs/NAVIGATION.md`
- 허용 경로: Task frontmatter의 `allowed_paths`
- 참고 산출물: `.ai_project/reports/T-20260805-003_ios-home-search-routing-report.md`,
  `.ai_project/tasks/active/T-20260805-003_ios-home-search-routing.md`
- 필수 검증: Home Core Loop 4개 상태, 전체 보기와 제목·재료 검색, empty·loading·error·retry,
  lifecycle별 route와 동일 record ID, 앱 재실행·refresh, back swipe·복구 무회귀
- 자체 검증: Home 선별 XCTest 7개, build, 전체 XCTest 48개, Simulator 설치·실행과
  Home 빈 상태 렌더링 통과
- 남은 리스크: AI Review의 기존 review draft 직접 복원·동일 ID 완료 저장은 T-005,
  실제 음성·AI·TTS와 후속 화면 내부 동작은 T-004~007 범위다.
- 차단/결정 필요: T-004~008 범위 선행 구현과 실제 외부 서비스 연결 금지
- 완료 시: QA 보고서를 작성하고 판정에 따라 `verification_passed` 또는
  `rework_requested`로 다음 Role에 인계해줘.
