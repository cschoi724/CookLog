---
id: T-20260728-016
title: 수익화 이벤트와 AI 비용 관측성 구현
status: proposed
type: feature
priority: P1
priority_reason: 가격과 quota를 지속 관리하려면 전환과 원가를 개인정보 없이 측정해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities:
  - technical_planning
  - dependency_management
depends_on:
  - T-20260728-014
  - T-20260728-015
blocks:
  - T-20260728-017
parallel_group:
allowed_paths:
  - apps/ios/
  - apps/backend/
  - docs/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_MONETIZATION.md
  - docs/PROJECT_DECISIONS.md
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
report_to: .ai_project/reports/T-20260728-016_implement-monetization-observability-report.md
qa_to: .ai_project/qa/T-20260728-016_implement-monetization-observability-qa.md
---

# 수익화 이벤트와 AI 비용 관측성 구현

## Activation Gate

- iOS 구독과 Backend quota 구현이 검증 가능한 상태다.

## 목적

Paywall 전환, 구독 상태와 AI 비용을 사용자 요리 내용 없이 측정해 가격·quota 검토 근거를 만든다.

## 성공 기준

- 수익화 지침의 핵심 이벤트와 비용 지표가 수집된다.
- 음성 원문, STEP Preview와 레시피 본문을 이벤트에 포함하지 않는다.
- 중복 이벤트와 구매 실패 원인을 구분할 수 있다.
- Pro 사용자당 AI·Backend 변동비를 월별 계산할 수 있다.
- 데이터 보존과 접근 범위가 문서화된다.
