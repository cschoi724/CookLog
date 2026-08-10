# T-20260810-002 Backend 독립 QA 보고서

## 판정

- 재검증 결과: `PASS_WITH_RISK`
- 검증 Role: Backend QA Agent / Verification Role
- 기준: `origin/develop@d8fc12f3d9d5d854a76fad60ab1ed6dcbc85ebb3`
- 검증 대상: `task/T-20260810-002-storage-lifecycle` worktree의 미커밋 변경
- 외부 호출: provider·network·Google Cloud 리소스·credential 사용 0건

## 자동 검증

- Node.js 26 host `npm run verify`: 122/122 PASS
- Node.js 24.18.0 전체 runtime tests: 122/122 PASS
- 계약 validator 5종: PASS
- Backend foundation 경계 감사: PASS
- 서울 리전, content-free queue payload, ACK 즉시 delete, 22h cleanup, 15분 sweeper,
  23h admission block, 23h45 isolated 전환, 24h read gate: 회귀 PASS

## HIGH 재검증

### QA-HIGH-810002-001 — process 재시작 상태 소실

- process-local `WeakMap`은 제거됐다.
- 실제 순차 child process가 같은 durable backing을 다시 열어 job·content·create/ACK
  idempotency·outbox·published marker·cleanup pending을 복구했다.
- 결과: 해소.

### QA-HIGH-810002-002 — stale snapshot의 worker·create 이중 승인

backing별 lock 안에서 최신 durable state를 다시 읽고 repository operation을 수행하도록
변경됐다. 동일 process의 stale adapter 및 barrier로 동시 출발한 child process 회귀가
추가됐다.

이전 독립 원본 반례 재실행 결과:

- stale duplicate worker: A `completed`, B `ignored`
- provider call count: A 1회 + B 0회 = 총 1회
- stale 동일 idempotency create: A `replayed: false`, B `replayed: true`
- 두 create의 job ID: 동일
- 결과: 해소.

추가 회귀에서 outbox published marker는 단일 소유권을 유지했고, 경쟁 ACK는 content를
1회만 삭제했으며, cleanup pending 경쟁도 삭제 실패 상태와 최종 단일 삭제를 보존했다.

## 잔여 위험

- 이번 검증은 schema-versioned durable file fake와 local Cloud Tasks contract adapter에서
  수행했다. 실제 Firestore SDK transaction과 Cloud Tasks task-name dedupe·장애 의미론은
  아직 검증하지 않았다.
- 실제 credential 등록, Google Cloud 리소스 생성·배포, provider/network 호출은 Task의
  별도 외부 변경 게이트 때문에 수행하지 않았다.
- Firestore 실제 위치는 생성 후 변경할 수 있으므로 후속 외부 변경 승인 시
  `asia-northeast3`를 별도 확인해야 한다.

승인된 emulator/local 범위의 수용 조건은 충족했고 신규 결함은 확인되지 않았다. 실제
Cloud 통합 미검증을 잔여 위험으로 남겨 `PASS_WITH_RISK`로 판정한다.

## 다음 Agent에게 전달할 말

너는 Development Lead Agent / Completion Role이야. Task T-20260810-002 완료 리뷰를 진행해줘.

- 현재 상태: `verification_passed`
- QA 판정: `PASS_WITH_RISK`
- 해소 결함: `QA-HIGH-810002-001`, `QA-HIGH-810002-002`
- 독립 검증: Node 24/26 122/122, 계약 validator 5종, 경계 감사, 원본 stale
  create/duplicate worker 반례 PASS
- 잔여 위험: 실제 Firestore·Cloud Tasks SDK/emulator 및 Cloud 리소스에서는 미검증
- 다음 작업: 성공 기준 충족과 잔여 위험을 검토해 완료 여부를 판단하고, 실제 Cloud 검증은
  별도 외부 변경 승인 대상으로 유지해줘.
- 금지 경계: 승인 전 credential 등록, 실제 provider/network 호출, Google Cloud 리소스
  생성·배포 금지.
