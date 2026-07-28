---
id: T-20260728-013
title: App Store 구독 상품과 법무·운영 정보 준비
status: proposed
type: docs
priority: P1
priority_reason: StoreKit 구현과 TestFlight 검증 전에 실제 상품 식별자와 필수 정책 정보가 필요하다.
org_unit: Product Division
team: Product Team
team_lead: Product Lead Agent
workflow: docs
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities:
  - technical_planning
  - dependency_management
depends_on:
  - T-20260728-007
  - T-20260728-009
  - T-20260728-010
blocks:
  - T-20260728-014
  - T-20260728-015
parallel_group: monetization-design-and-contract
allowed_paths:
  - docs/
  - apps/ios/docs/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/product/task_board.md
source_of_truth:
  - docs/product/CookLog_MONETIZATION.md
  - T-20260728-010의 확정 상품 정책
  - Apple App Store Connect와 App Review 공식 문서
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
report_to: .ai_project/reports/T-20260728-013_prepare-app-store-subscription-and-legal-report.md
qa_to: .ai_project/qa/T-20260728-013_prepare-app-store-subscription-and-legal-qa.md
---

# App Store 구독 상품과 법무·운영 정보 준비

## Activation Gate

- 가격·상품 정책과 초기 실서비스 목표가 확정되었다.
- App Store Connect 외부 설정 변경은 Product Owner의 별도 승인을 받는다.

## 목적

월간·연간 CookLog Pro 상품과 심사에 필요한 약관·개인정보·지원 정보를 준비한다.

## 성공 기준

- Subscription Group, 월간·연간 product ID와 현지화 문구가 확정된다.
- 가격, 자동 갱신과 연간 총 청구액 표시 기준이 정리된다.
- 개인정보처리방침, 이용약관과 지원 URL이 준비된다.
- 세금·은행 계약과 Small Business Program 적용 상태를 확인한다.
- Sandbox/TestFlight에서 사용할 상품이 준비된다.

## 제외 범위

- Product Owner 승인 없는 App Store Connect 변경
- App Store 제출과 외부 배포
