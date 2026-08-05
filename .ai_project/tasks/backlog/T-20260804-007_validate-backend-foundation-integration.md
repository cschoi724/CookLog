---
schema: aiops.task.v1
id: T-20260804-007
title: Backend foundation 통합 계약·보안 검증과 로컬 실행 handoff
status: proposed
type: test
priority: P0
priority_reason: 후속 provider·iOS 연동 전에 전체 runtime과 계약 원본의 동등성을 고정해야 한다.
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
- T-20260804-004
- T-20260804-005
- T-20260804-006
blocks:
- T-20260729-003
- T-20260728-009
parallel_group:
allowed_paths:
- apps/backend/
- .github/workflows/backend-*.yml
- .ai_project/tasks/backlog/T-20260804-007_validate-backend-foundation-integration.md
- .ai_project/tasks/active/T-20260804-007_validate-backend-foundation-integration.md
- .ai_project/reports/T-20260804-007_validate-backend-foundation-integration-report.md
- .ai_project/qa/T-20260804-007_validate-backend-foundation-integration-qa.md
- .ai_project/teams/development/task_board.md
- .ai_project/teams/quality/task_board.md
source_of_truth:
- apps/backend/AGENTS.md
- apps/backend/docs/
- apps/backend/contracts/
created_by: Development Lead Agent
approved_by:
created_at: 2026-08-04
updated_at: 2026-08-04
report_to: .ai_project/reports/T-20260804-007_validate-backend-foundation-integration-report.md
qa_to: .ai_project/qa/T-20260804-007_validate-backend-foundation-integration-qa.md
---

# Backend foundation 통합 검증

## 범위

- 새 clone install·build·test·local run 재현
- shared fixture 기반 HTTP integration test
- auth·idempotency·timeout·cleanup·비용·redaction 회귀
- 원격 STT route 0개와 production 활성화 불가 확인
- Backend Agent·Backend QA handoff와 CI 필요성 결정

## 성공 기준

- 전체 기존·runtime 계약 테스트가 단일 명령으로 통과한다.
- fixture·runtime response·문서 계약이 동일하다.
- 실제 provider·cloud 없이 재현 가능하다.
- Backend QA 최종 독립 검증을 통과한다.
