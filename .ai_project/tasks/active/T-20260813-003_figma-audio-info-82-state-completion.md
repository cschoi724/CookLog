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
  - T-20260813-004
parallel_group: private-figma-source-transition
allowed_paths:
  - ".ai_project/tasks/active/T-20260813-003_figma-audio-info-82-state-completion.md"
  - ".ai_project/reports/T-20260813-003_figma-audio-info-82-state-completion-report.md"
  - ".ai_project/qa/T-20260813-003_figma-audio-info-82-state-completion-qa.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/design/task_board.md"
source_of_truth:
  - ".ai_project/tasks/backlog/T-20260812-003_private-figma-source-core-flow-design.md"
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
updated_at: 2026-08-13
report_to: ".ai_project/reports/T-20260813-003_figma-audio-info-82-state-completion-report.md"
qa_to: ".ai_project/qa/T-20260813-003_figma-audio-info-82-state-completion-qa.md"
status_ref: origin/develop
status_ref_sha: bcbd3aa6bd5d307da03238aabd5c0ebcd811d583
base_ref: origin/develop
base_sha: bcbd3aa6bd5d307da03238aabd5c0ebcd811d583
branch:
  name: task/T-20260813-003-figma-audio-info-82-state-completion
  base: develop
pr:
  url:
  status:
blocker: T-20260813-002의 완료와 Design QA 통과가 필요하다.
next_decision: 선행 Task 완료 뒤 Product Owner가 실행을 승인해 UI/UX Design Agent에게 인계한다.
---

# 비공개 Figma Audio·Info·82상태 완결

## Goal

Audio Guide와 App Info의 35개 상태를 설계하고 앞선 47개 상태와 연결해 7개 화면군·82개 상태의 Light 핵심 흐름을 완결한다.

## Scope

- `390×844pt Light`에서 Audio Guide 24개, App Info 11개 상태를 만든다.
- 재생·일시정지·탐색·속도·단계 이동·핸즈프리와 권한·오프라인·서비스 오류·복구 흐름을 제품 계약에 맞춘다.
- `04 States & Flows`에 Home 9 + 핵심 기록/레시피 38 + Audio/Info 35 = 82개 추적 매트릭스를 완성한다.
- 82개 각 상태의 발생 조건, UI 단서, 다음 행동, 데이터 보존, 복구, 연결 frame/component를 검사 가능하게 한다.
- 승인된 local Variables·Components와 Home baseline을 유지하고 필요한 상태 variant만 확장한다.
- Product Owner가 7개 화면군 전체의 `390×844pt Light` 시각 방향을 승인한다.
- 일반 텍스트 대비, 44pt, 색 외 상태 단서, 읽기 순서와 AX3 대표 위험 frame을 확인한다.

## Out of Scope

- Home과 앞선 38개 상태의 근거 없는 재설계
- Dark mode 정밀 화면·시각 QA, 375×667 전체 화면 명세
- iOS, Backend, `design/prototype/` 수정과 자동 생성 코드 적용
- manifest·handoff·Source of Truth 확정과 통합 Design QA

## Acceptance Criteria

1. Audio Guide 24개와 App Info 11개, 합계 35개 상태가 추적 가능하다.
2. 7개 화면군·82개 상태가 중복·누락 없이 상태 키, 발생 조건, 다음 행동, 데이터 보존·복구, 연결 대상을 가진다.
3. 오디오·권한·오프라인·서비스 장애 흐름이 PRD/User Flow와 충돌하지 않으며 비시각적 상태 단서가 있다.
4. 모든 화면이 승인 Home baseline과 같은 local Variables·Components·시각 언어를 사용한다.
5. Product Owner가 전체 390×844 Light 핵심 흐름의 시각 방향을 승인하고 그 사실이 민감 식별자 없이 보고서에 기록된다.
6. Light 기준 대비·44pt·읽기 순서·AX3 대표 위험 frame과 Figma 비공개 운영이 Design QA에서 PASS한다.

## Coordination Notes

- T-20260813-002가 `done`이 되기 전 실행하지 않는다.
- Dark 정밀 화면 미제작을 82개 기능·상태 삭제로 해석하지 않는다.
- Product Owner 전체 시각 승인 또는 Design QA 전에는 T-20260813-004를 실행하지 않는다.
- iOS·Prototype은 여전히 Legacy/Baseline이며 이 Task에서 동기화하지 않는다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 UI/UX Design Agent / Execution Role이야.
T-20260813-002가 완료되고 Product Owner가 이 Task를 승인한 뒤 T-20260813-003을 실행해줘.

- 범위: Audio Guide 24·App Info 11상태와 전체 82상태 추적 매트릭스
- 승인 게이트: Product Owner의 7개 화면군 전체 390×844 Light 시각 승인
- 금지: Dark 정밀 화면, iOS·Prototype 수정, 외부 Library 사용, Figma 식별자 저장
- 완료 후: 보고서를 작성하고 verification_ready로 Design QA Agent에게 인계해.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-13 | Design Lead Agent |  | scoped | Audio·Info 35상태와 7개 화면군·82상태 완결 및 전체 Light 시각 승인 Task 등록 |
