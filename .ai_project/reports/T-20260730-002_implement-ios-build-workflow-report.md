# T-20260730-002 실행 보고서

작성일: 2026-07-30
작성자: iOS Agent
상태: `completion_review`

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

## Development Lead 완료 검토

- iOS QA 판정: `PASS_WITH_RISK`
- 고정 구현 커밋: `d40ff5d`
- 정상 build·build-for-testing: 종료 코드 0
- 컴파일 실패 감지: 종료 코드 65
- workflow·job 이름: `ios-build`
- trigger·최소 권한·preflight·artifact 계약: 적합
- Task 허용 경로: 준수
- 최신 `origin/develop` 대비 뒤처짐: 0
- T-20260729-010 완료 기록과 공용 보드: 보존
- 미해결 차단 결함: 없음

`QA-RISK-002-001`의 실제 GitHub-hosted preflight·check·artifact 확인은 계획된
`T-20260730-005` PR dry run으로 인계할 수 있는 잔여 위험이다. 현재 Task 성공
기준과 독립 검증 기준을 충족해 `verification_passed -> completion_review`로
수용하며, `develop` 대상 PR 병합 후 `done`으로 확정한다.

## GitHub Actions 재작업

2026-07-31 PR #24의 최초 push 실행은 job 생성 전에 workflow validation으로
실패했다. job-level `env`는 `runner` context를 허용하지 않는데
`COOKLOG_CI_ROOT`에서 `${{ runner.temp }}`를 참조한 것이 원인이다.

Product Owner의 재작업 승인에 따라 `COOKLOG_CI_ROOT`는 첫 preflight step에서
기본 환경 변수 `RUNNER_TEMP`, `GITHUB_RUN_ID`, `GITHUB_RUN_ATTEMPT`로 계산하고
`GITHUB_ENV`에 기록하도록 수정했다. 후속 build와 artifact 단계의 기존 경로
계약은 유지한다. 실제 hosted 실행 통과 전까지 Task를 `in_progress`로
되돌리고 PR 병합을 보류한다.

수정 커밋 `3243da6`을 push한 뒤 PR #24의 GitHub Actions run
`30592350218`에서 다음을 확인했다.

- check와 job 이름: `ios-build`
- preflight: 성공
- 앱 build: 성공
- test build: 성공
- build log artifact upload: 성공
- artifact: `cooklog-ios-build-30592350218-1`, 미만료
- 전체 결론: `success`

따라서 최초 validation 결함과 `QA-RISK-002-001`을 해소했으며 Task를 다시
`completion_review`로 전환해 `develop` 병합 대상으로 확정한다.
