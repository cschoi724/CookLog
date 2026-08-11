# T-20260810-004 Backend QA 독립 검증 보고서

검증일: 2026-08-11
검증자: Backend QA Agent / Verification Role
기준 상태: `origin/develop@09d6c21e0740c94ec724c55cd449650468430702`
검증 branch: `task/T-20260810-004-cost-observability`
검증 worktree: `/private/tmp/cooklog-t20260810-004-cost-observability`
최초 판정: `FAIL`
최초 상태 인계: `verification_in_progress -> rework_requested`
최신 재검증 판정: `PASS_WITH_RISK`
최신 상태 인계: `verification_in_progress -> verification_passed`

## 1. 검증 범위와 경계

- Task, Backend 작업 보고서와 source of truth의 비용 reservation·hard cutoff·telemetry
  불변식을 변경 구현과 대조했다.
- 월 5,500 calls·20M input·8M output·KRW 50,000, delayed reserve, provider
  at-most-once, operation replay/conflict, 비provider 비용 합산과 redaction을 검증했다.
- 검증은 합성 price manifest·in-memory ledger·in-memory/throwing telemetry sink만
  사용했다.
- credential 등록, 실제 provider/network/Cloud Billing 호출, Google Cloud 리소스
  생성·변경·배포는 0건이다.
- 변경 경로는 Task `allowed_paths` 안이다.

## 2. 요약

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| 전체 Backend 회귀 | PASS | Node 26에서 146/146, 계약 validator 5종, boundary audit 통과 |
| 4차원 hard cutoff·delayed reserve | PASS | 승인 상수, 한도 선차단, 원자 단일 승자와 immutable rejection 통과 |
| ledger·sink·terminal telemetry fail-closed | PASS | ledger/clock/price/reconciliation/sink 실패와 결과 비공개 경로 통과 |
| provider 필수 service 최대 envelope | FAIL | 비-AI 필수 서비스 11개의 quantity를 모두 0으로 둔 요청이 `accepted` |
| 동일 operation의 다른 envelope 차단 | FAIL | Cloud Run CPU quantity 60→59 변경이 같은 반올림 KRW라는 이유로 `replayed` |
| 비provider operation 비용 envelope | FAIL | `privacy_cleanup`이 AI input SKU만으로 승인되고 kill switch 후 실행 권한 획득 |
| strict token metric schema | FAIL | `provider_call_completed`가 per-call 상한을 넘는 1B/1B token을 sink에 기록 |
| 콘텐츠·secret 비로깅 | PASS | allowlist·redaction canary와 sink/drop counter 검사 통과 |
| Node 24 non-root container | NOT RUN | host는 Node 26.4.0이고 Node 24 runtime/container 실행기가 없음 |

## 3. 차단 결함

### QA-HIGH-004-001 — provider 필수 서비스의 보수적 최대 quantity를 검증하지 않음

`hasProviderEnvelope()`는 AI input/output quantity만 token 상한과 비교하고, Cloud Run,
Tasks, Firestore, network, Logging, Trace, Monitoring은 key 존재만 확인한다. 따라서
필수 key를 모두 두되 quantity를 0으로 설정하면 reservation이 승인된다.

독립 반례 결과:

```json
{
  "decision": "accepted",
  "active": {
    "providerCalls": 1,
    "inputTokens": 5000,
    "outputTokens": 2000,
    "externalCostKrw": 9
  },
  "zeroRequiredNonAiServices": 11
}
```

동일 fixture의 구현 보고서 정상 envelope는 KRW 11이므로 이 반례는 Cloud runtime·queue·
datastore·egress·observability 최대 비용을 예약하지 않고 provider operation을 허용한다.
`SECURITY_PRIVACY_OBSERVABILITY.md` 9.2·9.5의 최대 billable quantity와 한 서비스라도
빠지면 fail-closed한다는 계약을 만족하지 못한다.

필수 재작업:

1. 서버 소유 provider operation별 SKU와 보수적 최대 quantity를 canonical envelope로
   고정한다.
2. 필수 quantity가 0·과소·누락·비정상 값이면 ledger mutation과 provider side effect
   전에 `service_disabled`로 차단한다.
