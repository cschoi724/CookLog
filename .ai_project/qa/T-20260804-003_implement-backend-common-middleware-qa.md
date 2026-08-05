# T-20260804-003 Backend QA 독립 검증 보고서

검증일: 2026-08-05, 재검증 2026-08-05
검증자: Backend QA Agent / Verification Role
검증 기준: `task/T-20260804-003-implement-backend-common-middleware` `1bf8b4f`
기준 develop: `origin/develop` `39468f4`
현재 판정: `PASS_WITH_RISK`
현재 상태 인계: `verification_in_progress -> verification_passed`

## 0. 재검증 결론

`QA-HIGH-003-001~002`, `QA-MEDIUM-003-003`은 모두 해소됐다. 이전 QA가 작성한 독립
actual HTTP 반례를 수정 없이 재실행해 violation extra property의 합성 secret이 body에
없고, prototype 이름의 unknown field가 모두 거부되며, query가 있는 `/v2`가 정확한 공개
오류 코드로 정규화됨을 확인했다.

기존 health/lifecycle 15개, T-003 전용 24개와 common·STT·AI·security·shared fixture
validator도 무회귀다. Host Node 26으로 목표 Node 24 engine 경고가 있으며 production
분산 limiter·idempotency datastore transaction은 승인된 후속 범위다. 신규 HIGH·MEDIUM
결함은 없고 최종 판정은 `PASS_WITH_RISK`다.

## 1. 최초 검증 범위

- 공통 success/problem envelope와 canonical request ID
- 공개 오류 catalog·negative fixture 동일성 및 악성 입력 비노출
- strict JSON Schema subset과 `additionalProperties: false`
- installation token·attestation local fake와 인증 선차단
- installation·IP·project rate limit 및 limiter unavailable
- idempotency body hash·동시 단일 승자·충돌·replay
- 기존 health/lifecycle와 common·STT·AI·security·shared fixture 무회귀
- Task 허용 경로와 최신 `origin/develop` 정렬

## 2. 최초 검증 요약

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| lockfile 설치·audit | PASS_WITH_RISK | 설치와 audit 0건. Host Node 26으로 목표 Node 24 engine 경고가 있다. |
| typecheck·build·기존 회귀 | PASS | `npm run check`, 기존 15/15 통과. |
| 신규 middleware suite | PASS | HTTP·auth 신규 21/21 통과. |
| 공용 계약 validator | PASS | common·STT·AI·security·shared fixture 모두 통과. |
| 인증 선차단 | PASS | 누락·불일치·만료·폐기·attestation replay가 handler 전에 차단된다. |
| rate limit | PASS_WITH_RISK | installation·IP·project·limit 0·unavailable 단위 경계는 통과했다. production 분산 adapter는 후속 범위다. |
| idempotency | PASS_WITH_RISK | 단일 process에서 20개 동시 요청 중 owner 1개, 충돌·replay가 통과했다. datastore transaction은 후속 범위다. |
| 공개 오류 비노출 | FAIL | violation 객체의 추가 필드가 실제 problem 응답으로 직렬화돼 합성 secret이 노출된다. |
| strict schema fail-closed | FAIL | `toString`, `constructor`, `__proto__` 알 수 없는 필드가 `additionalProperties: false`를 우회한다. |
| unsupported API version | FAIL | `/v2?probe=1`이 `API_VERSION_UNSUPPORTED`가 아닌 `RESOURCE_NOT_FOUND`다. |

## 3. 최초 차단 결함

### QA-HIGH-003-001 — violation 추가 필드가 공개 오류 응답으로 누출됨

`areViolationsSafe`는 각 객체의 `field`와 `reason`만 검사하고 추가 key 존재 여부를
검사하지 않는다. 검사를 통과한 원본 객체를 그대로 `PublicProblem.violations`에 넣으므로
호출자가 가진 raw 값·token·provider 정보가 추가 필드에 있으면 공개 응답으로 직렬화된다.

