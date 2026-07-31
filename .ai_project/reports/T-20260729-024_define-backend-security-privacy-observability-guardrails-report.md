# T-20260729-024 실행 보고서

작성자: Backend Agent
작성일: 2026-07-31
상태: 자체 검증 완료, Backend QA 독립 검증 대기

## 실행 결과

CookLog Backend의 API, worker, cleanup, provider adapter, datastore, queue, CI/CD와
관측성 sink에 공통 적용할 보안·개인정보·관측성·비용 guardrail 계약을 작성했다.

주요 결과:

- 음성·STT·STEP·레시피·prompt·AI 결과와 secret의 모든 telemetry 계층 0건 원칙
- 자유 형식 logger 대신 event별 allowlist schema와 redaction 실패 시 event drop
- raw 운영·보안 metadata 최대 30일, 비가역 비콘텐츠 aggregate만 이후 보관
- Secret Manager, 최소 권한 service account 분리, 최대 90일 회전과 긴급 폐기
- provider 지역·학습·보관·`store=false`·고정 model·선택 기능 비활성 activation gate
- AI ACK 즉시 삭제, +22시간 cleanup, +24시간 접근 차단과 Remote STT 최대 1시간 유지
- Firestore TTL은 유료 safety net이며 무료 할당량 또는 명시적 cleanup의 대체가 아님
- 월 호출·token·비용 soft alert와 네 차원의 호출 전 원자 예약 hard cutoff
- 콘텐츠 없는 metric·alert·incident evidence와 사건별 kill switch·재활성화 gate

## 산출물

- `apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md`

## 주요 계약

### Secret·권한

production secret은 Google Secret Manager에만 저장하며 API, AI worker, cleanup,
observability와 배포 주체의 service account를 분리한다. provider key는 AI worker만
읽고 KMS key material은 export하지 않는다. 정기·긴급 회전 후 이전 version과 provider
key를 폐기하며 회전 실패 시 영향 기능을 차단한다.

### 개인정보·관측성

request·response body, header, query, exception object와 콘텐츠 파생값은 log, trace,
metric, analytics, 오류, queue·DLQ, alert와 incident에 기록하지 않는다. 관측 이벤트는
고정 allowlist 필드만 새 object로 복사하고 schema 실패 시 해당 event를 폐기한다.
request ID는 log·trace 상관관계에만 쓰고 metric label에는 사용하지 않는다.

raw 운영·보안 metadata는 최대 30일 뒤 삭제한다. 콘텐츠·원시 ID·희소 segment가 없는
비가역 aggregate만 이후 보관할 수 있다.

### Provider gate

배포 manifest가 승인 endpoint·고정 model, 처리 지역, 학습 비활성, MAM/ZDR,
`store=false`, 선택 기능 비활성, 삭제·credential·비용·schema·장애 계약을 모두
증명해야 한다. 설정 조회 실패, 승인값 drift 또는 검증 만료 시 외부 호출을 fail
closed하고 자동 fallback하지 않는다.

### 비용·장애

provider 호출 5,500회, 입력 20M token, 출력 8M token, Backend 외부 추정 비용
KRW 50,000의 월 상한을 호출 전에 원자 예약한다. 50%·75%·90%에서 알림하고 어느
한 차원이라도 100%에 도달하면 job·content·queue 생성 전에 차단한다. timeout이나
응답 유실 시 예약 상한을 해제하지 않으며 운영자와 자동 복구가 우회할 수 없다.

콘텐츠·secret telemetry 탐지, provider gate drift, 중복 provider 호출, 삭제 SLA
위험은 기능 kill switch와 privacy/cost incident를 시작한다. incident evidence에도
실제 콘텐츠·secret을 남기지 않는다.

## 자체 검증

| 검증 | 결과 |
|---|---|
| `aiops validate task ... --strict` | PASS |
| `sh apps/backend/contracts/common/validate-contracts.sh` | PASS |
| `sh apps/backend/contracts/stt/validate-contracts.sh` | PASS |
| `sh apps/backend/contracts/ai/validate-contracts.sh` | PASS |
| 콘텐츠·secret telemetry 0건과 allowlist/redaction 계약 검색 | PASS |
| provider 지역·학습·보관·`store=false` activation gate 검색 | PASS |
| 5,500회·20M·8M·KRW 50,000 원자 예약 hard cutoff 검색 | PASS |
| raw metadata 최대 30일과 Firestore TTL 유료 safety net 검색 | PASS |
| `git diff --check` | PASS |

## 범위 외

- Cloud Run·Cloud Tasks·Firestore·Secret Manager 실제 runtime 구현
- cloud IAM, alert policy, budget와 provider console 실제 설정
- log sink DLP scanner와 runtime allowlist logger 구현
- production secret 생성·회전 또는 provider 호출
- Backend QA의 독립 검증과 staging incident drill

## 남은 위험과 후속 소유권

- runtime logger·safe renderer·quota reservation과 kill switch 구현 동등성은
  T-20260729-025의 fixture·계약 테스트와 후속 Backend 구현에서 확인한다.
- provider 공식 보관·지역 설정과 실제 물리 삭제 SLA는 provider 활성화 staging
  gate에서 확인한다.
- Firestore TTL 삭제는 무료 할당량 대상이 아니므로 cleanup retry와 TTL safety net의
  실제 비용을 staging에서 계측한다.
- cloud log export·backup·PITR이 콘텐츠 수명 계약을 우회하지 않는지 배포 전에
  독립 확인한다.

## Backend QA 인계

Backend QA Agent는 합성 canary로 모든 telemetry 계층의 콘텐츠·secret 0건, service
account 권한 분리와 회전, provider activation drift 차단, 보존·삭제 경계, 동시 비용
예약 hard cutoff, limiter 장애 fail-closed와 incident 재활성화 gate를 독립 검증한다.

공식 QA 판정은 Backend QA Agent가 수행하며 Backend Agent의 자체 검증은 이를 대체하지
않는다.

## 최신 develop 통합

- 기준 `origin/develop`: `cbbe2ab`
- T-20260729-020~023 `done`: 보존
- T-20260729-025 `approved`·T-024 선행 대기: 보존
- 최신 `origin/develop` 대비 뒤처짐: 0
