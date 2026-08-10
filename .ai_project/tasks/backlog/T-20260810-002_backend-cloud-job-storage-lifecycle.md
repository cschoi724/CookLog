---
schema: aiops.task.v1
id: T-20260810-002
title: Backend Cloud datastore·AI job·ACK·24시간 lifecycle 구현
status: proposed
type: feature
priority: P0
priority_reason: in-memory Foundation을 재시작 가능한 스테이징 저장·복구·삭제 경계로 전환해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities: [technical_planning, dependency_management]
ownership:
  paths: [apps/backend/src/storage/, apps/backend/src/jobs/, apps/backend/src/cleanup/, apps/backend/tests/jobs/, apps/backend/tests/cleanup/]
  domains: [job-lifecycle, content-retention]
  documents: [apps/backend/docs/RUNTIME_FOUNDATION.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260728-006]
blocks: [T-20260810-004, T-20260810-006, T-20260729-003]
parallel_group: backend-production-r2-foundation
allowed_paths:
  - apps/backend/src/storage/
  - apps/backend/src/jobs/
  - apps/backend/src/cleanup/
  - apps/backend/tests/jobs/
  - apps/backend/tests/cleanup/
  - apps/backend/docs/RUNTIME_FOUNDATION.md
  - apps/backend/docs/STATUS.md
  - apps/backend/docs/CHANGELOG.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - .ai_project/tasks/active/T-20260729-003_build-production-stt-ai-backend-gateway.md
  - apps/backend/docs/AI_RECIPE_CONTRACT.md
  - apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
created_by: Development Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-10
updated_at: 2026-08-10
report_to: .ai_project/reports/T-20260810-002_backend-cloud-job-storage-lifecycle-report.md
qa_to: .ai_project/qa/T-20260810-002_backend-cloud-job-storage-lifecycle-qa.md
status_ref: origin/develop
status_ref_sha: 1657056
---

# Backend Cloud datastore·AI job·ACK·24시간 lifecycle 구현

## Scope

- Goal: 승인된 Cloud datastore·task queue로 job 상태와 결과 복구·삭제 SLA를 구현한다.
- In scope: production repository, queue adapter, ACK 즉시 delete, 생성 22시간 cleanup, 15분 sweeper, 24시간 접근 차단, idempotent delete·재시작 복구 테스트.
- Out of scope: 사용자 계정·영구 Recipe 저장, production traffic, provider adapter, 원격 STT.
- Acceptance criteria: 재시작·중복 task·cleanup 실패에서도 결과가 24시간 이후 공개되지 않고 삭제 경로가 재현 가능하다.

## Decision Gate

- Product Owner가 Cloud Run·Cloud Tasks·Firestore 지역과 개발·스테이징 리소스 생성을 승인해야 한다.
- 외부 리소스 생성 전 emulator/local adapter로 검증하며 승인 범위를 넘지 않는다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-10 | Development Lead Agent |  | proposed | Cloud job·storage lifecycle 패키지 생성 |
