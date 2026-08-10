---
schema: aiops.task.v1
id: T-20260810-005
title: Backend production 원격 STT·음성 upload 비활성 보증
status: approved
type: feature
priority: P0
priority_reason: 실제 배포 구성에서도 Apple 기기 내 STT 기본 정책과 음성 비전송을 보장해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Backend Agent
target_role: Execution Role
required_capabilities: [backend_architecture, api_contract, implementation, developer_verification]
ownership:
  paths: [apps/backend/src/stt/, apps/backend/tests/stt/, apps/backend/contracts/stt/, apps/backend/scripts/]
  domains: [remote-stt-disabled-boundary]
  documents: [apps/backend/docs/REMOTE_STT_ADAPTER.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260728-006]
blocks: [T-20260810-006, T-20260729-003]
parallel_group: backend-production-r2-foundation
allowed_paths:
  - apps/backend/src/stt/
  - apps/backend/tests/stt/
  - apps/backend/contracts/stt/
  - apps/backend/scripts/
  - apps/backend/docs/REMOTE_STT_ADAPTER.md
  - apps/backend/docs/STATUS.md
  - apps/backend/docs/CHANGELOG.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - .ai_project/tasks/active/T-20260729-003_build-production-stt-ai-backend-gateway.md
  - .ai_project/tasks/active/T-20260729-022_define-disabled-remote-stt-adapter-contract.md
  - apps/backend/docs/REMOTE_STT_ADAPTER.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-10
updated_at: 2026-08-10
report_to: .ai_project/reports/T-20260810-005_backend-production-remote-stt-disabled-proof-report.md
qa_to: .ai_project/qa/T-20260810-005_backend-production-remote-stt-disabled-proof-qa.md
status_ref: origin/develop
status_ref_sha: 0416401ecc6ed68179d630ea8bd3fc6017ed4adf
---

# Backend production 원격 STT·음성 upload 비활성 보증

## Scope

- Goal: production profile·container·배포 manifest에서도 원격 STT와 음성 upload side effect가 0건임을 증명한다.
- In scope: config·route·body parser·queue·storage·provider·egress negative audit, activation gate, production image/manifest 검사, 계약 테스트.
- Out of scope: 원격 STT provider·endpoint·upload 구현, Apple STT iOS 구현.
- Acceptance criteria: 승인되지 않은 환경변수·profile·manifest 조합 전부 startup 또는 request side effect 전에 차단되고 AI text endpoint와 분리된다.

## Decision Gate

- 원격 STT는 선택 항목이 아니며 첫 출시에서 항상 비활성이다. 활성화 요청은 별도 정책 Task 없이는 수용하지 않는다.
- 2026-08-10 Product Owner가 production 비활성 보증 구현을 승인했다.

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-10 | Development Lead Agent |  | proposed | production STT 비활성 증명 패키지 생성 |
| 2026-08-10 | Development Lead Agent | proposed | scoped | production profile·container·manifest 비활성 보증 범위 조율 완료 |
| 2026-08-10 | Product Owner | scoped | approved | 추천 결정안과 T-20260810-001~005 실행 승인 |

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Backend Agent / Execution Role이야. Task T-20260810-005는 승인된 실행 Task야.

- 현재 상태: approved
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 0416401ecc6ed68179d630ea8bd3fc6017ed4adf
- 다음에 해야 할 일: production profile·container·manifest에서 원격 STT와 음성 upload side effect가 0건임을 보증하는 코드·검사·계약 테스트를 구현해줘.
- 기준 문서: 상위 Task, disabled remote STT 계약과 adapter 문서
- 허용 경로: front matter의 `allowed_paths`
- 참고 산출물: 이 Task 파일
- 변경/검토 대상: `apps/backend/src/stt/`, `tests/stt/`, `contracts/stt/`, `scripts/`
- 남은 리스크: 새 환경변수나 배포 profile 추가 시 비활성 경계를 우회할 가능성이 있다.
- 차단/결정 필요: 원격 STT 활성화 요청은 별도 정책 Task 없이는 수용하지 않는다.
- 완료 시: status를 verification_ready로 바꾸고 target_agent를 Backend QA Agent, target_role을 Verification Role로 넘겨줘.
