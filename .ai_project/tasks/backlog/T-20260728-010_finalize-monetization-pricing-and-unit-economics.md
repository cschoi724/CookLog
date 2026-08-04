---
schema: aiops.task.v1
id: T-20260728-010
title: 수익화 가격·원가와 출시 정책 확정
status: proposed
type: docs
priority: P1
priority_reason: 초기 실서비스 준비가 완료되는 시점에 Pro 가격과 AI quota를 실제 원가 기준으로 확정해야 한다.
org_unit: Product Division
team: Product Team
team_lead: Product Lead Agent
workflow: docs
target_agent: Product Lead Agent
target_role: Lead Role
required_capabilities:
  - product_direction
  - priority_management
  - product_scoping
  - product_dependency_management
  - approval_preparation
depends_on:
  - T-20260728-006
  - T-20260728-009
blocks:
  - T-20260728-011
  - T-20260728-012
  - T-20260728-013
parallel_group: monetization-policy
allowed_paths:
  - docs/
  - apps/backend/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/product/task_board.md
  - .ai_project/teams/development/task_board.md
source_of_truth:
  - docs/product/CookLog_MONETIZATION.md
  - docs/product/CookLog_PRD_v2.md
  - T-20260728-005에서 확정된 Backend AI 계약
  - T-20260728-006의 Backend foundation 검증 결과
  - T-20260728-009의 실서비스 준비도 결과
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-08-04
report_to: .ai_project/reports/T-20260728-010_finalize-monetization-pricing-and-unit-economics-report.md
qa_to: .ai_project/qa/T-20260728-010_finalize-monetization-pricing-and-unit-economics-qa.md
---

# 수익화 가격·원가와 출시 정책 확정

## Activation Gate

- Backend AI proxy foundation이 완료되어 실제 또는 신뢰 가능한 호출 원가를 계산할 수 있다.
- `T-20260728-009`에서 초기 실서비스 목표와 release gate가 확정되었다.
- Product Lead Agent가 현재 Queue 우선순위를 검토하고 Product Owner 승인을 요청한다.

## 목적

`CookLog_MONETIZATION.md`의 월 4,900원·연 39,000원과 Free 3회·Pro 30회 가설을 실제 원가와 출시 범위에 맞춰 확정한다.

## 성공 기준

- AI provider/model별 성공 호출 원가, 재시도 비용과 Backend 고정비·변동비가 계산된다.
- Apple 수수료와 세금, 결제·관측성·고객지원·법무·도메인 등 운영비를 반영한 월간·연간 기여이익 모델이 존재한다.
- 무료·체험·실패 호출과 사용자당 평균·피크 사용량을 반영한 보수·기준·성장 시나리오가 존재한다.
- 가격별 손익분기 유료 사용자 수와 Free/Pro quota 악용 시 최대 손실을 비교한다.
- Free/Pro AI quota, 초기화 시점, 실패 호출 차감 정책이 확정된다.
- 월간·연간 가격, 할인, 체험 여부를 Product Owner가 승인한다.
- 첫 출시 기본 비활성인 원격 STT 비용은 기본 원가에서 제외하고 향후 선택 활성화 시나리오로 분리한다.
- 확정 결과가 수익화 지침과 프로젝트 결정 로그에 반영된다.

## Coordination 메모

- Product Lead Agent가 Product Owner와 가격·Free/Pro 경계·출시 범위 의사결정을 진행한다.
- Development Lead Agent는 Backend·AI provider 원가 검증 범위를 조율하고 신뢰 가능한 비용 자료를 제공한다.
- Product Planning Agent의 손익 문서 실행, Product QA Agent의 독립 검증과 Product Lead Agent의 완료 검토를 분리한다.
- 가격을 먼저 고정하지 않고 실제 비용과 목표 기여이익을 기준으로 가격·quota·모델을 함께 조정한다.

## 상태별 라우팅

- `proposed -> scoped`: Product Lead Agent / Lead Role
- `scoped -> approved`: Product Owner
- `approved -> in_progress -> verification_ready`: Product Planning Agent / Execution Role
- `verification_ready -> verification_passed`: Product QA Agent / Verification Role
- `verification_passed -> completion_review -> done`: Product Lead Agent / Completion Role, 최종 정책값은 Product Owner 승인 필수
