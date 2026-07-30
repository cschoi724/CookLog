---
schema: aiops.task.v1
id: T-20260729-021
title: Backend 공통 API·인증·제한·오류 계약 정의
status: proposed
type: docs
priority: P0
priority_reason: AI와 선택형 원격 STT가 같은 보안·재시도·오류 경계를 사용해야 한다.
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
  - T-20260729-026
blocks:
  - T-20260728-005
  - T-20260729-022
  - T-20260729-023
  - T-20260729-024
  - T-20260729-025
parallel_group: backend-contract-foundation
allowed_paths:
  - apps/backend/contracts/common/
  - apps/backend/docs/API_CONTRACT.md
  - .ai_project/tasks/backlog/T-20260729-021_define-backend-common-api-contract.md
  - .ai_project/tasks/active/T-20260729-021_define-backend-common-api-contract.md
  - .ai_project/reports/T-20260729-021_define-backend-common-api-contract-report.md
  - .ai_project/qa/T-20260729-021_define-backend-common-api-contract-qa.md
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
report_to: .ai_project/reports/T-20260729-021_define-backend-common-api-contract-report.md
qa_to: .ai_project/qa/T-20260729-021_define-backend-common-api-contract-qa.md
---

# Backend 공통 API·인증·제한·오류 계약 정의

## 범위

- 버전·request ID·error envelope
- 설치 단위 인증, App Attest/App Check 검증 경계
- installation·IP·project rate limit과 quota
- idempotency, timeout, retry와 재처리 소유권
- 사용자 메시지와 내부 오류 코드 분리

## 성공·검증 기준

- AI와 비활성 원격 STT 계약이 같은 공통 규칙을 참조한다.
- Backend QA Agent가 replay, abuse, timeout과 제한 초과 계약을 독립 검증한다.
