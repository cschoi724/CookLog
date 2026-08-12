---
schema: aiops.task.v1
id: T-20260812-004
title: 비공개 Figma 원천 전환 기반 Task 흐름·의존성 재정렬
status: proposed
type: feature
priority: P0
priority_reason: 기존 로컬 Prototype 중심 디자인·iOS 검증 체인과 새 비공개 Figma 원천 체인을 정렬하지 않으면
  디자인·구현이 다시 분기되고, P0 iOS 통합 검증의 재개 기준도 고정할 수 없다.
org_unit: Product Division
team: Product Team
team_lead: Product Lead Agent
workflow: feature
target_agent: Product Lead Agent
target_role: Lead Role
planned_execution_agent: Product Planning Agent
planned_execution_role: Execution Role
required_capabilities:
  - product_direction
  - priority_management
  - product_scoping
  - product_dependency_management
  - ux_information_architecture
  - design_dependency_management
  - technical_planning
  - source_of_truth_governance
ownership:
  paths:
    - ".ai_project/tasks/backlog/T-20260812-004_rebaseline-private-figma-delivery-flow.md"
    - ".ai_project/tasks/backlog/T-20260811-002_pop-kitsch-home-concept-source-design.md"
    - ".ai_project/tasks/active/T-20260811-008_pop-kitsch-visual-fidelity-retouch.md"
    - ".ai_project/tasks/backlog/T-20260811-005_pop-kitsch-log-review-detail-prototype-design.md"
    - ".ai_project/tasks/backlog/T-20260811-006_pop-kitsch-player-info-error-prototype-design.md"
    - ".ai_project/tasks/backlog/T-20260811-007_pop-kitsch-prototype-integration-design-qa.md"
    - ".ai_project/tasks/backlog/T-20260812-003_private-figma-source-core-flow-design.md"
    - ".ai_project/tasks/active/T-20260805-008_ios-accessibility-visual-regression.md"
    - ".ai_project/tasks/active/T-20260812-001_ios-implementation-visual-design-qa.md"
    - ".ai_project/tasks/active/T-20260728-003_apply-figma-uiux-to-ios.md"
    - ".ai_project/task_board.md"
    - ".ai_project/teams/product/task_board.md"
    - ".ai_project/teams/design/task_board.md"
    - ".ai_project/teams/development/task_board.md"
    - ".ai_project/teams/quality/task_board.md"
    - ".ai_project/source_of_truth.md"
  domains:
    - product-portfolio-sequencing
    - private-figma-source-transition
    - design-to-ios-delivery
  documents:
    - docs/product/
    - design/
    - apps/ios/docs/
ownership_review:
  required: true
  reviewer: Design Lead Agent and Development Lead Agent
depends_on:
  - T-20260812-002
