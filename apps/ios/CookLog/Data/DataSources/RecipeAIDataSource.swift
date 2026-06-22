import Foundation

protocol RecipeAIDataSource {
    func generateRecipeDraft(from input: RecipeGenerationInput) async throws -> RecipeDraft
}
