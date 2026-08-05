---
schema: aiops.task.v1
id: T-20260804-003
title: Backend 공통 HTTP·인증·제한·idempotency middleware 구현
status: rework_requested
type: feature
priority: P0
priority_reason: 도메인 handler 전에 공통 계약과 abuse 경계를 실행 코드로 강제해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities:
- backend_implementation
- api_contract
depends_on:
- T-20260804-002
blocks:
- T-20260804-004
- T-20260804-005
- T-20260804-006
- T-20260804-007
parallel_group:
allowed_paths:
- apps/backend/src/http/
- apps/backend/src/auth/
- apps/backend/src/limits/
- apps/backend/src/idempotency/
- apps/backend/tests/http/
- apps/backend/tests/auth/
- apps/backend/docs/STATUS.md
- apps/backend/docs/CHANGELOG.md
- .ai_project/tasks/backlog/T-20260804-003_implement-backend-common-middleware.md
- .ai_project/tasks/active/T-20260804-003_implement-backend-common-middleware.md
- .ai_project/reports/T-20260804-003_implement-backend-common-middleware-report.md
- .ai_project/qa/T-20260804-003_implement-backend-common-middleware-qa.md
- .ai_project/teams/development/task_board.md
- .ai_project/teams/quality/task_board.md
source_of_truth:
- apps/backend/docs/API_CONTRACT.md
- apps/backend/contracts/common/
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-04
updated_at: 2026-08-05
report_to: .ai_project/reports/T-20260804-003_implement-backend-common-middleware-report.md
qa_to: .ai_project/qa/T-20260804-003_implement-backend-common-middleware-qa.md
---

# Backend 공통 middleware 구현

## 범위

- request ID·envelope·problem renderer와 JSON Schema validation
- installation token·attestation verifier interface와 local fake
- installation·IP·project rate limit
- idempotency body hash·동시 단일 승자·replay

## 성공 기준

- 공통 fixture와 error catalog가 runtime 응답과 일치한다.
- 검증 실패는 도메인·provider를 호출하지 않는다.
- token·proof·IP·본문이 로그에 남지 않는다.
- Backend QA 독립 검증 후에만 후속 Task를 연다.

## 승인 및 상태 전이

- 2026-08-05: Product Owner가 T-20260804-003 진행을 승인했다.
- 2026-08-05: Backend Agent가 T-002 `done`과 PR #70 `develop` 병합을 확인하고 전용
  worktree에서 `proposed -> approved -> in_progress`로 전환했다.
- 2026-08-05: 공통 HTTP·인증·제한·idempotency 구현과 신규 21개, 기존 15개 테스트,
  공용 계약 validator 자체 검증을 완료해 `in_progress -> verification_ready`로
  Backend QA Agent에 인계했다.
- 2026-08-05: Backend QA Agent가 최신 `origin/develop`, 구현 보고서와 clean worktree를
  확인하고 `verification_ready -> verification_in_progress`로 전환해 독립 검증을 시작했다.
- 2026-08-05: Backend QA Agent가 공개 violation extra property secret 누출과 strict
  schema prototype-key 우회 HIGH 2건, query 포함 unsupported version 오분류 MEDIUM 1건을
  확인했다. 최종 `FAIL`, `verification_in_progress -> rework_requested`로 Development
  Lead Agent에 인계했다.
