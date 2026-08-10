---
schema: aiops.task.v1
id: T-20260810-004
title: Backend production 비용 hard cutoff·redaction·observability 구현
status: proposed
type: feature
priority: P0
priority_reason: 실제 provider·storage·인증을 비용과 개인정보 fail-closed 경계 안에서 운영해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities: [technical_planning, dependency_management]
ownership:
  paths: [apps/backend/src/cost/, apps/backend/src/observability/, apps/backend/tests/security/, apps/backend/contracts/security/]
  domains: [cost-control, privacy-observability]
  documents: [apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260810-001, T-20260810-002, T-20260810-003]
blocks: [T-20260810-006, T-20260729-003]
parallel_group:
allowed_paths:
  - apps/backend/src/cost/
  - apps/backend/src/observability/
  - apps/backend/tests/security/
  - apps/backend/contracts/security/
  - apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
  - apps/backend/docs/STATUS.md
  - apps/backend/docs/CHANGELOG.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - .ai_project/tasks/active/T-20260729-003_build-production-stt-ai-backend-gateway.md
  - .ai_project/tasks/active/T-20260729-024_define-backend-security-privacy-observability-guardrails.md
  - apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
created_by: Development Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-10
updated_at: 2026-08-10
report_to: .ai_project/reports/T-20260810-004_backend-production-cost-observability-report.md
qa_to: .ai_project/qa/T-20260810-004_backend-production-cost-observability-qa.md
status_ref: origin/develop
status_ref_sha: 1657056
---

# Backend production 비용 hard cutoff·redaction·observability 구현

## Scope

- Goal: 실제 provider 호출·storage·인증 사용량을 승인된 예산과 비콘텐츠 관측성 경계에 연결한다.
- In scope: provider 호출 전 원자적 비용 reservation, 월 호출·입력·출력 token hard cutoff, retry 비용, service disable, allowlist telemetry, alert·incident cleanup 테스트.
- Out of scope: 결제 상품·구독 quota, 콘텐츠 logging, production traffic.
- Acceptance criteria: cutoff·ledger·telemetry 장애가 provider side effect와 결과 공개 전에 fail closed하고 원문·prompt·결과·secret이 sink에 기록되지 않는다.

## Decision Gate

- Product Owner가 최신 가격 재계산 결과와 월 KRW 예산, 호출·token 상한을 승인해야 한다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-10 | Development Lead Agent |  | proposed | production 비용·관측성 패키지 생성 |
