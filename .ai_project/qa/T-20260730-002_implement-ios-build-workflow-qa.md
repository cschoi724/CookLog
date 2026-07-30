# T-20260730-002 iOS 독립 QA 보고서

작성일: 2026-07-30
작성자: iOS QA Agent
대상 Task: `T-20260730-002`
판정: `PASS_WITH_RISK`

## 1. 검증 환경

- Worktree: `/private/tmp/cooklog-t20260730-002`
- Branch: `task/T-20260730-002-implement-ios-build`
- 기준 HEAD: `d0473362eddfbad3c59540efef8194f92660dfd5`
- 기준 `origin/develop`: `2a4751eaad940215080772f5cc8e2e544aa381ab`
- Xcode: 26.6 (`17F113`)
- Simulator: iPhone 17, iOS 26.5 (`23F77`)
- Device ID: `5C621868-90AD-4EFE-84A2-D240B22CADF0`
- Architecture: arm64

Task 브랜치는 최신 `origin/develop`보다 1개 커밋 앞서고 뒤처진 커밋이
없었다. 구현 변경은 미커밋 상태로 독립 검증했다.

## 2. workflow 정적 검증

`.github/workflows/ios-build.yml`에서 다음을 확인했다.

- workflow 이름: `ios-build`
- 단일 job 이름: `ios-build`
- trigger: `develop`·`main` 대상 `pull_request`, `workflow_dispatch`
- runner: `macos-26`
- job timeout: 15분
- 권한: `contents: read`
- checkout: `actions/checkout@v7`, `persist-credentials: false`
- artifact: `actions/upload-artifact@v7`, `if: always()`
- artifact 이름:
  `cooklog-ios-build-${{ github.run_id }}-${{ github.run_attempt }}`
- artifact 대상: build log 2개
- 파일 누락: `if-no-files-found: warn`
- 보존: 14일
- secret, 원격 STT endpoint·활성화 flag: 없음

공식 GitHub action release에서 `checkout`과 `upload-artifact`의 v7 major가
제공되는 것도 확인했다.

정적 검사:

- Ruby YAML parser: 통과
- `aiops validate task ... --strict`: 통과
- `git diff --check`: 통과
- untracked workflow·보고서·QA 문서 trailing whitespace: 없음
- 전체 변경 경로: Task `allowed_paths` 안

## 3. preflight 독립 검증

로컬 설치 경로는 `/Applications/Xcode.app`이므로 hosted 전용
`/Applications/Xcode_26.6.app` 존재 검사는 실행하지 않았다. 나머지 preflight
명령을 동일하게 재현했다.

정상 경로:

- Xcode `26.6`: 일치
- build `17F113`: 일치
- iOS 26.5 runtime의 사용 가능한 iPhone 17: 확인
- CookLog scheme의 iPhone 17·iOS 26.5 destination: 확인
- 종료 코드: 0

부정 경로:

- 잘못된 Xcode 기대값 검사: 종료 코드 1
- 존재하지 않는 runtime/device 검사: 종료 코드 5

`set -euo pipefail` 조건에서는 두 불일치 모두 preflight 단계에서 job을
중단시키며 자동 fallback 경로가 없다.

## 4. 정상 build 경로

workflow와 동일한 destination, 같은 DerivedData, `set -euo pipefail`과
`tee` 조건으로 두 단계를 순차 실행했다.

### Build app

- 종료 코드: 0
- 결과: `BUILD SUCCEEDED`
- log:
  `/private/tmp/cooklog-t002-qa-success.93sfjE/ios-build/xcodebuild-build.log`

### Build tests

- 종료 코드: 0
- 결과: `TEST BUILD SUCCEEDED`
- log:
  `/private/tmp/cooklog-t002-qa-success.93sfjE/ios-build/xcodebuild-build-for-testing.log`

두 단계는
`/private/tmp/cooklog-t002-qa-success.93sfjE/ios-build/DerivedData`를
공유했다. 첫 로그와 두 번째 로그가 모두 비어 있지 않은 파일로 생성됐다.

## 5. 컴파일 실패 감지

소스 파일을 변경하지 않고 다음 build setting을 명령행에 주입했다.

```text
OTHER_SWIFT_FLAGS=$(inherited) -cooklog-qa-intentional-compile-failure
```

결과:

- Swift driver unknown argument 오류: 확인
- 결과: `BUILD FAILED`
- `xcodebuild | tee` 전체 종료 코드: 65
- 실패 log:
  `/private/tmp/cooklog-t002-qa-failure.bNlEmW/ios-build/xcodebuild-build.log`
- `xcodebuild-build-for-testing.log`: 생성되지 않음

따라서 `pipefail`이 컴파일 실패를 보존하고, 첫 step 실패 시 기본 GitHub
Actions step 조건으로 두 번째 build step이 실행되지 않는 구조임을 확인했다.
artifact step은 `always()`이므로 존재하는 첫 로그를 업로드 대상으로 유지한다.

## 6. 잔여 위험

### QA-RISK-002-001: 실제 GitHub-hosted workflow 실행 미검증

로컬에서는 GitHub-hosted 전용 Xcode 앱 경로, Actions check 표시, 실제
`actions/upload-artifact` 업로드 결과를 완전히 재현할 수 없다.

심각도: 보통

후속 조건:

- `T-20260730-005` 실제 PR dry run에서 `ios-build` check 이름을 확인한다.
- hosted preflight의 `/Applications/Xcode_26.6.app` 경로와 image manifest를
  확인한다.
- 정상·실패 실행에서 artifact 이름, 두 로그 또는 조건부 단일 로그, 14일
  보존 설정을 확인한다.

## 7. 최종 판정

`PASS_WITH_RISK`.

고정 check·trigger·권한, 환경 fail-fast, 정상 build 두 단계, 컴파일 실패
종료 코드 보존과 artifact 경계가 Task 계약과 일치한다. 실제 hosted Actions
실행은 계획된 `T-20260730-005` 검증 조건으로 남기고 Task를
`verification_passed`로 Development Lead Agent에 인계한다.

## 8. 다음 Agent에게 전달할 말

```text
Task: T-20260730-002
현재 상태: verification_passed
검증 판정: PASS_WITH_RISK
다음 담당: Development Lead Agent / Completion Role
독립 검증:
- preflight 정상 통과 및 버전·runtime 불일치 실패 확인
- build 종료 코드 0, BUILD SUCCEEDED
- build-for-testing 종료 코드 0, TEST BUILD SUCCEEDED
- 컴파일 실패 종료 코드 65, 두 번째 단계 미실행
- 권한·trigger·artifact·allowed_paths 정합
잔여 위험:
- QA-RISK-002-001: 실제 GitHub-hosted workflow/check/artifact 실행 미검증
후속:
- T-20260730-005 PR dry run에서 hosted preflight와 artifact 확인
QA 보고서:
- .ai_project/qa/T-20260730-002_implement-ios-build-workflow-qa.md
```
