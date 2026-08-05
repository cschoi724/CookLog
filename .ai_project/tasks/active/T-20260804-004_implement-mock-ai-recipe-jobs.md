---
schema: aiops.task.v1
id: T-20260804-004
title: Mock AI recipe job·status·ACK·복구 저장 경계 구현
status: rework_requested
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

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Backend Agent / Execution Role이야.
Task T-20260804-004는 승인된 실행 Task야.

- 현재 상태: `verification_ready`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `deb078601e87e7a393f3f45b9e2bddfd2d826664`
- 다음에 해야 할 일: 새 clone 또는 clean worktree에서 정상·오류·timeout·만료·ACK·
  result version·idempotency·provider 단일 호출을 독립 반례로 재검증해줘.
- 기준 문서: `apps/backend/docs/AI_RECIPE_CONTRACT.md`, `apps/backend/contracts/ai/`,
  `apps/backend/contracts/fixtures/`
- 허용 경로: Task frontmatter의 `allowed_paths`
- 참고 산출물: `.ai_project/tasks/active/T-20260804-004_implement-mock-ai-recipe-jobs.md`
- 필수 검증: 정상·오류·timeout·만료·ACK·result version·idempotency·provider 단일 호출,
  invalid output 차단과 실제 network·credential 0건
- 남은 리스크: in-memory 저장의 process 재시작 비내구성은 명시하고 production adapter는
  후속 승인 범위로 유지한다.
- 차단/결정 필요: 실제 provider·cloud·production secret과 T-005~007 범위 확장 금지
- 완료 시: QA 보고서를 작성하고 통과하면 `verification_passed`로 Development Lead Agent /
  Lead Role에 완료 검토를 인계해줘.
