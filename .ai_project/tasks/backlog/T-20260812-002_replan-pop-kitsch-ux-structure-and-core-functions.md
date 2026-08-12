---
schema: aiops.task.v1
id: T-20260812-002
title: 팝 키치 레시피 클럽 UX 구조·핵심 기능 재기획
status: proposed
type: feature
priority: P1
priority_reason: 확정된 팝 키치 시각 언어를 실제 사용 흐름과 정보 구조에 연결해야 이후 화면군 디자인이 장식 변경에 머물지 않는다. 이미 완료된 Foundation·Home/Library 결과는 보존하며 P0 iOS·Backend 작업을 중단하지 않는다.
org_unit: Product Division
team: Product Team
team_lead: Product Lead Agent
workflow: feature
target_agent: Product Lead Agent
target_role: Direction Role
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
    - .ai_project/tasks/backlog/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions.md
    - .ai_project/task_board.md
    - .ai_project/teams/product/task_board.md
    - docs/product/CookLog_POP_KITSCH_UX_PLAN.md
  domains:
    - product-ux-architecture
    - core-cooking-flow
    - feature-composition
  documents:
    - docs/product/
    - design/prototype/
ownership_review:
  required: false
  reviewer:
depends_on: []
blocks:
  - T-20260811-005
  - T-20260811-006
  - T-20260811-007
parallel_group: pop-kitsch-product-ux-planning
allowed_paths:
  - .ai_project/tasks/backlog/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions.md
  - .ai_project/task_board.md
  - .ai_project/teams/product/task_board.md
  - docs/product/CookLog_POP_KITSCH_UX_PLAN.md
  - .ai_project/reports/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions-report.md
  - .ai_project/qa/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions-qa.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
  - .ai_project/tasks/backlog/T-20260811-002_pop-kitsch-home-concept-source-design.md
  - .ai_project/tasks/active/T-20260811-004_pop-kitsch-home-library-prototype-design.md
  - .ai_project/tasks/active/T-20260811-008_pop-kitsch-visual-fidelity-retouch.md
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-12
updated_at: 2026-08-12
report_to: .ai_project/reports/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions-report.md
qa_to: .ai_project/qa/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions-qa.md
status_ref: origin/develop
status_ref_sha: aa795aa923da03c52725fe8cdf6ae2b41827e20d
worktree_path: /private/tmp/cooklog-t20260812-002-ux-planning
worktree_role: Direction Role
base_ref: origin/develop
base_sha: aa795aa923da03c52725fe8cdf6ae2b41827e20d
branch:
  name: task/T-20260812-002-pop-kitsch-ux-planning
  base: develop
pr:
  url:
  status:
---

# 팝 키치 레시피 클럽 UX 구조·핵심 기능 재기획

## Scope

- Goal: `팝 키치 레시피 클럽`을 단순 시각 스타일이 아닌, 자취생이 빠르게 기록하고 다시 요리하도록 돕는 정보 구조·화면 구성·핵심 기능 우선순위로 구체화한다.
- In scope:
  - Home, Library, Cooking Log, AI Review, Recipe Detail, Audio Guide, App Info의 역할과 화면 간 정보·행동 우선순위를 재정의한다.
  - 핵심 여정 `오늘 뭐 먹지 → 기록 시작 → AI 정리 → 레시피 저장 → 다시 요리`와 각 단계의 진입·이탈·복구 방식을 정리한다.
  - 각 화면에서 반드시 보여줄 정보, 숨기거나 후순위로 둘 정보, 주 행동 CTA와 보조 행동을 결정한다.
  - 기존 기능을 유지·축소·재구성·신규 후보로 분류하고, 신규 후보는 구현 요구사항이 아닌 후속 Product Task 후보로만 기록한다.
  - 390×844pt 기본과 375×667pt 작은 화면을 기준으로 핵심 화면군의 저충실도 레이아웃·콘텐츠 우선순위·카피 밀도 원칙을 문서화한다.
  - 완료된 T-004와 진행 가능한 T-008은 현재 산출물로 보존하고, 재기획 결과가 Home 기능/구조 변경을 요구할 때만 별도 재작업 후보를 만든다.
