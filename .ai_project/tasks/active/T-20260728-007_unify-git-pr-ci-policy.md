---
id: T-20260728-007
title: Git·PR·CI 운영 기준 단일화
status: verification_ready
type: docs
priority: P0
priority_reason: main 직접 작업과 feature branch PR 전략이 충돌해 첫 신규 코드 Task 전에 기준 확정이 필요하다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: docs
target_agent: iOS QA Agent
target_role: Verification Role
required_capabilities:
  - ios_qa
  - regression_test
depends_on: []
blocks:
  - T-20260728-008
  - T-20260728-009
parallel_group: ios-m8-and-foundations
allowed_paths:
  - docs/GIT_WORKFLOW.md
  - docs/PROJECT_DECISIONS.md
  - docs/PROJECT_CHANGELOG.md
  - .ai_project/branch_pr_strategy.md
  - .ai_project/operating_model.md
  - .ai_project/source_of_truth.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
source_of_truth:
  - docs/GIT_WORKFLOW.md
  - docs/PROJECT_DECISIONS.md
  - .ai_project/branch_pr_strategy.md
  - .ai_project/operating_model.md
created_by: Product Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
report_to: .ai_project/reports/T-20260728-007_unify-git-pr-ci-policy-report.md
qa_to: .ai_project/qa/T-20260728-007_unify-git-pr-ci-policy-qa.md
---

# Git·PR·CI 운영 기준 단일화

## 목적

현재 충돌하는 Git 운영 문서를 하나의 승인된 기준으로 통합하고 CI required check와 merge gate를 정의한다.

## 제안 범위

- `main` 직접 작업과 `feature_branch_pr` 전략 비교
- 브랜치 명명, PR 필수 여부, 리뷰, squash merge와 삭제 정책 확정
- build, test, 문서 검증의 required check 후보 정의
- push, merge, 배포 승인 경계 명시
- 관련 Source of Truth와 운영 문서 동기화

## 확정 실행 범위

Development Lead Agent가 ownership, 실행 경로와 의존성을 확인했으며, Product Owner가 2026-07-28 다음 권장안으로 실행을 승인했다.

- `feature_branch_pr`를 CookLog의 공식 Git 전략으로 채택한다.
- 코드, 설정, 디자인 산출물과 추적되는 문서 변경은 Task branch와 PR을 기본으로 한다.
- Task branch는 `task/<task-id>-<slug>` 형식을 사용한다.
- PR은 독립 검증 결과를 포함하고 squash merge 후 작업 브랜치를 삭제한다.
- push와 merge는 사용자 승인 후 수행하며 `main` 직접 push는 허용하지 않는다.
- CI 초기 required check는 iOS build로 시작한다.
- 전체 XCTest는 `T-20260728-004`에서 실행 안정화가 확인되고 `T-20260728-008`에서 CI가 구축된 뒤 required check로 승격한다.
- 긴급 수정 등 기본 흐름의 예외는 Product Owner의 명시적 승인과 사유 기록이 있을 때만 허용한다.
- 이 Task는 운영 문서 단일화만 수행하며 CI workflow 구현은 `T-20260728-008`에서 처리한다.

## 성공 기준

- Git 전략을 설명하는 기준 문서 사이에 충돌이 없다.
- Task branch, PR, review, required check, merge 승인 절차가 명확하다.
- CI 구축 Task가 사용할 check 이름과 실패 처리 기준이 정의된다.
- 사용자 승인 없이 push, merge, 배포하지 않는 원칙이 유지된다.

## 확정된 사용자 결정

- `feature_branch_pr`를 공식 전략으로 채택한다.
- 문서 변경에도 PR을 필수로 한다.
- 초기 required check는 `ios-build`로 시작하고 `ios-xctest`는 안정화 후 승격한다.

## Coordination 메모

- Development Lead Agent가 기술·merge 기준을 정리하고 Product Lead Agent가 제품 운영 문서 충돌과 승인 준비를 검토한다.

## 상태 전이 기록

- 2026-07-28: Development Lead Agent가 ownership, 허용 경로, 기준 문서, 의존성과 성공 기준을 확인하고 `proposed -> scoped`로 조율했다.
- 2026-07-28: Product Owner가 권장 Git·PR·CI 기준으로 실행을 승인해 `scoped -> approved`로 전환했다.
- 2026-07-28: Development Lead Agent가 전용 Task branch와 lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-07-28: 정책 문서 단일화, 작업 보고와 개발자 검증을 완료하고 lock을 해제한 뒤 iOS QA Agent에 `verification_ready`로 인계했다.
