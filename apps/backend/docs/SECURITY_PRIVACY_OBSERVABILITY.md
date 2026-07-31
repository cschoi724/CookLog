# CookLog Backend 보안·개인정보·관측성·비용 guardrail

상태: T-20260729-024 구현 계약
버전: v1
작성일: 2026-07-31

## 1. 목적과 적용 범위

이 문서는 CookLog Backend의 API, worker, cleanup job, provider adapter, datastore,
Cloud Tasks, Cloud Run, CI/CD와 관측성 sink에 공통 적용할 보안·개인정보·비용 경계를
정의한다. 이 문서의 `MUST`, `MUST NOT`은 구현과 배포의 필수 조건이다.

- T-020의 서울 리전, provider·model, 콘텐츠 수명과 월 hard cutoff를 완화하지 않는다.
- T-021의 installation 인증, 공개 오류, rate limit과 project quota를 완화하지 않는다.
- T-022의 Remote STT 기본 비활성화와 최대 1시간 삭제 경계를 유지한다.
- T-023의 AI job 단일 provider 호출, ACK 즉시 삭제, 최대 24시간 만료를 유지한다.
- 운영 편의를 이유로 콘텐츠, secret 또는 provider 내부 정보를 로그에 추가하지 않는다.
- provider 자동 fallback과 운영자의 quota 우회는 허용하지 않는다.

Backend QA는 이 문서를 기준으로 secret 노출, 콘텐츠 유출, 비용 폭주, 보존 기간 초과와
장애 시 fail-closed 동작을 독립 검증한다.

## 2. 데이터 분류와 기본 원칙

### 2.1 콘텐츠와 secret

다음 값은 `restricted content`이며 일반 metadata와 분리해 취급한다.

- 음성 원본, 음성 조각, 다운로드 URL과 storage object 경로
- STT 입력·출력, STEP Preview의 제목·본문·순서와 원문 transcript
- 레시피 제목·재료·조리 순서·예상 시간·메모·검색어
- AI prompt, system instruction의 동적 사용자 부분, AI 입력·출력·raw response
- 사용자가 입력한 자유 형식 문자열과 위 콘텐츠에서 파생된 embedding·요약

다음 값은 `secret`이며 콘텐츠보다 좁은 접근 경계를 적용한다.

- provider API key, service account key, KMS key material
- access token, refresh token, `Authorization`·`Cookie` header
- App Attest challenge·assertion·receipt와 signing key
- webhook secret, CI credential, database credential
- 운영용 break-glass credential

restricted content와 secret은 로그, trace, metric label, analytics, 오류 응답, queue
payload, DLQ payload, incident ticket, CI artifact와 알림 메시지에 **0건**이어야 한다.
샘플링, debug mode, 예외 직렬화와 APM body capture도 예외가 아니다.

### 2.2 허용 운영 metadata

관측 이벤트는 다음 allowlist 안의 값만 기록한다. 새 필드는 코드 리뷰와 Backend QA
검증 전에는 기록할 수 없다.

| 필드 | 형식·제약 | 용도 |
|---|---|---|
| `event_name` | 이 문서의 고정 enum | 사건 종류 |
| `occurred_at` | 서버 UTC 시각 | 시간축 |
| `request_id` | 서버 발급 UUID, metric label 금지 | 단일 요청 상관관계 |
| `route_template` | `/v1/ai/recipe-jobs/{job_id}` 같은 template | endpoint 집계 |
| `http_method`, `http_status` | 고정 enum·정수 | API 상태 |
| `public_error_code` | T-021 공개 오류 enum | 안전한 실패 분류 |
| `latency_ms_bucket` | 고정 histogram bucket | 지연 |
| `request_bytes_bucket`, `response_bytes_bucket` | 고정 bucket, 본문 없음 | 용량 추세 |
| `job_state`, `result_state` | T-023 고정 enum | job 상태 |
| `provider_attempt_count` | 정수, 최대 1 | 중복 호출 감시 |
| `input_tokens`, `output_tokens` | 음이 아닌 정수 | quota·비용 정산 |
| `estimated_cost_micros` | 승인 통화의 정수 micro 단위 | 비용 guardrail |
| `cleanup_age_seconds`, `cleanup_outcome` | 정수·고정 enum | 삭제 SLA |
| `quota_dimension`, `quota_outcome` | 고정 enum | quota 상태 |
| `deployment_version` | 승인된 build ID | 배포 상관관계 |

