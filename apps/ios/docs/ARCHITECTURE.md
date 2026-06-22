# CookLog iOS Architecture

이 문서는 CookLog iOS 앱의 구조, 계층 책임, 의존성 조립 기준을 관리합니다.

최종 업데이트: 2026-06-22
상태: 확정

## 1. 아키텍처 기준

최종 구조는 Feature 중심 MVVM + UseCase + Repository/DataSource입니다.

- View: SwiftUI 화면과 사용자 입력
- ViewModel: 화면 상태, 사용자 액션, 서비스 호출 조정
- UseCase: 앱의 행위 단위
- Repository: 도메인 관점의 데이터 접근 인터페이스
- DataSource: 실제 저장소나 외부 API 구현
- Persistence: SwiftData 저장 모델
- Mapper: 도메인 모델과 저장 모델 변환
- Service: STT, 오디오 안내 같은 플랫폼 기능 경계

흐름:

```text
Feature View
-> ViewModel
-> UseCase
-> Repository
-> DataSource
-> Persistence 또는 API
```

도입하지 않는 것:

- TCA
- VIPER
- Clean Architecture 전체 구조
- 복잡한 DI 컨테이너
- DI 라이브러리

필요한 경계는 프로토콜로 만들되, 구조 자체는 단순하게 유지합니다.

## 2. 폴더 구조

프로젝트 생성 후 다음 구조를 기준으로 정리합니다.

```text
CookLog/
├── App/
│   ├── CookLogApp.swift
│   ├── AppRoute.swift
│   └── AppEnvironment.swift
├── Domain/
│   ├── Models/
│   ├── Repositories/
│   └── UseCases/
├── Data/
│   ├── Repositories/
│   ├── DataSources/
│   ├── Persistence/
│   └── Mappers/
├── Services/
│   ├── Speech/
│   └── AudioGuide/
├── Features/
│   ├── Home/
│   ├── CookingLog/
│   ├── AIReview/
│   ├── RecipeDetail/
│   └── AudioPlayer/
├── Support/
│   ├── Error/
│   └── ViewState/
├── PreviewSupport/
└── Resources/
```

기준:

- 단일 앱 타겟으로 시작합니다.
- 내부 모듈 분리는 하지 않습니다.
- 기능별 화면, ViewModel, 작은 View 컴포넌트는 `Features/{FeatureName}/` 안에 둡니다.
- 공통 도메인 모델과 UseCase는 `Domain/`에 둡니다.
- SwiftData, Repository 구현, DataSource 구현, Mapper는 `Data/`에 둡니다.
- Speech와 AudioGuide처럼 플랫폼 기능을 직접 다루는 구현은 `Services/`에 둡니다.
- 샘플 데이터, Preview 전용 helper는 `PreviewSupport/`에 둡니다.

## 3. 화면

MVP 화면:

- `HomeView`
- `CookingLogView`
- `AIReviewView`
- `RecipeDetailView`
- `AudioPlayerView`

화면 기준:

- Home은 기록 시작과 저장된 레시피 재사용에 집중합니다.
- Cooking Log는 10초 음성 기록과 STEP Preview 누적에 집중합니다.
- AI Review는 AI 정리 결과를 저장 전 수정하는 화면입니다.
- Recipe Detail은 저장된 레시피 조회와 오디오 가이드 진입을 담당합니다.
- Audio Player는 버튼 기반 단계 이동과 TTS 재생을 담당합니다.

MVP 제외 화면:

- 레시피 검색 화면
- 로그인/회원가입 화면
- 공유/커뮤니티 화면
- Import/OCR 화면
- AI 챗 화면
- 음성 명령 화면

## 4. AppEnvironment와 DI

DI 라이브러리는 사용하지 않습니다.

`AppEnvironment`에서 Repository, UseCase, Service, ViewModel 생성을 조립합니다.

기준:

