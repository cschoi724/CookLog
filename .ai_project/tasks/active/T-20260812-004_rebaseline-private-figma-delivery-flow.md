---
schema: aiops.task.v1
id: T-20260812-004
title: 비공개 Figma 원천 전환 기반 Task 흐름·의존성 재정렬
status: verification_ready
type: feature
priority: P0
priority_reason: 기존 로컬 Prototype 중심 디자인·iOS 검증 체인과 새 비공개 Figma 원천 체인을 정렬하지 않으면 디자인·구현이
  다시 분기되고, P0 iOS 통합 검증의 재개 기준도 고정할 수 없다.
org_unit: Product Division
team: Product Team
team_lead: Product Lead Agent
workflow: feature
target_agent: Product QA Agent
target_role: Verification Role
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
  - ".ai_project/tasks/active/T-20260812-004_rebaseline-private-figma-delivery-flow.md"
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
blocks:
- T-20260812-003
parallel_group: private-figma-portfolio-rebaseline
allowed_paths:
- ".ai_project/tasks/active/T-20260812-004_rebaseline-private-figma-delivery-flow.md"
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
- docs/product/CookLog_FIGMA_DELIVERY_FLOW.md
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
- Product Owner가 지정한 비공개 Draft Figma 파일 (URL·파일 키·조직 식별자는 저장소에 기록하지 않음)
created_by: Product Lead Agent
approved_by: Product Owner (2026-08-12, T-003 중심 재정렬 패키지 일괄 실행 승인; 2026-08-13, Product
  QA 필수 3건 재작업 실행 승인)
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-12
updated_at: '2026-08-13'
report_to: ".ai_project/reports/T-20260812-004_rebaseline-private-figma-delivery-flow-report.md"
qa_to: ".ai_project/qa/T-20260812-004_rebaseline-private-figma-delivery-flow-qa.md"
status_ref: origin/develop
status_ref_sha: 7135d773422192d3075d725d7291a8ff00e0552a
worktree_path: "/private/tmp/cooklog-t20260812-004-rework-apply"
worktree_role: Execution Role
base_ref: origin/develop
base_sha: 7135d773422192d3075d725d7291a8ff00e0552a
branch:
  name: task/T-20260812-004-rework-apply
  base: develop
pr:
  url:
  status:
blocker:
next_decision: Product QA Agent가 세 필수 결함의 해소 여부와 보존 경계를 독립 재검증한다.
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

## 승인안 실행 결과

T-20260812-002가 `done`되어 선행 차단이 해제된 뒤 Product Owner가 재정렬 패키지를 승인했고, 아래 결과가 canonical에 반영됐다. 표의 실행 전 상태는 승인 판단 당시의 이력이며, 적용 결과가 현재 운영 기준이다.

| 대상 | 실행 전 상태 | 적용 결과 | 현재 운영 기준 |
|---|---|---|---|
| `T-20260812-003` 비공개 Figma 원천 구축 | `proposed` | **주 실행 Task로 유지·재범위화** | `proposed`; T-004 `done` 후 Design Lead scope와 Product Owner의 별도 Figma 실행 승인을 거친다. |
| `T-20260811-002` 팝 키치 컨셉 원본 발전 | `scoped` | **T-003에 흡수·종료** | `cancelled`; 선택된 팝 키치 방향과 시안은 Legacy/Baseline 입력으로 보존한다. |
| `T-20260811-008` Home Visual Fidelity | `approved` | **T-003에 흡수·종료** | `cancelled`; Prototype 결과와 미병합 WIP를 Legacy/Baseline으로 보존한다. |
| `T-20260811-005` Log·Review·Detail | `proposed` | **T-003에 흡수·종료** | `cancelled`; 화면·상태 계약을 T-003의 Figma 핵심 흐름 설계 입력으로 이전한다. |
| `T-20260811-006` Player·Info·오류 | `proposed` | **T-003에 흡수·종료** | `cancelled`; 화면·상태·복구 계약을 T-003의 Figma 핵심 흐름 설계 입력으로 이전한다. |
| `T-20260811-007` Prototype 통합 Design QA | `proposed` | **T-003 독립 Design QA로 흡수·종료** | `cancelled`; 독립 QA 책임을 T-003의 비공개 Figma 전체 흐름 검증으로 이전한다. |
| `T-20260805-008` iOS 기능·기술 접근성 QA | `blocked` | **유지·재범위화** | `blocked`; T-003 Figma baseline 고정 후 390×844pt 전체 기준과 375×667pt 위험 표본으로 재개한다. |
| `T-20260812-001` iOS Visual Fidelity Design QA | `scoped` | **유지·재범위화** | `scoped`; T-003과 T-20260805-008 완료 후 고정 Figma baseline과 고정 iOS commit을 비교한다. |
| `T-20260728-003` 상위 iOS 적용 | `scoped` | **유지·의존성 교체** | `scoped`; T-003 → T-20260805-008 → T-20260812-001 완료를 최종 게이트로 사용한다. |
| Backend 독립 Task | 개별 상태 유지 | **현행 유지** | UI/Figma 대기와 분리해 진행하며 제품 범위·배포 gate 충돌이 있을 때만 별도 조율한다. |