3. 모든 필수 service의 0·과소·누락 negative test와 정상 최대 envelope test를 추가한다.

### QA-HIGH-004-002 — replay identity가 SKU envelope가 아닌 반올림 총액만 비교함

repository는 operation의 SKU별 quantity를 저장하지 않고 호출·token·반올림된 KRW
총액만 저장한다. 서로 다른 price envelope가 같은 KRW로 반올림되면 같은 reservation으로
오인한다.

독립 반례 결과:

```json
{
  "first": "accepted",
  "changedCloudRunCpuQuantity": "60 -> 59",
  "changed": "replayed",
  "bothRoundedExternalCostKrw": 11
}
```

이는 같은 operation ID의 다른 envelope를 fail-closed해야 한다는 Task acceptance와 문서
9.5를 위반한다. 변경된 maximum이 replay로 승인되면 호출자가 두 번째 provider 실행을
하지 않더라도 audit·정산 기준 envelope의 무결성을 증명할 수 없다.

필수 재작업:

1. operation reservation에 정규화한 operation kind·SKU·최대 quantity 전체 또는 그
   canonical hash를 불변 저장한다.
2. replay는 canonical envelope가 정확히 같은 경우에만 반환하고, quantity 하나라도
   다르면 반올림 금액과 무관하게 `operation_conflict`로 차단한다.
3. 같은 KRW로 반올림되는 다른 accepted/rejected envelope 회귀 테스트를 추가한다.

### QA-HIGH-004-003 — 비provider operation kind와 필수 비용 service가 연결되지 않음

`reserveBillableOperation()`은 `operationKind`와 `priceQuantities`의 관계를 검증하지
않는다. 다음 요청이 `accepted`되고 privacy cleanup 실행 권한까지 획득했다.

```json
{
  "operationKind": "privacy_cleanup",
  "priceQuantities": { "ai_provider_input": 0.000001 },
  "decision": "accepted",
  "cleanupAuthorized": true,
  "reservedExternalCostKrw": 1
}
```

실제 delete·retry 비용 없이 무관한 AI SKU만 예약해도 실행이 가능하므로 storage,
authentication, logging, egress, build, TTL delete와 cleanup retry를 같은 KRW 원장에
보수적으로 합산한다는 계약을 보장하지 못한다.

필수 재작업:

1. 각 billable operation kind에 허용·필수 SKU와 maximum quantity schema를 연결한다.
2. 다른 kind의 SKU, 누락, 0·과소 quantity와 unknown extra SKU를 fail-closed한다.
3. storage/auth/logging/egress/build/TTL/privacy cleanup 각각의 정상·오류 envelope와
   kill switch 후 사전 승인 cleanup 검사를 추가한다.

## 4. 보완 결함

### QA-MEDIUM-004-001 — provider token telemetry가 승인된 per-call 상한을 강제하지 않음

`SafeLogger`는 `input_tokens`와 `output_tokens`를 generic integer field로 처리해 각
1,000,000,000까지 허용한다. `provider_call_completed`에 1B input·1B output을 넣은
독립 반례가 `true`를 반환하고 sink에 1건을 기록했다. provider guard 정상 경로는
settlement에서 5,000/2,000을 확인하지만, export된 logger 자체의 strict schema는
문서 9.5의 “상한이 검증된 정수 metric만 허용”을 보장하지 않는다.

필수 재작업:

- event/field별 상한을 분리해 `provider_call_completed.input_tokens <= 5,000`,
  `output_tokens <= 2,000`을 logger schema에서도 강제하고 경계±1 테스트를 추가한다.

## 5. 통과 항목

- 승인된 월 한도 상수와 5,000원 delayed billing reserve가 계약 fixture와 일치한다.
- process-local 단일 repository 안에서는 호출·token·KRW의 전액 승인/거절, 동시 단일
  승자, immutable rejection과 settlement 불변식이 유지된다.
- price/FX/SKU/clock/reconciliation/ledger 장애와 admission sink 실패가 billable
  side effect 전에 fail-closed한다.
- terminal telemetry 실패와 token settlement overflow는 결과를 비공개로 유지하고 새
  비용 operation을 차단한다.
