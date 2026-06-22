import Foundation

struct GenerateRecipeDraftUseCase {
    private let recipeGenerationRepository: RecipeGenerationRepository

    init(recipeGenerationRepository: RecipeGenerationRepository) {
        self.recipeGenerationRepository = recipeGenerationRepository
    }

    func execute(from input: RecipeGenerationInput) async throws -> RecipeDraft {
        try await recipeGenerationRepository.generateRecipeDraft(from: input)
    }
}
