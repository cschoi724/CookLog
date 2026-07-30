# CookLog iOS Testing

이 문서는 CookLog iOS 앱의 테스트 기준을 관리합니다.

최종 업데이트: 2026-07-30
상태: 확정

## 1. 테스트 원칙

- MVP 초기에는 Unit Test를 우선합니다.
- 도메인 모델, UseCase, Repository Mock, Service Mock 중심으로 검증합니다.
- UI 테스트는 핵심 흐름이 안정된 뒤 추가합니다.
- Mock, Preview, Test Fixture는 용도별로 분리합니다.

## 2. 우선순위

우선 테스트 대상:

- STEP Preview 누적 로직
- Mock STT 결과 처리
- Mock AI 정리 결과 생성
- RecipeDraft -> Recipe 변환
- Recipe 저장/조회
- Audio Player 단계 이동 로직

## 3. Mock과 Fixture

기준:

- 테스트용 Mock은 테스트 타겟 또는 테스트 helper에 둡니다.
- 앱 실행용 Mock DataSource/Service는 앱 타겟에 둘 수 있지만 이름에 `Mock`을 명확히 붙입니다.
- SwiftUI Preview 샘플은 `PreviewSupport/`에 둡니다.
- 테스트 Fixture는 Preview 샘플과 공유하지 않는 것을 기본으로 합니다.

## 4. 검증 시점

각 이정표 종료 시 최소 검증:

- M1: 도메인 모델과 STEP Preview 누적 로직 단위 테스트
- M3: Mock STT 기반 10초 기록 흐름 수동 테스트
- M4: Mock AI 변환 단위 테스트
- M6: Audio Player 단계 이동 로직 단위 테스트
- M7: 저장/조회 동작 확인
- M8: 전체 MVP 흐름 수동 테스트
- M2-A: HomeViewModel 샘플 레시피 로드와 빈 목록 상태 테스트
- M3-A: CookingLogViewModel 초기 상태, Mock STT 기록, order 증가, 실패 상태 테스트
- M4-A: AIReviewViewModel draft 로드, 수정 상태, 저장, AI 생성 실패 상태 테스트
- M5-A: RecipeDetailViewModel recipeID 조회, notFound 상태, 조회 실패 상태 테스트
- M6-A: AudioPlayerViewModel 초기 로드, 단계 이동, 경계 상태, play/replay/stop 호출, 빈 step, 조회 실패 상태 테스트
- M7: RecipePersistenceMapper 변환 테스트, SwiftDataRecipeLocalDataSource 저장/조회/정렬/삭제 테스트
- M8: 전체 MVP 흐름 수동 검증, 저장 후 Home refresh/navigation path 확인, 시뮬레이터 설치/실행 확인

사용자 수동 검증은 `MANUAL_QA_CHECKLIST.md`를 기준으로 진행합니다. 체크 완료 후 발견 이슈와 최종 판정을 루트 관리 에이전트에게 전달합니다.

## 5. 빌드 확인

M0 기준 실제 scheme과 destination은 다음과 같습니다.

- scheme: `CookLog`
- destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`
- bundle id: `app.cooklog.CookLog`

기본 빌드:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build
```

결과:

- 2026-06-22 확인 완료
- `** BUILD SUCCEEDED **`

테스트 번들 빌드:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing
```

결과:

- 2026-06-22 확인 완료
- `** TEST BUILD SUCCEEDED **`

테스트 실행:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test
```

현재 결과:

- 테스트 번들 빌드까지는 진행됩니다.
- 테스트 타겟은 `@testable import CookLog`로 앱 모듈을 참조합니다.
- 시뮬레이터 XCTest runner 설치/실행 단계에서 결과 없이 대기합니다.
- `waiting for workers to materialize`, `_IDEInstalliPhoneSimulatorWorker`, `IDELaunchiPhoneSimulatorLauncher` 대기 상태를 확인했습니다.
- 2026-06-22에는 `com.apple.dt.xctest.target-runner`가 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.

시뮬레이터 수동 실행 확인:

```bash
xcrun simctl install booted /Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Build/Products/Debug-iphonesimulator/CookLog.app
xcrun simctl launch booted app.cooklog.CookLog
```

결과:

