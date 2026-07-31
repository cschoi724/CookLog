# CookLog iOS Status

최종 업데이트: 2026-07-31

## 현재 상태

- 상태: Mock Core MVP 조건부 통과, 첫 공개 출시 Foundation 구현 중
- 기준 PRD: `../../../docs/product/CookLog_PRD_v2.md`
- iOS 프로젝트: `CookLog.xcodeproj` 생성 완료
- 현재 CI 기준 Xcode: 26.6 (`17F113`)
- 과거 프로젝트 생성 기준 Xcode: 15.2, 현재 호환성 미보장
- 현재 설치/검증 Xcode: 26.6
- 현재 이정표: Design 완료 대기와 iOS 첫 공개 출시 구현 준비
- scheme: `CookLog`
- 로컬 회귀 destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`
- CI destination: `platform=iOS Simulator,name=iPhone 17,OS=26.5`

## 다음 작업

1. Design T-20260729-012~014 완료 후 T-20260728-003 iOS 로컬 제품 적용 scope
2. T-20260729-004 Apple 기기 내 STT 구현과 실제 기기 품질 검증
3. Backend 계약 이후 T-20260729-005 AI 정리·Review 실서비스 연동
4. T-20260729-006 로컬 TTS·핸즈프리 Audio Guide 구현
5. CI T-20260730-004~006 진단·dry run·required check 적용

## 최근 작업

- T-20260730-001에서 `macos-26`, Xcode 26.6, iPhone 17·iOS 26.5 CI 계약을 확정했습니다.
- T-20260730-002와 T-20260730-003에서 `ios-build`, `ios-xctest` workflow를 구현하고 GitHub-hosted check·33/33·artifact를 검증했습니다.
- T-20260730-007에서 iOS 26.5 SwiftData XCTest crash를 수정하고 iOS 26.5·17.2 전체 33/33을 확인했습니다.
- 아래 항목은 Mock Core MVP부터 이어진 구현·검증 이력이며 현재 다음 작업을 의미하지 않습니다.
- T-20260728-004에서 공유 scheme의 XCTest 병렬 실행을 비활성화했습니다.
- `Scripts/run-xctest.sh`를 추가해 단일 worker, 600초 제한, 로그와 `xcresult` 보존을 표준화했습니다.
- unmanaged SwiftData relationship 접근으로 crash하던 `RecipePersistenceMapperTests`를 in-memory `ModelContainer` 조건으로 수정했습니다.
- Xcode 26.6, iPhone 15 iOS 17.2 Simulator에서 전체 XCTest 33개를 3회 연속 통과했습니다.
- `build`, `build-for-testing`, scheme 직렬 실행과 timeout 종료 코드 124를 확인했습니다.
- iOS QA Agent가 전체 XCTest 33개, timeout 124, 로그와 `xcresult`, build 회귀를 독립 재현해 `PASS_WITH_RISK`로 판정했습니다.
- Product Owner가 Xcode 15.2 동일 환경 미검증 위험을 수용하고 Xcode·Simulator 고정 검증을 T-20260728-008로 인계했습니다.
- PRD v2 기준으로 iOS 개발 계획을 업데이트했습니다.
- iOS 개발 문서를 `apps/ios/docs/`로 이동했습니다.
- iOS 전담 개발 세션 기준을 `apps/ios/agents.md`에 정리했습니다.
- 향후 확장을 고려한 iOS 개발 스펙을 작성했습니다.
- Core MVP 당시 Xcode 15.2를 프로젝트 생성 기준으로 정했습니다.
- 최소 iOS 버전을 iOS 17 이상으로 확정했습니다.
- MVP 로컬 저장은 SwiftData로 바로 시작하기로 확정했습니다.
- Core MVP 당시 레시피 검색을 보류했으며 첫 공개 출시에는 최신 제품 결정에 따라 제목·재료명 로컬 검색을 포함합니다.
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
- 2026-07-01 QA Agent가 `T-20260701-002` 기준 수동 QA를 시도했습니다.
- `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- iPhone SE (3rd generation) iOS 17.2 시뮬레이터에서 앱 설치/실행, Home 화면, 작은 화면 Home, 다크 모드 Home 가독성을 확인했습니다.
- iPhone 15 iOS 17.2 시뮬레이터는 Apple ID Verification 시스템 팝업으로 앱 화면 확인이 차단되었습니다.
- macOS `System Events` 보조 접근 권한 미허용으로 Simulator 터치 자동화가 차단되어 Home 이후 Cooking Log, AI Review, Recipe Detail, Audio Player, SwiftData 저장 유지 검증은 완료하지 못했습니다.
- QA 상세 보고서는 `../../../.ai_project/qa/T-20260701-002_qa-report.md`에 기록했습니다.
- 2026-07-01 Product Owner 재개 승인 후 QA Agent가 iPhone SE (3rd generation) iOS 17.2 시뮬레이터에서 새 설치 기준 수동 QA를 재개했습니다.
- Home, Cooking Log 진입, 10초 기록, STEP Preview 1개 생성, `AI 정리하기` 버튼 표시까지 확인했습니다.
- Cooking Log에 STEP Preview 1개가 표시된 상태에서 `AI 정리하기`를 누르면 AI Review가 레시피 초안 대신 `정리할 STEP Preview가 없습니다.` 오류를 표시하는 핵심 흐름 결함을 확인했습니다.
- 이 결함으로 AI Review 저장, Recipe Detail, Audio Player, SwiftData 저장 유지 검증은 완료하지 못했고, `T-20260701-002`를 `rework_requested`로 전환했습니다.
- `AI 정리하기` route가 STEP Preview 배열을 직접 들고 AI Review로 이동하도록 수정해, 전역 임시 상태가 비어 AI Review에 빈 배열이 전달될 수 있는 경로를 제거했습니다.
- 수정 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- `xcodebuild ... -only-testing:CookLogTests/AIReviewViewModelTests test -quiet`로 AI Review ViewModel 테스트 4개 통과를 확인했습니다.
- 수정 후 iPhone SE (3rd generation) iOS 17.2 시뮬레이터에서 새 설치 기준 Home -> Cooking Log -> 10초 기록 2회 -> STEP Preview 2개 누적 -> AI Review 초안 표시까지 재검증했습니다.
- 기존 `정리할 STEP Preview가 없습니다.` 오류는 재현되지 않았습니다.
- AI Review 하단 저장 버튼까지의 스크롤 자동화가 안정적으로 전달되지 않아 저장 이후 터치 검증은 후속 수동 확인으로 남겼습니다.
- `AIReviewViewModelTests`, `RecipeDetailViewModelTests`, `AudioPlayerViewModelTests`, `SwiftDataRecipeLocalDataSourceTests` 선별 실행으로 총 18개 테스트 통과를 확인했습니다.
- QA Agent가 `T-20260701-003` ready_for_qa를 재검증했고, STEP Preview 1개 생성 후 AI Review 초안 표시를 확인해 `QA-HIGH-001` 수정 통과로 판정했습니다.
- QA 재검증 중 STEP Preview 2개 누적까지 확인했으나, Simulator 종료로 2개 누적 상태의 AI Review 재진입 스크린샷은 확보하지 못했습니다.
- 2026-07-27 QA Agent가 `T-20260701-002` 저장 이후 MVP 흐름을 iPhone SE (3rd generation), iOS 17.2 시뮬레이터에서 재검증했습니다.
- AI Review 저장, Recipe Detail, Audio Player 재생/정지/다시 듣기, 앱 종료·재실행 후 SwiftData 레시피 유지와 재진입을 실제 터치로 확인했습니다.
- iPhone SE 작은 화면과 Home, Cooking Log, AI Review, Recipe Detail, Audio Player의 다크 모드 가독성을 확인했습니다.
- AI Review의 재료 행과 STEP 추가·삭제를 확인했고, 문자열 편집 전체와 2단계 이전/다음 이동은 후속 사람 손 입력 확인으로 남겼습니다.
- `xcodebuild build -quiet`, `xcodebuild build-for-testing -quiet` 성공과 핵심 선별 XCTest 18개 통과를 확인했습니다.
- 신규 제품 결함은 없으며 `T-20260701-002`를 조건부 통과와 `qa_passed`로 판정했습니다.

## 열린 질문

- CI 환경·build·XCTest workflow는 완료됐고 T-20260730-004~006의 진단·dry run·required check 적용이 남아 있습니다.
- Xcode 15.2 설치본 부재 위험은 Product Owner가 수용했으며 Xcode 15.2 호환성을 보장하지 않습니다.

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
