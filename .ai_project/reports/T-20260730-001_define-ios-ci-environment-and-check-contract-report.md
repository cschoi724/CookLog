# T-20260730-001 실행 보고서

작성일: 2026-07-30
작성자: iOS Agent
상태: `completion_review`

## 결과

후속 `T-20260730-002`와 `T-20260730-003`이 추가 환경 판단 없이 구현할 수 있도록 GitHub-hosted iOS CI 계약을 확정했다.

| 항목 | 확정값 |
|---|---|
| runner | `macos-26` arm64 |
| Xcode | 26.6 (`17F113`) |
| Xcode path | `/Applications/Xcode_26.6.app/Contents/Developer` |
| Simulator | iPhone 17, iOS 26.5 |
| destination | `platform=iOS Simulator,name=iPhone 17,OS=26.5` |
| build check | `ios-build` |
| test check | `ios-xctest` |
| script timeout | 600초, timeout 종료 코드 124 |
| job timeout | 15분 |
| artifact root | `${RUNNER_TEMP}/cooklog-ci/${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}` |
| artifact retention | 14일 |

## 명령 경계

- `ios-build`는 같은 DerivedData 경로에서 `xcodebuild build` 후 `build-for-testing`을 실행한다.
- `ios-xctest`는 `COOKLOG_XCTEST_DESTINATION`, `COOKLOG_XCTEST_TIMEOUT_SECONDS`, `COOKLOG_XCTEST_ARTIFACT_ROOT`만 지정하고 `apps/ios/Scripts/run-xctest.sh`를 실행한다.
- workflow가 별도 `xcodebuild test`나 `test-without-building`을 추가하지 않는다.
- runner image가 갱신돼 고정 Xcode 또는 destination이 없어지면 자동 대체하지 않고 preflight에서 실패한다.
- `ios-build`는 두 build log, `ios-xctest`는 실행별 log·존재하는 xcresult·timeout marker를 항상 artifact upload 대상으로 삼는다.

## 근거와 정책

- GitHub 공식 hosted runner 목록과 `runner-images`의 macOS 26 ARM64 manifest `20260720.0258.1`에서 runner architecture, Xcode 26.6, iOS 26.5 Simulator와 iPhone 17 제공 여부를 확인했다.
- T-004는 Xcode 26.6 (`17F113`), iPhone 15, iOS 17.2에서 XCTest 33개를 3회 연속 통과했다.
- GitHub-hosted image에는 T-004와 같은 Xcode 26.6이 있지만 iOS 17.2 runtime은 없어, 공식 image가 제공하는 iOS 26.5를 CI 기준으로 선택하고 Simulator 차이를 QA 위험으로 남겼다.
- 첫 출시 STT는 Apple 기기 내 처리가 기본이며 원격 STT는 기본 비활성 adapter다. CI 계약에는 원격 STT secret이나 활성화 조건이 없다.

## 변경 파일

- `apps/ios/README.md`
- `apps/ios/docs/TESTING.md`
- `docs/GIT_WORKFLOW.md`
- `.ai_project/tasks/active/T-20260730-001_define-ios-ci-environment-and-check-contract.md`
- `.ai_project/reports/T-20260730-001_define-ios-ci-environment-and-check-contract-report.md`
- `.ai_project/teams/development/task_board.md`
- `.ai_project/teams/quality/task_board.md`

## 자체 검증

- 기준 branch와 HEAD: `task/T-20260730-001-define-ios-ci-contract`, `8a36f22`
- `origin/develop`: `8a36f22`
- workflow와 앱 구현 코드 미변경 확인
- 문서의 runner·Xcode·Simulator·destination·check·timeout·artifact 값 교차 대조
- `aiops validate task .ai_project/tasks/active/T-20260730-001_define-ios-ci-environment-and-check-contract.md --strict` 통과
- `bash -n apps/ios/Scripts/run-xctest.sh` 통과
- `git diff --check` 통과

## 잔여 위험과 QA 요청

- Xcode 26.6·iOS 26.5에서 XCTest 33개를 아직 실행하지 않았다. workflow 구현 후 GitHub-hosted runner에서 재검증해야 한다.
- T-004와 CI의 Simulator·runtime 차이로 SwiftData 또는 Simulator worker 회귀가 생길 수 있다.
- GitHub-hosted image는 갱신되므로 고정 patch나 runtime이 제거될 수 있다. preflight 실패 시 계약 변경 Task로 재선정해야 하며 자동 fallback은 금지한다.
- iOS QA Agent는 로컬 T-004 근거와 CI 계약 차이, timeout 124, artifact 조건과 제품 정책 비회귀를 독립 검증한다.

## QA 재작업 해소와 재개

최초 iOS QA에서 CI destination인 iPhone 17·iOS 26.5의
`SwiftDataRecipeLocalDataSourceTests` 3개가 crash해 `rework_requested`로
전환됐다. 원인은 별도 `T-20260730-007`에서 테스트 fixture가
`ModelContainer` 수명을 보장하지 않던 문제로 확정됐다.

- 기능 수정 PR: [#18](https://github.com/cschoi724/CookLog/pull/18)
- 완료 상태 PR: [#19](https://github.com/cschoi724/CookLog/pull/19)
- iPhone 17·iOS 26.5 전체 XCTest: 33/33
- iPhone 15·iOS 17.2 전체 XCTest: 33/33
- iOS QA: `PASS`
- T-007 상태: `done`

T-001 최신 `develop` 재정렬 후 동일 CI destination을 다시 실행한 결과:

- 실행 시각: 2026-07-30 16:32 KST
- 종료 코드: 0
- 전체 XCTest: 33/33, 실패 0
- log:
  `/private/tmp/cooklog-t001-resume-validation/20260730-163221-25211/xcodebuild.log`
- xcresult:
  `/private/tmp/cooklog-t001-resume-validation/20260730-163221-25211/CookLogTests.xcresult`

공식 hosted runner·Xcode·Simulator 계약 자체에는 결함이 없었고 T-007 수정 후
동일 destination의 전체 XCTest가 통과하므로 환경 계약은 변경하지 않는다.
T-001을 `verification_ready`로 재인계하고 iOS QA가 계약 정합성, 전체 XCTest,
timeout·artifact 경계를 독립 재검증한다.

## Development Lead 완료 검토

- iOS QA 재검증 판정: `PASS`
- 확정 destination 전체 XCTest: 33/33
- `QA-HIGH-001`: 해소
- timeout 계약: 종료 코드 124, `TIMED_OUT`·로그·부분 xcresult 보존 확인
- build 경계: `build`, `build-for-testing` 모두 종료 코드 0
- 공식 runner·Xcode·Simulator 계약: 정합
- 최종 변경 경로: 모두 Task `allowed_paths` 안
- workflow·앱 제품 구현 코드 변경: 없음
- 미해결 차단 결함: 없음

후속 workflow Task가 추가 환경 판단 없이 사용할 계약과 독립 검증 기준을
충족했다. Development Lead Agent가
`verification_passed -> completion_review`로 수용하며, `develop` 대상 PR이
병합된 뒤 `done`으로 확정한다.