`job_id`, raw installation ID, IP 주소, user agent, provider request ID와 datastore 경로는
기본 관측 필드가 아니다. 보안 abuse 집계에 installation 분할이 필요하면 별도
observability HMAC key로 계산한 일회성 `installation_partition`만 사용하고 30일마다
key를 교체한다. 이 값은 인증·콘텐츠 datastore와 join할 수 없어야 하며 metric label로
사용하지 않는다. IP는 요청 처리 중 rate limit에만 사용하고 저장하지 않는다.

## 3. Secret 관리

### 3.1 저장과 접근

- production secret은 Google Secret Manager에만 저장하고 저장소, 앱 bundle, 이미지,
  Terraform 변수 파일, CI 로그와 일반 환경 설정에 평문으로 두지 않는다.
- API, AI worker, cleanup worker와 배포 주체는 서로 다른 service account를 사용한다.
- 각 service account는 필요한 secret version과 작업에만 최소 권한을 가진다.
- provider key는 AI worker만 읽고 API·cleanup·관측성 주체는 읽을 수 없다.
- KMS key material은 export하지 않는다. 서비스는 encrypt/decrypt 권한만 사용한다.
- 개발·staging·production은 project, secret과 provider credential을 분리한다.
- Cloud Run에는 Secret Manager 참조를 사용한다. secret 값 자체를 command argument,
  label, annotation, health endpoint 또는 startup log에 노출하지 않는다.
- 장기 service account key 파일을 만들지 않고 workload identity를 사용한다.

배포 전 검사는 저장소와 build artifact의 secret pattern, 활성 secret version,
service account 권한과 관측성 설정을 확인한다. 하나라도 실패하면 배포를 차단한다.

### 3.2 회전과 폐기

provider credential, token signing key와 observability HMAC key는 최대 90일마다
회전한다. 노출 의심, 권한 변경, 담당 주체 변경 또는 provider 보안 공지가 있으면
주기와 무관하게 즉시 회전한다.

회전 절차:

1. 새 version 생성과 최소 권한 확인
2. staging에서 secret 값이 출력되지 않는 연결 시험
3. production이 새 version을 사용하도록 배포
4. access token 최대 수명과 진행 요청 종료에 필요한 최소 overlap 뒤 이전 version 폐기
5. Secret Manager access audit와 provider console에서 이전 key 무효화 확인
6. `secret_rotation_completed` 비콘텐츠 감사 이벤트 기록

회전 실패 시 이전 key를 무기한 유지하지 않는다. 영향 기능의 kill switch를 켜고 새
외부 호출을 차단한다. secret 값이나 앞·뒤 일부를 감사 이벤트에 기록하지 않는다.

## 4. Redaction과 안전한 오류

### 4.1 Allowlist logger

Backend는 자유 형식 object를 받는 logger 대신 `event_name`별 schema가 고정된
allowlist logger만 사용한다.

1. request context에서 허용 필드만 새 object로 복사한다.
2. header, URL query, request·response body와 exception object는 복사하지 않는다.
3. route는 실제 path가 아니라 route template으로 정규화한다.
4. 고정 enum, 길이, 범위와 cardinality를 검증한다.
5. schema를 통과한 event만 sink로 전송한다.

redaction 또는 schema 검증 실패 시 관측 이벤트를 폐기하고
`telemetry_event_dropped{reason=<고정 enum>}` counter만 증가시킨다. 사용자 요청 본문을
fallback logger로 출력하지 않는다. 관측성 장애가 인증, mutation 또는 비용 예약
감사를 안전하게 남길 수 없게 하면 해당 동작은 T-021 기준대로 fail closed한다.

### 4.2 계층별 금지

| 계층 | 필수 경계 |
|---|---|
| HTTP access log | query 제거, route template·status·bucket만 허용 |
| application log | allowlist event만 허용, body·header·exception 직렬화 금지 |
| trace | request·response body와 content attribute 금지, span name은 template |
| metric | bounded label만 허용, ID·자유 문자열 금지 |
| error tracker | local variable, breadcrumb body, screenshot와 attachment 수집 금지 |
| Cloud Tasks·DLQ | `job_id`와 execution generation만 허용, 콘텐츠 금지 |
| analytics | 비콘텐츠 aggregate만 허용, 원시 installation·IP 금지 |
| alert·incident | event count·안전한 code·시간만 허용 |

