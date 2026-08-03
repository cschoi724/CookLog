# T-20260731-003 실행 보고서

작성일: 2026-07-31
작성자: iOS Agent
상태: `verification_ready`
범위: WP-1~5
기준: `origin/develop` `3ae2b15`

## 결과

문서·Task 상태·Backend·Design만 변경된 Pull Request에서 macOS/Xcode 실행을
제외하고, iOS runtime-impact 변경과 수동 실행에서는 기존 build·XCTest를
그대로 수행하도록 두 workflow를 최적화했다.

workflow 수준 `paths`는 사용하지 않았다. required workflow가 path filter로
생략되면 check가 `Pending`에 남을 수 있으므로, Linux 판정 job의 output으로
기존 required job runner를 동적으로 선택한다.

- iOS 관련: `macos-26`
- 관련 없음: `ubuntu-latest`, skip 사유만 기록
- 판정 실패·유효하지 않은 output: required job 실패
- `workflow_dispatch`: 항상 `macos-26`

required job 이름과 id는 `ios-build`, `ios-xctest`로 유지했다.

## runtime-impact 경로

- `apps/ios/CookLog/**`
- `apps/ios/CookLogTests/**`
- `apps/ios/CookLog.xcodeproj/**`
- `apps/ios/Scripts/**`
- `apps/ios/*.xcconfig`, `apps/ios/*.entitlements`
- `.github/actions/**`
- `.github/workflows/ios-*.yml`

판정은 read-only `GITHUB_TOKEN`, `contents: read`, `pull-requests: read`와
Pull Request files API를 사용한다. checkout이나 사용자 secret은 사용하지 않는다.

## WP-1~5

| WP | 결과 |
|---|---|
| WP-1 | iOS runtime-impact allowlist와 혼합 변경 판정 추가 |
| WP-2 | 루트·제품·iOS 문서와 완료 기록 PR의 macOS 단계 제외 |
| WP-3 | Backend·Design 변경의 macOS 단계 제외 |
| WP-4 | workflow·event·PR/ref concurrency group과 이전 실행 취소 유지 |
| WP-5 | 두 workflow에 동일 판정 경계, 동적 runner, check·실패 경계 적용 |

## required check 정합성

GitHub 공식 문서상 workflow 자체가 path filter로 생략되면 required check가
`Pending`에 남을 수 있다. 이 구현은 workflow와 required job을 항상 생성하고,
관련 없는 변경에서는 required job을 Linux에서 성공시킨다.

