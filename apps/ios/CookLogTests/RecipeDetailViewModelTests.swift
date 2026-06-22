import XCTest
@testable import CookLog

@MainActor
final class RecipeDetailViewModelTests: XCTestCase {
    func testLoadRecipeLoadsRecipeByID() async {
        let recipe = SampleRecipes.soyPorkBelly
        let viewModel = RecipeDetailViewModel(
            recipeID: recipe.id,
            fetchRecipeUseCase: FetchRecipeUseCase(
                recipeRepository: StubRecipeRepository(recipes: [recipe])
            )
        )

        await viewModel.loadRecipe()

        XCTAssertEqual(viewModel.recipe, recipe)
        XCTAssertFalse(viewModel.isLoading)
        XCTAssertFalse(viewModel.isNotFound)
        XCTAssertNil(viewModel.errorMessage)
    }

    func testLoadRecipeSetsNotFoundWhenRecipeDoesNotExist() async {
        let viewModel = RecipeDetailViewModel(
            recipeID: UUID(),
            fetchRecipeUseCase: FetchRecipeUseCase(
                recipeRepository: StubRecipeRepository(recipes: [])
            )
        )

        await viewModel.loadRecipe()

        XCTAssertNil(viewModel.recipe)
        XCTAssertTrue(viewModel.isNotFound)
        XCTAssertNil(viewModel.errorMessage)
    }

    func testLoadRecipeSetsErrorMessageWhenFetchFails() async {
        let viewModel = RecipeDetailViewModel(
            recipeID: UUID(),
            fetchRecipeUseCase: FetchRecipeUseCase(
                recipeRepository: FailingRecipeRepository()
            )
        )

        await viewModel.loadRecipe()

        XCTAssertNil(viewModel.recipe)
        XCTAssertFalse(viewModel.isNotFound)
        XCTAssertEqual(viewModel.errorMessage, "레시피를 불러오지 못했습니다. 다시 시도해주세요.")
    }
}

private final class StubRecipeRepository: RecipeRepository {
    private let recipes: [Recipe]

    init(recipes: [Recipe]) {
        self.recipes = recipes
    }

    func fetchRecipes() async throws -> [Recipe] {
        recipes
    }

    func fetchRecipe(id: UUID) async throws -> Recipe? {
        recipes.first { $0.id == id }
    }

    func saveRecipe(_ recipe: Recipe) async throws {}

    func deleteRecipe(id: UUID) async throws {}
}

private struct FailingRecipeRepository: RecipeRepository {
    func fetchRecipes() async throws -> [Recipe] {
        throw FetchFailure()
    }

    func fetchRecipe(id: UUID) async throws -> Recipe? {
        throw FetchFailure()
    }

    func saveRecipe(_ recipe: Recipe) async throws {}

    func deleteRecipe(id: UUID) async throws {}
}

private struct FetchFailure: Error {}
