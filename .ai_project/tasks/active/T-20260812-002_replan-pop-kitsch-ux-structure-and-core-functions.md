---
schema: aiops.task.v1
id: T-20260812-002
title: 팝 키치 레시피 클럽 UX 구조·핵심 기능 재기획
status: approved
type: feature
priority: P1
priority_reason: 확정된 팝 키치 시각 언어를 실제 사용 흐름과 정보 구조에 연결해야 이후 화면군 디자인이 장식 변경에 머물지 않는다.
  이미 완료된 Foundation·Home/Library 결과는 보존하며 P0 iOS·Backend 작업을 중단하지 않는다.
org_unit: Product Division
team: Product Team
team_lead: Product Lead Agent
workflow: feature
target_agent: Product Planning Agent
target_role: Execution Role
planned_execution_agent: Product Planning Agent
planned_execution_role: Execution Role
required_capabilities:
- product_direction
- product_strategy
- ux_information_architecture
- user_flow_design
- functional_scope_definition
- product_dependency_management
ownership:
  paths:
  - ".ai_project/tasks/active/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/product/task_board.md"
  - docs/product/CookLog_POP_KITSCH_UX_PLAN.md
  domains:
  - product-ux-architecture
  - core-cooking-flow
  - feature-composition
  documents:
  - docs/product/
  - design/prototype/
ownership_review:
  required: true
  reviewer: Product QA Agent
depends_on: []
blocks:
- T-20260811-005
- T-20260811-006
- T-20260811-007
parallel_group: pop-kitsch-product-ux-planning
allowed_paths:
- ".ai_project/tasks/active/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions.md"
- ".ai_project/task_board.md"
- ".ai_project/teams/product/task_board.md"
- docs/product/CookLog_POP_KITSCH_UX_PLAN.md
- ".ai_project/reports/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions-report.md"
- ".ai_project/qa/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions-qa.md"
source_of_truth:
- docs/product/CookLog_PRD_v2.md
- docs/product/CookLog_USER_FLOW.md
- design/prototype/
- design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
- design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
- ".ai_project/tasks/backlog/T-20260811-002_pop-kitsch-home-concept-source-design.md"
- ".ai_project/tasks/active/T-20260811-004_pop-kitsch-home-library-prototype-design.md"
- ".ai_project/tasks/active/T-20260811-008_pop-kitsch-visual-fidelity-retouch.md"
created_by: Product Lead Agent
approved_by: Product Owner (2026-08-12, PQA 재작업 범위·Product Planning 실행 승인)
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-12
updated_at: '2026-08-12'
report_to: ".ai_project/reports/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions-report.md"
qa_to: ".ai_project/qa/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions-qa.md"
status_ref: origin/develop
status_ref_sha: 3877105d8eb814a31bedd800f810c5402a9d1b0d
worktree_path: "/private/tmp/cooklog-t20260812-002-rework-scope"
worktree_role: Lead Role
base_ref: origin/develop
base_sha: 3877105d8eb814a31bedd800f810c5402a9d1b0d
branch:
  name: task/T-20260812-002-rework-scope
  base: develop
pr:
  url:
  status:
blocker:
next_decision:
---

# 팝 키치 레시피 클럽 UX 구조·핵심 기능 재기획

## Scope

- Goal: `팝 키치 레시피 클럽`을 단순 시각 스타일이 아닌, 자취생이 빠르게 기록하고 다시 요리하도록 돕는 정보 구조·화면 구성·핵심 기능 우선순위로 구체화한다.
- In scope:
  - Home, Library, Cooking Log, AI Review, Recipe Detail, Audio Guide, App Info의 역할과 화면 간 정보·행동 우선순위를 재정의한다.
  - 현재 기능·상태·데이터 계약을 화면별로 목록화하고, 각 항목을 `유지`, `이동/재배치`, `축소`, `제거 후보`, `신규 후보`로 분류한다. 제거·신규 후보는 Product Owner 결정 전까지 구현하지 않는다.
  - 핵심 여정 `오늘 뭐 먹지 → 기록 시작 → AI 정리 → 레시피 저장 → 다시 요리`와 각 단계의 진입·이탈·복구 방식을 정리한다.
  - 각 화면에서 반드시 보여줄 정보, 숨기거나 후순위로 둘 정보, 주 행동 CTA와 보조 행동을 결정한다.
  - 기능 분류 결과를 바탕으로 화면별 정보 구조, 콘텐츠 블록 순서, 내비게이션, CTA·입력·피드백 상호작용을 저충실도 UX 레이아웃으로 설계한다.
  - 390×844pt를 핵심 화면군의 유일한 기본 레이아웃 기준으로 문서화한다. 375×667pt는 구현 위험이 확인되거나 저비용으로 해결 가능한 항목만 별도 후속 후보로 기록하며, 이번 재작업의 필수 화면별 명세·QA 게이트로 두지 않는다.
  - 공식 Prototype의 82개 상태·기능·데이터 보존·오류 회복 계약을 추적 가능한 결정표로 연결한다. 여러 상태를 하나의 결정으로 묶을 때에는 포함 상태 ID와 동일 결정의 근거를 명시한다.
  - Home의 전체 요리책 진입은 최근 요리 영역의 단일 텍스트 액션으로 고정하고, 헤더의 중복 진입점은 기본안에서 제외한다.
  - 완료된 T-004와 진행 가능한 T-008은 현재 산출물로 보존하고, 재기획 결과가 Home 기능/구조 변경을 요구할 때만 별도 재작업 후보를 만든다.
