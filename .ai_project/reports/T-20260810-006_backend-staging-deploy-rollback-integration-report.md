# T-20260810-006 Backend 작업 보고서

## 결과

- 상태: `verification_ready`
- 실행 Role: Backend Agent / Execution Role
- Gate: `Gate A — repository-only`
- 최초 구현 기준: `origin/develop@ee0add9f4a0ea8ab5d95ef40f290210f52c79ec5`
- 최종 재인계 기준: `origin/develop@92de3f60b0d5a7219759601673d9641747a6c197`
- 작업 branch: `task/T-20260810-006-staging-composition-gate-a`
- 작업 worktree: `/private/tmp/cooklog-t20260810-006-staging-composition-gate-a`

## 실행 조건 확인

- 최신 canonical에서 T-20260810-006이 Product Owner 승인 `approved`, Backend Agent /
  Execution Role, 빈 lock이며 T-001~005가 모두 `done`임을 확인했다.
- canonical SHA `ee0add9` 전용 worktree에서 단일 Backend Task lock을 획득했다.
- 최초 인계 후 사용자 요청에 따라 lock을 재획득하고 Gate A 미커밋 변경을 보존한 채
  `origin/develop@92de3f6`을 fast-forward로 통합했다. 통합된 7개 경로는 Design 산출물과
  공용 운영 문서로 Backend Gate A 변경과 겹치지 않았다.
- 최종 인계 기준에서 worktree HEAD와 `origin/develop`은 모두 `92de3f6`이다.
- Gate A 허용 범위만 수행했고 Gate B external staging 범위는 실행하지 않았다.

## 구현 내용

### WP-C1 — production composition·config

- `createProductionRuntime()`을 단일 production composition root로 추가하고 `server.ts`의
  production 분기를 연결했다. adapter/config가 없는 기본 production은 health-only로 남는다.
- `gate-a-validation`과 `external-staging` profile을 분리했다. 외부 profile은 9개 adapter
  role 전체, Seoul region, durable/distributed/external effect를 요구하고 Local/InMemory/
  Mock/Fixture/Synthetic 구현을 startup 전에 거부한다.
- typed production config는 Cloud Run service identity/ADC를 전제로
  `GOOGLE_APPLICATION_CREDENTIALS`, service-account JSON, API key와 inline secret 값을 거부한다.
  Secret Manager resource/version 또는 고정 mount reference만 허용하며 safe summary와
  readiness에 identity·secret resource·mount path를 노출하지 않는다.

### WP-C2 — staging adapter bridge

- Firestore transaction driver, deterministic content-free Cloud Tasks task name/dedupe,
  production-kind App Attest verifier, transactional installation repository를 기존 domain port에
  연결했다.
- durable installation/JTI revocation, signing rotation journal replay/conflict, provider transport,
  atomic distributed cost admission, required telemetry sink와 distributed rate limiter adapter를
  추가했다.
- Gate A 합성 조립에서 App Attest registration·installation token, durable job restart/replay,
  provider at-most-once, ACK 삭제를 하나의 production root로 재현했다.
- 실제 Google/Apple/provider SDK driver는 Gate B 미승인 상태이므로 등록·호출하지 않았다.

### WP-C3 — manifest·workflow·container gate

- secretless deployment contract, Cloud Run service template, rollback state template와 fail-closed
  validator를 추가했다. Seoul, private ingress/IAM, min 0, concurrency 1, digest reference,
  versioned secret reference와 remote audio capability 0을 고정했다.
- `backend-staging.yml`은 `workflow_dispatch` 전용, default `validate`, staging 단일 concurrency,
  `cancel-in-progress: false`, 기본 `contents: read`로 구성했다. deploy/rollback/disable job만
  `staging` environment와 job-scoped `id-token: write`를 가진다.
- GitHub/Google Actions는 full commit SHA로 pin했고 long-lived service-account JSON surface를
  추가하지 않았다. 이 workflow는 실행하지 않았다.
- 기존 Node 24.18.0 non-root container gate에 production composition·service control 합성
  테스트를 추가했다. 현재 host에 Docker/Podman 실행기가 없어 실제 container 실행은 못했다.

### WP-C4 — rollout·rollback·disable

- candidate traffic 0 → 이전 healthy state 기록 → private smoke → 실패 시 이전 revision 100%
  복구 → remote STT 0, ACK/cleanup, cost cutoff/sink 재검증 순서를 contract와 runbook에 고정했다.
- cleanup 23h critical, required sink 장애, cost manifest/Billing stale, auth repository 장애,
  durable job repository 장애, remote STT capability 위반을 각각 새 AI job `SERVICE_DISABLED`
  조건으로 구현했다.
- rollback evidence는 이전 state, private smoke, traffic 100%, remote STT 0, ACK/cleanup,
  cost cutoff post-check가 하나라도 없으면 실패한다.

### WP-C5 — integration evidence

- staging targeted test 14건과 전체 Backend 회귀를 추가했다.
- manifest negative mutation은 public ingress/IAM, unauthenticated, min instance, concurrency,
  tagged image, inline secret, remote STT, pre-smoke traffic과 rollback 불완전성을 거부한다.
- 기존 T-001~005 회귀를 포함해 restart/multi-process transaction, provider at-most-once,
  22h cleanup·24h access block, hard cutoff·required sink, remote STT 0을 전체 suite에서 검증했다.
- Gate A 증거와 실제 deploy/smoke/rollback/disable 미실행을 문서에서 명시적으로 구분했다.

## 주요 변경 파일

