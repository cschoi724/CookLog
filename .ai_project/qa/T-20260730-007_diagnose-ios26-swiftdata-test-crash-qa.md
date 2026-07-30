# T-20260730-007 iOS 독립 QA 보고서

작성일: 2026-07-30
작성자: iOS QA Agent
대상 Task: `T-20260730-007`
판정: `PASS`

## 1. 검증 환경

- Worktree: `/private/tmp/cooklog-t20260730-007`
- Branch: `task/T-20260730-007-diagnose-swiftdata-ios26-crash`
- 검증 커밋: `36c4c088236966ba8233cfdc2c5e7df5e47cc0a9`
- 기준 브랜치: `origin/develop` `af4b9594fabce998dacf7c56aca8309a4cb154b6`
- Xcode: 26.6 (`17F113`)
- iOS 26.5 Simulator: iPhone 17, `5C621868-90AD-4EFE-84A2-D240B22CADF0`
- iOS 17.2 Simulator: iPhone 15, `3210F1DE-54D5-4B79-9066-0925FA8BB442`
- Architecture: arm64

검증 시작 시 Task worktree는 최신 `origin/develop`보다 1개 커밋 앞선 깨끗한
상태였고, 뒤처진 커밋은 없었다.

## 2. iOS 26.5 crash 회귀 검증

기존에 crash했던 `SwiftDataRecipeLocalDataSourceTests`만 먼저 독립 실행했다.

결과:

- 실행 테스트: 저장·정렬·삭제 3개
- 통과: 3
- 실패: 0
- 종료 코드: 0
- 판정: `Passed`
- xcresult:
  `/private/tmp/cooklog-t007-qa-selected.lvQZef/CookLogSelectedTests.xcresult`

`testSaveAndFetchRecipe`, `testFetchRecipesSortsByUpdatedAtDescending`,
`testDeleteRecipe`가 모두 통과했다. 기존 `SIGTRAP`과 test host 재시작은
재발하지 않았다.

## 3. iOS 26.5 전체 XCTest

실행:

```bash
COOKLOG_XCTEST_DESTINATION='platform=iOS Simulator,name=iPhone 17,OS=26.5' \
COOKLOG_XCTEST_ARTIFACT_ROOT=/private/tmp/cooklog-t007-qa-full-ios26 \
COOKLOG_XCTEST_TIMEOUT_SECONDS=600 \
apps/ios/Scripts/run-xctest.sh
```

결과:

- 종료 코드: 0
- 전체: 33
- 통과: 33
- 실패: 0
- skip: 0
- result: `Passed`
- OS build: `23F77`
- log:
  `/private/tmp/cooklog-t007-qa-full-ios26/20260730-155333-62077/xcodebuild.log`
- xcresult:
  `/private/tmp/cooklog-t007-qa-full-ios26/20260730-155333-62077/CookLogTests.xcresult`

## 4. iOS 17.2 회귀

실행:

```bash
COOKLOG_XCTEST_DESTINATION='platform=iOS Simulator,name=iPhone 15,OS=17.2' \
COOKLOG_XCTEST_ARTIFACT_ROOT=/private/tmp/cooklog-t007-qa-full-ios17 \
COOKLOG_XCTEST_TIMEOUT_SECONDS=600 \
apps/ios/Scripts/run-xctest.sh
```

결과:

- 종료 코드: 0
- 전체: 33
- 통과: 33
- 실패: 0
- skip: 0
- result: `Passed`
- OS build: `21C62`
- log:
  `/private/tmp/cooklog-t007-qa-full-ios17/20260730-155427-63591/xcodebuild.log`
- xcresult:
  `/private/tmp/cooklog-t007-qa-full-ios17/20260730-155427-63591/CookLogTests.xcresult`

## 5. 코드와 정책 검토

- `TestStore`가 `ModelContainer`와
  `SwiftDataRecipeLocalDataSource`를 함께 보유한다.
