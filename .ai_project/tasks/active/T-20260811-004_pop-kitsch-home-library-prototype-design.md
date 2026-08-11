---
schema: aiops.task.v1
id: T-20260811-004
title: 팝 키치 레시피 클럽 Foundation·Home·Library 원본 시안 재작업
status: in_progress
type: feature
priority: P1
priority_reason: Foundation 이후 첫 사용자 흐름 묶음으로 빠른 기록과 레시피 탐색을 일관되게 만든다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: UI/UX Design Agent
target_role: Execution Role
planned_execution_agent: UI/UX Design Agent
planned_execution_role: Execution Role
required_capabilities: [design_scoping, component_system_design, ux_flow, ui_design, prototyping, design_handoff, developer_verification, task_reporting]
ownership:
  paths: [design/prototype/app.js, design/prototype/styles.css, design/prototype/components.html]
  domains: [prototype-foundation, home-experience, recipe-library-search]
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
  - design/prototype/components.html
  - .ai_project/tasks/active/T-20260811-004_pop-kitsch-home-library-prototype-design.md
  - .ai_project/reports/T-20260811-004_pop-kitsch-home-library-prototype-design-report.md
  - .ai_project/qa/T-20260811-004_pop-kitsch-home-library-prototype-design-qa.md
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
source_of_truth:
  - origin/develop@d7e9ea7
  - design/prototype/
  - design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
  - docs/product/CookLog_USER_FLOW.md
created_by: Design Lead Agent
approved_by: Product Owner (2026-08-11, Foundation·Home·Library 단일 재작업 실행 승인)
locked_by: UI/UX Design Agent
locked_at: 2026-08-11T17:35:42+09:00
lock_session: codex-t-20260811-004-concept-rework
lock_timeout_minutes: 240
created_at: 2026-08-11
updated_at: 2026-08-11
report_to: .ai_project/reports/T-20260811-004_pop-kitsch-home-library-prototype-design-report.md
qa_to: .ai_project/qa/T-20260811-004_pop-kitsch-home-library-prototype-design-qa.md
status_ref: origin/develop
status_ref_sha: d7e9ea7
parent_scope_ref: origin/develop@d7e9ea7
base_ref: origin/develop
base_sha: d7e9ea7
branch:
  name: task/T-20260811-004-concept-rework
  base: develop
pr:
  url:
  status: to_create_after_execution
---

# 팝 키치 레시피 클럽 Foundation·Home·Library 원본 시안 재작업

## Scope

- 하나의 재작업 단위에서 Foundation 보강과 Home 9개·Library 5개 상태를 함께 정합화한다. 완료된 T-003은 이력으로 유지하며 재오픈하지 않는다.
- Foundation 보강은 이 화면군에 필요한 큰 디스플레이 타이포, 크림·토마토 레드·버터 옐로·코발트 블루의 의미 규칙, 제한된 스티커·테이프·낙서, 대형 원형 기록 CTA, 레시피 카드와 작은 AI 요리 도우미의 공통 표현으로 한정한다.
- Home은 `a-pop-kitsch-recipe-club`의 정보 위계를 따른다. 큰 CookLog 워드마크와 짧은 라벨, 중앙 대형 원형 음성 기록 CTA, 긴 설명 없는 첫 행동, 최근 레시피 2열 카드 구성, 작은 비챗봇 AI 요리 도우미 배너를 반영한다.
- Library는 같은 Foundation을 공유하되 Home 레이아웃을 복제하지 않는다. 검색·결과·빈 상태·기기 내 검색 개인정보 안내의 의미와 목적지를 보존한다.
- 기존 routing, recipe lifecycle, keyboard/focus, 390×844·375×667, Light/Dark·대비·44pt를 변경하지 않는다. 외부 이미지·폰트는 추가하지 않으며, 2열 카드의 미디어 표현은 저장소 내 기존 정보와 CSS 표현만 사용한다.

## Acceptance Criteria

1. Foundation의 공통 타이포·색·라벨/스티커·원형 CTA·카드·AI 도우미 규격이 Light/Dark 의미 토큰, 대비, 44pt와 focus 계약을 보존하며 `components.html`에서 검토 가능하다.
2. Home 9개 상태는 원본 시안의 큰 CookLog hero, 중앙 원형 음성 기록 CTA, 설명 문단 없는 첫 행동, 최근 레시피 2열 카드, 작은 비챗봇 AI 요리 도우미의 위계를 구현한다.
3. Library 5개 상태는 재작업 Foundation을 공유하면서 제목·재료 검색, 결과 없음·빈 상태, 로컬 검색 개인정보 안내 및 기존 목적지를 보존한다.
4. Home·Library 14개 상태에서 Home→Log·Home→Library·Library→Recipe/Review routing, recipe lifecycle, 최근 3개 규칙, AI 비챗봇 의미, 390×844·375×667·Accessibility 3·keyboard·VoiceOver·focus를 보존한다.
5. 외부 asset·폰트, iOS·Backend, Home·Library 밖 화면의 구조·행동 변경이 없고, 공통 CSS 영향은 후속 화면군의 구조 회귀 없이 제한된다.

## Rework Execution Plan

