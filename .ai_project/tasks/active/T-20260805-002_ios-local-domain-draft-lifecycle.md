---
schema: aiops.task.v1
id: T-20260805-002
title: iOS 로컬 도메인·SwiftData migration·draft 생명주기 구현
status: verification_passed
type: feature
priority: P0
priority_reason: 모든 화면이 공유하는 진행 기록·임시 저장·완료 전환과 영속화 경계를 먼저 고정해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Completion Role
required_capabilities:
  - ios_implementation
  - data_modeling
  - persistence
depends_on:
  - T-20260729-002
  - T-20260805-001
blocks:
  - T-20260805-003
  - T-20260728-003
parallel_group:
allowed_paths:
  - apps/ios/CookLog/Domain/
  - apps/ios/CookLog/Data/
  - apps/ios/CookLogTests/
  - apps/ios/docs/DATA_MODEL.md
  - apps/ios/docs/PERSISTENCE.md
  - apps/ios/docs/STATUS.md
  - apps/ios/docs/DEVELOPMENT_PLAN.md
  - apps/ios/docs/DECISIONS.md
  - apps/ios/docs/CHANGELOG.md
  - .ai_project/tasks/active/T-20260805-002_ios-local-domain-draft-lifecycle.md
  - .ai_project/reports/T-20260805-002_ios-local-domain-draft-lifecycle-report.md
  - .ai_project/qa/T-20260805-002_ios-local-domain-draft-lifecycle-qa.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - apps/ios/agents.md
  - apps/ios/docs/ARCHITECTURE.md
  - apps/ios/docs/DATA_MODEL.md
  - apps/ios/docs/PERSISTENCE.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-05
updated_at: 2026-08-05
report_to: .ai_project/reports/T-20260805-002_ios-local-domain-draft-lifecycle-report.md
qa_to: .ai_project/qa/T-20260805-002_ios-local-domain-draft-lifecycle-qa.md
---

# iOS 로컬 도메인·SwiftData migration·draft 생명주기 구현

## 범위

- 여러 진행 기록과 `draft_step_preview -> draft_ai_review -> completed` 상태 모델
- STEP Preview·AI Review draft·완료 Recipe의 단일 식별자와 전환 규칙
- 기존 완료 Recipe를 보존하는 SwiftData schema·migration 경계
- 자동 저장과 수동 임시 저장을 후속 화면에서 사용할 Repository·UseCase 계약
- 앱 재실행 복구, 저장 실패 시 원본 보존과 단위 테스트 fixture

## 성공 기준

- 기존 저장 Recipe를 잃지 않고 새 schema로 읽을 수 있다.
- 여러 draft와 완료 Recipe가 독립 ID·순서·상태를 유지한다.
- 허용되지 않은 상태 전이와 부분 저장 실패가 기존 데이터를 손상시키지 않는다.
- 실제 STT·AI·TTS 또는 화면 재설계를 포함하지 않는다.
- 관련 XCTest와 migration·복구 테스트를 통과하고 iOS QA에 독립 검증을 인계한다.

## 승인 및 인계

- 2026-08-05: Product Owner가 상위 T-003 진행과 첫 패키지 실행을 승인했다.
- iOS Agent는 전용 worktree에서 lock을 획득한 뒤 `approved -> in_progress`로 전환한다.
- 완료 후 `verification_ready`로 전환하고 iOS QA Agent가 독립 검증한다.
- 2026-08-05: iOS Agent가 전용 구현 worktree에서 lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-08-05: lifecycle·SwiftData·복구 구현과 전체 XCTest, 기존 store 위 앱 실행 자체 검증을 완료해 `verification_ready`로 iOS QA Agent에 인계했다.
- 2026-08-05: iOS QA Agent가 독립 QA worktree에서 lock을 획득하고 `verification_ready -> verification_in_progress`로 전환했다.
- 2026-08-05: iOS QA Agent가 기존 39개 XCTest와 실제 non-empty legacy store migration 통과를 확인했으나, 알 수 없는 lifecycle 완료 행 누락과 완료 UUID의 draft 덮어쓰기 결함 2건을 재현해 `verification_in_progress -> rework_requested`로 Development Lead Agent에 인계했다.
- 2026-08-05: Product Owner가 `QA-HIGH-805002-001~002`를 하나의 데이터 무손실
  재작업 범위로 승인했다. Development Lead Agent가 `rework_requested -> approved`로
  전환하고 iOS Agent에 재인계했다.
