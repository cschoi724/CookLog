---
schema: aiops.task.v1
id: T-20260731-001
title: 활성 문서 Source of Truth 정합성 복구
status: verification_ready
type: docs
priority: P0
priority_reason: 최신 제품 정책과 완료된 Design·Backend·CI 결과가 루트·운영·iOS·디자인 안내 문서에 반영되지 않아
  후속 Agent가 잘못된 범위를 구현할 위험이 있다.
org_unit: Product Division
team: Product Team
team_lead: Product Lead Agent
workflow: docs
target_agent: Product QA Agent
target_role: Verification Role
required_capabilities:
- product_documentation
- cross_domain_reconciliation
- source_of_truth_governance
- independent_validation
depends_on:
- T-20260729-026
- T-20260729-011
- T-20260729-020
- T-20260730-003
blocks:
- T-20260728-003
parallel_group: documentation-reconciliation
allowed_paths:
- agents.md
- ".ai_project/operating_model.md"
- ".ai_project/current_context.md"
- ".ai_project/source_of_truth.md"
- ".ai_project/new_clone_handoff.md"
- ".ai_project/task_board.md"
- ".ai_project/teams/product/task_board.md"
- ".ai_project/teams/design/team_context.md"
- ".ai_project/teams/development/team_context.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/team_context.md"
- ".ai_project/teams/quality/task_board.md"
- ".ai_project/agent_registry.md"
- ".ai_project/ops_issues.md"
- ".ai_project/ops_migration_plan.md"
- ".ai_project/tasks/"
- ".ai_project/reports/"
- ".ai_project/qa/"
- docs/PROJECT_STATUS.md
- docs/PROJECT_CHANGELOG.md
- docs/PROJECT_DECISIONS.md
- docs/product/CookLog_PRD_v2.md
- design/README.md
- design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
- apps/ios/agents.md
- apps/ios/docs/STATUS.md
- apps/ios/docs/DEVELOPMENT_PLAN.md
- apps/ios/docs/DEVELOPMENT_SPEC.md
- apps/ios/docs/ARCHITECTURE.md
- apps/ios/docs/SERVICES.md
- apps/ios/docs/DECISIONS.md
- apps/ios/docs/CHANGELOG.md
source_of_truth:
- ".ai_project/source_of_truth.md"
- ".ai_project/task_board.md"
- docs/product/CookLog_PRODUCT.md
- docs/product/CookLog_PRD_v2.md
- docs/product/CookLog_MVP_SCOPE.md
- docs/product/CookLog_USER_FLOW.md
- docs/product/CookLog_ROADMAP.md
- docs/PROJECT_DECISIONS.md
created_by: Product Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-31
updated_at: '2026-07-31'
report_to: ".ai_project/reports/T-20260731-001_reconcile-active-document-source-of-truth-report.md"
qa_to: ".ai_project/qa/T-20260731-001_reconcile-active-document-source-of-truth-qa.md"
---

# 활성 문서 Source of Truth 정합성 복구

## 목적

첫 공개 출시 제품 정책과 최신 `develop`의 완료 결과를 활성 안내 문서에 일관되게 반영하고, 변동 가능한 세부 정책이 루트 Agent 안내에 중복되지 않도록 문서 책임 경계를 복구한다.

## 실행 범위

1. 루트 `agents.md`를 역할·탐색 경로·우선순위 규칙 중심으로 축소한다.
2. iOS Agent·계획·스펙·서비스·상태 문서의 구형 Core MVP 범위와 첫 공개 출시 범위를 구분한다.
3. Design 문서의 UI Source of Truth를 로컬 Prototype·Manifest 우선, Figma 미러로 통일한다.
4. 운영 컨텍스트·Source of Truth·Project Status에 최신 Design·Backend·CI 완료 상태를 반영한다.
5. 2026-06-22 PDF를 현재 제품 계약이 아닌 역사적 스냅샷으로 명확히 표시한다.

## 제외 범위

- 제품 정책 변경
- 앱·Backend·Design Prototype 구현 변경
- 다른 Task의 상태 전이
- Backend provider·runtime 최종 선택
- T-012 이후 디자인 결과 선반영

## 성공 기준

- 루트 `agents.md`에 STT·핸즈프리·검색 같은 변동 가능한 제품 세부사항이 남지 않는다.
- 활성 iOS 문서가 로컬 검색, 진행 기록 저장과 첫 공개 출시 핸즈프리를 제외 기능으로 오인시키지 않는다.
- Design 문서가 Figma를 공식 원본으로 안내하지 않는다.
- 운영 문서가 완료된 XCTest 안정화, CI workflow와 최근 Task 상태를 미완료로 안내하지 않는다.
- Backend T-020 결정안 완료와 provider·runtime 최종 승인 대기를 구분한다.
- PDF와 Markdown PRD의 권위·시점 차이가 모든 활성 참조에서 명확하다.
- 링크·Task schema·Task graph·`git diff --check`와 충돌 문구 scan을 통과한다.
- Product QA Agent가 문서 정합성과 후속 Agent 오해 가능성을 독립 검증한다.