- 기존 PR #134는 PASS·Completion·병합 보류 상태로 보존한다. 이 PR은 이전 구현과 QA 재작업 기록의 참고 산출물이며 재작업 결과를 병합하지 않는다.
- Product Owner가 2026-08-11 이 범위의 재실행을 승인했다. UI/UX Design Agent / Execution Role만 재작업을 수행할 수 있다.
- UI/UX Design Agent는 최신 `origin/develop@d7e9ea7`에서 새 `task/T-20260811-004-concept-rework` 전용 worktree를 만들고 작업을 시작한다. 기존 Draft PR의 구현 결과는 참고만 하며, stale worktree를 자동 rebase·reset·stash하지 않는다.
- 완료 후 Design QA Agent가 Foundation 표현, Home·Library 14개 상태와 보존 계약을 독립 검증한다. PASS 전에는 T-005 실행·PR #134 병합 근거로 사용할 수 없다.

## Product Owner Approval

- 승인자: Product Owner
- 승인일: 2026-08-11
- 승인 대상: Foundation·Home·Library 단일 재작업 범위와 UI/UX Design Agent 재실행

## Rework Request

- Product Owner 요청으로 독립 PASS 수용·Completion·PR #134 병합을 보류한다.
- 원본 `a-pop-kitsch-recipe-club` 기준의 Foundation 보강과 Home 레이아웃·정보 위계 정합화를 동일 T-004 재작업 범위로 처리한다.
- 재작업 항목: 큰 CookLog hero·보조 그래픽, 중앙 대형 원형 음성 기록 CTA, 최근 레시피 2열 이미지 카드, 작은 비챗봇 AI 요리 도우미 배너.
- 유지 계약: Home/Library 14개 상태·routing·recipe lifecycle·최근 3개·AI 비챗봇·검색 개인정보, 390×844·375×667·Accessibility 3·대비·44pt·keyboard·VoiceOver·focus, 외부 asset·폰트·iOS·Backend·다른 화면 무변경.

## Next Agent Handoff

```text
다음 Agent에게 전달할 말:

너는 UI/UX Design Agent / Execution Role이야.
Task T-20260811-004는 승인된 Foundation·Home·Library 단일 재작업 Task야.

- 공용 기준: origin/develop@639ba36
- 현재 상태: approved
- 변경 대상: design/prototype/app.js, design/prototype/styles.css, design/prototype/components.html
- 참고 산출물: .ai_project/reports/T-20260811-004_pop-kitsch-home-library-prototype-design-report.md, .ai_project/qa/T-20260811-004_pop-kitsch-home-library-prototype-design-qa.md, design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png
- 다음에 해야 할 일: 최신 origin/develop@639ba36에서 새 `task/T-20260811-004-concept-rework` worktree를 만들고, Foundation 보강 후 Home을 원본 시안 위계로 재구성하고 Library에 같은 Foundation을 적용해줘.
- 유지 계약: Home/Library 14개 상태, routing, recipe lifecycle, 최근 3개, AI 비챗봇, 로컬 검색 개인정보, 390×844·375×667, Accessibility 3, 대비, 44pt, keyboard·VoiceOver·focus, 외부 asset·폰트 없음.
- 차단/결정 필요: PR #134는 이전 구현 참고용으로 병합하지 않는다. Home 컨셉에 포함된 음식 사진은 신규 외부 asset 범위에 포함하지 않는다.
- 완료 시: 작업 보고서를 작성하고 status를 verification_ready로 전환해 Design QA Agent / Verification Role에 인계해.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-11 | Design Lead Agent | proposed | scoped | T-003 완료 기준을 반영해 Home·Library 14개 상태 범위와 실행 승인 경계를 정리 |
| 2026-08-11 | Design Lead Agent | scoped | approved | Product Owner 실행 승인을 기록하고 UI/UX Design Agent / Execution Role에 인계 |
| 2026-08-11 | UI/UX Design Agent | approved | in_progress | 승인 scope commit f4b8cc4 기반 전용 worktree에서 lock을 획득하고 Home·Library 14개 상태 구현 시작 |
| 2026-08-11 | UI/UX Design Agent | in_progress | verification_ready | 팝 키치 Home·Library 시안 적용과 정적·대표 렌더 검증을 완료하고 lock 해제 후 Design QA 독립 검증에 인계 |
| 2026-08-11 | Design QA Agent | verification_ready | rework_requested | Product Owner 요청으로 PASS 수용·병합을 보류하고 원본 concept 기준 Foundation 보강·Home 레이아웃 정합화를 같은 T-004 재작업으로 Design Lead에 인계 |
| 2026-08-11 | Design Lead Agent | rework_requested | scoped | T-003을 재오픈하지 않고 Foundation 보강·Home·Library 재작업을 하나의 T-004 실행 단위로 조율 |
| 2026-08-11 | Product Owner | scoped | approved | Foundation·Home·Library 단일 재작업과 UI/UX Design Agent 재실행 승인 |
| 2026-08-11 | UI/UX Design Agent | approved | in_progress | 최신 origin/develop@d7e9ea7 기반 전용 worktree에서 lock을 획득하고 Foundation → Home → Library 순서 재작업 시작 |
