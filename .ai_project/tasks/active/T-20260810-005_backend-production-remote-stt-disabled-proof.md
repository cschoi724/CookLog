---
schema: aiops.task.v1
id: T-20260810-005
title: Backend production 원격 STT·음성 upload 비활성 보증
status: verification_passed
type: feature
priority: P0
priority_reason: 실제 배포 구성에서도 Apple 기기 내 STT 기본 정책과 음성 비전송을 보장해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Completion Role
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
status_ref_sha: 421052159b38ade9516c18390e70ea6a1d129430
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
| 2026-08-11 | Backend Agent | approved | in_progress | canonical `origin/develop@42e1c8e`, T-20260728-006 done·빈 lock·단일 Backend Task 확인 후 전용 worktree lock 획득 |
| 2026-08-11 | Backend Agent | in_progress | verification_ready | 최신 canonical `origin/develop@bceba32` fast-forward 통합 후 production zero-capability proof·source/image/manifest audit·container gate, targeted 13/13·전체 155/155·계약 5종·경계 감사 PASS·lock 해제·Backend QA 인계 |
| 2026-08-11 | Backend QA Agent | verification_ready | verification_in_progress | canonical SHA·선행 Task·라우팅·구현 보고서·빈 lock 확인 후 production remote STT disabled proof 독립 검증 lock 획득 |
| 2026-08-11 | Backend QA Agent | verification_in_progress | verification_passed | zero-capability·startup/request/error/strict proof·비로깅, 155/155·계약 5종·감사 mutation 12종 PASS_WITH_RISK; Docker image 실행은 required follow-up으로 남기고 lock 해제 |
| 2026-08-11 | Development Lead Agent | verification_passed | verification_passed | dirty 변경을 보존해 최신 `origin/develop@ca6a165` 비충돌 fast-forward 반영, 전체 155/155·계약 5종·STT/boundary audit 재통과 후 PR·backend-container gate 준비 |

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Completion Role이야. Task T-20260810-005의 완료 확정 여부를 검토해줘.

- 현재 상태: verification_passed
- 기준 상태 ref/SHA: origin/develop@421052159b38ade9516c18390e70ea6a1d129430
- 검증 판정: PASS_WITH_RISK
- 다음에 해야 할 일: 전체 155/155·계약 5종·runtime/adversarial/audit mutation 증빙을 확인하고, Node 24 non-root container required check를 실행·통과한 뒤 완료 가능성을 판단해줘.
- 기준 문서: 상위 T-20260729-003, T-20260729-022, `apps/backend/docs/REMOTE_STT_ADAPTER.md`
- 허용 경로: front matter의 `allowed_paths`
- 참고 산출물: 구현 보고서와 `.ai_project/qa/T-20260810-005_backend-production-remote-stt-disabled-proof-qa.md`
- 변경/검토 대상: `apps/backend/src/stt/`, `tests/stt/`, `contracts/stt/`, `scripts/`, 관련 Backend 문서
- 확인된 결과: zero-capability proof, config/request/error mapping, parser·transport 0, 비로깅, 감사 mutation 12종 PASS
- 남은 리스크: 현재 host Docker 부재로 Node 24 non-root image 미실행, 실제 staging manifest와 새 framework/IaC 감사는 T-006 범위
- 차단/결정 필요: PR `backend-container` 또는 T-006 Docker 환경에서 `npm run verify:container` PASS 필요
- 주의: 별도 정책·ZDR/Modified Retention·처리 지역/국외 처리·credential·개인정보/보안 승인 전 실제 remote STT·음성 upload·Cloud 변경·배포 금지
