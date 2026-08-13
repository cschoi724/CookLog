---
schema: aiops.task.v1
id: T-20260813-001
title: 비공개 Figma Foundations·Home Visual Baseline
status: done
type: feature
priority: P1
priority_reason: 전체 화면을 확장하기 전에 구현 가능한 공통 토큰·컴포넌트와 Home 고충실도 기준을 먼저 고정해 반복 재작업을 차단한다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent:
target_role:
planned_execution_agent: UI/UX Design Agent
planned_execution_role: Execution Role
required_capabilities:
  - ux_flow
  - ui_design
  - prototyping
  - design_handoff
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
approved_by: Product Owner (2026-08-13, 최초 비공개 Figma 실행 승인 및 DQA-001·002 touch target 재작업 승인)
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-13
updated_at: 2026-08-13
report_to: ".ai_project/reports/T-20260813-001_figma-foundations-home-visual-baseline-report.md"
qa_to: ".ai_project/qa/T-20260813-001_figma-foundations-home-visual-baseline-qa.md"
status_ref: origin/develop
status_ref_sha: 86aa81c4aaf541ede4a3b4da900c355cb25324be
base_ref: origin/develop
base_sha: 86aa81c4aaf541ede4a3b4da900c355cb25324be
branch:
  name: task/T-20260813-001-figma-foundation-home-baseline
  base: develop
pr:
  url: https://github.com/cschoi724/CookLog/pull/163
  status: ready_to_merge
blocker:
next_decision: T-20260813-002의 최신 scope와 비공개 Figma 실행 경계를 확인하고 Product Owner의 별도 실행 승인을 받는다.
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

## Approved Rework Scope — DQA-001·002

- `DQA-001`: 일반 `Home / Error / 390×844 / Light`, `Dark`의 `다시 시도`에 의미 있는 local action component 또는 parent container를 적용하고 실제 action target을 최소 `44×44pt`로 만든다.
- `DQA-002`: 일반 `Home / Delete confirm / 390×844 / Light`, `Dark`의 `취소`, `영구 삭제` 각각에 의미 있는 local action component 또는 parent container를 적용하고 실제 action target을 최소 `44×44pt`로 만든다.
- label, 취소 시 데이터 보존, 삭제 후 복구 불가 카피와 Light/Dark semantic token을 유지한다.
- 수정 후 Figma node geometry로 네 action target을 직접 측정하고 실행 보고서에 식별자 없이 결과를 기록한다.
- Home의 다른 상태·정보 위계·`#FFF8E8` 배경·AX3 frame·Foundations·기존 component set은 DQA 결함 해소에 필요한 범위를 제외하고 변경하지 않는다.
- iOS, Backend, `design/prototype/`, 공개 공유 설정과 외부 Library·자산은 수정하지 않는다.
- Design QA는 동일 Draft의 비공개 read-only 입력으로 일반 Light/Dark 네 action target을 다시 측정한다.

## Coordination Notes

- Product Lead ownership review는 상위 T-20260812-003과 하위 패키지 전체를 한 번에 검토한다.
- 동일 Figma 파일을 쓰는 하위 Task는 T-20260813-001→002→003→004 순서로 직렬 실행한다.
- 시안과 달라야 하는 폰트·자산 제약은 임의 대체하지 않고 차이와 대안을 Product Owner에게 먼저 제시한다.
- Home 첫 승인만 Light이며, Task 완료와 후속 화면군에는 Light/Dark 계약을 적용한다.

## Completion Review

- 검토일: 2026-08-13
- 검토 Role: Design Lead Agent / Completion Role
- 판정: 수용
- 근거: 독립 Design QA 최종 `PASS`, 일반 Home Light/Dark Error·Delete confirm의 Retry `104×44pt`, Cancel `132×44pt`, Delete `141×44pt` 6개 action instance와 semantic token·카피·시각 회귀 없음이 확인됐다.
- 보존 계약: Foundations, Home Light/Dark 18개 `390×844` frame, 상태 계약, 단일 전체 요리책 진입, AX3 대표 위험 frame 및 비공개·local-only 경계가 유지됐다.
- 잔여 리스크: 실제 iOS hit area·VoiceOver·Dynamic Type은 구현·iOS QA에서 검증한다. `375×667` 전체 화면은 이번 Task 비범위이며 완료 차단으로 보지 않는다.

