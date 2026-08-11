---
schema: aiops.task.v1
id: T-20260810-005
title: Backend production 원격 STT·음성 upload 비활성 보증
status: done
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
| 2026-08-11 | Development Lead Agent | verification_passed | completion_review | PR #127의 Node 24 non-root `backend-container`, backend-verify, iOS required checks PASS를 확인해 필수 보완 조건 해소; 실제 staging manifest·새 framework/IaC 감사 확장은 T-006 gate로 유지 |
| 2026-08-11 | Product Owner | completion_review | done | 잔여 위험과 T-006 필수 gate를 수용하고 구현·보고·QA·완료 리뷰의 PR #127 `develop` squash 병합 승인 |

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Lead Role이야. Task T-20260810-005의 병합 후 의존성을 조율해줘.

- 현재 상태: done
- 기준 상태 ref/SHA: origin/develop@421052159b38ade9516c18390e70ea6a1d129430
- 검증 판정: PASS_WITH_RISK
- 다음에 해야 할 일: PR #127 squash 병합 후 canonical `origin/develop`의 `done`을 확인하고 T-20260810-006과 상위 T-20260729-003 의존성을 조율해줘.
- 기준 문서: 상위 T-20260729-003, T-20260729-022, `apps/backend/docs/REMOTE_STT_ADAPTER.md`
- 허용 경로: front matter의 `allowed_paths`
- 참고 산출물: 구현 보고서와 `.ai_project/qa/T-20260810-005_backend-production-remote-stt-disabled-proof-qa.md`
- 변경/검토 대상: `apps/backend/src/stt/`, `tests/stt/`, `contracts/stt/`, `scripts/`, 관련 Backend 문서
- 확인된 결과: zero-capability proof, config/request/error mapping, parser·transport 0, 비로깅, 감사 mutation 12종 PASS
- 남은 리스크: 실제 staging manifest 부재와 새 framework/IaC 감사 pattern, 활성 remote STT grant·삭제 경계는 현재 비활성 범위 밖이며 T-006 또는 별도 정책 gate에서 검증 필요
- 차단/결정 필요: 기술 차단 없음. PR #127 병합과 canonical `done` 확인 필요
- 주의: 별도 정책·ZDR/Modified Retention·처리 지역/국외 처리·credential·개인정보/보안 승인 전 실제 remote STT·음성 upload·Cloud 변경·배포 금지

## Completion Review

- 판정: `PASS_WITH_RISK`, 완료 가능.
- 수용 근거: production zero-capability proof, startup/request/error fail-closed, exact plain-data
  schema, 비로깅과 감사 mutation 12종이 독립 검증을 통과했고 전체 155/155, 계약 validator
  5/5, production STT audit와 Backend boundary audit가 통과했다.
- 필수 보완 조건 해소: PR #127의 `backend-container`가 Node 24 non-root image build/run과
  강화된 `npm run verify:container`를 통과했다. `backend-verify`, `ios-build`, `ios-xctest`도
  모두 PASS이며 PR은 `CLEAN / MERGEABLE`이다.
- 범위 판단: 첫 출시의 remote STT·음성 upload는 기능이 아니라 강제 비활성 경계다. 실제
  provider·endpoint·credential·upload route를 만들지 않고 capability 0을 증명했으므로 활성
  remote STT의 grant·삭제 계약 미검증은 T-005 재작업 사유가 아니다.
- 필수 후속 gate: `T-20260810-006`에서 실제 staging manifest가 추가될 때
  `absent_or_explicitly_disabled` 감사, 새 runtime/framework/IaC pattern과 rollback 이후에도
  capability 0이 유지되는지 다시 검증한다.
- 금지 경계: 별도 정책, ZDR·Modified Retention, 처리 지역·국외 처리, credential과
  개인정보·보안 승인 전 실제 remote STT·음성 upload·Cloud 변경·배포를 금지한다.
- 완료 조건: Product Owner가 위 잔여 위험을 수용하고 PR #127의 `develop` squash 병합을
  승인했다. 병합 후 canonical Task 상태를 확인한 뒤 `done`을 전역 완료로 확정한다.