T-021 safe renderer가 모든 공개 오류를 생성한다. provider명·model명·raw response,
stack, 내부 resource ID, secret, STEP·레시피 본문과 비용 내부값을 사용자에게 반환하지
않는다. 알 수 없는 오류도 고정 `INTERNAL_ERROR`로 정규화한다.

## 5. 암호화, 권한과 콘텐츠 접근

- 전송 구간은 TLS를 사용하고 restricted content는 datastore 저장 전에 KMS 기반
  envelope encryption을 적용한다.
- 암호화 record와 key reference는 일반 job metadata와 분리한다.
- API는 AI job 생성에 필요한 encrypt와 결과 조회에 필요한 제한된 decrypt만 가진다.
- AI worker는 유효한 lease와 만료 전 content만 decrypt한다.
- cleanup worker는 content delete만 수행하며 decrypt 권한을 갖지 않는다.
- observability, support, analytics와 일반 운영자 계정은 decrypt 권한을 갖지 않는다.
- `now >= expires_at`이면 권한이 있어도 decrypt 전에 접근을 차단하고 삭제를 시도한다.
- production restricted content를 콘솔에서 열람하거나 incident ticket에 복사하는
  break-glass 경로는 제공하지 않는다.

content store의 backup·PITR은 즉시 삭제·최대 수명 계약을 깨지 않도록 비활성화한다.
플랫폼 요구로 backup이 필요하면 record별 DEK crypto-shredding과 backup 만료가 동일
삭제 SLA를 만족한다는 별도 Product Owner 승인과 Backend QA 검증 전에는 활성화하지
않는다.

## 6. Provider 활성화 gate

AI 또는 향후 Remote STT provider는 다음 manifest를 배포 artifact로 고정하고 배포
시점과 최소 분기 1회 다시 검증한다. 저장 위치와 처리 위치는 같은 의미로 간주하지
않으며 다음 필드를 각각 필수로 기록한다.

- `storage_region`: provider가 고객 콘텐츠를 저장하는 명시적 region
- `regional_processing_supported`: 해당 endpoint가 regional processing을 보장하는지
- `processing_boundary`: 추론·임시 처리가 일어날 수 있는 승인된 지리 경계
- `cross_border_processing_approved`: 저장 region 밖 처리를 Product Owner가 승인했는지

| Gate | 통과 조건 |
|---|---|
| 제품 승인 | 용도, 기능, provider와 비용이 Product Owner 승인 범위 |
| endpoint·model | T-020의 승인 endpoint와 고정 snapshot/GA ID |
| 저장 지역 | `storage_region`을 공식 설정·계약으로 확인 |
| 처리 지역 | `regional_processing_supported`와 `processing_boundary`를 별도 확인 |
| 국외 처리 | 저장 region 밖 처리는 `cross_border_processing_approved=true`와 승인 change ID 필수 |
| 학습 | 고객 콘텐츠 학습 비활성화 |
| 보관 | MAM 또는 ZDR 등 승인된 최단 보관, `store=false` |
| 선택 기능 | web search, tool, cache, file store와 background storage 비활성화 |
| 삭제 | provider와 CookLog의 삭제 방식·최대 시간이 계약과 일치 |
| credential | 전용 production key, 최소 권한, 회전·폐기 시험 통과 |
| 비용 | 단가 snapshot, 요청별 token 상한, 월 quota와 kill switch 설정 |
| schema | 고정 입력·출력 schema와 semantic validator 시험 통과 |
| 개인정보 | DPA·개인정보 고지와 국외 처리 여부 승인 |
| 장애 | timeout, 단일 attempt, late result 폐기, 자동 fallback 금지 시험 통과 |

OpenAI 한국 저장 후보는 `storage_region=KR`,
`regional_processing_supported=false`를 그대로 기록한다. MAM 또는 ZDR,
Modified Retention amendment와 한국 밖 처리의 Product Owner 승인이 모두 확인될
때만 활성화한다. 한국 내 처리로 표시하거나 저장 위치를 처리 위치의 증거로 쓰지 않는다.

Vertex AI EU 후보는 `storage_region=EU`, `regional_processing_supported=true`,
`processing_boundary=EU`를 공식 endpoint 설정으로 증명하고 context cache 비활성,
abuse monitoring 예외를 별도로 확인한다. `global` endpoint는 허용하지 않는다.

manifest가 없거나, 처리 위치가 `unknown`이거나, 설정 조회가 실패하거나, 승인 snapshot과
drift가 있거나, 국외 처리 승인이 없거나, 확인 유효기간이 지났으면 provider 호출은 fail
closed한다. 기존 로컬 STEP과 진행 기록은 보존하되 새 외부 호출을 시작하지 않는다.
다른 provider로 자동 전환하지 않는다.