- 2026-06-22 확인 완료
- 설치 성공
- 실행 성공, process id `7842` 확인

## 6. M1 검증 기록

M1 도메인 모델, 경계 프로토콜, UseCase, Mock 구현, 샘플 데이터 추가 후 다음을 확인했습니다.

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build
```

결과:

- 2026-06-22 확인 완료
- `** BUILD SUCCEEDED **`

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing
```

결과:

- 2026-06-22 확인 완료
- `** TEST BUILD SUCCEEDED **`
- 테스트 타겟은 앱 소스를 직접 포함하지 않고 앱 모듈을 테스트 호스트로 참조합니다.

추가한 테스트:

- `AddStepPreviewUseCaseTests`
- STEP Preview가 비어 있는 세션에서 order 1로 추가되는지 확인
- 기존 STEP Preview가 있는 세션에서 다음 order로 추가되고 `updatedAt`이 갱신되는지 확인
- `DefaultRecipeRepositoryTests`
- `DefaultRecipeRepository`와 `InMemoryRecipeLocalDataSource` 조합의 저장/목록 조회/단건 조회/삭제 확인
- `GenerateRecipeDraftUseCaseTests`
- `DefaultRecipeGenerationRepository`와 `MockRecipeAIDataSource` 조합의 RecipeDraft 생성 확인

테스트 실행:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test
```

현재 결과:

- M1 변경 후에도 테스트 실행 단계에서 기존과 동일하게 대기합니다.
- `com.apple.dt.xctest.target-runner`가 `waiting for workers to materialize` 상태로 멈춥니다.
- 2026-06-22 M1-C 변경 후에는 약 65초 대기 후 수동 중단했습니다.
- 결과 번들: `/Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Logs/Test/Test-CookLog-2026.06.22_14-29-44-+0900.xcresult`

## 7. M2-A 검증 기록

M2-A Home 화면, AppRoute, AppEnvironment, 기본 NavigationStack 연결 후 다음을 확인했습니다.

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build
```

결과:

- 2026-06-22 확인 완료
- `** BUILD SUCCEEDED **`

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing
```

결과:

- 2026-06-22 확인 완료
- `** TEST BUILD SUCCEEDED **`
- `HomeViewModelTests`가 테스트 번들에 포함되는 것을 확인했습니다.

추가한 테스트:

- `HomeViewModelTests`
- 샘플 레시피 목록을 로드하는지 확인
- 빈 레시피 목록에서 빈 상태로 전환되는지 확인

테스트 실행:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test
```

현재 결과:

- M2-A 변경 후에도 테스트 실행 단계에서 기존과 동일하게 대기합니다.
- `com.apple.dt.xctest.target-runner`가 `waiting for workers to materialize` 상태로 멈춥니다.
- `_IDEInstalliPhoneSimulatorWorker`, `IDELaunchiPhoneSimulatorLauncher` 대기 상태를 확인했습니다.
- 2026-06-22 M2-A 변경 후에는 약 78초 대기 후 수동 중단했습니다.
- 결과 번들: `/Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Logs/Test/Test-CookLog-2026.06.22_15-32-32-+0900.xcresult`

## 8. M3-A 검증 기록

M3-A Cooking Log 화면, Mock STT 연결, STEP Preview 누적 흐름 추가 후 다음을 확인했습니다.

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build
```

결과:

- 2026-06-22 확인 완료
- `** BUILD SUCCEEDED **`

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing
```

결과:

- 2026-06-22 확인 완료
- `** TEST BUILD SUCCEEDED **`
- `CookingLogViewModelTests`가 테스트 번들에 포함되는 것을 확인했습니다.

추가한 테스트:

- `CookingLogViewModelTests`
- 초기 상태 확인
- 1회 기록 후 STEP Preview가 1개 추가되는지 확인
- 여러 번 기록 시 order가 증가하는지 확인
- STT 실패 시 `errorMessage`가 설정되는지 확인

