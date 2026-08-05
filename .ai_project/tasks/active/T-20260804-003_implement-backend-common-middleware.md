---
schema: aiops.task.v1
id: T-20260804-003
title: Backend 공통 HTTP·인증·제한·idempotency middleware 구현
status: approved
type: feature
priority: P0
priority_reason: 도메인 handler 전에 공통 계약과 abuse 경계를 실행 코드로 강제해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Backend Agent
target_role: Execution Role
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

## 승인 및 실행 경계

- 2026-08-05: `T-20260804-002`가 PR #70으로 `develop`에 병합돼 선행 조건이 해소됐다.
- 2026-08-05: Product Owner가 실행을 승인해 `proposed -> scoped -> approved`로 전환하고
  Backend Agent / Execution Role에 인계했다.
- Backend Agent는 전용 구현 worktree에서 lock을 획득한 뒤 `in_progress`로 전환한다.
- 구현은 공통 HTTP envelope·인증 verifier interface·rate limit·idempotency 경계와
  해당 테스트에 한정한다.
- 실제 AI provider, AI job handler, 원격 STT endpoint, redacted logging·비용·TTL은
  각각 후속 `T-20260804-004~006` 범위이며 선행 구현하지 않는다.
- 완료 후 Backend QA Agent가 공통 fixture 일치, provider 미호출, 민감정보 비노출,
  동시 idempotency 단일 승자를 독립 검증한다.
