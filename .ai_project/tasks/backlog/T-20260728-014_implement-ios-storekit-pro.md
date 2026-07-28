---
id: T-20260728-014
title: iOS StoreKit 2 CookLog Pro 구현
status: proposed
type: feature
priority: P1
priority_reason: 승인된 상품·계약·UX를 실제 iOS 구독 흐름으로 구현한다.
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
  - T-20260728-003
  - T-20260728-011
  - T-20260728-012
  - T-20260728-013
blocks:
  - T-20260728-016
  - T-20260728-017
parallel_group: monetization-implementation
allowed_paths:
  - apps/ios/
  - docs/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_MONETIZATION.md
  - T-20260728-011의 승인된 Figma 구독 UX
  - T-20260728-012의 entitlement 계약
  - T-20260728-013의 App Store 상품 정보
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
report_to: .ai_project/reports/T-20260728-014_implement-ios-storekit-pro-report.md
qa_to: .ai_project/qa/T-20260728-014_implement-ios-storekit-pro-qa.md
---

# iOS StoreKit 2 CookLog Pro 구현

## Activation Gate

- 기본 Figma UI 적용, 구독 UX, Backend 계약과 App Store 상품 준비가 완료되었다.

## 목적

StoreKit 2를 사용해 월간·연간 CookLog Pro 구매, 복원과 entitlement UI를 구현한다.

## 성공 기준

- 현지화 상품 조회, 구매, 거래 검증과 entitlement 관찰이 동작한다.
- 구매 복원과 구독 관리 이동을 제공한다.
- 결제 중·성공·실패·취소·만료 UI가 명세와 일치한다.
- Free 한도 도달 시에만 Paywall이 노출되고 기존 레시피 접근은 유지된다.
- StoreKit Configuration 단위·통합 테스트가 추가된다.
- iOS QA Agent가 기능과 디자인 정합성을 검증할 수 있다.
