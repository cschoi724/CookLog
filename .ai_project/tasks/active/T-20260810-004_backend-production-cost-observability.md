---
schema: aiops.task.v1
id: T-20260810-004
title: Backend production 비용 hard cutoff·redaction·observability 구현
status: done
type: feature
priority: P0
priority_reason: 실제 provider·storage·인증을 비용과 개인정보 fail-closed 경계 안에서 운영해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Completion Role
required_capabilities: [backend_architecture, implementation, developer_verification]
ownership:
  paths: [apps/backend/src/cost/, apps/backend/src/observability/, apps/backend/tests/security/, apps/backend/contracts/security/]
  domains: [cost-control, privacy-observability]
  documents: [apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260810-001, T-20260810-002, T-20260810-003]
blocks: [T-20260810-006, T-20260729-003]
parallel_group:
allowed_paths:
  - apps/backend/src/cost/
  - apps/backend/src/observability/
  - apps/backend/tests/security/
  - apps/backend/contracts/security/
  - apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
  - apps/backend/docs/STATUS.md
  - apps/backend/docs/CHANGELOG.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - .ai_project/tasks/active/T-20260729-003_build-production-stt-ai-backend-gateway.md
  - .ai_project/tasks/active/T-20260729-024_define-backend-security-privacy-observability-guardrails.md
  - apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-10
updated_at: 2026-08-11
report_to: .ai_project/reports/T-20260810-004_backend-production-cost-observability-report.md
qa_to: .ai_project/qa/T-20260810-004_backend-production-cost-observability-qa.md
status_ref: origin/develop
status_ref_sha: 09d6c21e0740c94ec724c55cd449650468430702
---

# Backend production 비용 hard cutoff·redaction·observability 구현

## Scope

- Goal: 실제 provider 호출·storage·인증 사용량을 승인된 예산과 비콘텐츠 관측성 경계에 연결한다.
- In scope: provider 호출 전 원자적 비용 reservation, 월 호출·입력·출력 token hard cutoff, retry 비용, service disable, allowlist telemetry, alert·incident cleanup 테스트.
- Out of scope: 결제 상품·구독 quota, 콘텐츠 logging, production traffic.
- Acceptance criteria: cutoff·ledger·telemetry 장애가 provider side effect와 결과 공개 전에 fail closed하고 원문·prompt·결과·secret이 sink에 기록되지 않는다.

## Decision Gate

- 2026-08-10 Product Owner 승인: 월 50,000원, 월 5,500회 호출, 입력 20M token, 출력 8M token 중 먼저 도달한 한도에서 hard cutoff한다.
- provider 가격·환율 변동에도 fail closed하도록 원화 예산과 사용량 상한을 독립적으로 적용한다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-10 | Development Lead Agent |  | proposed | production 비용·관측성 패키지 생성 |
| 2026-08-10 | Development Lead Agent | proposed | scoped | 최신 가격과 월 예산·호출·token hard cutoff 범위 조율 완료 |
| 2026-08-10 | Product Owner | scoped | approved | 추천 결정안과 T-20260810-001~005 실행 승인; T-001~003 완료 후 실행 |
| 2026-08-11 | Backend Agent | approved | in_progress | canonical `origin/develop@09d6c21`에서 T-001~003 모두 done·단일 Backend lock 확인 후 전용 worktree에서 lock 획득 |
| 2026-08-11 | Backend Agent | in_progress | verification_ready | 4차원 월 hard cutoff·multi-service 원장·telemetry/result fail-closed 구현, 146/146·계약 5종·경계 감사 PASS 후 lock 해제·Backend QA 인계 |
| 2026-08-11 | Backend QA Agent | verification_ready | verification_in_progress | canonical SHA·선행 Task·라우팅·보고서 확인 후 독립 검증 lock 획득 |
| 2026-08-11 | Backend QA Agent | verification_in_progress | rework_requested | Node 26 전체 146/146·계약 5종·비로깅은 PASS. 필수 service 0 quantity 승인, 다른 SKU envelope replay 오인, cleanup wrong-SKU 승인 HIGH 3건과 token metric 상한 MEDIUM 1건으로 FAIL·lock 해제 |
| 2026-08-11 | Product Owner | rework_requested | approved | QA-HIGH-004-001~003·QA-MEDIUM-004-001 재작업 승인, Backend Agent 재인계 |
| 2026-08-11 | Backend Agent | approved | in_progress | 승인된 WP-R1~R4와 QA 원본 확인 후 재작업 lock 획득 |
| 2026-08-11 | Backend Agent | in_progress | verification_ready | exact provider/kind envelope·canonical replay hash·strict token metric 구현, QA 원본 반례·전체 151/151·계약 5종·경계 감사 PASS 후 lock 해제·Backend QA 재인계 |
| 2026-08-11 | Backend QA Agent | verification_ready | verification_in_progress | canonical SHA·선행 Task·재작업 승인·보고서·QA 원본 확인 후 독립 재검증 lock 획득 |
| 2026-08-11 | Backend QA Agent | verification_in_progress | rework_requested | 기존 QA 4건은 해소·151/151·계약 5종·비로깅 PASS. request getter 재평가로 token 0/0 under-reservation·runtime envelope cleanup 권한 획득 HIGH와 non-enumerable extra·invalid kind throw MEDIUM으로 FAIL·lock 해제 |
| 2026-08-11 | Product Owner | rework_requested | approved | QA-HIGH-004-004·QA-MEDIUM-004-002의 단일 불변 request projection·exact own data-property schema 재작업 승인, Backend Agent 재인계 |
| 2026-08-11 | Backend Agent | approved | in_progress | WP-R5~R6 승인·최신 canonical·선행 Task done·빈 lock 확인 후 2차 재작업 lock 획득 |
| 2026-08-11 | Backend Agent | in_progress | verification_ready | exact one-time request projection·own descriptor schema 구현, targeted 16/16·전체 153/153·계약 5종·경계 감사 PASS 후 lock 해제·Backend QA 재인계 |
| 2026-08-11 | Backend QA Agent | verification_ready | verification_in_progress | canonical SHA·선행 Task·WP-R5~R6 승인·구현 보고서·빈 lock 확인 후 2차 재작업 독립 재검증 lock 획득 |
| 2026-08-11 | Backend QA Agent | verification_in_progress | verification_passed | accessor·Proxy read/trap 0, strict own schema·error mapping·replay·비로깅과 기존 QA 4건, 전체 153/153·계약 5종·경계 감사 독립 재검증 PASS_WITH_RISK 후 lock 해제 |
| 2026-08-11 | Development Lead Agent | verification_passed | completion_review | QA 결함 6건 해소·153/153·계약 5종·경계 감사 수용. process-local·Node 24·실제 Billing/sink/composition은 T-006 필수 gate, App Attest fixture 간헐성은 비차단 후속 위험으로 분리 |
| 2026-08-11 | Product Owner | completion_review | done | 잔여 위험과 T-006 필수 gate를 수용하고 구현·보고·QA 결과의 PR #123 게시·`develop` squash 병합 승인 |

