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

actor InMemoryRecipeRecordLocalDataSource: RecipeRecordLocalDataSource {
    private var recordsById: [UUID: RecipeRecord]

    init(records: [RecipeRecord] = []) {
        recordsById = Dictionary(uniqueKeysWithValues: records.map { ($0.id, $0) })
    }

    func fetchRecords() async throws -> [RecipeRecord] {
        recordsById.values.sorted { $0.updatedAt > $1.updatedAt }
    }

    func fetchRecord(id: UUID) async throws -> RecipeRecord? {
        recordsById[id]
    }

    func createRecord(_ record: RecipeRecord) async throws {
        guard recordsById[record.id] == nil else {
            throw RecipeRecordRepositoryError.recordAlreadyExists(record.id)
        }
        recordsById[record.id] = record
    }

    func saveRecord(_ record: RecipeRecord) async throws {
        recordsById[record.id] = record
    }

    func deleteRecord(id: UUID) async throws {
        recordsById[id] = nil
    }
}
