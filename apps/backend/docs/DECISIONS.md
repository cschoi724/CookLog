# Backend 개발 결정 기록

## 2026-08-04 — Foundation을 6개 패키지로 분리

- 상태: 승인
- 결정: scaffold, middleware, Mock AI, STT 비활성 경계, 보안·cleanup, 통합 검증으로
  분리한다.
- 이유: 공유 파일 충돌을 줄이고 계약·보안 QA를 단계별로 수행하기 위함이다.

## 2026-08-04 — 실제 provider와 cloud 변경 제외

- 상태: 확정
- 결정: Foundation은 local/mock 구현만 포함한다.
- 이유: provider·지역·계약·결제·secret·배포는 `T-20260729-003` 별도 승인 범위다.

## 2026-08-04 — Runtime 선택은 T-002 ADR에서 고정

- 상태: 확정
- 결정: Node.js 24 LTS, TypeScript 7, Fastify 5.11과 npm 11을 고정한다.
- 비교: Node 내장 HTTP와 Go 후보보다 후속 schema·middleware 연결 및 local/mock 테스트
  재현성이 현재 foundation에 적합하다.
- 제약: 선택이 기존 API·보안·비용 계약을 변경할 수 없다.
- 상세: `apps/backend/docs/RUNTIME_FOUNDATION.md`