- `input_tokens`·`output_tokens`의 정상 정수 metric은 허용하면서 authorization,
  access token, proof, prompt, recipe, transcript와 raw provider response field/value는
  sink에 기록되지 않는다.
- canary 문자열은 테스트 입력에만 존재하며 production source의 fallback 출력이나 실제
  외부 sink 기록은 확인되지 않았다.

## 6. 수행 검증

```text
npm run verify: PASS
- TypeScript typecheck/build: PASS
- Node runtime tests: 146/146 PASS
- common/STT/AI/security/shared contract validators: PASS
- Backend foundation boundary audit: PASS

git diff --check: PASS
aiops validate task ... --strict: PASS
final origin/develop fetch·SHA check: PASS (`09d6c21`, 0 behind / 0 ahead)
provider zero-required-quantity adversarial run: FAIL (accepted)
same-rounded-KRW changed-envelope adversarial run: FAIL (replayed)
privacy-cleanup wrong-SKU adversarial run: FAIL (accepted/authorized)
provider token metric 1B/1B adversarial run: FAIL (sink write accepted)
actual provider/network/Cloud Billing calls: 0
credential/cloud resource/deployment changes: 0
```

## 7. 잔여 위험

- Node 24.18.0 non-root container는 이 host에 Node 24와 container 실행기가 없어 재검증하지
  못했다. 현재 회귀는 Node 26.4.0에서만 확인됐다.
- process-local repository는 restart·multi-instance 경합을 보장하지 않는다. 실제
  distributed transaction, 월 ledger 생성·복구, Billing export reconciliation은 T-006
  composition gate에서 검증해야 한다.
- synthetic SKU·가격·telemetry sink만 사용했다. 실제 Cloud Billing Catalog, 환율,
  Logging/Trace/Monitoring sink와 재귀 비용 reservation은 외부 승인 전 연결할 수 없다.
- 위 위험은 현재 HIGH 결함과 별개이며, HIGH 결함이 해소돼도 production activation 전에
  계속 필수 gate로 유지해야 한다.

## 8. 최종 판정과 인계

전체 회귀와 기존 비로깅 경계는 통과했지만, provider/비provider 비용 envelope를 과소
예약할 수 있고 다른 envelope가 replay로 오인된다. 이는 KRW 50,000 hard cutoff와
operation idempotency의 핵심 acceptance를 직접 위반한다.

최종 판정은 `FAIL`이다. Task를 `rework_requested`로 전환하고 Development Lead Agent /
Lead Role에 재작업 범위와 승인 조율을 인계한다.

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Lead Role이야.
Task T-20260810-004의 재작업 범위를 조율해줘.

- 현재 상태: rework_requested
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 09d6c21e0740c94ec724c55cd449650468430702
- 다음에 해야 할 일: QA-HIGH-004-001~003과 QA-MEDIUM-004-001을 재작업 범위로 정리하고 사용자 승인 후 Execution Role에 재인계해줘.
- 기준 문서: 상위 production gateway Task, T-024 security guardrail, `SECURITY_PRIVACY_OBSERVABILITY.md`
- 허용 경로: Task front matter의 `allowed_paths`
- 참고 산출물: 구현 보고서와 이 QA 보고서
- 변경/검토 대상: production cost repository/guard, safe logger, security tests·fixture·문서
- 남은 리스크: process-local·synthetic adapter, 실제 distributed/Billing/sink/composition, Node 24 non-root 미검증
- 차단/결정 필요: 필수 service 최대 quantity와 operation-kind별 canonical envelope를 서버 소유 계약으로 고정해야 함
- 재개 가능 시: scoped 또는 approved로 전환할지 사용자에게 확인해줘.
- 주의: 실제 외부 호출·credential·Cloud Billing·Google Cloud 리소스·배포는 계속 금지한다.

## 9. 2차 재작업 독립 재검증

재검증일: 2026-08-11
재검증 기준: `origin/develop@09d6c21e0740c94ec724c55cd449650468430702`
재검증 판정: `PASS_WITH_RISK`
상태 인계: `verification_in_progress -> verification_passed`

### 9.1 결함 해소 결과

