---
schema: aiops.task.v1
id: T-20260804-002
title: Backend runtime scaffold·환경 설정·health 구현
status: verification_ready
type: feature
priority: P0
priority_reason: 모든 foundation 패키지가 공유할 실행·빌드·테스트 기준을 먼저 고정해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Backend QA Agent
target_role: Verification Role
required_capabilities:
- backend_architecture
- backend_implementation
depends_on:
- T-20260728-005
blocks:
- T-20260804-003
- T-20260804-004
- T-20260804-005
- T-20260804-006
- T-20260804-007
parallel_group:
allowed_paths:
- apps/backend/agents.md
- apps/backend/package.json
- apps/backend/package-lock.json
- apps/backend/pnpm-lock.yaml
- apps/backend/yarn.lock
- apps/backend/tsconfig.json
- apps/backend/Dockerfile
- apps/backend/.dockerignore
- apps/backend/.env.example
- apps/backend/README.md
- apps/backend/src/app/
- apps/backend/src/config/
- apps/backend/src/health/
- apps/backend/tests/health/
- apps/backend/docs/RUNTIME_FOUNDATION.md
- apps/backend/docs/STATUS.md
- apps/backend/docs/DEVELOPMENT_PLAN.md
- apps/backend/docs/DEVELOPMENT_SPEC.md
- apps/backend/docs/DECISIONS.md
- apps/backend/docs/CHANGELOG.md
- .ai_project/tasks/active/T-20260804-002_build-backend-runtime-scaffold.md
- .ai_project/reports/T-20260804-002_build-backend-runtime-scaffold-report.md
- .ai_project/qa/T-20260804-002_build-backend-runtime-scaffold-qa.md
- .ai_project/teams/development/task_board.md
- .ai_project/teams/quality/task_board.md
source_of_truth:
- apps/backend/agents.md
- apps/backend/docs/ARCHITECTURE_DECISION.md
- apps/backend/docs/DEVELOPMENT_SPEC.md
- apps/backend/docs/API_CONTRACT.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-04
updated_at: 2026-08-04
report_to: .ai_project/reports/T-20260804-002_build-backend-runtime-scaffold-report.md
qa_to: .ai_project/qa/T-20260804-002_build-backend-runtime-scaffold-qa.md
---

# Backend runtime scaffold·환경 설정·health 구현

## 범위

- Cloud Run 호환 runtime·framework·package manager 비교와 ADR
- 고정 버전 build·test·local run scaffold
- typed 환경 설정과 production fail-closed
- health endpoint와 graceful startup/shutdown
- container build 경계와 새 clone 실행 문서

## 성공 기준

- 새 clone에서 단일 문서 명령으로 install·build·test·local run이 된다.
- health endpoint가 콘텐츠·secret 없이 고정 응답한다.
- 누락되거나 금지된 production 설정은 startup 전에 실패한다.
- 실제 cloud resource·provider 호출·원격 STT endpoint가 없다.
- Backend QA가 재현성·config·secret 비노출을 독립 검증한다.

## 승인

2026-08-04 Product Owner가 상위 T-006 진행을 승인했고 Development Lead가 첫 실행
패키지로 인계했다. Backend Agent는 전용 worktree와 branch에서만 착수한다.

## 상태 전이 기록

- 2026-08-04: Backend Agent가 전용 worktree lock을 획득하고
  `approved -> in_progress`로 전환했다.
- 2026-08-04: runtime·config·health·container 경계 구현과 테스트 10개, 기존 계약
  validator 자체 검증을 완료해 `in_progress -> verification_ready`로 전환했다.
