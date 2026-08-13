---
schema: aiops.task.v1
id: T-20260813-001
title: 비공개 Figma Foundations·Home Visual Baseline
status: scoped
type: feature
priority: P1
priority_reason: 전체 화면을 확장하기 전에 구현 가능한 공통 토큰·컴포넌트와 Home 고충실도 기준을 먼저 고정해 반복 재작업을 차단한다.
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
    - ".ai_project/tasks/active/T-20260813-001_figma-foundations-home-visual-baseline.md"
    - ".ai_project/reports/T-20260813-001_figma-foundations-home-visual-baseline-report.md"
    - ".ai_project/qa/T-20260813-001_figma-foundations-home-visual-baseline-qa.md"
    - ".ai_project/task_board.md"
    - ".ai_project/teams/design/task_board.md"
  domains:
    - figma-private-source
    - design-foundations
    - home-visual-baseline
  documents:
    - docs/product/
    - design/
ownership_review:
  required: false
  reviewer:
depends_on:
  - T-20260812-004
blocks:
  - T-20260813-002
parallel_group: private-figma-source-transition
allowed_paths:
  - ".ai_project/tasks/active/T-20260813-001_figma-foundations-home-visual-baseline.md"
  - ".ai_project/reports/T-20260813-001_figma-foundations-home-visual-baseline-report.md"
  - ".ai_project/qa/T-20260813-001_figma-foundations-home-visual-baseline-qa.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/design/task_board.md"
source_of_truth:
  - ".ai_project/tasks/active/T-20260812-003_private-figma-source-core-flow-design.md"
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_POP_KITSCH_UX_PLAN.md
  - design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png
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
report_to: ".ai_project/reports/T-20260813-001_figma-foundations-home-visual-baseline-report.md"
qa_to: ".ai_project/qa/T-20260813-001_figma-foundations-home-visual-baseline-qa.md"
status_ref: origin/develop
status_ref_sha: bcbd3aa6bd5d307da03238aabd5c0ebcd811d583
base_ref: origin/develop
base_sha: bcbd3aa6bd5d307da03238aabd5c0ebcd811d583
branch:
  name: task/T-20260813-001-figma-foundation-home-baseline
  base: develop
pr:
  url:
  status:
blocker: 상위 T-20260812-003 패키지의 Product Lead ownership review와 Product Owner의 비공개 Figma 실행 승인이 필요하다.
next_decision: 리뷰 수용 후 Product Owner가 이 Task를 approved로 전환해 UI/UX Design Agent에게 인계한다.
---

# 비공개 Figma Foundations·Home Visual Baseline

## Goal

CookLog 전용 비공개 Figma 파일에 구현 가능한 Foundations·Components를 만들고, 선택 시안에 가까운 `Home / Content / 390×844 / Light`를 첫 시각 기준으로 고정한다.

## Scope

- 비공개 접근, 외부 Library 미연결, CookLog 로컬 자산 전용 여부를 확인한다.
- `00 Cover & Status`부터 `99 Archive`까지 상위 Task의 페이지 구조를 만든다.
- color, typography, spacing, radius, elevation, semantic state Variables와 Home에 필요한 재사용 Components·Variants·Styles를 만든다.
- Light/Dark semantic color mode와 공통 component state를 구성하되, 첫 Product Owner 시각 승인 대상은 `Home / Content / 390×844 / Light` 한 장으로 제한한다.
- 구현 안전 font family·weight·line height를 사용하고 실제 geometry·spacing·color·stroke·asset ratio를 Dev Mode/MCP에서 읽을 수 있게 구성한다.
- `Home / Content / 390×844 / Light`를 기존 레이아웃의 재색칠이 아닌 신규 구성으로 만든다.
  - 흰 캔버스, 큰 CookLog 워드마크, 짧은 라벨
  - 중앙 대형 토마토 레드 원형 기록 CTA
  - 최근 레시피 2열 카드
  - 작은 비챗봇 AI 도우미와 최소 카피
