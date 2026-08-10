---
schema: aiops.task.v1
id: T-20260729-003
title: 실제 AI provider와 배포 가능한 Backend gateway 구축
status: scoped
type: feature
priority: P0
priority_reason: 첫 공개 출시의 온라인 AI 정리를 실제 환경에서 안전하게 제공하는 필수 경로다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities:
  - technical_planning
  - dependency_management
depends_on:
  - T-20260728-005
  - T-20260728-006
blocks:
  - T-20260729-005
  - T-20260728-009
parallel_group: release-r2-services
child_tasks:
  - T-20260810-001
  - T-20260810-002
  - T-20260810-003
  - T-20260810-004
  - T-20260810-005
  - T-20260810-006
allowed_paths:
  - apps/backend/
  - docs/
  - .github/
  - .ai_project/source_of_truth.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_ROADMAP.md
  - docs/PROJECT_DECISIONS.md
  - T-20260728-005에서 승인된 Backend 계약
  - T-20260728-006에서 검증된 Backend foundation
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-08-10
report_to: .ai_project/reports/T-20260729-003_build-production-stt-ai-backend-gateway-report.md
qa_to: .ai_project/qa/T-20260729-003_build-production-stt-ai-backend-gateway-qa.md
---

# 실제 AI provider와 배포 가능한 Backend gateway 구축

## 목적

승인된 계약과 foundation에 실제 AI provider를 연결하고, 개인정보·비용·장애 정책을 지키는 개발·스테이징 배포 후보를 만든다. 원격 STT adapter는 기본 비활성 상태를 유지한다.

## 제안 범위

- 승인된 AI provider adapter
- 원격 STT adapter의 기본 비활성 설정과 자동 fallback 방지
- 첫 출시 배포 환경에서 원격 STT endpoint·음성 upload 경로가 활성화되지 않았음을 검증
- AI generation·status 조회와 결과 수신 확인·최대 24시간 복구 cache
- 요청 idempotency, rate limit, timeout, 오류 매핑과 사용자 재실행 경계
- prompt·model·schema version과 structured output 검증
- secret manager 또는 동등한 안전한 secret 주입
- 사용자 콘텐츠 없는 운영 metadata·비용 계측과 최대 30일 보관
- redacted log, health, readiness와 최소 observability
- 개발·스테이징 배포 자동화, rollback과 service disable 절차
- provider sandbox·계약·보안·개인정보 테스트

## 제외 범위

- iOS client 구현
- 원격 STT provider 연결, 10초 음성 upload·transcription과 Backend 음성 임시 저장
- 사용자 계정과 레시피 서버 저장
- Product Owner 승인 없는 production 환경 생성·트래픽 전환
- 콘텐츠 logging, 모델 학습용 데이터 수집과 24시간을 넘는 AI 콘텐츠 보관

## 성공 기준

- 실제 AI가 versioned schema의 Review를 반환하며 invalid output은 명시적 오류로 처리된다.
- 첫 출시 설정에서 원격 STT adapter와 음성 upload endpoint가 비활성이고 자동 fallback 경로가 존재하지 않는다.
- 같은 request id가 중복 레시피나 중복 과금 요청을 만들지 않는다.
- AI 결과 복구 cache, 운영 metadata와 로그가 확정 TTL·redaction 정책을 준수한다.
- provider 장애, timeout, rate limit과 비용 상한을 테스트할 수 있고 rollback 절차가 문서화된다.
- Backend QA Agent가 계약·보안·개인정보·비용·장애 검증을 통과시킨다.

## 사용자 결정 필요 항목

- `T-20260728-005`가 추천한 provider·model·runtime·배포 환경과 비용 상한 승인
- 외부 개발·스테이징 환경 생성과 secret 설정 승인
- production 전환은 `T-20260728-009`에서 별도 승인

## Development Lead 하위 Task 분해 요구

1. AI provider adapter·prompt·schema validation
2. idempotency·status·result acknowledgement와 TTL cleanup
3. rate limit·비용 계측·service disable
4. secret·redacted logging·observability·보안 hardening
5. 원격 STT adapter·음성 upload 경로 기본 비활성 검증
6. 개발·스테이징 배포·rollback·runbook
7. Backend QA 계약·개인정보·장애·비용 검증

