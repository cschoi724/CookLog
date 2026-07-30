---
schema: aiops.task.v1
id: T-20260730-006
title: ios-build·ios-xctest required check 외부 설정
status: proposed
type: ops
priority: P0
priority_reason: 검증된 CI를 develop과 main의 실제 merge gate로 적용해야 한다.
org_unit: AI Operations Division
team: AI Ops Team
team_lead: AI Ops Agent
workflow: ops
target_agent: AI Ops Agent
target_role: Ops Governance Role
required_capabilities:
  - process_governance
  - workflow_governance
depends_on:
  - T-20260730-005
blocks:
  - T-20260728-008
parallel_group:
allowed_paths:
  - docs/GIT_WORKFLOW.md
  - .ai_project/branch_pr_strategy.md
  - .ai_project/tasks/backlog/T-20260730-006_configure-ios-required-checks.md
  - .ai_project/tasks/active/T-20260730-006_configure-ios-required-checks.md
  - .ai_project/reports/T-20260730-006_configure-ios-required-checks-report.md
  - .ai_project/qa/T-20260730-006_configure-ios-required-checks-qa.md
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/GIT_WORKFLOW.md
  - .ai_project/branch_pr_strategy.md
created_by: Development Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: 2026-07-30
report_to: .ai_project/reports/T-20260730-006_configure-ios-required-checks-report.md
qa_to: .ai_project/qa/T-20260730-006_configure-ios-required-checks-qa.md
---

# ios-build·ios-xctest required check 외부 설정

## 승인 경계

- Product Owner의 이 하위 Task 실행 승인 전 repository 설정을 변경하지 않는다.
- `T-20260730-005` iOS QA 통과 후 check 이름과 대상 브랜치를 다시 확인한다.

## 범위

- `develop`, `main` branch protection에 검증된 required check 적용
- 직접 push 금지와 PR review gate 정합성 확인
- 외부 설정 결과와 rollback 절차 기록

## 성공·검증 기준

- 실패 check가 있는 PR은 merge할 수 없고 성공 check는 정상 통과한다.
- iOS QA Agent가 GitHub 실제 gate를 독립 확인한다.
