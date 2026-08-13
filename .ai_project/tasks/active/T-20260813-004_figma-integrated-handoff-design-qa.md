---
schema: aiops.task.v1
id: T-20260813-004
title: 비공개 Figma 통합 Handoff·Design QA
status: scoped
type: qa
priority: P1
priority_reason: 고정 Figma baseline을 구현 원천으로 선언하기 전에 82개 상태·접근성·비공개 운영·handoff를 독립 검증해야 한다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: qa
target_agent: Design Lead Agent
target_role: Lead Role
planned_execution_agent: UI/UX Design Agent
planned_execution_role: Execution Role
required_capabilities:
  - design_scoping
  - design_dependency_management
ownership:
  paths:
    - ".ai_project/tasks/active/T-20260813-004_figma-integrated-handoff-design-qa.md"
    - ".ai_project/reports/T-20260813-004_figma-integrated-handoff-design-qa-report.md"
    - ".ai_project/qa/T-20260813-004_figma-integrated-handoff-design-qa.md"
    - ".ai_project/source_of_truth.md"
    - "design/figma-build/manifest.json"
    - "design/COOKLOG_MVP_UIUX_V1_HANDOFF.md"
    - ".ai_project/task_board.md"
    - ".ai_project/teams/design/task_board.md"
    - ".ai_project/teams/quality/task_board.md"
  domains:
    - figma-private-source
    - design-handoff
    - integrated-design-qa
  documents:
    - .ai_project/source_of_truth.md
    - design/
ownership_review:
  required: true
  reviewer: Product Lead Agent
depends_on:
  - T-20260813-003
blocks:
  - T-20260812-003
parallel_group: private-figma-source-transition
allowed_paths:
  - ".ai_project/tasks/active/T-20260813-004_figma-integrated-handoff-design-qa.md"
  - ".ai_project/reports/T-20260813-004_figma-integrated-handoff-design-qa-report.md"
  - ".ai_project/qa/T-20260813-004_figma-integrated-handoff-design-qa.md"
  - ".ai_project/source_of_truth.md"
  - "design/figma-build/manifest.json"
  - "design/COOKLOG_MVP_UIUX_V1_HANDOFF.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/design/task_board.md"
  - ".ai_project/teams/quality/task_board.md"
source_of_truth:
  - ".ai_project/tasks/active/T-20260812-003_private-figma-source-core-flow-design.md"
  - ".ai_project/tasks/active/T-20260813-001_figma-foundations-home-visual-baseline.md"
  - ".ai_project/tasks/active/T-20260813-002_figma-core-record-recipe-flow.md"
  - ".ai_project/tasks/active/T-20260813-003_figma-audio-info-82-state-completion.md"
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_POP_KITSCH_UX_PLAN.md
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/figma-build/manifest.json
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (URL·파일 키·조직 식별자는 저장소에 기록하지 않음)"
created_by: Design Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-13
updated_at: 2026-08-13
report_to: ".ai_project/reports/T-20260813-004_figma-integrated-handoff-design-qa-report.md"
qa_to: ".ai_project/qa/T-20260813-004_figma-integrated-handoff-design-qa.md"
status_ref: origin/develop
status_ref_sha: bcbd3aa6bd5d307da03238aabd5c0ebcd811d583
base_ref: origin/develop
base_sha: bcbd3aa6bd5d307da03238aabd5c0ebcd811d583
branch:
  name: task/T-20260813-004-figma-integrated-handoff-design-qa
  base: develop
pr:
  url:
  status:
blocker: T-20260813-003의 Product Owner 전체 Light 시각 승인과 Design QA 통과가 필요하다.
next_decision: 선행 Task 완료 뒤 Product Owner가 UI/UX handoff 준비를 승인하고, 완료 산출물을 Design QA Agent에게 독립 검증으로 인계한다.
---

# 비공개 Figma 통합 Handoff·Design QA

## Goal

Product Owner가 승인한 비공개 Figma 완성본을 82개 상태와 구현 속성이 추적 가능한 고정 baseline으로 문서화하고, 독립 Design QA 후에만 공식 UI Source of Truth로 전환한다.

## Scope

### UI/UX Design Agent

