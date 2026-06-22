import Foundation

struct SaveRecipeUseCase {
    private let recipeRepository: RecipeRepository

    init(recipeRepository: RecipeRepository) {
        self.recipeRepository = recipeRepository
    }

    func execute(_ recipe: Recipe) async throws {
        try await recipeRepository.saveRecipe(recipe)
    }
}
