import XCTest
@testable import CookLog

final class DefaultRecipeRepositoryTests: XCTestCase {
    func testSaveAndFetchRecipe() async throws {
        let dataSource = InMemoryRecipeLocalDataSource()
        let repository = DefaultRecipeRepository(localDataSource: dataSource)
        let recipe = makeRecipe(title: "간장 삼겹살 볶음")

        try await repository.saveRecipe(recipe)

        let fetchedRecipe = try await repository.fetchRecipe(id: recipe.id)
        XCTAssertEqual(fetchedRecipe, recipe)
    }

    func testFetchRecipesSortsByUpdatedAtDescending() async throws {
        let oldRecipe = makeRecipe(
            title: "오래된 레시피",
            updatedAt: Date(timeIntervalSince1970: 100)
        )
        let newRecipe = makeRecipe(
            title: "새 레시피",
            updatedAt: Date(timeIntervalSince1970: 200)
        )
        let dataSource = InMemoryRecipeLocalDataSource(recipes: [oldRecipe, newRecipe])
        let repository = DefaultRecipeRepository(localDataSource: dataSource)

        let recipes = try await repository.fetchRecipes()

        XCTAssertEqual(recipes.map(\.id), [newRecipe.id, oldRecipe.id])
    }

    func testDeleteRecipeRemovesRecipe() async throws {
        let recipe = makeRecipe(title: "삭제할 레시피")
        let dataSource = InMemoryRecipeLocalDataSource(recipes: [recipe])
        let repository = DefaultRecipeRepository(localDataSource: dataSource)

        try await repository.deleteRecipe(id: recipe.id)

        let fetchedRecipe = try await repository.fetchRecipe(id: recipe.id)
        XCTAssertNil(fetchedRecipe)
    }

    private func makeRecipe(
        title: String,
        updatedAt: Date = Date(timeIntervalSince1970: 100)
    ) -> Recipe {
        Recipe(
            title: title,
            ingredients: [
                Ingredient(name: "삼겹살", amountText: "200g")
            ],
            steps: [
                RecipeStep(order: 1, text: "삼겹살을 볶습니다.")
            ],
            updatedAt: updatedAt
        )
    }
}
