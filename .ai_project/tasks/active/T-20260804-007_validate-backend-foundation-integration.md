---
schema: aiops.task.v1
id: T-20260804-007
title: Backend foundation 통합 계약·보안 검증과 로컬 실행 handoff
status: done
type: test
priority: P0
priority_reason: 후속 provider·iOS 연동 전에 전체 runtime과 계약 원본의 동등성을 고정해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities:
- backend_implementation
- api_contract
depends_on:
- T-20260804-002
- T-20260804-003
- T-20260804-004
- T-20260804-005
- T-20260804-006
blocks:
- T-20260729-003
- T-20260728-009
parallel_group:
allowed_paths:
- apps/backend/
- ".github/workflows/backend-*.yml"
- ".ai_project/tasks/backlog/T-20260804-007_validate-backend-foundation-integration.md"
- ".ai_project/tasks/active/T-20260804-007_validate-backend-foundation-integration.md"
- ".ai_project/reports/T-20260804-007_validate-backend-foundation-integration-report.md"
- ".ai_project/qa/T-20260804-007_validate-backend-foundation-integration-qa.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
source_of_truth:
- apps/backend/AGENTS.md
- apps/backend/docs/
- apps/backend/contracts/
created_by: Development Lead Agent
approved_by: Product Owner
created_at: 2026-08-04
updated_at: '2026-08-06'
report_to: ".ai_project/reports/T-20260804-007_validate-backend-foundation-integration-report.md"
qa_to: ".ai_project/qa/T-20260804-007_validate-backend-foundation-integration-qa.md"
locked_by:
locked_at:
lock_session:
status_ref: origin/develop
status_ref_sha: 6a1678c808fa43f9d62289e3a6bb00b2915b23ea
base_ref: origin/develop
base_sha: 6a1678c808fa43f9d62289e3a6bb00b2915b23ea
blocker:
next_decision:
---

# Backend foundation 통합 검증

## 범위

- 새 clone install·build·test·local run 재현
- shared fixture 기반 HTTP integration test
- auth·idempotency·timeout·cleanup·비용·redaction 회귀
- 원격 STT route 0개와 production 활성화 불가 확인
- Backend Agent·Backend QA handoff와 CI 필요성 결정

## 성공 기준

- 전체 기존·runtime 계약 테스트가 단일 명령으로 통과한다.
- fixture·runtime response·문서 계약이 동일하다.
- 실제 provider·cloud 없이 재현 가능하다.
- Backend QA 최종 독립 검증을 통과한다.

## 승인 및 실행 경계

- 2026-08-06: 공용 `develop@3a0a1f4`에서 선행 `T-20260804-002~006`의 `done`과
  PR #87 squash merge를 확인했다.
- 2026-08-06: Product Owner가 Backend Foundation 최종 통합·보안 검증과 로컬 실행
  handoff를 별도 승인했다. Development Lead Agent가 `proposed -> approved`로 전환하고
  Backend Agent에 인계한다.
- 2026-08-06: Backend QA가 terminal telemetry sink 장애 뒤 미감사 성공 결과가
  `succeeded`·`available`로 공개되는 `QA-HIGH-007-001`을 확인해 Task를
  `rework_requested`로 반환했다.
- 2026-08-06: Product Owner가 terminal 감사와 성공 결과 공개의 fail-closed 재작업을
  승인했다. Provider at-most-once와 기존 정상 계약은 보존하고 장애 회귀를 추가한다.
- 2026-08-06: Backend QA 독립 재검증에서 `QA-HIGH-007-001` 해소, 원본 반례와
  terminal sink·reservation·shape 장애 복구, Provider 1회, 전체 100/100과 PR CI 통과를
  확인해 `verification_passed`로 인계했다.
- 2026-08-06: Development Lead가 완료 리뷰를 `PASS_WITH_RISK`로 수용했고 Product
  Owner가 완료 확정과 PR #91 squash merge를 승인했다. 실제 Provider·Cloud는 별도 승인
  범위로 유지하며 Task를 `done`으로 확정한다.
- T-002 runtime·T-003 HTTP/auth/idempotency·T-004 Mock AI job·T-005 원격 STT 비활성
  경계·T-006 logging/비용/cleanup을 하나의 local/mock app·worker composition으로
  연결한다.
- 새 clone에서 Node.js `24.18.0`·npm 11·lockfile 기준 `npm ci`, typecheck, build,
  전체 test와 local run을 단일 문서 절차로 재현한다. non-root container에서 Cloud Run
  `PORT`·`0.0.0.0`·SIGTERM/두 번째 signal·shutdown deadline을 실제 실행 검증한다.