- Out of scope:
  - Prototype, iOS, Backend의 직접 수정과 외부 자산·폰트 도입
  - 승인 없이 기존 기능·routing·데이터 모델을 변경하거나 완료 Task를 재오픈하는 일
  - 기능 후보를 이번 Task에서 구현 승인으로 간주하는 일
- Acceptance criteria:
  - `docs/product/CookLog_POP_KITSCH_UX_PLAN.md`에 화면 구조, 핵심 사용자 여정, 화면별 기능·정보·CTA 우선순위, 유지/축소/재구성/후보 기능 분류가 기록된다.
  - 기존 기능별 결정표에 근거·영향 화면·기능/데이터 계약 영향·Product Owner 결정 필요 여부가 기록된다.
  - 자취생의 빠른 기록과 레시피 재사용을 기준으로 Home부터 Player까지의 흐름이 한 장의 정보 구조로 설명된다.
  - 82개 상태와 핵심 데이터·복구 계약이 상태 ID 또는 동등한 추적 키, 결정, 근거, 영향 화면, routing·기능·데이터 보존 영향, 오류 회복, Product Owner 결정 필요 여부로 추적된다.
  - 390×844pt에서의 화면별 콘텐츠 블록·레이아웃·CTA·상호작용 원칙과 긴 설명 축소·용어 단순화 원칙이 명시된다. 375×667pt는 이번 Task의 필수 수용 기준이 아니며, 확인된 구현 위험만 후속 후보로 분리한다.
  - T-008에 영향을 줄 수 있는 Home 변경 후보와, 실제 UI/UX 원본 반영 전에 필요한 Product Owner 결정을 분리한다.

## Execution

- Allowed paths: Task frontmatter의 `allowed_paths`만 사용한다.
- Source of truth: PRD·User Flow·공식 Prototype·iOS 인수 기준·T-002 방향·T-004 완료본·T-008 승인 범위를 함께 검토한다.
- Dependencies: 없음. 다만 T-008은 승인된 별도 시각 리터치 Task이므로 이 Task가 자동 중단·변경하지 않는다.
- Validation required: Product QA가 82개 상태·데이터/복구 계약의 결정표 추적성, 390×844pt 화면별 우선순위·레이아웃·상호작용, Home 단일 전체 보기 baseline, 승인되지 않은 기능 확장을 독립 검토한다. 375×667pt의 전체 화면 명세 누락은 이번 재작업 FAIL 항목으로 보지 않는다.

Product Owner는 Product QA 재작업 중 375×667pt를 기본 완료 조건에서 제외하고, 82개 상태 계약 결정표와 Home 단일 전체 보기 baseline만을 필수 보완 범위로 승인했다. Product Planning Agent는 이 범위 안에서만 재작업하며, 이후 Design Lead Agent가 자신의 Team 소유 T-005~007의 dependency와 scope를 이 기획 결과에 맞춰 조정한다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 Product Planning Agent / Execution Role이야.
Task T-20260812-002의 승인된 재작업을 수행해줘.