Remote STT는 T-022의 별도 제품·비용·개인정보·provider 승인 전에는 credential,
endpoint, egress와 feature flag를 모두 비활성 상태로 유지한다.

## 7. 보존과 삭제

| 데이터 | 보존·삭제 계약 |
|---|---|
| 첫 출시 음성 | Backend 수신·저장 없음 |
| 승인된 Remote STT 음성·transcript | 성공·실패 후 즉시 삭제 시도, 최대 1시간 |
| AI STEP snapshot·prompt·draft | ACK 후 즉시 삭제; 미수신은 +22시간 cleanup, +24시간 접근 차단·삭제 |
| AI queue·DLQ | 콘텐츠 없음; job ID와 generation만 |
| idempotency metadata | 콘텐츠 없이 해당 job `expires_at`까지 |
| raw 운영·보안 metadata | 최대 30일 후 삭제 |
| 비가역 aggregate | 콘텐츠·ID·희소 segment가 없을 때만 30일 이후 보관 가능 |
| provider content | 승인된 MAM/ZDR와 `store=false`; 별도 저장 기능 금지 |
| 폐기 secret version | 필요한 최소 overlap 종료 즉시 provider·Secret Manager에서 폐기 |

### 7.1 Raw metadata 30일 상한

raw 운영·보안 metadata 생성 transaction은 서버 시각으로 다음 값을 고정하고 metadata
record와 cleanup outbox를 원자 commit한다.

| 시각 | 생성 시각 기준 | 동작 |
|---|---:|---|
| `delete_after` | +28일 | 모든 sink에 명시적 delete task 실행 |
| `warning_at` | +29일 | 잔존 replica 경고, cleanup 우선순위 상승 |
| `critical_at` | +29일 12시간 | 영향 sink의 새 raw event·export 차단 |
| `incident_at` | +29일 18시간 | P0 privacy incident와 downstream 격리 |
| `cleanup_retry_stops_at` | +29일 23시간 45분 | 일반 retry 중단, 격리 동기 삭제 |
| `expires_at` | +30일 | 조회·export·aggregate 입력 전 접근 차단과 동기 삭제 |

cleanup task 누락·worker crash·queue 장애를 발견하는 독립 sweeper는 15분마다
`delete_after <= now`인 record와 미완료 sink receipt를 조회한다. sweeper는 cleanup
queue와 별도 scheduler·service account를 사용하고 decrypt 권한을 갖지 않는다.

삭제 대상은 source log, trace, metric 원본, error tracker, analytics staging,
incident replica, export object와 backup이다. 각 활성 sink는 최대 삭제 deadline과
고정 `sink_id`, `deleted_at`, `outcome`만 담은 receipt를 반환해야 한다. 모든 필수
receipt가 성공하기 전에는 cleanup을 완료로 표시하지 않는다. deadline 내 삭제를
지원하지 않는 sink·backup·export는 production에서 활성화할 수 없다.

모든 raw metadata read, export와 aggregate job은 body read 전에 서버 시각의
`expires_at`을 검사한다. `now >= expires_at`이면 결과를 반환하거나 aggregate에
포함하지 않고 source와 downstream에 동기 삭제를 요청한다. TTL 지연, cleanup task
유실과 sink delete 실패는 이 접근 gate를 우회하지 못한다.

raw metadata의 기본 TTL은 30일보다 짧게 설정할 수 있으나 길게 설정할 수 없다.
Firestore TTL은 안전망일 뿐 삭제 SLA의 주 실행기가 아니며 무료 할당량 대상이 아니다.
명시적 cleanup worker가 삭제를 수행하고 TTL 지연·유료 삭제를 비용 계측에 포함한다.

삭제 결과는 콘텐츠 없이 `cleanup_completed`로 기록한다. delete가 실패하면 backoff
재시도하되 위 시각과 T-020/T-022의 더 짧은 콘텐츠 시각을 넘길 수 없다. 법적 보존
또는 지원 요청을 이유로 restricted content나 raw metadata 수명을 연장하지 않는다.

## 8. 비콘텐츠 관측성

### 8.1 Event catalog

