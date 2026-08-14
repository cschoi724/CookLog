---
schema: aiops.task.v1
id: T-20260813-011
title: App Info 화면 집중 팝 키치 시각 리터치
status: proposed
type: feature
priority: P1
priority_reason: 앱 정보·데이터·법적·서비스 상태는 신뢰성과 가독성을 유지하면서도 전체 브랜드 컨셉과 분리되지 않게 정리해야 한다.
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
    - ".ai_project/tasks/active/T-20260813-011_figma-app-info-focused-visual-retouch.md"
    - ".ai_project/reports/T-20260813-011_figma-app-info-focused-visual-retouch-report.md"
    - ".ai_project/qa/T-20260813-011_figma-app-info-focused-visual-retouch-qa.md"
    - ".ai_project/task_board.md"
    - ".ai_project/teams/design/task_board.md"
  domains: [figma-private-source, app-info-visual-fidelity]
  documents: [docs/product/, design/]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260813-010]
blocks: [T-20260813-004]
parallel_group: private-figma-focused-visual-retouch
allowed_paths:
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (저장소 외부 작업공간; URL·파일 키·조직 식별자는 비기록)"
  - ".ai_project/tasks/active/T-20260813-011_figma-app-info-focused-visual-retouch.md"
  - ".ai_project/reports/T-20260813-011_figma-app-info-focused-visual-retouch-report.md"
  - ".ai_project/qa/T-20260813-011_figma-app-info-focused-visual-retouch-qa.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/design/task_board.md"
source_of_truth:
  - ".ai_project/tasks/active/T-20260812-003_private-figma-source-core-flow-design.md"
  - ".ai_project/tasks/active/T-20260813-003_figma-audio-info-82-state-completion.md"
  - ".ai_project/tasks/active/T-20260813-010_figma-audio-guide-focused-visual-retouch.md"
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
report_to: ".ai_project/reports/T-20260813-011_figma-app-info-focused-visual-retouch-report.md"
qa_to: ".ai_project/qa/T-20260813-011_figma-app-info-focused-visual-retouch-qa.md"
status_ref: origin/develop
status_ref_sha: 0d871680a2258fb812fad9251eaa433a8489186a
base_ref: origin/develop
base_sha: 0d871680a2258fb812fad9251eaa433a8489186a
branch: {name: task/T-20260813-011-figma-app-info-focused-visual-retouch, base: develop}
pr:
  url:
  status:
blocker: T-20260813-010 완료와 Product Owner의 App Info 대표 Light 실행 승인 필요.
next_decision: 선행 완료 뒤 대표 App Info Light 방향을 먼저 제안하고 Product Owner 승인 후 전체 상태로 확장한다.
---

# App Info 화면 집중 팝 키치 시각 리터치

## Goal

App Info 11개 상태를 보존하면서 데이터 보관·법적 정보·서비스 상태를 신뢰감 있고 간결한 브랜드 화면으로 재구성한다.

## Scope

- 대표 App Info `390×844 Light`의 정보 그룹, 버전·데이터·법적 문서·서비스 상태 위계를 새로 설계하고 Product Owner 승인을 받는다.
- 장문은 읽기 가능한 disclosure 구조로 접고, 화면 첫 단계에는 핵심 상태와 필요한 행동만 보인다.
- 팝 키치 포인트는 라벨·구분·상태 강조에 제한적으로 사용해 법적·신뢰 정보 가독성을 훼손하지 않는다.
- 승인 방향을 11개 상태 Light/Dark에 확장하고 T-003의 데이터·서비스·복구 계약을 유지한다.

## Acceptance Criteria

1. 대표 Light frame의 정보 그룹과 필요한 행동이 명확하고 Product Owner가 승인한다.
2. 11개 상태 Light/Dark가 승인 위계로 완성되고 법적·데이터 카피의 의미가 보존된다.
3. 장문 밀도는 줄이되 disclosure 이후 필수 정보 누락이 없다.
4. 대비·44pt·색 외 단서·읽기 순서·대표 AX3가 Design QA에서 PASS한다.
5. 비공개·local-only 경계를 유지한다.

## Coordination Notes

- 대표 Light 승인 전 전체 상태와 T-004를 시작하지 않는다.
- 완료·독립 QA·Completion Review 후 T-004 통합 handoff·Design QA를 연다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-14 | Design Lead Agent |  | proposed | App Info를 화면 단위로 집중 리터치하는 직렬 Task 등록 |
