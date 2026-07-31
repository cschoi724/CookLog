---
schema: aiops.task.v1
id: T-20260730-005
title: iOS CI PR dry run·실패 감지·회귀 검증
status: in_progress
type: test
priority: P0
priority_reason: branch protection 전에 실제 PR에서 성공과 의도된 실패가 모두 감지돼야 한다.
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
  - T-20260730-004
blocks:
  - T-20260728-008
  - T-20260730-006
parallel_group:
allowed_paths:
  - .github/workflows/ios-build.yml
  - .github/workflows/ios-xctest.yml
  - apps/ios/docs/TESTING.md
  - .ai_project/tasks/backlog/T-20260730-005_verify-ios-ci-pr-dry-run.md
  - .ai_project/tasks/active/T-20260730-005_verify-ios-ci-pr-dry-run.md
  - .ai_project/reports/T-20260730-005_verify-ios-ci-pr-dry-run-report.md
  - .ai_project/qa/T-20260730-005_verify-ios-ci-pr-dry-run-qa.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/GIT_WORKFLOW.md
  - apps/ios/docs/TESTING.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by: iOS Agent
locked_at: 2026-07-31T13:05:08+09:00
lock_session: /root
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: '2026-07-31'
report_to: .ai_project/reports/T-20260730-005_verify-ios-ci-pr-dry-run-report.md
qa_to: .ai_project/qa/T-20260730-005_verify-ios-ci-pr-dry-run-qa.md
---

# iOS CI PR dry run·실패 감지·회귀 검증

## 범위

- 실제 Task PR에서 `ios-build`, `ios-xctest` 성공 실행
- 승인된 fixture 또는 임시 검증 브랜치로 build 실패·test 실패·timeout 감지
- artifact와 check 이름의 branch protection 준비도 판정

## 성공·검증 기준

- 실행 담당과 분리된 iOS QA Agent가 성공·실패·timeout을 독립 재현한다.
- 검증용 실패 변경은 제품 코드에 병합하지 않는다.

## 승인 및 실행 기준

- 2026-07-31 Product Owner가 T-20260730-005 실행을 승인했다.
- 선행 `T-20260730-004`는 `done`이며 PR checks와 artifact 통합을 통과했다.
- 실제 PR에서 정상 build·XCTest와 의도적 build/test 실패·timeout을 각각 확인한다.
- 실패 재현은 검증용 브랜치·fixture에서만 수행하고 제품 코드나 `develop`에 병합하지
  않는다.
- `ios-build`, `ios-xctest` check 이름과 artifact 진단 경계를 확인한 뒤 T-006
  required check 외부 설정으로 인계한다.
- 실행은 iOS Agent, 독립 판정은 iOS QA Agent가 담당한다.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-31 | Product Owner | transition: proposed -> approved | T-004 완료 후 실제 PR dry run·실패 감지·회귀 검증 실행 승인 |
| 2026-07-31 | Development Lead Agent | approve execution | iOS Agent 실행, iOS QA Agent 독립 검증, T-006 required check 인계 기준 확정 |
| 2026-07-31 | iOS Agent | transition: approved -> in_progress | 정상 Task PR과 격리된 build 실패·test 실패·timeout 검증 PR 실행 시작 |