## 상태 전이 기록

- 2026-07-31: Product Owner가 1~5번 문서 정합성 범위를 Product Lead Agent가 전담하도록 승인했다.
- 2026-07-31: Product Lead Agent가 최신 `origin/develop` 전용 worktree에서 Task를 등록하고 `proposed -> scoped -> approved -> in_progress`로 실행을 시작했다.
- 2026-07-31: Product Owner 승인에 따라 로컬 문서 커밋을 생성하고 최신 `origin/develop`을 병합했다.
- 2026-07-31: 최신 상태 재집계·링크·strict Task·Backend 계약·diff 검증을 마치고 `in_progress -> verification_ready`로 Product QA Agent에 인계했다.
- 2026-07-31: Product QA Agent가 활성 Team context·Board·Product QA routing·최신 develop 정렬 결함 4건을 확인해 `verification_ready -> verification_in_progress -> rework_requested`로 인계했다.
- 2026-07-31: Product Owner가 필수 재작업 4건과 운영·Team context 추가 경로를 승인해 Product Lead Agent가 `rework_requested -> approved -> in_progress`로 재작업을 시작했다.
- 2026-07-31: 최신 `origin/develop` `22fe75f`를 병합하고 T-20260730-004의 실제 `completion_review` 상태를 보존했다.
- 2026-07-31: 후속 최신 `origin/develop` `0fdfe52`를 병합하고 T-20260730-004의 최종 `done` 확정을 반영했다.
- 2026-07-31: Product QA 필수 결함 4건의 승인 재작업과 Task graph·충돌 문구·계약·링크 검증을 마치고 `in_progress -> verification_ready`로 Product QA Agent에 재인계했다.
- 2026-07-31: Product QA 재검증에서 PQA-HIGH-031-001·004와 PQA-MEDIUM-031-003 해소를 확인했으나 Development Board의 T-004 완료 검토 문구가 남아 `verification_ready -> verification_in_progress -> rework_requested`로 재인계했다.
- 2026-07-31: Product Owner가 잔여 PQA-HIGH-031-002 재작업을 승인해 Product Lead Agent가 `rework_requested -> approved -> in_progress`로 수정했다.
- 2026-07-31: Development Board의 T-008 상위 행과 T-004 현재 설명을 최종 `done`으로 단일화하고 자체 검증 후 `in_progress -> verification_ready`로 Product QA Agent에 재재검증을 요청했다.

## Next Agent Handoff

```text
너는 Product QA Agent / Verification Role이야.
T-20260731-001의 PQA-HIGH-031-002 잔여 재작업을 독립 재재검증해줘.

- 현재 상태: verification_ready
- 다음에 해야 할 일: Development Team Board에서 T-004 현재 상태가 `done`으로만 해석되는지 확인하고 기존 해소 3건의 무회귀를 검증해줘.
- 기준 문서: .ai_project/source_of_truth.md, 개별 Task 파일, 최신 제품 문서
- 참고 산출물: .ai_project/reports/T-20260731-001_reconcile-active-document-source-of-truth-report.md, .ai_project/qa/T-20260731-001_reconcile-active-document-source-of-truth-qa.md
- 변경/검토 대상: `.ai_project/teams/development/task_board.md`와 상태 인계 문서
- 검증 기준: 상위 T-20260728-008 행은 T-001~004 완료·T-005~006 대기이며 T-004 현재 본문에는 `완료 검토`, `최종 완료 확정 대기`가 없음
- 승인 범위: Product Owner가 운영·Team context 추가 경로와 필수 재작업 4건을 승인
- 금지: Product QA 재재검증 전 T-20260728-003 차단 해제, 구현 코드 수정, commit·push·PR·merge
```

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-31 | Product QA Agent | transition: verification_ready -> verification_in_progress | 활성 문서 Source of Truth 정합성 독립 검증 시작 |
| 2026-07-31 | Product QA Agent | lock | task lock |
| 2026-07-31 | Product QA Agent | transition: verification_in_progress -> rework_requested | 활성 Team context와 운영 이슈·Task Board에 구형 Figma·Backend·CI 상태가 남고 Product QA routing이 불완전하여 Product Lead 재작업 필요 |
| 2026-07-31 | Product QA Agent | unlock | task unlock |
| 2026-07-31 | Product QA Agent | transition: verification_ready -> verification_in_progress | 승인 재작업 4건 독립 재검증 시작 |
| 2026-07-31 | Product QA Agent | lock | task lock |
| 2026-07-31 | Product QA Agent | transition: verification_in_progress -> rework_requested | PQA-HIGH-031-002 미해소: Development Board가 T-004를 done과 완료 확정 대기로 동시에 안내 |
| 2026-07-31 | Product QA Agent | unlock | task unlock |
