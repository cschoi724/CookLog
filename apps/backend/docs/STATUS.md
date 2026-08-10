# Backend 개발 상태

최종 업데이트: 2026-08-10
상태: T-20260728-006 Backend Foundation `done`, T-20260810-001 HIGH 2건 재작업 완료·QA 재인계 준비

## 현재 단계

- 계약 정의 `T-20260728-005`: `done`
- Foundation 구현 `T-20260728-006`: `done`, Product Owner 최종 완료·PR #93 병합 승인
- Runtime scaffold `T-20260804-002`: `done`, Backend QA `PASS_WITH_RISK`·최종 승인
- 공통 middleware `T-20260804-003`: `done`, Backend QA `PASS_WITH_RISK` 수용
- Mock AI job `T-20260804-004`: `done`, PR #79 squash merge `a73a028`
- 원격 STT 비활성 경계 `T-20260804-005`: `done`, HIGH 해소·독립 재검증·완료 리뷰·PR #84 병합 승인 완료
- 안전 runtime `T-20260804-006`: `done`, Lead `PASS_WITH_RISK`·Product Owner PR #87 병합 승인
- 최종 통합 `T-20260804-007`: `done`, `QA-HIGH-007-001` 해소·전체 100/100·계약
  validator·경계 감사·Node 24.18.0 non-root container 통과, Product Owner PR #91
  squash merge 승인

Node.js 24 LTS·TypeScript 7·Fastify 5 기반 local/mock composition에 공통 HTTP, installation
인증, rate limit, HTTP/domain idempotency, Mock AI job, 비용 admission, allowlist telemetry와
cleanup을 연결했다. production은 local adapter를 거부하고 고정 `GET /healthz`만 제공한다.
실제 provider·network·production datastore·원격 STT route는 없다.

T-20260810-001은 OpenAI 한국 저장 endpoint·고정 model·versioned prompt·strict
RecipeDraft schema를 provider-neutral 경계에 연결했다. adapter는 승인·ZDR·Modified
Retention·국외 처리·credential 게이트를 모두 요구하며, 현재 composition에
연결하지 않아 실제 외부 호출은 비활성이다.

Backend QA의 HIGH 2건에 따라 response body read 연결 유실을
`OUTCOME_UNKNOWN`으로 분리했고, provider-facing schema를 OpenAI Structured Outputs
지원 keyword subset으로 투영했다. provider에서 제외된 uniqueness·length 제약은
기존 runtime semantic validator에서 계속 fail closed한다.

## 다음 조치

1. Foundation local/mock 범위는 `done`으로 유지한다.
2. `T-20260810-001`은 Backend QA가 `QA-HIGH-810001-001~002` 원본 반례,
   provider keyword allowlist·runtime uniqueness·게이트·provider-at-most-once를 독립 재검증한다.
3. credential 등록·실제 sandbox/production 호출·Cloud 리소스·배포는 별도
   외부 변경 승인 전까지 비활성으로 유지한다.

## 차단 경계

- 실제 AI provider 호출·배포·secret: ZDR·credential·외부 변경 승인 전까지 비활성
- 원격 STT endpoint·audio upload: 별도 제품 승인 전 금지
- 후속 패키지: 선행 Task가 `develop`에서 `done`이 되기 전 착수 금지
