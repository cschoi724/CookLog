---
schema: aiops.task.v1
id: T-20260813-010
title: Audio Guide 화면 집중 팝 키치 시각 리터치
status: proposed
type: feature
priority: P1
priority_reason: 오디오 가이드는 조리 중 한눈·한손 사용성과 핸즈프리 상태를 시각적으로 단순화해야 하므로 별도 집중 설계가 필요하다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design Lead Agent
target_role: Lead Role
planned_execution_agent: UI/UX Design Agent
planned_execution_role: Execution Role
required_capabilities: [design_scoping, visual_fidelity, figma_authoring]
ownership:
  paths:
    - ".ai_project/tasks/active/T-20260813-010_figma-audio-guide-focused-visual-retouch.md"
    - ".ai_project/reports/T-20260813-010_figma-audio-guide-focused-visual-retouch-report.md"
    - ".ai_project/qa/T-20260813-010_figma-audio-guide-focused-visual-retouch-qa.md"
    - ".ai_project/task_board.md"
    - ".ai_project/teams/design/task_board.md"
  domains: [figma-private-source, audio-guide-visual-fidelity]
  documents: [docs/product/, design/]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260813-009]
blocks: [T-20260813-011]
parallel_group: private-figma-focused-visual-retouch
allowed_paths:
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (저장소 외부 작업공간; URL·파일 키·조직 식별자는 비기록)"
  - ".ai_project/tasks/active/T-20260813-010_figma-audio-guide-focused-visual-retouch.md"
  - ".ai_project/reports/T-20260813-010_figma-audio-guide-focused-visual-retouch-report.md"
  - ".ai_project/qa/T-20260813-010_figma-audio-guide-focused-visual-retouch-qa.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/design/task_board.md"
source_of_truth:
  - ".ai_project/tasks/active/T-20260812-003_private-figma-source-core-flow-design.md"
  - ".ai_project/tasks/active/T-20260813-003_figma-audio-info-82-state-completion.md"
  - ".ai_project/tasks/active/T-20260813-009_figma-recipe-detail-focused-visual-retouch.md"
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_POP_KITSCH_UX_PLAN.md
  - "Product Owner가 지정한 비공개 Draft Figma 파일"
created_by: Design Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-13
updated_at: 2026-08-14
report_to: ".ai_project/reports/T-20260813-010_figma-audio-guide-focused-visual-retouch-report.md"
qa_to: ".ai_project/qa/T-20260813-010_figma-audio-guide-focused-visual-retouch-qa.md"
status_ref: origin/develop
status_ref_sha: 0d871680a2258fb812fad9251eaa433a8489186a
base_ref: origin/develop
base_sha: 0d871680a2258fb812fad9251eaa433a8489186a
branch: {name: task/T-20260813-010-figma-audio-guide-focused-visual-retouch, base: develop}
pr:
  url:
  status:
blocker: T-20260813-009 완료와 Product Owner의 Audio Guide 대표 Light 실행 승인 필요.
next_decision: 선행 완료 뒤 대표 Playing Light 방향을 먼저 제안하고 Product Owner 승인 후 전체 상태로 확장한다.
---

# Audio Guide 화면 집중 팝 키치 시각 리터치

## Goal

Audio Guide 24개 상태를 보존하면서 조리 중 한눈·한손·핸즈프리 사용에 맞는 크고 명확한 플레이어로 재구성한다.

## Scope

- 대표 Playing `390×844 Light`의 현재 STEP, 재생 제어, 이전/다음, 속도와 핸즈프리 상태 위계를 새로 설계하고 Product Owner 승인을 받는다.
- 큰 타이포와 44pt 이상 제어, 레드 핵심 action, 옐로/블루 상태 포인트를 사용하고 장식은 조리 가독성을 방해하지 않게 제한한다.
- 승인 방향을 재생·정지·탐색·권한·오프라인·중단·오류 등 24개 상태 Light/Dark에 확장한다.
- T-003의 오디오·권한·복구 계약과 비시각적 상태 단서를 유지한다.

## Acceptance Criteria

1. 대표 Light frame에서 현재 STEP과 재생 행동이 한눈에 이해되고 Product Owner가 승인한다.
2. 24개 상태 Light/Dark가 승인 위계로 완성되고 상태별 기능·복구 계약이 유지된다.
3. 핸즈프리와 오디오 중단 상태가 색뿐 아니라 텍스트·아이콘·구조로 구분된다.
4. 대비·44pt·읽기 순서·대표 AX3가 Design QA에서 PASS한다.
5. 비공개·local-only 경계를 유지한다.

## Coordination Notes

- 대표 Light 승인 전 전체 상태와 T-011을 시작하지 않는다.
- 완료·독립 QA·Completion Review 후 T-011을 연다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-14 | Design Lead Agent |  | proposed | Audio Guide를 화면 단위로 집중 리터치하는 직렬 Task 등록 |
