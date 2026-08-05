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

struct DefaultRecipeRecordRepository: RecipeRecordRepository {
    private let localDataSource: RecipeRecordLocalDataSource

    init(localDataSource: RecipeRecordLocalDataSource) {
        self.localDataSource = localDataSource
    }

    func fetchRecords() async throws -> [RecipeRecord] {
        try await localDataSource.fetchRecords()
    }

    func fetchRecord(id: UUID) async throws -> RecipeRecord? {
        try await localDataSource.fetchRecord(id: id)
    }

    func saveRecord(_ record: RecipeRecord) async throws {
        try await localDataSource.saveRecord(record)
    }

    func deleteRecord(id: UUID) async throws {
        try await localDataSource.deleteRecord(id: id)
    }
}