| 이벤트 | 허용 필드 |
|---|---|
| `request_completed` | request ID, route template, method, status, error code, latency·byte bucket |
| `authentication_failed` | request ID, 고정 auth reason, route template |
| `rate_limit_blocked` | quota dimension, 고정 scope, retry-after bucket |
| `ai_job_state_changed` | 이전·다음 상태, provider attempt count, deployment version |
| `provider_call_completed` | outcome, latency bucket, token 수, estimated cost |
| `cleanup_completed` | cleanup outcome, age seconds, 대상 종류 |
| `cleanup_sla_warning` | 대상 종류, age bucket, count |
| `provider_gate_checked` | manifest version, gate enum, pass/fail |
| `cost_guardrail_changed` | quota dimension, percentage bucket, outcome |
| `kill_switch_changed` | 기능 enum, on/off, 승인 change ID |
| `secret_rotation_completed` | secret alias enum, version age bucket, outcome |

모든 event는 콘텐츠가 없는 schema validation을 거친다. provider request ID와 raw
provider error는 저장하지 않고 공개 오류 enum으로 정규화한다.

### 8.2 Metric과 label

다음 metric을 bounded label로 집계한다.

- route별 request count, 공개 error rate와 latency histogram
- 인증·rate limit·quota 차단 count
- AI job 상태별 count, queue age, 단일 attempt 위반 count
- provider 호출 count, 입력·출력 token과 추정 비용
- cleanup 대상 count, oldest age, delete failure와 SLA 위반 count
- provider gate 실패, kill switch 상태와 secret rotation age
- telemetry event drop과 schema reject count

metric label은 route template, status class, 공개 error code, 고정 state·outcome,
deployment version처럼 제한된 enum만 사용한다. request ID, job ID, installation
partition, IP, provider ID와 자유 문자열은 label로 사용하지 않는다.

## 9. Quota·비용 alert와 hard cutoff

### 9.1 가격 manifest와 전체 외부비 원장

월 KRW 50,000은 AI provider만이 아니라 Backend가 발생시키는 모든 외부비의 단일
원장 상한이다. production 가격 manifest는 다음 서비스를 누락 없이 포함한다.

| 서비스 | 필수 SKU selector |
|---|---|
| AI provider | 고정 model의 input token, output token |
| Cloud Run 서울 | Tier 2 CPU `085C-A237-027A`, Memory `600C-3782-6708`, Request `2DA5-55D3-E679` |
| Cloud Tasks | 서울 operations·network 사용량에 대한 Cloud Billing Catalog SKU |
| Firestore Standard 서울 | document read·write·delete, storage, network, TTL delete SKU |
| Networking | Cloud Run↔provider와 internet egress의 source·destination별 SKU |
| Observability | Logging ingest·storage, Trace span, Monitoring billable sample SKU |
| Build·artifact | Cloud Build compute와 Artifact Registry storage·egress SKU |

Cloud Billing Catalog가 지역·사용 유형에 대해 반환한 불변 `catalog_sku_id`, 통화,
단위당 가격과 `effective_at`을 manifest에 고정한다. Firestore TTL delete는 일반
무료 할당량에서 제외된 유료 delete로 별도 계측한다. SKU를 해석하지 못하거나 가격이
없는 서비스는 비용 0으로 간주하지 않고 기능을 차단한다.

가격 manifest는 매월 원장 개설 전과 배포 전, provider·Cloud Billing 가격 변경
감지 시 갱신한다. 환율은 월 개설 시 승인 출처의 USD/KRW snapshot을 고정하고 모든
USD 비용에 세금·환율 변동 10% buffer를 적용한다. snapshot이 31일보다 오래됐거나
단가 조회·환율 조회가 실패하거나 manifest의 SKU가 실제 billing SKU와 다르면 새
비용 발생 요청, cleanup 외 신규 job, log export와 build를 fail closed한다. 개인정보
삭제 cleanup은 중단하지 않고 미리 예약한 privacy reserve만 사용한다.

### 9.2 예약·정산

단일 월 원장은 다음 불변식을 transaction으로 보장한다.

```text
committed_actual_krw
+ active_reservations_krw
+ delayed_billing_reserve_krw
<= 50,000
```

- 월 개설 시 계측 지연, 가격 반올림과 cleanup 비상 실행을 위한
  `delayed_billing_reserve_krw=5,000`을 먼저 예약하고 월중 해제하지 않는다.
- 각 reservation은 불변 `operation_id`, `requested_reservation_krw`, SKU별 최대
  billable quantity와 하나의 `accepted|rejected` 결정을 가진다. 요청 금액 전체가
  남은 원장 안에 들어올 때만 accepted이며 일부 금액만 예약하는 partial acceptance는
  금지한다. 분할 실행이 가능한 bulk 작업은 예약 전에 독립 operation ID와 독립 실행
  단위로 나눈다. rejected operation은 어떤 billable side effect도 시작하지 않는다.
