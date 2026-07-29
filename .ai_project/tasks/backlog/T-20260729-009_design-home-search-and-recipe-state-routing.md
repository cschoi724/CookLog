---
id: T-20260729-009
title: Home·전체 보기·검색·레시피 상태 routing 디자인
status: proposed
type: feature
priority: P0
priority_reason: 여러 진행 레시피와 완료 레시피를 하나의 목록에서 구분하고 정확한 현재 단계로 복귀하는 흐름은 로컬 제품 구현의 시작점이다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: UI/UX Design Agent
target_role: Execution Role
required_capabilities:
  - ux_flow
  - ui_design
  - prototyping
depends_on:
  - T-20260729-008
blocks:
  - T-20260729-010
  - T-20260729-002
parallel_group: design-refresh-sequential
allowed_paths:
  - design/prototype/
  - design/figma-build/manifest.json
  - design/exports/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - design/prototype/
created_by: Design Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260729-009_design-home-search-and-recipe-state-routing-report.md
qa_to: .ai_project/qa/T-20260729-009_design-home-search-and-recipe-state-routing-qa.md
---

# Home·전체 보기·검색·레시피 상태 routing 디자인

## 목적

진행 기록과 완료 레시피를 하나의 최근 목록에 표시하면서 각 상태와 복귀 목적지를 사용자가 즉시 이해하게 한다.

## 실행 범위

- 최근 활동 시간순 최대 3개 Home 목록
- `기록 중`, `AI 정리 중`, `검토 필요`, 완료 레시피 카드
- 제목 없는 기록의 `작성 중인 요리`와 날짜·시간 구분
- 카드 선택 시 STEP Preview, AI Review, Recipe Detail routing
- 진행 기록 `⋯` 메뉴, 영구 삭제 확인과 복구 불가 안내
- 전체 보기의 최근 활동순 목록
- 제목·재료명 로컬 검색, 입력 즉시 결과, 지우기와 결과 없음
- 제목 일치 우선과 재료 일치 결과 표현
- 새 진행 기록 시작 시 기존 기록 보존

## 제외 범위

- STEP Preview 내부 편집
- AI Review 상세 폼
- 의미 검색, 정렬·필터와 서버 검색
- 완료 레시피 직접 삭제 흐름

## 성공 기준

- 모든 상태 카드가 동일한 목록 안에서 구분되며 완료 카드에는 불필요한 완료 배지가 없다.
- 카드 전체가 터치 타깃이고 각 상태에서 제품 문서가 정한 화면으로 이동한다.
- 검색 대상과 제외 대상이 명확하며 검색어가 서버로 전송되는 인상을 주지 않는다.
- 빈 목록, 검색 결과 없음, 여러 진행 기록과 최근 3개 초과 상태를 Prototype에서 확인할 수 있다.
- 진행 기록 영구 삭제 전 확인과 복구 불가 안내가 표현된다.
- Design QA Agent가 상태 구분, routing과 검색 접근성을 독립 검증한다.

## 사용자 결정 필요 항목

- 없음. 카드 정보와 정렬 기준은 제품 문서대로 적용한다.
