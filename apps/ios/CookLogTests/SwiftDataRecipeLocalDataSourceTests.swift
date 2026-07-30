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
