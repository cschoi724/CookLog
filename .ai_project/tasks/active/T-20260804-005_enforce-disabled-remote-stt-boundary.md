---
schema: aiops.task.v1
id: T-20260804-005
title: 원격 STT 비활성 확장 경계와 무승인 활성화 차단 구현
status: verification_passed
type: feature
priority: P0
priority_reason: Foundation 추가가 첫 출시의 기기 내 STT 정책을 우회하지 못하게 해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
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
- apps/backend/src/config/runtime-config.ts
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
- 2026-08-05: Backend QA Agent가 구현 커밋과 clean 전용 worktree를 확인하고
  `verification_ready -> verification_in_progress`로 전환해 독립 검증했다.
- 2026-08-05: 공식 65/65와 공용 validator는 통과했으나 실제 production startup이
  원격 STT 활성화·provider·endpoint·credential·egress·fallback·unknown 설정 9종을
  수용하는 `QA-HIGH-005-001`을 재현했다. 최종 `FAIL`,
  `verification_in_progress -> rework_requested`로 Development Lead Agent에 인계했다.
- 2026-08-05: Development Lead Agent가 실제 startup 진입점 연결과 startup 반례 검증을
  하나의 제한된 재작업으로 범위화했고 Product Owner가 승인했다. Task를
  `rework_requested -> scoped -> approved`로 전환해 Backend Agent에 재인계한다.
- 2026-08-05: Backend Agent가 승인된 재작업 lock을 획득하고
  `approved -> in_progress`로 전환했다.
- 2026-08-05: `loadRuntimeConfig()`에 remote STT validator를 연결하고 QA의 설정 9종과
  기존 enabled flag를 local·test·production 진입점에 입력하는 30개 직접 반례를
  추가했다. T-005 11/11, Backend 전체 66/66과 공용 validator를 통과해 lock을 해제하고
  `in_progress -> verification_ready`로 Backend QA 재검증에 인계했다.
- 2026-08-05: Backend QA Agent가 최초 9종과 enabled flag의 환경별 30개 반례, 실제
  server process 3종, 전체 66/66과 공용 계약을 독립 재검증했다. `QA-HIGH-005-001`
  해소와 신규 HIGH·MEDIUM 결함 부재를 확인해 `PASS_WITH_RISK`,
  `verification_ready -> verification_in_progress -> verification_passed`로 Development
  Lead Agent에 완료 검토를 인계했다.

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

## 승인된 재작업 범위

- `apps/backend/src/config/runtime-config.ts`의 실제 `loadRuntimeConfig()` 진입점에서
  `validateRemoteSTTEnvironment()`를 반드시 실행해 listener 생성 전에 fail closed한다.
- QA가 재현한 설정 9종과 기존 `COOKLOG_REMOTE_STT_ENABLED=true`를 local·test·production
  실제 시작 설정 경계에 입력해 모두 거부되는 통합 반례를 `apps/backend/tests/stt/`에
  추가한다.
- 기존 T-005 10/10, Backend 전체 65/65와 공용 계약 validator를 회귀 검증한다.
- `build-app.ts`, `server.ts`와 T-007의 전체 composition은 수정하지 않는다. 실제 endpoint,
  provider SDK, secret, audio storage·queue·egress와 원격 STT 활성화는 계속 금지한다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Lead Role이야.
Task T-20260804-005의 독립 재검증이 완료됐어.

- 현재 상태: `verification_passed`
- 구현 기준 ref: `task/T-20260804-005-enforce-disabled-remote-stt-boundary`
- 현재 기준 SHA: 재작업 commit 후 Draft PR #84에 기록
- 다음에 해야 할 일: QA `PASS_WITH_RISK`와 성공 기준·허용 경로를 검토하고 완료 여부를
  결정해줘.
- 기준 문서: `apps/backend/docs/REMOTE_STT_ADAPTER.md`, `apps/backend/contracts/stt/`,
  `apps/backend/contracts/fixtures/remote-stt-disabled.json`
- 참고 산출물: `.ai_project/reports/T-20260804-005_enforce-disabled-remote-stt-boundary-report.md`
- 검증 결과: `QA-HIGH-005-001` 해소, startup 30/30·실제 process 3/3·T-005 11/11·
  전체 66/66·공용 계약 validator 통과.
- 남은 리스크: 비활성 HTTP 경계의 공유 app composition, Node 24/container 실검증은
  T-007 범위다. 실제 remote STT 승인·provider·upload·삭제 SLA는 별도 승인 범위다.
- 차단/결정 필요: endpoint·provider SDK·secret·audio storage·iOS remote 선택 구현 금지
- 참고: `.ai_project/qa/T-20260804-005_enforce-disabled-remote-stt-boundary-qa.md`
- 완료 시: Product Owner 승인 전 `done`이나 병합으로 전환하지 말고 T-007 잔여 위험
  이관을 명시해줘.
