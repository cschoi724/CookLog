---
id: T-20260728-019
title: develop 통합 브랜치 기반 Git 운영 전환
status: done
type: ops_migration
priority: P0
priority_reason: 병렬 디자인·iOS·Backend 작업을 main에 직접 집약하지 않고 통합 검증할 중간 브랜치가 필요하다.
org_unit: AI Ops Division
team: AI Ops Team
team_lead: AI Ops Agent
workflow: ops_migration
target_agent: AI Ops Agent
target_role: Ops Governance Role
required_capabilities:
  - workflow_governance
  - process_governance
depends_on:
  - T-20260728-007
blocks: []
parallel_group:
allowed_paths:
  - docs/GIT_WORKFLOW.md
  - docs/PROJECT_DECISIONS.md
  - docs/PROJECT_CHANGELOG.md
  - docs/PROJECT_STATUS.md
  - .ai_project/branch_pr_strategy.md
  - .ai_project/operating_model.md
  - .ai_project/workflow_overrides.md
  - .ai_project/ops_decisions.md
  - .ai_project/current_context.md
  - .ai_project/source_of_truth.md
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/tasks/
  - .ai_project/reports/
source_of_truth:
  - docs/GIT_WORKFLOW.md
  - .ai_project/branch_pr_strategy.md
  - .ai_project/operating_model.md
created_by: Product Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
report_to: .ai_project/reports/T-20260728-019_adopt-develop-integration-flow-report.md
qa_to:
---

# develop 통합 브랜치 기반 Git 운영 전환

## 목적

병렬 Task를 `develop`에서 통합하고 릴리즈 가능한 상태만 `main`에 승격하도록 Git·PR 흐름을 전환한다.

## 확정 범위

- GitHub 기본 작업 브랜치와 일반 Task 기준 브랜치를 `develop`로 변경한다.
- 모든 일반 `task/*` 브랜치는 최신 `develop`에서 생성하고 PR 대상도 `develop`로 한다.
- `main`은 릴리즈 가능한 안정 브랜치로 유지한다.
- `develop -> main`은 통합 검증과 Product Owner 승인을 거친 승격 PR로만 반영한다.
- `hotfix/*`는 `main`에서 생성해 `main`에 병합한 뒤 `develop`에 역반영한다.
- `main`과 `develop` 모두 직접 commit, push, force push를 금지한다.
- 현재 진행 중인 미커밋 작업은 기존 작업 폴더에 보존하고 전환 worktree와 섞지 않는다.

## 완료 기준

- Git 운영 기준 문서와 운영 모델의 브랜치 선택값이 일치한다.
- Task PR과 `develop -> main` 승격 PR의 검증·승인 조건이 구분된다.
- hotfix 역반영 절차가 정의된다.
- 최신 `main`에서 `develop` 원격 브랜치가 생성된다.
- 기존 로컬 미커밋 작업이 변경되지 않는다.

## 전환 예외

이 Task는 기존 `task/* -> main` 정책에서 새 정책으로 이동시키는 1회성 운영 전환이다. Product Owner가 정책 수정, push, PR, merge와 `develop` 생성을 한 번에 승인했으므로 정책 PR의 `main` 병합을 Task 완료 게이트로 사용한다.

## 상태 전이 기록

- 2026-07-28: Product Owner가 에이전트 작업 동결과 인계를 확인하고 정책 전환 실행을 승인했다.
- 2026-07-28: 최신 `origin/main` 기반 별도 worktree와 Task 브랜치를 생성했다.
- 2026-07-28: 정책 정합성 검증, PR 병합과 `develop` 생성을 하나의 승인된 전환 절차로 확정했다.
