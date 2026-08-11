---
schema: aiops.task.v1
id: T-20260810-003
title: Backend App Attest·설치 token·abuse 방어 구현
status: verification_passed
type: feature
priority: P0
priority_reason: 로그인 없는 첫 출시에서 익명 무제한 provider 호출과 설치 위조를 차단해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Completion Role
required_capabilities: [backend_architecture, api_contract, implementation, developer_verification]
ownership:
  paths: [apps/backend/src/auth/, apps/backend/src/limits/, apps/backend/tests/auth/, apps/backend/contracts/common/]
  domains: [app-attestation, installation-auth, abuse-prevention]
  documents: [apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260728-006]
blocks: [T-20260810-004, T-20260810-006, T-20260729-003]
parallel_group: backend-production-r2-foundation
allowed_paths:
  - apps/backend/src/auth/
  - apps/backend/src/limits/
  - apps/backend/tests/auth/
  - apps/backend/contracts/common/
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
  - apps/backend/docs/API_CONTRACT.md
  - apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-10
updated_at: 2026-08-11
report_to: .ai_project/reports/T-20260810-003_backend-app-attest-installation-auth-report.md
qa_to: .ai_project/qa/T-20260810-003_backend-app-attest-installation-auth-qa.md
status_ref: origin/develop
status_ref_sha: 081c206f60ef6e5f3d533a5a2b3aafafaa52b133
---

# Backend App Attest·설치 token·abuse 방어 구현

## Scope

- Goal: App Attest 기반 설치 신뢰와 제한된 단기 token 경계로 provider 호출을 보호한다.
- In scope: challenge·assertion 검증, 설치 token 발급·회전·폐기, replay·clock skew·위조 차단, installation/IP/project rate limit, 제한된 compatibility 정책 테스트.
- Out of scope: 사용자 로그인·계정, iOS App Attest client 구현, production traffic.
- Acceptance criteria: attestation 실패·replay·만료·위조가 provider side effect 전에 차단되고 compatibility 경로가 무제한 익명 접근을 만들지 않는다.

## Decision Gate

- 2026-08-10 Product Owner 승인: production은 App Attest 필수, 개발·Simulator compatibility는 제한된 비운영 경로로만 허용한다.
- iOS client 변경이 필요하면 별도 iOS Task로 분리하며 이 Task의 allowed path를 넓히지 않는다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-10 | Development Lead Agent |  | proposed | 설치 인증·abuse 방어 패키지 생성 |
| 2026-08-10 | Development Lead Agent | proposed | scoped | App Attest 필수 범위와 제한된 compatibility 정책 조율 완료 |
| 2026-08-10 | Product Owner | scoped | approved | 추천 결정안과 T-20260810-001~005 실행 승인 |
| 2026-08-10 | Backend Agent | approved | in_progress | canonical `origin/develop@081c206`·선행 done·단일 Backend lock 확인 후 전용 worktree에서 lock 획득 |
| 2026-08-11 | Backend Agent | in_progress | verification_ready | App Attest verifier 경계·설치 token·원자 replay 방어·rate limit 구현, 135/135·계약 5종·경계 감사 PASS 후 lock 해제·Backend QA 인계 |
| 2026-08-11 | Backend QA Agent | verification_ready | verification_in_progress | canonical SHA·라우팅·보고서·선행 Task 확인 후 독립 검증 lock 획득 |
| 2026-08-11 | Backend QA Agent | verification_in_progress | verification_passed | PASS_WITH_RISK: Node 24/26 135/135·계약 5종·경계 감사와 challenge/token/rate cap 경계 통과; 실제 Apple·durable revocation·KMS 미검증 위험 인계 |

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Completion Role이야. Task T-20260810-003의 완료 리뷰를 진행해줘.

- 현재 상태: verification_passed
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 081c206f60ef6e5f3d533a5a2b3aafafaa52b133
- QA 판정: `PASS_WITH_RISK`
- 독립 검증: Node 26 `npm run verify` 135/135·계약 5종·경계 감사 PASS, Node 24.18.0 135/135 PASS. production synthetic verifier 거부, cryptographic result fail-closed, challenge/counter/idempotency 단일 승자, token 위조·시간·회전·폐기, rate cap·compatibility 경계를 확인했다.
- 다음에 해야 할 일: 승인된 local/domain contract 성공 기준과 아래 잔여 위험을 검토해 완료 여부를 판단해줘.
- 기준 문서: 상위 Task, API 계약, 보안·개인정보·관측성 문서
- 허용 경로: front matter의 `allowed_paths`
- QA 보고서: `.ai_project/qa/T-20260810-003_backend-app-attest-installation-auth-qa.md`
- 남은 리스크: concrete Apple CBOR/인증서 adapter·Firestore transaction·실제 signing key/KMS·기기 proof는 미검증이다. process-local revocation은 token service 재생성 뒤 기존 폐기 token이 다시 승인되는 반례가 있으므로 production composition 전에 durable revocation 조회 경계를 반드시 연결해야 한다.
- 차단/결정 필요: credential 등록, 실제 외부 호출, Google Cloud 리소스 생성·배포는 금지한다.
- 완료 시: Product Owner의 잔여 위험 수용과 후속 T-006 production composition 필수 gate를 명시해 인계해줘.
