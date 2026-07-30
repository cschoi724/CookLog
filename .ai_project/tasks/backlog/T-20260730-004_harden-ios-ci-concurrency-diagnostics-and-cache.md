---
schema: aiops.task.v1
id: T-20260730-004
title: iOS CI concurrency·진단·cache·artifact 통합
status: proposed
type: feature
priority: P1
priority_reason: 중복 실행 비용을 줄이고 실패 원인을 보존하되 불안정한 cache를 피해야 한다.
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
  - T-20260730-002
  - T-20260730-003
blocks:
  - T-20260728-008
  - T-20260730-005
parallel_group:
allowed_paths:
  - .github/workflows/ios-build.yml
  - .github/workflows/ios-xctest.yml
  - .github/actions/
  - apps/ios/docs/TESTING.md
  - .ai_project/tasks/backlog/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache.md
  - .ai_project/tasks/active/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache.md
  - .ai_project/reports/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache-report.md
  - .ai_project/qa/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache-qa.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/GIT_WORKFLOW.md
  - apps/ios/docs/TESTING.md
created_by: Development Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: 2026-07-30
report_to: .ai_project/reports/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache-report.md
qa_to: .ai_project/qa/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache-qa.md
---

# iOS CI concurrency·진단·cache·artifact 통합

## 범위

- 같은 PR의 이전 실행 취소와 최신 실행 유지
- 실패 로그·artifact retention과 요약
- 검증된 최소 cache만 적용하고 DerivedData 오염 방지

## 성공·검증 기준

- 취소가 다른 브랜치 실행을 중단하지 않는다.
- iOS QA Agent가 cache 유무 회귀와 실패 진단 가능성을 검증한다.
