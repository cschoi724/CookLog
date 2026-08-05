---
schema: aiops.task.v1
id: T-20260804-003
title: Backend 공통 HTTP·인증·제한·idempotency middleware 구현
status: approved
type: feature
priority: P0
priority_reason: 도메인 handler 전에 공통 계약과 abuse 경계를 실행 코드로 강제해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Backend Agent
target_role: Execution Role
required_capabilities:
- backend_implementation
- api_contract
depends_on:
- T-20260804-002
blocks:
- T-20260804-004
- T-20260804-005
- T-20260804-006
- T-20260804-007
parallel_group:
allowed_paths:
- apps/backend/src/http/
- apps/backend/src/auth/
- apps/backend/src/limits/
- apps/backend/src/idempotency/
- apps/backend/tests/http/
- apps/backend/tests/auth/
- apps/backend/docs/STATUS.md
- apps/backend/docs/CHANGELOG.md
- .ai_project/tasks/backlog/T-20260804-003_implement-backend-common-middleware.md
- .ai_project/tasks/active/T-20260804-003_implement-backend-common-middleware.md
- .ai_project/reports/T-20260804-003_implement-backend-common-middleware-report.md
- .ai_project/qa/T-20260804-003_implement-backend-common-middleware-qa.md
- .ai_project/teams/development/task_board.md
- .ai_project/teams/quality/task_board.md
source_of_truth:
- apps/backend/docs/API_CONTRACT.md
- apps/backend/contracts/common/
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-04
updated_at: 2026-08-05
report_to: .ai_project/reports/T-20260804-003_implement-backend-common-middleware-report.md
qa_to: .ai_project/qa/T-20260804-003_implement-backend-common-middleware-qa.md
---

# Backend 공통 middleware 구현

## 범위

- request ID·envelope·problem renderer와 JSON Schema validation
- installation token·attestation verifier interface와 local fake
- installation·IP·project rate limit
- idempotency body hash·동시 단일 승자·replay

## 성공 기준

- 공통 fixture와 error catalog가 runtime 응답과 일치한다.
- 검증 실패는 도메인·provider를 호출하지 않는다.
- token·proof·IP·본문이 로그에 남지 않는다.
- Backend QA 독립 검증 후에만 후속 Task를 연다.

## 승인 및 상태 전이

- 2026-08-05: Product Owner가 T-20260804-003 진행을 승인했다.
- 2026-08-05: Backend Agent가 T-002 `done`과 PR #70 `develop` 병합을 확인하고 전용
  worktree에서 `proposed -> approved -> in_progress`로 전환했다.
- 2026-08-05: 공통 HTTP·인증·제한·idempotency 구현과 신규 21개, 기존 15개 테스트,
  공용 계약 validator 자체 검증을 완료해 `in_progress -> verification_ready`로
  Backend QA Agent에 인계했다.
- 2026-08-05: Backend QA Agent가 최신 `origin/develop`, 구현 보고서와 clean worktree를
  확인하고 `verification_ready -> verification_in_progress`로 전환해 독립 검증을 시작했다.
- 2026-08-05: Backend QA Agent가 공개 violation extra property secret 누출과 strict
  schema prototype-key 우회 HIGH 2건, query 포함 unsupported version 오분류 MEDIUM 1건을
  확인했다. 최종 `FAIL`, `verification_in_progress -> rework_requested`로 Development
  Lead Agent에 인계했다.
- 2026-08-05: Product Owner가 `QA-HIGH-003-001~002`, `QA-MEDIUM-003-003` 해소와
  직접 반례 회귀 테스트 추가를 재작업 범위로 승인했다. Development Lead Agent가
  `rework_requested -> approved`로 전환하고 Backend Agent에 재인계했다.

## 재작업 승인 범위

- violation은 `field`, `reason` 두 own property만 허용하고 안전한 새 객체로 투영한다.
- extra property·getter·prototype·symbol·20개 초과 입력은 고정 `INTERNAL_ERROR`로
  fail closed하며 합성 secret이 body·header에 노출되지 않음을 테스트한다.
- strict schema의 required·unknown property·child lookup을 own property 기준으로
  통일하고 prototype 이름과 nested object·array 반례를 추가한다.
- unsupported API version은 query를 제외한 pathname으로 판정하고 query 유무 반례를
  추가한다.
- 기존 인증·rate limit·idempotency 계약과 36개 테스트의 무회귀를 확인하고 Backend QA에
  독립 재검증을 요청한다.
- 실제 provider·원격 STT·cloud resource·production secret 및 후속 T-004~007 구현은
  이번 재작업 범위에 포함하지 않는다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Backend Agent / Execution Role이야.
Task T-20260804-003은 승인된 재작업 Task야.

- 현재 상태: `approved`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `39468f455b20234b4cc237cf84c718a170376419`
- 다음에 해야 할 일: 기존 전용 worktree에서 lock을 획득하고 HIGH 2건·MEDIUM 1건을
  승인 범위 안에서 수정한 뒤 직접 반례와 전체 회귀 검증을 수행해줘.
- 기준 문서: `apps/backend/docs/API_CONTRACT.md`, `apps/backend/contracts/common/`
- 허용 경로: Task frontmatter의 `allowed_paths`
- 참고 산출물: `.ai_project/qa/T-20260804-003_implement-backend-common-middleware-qa.md`
- 변경/검토 대상: `apps/backend/src/http/`, `apps/backend/tests/http/`, 상태·보고 문서
- 남은 리스크: Host Node 26의 목표 Node 24 engine 경고와 production 분산 adapter·datastore
  transaction은 기존 후속 범위로 유지한다.
- 차단/결정 필요: T-004~007은 Backend QA 독립 재검증 통과 전 열지 않는다.
- 완료 시: `verification_ready`로 전환하고 Backend QA Agent / Verification Role에
  독립 재검증을 인계해줘.
