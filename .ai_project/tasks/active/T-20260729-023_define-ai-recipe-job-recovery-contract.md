---
schema: aiops.task.v1
id: T-20260729-023
title: AI 레시피 job·상태 조회·결과 복구 계약 정의
status: completion_review
type: docs
priority: P0
priority_reason: 온라인 AI 정리의 비동기 처리와 실패 복구가 첫 출시 핵심 경로다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: docs
target_agent: Development Lead Agent
target_role: Completion Role
required_capabilities:
- backend_architecture
- api_contract
depends_on:
- T-20260729-020
- T-20260729-021
blocks:
- T-20260728-005
- T-20260729-025
parallel_group: backend-contract-foundation
allowed_paths:
- apps/backend/contracts/ai/
- apps/backend/docs/AI_RECIPE_CONTRACT.md
- ".ai_project/tasks/backlog/T-20260729-023_define-ai-recipe-job-recovery-contract.md"
- ".ai_project/tasks/active/T-20260729-023_define-ai-recipe-job-recovery-contract.md"
- ".ai_project/reports/T-20260729-023_define-ai-recipe-job-recovery-contract-report.md"
- ".ai_project/qa/T-20260729-023_define-ai-recipe-job-recovery-contract-qa.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
source_of_truth:
- docs/product/CookLog_PRD_v2.md
- docs/PROJECT_DECISIONS.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: '2026-07-31'
report_to: ".ai_project/reports/T-20260729-023_define-ai-recipe-job-recovery-contract-report.md"
qa_to: ".ai_project/qa/T-20260729-023_define-ai-recipe-job-recovery-contract-qa.md"
---

# AI 레시피 job·상태 조회·결과 복구 계약 정의

## 범위

- STEP Preview 입력과 구조화 RecipeDraft 출력 schema
- 생성 시작·상태 조회·완료·실패·만료 상태
- idempotent 재조회와 AI 결과 최대 24시간 복구
- 프롬프트·schema 버전, timeout과 사용자 재실행 경계

## 성공·검증 기준

- iOS가 provider를 알지 않고 AI Review 초안을 복구할 수 있다.
- Backend QA Agent가 정상·schema 오류·timeout·중복 요청·만료를 독립 검증한다.

## 실행 결과

- STEP snapshot create와 RecipeDraft·job status·result acknowledgement schema를
  작성했다.
- queued·processing·succeeded·failed·expired 상태와 CAS 전이를 정의했다.
- logical job당 provider 호출 최대 1회, worker 중복 delivery·crash·timeout의 terminal
  경계를 고정했다.
- 같은 idempotency key 동시 create의 단일 job/outbox, 반복 GET provider 호출 0,
  ACK content delete 단일 실행과 사용자 수동 새 job을 fixture로 고정했다.
- ACK 즉시 삭제, 생성 22시간 cleanup, 15분 sweeper, 24시간 복호화 전 접근 차단과
  Firestore TTL 유료 safety net 경계를 정의했다.
- evidence·안전값·step order·schema invalid 출력의 저장·반환 금지를 검증했다.
- QA-HIGH-023-001 재작업으로 available status에 server-owned `result_version`을
  제공하고 ACK mismatch·동시·replay 계약과 fixture를 추가했다.
- QA-HIGH-023-002 재작업으로 provider 시작 전/후와 실행 확실성에 따른 timeout
  decision table을 고정했다.
- QA-MEDIUM-023-001 재작업으로 quota 초과를 job 생성 전 HTTP 429 경계로 단일화하고
  job failure enum에서 제거했다.

## 자체 검증

- `sh apps/backend/contracts/ai/validate-contracts.sh`: PASS
- `jq empty apps/backend/contracts/ai/*.json apps/backend/contracts/ai/fixtures/*.json`: PASS
- canonical STEP snapshot SHA-256: PASS
- `git diff --check`: PASS
- 공식 판정은 Backend QA Agent가 별도 세션에서 수행한다.

## Next Agent Handoff

```text
너는 Backend QA Agent / Verification Role이야.
T-20260729-023 AI recipe job·상태 조회·결과 복구 계약을 독립 검증해줘.

- 문서: apps/backend/docs/AI_RECIPE_CONTRACT.md
- schema·fixture: apps/backend/contracts/ai/
- logical job당 provider 호출 최대 1회
- 동시 idempotency·worker 중복 delivery·crash·timeout
- schema/semantic invalid 결과 저장·반환 금지
- 반복 GET provider 호출 0과 사용자 수동 재실행
- ACK 즉시 삭제·22시간 cleanup·15분 sweeper·24시간 접근 차단
- provider·prompt·STEP·draft·secret 비노출
- 자체 검사: sh apps/backend/contracts/ai/validate-contracts.sh
```

## 승인 및 병렬 실행 기준

