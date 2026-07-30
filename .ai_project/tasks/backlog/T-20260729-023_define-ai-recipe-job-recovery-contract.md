---
schema: aiops.task.v1
id: T-20260729-023
title: AI 레시피 job·상태 조회·결과 복구 계약 정의
status: proposed
type: docs
priority: P0
priority_reason: 온라인 AI 정리의 비동기 처리와 실패 복구가 첫 출시 핵심 경로다.
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
  - apps/backend/contracts/ai/
  - apps/backend/docs/AI_RECIPE_CONTRACT.md
  - .ai_project/tasks/backlog/T-20260729-023_define-ai-recipe-job-recovery-contract.md
  - .ai_project/tasks/active/T-20260729-023_define-ai-recipe-job-recovery-contract.md
  - .ai_project/reports/T-20260729-023_define-ai-recipe-job-recovery-contract-report.md
  - .ai_project/qa/T-20260729-023_define-ai-recipe-job-recovery-contract-qa.md
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
report_to: .ai_project/reports/T-20260729-023_define-ai-recipe-job-recovery-contract-report.md
qa_to: .ai_project/qa/T-20260729-023_define-ai-recipe-job-recovery-contract-qa.md
---

# AI 레시피 job·상태 조회·결과 복구 계약 정의

## 범위

- STEP Preview 입력과 구조화 RecipeDraft 출력 schema
- 생성 시작·상태 조회·완료·실패·만료 상태
- idempotent 재조회와 AI 결과 최대 24시간 복구
- 프롬프트·schema 버전, timeout과 사용자 재실행 경계

## 성공·검증 기준

- iOS가 provider를 알지 않고 AI Review 초안을 복구할 수 있다.
- Backend QA Agent가 정상·schema 오류·timeout·중복 요청·만료를 독립 검증한다.
