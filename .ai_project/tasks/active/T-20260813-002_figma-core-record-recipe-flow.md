---
schema: aiops.task.v1
id: T-20260813-002
title: 비공개 Figma 기록·레시피 핵심 흐름
status: rework_requested
type: feature
priority: P1
priority_reason: 승인된 Home 시각 기준으로 기록부터 저장·재사용까지 핵심 제품 흐름을 한 덩어리로 완성해야 한다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design Lead Agent
target_role: Lead Role
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
  url: https://github.com/cschoi724/CookLog/pull/164
  status: draft
blocker:
next_decision: Design Lead Agent가 DQA-002-001 AX3 Cooking Log 상태 불일치와 DQA-002-002 action 집계 정합성의 재작업 범위를 수용·승인한 뒤 UI/UX Design Agent로 라우팅한다.
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

너는 Design Lead Agent / Lead Role이야.
Task T-20260813-002의 독립 Design QA 재작업 요청을 조율해줘.

- 현재 상태: rework_requested
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: fa39d0621227de954c131dc544f595522a08a85d
- 다음에 해야 할 일: DQA-002-001의 AX3 Cooking Log frame을 실제 `LOG-10 · Recording Error / Dark` 상태로 일치시키고, DQA-002-002의 action 집계 정의·수치를 실행 보고서와 일치시키는 재작업 범위를 승인한 뒤 UI/UX Design Agent에 라우팅해줘.
- 기준 문서: .ai_project/tasks/active/T-20260813-002_figma-core-record-recipe-flow.md, docs/product/CookLog_PRD_v2.md, docs/product/CookLog_USER_FLOW.md, docs/product/CookLog_POP_KITSCH_UX_PLAN.md, T-001 실행·QA 보고서
- 허용 경로: Product Owner 지정 비공개 Draft Figma 파일, 이 Task·실행 보고서·QA 문서·공용/Design 보드의 allowed_paths
- 참고 산출물: .ai_project/reports/T-20260813-002_figma-core-record-recipe-flow-report.md
- 변경/검토 대상: AX3 Cooking Log Recording Error Dark frame과 실행 보고서 action 집계
- 독립 QA 통과 범위: 38개 상태·Light/Dark 76개 frame·상태 계약·최소 44pt·local 색상 mode·보안 비기록
- 남은 리스크: 실제 iOS hit area·VoiceOver·Dynamic Type은 구현·iOS QA 단계에서 검증하며 375×667 전체 화면과 Audio/Info는 비범위다.
- 보안: Figma URL·파일 키·조직·초대 대상 식별자를 저장소·Task·보고서에 기록하거나 공유 범위를 확대하지 마.
- 남은 리스크: 실제 iOS hit area·VoiceOver·Dynamic Type은 구현·iOS QA 단계에서 별도 검증하며 375×667 전체 화면은 비범위다.
- 차단/결정 필요: 새 기능·routing·데이터 계약이 필요하면 임의 확정하지 말고 Product Lead 결정으로 분리해줘.
- 완료 시: UI/UX Design Agent가 자체 검증 후 `verification_ready`, `Design QA Agent / Verification Role`로 재인계하도록 해줘.
- 주의: 재작업 승인 전 실행하지 말고, Figma URL·파일 키·조직·초대 대상은 저장소에 기록하지 마.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-13 | Design Lead Agent |  | scoped | 승인 Home baseline을 확장하는 기록·저장·재사용 4개 화면군 38상태 Task 등록 |
| 2026-08-13 | Product Owner | scoped | approved | T-001의 canonical done과 비공개·local-only 경계를 확인하고 UI/UX Design Agent의 4개 화면군 38상태 실행 승인 |
| 2026-08-13 | UI/UX Design Agent | approved | in_progress | PR #164 전용 브랜치와 비공개 Draft의 local Foundation·Component·38개 상태 계약을 확인하고 실행 잠금 획득 |
| 2026-08-13 | UI/UX Design Agent | in_progress | verification_ready | Library 5·Log 14·Review 12·Detail 7 상태를 Light/Dark 76개 frame으로 구현하고 실행 보고서·자체 검증을 완료해 Design QA에 인계 |
| 2026-08-13 | Design QA Agent | verification_ready | verification_in_progress | 비공개 Draft와 실행 보고서·제품 상태 계약을 기준으로 38개 핵심 흐름 독립 검증 시작 |
| 2026-08-13 | Design QA Agent | verification_in_progress | rework_requested | DQA-002-001 AX3 Cooking Log frame이 Recording Error로 명명됐지만 Offline Recording을 복제한 불일치와 DQA-002-002 action 집계 정합성 결함을 확인해 Design Lead에 재작업 인계 |