| 결함 | 결과 | 독립 재검증 근거 |
|---|---|---|
| `QA-HIGH-004-004` | RESOLVED | provider token accessor와 billable kind accessor가 각각 read 0회로 `service_disabled` 종료됐다. request·quantity throwing Proxy도 trap 0회였고 ledger mutation 0, cleanup 권한 false를 확인했다. 정상 data-property request는 `accepted`, 동일 replay는 `replayed`이며 active provider reservation은 1건만 유지됐다. |
| `QA-MEDIUM-004-002` | RESOLVED | top-level·quantity의 symbol, non-enumerable expected/extra, unknown field, accessor, Proxy와 invalid billable kind가 예외 없이 `service_disabled`로 차단됐다. `Reflect.ownKeys`와 descriptor의 exact enumerable own data-property projection이 같은 local 값만 validation·hash·repository에 전달함을 코드로 대조했다. |
| 이전 QA 4건 | RESOLVED 유지 | provider 13개 필수 quantity의 0·변형, same-cost 다른 envelope hash, privacy cleanup wrong-SKU, provider token 1B/1B 원본 반례가 모두 차단됐다. |

### 9.2 독립 검증 결과

```text
public/canonical: origin/develop@09d6c21e0740c94ec724c55cd449650468430702
worktree/HEAD: task/T-20260810-004-cost-observability@09d6c21 (0 behind / 0 ahead)

npm run verify: PASS
- TypeScript typecheck/build: PASS
- Node runtime tests: 153/153 PASS
- common/STT/AI/security/shared contract validators: 5/5 PASS
- Backend foundation boundary audit: PASS

독립 adversarial script: PASS
- provider accepted/replayed 분리와 active reservation 1건: PASS
- operation ID·request content 비로깅: PASS
- provider token accessor read 0회: PASS
- billable kind accessor read 0회·cleanup false: PASS
- request/quantity Proxy trap 0회: PASS
- symbol·non-enumerable·unknown·invalid kind strict 차단: PASS
- provider 13개 필수 quantity 0 차단: PASS
- privacy cleanup wrong-SKU 차단: PASS
- same-cost 다른 envelope hash conflict: PASS
- 1B/1B provider token telemetry 차단: PASS
- hard cutoff `quota_exceeded`, invalid shape `service_disabled` mapping: PASS

git diff --check: PASS
aiops validate task ... --strict: PASS
변경 경로: Task allowed_paths 내부
actual provider/network/Cloud Billing calls: 0
credential/cloud resource/deployment changes: 0
```

### 9.3 잔여 위험과 최종 판정

- 검증 runtime은 Node.js 26.4.0이다. production 기준 Node 24 non-root container 검증은
  T-20260810-006 gate에 남아 있다.
- repository는 process-local 구현이고 price/SKU·telemetry transport는 synthetic이다.
  실제 multi-instance transaction, Billing export reconciliation, required sink 장애·복구와
  production composition은 T-006에서 검증해야 한다.
- 범위 밖 App Attest forgery fixture에는 base64url 마지막 문자 변조가 같은 byte로 decode될
  수 있는 간헐성이 남아 있으나, 이번 전체 실행은 첫 시도에 153/153 통과했다.
- ZDR, Modified Retention, 국외 처리 승인과 credential 준비 전에는 실제 provider를
  활성화하지 않는다. 이번 검증에서도 외부 호출과 cloud 변경은 수행하지 않았다.

승인된 WP-R5~R6와 이전 QA 결함 4건은 모두 해소됐고, 요청 projection·strict schema·오류
mapping·provider replay/at-most-once 의미론·비로깅에서 차단 결함을 재현하지 못했다. 따라서
현재 구현 범위는 `PASS_WITH_RISK`이며 Completion Role 검토로 인계한다.

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Completion Role이야.
Task T-20260810-004의 완료 조건과 잔여 위험 수용 여부를 검토해줘.

