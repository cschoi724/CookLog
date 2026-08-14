---
schema: aiops.task.v1
id: T-20260813-007
title: Cooking Log 화면 집중 팝 키치 시각 리터치
status: proposed
type: feature
priority: P1
priority_reason: 기록 화면은 10초 녹음과 STEP 진행 상태를 가장 빠르게 이해시켜야 하므로 기존 구조를 유지한 표면 수정으로는 부족하다.
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
    - ".ai_project/tasks/active/T-20260813-007_figma-cooking-log-focused-visual-retouch.md"
    - ".ai_project/reports/T-20260813-007_figma-cooking-log-focused-visual-retouch-report.md"
    - ".ai_project/qa/T-20260813-007_figma-cooking-log-focused-visual-retouch-qa.md"
    - ".ai_project/task_board.md"
    - ".ai_project/teams/design/task_board.md"
  domains: [figma-private-source, cooking-log-visual-fidelity]
  documents: [docs/product/, design/]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260813-006]
blocks: [T-20260813-008]
parallel_group: private-figma-focused-visual-retouch
allowed_paths:
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (저장소 외부 작업공간; URL·파일 키·조직 식별자는 비기록)"
  - ".ai_project/tasks/active/T-20260813-007_figma-cooking-log-focused-visual-retouch.md"
  - ".ai_project/reports/T-20260813-007_figma-cooking-log-focused-visual-retouch-report.md"
  - ".ai_project/qa/T-20260813-007_figma-cooking-log-focused-visual-retouch-qa.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/design/task_board.md"
source_of_truth:
  - ".ai_project/tasks/active/T-20260812-003_private-figma-source-core-flow-design.md"
  - ".ai_project/tasks/active/T-20260813-002_figma-core-record-recipe-flow.md"
  - ".ai_project/tasks/active/T-20260813-006_figma-library-focused-visual-retouch.md"
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
updated_at: 2026-08-13
report_to: ".ai_project/reports/T-20260813-007_figma-cooking-log-focused-visual-retouch-report.md"
qa_to: ".ai_project/qa/T-20260813-007_figma-cooking-log-focused-visual-retouch-qa.md"
status_ref: origin/develop
status_ref_sha: 0d871680a2258fb812fad9251eaa433a8489186a
base_ref: origin/develop
base_sha: 0d871680a2258fb812fad9251eaa433a8489186a
branch: {name: task/T-20260813-007-figma-cooking-log-focused-visual-retouch, base: develop}
pr:
  url:
  status:
blocker: T-20260813-006 완료와 Product Owner의 Cooking Log 대표 Light 실행 승인 필요.
next_decision: 선행 완료 뒤 대표 기록 상태 Light 방향을 먼저 제안하고 Product Owner 승인 후 전체 상태로 확장한다.
---

# Cooking Log 화면 집중 팝 키치 시각 리터치

## Goal

Cooking Log 14개 상태를 유지하면서 녹음·STEP·복구 행동이 한눈에 이해되는 자신감 있는 기록 화면으로 재구성한다.

## Scope

- 대표 기록 상태 `390×844 Light`에서 대형 녹음 CTA, STEP 진행, 상태 피드백의 위계를 새로 설계하고 Product Owner 승인을 받는다.
- 긴 상태 설명 대신 현재 상황과 다음 행동만 남기고 AI는 작은 처리 도우미로 표현한다.
- 레드 행동·옐로/블루 상태 포인트·제한된 라벨/낙서를 사용하되 오류·권한·오프라인 의미를 색만으로 전달하지 않는다.
- 승인 방향을 14개 상태 Light/Dark에 확장하고 T-002의 record·STEP 보존/복구 계약을 유지한다.

## Acceptance Criteria

1. 대표 Light frame의 첫 행동과 진행 상태가 즉시 이해되고 Product Owner가 시각 방향을 승인한다.
2. 14개 상태 Light/Dark가 기존 레이아웃 재색칠이 아닌 승인 위계로 완성된다.
3. T-002 상태 키·record/STEP 보존·재시도·복구 계약이 무회귀다.
4. 대비·44pt·색 외 단서·읽기 순서·Recording Error AX3가 Design QA에서 PASS한다.
5. 비공개·local-only 경계를 유지한다.

## Coordination Notes

- 대표 Light 승인 전 전체 상태와 T-008을 시작하지 않는다.
- 완료·독립 QA·Completion Review 후 T-008을 연다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-13 | Design Lead Agent |  | proposed | Cooking Log를 화면 단위로 집중 리터치하는 직렬 Task 등록 |
