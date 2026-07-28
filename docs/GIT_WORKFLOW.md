# CookLog Git Workflow

최종 업데이트: 2026-07-28
상태: 확정

이 문서는 CookLog 저장소에서 사람이 실제로 수행하는 Git·PR 절차의 최종 기준입니다. 전략 선택값은 `.ai_project/branch_pr_strategy.md`에 기록하며, 두 문서는 서로 일치해야 합니다.

## 1. 공식 전략

CookLog는 `feature_branch_pr` 전략을 사용합니다.

- 기본 브랜치는 `main`입니다.
- 모든 추적 변경은 승인된 Task 단위 브랜치에서 수행합니다.
- 코드, 설정, 디자인 산출물과 문서 변경 모두 Pull Request를 거칩니다.
- `main` 직접 commit과 push는 허용하지 않습니다.
- push와 merge는 Product Owner의 승인을 받은 뒤 수행합니다.
- 긴급 수정 등 예외는 Product Owner의 명시적 승인과 사유 기록이 있을 때만 허용합니다.

## 2. Task 브랜치

브랜치 이름은 다음 형식을 사용합니다.

```text
task/<task-id>-<slug>
```

예:

```text
task/T-20260728-007-unify-git-pr-ci-policy
```

브랜치는 Task가 `approved` 상태이고 선행 의존성이 해소된 뒤 생성합니다. 동시에 진행되는 다른 Task의 미커밋 변경이 있으면 별도 worktree를 사용해 변경을 분리합니다.

## 3. 기본 작업 흐름

```text
Task 승인
-> Task 브랜치 생성
-> in_progress 및 lock 획득
-> 변경과 개발자 검증
-> verification_ready
-> Pull Request와 독립 검증
-> verification_passed
-> Development Lead merge 판단
-> Product Owner merge 승인
-> squash merge
-> completion_review 및 done
-> 작업 브랜치 삭제
```

Task 시작 전 확인:

```bash
git status -sb
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c task/T-YYYYMMDD-NNN-short-slug
```

다른 Task의 변경이 현재 작업 폴더에 남아 있으면 checkout이나 stash로 이동하지 않습니다. 해당 변경을 보존한 채 별도 worktree 또는 깨끗한 clone을 사용합니다.

## 4. 커밋 기준

- 하나의 커밋은 하나의 명확한 목적을 가집니다.
- Task ID와 변경 성격을 커밋 메시지에서 확인할 수 있게 합니다.
- 문서 변경과 코드 변경은 검토 가치가 다르면 분리합니다.
- 관련 없는 정리나 사용자 변경을 포함하지 않습니다.
- 가능한 범위에서 build 또는 검증이 성공한 상태로 커밋합니다.

권장 형식:

```text
<type>: <한글 요약> (<task-id>)
```

예:

```text
docs: Git PR 운영 기준 단일화 (T-20260728-007)
```

주요 타입은 `feat`, `fix`, `docs`, `design`, `refactor`, `test`, `chore`를 사용합니다.

## 5. Push와 Pull Request

원격 push는 Product Owner 승인 후 수행합니다. 승인 없이 push, PR 생성 또는 원격 설정 변경을 하지 않습니다.

PR에는 다음 내용을 포함합니다.

```text
Task:
Scope:
Changed paths:
Validation:
Risks:
Handoff:
```

PR 원칙:

- 모든 추적 변경은 PR 대상입니다.
- 구현 담당자는 자신의 변경을 독립 검증 완료로 판정할 수 없습니다.
- 지정된 Verification Role이 diff, 검증 결과와 잔여 위험을 확인합니다.
- PR에는 Task 보고서와 QA 결과 또는 해당 경로를 연결합니다.
- 범위를 벗어난 변경은 분리하거나 명시적으로 승인받습니다.

## 6. CI와 required check

초기 required check 이름은 다음과 같이 고정합니다.

| Check | 초기 상태 | 실패 처리 |
|---|---|---|
| `ios-build` | 구축 후 required | 실패 시 merge 금지 |
| `ios-xctest` | 승격 대기 | 안정화 전 수동·선별 테스트 결과를 PR에 기록 |

적용 순서:

1. `T-20260728-004`에서 전체 XCTest 실행 기준과 timeout을 확정합니다.
2. `T-20260728-008`에서 GitHub Actions의 `ios-build`와 `ios-xctest` workflow를 구현합니다.
3. CI 검증 후 `ios-build`를 branch protection required check로 적용합니다.
4. 전체 XCTest가 반복 가능하게 종료되면 Product Owner 승인 후 `ios-xctest`도 required check로 승격합니다.

CI가 아직 구축되지 않은 동안에는 Task에 지정된 build, test, 수동 QA 결과를 PR 본문에 기록하며, 검증 실패나 결과 누락이 있으면 merge하지 않습니다.

## 7. Review와 merge

merge 조건:

- Task가 `verification_passed` 또는 승인된 동등 상태입니다.
- 독립 검증 결과와 잔여 위험이 기록되어 있습니다.
- required check가 모두 통과했습니다.
- 기본 브랜치와 충돌이 없습니다.
- Development Lead Agent가 merge 가능하다고 판단했습니다.
- Product Owner가 merge를 승인했습니다.

merge 방식은 squash로 통일하며, merge 후 Task 브랜치를 삭제합니다. 자동 merge와 force push는 기본적으로 허용하지 않습니다.

## 8. 문서 변경과 예외

문서만 변경하는 Task도 동일한 branch와 PR 흐름을 따릅니다. 다음과 같은 예외가 필요하면 작업 전에 Product Owner 승인을 받고 Task 또는 결정 문서에 사유를 기록합니다.

- 긴급 장애 대응
- 외부 시스템에서 즉시 반영해야 하는 보안 조치
- 브랜치 또는 PR 인프라 자체가 동작하지 않는 경우

예외 상황에서도 독립 검증과 사후 기록은 생략하지 않습니다.

## 9. 작업 종료 체크리스트

- [ ] 변경 경로가 Task의 `allowed_paths` 안에 있음
- [ ] 사용자 변경사항과 다른 Task 변경을 보존함
- [ ] 관련 문서와 Task 보고서를 갱신함
- [ ] 지정된 build, test 또는 문서 검증 결과를 기록함
- [ ] Task를 `verification_ready`로 전환하고 lock을 해제함
- [ ] Product Owner 승인 후 push와 PR 생성
- [ ] 독립 검증 및 required check 통과
- [ ] Product Owner 승인 후 squash merge
- [ ] 완료 확정 후 작업 브랜치 삭제

## 10. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-06-22 | 1인 개발 기준 `main` 직접 작업 절차 작성 |
| 2026-07-28 | `T-20260728-007` 승인에 따라 Task branch·PR·독립 검증·사용자 승인 기반 절차로 전환 |
