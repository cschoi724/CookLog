# T-20260729-024 Backend QA 독립 검증 보고서

검증일: 2026-07-31
검증자: Backend QA Agent / Verification Role
최초 검증 기준: `task/T-20260729-024-define-backend-security-privacy-observability-guardrails` `d9e0d61`
1차 재검증 기준: `task/T-20260729-024-define-backend-security-privacy-observability-guardrails` `d66c28b`
최종 재검증 기준: `task/T-20260729-024-define-backend-security-privacy-observability-guardrails` `10eee04`
기준 develop: `origin/develop` `0014935`
현재 판정: `PASS_WITH_RISK`
현재 상태 인계: `verification_in_progress -> verification_passed`

## 1. 검증 범위

- `apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md`
- `apps/backend/docs/ARCHITECTURE_DECISION.md`
- `apps/backend/docs/API_CONTRACT.md`
- `apps/backend/docs/REMOTE_STT_ADAPTER.md`
- `apps/backend/docs/AI_RECIPE_CONTRACT.md`
- `docs/PROJECT_DECISIONS.md`
- Task `allowed_paths`, Task ID 단일성, 최신 `origin/develop` 상태 비회귀

이 Task는 문서 계약이며 실제 Cloud Run, IAM, Secret Manager, provider console,
logger, quota ledger와 cleanup runtime은 범위 밖이다. 따라서 계약이 후속 구현과
staging 검증을 단일하게 제약하는지, 장애·동시성·보존 반례에서 상한을 보장하는지를
독립 검증했다.

## 2. 최신 develop 기준

검증 전에 원격 `develop`을 fetch하고 T-024의 2개 작업 커밋을 `0014935` 위로
재배치했다. 공용 Development 보드 충돌은 최신 `develop`의 T-020~023 `done`,
T-025 `approved`, T-20260731-001·002 완료 기록을 보존하면서 T-024 QA 인계만
합치는 방식으로 해결했다.

재배치 후 `origin/develop...HEAD`는 `0 behind / 2 ahead`다.

## 3. 요약

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| secret 저장·권한 | PASS | Secret Manager, workload identity, service account 분리, provider key 최소 권한이 정의됐다. |
| secret 회전·사고 | PASS | 최대 90일 회전, 이전 version 폐기, 노출 시 긴급 회전과 kill switch가 정의됐다. |
| 콘텐츠·secret telemetry 0건 | PASS | 모든 sink 금지와 event별 allowlist, schema 실패 event drop, fallback logger 금지가 정의됐다. |
| 공개 오류·incident 비노출 | PASS | T-021 safe renderer와 비콘텐츠 evidence만 허용한다. |
| AI·Remote STT 콘텐츠 수명 | PASS | T-022·023의 1시간 및 22/24시간 경계를 보존한다. |
| raw metadata 최대 30일 | FAIL | 삭제 시각·사전 cleanup·독립 sweeper·30일 접근 차단이 없어 TTL 지연·worker 장애에서 상한을 보장하지 못한다. |
| provider 보관·학습 | PASS | MAM/ZDR, `store=false`, 선택 저장 기능 비활성, drift fail-closed가 정의됐다. |
| provider 처리 지역 | NEEDS_WORK | 한국 저장만 지원하는 OpenAI 후보와 “승인 리전 처리 증명” gate의 통과 조건이 양립하지 않는다. |
| 호출·token hard cutoff | PASS | 5,500회·20M·8M과 동시 10, 요청당 token 상한이 T-020·021과 일치한다. |
| 전체 Backend 외부비 KRW 50,000 | FAIL | provider usage 정산만 정의하고 runtime·Tasks·Firestore·TTL·logging·egress 비용을 같은 원장에 반영하는 규칙이 없다. |
| incident·재활성화 | PASS | kill switch, 안전한 증거, Product Owner 승인 전 재활성화 금지가 정의됐다. |
| 기존 계약 검증기 | PASS | common·STT·AI 검증 script와 strict Task 검증이 통과했다. |
| allowed paths·Task ID | PASS | 변경은 T-024 허용 경로 안이고 Task front matter ID는 1개다. |

## 4. 차단 결함

