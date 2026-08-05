---
schema: aiops.task.v1
id: T-20260805-006
title: iOS Audio Guide·핸즈프리 UI·공통 action model 구현
status: proposed
type: feature
priority: P0
priority_reason: 저장 Recipe를 다시 요리하는 핵심 경험과 향후 음성·버튼 입력의 동등한 action 경계를 고정해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: iOS Agent
target_role: Execution Role
required_capabilities: [ios_implementation, swiftui, accessibility]
depends_on: [T-20260805-005]
blocks: [T-20260805-007, T-20260728-003]
parallel_group:
allowed_paths:
  - apps/ios/CookLog/Features/AudioPlayer/
  - apps/ios/CookLog/Services/AudioGuide/
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
report_to: .ai_project/reports/T-20260805-006_ios-audio-guide-handsfree-ui-report.md
qa_to: .ai_project/qa/T-20260805-006_ios-audio-guide-handsfree-ui-qa.md
---

# iOS Audio Guide·핸즈프리 UI·공통 action model 구현

## 범위

- 이전·재생/정지·다음·현재 단계 다시 듣기와 경계 상태
- Audio Player 로딩·오류·단계 없음·not-found subtype
- 버튼과 향후 핸즈프리 입력이 공유하는 action model·fallback UI
- 오디오 중단·화면 이탈 시 재생 보존·중지 화면 상태

## 성공 기준

- Audio Player 5개 Core Loop 상태와 통합 핸즈프리 상태를 검증한다.
- 버튼만으로 모든 핵심 action을 수행할 수 있다.
- 실제 로컬 TTS와 음성 인식 엔진은 `T-20260729-006` 범위로 남긴다.
