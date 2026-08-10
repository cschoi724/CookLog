# T-20260810-002 Backend 작업 보고서

## 결과

- 상태: `verification_ready`
- 실행 Role: Backend Agent / Execution Role
- 기준: `origin/develop@d8fc12f3d9d5d854a76fad60ab1ed6dcbc85ebb3`
- 작업 branch: `task/T-20260810-002-storage-lifecycle`
- 작업 worktree: `/private/tmp/cooklog-t20260810-002-storage-lifecycle`

## 구현 내용

- `RecipeJobRepository` port를 도입해 service를 구체 in-memory 구현에서 분리했다.
- 서울 리전만 허용하는 Firestore datastore·Cloud Tasks local contract adapter를 추가했다.
- job, content, create/ACK idempotency, worker·cleanup outbox 상태를 adapter에 유지해
  repository 재구성 뒤에도 복구되도록 했다.
- queue 장애에도 원자 outbox를 보존하고 안전한 task key로 단일 재발행되도록 했다.
- queue payload를 job ID, generation, cleanup 시각으로 제한해 RecipeDraft와 transcript를
  전달하지 않는다.
- ACK 즉시 삭제, 생성 22시간 cleanup, 15분 누락 sweeper, 22.5/23/23.5시간 health,
  23시간 신규 job 차단, 23시간 45분 일반 retry 중단·격리 삭제 전환, 24시간 content
  접근 차단과 삭제 실패 복구를 구현했다.
- 비정상 server time은 datastore 경계에서 실패하고 public create는 `SERVICE_DISABLED`로
  닫히며 safe counter 조회는 유지된다.

## QA-HIGH-810002-001 재작업

- adapter 객체 identity를 key로 사용하던 process-local `WeakMap`을 제거했다.
- schema `cooklog.recipe-job-state.v1`의 선택적 durable file backing을 추가하고 임시 파일
  작성 후 rename으로 상태를 원자 교체한다.
- 모든 job lifecycle mutation 뒤 durable commit을 수행해 job, content, create/ACK
  idempotency, worker/cleanup outbox, published marker, cleanup pending과 delete failure를 보존한다.
- 실제 child process 4개가 순차로 같은 backing을 다시 열어 create → replay/execute → ACK →
  ACK replay를 수행하며 동일 create idempotency가 새 job을 만들지 않음을 검증한다.
- 별도 새 adapter 연쇄에서 +24시간 cleanup pending과 delete failure를 복구하고,
  손상된 durable schema는 startup에서 fail closed함을 검증한다.

## QA-HIGH-810002-002 재작업

- durable file의 원자 rename만으로는 stale snapshot 경쟁을 막지 못하던 결함을 해소했다.
- backing별 atomic lock directory를 사용해 cross-process 단일 transaction 소유권을 얻고,
  lock 안에서 최신 state를 다시 읽은 뒤 repository operation을 실행한다.
- transaction mutation이 성공하거나 명시적으로 commit된 cleanup pending 오류일 때만 상태를
  원자 교체한다. lock timeout과 commit 전 예외는 fail closed한다.
- 먼저 열린 stale adapter 두 개의 동일 create, outbox publish, duplicate worker, ACK/delete,
  cleanup pending 경쟁을 회귀로 고정했다.
- barrier에서 동시에 출발한 실제 child process 두 개씩으로 동일 create가 신규 1건+replay
  1건, 동일 worker generation이 `completed` 1건+`ignored` 1건과 provider 총 1회를
  유지함을 검증했다.

## 변경 파일

- `apps/backend/src/storage/recipe-job-repository.ts`
- `apps/backend/src/jobs/recipe-job-service.ts`
- `apps/backend/src/cleanup/recipe-content-lifecycle-worker.ts`
- `apps/backend/tests/jobs/cloud-recipe-job-repository.test.ts`
- `apps/backend/tests/jobs/durable-repository-process.ts`
- `apps/backend/tests/cleanup/cloud-recipe-content-lifecycle.test.ts`
- `apps/backend/docs/RUNTIME_FOUNDATION.md`
- `apps/backend/docs/STATUS.md`
- `apps/backend/docs/CHANGELOG.md`
- Task·Development/Quality board·이 보고서

## 자체 검증

실행 명령: `cd apps/backend && npm run verify`

- TypeScript typecheck: PASS
- Node runtime tests: 122/122 PASS
- common contract validation: PASS
- remote STT contract validation: PASS
- AI recipe contract validation: PASS
- security/privacy/observability contract validation: PASS
- iOS/Backend shared fixture contract validation: PASS
- Backend foundation boundary audit: PASS
- 실제 provider·network·Google Cloud 호출: 0건

## 남은 리스크

- 현재 실행 환경은 Node.js `v26.4.0`이며 프로젝트 production 기준은 Node.js 24 LTS다.
  Node 24·non-root container 검증은 QA/CI에서 재확인이 필요하다.
- 이번 구현은 local/emulator 계약 adapter와 process restart용 durable fake이며 실제
  Firestore SDK·Cloud Tasks SDK를 호출하지 않았다. 실제 credential 등록, Cloud 리소스 생성,
  배포와 외부 호출은 승인 범위 밖이라 비활성 상태다.
- Firestore 실제 위치는 생성 후 변경할 수 있으므로 외부 변경 승인 시에도
  `asia-northeast3`를 별도로 확인해야 한다.

## 다음 Agent에게 전달할 말

너는 Backend QA Agent / Verification Role이야. Task T-20260810-002를 독립 검증해줘.

- 현재 상태: `verification_ready`
- 기준 상태 ref/SHA: `origin/develop@d8fc12f3d9d5d854a76fad60ab1ed6dcbc85ebb3`
- 검증 대상: `task/T-20260810-002-storage-lifecycle` worktree의 미커밋 변경
- 작업 보고서: `.ai_project/reports/T-20260810-002_backend-cloud-job-storage-lifecycle-report.md`
- 중점 검증: `QA-HIGH-810002-002` 원본 stale adapter create·worker 이중 승인, 동시
  child-process 단일 소유권, ACK/delete·cleanup·outbox marker 경쟁, 기존 durable
  job·content·create/ACK idempotency 복구와 content-free task payload,
  ACK 즉시 삭제, queue/delete 장애, 22h cleanup·15분 sweeper·23h admission block·23h45
  isolated cleanup·24h gate
- 금지 경계: credential 등록, 실제 provider/network 호출, Google Cloud 리소스 생성·배포 금지
- 판정은 `PASS`, `PASS_WITH_RISK`, `FAIL`, `BLOCKED` 중 하나로 기록해줘.
