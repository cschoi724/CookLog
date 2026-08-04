---
schema: aiops.task.v1
id: T-20260804-001
title: 수익화 Source of Truth와 T-010~018 후보 Task 복구
status: done
type: docs
priority: P1
priority_reason: 보존 WIP에만 남은 수익화 지침과 후보 Task를 최신 develop에 복구해야 실행 시점의 정책·비용 기준을 잃지 않는다.
org_unit: Product Division
team: Product Team
team_lead: Product Lead Agent
workflow: docs
target_agent: Product Lead Agent
target_role: Completion Role
required_capabilities:
  - parent_task_completion
depends_on: []
blocks: []
parallel_group: monetization-sot-recovery
allowed_paths:
  - .ai_project/operating_model.md
  - .ai_project/agent_registry.md
  - .ai_project/teams/product/team_context.md
  - docs/product/CookLog_MONETIZATION.md
  - docs/PROJECT_CHANGELOG.md
  - .ai_project/current_context.md
  - .ai_project/source_of_truth.md
  - .ai_project/task_board.md
  - .ai_project/teams/product/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
  - .ai_project/tasks/backlog/T-20260728-010_finalize-monetization-pricing-and-unit-economics.md
  - .ai_project/tasks/backlog/T-20260728-011_design-subscription-paywall-ux.md
  - .ai_project/tasks/backlog/T-20260728-012_define-subscription-entitlement-and-quota-contract.md
  - .ai_project/tasks/backlog/T-20260728-013_prepare-app-store-subscription-and-legal.md
  - .ai_project/tasks/backlog/T-20260728-014_implement-ios-storekit-pro.md
  - .ai_project/tasks/backlog/T-20260728-015_implement-backend-entitlement-and-quota.md
  - .ai_project/tasks/backlog/T-20260728-016_implement-monetization-observability.md
  - .ai_project/tasks/backlog/T-20260728-017_verify-subscription-sandbox-and-testflight.md
  - .ai_project/tasks/backlog/T-20260728-018_review-monetization-launch-readiness.md
  - .ai_project/tasks/active/T-20260804-001_restore-monetization-source-of-truth.md
  - .ai_project/reports/T-20260804-001_restore-monetization-source-of-truth-report.md
  - .ai_project/qa/T-20260804-001_restore-monetization-source-of-truth-qa.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_ROADMAP.md
  - docs/PROJECT_DECISIONS.md
  - .ai_project/source_of_truth.md
  - 보존 브랜치 wip/pre-develop-transition-20260728의 수익화 초안
created_by: Product Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-04
updated_at: 2026-08-04
report_to: .ai_project/reports/T-20260804-001_restore-monetization-source-of-truth-report.md
qa_to: .ai_project/qa/T-20260804-001_restore-monetization-source-of-truth-qa.md
---

# 수익화 Source of Truth와 후보 Task 복구

## 목적

기존 WIP 브랜치에 보존된 수익화 지침과 `T-20260728-010~018` 후보를 최신 `origin/develop` 정책에 맞춰 공식 복구한다. 복구는 실행 승인이 아니며 후보 Task는 모두 `proposed`로 유지한다.

## 성공 기준

- `CookLog_MONETIZATION.md`가 수익화 Source of Truth로 등록된다.
- T-010~018 개별 Task가 모두 `proposed`, 승인·lock 없음 상태로 복구된다.
- Core v1 Critical Path와 수익화 Workstream이 분리되고 상호 차단하지 않는다.
- T-010이 실제 지출·기여이익·손익분기점·사용량 위험을 비교하도록 정의된다.
- Apple 기기 내 STT 기본, 원격 STT 비활성·자동 fallback 없음 정책과 충돌하지 않는다.
- 핸즈프리 음성 명령을 Pro 전용 가치로 잘못 분류하지 않는다.
- WIP의 T-011 실행 이력과 디자인 산출물을 공식 완료 근거로 가져오지 않는다.
- Product QA Agent가 문서 링크, Task graph, 상태와 제품 정책 정합성을 독립 검증할 수 있다.

## 제외 범위

- T-010~018의 scope·실행·완료 전환
- 가격, quota, 체험과 출시 포함 여부의 최종 확정
- WIP Paywall 디자인·QA 결과의 develop 통합
- StoreKit, Backend entitlement와 관측성 구현
- App Store Connect 또는 외부 서비스 변경

