---
schema: aiops.task.v1
id: T-20260729-024
title: Backend 보안·개인정보·관측성·비용 guardrail 정의
status: proposed
type: docs
priority: P0
priority_reason: 사용자 콘텐츠와 provider 비용을 로그·장애·abuse 경계에서 보호해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: docs
target_agent: Backend Agent
target_role: Execution Role
required_capabilities:
  - backend_architecture
  - api_contract
depends_on:
  - T-20260729-020
  - T-20260729-021
blocks:
  - T-20260728-005
  - T-20260729-025
parallel_group: backend-contract-foundation
allowed_paths:
  - apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
  - .ai_project/tasks/backlog/T-20260729-024_define-backend-security-privacy-observability-guardrails.md
  - .ai_project/tasks/active/T-20260729-024_define-backend-security-privacy-observability-guardrails.md
  - .ai_project/reports/T-20260729-024_define-backend-security-privacy-observability-guardrails-report.md
  - .ai_project/qa/T-20260729-024_define-backend-security-privacy-observability-guardrails-qa.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/PROJECT_DECISIONS.md
created_by: Development Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: 2026-07-30
report_to: .ai_project/reports/T-20260729-024_define-backend-security-privacy-observability-guardrails-report.md
qa_to: .ai_project/qa/T-20260729-024_define-backend-security-privacy-observability-guardrails-qa.md
---

# Backend 보안·개인정보·관측성·비용 guardrail 정의

## 범위

- secret 관리와 provider key 비노출
- 음성·STT·레시피 본문 redaction과 운영 메타데이터 최대 30일
- provider 보관·학습 설정과 처리 지역 확인 gate
- 장애·quota·비용 soft alert와 hard cutoff
- 감사 가능한 비콘텐츠 metric과 incident 대응

## 성공·검증 기준

- 콘텐츠가 운영·분석·오류 로그에 남지 않는다.
- Backend QA Agent가 개인정보, secret, 비용 폭주와 장애 경계를 독립 검증한다.
