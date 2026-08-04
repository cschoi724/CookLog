---
schema: aiops.task.v1
id: T-20260804-004
title: Mock AI recipe job·status·ACK·복구 저장 경계 구현
status: proposed
type: feature
priority: P0
priority_reason: 실제 provider 없이 iOS 연동과 비동기 AI 계약을 실행 검증해야 한다.
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
- T-20260804-003
blocks:
- T-20260804-006
- T-20260804-007
parallel_group: backend-foundation-domain-edges
allowed_paths:
- apps/backend/src/ai/
- apps/backend/src/jobs/
- apps/backend/src/storage/
- apps/backend/src/routes/ai/
- apps/backend/tests/ai/
- apps/backend/tests/jobs/
- apps/backend/docs/STATUS.md
- apps/backend/docs/CHANGELOG.md
- .ai_project/tasks/backlog/T-20260804-004_implement-mock-ai-recipe-jobs.md
- .ai_project/tasks/active/T-20260804-004_implement-mock-ai-recipe-jobs.md
- .ai_project/reports/T-20260804-004_implement-mock-ai-recipe-jobs-report.md
- .ai_project/qa/T-20260804-004_implement-mock-ai-recipe-jobs-qa.md
- .ai_project/teams/development/task_board.md
- .ai_project/teams/quality/task_board.md
source_of_truth:
- apps/backend/docs/AI_RECIPE_CONTRACT.md
- apps/backend/contracts/ai/
- apps/backend/contracts/fixtures/
created_by: Development Lead Agent
approved_by:
created_at: 2026-08-04
updated_at: 2026-08-04
report_to: .ai_project/reports/T-20260804-004_implement-mock-ai-recipe-jobs-report.md
qa_to: .ai_project/qa/T-20260804-004_implement-mock-ai-recipe-jobs-qa.md
---

# Mock AI recipe job 구현

## 범위

- `RecipeAIProvider` interface와 deterministic Mock provider
- create·status·ACK·result version·manual retry 경계
- in-memory/test repository와 clock 주입
- provider 단일 호출·idempotency·timeout·invalid output 차단

## 성공 기준

- shared fixture의 정상·오류·timeout·만료 흐름이 runtime integration test를 통과한다.
- 실제 network·provider credential을 사용하지 않는다.
- process 재시작 내구성 제한을 명시한다.
