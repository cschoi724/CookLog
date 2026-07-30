---
schema: aiops.task.v1
id: T-20260730-002
title: ios-build·build-for-testing workflow 구현
status: approved
type: feature
priority: P0
priority_reason: 모든 develop PR에서 컴파일과 테스트 빌드 실패를 자동 차단해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: iOS Agent
target_role: Execution Role
required_capabilities:
  - ios_implementation
  - developer_verification
depends_on:
  - T-20260730-001
blocks:
  - T-20260728-008
  - T-20260730-004
parallel_group: ios-ci-workflows
allowed_paths:
  - .github/workflows/ios-build.yml
  - apps/ios/docs/TESTING.md
  - .ai_project/tasks/backlog/T-20260730-002_implement-ios-build-workflow.md
  - .ai_project/tasks/active/T-20260730-002_implement-ios-build-workflow.md
  - .ai_project/reports/T-20260730-002_implement-ios-build-workflow-report.md
  - .ai_project/qa/T-20260730-002_implement-ios-build-workflow-qa.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/GIT_WORKFLOW.md
  - apps/ios/docs/TESTING.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: 2026-07-30
report_to: .ai_project/reports/T-20260730-002_implement-ios-build-workflow-report.md
qa_to: .ai_project/qa/T-20260730-002_implement-ios-build-workflow-qa.md
---

# ios-build·build-for-testing workflow 구현

## 범위

- `develop`·`main` 대상 PR의 `ios-build` workflow
- build와 build-for-testing 실행, 명확한 실패 반환
- 최소 권한과 secret 비노출

## 성공·검증 기준

- 성공·컴파일 실패를 재현할 수 있다.
- iOS QA Agent가 check 이름과 실패 감지를 독립 검증한다.

## 승인 및 실행 순서

- 2026-07-30 Product Owner가 실행을 승인했다.
- 단일 iOS Agent 운영 기준으로 이 Task를 먼저 실행한다.
- 최신 `origin/develop` 기반 전용 worktree와 Task 브랜치를 사용한다.
- 구현 완료 후 iOS QA Agent의 독립 검증과 Development Lead 완료 검토를 거친다.
- `T-20260730-003`은 이 Task가 `done`으로 확정된 뒤 시작한다.
