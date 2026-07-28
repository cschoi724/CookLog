---
id: T-20260728-012
title: 구독 entitlement와 AI quota Backend 계약 정의
status: proposed
type: docs
priority: P1
priority_reason: StoreKit과 Backend가 동일한 구독 상태와 AI 사용량 규칙을 사용해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: docs
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities:
  - technical_planning
  - dependency_management
depends_on:
  - T-20260728-005
  - T-20260728-006
  - T-20260728-009
  - T-20260728-010
blocks:
  - T-20260728-014
  - T-20260728-015
parallel_group: monetization-design-and-contract
allowed_paths:
  - apps/backend/
  - apps/ios/docs/
  - docs/
  - .ai_project/source_of_truth.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_MONETIZATION.md
  - T-20260728-005에서 확정된 AI proxy 계약
  - T-20260728-006의 Backend foundation
  - T-20260728-010의 가격과 quota 정책
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
report_to: .ai_project/reports/T-20260728-012_define-subscription-entitlement-and-quota-contract-report.md
qa_to: .ai_project/qa/T-20260728-012_define-subscription-entitlement-and-quota-contract-qa.md
---

# 구독 entitlement와 AI quota Backend 계약 정의

## Activation Gate

- Backend foundation, 실서비스 release gate와 최종 수익화 정책이 확정되었다.

## 목적

로그인 없는 초기 iOS 앱에서 Apple 구독 entitlement와 Free/Pro AI 사용량을 안전하게 검증할 계약을 정의한다.

## 성공 기준

- Apple 거래 검증 입력과 Backend 응답 계약이 정의된다.
- 익명 사용자, 원거래 식별자와 사용량 연결 방식이 결정된다.
- Free/Pro quota 조회·차감·초기화·초과 응답이 정의된다.
- 실패 호출, 환불, 만료, billing retry와 grace 상태 처리가 정의된다.
- 클라이언트의 단순 `isPro` 값을 신뢰하지 않는 보안 경계가 명시된다.
- Backend QA Agent가 계약·보안·개인정보 검증을 통과시킬 수 있다.
