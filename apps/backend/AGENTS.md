# CookLog Backend AGENTS.md

이 문서는 `apps/backend/` 구현 세션의 우선 인수인계 기준이다. Backend Agent는 이
문서와 `apps/backend/docs/`를 먼저 읽고, 루트 제품 문서와 확정 계약을 하향 변경하지
않는다.

## 역할

- Backend Agent는 승인된 Task의 `allowed_paths` 안에서만 구현한다.
- Backend QA Agent는 구현 세션과 분리해 계약·보안·개인정보·비용 경계를 검증한다.
- Development Lead Agent는 하위 패키지 분해, 공유 파일 소유권과 완료 검토를 담당한다.

## 현재 기준

- 상위 Task: `T-20260728-006`
- 선행 계약: `T-20260728-005`, 하위 `T-20260729-020~025`
- 첫 실행 Task: `T-20260804-002`
- 첫 출시 STT: Apple 기기 내 처리
- 원격 STT: endpoint 없이 기본 비활성 확장 경계만 유지
- AI provider: 실제 연결 금지, Mock provider만 허용
- 배포·cloud resource·결제·secret 외부 변경: 범위 밖

## 필수 원본

- `apps/backend/docs/ARCHITECTURE_DECISION.md`
- `apps/backend/docs/API_CONTRACT.md`
- `apps/backend/docs/AI_RECIPE_CONTRACT.md`
- `apps/backend/docs/REMOTE_STT_ADAPTER.md`
- `apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md`
- `apps/backend/contracts/`
- `apps/backend/contracts/fixtures/`

## 구현 원칙

- 공개 request·response는 기존 schema와 fixture를 변경 없이 소비한다.
- schema version, enum, 추가 필드는 fail closed로 검증한다.
- provider·secret·원문 STEP·RecipeDraft·token·attestation proof를 로그에 남기지 않는다.
- provider 호출 전 quota·비용 예약, idempotency와 단일 호출 경계를 유지한다.
- 원격 STT route·upload·Mock STT provider를 만들지 않는다.
- 콘텐츠는 ACK 즉시 삭제, 생성 22시간 cleanup, 24시간 접근 차단 계약을 완화하지 않는다.
- package manager·lockfile·composition root는 한 Task가 단일 소유한다.

## 작업 절차

1. 최신 `origin/develop`과 Task 파일을 확인한다.
2. 전용 worktree·Task 브랜치에서 lock과 상태를 기록한다.
3. 구현 전 `apps/backend/docs/STATUS.md`, `DEVELOPMENT_PLAN.md`, `DEVELOPMENT_SPEC.md`를
   확인한다.
4. Task별 테스트와 기존 공용 계약 validator를 실행한다.
5. 보고서·상태·변경 기록을 갱신하고 Backend QA에 인계한다.

## 금지

- 실제 provider API 호출, 결제·배포·cloud console 변경
- 운영 secret 또는 사용자 콘텐츠를 fixture·로그·commit에 추가
- 승인 없는 원격 STT 활성화와 자동 fallback
- iOS·Android 구현 변경
- 다른 Task의 공용 보드 상태 덮어쓰기
