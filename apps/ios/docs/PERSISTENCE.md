# CookLog iOS Persistence

이 문서는 CookLog iOS 앱의 로컬 저장 기준을 관리합니다.

최종 업데이트: 2026-06-22
상태: 확정

## 1. 저장 기준

MVP 저장소는 SwiftData 기반 로컬 저장입니다.

구현 기준:

- 도메인 모델: 일반 Swift struct
- 영구 저장 모델: SwiftData `@Model`
- 변환: `RecipePersistenceMapper`로 분리
- 앱 실행 경로: `AppEnvironment.live(modelContainer:)` + `SwiftDataRecipeLocalDataSource`
- Preview/Test 경로: `AppEnvironment.mock` + `InMemoryRecipeLocalDataSource`

ViewModel은 SwiftData 모델을 직접 알면 안 됩니다.

## 2. RecipeRepository

```swift
protocol RecipeRepository {
    func fetchRecipes() async throws -> [Recipe]
    func fetchRecipe(id: UUID) async throws -> Recipe?
    func saveRecipe(_ recipe: Recipe) async throws
    func deleteRecipe(id: UUID) async throws
}
```

MVP 구현 후보:

- `DefaultRecipeRepository`
- `SwiftDataRecipeLocalDataSource`

향후 확장 후보:

- `RecipeRemoteDataSource`
- `CachedRecipeRepository`
- `SyncingRecipeRepository`

## 3. SwiftData 저장 모델

MVP 저장 모델:

- `PersistentRecipe`
- `PersistentRecipeStep`
- `PersistentIngredient`

기준:

- `Recipe.id`는 UUID로 시작합니다.
- 서버가 생기면 `remoteId`는 그 시점에 추가합니다.
- 작성 중 `CookingLogSession`은 MVP에서 영구 저장하지 않습니다.
- SwiftData 모델은 `Data/Persistence/`에 둡니다.
- 도메인 모델 변환은 `Data/Persistence/RecipePersistenceMapper.swift`에서 처리합니다.
- `Recipe.source`와 `Recipe.syncStatus`는 rawValue로 저장하고 domain 변환 시 fallback을 둡니다.
- `PersistentRecipe.ingredients`, `PersistentRecipe.steps`는 cascade delete 관계로 저장합니다.
- `fetchRecipes()`는 `updatedAt` 내림차순 정렬을 유지합니다.

## 4. DataSource 경계

MVP 로컬 저장 DataSource:

- `RecipeLocalDataSource`
- `SwiftDataRecipeLocalDataSource`

기준:

- DataSource는 SwiftData 저장 모델을 다룰 수 있습니다.
- Repository는 DataSource 결과를 도메인 모델로 변환해 반환합니다.
- ViewModel과 UseCase는 SwiftData 모델에 직접 접근하지 않습니다.
- `SwiftDataRecipeLocalDataSource`는 `ModelContext`를 내부에 보관하고, save/fetch/delete만 `RecipeLocalDataSource` 계약으로 노출합니다.

## 5. 저장 실패 처리

저장 실패는 `AppError.recipeSaveFailed`로 매핑합니다.

기준:

- 저장 실패 시 사용자에게 재시도 가능한 메시지를 보여줍니다.
- 실패한 레시피를 서버에 재전송하는 기능은 MVP에서 구현하지 않습니다.
- 저장/조회 단위 테스트는 Mock DataSource 또는 인메모리 저장소로 시작합니다.
