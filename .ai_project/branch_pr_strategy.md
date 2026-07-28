# CookLog Branch and PR Strategy

작성일: 2026-07-27
프로젝트: CookLog
상태: Active

## 1. Selected Strategy

```yaml
branch_strategy:
  model: feature_branch_pr
  base_branch: main
  task_branch_pattern: "task/<task-id>-<slug>"
```

## 2. Role Permissions

```yaml
permissions:
  commit_owner: Execution Role
  commit_timing: after_task_unit
  push_policy: with_user_approval
  pr_creator: Execution Role
  pr_reviewer: Verification Role
  merge_recommender: Development Lead Agent
  merge_approval: Product Owner
```

## 3. Pull Request Rules

```yaml
pull_request:
  required: true
  docs_included: true
  review_required: true
  self_approval_allowed: false
  ci_required:
    - ios-build
  ci_pending_promotion:
    - ios-xctest
```

`ios-build`와 `ios-xctest`의 실제 workflow는 `T-20260728-008`에서 구축한다. 구축 전에는 Task에 지정된 빌드·테스트·수동 QA 결과를 PR에 기록한다. `ios-xctest`는 `T-20260728-004`에서 실행 안정화가 확인된 뒤 Product Owner 승인으로 required check에 승격한다.

## 4. Merge Rules

```yaml
merge:
  method: squash
  delete_branch_after_merge: true
  default_branch_direct_push: false
  user_approval_required: true
  automatic_merge: false
  force_push: false
```

## 5. Exception Rules

- 코드, 설정, 디자인 산출물과 추적되는 문서 변경은 모두 Task branch와 PR을 사용한다.
- 긴급 수정 등 예외는 Product Owner의 명시적 사전 승인과 사유 기록이 필요하다.
- 예외 상황에서도 독립 검증과 사후 기록은 유지한다.

## 6. Procedure Source

실제 명령, 커밋, PR 내용, CI 승격과 merge 절차는 `docs/GIT_WORKFLOW.md`를 따른다.

## 7. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-27 | 멀티팀 병렬 운영을 위한 `feature_branch_pr` 전략 기록 |
| 2026-07-28 | `T-20260728-007` 승인에 따라 문서 PR, 초기 `ios-build`, `ios-xctest` 승격 조건과 예외 기준 확정 |
