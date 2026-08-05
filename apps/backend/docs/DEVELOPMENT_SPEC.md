# Backend Foundation 개발 스펙

최종 업데이트: 2026-08-05
단계: T-002 Runtime Foundation 재작업 검증 대기

## 런타임 경계

- Cloud Run 호환 stateless HTTP container
- local/mock 환경만 구현하며 cloud resource를 만들지 않는다.
- Node.js 24 LTS·TypeScript 7·Fastify 5.11·npm 11을 사용한다.
- 상세 선택과 Cloud Run lifecycle은 `RUNTIME_FOUNDATION.md`를 따른다.
- 환경별 설정은 typed validation과 fail closed를 사용한다.
- 정상 signal은 실제 exit 0, deadline 초과와 shutdown 중 두 번째 signal은 실제 exit 1로
  종료하며 child process 테스트에서 9초 상한을 검증한다.

## 공개 endpoint

- `GET /healthz`: 고정 `health.v1` 응답, 환경·secret·dependency 상세 비노출
- 계약에 정의된 installation auth 경계
- AI recipe job create·status·ACK
- 원격 STT endpoint는 만들지 않는다.

## 내부 경계

- `AttestationVerifier`
- `InstallationTokenService`
- `RateLimiter`와 `IdempotencyStore`
- `RecipeAIProvider`의 Mock 구현
- `RecipeJobRepository`와 시간 주입 가능한 cleanup
- `SafeLogger`, 비용·quota 원장
- `RemoteSTTAdapter` 비활성 resolver

## 저장과 시간

- 첫 foundation은 in-memory 또는 명시적 test adapter를 사용할 수 있다.
- process 재시작 내구성은 production 구현이 아니므로 문서에 제한을 명시한다.
- ACK 즉시 삭제, +22시간 cleanup, +24시간 접근 차단을 주입 가능한 clock으로 검증한다.

## 검증

- 기존 `apps/backend/contracts/**/validate-contracts.sh`
- `apps/backend/tests/contracts/validate-shared-fixtures.sh`
- runtime unit·integration·contract·security test
- secret·사용자 콘텐츠 로그 scanner
- `npm ci`, `npm run typecheck`, `npm test`, `npm run check`
