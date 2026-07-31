---
schema: aiops.task.v1
id: T-20260731-003
title: GitHub Actions 사용량 절감 및 실행 정책 최적화
status: proposed
type: ops
priority: P1
priority_reason: Actions 사용량 90% 경고에 대응하고 iOS CI를 필요한 변경에만 실행해야 한다.
org_unit: Core Development Team
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities:
- workflow_governance
- ios_qa
depends_on:
- T-20260730-005
blocks:
- T-20260730-006
parallel_group:
allowed_paths:
- ".github/workflows/ios-build.yml"
- ".github/workflows/ios-xctest.yml"
- docs/GIT_WORKFLOW.md
- apps/ios/docs/TESTING.md
- ".ai_project/tasks/backlog/T-20260731-003_optimize-github-actions-usage.md"
- ".ai_project/tasks/active/T-20260731-003_optimize-github-actions-usage.md"
- ".ai_project/reports/T-20260731-003_optimize-github-actions-usage-report.md"
- ".ai_project/qa/T-20260731-003_optimize-github-actions-usage-qa.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
source_of_truth:
- docs/GIT_WORKFLOW.md
- apps/ios/docs/TESTING.md
- .github/workflows/ios-build.yml
- .github/workflows/ios-xctest.yml
created_by: Development Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-31
updated_at: 2026-07-31
report_to: ".ai_project/reports/T-20260731-003_optimize-github-actions-usage-report.md"
qa_to: ".ai_project/qa/T-20260731-003_optimize-github-actions-usage-qa.md"
---

# GitHub Actions 사용량 절감 및 실행 정책 최적화

## 목표

문서·Backend·Design PR에서 불필요한 iOS macOS workflow를 줄이고, 필요한 iOS 변경에만
검증을 실행해 Actions 사용량을 낮춘다. 기존 required check의 품질과 독립 QA 경계는
유지한다.

## 작업 패키지 및 담당

| 패키지 | 범위 | 담당 |
|---|---|---|
| WP-1 | `paths`/`paths-ignore`로 iOS 관련 변경만 build·XCTest 실행 | iOS Agent |
| WP-2 | 완료 기록·문서 전용 PR에서 iOS workflow 제외 | iOS Agent |
| WP-3 | Backend·Design 변경에서 iOS workflow 제외 | iOS Agent |
| WP-4 | PR별 concurrency 취소 정책 점검·강화 | iOS Agent |
| WP-5 | iOS build와 XCTest workflow trigger·조건 분리 및 회귀 검증 | iOS Agent |
| WP-6 | 재실행·수동 전체 회귀·야간 실행 정책과 문서화 | AI Ops Agent |
| WP-7 | 사용량 모니터링·Budget 경고·운영 절차와 T-006 required check 정합성 | AI Ops Agent |

## 성공·검증 기준

- iOS와 무관한 PR은 `ios-build`, `ios-xctest`를 실행하지 않는다.
- iOS 코드·workflow 변경 PR은 두 required check를 계속 실행한다.
- 동일 PR의 새 커밋이 이전 실행을 취소한다.
- 완료 기록 PR은 중복 iOS 실행 없이 문서 검증만 수행한다.
- 수동·야간 전체 회귀 절차와 재실행 기준이 문서화된다.
- iOS QA Agent가 positive/negative path와 check 누락을 독립 검증한다.
- AI Ops Agent가 사용량·Budget·required check 정책의 운영 정합성을 검증한다.
- T-005에서 확인한 실패 65·timeout 124·artifact 경계에 회귀가 없다.

## 실행 순서

WP-1~WP-4를 먼저 적용해 사용량을 즉시 줄이고, WP-5~WP-7을 순차 검증한다.
Product Owner의 실행 승인 전 workflow와 repository 설정을 변경하지 않는다.

## AI Ops Agent 인계

너는 AI Ops Agent / Ops Governance Role이다. iOS Agent가 workflow 파일을 수정하는 동안
다음 WP-6~7만 별도 worktree·branch에서 병렬 수행한다.

- WP-6: 재실행 기준, 문서·Backend·Design PR의 CI 제외 정책, 수동·야간 전체 회귀 절차를
  `docs/GIT_WORKFLOW.md`와 관련 운영 문서에 기록한다.
- WP-7: Actions 사용량 모니터링, Budget 50/75/90% 경고, quota 소진 시 중지 절차와
  T-20260730-006 required check 운영 정합성을 정의한다.
- iOS workflow YAML과 `apps/ios/` 파일은 수정하지 않는다.
- iOS Agent branch에 직접 commit하거나 공용 보드를 병렬 수정하지 않는다.
- 완료 시 정책 문서, rollback 절차, 사용량 확인 방법, `git diff --check` 결과를
  Development Lead에 보고하고 독립 Ops 검증을 요청한다.
