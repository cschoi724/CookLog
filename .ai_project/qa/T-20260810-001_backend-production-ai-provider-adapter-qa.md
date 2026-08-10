# T-20260810-001 Backend QA 보고서

## 판정

- 결과: `FAIL`
- 검증 Role: Backend QA Agent / Verification Role
- 검증일: 2026-08-10
- 검증 당시 public source: `origin/develop@aee251a1142bce573e806e4bf39c47d23ba5c775`
- 외부 provider 호출·credential·배포·외부 설정 변경: 0건

## 실패 항목

### QA-HIGH-810001-001 — body-read 연결 유실이 `OUTPUT_INVALID`로 오분류됨

- 계약상 provider 호출 시작 후 timeout·연결 유실은 `OUTCOME_UNKNOWN`이어야 한다.
- response body 읽기와 `JSON.parse`가 같은 `try/catch`에 있어 `response.text()` 실패도
  `{ kind: "success", draft: undefined }`로 반환된다.
- 독립 synthetic response 재현에서 `text()` 연결 유실 후 실제 `{"kind":"success"}`가
  반환됐다.
- 수정 요구: body transport/read 실패와 성공적으로 읽은 invalid JSON을 분리하고 전자는
  `OUTCOME_UNKNOWN`, 후자는 `OUTPUT_INVALID`로 보내는 회귀 테스트를 추가한다.

### QA-HIGH-810001-002 — strict provider schema가 OpenAI 지원 subset과 정합하지 않음

- 공용 schema 전체를 provider strict schema로 직접 전송하며 배열 3곳에
  `uniqueItems: true`가 포함돼 있다.
- OpenAI Structured Outputs 공식 문서의 지원 array 제약에는 `minItems`, `maxItems`가
  명시되며 지원되지 않는 strict schema는 API 오류가 된다.
- 수정 요구: OpenAI용 schema를 공식 지원 subset으로 투영하거나 별도로 고정하고,
  uniqueness 등 나머지 제약은 runtime semantic validator에서 fail closed한다. provider-facing
  keyword allowlist 계약 테스트를 추가한다.

## 통과 항목

- Node 24.18.0 포함 runtime test 105/105 PASS
- 계약 validator 5종과 Foundation boundary audit PASS
- activation gate 6개 독립 negative test 모두 transport 0건
- 동일 idempotency key transport 최대 1회
- logger/console sink 및 production network transport 미등록
- `git diff --check` PASS

## 잔여 경계

- Docker 부재로 non-root container 재검증은 수행하지 못했다.
- ZDR·Modified Retention·국외 처리 승인·credential 전에는 실제 OpenAI 호출을 활성화하지 않는다.
- 실제 sandbox schema handshake는 High 2건 수정 후에도 별도 외부 변경 승인이 필요하다.
