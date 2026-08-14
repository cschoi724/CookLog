---
schema: aiops.task.v1
id: T-20260813-009
title: Recipe Detail 화면 집중 팝 키치 시각 리터치
status: proposed
type: feature
priority: P1
priority_reason: 완성 레시피는 다시 요리하기가 중심이어야 하며, 내용·수정·삭제 상태를 짧고 자신감 있는 위계로 재구성해야 한다.
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
    - ".ai_project/tasks/active/T-20260813-009_figma-recipe-detail-focused-visual-retouch.md"
    - ".ai_project/reports/T-20260813-009_figma-recipe-detail-focused-visual-retouch-report.md"
    - ".ai_project/qa/T-20260813-009_figma-recipe-detail-focused-visual-retouch-qa.md"
    - ".ai_project/task_board.md"
    - ".ai_project/teams/design/task_board.md"
  domains: [figma-private-source, recipe-detail-visual-fidelity]
  documents: [docs/product/, design/]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260813-008]
blocks: [T-20260813-010]
parallel_group: private-figma-focused-visual-retouch
allowed_paths:
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (저장소 외부 작업공간; URL·파일 키·조직 식별자는 비기록)"
  - ".ai_project/tasks/active/T-20260813-009_figma-recipe-detail-focused-visual-retouch.md"
  - ".ai_project/reports/T-20260813-009_figma-recipe-detail-focused-visual-retouch-report.md"
  - ".ai_project/qa/T-20260813-009_figma-recipe-detail-focused-visual-retouch-qa.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/design/task_board.md"
source_of_truth:
  - ".ai_project/tasks/active/T-20260812-003_private-figma-source-core-flow-design.md"
  - ".ai_project/tasks/active/T-20260813-002_figma-core-record-recipe-flow.md"
  - ".ai_project/tasks/active/T-20260813-008_figma-ai-review-focused-visual-retouch.md"
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
report_to: ".ai_project/reports/T-20260813-009_figma-recipe-detail-focused-visual-retouch-report.md"
qa_to: ".ai_project/qa/T-20260813-009_figma-recipe-detail-focused-visual-retouch-qa.md"
status_ref: origin/develop
status_ref_sha: 0d871680a2258fb812fad9251eaa433a8489186a
base_ref: origin/develop
base_sha: 0d871680a2258fb812fad9251eaa433a8489186a
branch: {name: task/T-20260813-009-figma-recipe-detail-focused-visual-retouch, base: develop}
pr:
  url:
  status:
blocker: T-20260813-008 완료와 Product Owner의 Recipe Detail 대표 Light 실행 승인 필요.
next_decision: 선행 완료 뒤 대표 Content Light 방향을 먼저 제안하고 Product Owner 승인 후 전체 상태로 확장한다.
---

# Recipe Detail 화면 집중 팝 키치 시각 리터치

## Goal

Recipe Detail 7개 상태를 보존하면서 읽기와 다시 요리하기가 중심인 레시피 클럽 화면으로 재구성한다.

## Scope

- 대표 Content `390×844 Light`의 레시피 제목·재료·STEP·다시 요리 CTA 위계를 새로 설계하고 Product Owner 승인을 받는다.
- 긴 설명과 반복 메타데이터를 줄이고 레드 핵심 CTA, 옐로/블루 섹션 포인트와 제한된 장식만 사용한다.
- 승인 방향을 메뉴·삭제 확인·로딩·오류·Not Found를 포함한 7개 상태 Light/Dark에 확장한다.
- T-002의 읽기·수정·삭제·stale route·복구 계약을 유지한다.

## Acceptance Criteria

1. 대표 Light frame에서 레시피 읽기와 다시 요리하기 위계가 명확하고 Product Owner가 승인한다.
2. 7개 상태 Light/Dark가 승인 위계로 완성되고 기존 상세 화면 틀의 단순 재색칠이 아니다.
3. 수정·삭제·조회 실패·Not Found 계약이 무회귀다.
4. 대비·44pt·색 외 단서·읽기 순서·Delete Confirmation AX3가 Design QA에서 PASS한다.
5. 비공개·local-only 경계를 유지한다.

## Coordination Notes

- 대표 Light 승인 전 전체 상태와 T-010을 시작하지 않는다.
- 완료·독립 QA·Completion Review 후 T-010을 연다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-14 | Design Lead Agent |  | proposed | Recipe Detail을 화면 단위로 집중 리터치하는 직렬 Task 등록 |
