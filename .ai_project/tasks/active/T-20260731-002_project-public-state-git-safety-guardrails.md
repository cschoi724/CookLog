---
schema: aiops.task.v1
id: T-20260731-002
title: 프로젝트 공용 상태 일관성 및 Git 안전 guardrail
status: verification_ready
type: ops_migration
priority: P0
priority_reason: 다중 Agent worktree가 오래된 로컬 문서를 공용 상태로 오인하면 완료·의존성·착수 판단이 잘못될 수 있다.
org_unit: AI Ops Division
team: AI Ops Team
team_lead: AI Ops Agent
workflow: ops_migration
target_agent: AI Ops Agent
target_role: Ops Governance Role
required_capabilities:
  - ops_audit
  - process_governance
  - workflow_governance
depends_on:
  - T-20260730-005
blocks: []
parallel_group:
allowed_paths:
  - .ai_project/current_context.md
  - .ai_project/source_of_truth.md
  - .ai_project/workflow_overrides.md
  - .ai_project/branch_pr_strategy.md
  - .ai_project/task_board.md
  - docs/GIT_WORKFLOW.md
  - agents.md
  - .ai_project/tasks/active/T-20260731-002_project-public-state-git-safety-guardrails.md
  - .ai_project/reports/T-20260731-002_project-public-state-git-safety-guardrails-report.md
  - .ai_project/qa/T-20260731-002_project-public-state-git-safety-guardrails-qa.md
source_of_truth:
  - .ai_project/source_of_truth.md
  - .ai_project/branch_pr_strategy.md
  - docs/GIT_WORKFLOW.md
created_by: AI Ops Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-31
updated_at: 2026-07-31
report_to: .ai_project/reports/T-20260731-002_project-public-state-git-safety-guardrails-report.md
qa_to: .ai_project/qa/T-20260731-002_project-public-state-git-safety-guardrails-qa.md
---

# 프로젝트 공용 상태 일관성 및 Git 안전 guardrail

## 목적

다중 Agent와 여러 worktree가 동시에 존재해도 프로젝트 공용 상태를 최신
`origin/develop`로 일관되게 판단하고, 오래된 worktree의 변경을 안전하게
보존하도록 CookLog 프로젝트 로컬 운영 기준을 보강한다.

## 범위

- 공용 상태와 로컬 실행 상태를 분리한다.
- 상태 보고에 확인한 `origin/develop` SHA와 로컬 worktree 정보를 포함한다.
- 세션 시작 preflight와 `git show origin/develop:<PATH>` 조회 절차를 추가한다.
- 의존성에 영향을 주는 상태는 `develop` 병합 후에만 공용 효력을 갖게 한다.
- 오래된 dirty worktree의 자동 `reset`, `rebase`, `stash`를 금지한다.
- worktree·branch 정리는 비파괴 감사와 Product Owner 별도 승인 뒤 수행한다.
- Branch 전략과 실제 Git Workflow의 삭제 정책을 일치시킨다.

## 제외 범위

- `.ai/` 공통 헌법과 core workflow 변경
- 기존 worktree·branch의 실제 삭제
- 전체 worktree Registry 작성과 정리 실행
- 제품 코드, CI workflow와 플랫폼 구현 변경

## 완료 기준

- 추적 문서의 Git 충돌 표식이 0건이다.
- T-20260730-005가 Task·프로젝트 Board·Team Board·current context에서
  `done`으로 일치한다.
- `.ai_project/branch_pr_strategy.md`와 `docs/GIT_WORKFLOW.md`의 정리 정책이
  일치한다.
- 공용 상태와 로컬 실행 상태가 명확히 구분된다.
- 오래된 dirty worktree에서 자동 `reset`, `rebase`, `stash`를 금지한다.
- Task에 승인, 허용 경로, 기준 문서, 보고·검증 경로가 존재한다.
- `git diff --check`와 Task strict validation을 통과한다.
- 별도 AI Ops 검증 세션이 최종 PASS를 판정한다.

## 상태 전이 기록

- 2026-07-31: Product Owner가 프로젝트 로컬 guardrail 작업을 승인했다.
- 2026-07-31: T-005 공용 상태 무결성 복구 PR #47의 `develop` 병합을 확인했다.
- 2026-07-31: 최신 `origin/develop@4760ba6` 기반 전용 worktree에서 실행을 시작했다.
- 2026-07-31: 프로젝트 로컬 운영 문서와 Git 정리 정책을 동기화하고 독립 검증으로 인계했다.
