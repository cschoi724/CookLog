# CookLog AI 레시피 job·복구 계약

상태: T-20260729-023 구현 계약
버전: v1
작성일: 2026-07-31

## 1. 목적과 경계

이 문서는 사용자가 `AI 정리하기`를 선택한 시점의 STEP Preview snapshot을 비동기
RecipeDraft로 구조화하고, 앱 백그라운드·재실행 후 결과를 복구하는 계약을 정의한다.

- iOS는 CookLog API와 공개 domain state만 알고 AI provider·model·region을 알지 않는다.
- STEP Preview는 AI 결과가 아니다. AI 호출은 사용자가 `AI 정리하기`를 선택할 때만
  시작한다.
- 원본 STEP snapshot과 진행 기록은 iOS 로컬 저장소에 유지한다.
- Backend job 실패·timeout·만료는 로컬 기록을 변경하거나 자동 재실행하지 않는다.
- provider SDK, worker runtime과 배포 구현은 이 Task 범위가 아니다.

T-021의 설치 인증, quota, idempotency, timeout, 공개 오류와 안전 renderer 계약을
그대로 적용한다.

## 2. 공개 endpoint

### `POST /v1/ai/recipe-jobs`

AI job을 생성한다. installation access token과 `Idempotency-Key`가 필수다.
`recipe-job-create.schema.json`으로 body를 검증한다.

처리 순서:

1. T-021 인증·무결성·installation·project quota 검증
2. contract version과 STEP snapshot schema 검증
3. canonical body hash와 idempotency key 검증
4. project 월 호출·입력·출력 token·외부비 예산의 예상 상한 원자 예약
5. job record, 암호화 content record, idempotency record, content cleanup task와
   콘텐츠 없는 worker outbox를 하나의 transaction으로 생성
6. 5초 안에 HTTP 202와 `queued` 상태 반환

Cloud Tasks payload에는 `job_id`와 execution generation만 넣고 STEP·transcript·draft를
넣지 않는다. 같은 idempotency key·같은 body는 원래 job을 반환한다. 다른 body는
`IDEMPOTENCY_KEY_REUSED`다.

### `GET /v1/ai/recipe-jobs/{job_id}`

job 상태와 복구 가능한 결과를 조회한다. GET은 side effect 없는 idempotent 요청이며
provider를 호출하지 않는다.

- `queued`, `processing`: draft 없이 현재 상태와 `poll_after_seconds` 반환
- `succeeded` + `available`: `recipe-draft.schema.json`을 통과한 draft 반환
- `succeeded` + `acknowledged_deleted`: draft 없이 수신 확인·삭제 상태 반환
- `failed`: 안전한 domain failure와 사용자 수동 재실행 가능 여부 반환
- `expired`: draft를 복호화하거나 반환하지 않음

서버는 datastore read 직후 자신의 UTC 시각으로 `expires_at`을 검사한다.
`now >= expires_at`이면 content를 복호화하기 전에 job을 `expired`로 CAS 전환하고
동기 delete를 시도한 뒤 draft 없는 상태만 반환한다. 클라이언트 시각은 사용하지 않는다.

다른 installation의 job과 존재하지 않는 job은 모두 `RESOURCE_NOT_FOUND`로 정규화한다.

### `POST /v1/ai/recipe-jobs/{job_id}/result-acknowledgements`

iOS가 draft를 로컬 AI Review 초안으로 저장한 뒤 호출한다. `Idempotency-Key`와
`recipe-job-acknowledgement.schema.json` body가 필수다.

- installation, job, `result_version`과 현재 `result_state=available`을 확인한다.
- content delete와 `result_state=acknowledged_deleted` 전환을 하나의 idempotent
  transaction/outbox 경계에서 처리한다.
- 동일 acknowledgement는 이미 삭제된 상태를 성공으로 재생한다.
- ACK는 job metadata를 최소 운영 보관 기간까지 남길 수 있지만 STEP·draft·prompt
  payload는 즉시 삭제한다.
- content delete 실패 시 외부 성공을 확정하지 않고 안전한 `INTERNAL_ERROR`를
  반환하며 cleanup task와 sweeper가 계속 삭제한다.

## 3. 입력 snapshot

request는 다음을 포함한다.

- `contract_version=ai-recipe-job.v1`
- iOS 로컬 진행 기록의 `snapshot_id`, 단조 증가 `snapshot_revision`
- canonical STEP 배열의 SHA-256
- 녹음 시간순 STEP Preview
- locale

각 STEP은 UUID, 0부터 연속인 `order`, RFC 3339 `recorded_at`, 원문 중심 transcript를
가진다. 빈 STEP, 중복 ID, 불연속 order와 request의 snapshot hash 불일치는 provider
호출 전에 `VALIDATION_FAILED`로 거부한다.

