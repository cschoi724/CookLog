---
schema: aiops.task.v1
id: T-20260804-006
title: Backend redacted logging·비용 원장·TTL cleanup 경계 구현
status: proposed
type: feature
priority: P0
priority_reason: Mock 실행에서도 콘텐츠 비노출·비용 hard cutoff·삭제 불변식을 강제해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Backend Agent
target_role: Execution Role
required_capabilities:
- backend_implementation
- security_review
depends_on:
- T-20260804-003
- T-20260804-004
- T-20260804-005
blocks:
- T-20260804-007
parallel_group:
allowed_paths:
- apps/backend/src/observability/
- apps/backend/src/cost/
- apps/backend/src/cleanup/
- apps/backend/src/jobs/
- apps/backend/src/storage/
- apps/backend/tests/security/
- apps/backend/tests/cleanup/
- apps/backend/docs/STATUS.md
- apps/backend/docs/CHANGELOG.md
- .ai_project/tasks/backlog/T-20260804-006_implement-backend-safety-runtime.md
- .ai_project/tasks/active/T-20260804-006_implement-backend-safety-runtime.md
- .ai_project/reports/T-20260804-006_implement-backend-safety-runtime-report.md
- .ai_project/qa/T-20260804-006_implement-backend-safety-runtime-qa.md
- .ai_project/teams/development/task_board.md
- .ai_project/teams/quality/task_board.md
source_of_truth:
- apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
- apps/backend/contracts/security/
created_by: Development Lead Agent
approved_by:
created_at: 2026-08-04
updated_at: 2026-08-04
report_to: .ai_project/reports/T-20260804-006_implement-backend-safety-runtime-report.md
qa_to: .ai_project/qa/T-20260804-006_implement-backend-safety-runtime-qa.md
---

# Backend 안전 runtime 경계 구현

## 범위

- allowlist structured logger와 redaction scanner
- operation 단위 비용 전액 예약·거절·초과 actual 정산
- ACK 즉시 삭제, +22시간 cleanup, sweeper, +24시간 접근 차단
- 주입 가능한 clock과 장애·동시성 테스트

## 성공 기준

- 콘텐츠·secret·token·provider raw body 로그 0건
- 월 KRW 50,000 hard cutoff 불변식 유지
- cleanup 실패·재시도·만료 접근 차단 fixture 통과
