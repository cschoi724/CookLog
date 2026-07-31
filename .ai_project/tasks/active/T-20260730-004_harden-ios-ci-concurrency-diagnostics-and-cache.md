---
schema: aiops.task.v1
id: T-20260730-004
title: iOS CI concurrency·진단·cache·artifact 통합
status: approved
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
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: 2026-07-31
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

## 승인 및 실행 기준

- 2026-07-31 Product Owner가 T-20260730-004 실행을 승인했다.
- 선행 T-20260730-002·003은 모두 `done`이며 hosted 정상 검증을 통과했다.
- 최신 `origin/develop` 완료 SHA `a3d1853`에서 전용 worktree와 Task 브랜치를
  생성했다.
- iOS Agent가 lock을 획득하고 `in_progress`로 전환한 뒤 구현한다.
- concurrency group은 같은 PR의 이전 실행만 취소하고 다른 PR·브랜치 실행을
  취소하지 않아야 한다.
- cache는 독립 검증으로 이득과 비회귀가 확인되는 최소 범위만 허용하며
  DerivedData 전체 cache는 기본적으로 추가하지 않는다.
- 구현 완료 후 iOS QA Agent의 독립 검증과 Development Lead 완료 검토를 거친다.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-31 | Product Owner | transition: proposed -> approved | concurrency·진단·cache·artifact 통합 실행 승인 |
| 2026-07-31 | Development Lead Agent | prepare execution branch | 최신 origin/develop a3d1853 기반 전용 worktree와 Task 브랜치 준비 |