job 생성 후 snapshot은 불변이다. iOS에서 STEP을 추가·삭제해도 기존 job 입력을
변경하지 않는다. 사용자가 새 snapshot으로 다시 정리하면 새 `snapshot_id` 또는 높은
revision, 새 idempotency key와 새 job을 사용한다.

입력과 prompt payload는 암호화 content record에만 두고 일반 job metadata, queue,
로그, trace와 analytics에 넣지 않는다.

## 4. RecipeDraft 출력

provider adapter는 고정 prompt version과 `recipe-draft.v1` Structured Output schema를
사용한다. alias가 아니라 T-020이 승인한 고정 model snapshot/GA ID를 runtime config에
결합하지만 공개 API에는 노출하지 않는다.

RecipeDraft는 다음을 포함한다.

- 제목
- 재료명, 기록에 근거가 있을 때만 수량·단위
- 조리 순서
- 예상 시간과 provenance
- 메모
- 사용자가 확인해야 하는 `review_flags`
- 각 재료·단계가 참조하는 `evidence_step_ids`

semantic validator는 모든 evidence ID가 입력 STEP에 존재하는지, step order가
연속인지, 기록 근거가 없는 안전 관련 재료·온도·시간·조리법이 만들어지지 않았는지
검사한다. 근거 없는 일반 추정값은 `ai_inferred`와 `review_required=true`로 표시하고,
안전 관련 값은 추정하지 않고 `missing_source` flag로 남긴다.

schema 또는 semantic validation 실패 결과는 저장·반환하지 않는다. job은
`failed/OUTPUT_INVALID`로 terminal 전환하고 content cleanup을 시작한다.

## 5. 상태 머신

```text
queued
  ├─ processing
  │    ├─ succeeded (result_state=available)
  │    │    ├─ succeeded (result_state=acknowledged_deleted)
  │    │    └─ expired
  │    └─ failed
  ├─ failed
  └─ expired
```

허용 전이:

| 현재 | 다음 | 조건 |
|---|---|---|
| 없음 | `queued` | create transaction과 worker outbox commit |
| `queued` | `processing` | 단일 worker가 generation·lease CAS 획득 |
| `queued` | `failed` | queue 시작 deadline 초과 |
| `processing` | `succeeded` | provider 결과 schema·semantic 검증과 encrypted result commit |
| `processing` | `failed` | timeout, provider 오류, invalid output, 안전 차단 |
| 비만료 상태 | `expired` | 서버 시각 `now >= expires_at` |

terminal state는 `succeeded`, `failed`, `expired`다. terminal 이후 provider 호출,
prompt 재생성과 input 변경은 금지한다. ACK는 job terminal state를 바꾸지 않고
`result_state`만 `available -> acknowledged_deleted`로 바꾼다.

모든 전이는 `(job_id, state_version, execution_generation)` compare-and-set이다.
패배 worker는 content를 복호화하거나 provider를 호출하지 않는다.

## 6. worker·timeout·중복 전달

시간 상한:

| 구간 | 상한 |
|---|---:|
| create API 접수 | 5초 안에 202 |
| queued 시작 대기 | 120초 |
| worker 전체 execution | 90초 |
| provider 호출 | 60초 |
| 출력 schema·semantic 검증과 commit | 10초 |

worker 규칙:

- Cloud Tasks의 중복 전달은 같은 generation lease를 CAS한다.
- provider 호출 전 `provider_started_at`, 단일 `provider_attempt=1`, 비용 reservation과
  provider idempotency key를 commit한다.
- logical job당 provider 호출은 최대 1회다.
- worker가 provider 호출 전에 종료되면 queue가 같은 job을 다시 전달할 수 있다.
- `provider_started_at` 이후 worker crash, connection loss 또는 timeout으로 결과가
  불명확하면 자동 provider 재호출하지 않고 `failed/OUTCOME_UNKNOWN`으로 전환한다.
- provider 5xx·rate limit도 동일 job에서 자동 재호출하지 않는다.
- 늦게 도착한 provider 응답은 state/version CAS에 실패하며 결과를 저장하지 않고
  안전하게 폐기한다.

T-021의 HTTP `retryable=true`는 상태 조회 또는 사용자의 새 요청 가능성을 뜻한다.
이미 생성된 logical job의 provider 자동 재실행을 허용하지 않는다.

## 7. 실패와 사용자 재실행

공개 job failure:

| failure | 의미 | 사용자 행동 |
|---|---|---|
| `QUEUE_TIMEOUT` | 제한 시간 안에 worker 시작 실패 | `다시 정리하기` |
| `AI_UNAVAILABLE` | provider 5xx·rate limit | `다시 정리하기` |
| `AI_TIMEOUT` | provider/worker deadline | `다시 정리하기` |
| `OUTCOME_UNKNOWN` | provider 시작 후 결과 불명확 | 상태 확인 후 `다시 정리하기` |
| `OUTPUT_INVALID` | schema·semantic validation 실패 | `다시 정리하기` |
| `SAFETY_REJECTED` | 안전 정책상 결과 미사용 | 기록 검토 후 다시 실행 |
| `QUOTA_EXCEEDED` | project/installation 비용 제한 | 제한 해제 후 다시 실행 |
| `INTERNAL_ERROR` | 안전하게 분류되지 않은 실패 | 나중에 다시 실행 |