- 현재 상태: verification_passed
- 기준 상태 ref/SHA: origin/develop@09d6c21e0740c94ec724c55cd449650468430702
- 검증 판정: PASS_WITH_RISK
- 확인된 결과: QA-HIGH-004-001~004와 QA-MEDIUM-004-001~002 RESOLVED, 전체 153/153·계약 5종·boundary audit·독립 악성 입력 반례 PASS
- 다음에 해야 할 일: 미커밋 Task 변경의 완료 조건을 확인하고 process-local·synthetic·Node 24/composition 잔여 위험을 수용할지 Product Owner와 결정해줘.
- 필수 후속 gate: T-20260810-006에서 Node 24 non-root, distributed ledger, 실제 Billing/sink/composition 검증
- 금지 경계: ZDR·Modified Retention·국외 처리 승인·credential 전 실제 외부 provider 호출, Cloud Billing/Google Cloud 변경·배포 금지

## Appendix A. 이전 재검증 실패 이력

재검증일: 2026-08-11
재검증 기준: `origin/develop@09d6c21e0740c94ec724c55cd449650468430702`
재검증 판정: `FAIL`
상태 인계: `verification_in_progress -> rework_requested`

### A.1 이전 결함 해소 결과

| 결함 | 결과 | 독립 재검증 근거 |
|---|---|---|
| `QA-HIGH-004-001` | RESOLVED | 비-AI 필수 service quantity를 모두 0으로 둔 원본 반례가 `service_disabled`, ledger mutation 0으로 종료됐다. 13개 exact provider envelope의 누락·0·과소·과대·비정상·extra 회귀가 통과했다. |
| `QA-HIGH-004-002` | RESOLVED | Cloud Run CPU 60→59의 same-KRW 원본 반례가 `service_disabled`로 차단됐고 최초 reservation만 유지됐다. repository의 accepted/rejected hash 충돌과 manifest identity 회귀도 통과했다. |
| `QA-HIGH-004-003` | RESOLVED | `privacy_cleanup`에 AI input SKU만 넣은 원본 반례가 `service_disabled`, cleanup 권한 false, ledger mutation 0으로 종료됐다. 일반 데이터 property를 사용한 9개 kind exact envelope 회귀가 통과했다. |
| `QA-MEDIUM-004-001` | RESOLVED | `provider_call_completed`의 1B/1B token 원본 반례가 false, sink 0건으로 종료됐고 5,000/2,000 경계±1 검사가 통과했다. |

### A.2 신규 차단 결함

#### QA-HIGH-004-004 — request accessor 재평가로 token·operation kind 검증을 우회함

`reserveProviderOperation()`은 `maxInputTokens`와 `maxOutputTokens`를 exact maximum 검증
후 repository request를 만들 때 다시 읽는다. data property만 허용하거나 검증값을 한 번
project하지 않으므로 getter가 첫 읽기에는 5,000/2,000, 두 번째 읽기에는 0/0을 반환하면
reservation이 승인된다.

독립 반례 결과:

```json
{
  "decision": "accepted",
  "inputReads": 2,
  "outputReads": 2,
  "active": {
    "providerCalls": 1,
    "inputTokens": 0,
    "outputTokens": 0,
    "externalCostKrw": 11
  }
}
```

provider caller가 이후 최대 token 값으로 side effect를 수행하면 월 token hard cutoff에는
0으로 예약돼 승인된 20M/8M 상한을 우회한다.

`reserveBillableOperation()`도 `operationKind`를 expected envelope 조회, repository kind,
hash 생성에서 세 번 읽는다. getter가 `runtime -> privacy_cleanup -> runtime`을 반환하면
runtime envelope·비용만 사용하면서 저장된 kind는 `privacy_cleanup`이 된다.

```json
{
  "decision": "accepted",
  "kindReads": 3,
  "cleanupAuthorized": true,
  "activeExternalCostKrw": 3
}
```

이는 server-owned token·operation kind, exact kind envelope와 사전 승인된 동일 kind의
privacy cleanup만 kill switch 이후 실행할 수 있다는 계약을 직접 위반한다.

필수 재작업:

1. provider/billable request를 exact own plain data-property schema로 검증하고 accessor,
   proxy, non-enumerable·symbol·unknown field를 side effect 없이 거부한다.
