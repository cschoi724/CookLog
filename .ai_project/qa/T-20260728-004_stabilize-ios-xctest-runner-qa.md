# T-20260728-004 iOS 독립 QA 보고서

작성일: 2026-07-28
작성자: iOS QA Agent
대상 Task: `T-20260728-004`
판정: `PASS_WITH_RISK`

## 1. 검증 환경

- Worktree: `/private/tmp/cooklog-t004`
- Branch: `task/T-20260728-004-stabilize-ios-xctest-runner`
- 시작 기준: `origin/develop` `467719f`
- Xcode: 26.6 (`17F113`)
- Simulator: iPhone 15
- iOS: 17.2 (`21C62`)
- Device ID: `3210F1DE-54D5-4B79-9066-0925FA8BB442`

현재 Mac에는 Xcode 15.2가 설치되어 있지 않아 과거 toolchain의 `waiting for workers to materialize` 증상을 동일 환경에서 재현할 수 없었다.

## 2. 전체 XCTest 독립 재현

실행 명령:

```bash
COOKLOG_XCTEST_ARTIFACT_ROOT=/private/tmp/cooklog-t004-qa-full \
Scripts/run-xctest.sh
```

결과:

- 스크립트 종료 코드: 0
- 제한 시간: 600초
- 테스트 결과: 33개 통과, 0개 실패, 0개 skip
- `xcresult` 결과: `Passed`
- `xcresult` 기준 시작~종료: 24.172초
- 병렬 실행: 비활성
- 최대 worker: 1

Artifact:

- `/private/tmp/cooklog-t004-qa-full/20260728-171622-31459/xcodebuild.log`
- `/private/tmp/cooklog-t004-qa-full/20260728-171622-31459/CookLogTests.xcresult`

`xcrun xcresulttool get test-results summary`로 iPhone 15, iOS 17.2에서 `totalTestCount: 33`, `passedTests: 33`, `failedTests: 0`을 확인했다.

## 3. Timeout 독립 재현

실행 명령:

```bash
COOKLOG_XCTEST_TIMEOUT_SECONDS=1 \
COOKLOG_XCTEST_ARTIFACT_ROOT=/private/tmp/cooklog-t004-qa-timeout \
Scripts/run-xctest.sh
```

결과:

- 종료 코드: 124
- `TIMED_OUT` marker: 생성
- `xcodebuild.log`: 생성, 512 bytes
- 부분 `xcresult`: 생성 전 timeout되어 없음

Artifact:

- `/private/tmp/cooklog-t004-qa-timeout/20260728-173753-56011/TIMED_OUT`
- `/private/tmp/cooklog-t004-qa-timeout/20260728-173753-56011/xcodebuild.log`

timeout과 일반 테스트 실패를 종료 코드와 marker로 구분할 수 있고, 부분 `xcresult`가 존재할 때만 보존한다는 문서 기준과 일치한다.

## 4. 추가 회귀 검증

- `bash -n Scripts/run-xctest.sh`: 통과
- `xcodebuild ... build -quiet`: 통과
- `xcodebuild ... build-for-testing -quiet`: 통과
- `git diff --check`: 통과
- 전체 변경 경로: Task의 `allowed_paths` 안에 있음
- 제품 UI·기능 구현 변경: 없음

`RecipePersistenceMapperTests` 2개는 in-memory `ModelContainer`에 persistent model을 삽입한 실제 저장 조건에서 통과했다.

## 5. 잔여 위험

### QA-RISK-004-001: Xcode 15.2 동일 환경 미검증

- 과거 대기 증상이 발생한 Xcode 15.2 설치본이 현재 환경에 없다.
- Xcode 26.6에서는 직렬 전체 XCTest가 명확히 종료되고 독립 QA도 통과했다.
- 따라서 현재 지원 toolchain의 안정화는 확인했지만 Xcode 15.2에서 동일 수정이 대기를 해소하는지는 확정할 수 없다.

심각도: 보통

권장 조치:

- `T-20260728-008`에서 `ios-xctest` 실행 Xcode 버전을 명시한다.
- Hosted Runner에서 사용할 Xcode와 iOS Simulator 조합으로 동일 스크립트를 실행한다.
- CI 반복 결과가 확보되기 전에는 Xcode 15.2 호환성까지 보장한다고 해석하지 않는다.

## 6. 최종 판정

`PASS_WITH_RISK`.

전체 33개 XCTest의 명확한 종료, 정상 로그·`xcresult`, timeout 종료 코드 124와 marker, build·build-for-testing 회귀 기준은 모두 통과했다. Xcode 15.2 동일 환경 재현 불가 위험은 후속 CI toolchain 고정 조건으로 인계한다.

## 7. 다음 Agent에게 전달할 말

```text
Task: T-20260728-004
현재 상태: verification_passed
검증 판정: PASS_WITH_RISK
다음 담당: Development Lead Agent / Completion Role
잔여 위험:
- QA-RISK-004-001: Xcode 15.2 동일 환경 미검증
후속 조건:
- T-20260728-008에서 ios-xctest Xcode/Simulator 버전 명시
- Hosted Runner에서 동일 스크립트와 artifact 기준 재검증
QA 보고서:
- .ai_project/qa/T-20260728-004_stabilize-ios-xctest-runner-qa.md
```

## 8. 위험 수용 기록

- 2026-07-28: Product Owner가 `QA-RISK-004-001`을 수용했다.
- Xcode 15.2 호환성은 T-004 완료 범위에서 보장하지 않는다.
- T-20260728-008에서 CI의 Xcode와 Simulator 버전을 명시하고 동일 XCTest, timeout과 artifact 절차를 재검증한다.
