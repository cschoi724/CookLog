---
schema: aiops.task.v1
id: T-20260729-024
title: Backend 보안·개인정보·관측성·비용 guardrail 정의
status: verification_ready
type: docs
priority: P0
priority_reason: 사용자 콘텐츠와 provider 비용을 로그·장애·abuse 경계에서 보호해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: docs
target_agent: Backend QA Agent
target_role: Verification Role
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
- apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
- ".ai_project/tasks/backlog/T-20260729-024_define-backend-security-privacy-observability-guardrails.md"
- ".ai_project/tasks/active/T-20260729-024_define-backend-security-privacy-observability-guardrails.md"
- ".ai_project/reports/T-20260729-024_define-backend-security-privacy-observability-guardrails-report.md"
- ".ai_project/qa/T-20260729-024_define-backend-security-privacy-observability-guardrails-qa.md"
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
report_to: ".ai_project/reports/T-20260729-024_define-backend-security-privacy-observability-guardrails-report.md"
qa_to: ".ai_project/qa/T-20260729-024_define-backend-security-privacy-observability-guardrails-qa.md"
---

# Backend 보안·개인정보·관측성·비용 guardrail 정의

## 범위

- secret 관리와 provider key 비노출
- 음성·STT·레시피 본문 redaction과 운영 메타데이터 최대 30일
- provider 보관·학습 설정과 처리 지역 확인 gate
- 장애·quota·비용 soft alert와 hard cutoff
- 감사 가능한 비콘텐츠 metric과 incident 대응

## 성공·검증 기준

- 콘텐츠가 운영·분석·오류 로그에 남지 않는다.
- Backend QA Agent가 개인정보, secret, 비용 폭주와 장애 경계를 독립 검증한다.

## 승인 및 병렬 실행 기준

- 2026-07-31 Product Owner가 실행을 승인했다.
- 선행 `T-20260729-020`, `T-20260729-021`은 모두 `done`이다.
- `T-20260729-022`, `T-20260729-023`과 핵심 산출물 경로가 분리돼 병렬 실행할 수
  있다.
- 각 Task는 최신 `origin/develop` 기반의 독립 worktree·브랜치·Backend Agent
  세션을 사용한다. Backend Agent 세션이 하나뿐이면 병렬이 아니라 순차 실행한다.
- 공용 Development·Quality 보드는 공유 경로이므로 다른 병렬 Task의 상태를
  덮어쓰지 않는다. QA 인계와 PR 전 최신 `develop`에 재정렬해 형제 Task 상태를
  보존한다.
- T-020의 월 hard cutoff와 T-021의 project quota·공개 오류 경계를 하향 강화할 수
  있지만 상향하거나 우회하지 않는다.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-31 | Product Owner | transition: proposed -> approved | T-020·T-021 완료 후 보안·개인정보·관측성·비용 guardrail 실행 승인 |
| 2026-07-31 | Development Lead Agent | approve parallel execution | T-022·T-023과 독립 산출물 병렬 실행, 공용 보드 직렬 통합 기준 확정 |
| 2026-07-31 | Backend Agent | lock | task lock |
| 2026-07-31 | Backend Agent | transition: approved -> in_progress | 승인된 보안·개인정보·관측성·비용 guardrail 계약 작성 시작 |
| 2026-07-31 | Backend Agent | transition: in_progress -> verification_ready | 보안·개인정보·관측성·비용 guardrail 계약 작성 및 자체 검증 완료, Backend QA 독립 검증 인계 |
