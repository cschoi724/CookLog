---
schema: aiops.task.v1
id: T-20260810-006
title: Backend 스테이징 composition·배포·rollback 통합
status: proposed
type: feature
priority: P0
priority_reason: 개별 production adapter를 하나의 재현 가능한 스테이징 후보와 운영 중단·복구 절차로 통합해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities: [technical_planning, dependency_management]
ownership:
  paths: [apps/backend/src/app/, apps/backend/src/config/, apps/backend/Dockerfile, apps/backend/package.json, apps/backend/package-lock.json, .github/workflows/]
  domains: [staging-deployment, production-composition, rollback]
  documents: [apps/backend/README.md, apps/backend/docs/RUNTIME_FOUNDATION.md]
ownership_review:
  required: true
  reviewer: Development Lead Agent
depends_on: [T-20260810-001, T-20260810-002, T-20260810-003, T-20260810-004, T-20260810-005]
blocks: [T-20260729-003, T-20260729-005, T-20260728-009]
parallel_group:
allowed_paths:
  - apps/backend/src/app/
  - apps/backend/src/config/
  - apps/backend/tests/integration/
  - apps/backend/tests/health/
  - apps/backend/Dockerfile
  - apps/backend/package.json
  - apps/backend/package-lock.json
  - apps/backend/README.md
  - apps/backend/docs/
  - .github/workflows/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - .ai_project/tasks/active/T-20260729-003_build-production-stt-ai-backend-gateway.md
  - apps/backend/docs/ARCHITECTURE_DECISION.md
  - apps/backend/docs/RUNTIME_FOUNDATION.md
created_by: Development Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-10
updated_at: 2026-08-10
report_to: .ai_project/reports/T-20260810-006_backend-staging-deploy-rollback-integration-report.md
qa_to: .ai_project/qa/T-20260810-006_backend-staging-deploy-rollback-integration-qa.md
status_ref: origin/develop
status_ref_sha: 1657056
---

# Backend 스테이징 composition·배포·rollback 통합

## Scope

- Goal: 앞선 production adapter를 Node 24 non-root 스테이징 composition과 재현 가능한 배포·중단·rollback 절차로 통합한다.
- In scope: production dependency wiring, secret injection interface, health/readiness, migration/startup fail-closed, CI container·integration test, staging deploy automation, rollback·service disable runbook.
- Out of scope: production traffic 전환, iOS client, App Store/TestFlight, 원격 STT 활성화.
- Acceptance criteria: 새 clone·container·staging에서 핵심 AI job과 장애·삭제·cutoff가 재현되고 secret·콘텐츠 로그가 없으며 rollback과 disable이 검증된다.

## Decision Gate

- 앞선 T-001~005가 공용 `develop`에서 `done`이어야 한다.
- Product Owner가 개발·스테이징 cloud resource와 secret 설정을 별도 승인해야 한다.
- production 전환은 T-20260728-009 승인 전 금지한다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-10 | Development Lead Agent |  | proposed | 스테이징 통합·배포·rollback 패키지 생성 |