### QA-HIGH-024-001 — raw 운영·보안 metadata의 최대 30일 삭제를 보장하지 못함

문서는 raw 운영·보안 metadata를 최대 30일만 보관하고 Firestore TTL은 지연될 수 있는
안전망이라고 올바르게 선언한다. 또한 명시적 cleanup worker가 삭제한다고 적었다.

그러나 다음 실행 계약이 없다.

- record별 `delete_after`와 `expires_at`
- 30일보다 앞선 명시적 cleanup task 등록 시각
- task 누락·worker crash·queue 장애를 발견하는 독립 sweeper 주기
- warning·critical·incident 시각과 신규 metadata 생성·export 차단
- `now >= expires_at`에서 조회·export 전에 적용하는 접근 gate
- log export, error tracker, analytics와 incident replica의 동일 삭제 확인

따라서 cleanup worker가 30일에 실패하거나 TTL이 지연되면 “최대 30일”을 초과한다.
T-020·023이 콘텐츠에 대해 `+22시간 cleanup`, 15분 sweeper와 `+24시간` 접근 차단을
정의한 것과 달리 raw metadata에는 같은 보장 구조가 없다.

필수 재작업:

1. raw metadata 생성 transaction에 server-owned 삭제·만료 시각과 cleanup task를
   원자 등록한다.
2. 최대 30일보다 충분히 앞선 delete task와 독립 sweeper, warning·critical·incident
   시각을 정의한다.
3. 30일에는 조회·export·aggregate 입력 전에 접근을 차단하고 동기 삭제를 시도한다.
4. 모든 downstream sink·export·backup에 같은 deadline과 삭제 receipt를 적용한다.
5. 정상, task 누락, worker crash, queue 장애, sink delete 실패, TTL 지연 fixture와
   검증 script를 추가한다.

### QA-HIGH-024-002 — KRW 50,000 전체 외부비 원장이 provider 외 비용을 반영하지 않음

T-020은 KRW 50,000을 provider 비용만이 아닌 “전체 Backend 외부비 예산”으로
정의한다. T-024도 같은 이름의 hard cutoff를 선언하지만 정산 규칙은 provider 응답의
token usage만 실제값으로 반영한다.

다음 비용을 같은 월 원장에 적립·예약·정산하는 규칙이 없다.

- Cloud Run API·worker·cleanup 실행
- Cloud Tasks, Firestore read/write/delete와 유료 TTL delete
- internet egress, Logging·trace·metric sink
- build·artifact 등 T-020이 비용 산식에서 제외하고 buffer로 남긴 항목
- 단가·환율·세금 snapshot 변경 및 계측 지연분

provider 호출·token 원장이 상한 안에 있어도 logging 폭주, cleanup 재시도 또는
TTL delete 증가로 실제 전체 외부비가 KRW 50,000을 넘을 수 있다. 현재 계약의
“어느 한 차원 100%에서 hard block”은 이 비용이 원장에 들어오지 않으므로 작동하지
않는다.

필수 재작업:

1. KRW 원장에 포함할 서비스·SKU, 단가·환율·세금 snapshot과 갱신 주기를 정의한다.
2. 월 시작 시 비provider 예상 상한을 선예약하거나 비용 발생 동작별 보수적 상한을
   예약하고 billing reconciliation을 반영한다.
3. 계측 지연·단가 조회 실패·환율 snapshot 만료 시 비용 발생 요청을 fail closed한다.
4. logging·cleanup·TTL 비용 급증이 50%/75%/90% alert와 100% kill switch를
   작동시키는 fixture를 추가한다.
5. provider 예약과 비provider 비용이 경합해도 총액이 KRW 50,000을 넘지 않는
   동시성 검사를 추가한다.

## 5. 보완 결함

### QA-MEDIUM-024-001 — OpenAI 한국 저장 후보와 처리 지역 gate의 조건 불일치

T-020과 현재 OpenAI 공식 데이터 제어 문서는 한국 region이 regional storage는
지원하지만 regional processing은 지원하지 않는다고 명시한다. Customer Content는
추론 중 한국 밖에서 처리·임시 저장될 수 있다.

