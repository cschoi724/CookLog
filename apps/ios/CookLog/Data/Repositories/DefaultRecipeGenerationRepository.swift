import Foundation

struct DefaultRecipeGenerationRepository: RecipeGenerationRepository {
    private let aiDataSource: RecipeAIDataSource

    init(aiDataSource: RecipeAIDataSource) {
        self.aiDataSource = aiDataSource
    }

    func generateRecipeDraft(from input: RecipeGenerationInput) async throws -> RecipeDraft {
        try await aiDataSource.generateRecipeDraft(from: input)
    }
}
