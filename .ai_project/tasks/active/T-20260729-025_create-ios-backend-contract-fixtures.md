---
schema: aiops.task.v1
id: T-20260729-025
title: iOS·Backend 공용 fixture와 계약 테스트 기준 정의
status: verification_passed
type: test
priority: P0
priority_reason: 구현 전에 양쪽이 같은 정상·오류·복구 schema를 검증해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Completion Role
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
- ".ai_project/tasks/backlog/T-20260729-025_create-ios-backend-contract-fixtures.md"
- ".ai_project/tasks/active/T-20260729-025_create-ios-backend-contract-fixtures.md"
- ".ai_project/reports/T-20260729-025_create-ios-backend-contract-fixtures-report.md"
- ".ai_project/qa/T-20260729-025_create-ios-backend-contract-fixtures-qa.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
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
updated_at: '2026-08-04'
report_to: ".ai_project/reports/T-20260729-025_create-ios-backend-contract-fixtures-report.md"
qa_to: ".ai_project/qa/T-20260729-025_create-ios-backend-contract-fixtures-qa.md"
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

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-31 | Backend Agent | lock | task lock |
| 2026-07-31 | Backend Agent | transition: approved -> in_progress | T-024 완료·최신 origin/develop 기준 공용 fixture와 계약 테스트 작성 시작 |
| 2026-07-31 | Backend Agent | transition: in_progress -> verification_ready | iOS·Backend 공용 fixture·계약 테스트·SERVICES handoff 작성 및 자체 검증 완료, Backend QA 독립 검증 인계 |
| 2026-08-04 | Backend QA Agent | transition: verification_ready -> verification_in_progress | 최신 origin/develop 기준 산출물·보고서·선행 Task 확인 후 독립 검증 시작 |
| 2026-08-04 | Backend QA Agent | transition: verification_in_progress -> rework_requested | 공통 필수 header 불일치와 negative validator 차단력 결함 2건 확인, FAIL 판정 후 Development Lead 재조율 인계 |
| 2026-08-04 | Backend Agent | transition: rework_requested -> in_progress | Product Owner 재작업 요청에 따라 QA-HIGH-025-001~002 수정 시작 |
| 2026-08-04 | Backend Agent | transition: in_progress -> verification_ready | create·poll·ACK header 계약 정합화와 negative 9종 실제 mutation 거부 자기 검증 완료, Backend QA 재검증 인계 |
| 2026-08-04 | Backend QA Agent | transition: verification_ready -> verification_in_progress | QA-HIGH-025-001~002 재작업 산출물과 최신 origin/develop 정렬 확인 후 독립 재검증 시작 |
| 2026-08-04 | Backend QA Agent | transition: verification_in_progress -> verification_passed | QA-HIGH-025-001~002 해소와 기존 계약·민감정보 경계 무회귀 확인, PASS_WITH_RISK로 Development Lead 완료 검토 인계 |
