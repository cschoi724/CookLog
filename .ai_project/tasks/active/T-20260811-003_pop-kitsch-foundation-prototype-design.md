---
schema: aiops.task.v1
id: T-20260811-003
title: 팝 키치 레시피 클럽 Foundation·공통 컴포넌트 원본 정비
status: verification_ready
type: feature
priority: P1
priority_reason: 앱 전반 리디자인의 첫 단계로 의미 토큰과 13개 공통 컴포넌트를 안정화한다. P0 iOS·Backend 작업을 중단하지 않는다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design QA Agent
target_role: Verification Role
required_capabilities: [ui_design, prototyping, design_handoff, developer_verification, task_reporting]
ownership:
  paths: [design/prototype/app.js, design/prototype/styles.css, design/prototype/components.html]
  domains: [prototype-foundation, shared-components]
  documents: [design/prototype/, design/COOKLOG_MVP_UIUX_V1_HANDOFF.md]
ownership_review:
  required: false
  reviewer:
depends_on: []
resolved_dependencies:
  - task: T-20260811-002
    resolved_by: Product Owner
    resolved_at: 2026-08-11
    note: Product Owner가 상위 Product scope 완료를 확인해 Design 실행 의존성을 해소했다. 상위 Task의 공용 status 동기화는 Product Lead 소유로 별도 처리한다.
blocks: [T-20260811-004]
parallel_group: pop-kitsch-design-sequence
allowed_paths:
  - design/prototype/app.js
  - design/prototype/styles.css
  - design/prototype/components.html
  - .ai_project/tasks/active/T-20260811-003_pop-kitsch-foundation-prototype-design.md
  - .ai_project/reports/T-20260811-003_pop-kitsch-foundation-prototype-design-report.md
  - .ai_project/qa/T-20260811-003_pop-kitsch-foundation-prototype-design-qa.md
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
source_of_truth:
  - origin/develop@2a002a6
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
created_by: Design Lead Agent
approved_by: Product Owner (2026-08-11, Foundation 실행 승인 및 T-002 scope 완료 확인)
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-11
updated_at: 2026-08-11
report_to: .ai_project/reports/T-20260811-003_pop-kitsch-foundation-prototype-design-report.md
qa_to: .ai_project/qa/T-20260811-003_pop-kitsch-foundation-prototype-design-qa.md
status_ref: origin/develop
status_ref_sha: 2a002a6
parent_scope_ref: origin/develop@8647d19
base_ref: origin/develop
base_sha: 2a002a6
worktree_path: /private/tmp/cooklog-t20260811-003-pop-kitsch-foundation-v2
worktree_role: Execution Role
branch:
  name: task/T-20260811-003-pop-kitsch-foundation-v2
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

- Product Owner가 2026-08-11 Foundation 실행과 상위 T-002 scope 완료를 확인했다. T-003은 `approved`이며 UI/UX Design Agent / Execution Role만 실행할 수 있다. T-002의 공용 status 동기화는 Product Lead 소유라 본 Task의 실행 의존성과 분리해 기록한다.
- UI/UX Design Agent는 최신 `origin/develop@8647d19`에서 전용 worktree와 lock을 획득하고 `allowed_paths`만 수정한다. 완료 시 자체 검증 뒤 `verification_ready`, Design QA Agent / Verification Role로 인계한다. 통과 전 `T-004`를 실행하지 않는다.

## Next Agent Handoff

```text
다음 Agent에게 전달할 말:

너는 Design QA Agent / Verification Role이야.
Task T-20260811-003의 Foundation 원본 정비 결과를 독립 검증해줘.

- 공용 기준: origin/develop@2a002a6
- 현재 상태: verification_ready
- 작업 경로: /private/tmp/cooklog-t20260811-003-pop-kitsch-foundation-v2
- 변경 대상: design/prototype/styles.css, design/prototype/components.html
- 실행 보고서: .ai_project/reports/T-20260811-003_pop-kitsch-foundation-prototype-design-report.md
- 검증 범위: 13개 공통 컴포넌트, Light/Dark, 390×844·375×667, Accessibility 3, 대비, 44pt, keyboard·VoiceOver·focus 계약.
- 보존 확인: app.js와 82개 화면 구조·행동·routing·문자 의미 무변경, 외부 asset·폰트 없음.
- 후속 차단: 독립 PASS 전 T-20260811-004 실행 금지.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-11 | Design Lead Agent | scoped Home 초안 | proposed Foundation 초안 | 상위 T-002의 앱 전반·화면군 순차 범위에 맞춰 이전 Home 한 장 실행 승인 범위를 분리·재조율 |
| 2026-08-11 | Design Lead Agent | proposed | scoped | Product Owner의 Foundation 실행 승인을 기록; 상위 T-002의 Product Lead scope 완료를 실행 선행 조건으로 유지 |
| 2026-08-11 | Design Lead Agent | scoped | approved | Product Owner가 T-002 scope 완료를 확인해 실행 의존성을 해소하고 UI/UX Design Agent / Execution Role에 인계 |
| 2026-08-11 | UI/UX Design Agent | approved | in_progress | 최신 origin/develop@1461129 전용 worktree에서 lock을 획득하고 Foundation 원본 정비 시작 |
| 2026-08-11 | UI/UX Design Agent | in_progress | verification_ready | 팝 키치 Light/Dark 토큰과 13개 공통 컴포넌트 정비·자체 검증을 완료하고 Design QA에 인계 |
| 2026-08-11 | UI/UX Design Agent | verification_ready | verification_ready | 작업 중 전진한 origin/develop@2a002a6의 T-002 scope·project board 변경을 새 worktree에 재통합하고 검증 결과를 보존 |
