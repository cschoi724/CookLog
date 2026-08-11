---
schema: aiops.task.v1
id: T-20260810-006
title: Backend 스테이징 composition·배포·rollback 통합
status: approved
type: feature
priority: P0
priority_reason: 개별 production adapter를 하나의 재현 가능한 스테이징 후보와 운영 중단·복구 절차로 통합해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Backend Agent
target_role: Execution Role
required_capabilities: [backend_architecture, api_contract, backend_implementation]
ownership:
  paths:
    - apps/backend/AGENTS.md
    - apps/backend/src/app/
    - apps/backend/src/config/
    - apps/backend/src/adapters/
    - apps/backend/deploy/staging/
    - apps/backend/scripts/
    - apps/backend/Dockerfile
    - apps/backend/package.json
    - apps/backend/package-lock.json
    - .github/workflows/backend-staging.yml
    - .github/workflows/backend-verify.yml
  domains: [staging-deployment, production-composition, cloud-adapters, secret-injection, rollback]
  documents:
    - apps/backend/AGENTS.md
    - apps/backend/README.md
    - apps/backend/docs/ARCHITECTURE_DECISION.md
    - apps/backend/docs/RUNTIME_FOUNDATION.md
    - apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
    - apps/backend/docs/REMOTE_STT_ADAPTER.md
ownership_review:
  required: false
  reviewer: Development Lead Agent
depends_on: [T-20260810-001, T-20260810-002, T-20260810-003, T-20260810-004, T-20260810-005]
blocks: [T-20260729-003, T-20260729-005, T-20260728-009]
parallel_group: backend-production-staging-exclusive
allowed_paths:
  - apps/backend/AGENTS.md
  - apps/backend/src/app/
  - apps/backend/src/config/
  - apps/backend/src/adapters/
  - apps/backend/tests/integration/
  - apps/backend/tests/health/
  - apps/backend/tests/staging/
  - apps/backend/scripts/
  - apps/backend/deploy/staging/
  - apps/backend/Dockerfile
  - apps/backend/.dockerignore
  - apps/backend/.env.example
  - apps/backend/package.json
  - apps/backend/package-lock.json
  - apps/backend/README.md
  - apps/backend/docs/
  - .github/workflows/backend-staging.yml
  - .github/workflows/backend-verify.yml
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - .ai_project/tasks/active/T-20260729-003_build-production-stt-ai-backend-gateway.md
  - .ai_project/tasks/active/T-20260810-001_backend-production-ai-provider-adapter.md
  - .ai_project/tasks/active/T-20260810-002_backend-cloud-job-storage-lifecycle.md
  - .ai_project/tasks/active/T-20260810-003_backend-app-attest-installation-auth.md
  - .ai_project/tasks/active/T-20260810-004_backend-production-cost-observability.md
  - .ai_project/tasks/active/T-20260810-005_backend-production-remote-stt-disabled-proof.md
  - apps/backend/docs/ARCHITECTURE_DECISION.md
  - apps/backend/docs/RUNTIME_FOUNDATION.md
  - apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
  - apps/backend/docs/REMOTE_STT_ADAPTER.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-10
updated_at: 2026-08-11
report_to: .ai_project/reports/T-20260810-006_backend-staging-deploy-rollback-integration-report.md
qa_to: .ai_project/qa/T-20260810-006_backend-staging-deploy-rollback-integration-qa.md
status_ref: origin/develop
status_ref_sha: 2a002a6948eb8b32038b8102214ca12d5174a171
worktree_path: /private/tmp/cooklog-t20260810-006-scope
worktree_role: Lead Role
---

# Backend 스테이징 composition·배포·rollback 통합

## Scope

- Goal: 앞선 production port·adapter를 Node 24 non-root의 단일 production composition과
  재현 가능한 private staging 배포·중단·rollback 절차로 통합한다.
- 현재 gap: canonical production `server.ts`는 `buildApp()`의 `/healthz`만 제공하며 T-002~004의
  Firestore·Cloud Tasks·App Attest/KMS·Billing/sink 경계는 local/synthetic adapter까지만
  검증됐다. T-006은 단순 workflow 추가가 아니라 이 concrete composition gap을 소유한다.
