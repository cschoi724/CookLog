# T-20260729-021 Backend QA 독립 검증 보고서

검증일: 2026-07-31
검증자: Backend QA Agent / Verification Role
검증 기준: `task/T-20260729-021-define-backend-common-api-contract` `068deb2`
판정: `FAIL`
상태 인계: `verification_in_progress -> rework_requested`

## 1. 검증 범위

- `apps/backend/docs/API_CONTRACT.md`
- `apps/backend/contracts/common/`
- `docs/product/CookLog_PRD_v2.md`
- `docs/PROJECT_DECISIONS.md`
- T-020의 확정 비용 hard cutoff와 최신 `origin/develop` 비회귀
- Task allowed paths와 QA·Development 보드 정합성

문서 계약 Task이므로 아직 존재하지 않는 Backend runtime 동작을 실행 검증한 것으로
간주하지 않았다. 대신 replay·abuse·timeout·제한 초과·idempotency 경쟁 조건을
공격 시나리오로 전개해 계약이 후속 구현을 단일하게 제약하는지 확인했다.

## 2. 요약

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| App Attest challenge·counter replay | FAIL | token 갱신 counter는 원자성을 명시했지만 최초 설치 challenge 소비는 원자적 compare-and-set 경계가 없다. |
| Firebase limited-use token replay | PASS | 검증·소비, 재사용 session token 우회 금지, 미지원 runtime에서 provider 비활성 계약이 있다. |
| abuse·다중 scope 제한 | 보완 필요 | IP·installation·project 제한과 limiter fail-closed는 있으나 project 비용의 일·월 누적 차단 연결이 공통 계약에 없다. |
| timeout·결과 불명확 | PASS | shrinking deadline, side effect 미시작 504, 불명확 409와 동일 key 재확인 규칙이 분리됐다. |
| 제한 초과 | PASS | 429 코드, `Retry-After`와 body 일치, 타 installation/project 사용량 비노출이 정의됐다. |
| 동일 idempotency key 동시성 | PASS | record와 작업 접수/outbox의 동일 transaction, 처리 중 409, 완료 결과 replay가 정의됐다. |
| 오류 정보 비노출 | FAIL | `additionalProperties: false`만으로 허용된 `title`·`detail` 문자열 안의 provider 오류·secret·원문을 막을 수 없다. |
| 원격 STT 자동 fallback 금지 | PASS | endpoint·upload·adapter 활성화가 없고 실패 시 Backend·외부 전송 금지가 Source of Truth와 일치한다. |
| JSON Schema 문법 | PASS | 공통 schema 5개 `jq empty` 통과, Draft 2020-12 선언 확인. |
| allowed paths·최신 develop | PASS | `origin/develop` 대비 3개 커밋 ahead/0 behind이며 변경 경로는 Task 허용 범위다. T-020·T-001·T-007 등 완료 기록을 보존한다. |

## 3. 차단 결함

### QA-HIGH-021-001 — 최초 설치 challenge의 동시 소비 원자성 누락

`POST /v1/installations/token`은 검증 성공과 counter/token 소비를 원자적으로 저장한 뒤
token을 발급하도록 명시한다. 반면 `POST /v1/installations`은 challenge가 one-time이며
재사용을 거부한다고만 정의하고, 다음 상태를 하나의 원자적 경계로 묶지 않는다.

- challenge의 `unused -> consumed` 조건부 갱신
- App Attest key와 installation 등록
- idempotency record·작업 결과
- installation access token 발급 가능 상태

공격 시나리오:

1. 공격자가 같은 유효 challenge와 App Attest attestation을 준비한다.
2. 서로 다른 두 `Idempotency-Key`로 `POST /v1/installations`를 동시에 보낸다.
3. 두 요청이 모두 challenge를 `unused`로 읽은 뒤 검증하면, 일반 idempotency scope는
   key가 다르므로 서로를 직렬화하지 않는다.
4. 계약에 challenge 소비의 조건부 단일 승자 규칙이 없어 두 요청의 성공을 막는 구현
   기준이 확정되지 않는다.

Apple은 서버가 고유한 일회성 challenge를 사용해 replay를 어렵게 하도록 안내한다.
Firebase도 소비 결과의 `alreadyConsumed`를 검사해 이미 소비된 token을 거부하도록
명시한다. “한 번 사용”은 동시 요청에서도 단일 승자를 보장해야 한다.

필수 재작업:

- 최초 설치에서도 challenge 소비를 원자적 compare-and-set으로 정의한다.
- challenge 소비, installation/App Attest key 등록과 token 발급 가능 상태의 transaction
  또는 동등한 원자적 경계를 명시한다.
- 서로 다른 idempotency key로 같은 challenge를 동시에 보냈을 때 정확히 한 요청만
  성공하고 나머지는 `ATTESTATION_REPLAYED`가 되는 수용 기준을 추가한다.
- Firebase는 `consume: true` 결과의 `alreadyConsumed=true`를 명시적으로 거부하도록
  계약에 고정한다.

### QA-HIGH-021-002 — 오류 schema가 허용 문자열 내부의 민감정보를 차단하지 못함

문서와 `contracts/common/README.md`는 `additionalProperties: false`가 provider 오류,
stack trace, secret과 내부 코드를 외부 응답에 섞이지 않게 한다고 설명한다. 이 제약은
알 수 없는 **필드**만 차단한다. 아래 값은 현재 schema를 통과할 수 있다.

