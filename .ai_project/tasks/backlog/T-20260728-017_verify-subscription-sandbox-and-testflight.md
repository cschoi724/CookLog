---
id: T-20260728-017
title: 구독 Sandbox·TestFlight 통합 검증
status: proposed
type: feature
priority: P1
priority_reason: 초기 실서비스에 Pro를 포함하기 전 구매·복원·만료·quota를 실제 상품 환경에서 검증해야 한다.
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
  - T-20260728-008
  - T-20260728-014
  - T-20260728-015
  - T-20260728-016
blocks:
  - T-20260728-018
parallel_group:
allowed_paths:
  - apps/ios/
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
  - apps/ios/docs/TESTING.md
  - T-20260728-014의 iOS 구독 구현
  - T-20260728-015의 Backend 구독·quota 구현
  - T-20260728-016의 관측성 구현
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
report_to: .ai_project/reports/T-20260728-017_verify-subscription-sandbox-and-testflight-report.md
qa_to: .ai_project/qa/T-20260728-017_verify-subscription-sandbox-and-testflight-qa.md
---

# 구독 Sandbox·TestFlight 통합 검증

## Activation Gate

- CI, iOS StoreKit, Backend entitlement·quota와 관측성이 완료되었다.
- Sandbox/TestFlight 외부 설정과 배포는 Product Owner 승인을 받는다.

## 목적

실제 Apple 구독 상품 환경에서 구매부터 만료까지 전체 수익화 흐름을 독립 검증한다.

## 성공 기준

- 월간·연간 구매, 취소, 실패, 복원과 앱 재실행 유지가 통과한다.
- 만료, billing retry, grace, 환불과 Free 전환을 확인한다.
- 구독 만료 후 저장 레시피와 기본 오디오 가이드가 유지된다.
- Free/Pro quota와 실패 호출 미차감이 검증된다.
- Paywall 가격·약관·복원 표시가 심사 기준과 일치한다.
- 비용·전환 이벤트가 개인정보 없이 기록된다.
- iOS QA와 Backend QA 결과가 모두 준비된다.

## Coordination 메모

- Development Lead Agent가 실행 환경과 fixture를 준비하고 iOS QA Agent와 Backend QA Agent가 독립 검증한다.
- `T-20260728-009`에서 생성되는 실제 STT·AI·TTS 후속 Task를 scope 시 추가 의존성으로 연결한다.
