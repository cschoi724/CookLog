# Backend Foundation 개발 스펙

최종 업데이트: 2026-08-04
단계: 구현 전 기준

## 런타임 경계

- Cloud Run 호환 stateless HTTP container
- local/mock 환경만 구현하며 cloud resource를 만들지 않는다.
- runtime·framework·package manager 버전은 T-002 ADR에서 고정한다.
- 환경별 설정은 typed validation과 fail closed를 사용한다.

## 공개 endpoint

- health endpoint
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
