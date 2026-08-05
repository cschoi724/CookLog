---
schema: aiops.task.v1
id: T-20260804-004
title: Mock AI recipe job·status·ACK·복구 저장 경계 구현
status: verification_passed
type: feature
priority: P0
priority_reason: 실제 provider 없이 iOS 연동과 비동기 AI 계약을 실행 검증해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities:
- backend_implementation
- api_contract
depends_on:
- T-20260804-002
- T-20260804-003
blocks:
- T-20260804-006
- T-20260804-007
parallel_group: backend-foundation-domain-edges
allowed_paths:
- apps/backend/src/ai/
- apps/backend/src/jobs/
- apps/backend/src/storage/
- apps/backend/src/routes/ai/
- apps/backend/tests/ai/
- apps/backend/tests/jobs/
- apps/backend/docs/STATUS.md
- apps/backend/docs/CHANGELOG.md
- .ai_project/tasks/backlog/T-20260804-004_implement-mock-ai-recipe-jobs.md
- .ai_project/tasks/active/T-20260804-004_implement-mock-ai-recipe-jobs.md
- .ai_project/reports/T-20260804-004_implement-mock-ai-recipe-jobs-report.md
- .ai_project/qa/T-20260804-004_implement-mock-ai-recipe-jobs-qa.md
- .ai_project/teams/development/task_board.md
- .ai_project/teams/quality/task_board.md
source_of_truth:
- apps/backend/docs/AI_RECIPE_CONTRACT.md
- apps/backend/contracts/ai/
- apps/backend/contracts/fixtures/
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-04
updated_at: 2026-08-05
report_to: .ai_project/reports/T-20260804-004_implement-mock-ai-recipe-jobs-report.md
qa_to: .ai_project/qa/T-20260804-004_implement-mock-ai-recipe-jobs-qa.md
---

# Mock AI recipe job 구현

## 범위

- `RecipeAIProvider` interface와 deterministic Mock provider
- create·status·ACK·result version·manual retry 경계
- in-memory/test repository와 clock 주입
- provider 단일 호출·idempotency·timeout·invalid output 차단

## 성공 기준

- shared fixture의 정상·오류·timeout·만료 흐름이 runtime integration test를 통과한다.
- 실제 network·provider credential을 사용하지 않는다.
- process 재시작 내구성 제한을 명시한다.

## 승인 및 실행 경계

- 2026-08-05: 공용 `develop`에서 선행 `T-20260804-002`, `T-20260804-003`의 `done`을
  확인했다.
- 2026-08-05: Product Owner가 deterministic Mock 기반 create·status·ACK·복구 저장
  경계 구현을 별도 승인했다. Development Lead Agent가 `proposed -> approved`로
  전환하고 Backend Agent에 인계했다.
- 구현은 `RecipeAIProvider` interface, deterministic Mock, in-memory/test repository,
  clock 주입과 계약 fixture 기반 integration test로 제한한다.
- 실제 provider·network·credential, production datastore·queue·encryption key,
  cloud resource·배포와 원격 STT는 포함하지 않는다.
- T-003 공통 인증·rate limit·idempotency 구현을 재사용하되 composition root와 전체
  app wiring은 T-007 소유로 유지한다.
- logical job당 provider 최대 1회, ACK 즉시 콘텐츠 삭제, result version·timeout·
  outcome unknown·manual retry 경계를 완화하지 않는다.
- 2026-08-05: Backend Agent가 최신 `origin/develop` `5bfc350`과 clean 전용 worktree를
  확인하고 lock을 획득해 `approved -> in_progress`로 전환했다.
- 2026-08-05: deterministic Mock provider, 원자 in-memory repository, worker 상태 머신과
  create·GET·ACK route를 구현했다. T-004 13개, T-003 포함 37개, 기존 15개와 공용 계약
  validator를 통과해 `in_progress -> verification_ready`로 Backend QA에 인계했다.
- 2026-08-05: Backend QA Agent가 최신 `origin/develop`, clean worktree와 구현 보고서를
  확인하고 담당 메타데이터를 바로잡아 `verification_ready -> verification_in_progress`로
  독립 검증을 시작했다.
