---
schema: aiops.task.v1
id: T-20260810-002
title: Backend Cloud datastore·AI job·ACK·24시간 lifecycle 구현
status: done
type: feature
priority: P0
priority_reason: in-memory Foundation을 재시작 가능한 스테이징 저장·복구·삭제 경계로 전환해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent:
target_role:
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
status_ref_sha: d8fc12f3d9d5d854a76fad60ab1ed6dcbc85ebb3
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
| 2026-08-10 | Backend Agent | approved | in_progress | canonical `origin/develop@d8fc12f` 확인 후 전용 worktree에서 lock 획득 |
| 2026-08-10 | Backend Agent | in_progress | verification_ready | repository port·서울 리전 local adapter·재시작/outbox·22h/15m/23h/23h45/24h lifecycle 구현, 116/116·계약 5종·경계 감사 통과 후 lock 해제 |
| 2026-08-10 | Backend QA Agent | verification_ready | verification_in_progress | canonical·라우팅·보고서·선행 Task 확인 후 독립 검증 lock 획득 |
| 2026-08-10 | Backend QA Agent | verification_in_progress | rework_requested | FAIL: Node 24 포함 116/116은 통과했으나 새 datastore adapter 생성 시 모든 상태와 idempotency가 소실되어 실제 프로세스 재시작 복구 수용 조건 불충족 |
| 2026-08-10 | Product Owner | rework_requested | approved | QA-HIGH-810002-001 재작업 승인: process 밖 durable backing 계약과 새 adapter 경계의 job·ACK·outbox·cleanup·idempotency 복구 회귀를 구현 범위로 확정 |
| 2026-08-10 | Backend Agent | approved | in_progress | QA-HIGH-810002-001 재작업 lock 획득; process 밖 durable backing과 새 adapter/process 복구 회귀 착수 |
| 2026-08-10 | Backend Agent | in_progress | verification_ready | WeakMap 제거·durable local backing·child process 4단계·cleanup pending 새 adapter 복구 구현, 119/119·계약 5종·경계 감사 통과 후 lock 해제 |
| 2026-08-10 | Backend QA Agent | verification_ready | verification_in_progress | 기준 SHA·라우팅·재작업 보고서 확인 후 QA-HIGH-810002-001 독립 재검증 lock 획득 |
| 2026-08-10 | Backend QA Agent | verification_in_progress | rework_requested | FAIL: 순차 process 복구는 해소됐으나 stale durable snapshot 두 개가 동일 worker를 각각 완료해 provider 2회 호출하고 동일 idempotency create를 서로 다른 job으로 이중 승인 |
| 2026-08-10 | Product Owner | rework_requested | approved | QA-HIGH-810002-002 재작업 승인: durable mutation의 cross-process transaction/CAS 또는 동등한 단일 소유권과 stale adapter 경쟁 회귀를 구현 범위로 확정 |
| 2026-08-10 | Backend Agent | approved | in_progress | QA-HIGH-810002-002 재작업 lock 획득; cross-process transaction과 stale adapter 경쟁 회귀 착수 |
| 2026-08-10 | Backend Agent | in_progress | verification_ready | backing별 cross-process transaction·최신 state 재로딩과 stale create/worker/ACK/cleanup/outbox 경쟁 회귀 구현, 122/122·계약 5종·경계 감사 통과 후 lock 해제 |
| 2026-08-10 | Backend QA Agent | verification_ready | verification_in_progress | 기준 SHA·라우팅·재작업 보고서 확인 후 QA-HIGH-810002-002 원본 반례 독립 재검증 lock 획득 |
| 2026-08-10 | Backend QA Agent | verification_in_progress | verification_passed | PASS_WITH_RISK: Node 24/26 122/122·계약 5종·경계 감사 통과, stale create는 신규 1+replay 1·worker는 provider 총 1회로 HIGH 해소; 실제 Firestore/Cloud Tasks 미검증 위험 인계 |
| 2026-08-10 | Development Lead Agent | verification_passed | completion_review | 완료 리뷰 PASS_WITH_RISK: 승인된 local/emulator 수용 조건과 HIGH 2건 해소를 수용하고 실제 Firestore·Cloud Tasks 통합은 T-20260810-006 외부 변경 게이트로 유지 |
| 2026-08-10 | Product Owner | completion_review | done | 잔여 위험을 T-20260810-006 외부 변경 게이트로 유지하는 조건으로 최종 완료와 구현·보고·QA 결과의 develop 대상 PR 병합 승인 |

## Completion Review

- 판정: `PASS_WITH_RISK`
- 수용 근거: `QA-HIGH-810002-001`, `QA-HIGH-810002-002`가 원본 반례에서 해소됐고 Node 24/26 122/122, 계약 validator 5종, 경계 감사가 통과했다.
- 범위 판단: 이번 Task의 Decision Gate는 구현과 emulator/local 검증만 승인하며 실제 Cloud 리소스 생성은 제외한다. 따라서 실제 Firestore transaction·Cloud Tasks dedupe/장애 의미론 미검증은 이번 Task 재작업 사유가 아니다.
- 위험 소유권: 실제 production dependency wiring, staging integration, resource·secret 설정과 rollback 검증은 `T-20260810-006`이 소유한다.
- 완료 조건: Product Owner가 위 잔여 위험을 수용하고 구현·보고·QA 결과의 PR 병합을 승인했다.
- 의존성 주의: `T-20260810-004`, `T-20260810-006`, `T-20260729-003`의 선행 해제는 Task가 canonical `origin/develop`에서 `done`으로 확인된 뒤에만 가능하다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

Task T-20260810-002는 Product Owner 최종 승인을 받아 완료됐다.

- 현재 상태: done
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: d8fc12f3d9d5d854a76fad60ab1ed6dcbc85ebb3
- 검증 대상: `task/T-20260810-002-storage-lifecycle` worktree의 미커밋 변경
- QA 보고서: `.ai_project/qa/T-20260810-002_backend-cloud-job-storage-lifecycle-qa.md`
- QA 판정: `PASS_WITH_RISK`
- 해소 확인: `QA-HIGH-810002-001`, `QA-HIGH-810002-002`
- 독립 증거: Node 26 `npm run verify` 122/122·계약 5종·경계 감사 PASS, Node 24.18.0 122/122 PASS. 원본 stale create는 동일 job의 신규 1건+replay 1건, stale duplicate worker는 completed 1건+ignored 1건·provider 총 1회였다.
- 다음에 해야 할 일: 구현·보고·QA 결과를 develop 대상 PR로 병합하고 canonical `origin/develop`에서 `done`을 확인해줘.
- 기준 문서: 상위 Task, AI Recipe 계약, 보안·개인정보·관측성 문서
- 잔여 위험: 구현은 synthetic durable file/local queue 계약에서만 검증됐고 실제 Firestore transaction·Cloud Tasks dedupe/장애 의미론은 검증하지 않았다. 실제 리소스·credential·배포는 별도 외부 변경 게이트다.
- 차단/결정 필요: 실제 provider/network 호출, Google Cloud 리소스 생성·배포 없이 완료 리뷰를 진행한다.
- 병합 후: canonical 상태를 확인한 뒤에만 `T-20260810-004`, `T-20260810-006`, `T-20260729-003`의 dependency 해제 여부를 판단해줘.
