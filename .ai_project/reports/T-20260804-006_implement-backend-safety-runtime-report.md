# T-20260804-006 구현 보고서

## 결과

상태: `verification_ready`

Mock Backend에서도 콘텐츠·secret 비노출, 월 외부비 hard cutoff와 콘텐츠·raw metadata
삭제 상한을 실행 가능한 deterministic in-memory 경계로 구현했다. 실제 cloud sink,
billing API, datastore, queue, KMS, credential, provider와 배포 설정은 추가하지 않았다.

## 재작업 결과

- `QA-HIGH-006-001`: `deployment_version`과 `manifest_version`의 일반 문자열 fallback을
  제거했다. 서버가 생성 시 복사한 exact allowlist에 없는 값은 event 전체를 폐기하며,
  allowlist 미설정도 fail closed한다.
- `QA-HIGH-006-002`: 비용 validator의 `now`와 `lastReconciledAt`을 비교 전에 유한한
  non-negative safe integer·표현 가능 epoch로 검증한다. 잘못된 값은 operation ID 생성과
  ledger mutation 전에 차단한다.
- raw metadata clock도 같은 경계로 검증한다. 잘못된 clock에서는 신규 record,
  read·export·aggregate와 cleanup mutation을 차단하고 기존 record를 고정 `incident`
  상태로만 투영한다.
- QA 보고서에 기록된 원본 반례 스크립트의 네 반례를 수정 후 그대로 재실행해 모두
  차단됨을 확인했다.

## 구현 내용

### Allowlist telemetry

- event별 exact field allowlist와 고정 enum·범위·UUID·route template 검증
- getter, symbol, custom prototype, proxy, exception과 unknown event/field fail closed
- header·query·body·token·secret·transcript·prompt·recipe·provider raw 정보 배제
- 별도 `TelemetryRedactionScanner`와 고정 enum drop counter
- 비용 reservation 거절 또는 sink 예외에도 fallback 문자열·exception 출력 없음

### 전체 외부비 원장

- provider, runtime, Cloud Tasks, Firestore, TTL delete, logging, egress, build와 privacy
  cleanup을 하나의 operation ledger에서 전액 승인 또는 전액 거절
- `committed + active + delayed reserve <= KRW 50,000` 불변식
- 월 KRW 5,000 delayed billing reserve, actual 초과 delta 정산과 ledger version CAS
- 50%·75%·90%·100% alert 누적과 100% kill switch 비가역 유지
- 가격 manifest 17개 SKU, 10% buffer, FX/가격 만료와 6시간 billing 지연 fail closed
- 비용 admission 거절 시 AI job·content·queue·provider side effect 0건
- hard cutoff 후에도 사전 예약된 privacy cleanup envelope만 계속 사용 가능

### 콘텐츠·raw metadata cleanup

- 기존 AI 콘텐츠 ACK 즉시 삭제, +22시간 explicit cleanup, +24시간 read 전 접근 차단
- raw metadata 생성과 +28일 cleanup outbox의 원자 등록
- queue와 독립된 15분 sweeper 및 idempotent sink별 delete receipt
- source·error tracker·analytics staging·incident replica·export object·backup 6개 receipt
- +29일 warning, +29일 12시간 신규 raw event 차단, +29일 18시간 incident,
  +29일 23시간 45분 final cleanup, +30일 read·export·aggregate 선차단
- task 누락, worker partial crash, queue 장애, sink delete 실패와 TTL 지연 복구

## 검증 결과

| 검증 | 결과 |
|---|---|
| T-006 security·cleanup | 26/26 PASS |
| Backend 전체 runtime | 92/92 PASS |
| content·secret telemetry canary | sink 출력 0건, drop counter만 증가 |
| 비용 fixture concurrency·settlement·fail closed | PASS |
| 월 KRW 50,000 및 delayed reserve 불변식 | PASS |
| raw metadata retention fixture 6개 장애 | PASS |
| AI ACK·+22h·+24h cleanup | PASS |
| common·STT·AI·security contract validator | PASS |
| iOS/Backend shared fixture validator | PASS |
| `npm run typecheck`·`git diff --check` | PASS |

실제 localhost lifecycle은 네트워크 권한이 허용된 환경에서 실행했다. 검증 host는
Node.js 26.4.0/npm 11.17.0이며 목표 Node.js 24 LTS/container 실검증은 T-007에 남긴다.

## 경계 감사

- 실제 cloud/provider/network/credential/secret 추가: 0개
- `package.json`, lockfile, route, composition root 변경: 0개
- 운영 콘텐츠·secret fixture 또는 telemetry 출력: 0건
- 변경 파일: Task `allowed_paths` 내부만 사용
- 루트 worktree: 변경하지 않음

## 잔여 위험과 QA 인계

- in-memory ledger·cleanup record는 process 재시작 내구성이 없으며 production transaction,
  Cloud Billing reconciliation, sink delete adapter와 scheduler는 T-007 통합 범위다.
- SafeLogger, cost admission과 raw cleanup의 공유 app/worker composition도 T-007에서
  연결하고 Node 24 container에서 전체 회귀해야 한다.
- provider region activation gate와 실제 provider·KMS·secret·cloud resource는 이번
  Task 범위가 아니며 별도 승인 전 활성화할 수 없다.

Backend QA Agent / Verification Role에 독립 검증을 인계한다.
