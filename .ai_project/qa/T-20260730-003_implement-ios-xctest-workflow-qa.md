# T-20260730-003 iOS 독립 QA 보고서

작성일: 2026-07-31
작성자: iOS QA Agent
대상 Task: `T-20260730-003`
판정: `PASS_WITH_RISK`

## 1. 검증 환경

- Worktree: `/private/tmp/cooklog-t20260730-003`
- Branch: `task/T-20260730-003-implement-ios-xctest`
- 기준 HEAD: `e72b342bef90a2520fb58b1048b9cb54385a08fd`
- 기준 `origin/develop`: `54053d23b17ba77e1bbaae4f1b40b26b9b36a97d`
- Xcode: 26.6 (`17F113`)
- Simulator: iPhone 17, iOS 26.5 (`23F77`)
- Device ID: `5C621868-90AD-4EFE-84A2-D240B22CADF0`
- Architecture: arm64

Task 브랜치는 최신 `origin/develop`보다 1개 커밋 앞서고 뒤처진 커밋이
없었다. 구현 변경은 미커밋 상태로 독립 검증했다.

## 2. workflow 정적 검증

`.github/workflows/ios-xctest.yml`에서 다음 계약을 확인했다.

- workflow 이름과 단일 job 이름: `ios-xctest`
- trigger: `develop`·`main` 대상 `pull_request`, `workflow_dispatch`
- runner: `macos-26`
- Xcode: `/Applications/Xcode_26.6.app`, 26.6 (`17F113`)
- destination: `platform=iOS Simulator,name=iPhone 17,OS=26.5`
- script timeout: 600초
- job timeout: 15분
- 권한: `contents: read`
- checkout: `actions/checkout@v7`, `persist-credentials: false`
- test 명령: 기존 `apps/ios/Scripts/run-xctest.sh` 1회
- artifact: `actions/upload-artifact@v7`, `if: always()`
- artifact 이름:
  `cooklog-ios-xctest-${{ github.run_id }}-${{ github.run_attempt }}`
- artifact 대상: 실행별 `xcodebuild.log`, 조건부 `CookLogTests.xcresult`,
  `TIMED_OUT`
- 파일 누락: `if-no-files-found: warn`
- 보존: 14일
- DerivedData, secret, 원격 STT endpoint·활성화 flag: 업로드·설정 없음

기존 script가 `-parallel-testing-enabled NO`와
`-maximum-parallel-testing-workers 1`을 전달하므로 전체 XCTest는 worker
1개로 직렬 실행된다. 공식 GitHub 자료에서 `macos-26` runner label과
`checkout`, `upload-artifact`의 v7 major도 확인했다.

정적 검사:

- Ruby YAML parser: 통과
- `bash -n apps/ios/Scripts/run-xctest.sh`: 통과
- `aiops validate task ... --strict`: 통과
- `git diff --check`: 통과
- 전체 변경 경로: Task `allowed_paths` 안

## 3. preflight 독립 검증

로컬 설치 경로는 `/Applications/Xcode.app`이므로 hosted 전용
`/Applications/Xcode_26.6.app` 존재 검사는 통과하지 않았다. 나머지 preflight
계약은 workflow와 동일한 명령으로 재현했다.

정상 경로:

- Xcode `26.6`: 일치
- build `17F113`: 일치
- iOS 26.5 runtime의 사용 가능한 iPhone 17: 확인
- CookLog scheme의 iPhone 17·iOS 26.5 destination: 확인
- 종료 코드: 0

부정 경로:

- 잘못된 Xcode 기대값 검사: 종료 코드 1
- 존재하지 않는 runtime·device 검사: 종료 코드 5

`set -euo pipefail` 조건에서는 두 불일치가 preflight 단계에서 job을
중단시키며 fallback 경로가 없다.

## 4. 정상 XCTest 경로

실행 조건:

```text
COOKLOG_XCTEST_DESTINATION=platform=iOS Simulator,name=iPhone 17,OS=26.5
COOKLOG_XCTEST_TIMEOUT_SECONDS=600
```

결과:

- script 종료 코드: 0
- `xcresult` 결과: `Passed`
- 전체 테스트: 33개
- 통과: 33개
- 실패·skip·expected failure: 0개
- device: iPhone 17, iOS 26.5
- artifact: `xcodebuild.log`, `CookLogTests.xcresult`
- `TIMED_OUT`: 없음

Artifact:

- `/private/tmp/cooklog-t003-qa-success-20260731/20260731-094940-46602/xcodebuild.log`
- `/private/tmp/cooklog-t003-qa-success-20260731/20260731-094940-46602/CookLogTests.xcresult`

`xcrun xcresulttool get test-results summary`로 위 결과를 독립 확인했다.

## 5. 일반 실패 경로

소스 파일을 변경하지 않고 다음 build setting을 환경으로 주입했다.

