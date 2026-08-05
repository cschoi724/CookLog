# T-20260804-003 실행 보고서

작성일: 2026-08-05
작성자: Backend Agent
상태: 자체 검증 완료, Backend QA 독립 검증 대기

## 결과

T-20260729-021 공통 계약을 후속 도메인 handler가 재사용할 수 있는 local/mock 실행
경계로 구현했다. composition root와 공개 AI/STT endpoint는 변경하지 않았다.

- 모든 요청에 UUID v4 canonical request ID와 `CookLog-Request-ID`를 부여한다.
- 성공 envelope와 20개 공개 오류 catalog 기반 RFC 9457 problem renderer를 제공한다.
- JSON Schema strict subset과 Fastify validation 오류를 안전한 공개 violation으로 바꾼다.
- `AttestationVerifier`, `InstallationTokenService` interface와 non-production local fake를
  제공한다. proof와 token은 SHA-256 hash로만 내부 색인한다.
- 설치 token/header subject 일치와 만료·폐기를 domain handler 전에 검증한다.
- installation·mutation·IP HMAC·project fixed-window limiter와 project limit 0,
  unavailable fail-closed를 구현했다.
- `application/json`과 canonical JSON body의 SHA-256, UUID v4 key, 24시간 record,
  동시 단일 승자, 처리 중·outcome unknown·body/path 충돌과 원본 replay를 구현했다.
- replay는 원본 response request ID를 채택해 response header와 body의 ID를 일치시킨다.

## 보안·계약 경계

- renderer 입력은 공개 code, canonical request ID, 검증된 retry-after와 violation만
  허용한다. catalog에 없는 code, prototype property, 잘못된 violation은 고정
  `INTERNAL_ERROR`로 치환한다.
- raw exception, token, proof, 원 IP와 request body를 logger에 전달하는 코드가 없다.
- IP는 신뢰된 Fastify remote address를 HMAC partition으로 바꾸며 외부
  `X-Forwarded-For`를 신뢰하지 않는다.
- 인증·제한·idempotency 실패 시 domain handler 호출 수가 0임을 통합 테스트로 확인했다.
- local fake와 in-memory store는 production adapter가 아니며 production cloud/provider,
  secret, 원격 STT route를 추가하지 않았다.

## 자체 검증

| 검증 | 결과 |
|---|---|
| `npm ci --ignore-scripts` | PASS, audit 취약점 0건, Node 26 host engine 경고 |
| `npm run check` | PASS, 기존 health/lifecycle 15/15 |
| `node --test dist/tests/http/*.test.js dist/tests/auth/*.test.js` | PASS, 신규 21/21 |
| public error catalog 20개 runtime 동일성 | PASS |
| negative error fixture·unknown/prototype code·unsafe violation | PASS |
| 인증 누락·subject mismatch·만료·폐기·attestation replay | PASS |
| IP HMAC·X-Forwarded-For 무시·project limit 0·unavailable | PASS |
| 동시 idempotency 20개 요청 단일 owner·19 in-progress | PASS |
| 같은 key body/path 충돌·outcome unknown·exact replay | PASS |
| common·STT·AI·security·shared fixture validator | PASS |
| `aiops validate task --strict`·`git diff --check` | PASS |

## 제한과 후속 소유권

- T-002가 소유한 `package.json`은 T-003 허용 경로가 아니므로 `npm run check`에 새 suite를
  연결하지 않았다. Backend QA는 위 별도 Node test 명령을 실행하고 T-007은 전체 check
  wiring을 통합한다.
- local token·attestation과 in-memory limiter/idempotency는 단일 process 검증용이다.
  production datastore transaction, distributed limiter, 실제 App Attest/Firebase와
  signing key는 별도 production 구현·통합 게이트 소유다.
- idempotency owner와 domain outbox의 단일 datastore transaction은 T-004가 저장
  adapter를 조립할 때 구현하고 T-007에서 통합 검증한다.
- AI job, 원격 STT route, safe logging·비용·cleanup과 실제 provider/cloud resource는
  각각 T-004~007 또는 별도 승인 Task 범위다.

## Backend QA 인계

Backend QA Agent는 새 clone에서 install·build, 기존 15개와 신규 21개를 모두 실행한다.
catalog/schema 동일성, 악성 오류 비노출, auth 실패 handler 0회, 세 limiter scope와
unavailable, idempotency 동시 단일 승자·body/path 충돌·replay request ID 일치를 독립
반례로 검증한다. T-003은 QA 통과 전 T-004~007을 열지 않는다.
