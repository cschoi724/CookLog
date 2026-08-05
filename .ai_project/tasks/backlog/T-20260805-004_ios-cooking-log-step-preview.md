---
schema: aiops.task.v1
id: T-20260805-004
title: iOS Cooking Log·STEP Preview 자동 저장·오류 상태 구현
status: proposed
type: feature
priority: P0
priority_reason: 10초 기록 반복과 STEP Preview 보존이 CookLog 핵심 기록 경험이다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: iOS Agent
target_role: Execution Role
required_capabilities: [ios_implementation, swiftui, state_management]
depends_on: [T-20260805-003]
blocks: [T-20260805-005, T-20260728-003]
parallel_group:
allowed_paths:
  - apps/ios/CookLog/Features/CookingLog/
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
  - apps/ios/docs/SERVICES.md
created_by: Development Lead Agent
approved_by:
created_at: 2026-08-05
updated_at: 2026-08-05
report_to: .ai_project/reports/T-20260805-004_ios-cooking-log-step-preview-report.md
qa_to: .ai_project/qa/T-20260805-004_ios-cooking-log-step-preview-qa.md
---

# iOS Cooking Log·STEP Preview 자동 저장·오류 상태 구현

## 범위

- Mock Service 기반 10초 기록 반복과 idle·recording·processing 상태
- STEP Preview 자동 저장·삭제·되돌리기·순서 보존
- pending STEP, 권한·녹음·처리 오류와 기존 STEP 보존
- 누적 `[StepPreview]`의 AI Review route 전달

## 성공 기준

- Cooking Log Core Loop 5개 인수 상태와 반복 기록·오류 회복을 검증한다.
- 실패한 pending만 제거하고 기존 완료 STEP과 draft를 보존한다.
- 실제 Apple STT 구현은 `T-20260729-004` 범위로 남긴다.
