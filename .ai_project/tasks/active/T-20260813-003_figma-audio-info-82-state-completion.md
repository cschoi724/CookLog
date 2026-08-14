---
schema: aiops.task.v1
id: T-20260813-003
title: 비공개 Figma Audio·Info·82상태 완결
status: approved
type: feature
priority: P1
priority_reason: 오디오·권한·오프라인·서비스 상태를 포함해야 82개 제품 상태와 핵심 흐름이 구현 기준으로 완결된다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: UI/UX Design Agent
target_role: Execution Role
planned_execution_agent: UI/UX Design Agent
planned_execution_role: Execution Role
required_capabilities:
  - ux_flow
  - ui_design
  - prototyping
  - design_handoff
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
approved_by: Product Owner (2026-08-14, Audio Guide 24·App Info 11상태와 전체 82상태 기능·복구 계약 완결 실행 승인; UI/UX Design Agent 실행·Design QA 독립 검증 조건)
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-13
updated_at: 2026-08-14
report_to: ".ai_project/reports/T-20260813-003_figma-audio-info-82-state-completion-report.md"
qa_to: ".ai_project/qa/T-20260813-003_figma-audio-info-82-state-completion-qa.md"
status_ref: origin/develop
status_ref_sha: e7f1bf4686f02cd77cdf083c3995c5ce73478396
base_ref: origin/develop
base_sha: e7f1bf4686f02cd77cdf083c3995c5ce73478396
branch:
  name: task/T-20260813-003-figma-audio-info-82-state-completion
  base: develop
pr:
  url:
  status:
blocker:
next_decision: UI/UX Design Agent가 canonical 승인 상태를 확인하고 전용 task branch에서 lock을 획득해 실행한다.
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
Task T-20260813-003은 승인된 실행 Task야.

- 현재 상태: approved
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: e7f1bf4686f02cd77cdf083c3995c5ce73478396
- 다음에 해야 할 일: 최신 canonical 승인 상태와 빈 lock을 확인하고 전용 task branch에서 lock을 획득한 뒤 Audio Guide 24개·App Info 11개 상태와 전체 82개 상태 추적 매트릭스를 완결해.
- 기준 문서: 상위 T-20260812-003, 완료 T-20260813-001·002, CookLog PRD v2, User Flow, Pop Kitsch UX Plan, 기존 Prototype·handoff, Product Owner 지정 비공개 Draft Figma 파일.
- 허용 경로: Product Owner 지정 비공개 Draft Figma 파일, 이 Task·실행 보고서·QA 문서·공용/Design 보드의 allowed_paths만 사용해.
- 참고 산출물: .ai_project/tasks/active/T-20260813-003_figma-audio-info-82-state-completion.md, .ai_project/reports/T-20260813-003_figma-audio-info-82-state-completion-report.md
- 변경/검토 대상: Audio Guide 24상태, App Info 11상태, Home 9 + 기록·레시피 38 + Audio·Info 35 = 전체 82상태의 Light/Dark 기능·상태·복구 계약과 추적성.
- 남은 리스크: 최종 화면별 시각 충실도와 Product Owner 시각 승인은 T-20260813-005~011에서 별도로 수행해. 이 Task에서 기능·상태 기준선을 이유 없이 재설계하지 마.
- 차단/결정 필요: 새 기능·routing·데이터 계약 또는 외부 자산이 필요하면 임의 확정하지 말고 Design Lead에게 재조율을 요청해.
- 보안: Figma URL·파일 키·조직·초대 대상 식별자를 저장소·Task·보고서에 기록하지 말고 공개 공유·외부 Library·회사 자산을 사용하지 마.
- 완료 시: 자체 검증과 실행 보고서를 작성하고 status를 verification_ready, target_agent를 Design QA Agent, target_role을 Verification Role로 전환해 독립 검증을 인계해.
- 금지: iOS·Backend·design/prototype/ 수정, manifest·handoff·Source of Truth 확정, T-20260813-005~011 선행 실행.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-13 | Design Lead Agent |  | scoped | Audio·Info 35상태와 7개 화면군·82상태 완결 및 전체 Light/Dark 시각 승인 Task 등록 |
| 2026-08-14 | Design Lead Agent | - | - | T-002 완료 후 기능·상태·복구 계약 완결에 집중하고 최종 화면별 시각 승인은 T-005~011로 분리 |
| 2026-08-14 | Product Owner | scoped | approved | Audio Guide 24·App Info 11상태와 전체 82상태 기능·복구 계약 완결을 승인하고 UI/UX Design Agent 실행·Design QA 독립 검증 조건으로 인계 |
