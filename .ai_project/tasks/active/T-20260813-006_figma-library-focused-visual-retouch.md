---
schema: aiops.task.v1
id: T-20260813-006
title: Library 화면 집중 팝 키치 시각 리터치
status: proposed
type: feature
priority: P1
priority_reason: Library는 기존 목록 레이아웃 재색칠이 아니라 저장된 레시피를 탐색하는 핵심 경험으로 화면 위계를 새로 설계해야 한다.
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
    - ".ai_project/tasks/active/T-20260813-006_figma-library-focused-visual-retouch.md"
    - ".ai_project/reports/T-20260813-006_figma-library-focused-visual-retouch-report.md"
    - ".ai_project/qa/T-20260813-006_figma-library-focused-visual-retouch-qa.md"
    - ".ai_project/task_board.md"
    - ".ai_project/teams/design/task_board.md"
  domains: [figma-private-source, library-visual-fidelity]
  documents: [docs/product/, design/]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260813-005]
blocks: [T-20260813-007]
parallel_group: private-figma-focused-visual-retouch
allowed_paths:
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (저장소 외부 작업공간; URL·파일 키·조직 식별자는 비기록)"
  - ".ai_project/tasks/active/T-20260813-006_figma-library-focused-visual-retouch.md"
  - ".ai_project/reports/T-20260813-006_figma-library-focused-visual-retouch-report.md"
  - ".ai_project/qa/T-20260813-006_figma-library-focused-visual-retouch-qa.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/design/task_board.md"
source_of_truth:
  - ".ai_project/tasks/active/T-20260812-003_private-figma-source-core-flow-design.md"
  - ".ai_project/tasks/active/T-20260813-002_figma-core-record-recipe-flow.md"
  - ".ai_project/tasks/active/T-20260813-005_figma-home-local-baseline-parity-retouch.md"
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
report_to: ".ai_project/reports/T-20260813-006_figma-library-focused-visual-retouch-report.md"
qa_to: ".ai_project/qa/T-20260813-006_figma-library-focused-visual-retouch-qa.md"
status_ref: origin/develop
status_ref_sha: 0d871680a2258fb812fad9251eaa433a8489186a
base_ref: origin/develop
base_sha: 0d871680a2258fb812fad9251eaa433a8489186a
branch: {name: task/T-20260813-006-figma-library-focused-visual-retouch, base: develop}
pr:
  url:
  status:
blocker: T-20260813-005 완료와 Product Owner의 Library 대표 Light 실행 승인 필요.
next_decision: 선행 완료 뒤 대표 Library Content Light 방향을 먼저 제안하고 Product Owner 승인 후 전체 상태로 확장한다.
---

# Library 화면 집중 팝 키치 시각 리터치

## Goal

Library 5개 상태의 기능 계약을 보존하면서 탐색·검색·빈 상태를 팝 키치 레시피 클럽답게 새로 구성한다.

## Scope

- `Library / Content / 390×844 / Light` 한 장의 정보 위계와 레이아웃을 먼저 설계하고 Product Owner 승인을 받는다.
- 흰 캔버스, 큰 타이포, 레드 핵심 행동, 옐로·블루 포인트와 제한된 라벨/스티커를 사용하되 Home 레이아웃을 복사하지 않는다.
- 긴 설명을 제거하고 최근 레시피·검색·결과 이동의 첫 행동이 즉시 보이게 한다.
- 승인 방향을 검색·결과 없음·빈 상태와 Dark에 확장하고 T-002의 5개 상태·보존 계약을 유지한다.

## Acceptance Criteria

1. 대표 Light frame이 기존 Prototype의 단순 재색칠이 아닌 새 화면 위계이며 Product Owner가 승인한다.
2. 5개 상태 Light/Dark가 같은 시각 언어로 완성되고 T-002 상태·routing·데이터 계약이 유지된다.
3. copy 밀도, geometry, typography, color와 component 사용이 구현자가 읽을 수 있게 구성된다.
4. 대비·44pt·색 외 단서·읽기 순서·대표 AX3가 Design QA에서 PASS한다.
5. 비공개·local-only 경계를 유지한다.

## Coordination Notes

- 대표 Light 승인 전 나머지 상태와 T-007을 시작하지 않는다.
- 완료·독립 QA·Completion Review 후 T-007을 연다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-13 | Design Lead Agent |  | proposed | Library를 화면 단위로 집중 리터치하는 직렬 Task 등록 |
