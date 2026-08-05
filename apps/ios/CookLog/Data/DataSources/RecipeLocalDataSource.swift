import Foundation

protocol RecipeLocalDataSource {
    func fetchRecipes() async throws -> [Recipe]
    func fetchRecipe(id: UUID) async throws -> Recipe?
    func saveRecipe(_ recipe: Recipe) async throws
    func deleteRecipe(id: UUID) async throws
}

protocol RecipeRecordLocalDataSource {
    func fetchRecords() async throws -> [RecipeRecord]
    func fetchRecord(id: UUID) async throws -> RecipeRecord?
    func saveRecord(_ record: RecipeRecord) async throws
    func deleteRecord(id: UUID) async throws
}
