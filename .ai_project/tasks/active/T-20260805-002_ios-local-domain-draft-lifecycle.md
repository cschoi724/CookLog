---
schema: aiops.task.v1
id: T-20260805-002
title: iOS 로컬 도메인·SwiftData migration·draft 생명주기 구현
status: verification_ready
type: feature
priority: P0
priority_reason: 모든 화면이 공유하는 진행 기록·임시 저장·완료 전환과 영속화 경계를 먼저 고정해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: iOS QA Agent
target_role: Verification Role
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

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 iOS QA Agent / Verification Role이야.
Task `T-20260805-002`의 실행 결과를 독립적으로 검증해줘.

- 현재 상태: `verification_ready`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `39468f455b20234b4cc237cf84c718a170376419`
- 다음에 해야 할 일: Task report, 변경 파일, source of truth를 기준으로 lifecycle 전이·SwiftData 복구·legacy 완료 Recipe 호환·저장 실패 원본 보존을 독립 검증해줘.
- 기준 문서: `docs/product/CookLog_PRD_v2.md`, `apps/ios/docs/DATA_MODEL.md`, `apps/ios/docs/PERSISTENCE.md`, `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md`
- 허용 경로: 현재 Task의 `allowed_paths`
- 참고 산출물: `.ai_project/reports/T-20260805-002_ios-local-domain-draft-lifecycle-report.md`
- 변경/검토 대상: `apps/ios/CookLog/Domain/`, `apps/ios/CookLog/Data/`, `apps/ios/CookLogTests/`, 관련 iOS 문서
- 남은 리스크: 기존 Simulator store의 Recipe 행이 0개여서 실제 legacy 행 migration은 기본값·Mapper 테스트로 검증했고, non-empty 실제 store migration은 독립 QA에서 보강 가능하다.
- 차단/결정 필요: 없음
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
- 통과 시: status를 `verification_passed`로 바꾸고 target_role을 Completion Role로 넘겨줘.
- 수정 필요 시: status를 `rework_requested`로 바꾸고 수정 항목을 명확히 남겨줘.