T-024 provider gate는 “승인 리전에서 처리됨을 공식 설정·계약으로 확인”해야 통과한다고
정의한다. 이 조건은 OpenAI 추천 후보에서 증명할 수 없으며, 반대로 이를 단순
`pass`로 기록하면 T-020의 처리 지역 미보장 위험을 숨긴다.

필수 보완:

- `storage_region`, `regional_processing_supported`, `processing_boundary`,
  `cross_border_processing_approved`를 별도 gate로 분리한다.
- OpenAI 한국 후보는 `regional_processing_supported=false`를 숨기지 않고,
  MAM/ZDR·Modified Retention amendment와 한국 밖 처리의 Product Owner 승인이 모두
  있어야 활성화되도록 한다.
- Vertex EU 후보는 EU processing과 cache·abuse monitoring 예외를 별도 증명한다.
- 알 수 없는 처리 위치나 승인 누락은 fail closed fixture로 고정한다.

공식 근거:

- OpenAI Data controls: `https://platform.openai.com/docs/models/default-usage-policies-by-endpoint`
- Vertex AI zero data retention:
  `https://docs.cloud.google.com/vertex-ai/generative-ai/docs/vertex-ai-zero-data-retention`

## 6. 통과 상세

### Secret·권한·redaction

- production secret은 Secret Manager에만 두고 장기 service account key를 만들지
  않으며 환경별 project와 credential을 분리한다.
- API, AI worker, cleanup, observability와 배포 주체를 분리하고 provider key는
  AI worker만 읽는다.
- request·response body, header, query, exception object, APM capture와 CI artifact를
  포함한 모든 계층에서 콘텐츠·secret 0건을 요구한다.
- event별 allowlist가 허용 필드만 새 object로 복사하고 schema 실패 시 event를
  폐기하므로 denylist 우회나 fallback 원문 출력 경계를 차단한다.

### Provider·콘텐츠 삭제

- MAM/ZDR, `store=false`, 고정 model, Files·Batch·background·tool·cache 비활성과
  설정 drift fail-closed가 정의됐다.
- AI ACK 즉시 삭제, +22시간 cleanup, +24시간 접근 차단과 Remote STT 최대 1시간을
  하향 완화하지 않는다.
- backup·PITR은 기본 비활성이고 별도 승인·crypto-shredding 검증 전 활성화할 수 없다.
- provider 자동 fallback과 승인되지 않은 Remote STT 활성화가 금지된다.

### Quota·incident

- 호출 5,500회, 입력 20M, 출력 8M, 요청당 5k/2k token, 동시 호출 10 상한이
  T-020·021과 일치한다.
- timeout·응답 유실의 예약 상한을 해제하지 않고 ledger·limiter·provider gate 장애는
  fail closed한다.
- secret·콘텐츠 telemetry 1건, provider drift, 중복 호출과 삭제 SLA 위험은 kill
  switch를 작동시킨다.
- incident evidence에도 콘텐츠·secret을 남기지 않고 Product Owner 승인 전
  재활성화를 금지한다.

## 7. 수행 검증

```text
git fetch origin develop: PASS
git rebase origin/develop: PASS (board conflict resolved with latest state preserved)
origin/develop...HEAD: 0 behind / 2 ahead
sh apps/backend/contracts/common/validate-contracts.sh: PASS
sh apps/backend/contracts/stt/validate-contracts.sh: PASS
sh apps/backend/contracts/ai/validate-contracts.sh: PASS
aiops validate task ... --strict: PASS
git diff --check: PASS
Task ID count: 1
```

문서 검색 기반 자체 검사는 필수 문구의 존재만 확인한다. 30일 삭제 실패 반례와
비provider 비용 누락, storage/processing 의미 충돌을 검사하지 않으므로 자체 검사
PASS를 전체 계약 성공으로 해석하지 않았다.

## 8. 잔여 위험

### QA-RISK-024-001 — 실제 runtime·cloud 설정·provider 계약 검증

runtime allowlist logger와 safe renderer, IAM, quota ledger, cleanup, log sink DLP,
provider console의 MAM/ZDR·지역·보관, Secret Manager 회전과 incident drill은
T-20260729-025 및 후속 Backend 구현·staging activation gate에서 검증해야 한다.