```json
{
  "title": "OpenAI upstream failed",
  "detail": "Authorization: Bearer secret-value; stack: internal/file.ts:42"
}
```

`title`과 `detail`은 길이만 제한되며 안전한 고정 문구나 공개 코드별 allowlist가 없다.
`violations.field`도 공개 field name의 allowlist 없이 임의 문자열을 허용한다. 실제
오류 fixture와 redaction 검사가 T-025로 이연돼 이 Task의 “오류 정보 비노출” 기준을
현재 산출물로 입증할 수 없다. RFC 9457 역시 problem detail 생성 시 정보 누출을
면밀히 검토하고 stack dump 같은 구현 세부 노출을 피하도록 요구한다.

필수 재작업:

- 공개 `code`별 고정 `type/title/detail/user_message_key/status/retryable` mapping 또는
  동등한 allowlist를 기계 검증 가능한 원본으로 정의한다.
- raw exception/provider payload/사용자 원문을 `title`, `detail`, `violations`에
  대입하지 못하도록 생성기 경계를 계약에 명시한다.
- provider명·stack·authorization/token/secret·입력 원문을 포함한 악성 fixture가
  외부 응답에서 제거되거나 안전 오류로 치환되는 negative fixture를 추가한다.
- HTTP status와 body `status`, `code`, `retryable`, `retry_after_seconds` 조합도 고정
  mapping과 일치하도록 검증한다.

## 4. 보완 결함과 잔여 위험

### QA-MEDIUM-021-001 — project 비용 최종 차단의 누적 window 연결 누락

계약은 project scope를 “전체 가용성과 비용의 최종 차단”이라고 정의하지만 표의 project
AI 제한은 `100/분`뿐이다. 일일 제한은 installation별 `20/일`이므로 여러 installation과
분산 IP를 생성하는 공격은 이를 수평 우회할 수 있다. T-020에는 월 5,500회·token
hard cutoff가 이미 확정돼 있으나 T-021은 그 원장을 공통 검증 순서와 `QUOTA_EXCEEDED`
계약에 연결하지 않는다.

재작업 시 project 일·월 또는 비용 원장의 누적 hard cutoff를 명시적으로 참조하고,
모든 installation·IP를 합친 비용 요청에 원자적으로 적용하도록 고정해야 한다.
구체 운영값을 더 낮추는 일은 계획대로 T-024가 맡을 수 있다.

### QA-RISK-021-001 — runtime JSON Schema validator와 fixture 부재

저장소에 Draft 2020-12 runtime validator dependency와 오류 fixture가 없어 이번
검증에서는 JSON 문법·schema 구조와 문서 대조까지만 수행했다. `format`과
`contentEncoding`이 annotation으로만 처리될 수 있는 위험도 실행 보고서에 이미
기록돼 있다. T-025에서 validator 설정, positive/negative fixture와 CI 실행을
완성해야 한다.

## 5. 통과 상세

### timeout·idempotency

- ingress에서 줄어드는 deadline과 하위 timeout 상한이 정의됐다.
- deadline 이후 새 side effect 금지, 미시작이 확실한 경우만 504 자동 재시도 가능,
  결과 불명확은 같은 idempotency key만 허용한다.
- 동일 key·동일 body 처리 중 요청은 409, 완료 요청은 원 응답 replay, 다른 body/path는
  409로 분리된다.
- iOS는 idempotent POST만 자동 재시도하고 Backend는 provider idempotency 보장이
  있을 때만 side effect 호출을 재시도하므로 중복 domain job 자동 생성은 금지된다.

### 제한 초과·abuse 기본 방어

- 인증 전 IP 제한, 보호 endpoint installation 제한, project 제한을 모두 적용한다.
- 원 IP는 trusted ingress 값만 사용하고 외부 `X-Forwarded-For`를 신뢰하지 않는다.
- 429의 `Retry-After`와 `retry_after_seconds` 일치, 사용량 비노출이 정의됐다.
- limiter 장애 시 인증·mutation·비용 endpoint fail closed와 emergency project limit
  `0` kill switch가 정의됐다.

### 원격 STT 자동 fallback 금지

`API_CONTRACT.md`에는 첫 출시 음성 수신, 원격 STT endpoint, 음성 upload와 adapter
활성화가 없다. 기기 내 STT 실패를 Backend나 외부 provider로 자동 전환하지 않는다는
정책은 PRD v2와 `PROJECT_DECISIONS.md`의 확정 결정과 일치한다.

## 6. 수행 명령

```text
git status -sb
git diff --name-status origin/develop...HEAD
git log --oneline --decorate -8
jq empty apps/backend/contracts/common/*.json
git diff --check origin/develop...HEAD
rg -n "T-20260729-021" .ai_project/tasks .ai_project/teams .ai_project/reports .ai_project/qa
aiops validate task .ai_project/tasks/active/T-20260729-021_define-backend-common-api-contract.md --strict
```

별도 JSON Schema validator는 저장소 dependency와 로컬 실행 환경에 없어 수행하지
못했으며, 이를 통과로 오인하지 않았다.

## 7. 최종 인계

`QA-HIGH-021-001`, `QA-HIGH-021-002`가 해소되기 전에는 replay와 오류 정보 비노출
성공 기준을 충족하지 못한다. Task를 `rework_requested`로 전환하고 lock을 해제해
Development Lead Agent / Lead Role에 인계한다.
