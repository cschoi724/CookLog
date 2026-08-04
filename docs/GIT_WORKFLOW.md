# CookLog Git Workflow

최종 업데이트: 2026-07-31
상태: 확정

이 문서는 CookLog 저장소에서 사람이 실제로 수행하는 Git·PR 절차의 최종 기준입니다. 전략 선택값은 `.ai_project/branch_pr_strategy.md`에 기록하며, 두 문서는 서로 일치해야 합니다.

## 1. 공식 전략

CookLog는 `develop_integration_pr` 전략을 사용합니다.

- 기본 작업 브랜치는 `develop`입니다.
- 안정·릴리즈 브랜치는 `main`입니다.
- 모든 추적 변경은 승인된 Task 단위 브랜치에서 수행합니다.
- 코드, 설정, 디자인 산출물과 문서 변경 모두 Pull Request를 거칩니다.
- 일반 Task 브랜치는 최신 `develop`에서 생성하고 PR 대상도 `develop`로 합니다.
- `main`과 `develop` 직접 commit과 push는 허용하지 않습니다.
- `develop -> main`은 통합 검증이 끝난 릴리즈 가능한 변경 묶음만 승격합니다.
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

브랜치는 Task가 `approved` 상태이고 선행 의존성이 해소된 뒤 최신 `origin/develop`에서 생성합니다. 동시에 진행되는 다른 Task의 미커밋 변경이 있으면 별도 worktree를 사용해 변경을 분리합니다.

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
-> develop에 squash merge
-> completion_review 및 done
-> 미커밋·미push·PR 상태와 patch 동등성 확인
-> 정리 후보 전환
-> Product Owner 정리 승인 후 worktree·작업 브랜치 제거
```

Task 시작 전 확인:

```bash
git status -sb
git branch --show-current
git fetch origin develop
git rev-parse --short origin/develop
git worktree add -b task/T-YYYYMMDD-NNN-short-slug <WORKTREE_PATH> origin/develop
```

다른 Task의 변경이 현재 작업 폴더에 남아 있으면 checkout이나 stash로 이동하지 않습니다. 해당 변경을 보존한 채 별도 worktree 또는 깨끗한 clone을 사용합니다.

### 공용 상태와 로컬 실행 상태

- 공용 현재 상태는 fetch를 마친 최신 `origin/develop`입니다.
- 루트 WIP, 로컬 `develop`, Task worktree의 문서는 해당 브랜치 시점의 스냅샷입니다.
- 다른 Task의 착수·의존성·차단 해제 판단은 다음처럼 공용 문서를 직접 조회합니다.

```bash
git show origin/develop:.ai_project/task_board.md
git show origin/develop:<TASK_FILE>
```

- PR 병합 전 로컬 `done`은 공용 완료가 아닙니다.
- `approved`, dependency·blocks 변경, `rework_requested`, 최종 `done`, 후속 Task 차단 해제는 `develop` 병합 후에만 공용 효력이 있습니다.
- `in_progress`와 로컬 검증 진행 상태는 다른 Task의 의존성을 해제하지 않습니다.
- 모든 상태 보고에는 `public_source: origin/develop@<SHA>`와 worktree, branch, local HEAD, 공용·로컬 Task 상태, 미커밋 여부를 포함합니다.
- fetch 또는 SHA 확인에 실패하면 `PUBLIC_STATE_UNVERIFIED`로 보고하고 공용 상태 판단을 중단합니다.

기존 worktree에서 작업을 시작하거나 재개하기 전에는 다음을 추가로 확인합니다.

```bash
git rev-list --left-right --count origin/develop...HEAD
git merge-base --is-ancestor origin/develop HEAD
```

새 worktree 또는 아직 변경하지 않은 깨끗한 worktree가 최신 `origin/develop`을 포함하지 않으면 최신 기준으로 다시 준비합니다. 이미 실행 중이거나 미커밋 변경이 있는 worktree가 최신 기준을 포함하지 않으면 변경을 보존하고 중단 보고하며, 자동 `reset`, `rebase`, `stash`로 재정렬하지 않습니다.

### develop에서 main으로 승격

```text
마일스톤 또는 릴리즈 후보 범위 확정
-> develop 통합 상태 확인
-> cross-team 통합 QA
-> Product Lead 제품 수용 검토
-> develop -> main 승격 PR
-> required check와 충돌 확인
-> Product Owner merge 승인
-> main에 squash merge
```

일반 하위 Task 완료는 `develop` 병합을 기준으로 판단합니다. 상위 제품 Task 또는 릴리즈 목표의 최종 완료는 필요한 하위 Task가 모두 `done`이고 `develop` 통합 검증과 `main` 승격 조건이 충족된 뒤 Product Lead가 판단합니다.

### hotfix

긴급 수정은 최신 `main`에서 `hotfix/<task-id>-<slug>`를 생성하고 `main` 대상 PR로 병합합니다. 병합 직후 같은 변경을 `develop`에 backport하는 PR을 만들어 두 브랜치의 수정 이력을 일치시킵니다.

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
- 일반 Task PR의 대상은 `develop`입니다.
- `main` 대상 PR은 `develop -> main` 승격 또는 승인된 `hotfix/*`로 제한합니다.
- 구현 담당자는 자신의 변경을 독립 검증 완료로 판정할 수 없습니다.
- 지정된 Verification Role이 diff, 검증 결과와 잔여 위험을 확인합니다.
- PR에는 Task 보고서와 QA 결과 또는 해당 경로를 연결합니다.
- 범위를 벗어난 변경은 분리하거나 명시적으로 승인받습니다.

## 6. CI와 required check

초기 required check 이름은 다음과 같이 고정합니다.

| Check | 초기 상태 | 실패 처리 |
|---|---|---|
| `ios-build` | workflow·dry run·iOS QA 대기 | check 실패 시 merge 후보 제외 |
| `ios-xctest` | workflow·dry run·iOS QA 대기 | check 실패 시 merge 후보 제외 |

workflow가 생성하는 required check 이름은 정확히 `ios-build`, `ios-xctest`로
고정합니다. 두 check를 repository ruleset 또는 branch protection의 required
check로 등록하는 외부 변경은 `T-20260730-005` dry run과 iOS QA를 통과한 뒤
`T-20260730-006`에서 Product Owner의 별도 실행 승인을 받아 수행합니다.

두 workflow는 `develop`, `main` 대상 Pull Request에서 `macos-26` ARM64, Xcode
26.6, iPhone 17 / iOS 26.5 조합을 사용합니다. 단, macOS 실행 전에 read-only
`GITHUB_TOKEN`과 Pull Request files API를 사용하는 Linux 판정 job이 다음
runtime-impact 경로를 확인합니다.

- `apps/ios/CookLog/**`
- `apps/ios/CookLogTests/**`
- `apps/ios/CookLog.xcodeproj/**`
- `apps/ios/Scripts/**`
- `apps/ios/*.xcconfig`, `apps/ios/*.entitlements`
- `.github/actions/**`
- `.github/workflows/ios-*.yml`

하나라도 해당하면 required job을 `macos-26`으로 라우팅해 기존 build·XCTest를
모두 실행합니다. 모두 해당하지 않으면 같은 required job을 `ubuntu-latest`로
라우팅해 macOS·Xcode·Simulator·artifact 단계를 생략하고 skip 사유만 기록합니다.
문서, `.ai_project`, Backend, Design만 바뀐 PR은 이 경량 경로를 사용합니다.
수동 `workflow_dispatch`는 항상 전체 macOS 검증을 실행합니다.

workflow 수준 `paths`/`paths-ignore`는 사용하지 않습니다. GitHub 공식 기준상
required workflow 자체가 path filter로 생략되면 check가 `Pending`에 남아 병합을
막을 수 있지만, job 내부 조건과 실행 결과는 required check로 안전하게 사용할 수
있기 때문입니다.

- [GitHub required check 생략 처리](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks)
- [GitHub job 조건](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-jobs-with-conditions)

workflow 표시 이름과 required job 이름·id는 각각 `ios-build`, `ios-xctest`를
유지하고 matrix suffix를 붙이지 않습니다. 판정 job 실패나 유효하지 않은 출력은
required job 실패로 전파합니다. 세부 명령, timeout과 artifact 계약은
`apps/ios/docs/TESTING.md`를 따릅니다.

같은 workflow·event·PR 또는 수동 branch의 이전 실행은 기존 concurrency group과
`cancel-in-progress: true`로 취소합니다. workflow 이름을 group에 포함하므로
`ios-build`와 `ios-xctest`, 다른 PR과 branch는 서로 취소하지 않습니다.

적용 순서:

1. `T-20260728-004`에서 전체 XCTest 실행 기준과 timeout을 확정합니다.
2. `T-20260728-008`에서 GitHub Actions의 `ios-build`와 `ios-xctest` workflow를 구현합니다.
3. `T-20260730-005`에서 실제 PR dry run으로 두 check의 성공·실패 감지와 artifact를 검증합니다.
4. iOS QA 통과 후 `T-20260730-006`에서 Product Owner의 별도 승인으로 두 check를 required check에 적용합니다.

CI가 아직 구축되지 않은 동안에는 Task에 지정된 build, test, 수동 QA 결과를 PR 본문에 기록하며, 검증 실패나 결과 누락이 있으면 merge하지 않습니다.

### 재실행 기준

재실행은 실패 원인을 지우는 수단이 아니라 일시적인 실행 환경 문제를 확인하는
수단으로만 사용합니다. 재실행 전 run URL·run ID·attempt·실패 job·종료 코드와
로그를 Task 보고서 또는 PR에 기록합니다.

| 상황 | 조치 |
|---|---|
| 코드·테스트·workflow 계약의 재현 가능한 실패 | 재실행하지 않고 새 commit으로 수정 |
| GitHub API 5xx, runner 할당 실패, 네트워크 단절처럼 코드와 무관한 일시 장애 | 실패 job만 1회 재실행 |
| 원인이 불명확한 실패 | 로그·artifact를 먼저 보존하고 Development Lead 승인 후 1회 재실행 |
| `concurrency`에 의해 취소된 이전 run | stale run이므로 재실행하지 않고 최신 commit의 run 확인 |
| path 판정 실패 또는 유효하지 않은 출력 | required check 실패로 유지하고 workflow 결함으로 처리 |
| 동일 SHA에서 두 번째 재실행 필요 | 반복 장애로 보고하고 자동·수동 재실행 중지 후 운영 이슈 등록 |

재실행은 원래 event의 actor·SHA·ref를 사용하므로 다른 commit의 검증을 대신하지
않습니다. 전체 재실행보다 실패 job 재실행을 우선하며, debug logging은 민감정보가
노출되지 않는지 확인한 뒤 사용합니다.

- [GitHub workflow와 job 재실행](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs)

### 문서·Backend·Design PR의 iOS CI 제외 정책

문서, `.ai_project/`, Backend, Design만 변경한 PR도 `ios-build`와 `ios-xctest`
workflow 자체는 시작합니다. Linux 판정 job과 같은 이름의 required job을 성공시켜
merge gate를 닫지 않은 채 macOS·Xcode·Simulator·artifact 단계만 제외합니다.

- iOS runtime-impact 경로가 하나라도 섞이면 두 workflow 모두 전체 macOS 검증으로
  fail-safe 전환합니다.
- 알 수 없는 경로, API 오류, 빈 값 또는 판정 실패는 비용 절감을 위해 `false`로
  간주하지 않고 required check 실패로 처리합니다.
- workflow 수준 `paths`, `paths-ignore`와 `[skip ci]` 계열 commit 메시지는 required
  check를 `Pending`으로 남길 수 있으므로 사용하지 않습니다.
- 제외 결과는 required job summary에 사유를 남기며, PR 작성자가 임의로 우회하지
  않습니다.

### 수동·야간 전체 회귀

`workflow_dispatch`는 항상 `develop`의 지정 SHA에서 두 workflow의 전체 macOS
검증을 실행합니다. 현재 workflow에 `schedule` trigger를 추가하지 않으므로 야간
회귀는 자동 cron이 아니라 아래 조건을 만족할 때 운영자가 야간 점검 창에서 수동
실행합니다.

실행 조건:

- 마지막 전체 회귀 이후 iOS runtime-impact 변경이 `develop`에 병합됨
- runner·Xcode·Simulator·공통 action·workflow 계약이 변경됨
- 릴리즈 후보 또는 `develop -> main` 승격 검토가 예정됨
- 간헐 실패를 재현해야 하며 Development Lead가 전체 회귀를 요청함

비용 절감을 위해 위 조건이 없으면 야간 실행을 생략합니다. 실행 전 Actions Budget과
included usage 잔여량, 같은 ref의 진행 중 run, 최신 `origin/develop` SHA를 확인합니다.

```bash
git fetch origin develop
git rev-parse origin/develop
gh workflow run ios-build.yml --ref develop
gh workflow run ios-xctest.yml --ref develop
gh run list --branch develop --limit 10
```

두 workflow가 같은 `origin/develop` SHA를 검증했는지 확인하고 run ID, attempt,
결론, macOS job 실행 여부, artifact와 사용량 점검 결과를 운영 보고에 남깁니다.
한쪽만 성공하면 전체 회귀 통과로 보지 않습니다. 실패 시 merge·승격을 중지하고
위 재실행 기준에 따라 원인을 분류합니다.

- [GitHub workflow 수동 실행](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)

### Actions 사용량과 Budget 운영

AI Ops Agent는 Billing의 `Budgets and alerts` 화면을 과금·included usage의 기준으로
사용하고, Actions API는 run 추세와 artifact·cache 보조 지표로 사용합니다. run의
`created_at` 검색은 나중에 수행한 re-run attempt의 과금 시점을 놓칠 수 있으므로
Billing 수치를 대체하지 않습니다.

점검 주기:

- 정상: 매주 1회와 수동·야간 전체 회귀 직전
- 50% 이상: 근무일마다 확인
- 75% 이상: iOS runtime-impact PR과 승인된 전체 회귀만 허용
- 90% 이상: 신규 전체 회귀와 원인 불명 재실행을 중지하고 Product Owner에게 보고
- 100% 또는 quota 소진: 모든 비필수 Actions 실행과 merge를 중지

GitHub의 Budget threshold 알림은 `75%`, `90%`, `100%`이므로 CookLog의 `50%`
게이트는 AI Ops Agent가 Billing 화면에서 수동 확인해 기록합니다. included usage
알림은 별도의 `90%`, `100%` 알림을 활성화합니다. Budget을 만들 때 Actions 제품,
적용 account/repository, 월 금액과 `Stop usage when budget limit is reached` 여부는
Product Owner가 승인해야 하며, 첫 생성 이전 사용량이 첫 주기 Budget 계산에 포함되지
않을 수 있음을 기록합니다.

- [GitHub Budget과 알림](https://docs.github.com/en/billing/concepts/budgets-and-alerts)
- [GitHub metered product Budget 설정](https://docs.github.com/en/billing/how-tos/set-up-budgets)

읽기 전용 보조 점검 예시:

```bash
gh api 'repos/cschoi724/CookLog/actions/runs?per_page=100'
gh api repos/cschoi724/CookLog/actions/cache/usage
gh api 'repos/cschoi724/CookLog/actions/artifacts?per_page=100'
```

Budget 50/75/90% 대응:

| 사용 수준 | 운영 조치 |
|---|---|
| 50% | 최근 7일 macOS run·re-run·취소 원인을 검토하고 불필요한 실행을 정리 |
| 75% | Product Owner에게 경고하고 문서·Backend·Design 경량 판정과 전체 회귀 필요성을 매일 확인 |
| 90% | 비필수 수동·야간 실행과 두 번째 재실행 중지, 릴리즈 차단 영향과 잔여량 보고 |
| 100% | hard stop 상태로 전환하고 아래 quota 소진 절차 수행 |

quota가 소진되거나 hard Budget이 동작하면 새 실행을 반복 시도하지 않습니다. 진행 중인
비필수 수동 run을 중지하고, required check가 생성되지 않거나 통과할 수 없는 PR의
merge를 동결합니다. 로컬 검증은 증거로 남길 수 있지만 required check를 대체하지
않습니다. 재개는 다음 billing cycle, Product Owner가 승인한 Budget 증액, 또는 별도
승인된 repository gate rollback 중 하나가 확인된 뒤에만 수행합니다.

### `T-20260730-006` required check 정합성

`T-20260730-006`에서 `develop`, `main`에 required check를 적용하기 전 다음 조건을
모두 확인합니다.

- `T-20260730-005`와 `T-20260731-003`의 독립 QA 통과
- check 이름이 정확히 `ios-build`, `ios-xctest`이며 같은 이름의 중복 source가 없음
- 문서·Backend·Design PR에서도 두 required job이 Linux success로 종료됨
- iOS·workflow 변경과 수동 실행은 macOS 전체 검증으로 전환됨
- 현재 GitHub 플랜에서 private repository ruleset 또는 branch protection 사용 가능
- Budget hard stop까지 required run을 수행할 잔여량과 quota 소진 대응 책임자 확인
- Product Owner의 `T-20260730-006` 별도 실행 승인

2026-08-03 읽기 전용 점검에서는 private 저장소의 ruleset과 `develop`, `main`
branch protection API가 모두 플랜 업그레이드 또는 public 전환 필요 `403`을 반환했다.
Product Owner 결정에 따라 `develop`에 먼저 적용해 실제 PR 흐름을 검증하고, 통과한
뒤 `main`에 같은 규칙을 확대합니다. 단일 collaborator 운영에서는 approval을 0으로
두되 PR과 `ios-build`, `ios-xctest`를 필수화합니다. 상시 bypass actor는 두지 않으며
긴급 우회는 Product Owner가 사유·시간·복구를 승인한 경우에만 허용합니다.

### CI rollback 기준과 절차

다음 중 하나라도 발생하면 WP-1~5 최적화를 rollback 후보로 분류합니다.

- iOS runtime-impact 변경이 `false`로 판정되어 macOS 검증을 건너뜀
- 문서 전용 PR에서 required check가 생성되지 않거나 `Pending`에 머묾
- 수동 실행이 전체 macOS 검증 대신 경량 경로로 실행됨
- check 이름 변경·중복으로 branch protection source가 불명확해짐
- 판정 API 장애가 성공으로 처리되거나 실패가 required job에 전파되지 않음
- 이전 run이 다른 workflow·PR·branch의 실행을 교차 취소함

rollback은 force push나 설정 즉시 삭제가 아니라 Product Owner가 승인한 revert PR로
수행합니다. 마지막 검증된 workflow commit으로 두 YAML을 되돌리고, required check
이름은 유지하며 `workflow_dispatch`로 두 전체 회귀를 실행합니다. 외부 gate가 merge를
막으면 우회 merge하지 않고, Product Owner가 별도로 승인한 임시 gate 변경과 복구
시점을 기록합니다. rollback 완료 조건은 두 check의 동일 SHA 성공, 문서 전용 PR의
required success, iOS PR의 macOS 실행, 독립 QA 확인입니다.

## 7. Review와 merge

Task PR의 `develop` merge 조건:

- Task가 `verification_passed` 또는 승인된 동등 상태입니다.
- 독립 검증 결과와 잔여 위험이 기록되어 있습니다.
- required check가 모두 통과했습니다.
- 최신 `develop`과 충돌이 없습니다.
- Development Lead Agent가 merge 가능하다고 판단했습니다.
- Product Owner가 merge를 승인했습니다.

`develop -> main` 승격 조건:

- 승격 범위에 포함된 필수 하위 Task가 모두 `done`입니다.
- cross-team 통합 QA와 릴리즈 기준 검증이 통과했습니다.
- Product Lead Agent가 제품 기준 수용 가능 상태로 판단했습니다.
- required check가 모두 통과하고 최신 `main`과 충돌이 없습니다.
- Product Owner가 승격 merge를 승인했습니다.

merge 방식은 squash로 통일합니다. merge 후 Task·hotfix worktree와 브랜치는 즉시 삭제하지 않고 안전 검사를 통과한 정리 후보로 전환합니다. `develop`은 장기 통합 브랜치이므로 삭제하지 않습니다. 자동 merge와 force push는 기본적으로 허용하지 않습니다.

### worktree 종료와 안전한 정리

다음 생명주기를 따릅니다.

```text
Task 승인
-> 최신 origin/develop 확인과 기준 SHA 기록
-> 전용 worktree 생성
-> 작업과 독립 검증
-> 완료 승인
-> push와 develop 대상 PR
-> merge 확인
-> 미커밋·미push 작업 검사
-> 정리 후보 전환
-> Product Owner 승인
-> worktree·작업 브랜치 제거
```

별도 비파괴 감사와 Product Owner 승인 전에는 기존 worktree 또는 branch를 삭제하지 않습니다. 정리 후보를 만들 때 다음을 모두 확인합니다.

- 미커밋 변경과 untracked 파일
- 원격에 push되지 않은 커밋
- 열린 PR과 PR merge 상태
- squash merge 여부와 branch patch의 develop 반영 여부
- 별도 검증 재현 용도
- 수익화 draft 또는 보존 WIP 여부

Squash merge된 branch의 원래 commit은 `develop`의 ancestor가 아닐 수 있습니다. 따라서 `git merge-base --is-ancestor` 결과만으로 미병합 작업이라고 판정하지 않고, PR merge 상태와 patch 동등성을 함께 확인합니다.

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
- [ ] Product Owner 승인 후 push와 `develop` 대상 PR 생성
- [ ] 독립 검증 및 required check 통과
- [ ] Product Owner 승인 후 `develop`에 squash merge
- [ ] 미커밋·untracked·미push·PR·squash merge·보존 목적 확인
- [ ] 완료 확정 후 worktree와 작업 브랜치를 정리 후보로 전환
- [ ] Product Owner의 별도 정리 승인 후 제거

`main` 승격 추가 체크:

- [ ] 승격 범위와 릴리즈 기준 확정
- [ ] cross-team 통합 QA 통과
- [ ] Product Lead 제품 수용 검토
- [ ] Product Owner 승인 후 `develop -> main` squash merge
- [ ] hotfix가 있으면 `develop` backport 확인

## 10. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-06-22 | 1인 개발 기준 `main` 직접 작업 절차 작성 |
| 2026-07-28 | `T-20260728-007` 승인에 따라 Task branch·PR·독립 검증·사용자 승인 기반 절차로 전환 |
| 2026-07-28 | `T-20260728-019` 승인에 따라 `develop` 통합, `main` 안정·릴리즈, hotfix backport 흐름으로 전환 |
| 2026-07-30 | `T-20260730-001`에서 iOS CI 환경·명령·check·timeout·artifact 계약 확정 |
| 2026-07-31 | `T-20260731-002`에서 다중 worktree 공용 상태를 최신 `origin/develop`로 고정하고 stale worktree 중단·상태 보고·안전한 정리 생명주기 규칙 추가 |
| 2026-07-31 | `T-20260731-003`에서 required check 호환 경량 path 판정과 문서·Backend·Design PR의 macOS 실행 제외 정책 추가 |
| 2026-08-03 | `T-20260731-003` WP-6~7에서 재실행·수동 야간 회귀·rollback·Actions Budget·quota·required check 운영 절차 추가 |