- 공용 fixture로 health와 Mock AI create·status·ACK의 실제 HTTP response 동등성,
  정상·공개 오류·timeout·idempotency·cleanup·비용·redaction 회귀를 검증한다.
- 원격 STT route·audio body read·upload·queue·provider·egress는 0건이어야 하며 모든
  activation mutation과 production forbidden secret/config는 listener·side effect 전에
  fail closed해야 한다.
- 콘텐츠·secret telemetry 0건, 월 KRW 50,000 hard cutoff, AI ACK 즉시·+22h/+24h와
  raw metadata +28d/+30d 삭제·접근 경계를 통합 composition에서도 유지한다.
- 저장소 내부 Backend CI workflow는 반복 검증에 필요하다는 근거가 있을 때만
  `.github/workflows/backend-*.yml` 안에서 추가할 수 있다. GitHub ruleset, cloud console,
  배포·billing·외부 resource 설정은 변경하지 않는다.
- 실제 AI provider, Cloud Run 배포, Firestore·Cloud Tasks·Billing·KMS·Secret Manager,
  운영 credential과 원격 STT endpoint·업로드는 구현하지 않는다. iOS·Android와 수익화
  범위도 수정하지 않는다.
- 최신 `origin/develop` 기반 전용 worktree에서 lock을 획득한 뒤 `in_progress`로
  전환한다. 구현·자체 검증 후 report와 재현 명령을 남기고 Backend QA Agent에 독립
  검증을 인계한다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

Task T-20260804-007은 Backend Foundation local/mock 최종 통합과 독립 재검증을 완료했다.

- 최종 상태: `done`
- PR: `#91`, Product Owner squash merge 승인
- 최종 검증: Backend 100/100, 계약 validator 5종, Foundation 경계 감사,
  Node 24.18.0 non-root container PASS
- 결함 해소: `QA-HIGH-007-001` terminal telemetry fail-closed와 Provider at-most-once
- 유지 경계: 실제 Provider·Cloud resource·credential·배포·원격 STT는 미구현이며
  별도 Task와 Product Owner 승인 없이는 활성화하지 않는다.
- 후속 작업자는 최신 `develop`의 `apps/backend/docs/`와 계약 fixture를 기준으로 한다.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-08-06 | Backend Agent | lock | task lock |
| 2026-08-06 | Backend Agent | transition: approved -> in_progress | T-002~006 최종 통합·Node 24 container·단일 회귀 구현 착수 |
| 2026-08-06 | Backend Agent | transition: in_progress -> verification_ready | local/mock 통합·새 clone 96/96·계약 5종·Node 24.18 non-root container PR CI 통과 |
| 2026-08-06 | Backend Agent | unlock | task unlock |
| 2026-08-06 | Backend QA Agent | transition: verification_ready -> verification_in_progress | local/mock composition·전체 계약·보안·비용·cleanup·Node 24 container 증빙 독립 검증 시작 |
| 2026-08-06 | Backend QA Agent | transition: verification_in_progress -> rework_requested | QA-HIGH-007-001: worker 종료 telemetry sink 장애를 무시해 미감사 성공 결과가 available로 공개됨 |
| 2026-08-06 | Product Owner | rework approved | terminal telemetry와 성공 결과 공개 fail-closed, Provider at-most-once 회귀 범위 승인 |
| 2026-08-06 | Backend Agent | transition: rework_requested -> in_progress | QA-HIGH-007-001 terminal telemetry fail-closed 재작업 착수 |
| 2026-08-06 | Backend Agent | lock | task lock |
| 2026-08-06 | Backend Agent | transition: in_progress -> verification_ready | QA-HIGH-007-001 fail-closed·원본 반례·100/100·Node 24 container CI 통과 |
| 2026-08-06 | Backend Agent | unlock | task unlock |
| 2026-08-06 | Backend QA Agent | transition: verification_ready -> verification_in_progress | QA-HIGH-007-001 fail-closed 재작업 및 전체 통합 계약 독립 재검증 시작 |
| 2026-08-06 | Backend QA Agent | transition: verification_in_progress -> verification_passed | QA-HIGH-007-001 해소, 원본 sink·reservation·shape 장애 비공개 staging·복구, provider 1회, 100/100 및 PR CI PASS |
| 2026-08-06 | Development Lead Agent | transition: verification_passed -> completion_review | 독립 재검증과 전체 회귀를 PASS_WITH_RISK로 수용 |
| 2026-08-06 | Product Owner | transition: completion_review -> done | 완료 확정 및 PR #91 squash merge 승인 |
