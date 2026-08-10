---
schema: aiops.task.v1
id: T-20260810-001
title: Backend 실제 AI provider adapter·prompt·schema validation 구현
status: approved
type: feature
priority: P0
priority_reason: 실제 AI Review 생성 경로의 첫 실행 패키지이며 provider 선택과 데이터 처리 계약을 코드 경계로 고정한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Backend Agent
target_role: Execution Role
required_capabilities: [backend_architecture, api_contract, implementation, developer_verification]
ownership:
  paths: [apps/backend/src/ai/, apps/backend/contracts/ai/, apps/backend/tests/ai/]
  domains: [ai-provider, structured-output]
  documents: [apps/backend/docs/ARCHITECTURE_DECISION.md, apps/backend/docs/AI_RECIPE_CONTRACT.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260728-006]
blocks: [T-20260810-004, T-20260810-006, T-20260729-003]
parallel_group: backend-production-r2-foundation
allowed_paths:
  - apps/backend/src/ai/
  - apps/backend/contracts/ai/
  - apps/backend/tests/ai/
  - apps/backend/docs/ARCHITECTURE_DECISION.md
  - apps/backend/docs/AI_RECIPE_CONTRACT.md
  - apps/backend/docs/STATUS.md
  - apps/backend/docs/CHANGELOG.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - .ai_project/tasks/active/T-20260729-003_build-production-stt-ai-backend-gateway.md
  - apps/backend/docs/ARCHITECTURE_DECISION.md
  - apps/backend/docs/AI_RECIPE_CONTRACT.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-10
updated_at: 2026-08-10
report_to: .ai_project/reports/T-20260810-001_backend-production-ai-provider-adapter-report.md
qa_to: .ai_project/qa/T-20260810-001_backend-production-ai-provider-adapter-qa.md
status_ref: origin/develop
status_ref_sha: 53871af9c4d7bf81b28f7c77d9a83da968c517c1
---

# Backend 실제 AI provider adapter·prompt·schema validation 구현

## Scope

- Goal: 승인된 provider를 기존 `RecipeProvider` 경계에 연결하고 versioned Review schema만 반환한다.
- In scope: provider SDK/HTTP adapter, model·prompt·schema version, structured output 검증, timeout·rate-limit·invalid output 오류 매핑, sandbox 계약 테스트.
- Out of scope: provider 자동 fallback, cloud 배포, production traffic, 원격 STT, iOS 변경.
- Acceptance criteria: provider sandbox 정상·invalid·timeout·429가 공용 계약으로 매핑되고 콘텐츠·secret이 로그에 남지 않으며 provider-at-most-once를 유지한다.

## Decision Gate

- 2026-08-10 Product Owner 승인: OpenAI `gpt-5-mini-2025-08-07`, 한국 데이터 저장 프로젝트와 `kr.api.openai.com`을 기본안으로 사용한다.
- 비미국 리전 사용에 필요한 OpenAI 승인과 ZDR 계약은 외부 호출 활성화 전 필수 게이트다.
- ZDR·sandbox credential이 준비되기 전에는 adapter·contract·local test까지만 구현하고 실제 provider 호출은 비활성으로 유지한다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-10 | Development Lead Agent |  | proposed | 실제 AI provider 실행 패키지 생성 |
| 2026-08-10 | Development Lead Agent | proposed | scoped | provider·model·지역·보관·비용 결정과 실행 범위 조율 완료 |
| 2026-08-10 | Product Owner | scoped | approved | 추천 결정안과 T-20260810-001~005 실행 승인 |
| 2026-08-10 | Backend Agent | approved | in_progress | canonical 확인 후 전용 worktree에서 lock 획득 |
| 2026-08-10 | Backend Agent | in_progress | verification_ready | adapter·prompt·schema·activation gate 구현 후 Backend QA 인계 |
| 2026-08-10 | Backend QA Agent | verification_ready | verification_in_progress | 구현 보고서와 산출물 독립 검증 |
| 2026-08-10 | Backend QA Agent | verification_in_progress | rework_requested | body-read 오분류와 strict schema subset 부적합 High 2건으로 FAIL |
| 2026-08-10 | Development Lead Agent | rework_requested | scoped | `WP-R1~R2` 범위와 외부 호출 금지 경계 조율 |
| 2026-08-10 | Product Owner | scoped | approved | `WP-R1~R2` 재작업 승인·Backend Agent 재인계 |

## Rework Scope

- `WP-R1`: `response.text()` transport/read 실패를 JSON parse 실패와 분리한다. body-read
  timeout·연결 유실은 `OUTCOME_UNKNOWN`, 성공적으로 읽힌 invalid JSON/schema는
  `OUTPUT_INVALID`로 고정하고 synthetic 회귀 테스트를 추가한다.
- `WP-R2`: 공용 schema를 OpenAI Structured Outputs 지원 subset의 provider schema로
  명시적으로 투영한다. provider-facing keyword allowlist validator를 추가하고
  `uniqueItems` 등 provider 비지원 제약은 전송하지 않되 runtime semantic validator에서
  계속 fail closed한다.
- 보존: model·endpoint·prompt version·`store=false`, transport at-most-once, activation
  gate, no retry/fallback, 로그 redaction, runtime 105/105.
- 금지: ZDR·Modified Retention·국외 처리·credential·별도 외부 변경 승인 전 실제 provider
  호출 및 sandbox schema handshake.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Backend Agent / Execution Role이야. Task T-20260810-001은 승인된 실행 Task야.

- 현재 상태: approved
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 53871af9c4d7bf81b28f7c77d9a83da968c517c1
- 다음에 해야 할 일: 기존 미병합 구현을 보존한 전용 worktree에서 `WP-R1~R2`만 수행하고 자체 검증 후 task report를 갱신해줘.
- 기준 문서: 상위 Task, `apps/backend/docs/ARCHITECTURE_DECISION.md`, `apps/backend/docs/AI_RECIPE_CONTRACT.md`
- 허용 경로: front matter의 `allowed_paths`
- 참고 산출물: 이 Task 파일, 구현 보고서, Backend QA 보고서
- 변경/검토 대상: `apps/backend/src/ai/`, `apps/backend/contracts/ai/`, `apps/backend/tests/ai/`
- 남은 리스크: Docker 부재로 non-root container 미검증; 실제 sandbox schema handshake 미실행; 한국 내 추론 처리 미보장.
- 차단/결정 필요: ZDR 승인·sandbox credential 전에는 실제 외부 호출을 활성화하지 않는다.
- 완료 시: status를 verification_ready로 바꾸고 target_agent를 Backend QA Agent, target_role을 Verification Role로 넘겨줘.
