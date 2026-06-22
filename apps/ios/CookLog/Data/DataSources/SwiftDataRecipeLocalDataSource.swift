import Foundation
import SwiftData

@MainActor
final class SwiftDataRecipeLocalDataSource: RecipeLocalDataSource {
    private let modelContext: ModelContext

    init(modelContext: ModelContext) {
        self.modelContext = modelContext
    }

    func fetchRecipes() async throws -> [Recipe] {
        var descriptor = FetchDescriptor<PersistentRecipe>(
            sortBy: [SortDescriptor(\.updatedAt, order: .reverse)]
        )
        descriptor.includePendingChanges = true

        return try modelContext.fetch(descriptor)
            .map(RecipePersistenceMapper.makeRecipe)
    }

    func fetchRecipe(id: UUID) async throws -> Recipe? {
        try fetchPersistentRecipe(id: id).map(RecipePersistenceMapper.makeRecipe)
    }

    func saveRecipe(_ recipe: Recipe) async throws {
        if let persistentRecipe = try fetchPersistentRecipe(id: recipe.id) {
            RecipePersistenceMapper.update(persistentRecipe, from: recipe)
        } else {
            modelContext.insert(RecipePersistenceMapper.makePersistentRecipe(from: recipe))
        }

        try modelContext.save()
    }

    func deleteRecipe(id: UUID) async throws {
        guard let persistentRecipe = try fetchPersistentRecipe(id: id) else {
            return
        }

        modelContext.delete(persistentRecipe)
        try modelContext.save()
    }

    private func fetchPersistentRecipe(id: UUID) throws -> PersistentRecipe? {
        let descriptor = FetchDescriptor<PersistentRecipe>(
            predicate: #Predicate { recipe in
                recipe.id == id
            }
        )

        return try modelContext.fetch(descriptor).first
    }
}