- In scope: production composition root, typed config와 secret reference interface, concrete cloud
  adapter, health/readiness/startup fail-closed, Node 24 non-root container, staging manifest와 CI
  validation, 수동 배포 workflow, smoke·rollback·service disable runbook과 통합 QA 준비.
- Out of scope: production project·traffic 전환, iOS client, App Store/TestFlight, 원격 STT·음성
  upload 활성화, 사용자 계정·영구 레시피 저장, 승인 없는 provider 호출·billing·credential.
- Acceptance criteria: 동일 코드 SHA의 새 clone·container·private staging에서 핵심 AI job,
  App Attest/installation token, ACK·22h cleanup·24h 접근 차단, hard cutoff·required sink,
  remote STT capability 0, revision rollback과 service disable이 fail-closed로 재현된다.

## Work Packages

1. `WP-C1 — production composition·config`
   - `createProductionRuntime()` 또는 동등한 단일 composition root에서만 production dependency를
     조립한다. local in-memory adapter가 production에 주입되면 startup을 거부한다.
   - `GOOGLE_APPLICATION_CREDENTIALS`와 service-account JSON을 계속 거부하고 Cloud Run service
     identity/ADC를 사용한다. secret 값이 아니라 Secret Manager resource/version 또는 mount
     path만 typed config에 허용하며 값·path·credential을 health/log에 노출하지 않는다.
2. `WP-C2 — concrete staging adapters`
   - 새 `apps/backend/src/adapters/`가 Firestore transaction, Cloud Tasks dedupe/delivery,
     App Attest verification port, durable installation/JTI revocation, signing key rotation replay,
     provider transport, distributed cost ledger·required telemetry sink를 기존 domain 계약에 연결한다.
   - 기존 T-001~005 domain 구현을 다시 소유하지 않고 port 계약 변경이 필요하면 Lead 재조율을
     요청한다. package/lockfile과 composition root는 이 Task의 단일 Backend lock이 소유한다.
3. `WP-C3 — manifest·CI·staging deployment`
   - 비밀값 없는 `apps/backend/deploy/staging/` manifest와 validator를 추가한다. region,
     service identity, min instance 0, concurrency 1, private ingress/IAM, pinned image digest,
     secret version reference, remote STT disabled를 fail-closed로 검사한다.
   - `.github/workflows/backend-staging.yml`은 `workflow_dispatch` 전용이며 기본 mode는 validation이다.
     deploy/rollback/disable job은 `staging` environment, `contents: read`, job 한정
     `id-token: write`, 환경 단일 concurrency와 `cancel-in-progress: false`를 사용한다.
   - Google·GitHub third-party Actions는 검토한 full commit SHA로 고정하고 장기 service-account
     JSON key를 사용하지 않는다. 기존 `backend-verify`, iOS 2종, Design Pages workflow는
     수정·자동 실행·권한 확장하지 않는다.
4. `WP-C4 — rollout·rollback·disable`
   - 후보 revision은 먼저 staging에서 private smoke를 통과해야 한다. 이전 healthy revision,
     image digest, config/secret version을 기록하고 failure 시 traffic을 이전 revision 100%로
     복구한다. rollback 뒤 remote STT capability 0, ACK/cleanup, cost cutoff를 다시 검증한다.
   - cleanup age critical, required sink 장애, cost manifest/Billing reconciliation stale,
     auth/durable repository 장애 시 새 AI job을 중단하는 service-disable 절차를 검증한다.
5. `WP-C5 — integration evidence·QA handoff`
   - 전체 Backend verify·계약 5종·container, staging manifest negative mutation, multi-instance
     transaction·restart/replay, provider at-most-once, 22h/24h lifecycle, Billing/sink 장애,
     deploy/smoke/rollback/disable 결과를 secret·콘텐츠 없이 report에 남긴다.

## Ownership Review

- 판정: `APPROVED_WITH_EXTERNAL_GATE`.
- 선행 의존성: `T-20260810-001~005`는 canonical
  `origin/develop@2a002a6948eb8b32038b8102214ca12d5174a171`에서 모두 `done`이다.
- path 충돌: 현재 실행 중인 iOS·Design Task와 겹치지 않는다. 완료된 Backend Task의 domain
  경계를 소비하되 새 concrete adapter는 `src/adapters/`, manifest는 `deploy/staging/`, deploy
  workflow는 `backend-staging.yml`로 격리한다.