- USD SKU의 요청 상한은
  `ceil(max_billable_quantity × pinned_unit_price_usd × usd_krw × 1.10)`으로,
  KRW SKU는 `ceil(max_billable_quantity × pinned_unit_price_krw × 1.10)`으로
  계산한다. token·실행 초·operation 수·전송 byte·보존량의 runtime hard limit가
  `max_billable_quantity`를 넘기 전에 작업을 종료한다. 유한한 최대치를 강제할 수
  없는 operation은 production에서 실행하지 않는다.
- provider 호출은 최대 input·output token과 timeout까지의 Cloud Run, Tasks,
  Firestore read·write·delete, 예상 egress를 하나의 operation reservation으로 묶는다.
- API·worker·sweeper invocation은 최대 실행 시간의 CPU·memory·request 비용을 시작
  전에 해당 월 operation envelope에서 차감한다.
- Firestore write·read·일반 delete·TTL delete와 Cloud Tasks enqueue·delivery는
  실행 전 보수적 단가를 예약한다. cleanup retry도 새 비용으로 예약한다.
- log·trace·metric은 허용 event의 최대 byte·sample 수를 emit 전에 예약한다.
  reservation이 없으면 콘텐츠 없는 필수 보안 counter 외 telemetry를 drop하고 경고한다.
- internet egress, build와 artifact 작업도 전송 byte·최대 build time·보존량을 실행
  전에 예약한다. 예약 API를 사용하지 않는 production 경로는 금지한다.
- provider usage와 Cloud Billing export가 도착하면 실제 SKU별 비용으로 정산한다.
  정상 경로는 runtime hard limit와 10% buffer 때문에
  `actual_krw <= requested_reservation_krw`여야 한다. 정산 transaction은 reservation
  전체를 active에서 제거하고 actual을 committed에 더하며 미사용 차액만 반환한다.
- 가격 반올림·billing correction으로 actual이 reservation을 초과하면
  `delta = actual - requested_reservation`을 계산한다. `delta`가 남은
  delayed billing reserve 이하여야만 같은 ledger version CAS에서 active reservation
  전체 제거, committed actual 반영과 delayed reserve의 delta 차감을 함께 commit한다.
  이 전이는 원장 합계를 늘리지 않는다. 다른 active reservation은 해제하지 않는다.
- `delta`가 delayed reserve보다 크거나 정산 CAS가 실패하면 가격 manifest integrity
  P0 incident로 모든 신규 비용 operation을 차단한다. production 활성화 전 최대
  quantity·10% buffer가 이 상태를 만들지 않는다는 경계 시험이 필수다.
- billing export는 최소 시간마다 ingest하되 최대 6시간 지연을 가정한다. 마지막 성공
  reconciliation이 6시간을 넘으면 새 비용 발생 요청을 fail closed한다.

서로 다른 service의 예약도 같은 `(billing_month, ledger_version)` compare-and-set을
사용한다. provider와 logging·cleanup·TTL delete가 동시에 경합해도 단일 승자만 남은
KRW를 전액 예약한다. 동시 요청의 순서가 달라도 각 operation은 전액 accepted 또는
전액 rejected 중 하나이고, accepted·rejected operation ID의 합집합은 요청 ID 집합과
정확히 같아야 한다. soft alert는
`committed_actual + active_reservations + delayed_billing_reserve` 합계로 계산한다.

### 9.3 고정 상한

월 주기는 매월 1일 00:00 UTC에 시작한다. 모든 installation을 합산하고 provider 호출
전에 예상 최대 사용량을 원자 예약한다.

| 차원 | Soft alert | Hard cutoff |
|---|---|---:|
| provider 호출 | 50% / 75% / 90% | 5,500회/월 |
| 입력 token | 50% / 75% / 90% | 20,000,000/월 |
| 출력 token | 50% / 75% / 90% | 8,000,000/월 |
| Backend 외부 추정 비용 | KRW 25,000 / 37,500 / 45,000 | KRW 50,000/월 |

요청당 입력 5,000 token, 출력 2,000 token과 동시 provider 호출 10개의 T-020 상한도
유지한다. T-021의 installation 전체 60회/분, mutation 12회/분, AI 생성 20회/일,
project 전체 600회/분과 AI 생성 100회/분을 함께 적용한다.