## 2026-08-11 재작업 범위

- `WP-R1 — provider canonical envelope`: 서버 소유 provider envelope에 13개 필수 SKU와
  보수적 최대 quantity를 정확히 고정한다. 누락·0·과소·과대·비정상·unknown extra SKU를
  ledger mutation과 provider side effect 전에 `service_disabled`로 차단한다. 정상 최대
  envelope와 필수 service별 negative test를 추가한다.
- `WP-R2 — immutable replay identity`: operation reservation에 정규화한 operation kind,
  SKU·quantity 전체와 필요한 manifest/version을 포함한 canonical envelope 또는 그 hash를
  불변 저장한다. replay는 canonical envelope가 정확히 같은 경우만 허용하고, 반올림 KRW가
  같아도 quantity·SKU·kind가 다르면 `operation_conflict`로 차단한다. accepted/rejected 양쪽의
  same-cost 충돌 회귀를 추가한다.
- `WP-R3 — operation-kind SKU contract`: `runtime`, `tasks`, `firestore`, `ttl_delete`,
  `logging`, `egress`, `build`, `privacy_cleanup`, `authentication` 각각에 허용·필수 SKU와
  maximum quantity schema를 연결한다. wrong-kind SKU, 누락·0·과소·과대·unknown extra를
  fail closed하고 privacy cleanup 실행 권한은 동일 kind의 유효한 사전 reservation으로만
  얻도록 한다. 각 kind 정상·오류 envelope와 kill switch 후 cleanup 회귀를 추가한다.
- `WP-R4 — strict token telemetry`: `provider_call_completed`의 event별 schema에서
  `input_tokens <= 5,000`, `output_tokens <= 2,000`을 강제한다. 경계값·경계±1·음수·비정수·
  과대 입력을 검증하고 다른 event의 정수 metric 계약을 넓히지 않는다.
- 보존 게이트: 기존 146/146, 계약 validator 5종, boundary audit, 4차원 월 hard cutoff,
  delayed reserve, ledger/sink/terminal fail-closed, 콘텐츠·secret 비로깅을 모두 유지한다.
- 범위 제외: 실제 provider/network/Cloud Billing 호출, credential, Google Cloud 리소스·배포,
  distributed transaction과 Node 24 non-root container 검증. 후자의 production gate는
  T-20260810-006에 유지한다.

## 2026-08-11 2차 재작업 범위