독립 실제 HTTP 반례:

```text
requested code: VALIDATION_FAILED
violation: { field: "body", reason: "INVALID_FORMAT",
             secret: "qa-raw-token-and-recipe" }
response content-type: application/problem+json
actualHttpResponseLeakedSecret=true
```

이는 `error-envelope.schema.json`의 violation `additionalProperties: false`와 API 계약의
secret·원문 입력 비노출을 직접 위반한다. TypeScript 타입은 runtime 입력을 강제하지
않으므로 공개 renderer가 자체적으로 fail closed해야 한다.

필수 재작업:

1. violation 객체가 정확히 `field`, `reason` 두 own property만 갖는지 검사한다.
2. 검증 후 원본 객체를 반환하지 말고 두 허용 필드만 새 객체로 투영한다.
3. extra property·getter·prototype·symbol·20개 초과를 실제 HTTP 응답으로 검증한다.
4. 악성 입력에서 고정 `INTERNAL_ERROR`로 치환되고 합성 secret이 body/header에 없음을
   assertion한다.

### QA-HIGH-003-002 — prototype 이름이 strict schema의 알 수 없는 필드 검사를 우회함

`validateJsonSchema`는 unknown key 검사에 `key in properties`를 사용한다. `in`은 own
property뿐 아니라 `Object.prototype`도 검색하므로 빈 `properties`에서도 `toString`,
`constructor`, `__proto__`가 존재하는 것으로 판정된다.

독립 반례:

```json
{
  "schema": { "type": "object", "additionalProperties": false, "properties": {} },
  "payload_keys": ["toString", "constructor", "__proto__"],
  "violations": []
}
```

공개 schema의 `additionalProperties: false`는 알 수 없는 필드를 차단해야 하며 schema
version·추가 필드는 fail closed로 검증해야 한다. 현재 결과는 세 필드를 모두 허용한다.

필수 재작업:

1. `Object.hasOwn(properties, key)`로 허용 property를 검사한다.
2. required와 child lookup도 own property 기준으로 일관되게 처리한다.
3. `toString`, `constructor`, `prototype`, `__proto__`와 nested object/array 반례를 추가한다.
4. 반환 violation에는 실제 payload 값이 포함되지 않음을 유지한다.

## 4. 최초 중간 결함

### QA-MEDIUM-003-003 — query가 있는 unsupported API version이 잘못 분류됨

not-found handler는 query를 포함한 `request.url`에 `/^\/v(\d+)(?:\/|$)/`를 적용한다.
따라서 `/v2?probe=1`은 `/v2` 다음 문자가 `?`라 version match에 실패한다.

```text
GET /v2?probe=1 -> 404 RESOURCE_NOT_FOUND
expected         -> 404 API_VERSION_UNSUPPORTED
```

API 계약은 지원하지 않는 `/v{n}`을 `API_VERSION_UNSUPPORTED`로 반환하도록 규정한다.
query를 제외한 pathname 또는 Fastify의 canonical route path를 기준으로 판정하고 query
유무·fragment 인코딩 반례를 추가해야 한다.

## 5. 최초 통과 상세

- public error catalog 20개가 계약 catalog와 일치한다.
- 정상 request ID는 header와 success/problem body에 동일하게 유지된다.
- 인증 누락·subject mismatch·token expiry·revocation은 domain handler 호출 0회다.
- local attestation fake는 production에서 생성되지 않고 동일 proof replay를 거부한다.
- IP HMAC partition은 원 IP를 포함하지 않고 `X-Forwarded-For`를 신뢰하지 않는다.
- limiter unavailable은 503, project limit 0과 초과는 provider/domain 전에 차단된다.
- canonical JSON은 key 순서를 정규화하고 다른 body/path의 key 재사용을 거부한다.
- 동시 20개 idempotency begin은 owner 1개·in-progress 19개다.
- replay는 원본 status/body/request ID와 `CookLog-Idempotency-Replayed`를 유지한다.
- 실제 provider·원격 STT endpoint·cloud resource·운영 secret은 추가되지 않았다.