## 9. 최종 판정과 인계

secret 최소 권한, telemetry 비노출, provider 보관·학습, 기존 AI·STT 삭제 경계,
호출·token 상한과 incident fail-closed 계약은 통과했다.

그러나 raw metadata 최대 30일 삭제와 전체 Backend 외부비 KRW 50,000 hard cutoff는
장애·비provider 비용 반례에서 보장되지 않는다. 처리 지역 gate도 T-020의 OpenAI
저장 전용 후보와 의미를 맞춰야 한다.

최종 판정은 `FAIL`이다. Task를 `rework_requested`로 전환하고 Development Lead
Agent / Lead Role에 인계한다.

## 10. 독립 재검증

재검증일: 2026-07-31

### 결함 해소 결과

| 결함 | 결과 | 독립 재검증 근거 |
|---|---|---|
| `QA-HIGH-024-001` | RESOLVED | raw metadata 생성 시 +28일 cleanup outbox 원자 등록, 15분 독립 sweeper, +29일 경고·차단·incident, +30일 read/export/aggregate 접근 차단과 모든 sink receipt를 정의했다. task 누락·worker crash·queue 장애·sink delete 실패·TTL 지연을 포함한 6개 fixture와 검증기가 통과했다. |
| `QA-HIGH-024-002` | OPEN | Cloud Run·Tasks·Firestore·TTL·egress·observability·build 비용을 단일 원장에 포함한 점은 보완됐다. 그러나 동시성 fixture가 하나의 2,000원 예약을 1,000원 승인과 1,000원 거절로 부분 처리하고, 문서는 예약보다 큰 실제값을 허용하면서 50,000원 불변식 유지 방법을 정의하지 않는다. |
| `QA-MEDIUM-024-001` | RESOLVED | storage region, regional processing 지원, processing boundary와 국외 처리 승인을 분리했다. OpenAI 한국 저장·한국 밖 처리 승인, Vertex EU 처리와 unknown/global/cache 실패 6개 fixture가 통과했다. |

### 잔여 차단 반례 — `QA-HIGH-024-002`

`provider_and_nonprovider_compete` fixture의 입력은 다음과 같다.

```text
requests_krw: [6000, 3000, 2000]
accepted_krw: [6000, 3000, 1000]
rejected_krw: [1000]
```

2,000원짜리 operation 하나가 1,000원 승인·1,000원 거절로 분할됐다. 하지만 본문은
provider 호출이나 비용 발생 operation의 최대 상한 전체를 실행 전에 하나의
reservation으로 묶고, 예약 성공 후에만 실행하도록 정의한다. 부분 예약으로 실제
operation을 실행하면 나머지 비용이 미예약 상태가 되고, 부분 예약으로 실행하지
않는다면 fixture의 1,000원 승인은 의미가 없다.

독립 검사:

```text
all(concurrency_cases;
  sort(accepted_krw + rejected_krw) == sort(requests_krw))
=> false
```

또한 본문은 실제 SKU 비용이 예상보다 크면 즉시 `committed_actual_krw`에 반영한다고
하면서 다른 reservation과 고정 5,000원 delayed reserve를 해제하지 않는다고 한다.
원장이 이미 50,000원 경계에 있으면 예약 초과 실제값 반영 순간 다음 불변식이 깨진다.

```text
committed_actual_krw
+ active_reservations_krw
+ delayed_billing_reserve_krw
<= 50,000
```

필수 재작업:

1. 각 reservation에 operation ID와 요청 금액을 두고 전체 요청이 `accepted` 또는
   `rejected` 중 하나가 되도록 한다. 부분 실행이 필요한 작업은 예약 전에 별도
   operation으로 명시적으로 분할한다.
2. 동시성 fixture의 accepted·rejected multiset이 requests와 정확히 일치하도록 하고
   검증 script가 이를 검사하게 한다.
3. 실제값이 reservation을 초과할 수 없도록 보수적 상한 산식을 고정하거나, 초과분이
   delayed reserve를 원자 소비하면서도 불변식을 유지하는 전이를 정의한다.
4. actual-over-reservation, 동시 provider/logging 경합과 경계 직전 요청의 전체 거절
   fixture를 추가한다.