테스트 실행:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test
```

현재 결과:

- M3-A 변경 후에도 테스트 실행 단계에서 기존과 동일하게 대기합니다.
- `com.apple.dt.xctest.target-runner`가 `waiting for workers to materialize` 상태로 멈춥니다.
- 2026-06-22 M3-A 변경 후에는 약 62초 대기 후 수동 중단했습니다.
- 결과 번들: `/Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Logs/Test/Test-CookLog-2026.06.22_15-50-12-+0900.xcresult`

## 9. M4-A 검증 기록

M4-A AI Review 화면, Mock AI 기반 RecipeDraft 생성, 검토/수정/저장 흐름 추가 후 다음을 확인했습니다.

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build -quiet
```

결과:

- 2026-06-22 확인 완료
- 성공

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing -quiet
```

결과:

- 2026-06-22 확인 완료
- 성공
- `AIReviewViewModelTests`가 테스트 번들에 포함되는 것을 확인했습니다.

추가한 테스트:

- `AIReviewViewModelTests`
- STEP Preview 입력으로 RecipeDraft를 로드하는지 확인
- 제목, 재료, 조리 순서, 예상 시간, 메모 수정 상태가 반영되는지 확인
- 저장 시 Recipe가 생성되고 `SaveRecipeUseCase` 경유 저장소 호출이 발생하는지 확인
- AI 생성 실패 시 `errorMessage`가 설정되는지 확인

테스트 실행:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test
```

현재 결과:

- M4-A 변경 후에도 테스트 실행 단계에서 기존과 동일하게 대기합니다.
- `com.apple.dt.xctest.target-runner`가 `waiting for workers to materialize` 상태로 멈춥니다.
- `_IDEInstalliPhoneSimulatorWorker`, `IDELaunchiPhoneSimulatorLauncher` 대기 상태를 확인했습니다.
- 2026-06-22 M4-A 변경 후에는 약 76초 대기 후 수동 중단했습니다.
- 결과 번들: `/Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Logs/Test/Test-CookLog-2026.06.22_16-03-00-+0900.xcresult`

## 10. M5-A 검증 기록

M5-A Recipe Detail 실제 화면, FetchRecipeUseCase 조회 연결, 오디오 플레이어 진입점 추가 후 다음을 확인했습니다.

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build -quiet
```

결과:

- 2026-06-22 확인 완료
- 성공

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing -quiet
```

결과:

- 2026-06-22 확인 완료
- 성공
- `RecipeDetailViewModelTests`가 테스트 번들에 포함되는 것을 확인했습니다.

추가한 테스트:

- `RecipeDetailViewModelTests`
- recipeID로 Recipe를 조회하는지 확인
- Recipe가 없을 때 notFound 상태가 되는지 확인
- 조회 실패 시 `errorMessage`가 설정되는지 확인

테스트 실행:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test
```

현재 결과:

- M5-A 변경 후에도 테스트 실행 단계에서 기존과 동일하게 대기합니다.
- `com.apple.dt.xctest.target-runner`가 `waiting for workers to materialize` 상태로 멈춥니다.
- 2026-06-22 M5-A 변경 후에는 약 60초 대기 후 수동 중단했습니다.
- 결과 번들: `/Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Logs/Test/Test-CookLog-2026.06.22_16-28-03-+0900.xcresult`

## 11. M6-A 검증 기록

M6-A Mock 기반 Audio Player 화면, 단계 이동, 재생/정지 흐름 추가 후 다음을 확인했습니다.

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build -quiet
```

결과:

- 2026-06-22 확인 완료
- 성공

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing -quiet
```

결과:

- 2026-06-22 확인 완료
- 성공
- `AudioPlayerViewModelTests`가 테스트 번들에 포함되는 것을 확인했습니다.

추가한 테스트:

- `AudioPlayerViewModelTests`
- 초기 로드 시 첫 step으로 초기화되는지 확인
- 다음 단계 이동 확인
- 이전 단계 이동 확인
- 첫 단계에서 이전 이동이 막히는지 확인
- 마지막 단계에서 다음 이동이 막히는지 확인
- play/replay/stop 호출이 `AudioGuideService`에 전달되는지 확인
- step 없는 recipe가 재생 불가 상태가 되는지 확인
- recipe 조회 실패 시 `errorMessage`가 설정되는지 확인

테스트 실행:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test
```

현재 결과:

