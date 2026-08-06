---
schema: aiops.task.v1
id: T-20260804-006
title: Backend redacted logging·비용 원장·TTL cleanup 경계 구현
status: done
type: feature
priority: P0
priority_reason: Mock 실행에서도 콘텐츠 비노출·비용 hard cutoff·삭제 불변식을 강제해야 한다.
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
- T-20260804-003
- T-20260804-004
- T-20260804-005
blocks:
- T-20260804-007
parallel_group:
allowed_paths:
- apps/backend/src/observability/
- apps/backend/src/cost/
- apps/backend/src/cleanup/
- apps/backend/src/jobs/
- apps/backend/src/storage/
- apps/backend/tests/security/
- apps/backend/tests/cleanup/
- apps/backend/docs/STATUS.md
- apps/backend/docs/CHANGELOG.md
- ".ai_project/tasks/backlog/T-20260804-006_implement-backend-safety-runtime.md"
- ".ai_project/tasks/active/T-20260804-006_implement-backend-safety-runtime.md"
- ".ai_project/reports/T-20260804-006_implement-backend-safety-runtime-report.md"
- ".ai_project/qa/T-20260804-006_implement-backend-safety-runtime-qa.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
source_of_truth:
- apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
- apps/backend/contracts/security/
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-04
updated_at: '2026-08-06'
report_to: ".ai_project/reports/T-20260804-006_implement-backend-safety-runtime-report.md"
qa_to: ".ai_project/qa/T-20260804-006_implement-backend-safety-runtime-qa.md"
status_ref: origin/develop
status_ref_sha: 69cbf81df0d215b08b6feaf657ba3a4b0e8ce4b5
base_ref: origin/develop
base_sha: 69cbf81df0d215b08b6feaf657ba3a4b0e8ce4b5
blocker:
next_decision:
---

# Backend 안전 runtime 경계 구현

## 범위

- allowlist structured logger와 redaction scanner
- operation 단위 비용 전액 예약·거절·초과 actual 정산
- ACK 즉시 삭제, +22시간 cleanup, sweeper, +24시간 접근 차단
- 주입 가능한 clock과 장애·동시성 테스트

## 성공 기준

- 콘텐츠·secret·token·provider raw body 로그 0건
- 월 KRW 50,000 hard cutoff 불변식 유지
- cleanup 실패·재시도·만료 접근 차단 fixture 통과

## 승인 및 실행 경계

- 2026-08-05: Backend Agent가 최신 `origin/develop@3641dd4` 기반 clean 전용
  worktree에서 lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-08-05: allowlist logger·redaction scanner, 전체 외부비 원장과 raw metadata
  cleanup 경계를 구현했다. T-006 20/20, Backend 전체 86/86과 공용 validator를 통과해
  lock을 해제하고 `in_progress -> verification_ready`로 Backend QA에 인계했다.
- 2026-08-05: Backend QA Agent가 공식 86/86과 공용 계약은 통과했으나 자유 문자열을
  `deployment_version`으로 sink에 기록하는 `QA-HIGH-006-001`, `NaN` clock이 비용
  admission과 raw metadata 30일 접근 차단을 우회하는 `QA-HIGH-006-002`를 재현했다.
  최종 `FAIL`, `verification_ready -> verification_in_progress -> rework_requested`로
  Development Lead Agent에 재작업 범위 조율을 인계했다.
- 2026-08-06: Development Lead Agent가 두 HIGH를 telemetry 승인 ID와 비정상 clock의
  fail-closed 경계로 제한해 `rework_requested -> scoped`로 전환했다. Product Owner가
  해당 재작업을 승인해 `scoped -> approved`로 전환하고 Backend Agent에 재인계한다.
- 2026-08-06: Backend Agent가 exact version allowlist와 비정상 epoch fail-closed를
  구현했다. QA 원본 반례, T-006 26/26, Backend 전체 92/92와 공용 validator를 통과해
  `in_progress -> verification_ready`로 Backend QA 독립 재검증에 인계한다.
- 2026-08-06: Backend QA Agent가 두 HIGH의 원본·확장 반례, T-006 26/26, 전체 92/92와
  공용 계약을 독립 재검증했다. `QA-HIGH-006-001~002` 해소와 신규 HIGH·MEDIUM 결함
  부재를 확인해 `PASS_WITH_RISK`,
  `verification_ready -> verification_in_progress -> verification_passed`로 Development
  Lead Agent에 완료 검토를 인계했다.