### Canonical 실행 순서와 현재 위치

1. **완료**: T-004 실행으로 위 Task 분류·의존성·Source of Truth 변경을 한 번에 반영했다.
2. **현재**: T-004의 Product QA 재검증과 완료 확정을 진행한다.
3. **대기**: T-004가 `done`이면 Design Lead가 T-003을 scoped로 조율하고 Product Owner가 Figma 실행을 별도 승인한다.
4. **대기**: UI/UX Design Agent가 지정된 비공개 Draft 파일에서 CookLog 로컬 Foundations·Components와 전체 핵심 흐름을 완성한다.
5. **대기**: Product Owner 시각 승인과 Design QA 통과 후 Figma baseline을 고정한다.
6. **대기**: Development Lead가 변경된 Figma 기준 iOS 일괄 동기화 범위를 확정하고 구현·기능·기술 접근성 QA를 재개한다.
7. **대기**: Design QA가 고정 Figma와 고정 iOS commit의 Visual Fidelity를 검증한다.
8. **대기**: 상위 iOS Task의 완료 리뷰를 진행한다.

### 변경 금지와 보존 기준

- 비공개 Figma URL·파일 키·팀·조직·초대 대상은 저장소에 기록하지 않는다.
- 회사 Library·Variables·폰트·자산을 연결하지 않고 CookLog 전용 로컬 자산만 사용한다.
- 기존 Prototype·Manifest·handoff, 완료 산출물, T-008 미병합 WIP는 삭제하거나 덮어쓰지 않고 `Legacy/Baseline`으로 보존한다.
- T-003은 T-004 `done` 전 시작하지 않는다. T-008·T-005~007은 `cancelled` 상태로 재개하지 않으며, iOS UI 동기화는 T-003 Figma baseline 고정 전 시작하지 않는다.

## Out of Scope

- 비공개 Figma 파일의 직접 수정, iOS·Backend 구현, 기존 Prototype 화면의 추가 리터치
- Product Owner 승인 없이 기존 Task의 priority·status·depends_on·blocks를 실제 변경하거나 취소하는 일
- 완료된 iOS 기능 Task를 근거 없이 재오픈하거나, 신규 기능을 이번 조율 Task에서 구현하는 일
- Figma URL·파일 키·조직·팀·초대 대상 등 외부 작업공간 식별자를 저장소에 기록하는 일

## Acceptance Criteria

1. `docs/product/CookLog_FIGMA_DELIVERY_FLOW.md`에 현재 Task 인벤토리, 유지/재범위화/보류/흡수/종료 후보 분류, 근거, owner, 실행 순서가 기록된다.
2. 컨셉 시안·방향 결정은 실행 화면 디자인과 구분되고, 이미 선택된 팝 키치 방향을 다시 후보 비교 대상으로 되돌리지 않는다.
3. T-003의 비공개 Figma 실행 전제와 Product Owner 승인으로 `cancelled`·흡수된 T-008·T-005~007의 현재 상태 및 Legacy/Baseline 보존 경계가 기록된다.
4. Figma baseline 이후 iOS 구현 동기화, iOS 기능/접근성 QA, Visual Fidelity QA, 상위 iOS 완료 리뷰의 순서와 각각의 시작 조건이 명확하다.
5. 기존 로컬 Prototype·Manifest·handoff의 Legacy/Baseline 역할과 Figma 우선 전환 시점이 Source of Truth에 모순 없이 반영된다.
6. Backend 독립 작업과 iOS UI 의존 작업이 구분되어 불필요한 전체 개발 중단이 발생하지 않는다.
7. Design Lead·Development Lead·Product QA가 각각 scope, 구현 기준, 독립 검증 관점에서 검토할 수 있는 handoff와 승인 필요 Task 변경 패키지가 준비된다.

## Execution Rules

- T-20260812-002는 Product QA와 Completion Role의 독립 상태 전이를 마쳐 `done`이다.
- 이 Task는 Product Lead가 조율했고, 기존 Task 상태·의존성·우선순위 변경안은 Product Owner가 일괄 승인한 뒤 canonical에 반영됐다.
- Design Lead는 승인된 재정렬안으로 T-003과 화면군 Task를 scoped로 조율한다. UI/UX Design Agent는 Product Owner의 별도 실행 승인 전 Figma를 수정하지 않는다.
- Development Lead는 고정 Figma baseline과 구현 동기화 범위가 확정되기 전 iOS UI 최종 통합·시각 QA를 재개하지 않는다.
- Backend의 독립 Task는 제품 범위·배포 gate에 영향을 주지 않는 한 별도 흐름으로 유지한다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 Product QA Agent / Verification Role이야.
Task T-20260812-004의 재작업 결과를 독립 재검증해줘.