blocks: []
parallel_group: private-figma-portfolio-rebaseline
allowed_paths:
  - ".ai_project/tasks/backlog/T-20260812-004_rebaseline-private-figma-delivery-flow.md"
  - ".ai_project/tasks/backlog/T-20260811-002_pop-kitsch-home-concept-source-design.md"
  - ".ai_project/tasks/active/T-20260811-008_pop-kitsch-visual-fidelity-retouch.md"
  - ".ai_project/tasks/backlog/T-20260811-005_pop-kitsch-log-review-detail-prototype-design.md"
  - ".ai_project/tasks/backlog/T-20260811-006_pop-kitsch-player-info-error-prototype-design.md"
  - ".ai_project/tasks/backlog/T-20260811-007_pop-kitsch-prototype-integration-design-qa.md"
  - ".ai_project/tasks/backlog/T-20260812-003_private-figma-source-core-flow-design.md"
  - ".ai_project/tasks/active/T-20260805-008_ios-accessibility-visual-regression.md"
  - ".ai_project/tasks/active/T-20260812-001_ios-implementation-visual-design-qa.md"
  - ".ai_project/tasks/active/T-20260728-003_apply-figma-uiux-to-ios.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/product/task_board.md"
  - ".ai_project/teams/design/task_board.md"
  - ".ai_project/teams/development/task_board.md"
  - ".ai_project/teams/quality/task_board.md"
  - ".ai_project/source_of_truth.md"
  - "docs/product/CookLog_FIGMA_DELIVERY_FLOW.md"
  - ".ai_project/reports/T-20260812-004_rebaseline-private-figma-delivery-flow-report.md"
  - ".ai_project/qa/T-20260812-004_rebaseline-private-figma-delivery-flow-qa.md"
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_POP_KITSCH_UX_PLAN.md
  - ".ai_project/source_of_truth.md"
  - ".ai_project/tasks/active/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions.md"
  - ".ai_project/tasks/backlog/T-20260812-003_private-figma-source-core-flow-design.md"
  - ".ai_project/tasks/backlog/T-20260811-002_pop-kitsch-home-concept-source-design.md"
  - ".ai_project/tasks/active/T-20260811-008_pop-kitsch-visual-fidelity-retouch.md"
  - ".ai_project/tasks/backlog/T-20260811-005_pop-kitsch-log-review-detail-prototype-design.md"
  - ".ai_project/tasks/backlog/T-20260811-006_pop-kitsch-player-info-error-prototype-design.md"
  - ".ai_project/tasks/backlog/T-20260811-007_pop-kitsch-prototype-integration-design-qa.md"
  - ".ai_project/tasks/active/T-20260805-008_ios-accessibility-visual-regression.md"
  - ".ai_project/tasks/active/T-20260812-001_ios-implementation-visual-design-qa.md"
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (URL·파일 키·조직 식별자는 저장소에 기록하지 않음)"
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-12
updated_at: 2026-08-12
report_to: ".ai_project/reports/T-20260812-004_rebaseline-private-figma-delivery-flow-report.md"
qa_to: ".ai_project/qa/T-20260812-004_rebaseline-private-figma-delivery-flow-qa.md"
status_ref: origin/develop
status_ref_sha: 43a6d3d93ef8b0dbee202976dacd659a6d321200
base_ref: origin/develop
base_sha: 43a6d3d93ef8b0dbee202976dacd659a6d321200
branch:
  name:
  base: develop
pr:
  url:
  status:
blocker: T-20260812-002가 Product QA 검증과 완료 확정을 마치기 전에는 재정렬 실행을 시작하지 않는다.
next_decision: Product Owner가 T-002 완료 뒤 재정렬 실행 범위와 기존 Task 상태 변경 패키지를 승인한다.
---

# 비공개 Figma 원천 전환 기반 Task 흐름·의존성 재정렬

## Goal

기존 로컬 Prototype 중심 디자인·iOS 검증 체인과 비공개 Figma 원천 전환 체인을 하나의 실행 흐름으로 재정렬한다. 컨셉 시안, 제품 UX 기획, 화면 디자인, iOS 구현, 기능·접근성 QA, Visual Fidelity QA의 책임과 선후 조건을 명확히 해 중복 작업과 기준 불일치를 막는다.

## Scope

- 모든 활성·제안 디자인/기획/iOS Task를 `유지`, `재범위화`, `보류`, `상위 Task로 흡수`, `종료 후보`로 분류하고 근거를 남긴다.
- `T-20260811-002`, `T-20260811-008`, `T-20260811-005~007`, `T-20260812-003`, `T-20260805-008`, `T-20260812-001`, 상위 iOS `T-20260728-003`의 책임·의존성·완료 게이트를 하나의 그래프로 재정의한다.
- 비공개 Figma 핵심 흐름 완성 → Product Owner 시각 승인 → Design QA → Figma baseline 고정 → iOS 일괄 동기화 → iOS 기능/접근성 QA → Visual Fidelity QA 순서를 확정한다.
- 기존 iOS 화면 구현 T-20260805-003~007은 재구현 대상이 아니라 Legacy 기능 baseline으로 분류한다. 변경된 Figma 핵심 흐름을 기준으로 필요한 구현 동기화 범위만 새로 정의한다.
- `390×844pt`를 기본 디자인 기준으로 고정하고, `375×667pt`는 구현 위험 또는 저비용 대응이 확인될 때만 별도 범위로 제안한다.
- Backend `T-20260810-006`의 독립 진행 가능 여부와 iOS UI 작업의 대기 조건을 분리한다.
- Source of Truth, Task Board, 팀 Board, 제품 전달 흐름 문서가 같은 우선순위와 Legacy 처리 원칙을 설명하도록 갱신안을 만든다.

## Out of Scope

