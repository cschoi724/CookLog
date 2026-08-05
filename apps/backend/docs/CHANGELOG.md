# Backend 변경 기록

- 2026-08-05: `T-20260804-004`에서 `RecipeAIProvider` interface와 deterministic Mock,
  strict create/output validator를 구현했다.
- 2026-08-05: 원자 in-memory job/content/idempotency/outbox 저장, duplicate worker CAS,
  provider 최대 1회, timeout decision과 late result 폐기 경계를 추가했다.
- 2026-08-05: 인증 기반 create·status·ACK route, result version 동시 삭제 1회·replay,
  +22시간 cleanup과 +24시간 content read 전 expiry를 구현했다.
- 2026-08-05: T-004 13/13, T-003 포함 37/37, 기존 15/15와 공용 계약 validator를 통과해
  Backend QA에 인계했다. shared fixture snapshot hash canonicalization 불명확성은 QA 위험으로
  명시했다.
- 2026-08-05: 공용 `develop`에서 T-002·T-003 완료를 확인하고 Product Owner가
  `T-20260804-004` deterministic Mock AI recipe job·status·ACK·복구 저장 경계 구현을
  별도 승인해 Backend Agent에 인계했다.
- 2026-08-05: 실제 provider·network·credential·production 저장소·cloud와 app 전체
  wiring은 제외하고 단일 호출·timeout·result version·ACK 삭제 불변식을 유지했다.
- 2026-08-05: Backend QA가 `T-20260804-003` 재검증에서 HIGH 2건·MEDIUM 1건 해소와
  기존 15/15·T-003 24/24·공용 계약 무회귀를 확인해 `PASS_WITH_RISK`로 판정했다.
- 2026-08-05: Development Lead가 성공 기준·허용 경로·PR #76 CLEAN과 필수 check를
  재확인하고 Node 24·production adapter 위험을 T-007에 이관하는 조건으로 완료 리뷰를
  통과시켜 Product Owner 최종 승인 단계로 전환했다.
- 2026-08-05: Product Owner가 `PASS_WITH_RISK`와 T-007 잔여 위험 이관을 수용하고
  PR #76 `develop` 병합을 승인해 T-003을 `done`으로 확정했다. T-004는 별도 실행
  승인 후 착수한다.
- 2026-08-05: `T-20260804-003` 재작업에서 violation을 exact own descriptor로 검증한 뒤
  새 공개 객체로 투영해 extra property·getter·custom prototype·symbol·20개 초과 입력을
  `INTERNAL_ERROR`로 fail closed했다.
- 2026-08-05: strict schema required·unknown·child lookup을 own property 기준으로 통일하고
  query를 제외한 pathname으로 unsupported API version을 판정했다. 직접 반례 3개를 포함한
  T-003 전용 24개와 기존 15개, 공용 계약 validator를 통과해 독립 재검증에 인계했다.
- 2026-08-05: Backend QA가 `T-20260804-003`에서 violation 추가 필드 secret 누출과
  strict schema prototype-key 우회 HIGH 2건, query 포함 unsupported version 오분류
  MEDIUM 1건을 확인해 `FAIL`로 판정했다.
- 2026-08-05: Product Owner가 세 결함 수정과 직접 반례 회귀 테스트 추가를 재작업으로
  승인해 Backend Agent에 다시 인계했다. T-004~007 차단은 재검증 통과 전까지 유지한다.
- 2026-08-05: `T-20260804-003`에서 canonical request ID, 성공 envelope와 catalog 기반
  RFC 9457 problem renderer, fail-closed schema validation을 구현했다.
- 2026-08-05: non-production attestation verifier와 hash 저장 opaque installation token,
  인증 pre-handler를 추가했다.
- 2026-08-05: installation·IP HMAC·project fixed-window limiter, emergency limit 0과
  limiter unavailable fail-closed 경계를 추가했다.
- 2026-08-05: canonical JSON SHA-256, UUID v4 key, 24시간 in-memory record, 동시 단일
  승자·처리 중·outcome unknown·원본 response replay를 구현했다.
- 2026-08-05: 신규 HTTP/auth suite 21개와 기존 health/lifecycle 15개, 공용 계약
  validator를 통과해 Backend QA에 인계했다.

- 2026-08-05: `T-20260804-002` shutdown 재작업 독립 QA 15/15와 Lead 완료 리뷰를
  Product Owner가 승인해 `done`으로 확정했다. Docker·Node 24 container 실검증은
  `T-20260804-007` 필수 통합 게이트로 이관했다.

## 2026-08-05

- `QA-HIGH-002-001`에 따라 deadline 초과 시 connection 정리와 명시적 exit 1을 추가했다.
- shutdown 중 두 번째 SIGTERM/SIGINT가 즉시 exit 1로 강제 종료하도록 수정했다.
- 정상 SIGTERM·SIGINT, idle keep-alive, hanging close, 연속 signal의 실제 child process
  테스트 5개를 추가해 전체 15/15를 통과했다.
- 최신 `origin/develop`로 재정렬하고 공용 수익화·디자인 완료 기록을 보존했다.

## 2026-08-04

- `T-20260728-006` Foundation 구현을 6개 하위 Task로 분해했다.
- Backend Agent용 `apps/backend/AGENTS.md`와 상태·계획·스펙·결정 문서를 추가했다.
- 첫 runtime scaffold Task `T-20260804-002`를 실행 승인했다.
- 실제 provider·배포·원격 STT endpoint를 범위 밖으로 유지했다.
- Node.js 24 LTS·TypeScript 7·Fastify 5.11·npm 11 runtime을 결정했다.
- typed fail-closed 환경 설정과 고정 응답 `GET /healthz`를 구현했다.
- Cloud Run `PORT`·`0.0.0.0`·`SIGTERM` 경계와 multi-stage non-root container를 추가했다.
- config·health·remote STT route 부재·graceful close 테스트를 추가했다.
- Backend QA가 shutdown deadline 뒤 listener·process 생존 결함
  `QA-HIGH-002-001`을 확인해 `FAIL`로 판정했다.
- Product Owner가 강제 종료·두 번째 signal·hanging close·keep-alive·실제 process
  종료 상한 재작업을 승인해 Backend Agent에 재인계했다.
