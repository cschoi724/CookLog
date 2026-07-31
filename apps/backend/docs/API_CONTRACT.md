# CookLog Backend 공통 API 계약

상태: T-20260729-021 구현 계약  
버전: v1  
작성일: 2026-07-30

## 1. 목적과 정책 경계

이 문서는 CookLog Backend의 공통 HTTP, 설치 인증, 요청 제한, idempotency, timeout,
retry와 오류 계약을 정의한다. Recipe AI job은 이 계약 위에 별도 도메인 계약을
추가한다.

첫 공개 출시의 STT는 Apple 기기 내 처리가 기본이다. Backend는 첫 출시 음성을 받지
않으며, 기기 내 STT 실패를 원격 STT로 자동 전환하지 않는다. 향후 원격 STT가 별도
제품 정책·비용 승인을 받더라도 이 문서의 공통 인증과 오류 규칙만 재사용한다.
이 Task에는 원격 STT endpoint, 음성 upload 경로와 adapter 활성화가 없다.

`MUST`, `MUST NOT`, `SHOULD`, `MAY`는 각각 필수, 금지, 권장, 선택을 뜻한다.

## 2. 전송과 버전

| 항목 | 계약 |
|---|---|
| 전송 | 운영 환경은 HTTPS만 허용한다. HTTP 요청은 처리하지 않는다. |
| base path | 모든 공개 endpoint는 `/v1` 아래에 둔다. |
| 성공 media type | `application/json` |
| 실패 media type | `application/problem+json` |
| 시간 | RFC 3339 UTC, 예: `2026-07-30T03:20:00Z` |
| 식별자 | 공개 resource와 request ID는 UUID를 사용한다. |
| 호환성 | v1에서 필드 제거·의미 변경·enum 축소는 금지한다. 선택 필드 추가만 허용한다. |

지원하지 않는 `/v{n}`은 HTTP 404와 `API_VERSION_UNSUPPORTED`를 반환한다. 클라이언트는
응답 `meta.api_version`이 `v1`이 아니면 데이터를 적용하지 않는다.

## 3. 공통 header와 envelope

### 3.1 요청 header

| Header | 조건 | 규칙 |
|---|---|---|
| `Authorization` | 보호 endpoint 필수 | `Bearer <installation access token>` |
| `CookLog-Installation-ID` | 보호 endpoint 필수 | UUID. token의 `sub`와 반드시 같아야 한다. |
| `CookLog-Client-Request-ID` | 선택 | 클라이언트 UUID. 상관관계용이며 신뢰·중복 판정에 사용하지 않는다. |
| `Idempotency-Key` | side effect가 있는 POST 필수 | UUID v4. 규칙은 7절을 따른다. |
| `Content-Type` | body가 있으면 필수 | `application/json` |
| `Accept` | 권장 | `application/json, application/problem+json` |

서버는 모든 요청마다 클라이언트 값과 별개의 UUID v4 `request_id`를 생성한다. 성공·실패
응답에 `CookLog-Request-ID` header를 넣고 body의 `meta.request_id` 또는
`request_id`와 동일하게 유지한다. 로그·trace·idempotency record도 이 canonical ID를
사용한다. 잘못된 `CookLog-Client-Request-ID`는 요청 거부 사유가 아니며 저장하지 않는다.

### 3.2 성공 envelope

```json
{
  "data": {},
  "meta": {
    "request_id": "5b9086aa-d251-4b68-b8d4-03c53f2cc454",
    "api_version": "v1"
  }
}
```

`apps/backend/contracts/common/success-envelope.schema.json`이 기계 검증 원본이다.

### 3.3 실패 envelope

실패 응답은 RFC 9457 Problem Details 형태를 사용한다.

