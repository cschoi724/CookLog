---
schema: aiops.task.v1
id: T-20260729-020
title: Backend 런타임·배포·AI provider·비용 후보 결정안
status: proposed
type: docs
priority: P0
priority_reason: 첫 출시 AI gateway의 외부 비용과 운영 경계를 구현 전에 승인해야 한다.
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
  - T-20260729-023
  - T-20260729-024
parallel_group: backend-contract-foundation
allowed_paths:
  - apps/backend/docs/ARCHITECTURE_DECISION.md
  - .ai_project/tasks/backlog/T-20260729-020_compare-backend-runtime-ai-provider-cost-options.md
  - .ai_project/tasks/active/T-20260729-020_compare-backend-runtime-ai-provider-cost-options.md
  - .ai_project/reports/T-20260729-020_compare-backend-runtime-ai-provider-cost-options-report.md
  - .ai_project/qa/T-20260729-020_compare-backend-runtime-ai-provider-cost-options-qa.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_ROADMAP.md
  - docs/PROJECT_DECISIONS.md
created_by: Development Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: 2026-07-30
report_to: .ai_project/reports/T-20260729-020_compare-backend-runtime-ai-provider-cost-options-report.md
qa_to: .ai_project/qa/T-20260729-020_compare-backend-runtime-ai-provider-cost-options-qa.md
---

# Backend 런타임·배포·AI provider·비용 후보 결정안

## 범위

- 런타임·배포 후보와 AI 구조화 출력 provider·모델 비교
- 가정 트래픽, runtime·AI 예상 월 비용, hard cutoff와 전체 quota 결정표
- 보관·학습·처리 지역·장애 대응의 공식 출처 추적
- 추천 조합 1개와 일관된 차선 조합 1개
- 원격 STT는 기본 비활성 adapter의 향후 참고 비용·지역 정보만 기록

## 재작업 기준

- 기존 비공식 T-020의 Source of Truth 충돌, 차선 조합 불일치, 지역 가용성, endpoint별 보관, runtime 비용 가정과 strict metadata 결함을 반복하지 않는다.
- Apple 기기 내 STT 기본값과 자동 fallback 금지를 변경하지 않는다.
- 특정 provider는 Product Owner 결정 전 확정하지 않는다.

## 성공·검증 기준

- Product Owner가 런타임, AI provider, 인증 방향과 비용 상한을 항목별 승인·보류할 수 있다.
- Backend QA Agent가 공식 출처, 비용 산식, 개인정보와 지역 근거를 독립 재계산한다.
