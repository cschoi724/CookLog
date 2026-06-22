import Foundation

protocol RecipeLocalDataSource {
    func fetchRecipes() async throws -> [Recipe]
    func fetchRecipe(id: UUID) async throws -> Recipe?
    func saveRecipe(_ recipe: Recipe) async throws
    func deleteRecipe(id: UUID) async throws
}
