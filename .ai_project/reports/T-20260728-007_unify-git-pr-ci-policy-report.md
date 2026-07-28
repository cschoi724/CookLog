# T-20260728-007 작업 보고서

작성일: 2026-07-28
작성자: Development Lead Agent
Task: Git·PR·CI 운영 기준 단일화

## 결과

`feature_branch_pr`를 CookLog 공식 전략으로 확정하고 기존 `main` 직접 작업 절차를 Task branch, Pull Request, 독립 검증과 사용자 승인 기반 절차로 교체했다.

## 변경 범위

- `docs/GIT_WORKFLOW.md`
  - Task branch와 PR 기반 실제 작업 절차 정의
  - 문서 변경을 포함한 PR 범위, commit, review, merge와 예외 절차 정의
  - 초기 `ios-build` 및 후속 `ios-xctest` required check 승격 기준 정의
- `.ai_project/branch_pr_strategy.md`
  - 문서 PR, CI check 이름, squash merge, 자동 merge·force push 금지 명시
- `.ai_project/operating_model.md`
  - PR 적용 범위와 CI check 선택값 반영
  - Git 문서 동기화 질문을 해결 상태로 전환
- `.ai_project/source_of_truth.md`
  - 전략 선택값과 실제 절차 문서의 책임 경계 확정
- `docs/PROJECT_DECISIONS.md`
  - 기존 `main` 직접 작업 결정을 대체하고 새 결정을 기록
- `docs/PROJECT_CHANGELOG.md`
  - Git·PR·CI 기준 변경 이력 기록
- Task와 Project/Development board
  - 실행 상태와 검증 인계 반영

## 검증

- `git diff --check`
- 공식 기준 문서에서 `main` 직접 작업, `work/...` 임시 브랜치, unresolved Git 전략 문구 검색
- `feature_branch_pr`, `ios-build`, `ios-xctest`, 사용자 push·merge 승인 기준의 문서 간 정합성 비교
- Task `allowed_paths` 범위 확인

## 잔여 사항

- 실제 GitHub Actions workflow와 branch protection은 이 Task 범위가 아니다.
- `ios-build` workflow는 `T-20260728-008`에서 구축한 뒤 required check로 적용한다.
- `ios-xctest`는 `T-20260728-004`와 `T-20260728-008` 완료 후 Product Owner 승인으로 승격한다.
- `.ai_project/ops_issues.md`와 `.ai_project/ops_migration_plan.md`에는 당시 발견한 Git 문서 충돌이 역사적 이슈로 남아 있다. 두 파일은 이 Task의 `allowed_paths` 및 현재 Git Source of Truth가 아니므로 수정하지 않았으며 AI Ops 정리 대상으로 인계한다.
- Task 브랜치는 `ops/role-routing-adjustment`의 정리 커밋 `b406b74`에서 분기했다. 해당 운영 변경이 `main`에 먼저 반영되지 않으면 PR 전에 최신 `main` 기준 재정렬이 필요하다.

## 다음 Agent에게 전달할 말

```text
Task: T-20260728-007
현재 상태: verification_ready
검증 담당: iOS QA Agent
확인 대상:
- docs/GIT_WORKFLOW.md와 .ai_project/branch_pr_strategy.md의 절차 일치
- PROJECT_DECISIONS의 기존 결정 대체 관계
- operating_model/source_of_truth의 unresolved 충돌 제거 여부
- ios-build와 ios-xctest 승격 조건
- push, PR, merge 사용자 승인 경계
검증 제외:
- GitHub Actions 실제 실행
- branch protection 외부 설정
- 앱 기능 회귀
검증 결과 위치:
- .ai_project/qa/T-20260728-007_unify-git-pr-ci-policy-qa.md
```