## 6. 최초 수행 검증

```text
origin/develop...HEAD: 0 behind / 1 ahead (QA 기록 전)
npm ci --ignore-scripts: PASS, audit 0건, Node 26 host engine warning
npm run check: PASS, 기존 15/15
node --test dist/tests/http/*.test.js dist/tests/auth/*.test.js: PASS, 신규 21/21
common·STT·AI·security validator: PASS
iOS·Backend shared fixture validator: PASS
독립 actual HTTP violation extra-field 반례: FAIL, secret 응답 노출
독립 strict schema prototype-key 반례: FAIL, violations=[]
독립 GET /v2?probe=1: FAIL, RESOURCE_NOT_FOUND
aiops validate task --strict: QA 인계 전 실행
git diff --check: QA 인계 전 실행
```

## 7. 최초 판정과 인계

공식 36개 테스트와 기존 계약 validator는 통과했지만 공개 오류의 secret 비노출과 strict
schema fail-closed라는 핵심 보안 계약을 실제 반례가 위반한다. 신규 HIGH 2건과 MEDIUM
1건으로 최종 판정은 `FAIL`이다. Task를 `rework_requested`로 전환하고 Development Lead
Agent / Lead Role에 재작업 범위 조율을 인계한다. T-004~007은 T-003 재검증 통과 전
열지 않는다.

## 8. 재검증 수행 결과

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| lockfile 설치·audit | PASS_WITH_RISK | `npm ci --ignore-scripts`, audit 0건. Host Node 26 engine 경고가 있다. |
| 기존 회귀 | PASS | typecheck·build와 health/lifecycle 15/15 통과. |
| T-003 전용 회귀 | PASS | HTTP·auth 24/24 통과. |
| `QA-HIGH-003-001` | PASS | extra property 실제 HTTP 응답에 합성 secret 없음, 500 `INTERNAL_ERROR`. |
| `QA-HIGH-003-002` | PASS | `toString`·`constructor`·`__proto__`가 `UNSUPPORTED_VALUE`로 거부된다. |
| `QA-MEDIUM-003-003` | PASS | `/v2?probe=1`이 404 `API_VERSION_UNSUPPORTED`를 반환한다. |
| 공용 계약 | PASS | common·STT·AI·security·shared fixture validator 모두 통과. |
| production adapter | DEFERRED | 분산 limiter·datastore transaction·실제 attestation/token은 후속 승인 범위다. |

```text
origin/develop...HEAD: 0 behind / 4 ahead (QA 기록 전)
npm ci --ignore-scripts: PASS, audit 0건, Node 26 host engine warning
npm run check: PASS, 기존 15/15
node --test dist/tests/http/*.test.js dist/tests/auth/*.test.js: PASS, T-003 24/24
독립 actual HTTP violation extra-field 반례: PASS, body secret 비노출
독립 strict schema prototype-key 반례: PASS, 3개 field 모두 거부
독립 GET /v2?probe=1: PASS, API_VERSION_UNSUPPORTED
common·STT·AI·security validator: PASS
iOS·Backend shared fixture validator: PASS
aiops validate task --strict: QA 인계 전 실행
git diff --check: QA 인계 전 실행
```

## 9. 최종 인계

세 결함은 해소됐고 신규 HIGH·MEDIUM 결함은 없다. Task를 `verification_passed`로 전환해
Development Lead Agent / Lead Role에 완료 검토를 인계한다. Quality Team은 Task를 직접
`done` 처리하지 않는다. Lead는 Node 24 실환경과 production 분산 adapter·datastore
transaction을 T-007 또는 별도 승인 Task에서 검증하는 잔여 위험을 수용할지 판단해야 한다.