- 2026-08-06: Development Lead Agent가 최신 `origin/develop@69cbf81`, 성공 기준,
  변경 16개 허용 경로, 두 HIGH의 원본 반례, T-006 26/26·Backend 전체 92/92와 공용
  계약을 직접 재확인했다. 실제 cloud·Node 24 container·전체 composition 위험을
  T-007 필수 통합 게이트로 유지하는 조건으로 `PASS_WITH_RISK`를 수용하고
  `verification_passed -> completion_review`로 전환한다.
- 2026-08-06: Product Owner가 완료 리뷰와 T-007 잔여 위험 이관을 수용하고 최종 완료와
  PR #87 squash merge를 승인했다. `completion_review -> done`으로 확정하며 공용
  `done`과 T-007 선행 해제는 PR #87의 `develop` 병합 후 효력이 발생한다.

- 2026-08-05: 공용 `develop@2092e1d`에서 선행 `T-20260804-003~005`의 `done`과
  PR #84 병합을 확인했다.
- 2026-08-05: Product Owner가 redacted logging·비용 원장·TTL cleanup 경계 구현을
  별도 승인했다. Development Lead Agent가 `proposed -> scoped -> approved`로 전환하고
  Backend Agent에 인계한다.
- 구현은 local/mock runtime의 allowlist logger·redaction scanner, 주입 가능한 clock을
  사용하는 비용 원장·cleanup repository/service와 장애·동시성 테스트로 제한한다.
- telemetry는 계약 allowlist 필드만 새 object로 복사하고 body·header·query·자유 문자열·
  exception·provider raw response·secret·token을 기록하지 않는다. schema/redaction 실패는
  event를 폐기하고 고정 reason counter만 증가시킨다.
- 비용 원장은 provider뿐 아니라 runtime·Tasks·Firestore·TTL·logging·egress 등 fixture의
  전체 외부비를 operation 단위로 전액 원자 예약하거나 전액 거절한다. 월 KRW 50,000과
  KRW 5,000 delayed billing reserve를 넘길 수 없고, 가격·환율·billing snapshot이
  누락·만료되면 새 비용 동작을 fail closed한다.
- AI 콘텐츠는 ACK 즉시 삭제, +22시간 cleanup, +24시간 read/access 차단을 유지한다.
  raw metadata는 +28일 cleanup outbox, 15분 독립 sweeper, +30일 read·export·aggregate
  차단과 필수 sink receipt 완료를 deterministic in-memory 경계로 검증한다.
- cleanup 비용은 사전 예약된 privacy envelope 안에서 hard cutoff 뒤에도 계속 수행하되
  새 provider·비필수 외부 작업은 kill switch로 차단한다.
- 실제 Cloud Logging·Firestore·Cloud Tasks·Billing API·Secret Manager·KMS·provider,
  production adapter·credential·배포·공유 app wiring은 구현하지 않는다. Provider 지역
  활성화 gate와 Node 24·container·전체 composition은 T-007 범위로 유지한다.
- 기존 T-003~005 테스트, common·STT·AI·security·shared fixture validator를 회귀
  검증하고 완료 후 Backend QA Agent에 독립 검증을 인계한다.

## 승인된 재작업 범위

- `WP-R1 / QA-HIGH-006-001`: `deployment_version`, `manifest_version`을 호출자 자유
  문자열이 아닌 서버 소유의 검증된 불변 ID·명시적 allowlist로 제한한다. 승인되지 않은
  값은 event 전체를 폐기하고 고정 drop counter만 증가시키며 입력 문자열을 보존하거나
  다른 telemetry로 출력하지 않는다.
- `WP-R1` 회귀는 version 필드와 그 밖의 자유 문자열 후보에 recipe·STEP·prompt 형태의
  비literal canary를 넣어 emit `false`, sink 0건, 고정 counter만 증가함을 확인한다.
- `WP-R2 / QA-HIGH-006-002`: 비용 admission의 `now`, `lastReconciledAt`을 비교 전에
  유한한 non-negative safe integer epoch이자 표현 가능한 서버 시각으로 검증한다. 유효하지
  않으면 비용 동작을 `MANIFEST_INVALID` 또는 `BILLING_RECONCILIATION_STALE`로 차단한다.
- `WP-R2` cleanup clock이 유효하지 않으면 신규 raw metadata 생성과 read·export·aggregate를
  모두 차단하고 콘텐츠 없는 고정 incident 상태만 남긴다. 기존 record와 receipt를 임의로
  삭제·변조하지 않는다.
- `WP-R2` 회귀는 `NaN`, `Infinity`, `-Infinity`, 음수, unsafe integer와 표현 범위 밖
  시각을 비용 manifest·reconciliation 및 raw metadata lifecycle에 직접 주입한다.
