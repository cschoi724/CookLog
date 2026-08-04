# T-20260730-006 iOS 독립 QA 보고서

작성일: 2026-08-04

작성자: iOS QA Agent / Verification Role

대상 Task: `T-20260730-006`

기준 구현: `ops/T-20260730-006-configure-required-checks@68925e7`

검증 PR: [#57](https://github.com/cschoi724/CookLog/pull/57)

판정: `FAIL` / `rework_requested`

## 1. 검증 범위

- `develop` ruleset `20340678`
- `main` ruleset `20344405`
- PR #57 required check와 merge gate
- Actions run·job runner·artifact·cache·사용량 snapshot
- required check 이름과 source
- Budget 50/75/90/100% 운영 확인 가능 범위

검증 중 repository ruleset, branch protection, workflow, Budget과 PR 상태는 변경하지 않았다.

## 2. 통과 항목

- repository는 public이며 기본 branch는 `develop`이다.
- `develop`, `main`은 모두 `protected: true`다.
- 두 ruleset은 `active`, branch별 ref 고정, bypass actor 없음,
  `current_user_can_bypass: never`다.
- 두 ruleset은 PR 필수, approval 0, squash only, linear history, branch 삭제와
  force push 금지, strict required checks를 동일하게 적용한다.
- required check context는 정확히 `ios-build`, `ios-xctest`다.
- PR #57은 최신 HEAD `68925e7`에서 `mergeStateStatus: CLEAN`, 두 required check
  success, mergeable 상태다.
- 최초 검증 run `30869009342`, `30869009326`과 최신 HEAD run
  `30869914658`, `30869914654`의 detect·required job은 모두
  `ubuntu-latest`에서 success다.
- 문서 전용 경량 경로에서 macOS·Xcode·Simulator·artifact 단계가 생략됐고 네 run의
  artifact는 모두 0개다.
- 최신 HEAD의 네 check run은 모두 GitHub Actions 앱 `id: 15368`에서 생성됐다.
- 2026-08-01 이후 조회 시점 기준 run 14개가 모두 pull request·success이며 re-run은
  0개다. cache는 0개·0B이고 active artifact는 75개·58,340,487B다.
- `git diff --check origin/develop...68925e7`을 통과했고 변경은 Task 허용 경로 안에 있다.

## 3. 필수 재작업

### QA-HIGH-006-001 — active ruleset의 실패 check merge 차단 미검증

Task 성공 기준은 실패 check가 있는 PR을 실제로 merge할 수 없어야 한다. 현재 증거는
PR #57의 대기 중 `BLOCKED` 주장과 check 성공 뒤 `CLEAN` 경로뿐이며, active ruleset
적용 후 `ios-build` 또는 `ios-xctest`가 실패한 PR의 merge 차단을 재현한 기록이 없다.

GitHub API는 PR의 과거 `mergeStateStatus`를 제공하지 않고 ruleset rule suite 조회도
빈 배열이어서 실행 보고서의 최초 `BLOCKED`를 독립 재현할 수 없었다. 현재 상태는
`CLEAN`만 확인된다.

재작업 기준:

1. Product Owner가 승인한 격리 validation PR에서 check 하나를 의도적으로 실패시킨다.
2. active ruleset 상태에서 PR이 `BLOCKED`이고 merge 불가인지 기록한다.
3. 실패 변경을 병합하지 않고 PR을 닫거나 정상 상태로 복구한다.
4. 성공 경로와 실패 경로의 run ID, head SHA, merge state를 함께 남긴다.

### QA-HIGH-006-002 — required check source가 GitHub Actions 앱에 고정되지 않음

두 ruleset의 `required_status_checks`에는 context만 있고 `integration_id`가 없다.
현재 PR #57의 실제 check source는 GitHub Actions 앱 `15368`이지만 ruleset은 같은 이름의
status를 다른 write 권한 주체가 생성해도 source 기준으로 거부하지 않는다.

GitHub 공식 ruleset API는 required check별 optional `integration_id`를 제공하며, 공식
운영 문서도 write 권한이 있는 사용자·integration이 status를 설정할 수 있으므로 필요한
경우 expected GitHub App source를 선택하도록 안내한다. CookLog의
`docs/GIT_WORKFLOW.md`도 같은 이름의 중복 source 부재를 적용 전 조건으로 둔다.

- [GitHub ruleset REST API](https://docs.github.com/en/rest/repos/rules)
- [GitHub ruleset의 required status check source](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-status-checks-to-pass-before-merging)

재작업 기준:

1. 두 ruleset의 `ios-build`, `ios-xctest`에 GitHub Actions 앱
   `integration_id: 15368`을 고정한다.
2. API round-trip에서 branch별 두 context와 integration ID를 확인한다.
3. PR #57 또는 별도 검증 PR에서 GitHub Actions source check가 정상 충족되는지 확인한다.
4. 다른 source의 같은 context가 gate를 충족하지 않는다는 설정 또는 격리 검증 증거를
   남긴다.

## 4. 잔여 위험

### QA-RISK-006-001 — Billing 현재 구간·알림 활성화 미확인

현재 token은 `user` scope가 없어 Billing API가 `404`를 반환한다. GitHub native Budget
75/90/100%, included usage 90/100%와 CookLog 수동 50% 정책 문서는 확인했지만 실제
Budget 금액, 현재 비율과 알림 활성화 상태는 독립 확인하지 못했다.

Product Owner가 `Settings > Billing & licensing > Budgets and alerts` 화면에서 금액,
현재 구간, native alert와 50% 수동 기록 책임자를 확인해야 한다. 이 항목만으로 ruleset
구조를 실패 판정하지는 않지만 완료 검토 전에 위험 수용 또는 증빙이 필요하다.

## 5. 판정과 인계

`FAIL`.

두 branch의 기본 ruleset 구조와 성공 경로는 정상이나, 실제 실패 check 차단이라는 핵심
성공 기준이 미검증이고 expected check source도 고정되지 않았다. AI Ops Agent가 두 HIGH
항목을 수정·재현한 뒤 `verification_ready`로 다시 인계해야 한다. PR #57은 재검증과
Product Owner 승인 전 merge하지 않는다.
