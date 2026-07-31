# T-20260730-004 iOS 독립 QA 보고서

작성일: 2026-07-31
작성자: iOS QA Agent
대상 Task: `T-20260730-004`
판정: `PASS_WITH_RISK`

## 1. 검증 환경

- Worktree: `/private/tmp/cooklog-t20260730-004`
- Branch: `task/T-20260730-004-harden-ios-ci`
- 검증 커밋: `f2efd4fc0446141d1845cb91177706a68fe37b67`
- 기준 `origin/develop`: `44c7dd94e9c83cbe7858502a99246d205c2f122c`
- 기준점 관계: behind 0, ahead 2
- Xcode: 26.6 (`17F113`)
- Simulator: iPhone 17, iOS 26.5 (`23F77`)
- Device ID: `5C621868-90AD-4EFE-84A2-D240B22CADF0`
- Architecture: arm64

검증 시작 전 Task worktree는 깨끗했고 최신 `origin/develop`을 merge-base로
가졌다. 구현 변경 11개 경로는 모두 Task `allowed_paths` 안에 있다.

## 2. workflow와 concurrency 검증

두 workflow에서 다음을 확인했다.

- workflow·job·check 이름: `ios-build`, `ios-xctest` 유지
- trigger: `develop`·`main` 대상 pull request와 `workflow_dispatch`
- 권한: `contents: read`
- runner: `macos-26`
- Xcode: 26.6 (`17F113`)
- destination: `platform=iOS Simulator,name=iPhone 17,OS=26.5`
- job timeout: 15분
- XCTest timeout: 600초
- checkout credential과 secret 사용: 없음

concurrency group:

```text
<github.workflow>-<github.event_name>-<PR number 또는 github.ref>
```

정적 평가 결과:

| 실행 | group |
|---|---|
| `ios-build`, PR 42 | `ios-build-pull_request-42` |
| `ios-build`, PR 43 | `ios-build-pull_request-43` |
| `ios-xctest`, PR 42 | `ios-xctest-pull_request-42` |
| `ios-build`, develop 수동 실행 | `ios-build-workflow_dispatch-refs/heads/develop` |

`cancel-in-progress: true`이므로 같은 workflow·event·PR 또는 같은 workflow·수동
branch의 이전 실행만 취소 대상이다. PR 번호, workflow 이름 또는 ref가 다르면
group이 달라 교차 취소하지 않는다. 이는 GitHub 공식 concurrency의 동일 group
취소 및 `github.workflow` 격리 지침과 일치한다.

## 3. 공통 preflight action

`.github/actions/prepare-ios-ci/action.yml`을 독립 실행했다.

입력 경계:

- `ios-build`, `ios-xctest`: 허용
- `../escape`: exit 2로 차단

hosted 고정 경로 실패:

- 로컬에 `/Applications/Xcode_26.6.app`이 없어 exit 1
- `ci-environment.log` 생성 후 누락 경로 기록
- cache 정책: `disabled-no-dependency-lockfile`

로컬 `/Applications/Xcode.app`으로 경로만 치환한 정상 경로:

- exit 0
- Xcode 26.6, build `17F113`: 일치
- iPhone 17·iOS 26.5 runtime과 destination: 확인
- workflow, event, ref, SHA, run·attempt, runner, destination, cache 정책,
  OS·architecture, disk와 Simulator 진단: 기록

action은 전체 environment dump를 실행하지 않으며 token, secret, 음성 또는
사용자 입력을 기록하지 않는다.

## 4. summary action과 실패 진단

`.github/actions/summarize-ios-ci/action.yml`에 `failure`를 입력해 독립
실행했다.

- action 종료 코드: 0
- Step Summary와 `ci-summary.md`: 생성
- 결과: `failure` 그대로 기록
- cache: `disabled-no-dependency-lockfile`
- 허용된 실제 artifact만 목록화

summary가 exit 0으로 끝나도 선행 build·test step의 실패 코드는 변경하지 않는
별도 `if: always()` step이다.

의도적 build 실패:

- 주입:
  `OTHER_SWIFT_FLAGS=$(inherited) -cooklog-qa-intentional-build-failure`
- 종료 코드: 65
- 결과: `BUILD FAILED`
- 진단: `ci-environment.log`, `xcodebuild-build.log`, `ci-summary.md`
- summary 결과: `failure`

XCTest timeout:

- `COOKLOG_XCTEST_TIMEOUT_SECONDS=1`
- 종료 코드: 124
- 결과: `BUILD INTERRUPTED`
- 진단: `ci-environment.log`, `xcodebuild.log`, 부분
  `CookLogTests.xcresult`, `TIMED_OUT`, `ci-summary.md`