2. operation ID, kind, token/attempt 상한과 quantity object를 한 번만 읽어 immutable local
   projection을 만든 뒤 validation, hash와 repository request에 같은 projection을 사용한다.
3. operation kind는 `Object.hasOwn(PRODUCTION_BILLABLE_OPERATION_ENVELOPES, kind)`로 먼저
   검사한 뒤 index하고, invalid kind는 throw 없이 `service_disabled`로 종료한다.
4. token-changing getter, kind-changing getter와 throwing proxy에서 ledger mutation 0,
   cleanup 권한 false와 getter 미실행을 검증하는 회귀를 추가한다.

#### QA-MEDIUM-004-002 — exact quantity schema가 non-enumerable extra를 누락하고 invalid kind를 throw함

`ownQuantityEntries()`는 `Reflect.ownKeys()`로 symbol만 확인한 뒤 `Object.keys()`만
project한다. 이 때문에 `cloud_build`를 non-enumerable own property로 추가한 provider
envelope가 `accepted`됐다. 또한 data property `operationKind: "provider"`를 billable
guard에 넣으면 expected envelope가 `undefined`인 채 `Object.entries()`가 실행돼
`TypeError`가 외부로 전파됐다.

필수 재작업:

- 모든 `Reflect.ownKeys()`가 enumerable data property인지 확인하고 exact key set과
  비교하며, invalid kind·shape·descriptor는 예외 없이 `service_disabled`로 차단한다.

### A.3 전체 재검증 결과

```text
public_source: origin/develop@09d6c21e0740c94ec724c55cd449650468430702
worktree/HEAD: task/T-20260810-004-cost-observability@09d6c21 (0 behind / 0 ahead)
npm run verify: PASS
- TypeScript typecheck/build: PASS
- Node runtime tests: 151/151 PASS
- common/STT/AI/security/shared contract validators: PASS
- Backend foundation boundary audit: PASS
QA 원본 반례 4종: RESOLVED
provider token-changing getter: FAIL (`accepted`, ledger 0/0 token)
billable kind-changing getter: FAIL (`accepted`, privacy cleanup authorized)
non-enumerable unknown extra SKU: FAIL (`accepted`)
invalid billable kind: FAIL (`TypeError` thrown)
git diff --check: PASS
aiops validate task ... --strict: PASS
actual provider/network/Cloud Billing calls: 0
credential/cloud resource/deployment changes: 0
```

Node 24.18.0 non-root container, process-local repository, synthetic SKU·sink, 실제
distributed/Billing/composition 위험은 이전 보고와 동일하게 유지한다.

### A.4 재검증 최종 판정과 인계

이전 결함 4건과 정상 회귀는 해소·통과했다. 그러나 request accessor의 재평가가 provider
token 원자 reservation과 privacy cleanup kind 권한을 우회하므로 핵심 acceptance를 아직
충족하지 못한다. 최종 판정은 `FAIL`이다.

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Lead Role이야.
Task T-20260810-004의 재작업 범위를 다시 조율해줘.

- 현재 상태: rework_requested
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 09d6c21e0740c94ec724c55cd449650468430702
- 다음에 해야 할 일: `QA-HIGH-004-004`와 `QA-MEDIUM-004-002`를 request 단일 projection·exact own data-property schema 재작업으로 범위화하고 사용자 승인 후 Execution Role에 재인계해줘.
- 기준 문서: 상위 production gateway Task, T-024 security guardrail, `SECURITY_PRIVACY_OBSERVABILITY.md`
- 허용 경로: Task front matter의 `allowed_paths`
- 참고 산출물: 구현 보고서와 이 QA 보고서 9절
- 변경/검토 대상: production cost guard request projection, exact envelope structural validation과 security regression tests
- 남은 리스크: process-local·synthetic adapter, 실제 distributed/Billing/sink/composition, Node 24 non-root 미검증
- 차단/결정 필요: provider token/kind/request 값을 한 번만 data-property로 project해 validation·hash·ledger에 동일하게 사용해야 한다.
- 재개 가능 시: scoped 또는 approved로 전환할지 사용자에게 확인해줘.
- 주의: 실제 외부 호출·credential·Cloud Billing·Google Cloud 리소스·배포는 계속 금지한다.
