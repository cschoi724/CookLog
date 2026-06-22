# CookLog iOS Testing

이 문서는 CookLog iOS 앱의 테스트 기준을 관리합니다.

최종 업데이트: 2026-06-22
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
