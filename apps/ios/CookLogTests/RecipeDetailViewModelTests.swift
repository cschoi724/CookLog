import XCTest
@testable import CookLog

@MainActor
final class RecipeDetailViewModelTests: XCTestCase {
    func testLoadRecipeLoadsRecipeByID() async {
        let recipe = SampleRecipes.soyPorkBelly
        let repository = DetailRecipeRepository(recipes: [recipe])
        let viewModel = makeViewModel(recipeID: recipe.id, repository: repository)

        await viewModel.loadRecipe()

        XCTAssertEqual(viewModel.recipe, recipe)
        XCTAssertFalse(viewModel.isLoading)
        XCTAssertFalse(viewModel.isNotFound)
        XCTAssertNil(viewModel.errorMessage)
    }

    func testLoadRecipeSetsNotFoundWhenRecipeDoesNotExist() async {
        let repository = DetailRecipeRepository(recipes: [])
        let viewModel = makeViewModel(recipeID: UUID(), repository: repository)

        await viewModel.loadRecipe()

        XCTAssertNil(viewModel.recipe)
        XCTAssertTrue(viewModel.isNotFound)
        XCTAssertNil(viewModel.errorMessage)
    }

    func testLoadRecipeSetsErrorMessageWhenFetchFails() async {
        let repository = DetailRecipeRepository(recipes: [], shouldFailFetch: true)
        let viewModel = makeViewModel(recipeID: UUID(), repository: repository)

        await viewModel.loadRecipe()

        XCTAssertNil(viewModel.recipe)
        XCTAssertFalse(viewModel.isNotFound)
        XCTAssertEqual(viewModel.errorMessage, "레시피를 불러오지 못했습니다. 다시 시도해주세요.")
    }

    func testDeleteRecipeRemovesStoredRecipeAndShowsDeletedState() async throws {
        let recipe = SampleRecipes.soyPorkBelly
        let repository = DetailRecipeRepository(recipes: [recipe])
        let viewModel = makeViewModel(recipeID: recipe.id, repository: repository)
        await viewModel.loadRecipe()

        let didDelete = await viewModel.deleteRecipe()

        XCTAssertTrue(didDelete)
        XCTAssertTrue(viewModel.isDeleted)
        XCTAssertNil(viewModel.recipe)
        let storedRecipe = try await repository.fetchRecipe(id: recipe.id)
        XCTAssertNil(storedRecipe)
    }

    func testDeleteFailurePreservesDisplayedAndStoredRecipe() async throws {
        let recipe = SampleRecipes.soyPorkBelly
        let repository = DetailRecipeRepository(recipes: [recipe])
        let viewModel = makeViewModel(recipeID: recipe.id, repository: repository)
        await viewModel.loadRecipe()
        await repository.failNextDelete()

        let didDelete = await viewModel.deleteRecipe()

        XCTAssertFalse(didDelete)
        XCTAssertFalse(viewModel.isDeleted)
        XCTAssertEqual(viewModel.recipe, recipe)
        XCTAssertEqual(viewModel.deleteErrorMessage, "레시피를 삭제하지 못했습니다. 저장된 원본은 그대로 유지했어요.")
        let storedRecipe = try await repository.fetchRecipe(id: recipe.id)
        XCTAssertEqual(storedRecipe, recipe)

        let didRetryDelete = await viewModel.deleteRecipe()
        XCTAssertTrue(didRetryDelete)
        XCTAssertTrue(viewModel.isDeleted)
    }

    private func makeViewModel(
        recipeID: UUID,
        repository: RecipeRepository
    ) -> RecipeDetailViewModel {
        RecipeDetailViewModel(
            recipeID: recipeID,
            fetchRecipeUseCase: FetchRecipeUseCase(recipeRepository: repository),
            deleteRecipeUseCase: DeleteRecipeUseCase(recipeRepository: repository)
        )
    }
}

private actor DetailRecipeRepository: RecipeRepository {
    private var recipes: [UUID: Recipe]
    private let shouldFailFetch: Bool
    private var shouldFailNextDelete = false

    init(recipes: [Recipe], shouldFailFetch: Bool = false) {
        self.recipes = Dictionary(uniqueKeysWithValues: recipes.map { ($0.id, $0) })
        self.shouldFailFetch = shouldFailFetch
    }

    func failNextDelete() {
        shouldFailNextDelete = true
    }

    func fetchRecipes() async throws -> [Recipe] {
        if shouldFailFetch { throw DetailPersistenceError.failed }
        return Array(recipes.values)
    }

    func fetchRecipe(id: UUID) async throws -> Recipe? {
        if shouldFailFetch { throw DetailPersistenceError.failed }
        return recipes[id]
    }

    func saveRecipe(_ recipe: Recipe) async throws {
        recipes[recipe.id] = recipe
    }

    func deleteRecipe(id: UUID) async throws {
        if shouldFailNextDelete {
            shouldFailNextDelete = false
            throw DetailPersistenceError.failed
        }
        recipes[id] = nil
    }
}

private enum DetailPersistenceError: Error {
    case failed
}
