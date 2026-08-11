---
schema: aiops.task.v1
id: T-20260811-002
title: 팝 키치 레시피 클럽 홈 컨셉 확정 및 원본 기반 시안
status: proposed
type: feature
priority: P1
priority_reason: 홈 화면의 시각 방향을 먼저 확정해야 후속 UX 개선과 디자인·iOS 반영이 일관되지만, 현재 P0 iOS·Backend 실행을 중단하지 않는다.
org_unit: Product Division
team: Product Team
team_lead: Product Lead Agent
workflow: feature
target_agent: Product Lead Agent
target_role: Direction Role
required_capabilities:
  - product_direction
  - priority_management
  - product_scoping
  - product_dependency_management
ownership:
  paths:
    - .ai_project/tasks/backlog/T-20260811-002_pop-kitsch-home-concept-source-design.md
    - .ai_project/task_board.md
    - .ai_project/teams/product/task_board.md
    - design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png
  domains:
    - product-design-direction
    - home-experience
  documents:
    - design/prototype/
    - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
ownership_review:
  required: false
  reviewer:
depends_on: []
blocks: []
parallel_group: home-design-direction
allowed_paths:
  - .ai_project/tasks/
  - .ai_project/task_board.md
  - .ai_project/teams/product/task_board.md
  - .ai_project/reports/
  - .ai_project/qa/
  - design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-11
updated_at: 2026-08-11
report_to: .ai_project/reports/T-20260811-002_pop-kitsch-home-concept-source-design-report.md
qa_to: .ai_project/qa/T-20260811-002_pop-kitsch-home-concept-source-design-qa.md
status_ref: origin/develop
status_ref_sha: 42e1c8e
worktree_path: /private/tmp/cooklog-t20260811-002-home-concept
worktree_role: Direction Role
base_ref: origin/develop
base_sha: 42e1c8e
branch:
  name: task/T-20260811-002-pop-kitsch-home-concept
  base: develop
pr:
  url:
  status:
---

# 팝 키치 레시피 클럽 홈 컨셉 확정 및 원본 기반 시안

## Scope

- Goal: Product Owner가 선택한 `팝 키치 레시피 클럽`을 CookLog 홈 화면의 단일 디자인 방향으로 확정하고, 공식 UI Source of Truth인 `design/prototype/`를 기준으로 홈 화면 시안을 발전시킬 실행 범위를 정의한다.
- In scope:
  - 시각 방향을 팝 키치 레시피 클럽으로 고정한다: 크림 바탕, 토마토 레드 CTA, 버터 옐로·코발트 블루 포인트, 제한적인 스티커·라벨·낙서 디테일, 큼직하고 자신감 있는 타이포.
  - 홈 화면 한 장만 대상으로 한다: 브랜드 masthead, 빠른 요리 기록 CTA, 최근 레시피, 작고 비챗봇적인 AI 도우미 상태.
  - 같은 정보 구조에서 시각·계층·컴포넌트 표현을 발전시키되, 긴 안내 문단을 늘리지 않는다.
  - Design Lead가 별도 하위 Design Task를 scope할 때 필요한 홈 시안 산출물, 원본 경로, 반영 제외 범위, Design QA 기준을 정의한다.
  - 시안은 `design/prototype/`의 기존 Home 흐름·접근성·작은 화면 계약과 충돌하지 않아야 한다.
- Out of scope:
  - Home 외 화면, 전체 디자인 시스템, Figma 미러, iOS 구현 변경
  - 타깃 페르소나·브랜드 전략 재정의와 다른 컨셉의 병행 개발
  - AI chatbot UI, 과도한 SF 표현, 장식만을 위한 긴 카피
  - 진행 중인 P0 iOS·Backend Task의 priority·scope·status 변경
- Acceptance criteria:
  - 팝 키치 레시피 클럽이 이 Task의 유일한 홈 컨셉으로 기록된다.
  - 홈 시안은 빠른 기록 CTA, 최근 레시피, AI 상태를 한 화면에서 명확히 구분하며 긴 설명 없이 첫 행동을 이해할 수 있다.
  - 토마토 레드·버터 옐로·코발트 블루는 포인트로만 쓰고, 조리 기록의 가독성·44pt 터치 영역·Light/Dark 의미 토큰을 훼손하지 않는다.
  - 시안은 `design/prototype/`의 Home 상태와 390×844·375×667 viewport에서 검토 가능한 하위 Design Task로 분리된다.
  - 실제 원본 수정은 Design Lead scope, Product Owner 승인, UI/UX Design Agent 실행과 Design QA 독립 검증 뒤에만 시작한다.

## Execution

- Allowed paths: `.ai_project/tasks/`, `.ai_project/task_board.md`, `.ai_project/teams/product/task_board.md`, `.ai_project/reports/`, `.ai_project/qa/`
- Source of truth: `design/prototype/`이 공식 UI 원본이며, PRD·User Flow·iOS 디자인 인수 기준을 함께 따른다.
- Dependencies: 없음. 단, Design 원본 수정·iOS 구현은 이 상위 Task와 별도 하위 Task의 scope·승인이 필요하다.
- Validation required: 후속 Design Task에서 Design QA가 기존 Home 상태·작은 화면·명도 대비·터치 영역·카피 밀도를 독립 검증한다.

이 Task는 디자인 컨셉 선택과 홈 시안 실행 범위를 제품 차원에서 고정한다. 현재는 Product Direction 초안이며 Design 원본을 직접 수정하거나 iOS 구현을 시작하지 않는다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 Product Lead Agent / Direction Role이야.
Task T-20260811-002를 이어서 처리해줘.

- 현재 상태: proposed
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 42e1c8e
- 다음에 해야 할 일: 팝 키치 레시피 클럽 홈 방향을 Product Owner 결정으로 확인하고, Design Lead Agent가 하위 Design Task를 scope하도록 인계할 범위·우선순위·P0 충돌 조건을 정리해줘.
- 기준 문서: docs/product/CookLog_PRD_v2.md, docs/product/CookLog_USER_FLOW.md, design/prototype/, design/COOKLOG_MVP_UIUX_V1_HANDOFF.md, design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
- 허용 경로: .ai_project/tasks/, .ai_project/task_board.md, .ai_project/teams/product/task_board.md, .ai_project/reports/, .ai_project/qa/
- 참고 산출물: design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png
- 변경/검토 대상: Home의 masthead, 빠른 기록 CTA, 최근 레시피, 작은 AI 상태 영역
- 남은 리스크: 컨셉 시안의 생성 이미지 텍스트와 구성은 참고용이다. 실제 원본은 기존 Home 상태·접근성·작은 화면 계약을 보존해야 한다.
- 차단/결정 필요: Design Lead의 하위 Task scope와 Product Owner의 실제 design/prototype 수정 승인이 필요하다.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-11 | Product Lead Agent |  | proposed | Product Owner가 선택한 팝 키치 레시피 클럽을 홈 화면 단일 컨셉으로 기록하고 원본 기반 시안 방향을 등록 |
