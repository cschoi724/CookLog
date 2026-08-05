---
schema: aiops.task.v1
id: T-20260805-008
title: iOS 접근성·작은 화면·다크 모드·통합 회귀 검증
status: proposed
type: qa
priority: P0
priority_reason: 82개 통합 상태와 Core Loop 23개 상태의 기능·시각·접근성 무회귀가 상위 T-003 완료 조건이다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: qa
target_agent: iOS Agent
target_role: Execution Role
required_capabilities: [ios_implementation, accessibility, test_automation]
depends_on:
  - T-20260805-002
  - T-20260805-003
  - T-20260805-004
  - T-20260805-005
  - T-20260805-006
  - T-20260805-007
blocks: [T-20260728-003]
parallel_group:
allowed_paths:
  - apps/ios/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
  - apps/ios/docs/TESTING.md
  - apps/ios/docs/MANUAL_QA_CHECKLIST.md
created_by: Development Lead Agent
approved_by:
created_at: 2026-08-05
updated_at: 2026-08-05
report_to: .ai_project/reports/T-20260805-008_ios-accessibility-visual-regression-report.md
qa_to: .ai_project/qa/T-20260805-008_ios-accessibility-visual-regression-qa.md
---

# iOS 접근성·작은 화면·다크 모드·통합 회귀 검증

## 범위

- 390×844·375×667, Light/Dark, 기본/Accessibility 3 조합
- Dynamic Type·VoiceOver label/value/trait·순서·44×44pt
- Core Loop 23개 캡처와 통합 82개 상태 기능 회귀 fixture
- Current·Reference·Diff 증빙과 Blocker/High/Medium/Low 분류

## 성공 기준

- 작은 화면과 접근성 글자 크기에서 필수 콘텐츠·CTA가 잘리지 않는다.
- Core Loop·다시 요리·오류 회복과 draft/Recipe 데이터 보존이 통과한다.
- iOS QA Agent가 실행 역할과 분리된 독립 검증을 수행한다.
- 통합 검증 통과 후에만 상위 `T-20260728-003` 완료 리뷰로 인계한다.
