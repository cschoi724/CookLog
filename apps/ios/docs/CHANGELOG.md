# CookLog iOS Changelog

이 문서는 iOS 앱 개발 변경 기록을 관리합니다.

## 2026-06-22

- M4-A `AIReviewView`, `AIReviewViewModel`, `IngredientEditorRowView`, `RecipeStepEditorRowView`를 추가했습니다.
- Cooking Log의 `AI 정리하기` 버튼을 AI Review 화면으로 연결했습니다.
- 누적된 STEP Preview 배열을 `GenerateRecipeDraftUseCase`에 전달해 Mock AI 기반 `RecipeDraft`를 생성하게 했습니다.
- AI Review에서 제목, 재료, 조리 순서, 예상 시간, 메모를 수정할 수 있게 했습니다.
- 저장 버튼을 `SaveRecipeUseCase`에 연결하고 저장 성공 후 Recipe Detail placeholder로 이동하게 했습니다.
- `AIReviewViewModelTests`를 추가해 draft 로드, 수정 상태 반영, 저장, AI 생성 실패 상태를 검증할 수 있게 했습니다.
- M4-A 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M4-A 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- M3-A `CookingLogView`, `CookingLogViewModel`, `StepPreviewRowView`, `RecordingState`를 추가했습니다.
- Home의 `요리 기록 시작` 이동 대상을 실제 `CookingLogView`로 교체했습니다.
- `MockSpeechRecognitionService`와 `AddStepPreviewUseCase`를 연결해 10초 기록 후 STEP Preview가 누적되게 했습니다.
- 기록 중/처리 중 상태, 남은 시간, 실패 메시지, STEP Preview 목록, `AI 정리하기` 활성/비활성 상태를 구현했습니다.
- `CookingLogViewModelTests`를 추가해 초기 상태, 1회 기록, order 증가, 실패 메시지를 검증할 수 있게 했습니다.
- M3-A 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M3-A 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- M2-A `AppRoute`, `AppEnvironment`, `HomeViewModel`, `HomeView`, `RecipeRowView`를 추가했습니다.
- 앱 시작 화면을 `HomeView`로 교체하고 `NavigationStack` 기반 기본 내비게이션을 연결했습니다.
- Home에서 샘플 레시피 목록, 빈 상태, 요리 기록 시작, Recipe Detail placeholder 이동을 구현했습니다.
- `HomeViewModelTests`를 추가해 샘플 레시피 로드와 빈 목록 상태를 검증할 수 있게 했습니다.
- M2-A 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M2-A 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- M1-C Mock 구현 `DefaultRecipeRepository`, `DefaultRecipeGenerationRepository`, `InMemoryRecipeLocalDataSource`, `MockRecipeAIDataSource`, `MockSpeechRecognitionService`, `MockAudioGuideService`를 추가했습니다.
- `PreviewSupport/SampleRecipes.swift`, `PreviewSupport/SampleStepPreviews.swift`에 M2 화면 개발과 SwiftUI Preview용 샘플 데이터를 추가했습니다.
- `DefaultRecipeRepositoryTests`를 추가해 저장/조회/삭제 흐름을 검증할 수 있게 했습니다.
- `GenerateRecipeDraftUseCaseTests`를 추가해 Mock AI 기반 RecipeDraft 생성을 검증할 수 있게 했습니다.
- M1-C 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M1-C 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- M1-A 도메인 모델 `CookingLogSession`, `StepPreview`, `Recipe`, `Ingredient`, `RecipeStep`, `RecipeDraft`, `RecipeGenerationInput`, `RecipeSource`, `SyncStatus`를 추가했습니다.
- M1-B Repository/DataSource/Service 경계 프로토콜을 추가했습니다.
- M1-C 기본 UseCase `FetchRecipesUseCase`, `FetchRecipeUseCase`, `SaveRecipeUseCase`, `DeleteRecipeUseCase`, `AddStepPreviewUseCase`, `GenerateRecipeDraftUseCase`, `PlayRecipeStepUseCase`를 추가했습니다.
- STEP Preview 누적 로직을 확인하는 `AddStepPreviewUseCaseTests`를 추가했습니다.
- M1 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M1 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- 테스트 타겟이 앱 소스를 직접 포함하지 않고 `@testable import CookLog`로 앱 모듈을 참조하도록 정리했습니다.
- `apps/ios/` 안에 SwiftUI 기반 `CookLog.xcodeproj`를 생성했습니다.
- 앱 타겟 `CookLog`와 Unit Test 타겟 `CookLogTests`를 추가했습니다.
- `CookLog/App`, `Domain`, `Data`, `Services`, `Features`, `Support`, `PreviewSupport`, `Resources` 기본 폴더 구조를 추가했습니다.
- `CookLogApp.swift`, 임시 `ContentView.swift`, 앱 `Info.plist`, 기본 `CookLogTests.swift`를 추가했습니다.
- 공유 scheme `CookLog`를 추가했습니다.
- iOS 17.0 이상 deployment target을 프로젝트 설정에 반영했습니다.
- `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- 부팅된 iPhone 15 iOS 17.2 시뮬레이터에 앱 설치와 실행을 확인했습니다.
- `xcodebuild test`가 현재 로컬 XCTest runner 실행 단계에서 대기하는 현상을 `TESTING.md`에 기록했습니다.
- iOS 개발 문서를 `apps/ios/docs/` 구조로 이동했습니다.
- `DEVELOPMENT_PLAN.md`를 PRD v2 기준으로 업데이트했습니다.
- `DEVELOPMENT_SPEC.md`에 10초 음성 기록, STEP Preview, A-Lite Strategy, 확장 가능한 Repository/DataSource/Service 경계를 반영했습니다.
- `DECISIONS.md`에 PRD v2와 STEP Preview 관련 결정사항을 반영했습니다.
- `STATUS.md`를 추가해 iOS 세션 시작 지점을 명확히 했습니다.
- Xcode 15.2, iOS 17 이상, SwiftData 사용, 레시피 검색 MVP 제외를 결정사항으로 기록했습니다.
- STT 실패 fallback 정책과 실제 AI API 연동 방향을 결정사항으로 기록했습니다.
- 프로젝트 직접 생성, DI 라이브러리 미사용, 도메인 모델과 SwiftData 모델 분리를 결정사항으로 기록했습니다.
- Feature 중심 MVVM + UseCase + Repository/DataSource 구조를 결정사항으로 기록했습니다.
- NavigationStack/AppRoute, AppError, 제한적 ViewState, Mock/Preview/Test 데이터 분리를 결정사항으로 기록했습니다.
- `DEVELOPMENT_SPEC.md`를 최상위 기술 기준과 문서 인덱스 역할로 축소했습니다.
- 아키텍처, 도메인 모델, 저장소, 내비게이션, 서비스, 테스트 기준을 역할별 문서로 분리했습니다.
- `DEVELOPMENT_PLAN.md`의 M0-M7 실행 순서와 체크리스트를 세분화해 다음 iOS 개발 세션의 시작 기준을 명확히 했습니다.

## 2026-06-19

- iOS 개발 에이전트 문서를 추가했습니다.
- iOS 개발 환경 권장안, 개발 계획, 의사결정 로그를 최초 작성했습니다.
