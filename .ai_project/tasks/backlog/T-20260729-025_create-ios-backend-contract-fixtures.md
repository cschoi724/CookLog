---
schema: aiops.task.v1
id: T-20260729-025
title: iOS·Backend 공용 fixture와 계약 테스트 기준 정의
status: approved
type: test
priority: P0
priority_reason: 구현 전에 양쪽이 같은 정상·오류·복구 schema를 검증해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Backend Agent
target_role: Execution Role
required_capabilities:
  - api_contract
  - backend_architecture
depends_on:
  - T-20260729-021
  - T-20260729-022
  - T-20260729-023
  - T-20260729-024
blocks:
  - T-20260728-005
parallel_group:
allowed_paths:
  - apps/backend/contracts/fixtures/
  - apps/backend/tests/contracts/
  - apps/ios/docs/SERVICES.md
  - .ai_project/tasks/backlog/T-20260729-025_create-ios-backend-contract-fixtures.md
  - .ai_project/tasks/active/T-20260729-025_create-ios-backend-contract-fixtures.md
  - .ai_project/reports/T-20260729-025_create-ios-backend-contract-fixtures-report.md
  - .ai_project/qa/T-20260729-025_create-ios-backend-contract-fixtures-qa.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - apps/backend/docs/API_CONTRACT.md
  - apps/backend/docs/AI_RECIPE_CONTRACT.md
  - apps/backend/docs/REMOTE_STT_ADAPTER.md
  - apps/ios/docs/SERVICES.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: 2026-07-30
report_to: .ai_project/reports/T-20260729-025_create-ios-backend-contract-fixtures-report.md
qa_to: .ai_project/qa/T-20260729-025_create-ios-backend-contract-fixtures-qa.md
---

# iOS·Backend 공용 fixture와 계약 테스트 기준 정의

## 범위

- AI 정상·오류·timeout·만료 fixture
- 비활성 원격 STT 계약 fixture와 무승인 호출 방지 시나리오
- schema version·error code·idempotency 계약 테스트
- iOS client handoff 문서 동기화

## 성공·검증 기준

- 동일 fixture를 Backend 계약 테스트와 iOS mock client가 사용할 수 있다.
- Backend QA Agent가 fixture의 계약 추적성과 민감정보 비포함을 독립 검증한다.
