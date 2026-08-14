---
schema: aiops.task.v1
id: T-20260813-003
title: 비공개 Figma Audio·Info·82상태 완결
status: scoped
type: feature
priority: P1
priority_reason: 오디오·권한·오프라인·서비스 상태를 포함해야 82개 제품 상태와 핵심 흐름이 구현 기준으로 완결된다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design Lead Agent
target_role: Lead Role
planned_execution_agent: UI/UX Design Agent
planned_execution_role: Execution Role
required_capabilities:
  - design_scoping
  - design_dependency_management
ownership:
  paths:
    - ".ai_project/tasks/active/T-20260813-003_figma-audio-info-82-state-completion.md"
    - ".ai_project/reports/T-20260813-003_figma-audio-info-82-state-completion-report.md"
    - ".ai_project/qa/T-20260813-003_figma-audio-info-82-state-completion-qa.md"
    - ".ai_project/task_board.md"
    - ".ai_project/teams/design/task_board.md"
  domains:
    - figma-private-source
    - audio-info-flow
    - design-state-completion
  documents:
    - docs/product/
    - design/
ownership_review:
  required: false
  reviewer:
depends_on:
  - T-20260813-002
blocks:
  - T-20260813-005
parallel_group: private-figma-source-transition
allowed_paths:
  - ".ai_project/tasks/active/T-20260813-003_figma-audio-info-82-state-completion.md"
  - ".ai_project/reports/T-20260813-003_figma-audio-info-82-state-completion-report.md"
  - ".ai_project/qa/T-20260813-003_figma-audio-info-82-state-completion-qa.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/design/task_board.md"
source_of_truth:
  - ".ai_project/tasks/active/T-20260812-003_private-figma-source-core-flow-design.md"
  - ".ai_project/tasks/active/T-20260813-001_figma-foundations-home-visual-baseline.md"
  - ".ai_project/tasks/active/T-20260813-002_figma-core-record-recipe-flow.md"
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_POP_KITSCH_UX_PLAN.md
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (URL·파일 키·조직 식별자는 저장소에 기록하지 않음)"
created_by: Design Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-13
updated_at: 2026-08-14
report_to: ".ai_project/reports/T-20260813-003_figma-audio-info-82-state-completion-report.md"
qa_to: ".ai_project/qa/T-20260813-003_figma-audio-info-82-state-completion-qa.md"
status_ref: origin/develop
status_ref_sha: 0d871680a2258fb812fad9251eaa433a8489186a
base_ref: origin/develop
base_sha: 0d871680a2258fb812fad9251eaa433a8489186a
branch:
  name: task/T-20260813-003-figma-audio-info-82-state-completion
  base: develop
pr:
  url:
  status:
blocker:
next_decision: Product Owner가 Audio Guide 24·App Info 11상태와 전체 82상태 기능 계약 완결 실행을 승인하면 UI/UX Design Agent에게 인계한다.
---

# 비공개 Figma Audio·Info·82상태 완결

## Goal

Audio Guide와 App Info의 35개 상태를 설계하고 앞선 47개 상태와 연결해 7개 화면군·82개 상태의 Light/Dark 핵심 흐름을 완결한다.

## Scope

- `390×844pt Light/Dark`에서 Audio Guide 24개, App Info 11개 상태를 만든다.
- 재생·일시정지·탐색·속도·단계 이동·핸즈프리와 권한·오프라인·서비스 오류·복구 흐름을 제품 계약에 맞춘다.
- `04 States & Flows`에 Home 9 + 핵심 기록/레시피 38 + Audio/Info 35 = 82개 추적 매트릭스를 완성한다.
- 82개 각 상태의 발생 조건, UI 단서, 다음 행동, 데이터 보존, 복구, 연결 frame/component를 검사 가능하게 한다.
- 승인된 local Variables·Components와 Home baseline을 유지하고 필요한 상태 variant만 확장한다.
- 후속 화면별 집중 리터치가 안전하게 진행되도록 7개 화면군의 기능·상태·복구 계약 기준선을 고정한다.
- 일반 텍스트 대비, 44pt, 색 외 상태 단서, 읽기 순서와 AX3 대표 위험 frame을 확인한다.

## Out of Scope

- Home과 앞선 38개 상태의 근거 없는 재설계
- 375×667 전체 화면 명세
- iOS, Backend, `design/prototype/` 수정과 자동 생성 코드 적용
- 화면별 최종 시각 승인, manifest·handoff·Source of Truth 확정과 통합 Design QA

## Acceptance Criteria

1. Audio Guide 24개와 App Info 11개, 합계 35개 상태가 추적 가능하다.
2. 7개 화면군·82개 상태가 중복·누락 없이 상태 키, 발생 조건, 다음 행동, 데이터 보존·복구, 연결 대상을 가진다.
3. 오디오·권한·오프라인·서비스 장애 흐름이 PRD/User Flow와 충돌하지 않으며 비시각적 상태 단서가 있다.
4. 모든 화면이 승인된 local Variables·Components를 사용하고 후속 리터치가 상태 계약을 잃지 않도록 추적 가능하다.
5. Light/Dark 기준 대비·44pt·읽기 순서·AX3 대표 위험 frame과 Figma 비공개 운영이 Design QA에서 PASS한다.
6. 최종 시각 완성도와 Product Owner 화면별 승인 게이트는 T-20260813-005~011에서 별도로 진행하며, 이 Task의 기능·상태 기준선을 재개방하지 않는다.

## Coordination Notes

- T-20260813-002가 `done`이 되기 전 실행하지 않는다.
- 82개 기능·상태는 Light/Dark 모두에서 같은 routing·데이터·복구 계약을 유지한다.
- Design QA 통과와 완료 확정 전에는 T-20260813-005를 실행하지 않는다.
- iOS·Prototype은 여전히 Legacy/Baseline이며 이 Task에서 동기화하지 않는다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 UI/UX Design Agent / Execution Role이야.
T-20260813-002가 완료되고 Product Owner가 이 Task를 승인한 뒤 T-20260813-003을 실행해줘.

- 범위: Audio Guide 24·App Info 11상태와 전체 82상태 추적 매트릭스
- 완료 게이트: 82개 기능·상태·복구 계약과 Light/Dark 접근성 기준선의 Design QA PASS
- 금지: iOS·Prototype 수정, 외부 Library 사용, Figma 식별자 저장
- 완료 후: 보고서를 작성하고 verification_ready로 Design QA Agent에게 인계해.
- 주의: 최종 시각 리터치는 T-20260813-005~011에서 화면별 Product Owner 승인과 함께 별도로 진행해.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-13 | Design Lead Agent |  | scoped | Audio·Info 35상태와 7개 화면군·82상태 완결 및 전체 Light/Dark 시각 승인 Task 등록 |
| 2026-08-14 | Design Lead Agent | - | - | T-002 완료 후 기능·상태·복구 계약 완결에 집중하고 최종 화면별 시각 승인은 T-005~011로 분리 |
