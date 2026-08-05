---
schema: aiops.task.v1
id: T-20260805-007
title: iOS 앱 정보·권한·오프라인·서비스 장애 상태 구현
status: proposed
type: feature
priority: P0
priority_reason: 첫 공개 출시에서 법적·데이터 안내와 서비스 실패 시 데이터 보존 경계를 제공해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: iOS Agent
target_role: Execution Role
required_capabilities: [ios_implementation, swiftui, error_handling]
depends_on: [T-20260805-006]
blocks: [T-20260805-008, T-20260728-003]
parallel_group:
allowed_paths:
  - apps/ios/CookLog/Features/AppInfo/
  - apps/ios/CookLog/Features/
  - apps/ios/CookLog/App/
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
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - docs/product/CookLog_PRD_v2.md
created_by: Development Lead Agent
approved_by:
created_at: 2026-08-05
updated_at: 2026-08-05
report_to: .ai_project/reports/T-20260805-007_ios-app-info-offline-failures-report.md
qa_to: .ai_project/qa/T-20260805-007_ios-app-info-offline-failures-qa.md
---

# iOS 앱 정보·권한·오프라인·서비스 장애 상태 구현

## 범위

- 앱 정보, 문의, 개인정보처리방침·이용약관·데이터 보관 안내
- 권한 거부·오프라인·서비스 장애·재시도 상태
- 실패 중 기존 draft·Recipe 보존과 접근 가능한 fallback

## 성공 기준

- 통합 핸드오프의 App Info·권한·service-failure 상태를 구현한다.
- 외부 URL 미설정은 명시적 비차단 안내로 처리하고 임의 URL을 만들지 않는다.
- 실패가 로컬 데이터 삭제나 완료로 오인되지 않는다.