- summary 결과: `failure`
- summary artifact 목록에 log·xcresult·marker·환경 로그가 모두 표시됨

## 5. cache 결정과 회귀

다음을 독립 검색했다.

- `Package.resolved`: 없음
- `Podfile.lock`: 없음
- `Cartfile.resolved`: 없음
- `XCRemoteSwiftPackageReference`: 없음
- `actions/cache`: 없음

dependency 입력과 재사용 경로가 없으므로 현재 cache 정책
`disabled-no-dependency-lockfile`은 타당하다. DerivedData는 실행별 임시
경로에서만 사용하고 cache·upload 대상에서 제외된다. GitHub 공식 지침도 cache
key와 path를 요구하고 민감정보를 cache path에 넣지 않도록 규정한다.

cache 미적용 회귀:

- `xcodebuild build`: exit 0, `BUILD SUCCEEDED`
- 동일 DerivedData의 `build-for-testing`: exit 0,
  `TEST BUILD SUCCEEDED`
- 전체 XCTest: exit 0
- `xcresult`: `Passed`
- 테스트: 33/33 통과, 실패·skip 0
- device: iPhone 17, iOS 26.5
- 정상 XCTest artifact: `xcodebuild.log`, `CookLogTests.xcresult`
- 정상 `TIMED_OUT`: 없음

검증 artifact:

- `/private/tmp/cooklog-t004-qa-build-20260731/ios-build/`
- `/private/tmp/cooklog-t004-qa-xctest-20260731/20260731-111614-85964/`
- `/private/tmp/cooklog-t004-qa-failure-20260731/cooklog-ci/4004-1/ios-build/`
- `/private/tmp/cooklog-t004-qa-testfailure-20260731/cooklog-ci/4005-1/ios-xctest/`

## 6. artifact와 정적 검사

- `ios-build`: environment·summary·build log 2개
- `ios-xctest`: environment·summary·log·조건부 xcresult·`TIMED_OUT`
- upload: `if: always()`
- 누락 파일: warning
- 보존: 14일
- DerivedData: upload glob에서 제외

검사 결과:

- workflow·composite action YAML parse: 통과
- workflow·action 내 모든 bash script `bash -n`: 통과
- `bash -n apps/ios/Scripts/run-xctest.sh`: 통과
- `aiops validate task ... --strict`: 통과
- `git diff --check origin/develop...HEAD`: 통과
- 변경 경로: Task `allowed_paths` 안

## 7. 잔여 위험

### QA-RISK-004-001: 실제 GitHub concurrency와 hosted 진단 미검증

로컬에서는 같은 PR의 연속 run을 실제로 발생시켜 이전 run의 `cancelled`
결론을 확인하거나 GitHub-hosted artifact와 Step Summary를 조회할 수 없다.

심각도: 보통

후속 조건:

- T-004 PR에서 같은 PR에 연속 commit을 push해 이전 `ios-build`와
  `ios-xctest`가 각각 취소되고 최신 run이 유지되는지 확인한다.
- 별도 PR 또는 branch run이 취소되지 않는지 확인한다.
- hosted 정상·실패 run에서 environment·summary와 기존 artifact의 이름,
  내용, 14일 보존을 확인한다.
- 후속 `T-20260730-005` dry run에서 실패 check와 진단 artifact를 재확인한다.

## 8. 최종 판정

`PASS_WITH_RISK`.

concurrency group의 PR·workflow·ref 격리, 공통 preflight, cache 미적용 결정,
build·build-for-testing·XCTest 33/33 회귀, build 실패와 XCTest timeout의
진단·summary·artifact 경계가 Task 계약과 일치한다. 실제 GitHub 취소 동작과
hosted artifact 확인은 후속 조건으로 남기고 `verification_passed`로
Development Lead Agent에 인계한다.

## 9. 다음 Agent에게 전달할 말

```text
Task: T-20260730-004
현재 상태: verification_passed
검증 판정: PASS_WITH_RISK
다음 담당: Development Lead Agent / Completion Role
독립 검증:
- PR·workflow·ref별 concurrency group 격리 정합
- 공통 preflight 정상 0, hosted 경로 누락 1, 잘못된 하위 경로 2
- cache 미적용 build·build-for-testing 성공
- 전체 XCTest 33/33 성공
- build 실패 65와 XCTest timeout 124의 environment·summary·artifact 보존
- DerivedData·secret·사용자 입력 제외
잔여 위험:
- QA-RISK-004-001: 실제 GitHub concurrency 취소와 hosted 진단 미검증
후속:
- T-004 PR 및 T-20260730-005 dry run에서 hosted 동작 확인
QA 보고서:
- .ai_project/qa/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache-qa.md
```