```json
{
  "type": "https://api.cooklog.app/problems/rate-limited",
  "title": "Rate limit exceeded",
  "status": 429,
  "detail": "The request limit for this installation was exceeded.",
  "instance": "urn:cooklog:request:5b9086aa-d251-4b68-b8d4-03c53f2cc454",
  "request_id": "5b9086aa-d251-4b68-b8d4-03c53f2cc454",
  "code": "RATE_LIMITED",
  "user_message_key": "error.rate_limited",
  "retryable": true,
  "retry_after_seconds": 30
}
```

- `code`는 iOS 분기용 공개 안정 코드다.
- `user_message_key`는 iOS의 현지화 문구 선택 키다. iOS는 `title` 또는 `detail`을
  사용자에게 그대로 표시하면 안 된다.
- `title`과 `detail`은 개발·지원용 안전한 설명이며 provider명, 모델명, stack,
  secret, 원문 입력과 내부 resource 식별자를 포함하면 안 된다.
- 내부 오류 코드는 `internal_error_code`로 별도 로그에만 기록한다. 외부 envelope에는
  이 필드가 없으며 schema의 `additionalProperties: false`로 누출을 막는다.
- `retryable=true`는 재시도가 성공할 가능성만 뜻한다. 실제 재시도 가능 여부는 HTTP
  method와 7·8절 규칙을 함께 만족해야 한다.

기계 검증 원본은 `error-envelope.schema.json`이다.

## 4. 설치 단위 인증과 앱 무결성

### 4.1 신뢰 모델

- 로그인 없는 첫 출시에서 `installation_id`는 quota와 데이터 분리용 가명 식별자다.
  사용자 신원이나 단말 소유권의 증거가 아니다.
- 클라이언트가 보낸 installation ID만으로 인증하지 않는다.
- 서버는 무결성 provider를 `AttestationVerifier` 인터페이스 뒤에서 검증하고, 성공한
  결과를 공통 claim으로 정규화한 뒤 짧은 수명의 installation access token을 발급한다.
- 운영 환경은 검증 provider가 없거나 검증 서비스에 연결할 수 없으면 fail closed한다.
  debug token과 development App Attest environment는 운영에서 거부한다.

정규화 claim:

| claim | 의미 |
|---|---|
| `provider` | `apple_app_attest` 또는 `firebase_app_check` |
| `app_id` | 승인된 CookLog bundle/project app 식별자 |
| `environment` | `production`만 운영에서 허용 |
| `installation_id` | 서버 installation record와 결합한 UUID |
| `replay_protected` | challenge·counter 또는 limited-use token 소비가 확인됐는지 |
| `verified_at` | 검증 시각 |

### 4.2 인증 endpoint

#### `POST /v1/auth/challenges`

인증 전 endpoint다. 256-bit CSPRNG challenge를 생성하고 120초 후 만료시킨다.
challenge는 hash만 저장하고 한 번 사용하거나 검증 실패 3회 시 폐기한다.

응답 `data`는 `auth-challenge.schema.json`을 따른다.

#### `POST /v1/installations`

최초 설치 등록 endpoint다. `Idempotency-Key`가 필수다. 요청 body는
`installation-attestation.schema.json`을 따른다.

- Apple App Attest: 최초 등록은 `proof_kind=attestation`이어야 한다. 서버는 attestation
  chain, nonce, App ID hash, production AAGUID, credential ID/key ID를 검증하고 공개키와
  receipt를 installation record에 연결한다.
- Firebase App Check: 활성화된 경우에만 `limited_use_token`을 받아 서버에서 signature,
  issuer, audience/app ID, expiry를 검증하고 token을 소비한다.
- 선택된 Backend runtime이 limited-use token 소비 검증을 지원하지 않으면 Firebase
  App Check provider는 access token 발급 경로에 활성화할 수 없다. 재사용 가능한 일반
  session token으로 우회하지 않는다.
- challenge ID, installation ID, app version과 요청 목적을 canonical client data로
  묶는다. challenge 재사용은 `ATTESTATION_REPLAYED`로 거부한다.

성공 시 `installation-token.schema.json` 형태의 access token을 반환한다.

#### `POST /v1/installations/token`

