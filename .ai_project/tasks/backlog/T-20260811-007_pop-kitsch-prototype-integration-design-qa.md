---
schema: aiops.task.v1
id: T-20260811-007
title: 팝 키치 레시피 클럽 Prototype 통합 Design QA
status: proposed
type: qa
priority: P1
priority_reason: 화면군별 시안 완료 뒤 82개 상태와 접근성 계약의 무회귀를 독립적으로 확인한다.
org_unit: Quality Division
team: Quality Team
team_lead:
workflow: qa
target_agent: Design Lead Agent
target_role: Lead Role
planned_execution_agent: Design QA Agent
planned_execution_role: Verification Role
required_capabilities: [design_scoping, design_dependency_management, design_qa, accessibility_review, design_handoff_review]
ownership:
  paths: [.ai_project/qa/, .ai_project/reports/]
  domains: [prototype-integration-qa, design-accessibility]
  documents: [design/prototype/, design/COOKLOG_MVP_UIUX_V1_HANDOFF.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260811-002, T-20260811-003, T-20260811-004, T-20260811-005, T-20260811-006]
blocks: []
parallel_group: pop-kitsch-design-sequence
allowed_paths:
  - .ai_project/tasks/backlog/T-20260811-007_pop-kitsch-prototype-integration-design-qa.md
  - .ai_project/reports/T-20260811-007_pop-kitsch-prototype-integration-design-qa-report.md
  - .ai_project/qa/T-20260811-007_pop-kitsch-prototype-integration-design-qa.md
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
source_of_truth:
  - origin/develop@ca6a165
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
  - docs/product/CookLog_USER_FLOW.md
created_by: Design Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-11
updated_at: 2026-08-11
report_to: .ai_project/reports/T-20260811-007_pop-kitsch-prototype-integration-design-qa-report.md
qa_to: .ai_project/qa/T-20260811-007_pop-kitsch-prototype-integration-design-qa.md
status_ref: origin/develop
status_ref_sha: bceba32
parent_scope_ref: origin/develop@ca6a165
base_ref: origin/develop
base_sha: bceba32
branch:
  name: task/T-20260811-007-pop-kitsch-prototype-integration-design-qa
  base: develop
pr:
  url:
  status:
---

# 팝 키치 레시피 클럽 Prototype 통합 Design QA

## Scope And Acceptance Criteria

- Foundation·Home/Library·Log/Review/Detail·Player/Info/Error 완료본을 독립적으로 검증한다.
- 82개 상태, 13개 공통 컴포넌트, 390×844·375×667, Light/Dark·Accessibility 3, 텍스트 대비, 44pt, keyboard·VoiceOver·focus·Reduce Motion, routing·복구 행동 무회귀를 확인한다.
- PASS/PASS_WITH_RISK/FAIL/BLOCKED 판정과 증빙을 남긴다. 이 Task는 Prototype 원본·iOS·Backend를 수정하지 않는다.

## Execution

- 모든 선행 화면군의 Design QA 통과와 Product Owner의 통합 QA 실행 승인 뒤 Design QA Agent / Verification Role에 인계한다.
