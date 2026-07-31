# T-20260729-023 Backend QA 독립 검증 보고서

검증일: 2026-07-31
검증자: Backend QA Agent / Verification Role
검증 기준: `task/T-20260729-023-define-ai-recipe-job-recovery-contract` `bf83ec0`
판정: `FAIL`
상태 인계: `verification_in_progress -> rework_requested`

## 1. 검증 범위

- `apps/backend/docs/AI_RECIPE_CONTRACT.md`
- `apps/backend/contracts/ai/`
- `docs/product/CookLog_PRD_v2.md`
- `docs/PROJECT_DECISIONS.md`
- T-020 provider·비용·삭제 결정과 T-021 인증·quota·idempotency·오류 계약
- Task allowed paths, 최신 develop과 T-022 done·T-024 approved 상태 비회귀

문서 계약 Task이므로 실제 worker·provider·datastore가 동작한다고 간주하지 않았다.
상태 전이, 동시 create/ACK, provider 호출 경계, timeout, 결과 복구와 삭제를
공격·장애 시나리오로 전개해 후속 구현을 단일하게 제약하는지 검증했다.

## 2. 요약

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| create·상태 전이 | PASS | job/content/idempotency/cleanup/outbox transaction과 CAS 상태 전이가 정의됐다. |
| provider 단일 호출 | PASS | logical job당 1회, 중복 delivery와 crash 후 자동 재호출 금지가 정의됐다. |
| create idempotency | PASS | 동시 같은 key는 job/outbox/content 1개, 다른 body는 409다. |
| GET 복구 | PASS | 반복 GET과 앱 재실행 조회는 committed 상태만 읽고 provider를 호출하지 않는다. |
| ACK 결과 식별 | FAIL | ACK가 필수로 요구하는 `result_version`을 status/result 응답이 제공하지 않는다. |
| timeout·outcome unknown | FAIL | provider 시작 후 timeout이 본문에서는 `OUTCOME_UNKNOWN`, fixture에서는 `AI_TIMEOUT`이다. |
| invalid output·안전 | PASS | schema/evidence/order/안전값 오류 결과를 저장·반환하지 않는다. |
| 결과 삭제·만료 | PASS | ACK 즉시 삭제, 22시간 task, 15분 sweeper, 24시간 복호화 전 차단이 T-020과 일치한다. |
| 콘텐츠 비노출 | PASS | provider·prompt·STEP·draft·secret을 오류·queue·로그·관측 데이터에서 금지한다. |
| schema·fixture 검사 | PASS | 제공 script와 JSON 문법은 통과했으나 아래 계약 완전성 결함을 검사하지 않는다. |
| allowed paths·Task ID | PASS | 변경은 T-023 허용 경로 안이며 Task front matter ID는 1개다. |

## 3. 차단 결함

### QA-HIGH-023-001 — ACK 필수 `result_version`을 응답에서 획득할 수 없음

`POST /v1/ai/recipe-jobs/{job_id}/result-acknowledgements` 요청 schema는
`result_version`을 필수 정수로 요구하고, 서버는 이 값이 현재 result와 일치하는지
확인하도록 정의한다.

그러나 iOS가 결과를 받는 `recipe-job-status.schema.json`과
`recipe-draft.schema.json` 어디에도 `result_version` 필드가 없다. 문서도
`state_version`만 공개하며 두 값이 동일하다는 규칙을 정의하지 않는다.

재현:

1. iOS가 GET으로 `succeeded/result_state=available`과 draft를 받는다.
2. 로컬 AI Review 저장을 완료한다.
3. ACK body를 생성하려면 `result_version`이 필요하다.
4. 응답 계약에 값이 없으므로 임의 값을 추측하거나 ACK를 생략해야 한다.
5. ACK가 누락되면 즉시 삭제 경로가 실행되지 않고 22시간 cleanup까지 콘텐츠가 남는다.

이는 AI Review 복구 후 ACK 즉시 삭제라는 핵심 흐름을 계약상 실행 불가능하게 만든다.

필수 재작업:

- `succeeded/available` 상태 응답에 server-owned `result_version`을 필수로 제공한다.
- available이 아닌 상태의 표현을 `null` 또는 명시적 조건 schema로 고정한다.
- `state_version`과 다른 개념이면 생성·증가·불변 규칙을 정의한다.
- GET 결과의 version으로 ACK 성공, stale/wrong version 거부, 동시 ACK 단일 삭제,
  ACK replay 성공을 fixture와 검사 script에 추가한다.

### QA-HIGH-023-002 — provider 시작 후 timeout terminal 분류 상충

6절 worker 규칙은 `provider_started_at` 이후 worker crash, connection loss 또는
timeout으로 결과가 불명확하면 자동 재호출 없이 `failed/OUTCOME_UNKNOWN`으로
전환한다고 정의한다.

같은 절의 fixture와 실패 표는 다음과 같이 다르다.

- `provider_timeout` fixture: `failed/AI_TIMEOUT`
- `AI_TIMEOUT`: provider/worker deadline
- `OUTCOME_UNKNOWN`: provider 시작 후 결과 불명확

