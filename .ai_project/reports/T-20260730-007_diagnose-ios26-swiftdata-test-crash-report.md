# T-20260730-007 실행 보고서

작성일: 2026-07-30
작성자: iOS Agent
상태: `verification_ready`

## 결과

Xcode 26.6, iPhone 17, iOS 26.5에서
`SwiftDataRecipeLocalDataSourceTests` 3개가 모두 test host crash로 실패하는
현상을 재현했다. 테스트 helper가 생성한 `ModelContainer`를 테스트 종료까지
보유하도록 fixture 수명을 최소 수정한 뒤, 제품 저장소 변경 없이 iOS 26.5와
iOS 17.2 전체 XCTest가 각각 33/33 통과했다.

## 재현

환경:

- Xcode 26.6 (`17F113`)
- iPhone 17 Simulator
- iOS 26.5 (`23F77`)
- 직렬 실행, 최대 worker 1

수정 전 선택 테스트 결과:

- `SwiftDataRecipeLocalDataSourceTests` 3개 실행
- 통과 0, 실패 3
- 각 테스트 시작 직후 test host 재시작
- `xcodebuild` 종료 코드 65
- result: `/private/tmp/cooklog-t007-repro-20260730-1523.xcresult`

crash diagnostics:

- 예외: `EXC_BREAKPOINT`
- signal: `SIGTRAP`
- 종료 code: 5
- 세 stack의 공통 경로:
  `SwiftData.framework` ->
  `SwiftDataRecipeLocalDataSource.fetchPersistentRecipe(id:)` ->
  `saveRecipe(_:)`
- 관계 mapper나 assertion에 도달하기 전, 첫 저장이 기존 ID를 조회하는 단계에서
  동일하게 종료됐다.

## 원인 분리와 수정

기존 `makeDataSource()`는 지역 변수로 `ModelContainer`를 만들고
`modelContainer.mainContext`를 주입한 data source만 반환했다. 따라서 비동기
테스트가 실제 fetch/save를 수행하는 동안 container 수명이 명시적으로 보장되지
않았다. iOS 26.5에서는 첫 fetch 시 SwiftData 내부 `SIGTRAP`으로 드러났고, iOS
17.2에서는 우연히 통과했다.

수정:

```swift
private final class TestStore {
    let modelContainer: ModelContainer
    let dataSource: SwiftDataRecipeLocalDataSource

    init(modelContainer: ModelContainer) {
        self.modelContainer = modelContainer
        dataSource = SwiftDataRecipeLocalDataSource(
            modelContext: modelContainer.mainContext
        )
    }
}
```

원인 분리를 위해 predicate의 함수 인자를 지역 불변값으로 캡처하는 제품 코드
변경도 시험했다. 이후 해당 변경을 원상복구하고 container 수명 수정만 적용한
상태에서 선택 테스트 3/3과 전체 회귀를 다시 통과해 fixture 수명이 원인임을
확정했다.

Apple 문서상 `ModelContainer`는 schema와 model storage를 관리하며 fetch와
save의 실제 read/write를 수행한다. 최종 수정은 테스트가 이 storage owner를
명시적으로 보유하게 할 뿐 제품 ID predicate나 저장 동작은 변경하지 않는다.