- 2026-08-05: Backend QA Agent가 승인 fixture snapshot hash 불일치와 +24시간 delete
  실패 거짓 완료 HIGH 2건, invalid calendar date 허용 MEDIUM 1건을 확인했다. 최종
  `FAIL`, `verification_in_progress -> rework_requested`로 Development Lead Agent에
  재작업 범위 조율을 인계했다.
- 2026-08-05: Product Owner가 `QA-HIGH-004-001~002`, `QA-MEDIUM-004-003`을 하나의
  제한된 재작업 패키지로 승인했다. Task를 `rework_requested -> approved`로 전환하고
  Backend Agent에 다시 인계한다.
- 재작업은 승인된 원본 shared fixture의 canonical snapshot hash 일치와 원본 무변조
  create 성공, 삭제 receipt 성공 전 `expired_deleted` 금지·cleanup pending/retry·sweeper
  복구, strict RFC 3339 calendar/timezone/leap-year 검증으로 제한한다.
- 원본 fixture·key order·UTF-8·배열·newline golden vector, delete 반복 실패와 sweeper
  복구·신규 job 차단, create·ACK invalid calendar date 반례를 회귀 테스트에 포함한다.
- 기존 52개 runtime test와 공용 validator의 무회귀를 다시 확인한다. 실제 provider·cloud·
  production secret·production adapter와 T-005~007 구현은 재작업 범위에 포함하지 않는다.
- 2026-08-05: Backend Agent가 재작업 승인을 확인하고 최신 `origin/develop` `865f508`로
  재정렬한 clean worktree에서 lock을 획득해 `approved -> in_progress`로 전환했다.
- 2026-08-05: jq-compatible LF 종결 canonical bytes, expiry cleanup pending·신규 job 차단과
  strict RFC 3339 calendar 검증을 구현했다. T-004 16개, T-003 포함 40개, 기존 15개와
  공용 validator를 통과해 `in_progress -> verification_ready`로 Backend QA에 재인계했다.
- 2026-08-05: Backend QA Agent가 최신 `origin/develop`, 재작업 커밋과 clean worktree를
  확인하고 담당 메타데이터를 바로잡아 `verification_ready -> verification_in_progress`로
  독립 재검증을 시작했다.
- 2026-08-05: Backend QA Agent가 HIGH 2건·MEDIUM 1건 직접 반례 해소, 전체 55개와
  공용 계약 무회귀를 확인했다. in-memory 재시작 비내구성과 production adapter를 잔여
  위험으로 기록하고 `verification_in_progress -> verification_passed`,
  `PASS_WITH_RISK`로 Development Lead Agent에 완료 검토를 인계했다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Lead Role이야.
Task T-20260804-004는 Backend QA 독립 재검증을 통과한 완료 검토 Task야.

- 현재 상태: `verification_passed`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `ba9bb381cf6d8841d90ab7d35b78527feb9c25d0`
- 다음에 해야 할 일: QA `PASS_WITH_RISK`와 잔여 위험을 검토하고 `completion_review`
  전환 또는 추가 재작업 필요 여부를 결정해줘.
- 기준 문서: `apps/backend/docs/AI_RECIPE_CONTRACT.md`, `apps/backend/contracts/ai/`,
  `apps/backend/contracts/fixtures/`
- 허용 경로: Task frontmatter의 `allowed_paths`
- 참고 산출물: `.ai_project/tasks/active/T-20260804-004_implement-mock-ai-recipe-jobs.md`
- 필수 검증: 원본 shared fixture 무변조 create, canonical hash golden vector,
  delete 실패·반복 실패·sweeper 복구·신규 job 차단, strict RFC 3339 create·ACK,
  기존 정상·오류·timeout·만료·ACK·result version·idempotency·provider 단일 호출,
  invalid output 차단과 실제 network·credential 0건
- 남은 리스크: in-memory 저장의 process 재시작 비내구성은 명시하고 production adapter는
  후속 승인 범위로 유지한다.
- 차단/결정 필요: 실제 provider·cloud·production secret과 T-005~007 범위 확장 금지
- 완료 시: Product Owner 최종 승인과 PR 병합이 필요한 완료 절차로 인계해줘.
