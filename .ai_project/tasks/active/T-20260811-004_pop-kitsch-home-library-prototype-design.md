---
schema: aiops.task.v1
id: T-20260811-004
title: 팝 키치 레시피 클럽 Home·Library 원본 시안 적용
status: verification_ready
type: feature
priority: P1
priority_reason: Foundation 이후 첫 사용자 흐름 묶음으로 빠른 기록과 레시피 탐색을 일관되게 만든다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design QA Agent
target_role: Verification Role
required_capabilities: [ux_flow, ui_design, prototyping, design_handoff, developer_verification, task_reporting]
ownership:
  paths: [design/prototype/app.js, design/prototype/styles.css]
  domains: [home-experience, recipe-library-search]
  documents: [design/prototype/, design/COOKLOG_MVP_UIUX_V1_HANDOFF.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260811-003]
resolved_dependencies:
  - task: T-20260811-002
    resolved_by: Product Owner
    resolved_at: 2026-08-11
    note: Product Owner가 상위 Product scope 완료를 확인해 Design 실행 의존성을 해소했다. 상위 Task의 공용 status 동기화는 Product Lead 소유로 별도 처리한다.
blocks: [T-20260811-005]
parallel_group: pop-kitsch-design-sequence
allowed_paths:
  - design/prototype/app.js
  - design/prototype/styles.css
  - .ai_project/tasks/active/T-20260811-004_pop-kitsch-home-library-prototype-design.md
  - .ai_project/reports/T-20260811-004_pop-kitsch-home-library-prototype-design-report.md
  - .ai_project/qa/T-20260811-004_pop-kitsch-home-library-prototype-design-qa.md
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
source_of_truth:
  - origin/develop@92de3f6
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
  - docs/product/CookLog_USER_FLOW.md
created_by: Design Lead Agent
approved_by: Product Owner (2026-08-11, Home·Library 프로토타입 디자인 실행 승인)
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-11
updated_at: 2026-08-11
report_to: .ai_project/reports/T-20260811-004_pop-kitsch-home-library-prototype-design-report.md
qa_to: .ai_project/qa/T-20260811-004_pop-kitsch-home-library-prototype-design-qa.md
status_ref: origin/develop
status_ref_sha: 92de3f6
parent_scope_ref: origin/develop@92de3f6
base_ref: origin/develop
base_sha: 92de3f6
branch:
  name: task/T-20260811-004-pop-kitsch-home-library-prototype-design
  base: develop
pr:
  url: https://github.com/cschoi724/CookLog/pull/134
  status: draft
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

- T-003은 `done`이며 Foundation·13개 공통 컴포넌트 기준을 제공한다. Product Owner가 2026-08-11 이 화면군 실행을 승인해 T-004는 `approved`, UI/UX Design Agent / Execution Role에 인계한다.
- 완료 후 독립 Design QA를 거쳐 `T-005`에 visual language와 검증 결과를 인계한다.

## Approval Preparation

- 실행 대상: UI/UX Design Agent / Execution Role
- 실행 전 최종 확인: Home 9개와 Library 5개 상태의 구조·routing·카피 의미를 보존하고, Foundation 외 공통 컴포넌트를 재정의하지 않는다.

## Next Agent Handoff

```text
다음 Agent에게 전달할 말:

너는 Design QA Agent / Verification Role이야.
Task T-20260811-004의 Home·Library 프로토타입 시안 적용 결과를 독립 검증해줘.

- 공용 기준: origin/develop@92de3f6
- 현재 상태: verification_ready
- 작업 경로: /private/tmp/cooklog-t20260811-004-pop-kitsch-home-library
- 변경 대상: design/prototype/app.js, design/prototype/styles.css
- 실행 보고서: .ai_project/reports/T-20260811-004_pop-kitsch-home-library-prototype-design-report.md
- 검증 범위: Home 9개·Library 5개 상태, 원본 팝 키치 시안 정합성, CTA·검색·AI/오류 위계, Light/Dark, 390×844·375×667, Accessibility 3, 대비, 44pt, keyboard·focus.
- 보존 확인: routing, recipe lifecycle, 최근 3개 규칙, AI 비챗봇 표현, 검색 개인정보 안내, 외부 asset·폰트 없음, Home·Library 밖 화면 무변경.
- 판정 후: PASS 계열이면 Design Lead Agent / Completion Role에, FAIL/BLOCKED면 Design Lead Agent에 재작업 범위와 함께 인계해.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-11 | Design Lead Agent | proposed | scoped | T-003 완료 기준을 반영해 Home·Library 14개 상태 범위와 실행 승인 경계를 정리 |
| 2026-08-11 | Design Lead Agent | scoped | approved | Product Owner 실행 승인을 기록하고 UI/UX Design Agent / Execution Role에 인계 |
| 2026-08-11 | UI/UX Design Agent | approved | in_progress | 승인 scope commit f4b8cc4 기반 전용 worktree에서 lock을 획득하고 Home·Library 14개 상태 구현 시작 |
| 2026-08-11 | UI/UX Design Agent | in_progress | verification_ready | 팝 키치 Home·Library 시안 적용과 정적·대표 렌더 검증을 완료하고 lock 해제 후 Design QA 독립 검증에 인계 |