- 현재 상태: verification_ready
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 7135d773422192d3075d725d7291a8ff00e0552a
- 다음에 해야 할 일: PQA-HIGH-813004-001, PQA-MEDIUM-813004-002, PQA-LOW-813004-003의 해소 여부와 기존 보존 경계를 독립 검증해줘.
- 검증 대상: T-003 Handoff의 T-004 `done` 선행 조건, T-004의 실행 전/적용 결과 구분, 실행 보고서와 전달 흐름 문서의 후행 공백 제거 및 검증 증거.
- 보존 사항: 승인된 재정렬 그래프, 취소 Task와 Legacy/WIP, Backend 독립 흐름, 비공개 식별자 비기록 원칙은 유지해.
- 참고 산출물: docs/product/CookLog_FIGMA_DELIVERY_FLOW.md, .ai_project/reports/T-20260812-004_rebaseline-private-figma-delivery-flow-report.md, .ai_project/qa/T-20260812-004_rebaseline-private-figma-delivery-flow-qa.md
- 통과 시: `verification_passed`로 전환하고 Product Lead Agent / Completion Role에 인계해줘.
- 실패 시: `rework_requested`로 전환하고 남은 결함을 명확히 기록해줘.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-12 | Product Lead Agent |  | proposed | 비공개 Figma 원천 전환에 맞춘 컨셉·기획·디자인·iOS·QA Task 흐름 및 의존성 재정렬 Task 등록 |
| 2026-08-12 | Product Lead Agent | proposed | scoped | T-002 완료를 확인하고 T-003 중심의 기존 디자인·iOS·QA Task 분류와 실행 순서를 승인 패키지로 확정 |
| 2026-08-12 | Product Owner | scoped | approved | T-003 중심 재정렬 패키지와 기존 Task 상태·의존성 변경의 일괄 실행 승인 |
| 2026-08-12 | Product Planning Agent | approved | in_progress | 승인된 Task·Source of Truth·팀 보드·Figma 전달 흐름 일괄 재정렬 착수 |
| 2026-08-12 | Product Planning Agent | in_progress | verification_ready | 재정렬·Legacy 보존·비공개 운영 경계·실행 보고 반영 완료, Product QA 독립 검증 인계 |
| 2026-08-13 | Product QA Agent | verification_in_progress | rework_requested | T-003 Handoff·T-004 현재 결과·diff 검증 증거의 정합성 보완 요청 |
| 2026-08-13 | Product Owner | rework_requested | approved | Product QA 필수 수정 3건의 문서 정합성 재작업 실행 승인 |
| 2026-08-13 | Product Planning Agent | approved | in_progress | 승인된 Product QA 필수 수정 3건의 문서 정합성 재작업 착수 |
| 2026-08-13 | Product Planning Agent | in_progress | verification_ready | 필수 수정 3건과 관련 Task strict 검증·diff 검증 완료, Product QA 재검증 인계 |

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-08-12 | Product Lead Agent | transition: proposed -> scoped | T-20260812-002 완료를 확인하고 비공개 Figma 중심의 기존 컨셉·Prototype·iOS·QA Task 유지·흡수·재범위화·종료 후보와 canonical 실행 순서를 승인 패키지로 확정한다. |
| 2026-08-12 | Product Lead Agent | transition: scoped -> approved | Product Owner가 T-003 중심 재정렬 패키지와 기존 컨셉·Prototype·iOS·QA Task 상태·의존성 변경의 일괄 실행을 승인했다. |
| 2026-08-12 | Product Planning Agent | lock | task lock |
| 2026-08-12 | Product Planning Agent | transition: approved -> in_progress | 승인된 T-003 중심 재정렬 패키지에 따라 기존 디자인·iOS·QA Task, Source of Truth, 팀 보드와 전달 흐름의 일괄 반영을 시작한다. |
| 2026-08-12 | Product Planning Agent | transition: in_progress -> verification_ready | 승인된 T-003 중심 Task 분류·의존성, 비공개 Figma 전달 흐름, Source of Truth와 Product·Design·Development·Quality 보드의 일괄 재정렬을 완료했다. |
| 2026-08-13 | Product QA Agent | lock | task lock |
| 2026-08-13 | Product QA Agent | transition: verification_ready -> verification_in_progress | 재정렬 Task·Source of Truth·팀 보드·전달 흐름 독립 검증 착수 |
| 2026-08-13 | Product QA Agent | lock | task lock |
| 2026-08-13 | Product QA Agent | transition: verification_in_progress -> rework_requested | T-003 Handoff가 T-004 dependency·취소 결과와 충돌하고 T-004 본문이 실행 전 승인안과 실행 결과를 혼재함 |
| 2026-08-13 | Product Owner | transition: rework_requested -> approved | Product QA FAIL의 필수 수정 PQA-HIGH-813004-001, PQA-MEDIUM-813004-002, PQA-LOW-813004-003 문서 정합성 재작업 실행 승인 |
| 2026-08-13 | Product Planning Agent | lock | task lock |
| 2026-08-13 | Product Planning Agent | transition: approved -> in_progress | 승인된 PQA-HIGH-813004-001, PQA-MEDIUM-813004-002, PQA-LOW-813004-003 문서 정합성 재작업 착수 |
| 2026-08-13 | Product Planning Agent | transition: in_progress -> verification_ready | Product QA 필수 3건 수정, 관련 Task 10개 strict validation 및 git diff --check PASS |
| 2026-08-13 | Product Planning Agent | unlock | task unlock |
