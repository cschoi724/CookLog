---
schema: aiops.task.v1
id: T-20260811-006
title: 팝 키치 레시피 클럽 Player·Info·오류 원본 시안 적용
status: proposed
type: feature
priority: P1
priority_reason: 조리 중 Player와 정보·복구 화면을 마지막 화면군으로 정합화해 안정적 Core Loop를 보존한다.
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
  domains: [audio-guide-player, app-information, recovery-feedback]
  documents: [design/prototype/, design/COOKLOG_MVP_UIUX_V1_HANDOFF.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260811-002, T-20260811-005]
blocks: [T-20260811-007]
parallel_group: pop-kitsch-design-sequence
allowed_paths:
  - design/prototype/app.js
  - design/prototype/styles.css
  - .ai_project/tasks/backlog/T-20260811-006_pop-kitsch-player-info-error-prototype-design.md
  - .ai_project/reports/T-20260811-006_pop-kitsch-player-info-error-prototype-design-report.md
  - .ai_project/qa/T-20260811-006_pop-kitsch-player-info-error-prototype-design-qa.md
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
report_to: .ai_project/reports/T-20260811-006_pop-kitsch-player-info-error-prototype-design-report.md
qa_to: .ai_project/qa/T-20260811-006_pop-kitsch-player-info-error-prototype-design-qa.md
status_ref: origin/develop
status_ref_sha: bceba32
parent_scope_ref: origin/develop@ca6a165
base_ref: origin/develop
base_sha: bceba32
branch:
  name: task/T-20260811-006-pop-kitsch-player-info-error-prototype-design
  base: develop
pr:
  url:
  status:
---

# 팝 키치 레시피 클럽 Player·Info·오류 원본 시안 적용

## Scope

- Audio Guide Player 24개와 App Info 11개 상태의 시각 표현을 발전시킨다.
- 재생·단계·속도·핸즈프리·중단·오류와 데이터 보관·문의·법적 문서의 의미, 조작 우선순위, 상태 알림을 보존한다.
- 조리 중 Player는 장식 밀도를 제한하고 재생/정지·다음 단계·핸즈프리 제어의 44pt·고대비·focus 순서를 우선한다.

## Acceptance Criteria

1. 35개 상태에서 오디오 제어와 정보/오류 복구 행동이 시각적으로 명확하며, 긴 안내나 chatbot UI가 없다.
2. 두 viewport, Light/Dark, Accessibility 3, 대비·44pt·VoiceOver·Reduce Motion 계약이 유지된다.
3. 다른 화면군·기능/routing·iOS·Backend 변경이 없다.

## Execution

- `T-005` Design QA 통과와 Product Owner의 이 화면군 실행 승인 뒤에만 UI/UX Design Agent에 인계한다.
