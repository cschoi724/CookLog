---
schema: aiops.task.v1
id: T-20260804-005
title: 원격 STT 비활성 확장 경계와 무승인 활성화 차단 구현
status: proposed
type: feature
priority: P0
priority_reason: Foundation 추가가 첫 출시의 기기 내 STT 정책을 우회하지 못하게 해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Backend Agent
target_role: Execution Role
required_capabilities:
- backend_implementation
- security_review
depends_on:
- T-20260804-002
- T-20260804-003
blocks:
- T-20260804-006
- T-20260804-007
parallel_group: backend-foundation-domain-edges
allowed_paths:
- apps/backend/src/stt/
- apps/backend/src/config/remote-stt*
- apps/backend/tests/stt/
- apps/backend/docs/STATUS.md
- apps/backend/docs/CHANGELOG.md
- .ai_project/tasks/backlog/T-20260804-005_enforce-disabled-remote-stt-boundary.md
- .ai_project/tasks/active/T-20260804-005_enforce-disabled-remote-stt-boundary.md
- .ai_project/reports/T-20260804-005_enforce-disabled-remote-stt-boundary-report.md
- .ai_project/qa/T-20260804-005_enforce-disabled-remote-stt-boundary-qa.md
- .ai_project/teams/development/task_board.md
- .ai_project/teams/quality/task_board.md
source_of_truth:
- apps/backend/docs/REMOTE_STT_ADAPTER.md
- apps/backend/contracts/stt/
- apps/backend/contracts/fixtures/remote-stt-disabled.json
created_by: Development Lead Agent
approved_by:
created_at: 2026-08-04
updated_at: 2026-08-04
report_to: .ai_project/reports/T-20260804-005_enforce-disabled-remote-stt-boundary-report.md
qa_to: .ai_project/qa/T-20260804-005_enforce-disabled-remote-stt-boundary-qa.md
---

# 원격 STT 비활성 경계 구현

## 범위

- disabled resolver와 activation gate
- production config에서 provider·audio egress 설정 거부
- route·body read·queue·egress 0회 테스트

## 제외

- STT endpoint, upload parser, Mock·실제 STT provider, audio storage

## 성공 기준

- 첫 출시 config로 원격 STT를 활성화할 수 없다.
- endpoint 목록과 integration test에서 audio 수신 경로가 0개다.
- 무승인 설정 mutation이 startup 또는 deployment validation에서 실패한다.
