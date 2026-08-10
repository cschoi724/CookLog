# Backend Foundation 개발 계획

최종 업데이트: 2026-08-10

상위 상태: `T-20260728-006 done` — 하위 T-002~007 완료, Development Lead
`PASS_WITH_RISK`, Product Owner 최종 완료·PR #93 병합 승인

## 목표

확정 계약을 실행 가능한 local/mock Backend로 만들되 실제 provider·cloud 배포와 원격
STT 활성화를 포함하지 않는다.

실제 provider·스테이징 후보는 `T-20260729-003`에서 아래 6개 패키지로 scope했다.
모두 `proposed`이며 provider·지역·계약·비용·cloud 결정과 개별 승인 전에는 실행하지 않는다.

1. `T-20260810-001` 실제 AI provider adapter·prompt·schema
2. `T-20260810-002` Cloud datastore·AI job·ACK·24시간 lifecycle
3. `T-20260810-003` App Attest·설치 token·abuse 방어
4. `T-20260810-004` production 비용 hard cutoff·observability
5. `T-20260810-005` production 원격 STT·음성 upload 비활성 보증
6. `T-20260810-006` 스테이징 composition·배포·rollback 통합

## 실행 순서

1. `T-20260804-002`: runtime scaffold·환경 설정·health — `done`, Backend QA 15/15 `PASS_WITH_RISK`·최종 승인
2. `T-20260804-003`: 공통 HTTP·인증·제한·idempotency — `done`
3. `T-20260804-004`: Mock AI 비동기 job·status·ACK·복구 — `done`
4. `T-20260804-005`: 원격 STT 비활성 확장 경계·활성화 차단 — `done`
5. `T-20260804-006`: redacted logging·비용 원장·TTL cleanup — `done`
6. `T-20260804-007`: 통합 계약·보안 테스트·로컬 실행 handoff — `done`,
   HIGH 해소·100/100·계약 5종·Node 24 container·독립 재검증 통과

공유 app wiring과 전체 회귀는 T-007이 소유한다. 실제 provider·cloud adapter와 배포는
T-007 및 Foundation 완료로 자동 승인되지 않는다.

상위 완료 리뷰에서 하위 6개 패키지의 독립 QA와 develop 병합, Backend 100/100·계약
validator 5종·경계 감사·Node 24 non-root container를 집계해 성공 기준 충족을 확인했다.

## 완료 게이트

- 새 clone에서 문서 명령으로 build·test·local run 가능
- health와 Mock AI endpoint가 공용 fixture와 일치
- 원격 STT endpoint 0개, production 활성화 불가
- 정상·오류·timeout·idempotency·ACK·cleanup 계약 테스트 통과
- secret·콘텐츠 로그 0건과 비용 hard cutoff 불변식 통과
- Backend QA 독립 검증 통과