- M6-A 변경 후에도 테스트 실행 단계에서 기존과 동일하게 대기합니다.
- `com.apple.dt.xctest.target-runner`가 `waiting for workers to materialize` 상태로 멈춥니다.
- `_IDEInstalliPhoneSimulatorWorker`, `IDELaunchiPhoneSimulatorLauncher` 대기 상태를 확인했습니다.
- 2026-06-22 M6-A 변경 후에는 약 60초 대기 후 수동 중단했습니다.
- 결과 번들: `/Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Logs/Test/Test-CookLog-2026.06.22_16-41-02-+0900.xcresult`

## 12. M7 검증 기록

M7 SwiftData 저장 모델, Mapper, SwiftDataRecipeLocalDataSource, 앱 실행 경로 SwiftData 전환 후 다음을 확인했습니다.

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build -quiet
```

결과:

- 2026-06-22 확인 완료
- 성공

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing -quiet
```

결과:

- 2026-06-22 확인 완료
- 성공
- `RecipePersistenceMapperTests`, `SwiftDataRecipeLocalDataSourceTests`가 테스트 번들에 포함되는 것을 확인했습니다.

추가한 테스트:

- `RecipePersistenceMapperTests`
- domain -> persistent -> domain 변환 확인
- child model 정렬 복원 확인
- `SwiftDataRecipeLocalDataSourceTests`
- 저장 후 단건 조회 확인
- 목록 조회가 `updatedAt` 내림차순으로 정렬되는지 확인
- 삭제 후 단건 조회가 nil이 되는지 확인

테스트 실행:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test
```

현재 결과:

- M7 변경 후에도 테스트 실행 단계에서 기존과 동일하게 대기합니다.
- `com.apple.dt.xctest.target-runner`가 `waiting for workers to materialize` 상태로 멈춥니다.
- `_IDEInstalliPhoneSimulatorWorker`, `IDELaunchiPhoneSimulatorLauncher` 대기 상태를 확인했습니다.
- 2026-06-22 M7 변경 후에는 약 60초 대기 후 수동 중단했습니다.
- 결과 번들: `/Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Logs/Test/Test-CookLog-2026.06.22_16-55-39-+0900.xcresult`

## 13. M8 검증 기록

M8 MVP 흐름 점검 중 저장 후 navigation path와 Home refresh 보정, README 추가 후 다음을 확인했습니다.

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build -quiet
```

결과:

- 2026-06-22 확인 완료
- 성공

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing -quiet
```

결과:

- 2026-06-22 확인 완료
- 성공

시뮬레이터 설치/실행:

```bash
xcrun simctl boot 'iPhone 15'
xcrun simctl bootstatus booted
xcrun simctl install booted /Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Build/Products/Debug-iphonesimulator/CookLog.app
xcrun simctl launch booted app.cooklog.CookLog
```

결과:

- 2026-06-22 확인 완료
- iPhone 15 iOS 17.2 boot 성공
- 앱 install 성공
- 앱 launch 성공, process id `42163`

테스트 실행:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test
```

현재 결과:

- M8 변경 후에도 테스트 실행 단계에서 기존과 동일하게 대기합니다.
- `com.apple.dt.xctest.target-runner`가 `waiting for workers to materialize` 상태로 멈춥니다.
- 2026-06-22 M8 변경 후에는 약 57초 대기 후 수동 중단했습니다.
- 결과 번들: `/Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Logs/Test/Test-CookLog-2026.06.22_17-06-55-+0900.xcresult`
- 테스트 중단 후 시뮬레이터가 종료되어 `simctl io booted screenshot` 기반 화면 확인은 완료하지 못했습니다.

## 14. T-20260728-004 XCTest 실행 안정화

### 진단 결과

- 2026-06-22 Xcode 15.2에서는 병렬 XCTest worker가 `waiting for workers to materialize` 상태에서 종료되지 않았습니다.
- 2026-07-28 현재 Mac에는 Xcode 26.6만 설치되어 있어 Xcode 15.2의 정확한 재현은 불가능했습니다.
- 공유 scheme의 `CookLogTests`가 `parallelizable = YES`였고, 현재 환경의 기본 전체 실행도 여러 Simulator clone worker를 생성했습니다.
- 현재 Xcode 26.6에서는 기본 전체 실행이 종료됐지만, unmanaged SwiftData relationship을 읽던 `RecipePersistenceMapperTests` 2건이 `SIGTRAP`으로 crash했습니다.
- crash stack은 `PersistentRecipe.ingredients.getter`를 가리켰고, production 저장 경로와 달리 테스트가 모델을 `ModelContext`에 삽입하지 않은 상태였습니다.
- Test Host, Bundle Loader, simulator ad-hoc signing, 앱/테스트 bundle identifier에는 실행을 막는 설정 오류가 없었습니다.

