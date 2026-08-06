---
schema: aiops.task.v1
id: T-20260804-007
title: Backend foundation 통합 계약·보안 검증과 로컬 실행 handoff
status: approved
type: test
priority: P0
priority_reason: 후속 provider·iOS 연동 전에 전체 runtime과 계약 원본의 동등성을 고정해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Backend Agent
target_role: Execution Role
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
- .github/workflows/backend-*.yml
- .ai_project/tasks/backlog/T-20260804-007_validate-backend-foundation-integration.md
- .ai_project/tasks/active/T-20260804-007_validate-backend-foundation-integration.md
- .ai_project/reports/T-20260804-007_validate-backend-foundation-integration-report.md
- .ai_project/qa/T-20260804-007_validate-backend-foundation-integration-qa.md
- .ai_project/teams/development/task_board.md
- .ai_project/teams/quality/task_board.md
source_of_truth:
- apps/backend/AGENTS.md
- apps/backend/docs/
- apps/backend/contracts/
created_by: Development Lead Agent
approved_by: Product Owner
created_at: 2026-08-04
updated_at: 2026-08-06
report_to: .ai_project/reports/T-20260804-007_validate-backend-foundation-integration-report.md
qa_to: .ai_project/qa/T-20260804-007_validate-backend-foundation-integration-qa.md
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

너는 Backend Agent / Execution Role이야.
Task T-20260804-007은 Product Owner가 별도 승인한 Foundation 최종 통합 Task야.

- 현재 상태: `approved`
- public source: `origin/develop@3a0a1f4`
- 선행 상태: `T-20260804-002~006 done`
- 시작 절차: 최신 `origin/develop` 기반 전용 worktree 생성, Task lock 획득,
  `approved -> in_progress`
- 필수 구현: T-002~006 local/mock composition과 공용 fixture 기반 실제 HTTP 통합 경로
- 필수 검증: 새 clone, Node 24.18.0/npm 11, non-root container, 전체 계약·보안·비용·
  cleanup 회귀, 원격 STT route/side effect 0건
- 구현 경계: 실제 provider·cloud resource·secret·배포·원격 STT, iOS·Android를
  추가하거나 활성화하지 마.
- 기준 문서: `apps/backend/AGENTS.md`, `apps/backend/docs/`, `apps/backend/contracts/`
- 허용 경로: Task frontmatter의 `allowed_paths`
- 완료 조건: 단일 재현 명령과 결과를 report에 기록하고 lock을 해제한 뒤
  `verification_ready`로 Backend QA Agent에 독립 검증을 인계해.