- 현재 상태: approved
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 3877105d8eb814a31bedd800f810c5402a9d1b0d
- 다음에 해야 할 일: PQA-HIGH-812002-001과 PQA-MEDIUM-812002-003을 해소하도록 82개 상태·데이터/복구 계약 결정표와 Home 전체 보기 단일 baseline을 UX 계획에 보완해줘.
- 기준 문서: docs/product/CookLog_PRD_v2.md, docs/product/CookLog_USER_FLOW.md, design/prototype/, design/COOKLOG_MVP_UIUX_V1_HANDOFF.md, design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md, T-002, T-004, T-008
- 허용 경로: .ai_project/tasks/active/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions.md, .ai_project/task_board.md, .ai_project/teams/product/task_board.md, docs/product/CookLog_POP_KITSCH_UX_PLAN.md, .ai_project/reports/, .ai_project/qa/
- 참고 산출물: docs/product/CookLog_POP_KITSCH_UX_PLAN.md, .ai_project/reports/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions-report.md, .ai_project/qa/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions-qa.md
- 변경/검토 대상: 기존 기능 결정표, 82개 상태·데이터/복구 계약 추적표, 7개 화면의 390×844 명세와 Home 전체 보기 기준안
- 남은 리스크: T-008은 별도 승인 범위에서 계속 진행하며 자동 중단하지 않는다. T-005~007은 재작업·재검증 전 이 문서를 최종 scope 기준으로 확정하지 않는다.
- 차단/결정 필요: 375×667pt 전체 화면 명세는 기본 범위에서 제외한다. 구현 위험이 확인될 때만 별도 Task 후보로 제안해.
- 완료 시: 실행 보고서를 갱신하고 Product QA Agent에게 verification_ready로 인계해.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-12 | Product Lead Agent |  | proposed | 팝 키치 컨셉을 레이아웃·정보 구조·핵심 기능 우선순위까지 재기획하기 위한 Product Task 등록 |
| 2026-08-12 | Product Lead Agent | proposed | scoped | 제품 UX 재기획의 소유권·산출물·기준 문서·후속 Design 인계 조건을 확정 |
| 2026-08-12 | Product Lead Agent | scoped | approved | Product Owner가 기능 분류·UX 구조·레이아웃·상호작용·Design handoff 문서 작성을 실행 승인 |
| 2026-08-12 | Product Lead Agent | rework_requested | scoped | Product QA FAIL을 82개 상태·데이터/복구 계약 결정표와 Home 단일 전체 보기 baseline 보완으로 재범위화 |
| 2026-08-12 | Product Owner | scoped | approved | 375×667pt 기본 완료 조건 제외와 승인된 재작업 범위를 Product Planning Agent 실행으로 승인 |

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-08-12 | Product Lead Agent | transition: proposed -> scoped | 팝 키치 UX 재기획의 팀·소유권·산출물·허용 경로·기준 문서와 후속 Design 인계 조건을 조율해 범위를 확정한다. |
| 2026-08-12 | Product Lead Agent | transition: scoped -> approved | Product Owner가 기존 기능 분류, UX 구조·레이아웃·상호작용 설계와 Design handoff 문서 작성을 실행 승인했다. |
| 2026-08-12 | Product Planning Agent | lock | task lock |
| 2026-08-12 | Product Planning Agent | transition: approved -> in_progress | Product Owner가 Product Lead Agent에게 Product Planning 실행 역할을 함께 부여해 기존 기능 분류와 팝 키치 UX 구조 기획을 시작한다. |
| 2026-08-12 | Product Planning Agent | transition: in_progress -> verification_ready | 기존 기능 결정표, 화면별 UX 구조·레이아웃·상호작용·Design handoff와 실행 보고서 작성을 완료해 Product QA 독립 검증으로 인계한다. |
| 2026-08-12 | Product QA Agent | lock | task lock |
| 2026-08-12 | Product QA Agent | transition: verification_ready -> verification_in_progress | 실행 보고서와 UX 계획을 제품 Source of Truth 및 기존 기능·상태 계약에 대조하는 독립 검증 시작 |
| 2026-08-12 | Product QA Agent | transition: verification_in_progress -> rework_requested | 기존 82개 상태·데이터 계약 결정표와 Home 외 375×667 화면별 UX 명세가 성공 기준에 미달하고 Home 전체 보기 기준안이 모호함 |
| 2026-08-12 | Product QA Agent | unlock | task unlock |
| 2026-08-12 | Product Lead Agent | transition: rework_requested -> scoped | Product QA FAIL을 82개 상태·데이터/복구 계약 결정표와 Home 단일 전체 보기 baseline 보완으로 재범위화한다. 375×667pt 전체 화면 명세는 Product Owner 결정에 따라 기본 완료 조건에서 제외한다. |
| 2026-08-12 | Product Lead Agent | transition: scoped -> approved | Product Owner가 승인한 재작업 범위를 Product Planning Agent 실행으로 승인한다. |
