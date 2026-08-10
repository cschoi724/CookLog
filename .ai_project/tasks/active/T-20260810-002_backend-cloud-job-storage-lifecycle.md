---
schema: aiops.task.v1
id: T-20260810-002
title: Backend Cloud datastore·AI job·ACK·24시간 lifecycle 구현
status: approved
type: feature
priority: P0
priority_reason: in-memory Foundation을 재시작 가능한 스테이징 저장·복구·삭제 경계로 전환해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Backend Agent
target_role: Execution Role
required_capabilities: [backend_architecture, implementation, developer_verification]
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
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-10
updated_at: 2026-08-10
report_to: .ai_project/reports/T-20260810-002_backend-cloud-job-storage-lifecycle-report.md
qa_to: .ai_project/qa/T-20260810-002_backend-cloud-job-storage-lifecycle-qa.md
status_ref: origin/develop
status_ref_sha: 0416401ecc6ed68179d630ea8bd3fc6017ed4adf
---

# Backend Cloud datastore·AI job·ACK·24시간 lifecycle 구현

## Scope

- Goal: 승인된 Cloud datastore·task queue로 job 상태와 결과 복구·삭제 SLA를 구현한다.
- In scope: production repository, queue adapter, ACK 즉시 delete, 생성 22시간 cleanup, 15분 sweeper, 24시간 접근 차단, idempotent delete·재시작 복구 테스트.
- Out of scope: 사용자 계정·영구 Recipe 저장, production traffic, provider adapter, 원격 STT.
- Acceptance criteria: 재시작·중복 task·cleanup 실패에서도 결과가 24시간 이후 공개되지 않고 삭제 경로가 재현 가능하다.

## Decision Gate

- 2026-08-10 Product Owner 승인: Cloud Run·Cloud Tasks·Firestore는 `asia-northeast3` 서울을 사용한다.
- 이번 승인은 구현과 emulator/local 검증 범위이며 실제 개발·스테이징 리소스 생성은 별도 외부 변경 게이트로 유지한다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-10 | Development Lead Agent |  | proposed | Cloud job·storage lifecycle 패키지 생성 |
| 2026-08-10 | Development Lead Agent | proposed | scoped | 서울 리전·22시간 삭제·15분 sweeper·24시간 접근 차단 범위 조율 완료 |
| 2026-08-10 | Product Owner | scoped | approved | 추천 결정안과 T-20260810-001~005 실행 승인 |

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Backend Agent / Execution Role이야. Task T-20260810-002는 승인된 실행 Task야.

- 현재 상태: approved
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 0416401ecc6ed68179d630ea8bd3fc6017ed4adf
- 다음에 해야 할 일: allowed_paths 안에서 datastore·job·ACK·22시간 삭제·15분 sweeper·24시간 접근 차단을 구현하고 emulator/local 검증 보고를 작성해줘.
- 기준 문서: 상위 Task, AI Recipe 계약, 보안·개인정보·관측성 문서
- 허용 경로: front matter의 `allowed_paths`
- 참고 산출물: 이 Task 파일
- 변경/검토 대상: `apps/backend/src/storage/`, `jobs/`, `cleanup/` 및 대응 테스트
- 남은 리스크: Firestore 위치는 생성 후 변경할 수 없다.
- 차단/결정 필요: 실제 Google Cloud 리소스 생성·배포는 이번 Task 승인 범위 밖이다.
- 완료 시: status를 verification_ready로 바꾸고 target_agent를 Backend QA Agent, target_role을 Verification Role로 넘겨줘.