provider 호출이 시작된 뒤 응답 deadline이 끝난 상황은 두 조건에 동시에 해당한다.
구현자는 동일 사건을 `AI_TIMEOUT` 또는 `OUTCOME_UNKNOWN` 중 임의로 분류할 수 있고,
iOS의 “상태 확인 후 재실행” 안내도 달라진다. 늦은 provider 응답·비용 reservation과
사용자 새 job 생성 시점도 불명확해진다.

필수 재작업:

- timeout을 provider 호출 시작 전/후와 결과 확실성 기준으로 분리한다.
- provider 시작 후 응답 유실·deadline은 `OUTCOME_UNKNOWN`인지, 취소·미실행이
  확인된 경우만 `AI_TIMEOUT`인지 하나의 decision table로 고정한다.
- worker 전체 deadline, provider deadline, connection loss와 late response 각각의
  terminal failure, provider 호출 수, 새 job 허용 시점을 fixture로 추가한다.
- 문서·status failure schema·fixture의 분류를 동일하게 맞춘다.

## 4. 보완 결함

### QA-MEDIUM-023-001 — `QUOTA_EXCEEDED` job failure의 생성 경로 불명확

create 처리 순서는 project 비용 quota를 job transaction 전에 예약하고 실패하면 T-021
429 `QUOTA_EXCEEDED`를 반환하도록 한다. 따라서 job이 생성되지 않는다. 그런데 job
failure 표와 status schema는 `failed/QUOTA_EXCEEDED`를 허용한다.

worker 단계에서 이 상태가 생성되는 조건이 별도로 정의되지 않아 클라이언트가
HTTP 429와 성공적인 GET의 failed job 중 무엇을 처리해야 하는지 모호하다. 재작업 시
job 생성 전 quota 실패만 사용한다면 domain failure enum에서 제거하고, 실행 중
발생할 수 있다면 정확한 전이·원자 예약 정산 조건을 정의해야 한다.

## 5. 통과 상세

### 상태·동시성·provider 호출

- create transaction은 job, 암호화 content, idempotency, cleanup task와 콘텐츠 없는
  worker outbox를 함께 생성한다.
- 모든 전이는 `(job_id, state_version, execution_generation)` CAS를 사용한다.
- 패배 worker는 content를 복호화하거나 provider를 호출하지 않는다.
- provider 시작 전 crash는 재전달할 수 있고, 시작 후 crash/connection loss는 동일
  logical job에서 자동 재호출하지 않는다.
- 같은 idempotency key 동시 create는 job/outbox/provider call을 중복하지 않는다.
- 사용자 수동 재실행만 새 key·새 logical job을 생성한다.

### 출력 안전·복구

- evidence ID는 입력 STEP 집합에 속해야 하고 recipe step order는 연속이어야 한다.
- 근거 없는 안전 관련 온도·시간·조리법은 만들지 않고 `missing_source`로 남긴다.
- schema·semantic invalid 결과는 저장·반환하지 않고 `OUTPUT_INVALID`로 종료한다.
- 반복 GET은 provider 호출 0이며 다른 installation과 미존재 job은 동일 404로
  정규화한다.

### 삭제·비노출

- ACK는 content delete와 `acknowledged_deleted` 전환을 idempotent 경계로 처리한다.
- ACK가 없으면 생성 22시간 cleanup task와 15분 sweeper가 명시적으로 삭제한다.
- 24시간에는 서버 시각을 사용해 복호화·본문 반환 전에 접근을 차단한다.
- Firestore TTL은 유료 safety net일 뿐 24시간 삭제 보장의 근거로 사용하지 않는다.
- STEP, draft, prompt, provider raw response와 secret은 로그·trace·metric·analytics·DLQ에
  포함하지 않는다.

## 6. 수행 검증

```text
sh -n apps/backend/contracts/ai/validate-contracts.sh
sh apps/backend/contracts/ai/validate-contracts.sh
AI recipe contract validation: PASS
jq empty apps/backend/contracts/ai/*.json apps/backend/contracts/ai/fixtures/*.json
aiops validate task ... --strict
git diff --check
ACK_RESULT_VERSION_REACHABILITY: FAIL
PROVIDER_TIMEOUT_FIXTURE: AI_TIMEOUT
DOC_TIMEOUT_OUTCOME_UNKNOWN_RULE: FOUND
```

제공 script는 snapshot hash, 상태 fixture, 호출 상한, 삭제 시각과 negative output을
검사한다. ACK 입력값의 응답 도달 가능성과 문서–fixture timeout 의미 충돌은 검사하지
않으므로 script PASS를 전체 성공으로 해석하지 않았다.

## 7. 잔여 위험

### QA-RISK-023-001 — runtime validator·cleanup·provider 보관 검증

runtime JSON Schema/semantic validator, worker CAS, ACK/delete transaction과 staging
cleanup SLA는 T-025 및 후속 foundation·production Task에서 검증해야 한다.

## 8. 최종 판정과 인계

provider 단일 호출, idempotency, invalid output 차단과 22/24시간 삭제 계약은
통과했다. 그러나 iOS가 ACK에 필요한 result version을 얻을 수 없고 timeout terminal
분류가 상충해 핵심 결과 복구 흐름을 확정할 수 없다.

최종 판정은 `FAIL`이다. Task를 `rework_requested`로 전환하고 lock을 해제해
Development Lead Agent / Lead Role에 인계한다.

