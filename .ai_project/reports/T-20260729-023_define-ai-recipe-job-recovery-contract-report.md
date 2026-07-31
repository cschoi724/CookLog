# T-20260729-023 실행 보고서

작성자: Backend Agent
작성일: 2026-07-31
상태: 자체 검증 완료, Backend QA 독립 검증 대기

## 실행 결과

STEP Preview snapshot을 비동기 RecipeDraft로 구조화하고 앱 백그라운드·재실행 후
복구하는 provider 중립 계약을 작성했다.

주요 결과:

- create API 5초 내 202와 `queued` 반환
- `queued -> processing -> succeeded|failed`, 서버 시각 기반 `expired` 상태
- logical job당 provider 호출 최대 1회
- 같은 idempotency key 동시 요청의 단일 job·outbox 생성
- schema·semantic invalid 출력 저장·반환 금지
- GET 반복과 앱 재실행 복구 중 provider 호출 0
- iOS ACK 즉시 content 삭제
- 22시간 cleanup task, 15분 sweeper, 24시간 복호화 전 접근 차단
- Firestore TTL은 유료 safety net이며 24시간 삭제 근거에서 제외

## 산출물

- `apps/backend/docs/AI_RECIPE_CONTRACT.md`
- `apps/backend/contracts/ai/README.md`
- `apps/backend/contracts/ai/recipe-job-create.schema.json`
- `apps/backend/contracts/ai/recipe-draft.schema.json`
- `apps/backend/contracts/ai/recipe-job-status.schema.json`
- `apps/backend/contracts/ai/recipe-job-acknowledgement.schema.json`
- `apps/backend/contracts/ai/fixtures/recipe-job-create.json`
- `apps/backend/contracts/ai/fixtures/recipe-draft.json`
- `apps/backend/contracts/ai/fixtures/state-transitions.json`
- `apps/backend/contracts/ai/fixtures/idempotency-cases.json`
- `apps/backend/contracts/ai/fixtures/result-version-ack-cases.json`
- `apps/backend/contracts/ai/fixtures/timeout-decision-cases.json`
- `apps/backend/contracts/ai/fixtures/recovery-lifecycle.json`
- `apps/backend/contracts/ai/fixtures/output-negative.json`
- `apps/backend/contracts/ai/validate-contracts.sh`

## 주요 계약

### 상태와 실행

job 생성 transaction이 job, 암호화 content, idempotency record, cleanup task와 콘텐츠
없는 worker outbox를 함께 만든다. worker는 state version·generation lease CAS의 단일
승자만 content를 복호화하고 provider를 호출한다.

provider 시작 후 crash·connection loss·deadline은 실행 부재가 확인되지 않는 한
`OUTCOME_UNKNOWN`이다. Provider 시작 전 timeout 또는 provider가 미실행을 확정한
경우만 `AI_TIMEOUT`이다. Cloud Tasks 중복 delivery와 provider 오류는 같은 logical
job의 자동 provider 재호출을 만들지 않는다.

### RecipeDraft

재료와 조리 단계는 입력 STEP ID evidence를 필수로 가진다. 기록에 근거 없는 일반
추정은 review flag로 표시하고, 안전 관련 값은 만들지 않는다. schema·semantic
validator를 통과하지 못한 provider 결과는 저장·반환하지 않는다.

### 복구와 삭제

GET은 provider를 호출하지 않고 committed 상태만 반환한다. iOS가 draft를 로컬에
저장하고 ACK하면 content를 즉시 삭제한다. ACK가 없어도 생성 22시간 delete task와
15분 sweeper가 명시적으로 삭제하며 24시간부터 복호화와 본문 반환을 먼저 차단한다.

## 승인된 재작업 결과

### QA-HIGH-023-001

- `recipe-job-status.schema.json`에 `result_version`을 필수 응답 필드로 추가했다.
- `succeeded/available`에서만 양의 정수이고 그 외 상태는 `null`로 고정했다.
- validated draft commit에서 `result_version=1`을 할당하고 같은 logical job에서
  불변이며 `state_version`과 별개라고 명시했다.
- GET version ACK 성공, wrong version `VALIDATION_FAILED/MISMATCH`, 동시 ACK 단일
  delete, ACK replay 성공 fixture와 검사를 추가했다.

### QA-HIGH-023-002

- provider 시작 전 worker timeout은 `AI_TIMEOUT`, queue 시작 timeout은
  `QUEUE_TIMEOUT`으로 고정했다.
- provider 시작 후 응답 deadline·connection loss·worker deadline은 실행 부재가
  확인되지 않는 한 모두 `OUTCOME_UNKNOWN`으로 통일했다.
- provider가 미실행·취소와 late result 부재를 확정한 경우만 시작 후에도
  `AI_TIMEOUT`을 허용했다.
- 각 사건의 provider 호출 수, late response 폐기와 새 job 허용 시점을 6개 fixture로
  고정했다.

### QA-MEDIUM-023-001

- quota·비용 예약 실패는 create transaction 전에 HTTP 429 `QUOTA_EXCEEDED`를
  반환하고 job/content/outbox를 만들지 않는 경계로 단일화했다.
- job status failure enum과 domain failure 표에서 `QUOTA_EXCEEDED`를 제거했다.

## 자체 검증

| 검증 | 결과 |
|---|---|
| `sh -n apps/backend/contracts/ai/validate-contracts.sh` | PASS |
| `sh apps/backend/contracts/ai/validate-contracts.sh` | PASS |
| AI 계약 JSON 전체 `jq empty` | PASS |
| canonical STEP snapshot SHA-256 일치 | PASS |
| 정상 RecipeDraft evidence가 입력 STEP 집합에 포함 | PASS |
| 상태 전이·worker crash·timeout·5xx provider 호출 최대 1회 | PASS |
| idempotency 생성·GET·ACK·수동 재실행 5개 fixture | PASS |
| ACK·22시간 cleanup·15분 sweeper·24시간 expiry fixture | PASS |
| invalid evidence·안전값·order·schema 4개 결과 차단 | PASS |
| result version ACK 성공·mismatch·동시·replay 4개 fixture | PASS |
| provider 시작 전후 timeout decision 6개 fixture | PASS |
| status failure enum `QUOTA_EXCEEDED` 부재 | PASS |
| `git diff --check` | PASS |

## 범위 외

- Cloud Run API·worker와 Cloud Tasks·Firestore 실제 구현
- provider SDK·prompt 내용·secret·배포
- runtime JSON Schema validator
- iOS AI Review 연동
- staging cleanup·provider 보관 설정 검증

## 남은 위험과 후속 소유권

- runtime schema validator와 iOS·Backend 통합 fixture는 T-20260729-025가 담당한다.
- 비콘텐츠 metric·alert·kill switch·privacy incident 운영 구현은 T-20260729-024가
  담당한다.
- provider 시작 후 응답 유실은 exactly-once 결과를 보장할 수 없으므로 자동 재호출
  대신 `OUTCOME_UNKNOWN`과 사용자 수동 재실행으로 제한했다.
- staging에서 ACK·22시간 task·sweeper·expiry gate의 실제 삭제와 24시간 이상 content
  0건을 확인해야 한다.

## Backend QA 인계

Backend QA Agent는 상태 전이, 동시 idempotency, worker 중복·crash, provider timeout,
invalid output, ACK·만료 복구와 콘텐츠 비노출을 독립 검증한다.

## 최신 develop 통합

- 기준 `origin/develop`: `5118712`
- T-20260729-022 `done`: 보존
- 형제 T-20260729-024 `approved`: 보존
- 최신 `origin/develop` 대비 뒤처짐: 0