만료 전후 access token 갱신 endpoint다. 새 challenge와 새 proof가 필수다.

- Apple 경로는 저장된 공개키로 assertion signature, App ID hash, challenge와 monotonic
  counter를 검증한다. counter가 이전 값 이하이면 replay로 거부한다.
- Firebase 경로는 limited-use token을 서버에서 검증·소비한다. 재사용 가능한 session
  token만으로 access token을 발급하지 않는다.
- 검증 성공과 counter/token 소비를 원자적으로 저장한 뒤 access token을 발급한다.

access token 최대 TTL은 900초다. claim은 `iss`, `aud`, `sub=installation_id`, `iat`,
`exp`, `jti`, `app_id`, `attestation_provider`를 포함한다. 서명 key ID를 header에 넣고
활성·직전 key 두 개까지 검증 가능하게 회전한다. 원본 proof와 access token은 로그에
남기지 않는다.

### 4.3 보호 endpoint 검증 순서

1. TLS와 최대 요청 크기를 확인한다.
2. canonical request ID를 만든다.
3. bearer token 서명, issuer, audience, expiry와 app ID를 검증한다.
4. `CookLog-Installation-ID`와 token `sub`가 같은지 확인한다.
5. revoked installation·token `jti`를 확인한다.
6. installation·IP·project 제한을 차례로 확인한다.
7. mutation이면 idempotency key와 body hash를 확인한다.
8. schema 검증 후 도메인 handler를 호출한다.

검증 실패는 도메인 handler나 provider를 호출하지 않는다.

## 5. 제한과 quota

### 5.1 분리 원칙

제한은 서로 대체하지 않고 모두 적용한다.

- installation: 정상 앱 한 설치의 오작동·남용 제한
- IP: 인증 전 endpoint 공격과 다수 installation 생성 제한
- project: 전체 가용성과 비용의 최종 차단
- endpoint quota: AI job처럼 비용을 만드는 작업의 별도 제한

원 IP는 신뢰된 ingress가 덮어쓴 canonical remote address만 사용한다. 외부 요청의
`X-Forwarded-For`를 애플리케이션이 직접 신뢰하지 않는다. 저장·로그 시 IP는 일방향
HMAC partition key로 변환하고 원문 IP를 quota key에 영구 보관하지 않는다.

### 5.2 첫 구현 상한

아래 값은 T-024가 더 낮출 수 있는 최대 기본값이다. 상향은 비용·abuse 검토와 Product
Owner 승인이 필요하다. 모든 값은 배포 config로 낮출 수 있어야 하며 코드 재배포 없이
emergency project limit을 `0`으로 만들 수 있어야 한다.

| scope | 대상 | 상한 | window |
|---|---|---:|---:|
| IP | `/auth/challenges` | 10 | 1분 |
| IP | `/installations*` | 5 | 10분 |
| installation | 전체 보호 요청 | 60 | 1분 |
| installation | mutation | 12 | 1분 |
| installation | AI job 생성 | 20 | 1일 |
| project | 전체 요청 | 600 | 1분 |
| project | AI job 생성 | 100 | 1분 |

동일 요청은 가장 먼저 초과한 scope에서 차단한다. 429 응답은 `RATE_LIMITED` 또는
일일 비용 quota인 `QUOTA_EXCEEDED`, `Retry-After`(초), body의
`retry_after_seconds`를 동일하게 반환한다. 응답에는 다른 installation이나 project의
정확한 사용량을 노출하지 않는다.

성공 응답에는 선택적으로 현재 IETF Internet-Draft 형식의 `RateLimit-Policy`와
`RateLimit`을 제공할 수 있다. 이 형식은 아직 RFC가 아니므로 iOS의 정확성은 이 header에
의존하지 않고 429, `Retry-After`, 공개 오류 코드만 사용한다.

분산 limiter가 unavailable이면 인증 전·mutation·비용 endpoint는 fail closed 503
`LIMITER_UNAVAILABLE`로 막는다. 안전한 상태 조회는 project emergency limit 안에서만
fail open할 수 있고 반드시 경보를 발생시킨다.