## Completion Decision

- 확정일: 2026-08-13
- 확정 Role: Design Lead Agent / Completion Role
- 결정: `done`
- 수용: Product Owner가 완료 리뷰, PR #163 Draft 해제·병합 및 Task 완료 처리를 승인했다.
- 후속: T-20260813-002는 T-001의 canonical 병합을 확인한 뒤 별도 실행 승인을 받아야 하며, 이번 승인으로 자동 실행하지 않는다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 Design Lead Agent / Lead Role이야.
완료된 Task T-20260813-001을 기준으로 T-20260813-002의 실행 준비를 검토해줘.

- 현재 상태: T-20260813-001 `done`, T-20260813-002 `scoped`
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 86aa81c4aaf541ede4a3b4da900c355cb25324be
- 다음에 해야 할 일: PR #163의 canonical 병합을 확인하고 T-20260813-002의 scope·allowed_paths·source_of_truth·비공개 보안 경계를 최신 기준으로 재확인한 뒤 Product Owner에게 별도 실행 승인을 요청해줘.
- 기준 문서: 상위 T-20260812-003, CookLog PRD·User Flow·팝 키치 UX 계획·선택 시안·handoff 및 Product Owner가 비공개 컨텍스트에서 지정하는 Draft Figma 파일
- 허용 경로: T-20260813-002의 allowed_paths와 지정된 비공개 Figma 파일
- 참고 산출물: .ai_project/reports/T-20260813-001_figma-foundations-home-visual-baseline-report.md, .ai_project/qa/T-20260813-001_figma-foundations-home-visual-baseline-qa.md
- 변경/검토 대상: T-20260813-002의 Library·Cooking Log·AI Review·Recipe Detail 38개 상태
- 남은 리스크: 실제 iOS 접근성은 구현 단계에서 별도 검증하며 `375×667` 전체 화면은 비범위다.
- 차단/결정 필요: T-20260813-002 실행은 Product Owner의 별도 승인이 필요하다.
- 보안: Figma 식별자를 저장소·Task·보고서에 기록하거나 공개 범위를 넓히지 마.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-13 | Design Lead Agent |  | scoped | Figma Foundations·Components와 Home 390×844 Light 선승인 게이트를 독립 실행 Task로 등록 |
| 2026-08-13 | Design Lead Agent | - | - | 상태 변경 없이 PR #161 재감사 결과로 T-20260812-002의 Home 전체 요리책 단일 텍스트 진입점·헤더 중복 금지 계약을 명시 |
| 2026-08-13 | Product Owner | scoped | approved | PR #161 재검토 PASS와 T-20260812-004 done을 확인하고 UI/UX Design Agent / Execution Role의 비공개 Figma 실행을 승인 |
| 2026-08-13 | UI/UX Design Agent | approved | in_progress | `origin/develop@86aa81c` 기반 전용 worktree에서 lock을 획득하고, 비공개 Figma 원천·로컬 Foundation·Home Visual Baseline의 Phase 0 Discovery를 시작 |
| 2026-08-13 | UI/UX Design Agent | in_progress | in_progress | Product Owner가 지정한 비공개 Draft를 생성하고 외부 Library 미연결 상태에서 local Foundations·Components 및 `Home / Content / 390×844 / Light` first visual gate를 구성. Product Owner 시각 승인 대기 |
| 2026-08-13 | Product Owner | in_progress | in_progress | `Home / Content / 390×844 / Light`를 Home Visual Baseline v1으로 시각 승인. 나머지 Home 상태와 Dark mode 확장 허용 |
| 2026-08-13 | UI/UX Design Agent | in_progress | verification_ready | Home 9개 상태 Light/Dark 18개 frame, 상태 계약 9개, AX3 위험 frame 3개와 local token·component 정적 검증을 완료하고 Design QA에 인계 |
| 2026-08-13 | Design QA Agent | verification_ready | verification_in_progress | 공용 기준과 실행 보고서를 확인하고 비공개 Figma Foundations·Home baseline 독립 검증을 시작 |
| 2026-08-13 | Design QA Agent | verification_in_progress | blocked | Design QA 세션의 비공개 Draft read-only 컨텍스트와 commit·push된 verification_ready 산출물이 없어 실제 Figma 구조·시각·AX3를 독립 확인할 수 없어 Lead에 차단 해소를 인계 |
| 2026-08-13 | Design Lead Agent | - | - | 상태 변경 없이 실행 보고서·BLOCKED QA 보고서·verification_ready 이력을 task branch에 게시해 공용 재현 경로를 준비하고, 남은 차단을 비공개 Figma read-only 컨텍스트 지정으로 한정 |
| 2026-08-13 | Design QA Agent | verification_ready | verification_in_progress | Product Owner가 제공한 동일 비공개 Draft를 read-only로 열고 실제 Figma Foundations·Home baseline 재검증을 시작 |
| 2026-08-13 | Design QA Agent | verification_in_progress | rework_requested | 직접 Figma 측정에서 일반 Light/Dark Error retry와 Delete confirm cancel/delete가 44×44pt action container 없이 텍스트로 배치된 DQA-001·002를 확인해 Lead에 재작업 인계 |
| 2026-08-13 | Design Lead Agent | blocked | approved | Product Owner가 승인된 동일 Draft 링크를 비공개 입력으로 제공했고 read-only Figma 접근·페이지·18개 Home frame·local token/component·상태 계약·AX3 노드를 확인했다. PR #163 게시도 확인해 UI/UX Design Agent의 검증 인계 재개로 라우팅 |
| 2026-08-13 | UI/UX Design Agent | approved | in_progress | 게시된 실행 보고서와 동일 비공개 Draft를 read-only 재확인하고, 외부 Library 0개·Home Light/Dark 18개·component set 4개·상태 계약·AX3 frame이 유지됨을 확인 |
| 2026-08-13 | UI/UX Design Agent | in_progress | verification_ready | 재확인 결과와 기존 실행 보고서·QA 시트를 갱신해 Design QA Agent / Verification Role에 재인계 |
| 2026-08-13 | Design Lead Agent | rework_requested | approved | Product Owner가 DQA-001·002 재작업을 승인해 일반 Home Light/Dark Error retry와 Delete confirm cancel/delete의 최소 44×44pt action target만 UI/UX Design Agent에게 재할당 |
| 2026-08-13 | UI/UX Design Agent | approved | in_progress | DQA-001·002 승인 범위의 일반 Home Light/Dark retry·cancel·delete action target 재작업 lock 획득 |
| 2026-08-13 | UI/UX Design Agent | in_progress | verification_ready | local `Action / Inline` 44pt variant와 일반 Home Light/Dark Error·Delete confirm 6개 instance를 교체·직접 측정하고 Design QA에 재인계 |
| 2026-08-13 | Design QA Agent | verification_ready | verification_in_progress | DQA-001·002 재작업 결과의 일반 Home Light/Dark 6개 action instance 독립 재측정 시작 |
| 2026-08-13 | Design QA Agent | verification_in_progress | verification_passed | 동일 비공개 Draft에서 DQA-001·002의 6개 action instance를 직접 재측정해 44pt·token·카피·시각 회귀 없음 PASS로 Completion Role에 인계 |
| 2026-08-13 | Design Lead Agent | verification_passed | completion_review | 독립 Design QA PASS와 비공개·local-only 보존 계약을 확인하고 iOS 접근성·375×667 후속 리스크를 수용해 완료 검토 시작 |
| 2026-08-13 | Design Lead Agent | completion_review | done | Product Owner의 완료·PR #163 병합 승인에 따라 T-001을 완료 확정하고 T-002의 dependency 해제 조건을 충족 |