- 2026-08-05: iOS Agent가 승인된 재작업을 위해 전용 구현 worktree에서 lock을 다시
  획득하고 `approved -> in_progress`로 전환했다.
- 2026-08-05: legacy lifecycle fallback과 원자적 UUID 충돌 거부를 구현하고 QA 회귀·
  실제 non-empty migration 포함 전체 XCTest 43개를 통과해 `in_progress ->
  verification_ready`로 iOS QA Agent에 독립 재검증을 인계했다.
- 2026-08-05: iOS QA Agent가 별도 재검증 worktree에서 lock을 획득하고
  `verification_ready -> verification_in_progress`로 전환했다.
- 2026-08-05: iOS QA Agent가 `QA-HIGH-805002-001~002` 집중 회귀 4개와 실제
  non-empty migration 포함 전체 XCTest 43개를 독립 실행해 모두 통과시켰다. 신규 결함과
  잔여 위험 없이 `verification_in_progress -> verification_passed`로 Development Lead
  Agent / Completion Role에 인계했다.

## 재작업 승인 범위

- 알 수 없는 legacy lifecycle 값을 Mapper와 완료 Recipe 단건·목록 조회에서 동일하게
  `completed`로 취급해 기존 레시피가 숨겨지지 않게 한다.
- 새 draft 생성 시 기존 UUID 존재 여부를 확인하고 명시적 충돌 오류로 거부하며,
  InMemory·SwiftData 모두 기존 completed record와 내용을 변경하지 않는다.
- QA 회귀 테스트 2개와 실제 non-empty legacy migration, 기존 XCTest 39개를 모두
  통과시키고 iOS QA Agent에 독립 재검증을 요청한다.
- 화면·STT·AI·TTS·후속 `T-20260805-003~008` 구현은 이번 재작업에 포함하지 않는다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Completion Role이야.
Task `T-20260805-002`의 완료 확정 여부를 검토해줘.

- 현재 상태: `verification_passed`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `39468f455b20234b4cc237cf84c718a170376419`
- 다음에 해야 할 일: QA 결과와 잔여 위험을 검토하고 `completion_review`를 거쳐 Task를
  `done`으로 확정할지 판단해줘.
- 기준 문서: `docs/product/CookLog_PRD_v2.md`, `apps/ios/docs/DATA_MODEL.md`, `apps/ios/docs/PERSISTENCE.md`, `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md`
- 허용 경로: 현재 Task의 `allowed_paths`
- 참고 산출물: `.ai_project/reports/T-20260805-002_ios-local-domain-draft-lifecycle-report.md`, `.ai_project/qa/T-20260805-002_ios-local-domain-draft-lifecycle-qa.md`
- 변경/검토 대상: `apps/ios/CookLog/Domain/`, `apps/ios/CookLog/Data/`, `apps/ios/CookLogTests/`, 관련 iOS 문서
- 검증 결과: `QA-HIGH-805002-001~002` 해소, 집중 4/4·전체 43/43 XCTest 통과,
  실제 non-empty migration과 completed 내용 보존 확인
- 남은 리스크: 없음
- 차단/결정 필요: 완료 확정 후 `T-20260805-003` 의존성 해제 판단이 필요하다.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
- 완료 가능 시: `completion_review`를 거쳐 `done`으로 전환하고 관련 board를 갱신해줘.