- 7개 화면군·82개 상태 추적 매트릭스와 Home·전체 Light 시각 승인 사실을 민감 식별자 없이 실행 보고서에 정리한다.
- frame/component/variable 이름, revision label, component usage, state variant와 `고정`·`반응형`·`플랫폼 적응` annotation을 정리한다.
- `design/figma-build/manifest.json`, `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`, `.ai_project/source_of_truth.md`를 Figma 우선·Prototype Legacy 원칙으로 서로 맞춘다.
- 저장소 문서에는 Figma URL·파일 키·조직·초대 대상 식별자를 쓰지 않고 비공개 작업 컨텍스트에서만 대상 파일을 지정한다.
- QA가 재현할 수 있는 화면/상태 목록, 대비·44pt·읽기 순서·AX3 대표 위험 frame 증거를 준비한다.

### Design QA Agent

- UI/UX Design Agent와 분리된 Verification Role 세션에서 독립 검증한다.
- 82개 상태의 누락·중복·발생 조건·다음 행동·데이터 보존·복구·연결 대상을 확인한다.
- `390×844 Light`에서 선택 시안·Home baseline·7개 화면군 시각 언어의 일관성을 확인한다.
- 대비, 최소 44pt, 색 외 상태 단서, 읽기 순서와 AX3 대표 위험 frame을 확인한다.
- CookLog local Library 전용, 외부 의존성 없음, 민감 식별자 비기록, 문서 3종 정합성을 확인한다.
- 결과를 `PASS`, `PASS_WITH_RISK`, `FAIL`, `BLOCKED`로 판정한다.

## Out of Scope

- Figma 화면 재설계와 기능·routing·데이터 계약 변경
- Dark mode 정밀 화면·시각 QA, 375×667 전체 화면 QA
- iOS·Backend·`design/prototype/` 구현 동기화
- 공개 링크·Community 게시·외부 배포와 Figma 식별자 저장

## Acceptance Criteria

1. Product Owner의 Home Visual Baseline v1 및 전체 390×844 Light 시각 승인 사실이 식별자 없이 추적된다.
2. 7개 화면군·82개 상태가 frame/component와 연결되고 상태·복구 계약이 누락 없이 검사 가능하다.
3. local Variables·Components와 구현 속성·annotation이 iOS Agent가 임의 재해석 없이 읽을 수 있는 수준으로 정리된다.
4. Light 기준 대비·44pt·색 외 상태 단서·읽기 순서·AX3 대표 위험 frame이 독립 QA에서 PASS한다.
5. 저장소와 보고서에 Figma URL·파일 키·조직·초대 대상 식별자와 외부 Library 의존성이 없다.
6. Source of Truth·manifest·handoff가 Figma 우선, Prototype/iOS 현행 UI는 Legacy/Baseline이라는 같은 전환 시점을 설명한다.
7. Design QA가 PASS 또는 Product Owner가 명시적으로 수용한 PASS_WITH_RISK를 내기 전 상위 T-20260812-003을 완료하거나 iOS 동기화를 재개하지 않는다.

## Coordination Notes

- T-20260813-003이 `done`이 되기 전 실행하지 않는다.
- UI/UX Design Agent가 실행 보고서와 문서 변경안을 준비한 뒤 `verification_ready`로 전환하고 lock을 해제한다.
- Design QA Agent는 별도 세션에서 lock을 획득하고 독립 검증한다.
- QA 통과 뒤 Design Lead가 상위 T-20260812-003 Completion Review를 수행한다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 UI/UX Design Agent / Execution Role이야.
T-20260813-003이 완료되고 Product Owner가 이 Task를 승인한 뒤 T-20260813-004를 실행해줘.

- 범위: 82상태 추적·구현 annotation·manifest·handoff·Source of Truth 변경안·QA 증거
- 금지: 화면 재설계, iOS·Prototype 수정, Dark 정밀 QA, Figma 식별자 저장
- 완료 후: verification_ready로 전환하고 Design QA Agent에게 독립 검증을 인계해.
- QA 통과 뒤: Design Lead Agent가 상위 T-20260812-003 완료 리뷰를 진행해.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-13 | Design Lead Agent |  | scoped | Figma baseline 문서화·82상태·Light 접근성·비공개 운영을 독립 검증하는 통합 Task 등록 |
