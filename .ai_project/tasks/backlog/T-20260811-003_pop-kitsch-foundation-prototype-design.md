---
schema: aiops.task.v1
id: T-20260811-003
title: 팝 키치 레시피 클럽 Foundation·공통 컴포넌트 원본 정비
status: scoped
type: feature
priority: P1
priority_reason: 앱 전반 리디자인의 첫 단계로 의미 토큰과 13개 공통 컴포넌트를 안정화한다. P0 iOS·Backend 작업을 중단하지 않는다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design Lead Agent
target_role: Lead Role
planned_execution_agent: UI/UX Design Agent
planned_execution_role: Execution Role
required_capabilities: [design_scoping, design_dependency_management, ui_design, prototyping, design_handoff]
ownership:
  paths: [design/prototype/app.js, design/prototype/styles.css, design/prototype/components.html]
  domains: [prototype-foundation, shared-components]
  documents: [design/prototype/, design/COOKLOG_MVP_UIUX_V1_HANDOFF.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260811-002]
blocks: [T-20260811-004]
parallel_group: pop-kitsch-design-sequence
allowed_paths:
  - design/prototype/app.js
  - design/prototype/styles.css
  - design/prototype/components.html
  - .ai_project/tasks/backlog/T-20260811-003_pop-kitsch-foundation-prototype-design.md
  - .ai_project/reports/T-20260811-003_pop-kitsch-foundation-prototype-design-report.md
  - .ai_project/qa/T-20260811-003_pop-kitsch-foundation-prototype-design-qa.md
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
source_of_truth:
  - origin/develop@ca6a165
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
created_by: Design Lead Agent
approved_by: Product Owner (2026-08-11, Foundation 실행 승인 기록; 상위 T-20260811-002 공용 반영 후 실행 전환)
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-11
updated_at: 2026-08-11
report_to: .ai_project/reports/T-20260811-003_pop-kitsch-foundation-prototype-design-report.md
qa_to: .ai_project/qa/T-20260811-003_pop-kitsch-foundation-prototype-design-qa.md
status_ref: origin/develop
status_ref_sha: bceba32
parent_scope_ref: origin/develop@ca6a165
base_ref: origin/develop
base_sha: bceba32
branch:
  name: task/T-20260811-003-pop-kitsch-foundation-prototype-design
  base: develop
pr:
  url:
  status:
---

# 팝 키치 레시피 클럽 Foundation·공통 컴포넌트 원본 정비

## Scope

- 팝 키치 레시피 클럽의 크림 바탕, 토마토 레드 CTA, 버터 옐로·코발트 블루 포인트, 큰 타이포와 절제된 장식 언어를 Light/Dark 의미 토큰과 13개 공통 컴포넌트에 정의한다.
- 색상·타이포·간격·표면·버튼·카드·배지·피드백·모달의 공통 표현만 다룬다. 화면별 정보 구조·카피·routing·상태 의미·데이터 모델·새 기능은 변경하지 않는다.
- 일반 텍스트 4.5:1, 큰 텍스트 3:1, 최소 44×44pt, 색 이외 상태 단서, VoiceOver/keyboard/focus 계약을 보존한다.

## Acceptance Criteria

1. Light/Dark의 동일 의미 토큰과 13개 공통 컴포넌트가 팝 키치 언어를 일관되게 표현한다.
2. 390×844·375×667과 Accessibility 3에서 공통 CTA·모달·입력 요소의 가독성·도달성·44pt를 보존한다.
3. 82개 상태의 화면 구조·행동·routing·텍스트 의미를 변경하지 않고, 외부 asset·폰트·iOS·Backend 변경이 없다.

## Execution

- 이전 Home 전용 `T-003` 실행 승인은 상위 범위 확장으로 대체됐다. Product Owner가 2026-08-11 Foundation 실행 의사를 승인해 이 Task는 `scoped` 상태다. 상위 범위는 `origin/develop@ca6a165`에 반영됐으며, T-20260811-002의 Product Lead scope 완료 뒤에만 `approved`로 전환한다. 후속 화면군은 각각 별도 실행 승인이 필요하다.
- 완료 시 UI/UX Design Agent는 자체 검증 뒤 `verification_ready`로 Design QA Agent에 인계한다. 통과 전 `T-004`를 실행하지 않는다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-11 | Design Lead Agent | scoped Home 초안 | proposed Foundation 초안 | 상위 T-002의 앱 전반·화면군 순차 범위에 맞춰 이전 Home 한 장 실행 승인 범위를 분리·재조율 |
| 2026-08-11 | Design Lead Agent | proposed | scoped | Product Owner의 Foundation 실행 승인을 기록; 상위 T-002의 Product Lead scope 완료를 실행 선행 조건으로 유지 |
