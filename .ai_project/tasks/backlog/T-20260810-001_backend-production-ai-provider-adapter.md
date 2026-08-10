---
schema: aiops.task.v1
id: T-20260810-001
title: Backend 실제 AI provider adapter·prompt·schema validation 구현
status: proposed
type: feature
priority: P0
priority_reason: 실제 AI Review 생성 경로의 첫 실행 패키지이며 provider 선택과 데이터 처리 계약을 코드 경계로 고정한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities: [technical_planning, dependency_management]
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
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-10
updated_at: 2026-08-10
report_to: .ai_project/reports/T-20260810-001_backend-production-ai-provider-adapter-report.md
qa_to: .ai_project/qa/T-20260810-001_backend-production-ai-provider-adapter-qa.md
status_ref: origin/develop
status_ref_sha: 1657056
---

# Backend 실제 AI provider adapter·prompt·schema validation 구현

## Scope

- Goal: 승인된 provider를 기존 `RecipeProvider` 경계에 연결하고 versioned Review schema만 반환한다.
- In scope: provider SDK/HTTP adapter, model·prompt·schema version, structured output 검증, timeout·rate-limit·invalid output 오류 매핑, sandbox 계약 테스트.
- Out of scope: provider 자동 fallback, cloud 배포, production traffic, 원격 STT, iOS 변경.
- Acceptance criteria: provider sandbox 정상·invalid·timeout·429가 공용 계약으로 매핑되고 콘텐츠·secret이 로그에 남지 않으며 provider-at-most-once를 유지한다.

## Decision Gate

- provider/model 최신 공식 정보와 저장·처리 지역을 재검증한다.
- Product Owner가 provider, MAM/ZDR 또는 동등 보관 경계, sandbox credential 사용을 승인해야 한다.
- 결정 전에는 `approved`로 전환하지 않는다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-10 | Development Lead Agent |  | proposed | 실제 AI provider 실행 패키지 생성 |