### 적용 내용

- 공유 scheme에서 `CookLogTests` 병렬 실행을 비활성화했습니다.
- `RecipePersistenceMapperTests`가 in-memory `ModelContainer`에 모델을 삽입한 뒤 relationship을 검증하도록 실제 저장 조건과 맞췄습니다.
- `Scripts/run-xctest.sh`를 표준 실행 경로로 추가했습니다.
- 스크립트는 단일 worker, 기본 600초 제한, 로그와 `xcresult` 보존을 적용합니다.
- 제한 시간 초과 시 종료 코드 `124`와 `TIMED_OUT` marker를 남깁니다.

### 표준 명령

`apps/ios/`에서 실행합니다.

```bash
Scripts/run-xctest.sh
```

기본값:

- destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`
- timeout: 600초
- artifact root: `${TMPDIR:-/tmp}/CookLog-XCTest`
- parallel testing: 비활성
- maximum parallel workers: 1

환경별 override:

```bash
COOKLOG_XCTEST_DESTINATION='platform=iOS Simulator,name=<사용 가능한 기기>,OS=<runtime>' \
COOKLOG_XCTEST_TIMEOUT_SECONDS=600 \
COOKLOG_XCTEST_ARTIFACT_ROOT=<artifact 경로> \
Scripts/run-xctest.sh
```

### 개발자 반복 검증

검증 환경:

- Xcode 26.6 (`17F113`)
- iPhone 15 Simulator
- iOS 17.2 (`21C62`)
- 전체 테스트 수: 33

결과:

| 실행 | 결과 | 통과/실패 | xcresult 기준 소요 시간 |
|---|---|---:|---:|
| 1 | 성공, 종료 코드 0 | 33/0 | 22.493초 |
| 2 | 성공, 종료 코드 0 | 33/0 | 20.917초 |
| 3 | 성공, 종료 코드 0 | 33/0 | 20.781초 |

추가 확인:

- scheme 직렬 설정만 적용한 `test-without-building`: 성공, 종료 코드 0
- `build`: 성공, 종료 코드 0
- `build-for-testing`: 성공, 종료 코드 0
- timeout smoke test: 1초 제한에서 종료 코드 124와 로그 보존 확인

### CI 인계 기준

- `T-20260728-008`은 `Scripts/run-xctest.sh`를 `ios-xctest` check의 실행 명령으로 사용합니다.
- Hosted Runner에 설치된 Simulator에 맞게 `COOKLOG_XCTEST_DESTINATION`만 지정합니다.
- workflow job timeout은 스크립트 제한보다 긴 15분을 권장합니다.
- 성공/실패와 무관하게 `xcodebuild.log`, `CookLogTests.xcresult`, `TIMED_OUT` marker가 있으면 artifact로 보존합니다.
- Xcode 15.2 설치본에서의 독립 재현이 불가능하므로 QA는 현재 지원 toolchain과 사용 가능한 iOS Simulator 조합을 함께 기록합니다.

## 15. T-20260730-001 CI 환경·명령 계약

이 절은 후속 `T-20260730-002`와 `T-20260730-003`이 추가 버전 판단 없이 workflow를 구현하기 위한 고정 계약입니다.

### 15.1 GitHub-hosted 환경

| 항목 | 고정값 |
|---|---|
| runner label | `macos-26` |
| architecture | `arm64` |
| Xcode | 26.6 (`17F113`) |
| `DEVELOPER_DIR` | `/Applications/Xcode_26.6.app/Contents/Developer` |
| Simulator | iPhone 17 |
| iOS runtime | 26.5 |
| destination | `platform=iOS Simulator,name=iPhone 17,OS=26.5` |
| scheme | `CookLog` |
| project | `apps/ios/CookLog.xcodeproj` |

근거:

- GitHub Actions runner image 목록은 `macos-26`을 arm64 GitHub-hosted label로 제공한다.
- `macos-26` ARM64 image manifest `20260720.0258.1`은 Xcode 26.6 (`17F113`)과 iOS 26.5 Simulator의 iPhone 17을 함께 제공한다.
- 공식 image는 갱신될 수 있으므로 `macos-26` label만 신뢰하지 않는다. job 시작 시 아래 preflight를 실행하고 정확한 조합이 없으면 실패시킨다.
- 공식 근거: [GitHub-hosted runner 목록](https://docs.github.com/en/actions/reference/runners/github-hosted-runners), [GitHub Actions runner images](https://github.com/actions/runner-images), [macOS 26 ARM64 image manifest](https://github.com/actions/runner-images/blob/main/images/macos/macos-26-arm64-Readme.md)

preflight 계약:

```bash
test -d /Applications/Xcode_26.6.app
DEVELOPER_DIR=/Applications/Xcode_26.6.app/Contents/Developer xcodebuild -version
DEVELOPER_DIR=/Applications/Xcode_26.6.app/Contents/Developer \
  xcrun simctl list runtimes available