- [GitHub required status check 문제 해결](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks)
- [GitHub context 사용 가능 위치](https://docs.github.com/en/enterprise-cloud@latest/actions/reference/workflows-and-actions/contexts)
- [GitHub concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency)

## 개발자 검증

### workflow와 trigger

- 두 workflow YAML parse: 통과
- `git diff --check`: 통과
- XCTest runner `bash -n`: 통과
- 앱 소스·테스트·xcodeproj·script·공통 action·iOS workflow: `true`
- root·iOS 문서·Backend·Design·Task 상태: `false`
- 문서+iOS 소스 혼합: `true`
- 실제 PR #18(iOS): `true`
- 실제 PR #36(문서·Task): `false`
- 실제 PR #50(Backend): `false`

### 기존 CI 경계

- `xcodebuild build`: 성공
- `xcodebuild build-for-testing`: 성공
- 전체 XCTest: 33/33, 실패 0, 종료 코드 0
- 정상 xcresult와 log: 존재
- 의도적 build 실패: 종료 코드 65, `BUILD FAILED`
- XCTest 1초 timeout: 종료 코드 124, `TIMED_OUT`·log 존재

검증 경로:

- build DerivedData: `/private/tmp/cooklog-t003-build-derived`
- XCTest:
  `/private/tmp/cooklog-t003-xctest/20260731-175459-48216`
- build 실패 log: `/private/tmp/cooklog-t003-build-failure.log`
- timeout:
  `/private/tmp/cooklog-t003-timeout/20260731-175538-49504`

기존 Xcode·Simulator, build 명령, XCTest script, failure·timeout,
environment·summary·artifact 업로드 단계는 수정하지 않았다.

## 변경 파일

- `.github/workflows/ios-build.yml`
- `.github/workflows/ios-xctest.yml`
- `docs/GIT_WORKFLOW.md`
- `apps/ios/docs/TESTING.md`
- `.ai_project/tasks/active/T-20260731-003_optimize-github-actions-usage.md`
- `.ai_project/reports/T-20260731-003_optimize-github-actions-usage-report.md`
- `.ai_project/qa/T-20260731-003_optimize-github-actions-usage-qa.md`
- `.ai_project/teams/development/task_board.md`
- `.ai_project/teams/quality/task_board.md`

모든 변경은 Task `allowed_paths` 안에 있다.

## QA 요청

iOS QA Agent는 다음을 독립 검증한다.

- iOS source·test·project·script·workflow·action positive path
- 문서·Task·Backend·Design negative path
- 혼합 변경의 fail-safe `true`
- 판정 실패가 required job 실패로 전파되는지
- check 이름이 `ios-build`, `ios-xctest`인지
- 관련 없는 PR에서 두 required job이 Linux이고 macOS 단계·artifact가 없는지
- 관련 PR과 수동 실행에서 `macos-26` 전체 검증이 실행되는지
- 같은 PR의 이전 동일 workflow 취소와 교차 취소 부재
- build 실패 65·XCTest timeout 124·artifact 경계 무회귀

WP-6 수동·야간 전체 회귀 운영과 WP-7 사용량·Budget·T-006 외부 설정 정합성은
AI Ops Agent에 별도 인계한다. iOS Agent는 repository 설정을 변경하지 않았다.
## AI Ops WP-6~7 실행 보고

실행일: 2026-08-03

역할: AI Ops Agent / Ops Governance Role

worktree: `/private/tmp/cooklog-t20260731-003-ops`

branch: `ops/T-20260731-003-wp6-7`

base: `task/T-20260731-003-optimize-actions-usage@0c0ccfa`

public source: `origin/develop@3ae2b15`

### WP-6 결과

`docs/GIT_WORKFLOW.md`에 다음 운영 기준을 추가했다.

- 재실행 허용·금지 조건과 동일 SHA 두 번째 재실행 중지 기준
- 문서·`.ai_project`·Backend·Design PR의 Linux required success와 macOS 제외 정책
- 조건부 수동 야간 전체 회귀의 실행 전 확인, CLI, 동일 SHA 판정과 실패 처리
- false negative, Pending check, 수동 경량 실행, check source·concurrency 이상에 대한
  rollback 기준과 승인된 revert PR 절차

### WP-7 읽기 전용 점검

GitHub repository와 Actions API를 변경 없이 점검했다.

- 저장소: `cschoi724/CookLog`, private, 기본 branch `develop`
- Actions: enabled, allowed actions `all`, SHA pinning required `false`
- 2026-07-30~31 생성 run: 74건
  - workflow: `ios-build` 39건, `ios-xctest` 34건, 초기 파일명 표시 1건
  - conclusion: success 63건, failure 8건, cancelled 3건
- 2026-08-01 이후 새로 생성된 run: 0건
- 2026-08-03 re-run attempt: `30618450195` build와 `30618450184` XCTest가
  Linux 판정 뒤 `macos-26`에서 성공
- Actions cache: 0건, 0 byte
- active artifact: 71건, 합계 57,973,119 byte, 만료 2026-08-14~17

Actions run의 `created_at`은 8월에 수행한 7월 run의 re-run attempt를 8월 신규 run으로
집계하지 않으므로 과금·included usage의 source of truth로 사용할 수 없다. Billing API는
현재 token에 `user` scope가 없어 `404`였으며 인증 scope를 임의로 확대하지 않았다.
따라서 실제 사용률과 Budget 금액은 GitHub `Settings > Billing & licensing > Budgets and
alerts`에서 Product Owner가 확인해야 한다.

GitHub native Budget 알림은 75/90/100%다. 요청된 50%는 CookLog 내부 수동 게이트로
정의하고, 75%에서는 경고·일일 점검, 90%에서는 비필수 전체 회귀와 반복 재실행 중지,
100%에서는 required check merge 동결과 승인 기반 재개 절차를 문서화했다.

### `T-20260730-006` 정합성 결과

check 이름과 workflow 경계는 `ios-build`, `ios-xctest`로 일치한다. 그러나 현재 private
저장소의 ruleset 및 `develop`, `main` branch protection API가 모두 다음 `403`을 반환했다.

```text
Upgrade to GitHub Pro or make this repository public to enable this feature.
```

따라서 `T-20260730-006`은 현재 플랜 조건에서는 실행 불가하며 required check가 이미
적용됐다고 판단할 수 없다. 플랜 조건 해소, T-003 독립 QA 통과, Budget headroom 확인,
Product Owner의 T-006 별도 승인이 모두 필요하다. repository ruleset, branch protection,
Budget, workflow YAML과 `apps/ios/`는 변경하지 않았다.

### 변경과 검증

변경 파일:

- `docs/GIT_WORKFLOW.md`
- `.ai_project/reports/T-20260731-003_optimize-github-actions-usage-report.md`

독립 Ops 검증 요청:

- 재실행·수동 야간·rollback 절차가 서로 충돌하지 않는지
- 50/75/90/100% 대응과 quota 소진 시 required check merge 동결이 명확한지
- `T-20260730-006`의 플랜·QA·Budget·별도 승인 게이트가 누락되지 않았는지
- repository 설정을 변경하지 않았는지

## WP-6~7 독립 Ops 검증

검증일: 2026-08-03

검증자: AI Ops Agent / Ops Governance Role (별도 세션)

판정: `PASS_WITH_RISK`

### 통과 항목

- 변경은 허용 경로인 `docs/GIT_WORKFLOW.md`와 이 보고서에만 존재하며
  `git diff --check`를 통과했다.
- 재실행 허용·금지·중지 기준, 조건부 수동 야간 회귀, 실패 처리와 승인 기반
  rollback 절차가 서로 충돌하지 않는다.
- 문서·`.ai_project`·Backend·Design PR의 Linux required success와 iOS runtime-impact
  변경의 macOS 전체 검증 경계가 WP-1~5 및 iOS QA 결과와 일치한다.
- Budget 50/75/90/100% 대응, quota 소진 시 재실행 중지·merge 동결·승인 기반 재개가
  명시돼 있다. GitHub 공식 Budget 알림 75/90/100%와 included usage 알림 90/100%에
  맞춰 50%를 CookLog 수동 게이트로 분리했다.
- 읽기 전용 GitHub 재조회에서 run 74건, cache 0건, 활성 artifact 71건·57,973,119 byte,
  PR #52의 attempt 2 성공과 보고서 수치가 일치했다.
- private 저장소 ruleset과 `develop`·`main` branch protection의 `403`을 재현했다.
  `T-20260730-006`을 미적용·차단 상태로 두고 플랜, 독립 QA, Budget headroom,
  Product Owner 별도 승인을 선행 조건으로 둔 판단은 타당하다.
- repository ruleset, branch protection, Budget, workflow YAML과 `apps/ios/` 외부·로컬
  설정을 변경하지 않았다.

### 잔여 위험

- `OPS-RISK-003-001` (`Medium`): 현재 인증 토큰에 `user` scope가 없어 Billing API가
  `404`를 반환했다. 실제 included usage, Budget 금액과 50/75/90/100% 현재 구간은
  Product Owner가 `Settings > Billing & licensing > Budgets and alerts`에서 확인해야 한다.
- `OPS-RISK-003-002` (`Medium`): 현재 GitHub 플랜에서는 private repository required
  check를 강제할 수 없다. 플랜 조건이 해소되고 `T-20260730-006`이 별도 승인·실행되기
  전까지 문서의 merge 동결은 운영 절차이며 repository가 자동 강제하지 않는다.

위 두 위험은 WP-6~7 정책 문서의 완결성을 막지는 않지만, 실제 Budget 및 merge gate
활성화 완료로 해석하면 안 된다. Development Lead는 이 조건을 수용한 경우에만
T-003 완료 판단을 진행한다.
