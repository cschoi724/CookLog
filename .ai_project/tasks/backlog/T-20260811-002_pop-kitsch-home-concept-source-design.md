---
schema: aiops.task.v1
id: T-20260811-002
title: 팝 키치 레시피 클럽 앱 전반 디자인 방향 확정 및 원본 발전
status: proposed
type: feature
priority: P1
priority_reason: 앱 전반의 시각 방향을 일관되게 확정해야 후속 UX 개선과 디자인·iOS 반영이 분절되지 않지만, 현재 P0 iOS·Backend 실행을 중단하지 않는다.
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

# 팝 키치 레시피 클럽 앱 전반 디자인 방향 확정 및 원본 발전

## Scope

- Goal: Product Owner가 선택한 `팝 키치 레시피 클럽`을 CookLog 앱 전반의 단일 디자인 방향으로 확정하고, 공식 UI Source of Truth인 `design/prototype/`를 기준으로 모든 사용자 흐름의 시각 원본을 단계적으로 발전시킬 실행 범위를 정의한다.
- In scope:
  - 시각 방향을 팝 키치 레시피 클럽으로 고정한다: 크림 바탕, 토마토 레드 CTA, 버터 옐로·코발트 블루 포인트, 제한적인 스티커·라벨·낙서 디테일, 큼직하고 자신감 있는 타이포.
  - 기존 Prototype의 모든 사용자 흐름을 대상으로 한다: Home, 전체 레시피·검색, Cooking Log, AI Review, Recipe Detail, Audio Guide Player, App Info와 빈·오류·권한·오프라인·Light/Dark 상태.
  - 현재 기능·정보 구조·상태 계약을 보존한 채 시각·계층·컴포넌트 표현을 발전시키며, 긴 안내 문단과 내부 용어 노출을 늘리지 않는다.
  - Home은 선택 방향을 먼저 검증하는 첫 시안이지만 최종 범위가 아니다. 후속 화면은 같은 visual language와 카피 밀도 원칙으로 확장한다.
  - Design Lead가 화면군별 하위 Design Task를 분해할 때 필요한 ownership, 원본 경로, 반영 순서, Design QA 기준을 정의한다.
  - 82개 상태, 13개 공통 컴포넌트, 390×844·375×667 viewport, Light/Dark 의미 토큰과 접근성 계약을 보존한다.
- Out of scope:
  - 새로운 기능·새 사용자 흐름·AI provider·Backend 동작 변경과 iOS 구현 변경
  - 타깃 페르소나·브랜드 전략 재정의와 다른 컨셉의 병행 개발
  - AI chatbot UI, 과도한 SF 표현, 장식만을 위한 긴 카피
  - 진행 중인 P0 iOS·Backend Task의 priority·scope·status 변경
- Acceptance criteria:
  - 팝 키치 레시피 클럽이 이 Task의 유일한 앱 전반 디자인 컨셉으로 기록된다.
  - 화면군별 시안은 빠른 기록·레시피 탐색·조리·AI 정리·다시 요리·정보/오류 복구를 긴 설명 없이 이해하게 한다.
  - 토마토 레드·버터 옐로·코발트 블루는 포인트로만 쓰고, 조리 중 가독성·44pt 터치 영역·Light/Dark 의미 토큰·기존 접근성 계약을 훼손하지 않는다.
  - Design Lead는 전체 범위를 한 번에 수정하지 않고, Foundation → Home/Library → Log/Review/Detail → Player/Info/Error → 통합 QA 순서의 하위 Design Task로 분해한다.
  - 실제 원본 수정은 각 하위 Task의 Design Lead scope, Product Owner 승인, UI/UX Design Agent 실행과 Design QA 독립 검증 뒤에만 시작한다.

## Execution

- Allowed paths: `.ai_project/tasks/`, `.ai_project/task_board.md`, `.ai_project/teams/product/task_board.md`, `.ai_project/reports/`, `.ai_project/qa/`
- Source of truth: `design/prototype/`이 공식 UI 원본이며, PRD·User Flow·iOS 디자인 인수 기준을 함께 따른다.
- Dependencies: 없음. 단, Design 원본 수정·iOS 구현은 이 상위 Task와 화면군별 하위 Task의 scope·승인이 필요하다.
- Validation required: 후속 Design Task에서 Design QA가 82개 상태·작은 화면·명도 대비·터치 영역·카피 밀도·기존 흐름 무회귀를 독립 검증한다.

이 Task는 디자인 컨셉 선택과 앱 전반 원본 발전 범위를 제품 차원에서 고정한다. 현재는 Product Direction 초안이며 Design 원본을 직접 수정하거나 iOS 구현을 시작하지 않는다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 Product Lead Agent / Direction Role이야.
Task T-20260811-002를 이어서 처리해줘.

- 현재 상태: proposed
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 42e1c8e
- 다음에 해야 할 일: 팝 키치 레시피 클럽 앱 전반 방향을 Product Owner 결정으로 확인하고, Design Lead Agent가 화면군별 하위 Design Task를 scope하도록 인계할 범위·우선순위·P0 충돌 조건을 정리해줘.
- 기준 문서: docs/product/CookLog_PRD_v2.md, docs/product/CookLog_USER_FLOW.md, design/prototype/, design/COOKLOG_MVP_UIUX_V1_HANDOFF.md, design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
- 허용 경로: .ai_project/tasks/, .ai_project/task_board.md, .ai_project/teams/product/task_board.md, .ai_project/reports/, .ai_project/qa/
- 참고 산출물: design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png
- 변경/검토 대상: Home, 전체 레시피·검색, Cooking Log, AI Review, Recipe Detail, Audio Guide Player, App Info와 모든 연계 상태·공통 컴포넌트
- 남은 리스크: 컨셉 시안의 생성 이미지 텍스트와 구성은 참고용이다. 실제 원본은 82개 상태·접근성·작은 화면 계약을 보존해야 한다.
- 차단/결정 필요: Design Lead의 화면군별 하위 Task scope와 Product Owner의 각 실행 범위 승인이 필요하다.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-11 | Product Lead Agent |  | proposed | Product Owner가 선택한 팝 키치 레시피 클럽을 Home 시안 비교 방향으로 등록 |
| 2026-08-11 | Product Lead Agent | proposed | proposed | Product Owner 정정에 따라 Home 한 장 제한을 해제하고 앱 전반 원본 발전·화면군별 하위 Task 분해 범위로 재조율 |
