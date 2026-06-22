import Foundation

struct FetchRecipeUseCase {
    private let recipeRepository: RecipeRepository

    init(recipeRepository: RecipeRepository) {
        self.recipeRepository = recipeRepository
    }

    func execute(id: UUID) async throws -> Recipe? {
        try await recipeRepository.fetchRecipe(id: id)
    }
}
