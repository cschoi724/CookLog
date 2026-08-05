import SwiftData
import XCTest
@testable import CookLog

@MainActor
final class SwiftDataRecipeLocalDataSourceTests: XCTestCase {
    func testSaveAndFetchRecipe() async throws {
        let store = try makeTestStore()
        let recipe = makeRecipe(id: UUID(), title: "저장한 레시피", updatedAt: Date(timeIntervalSince1970: 100))

        try await store.dataSource.saveRecipe(recipe)
        let fetchedRecipe = try await store.dataSource.fetchRecipe(id: recipe.id)

        XCTAssertEqual(fetchedRecipe, recipe)
    }

    func testFetchRecipesSortsByUpdatedAtDescending() async throws {
        let store = try makeTestStore()
        let olderRecipe = makeRecipe(id: UUID(), title: "이전 레시피", updatedAt: Date(timeIntervalSince1970: 100))
        let newerRecipe = makeRecipe(id: UUID(), title: "최근 레시피", updatedAt: Date(timeIntervalSince1970: 200))

        try await store.dataSource.saveRecipe(olderRecipe)
        try await store.dataSource.saveRecipe(newerRecipe)
        let recipes = try await store.dataSource.fetchRecipes()

        XCTAssertEqual(recipes.map(\.id), [newerRecipe.id, olderRecipe.id])
    }

    func testDeleteRecipe() async throws {
        let store = try makeTestStore()
        let recipe = makeRecipe(id: UUID(), title: "삭제할 레시피", updatedAt: Date(timeIntervalSince1970: 100))

        try await store.dataSource.saveRecipe(recipe)
        try await store.dataSource.deleteRecipe(id: recipe.id)
        let fetchedRecipe = try await store.dataSource.fetchRecipe(id: recipe.id)

        XCTAssertNil(fetchedRecipe)
    }

    func testPersistsMultipleRecipeRecordsAndRestoresThemByRecentActivity() async throws {
        let store = try makeTestStore()
        let older = RecipeRecord(
            id: UUID(),
            stepPreviews: [StepPreview(order: 1, transcript: "양파를 썰었어")],
            createdAt: Date(timeIntervalSince1970: 50),
            updatedAt: Date(timeIntervalSince1970: 100)
        )
        var newer = RecipeRecord(
            id: UUID(),
            stepPreviews: [StepPreview(order: 1, transcript: "두부를 구웠어")],
            createdAt: Date(timeIntervalSince1970: 150),
            updatedAt: Date(timeIntervalSince1970: 150)
        )
        try newer.beginAIProcessing(requestID: UUID(), updatedAt: Date(timeIntervalSince1970: 175))
        try newer.finishAIProcessing(
            with: RecipeDraft(
                title: "두부구이",
                ingredients: [Ingredient(name: "두부", amountText: "1모")],
                steps: [RecipeStep(order: 1, text: "두부를 굽습니다.")]
            ),
            updatedAt: Date(timeIntervalSince1970: 200)
        )

        try await store.dataSource.saveRecord(older)
        try await store.dataSource.saveRecord(newer)

        let restoredDataSource = SwiftDataRecipeLocalDataSource(
            modelContext: ModelContext(store.modelContainer)
        )
        let restored = try await restoredDataSource.fetchRecords()

        XCTAssertEqual(restored.map(\.id), [newer.id, older.id])
        XCTAssertEqual(restored.first?.lifecycleState, .draftAIReview)
        XCTAssertEqual(restored.first?.reviewDraft?.title, "두부구이")
        XCTAssertEqual(restored.last?.stepPreviews, older.stepPreviews)
    }

    func testLegacyRecipeDefaultsToCompletedRecordWithoutDataLoss() async throws {
        let store = try makeTestStore()
        let recipe = makeRecipe(
            id: UUID(),
            title: "기존 완료 레시피",
            updatedAt: Date(timeIntervalSince1970: 100)
        )
        let legacyPersistentRecipe = PersistentRecipe(
            id: recipe.id,
            title: recipe.title,
            ingredients: recipe.ingredients.enumerated().map { index, ingredient in
                PersistentIngredient(
                    id: ingredient.id,
                    name: ingredient.name,
                    amountText: ingredient.amountText,
                    order: index
                )
            },
            steps: recipe.steps.map {
                PersistentRecipeStep(
                    id: $0.id,
                    order: $0.order,
                    text: $0.text,
                    duration: $0.duration,
                    note: $0.note
                )
            },
            memo: recipe.memo,
            estimatedTime: recipe.estimatedTime,
            sourceRawValue: recipe.source.rawValue,
            syncStatusRawValue: recipe.syncStatus.rawValue,
            ownerId: recipe.ownerId,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt
        )
        store.modelContainer.mainContext.insert(legacyPersistentRecipe)
        try store.modelContainer.mainContext.save()

        let record = try await store.dataSource.fetchRecord(id: recipe.id)
        let fetchedRecipe = try await store.dataSource.fetchRecipe(id: recipe.id)

        XCTAssertEqual(record?.lifecycleState, .completed)
        XCTAssertEqual(record?.completedRecipe, recipe)
        XCTAssertEqual(fetchedRecipe, recipe)
    }

    func testCompletedRecipeQueriesExcludeInProgressRecords() async throws {
        let store = try makeTestStore()
        let draft = RecipeRecord(
            stepPreviews: [StepPreview(order: 1, transcript: "진행 중")]
        )
        let completedRecipe = makeRecipe(
            id: UUID(),
            title: "완료 레시피",
            updatedAt: Date(timeIntervalSince1970: 200)
        )

        try await store.dataSource.saveRecord(draft)
        try await store.dataSource.saveRecipe(completedRecipe)
        let recipes = try await store.dataSource.fetchRecipes()
        let draftRecipe = try await store.dataSource.fetchRecipe(id: draft.id)

        XCTAssertEqual(recipes, [completedRecipe])
        XCTAssertNil(draftRecipe)
    }

    private func makeTestStore() throws -> TestStore {
        let configuration = ModelConfiguration(isStoredInMemoryOnly: true)
        let modelContainer = try ModelContainer(
            for: PersistentRecipe.self,
            PersistentIngredient.self,
            PersistentRecipeStep.self,
            configurations: configuration
        )

        return TestStore(modelContainer: modelContainer)
    }

    private func makeRecipe(
        id: UUID,
        title: String,
        updatedAt: Date
    ) -> Recipe {
        Recipe(
            id: id,
            title: title,
            ingredients: [
                Ingredient(name: "양파", amountText: "1/2개")
            ],
            steps: [
                RecipeStep(order: 1, text: "\(title) 조리")
            ],
            memo: "메모",
            estimatedTime: 15 * 60,
            createdAt: Date(timeIntervalSince1970: 50),
            updatedAt: updatedAt
        )
    }
}

@MainActor
private final class TestStore {
    let modelContainer: ModelContainer
    let dataSource: SwiftDataRecipeLocalDataSource

    init(modelContainer: ModelContainer) {
        self.modelContainer = modelContainer
        dataSource = SwiftDataRecipeLocalDataSource(modelContext: modelContainer.mainContext)
    }
}