### 9.4 예약과 차단

1. 인증, schema와 idempotency를 검증한다.
2. 호출·입력·출력과 위 모든 service 비용의 예상 상한을 하나의 transaction으로
   예약한다.
3. 어느 한 차원이라도 hard cutoff를 넘으면 job·content·queue를 만들지 않고
   `QUOTA_EXCEEDED`로 거절한다.
4. 예약 성공 후에만 job을 만들고 provider 호출은 logical job당 한 번만 수행한다.
5. provider usage와 Cloud Billing SKU 사용량이 확인되면 실제값으로 정산한다.
6. timeout·응답 유실·billing 지연으로 실제 사용량을 확인할 수 없으면 예약 상한을
   해제하지 않는다.

Soft alert는 운영 알림일 뿐 호출 허용 근거가 아니다. hard cutoff, quota ledger 또는
kill switch가 불명확하거나 사용할 수 없으면 비용 발생 요청은 fail closed한다.
Cloud Billing budget은 지연될 수 있는 2차 방어이며 애플리케이션 단일 원장 hard
cutoff를 대체하지 않는다. logging 폭주, cleanup retry와 TTL delete 증가도 같은
50%·75%·90% alert와 100% kill switch를 작동시킨다.

운영자, support와 자동 복구는 quota를 재설정·우회하거나 provider를 바꿀 수 없다.
상한 변경은 새 Product Owner 결정과 T-020 계약 갱신이 필요하며, 이 문서만으로 기존
상한을 높일 수 없다. 월 경계 reset은 새 ledger를 열 뿐 이전 audit record를
변경하지 않는다.

## 10. Alert와 자동 보호

| 조건 | 등급 | 자동 동작 |
|---|---|---|
| 콘텐츠·secret telemetry canary 탐지 1건 이상 | P0 | 영향 sink 차단, 기능 kill switch, incident 시작 |
| provider gate drift·확인 실패 | P0 | 해당 provider 새 호출 차단 |
| 월 사용량 50% / 75% / 90% | Info / Warning / Critical | 알림, 90%에서 예상 소진 시각 포함 |
| 어느 비용 차원 100% | Critical | 새 비용 발생 요청 hard block |
| AI content age 22시간 30분 | Warning | cleanup 우선순위 상승 |
| AI content age 23시간 | Critical | 새 AI job 차단 |
| AI content age 23시간 30분 | P0 | privacy incident 시작 |
| AI content age 23시간 45분 | P0 | 일반 retry 중단, 격리 cleanup |
| AI content age 24시간 | P0 breach | decrypt·조회 차단, 동기 삭제 시도 |
| Remote STT content age 45분 / 55분 / 60분 | Warning / Critical / P0 | cleanup 상승 / 새 호출 차단 / incident |
| raw metadata age 29일 | Warning | 미완료 sink receipt cleanup 상승 |
| raw metadata age 29일 12시간 | Critical | 영향 sink의 새 raw event·export 차단 |
| raw metadata age 29일 18시간 | P0 | downstream 격리·privacy incident |
| raw metadata age 30일 | P0 breach | 조회·export·aggregate 입력 차단, 동기 삭제 |
| 단일 AI job provider attempt 2 이상 | P0 | AI kill switch, 중복 비용 incident |
| quota·인증·mutation limiter 불가 | Critical | 해당 요청 fail closed |
| telemetry schema reject 1건 이상 | Warning | 이벤트 폐기, 배포 version 조사 |

알림에는 콘텐츠, secret, 원시 ID와 자유 문자열을 포함하지 않는다. P0 알림 전송 실패는
기능 차단을 해제하는 근거가 아니다.

## 11. Incident 대응

### 11.1 공통 절차

1. 감지 즉시 영향 기능 kill switch와 provider egress를 차단한다.
2. 새 비용 발생·콘텐츠 생성 요청을 fail closed한다.
3. 콘텐츠 없는 event, 배포 version, 시간 범위와 count만 증거로 보존한다.
4. 영향 sink·credential·provider 설정과 cleanup 상태를 범위화한다.
5. 노출 secret을 회전·폐기하고 오염된 log·trace·analytics 복제본을 삭제한다.
6. Product Owner와 Backend QA에 안전한 incident ID, 영향 기간·건수·조치만 전달한다.
7. 수정 배포와 회귀 시험 뒤 Product Owner 승인으로만 기능을 재활성화한다.

