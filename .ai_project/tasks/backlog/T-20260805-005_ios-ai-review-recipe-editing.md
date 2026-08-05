---
schema: aiops.task.v1
id: T-20260805-005
title: iOS AI Review·완료 Recipe 편집·삭제 구현
status: proposed
type: feature
priority: P0
priority_reason: 기록을 사용자가 검토 가능한 Recipe로 전환하고 수정·저장 실패에서도 입력을 보존해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: iOS Agent
target_role: Execution Role
required_capabilities: [ios_implementation, swiftui, state_management]
depends_on: [T-20260805-004]
blocks: [T-20260805-006, T-20260728-003]
parallel_group:
allowed_paths:
  - apps/ios/CookLog/Features/AIReview/
  - apps/ios/CookLog/Features/RecipeDetail/
  - apps/ios/CookLog/Domain/
  - apps/ios/CookLogTests/
  - apps/ios/docs/STATUS.md
  - apps/ios/docs/DEVELOPMENT_PLAN.md
  - apps/ios/docs/CHANGELOG.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
  - apps/ios/docs/NAVIGATION.md
created_by: Development Lead Agent
approved_by:
created_at: 2026-08-05
updated_at: 2026-08-05
report_to: .ai_project/reports/T-20260805-005_ios-ai-review-recipe-editing-report.md
qa_to: .ai_project/qa/T-20260805-005_ios-ai-review-recipe-editing-qa.md
---

# iOS AI Review·완료 Recipe 편집·삭제 구현

## 범위

- Mock AI 처리·오류·재시도와 Review 필드·단계 편집
- 수동 임시 저장, 이탈 경고, 변경 버리기 snapshot 복원
- 완료 Recipe 수정·영구 삭제·저장 실패 보존
- 키보드 회피와 `[StepPreview]` 입력 유지

## 성공 기준

- AI Review 5개 Core Loop 상태와 Recipe Detail 관련 상태를 검증한다.
- 생성·저장 실패에서도 모든 입력과 원본 STEP Preview가 보존된다.
- 실제 Backend AI 연동은 `T-20260729-005` 범위로 남긴다.
