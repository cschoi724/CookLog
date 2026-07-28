---
id: T-20260728-015
title: Backend 구독 검증과 AI quota 구현
status: proposed
type: feature
priority: P1
priority_reason: Pro entitlement와 AI 사용량을 서버에서 신뢰 가능하게 강제해야 한다.
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
  - T-20260728-006
  - T-20260728-012
  - T-20260728-013
blocks:
  - T-20260728-016
  - T-20260728-017
parallel_group: monetization-implementation
allowed_paths:
  - apps/backend/
  - docs/
  - .github/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_MONETIZATION.md
  - T-20260728-006의 Backend foundation
  - T-20260728-012의 entitlement와 quota 계약
  - T-20260728-013의 App Store 상품 정보
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
report_to: .ai_project/reports/T-20260728-015_implement-backend-entitlement-and-quota-report.md
qa_to: .ai_project/qa/T-20260728-015_implement-backend-entitlement-and-quota-qa.md
---

# Backend 구독 검증과 AI quota 구현

## Activation Gate

- Backend foundation, entitlement 계약과 App Store 상품 정보가 확정되었다.

## 목적

Apple 구독 상태와 Free/Pro AI 사용량을 Backend에서 검증하고 안전하게 강제한다.

## 성공 기준

- 신뢰 가능한 Apple 거래 검증과 entitlement 응답이 동작한다.
- Free/Pro quota 조회·차감·초기화와 초과 차단이 동작한다.
- 실패한 AI 생성은 사용량에서 제외된다.
- 환불·만료·billing 상태 변경을 처리한다.
- 민감정보와 사용자 요리 내용이 로그에 노출되지 않는다.
- 계약·보안·개인정보 테스트가 통과한다.
