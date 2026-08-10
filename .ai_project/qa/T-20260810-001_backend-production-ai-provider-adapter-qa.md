# T-20260810-001 Backend QA 보고서

## 현재 판정

- 재검증 결과: `PASS_WITH_RISK`
- 재검증 Role: Backend QA Agent / Verification Role
- 재검증일: 2026-08-10
- public source: `origin/develop@344eadead5d23720994fdc8484135b86cf1cf0ff`
- 외부 provider 호출·credential·배포·외부 설정 변경: 0건

`WP-R1~R2`가 최초 HIGH 2건의 반례를 해소했다. body-read 연결 유실은
`OUTCOME_UNKNOWN`, 완료된 invalid JSON은 `OUTPUT_INVALID`로 분리됐고,
provider-facing schema는 OpenAI Structured Outputs 지원 keyword로 투영된다.
전송 schema에서 runtime-only keyword는 제거되며 evidence uniqueness 등 의미 제약은
runtime validator에서 계속 fail closed한다.

### 재검증 증거

| 검증 | 결과 |
|---|---|
| `npm run verify` (Node 26.4.0) | 108/108 PASS, 계약 5종 PASS, boundary audit PASS |
| Node 24.18.0 runtime test | 108/108 PASS |
| 최초 body-read 연결 유실 반례 | `OUTCOME_UNKNOWN` PASS |
| 완료된 invalid JSON | `OUTPUT_INVALID` PASS |
| provider schema allowlist·root object·exact required·`additionalProperties: false` | PASS |
| provider schema runtime-only keyword | 0건 PASS |
| runtime duplicate evidence | 거부 PASS |
| `git diff --check` | PASS |

OpenAI 공식 문서상 GPT-5 mini snapshot은 Chat Completions와 Structured Outputs를
지원하며, strict schema는 root object, 모든 object field의 `required`,
`additionalProperties: false`와 지원 JSON Schema subset을 요구한다. 재작업 projection은
이 경계와 정합하다.

잔여 리스크는 실제 sandbox/provider schema handshake를 외부 승인 gate 전에는 수행할
수 없다는 점과, host에 Docker가 없어 이번 세션에서 non-root container를 재검증하지
못했다는 점이다. 코드·계약 검증을 차단할 결함은 아니므로 `PASS_WITH_RISK`로 분류한다.

## 최초 검증 판정

- 결과: `FAIL`
- 검증 Role: Backend QA Agent / Verification Role
- 검증일: 2026-08-10
- public source: `origin/develop@aee251a1142bce573e806e4bf39c47d23ba5c775`
- 구현 기준 SHA: `2b6665903e3346c21461d4c4a8fbbd1a2e4dee60`
- 검증 worktree: `/private/tmp/cooklog-t20260810-001-ai-provider`
- branch: `task/T-20260810-001-ai-provider-adapter`
- 외부 provider 호출·credential·배포·외부 설정 변경: 0건

최신 canonical은 구현 기준 이후의 iOS QA 상태 커밋 1건을 포함한다. Backend 소유
경로 충돌은 없어서 전달된 구현 기준 SHA의 로컬 산출물을 보존한 채 검증했다.

## 실패 항목

### QA-HIGH-810001-001: response body 읽기 중 연결 유실이 `OUTPUT_INVALID`로 오분류됨

- 계약: provider 호출 시작 후 timeout·연결 유실은 `OUTCOME_UNKNOWN`이어야 한다.
- 구현: `apps/backend/src/ai/openai-recipe-provider.ts`의 response body 읽기와
  `JSON.parse`가 하나의 `try/catch`에 있어 `response.text()` 자체가 실패해도
  `{ kind: "success", draft: undefined }`를 반환한다.
- 영향: `RecipeJobService`가 이를 invalid draft로 처리해 terminal failure를
  `OUTPUT_INVALID`로 저장한다. 결과 불확실성을 숨겨 운영·사용자 재시도 판단 계약을
  위반한다.
- 독립 재현: synthetic response의 `text()`가 연결 유실 오류를 던지도록 했을 때
  실제 반환값은 `{"kind":"success"}`였다.
- 수정 요구: body transport/read 실패와 성공적으로 읽은 invalid JSON을 분리한다.
  전자는 `OUTCOME_UNKNOWN`, 후자는 `OUTPUT_INVALID` 경로로 보내고 회귀 테스트를
  추가한다.

### QA-HIGH-810001-002: strict provider schema가 OpenAI 지원 subset과 정합화되지 않음

- 구현은 공용 `recipe-draft.schema.json` 전체를 `strict: true` schema로 직접 전송한다.
- schema의 배열 3곳에 `uniqueItems: true`가 있다. OpenAI Structured Outputs 공식
  문서는 지원 array 제약으로 `minItems`, `maxItems`만 명시하며, 지원되지 않는 strict
  schema는 API 오류가 된다고 명시한다.
- synthetic transport는 schema를 provider처럼 검증하지 않아 기존 테스트와 로컬
  validator가 이 위험을 탐지하지 못한다.
- 영향: 실제 호출 gate가 열린 뒤 요청이 provider 실행 전에 schema 오류로 거부될 수
  있어 acceptance criteria의 strict structured output을 입증하지 못한다.
- 수정 요구: OpenAI용 provider schema를 공식 지원 subset으로 명시적으로 투영하거나
  별도 고정하고, 공용 runtime semantic validator에서 uniqueness 등 나머지 제약을
  계속 fail closed한다. provider-facing schema keyword allowlist 검증을 계약 테스트에
  추가한다.
- 기준: https://developers.openai.com/api/docs/guides/structured-outputs

## 통과 항목

- activation gate 6개를 각각 미충족시킨 독립 검사: 모두 `AI_UNAVAILABLE`, transport 0건
- 고정 endpoint·model·prompt version·`store=false`·strict flag·도구/자동 retry 없음
- 429·5xx, transport throw, refusal, invalid semantic output의 기존 매핑
- 동일 adapter instance에서 동일 provider idempotency key transport 최대 1회
- adapter·prompt에 logger/console sink 없음, production composition/network transport 미등록
- 변경 경로: Task `allowed_paths` 내부
- `git diff --check`: PASS

## 실행 증거

| 검증 | 결과 |
|---|---|
| `npm run verify` (Node 26.4.0, sandbox 밖) | 105/105 PASS, 계약 5종 PASS, boundary audit PASS |
| Node 24.18.0 runtime test | 105/105 PASS |
| `npm run verify:container` | 미실행: host에 Docker 없음 |
| activation gate 6개 독립 negative test | PASS, transport 0건 |
| body-read connection loss 독립 재현 | FAIL 재현, `{ kind: "success" }` |

첫 `npm run verify` sandbox 실행의 lifecycle 6건 실패는 `listen EPERM` 환경 제한이었고,
sandbox 밖 동일 명령에서 모두 통과했다. Node 24.18.0은 일회성 고정 runtime으로 전체
105개 테스트를 재실행해 host version 리스크를 해소했다. non-root container 자체는
Docker 부재로 이번 세션에서 재검증하지 못했다.

## 잔여 경계

- ZDR·Modified Retention·국외 처리 승인·전용 credential·별도 외부 변경 승인 전에는
  실제 OpenAI 호출을 활성화하지 않는다.
- 한국 저장은 한국 내 추론 처리를 보장하지 않는다.
- 실제 sandbox/provider schema handshake는 위 두 HIGH 수정 후에도 외부 gate가 모두
  충족된 별도 승인 범위에서 수행한다.