## 상태 전이 기록

- 2026-08-04: Product Lead Agent가 누락된 공식 수익화 Source of Truth와 보존 WIP를 확인해 `proposed` Task로 정의했다.
- 2026-08-04: Product Owner가 최신 `origin/develop` 전용 worktree에서의 선택 복구를 승인해 `scoped -> approved`로 전환했다.
- 2026-08-04: Product Lead Agent가 후보 Task 상태 동결, 최신 STT·핸즈프리 정책, 비용 기반 T-010 기준을 반영해 `approved -> in_progress`로 실행했다.
- 2026-08-04: 파일·상태·의존성 자체 검증을 완료하고 `in_progress -> verification_ready`로 Product QA Agent에 인계했다.
- 2026-08-04: Product QA Agent가 기준 ref `origin/develop` `e4bab3a`와 검증 조건을 확인하고 `verification_ready -> verification_in_progress`로 전환했다.
- 2026-08-04: Product QA Agent가 수익화 정책과 상태 동결·Task graph는 통과했으나 Product 후보 3개의 scope Role 충돌 `PQA-HIGH-804-001`과 복구 Task 10개의 strict schema 실패 `PQA-HIGH-804-002`를 확인해 `verification_in_progress -> rework_requested`로 인계했다.
- 2026-08-04: Product Owner가 Product Lead Agent의 Product Team 한정 Lead Role 추가와 두 HIGH 결함 재작업을 승인했다.
- 2026-08-04: 최신 `origin/develop` SHA `a1fa8d0` 기반 새 worktree에서 Product Lead의 Product Team 한정 Lead Role·capability·상태 라우팅을 정합화하고 복구 Task 10개에 `schema: aiops.task.v1`을 추가했다. 동시 병합된 T-025·T-005와 Design T-002·T-014의 `done` 상태를 보존했다.
- 2026-08-04: `aiops validate task --strict` 10/10 통과와 상태·의존성·보드 자체 검증 후 `rework_requested -> verification_ready`로 Product QA Agent에 재인계했다.
- 2026-08-04: Product QA Agent가 최신 `origin/develop` `a1fa8d0`, 재작업 보고와 허용 경로를 확인하고 `verification_ready -> verification_in_progress`로 독립 재검증을 시작했다.
- 2026-08-04: Product QA Agent가 `PQA-HIGH-804-001~002` 해소, strict validation 10/10, 후보 상태 동결·Task graph와 최신 develop 무회귀를 확인해 `PASS`, `verification_in_progress -> verification_passed`로 Product Lead Agent에 인계했다.
- 2026-08-04: Product Lead Agent가 Product QA `PASS`, 성공 기준, 허용 경로, 최신 develop 정렬과 수익화 실행 동결 유지를 수용해 `verification_passed -> completion_review`로 전환했다.
- 2026-08-04: Product Owner가 최종 완료를 승인해 `completion_review -> done`으로 확정했다. commit·push·PR·merge는 별도 승인 전까지 대기한다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Product Lead Agent / Completion Role이야.
Task `T-20260804-001`의 develop 통합 승인을 준비해줘.

- 현재 상태: `done`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `a1fa8d0`
- 다음에 해야 할 일: Product Owner의 별도 통합 승인 후 commit·push·develop 대상 PR·squash merge를 진행한다.
- 기준 문서: Task의 `source_of_truth`, `.ai_project/workflow_overrides.md`, `.ai_project/operating_model.md`
- 허용 경로: Task의 `allowed_paths`
- 참고 산출물: `.ai_project/reports/T-20260804-001_restore-monetization-source-of-truth-report.md`, `.ai_project/qa/T-20260804-001_restore-monetization-source-of-truth-qa.md`
- 변경/검토 대상: T-20260804-001, T-010~018과 관련 보드
- 남은 리스크: 가격·quota는 T-010과 Product Owner 승인 전까지 가설이며 수익화 구현은 계속 동결
- 차단/결정 필요: commit·push·PR·merge 별도 승인
- 완료 결과: Product Lead 완료 리뷰와 Product Owner 최종 완료 승인으로 로컬 Task를 `done` 확정했다.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