- 수정은 `apps/backend/src/observability/`, `src/cost/`, `src/cleanup/`과 대응 security·
  cleanup 테스트·승인 문서로 제한한다. 실제 cloud sink·billing·datastore·queue·KMS,
  provider, secret, 배포, T-007 composition과 원격 STT를 변경하지 않는다.
- 재작업 완료 후 두 직접 반례, T-006 전용, Backend 전체 runtime과 common·STT·AI·
  security·shared fixture validator를 통과시키고 Backend QA Agent에 독립 재검증을 요청한다.

## 완료 리뷰 결과

- 판정: `PASS_WITH_RISK`
- `QA-HIGH-006-001~002` 해소와 신규 HIGH·MEDIUM 결함 부재를 수용한다.
- 미승인 version·allowlist 미설정·비literal canary는 event 전체가 폐기되고 sink 0건,
  고정 drop counter만 증가함을 원본 공격 스크립트와 집중 회귀에서 확인했다.
- `NaN`, 무한대, 음수, 소수, unsafe·표현 범위 밖 epoch와 throwing clock은 비용 operation
  ID·ledger mutation 및 raw metadata 생성·접근·cleanup mutation 전에 차단된다.
- Development Lead 환경에서 build·typecheck, T-006 security·cleanup 26/26과 Backend
  전체 92/92, `git diff --check`와 strict Task validation을 재통과했다.
- 변경 16개 경로는 모두 Task `allowed_paths` 안이며 실제 cloud·provider·network·
  credential·secret·배포·원격 STT와 T-007 composition을 추가하지 않았다.
- in-memory 재시작 비내구성, 실제 sink·billing·datastore·queue·KMS adapter, Node 24
  container와 공유 app/worker composition은 T-007 필수 통합 검증으로 이관한다. 현재
  Task 완료를 차단하지 않지만 T-007은 T-006 병합 전 착수할 수 없다.
- PR #87의 최종 checks와 Product Owner 완료·병합 승인을 받은 뒤 squash merge하고,
  merge SHA 확인 후에만 `completion_review -> done`과 T-007 선행 해제를 확정한다.
- 완료 확정: Product Owner가 최종 완료와 PR #87 squash merge를 승인했다. 필수 checks
  통과 후 `develop`에 병합해 공용 `done`을 확정한다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Lead Role이야.
Task T-20260804-006은 완료 리뷰와 Product Owner 병합 승인을 받은 완료 Task야.

- 현재 상태: `done` (`develop` 병합 후 공용 효력)
- 구현 기준 ref: `task/T-20260804-006-implement-backend-safety-runtime`
- 다음에 해야 할 일: PR #87 최종 checks 후 squash merge하고 공용 `develop`을 동기화해줘.
- 기준 문서: `apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md`,
  `apps/backend/contracts/security/`
- 허용 경로: Task frontmatter의 `allowed_paths`
- 재검증 결과: HIGH 2건 해소, QA 원본 반례·T-006 26/26·전체 92/92·모든 validator PASS
- 남은 리스크: 실제 cloud sink·billing·datastore·queue·KMS·Node 24/container·공유 app
  composition은 T-007에서 통합 검증
- 차단/결정 필요: 실제 provider·cloud resource·secret·배포와 원격 STT 활성화 금지
- 참고: `.ai_project/qa/T-20260804-006_implement-backend-safety-runtime-qa.md`
- 완료 시: merge SHA와 공용 `done`, T-007의 `proposed`·선행 해소 상태를 확인해줘.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-08-06 | Backend Agent | lock | task lock |
| 2026-08-06 | Backend Agent | transition: approved -> in_progress | QA-HIGH-006-001~002 승인 재작업 착수 |
| 2026-08-06 | Backend Agent | transition: in_progress -> verification_ready | HIGH 2건 수정, QA 원본 반례와 T-006 26/26·전체 92/92 통과 |
| 2026-08-06 | Backend Agent | unlock | task unlock |
| 2026-08-06 | Backend QA Agent | transition: verification_ready -> verification_in_progress | HIGH 2건 원본·확장 반례와 전체 회귀 독립 재검증 |
| 2026-08-06 | Backend QA Agent | transition: verification_in_progress -> verification_passed | HIGH 2건 해소, T-006 26/26·전체 92/92·공용 계약 PASS_WITH_RISK |
| 2026-08-06 | Development Lead Agent | transition: verification_passed -> completion_review | HIGH 2건 해소, 허용 경로, 원본 반례·26/26·92/92와 T-007 잔여 위험 이관을 확인해 완료 리뷰 수용 |
| 2026-08-06 | Product Owner | transition: completion_review -> done | 완료 리뷰와 T-007 잔여 위험 이관 수용, PR #87 squash merge 승인 |
