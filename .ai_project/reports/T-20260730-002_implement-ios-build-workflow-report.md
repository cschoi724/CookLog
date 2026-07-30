# T-20260730-002 실행 보고서

작성일: 2026-07-30
작성자: iOS Agent
상태: `verification_ready`

## 결과

`develop`·`main` 대상 pull request와 수동 실행에서 단일 `ios-build` check를
생성하는 workflow를 구현했다. 고정 CI 환경을 확인한 뒤 같은 DerivedData에서
앱 build와 test bundle build를 순차 실행하고, 실패 시 정확한 종료 코드와
build log를 남긴다.

## workflow 계약

- runner: `macos-26`
- Xcode: 26.6 (`17F113`)
- destination: `platform=iOS Simulator,name=iPhone 17,OS=26.5`
- check 이름: `ios-build`
- 명령: `build` 성공 후 `build-for-testing`
- timeout: 15분
- 권한: `contents: read`
- artifact: build log 두 개, 14일
- secret: 사용하지 않음

preflight는 Xcode 앱 경로, 정확한 Xcode 버전과 build 번호, iOS 26.5 runtime의
사용 가능한 iPhone 17, Xcode project destination을 모두 확인한다. 고정 조합이
없으면 fallback 없이 job을 실패시킨다.

두 build step은 `set -euo pipefail`을 적용해 `xcodebuild | tee`에서
`xcodebuild` 실패가 가려지지 않는다. `build`가 실패하면 기본 step 조건에 따라
`build-for-testing`은 실행되지 않는다. artifact upload만 `always()`로 실행하며
누락 파일은 경고로 처리한다.

## 개발자 검증

환경:

- Xcode 26.6 (`17F113`)
- iPhone 17 Simulator
- iOS 26.5 (`23F77`)
- destination: `platform=iOS Simulator,name=iPhone 17,OS=26.5`

정상 경로:

- `xcodebuild build`: 종료 코드 0, `BUILD SUCCEEDED`
- `xcodebuild build-for-testing`: 종료 코드 0, `TEST BUILD SUCCEEDED`
- 같은 DerivedData 사용 확인
- 로그:
  `/private/tmp/cooklog-t002-success-20260730-1730/ios-build/`

실패 경로:

- 소스 변경 없이 명령행 `OTHER_SWIFT_FLAGS`에 알 수 없는 Swift 옵션 주입
- Swift driver compile 오류 발생
- `xcodebuild | tee` 전체 종료 코드: 65
- 결과: `BUILD FAILED`
- 로그:
  `/private/tmp/cooklog-t002-compile-failure-20260730-1731/ios-build/xcodebuild-build.log`

정적 검증:

- Ruby YAML parser 구문 검사: 통과
- `aiops validate task ... --strict`: 통과
- `git diff --check`: 통과
- 변경 경로: Task `allowed_paths` 안

## 변경 파일

- `.github/workflows/ios-build.yml`
- `apps/ios/docs/TESTING.md`
- `.ai_project/tasks/active/T-20260730-002_implement-ios-build-workflow.md`
- `.ai_project/reports/T-20260730-002_implement-ios-build-workflow-report.md`
- `.ai_project/qa/T-20260730-002_implement-ios-build-workflow-qa.md`
- `.ai_project/teams/development/task_board.md`
- `.ai_project/teams/quality/task_board.md`

## 잔여 검증과 QA 요청

로컬 Xcode는 `/Applications/Xcode.app`에 설치되어 있어 GitHub-hosted runner의
`/Applications/Xcode_26.6.app` 실제 경로는 로컬에서 재현하지 못했다.
T-20260730-005의 실제 PR dry run 범위에서 hosted preflight와 artifact 업로드를
최종 확인한다.

iOS QA Agent는 다음을 독립 확인한다.

- workflow와 job 이름이 모두 정확히 `ios-build`인지
- `develop`·`main` pull request trigger와 최소 권한
- preflight가 버전·destination 불일치에서 fail-fast하는지
- `build` 실패 시 `build-for-testing`이 실행되지 않는지
- `pipefail`이 compile 실패 종료 코드를 보존하는지
- 정상·실패 build log artifact 경로, 이름, 14일 보존
- secret과 원격 STT 설정이 추가되지 않았는지
