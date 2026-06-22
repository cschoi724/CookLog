import Foundation

struct FetchRecipesUseCase {
    private let recipeRepository: RecipeRepository

    init(recipeRepository: RecipeRepository) {
        self.recipeRepository = recipeRepository
    }

    func execute() async throws -> [Recipe] {
        try await recipeRepository.fetchRecipes()
    }
}
