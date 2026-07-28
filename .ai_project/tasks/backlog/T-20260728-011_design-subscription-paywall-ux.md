---
id: T-20260728-011
title: Figma 구독·Paywall UX 설계
status: proposed
type: feature
priority: P1
priority_reason: 확정된 Free/Pro 정책을 사용자에게 명확하고 오인 없이 제시할 디자인 기준이 필요하다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design Lead Agent
target_role: Lead Role
required_capabilities:
  - design_scoping
  - design_dependency_management
depends_on:
  - T-20260728-002
  - T-20260728-010
blocks:
  - T-20260728-014
parallel_group: monetization-design-and-contract
allowed_paths:
  - design/
  - docs/product/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_MONETIZATION.md
  - T-20260728-002의 승인된 Figma MVP UI/UX
  - T-20260728-010의 확정 가격과 Free/Pro 정책
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
report_to: .ai_project/reports/T-20260728-011_design-subscription-paywall-ux-report.md
qa_to: .ai_project/qa/T-20260728-011_design-subscription-paywall-ux-qa.md
---

# Figma 구독·Paywall UX 설계

## Activation Gate

- MVP Figma 원본과 수익화 가격·기능 정책이 모두 승인되었다.

## 목적

구독 전환을 유도하면서도 핵심 기록 경험을 방해하지 않는 Paywall과 구독 상태 UX를 공식 Figma 원본에 추가한다.

## 성공 기준

- Free 한도 도달, 월간·연간 선택, 구매 중·완료·실패, 복원, 만료 상태가 설계된다.
- 연간 총 결제액, 자동 갱신, 약관·개인정보와 구매 복원이 명확히 표시된다.
- 구독 상태와 남은 AI 사용량 화면이 설계된다.
- 작은 화면, 다크 모드, 접근성 기준이 포함된다.
- Design QA Agent 검증과 Product Owner 승인을 통과한다.