- Home 9개 상태를 추적 키·발생 조건·다음 행동·복구 계약과 함께 frame 또는 component/state configuration으로 표현한다.
- 일반 텍스트 대비, 최소 44pt 터치 영역, 색 외 상태 단서, 읽기 순서와 Accessibility 3 대표 위험 frame을 확인한다.
- Product Owner가 전체 확장 전에 `Home Visual Baseline v1`을 직접 시각 승인한다.
- Light Home 승인 후 같은 구조·정보 위계·상태 계약을 Dark Home 9개 상태에 적용하고, 이후 화면군이 재사용할 Light/Dark component·token 기준을 검증한다.
- 전체 요리책 진입은 최근 레시피 영역의 단일 텍스트 액션으로 두고, 헤더에 중복 진입점을 만들지 않는다.

## Out of Scope

- Library, Cooking Log, AI Review, Recipe Detail, Audio Guide, App Info의 고충실도 화면 제작
- 375×667 전체 화면 명세
- iOS, Backend, `design/prototype/` 수정과 Figma 자동 생성 코드 적용
- 공개 링크, Community 게시, 외부 Library·회사 폰트·회사 자산 사용

## Acceptance Criteria

1. 저장소와 보고서에 Figma URL·파일 키·조직·초대 대상 식별자가 없고, 파일은 CookLog 로컬 자산만 사용한다.
2. 지정 페이지 구조와 local Foundations·Components가 구성되고 detached 복제본과 임의 레이어명이 최소화된다.
3. Home Content 390×844 Light가 선택 시안의 정보 위계·비율·여백·타이포·CTA·카드·AI 도우미에 고충실도로 맞는다.
4. Home 9개 상태가 기능·행동·데이터 보존·복구 계약과 함께 추적 가능하다.
5. Home 첫 시각 승인 게이트는 Light 한 장이며, Task 완료 전 Home 9개 상태와 공통 Foundations·Components가 Light/Dark로 구성된다.
6. Light/Dark 기준 대비·44pt·색 외 상태 단서·읽기 순서·AX3 대표 위험 frame이 PASS한다.
7. 전체 요리책 진입은 최근 레시피 영역의 단일 텍스트 액션이며 헤더 중복 진입점이 없다.
8. Product Owner의 `Home Visual Baseline v1` 승인 사실이 민감 식별자 없이 보고서에 남고, Design QA가 위 계약을 독립 검증한다.
9. Product Owner 승인 전에는 T-20260813-002를 실행하지 않는다.

## Coordination Notes

- Product Lead ownership review는 상위 T-20260812-003과 하위 패키지 전체를 한 번에 검토한다.
- 동일 Figma 파일을 쓰는 하위 Task는 T-20260813-001→002→003→004 순서로 직렬 실행한다.
- 시안과 달라야 하는 폰트·자산 제약은 임의 대체하지 않고 차이와 대안을 Product Owner에게 먼저 제시한다.
- Home 첫 승인만 Light이며, Task 완료와 후속 화면군에는 Light/Dark 계약을 적용한다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 Product Lead Agent / Lead Role이야.
상위 T-20260812-003과 하위 T-20260813-001~004를 한 패키지로 ownership review해줘.

- 현재 상태: scoped
- 이 Task의 실행 게이트: Home / Content / 390×844 / Light 한 장과 Home 9상태
- 확인할 것: 선택 시안 고충실도, 82개 기능·상태 계약 비축소, Home 첫 Light 승인과 전체 Light/Dark 완료 계약의 양립
- 리뷰 수용 후: Product Owner가 T-20260813-001 실행을 별도 승인하면 UI/UX Design Agent에게 인계해.
- 보안: Figma URL·파일 키·조직·초대 대상 식별자를 저장소에 기록하지 마.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-13 | Design Lead Agent |  | scoped | Figma Foundations·Components와 Home 390×844 Light 선승인 게이트를 독립 실행 Task로 등록 |
| 2026-08-13 | Design Lead Agent | - | - | 상태 변경 없이 PR #161 재감사 결과로 T-20260812-002의 Home 전체 요리책 단일 텍스트 진입점·헤더 중복 금지 계약을 명시 |