## 6. timeout

timeout은 ingress에서 줄어드는 deadline으로 전달한다.

| 구간 | 상한 |
|---|---:|
| client 연결·응답 대기 | 15초 |
| API handler 전체 | 10초 |
| 인증 provider 검증 | 3초 |
| 내부 datastore 1회 | 2초 |
| 동기 외부 호출 1회 | 5초 |
| 비동기 job 접수 | 5초 안에 202 반환 |

handler는 남은 deadline보다 긴 하위 timeout을 설정하면 안 된다. deadline 종료 후
새 side effect를 시작하지 않는다. 서버가 확실히 side effect를 시작하지 않았으면 504
`UPSTREAM_TIMEOUT`, `retryable=true`를 반환한다. 결과가 불명확하면
`REQUEST_OUTCOME_UNKNOWN`을 반환하고 같은 idempotency key의 상태 확인/재호출만 허용한다.

## 7. idempotency와 재처리 소유권

side effect가 있는 모든 POST는 `Idempotency-Key` UUID v4가 필수다.

- scope: `(installation_id, HTTP method, canonical path, idempotency key)`
- body identity: content type과 정규화 JSON body의 SHA-256
- 보관: 최초 접수부터 24시간. 도메인 결과 복구 TTL이 더 길면 그 TTL 이상 유지한다.
- 원자성: idempotency record 생성과 작업 접수/outbox 기록을 같은 transaction 경계로
  처리한다.

처리 규칙:

| 상황 | 응답 |
|---|---|
| 처음 본 key | record를 만들고 실행 |
| 같은 key·같은 body, 완료 | 원래 status/body 재생, `CookLog-Idempotency-Replayed: true` |
| 같은 key·같은 body, 처리 중 | 409 `REQUEST_IN_PROGRESS`, `Retry-After` |
| 같은 key·다른 body/path | 409 `IDEMPOTENCY_KEY_REUSED` |
| 결과 불명확 | 409 `REQUEST_OUTCOME_UNKNOWN`; 새 key 사용 금지 안내 |

iOS가 network timeout 후 동일 작업을 다시 시도할 때는 반드시 같은 key를 사용한다.
Backend는 provider timeout을 이유로 새 domain job을 자동 생성하지 않는다. 이미 생성된
job의 provider 재처리는 해당 도메인 Task가 소유하며, 공통 layer는 중복 job 생성을
막는 것만 소유한다.

## 8. retry

### 8.1 iOS

- GET/HEAD 또는 idempotency key가 있는 POST만 자동 재시도할 수 있다.
- network disconnect, 408, 429, 502, 503, 504 중 `retryable=true`만 대상이다.
- `Retry-After`가 있으면 우선한다. 없으면 full jitter를 포함한 1초, 2초 backoff로 최대
  2회 재시도한다.
- 400, 401, 403, 404, 409(`REQUEST_IN_PROGRESS` 제외), 422는 자동 재시도하지 않는다.
- 401 `TOKEN_EXPIRED`는 새 challenge/proof로 token을 한 번 갱신한 뒤 원 요청을 같은
  idempotency key로 한 번만 재시도한다.

### 8.2 Backend

- 내부 read와 side effect 없는 provider 호출만 transient 오류에서 최대 2회 재시도한다.
- side effect provider 호출은 provider idempotency 보장이 있고 같은 provider key를
  재사용할 때만 재시도한다.
- client 연결이 끊겨도 접수된 idempotent job을 취소하거나 중복 생성하지 않는다.
- retry budget을 소진하면 외부에는 안정 공개 코드만 반환하고 내부 원인은 별도 기록한다.

## 9. 공개 오류 목록

