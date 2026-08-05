---
schema: aiops.task.v1
id: T-20260804-005
title: 원격 STT 비활성 확장 경계와 무승인 활성화 차단 구현
status: verification_ready
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
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-04
updated_at: 2026-08-05
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

## 승인 및 실행 경계

- 2026-08-05: Backend Agent가 최신 `origin/develop` `97f434d` 기반 전용 worktree에서
  lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-08-05: disabled release config·resolver·activation gate와 route 미등록 HTTP
  선차단 경계를 구현했다. T-005 10/10, Backend 전체 65/65와 공용 validator를 통과해
  `in_progress -> verification_ready`로 전환하고 Backend QA Agent에 인계했다.

- 2026-08-05: 공용 `develop` `ee6a973`에서 선행 `T-20260804-002`, `003`의 `done`과
  T-004 완료 기록을 확인했다.
- 2026-08-05: Product Owner가 원격 STT 비활성 확장 경계와 무승인 활성화 차단 구현을
  별도 승인했다. Development Lead Agent가 `proposed -> approved`로 전환하고 Backend
  Agent에 인계한다.
- 구현은 disabled resolver, activation gate, production config의 provider·audio egress
  설정 거부와 route·body read·queue·egress 0회 테스트로 제한한다.
- 첫 공개 출시 profile은 `mode=disabled`, upload route 미등록, provider·credential·egress
  목적지 미설정, 자동 remote fallback 금지를 유지한다.
- 무승인 config mutation은 startup 또는 deployment validation에서 fail closed하고,
  공개 경계는 body read 전에 `SERVICE_DISABLED`로 종료한다.
- STT endpoint·upload parser·Mock/실제 provider·provider SDK·secret·audio storage·queue,
  실제 활성 배포 설정과 iOS 원격 선택 흐름은 구현하지 않는다.
- `apps/backend/contracts/stt/`와 `remote-stt-disabled.json`은 검증 기준이며 계약 자체를
  완화하거나 활성화 근거로 해석하지 않는다.
- 공유 app composition과 전체 runtime wiring은 T-007 소유로 유지하고 T-006~007을
  선행 구현하지 않는다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Backend QA Agent / Verification Role이야.
Task T-20260804-005의 구현 자체 검증이 완료됐어.

- 현재 상태: `verification_ready`
- 구현 기준 ref: `task/T-20260804-005-enforce-disabled-remote-stt-boundary`
- 구현 기준 SHA: commit 후 report와 Draft PR에 기록
- 다음에 해야 할 일: 구현 Agent와 분리된 clean worktree에서 disabled config·resolver·
  HTTP 선차단과 무승인 설정 fail-closed를 독립 검증해줘.
- 기준 문서: `apps/backend/docs/REMOTE_STT_ADAPTER.md`, `apps/backend/contracts/stt/`,
  `apps/backend/contracts/fixtures/remote-stt-disabled.json`
- 참고 산출물: `.ai_project/reports/T-20260804-005_enforce-disabled-remote-stt-boundary-report.md`
- 필수 검증: release profile disabled, route·body read·temporary object·queue·provider·egress
  0회, 무승인 config startup/deployment fail closed, 자동 fallback 0회, 기존 runtime·공용
  STT fixture 무회귀
- 남은 리스크: 비활성 HTTP 경계의 공유 app composition, Node 24/container 실검증은
  T-007 범위다. 실제 remote STT 승인·provider·upload·삭제 SLA는 별도 승인 범위다.
- 차단/결정 필요: endpoint·provider SDK·secret·audio storage·iOS remote 선택 구현 금지
- 완료 시: QA report에 판정과 직접 반례를 기록하고 Development Lead Agent에 인계해줘.
