---
schema: aiops.task.v1
id: T-20260810-004
title: Backend production 비용 hard cutoff·redaction·observability 구현
status: approved
type: feature
priority: P0
priority_reason: 실제 provider·storage·인증을 비용과 개인정보 fail-closed 경계 안에서 운영해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Backend Agent
target_role: Execution Role
required_capabilities: [backend_architecture, implementation, developer_verification]
ownership:
  paths: [apps/backend/src/cost/, apps/backend/src/observability/, apps/backend/tests/security/, apps/backend/contracts/security/]
  domains: [cost-control, privacy-observability]
  documents: [apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260810-001, T-20260810-002, T-20260810-003]
blocks: [T-20260810-006, T-20260729-003]
parallel_group:
allowed_paths:
  - apps/backend/src/cost/
  - apps/backend/src/observability/
  - apps/backend/tests/security/
  - apps/backend/contracts/security/
  - apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
  - apps/backend/docs/STATUS.md
  - apps/backend/docs/CHANGELOG.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - .ai_project/tasks/active/T-20260729-003_build-production-stt-ai-backend-gateway.md
  - .ai_project/tasks/active/T-20260729-024_define-backend-security-privacy-observability-guardrails.md
  - apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-10
updated_at: 2026-08-10
report_to: .ai_project/reports/T-20260810-004_backend-production-cost-observability-report.md
qa_to: .ai_project/qa/T-20260810-004_backend-production-cost-observability-qa.md
status_ref: origin/develop
status_ref_sha: 0416401ecc6ed68179d630ea8bd3fc6017ed4adf
---

# Backend production 비용 hard cutoff·redaction·observability 구현

## Scope

- Goal: 실제 provider 호출·storage·인증 사용량을 승인된 예산과 비콘텐츠 관측성 경계에 연결한다.
- In scope: provider 호출 전 원자적 비용 reservation, 월 호출·입력·출력 token hard cutoff, retry 비용, service disable, allowlist telemetry, alert·incident cleanup 테스트.
- Out of scope: 결제 상품·구독 quota, 콘텐츠 logging, production traffic.
- Acceptance criteria: cutoff·ledger·telemetry 장애가 provider side effect와 결과 공개 전에 fail closed하고 원문·prompt·결과·secret이 sink에 기록되지 않는다.

## Decision Gate

- 2026-08-10 Product Owner 승인: 월 50,000원, 월 5,500회 호출, 입력 20M token, 출력 8M token 중 먼저 도달한 한도에서 hard cutoff한다.
- provider 가격·환율 변동에도 fail closed하도록 원화 예산과 사용량 상한을 독립적으로 적용한다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-10 | Development Lead Agent |  | proposed | production 비용·관측성 패키지 생성 |
| 2026-08-10 | Development Lead Agent | proposed | scoped | 최신 가격과 월 예산·호출·token hard cutoff 범위 조율 완료 |
| 2026-08-10 | Product Owner | scoped | approved | 추천 결정안과 T-20260810-001~005 실행 승인; T-001~003 완료 후 실행 |

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Backend Agent / Execution Role이야. Task T-20260810-004는 승인됐지만 선행 Task 완료 후 실행하는 Task야.

- 현재 상태: approved
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 0416401ecc6ed68179d630ea8bd3fc6017ed4adf
- 다음에 해야 할 일: 먼저 canonical에서 T-20260810-001~003이 모두 done인지 확인하고, 해소된 경우에만 비용 reservation·hard cutoff·redaction·observability를 구현해줘.
- 기준 문서: 상위 Task와 보안·개인정보·관측성 guardrail
- 허용 경로: front matter의 `allowed_paths`
- 참고 산출물: T-001~003의 report와 QA 결과
- 변경/검토 대상: `apps/backend/src/cost/`, `observability/`, 대응 계약·테스트
- 남은 리스크: 가격·환율 변경과 ledger/telemetry 장애 시 과금 side effect 위험이 있다.
- 차단/결정 필요: T-001~003 dependency가 canonical에서 done이 아니면 착수하지 않는다.
- 완료 시: status를 verification_ready로 바꾸고 target_agent를 Backend QA Agent, target_role을 Verification Role로 넘겨줘.
