# CookLog iOS Persistence

이 문서는 CookLog iOS 앱의 로컬 저장 기준을 관리합니다.

최종 업데이트: 2026-08-05
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
- `PersistentRecipe`의 lifecycle 확장 필드
  - `lifecycleStateRawValue`
  - `stepPreviewsData`
  - `hasReviewDraft`
  - `aiRequestID`
  - `isAISnapshotLocked`

기준:

- `Recipe.id`는 UUID로 시작합니다.
- 서버가 생기면 `remoteId`는 그 시점에 추가합니다.
- 진행 기록은 첫 공개 출시 범위에서 `PersistentRecipe`와 같은 UUID로 영구 저장합니다.
- 기존 lifecycle 필드가 없는 `PersistentRecipe`는 기본 `completed`로 해석합니다.
- 비어 있거나 알 수 없는 lifecycle raw value도 Mapper와 완료 Recipe 단건·목록 조회에서
  모두 `completed`로 해석해 구버전 레시피가 숨겨지지 않게 합니다.
- STEP Preview는 순서·UUID·원문·생성 시각을 JSON `Data`로 저장하고 Mapper에서 도메인 배열로 복원합니다.
- AI Review 관계 필드는 마지막으로 성공한 수동 임시 저장 snapshot을 나타냅니다.
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
- `RecipeRecordLocalDataSource`는 draft와 completed를 함께 다루고 `updatedAt` 내림차순으로 반환합니다.
- 기존 `RecipeLocalDataSource` 조회는 `completed` record만 반환해 과거 화면 경로와의 호환성을 유지합니다.
- 새 draft는 `createRecord(_:)`로만 생성하며, InMemory와 SwiftData 모두 기존 UUID가 있으면
  `recordAlreadyExists` 오류로 원자적으로 거부합니다. 기존 record 갱신은 `saveRecord(_:)`로
  분리해 생성 충돌이 완료 Recipe의 내용이나 lifecycle을 변경하지 않게 합니다.

## 5. 저장 실패 처리

저장 실패는 `AppError.recipeSaveFailed`로 매핑합니다.

기준:

- 저장 실패 시 사용자에게 재시도 가능한 메시지를 보여줍니다.
- 실패한 레시피를 서버에 재전송하는 기능은 MVP에서 구현하지 않습니다.
- 저장/조회 단위 테스트는 Mock DataSource 또는 인메모리 저장소로 시작합니다.
- SwiftData 저장·삭제 실패 시 `ModelContext.rollback()`으로 부분 변경을 되돌립니다.
- STEP 자동 저장과 AI Review 수동 임시 저장 UseCase는 저장 성공 전 도메인 원본을 변경하지 않습니다.

## 6. Migration 경계

- 기존 `PersistentRecipe` 모델 이름과 완료 Recipe 필드는 유지합니다.
- 새 lifecycle 필드는 기본값 또는 optional로 추가해 SwiftData의 경량 자동 migration 경계를 사용합니다.
- lifecycle 값이 없거나 알 수 없는 기존 행은 데이터 손실을 막기 위해 `completed`로 복원합니다.
- 이 fallback은 `RecipeRecord` 변환과 기존 완료 Recipe 단건·목록 조회에 동일하게 적용합니다.
- iPhone 15 iOS 17.2 Simulator의 기존 store 위에 새 앱을 설치·실행해 schema 확장과 앱 시작을 확인했습니다.
- iOS QA가 준비한 실제 non-empty legacy store fixture를 새 schema로 열어 제목·재료·단계가
  유지된 completed record와 Recipe로 복원되는 것을 전체 XCTest에서 검증했습니다.