- 제품 저장소 구현은 변경되지 않았다.
- 저장·조회·정렬·삭제 assertion은 약화되거나 제거되지 않았다.
- `git diff --check origin/develop..HEAD`: 통과
- `bash -n apps/ios/Scripts/run-xctest.sh`: 통과

기능 성공 기준과 최소 지원 OS 회귀 기준은 모두 충족했다.

## 6. 결함

### QA-HIGH-007-001: Task allowed_paths 밖 파일이 커밋에 포함됨

`git diff --name-status origin/develop..HEAD`에서
`.ai_project/task_board.md` 변경이 확인된다. 이 경로는 Task의
`allowed_paths`에 포함되어 있지 않다.

관련 정책:

- 자신에게 배정된 `allowed_paths`만 수정한다.
- `docs/GIT_WORKFLOW.md`의 작업 종료 조건은 전체 변경 경로가
  `allowed_paths` 안에 있어야 한다.

영향:

- 기능 검증은 통과했지만 Task 변경 범위가 승인된 범위를 벗어났다.
- 현재 커밋은 독립 QA 통과 및 Development Lead 완료 검토로 인계할 수 없다.

필수 조치:

- `.ai_project/task_board.md` 변경을 Task 커밋에서 제외하거나,
  Product Owner 승인으로 해당 경로를 `allowed_paths`에 명시적으로 추가한다.
- 정리 후 최신 `origin/develop` 기반의 깨끗한 전용 worktree에서
  `verification_ready`로 다시 인계한다.

### QA-HIGH-007-001 해소 확인

재작업 커밋:

- `61fca6d1188e3fad5972e6ea65757550f90f7415`

확인 결과:

- 최신 `origin/develop` `af4b959`보다 1개 커밋 앞서고 뒤처진 커밋이 없다.
- `.ai_project/task_board.md`는 `origin/develop`과 동일하다.
- 변경 파일 6개는 모두 Task `allowed_paths` 안에 있다.
- 재작업 전후
  `apps/ios/CookLogTests/SwiftDataRecipeLocalDataSourceTests.swift` blob은
  `ed743e9b720d12fe4367f2481ad7282350b9d444`로 동일하다.
- 재작업 커밋에서 iPhone 17/iOS 26.5 핵심 저장·정렬·삭제 테스트를 다시
  실행해 3/3 통과, 실패·skip 0, 종료 코드 0을 확인했다.
- 재검증 xcresult:
  `/private/tmp/cooklog-t007-qa-rework-selected.fUnBWW/CookLogSelectedTests.xcresult`
- `git diff --check origin/develop..HEAD`: 통과
- Task strict metadata 검증: 통과

따라서 `QA-HIGH-007-001`은 해소됐다. 기능 코드가 최초 전체 회귀 검증 시점과
동일하므로 iOS 26.5와 iOS 17.2의 전체 XCTest 33/33 결과도 유효하다.

## 7. 최종 판정

`PASS`.

iOS 26.5 crash 해소, 전체 33/33과 iOS 17.2 전체 33/33은 독립 확인했다.
재작업 커밋에서 `QA-HIGH-007-001` 해소와 핵심 테스트 3/3 무회귀를 확인했다.
Task를 `verification_passed`로 Development Lead Agent에 인계한다.

## 8. 다음 Agent에게 전달할 말

```text
Task: T-20260730-007
현재 상태: verification_passed
검증 판정: PASS
다음 담당: Development Lead Agent / Lead Role
기능 검증:
- iPhone 17 / iOS 26.5 기존 crash 테스트 3/3 통과
- iPhone 17 / iOS 26.5 전체 XCTest 33/33 통과
- iPhone 15 / iOS 17.2 전체 XCTest 33/33 통과
재작업 확인:
- QA-HIGH-007-001 해소
- 변경 파일 6개 모두 allowed_paths 안에 있음
- 재작업 커밋에서 핵심 테스트 3/3 재통과
QA 보고서:
- .ai_project/qa/T-20260730-007_diagnose-ios26-swiftdata-test-crash-qa.md
```
