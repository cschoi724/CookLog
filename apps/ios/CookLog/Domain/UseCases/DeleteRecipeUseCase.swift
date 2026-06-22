import Foundation

struct DeleteRecipeUseCase {
    private let recipeRepository: RecipeRepository

    init(recipeRepository: RecipeRepository) {
        self.recipeRepository = recipeRepository
    }

    func execute(id: UUID) async throws {
        try await recipeRepository.deleteRecipe(id: id)
    }
}