- ViewModel은 생성자 주입을 사용합니다.
- ViewModel 내부에서 전역 container를 참조하지 않습니다.
- 테스트에서는 Mock Repository/Service를 직접 주입할 수 있어야 합니다.
- 외부 패키지가 필요해지면 Swift Package Manager로 관리합니다.

## 5. AppState

거대한 전역 `AppState`는 만들지 않습니다.

기준:

- 화면 상태는 각 ViewModel이 소유합니다.
- 작성 중 Cooking Log 상태는 `CookingLogViewModel` 또는 작은 세션 저장 객체가 소유합니다.
- 전역 공유가 필요한 것은 `AppEnvironment`의 의존성 조립에 한정합니다.

## 6. Error 처리

앱 공통 에러는 `AppError`로 정리합니다.

```swift
enum AppError: Error, Equatable {
    case microphonePermissionDenied
    case speechPermissionDenied
    case speechRecognitionFailed
    case recipeGenerationFailed
    case recipeSaveFailed
    case recipeNotFound
}
```

사용자 메시지는 별도 매핑으로 관리합니다.

```swift
extension AppError {
    var userMessage: String {
        // 사용자에게 보여줄 메시지
    }
}
```

## 7. ViewState

비동기 화면 상태는 필요한 화면에서만 `ViewState`를 제한적으로 사용합니다.

```swift
enum ViewState<Value> {
    case idle
    case loading
    case loaded(Value)
    case empty
    case failed(AppError)
}
```

기준:

- 목록, 상세 조회, AI 정리처럼 loading/error가 필요한 화면에 사용합니다.
- 모든 화면에 억지로 적용하지 않습니다.
- 단순 입력 상태는 ViewModel의 명시적 property로 관리합니다.

## 8. UseCase 스펙

UseCase는 앱의 행위 단위로 둡니다.

MVP 후보:

- `FetchRecipesUseCase`
- `FetchRecipeUseCase`
- `SaveRecipeUseCase`
- `DeleteRecipeUseCase`
- `AddStepPreviewUseCase`
- `GenerateRecipeDraftUseCase`
- `PlayRecipeStepUseCase`

기준:

- 저장, AI 정리, 레시피 조회처럼 테스트 가치가 높은 흐름은 UseCase로 둡니다.
- 실시간 녹음 제어는 `CookingLogViewModel`이 `SpeechRecognitionService`를 직접 호출해도 됩니다.
- UseCase를 너무 작게 쪼개지 않습니다.

## 9. Repository/DataSource 스펙

Repository 인터페이스는 Domain에 둡니다.

### RecipeRepository

```swift
protocol RecipeRepository {
    func fetchRecipes() async throws -> [Recipe]
    func fetchRecipe(id: UUID) async throws -> Recipe?
    func saveRecipe(_ recipe: Recipe) async throws
    func deleteRecipe(id: UUID) async throws
}
```

### RecipeGenerationRepository

```swift
protocol RecipeGenerationRepository {
    func generateRecipeDraft(from input: RecipeGenerationInput) async throws -> RecipeDraft
}
```

Repository 구현체는 Data에 둡니다.

- `DefaultRecipeRepository`
- `DefaultRecipeGenerationRepository`

DataSource는 Data 계층에 둡니다.

MVP 후보:

- `RecipeLocalDataSource`
- `SwiftDataRecipeLocalDataSource`
- `RecipeAIDataSource`
- `MockRecipeAIDataSource`

향후 후보:

- `RecipeRemoteDataSource`
- `RemoteRecipeAIDataSource`
- `BlogImportDataSource`
- `OCRDataSource`
- `YouTubeTranscriptDataSource`

기준:

- Repository는 도메인 모델을 반환합니다.
- DataSource는 저장 모델이나 API DTO를 다룰 수 있습니다.
- Mapper는 Repository 구현체 또는 Data/Mappers에서 사용합니다.
- Speech와 AudioGuide는 Repository로 감싸지 않고 Service로 둡니다.
