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
