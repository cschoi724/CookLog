---
schema: aiops.task.v1
id: T-20260811-004
title: 팝 키치 레시피 클럽 Home·Library 원본 시안 적용
status: proposed
type: feature
priority: P1
priority_reason: Foundation 이후 첫 사용자 흐름 묶음으로 빠른 기록과 레시피 탐색을 일관되게 만든다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design Lead Agent
target_role: Lead Role
planned_execution_agent: UI/UX Design Agent
planned_execution_role: Execution Role
required_capabilities: [design_scoping, design_dependency_management, ux_flow, ui_design, prototyping, design_handoff]
ownership:
  paths: [design/prototype/app.js, design/prototype/styles.css]
  domains: [home-experience, recipe-library-search]
  documents: [design/prototype/, design/COOKLOG_MVP_UIUX_V1_HANDOFF.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260811-002, T-20260811-003]
blocks: [T-20260811-005]
parallel_group: pop-kitsch-design-sequence
allowed_paths:
  - design/prototype/app.js
  - design/prototype/styles.css
  - .ai_project/tasks/backlog/T-20260811-004_pop-kitsch-home-library-prototype-design.md
  - .ai_project/reports/T-20260811-004_pop-kitsch-home-library-prototype-design-report.md
  - .ai_project/qa/T-20260811-004_pop-kitsch-home-library-prototype-design-qa.md
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
report_to: .ai_project/reports/T-20260811-004_pop-kitsch-home-library-prototype-design-report.md
qa_to: .ai_project/qa/T-20260811-004_pop-kitsch-home-library-prototype-design-qa.md
status_ref: origin/develop
status_ref_sha: bceba32
parent_scope_ref: origin/develop@ca6a165
base_ref: origin/develop
base_sha: bceba32
branch:
  name: task/T-20260811-004-pop-kitsch-home-library-prototype-design
  base: develop
pr:
  url:
  status:
---

# 팝 키치 레시피 클럽 Home·Library 원본 시안 적용

## Scope

- Home 9개 상태와 Library 5개 상태(전체·제목 검색·재료 검색·결과 없음·빈 상태)를 Foundation 위에서 시각적으로 발전시킨다.
- Home은 빠른 기록 CTA, 최근 3개, 작은 비챗봇 AI 도우미와 복구 행동을 긴 설명 없이 이해하게 한다. Library는 검색·결과·로컬 검색 개인정보 안내의 의미를 보존한다.
- 기존 routing, recipe lifecycle, keyboard/focus, 390×844·375×667, Light/Dark·대비·44pt를 변경하지 않는다.

## Acceptance Criteria

1. Home·Library 14개 상태가 팝 키치 visual language를 공유하면서 CTA·검색·AI/오류 상태의 위계가 명확하다.
2. Home의 AI는 chatbot UI가 아니며, Home→Log·Library→Recipe/Review의 기존 목적지와 최근 3개 규칙이 유지된다.
3. 외부 asset·폰트·Home/Library 외 화면·iOS·Backend 변경이 없다.

## Execution

- `T-003` Design QA 통과와 Product Owner의 이 화면군 실행 승인 뒤에만 UI/UX Design Agent에 인계한다.
- 완료 후 독립 Design QA를 거쳐 `T-005`에 visual language와 검증 결과를 인계한다.
