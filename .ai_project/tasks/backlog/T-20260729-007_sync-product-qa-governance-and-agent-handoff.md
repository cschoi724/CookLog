---
id: T-20260729-007
title: Product QA Agent 운영 등록과 루트 제품 안내 동기화
status: proposed
type: documentation
priority: P1
priority_reason: Product QA Agent는 활성화됐지만 저장소 registry·운영 모델과 루트 agents.md가 새 검증 역할과 Core MVP·공개 출시 구분을 아직 반영하지 않는다.
org_unit: AI Ops Division
team: AI Ops Team
team_lead: AI Ops Agent
workflow: ops_migration
target_agent: AI Ops Agent
target_role: Ops Governance Role
required_capabilities:
  - workflow_governance
  - process_governance
depends_on:
  - T-20260729-001
blocks: []
parallel_group: release-r1-foundation
allowed_paths:
  - agents.md
  - .ai_project/agent_registry.md
  - .ai_project/operating_model.md
  - .ai_project/current_context.md
  - .ai_project/teams/quality/team_context.md
  - .ai_project/teams/quality/task_board.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/task_board.md
source_of_truth:
  - .ai/runtime/workflow.md
  - .ai/workflows/docs.md
  - .ai_project/operating_model.md
  - docs/product/CookLog_PRODUCT.md
  - docs/product/CookLog_MVP_SCOPE.md
  - docs/product/CookLog_ROADMAP.md
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260729-007_sync-product-qa-governance-and-agent-handoff-report.md
qa_to:
---

# Product QA Agent 운영 등록과 루트 제품 안내 동기화

## 목적

Product Owner가 추가한 Product QA Agent를 CookLog 운영 문서에 정식 등록하고, 루트 Agent 안내가 확정된 Core MVP와 첫 공개 출시 범위를 정확히 전달하게 한다.

## 제안 범위

- Product QA Agent를 Quality Team의 Verification Role로 registry와 operating model에 등록
- 제품 요구 추적·문서 정합성·출시 범위 검증 capability와 라우팅 기준 정의
- Product Lead 작성·Product QA 검증·Product Lead 완료 구조 기록
- Design·iOS·Backend QA와 Product QA의 중복되지 않는 책임 경계
- 루트 `agents.md`의 Core MVP 음성 명령 제외와 첫 공개 출시 핸즈프리 필수 구분
- Product QA 호출 조건과 사소한 문서 수정의 검증 제외 기준
- current context와 Quality Team context 동기화

## 제외 범위

- 제품 정책 변경
- Design·iOS·Backend QA 책임 변경
- T-20260729-001 재검증
- 앱·Backend·디자인 구현

## 성공 기준

- 새 세션이 registry와 운영 모델만으로 Product QA Agent의 역할과 호출 조건을 판단할 수 있다.
- Product QA가 제품 방향 결정이나 Task 완료 권한을 갖지 않는다.
- 루트 안내가 Core MVP와 첫 App Store 공개 출시의 핸즈프리 범위를 혼동하지 않는다.
- 기존 Design·iOS·Backend QA와 검증 책임이 겹치지 않는다.
- AI Ops 검토에서 workflow·Role·capability 충돌이 없다.

## 사용자 결정 필요 항목

- Product Owner가 이미 Product QA Agent 활성화를 확정했으므로 추가 제품 결정은 없다.
