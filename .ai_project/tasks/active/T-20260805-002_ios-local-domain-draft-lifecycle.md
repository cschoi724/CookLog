---
schema: aiops.task.v1
id: T-20260805-002
title: iOS 로컬 도메인·SwiftData migration·draft 생명주기 구현
status: approved
type: feature
priority: P0
priority_reason: 모든 화면이 공유하는 진행 기록·임시 저장·완료 전환과 영속화 경계를 먼저 고정해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: iOS Agent
target_role: Execution Role
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
