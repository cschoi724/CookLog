# T-20260810-001 구현 보고서

## 결과

상태: `verification_ready`

OpenAI 한국 저장 endpoint·고정 model snapshot·versioned prompt·strict
RecipeDraft schema를 기존 `RecipeAIProvider` 경계에 연결했다. 실제 network
transport와 composition은 등록하지 않았고, ZDR·Modified Retention·국외
처리·제품 승인·credential 조건이 하나라도 비어 있으면 transport 호출 전에
fail closed한다.

## 재작업 결과

- `QA-HIGH-810001-001`: response body read와 JSON parse 실패 경계를 분리했다.
  `response.text()` timeout·연결 유실은 `OUTCOME_UNKNOWN`, 완료된 body의 invalid
  JSON·schema·semantic 결과는 `OUTPUT_INVALID`로 처리한다.
- `QA-HIGH-810001-002`: 공용 RecipeDraft schema를 OpenAI Structured Outputs keyword
  allowlist로 fail-closed 투영하는 `openai-structured-output-schema.ts`를 추가했다.
  provider-facing schema에서 `uniqueItems`·`minLength`·`maxLength`를 제외하고
  `const`를 동치 `enum`으로 변환했다.
- 모든 object의 exact `required`·`additionalProperties: false`, root object, keyword
  allowlist를 runtime과 contract test에서 검증한다.
- provider에 전송하지 않는 evidence uniqueness·length·안전 제약은 기존
  runtime semantic validator에서 계속 `OUTPUT_INVALID`로 fail closed함을 회귀로
  확인했다.

## 구현 내용

- `openai-recipe-adapter.v1`, `recipe-prompt.v1`, `recipe-draft.v1`,
  `gpt-5-mini-2025-08-07`, `https://kr.api.openai.com/v1/chat/completions` 고정
- `store=false`, strict JSON Schema, 출력 2,000 token, 60초 timeout 요청 계약
- 외부 tool·background·자동 fallback·자동 retry 미사용
- STEP transcript를 untrusted data로 다루는 versioned system/user prompt
- 429·5xx `AI_UNAVAILABLE`, 호출 시작 후 timeout·연결 유실
  `OUTCOME_UNKNOWN`, refusal `SAFETY_REJECTED` 매핑
- 응답 JSON 파싱 후 기존 schema·semantic validator로 invalid output을
  `OUTPUT_INVALID` terminal state로 처리
- 동일 provider idempotency key의 adapter 재전송 차단과 요청당 transport 최대 1회
- 고정 설정·지역·보관·활성화 gate를 기계 검증하는
  `openai-provider-manifest.v1.json`

## 변경 파일

- `apps/backend/src/ai/openai-recipe-provider.ts`
- `apps/backend/src/ai/openai-structured-output-schema.ts`
- `apps/backend/src/ai/recipe-prompt.ts`
- `apps/backend/contracts/ai/openai-provider-manifest.v1.json`
- `apps/backend/contracts/ai/README.md`
- `apps/backend/contracts/ai/validate-contracts.sh`
- `apps/backend/tests/ai/openai-recipe-provider.test.ts`
- `apps/backend/docs/ARCHITECTURE_DECISION.md`
- `apps/backend/docs/AI_RECIPE_CONTRACT.md`
- `apps/backend/docs/STATUS.md`
- `apps/backend/docs/CHANGELOG.md`
- Task·report·Team board 운영 기록

## 검증 결과

| 검증 | 결과 |
|---|---|
| `npm run typecheck` | PASS |
| Backend runtime test | 108/108 PASS |
| common·STT·AI·security·shared fixture validator | 5/5 PASS |
| Foundation boundary audit | PASS |
| activation gate 미충족 transport call | 0건 |
| 429·transport/body-read timeout·refusal·invalid output 매핑 | PASS |
| provider schema keyword allowlist·exact required object | PASS |
| provider schema에서 runtime-only keyword 제외 | PASS |
| runtime evidence uniqueness 보존 | PASS |
| 동일 provider key 재전송 | 0건, 최대 1회 PASS |
| `git diff --check` | PASS |

검증 host는 Node.js 26.4.0, npm 11.17.0이다. 프로젝트 고정 Node.js 24.18.0
container 독립 재검증은 Backend QA와 후속 composition gate에서 확인한다.

## 경계 감사

- ZDR 승인·credential 등록·실제 provider 호출: 0건
- Google Cloud 리소스 생성·배포·외부 설정 변경: 0건
- package manager·lockfile·composition root·route 변경: 0건
- 운영 secret·실제 콘텐츠 fixture·로그: 0건
- 변경 파일: Task `allowed_paths` 내부만 사용
- 루트 worktree: 미변경

## 잔여 위험과 QA 인계

- 현재 adapter는 synthetic transport로만 검증했다. 실제 sandbox 호출은 ZDR,
  Modified Retention, 국외 처리 승인과 credential 외부 변경 게이트 통과 후
  별도 승인 범위에서만 가능하다.
- `storage_region=KR`은 한국 내 추론 처리를 보장하지 않으며, manifest에
  `regional_processing_supported=false`로 유지했다.
- production composition·secret injection·cost reservation·cloud worker 연결은 후속 Task
  범위이며 이 Task에서 활성화하지 않았다.

Backend QA Agent / Verification Role에 독립 검증을 인계한다.
