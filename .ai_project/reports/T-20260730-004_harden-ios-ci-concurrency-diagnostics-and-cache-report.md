# T-20260730-004 실행 보고서

작성일: 2026-07-31
작성자: iOS Agent
상태: `verification_passed`

## 결과

`ios-build`와 `ios-xctest`의 기존 check 이름·책임·고정 환경을 유지하면서
같은 PR의 이전 실행 취소, 공통 preflight 진단, 실패 후 Step Summary와
artifact를 통합했다. 현재 저장소에 검증 가능한 dependency cache 후보가 없어
DerivedData를 포함한 cache는 추가하지 않았다.

## concurrency

두 workflow의 group:

```text
<github.workflow>-<github.event_name>-<PR number 또는 github.ref>
```

- 같은 workflow·event·PR의 새 실행은 이전 실행을 취소한다.
- PR 번호가 다르면 group이 다르다.
- `ios-build`와 `ios-xctest`는 workflow 이름이 달라 서로 취소하지 않는다.
- 수동 실행은 전체 ref를 사용해 branch별로 격리한다.

GitHub 공식 문서는 서로 다른 workflow의 교차 취소를 막기 위해 group에
`github.workflow`를 포함하도록 안내한다.

- [GitHub concurrency 문서](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency)

## 공통 진단

`.github/actions/prepare-ios-ci/action.yml`:

- 실행별 CI root와 XCTest artifact root 설정
- Xcode 26.6 (`17F113`)·iPhone 17·iOS 26.5 fail-fast
- runner·run·고정 destination·cache 정책·디스크·Simulator 진단
- 안전한 `ci-environment.log` 생성

`.github/actions/summarize-ios-ci/action.yml`:

- `job.status`, ref, SHA, run·attempt와 cache 정책 요약
- 생성된 허용 artifact 목록
- GitHub Step Summary와 `ci-summary.md` 동시 생성
- 원래 실패를 덮어쓰지 않도록 항상 종료 코드 0

환경 전체 dump, token, secret, 음성 또는 사용자 입력은 기록하지 않는다.

## cache 결정

검사 결과:

- `Package.resolved`: 없음
- CocoaPods·Carthage lockfile: 없음
- Xcode remote package reference: 없음

GitHub cache는 dependency 입력을 식별하는 key와 실제 재사용 경로가 있어야
하고 cache 경로에 민감정보를 넣지 않아야 한다.

- [GitHub dependency caching 문서](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)

따라서 현재 정책은 `disabled-no-dependency-lockfile`이다. DerivedData는
runner image·Xcode·SDK·build setting과 결합된 산출물이므로 실행 간 cache하지
않는다. lockfile이 생기면 `disabled-pending-measured-verification`으로
표시하고 별도 측정과 QA 비회귀 검증 전까지 자동 cache하지 않는다.

## artifact 통합

- `ios-build`: 기존 build log 2개 + environment·summary
- `ios-xctest`: 기존 log·조건부 xcresult·timeout marker + environment·summary
- 보존: 14일
- upload: `always()`, 누락은 warning
- 제외: DerivedData

## 개발자 검증

### 공통 action

- 로컬 Xcode 경로 치환 preflight: 종료 코드 0
- Xcode: 26.6 (`17F113`)
- destination: iPhone 17·iOS 26.5
- environment log·cache 정책: 확인
- 고정 hosted Xcode 경로 누락: 종료 코드 1, 진단 log 보존
- summary: 종료 코드 0, Step Summary·`ci-summary.md` 생성
- 경로: `/private/tmp/cooklog-t004-action-validation/`

### cache 미적용 build 회귀

- `build`: 종료 코드 0, `BUILD SUCCEEDED`
- `build-for-testing`: 종료 코드 0, `TEST BUILD SUCCEEDED`
- 경로: `/private/tmp/cooklog-t004-build-regression-20260731-1101/`

### cache 미적용 XCTest 회귀

