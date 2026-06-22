import Foundation

struct DefaultRecipeRepository: RecipeRepository {
    private let localDataSource: RecipeLocalDataSource

    init(localDataSource: RecipeLocalDataSource) {
        self.localDataSource = localDataSource
    }

    func fetchRecipes() async throws -> [Recipe] {
        try await localDataSource.fetchRecipes()
    }

    func fetchRecipe(id: UUID) async throws -> Recipe? {
        try await localDataSource.fetchRecipe(id: id)
    }

    func saveRecipe(_ recipe: Recipe) async throws {
        try await localDataSource.saveRecipe(recipe)
    }

    func deleteRecipe(id: UUID) async throws {
        try await localDataSource.deleteRecipe(id: id)
    }
}