## Development Lead Scope 결과

| 순서 | Task | 실행 패키지 | 선행 Task | 병렬 경계 |
|---:|---|---|---|---|
| 1A | `T-20260810-001` | 실제 AI provider adapter·prompt·schema | Backend Foundation 완료 | 1B·1C·1D와 경로 분리 |
| 1B | `T-20260810-002` | Cloud datastore·job·ACK·24시간 lifecycle | Backend Foundation 완료 | 1A·1C·1D와 경로 분리 |
| 1C | `T-20260810-003` | App Attest·단기 token·abuse 방어 | Backend Foundation 완료 | 1A·1B·1D와 경로 분리 |
| 1D | `T-20260810-005` | 원격 STT·음성 upload 비활성 보증 | Backend Foundation 완료 | 독립 negative boundary |
| 2 | `T-20260810-004` | 비용 hard cutoff·redaction·observability | T-001~003 완료 | provider·storage·auth 통합 필요 |
| 3 | `T-20260810-006` | 스테이징 composition·배포·rollback·통합 QA 준비 | T-001~005 완료 | composition·package·CI 단일 소유 |

## Scope 및 승인 경계

- 2026-08-10: Development Lead Agent가 공용 `origin/develop@1657056`에서
  `T-20260728-005`, `T-20260728-006`의 `done`과 Backend 100/100·계약 validator 5종·
  Node 24 non-root Foundation을 확인했다.
- 실제 구현을 위 6개 하위 Task로 분해하고 `proposed -> scoped`로 전환한다. 하위 Task는
  모두 `proposed`이며 Product Owner가 provider·지역·계약·비용·cloud 경계를 결정하고
  개별 실행을 승인하기 전에는 Backend Agent가 lock을 획득하거나 구현하지 않는다.
- `T-20260810-001~003`, `005`는 소유 경로가 분리되지만 같은 Backend Agent가 한 번에
  하나의 Task만 수행한다. 여러 독립 Backend Agent 세션을 열 때만 병렬 실행할 수 있다.
- `T-20260810-004`는 provider·storage·auth 결과를 비용·관측성 경계에 연결한 뒤 실행하고,
  `T-20260810-006`은 앞선 5개가 공용 `develop`에서 `done`인 뒤 최종 composition을 소유한다.
- 실제 production 환경 생성·트래픽 전환, iOS client, 원격 STT provider·음성 upload,
  사용자 계정·레시피 서버 저장은 범위 밖이다.
- T-020의 2026-07-30 provider·model·가격·지역·보관 정보는 실행 승인 전에 최신 공식
  정보로 재검증한다. 최신 확인 전 특정 provider/model을 확정값으로 기록하지 않는다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Product Owner / Direction Role이야.
Task T-20260729-003의 실행 결정 경계를 검토해줘.

- 현재 상태: `scoped`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `1657056`
- 다음에 해야 할 일: provider·model, 저장/처리 지역, MAM/ZDR 또는 동등 계약,
  Cloud Run·Tasks·Firestore, App Attest compatibility, 월 예산·호출/token hard cutoff와
  개발·스테이징 외부 리소스 생성 범위를 결정해.
- 기준 문서: Task `source_of_truth` 전체와 T-020 결정안
- 허용 경로: Task frontmatter의 `allowed_paths`
- 참고 산출물: `T-20260810-001~006` 하위 Task
- 변경/검토 대상: `apps/backend/`, Backend 배포 workflow·runbook
- 남은 리스크: T-020의 provider·가격·지역·계약 정보 최신성 재검증 필요
- 차단/결정 필요: 외부 provider·cloud·secret·비용 승인이 없으면 하위 Task 실행 금지
- 승인 시: 결정값과 실행 허용 범위를 기록하고 첫 하위 Task만 `approved`로 Backend Agent에 인계해.
- 주의: production 트래픽 전환은 T-20260728-009의 별도 승인 범위야.
