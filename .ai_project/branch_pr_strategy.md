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
  review_required: true
  self_approval_allowed: false
  ci_required: pending_ci_setup
```

CI가 준비되기 전에는 Task에 지정된 빌드·테스트·수동 QA 결과를 PR에 기록한다.

## 4. Merge Rules

```yaml
merge:
  method: squash
  delete_branch_after_merge: true
  default_branch_direct_push: false
  user_approval_required: true
```

## 5. Migration Note

`docs/GIT_WORKFLOW.md`는 2026-08-05 Product Owner 승인에 따라 이 문서의 `feature_branch_pr`, 사용자 push·merge 승인, `main` 직접 push 금지 기준과 동기화했습니다.

## 6. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-27 | 멀티팀 병렬 운영을 위한 `feature_branch_pr` 전략 기록 |
| 2026-08-05 | `docs/GIT_WORKFLOW.md` 동기화 완료 기록 |
