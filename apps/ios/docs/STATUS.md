# CookLog iOS Status

최종 업데이트: 2026-06-22

## 현재 상태

- 상태: M8 MVP 흐름 검증과 마무리 정리 진행
- 기준 PRD: `../../../docs/product/CookLog_PRD_v2.md`
- iOS 프로젝트: `CookLog.xcodeproj` 생성 완료
- 현재 로컬 Xcode: 15.2
- 현재 이정표: M8. MVP 정리와 검증
- scheme: `CookLog`
- 검증 destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`

## 다음 작업

1. `MANUAL_QA_CHECKLIST.md` 기준으로 실제 기기 또는 Xcode UI에서 전체 MVP 흐름 터치 검증
2. 앱 재실행 후 SwiftData 저장 Recipe 유지 여부 수동 확인
3. 작은 화면, 다크 모드, TextEditor/TextField 레이아웃 수동 확인
4. 필요 시 M8에서 발견된 작은 UI 문구/레이아웃 보정
5. `xcodebuild test`의 시뮬레이터 XCTest runner 대기 원인 추가 확인

## 최근 작업

- PRD v2 기준으로 iOS 개발 계획을 업데이트했습니다.
- iOS 개발 문서를 `apps/ios/docs/`로 이동했습니다.
- iOS 전담 개발 세션 기준을 `apps/ios/agents.md`에 정리했습니다.
- 향후 확장을 고려한 iOS 개발 스펙을 작성했습니다.
- 현재 개발 Mac 기준으로 Xcode 15.2를 개발 기준으로 확정했습니다.
- 최소 iOS 버전을 iOS 17 이상으로 확정했습니다.
- MVP 로컬 저장은 SwiftData로 바로 시작하기로 확정했습니다.
- 레시피 검색은 MVP에서 제외하고 보류하기로 결정했습니다.
- STT 실패 시 사용자 텍스트 입력 fallback은 제공하지 않고 다시 녹음/권한 안내를 제공하기로 결정했습니다.
- 실제 AI API는 앱 직접 호출을 피하고 추후 백엔드 프록시 방식을 우선 검토하기로 결정했습니다.
- 프로젝트는 Xcode에서 직접 생성하기로 결정했습니다.
- DI 라이브러리 없이 수동/생성자 주입으로 진행하고, 외부 패키지가 필요해지면 SPM으로 관리하기로 결정했습니다.
- SwiftData 저장 모델과 도메인 모델은 분리하기로 결정했습니다.
- iOS 개발 기술 스펙을 확정했습니다.
- Feature 중심 MVVM + UseCase + Repository/DataSource 구조를 확정했습니다.
- NavigationStack/AppRoute, AppError, 제한적 ViewState, Mock/Preview/Test 데이터 분리를 확정했습니다.
- 비대해질 수 있는 iOS 개발 스펙을 역할별 문서로 분리했습니다.
- `ARCHITECTURE.md`, `DATA_MODEL.md`, `PERSISTENCE.md`, `NAVIGATION.md`, `SERVICES.md`, `TESTING.md`를 추가했습니다.
- iOS 개발 세션이 바로 착수할 수 있도록 `DEVELOPMENT_PLAN.md`의 M0-M7 실행 순서와 체크리스트를 구체화했습니다.
- `apps/ios/` 안에 SwiftUI 기반 `CookLog.xcodeproj`를 생성했습니다.
- 앱 타겟 `CookLog`와 Unit Test 타겟 `CookLogTests`를 추가했습니다.
- `CookLog/App`, `Domain`, `Data`, `Services`, `Features`, `Support`, `PreviewSupport`, `Resources` 폴더 구조를 생성했습니다.
- 기본 시작 화면은 `CookLog/Features/Home/ContentView.swift`에 임시 화면으로 두었습니다.
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build` 성공을 확인했습니다.
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing` 성공을 확인했습니다.
- `xcrun simctl install booted .../CookLog.app`와 `xcrun simctl launch booted app.cooklog.CookLog`로 시뮬레이터 설치/실행을 확인했습니다.
- `xcodebuild test`는 테스트 번들 빌드 후 시뮬레이터 XCTest runner 설치/실행 단계에서 대기해 수동 중단했습니다.
- M1-A 도메인 모델 `CookingLogSession`, `StepPreview`, `Recipe`, `Ingredient`, `RecipeStep`, `RecipeDraft`, `RecipeGenerationInput`, `RecipeSource`, `SyncStatus`를 추가했습니다.
- M1-B Repository/DataSource/Service 프로토콜 `RecipeRepository`, `RecipeGenerationRepository`, `RecipeLocalDataSource`, `RecipeAIDataSource`, `SpeechRecognitionService`, `AudioGuideService`를 추가했습니다.
- M1-C 기본 UseCase `FetchRecipesUseCase`, `FetchRecipeUseCase`, `SaveRecipeUseCase`, `DeleteRecipeUseCase`, `AddStepPreviewUseCase`, `GenerateRecipeDraftUseCase`, `PlayRecipeStepUseCase`를 추가했습니다.
- STEP Preview 누적 로직을 검증하는 `AddStepPreviewUseCaseTests`를 추가했습니다.
- M1 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M1 변경 후 `xcodebuild test`는 기존과 동일하게 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- 테스트 타겟이 앱 소스를 직접 포함하지 않고 `@testable import CookLog`로 앱 모듈을 참조하도록 프로젝트 설정을 정리했습니다.
- M1-C Mock 구현 `DefaultRecipeRepository`, `DefaultRecipeGenerationRepository`, `InMemoryRecipeLocalDataSource`, `MockRecipeAIDataSource`, `MockSpeechRecognitionService`, `MockAudioGuideService`를 추가했습니다.
- `PreviewSupport/SampleRecipes.swift`, `PreviewSupport/SampleStepPreviews.swift`에 SwiftUI Preview와 M2 화면 개발용 샘플 데이터를 추가했습니다.
- `DefaultRecipeRepositoryTests`, `GenerateRecipeDraftUseCaseTests`를 추가해 저장/조회/삭제와 Mock AI 기반 RecipeDraft 생성을 검증할 수 있게 했습니다.
- M1-C 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M1-C 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M2-A `AppRoute`, `AppEnvironment`, `HomeViewModel`, `HomeView`, `RecipeRowView`를 추가했습니다.
- 앱 시작 화면을 `HomeView`로 교체하고 `NavigationStack` 기반 기본 내비게이션을 연결했습니다.
- Home에서 샘플 레시피 목록, 빈 상태, `요리 기록 시작` 버튼, Recipe Detail placeholder 이동을 구현했습니다.
- `HomeViewModelTests`를 추가해 샘플 레시피 로드와 빈 목록 상태를 검증할 수 있게 했습니다.
- M2-A 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M2-A 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M3-A `CookingLogView`, `CookingLogViewModel`, `StepPreviewRowView`, `RecordingState`를 추가했습니다.
- Home의 `요리 기록 시작` 이동 대상을 `CookingLogView`로 교체했습니다.
- `MockSpeechRecognitionService`와 `AddStepPreviewUseCase`를 연결해 10초 기록 후 STEP Preview가 누적되게 했습니다.
- 기록 중/처리 중 상태, 남은 시간, 실패 메시지, STEP Preview 빈 상태/목록, `AI 정리하기` 활성 상태를 구현했습니다.
- `CookingLogViewModelTests`를 추가해 초기 상태, 1회 기록, 여러 회 기록 order 증가, STT 실패 메시지를 검증할 수 있게 했습니다.
- M3-A 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M3-A 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M4-A `AIReviewView`, `AIReviewViewModel`, `IngredientEditorRowView`, `RecipeStepEditorRowView`를 추가했습니다.
- Cooking Log의 `AI 정리하기` 버튼을 AI Review 흐름으로 연결했습니다.
- 누적된 STEP Preview 배열을 `GenerateRecipeDraftUseCase`에 전달해 Mock AI 기반 `RecipeDraft`를 생성하게 했습니다.
- AI Review에서 제목, 재료, 조리 순서, 예상 시간, 메모를 수정할 수 있게 했습니다.
- 저장 버튼을 `SaveRecipeUseCase`에 연결하고 저장 성공 후 Recipe Detail placeholder로 이동하게 했습니다.
- AI 정리 실패 상태와 저장 실패 상태를 화면에 표시하도록 구현했습니다.
- `AIReviewViewModelTests`를 추가해 draft 로드, 수정 상태 반영, 저장, AI 생성 실패 상태를 검증할 수 있게 했습니다.
- M4-A 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M4-A 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M5-A `RecipeDetailView`, `RecipeDetailViewModel`, `IngredientListView`, `RecipeStepListView`를 추가했습니다.
- Recipe Detail placeholder를 실제 조회 화면으로 교체했습니다.
- `FetchRecipeUseCase`로 recipeID 기반 Recipe 조회를 연결했습니다.
- Recipe Detail에서 제목, 재료, 조리 순서, 예상 시간, 메모를 표시하게 했습니다.
- `오디오 가이드 시작` 버튼과 M6용 `audioPlayer` route, `AudioPlayerPlaceholderView`를 추가했습니다.
- 삭제/편집 기능은 M5-A 범위에서 제외하고 추후 필요 여부만 문서상 유지합니다.
- `RecipeDetailViewModelTests`를 추가해 recipeID 조회, 없음 상태, 조회 실패 상태를 검증할 수 있게 했습니다.
- M5-A 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M5-A 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M6-A `AudioPlayerView`, `AudioPlayerViewModel`, `AudioPlayerControlBarView`를 추가했습니다.
- `AudioPlayerPlaceholderView`를 제거하고 `audioPlayer` route를 실제 Audio Player 화면으로 교체했습니다.
- recipeID 기반 Recipe 조회, 현재 단계 index, 이전/다음/다시 듣기/재생/정지 동작을 구현했습니다.
- `PlayRecipeStepUseCase`와 `AudioGuideService`를 Audio Player에 연결했습니다.
- 첫 단계 이전 버튼과 마지막 단계 다음 버튼 비활성화, step 없는 recipe 재생 불가 상태를 구현했습니다.
- 화면 이탈 시 `AudioGuideService.stop()`을 호출하도록 처리했습니다.
- `AudioPlayerViewModelTests`를 추가해 초기 로드, 단계 이동, 경계 상태, play/replay/stop 호출, 빈 step, 조회 실패 상태를 검증할 수 있게 했습니다.
- M6-A 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M6-A 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M7 `PersistentRecipe`, `PersistentIngredient`, `PersistentRecipeStep` SwiftData 저장 모델을 추가했습니다.
- `RecipePersistenceMapper`를 추가해 도메인 모델과 SwiftData 모델 변환을 분리했습니다.
- `SwiftDataRecipeLocalDataSource`를 추가해 Recipe 저장, 목록 조회, 단건 조회, 삭제를 구현했습니다.
- 목록 조회는 `updatedAt` 내림차순 정렬을 유지합니다.
- `AppEnvironment.live(modelContainer:)`를 추가하고 앱 실행 경로를 SwiftData 저장소로 전환했습니다.
- `AppEnvironment.mock`은 Preview와 테스트에서 기존 InMemory/Mock 경로를 계속 사용하도록 유지했습니다.
- `CookLogApp`에서 SwiftData `ModelContainer`를 생성하고 앱에 연결했습니다.
- `RecipePersistenceMapperTests`, `SwiftDataRecipeLocalDataSourceTests`를 추가했습니다.
- M7 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M7 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M8 점검 중 저장 성공 후 navigation path를 Home 기준 Recipe Detail로 정리했습니다.
- AI Review 저장 성공 시 Home refresh token을 증가시켜 Home 복귀 후 저장된 Recipe 목록을 다시 읽도록 보강했습니다.
- `README.md`를 추가해 iOS 빌드, 테스트 빌드, 테스트 실행 이슈, 수동 확인 흐름을 정리했습니다.
- M8 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- 부팅된 iPhone 15 iOS 17.2 시뮬레이터에 앱 설치와 실행을 확인했습니다.
- M8 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- 테스트 중단 후 시뮬레이터가 종료되어 스크린샷 기반 화면 확인은 완료하지 못했습니다.

## 열린 질문

- `xcodebuild test`가 현재 로컬 시뮬레이터의 XCTest runner 설치/실행 단계에서 대기하는 원인을 추가 확인해야 합니다.

## 세션 시작 체크리스트

- [ ] `git status -sb` 확인
- [ ] `apps/ios/agents.md` 확인
- [ ] 이 문서의 현재 상태와 다음 작업 확인
- [ ] `apps/ios/docs/DEVELOPMENT_PLAN.md` 확인
- [ ] 작업 주제에 맞는 역할별 상세 문서 확인
- [ ] `../../../docs/product/CookLog_PRD_v2.md` 확인

## 세션 종료 체크리스트

- [ ] 완료한 작업을 이 문서에 반영
- [ ] 개발 계획 체크리스트 업데이트
- [ ] 새 결정사항을 `DECISIONS.md`에 기록
- [ ] 변경사항을 `CHANGELOG.md`에 기록
- [ ] 빌드/테스트 결과 기록