- composition/config/adapters: `src/app/production-runtime.ts`, `src/app/staging-service-control.ts`,
  `src/config/production-config.ts`, `src/adapters/staging-adapters.ts`, `src/app/server.ts`
- deployment: `deploy/staging/*`, `.github/workflows/backend-staging.yml`
- scripts/container: `scripts/validate-staging-manifest.mjs`, `scripts/staging-control.sh`,
  `scripts/verify-container.sh`, `scripts/audit-production-remote-stt-disabled.mjs`
- tests: `tests/health/production-composition-config.test.ts`, `tests/staging/*`
- docs/config: `docs/STAGING_GATE_A.md`, `README.md`, `AGENTS.md`, `.env.example`, `package.json`
- 운영 기록: Task, Development/Quality board, 이 보고서

## 자체 검증

실행 명령: `cd apps/backend && npm run verify`

- TypeScript typecheck/build: PASS
- Node runtime tests: 172/172 PASS
- T-006 staging targeted tests: 14/14 PASS
- common·remote STT·AI recipe·security/privacy/observability·iOS/Backend shared validator:
  5/5 PASS
- staging repository manifest validator: PASS
- production remote STT audit: PASS, source 43개·deployment manifest 3개
- Backend foundation boundary audit: PASS
- manifest/workflow negative mutation: PASS
- `sh -n scripts/staging-control.sh`: PASS
- `git diff --check`: PASS
- Node 24.18.0 non-root container: NOT RUN — Docker/Podman 실행기 없음

### canonical 통합 후 재검증 기록

- sandbox 내부 첫 실행: 166/172 — loopback bind `EPERM`으로 server lifecycle 6건 실패
- 정상 local 권한 재실행: lifecycle 6/6 PASS, 기존 T-003 JWT 서명 마지막 문자 변조 테스트
  1건이 같은 bytes로 디코딩되는 알려진 비결정적 입력으로 171/172
- 해당 auth suite 단독 재실행: 10/10 PASS
- 최종 전체 `npm run verify` 재실행: **172/172 PASS**, 계약 5종·staging validator·감사 PASS
- Gate A source 수정 없이 실행 환경 제한과 기존 비결정적 테스트를 분리 확인했다.

## 외부 변경·호출

- 실제 cloud resource 생성·수정·삭제: **0건**
- secret/credential 등록·조회·주입, WIF·GitHub environment 설정: **0건**
- workflow 실행, image build/push, Artifact Registry 변경: **0건**
- Google Cloud API, Cloud Billing, Apple App Attest, provider/OpenAI 외부 호출: **0건**
- 실제 staging deploy/private smoke/rollback/disable, production traffic 변경: **0건**
- 원격 STT·음성 upload·외부 egress: **0건**
- canonical 확인을 위한 read-only Git fetch와 Action release pin 확인 외 금지 대상 외부
  변경·실행·제품 호출은 전부 0건이다.

## 남은 리스크

- Docker/Podman 부재로 Node 24.18.0 non-root image build/run은 이 세션에서 미검증이다.
  Backend QA 또는 CI의 Docker 환경에서 `npm run verify:container`가 필요하다.
- Gate A adapter는 기존 synchronous domain 계약에 driver bridge를 연결하고 emulator/synthetic
  의미론을 검증했다. 실제 Firestore/Cloud Tasks multi-instance, App Attest/KMS, distributed
  ledger/limiter/sink driver와 장애 의미론은 Gate B 외부 staging에서 미검증이다.
- actual Apple proof/credential, provider ZDR·Modified Retention·국외 처리와 실제 provider
  schema handshake는 승인되지 않았으며 이번 PASS로 해소되지 않는다.
- workflow deploy/rollback/disable 명령은 repository 정의만 존재한다. GCP project/API/IAM,
  WIF/environment, secret version과 image가 없으므로 실제 실행 성공을 주장하지 않는다.

## 다음 Agent에게 전달할 말

너는 Backend QA Agent / Verification Role이야. Task T-20260810-006의 Gate A repository-only
실행 결과를 독립 검증해줘.

- 현재 상태: `verification_ready`
- 기준 상태 ref/SHA: `origin/develop@92de3f60b0d5a7219759601673d9641747a6c197`
- 다음에 해야 할 일: 이 보고서와 Task source of truth를 기준으로
  `PASS`, `PASS_WITH_RISK`, `FAIL`, `BLOCKED` 중 하나를 판정해줘.
- 허용 경로: Task frontmatter의 `allowed_paths`
- 참고 산출물: 이 보고서, `apps/backend/docs/STAGING_GATE_A.md`, T-001~005 report·QA
- 중점 검증: external profile의 local/in-memory 주입 거부, secret/identity 비노출,
  adapter 9-role 완결성, App Attest/token·restart/replay·provider 단일 호출·ACK/lifecycle,
  hard cutoff/sink disable, manifest negative mutation, workflow 수동/권한/SHA pin,
  remote STT capability 0
- container 후속: Docker 환경이면 `cd apps/backend && npm run verify:container`
- 남은 리스크: 실제 Firestore/Tasks/App Attest/KMS/Billing/provider와 external
  deploy/smoke/rollback/disable은 Gate B 전 미검증
- 금지: cloud resource·secret·WIF/environment 설정, workflow 실행, image push,
  provider·Apple 외부 호출, 실제 staging 배포와 production traffic 변경
- 주의: Gate A 합성 PASS를 실제 staging PASS로 간주하지 말고 외부 변경·호출 0건을 유지해줘.
