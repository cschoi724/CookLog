---
schema: aiops.task.v1
id: T-20260729-022
title: 기본 비활성 원격 STT adapter 계약 정의
status: approved
type: docs
priority: P1
priority_reason: 첫 출시 기본 경로를 바꾸지 않고 향후 원격 STT 교체 경계를 보존해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: docs
target_agent: Backend Agent
target_role: Execution Role
required_capabilities:
  - backend_architecture
  - api_contract
depends_on:
  - T-20260729-021
  - T-20260729-026
blocks:
  - T-20260728-005
  - T-20260729-025
parallel_group: backend-contract-foundation
allowed_paths:
  - apps/backend/contracts/stt/
  - apps/backend/docs/REMOTE_STT_ADAPTER.md
  - .ai_project/tasks/backlog/T-20260729-022_define-disabled-remote-stt-adapter-contract.md
  - .ai_project/tasks/active/T-20260729-022_define-disabled-remote-stt-adapter-contract.md
  - .ai_project/reports/T-20260729-022_define-disabled-remote-stt-adapter-contract-report.md
  - .ai_project/qa/T-20260729-022_define-disabled-remote-stt-adapter-contract-qa.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
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
updated_at: 2026-07-31
report_to: .ai_project/reports/T-20260729-022_define-disabled-remote-stt-adapter-contract-report.md
qa_to: .ai_project/qa/T-20260729-022_define-disabled-remote-stt-adapter-contract-qa.md
---

# 기본 비활성 원격 STT adapter 계약 정의

## 범위

- 향후 활성화 시 사용할 업로드·변환 요청·응답·오류 계약
- 활성화된 경우에만 적용하는 음성 즉시 삭제와 최대 1시간 TTL
- 기본 비활성 설정, 무승인 업로드 금지와 자동 fallback 금지
- Apple 기기 내 STT와 교체 가능한 iOS service 경계

## 제외·검증 기준

- endpoint 구현, provider SDK, secret과 배포는 제외한다.
- Backend QA Agent가 기본 상태에서 원격 호출이 불가능한 계약인지 검증한다.

## 승인 및 병렬 실행 기준

- 2026-07-31 Product Owner가 실행을 승인했다.
- 선행 `T-20260729-021`, `T-20260729-026`은 모두 `done`이다.
- `T-20260729-023`, `T-20260729-024`와 핵심 산출물 경로가 분리돼 병렬 실행할 수
  있다.
- 각 Task는 최신 `origin/develop` 기반의 독립 worktree·브랜치·Backend Agent
  세션을 사용한다. Backend Agent 세션이 하나뿐이면 병렬이 아니라 순차 실행한다.
- 공용 Development·Quality 보드는 공유 경로이므로 다른 병렬 Task의 상태를
  덮어쓰지 않는다. QA 인계와 PR 전 최신 `develop`에 재정렬해 형제 Task 상태를
  보존한다.
- 첫 출시의 Apple 기기 내 STT 기본값, 원격 STT 기본 비활성, 무승인 업로드와 자동
  fallback 금지를 유지한다.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-31 | Product Owner | transition: proposed -> approved | T-021 완료 후 기본 비활성 원격 STT adapter 계약 실행 승인 |
| 2026-07-31 | Development Lead Agent | approve parallel execution | T-023·T-024와 독립 산출물 병렬 실행, 공용 보드 직렬 통합 기준 확정 |
