---
schema: aiops.task.v1
id: T-20260813-002
title: 비공개 Figma 기록·레시피 핵심 흐름
status: approved
type: feature
priority: P1
priority_reason: 승인된 Home 시각 기준으로 기록부터 저장·재사용까지 핵심 제품 흐름을 한 덩어리로 완성해야 한다.
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
    - ".ai_project/tasks/active/T-20260813-002_figma-core-record-recipe-flow.md"
    - ".ai_project/reports/T-20260813-002_figma-core-record-recipe-flow-report.md"
    - ".ai_project/qa/T-20260813-002_figma-core-record-recipe-flow-qa.md"
    - ".ai_project/task_board.md"
    - ".ai_project/teams/design/task_board.md"
  domains:
    - figma-private-source
    - core-record-recipe-flow
    - design-state-contract
  documents:
    - docs/product/
    - design/
ownership_review:
  required: false
  reviewer:
depends_on:
  - T-20260813-001
blocks:
  - T-20260813-003
parallel_group: private-figma-source-transition
allowed_paths:
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (저장소 외부 작업공간; URL·파일 키·조직 식별자는 비기록)"
  - ".ai_project/tasks/active/T-20260813-002_figma-core-record-recipe-flow.md"
  - ".ai_project/reports/T-20260813-002_figma-core-record-recipe-flow-report.md"
  - ".ai_project/qa/T-20260813-002_figma-core-record-recipe-flow-qa.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/design/task_board.md"
source_of_truth:
  - ".ai_project/tasks/active/T-20260812-003_private-figma-source-core-flow-design.md"
  - ".ai_project/tasks/active/T-20260813-001_figma-foundations-home-visual-baseline.md"
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_POP_KITSCH_UX_PLAN.md
  - design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (URL·파일 키·조직 식별자는 저장소에 기록하지 않음)"
created_by: Design Lead Agent
approved_by: Product Owner (2026-08-13, T-001 canonical done 확인 후 기록·레시피 핵심 흐름 38상태 비공개 Figma 실행 승인)
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-13
updated_at: 2026-08-13
report_to: ".ai_project/reports/T-20260813-002_figma-core-record-recipe-flow-report.md"
qa_to: ".ai_project/qa/T-20260813-002_figma-core-record-recipe-flow-qa.md"
status_ref: origin/develop
status_ref_sha: fa39d0621227de954c131dc544f595522a08a85d
base_ref: origin/develop
base_sha: fa39d0621227de954c131dc544f595522a08a85d
branch:
  name: task/T-20260813-002-figma-core-record-recipe-flow
  base: develop
pr:
  url:
  status:
blocker:
next_decision: UI/UX Design Agent가 승인된 비공개 Draft에서 38개 상태를 실행하고 자체 검증 후 Design QA로 인계한다.
---

# 비공개 Figma 기록·레시피 핵심 흐름

## Goal

승인된 Home baseline과 공통 컴포넌트를 사용해 요리 기록 시작부터 AI 정리, 레시피 저장·검색·상세·재사용까지의 핵심 흐름을 고충실도로 완성한다.

## Scope

- `390×844pt Light/Dark`에서 다음 4개 화면군 38개 상태를 만든다.
  - Library 5개
  - Cooking Log 14개
  - AI Review 12개
  - Recipe Detail 7개
- 기록 → 저장 → Library → 상세 → 다시 요리로 이어지는 주요 연결과 back/cancel/retry/recovery를 정의한다.
- 모든 상태에 추적 키, 발생 조건, 다음 행동, 데이터 보존·복구 계약을 표시한다.
- T-20260813-001에서 승인한 local Variables·Components를 재사용하고, 필요한 variant는 같은 컴포넌트 체계 안에서 확장한다.
- CTA 위계, 짧은 카피, 제한된 스티커·라벨·낙서, 비챗봇 AI 도우미 표현을 Home baseline의 강도로 유지한다.
- 일반 텍스트 대비, 최소 44pt, 색 외 상태 단서, 읽기 순서와 AX3 대표 위험 frame을 확인한다.

## Out of Scope

