---
schema: aiops.task.v1
id: T-20260805-003
title: iOS Home·전체 보기·검색·상태별 routing 구현
status: proposed
type: feature
priority: P0
priority_reason: 저장·진행 Recipe를 다시 찾고 기록 흐름으로 진입하는 첫 화면을 제품 상태 모델과 일치시켜야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: iOS Agent
target_role: Execution Role
required_capabilities: [ios_implementation, swiftui, navigation]
depends_on: [T-20260805-002]
blocks: [T-20260805-004, T-20260728-003]
parallel_group:
allowed_paths:
  - apps/ios/CookLog/App/
  - apps/ios/CookLog/Features/Home/
  - apps/ios/CookLogTests/
  - apps/ios/docs/NAVIGATION.md
  - apps/ios/docs/STATUS.md
  - apps/ios/docs/DEVELOPMENT_PLAN.md
  - apps/ios/docs/CHANGELOG.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
  - apps/ios/docs/NAVIGATION.md
created_by: Development Lead Agent
approved_by:
created_at: 2026-08-05
updated_at: 2026-08-05
report_to: .ai_project/reports/T-20260805-003_ios-home-search-routing-report.md
qa_to: .ai_project/qa/T-20260805-003_ios-home-search-routing-qa.md
---

# iOS Home·전체 보기·검색·상태별 routing 구현

## 범위

- Home 단일 목록, 최근·진행·완료 Recipe 카드와 전체 보기
- 제목·재료 로컬 검색, 빈 상태·로딩·오류·재시도
- 진행 상태별 Cooking Log/AI Review와 완료 Recipe Detail routing
- 기존 NavigationStack·back swipe·복구 동작 보존

## 성공 기준

- 저장·진행 상태가 디자인 계약과 동일한 콘텐츠·CTA·전이를 제공한다.
- 검색과 앱 재실행 후 routing이 올바른 Recipe/draft ID를 유지한다.
- Home 4개 Core Loop 인수 상태와 통합 핸드오프 관련 상태를 검증한다.