```text
OTHER_SWIFT_FLAGS=$(inherited) -cooklog-qa-intentional-test-failure
```

결과:

- script 종료 코드: 65
- 원인: Swift driver unknown argument
- 결과: `TEST FAILED`
- artifact: `xcodebuild.log`, `CookLogTests.xcresult`
- `TIMED_OUT`: 없음

Artifact:

- `/private/tmp/cooklog-t003-qa-failure-20260731/20260731-095017-47717/xcodebuild.log`
- `/private/tmp/cooklog-t003-qa-failure-20260731/20260731-095017-47717/CookLogTests.xcresult`

일반 `xcodebuild` 실패 코드는 변형되지 않고 script와 workflow step의 실패로
전달되며 timeout marker와 구분된다.

## 6. timeout 경로

`COOKLOG_XCTEST_TIMEOUT_SECONDS=1`로 watchdog timeout을 재현했다.

결과:

- script 종료 코드: 124
- 결과: `BUILD INTERRUPTED`
- artifact: `xcodebuild.log`, 부분 `CookLogTests.xcresult`, `TIMED_OUT`

Artifact:

- `/private/tmp/cooklog-t003-qa-timeout-20260731/20260731-095026-47992/xcodebuild.log`
- `/private/tmp/cooklog-t003-qa-timeout-20260731/20260731-095026-47992/CookLogTests.xcresult`
- `/private/tmp/cooklog-t003-qa-timeout-20260731/20260731-095026-47992/TIMED_OUT`

따라서 일반 실패 65와 timeout 124를 종료 코드와 marker로 판별할 수 있다.
세 실행 모두 로컬 작업용 DerivedData를 생성하지만 workflow upload glob은
log·xcresult·marker만 지정해 DerivedData를 artifact에서 제외한다.

## 7. 잔여 위험

### QA-RISK-003-001: 실제 GitHub-hosted workflow 실행 미검증

로컬에서는 GitHub-hosted 전용 Xcode 앱 경로, Actions check 표시와 실제
`actions/upload-artifact` 업로드를 완전히 재현할 수 없다.

심각도: 보통

후속 조건:

- T-003 PR run 또는 `T-20260730-005` PR dry run에서 `ios-xctest` check와 job
  이름을 확인한다.
- hosted preflight의 `/Applications/Xcode_26.6.app` 경로와 Xcode
  26.6 (`17F113`), iPhone 17·iOS 26.5 조합을 확인한다.
- 정상 run에서 33/33과 artifact 이름·내용·14일 보존을 확인한다.
- 후속 실패 dry run에서 exit 65와 timeout 124·`TIMED_OUT` 구분을 확인한다.

## 8. 최종 판정

`PASS_WITH_RISK`.

고정 check·trigger·권한, fail-fast preflight, 전체 XCTest 33/33 직렬 실행,
일반 실패 65와 timeout 124 구분, 정상·실패·timeout artifact 경계가 Task
계약과 일치한다. 실제 hosted Actions 실행은 후속 검증 조건으로 남기고 Task를
`verification_passed`로 Development Lead Agent에 인계한다.

## 9. 다음 Agent에게 전달할 말

```text
Task: T-20260730-003
현재 상태: verification_passed
검증 판정: PASS_WITH_RISK
다음 담당: Development Lead Agent / Completion Role
독립 검증:
- preflight 정상 통과 및 버전·runtime 불일치 실패 확인
- 전체 XCTest 33/33, 종료 코드 0
- 일반 실패 종료 코드 65, log·xcresult 보존, TIMED_OUT 없음
- timeout 종료 코드 124, log·부분 xcresult·TIMED_OUT 보존
- 직렬 worker 1, trigger·권한·artifact·allowed_paths 정합
잔여 위험:
- QA-RISK-003-001: 실제 GitHub-hosted workflow/check/artifact 실행 미검증
후속:
- T-003 PR run 또는 T-20260730-005 PR dry run에서 hosted 실행 확인
QA 보고서:
- .ai_project/qa/T-20260730-003_implement-ios-xctest-workflow-qa.md
```

## 10. PR #28 hosted 후속 확인

Development Lead가 PR #28의 GitHub-hosted 실행을 완료 조건으로 확인했다.

- `ios-xctest` run: `30596768335`
- job 결론: `success`
- preflight: 성공
- XCTest step: 성공
- hosted log: 33개 실행, 실패 0, `TEST SUCCEEDED`
- artifact upload: 성공
- artifact: `cooklog-ios-xctest-30596768335-1`
- artifact 내용: `xcodebuild.log`, `CookLogTests.xcresult`

`QA-RISK-003-001`의 hosted 정상 check·Xcode/Simulator preflight·33/33·artifact
조건은 해소됐다. hosted 일반 실패 65와 timeout 124·`TIMED_OUT` 구분은
T-20260730-005의 실패 dry run으로 계속 인계한다. 이는 T-003 완료를 차단하지
않는다.