incident ticket, 채팅과 사후 보고서에 실제 콘텐츠나 secret을 복사하지 않는다. 검증은
미리 만든 canary token과 합성 콘텐츠의 hash match로 수행하되 원문은 저장하지 않는다.

### 11.2 사건별 최소 조치

- **secret 노출:** 즉시 key 폐기, 관련 기능 차단, Secret Manager·provider access audit,
  파생 token 무효화
- **콘텐츠 telemetry 유출:** sink write·export 차단, source와 downstream 복제본 삭제,
  body capture 설정 제거, 보존 TTL 확인
- **provider gate drift:** egress 차단, manifest 재검증, 학습·보관·지역 설정 확인
- **비용 폭주·중복 호출:** quota reservation과 단일 attempt 검증, provider key 제한,
  hard cutoff 유지
- **삭제 SLA 위험:** 새 content 생성 차단, decrypt 권한 없는 격리 cleanup, 최대 수명
  도달 시 접근 차단

재활성화에는 원인 제거, 오염 데이터·이전 secret 폐기, 경계 시험 통과, 잔여 콘텐츠
age 0 또는 계약 내 확인, quota ledger 정합성과 Product Owner 승인이 모두 필요하다.

## 12. Backend QA 독립 검증 기준

Backend Agent는 아래 항목을 자체 검증해 `verification_ready`로 인계하며 Backend QA
Agent가 독립 재검증한다.

### Secret·권한

- 합성 provider key와 token canary가 log, trace, metric, 오류, artifact에 0건인지 확인
- API·worker·cleanup·observability service account의 권한 분리 확인
- 정상 회전, 긴급 회전, 이전 version 폐기와 회전 실패 kill switch 확인

### 개인정보·redaction

- 음성, STT, STEP, 레시피, prompt와 raw provider response canary를 모든 입력 위치에
  주입해 운영·분석·오류·queue·DLQ·incident 출력에 0건인지 확인
- URL query, header, exception, debug·sampling·APM 경로도 같은 기준으로 확인
- 허용되지 않은 telemetry field가 event drop을 일으키고 fallback 출력이 없는지 확인
- raw metadata가 30일을 넘지 않고 비가역 aggregate만 남는지 확인

### Provider·삭제

- storage region, regional processing 지원, processing boundary와 국외 처리 승인을
  분리하고 unknown·승인 누락이 외부 호출을 차단하는지 확인
- OpenAI 한국 저장·한국 밖 처리 승인과 Vertex EU 처리·cache/abuse monitoring
  예외를 각각 fixture로 확인
- 학습 비활성, MAM/ZDR, `store=false`, 고정 model과 선택 기능 비활성 drift가 각각
  외부 호출을 차단하는지 확인
- ACK 즉시 삭제, AI +22시간/+23시간/+23시간 30분/+23시간 45분/+24시간 경계와
  Remote STT 45분/55분/60분 경계를 가상 시각으로 검증
- Firestore TTL만으로 성공 처리하지 않고 명시적 cleanup 결과를 확인하는지 검증
- raw metadata 정상 삭제, task 누락, worker crash, queue 장애, sink delete 실패와
  TTL 지연에서 +30일 접근·export·aggregate 입력 0건과 전체 sink receipt를 검증
- content backup·PITR이 비활성 또는 승인된 crypto-shredding 계약인지 확인

### Quota·장애

- 동시 요청이 네 월 hard cutoff 중 하나도 초과 예약하지 못하는지 확인
- provider와 Cloud Run·Tasks·Firestore·TTL·egress·observability·build 비용이 같은
  원장에 들어가고 동시 경합 합계가 KRW 50,000을 넘지 않는지 확인
- logging 폭주, cleanup retry와 TTL delete 증가가 50%·75%·90% alert와 100%
  kill switch를 작동시키는지 확인
- 가격·환율 snapshot 만료, SKU 조회 실패와 billing reconciliation 6시간 초과가
  비용 발생 요청을 fail closed하는지 확인
- 응답 유실·timeout 때 예약이 보수적으로 유지되고 자동 retry·fallback이 없는지 확인
- quota ledger·limiter·provider gate 장애에서 비용 요청이 fail closed하는지 확인
- 50%/75%/90% alert와 100% hard block, 운영자 우회 불가를 확인
- incident kill switch 후 새 호출 0건, 안전한 evidence만 남고 승인 전 재활성화가
  불가능한지 확인

검증 fixture와 결과 보고서에도 실제 사용자 콘텐츠와 production secret을 사용하지
않는다.
