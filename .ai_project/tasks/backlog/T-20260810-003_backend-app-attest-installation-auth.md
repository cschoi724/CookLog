---
schema: aiops.task.v1
id: T-20260810-003
title: Backend App Attest·설치 token·abuse 방어 구현
status: proposed
type: feature
priority: P0
priority_reason: 로그인 없는 첫 출시에서 익명 무제한 provider 호출과 설치 위조를 차단해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities: [technical_planning, dependency_management]
ownership:
  paths: [apps/backend/src/auth/, apps/backend/src/limits/, apps/backend/tests/auth/, apps/backend/contracts/common/]
  domains: [app-attestation, installation-auth, abuse-prevention]
  documents: [apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260728-006]
blocks: [T-20260810-004, T-20260810-006, T-20260729-003]
parallel_group: backend-production-r2-foundation
allowed_paths:
  - apps/backend/src/auth/
  - apps/backend/src/limits/
  - apps/backend/tests/auth/
  - apps/backend/contracts/common/
  - apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
  - apps/backend/docs/STATUS.md
  - apps/backend/docs/CHANGELOG.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - .ai_project/tasks/active/T-20260729-003_build-production-stt-ai-backend-gateway.md
  - apps/backend/docs/API_CONTRACT.md
  - apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
created_by: Development Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-10
updated_at: 2026-08-10
report_to: .ai_project/reports/T-20260810-003_backend-app-attest-installation-auth-report.md
qa_to: .ai_project/qa/T-20260810-003_backend-app-attest-installation-auth-qa.md
status_ref: origin/develop
status_ref_sha: 1657056
---

# Backend App Attest·설치 token·abuse 방어 구현

## Scope

- Goal: App Attest 기반 설치 신뢰와 제한된 단기 token 경계로 provider 호출을 보호한다.
- In scope: challenge·assertion 검증, 설치 token 발급·회전·폐기, replay·clock skew·위조 차단, installation/IP/project rate limit, 제한된 compatibility 정책 테스트.
- Out of scope: 사용자 로그인·계정, iOS App Attest client 구현, production traffic.
- Acceptance criteria: attestation 실패·replay·만료·위조가 provider side effect 전에 차단되고 compatibility 경로가 무제한 익명 접근을 만들지 않는다.

## Decision Gate

- Product Owner가 App Attest 필수 범위와 개발·Simulator compatibility 제한을 승인해야 한다.
- iOS client 변경이 필요하면 별도 iOS Task로 분리하며 이 Task의 allowed path를 넓히지 않는다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-10 | Development Lead Agent |  | proposed | 설치 인증·abuse 방어 패키지 생성 |