- `WP-R5 — immutable one-time request projection`: provider와 billable request의 operation ID,
  operation kind, token·attempt 상한, quantity를 exact own data-property schema로 한 번만
  읽어 immutable local projection을 만든다. validation, canonical hash, repository request와
  cleanup authorization은 모두 같은 projection만 사용하며 accessor·proxy·throwing shape는
  예외 전파 없이 `service_disabled`, ledger mutation 0, cleanup 권한 false로 종료한다.
- `WP-R6 — exact own structural validation`: `Reflect.ownKeys()`와 property descriptor를
  기준으로 허용된 enumerable string data property의 exact key set만 수용한다. accessor,
  symbol, non-enumerable, unknown extra, 누락과 잘못된 descriptor를 거부하고, operation kind는
  server-owned envelope의 own key인지 확인한 뒤에만 조회한다. invalid kind·shape는 throw 없이
  `service_disabled`로 종료한다.
- 필수 회귀: token-changing getter, kind-changing getter, getter가 실행되면 실패하는 accessor,
  throwing proxy, non-enumerable extra SKU, symbol·unknown field와 invalid operation kind를 모두
  fail closed로 고정한다. 정상 data-property request와 기존 exact envelope/replay/token 경계는
  계속 통과해야 한다.
- 보존 게이트: 기존 QA 4건의 RESOLVED 상태, 전체 151/151, 계약 validator 5종, boundary audit,
  4차원 월 hard cutoff, delayed reserve, ledger/sink/terminal fail-closed와 콘텐츠·secret
  비로깅을 유지한다.
- 범위 제외: 실제 provider/network/Cloud Billing 호출, credential, Google Cloud 리소스·배포,
  distributed transaction과 Node 24 non-root container 검증. 해당 production gate는
  T-20260810-006에서 유지한다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Lead Role이야. Task T-20260810-004의 병합 후 의존성을 조율해줘.

- 현재 상태: done
- 기준 상태 ref/SHA: origin/develop@09d6c21e0740c94ec724c55cd449650468430702
- 검증 판정: PASS_WITH_RISK
- 다음에 해야 할 일: PR #123 squash 병합 후 canonical `origin/develop`의 `done`을 확인하고 T-20260810-005~006 및 상위 T-20260729-003 의존성을 조율해줘.
- 기준 문서: 상위 production gateway Task, T-024 security guardrail, `SECURITY_PRIVACY_OBSERVABILITY.md`
- 허용 경로: front matter의 `allowed_paths`
- 참고 산출물: 구현 보고서와 `.ai_project/qa/T-20260810-004_backend-production-cost-observability-qa.md` 9절
- 검증 결과: 전체 153/153, 계약 validator 5종, boundary audit, 독립 getter·Proxy·strict shape·replay·비로깅 반례 PASS
- 남은 리스크: process-local·synthetic adapter, 실제 distributed/Billing/sink/composition, Node 24 non-root 미검증과 범위 밖 App Attest forgery fixture 간헐성. T-006 필수 gate로 유지한다.
- 주의: ZDR·Modified Retention·국외 처리 승인·credential 전 실제 외부 provider 호출, Cloud Billing·Google Cloud 리소스·배포는 계속 금지한다.

## Completion Review

- 판정: `PASS_WITH_RISK`, 완료 가능.
- 수용 근거: `QA-HIGH-004-001~004`, `QA-MEDIUM-004-001~002`가 모두 원본 반례에서
  `RESOLVED`됐고, 전체 Node 테스트 153/153, 계약 validator 5/5, Backend foundation
  boundary audit와 accessor·Proxy·strict shape·replay·비로깅 독립 반례가 통과했다.
- Task 범위 판단: 승인 범위는 process-local 비용 원장과 synthetic adapter에서 hard cutoff,
  exact envelope, fail-closed와 비로깅 계약을 구현·검증하는 것이다. 실제 provider·network·
  Cloud Billing·Google Cloud 리소스·배포는 처음부터 제외됐으므로 해당 미검증은 T-004의
  재작업 사유가 아니다.
- 필수 후속 gate: `T-20260810-006`에서 Node 24 non-root container, 실제 multi-instance
  transaction, 월 원장 생성·복구, Billing export reconciliation, required sink 장애·복구와
  production composition·rollback을 검증한다. 이 gate 전에는 production 활성화를 금지한다.
- 비차단 후속 위험: 범위 밖 App Attest forgery fixture는 base64url 마지막 문자 변조가 같은
  byte로 decode될 수 있는 간헐성이 있다. 이번 독립 검증은 첫 실행 153/153이었지만, T-006의
  CI gate 확정 전 별도 테스트 신뢰성 보완 대상으로 추적해야 한다.
- 완료 조건: Product Owner가 위 잔여 위험을 수용하고 구현·보고·QA 결과의 PR #123 게시와
  `develop` squash 병합을 승인했다. 병합 후 canonical Task 상태를 확인한 뒤에만 `done`을
  전역 완료로 확정한다.