- 비공개 Figma 파일의 직접 수정, iOS·Backend 구현, 기존 Prototype 화면의 추가 리터치
- Product Owner 승인 없이 기존 Task의 priority·status·depends_on·blocks를 실제 변경하거나 취소하는 일
- 완료된 iOS 기능 Task를 근거 없이 재오픈하거나, 신규 기능을 이번 조율 Task에서 구현하는 일
- Figma URL·파일 키·조직·팀·초대 대상 등 외부 작업공간 식별자를 저장소에 기록하는 일

## Acceptance Criteria

1. `docs/product/CookLog_FIGMA_DELIVERY_FLOW.md`에 현재 Task 인벤토리, 유지/재범위화/보류/흡수/종료 후보 분류, 근거, owner, 실행 순서가 기록된다.
2. 컨셉 시안·방향 결정은 실행 화면 디자인과 구분되고, 이미 선택된 팝 키치 방향을 다시 후보 비교 대상으로 되돌리지 않는다.
3. T-003의 비공개 Figma 실행 전제와 기존 T-008·T-005~007의 처리 방안이 명확하며, 기존 Task를 자동 중단하지 않는다는 경계가 기록된다.
4. Figma baseline 이후 iOS 구현 동기화, iOS 기능/접근성 QA, Visual Fidelity QA, 상위 iOS 완료 리뷰의 순서와 각각의 시작 조건이 명확하다.
5. 기존 로컬 Prototype·Manifest·handoff의 Legacy/Baseline 역할과 Figma 우선 전환 시점이 Source of Truth에 모순 없이 반영된다.
6. Backend 독립 작업과 iOS UI 의존 작업이 구분되어 불필요한 전체 개발 중단이 발생하지 않는다.
7. Design Lead·Development Lead·Product QA가 각각 scope, 구현 기준, 독립 검증 관점에서 검토할 수 있는 handoff와 승인 필요 Task 변경 패키지가 준비된다.

## Execution Rules

- T-20260812-002는 Product QA와 Completion Role의 독립 상태 전이를 먼저 마쳐야 한다.
- 이 Task는 Product Lead가 조율하고, 실제 기존 Task 상태·의존성·우선순위 변경안은 Product Owner가 한 번에 검토·승인한다.
- Design Lead는 승인된 재정렬안으로 T-003과 화면군 Task를 scoped로 조율한다. UI/UX Design Agent는 Product Owner의 별도 실행 승인 전 Figma를 수정하지 않는다.
- Development Lead는 고정 Figma baseline과 구현 동기화 범위가 확정되기 전 iOS UI 최종 통합·시각 QA를 재개하지 않는다.
- Backend의 독립 Task는 제품 범위·배포 gate에 영향을 주지 않는 한 별도 흐름으로 유지한다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 Product Lead Agent / Lead Role이야.
Task T-20260812-004는 비공개 Figma 원천 전환에 맞춰 CookLog의 컨셉·기획·디자인·iOS·QA Task 흐름을 재정렬하는 P0 조율 Task야.

- 현재 상태: proposed
- 선행 조건: T-20260812-002의 Product QA 검증과 완료 확정
- 다음에 해야 할 일: Task 인벤토리를 유지/재범위화/보류/흡수/종료 후보로 분류하고, Figma 핵심 흐름 → 승인·Design QA → Figma baseline → iOS 일괄 동기화 → iOS QA → Visual QA의 canonical 의존성 그래프와 승인 패키지를 만들어줘.
- 기준 문서: PRD, User Flow, 팝 키치 UX 계획, T-002·T-003, 기존 컨셉/디자인/iOS QA Task, Source of Truth.
- 보안: Figma URL·파일 키·조직·팀·초대 대상은 저장소·보고서에 기록하지 마. 비공개 파일만 작업 대상으로 유지해.
- 주의: T-20260811-008, T-20260811-005~007, T-20260805-008, T-20260812-001, 상위 iOS T-20260728-003의 상태·우선순위를 자동 변경하거나 완료 Task를 재오픈하지 마. 변경 패키지는 Product Owner 승인으로만 반영해.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-12 | Product Lead Agent |  | proposed | 비공개 Figma 원천 전환에 맞춘 컨셉·기획·디자인·iOS·QA Task 흐름 및 의존성 재정렬 Task 등록 |