failure에는 provider명, model명, prompt, STEP, raw response, stack과 내부 resource ID를
포함하지 않는다. iOS는 기존 STEP snapshot을 보존하고 자동 화면 이동·자동 재실행 없이
`다시 정리하기`와 `기록으로 돌아가기`를 제공한다.

사용자 수동 재실행은 새 `Idempotency-Key`와 새 logical job을 만든다. 동일 snapshot을
재사용할 수 있지만 이전 job ID나 provider idempotency key를 재사용하지 않는다.

## 8. idempotency

| 상황 | 결과 |
|---|---|
| 같은 key·같은 body 동시 생성 | 정확히 한 job/outbox/content record, 같은 202 replay |
| 같은 key·같은 body 처리 중 | 같은 job ID와 현재 상태 |
| 같은 key·다른 body | 409 `IDEMPOTENCY_KEY_REUSED` |
| create 응답 유실 | 같은 key로 원 job 복구 |
| GET 반복 | state version에 따른 같은 snapshot, provider 호출 0 |
| ACK 동시·반복 | content delete 한 번, 같은 성공 replay |
| 사용자 `다시 정리하기` | 새 key·새 job, 이전 job 불변 |

create idempotency record는 최소 job `expires_at`까지 유지한다. snapshot hash만으로 다른
idempotency key를 합치지 않는다. 사용자가 명시적으로 재실행하면 같은 snapshot의 새
job을 허용한다.

## 9. 결과 복구·삭제

content record 생성 시 서버가 다음 시각을 설정한다.

- `created_at`
- `delete_after = created_at + 22시간`
- `expires_at = created_at + 24시간`
- `ttl_safety_at = created_at + 24시간`

job/content/idempotency/outbox와 생성 22시간 delete task를 같은 transaction에 등록한다.

삭제 경로:

1. iOS ACK: 즉시 idempotent delete
2. 22시간 delete task: 미확인 content 명시적 delete
3. 15분 sweeper: 누락·실패 task의 `delete_after <= now` content delete
4. GET expiry gate: 24시간에 복호화 전 접근 차단·동기 delete
5. Firestore TTL: 위 경로가 모두 실패한 경우의 유료 safety net

cleanup queue는 23시간 45분까지만 retry한다. 22시간 30분 잔존 warning, 23시간
critical과 신규 AI job 차단, 23시간 30분 privacy incident cleanup을 적용한다.
24시간 이상 content가 하나라도 있으면 원격 AI 기능을 재개하거나 출시할 수 없다.

Firestore TTL은 삭제 시각을 보장하지 않고 무료 할당량 대상도 아니다. 생성 후 24시간
보장의 근거로 사용하지 않는다.

metadata는 content와 분리한다. job ID, 안전 state/failure, 시각, latency, token/cost와
cleanup 결과만 최대 30일 보관할 수 있다. STEP, draft, prompt와 provider raw response는
운영 로그·trace·metric label·analytics·DLQ에 넣지 않는다.

## 10. 버전

job은 다음 server-owned version을 불변으로 기록한다.

- public contract version
- prompt version
- output schema version
- provider adapter config version
- model snapshot/GA ID의 내부 fingerprint

지원하지 않는 request contract는 provider 호출 전 `VALIDATION_FAILED`다. 처리 중
config가 바뀌어도 job 생성 시 고정한 version을 사용한다. 결과에는 public contract와
output schema version만 반환하고 provider version은 노출하지 않는다.

## 11. QA 인계 기준

Backend QA Agent는 최소 다음을 독립 검증한다.

1. 정상 create·queued·processing·succeeded·ACK 삭제·expired 전이
2. 같은 key 동시 생성이 job/outbox/provider call을 중복하지 않는지
3. worker 중복 delivery와 crash 이후 provider 호출이 최대 1회인지
4. timeout·5xx·rate limit·outcome unknown이 자동 provider retry를 만들지 않는지
5. schema·semantic invalid 결과가 저장·반환되지 않는지
6. GET 반복과 앱 재실행 복구가 provider를 호출하지 않는지
7. ACK·22시간 delete task·15분 sweeper·24시간 expiry gate의 콘텐츠 삭제
8. `now >= expires_at`에서 복호화·본문 반환 전에 접근을 차단하는지
9. provider·prompt·STEP·draft·secret이 공개 오류와 관측 데이터에 없는지
10. version mismatch와 만료·중복·수동 재실행 fixture가 계약에 맞는지

