# Backend 변경 기록

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
