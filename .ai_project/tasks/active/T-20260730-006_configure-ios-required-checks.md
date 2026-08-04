---
schema: aiops.task.v1
id: T-20260730-006
title: ios-build·ios-xctest required check 외부 설정
status: in_progress
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
- ".ai_project/branch_pr_strategy.md"
- ".ai_project/tasks/backlog/T-20260730-006_configure-ios-required-checks.md"
- ".ai_project/tasks/active/T-20260730-006_configure-ios-required-checks.md"
- ".ai_project/reports/T-20260730-006_configure-ios-required-checks-report.md"
- ".ai_project/qa/T-20260730-006_configure-ios-required-checks-qa.md"
- ".ai_project/task_board.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
source_of_truth:
- docs/GIT_WORKFLOW.md
- ".ai_project/branch_pr_strategy.md"
created_by: Development Lead Agent
approved_by: Product Owner
locked_by: AI Ops Agent
locked_at: '2026-08-04'
lock_session: ops/T-20260730-006-configure-required-checks
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: '2026-08-04'
report_to: ".ai_project/reports/T-20260730-006_configure-ios-required-checks-report.md"
qa_to: ".ai_project/qa/T-20260730-006_configure-ios-required-checks-qa.md"
---

# ios-build·ios-xctest required check 외부 설정

## 승인 경계

- Product Owner의 이 하위 Task 실행 승인 전 repository 설정을 변경하지 않는다.
- `T-20260730-005` iOS QA 통과 후 check 이름과 대상 브랜치를 다시 확인한다.

승인 기록: 2026-08-03 Product Owner가 AI Ops Agent의 실행을 승인했다.

## 범위

- `develop`, `main` branch protection에 검증된 required check 적용
- 직접 push 금지와 PR review gate 정합성 확인
- 외부 설정 결과와 rollback 절차 기록

## 성공·검증 기준

- 실패 check가 있는 PR은 merge할 수 없고 성공 check는 정상 통과한다.
- iOS QA Agent가 GitHub 실제 gate를 독립 확인한다.

## 실행 결과

2026-08-04 최신 `origin/develop@ac927ac`과 GitHub repository 설정을 다시 확인했다.

- `T-20260730-005`: `done`
- `T-20260731-003`: `done`
- repository: public
- required check 목표 이름: `ios-build`, `ios-xctest`
- `develop` ruleset ID: `20340678`
- `develop`: PR 필수, 승인 0, squash only, strict required checks 2개,
  force push·삭제 금지, bypass actor 없음
- `develop` 현재 `protected`: `true`
- `main` 현재 `protected`: `false`, develop 실제 PR 검증 후 적용 예정

## 적용 결정

- `develop`에 먼저 적용하고 실제 PR의 두 check와 merge gate를 확인한다.
- 검증 통과 후 `main`에 같은 ruleset을 적용한다.
- 현재 collaborator가 Product Owner 한 명이므로 required approval은 0으로 두되 PR과
  required checks는 필수로 유지한다.
- 상시 bypass actor는 두지 않는다. 긴급 우회는 Product Owner 승인 후 ruleset 변경과
  원복 시간을 기록하는 방식으로만 허용한다.
- Budget 50/75/90/100%와 Actions 사용량을 함께 점검한다.

## 다음 단계

1. 현재 변경을 T-006 branch에 commit·push하고 `develop` 대상 PR을 만든다.
2. PR 생성 직후 두 required check 전에는 merge가 차단되는지 확인한다.
3. `ios-build`, `ios-xctest` 성공 뒤 merge gate가 열리는지 확인한다.
4. 검증 통과 시 `main`에 같은 설정을 적용한다.
5. Budget·Actions 사용량과 rollback snapshot을 보고하고 iOS QA Agent에 독립 검증을
   인계한다.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-08-03 | AI Ops Agent | lock | task lock |
| 2026-08-03 | AI Ops Agent | transition: approved -> blocked | Private repository의 ruleset과 branch protection이 현재 GitHub 플랜에서 403으로 비활성 |
| 2026-08-03 | AI Ops Agent | unlock | task unlock |
| 2026-08-04 | AI Ops Agent | lock | task lock |
| 2026-08-04 | Product Owner | resume blocked task | develop 선적용 후 main 확대, 두 required check 필수, 승인 기반 긴급 우회, Budget 모니터링 결정 |
| 2026-08-04 | AI Ops Agent | develop ruleset applied | ruleset `20340678`, active, bypass 없음, required checks 2개 |
