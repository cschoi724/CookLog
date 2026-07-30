---
schema: aiops.task.v1
id: T-20260730-003
title: ios-xctest 직렬 실행·timeout·artifact workflow 구현
status: proposed
type: feature
priority: P0
priority_reason: 전체 XCTest 결과와 timeout을 PR에서 재현 가능하게 만들어야 한다.
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
  - .github/workflows/ios-xctest.yml
  - apps/ios/docs/TESTING.md
  - .ai_project/tasks/backlog/T-20260730-003_implement-ios-xctest-workflow.md
  - .ai_project/tasks/active/T-20260730-003_implement-ios-xctest-workflow.md
  - .ai_project/reports/T-20260730-003_implement-ios-xctest-workflow-report.md
  - .ai_project/qa/T-20260730-003_implement-ios-xctest-workflow-qa.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - apps/ios/Scripts/run-xctest.sh
  - apps/ios/docs/TESTING.md
  - docs/GIT_WORKFLOW.md
created_by: Development Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: 2026-07-30
report_to: .ai_project/reports/T-20260730-003_implement-ios-xctest-workflow-report.md
qa_to: .ai_project/qa/T-20260730-003_implement-ios-xctest-workflow-qa.md
---

# ios-xctest 직렬 실행·timeout·artifact workflow 구현

## 범위

- `Scripts/run-xctest.sh`를 사용하는 `ios-xctest` workflow
- timeout 124와 일반 실패 구분
- 성공·실패 시 log, `xcresult`, `TIMED_OUT` artifact 업로드

## 성공·검증 기준

- 전체 XCTest가 고정 환경에서 명확히 종료된다.
- iOS QA Agent가 통과·테스트 실패·timeout artifact를 독립 검증한다.
