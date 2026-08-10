---
schema: aiops.task.v1
id: T-20260810-001
title: Backend 실제 AI provider adapter·prompt·schema validation 구현
status: done
type: feature
priority: P0
priority_reason: 실제 AI Review 생성 경로의 첫 실행 패키지이며 provider 선택과 데이터 처리 계약을 코드 경계로 고정한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Completion Role
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
status_ref_sha: 19cb422fced77456c3de85ca87af4f20d9919bbf
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
| 2026-08-10 | Backend Agent | approved | in_progress | canonical `origin/develop@2b666590` 확인 후 전용 worktree에서 lock 획득 |
| 2026-08-10 | Backend Agent | in_progress | verification_ready | adapter·prompt·strict schema·gate 구현, 105/105·계약 5종·경계 감사 통과 후 lock 해제·Backend QA 인계 |
| 2026-08-10 | Backend QA Agent | verification_ready | verification_in_progress | 구현 보고서·라우팅·선행 Task 확인 후 독립 검증 lock 획득 |
| 2026-08-10 | Backend QA Agent | verification_in_progress | rework_requested | FAIL: body-read 연결 유실 오분류, provider strict schema subset 부적합 위험; QA 보고서 작성·lock 해제·Development Lead 인계 |
| 2026-08-10 | Development Lead Agent | rework_requested | scoped | `WP-R1~R2` 범위와 외부 호출 금지 경계 조율 |
| 2026-08-10 | Product Owner | scoped | approved | `WP-R1~R2` 재작업 승인·Backend Agent 재인계 (`origin/agent/approve-t001-rework@2f148b8`) |
| 2026-08-10 | Backend Agent | approved | in_progress | canonical `origin/develop@344eade` 및 재작업 승인 ref 확인 후 lock 재획득 |
| 2026-08-10 | Backend Agent | in_progress | verification_ready | `WP-R1~R2` 구현·108/108·계약 5종·경계 감사 통과, lock 해제·Backend QA 재인계 |
| 2026-08-10 | Backend QA Agent | verification_ready | verification_in_progress | 재작업 보고서·라우팅·canonical 확인 후 독립 재검증 lock 획득 |
| 2026-08-10 | Backend QA Agent | verification_in_progress | verification_passed | PASS_WITH_RISK: 최초 HIGH 2건 해소, Node 26·24 108/108·계약 5종·경계 감사·독립 반례 통과; lock 해제·Development Lead 완료 검토 인계 |
| 2026-08-10 | Development Lead Agent | verification_passed | completion_review | PR #116 최신 canonical 통합·전체 108/108·계약 5종·boundary·non-root container·CI 6개 통과; 완료 가능 판정 |
| 2026-08-10 | Product Owner / Development Lead Agent | completion_review | done | 완료 리뷰·잔여 외부 gate 수용 승인, PR #116 병합 `19cb422`; canonical 완료 확정 |

## Rework Scope

- `WP-R1`: `response.text()` transport/read 실패를 JSON parse 실패와 분리한다. body-read
  timeout·연결 유실은 `OUTCOME_UNKNOWN`, 성공적으로 읽힌 invalid JSON/schema는
  `OUTPUT_INVALID`로 고정하고 synthetic 회귀 테스트를 추가한다.
- `WP-R2`: 공용 schema를 OpenAI Structured Outputs 지원 subset의 provider schema로
  명시적으로 투영한다. provider-facing keyword allowlist validator를 추가하고
  `uniqueItems` 등 provider 미지원 제약은 전송하지 않되 runtime semantic validator에서
  계속 fail closed한다.
- 보존: model·endpoint·prompt version·`store=false`, transport at-most-once, activation
  gate, no retry/fallback, 로그 redaction, 기존 통과 항목.
- 금지: ZDR·Modified Retention·국외 처리·credential·별도 외부 변경 승인 전
  실제 provider 호출 및 sandbox schema handshake.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Lead Role이야.
상위 Backend 작업의 남은 dependency를 이어서 조율해줘.

- 현재 상태: done
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 19cb422fced77456c3de85ca87af4f20d9919bbf
- 다음에 해야 할 일: T-20260810-002~003의 진행 상태를 유지하고 두 Task가 canonical에서 done이 된 뒤에만 T-20260810-004를 실행 가능 dependency로 판단해줘.
- 기준 문서: 상위 Task, `apps/backend/docs/ARCHITECTURE_DECISION.md`, `apps/backend/docs/AI_RECIPE_CONTRACT.md`
- 허용 경로: front matter의 `allowed_paths`
- 참고 산출물: `.ai_project/reports/T-20260810-001_backend-production-ai-provider-adapter-report.md`, `.ai_project/qa/T-20260810-001_backend-production-ai-provider-adapter-qa.md`
- 변경/검토 대상: `apps/backend/src/ai/openai-recipe-provider.ts`, `openai-structured-output-schema.ts`, `apps/backend/contracts/ai/`, `apps/backend/tests/ai/`
- 남은 리스크: 실제 sandbox/provider handshake와 production 연결은 외부 gate 전까지 미검증이며 후속 T-20260810-006 범위다. GitHub non-root container 검증은 통과했다.
- 차단/결정 필요: T-004는 T-002~003 미완료로 계속 대기. ZDR·Modified Retention·국외 처리 승인·credential 전에는 실제 외부 호출을 활성화하지 마.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.

## Completion Review

- 판정: `PASS_WITH_RISK`, 완료 가능
- 검토 PR: `#116`
- 최신 canonical 적용 충돌: Backend 코드·계약·테스트 충돌 없음; 운영 파일 5개는 승인 이력을 보존해 정합하게 해소함.
- 로컬 통합 검증: `npm run verify` 108/108, 계약 5종, Foundation boundary audit PASS.
- GitHub 검증: backend-verify, backend-container, ios-build, ios-xctest 및 변경 감지 2종 PASS.
- 최초 High 2건: body-read `OUTCOME_UNKNOWN` 분리와 provider schema subset projection으로 해소.
- 수용 가능한 잔여 위험: 실제 provider handshake와 production composition은 승인된 외부 gate 및 후속 Task 전까지 의도적으로 비활성.
- 후속 영향: 완료·병합되면 T-20260810-004의 dependency 중 T-001을 해소할 수 있으나 T-002~003 완료 전에는 T-004를 시작하지 않는다.