- Out of scope:
  - Prototype, iOS, Backend의 직접 수정과 외부 자산·폰트 도입
  - 승인 없이 기존 기능·routing·데이터 모델을 변경하거나 완료 Task를 재오픈하는 일
  - 기능 후보를 이번 Task에서 구현 승인으로 간주하는 일
- Acceptance criteria:
  - `docs/product/CookLog_POP_KITSCH_UX_PLAN.md`에 화면 구조, 핵심 사용자 여정, 화면별 기능·정보·CTA 우선순위, 유지/축소/재구성/후보 기능 분류가 기록된다.
  - 자취생의 빠른 기록과 레시피 재사용을 기준으로 Home부터 Player까지의 흐름이 한 장의 정보 구조로 설명된다.
  - 390×844pt·375×667pt에서의 레이아웃 원칙, 긴 설명 축소와 용어 단순화 원칙이 화면군별로 명시된다.
  - 기존 T-005~007에 필요한 의존성·재범위 여부와 T-008에 영향을 줄 수 있는 Home 변경 후보를 분리해 Design Lead와 Product Owner가 판단할 수 있다.

## Execution

- Allowed paths: Task frontmatter의 `allowed_paths`만 사용한다.
- Source of truth: PRD·User Flow·공식 Prototype·iOS 인수 기준·T-002 방향·T-004 완료본·T-008 승인 범위를 함께 검토한다.
- Dependencies: 없음. 다만 T-008은 승인된 별도 시각 리터치 Task이므로 이 Task가 자동 중단·변경하지 않는다.
- Validation required: Product QA가 제품 문서와 기존 상태·기능 계약의 모순, 화면별 우선순위 누락, 승인되지 않은 기능 확장을 독립 검토한다.

이 Task는 Product Owner 승인 후 Product Planning Agent가 실행한다. 이후 Design Lead Agent가 자신의 Team 소유 T-005~007의 dependency와 scope를 이 기획 결과에 맞춰 조정한다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 Product Lead Agent / Direction Role이야.
Task T-20260812-002를 이어서 처리해줘.

- 현재 상태: proposed
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: aa795aa923da03c52725fe8cdf6ae2b41827e20d
- 다음에 해야 할 일: Product Owner와 함께 UX 구조·핵심 기능 재기획 범위를 확인하고, 실행 승인 시 Product Planning Agent에게 제품 UX 기획 문서 작성을 인계해줘.
- 기준 문서: docs/product/CookLog_PRD_v2.md, docs/product/CookLog_USER_FLOW.md, design/prototype/, design/COOKLOG_MVP_UIUX_V1_HANDOFF.md, design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md, T-002, T-004, T-008
- 허용 경로: .ai_project/tasks/backlog/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions.md, .ai_project/task_board.md, .ai_project/teams/product/task_board.md, docs/product/CookLog_POP_KITSCH_UX_PLAN.md, .ai_project/reports/, .ai_project/qa/
- 참고 산출물: design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png, T-004 완료본, T-008 승인 범위
- 변경/검토 대상: Home, Library, Cooking Log, AI Review, Recipe Detail, Audio Guide, App Info의 정보 구조·핵심 기능·CTA 우선순위
- 남은 리스크: T-008은 별도 승인된 시각 리터치 Task다. 이 Task가 T-008을 자동 중단하지 않으며, Home 구조 변경은 기획 결과 후 별도 판단이 필요하다.
- 차단/결정 필요: Product Owner의 실행 승인과, 실행 완료 후 Design Lead의 T-005~007 scope·dependency 조정이 필요하다.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-12 | Product Lead Agent |  | proposed | 팝 키치 컨셉을 레이아웃·정보 구조·핵심 기능 우선순위까지 재기획하기 위한 Product Task 등록 |
