import Foundation

actor InMemoryRecipeLocalDataSource: RecipeLocalDataSource {
    private var recipesById: [UUID: Recipe]

    init(recipes: [Recipe] = []) {
        self.recipesById = Dictionary(uniqueKeysWithValues: recipes.map { ($0.id, $0) })
    }

    func fetchRecipes() async throws -> [Recipe] {
        recipesById.values.sorted { $0.updatedAt > $1.updatedAt }
    }

    func fetchRecipe(id: UUID) async throws -> Recipe? {
        recipesById[id]
    }

    func saveRecipe(_ recipe: Recipe) async throws {
        recipesById[recipe.id] = recipe
    }

    func deleteRecipe(id: UUID) async throws {
        recipesById[id] = nil
    }
}