DEVELOPER_DIR=/Applications/Xcode_26.6.app/Contents/Developer \
  xcrun simctl list devices available
DEVELOPER_DIR=/Applications/Xcode_26.6.app/Contents/Developer \
  xcodebuild -project apps/ios/CookLog.xcodeproj \
  -scheme CookLog \
  -destination 'platform=iOS Simulator,name=iPhone 17,OS=26.5' \
  -showdestinations
```

출력에서 Xcode `26.6`, build `17F113`, iOS `26.5`와 iPhone 17 destination을 확인하지 못하면 job을 실패 처리합니다. `latest`, `OS=latest`, 임의 기기 선택 또는 자동 runtime 다운로드로 대체하지 않습니다. GitHub Actions `Set up job`의 image version과 `xcodebuild -version` 출력도 진단 근거로 남깁니다.

### 15.2 check 이름과 책임 경계

| 고정 check | 실행 책임 | 성공 조건 |
|---|---|---|
| `ios-build` | `build`, 이어서 `build-for-testing` | 두 명령 모두 종료 코드 0 |
| `ios-xctest` | `Scripts/run-xctest.sh` | 스크립트 종료 코드 0 |

- workflow `name` 변경과 job matrix로 check 이름이 변형되지 않게 한다.
- required check 외부 설정은 이 계약 범위가 아니며 `T-20260730-006`에서 별도 승인 후 수행한다.
- `ios-build`는 compile·test bundle build만 담당하고 XCTest를 실행하지 않는다.
- `ios-xctest`는 script 내부의 `xcodebuild test`만 사용한다. workflow가 별도 `xcodebuild test` 또는 `test-without-building`을 추가하지 않는다.
- 첫 출시 STT는 Apple 기기 내 처리가 기본이다. 두 check는 원격 STT secret, endpoint 또는 활성화 flag를 요구하지 않는다.

### 15.3 `ios-build` 명령

repository root에서 다음 경계를 유지합니다. workflow는 먼저 artifact 디렉터리를 생성하고 `set -euo pipefail`을 적용합니다.

```bash
export DEVELOPER_DIR=/Applications/Xcode_26.6.app/Contents/Developer
export COOKLOG_CI_ROOT="${RUNNER_TEMP}/cooklog-ci/${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}"
mkdir -p "${COOKLOG_CI_ROOT}/ios-build"
set -euo pipefail

xcodebuild \
  -project apps/ios/CookLog.xcodeproj \
  -scheme CookLog \
  -destination 'platform=iOS Simulator,name=iPhone 17,OS=26.5' \
  -derivedDataPath "${COOKLOG_CI_ROOT}/ios-build/DerivedData" \
  build 2>&1 | tee "${COOKLOG_CI_ROOT}/ios-build/xcodebuild-build.log"

xcodebuild \
  -project apps/ios/CookLog.xcodeproj \
  -scheme CookLog \
  -destination 'platform=iOS Simulator,name=iPhone 17,OS=26.5' \
  -derivedDataPath "${COOKLOG_CI_ROOT}/ios-build/DerivedData" \
  build-for-testing 2>&1 | tee "${COOKLOG_CI_ROOT}/ios-build/xcodebuild-build-for-testing.log"