### 회귀·검증 결과

```text
sh apps/backend/contracts/security/validate-contracts.sh: PASS
sh apps/backend/contracts/common/validate-contracts.sh: PASS
sh apps/backend/contracts/stt/validate-contracts.sh: PASS
sh apps/backend/contracts/ai/validate-contracts.sh: PASS
jq empty apps/backend/contracts/security/fixtures/*.json: PASS
aiops validate task ... --strict: PASS
git diff --check: PASS
origin/develop...HEAD: 0 behind / 4 ahead
Task ID count: 1
atomic reservation request/result correspondence: FAIL
```

기존 secret·telemetry 비노출, AI·Remote STT 삭제, provider 보관·학습,
호출·token 상한과 incident 계약에는 회귀가 없다. 실제 runtime·cloud 설정 검증은
기존 `QA-RISK-024-001`로 유지한다.

재검증 최종 판정은 `FAIL`이다. `QA-HIGH-024-002`의 원자 예약·초과 정산 반례를
해소한 뒤 다시 독립 재검증해야 한다.

## 11. 최종 독립 재검증

재검증일: 2026-07-31

### `QA-HIGH-024-002` 해소 결과

판정: `RESOLVED`.

- 모든 reservation에 고유 `operation_id`, 전체 요청 금액과 단일
  `accepted|rejected` 결정을 부여했다.
- 부분 금액 승인을 금지하고 분할 가능한 bulk 작업도 예약 전에 독립 operation으로
  나누도록 정의했다.
- 모든 동시성 fixture에서 accepted와 rejected 금액 multiset의 합이 requests
  multiset과 정확히 일치한다.
- 기존 `[6000, 3000, 2000]` 경합은 `[6000, 3000]` 전액 승인과 `[2000]` 전액
  거절로 수정됐고 원장 합계는 KRW 49,000이다.
- KRW 49,500 경계에서 501원 요청 전체가 거절되는 fixture가 추가됐다.
- 실제값이 reservation을 초과하면 차액을 같은 ledger CAS에서 delayed reserve로
  원자 차감해 `committed + active + delayed reserve` 합계를 증가시키지 않는다.
- delayed reserve보다 큰 초과 또는 CAS 실패는 가격 manifest integrity P0 incident와
  신규 비용 operation 차단으로 종료한다.

### 독립 반례 검사

```text
accepted + rejected multiset == requests multiset: PASS
operation ID unique·decision/금액 대응: PASS
boundary 501 KRW request rejected whole: PASS
actual within reservation settlement invariant: PASS
actual over reservation delayed reserve CAS invariant: PASS
settlement before/after total <= KRW 50,000: PASS
```

### 전체 회귀 결과

```text
sh apps/backend/contracts/security/validate-contracts.sh: PASS
sh apps/backend/contracts/common/validate-contracts.sh: PASS
sh apps/backend/contracts/stt/validate-contracts.sh: PASS
sh apps/backend/contracts/ai/validate-contracts.sh: PASS
jq empty apps/backend/contracts/security/fixtures/*.json: PASS
aiops validate task ... --strict: PASS
git diff --check: PASS
origin/develop...HEAD: 0 behind / 6 ahead
Task ID count: 1
```

`QA-HIGH-024-001`, `QA-HIGH-024-002`, `QA-MEDIUM-024-001`은 모두 해소됐다.
secret·telemetry 비노출, AI·Remote STT 삭제, provider 보관·학습·지역 gate,
호출·token 상한과 incident 계약에도 회귀가 없다. 변경은 Task `allowed_paths` 안이며
T-023 `done`, T-025 `approved`·T-024 완료 선행 기록을 보존한다.

### 잔여 위험과 최종 인계

실제 runtime allowlist logger·safe renderer, IAM, Cloud Billing SKU 정산, sink 삭제,
MAM/ZDR·지역 설정과 Secret Manager 회전·incident drill은 기존
`QA-RISK-024-001`로 유지해 T-20260729-025 및 후속 Backend 구현·staging activation
gate에서 검증한다.

최종 판정은 `PASS_WITH_RISK`다. Task를 `verification_passed`로 전환하고
Development Lead Agent / Completion Role에 인계한다.
