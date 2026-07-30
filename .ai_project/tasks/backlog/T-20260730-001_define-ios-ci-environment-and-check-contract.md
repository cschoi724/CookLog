---
schema: aiops.task.v1
id: T-20260730-001
title: iOS CI 환경·명령·check 계약 확정
status: proposed
type: docs
priority: P0
priority_reason: workflow 구현 전에 지원 runner·Xcode·Simulator와 고정 check 이름을 합의해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: docs
target_agent: iOS Agent
target_role: Execution Role
required_capabilities:
  - ios_implementation
  - developer_verification
depends_on:
  - T-20260728-004
  - T-20260728-007
blocks:
  - T-20260728-008
  - T-20260730-002
  - T-20260730-003
parallel_group: ios-ci-foundation
allowed_paths:
  - apps/ios/README.md
  - apps/ios/docs/TESTING.md
  - docs/GIT_WORKFLOW.md
  - .ai_project/tasks/backlog/T-20260730-001_define-ios-ci-environment-and-check-contract.md
  - .ai_project/tasks/active/T-20260730-001_define-ios-ci-environment-and-check-contract.md
  - .ai_project/reports/T-20260730-001_define-ios-ci-environment-and-check-contract-report.md
  - .ai_project/qa/T-20260730-001_define-ios-ci-environment-and-check-contract-qa.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - apps/ios/docs/TESTING.md
  - apps/ios/README.md
  - docs/GIT_WORKFLOW.md
created_by: Development Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: 2026-07-30
report_to: .ai_project/reports/T-20260730-001_define-ios-ci-environment-and-check-contract-report.md
qa_to: .ai_project/qa/T-20260730-001_define-ios-ci-environment-and-check-contract-qa.md
---

# iOS CI 환경·명령·check 계약 확정

## 범위

- GitHub macOS runner, Xcode와 iOS Simulator 조합 명시
- `ios-build`, `ios-xctest` check 이름과 실행 명령
- `build`, `build-for-testing`, `Scripts/run-xctest.sh` 경계
- workflow·스크립트 timeout과 artifact 경로

## 성공·검증 기준

- 이후 workflow Task가 추가 해석 없이 구현할 수 있다.
- iOS QA Agent가 로컬 T-004 기준과 CI 계약의 차이를 독립 검토한다.