- CI 충돌: 기존 `backend-verify.yml`은 `apps/backend/**`와 `backend-*.yml` PR 변경을 이미
  검증한다. 새 deploy workflow는 PR/push 자동 trigger 없이 수동 전용으로 두므로 기존 required
  checks·Design Pages workflow와 실행 충돌이 없다.
- 병렬 경계: package-lock, Dockerfile, production composition, cloud adapter, backend deploy
  workflow를 단일 Task가 소유하므로 다른 Backend Execution Task와 병렬 실행하지 않는다.
  iOS·Design은 허용 경로가 겹치지 않아 병렬 가능하다.
- 문서 충돌: 추천안은 Cloud Run `asia-northeast3`, remote STT capability 0, ACK 즉시·22h
  cleanup·24h 접근 차단, 월 KRW 50,000 cutoff를 하향 변경하지 않는다.
- 플랫폼 지침 충돌: `apps/backend/AGENTS.md`는 Foundation 기준으로 실제 provider·cloud
  배포를 전면 금지한다. Execution Role은 이 파일을 삭제·완화하지 않고 T-006 Gate A/B에서
  명시적으로 승인된 경로만 예외로 추가하며 production·remote STT 금지는 유지한다.

## Decision Gate

- Gate A — repository implementation: Product Owner가 위 Work Package와 전용 경로에서
  repository-only 구현·local/container/emulator 검증을 승인해야 한다. 이 승인만으로 cloud
  resource 생성, secret 등록, workflow 실행 또는 provider 호출을 허용하지 않는다.
- Gate B — external staging: 별도 승인으로 dedicated staging GCP project, `asia-northeast3`,
  Artifact Registry, private Cloud Run gateway/worker, Firestore, Cloud Tasks, Scheduler,
  Secret Manager/KMS, service identities, Billing export/required sink, GitHub OIDC Workload
  Identity Federation와 `staging` environment 설정 범위를 확정해야 한다.
- Gate B에는 OpenAI MAM/ZDR·Modified Retention, 한국 저장/국외 처리, 실제 provider secret과
  Apple App Attest 검증 자격·key의 승인 여부를 명시한다. 미승인 항목은 synthetic/emulator
  상태로 유지하고 실제 staging PASS를 주장하지 않는다.
- production resource·traffic·공개 endpoint 전환은 `T-20260728-009`의 Release 승인 전 금지한다.
- Gate A 또는 Gate B 승인 전에는 Task를 `approved`로 바꾸거나 Backend Agent가 lock을
  획득하지 않는다.

## External Technical References

- Google Cloud Run revision·rollback: https://docs.cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration
- Cloud Run Secret Manager 구성: https://docs.cloud.google.com/run/docs/configuring/services/secrets
- Google Cloud deployment pipeline WIF: https://docs.cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines
- GitHub deployment environment 보호: https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments
- GitHub Actions full SHA pinning: https://docs.github.com/en/actions/reference/security/secure-use

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-10 | Development Lead Agent |  | proposed | 스테이징 통합·배포·rollback 패키지 생성 |
| 2026-08-11 | Development Lead Agent | proposed | scoped | T-001~005 canonical done 확인, production composition gap·전용 adapter/manifest/workflow ownership·CI 비충돌·외부 Gate A/B와 최종 검증 범위 확정 |
| 2026-08-11 | Product Owner | scoped | approved | Gate A repository-only 구현·local/container/emulator 검증 승인, Gate B cloud resource·secret·provider 호출·external staging 보류, Backend Agent 실행 인계 승인 |

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Product Lead Agent / Direction Role이야.
Task T-20260810-006의 기술 scope와 ownership review가 완료됐어.

- 현재 상태: `scoped`
- 기준 상태 ref/SHA: `origin/develop@2a002a6948eb8b32038b8102214ca12d5174a171`
- 다음에 해야 할 일: Product Owner에게 Gate A repository-only 실행 승인과 Gate B external
  staging resource·secret·provider 범위 승인을 분리해 요청해.
