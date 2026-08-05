---
schema: aiops.task.v1
id: T-20260805-003
title: iOS Home·전체 보기·검색·상태별 routing 구현
status: done
type: feature
priority: P0
priority_reason: 저장·진행 Recipe를 다시 찾고 기록 흐름으로 진입하는 첫 화면을 제품 상태 모델과 일치시켜야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Completion Role
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
- 2026-08-05: iOS QA Agent가 별도 QA worktree에서 lock을 획득하고
  `verification_ready -> verification_in_progress`로 전환했다.
- 2026-08-05: iOS QA Agent가 전체 XCTest 48/48, 검색·동일 ID route와 Simulator
  Light/Dark·375×667 렌더링을 확인했으나 진행 기록 삭제 흐름 누락 HIGH 1건과 AI 준비
  완료 상태·카드 정보·생성 실패 재시도 불일치 MEDIUM 3건을 확인해
  `verification_in_progress -> rework_requested`로 전환하고 lock을 해제했다.
- 2026-08-05: Development Lead Agent가 네 결함을 하나의 Home 상태·행동 재작업으로
  범위화했고 Product Owner가 재작업을 승인했다. Task를
  `rework_requested -> scoped -> approved`로 전환해 iOS Agent에 재인계한다.
- 2026-08-05: iOS Agent가 최신 `origin/develop@97f434d`로 구현 브랜치를 재정렬하고
  전용 worktree에서 lock을 획득해 `approved -> in_progress`로 전환했다.
- 2026-08-05: iOS Agent가 `WP-R1~R4` 구현과 결함별 회귀를 완료하고 전체 XCTest
  54/54·Simulator 설치·실행을 통과해 `in_progress -> verification_ready`로 전환하고
  lock을 해제했다.
- 2026-08-05: iOS QA Agent가 별도 재검증 worktree에서 lock을 획득하고
  `verification_ready -> verification_in_progress`로 전환했다.
- 2026-08-05: iOS QA Agent가 `WP-R1~R4` 해소, Home 집중 13개와 전체 XCTest 54/54,
  새 record 생성·Cooking Log 전환·재실행 복구, 375×667 Light/Dark와 기존 검색·동일
  UUID route 무회귀를 확인해 `verification_in_progress -> verification_passed`로
  전환하고 lock을 해제했다. 기존 launch configuration 위험은 T-008로 유지한다.
- 2026-08-05: Development Lead Agent가 최신 `origin/develop` 재정렬 후 허용 경로,
  성공 기준과 독립 QA 산출물을 완료 리뷰했다. iPhone 15 iOS 17.2에서 전체 XCTest
  54/54를 직접 재실행해 `PASS_WITH_RISK`를 수용하고 `verification_passed ->
  completion_review`로 전환했다.
- 2026-08-05: Product Owner가 완료 리뷰에 이상이 없을 때 완료 확정과 PR 병합까지
  승인했다. 완료 리뷰가 통과해 `completion_review -> done`으로 확정하며, 공용
  `done`은 `develop` 병합 후 효력이 발생한다.
- 구현은 Home의 최근·진행·완료 단일 목록과 전체 보기, 제목·재료 로컬 검색, 빈 상태·
  loading·error·retry, lifecycle별 route 연결로 제한한다.
- `draft_step_preview`는 Cooking Log, `draft_ai_review`는 AI Review, `completed`는 Recipe
  Detail로 동일 record ID를 유지해 이동한다. 검색·재실행·refresh 후에도 선택 ID가
  바뀌거나 새 record가 생성되면 안 된다.
- 기존 `NavigationStack`, `AppRoute`, back swipe와 복구 동작을 보존하고 현재 실행 코드와
  디자인 인수 계약의 route 차이는 코드 기준으로 문서와 함께 동기화한다.
- Cooking Log의 10초 기록·STEP 저장, AI Review 편집·저장, Recipe Detail 편집·삭제,
  Audio Guide, 실제 STT·Backend AI·TTS 구현은 T-004~007 또는 후속 Task 범위로 유지한다.

## 완료 리뷰 결과