```

첫 명령 실패 시 두 번째 명령을 실행하지 않습니다. `ios-build` job timeout은 15분입니다.

### 15.4 `ios-xctest` 명령

repository root에서 다음 환경으로 기존 script만 실행합니다.

```bash
export DEVELOPER_DIR=/Applications/Xcode_26.6.app/Contents/Developer
export COOKLOG_CI_ROOT="${RUNNER_TEMP}/cooklog-ci/${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}"
export COOKLOG_XCTEST_DESTINATION='platform=iOS Simulator,name=iPhone 17,OS=26.5'
export COOKLOG_XCTEST_TIMEOUT_SECONDS=600
export COOKLOG_XCTEST_ARTIFACT_ROOT="${COOKLOG_CI_ROOT}/ios-xctest"
apps/ios/Scripts/run-xctest.sh
```

- script timeout: 600초
- workflow job timeout: 15분
- 성공: 0
- 일반 XCTest 실패: `xcodebuild` 종료 코드
- script timeout: 124와 실행 디렉터리의 `TIMED_OUT`
- 직렬 실행: `-parallel-testing-enabled NO`, `-maximum-parallel-testing-workers 1`

workflow timeout은 script timeout보다 길게 유지합니다. GitHub job 자체가 먼저 종료되면 script의 124와 `TIMED_OUT` 계약을 보장할 수 없습니다.

### 15.5 artifact 계약

| check | 업로드 대상 | artifact 이름 | 보존 |
|---|---|---|---|
| `ios-build` | 두 `xcodebuild-*.log` 파일 | `cooklog-ios-build-${{ github.run_id }}-${{ github.run_attempt }}` | 14일 |
| `ios-xctest` | `${COOKLOG_CI_ROOT}/ios-xctest/` | `cooklog-ios-xctest-${{ github.run_id }}-${{ github.run_attempt }}` | 14일 |

- `ios-build`는 `${COOKLOG_CI_ROOT}/ios-build/xcodebuild-build.log`와 `${COOKLOG_CI_ROOT}/ios-build/xcodebuild-build-for-testing.log`만 항상 업로드한다. DerivedData는 진단 기본 artifact가 아니므로 업로드하지 않는다.
- `ios-xctest`는 script가 만든 실행별 `xcodebuild.log`, 존재하는 `CookLogTests.xcresult`, 존재하는 `TIMED_OUT`을 성공·실패와 관계없이 업로드한다.
- artifact upload step은 `if: always()`를 사용하고 경로가 없는 경우 자체 경고로 원래 build·test 종료 결과를 덮어쓰지 않는다.
- 로그와 artifact에 token, secret, 음성 또는 사용자 입력을 추가하지 않는다.

### 15.6 T-004 기준과 CI 차이·QA 인계

| 항목 | T-004 로컬 검증 | CI 계약 |
|---|---|---|
| Xcode | 26.6 (`17F113`) | 26.6 (`17F113`) |
| Simulator | iPhone 15 | iPhone 17 |
| iOS | 17.2 (`21C62`) | 26.5 |
| XCTest | 33개, 3회 연속 통과 | 동일 test suite를 최초 workflow dry run에서 재검증 |

T-004가 확인한 것은 Xcode 26.6·iOS 17.2 조합이며 Xcode 15.2 호환성을 보장하지 않습니다. GitHub-hosted image에는 Xcode 26.6이 있지만 iOS 17.2 runtime은 없으므로 CI 계약은 같은 Xcode와 공식 image가 함께 제공하는 iOS 26.5 조합으로 고정했습니다. 따라서 다음 항목은 잔여 위험이며 iOS QA가 독립 검증해야 합니다.

- Xcode 26.6에서 전체 XCTest가 종료되고 33개가 모두 통과하는지
- iOS 26.5·iPhone 17에서 SwiftData와 Simulator worker 회귀가 없는지
- 600초 script timeout이 124와 `TIMED_OUT`을 남기고 15분 job timeout보다 먼저 종료되는지
- 성공·실패 모두에서 log와 조건부 `xcresult`가 업로드되는지
- runner image 갱신 뒤에도 preflight가 조용히 다른 toolchain으로 이동하지 않고 실패하는지
