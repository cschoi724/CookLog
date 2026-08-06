# Backend Foundation 개발 스펙

최종 업데이트: 2026-08-06
단계: T-007 Foundation 통합 검증

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

local/test composition은 위 경계를 하나의 app과 programmatic worker에 연결한다. production
entry point는 in-memory token·provider·repository를 생성하지 않으며 health 외 endpoint를
등록하지 않는다.

## 저장과 시간

- 첫 foundation은 in-memory 또는 명시적 test adapter를 사용할 수 있다.
- process 재시작 내구성은 production 구현이 아니므로 문서에 제한을 명시한다.
- ACK 즉시 삭제, +22시간 cleanup, +24시간 접근 차단을 주입 가능한 clock으로 검증한다.

## 검증

- 기존 `apps/backend/contracts/**/validate-contracts.sh`
- `apps/backend/tests/contracts/validate-shared-fixtures.sh`
- runtime unit·integration·contract·security test
- secret·사용자 콘텐츠 로그 scanner
- 새 clone에서 Node.js `24.18.0`, npm 11과 lockfile 기준 `npm ci`
- 단일 호스트 명령 `npm run verify`
- 단일 container 명령 `npm run verify:container`
- Backend CI의 동일 Node/container 검증