- 전체: 33
- 통과: 33
- 실패·skip: 0
- 종료 코드: 0
- xcresult 존재, `TIMED_OUT` 없음
- 경로:
  `/private/tmp/cooklog-t004-xctest-regression-20260731-1102/20260731-110134-61847/`

## 정적 검증

- workflow·composite action YAML parse: 통과
- 모든 workflow·action run script `bash -n`: 통과
- `bash -n apps/ios/Scripts/run-xctest.sh`: 통과
- `aiops validate task ... --strict`: 통과
- `git diff --check`: 통과
- 변경 경로: Task `allowed_paths` 안

## 변경 파일

- `.github/workflows/ios-build.yml`
- `.github/workflows/ios-xctest.yml`
- `.github/actions/prepare-ios-ci/action.yml`
- `.github/actions/summarize-ios-ci/action.yml`
- `apps/ios/docs/TESTING.md`
- `.ai_project/tasks/active/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache.md`
- `.ai_project/reports/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache-report.md`
- `.ai_project/qa/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache-qa.md`
- `.ai_project/teams/development/task_board.md`
- `.ai_project/teams/quality/task_board.md`

## QA 요청과 잔여 검증

iOS QA Agent는 다음을 독립 확인한다.

- 같은 PR 재실행은 이전 동일 check를 취소하는지
- 다른 PR·branch와 두 workflow가 서로 취소되지 않는지
- check 이름이 `ios-build`, `ios-xctest`로 유지되는지
- cache 미적용에서 build 두 단계와 XCTest 33/33이 통과하는지
- preflight·build·test 실패 후 environment·summary·기존 artifact가 남는지
- DerivedData·secret·사용자 입력이 artifact에 없는지
- summary 단계가 원래 실패 결과를 성공으로 바꾸지 않는지

실제 GitHub concurrency 취소와 hosted artifact·Step Summary는 T-004 PR
실행과 후속 T-005 dry run에서 확인해야 한다.

## 독립 QA 결과

iOS QA Agent가 최신 `origin/develop` 기반 고정 커밋 `f2efd4f`를 독립
검증했다.

- concurrency group의 workflow·event·PR 또는 ref 격리: 정합
- 공통 preflight: 로컬 경로 치환 정상 0, hosted 경로 누락 1, 잘못된 artifact
  하위 경로 2
- cache 미적용 `build`, `build-for-testing`: 성공
- 전체 XCTest: 33/33, 종료 코드 0
- 의도적 build 실패: 종료 코드 65, 환경·build log·summary 보존
- XCTest timeout: 종료 코드 124, 환경·log·부분 xcresult·marker·summary 보존
- 판정: `PASS_WITH_RISK`

실제 GitHub concurrency 취소와 hosted artifact·Step Summary 확인을
`QA-RISK-004-001`로 남겼다. T-004 PR과 후속 `T-20260730-005` dry run에서
확인한다.

## Development Lead 완료 검토

구현과 QA 결과를 최신 `origin/develop` `dedfa74` 위로 재정렬했다. 재정렬된
구현 커밋은 `bd109e6`, QA 결과 커밋은 `3ace799`다.

- 재정렬 전 `f2efd4f`와 workflow·action·TESTING 핵심 내용: 동일
- 최신 `origin/develop` 대비 behind: 0
- `T-20260729-021 done`과 공용 보드 기록: 보존
- workflow·composite action YAML parse: PASS
- XCTest runner `bash -n`: PASS
- Task strict validation·`git diff --check`: PASS
- 변경 11개 경로: Task `allowed_paths` 안
- iOS QA: `PASS_WITH_RISK`
- 차단 결함: 없음

hosted 정상 preflight·summary·artifact는 T-004 PR의 필수 check로 확인한다.
같은 PR 연속 실행 취소와 hosted 실패 진단은 `T-20260730-005`로 인계 가능한
비차단 위험이다. Development Lead가 성공 기준과 독립 QA 증빙을 수용해
`completion_review`로 전환한다.