| HTTP | code | retryable | user message key | 의미 |
|---:|---|---|---|---|
| 400 | `INVALID_REQUEST` | false | `error.invalid_request` | JSON/header 형식 오류 |
| 401 | `AUTH_REQUIRED` | false | `error.auth_required` | token 없음 |
| 401 | `TOKEN_EXPIRED` | true | `error.session_expired` | token 갱신 필요 |
| 401 | `ATTESTATION_INVALID` | false | `error.app_verification_failed` | 무결성 검증 실패 |
| 401 | `ATTESTATION_REPLAYED` | false | `error.app_verification_failed` | challenge/counter/token 재사용 |
| 403 | `INSTALLATION_REVOKED` | false | `error.access_denied` | 설치 폐기 |
| 404 | `RESOURCE_NOT_FOUND` | false | `error.not_found` | 접근 가능한 resource 없음 |
| 404 | `API_VERSION_UNSUPPORTED` | false | `error.update_required` | 지원하지 않는 API version |
| 409 | `IDEMPOTENCY_KEY_REUSED` | false | `error.request_conflict` | key와 payload 불일치 |
| 409 | `REQUEST_IN_PROGRESS` | true | `error.request_in_progress` | 동일 요청 처리 중 |
| 409 | `REQUEST_OUTCOME_UNKNOWN` | true | `error.request_status_unknown` | 결과 상태 조회 필요 |
| 413 | `PAYLOAD_TOO_LARGE` | false | `error.payload_too_large` | body 상한 초과 |
| 422 | `VALIDATION_FAILED` | false | `error.invalid_request` | schema/field 검증 실패 |
| 429 | `RATE_LIMITED` | true | `error.rate_limited` | 단기 요청 제한 |
| 429 | `QUOTA_EXCEEDED` | false | `error.quota_exceeded` | 일일·비용 quota |
| 502 | `UPSTREAM_UNAVAILABLE` | true | `error.service_unavailable` | 외부 service transient 오류 |
| 503 | `SERVICE_DISABLED` | false | `error.service_unavailable` | 운영 kill switch |
| 503 | `LIMITER_UNAVAILABLE` | true | `error.service_unavailable` | limiter fail closed |
| 504 | `UPSTREAM_TIMEOUT` | true | `error.request_timed_out` | side effect 미시작 timeout |
| 500 | `INTERNAL_ERROR` | true | `error.temporary_failure` | 안전하게 분류되지 않은 오류 |

resource 존재 여부를 누출할 수 있는 인증·권한 실패는 가능한 한 동일한 404
`RESOURCE_NOT_FOUND`로 정규화한다. validation의 `violations`에는 공개 field name과
안정 reason code만 넣고 실제 값은 넣지 않는다.

## 10. QA 인계 기준

Backend QA Agent는 실행 Agent와 분리된 세션에서 최소 다음을 독립 검증한다.

1. App Attest challenge 재사용, 낮거나 같은 assertion counter와 잘못된 App ID 거부
2. App Check expired/wrong audience/reused limited-use token 거부
3. installation header와 token subject 불일치 거부
4. IP·installation·project 제한 각각의 429, `Retry-After`, scope 간 우회 불가
5. 같은 idempotency key의 동일 body replay와 다른 body 409
6. 동시 동일 key가 domain handler를 한 번만 실행하는지
7. timeout 전·후 side effect 상태와 `REQUEST_OUTCOME_UNKNOWN` 분기
8. iOS retryable 조합이 non-idempotent 중복 작업을 만들지 않는지
9. 모든 오류가 schema를 통과하고 내부 코드·provider detail·secret·원문이 없는지
10. STT 실패가 Backend 음성 요청이나 원격 fallback을 만들지 않는지

## 11. 공식 참고

- Apple, [Validating apps that connect to your server](https://developer.apple.com/documentation/devicecheck/validating-apps-that-connect-to-your-server)
- Firebase, [Verify App Check tokens from a custom backend](https://firebase.google.com/docs/app-check/custom-resource-backend)
- IETF, [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- IETF HTTPAPI, [RateLimit header fields for HTTP, draft-11](https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/)