- 2026-07-31 Product Owner가 실행을 승인했다.
- 선행 `T-20260729-020`, `T-20260729-021`은 모두 `done`이다.
- `T-20260729-022`, `T-20260729-024`와 핵심 산출물 경로가 분리돼 병렬 실행할 수
  있다.
- 각 Task는 최신 `origin/develop` 기반의 독립 worktree·브랜치·Backend Agent
  세션을 사용한다. Backend Agent 세션이 하나뿐이면 병렬이 아니라 순차 실행한다.
- 공용 Development·Quality 보드는 공유 경로이므로 다른 병렬 Task의 상태를
  덮어쓰지 않는다. QA 인계와 PR 전 최신 `develop`에 재정렬해 형제 Task 상태를
  보존한다.
- iOS가 provider를 직접 알지 않도록 하고 T-021 공통 인증·idempotency·timeout·오류
  계약을 재정의하지 않고 참조한다.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-31 | Product Owner | transition: proposed -> approved | T-020·T-021 완료 후 AI recipe job·복구 계약 실행 승인 |
| 2026-07-31 | Development Lead Agent | approve parallel execution | T-022·T-024와 독립 산출물 병렬 실행, 공용 보드 직렬 통합 기준 확정 |
| 2026-07-31 | Backend Agent | lock | task lock |
| 2026-07-31 | Backend Agent | transition: approved -> in_progress | 승인된 AI recipe job·상태 조회·결과 복구 계약 작성 시작 |
| 2026-07-31 | Backend Agent | self-verification | 상태·idempotency·invalid output·22/24시간 복구 삭제 계약 검사 통과 |
| 2026-07-31 | Backend Agent | transition: in_progress -> verification_ready | AI job 상태·idempotency·provider 단일 호출·결과 22/24시간 복구 삭제 계약과 자체 검증 완료 |
| 2026-07-31 | Backend Agent | unlock | task unlock |
| 2026-07-31 | Backend QA Agent | transition: verification_ready -> verification_in_progress | AI recipe job 상태·동시 idempotency·worker crash/timeout·결과 복구·24시간 삭제 계약 독립 검증 |
| 2026-07-31 | Backend QA Agent | lock | task lock |
| 2026-07-31 | Backend QA Agent | transition: verification_in_progress -> rework_requested | QA-HIGH-023-001 ACK 필수 result_version 응답 누락, QA-HIGH-023-002 provider 시작 후 timeout의 AI_TIMEOUT/OUTCOME_UNKNOWN 분류 상충 |
| 2026-07-31 | Backend QA Agent | unlock | task unlock |
| 2026-07-31 | Product Owner | approve rework | QA-HIGH-023-001~002 및 QA-MEDIUM-023-001 수정 범위 재작업 승인 |
| 2026-07-31 | Development Lead Agent | transition: rework_requested -> approved | Backend Agent에 재작업 인계, 수정 후 독립 재검증 진행 |
| 2026-07-31 | Backend Agent | lock | task lock |
| 2026-07-31 | Backend Agent | transition: approved -> in_progress | QA-HIGH-023-001~002·QA-MEDIUM-023-001 승인 재작업 시작 |
| 2026-07-31 | Backend Agent | self-verification | result version ACK 4개·timeout decision 6개·quota HTTP 경계 검사 통과 |
| 2026-07-31 | Backend Agent | transition: in_progress -> verification_ready | result_version ACK·timeout decision·quota HTTP 경계 재작업과 자체 검증 완료 |
| 2026-07-31 | Backend Agent | unlock | task unlock |
| 2026-07-31 | Backend QA Agent | transition: verification_ready -> verification_in_progress | QA-HIGH-023-001~002 및 QA-MEDIUM-023-001 재작업 독립 재검증 |
| 2026-07-31 | Backend QA Agent | lock | task lock |
| 2026-07-31 | Backend QA Agent | transition: verification_in_progress -> verification_passed | QA-HIGH-023-001~002 및 QA-MEDIUM-023-001 해소, 계약 회귀 없음, PASS_WITH_RISK |
| 2026-07-31 | Development Lead Agent | transition: verification_passed -> completion_review | 재검증 PASS_WITH_RISK, 허용 경로·계약 검사·후속 T-025 인계 조건을 확인하고 develop 통합 대기로 전환 |

## Development Lead 완료 검토

- Backend QA 독립 재검증 `PASS_WITH_RISK`와 세 결함 해소 결과를 확인했다.
- 계약 validator, JSON·ACK·timeout·quota 회귀 검증과 Task 허용 경로를 확인했다.
- 잔여 위험은 실제 runtime/provider 연동 staging 검증으로 한정되며 계약 산출물 완료를 막지 않는다.
- `develop` 통합 후 `done` 확정이 필요하다. 다음 계약 테스트 작업 `T-20260729-025`는 T-024까지 완료된 뒤 공용 fixture·계약 테스트 기준을 인계한다.
| 2026-07-31 | Backend QA Agent | unlock | task unlock |
