# Backend Foundation 개발 계획

최종 업데이트: 2026-08-06

## 목표

확정 계약을 실행 가능한 local/mock Backend로 만들되 실제 provider·cloud 배포와 원격
STT 활성화를 포함하지 않는다.

## 실행 순서

1. `T-20260804-002`: runtime scaffold·환경 설정·health — `done`, Backend QA 15/15 `PASS_WITH_RISK`·최종 승인
2. `T-20260804-003`: 공통 HTTP·인증·제한·idempotency — `done`
3. `T-20260804-004`: Mock AI 비동기 job·status·ACK·복구 — `done`
4. `T-20260804-005`: 원격 STT 비활성 확장 경계·활성화 차단 — `done`
5. `T-20260804-006`: redacted logging·비용 원장·TTL cleanup — `done`
6. `T-20260804-007`: 통합 계약·보안 테스트·로컬 실행 handoff — `rework_requested`,
   `QA-HIGH-007-001` terminal telemetry fail-closed 재작업 승인

공유 app wiring과 전체 회귀는 T-007이 소유한다. 실제 provider·cloud adapter와 배포는
T-007 및 Foundation 완료로 자동 승인되지 않는다.

## 완료 게이트

- 새 clone에서 문서 명령으로 build·test·local run 가능
- health와 Mock AI endpoint가 공용 fixture와 일치
- 원격 STT endpoint 0개, production 활성화 불가
- 정상·오류·timeout·idempotency·ACK·cleanup 계약 테스트 통과
- secret·콘텐츠 로그 0건과 비용 hard cutoff 불변식 통과
- Backend QA 독립 검증 통과