- 기준 문서: Task `source_of_truth` 전체
- 허용 경로: Task frontmatter의 `allowed_paths`; `.github/workflows/` 전체가 아니라
  `backend-staging.yml`과 필요한 `backend-verify.yml`만 허용
- 참고 산출물: T-001~005 report·QA·Completion Review, 이 Task의 Work Packages
- 변경/검토 대상: production composition, `src/adapters/`, `deploy/staging/`, Node 24 container,
  backend staging workflow와 rollback/disable runbook
- 남은 리스크: 실제 Firestore/Tasks/App Attest/KMS/Billing/provider handshake와 multi-instance
  장애 의미론은 외부 staging 전 미검증
- 차단/결정 필요: Gate A/B 승인 범위, dedicated GCP staging project, WIF/IAM, secret versions,
  OpenAI MAM/ZDR·Modified Retention·국외 처리, Apple App Attest 자격/key
- 승인 시: Gate A만 승인하면 외부 호출 0의 repository 구현으로, Gate A+B를 승인하면 명시된
  staging 범위까지 `approved`, Backend Agent / Execution Role로 인계해.
- 주의: production 트래픽, 공개 endpoint, 원격 STT·음성 upload는 계속 금지야.

## Gate A 실행 승인 및 Backend 인계

- 승인 범위: Work Package `WP-C1~C5`의 repository 산출물 구현, local/container/emulator
  검증, 비밀값 없는 manifest·validator, 수동 workflow 정의, rollback·disable runbook 작성.
- 보류 범위: GCP project/API/IAM/WIF/environment 설정, Artifact Registry·Cloud Run·Firestore·
  Cloud Tasks·Scheduler·Secret Manager/KMS·Billing resource 생성, secret 등록, workflow 실행,
  image push, 외부 endpoint/provider/Apple 호출과 실제 staging 배포.
- 실행 규칙: Backend Agent는 최신 canonical에서 전용 worktree와 단일 lock을 획득하고 Gate A
  범위만 구현한다. Gate B 없이는 실제 staging PASS·provider handshake·rollback 실행 성공을
  주장하지 않고 repository contract와 emulator/synthetic 검증으로 명확히 구분한다.
- 완료 시: report에 실제 외부 변경·호출 0건을 기록하고 `verification_ready`, Backend QA Agent /
  Verification Role로 인계한다. Backend QA도 Gate A 범위만 독립 검증하고 Gate B 미실행을
  잔여 위험 및 후속 decision gate로 유지한다.

다음 Agent에게 전달할 말:

너는 Backend Agent / Execution Role이야.
Task T-20260810-006의 Gate A repository-only 구현은 승인됐어.

- 현재 상태: `approved`
- 기준 상태 ref/SHA: `origin/develop@2a002a6948eb8b32038b8102214ca12d5174a171`
- 다음에 해야 할 일: 최신 canonical 기반 전용 worktree에서 lock을 획득하고 `WP-C1~C5`의
  repository-only 범위를 구현·자체 검증해.
- 기준 문서: Task `source_of_truth` 전체와 External Technical References
- 허용 경로: Task frontmatter의 `allowed_paths`
- 참고 산출물: T-001~005 report·QA·Completion Review와 T-006 Work Packages
- 변경/검토 대상: `apps/backend/AGENTS.md`, production composition, `src/adapters/`,
  `deploy/staging/`, Backend scripts/tests/docs, `backend-staging.yml`, 필요한 `backend-verify.yml`
- 필수 검증: 전체 Backend verify·계약 5종·Node 24 non-root container, manifest/audit negative
  mutation, emulator/synthetic multi-instance·restart/replay·lifecycle·cutoff·STT capability 0
- 남은 리스크: 실제 Firestore/Tasks/App Attest/KMS/Billing/provider와 deploy/rollback은 Gate B 전
  미검증이며 이번 Gate A PASS로 해소할 수 없음
- 금지: cloud resource·secret·WIF/environment 설정, workflow 실행, image push, 외부 호출,
  실제 staging 배포, production traffic, 공개 endpoint, 원격 STT·음성 upload
- 완료 시: 외부 변경·호출 0건을 report에 기록하고 lock을 해제한 뒤 `verification_ready`,
  Backend QA Agent / Verification Role에 독립 검증을 요청해.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
