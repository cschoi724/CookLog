# CookLog Branch and PR Strategy

작성일: 2026-07-27
프로젝트: CookLog
상태: Active

## 1. Selected Strategy

```yaml
branch_strategy:
  model: develop_integration_pr
  default_branch: develop
  task_base_branch: develop
  task_pr_base: develop
  stable_branch: main
  promotion_flow: "develop -> main"
  task_branch_pattern: "task/<task-id>-<slug>"
  hotfix_branch_pattern: "hotfix/<task-id>-<slug>"
```

## 2. Role Permissions

```yaml
permissions:
  commit_owner: Execution Role
  commit_timing: after_task_unit
  push_policy: with_user_approval
  pr_creator: Execution Role
  pr_reviewer: Verification Role
  task_merge_recommender: Development Lead Agent
  main_promotion_acceptance: Product Lead Agent
  merge_approval: Product Owner
```

## 3. Pull Request Rules

```yaml
pull_request:
  required: true
  docs_included: true
  review_required: true
  self_approval_allowed: false
  task_target: develop
  promotion_target: main
  main_allowed_sources:
    - develop
    - hotfix/*
  ci_required_target:
    - ios-build
    - ios-xctest
  ci_required_applied:
    develop:
      - ios-build
      - ios-xctest
    main:
      - ios-build
      - ios-xctest
  ci_required_source:
    integration: GitHub Actions
    integration_id: 15368
  ci_external_status: verification_ready
```

`ios-build`와 `ios-xctest`는 두 branch의 required check 목표다. 2026-08-04
`develop` ruleset `20340678`을 active로 적용하고 PR #57에서 대기 중 `BLOCKED`, 두
check 성공 뒤 `CLEAN`을 확인했다. 같은 규칙을 `main` ruleset `20344405`로 확대했다.
단일 collaborator 운영에서는 approval을 0으로 두되 PR과 두 check를 필수화하고 상시
bypass actor는 두지 않는다. 독립 QA 재작업에서 두 check source를 GitHub Actions 앱
`15368`로 고정하고 validation PR #58의 실패 `BLOCKED`와 복구 `CLEAN`을 확인했다.

## 4. Merge Rules

```yaml
merge:
  method: squash
  delete_task_and_hotfix_branch_after_merge: false
  cleanup_requires_safety_audit: true
  cleanup_requires_product_owner_approval: true
  keep_develop_branch: true
  protected_long_lived_branches:
    - develop
    - main
  direct_push: false
  user_approval_required: true
  automatic_merge: false
  force_push: false
  hotfix_backport_to_develop: required
```

Task·hotfix branch와 worktree는 merge 직후 자동 삭제하지 않는다. 미커밋 변경,
untracked 파일, 미push commit, 열린 PR, squash merge와 patch 동등성, 검증 재현
용도와 보존 WIP를 비파괴 감사한 뒤 정리 후보로 전환하며, Product Owner의 별도
승인을 받은 대상만 제거한다.

## 5. Exception Rules

- 코드, 설정, 디자인 산출물과 추적되는 문서 변경은 모두 Task branch와 PR을 사용한다.
- 일반 Task는 `develop`에서 분기해 `develop`로 PR을 보낸다.
- `main` 대상 PR은 `develop -> main` 승격 또는 승인된 `hotfix/*`로 제한한다.
- hotfix는 `main` 병합 직후 `develop`에 backport한다.
- 긴급 수정 등 예외는 Product Owner의 명시적 사전 승인과 사유 기록이 필요하다.
- 예외 상황에서도 독립 검증과 사후 기록은 유지한다.

## 6. Procedure Source

실제 명령, 커밋, PR 내용, CI 승격과 merge 절차는 `docs/GIT_WORKFLOW.md`를 따른다.

## 7. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-27 | 멀티팀 병렬 운영을 위한 `feature_branch_pr` 전략 기록 |
| 2026-07-28 | `T-20260728-007` 승인에 따라 문서 PR, 초기 `ios-build`, `ios-xctest` 승격 조건과 예외 기준 확정 |
| 2026-07-28 | `T-20260728-019` 승인에 따라 `develop_integration_pr`와 `develop -> main` 승격·hotfix backport 기준 적용 |
| 2026-07-31 | `T-20260731-002`에 따라 merge 직후 자동 삭제를 금지하고 안전 감사·Product Owner 별도 승인 후 정리하도록 변경 |
| 2026-08-03 | `T-20260730-006` 실행에서 required check 목표와 실제 미적용 상태, private repository 플랜 차단을 분리 기록 |