- 판정: `PASS_WITH_RISK`
- 허용 경로: 변경 파일 16개가 Task `allowed_paths` 안에 있음을 확인했다.
- 코드·문서 정합성: 최신 `origin/develop` 위로 재정렬했고 `git diff --check`와 strict
  Task validation을 통과했다.
- 자동 검증: iPhone 15 iOS 17.2에서 Home 집중 13개를 포함한 전체 XCTest 54/54를
  독립 QA와 Development Lead 재실행에서 모두 통과했다.
- 결함 해소: `QA-HIGH-805003-001`, `QA-MEDIUM-805003-002~004`의 진행 기록 삭제,
  AI Review 준비 CTA, 카드 정보 계층, 생성 실패 전용 재시도를 확인했다.
- 수용 위험: 375x667 launch configuration의 full-screen viewport 기준은 이번 변경과
  분리된 `T-20260805-008`에서 확인한다. T-004~007 내부 화면과 실제 STT·AI·TTS도
  후속 Task 범위다.
- 후속 의존성: T-003 완료로 `T-20260805-004`의 선행 조건이 해소된다. 별도 실행 승인
  전까지 상태는 `proposed`로 유지한다.

## 승인된 재작업 범위

- `WP-R1`: 진행 record에만 `⋯` 메뉴와 복구 불가 삭제 확인을 제공한다. 삭제 성공 시
  같은 UUID를 영구 삭제하고 최근 3개를 재정렬·backfill하며, 실패 시 record를 보존하고
  실패한 삭제만 재시도한다.
- `WP-R2`: `draft_ai_review` 준비 완료 record를 Home 성공 배너의
  `레시피 검토하기`로 같은 UUID의 AI Review에 연결한다. refresh로 record를 중복
  생성하거나 UUID를 바꾸지 않는다.
- `WP-R3`: 완료 badge를 제거하고 lifecycle별 카드에 Prototype 우선순위대로 최근 활동,
  주요 재료 최대 3개, 예상 시간과 단계 수를 표시한다.
- `WP-R4`: 조회 실패와 새 기록 생성 실패 상태를 분리하고 생성 실패 재시도는 생성
  동작만 다시 수행한다. 기존 record를 변경하거나 중복 생성하지 않는다.
- 네 결함별 자동 테스트를 추가하고 기존 전체 XCTest 48개, Home·전체 보기 실제 상호작용,
  Light/Dark·375×667 최소 회귀를 다시 확인한다.
- `origin/develop` 최신 상태를 반영하되 T-004~008과 실제 STT·Backend AI·TTS를
  선행 구현하지 않는다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Lead Role이야.
Task T-20260805-003은 완료 리뷰와 병합 승인을 받은 완료 Task야.

- 현재 상태: `done` (`develop` 병합 후 공용 효력)
- 기준 상태 ref: 최신 `origin/develop`
- 구현 ref: `task/T-20260805-003-implement-ios-home-search-routing`
- 다음에 해야 할 일: 승인된 PR을 squash merge하고 `develop` 동기화 후 T-004의
  선행 해소를 확인해줘. T-004는 Product Owner 별도 실행 승인 전 착수하지 마.
- 기준 문서: `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`,
  `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md`, `apps/ios/docs/NAVIGATION.md`
- 허용 경로: Task frontmatter의 `allowed_paths`
- 참고 산출물: `.ai_project/reports/T-20260805-003_ios-home-search-routing-report.md`,
  `.ai_project/qa/T-20260805-003_ios-home-search-routing-qa.md`
- QA 통과: `QA-HIGH-805003-001`, `QA-MEDIUM-805003-002~004` 해소, Home 13개와
  전체 XCTest 54/54, 기록 CTA 실제 전환·재실행 복구, 375×667 Light/Dark
- 기존 통과: 최근 3개·검색·STEP 초안 제외·동일 UUID route·refresh 무회귀
- 남은 리스크: AI Review의 기존 review draft 직접 복원·동일 ID 완료 저장은 T-005,
  실제 음성·AI·TTS와 후속 화면 내부 동작은 T-004~007 범위다.
- 차단/결정 필요: T-004~008 범위 선행 구현과 실제 외부 서비스 연결 금지
- 완료 시: PR·merge SHA와 공용 `done`, T-004의 `proposed`·선행 해소 상태를 확인해.
