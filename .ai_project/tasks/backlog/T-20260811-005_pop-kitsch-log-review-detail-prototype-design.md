---
schema: aiops.task.v1
id: T-20260811-005
title: 팝 키치 레시피 클럽 Log·Review·Detail 원본 시안 적용
status: cancelled
type: feature
priority: P1
priority_reason: 기록·AI 정리·완성 레시피는 Core Loop를 구성하므로 Home/Library 다음 순서로 원본을 정합화한다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent:
target_role:
planned_execution_agent: UI/UX Design Agent
planned_execution_role: Execution Role
required_capabilities: [design_scoping, design_dependency_management, ux_flow, ui_design, prototyping, design_handoff]
ownership:
  paths: [design/prototype/app.js, design/prototype/styles.css]
  domains: [cooking-log, ai-review, recipe-detail]
  documents: [design/prototype/, design/COOKLOG_MVP_UIUX_V1_HANDOFF.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260811-002, T-20260811-004, T-20260811-008]
blocks: []
parallel_group: pop-kitsch-design-sequence
allowed_paths:
  - design/prototype/app.js
  - design/prototype/styles.css
  - .ai_project/tasks/backlog/T-20260811-005_pop-kitsch-log-review-detail-prototype-design.md
  - .ai_project/reports/T-20260811-005_pop-kitsch-log-review-detail-prototype-design-report.md
  - .ai_project/qa/T-20260811-005_pop-kitsch-log-review-detail-prototype-design-qa.md
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
report_to: .ai_project/reports/T-20260811-005_pop-kitsch-log-review-detail-prototype-design-report.md
qa_to: .ai_project/qa/T-20260811-005_pop-kitsch-log-review-detail-prototype-design-qa.md
status_ref: origin/develop
status_ref_sha: bceba32
parent_scope_ref: origin/develop@ca6a165
base_ref: origin/develop
base_sha: bceba32
branch:
  name: task/T-20260811-005-pop-kitsch-log-review-detail-prototype-design
  base: develop
pr:
  url:
  status:
blocker: T-20260812-004 승인에 따라 Log·Review·Detail 로컬 Prototype 실행을 T-20260812-003 비공개 Figma 핵심 흐름으로 흡수한다.
next_decision:
---

# 팝 키치 레시피 클럽 Log·Review·Detail 원본 시안 적용

## T-20260812-004 재정렬

- 상태: `cancelled`
- 화면·상태·접근성 계약은 폐기하지 않고 T-20260812-003의 Figma 설계 및 Design QA 범위로 이전한다.
- 이 Task의 로컬 Prototype 실행과 별도 승인은 더 진행하지 않는다.

## Scope

- Cooking Log 15개, AI Review 11개, Recipe Detail 7개 상태의 시각 계층과 상태 피드백을 발전시킨다.
- 녹음·권한·기기 내 STT·오프라인·재시도, AI 처리/저장/오류, 삭제/복구의 기존 행동·카피 의미와 접근성 상태 알림을 보존한다.
- 조리 중에는 장식보다 읽기·조작 안전성을 우선하며 AI를 chatbot으로 바꾸지 않는다.

## Acceptance Criteria

1. Core Loop 33개 상태에서 기록, 처리, 검토, 저장, 다시 요리의 다음 행동이 긴 설명 없이 명확하다.
2. 390×844·375×667, Light/Dark, Accessibility 3, 대비·44pt·keyboard/VoiceOver 계약이 보존된다.
3. Player·Info·오류 화면, 기능/routing, iOS·Backend 변경은 없다.

## Execution

- `T-004`와 T-008의 Design QA 통과, T-008 Product Owner 시각 승인과 이 화면군의 별도 Product Owner 실행 승인 뒤에만 UI/UX Design Agent에 인계한다.

## Dependency Update

- 2026-08-11: Product Owner 요청으로 T-008 Visual Fidelity 리터치가 Home 기준 화면과 공통 시각 언어를 확정할 때까지 본 Task의 실행을 대기한다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-12 | Product Owner | proposed | cancelled | T-004 일괄 재정렬 승인에 따라 Log·Review·Detail 범위를 T-003 Figma 전체 흐름으로 흡수 |