- [Apple ModelContainer 문서](https://developer.apple.com/documentation/swiftdata/modelcontainer)
- [Apple ModelContext 문서](https://developer.apple.com/documentation/swiftdata/modelcontext)

## 개발자 검증

### iOS 26.5 선택 테스트

- 결과: 3/3 통과, 실패 0, 종료 코드 0
- result:
  `/private/tmp/cooklog-t007-container-retention-20260730-1535.xcresult`

### iOS 26.5 전체 XCTest

- 명령: `Scripts/run-xctest.sh`
- destination: `platform=iOS Simulator,name=iPhone 17,OS=26.5`
- 결과: 33/33 통과, 실패 0, skip 0, 종료 코드 0
- log:
  `/private/tmp/cooklog-t007-final-ios26/20260730-153533-33085/xcodebuild.log`
- result:
  `/private/tmp/cooklog-t007-final-ios26/20260730-153533-33085/CookLogTests.xcresult`

### iOS 17.2 회귀

- 명령: `Scripts/run-xctest.sh`
- destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`
- 결과: 33/33 통과, 실패 0, skip 0, 종료 코드 0
- log:
  `/private/tmp/cooklog-t007-final-ios17/20260730-153552-33764/xcodebuild.log`
- result:
  `/private/tmp/cooklog-t007-final-ios17/20260730-153552-33764/CookLogTests.xcresult`

## 변경 파일

- `apps/ios/CookLogTests/SwiftDataRecipeLocalDataSourceTests.swift`
- `.ai_project/tasks/active/T-20260730-007_diagnose-ios26-swiftdata-test-crash.md`
- `.ai_project/reports/T-20260730-007_diagnose-ios26-swiftdata-test-crash-report.md`
- `.ai_project/teams/development/task_board.md`
- `.ai_project/teams/quality/task_board.md`

Task 등록 시 이미 변경돼 있던 `.ai_project/task_board.md`는 `allowed_paths` 밖이므로
이번 구현에서 수정하지 않고 그대로 보존했다.

## 자체 검증

- 작업 시작 branch/HEAD: `task/T-20260730-007-diagnose-swiftdata-ios26-crash`,
  `8a36f22`
- 작업 시작 시 `origin/develop`: `8a36f22`
- `aiops validate task
  .ai_project/tasks/active/T-20260730-007_diagnose-ios26-swiftdata-test-crash.md
  --strict`: 통과
- `bash -n apps/ios/Scripts/run-xctest.sh`: 통과
- `git diff --check`: 통과
- 제품 구현 코드 diff 없음

최종 검증 중 `origin/develop`이 디자인 Task T-009의 `44fc8a9`, 완료 상태
`af4b959`까지 두 commit 전진했다. T-007 변경을 커밋한 뒤 최신
`origin/develop` 위로 rebase했으며, 공용 Task board 충돌은 T-009 완료 이력과
T-007 등록 이력을 모두 보존해 해결했다. rebase 후 iPhone 17, iOS 26.5에서
`SwiftDataRecipeLocalDataSourceTests` 3/3 통과와 종료 코드 0을 다시 확인했다.

## QA 요청

iOS QA Agent는 다음을 독립 확인한다.

- Xcode 26.6, iPhone 17, iOS 26.5에서 저장소 테스트 3/3 통과
- 같은 destination의 전체 XCTest 33/33과 종료 코드 0
- 가능하면 iPhone 15, iOS 17.2 전체 33/33 회귀
- `TestStore`가 container와 data source를 함께 보유하는지
- 저장·목록 정렬·삭제 테스트가 수정 없이 통과하는지
- 변경 경로와 제품 정책 비회귀

## 독립 QA 재작업

첫 독립 QA에서 iOS 26.5와 iOS 17.2 전체 XCTest 33/33 통과를 확인했지만,
`allowed_paths`에 없는 `.ai_project/task_board.md`가 브랜치 diff에 포함된
`QA-HIGH-007-001`로 `rework_requested` 판정을 받았다.

Product Owner 재작업 승인 후 루트 Task board를 `origin/develop`과 동일하게
복원했다. 최종 `origin/develop` 대비 변경 목록에는 Task가 허용한 테스트,
실행 보고서, QA 보고서, Task 파일과 Development·Quality Team board만 남는다.
기능 코드는 추가로 변경하지 않았으며 iOS QA의 변경 범위 재검증을 기다린다.

## Development Lead 완료 검토

- iOS QA 재검증 판정: `PASS`
- iOS 26.5 전체 XCTest: 33/33
- iOS 17.2 전체 XCTest: 33/33
- `QA-HIGH-007-001`: 해소
- 최종 변경 경로: 모두 Task `allowed_paths` 안
- 제품 저장소 구현 변경: 없음
- 미해결 차단 결함: 없음

개발 하위 Task의 성공 기준과 독립 검증 기준을 충족해
`verification_passed -> completion_review`로 수용한다. `develop` 대상 PR이
병합된 뒤 `done`으로 확정한다.

## 완료

- PR: [#18](https://github.com/cschoi724/CookLog/pull/18)
- 대상 브랜치: `develop`
- 병합 방식: squash merge
- merge SHA: `47bf787fe79a47e3797431e7246ffad35acccf82`
- 완료 판정: `done`

PR 통합과 merge SHA를 확인해 Development Lead Agent가 개발 하위 Task 완료를
확정했다.