- Home baseline 재설계, Audio Guide와 App Info 제작
- 375×667 전체 화면 명세
- iOS, Backend, `design/prototype/` 수정과 자동 생성 코드 적용
- 공개 공유·외부 Library·회사 자산 사용

## Acceptance Criteria

1. Library 5·Cooking Log 14·AI Review 12·Recipe Detail 7, 합계 38개 상태가 누락 없이 추적 가능하다.
2. 기록→저장→검색/상세→재사용 흐름과 cancel/retry/recovery가 제품 문서의 데이터 보존 계약과 일치한다.
3. 모든 화면이 승인 Home baseline의 layout language·type scale·color·component hierarchy를 공유하고 기존 Prototype 레이아웃으로 회귀하지 않는다.
4. frame과 component 속성에서 구현자가 geometry·spacing·typography·copy·color·state variant를 직접 읽을 수 있다.
5. Light/Dark 기준 대비·44pt·색 외 상태 단서·읽기 순서·AX3 대표 위험 frame이 PASS한다.
6. Figma 민감 식별자와 외부 의존성이 저장소·보고서에 없고 Design QA가 38개 상태 계약을 독립 검증한다.

## Coordination Notes

- T-20260813-001이 `done`이 되기 전 실행하지 않는다.
- 같은 Figma 파일을 여러 UI/UX Agent가 동시에 수정하지 않는다.
- 새 기능·routing·데이터 계약이 필요해 보이면 디자인으로 확정하지 않고 Product Lead에게 결정 요청한다.
- 완료·검증 후에만 T-20260813-003을 실행한다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 UI/UX Design Agent / Execution Role이야.
Task T-20260813-002는 승인된 실행 Task야.

- 현재 상태: approved
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: fa39d0621227de954c131dc544f595522a08a85d
- 다음에 해야 할 일: 지정된 비공개 Draft에서 T-001의 Home baseline과 local Variables·Components를 재사용해 4개 화면군 38개 상태를 제작하고, 자체 검증·실행 보고 후 verification_ready로 인계해줘.
- 범위: Library 5·Cooking Log 14·AI Review 12·Recipe Detail 7, 총 38상태의 390×844 Light/Dark
- 기준: 승인된 Home Visual Baseline v1과 같은 Figma local Variables·Components
- 허용 경로: Product Owner 지정 비공개 Draft Figma 파일, 이 Task·실행 보고서·QA 문서·공용/Design 보드의 allowed_paths
- 참고 산출물: .ai_project/tasks/active/T-20260813-002_figma-core-record-recipe-flow.md, T-20260813-001 실행·QA 보고서
- 보존 계약: 기록→저장→검색/상세→재사용, cancel/retry/recovery, 데이터 보존·복구, 44pt·대비·색 외 상태 단서·읽기 순서·AX3
- 금지: Home 재설계, Audio/Info 선행 제작, iOS·Prototype 수정, 외부 Library 사용
- 보안: Figma URL·파일 키·조직·초대 대상 식별자를 저장소·Task·보고서에 기록하거나 공유 범위를 확대하지 마.
- 남은 리스크: 실제 iOS hit area·VoiceOver·Dynamic Type은 구현·iOS QA 단계에서 별도 검증하며 375×667 전체 화면은 비범위다.
- 차단/결정 필요: 새 기능·routing·데이터 계약이 필요하면 임의 확정하지 말고 Product Lead 결정으로 분리해줘.
- 완료 후: 보고서를 작성하고 status를 verification_ready, target_agent를 Design QA Agent, target_role을 Verification Role로 바꾸고 lock을 비운 뒤 독립 검증에 인계해줘.
- 주의: 실행 전 현재 Task의 workflow, status, target_agent, target_role, depends_on, locked_by를 다시 확인해줘.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-13 | Design Lead Agent |  | scoped | 승인 Home baseline을 확장하는 기록·저장·재사용 4개 화면군 38상태 Task 등록 |
| 2026-08-13 | Product Owner | scoped | approved | T-001의 canonical done과 비공개·local-only 경계를 확인하고 UI/UX Design Agent의 4개 화면군 38상태 실행 승인 |
