import Foundation
import SwiftData

@MainActor
final class SwiftDataRecipeLocalDataSource: RecipeLocalDataSource, RecipeRecordLocalDataSource {
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
            .filter { RecipeLifecycleState.restored(from: $0.lifecycleStateRawValue) == .completed }
            .map(RecipePersistenceMapper.makeRecipe)
    }

    func fetchRecipe(id: UUID) async throws -> Recipe? {
        guard let persistentRecipe = try fetchPersistentRecipe(id: id),
              RecipeLifecycleState.restored(from: persistentRecipe.lifecycleStateRawValue) == .completed else {
            return nil
        }
        return RecipePersistenceMapper.makeRecipe(from: persistentRecipe)
    }

    func saveRecipe(_ recipe: Recipe) async throws {
        do {
            if let persistentRecipe = try fetchPersistentRecipe(id: recipe.id) {
                RecipePersistenceMapper.update(persistentRecipe, from: recipe)
            } else {
                modelContext.insert(RecipePersistenceMapper.makePersistentRecipe(from: recipe))
            }

            try modelContext.save()
        } catch {
            modelContext.rollback()
            throw error
        }
    }

    func deleteRecipe(id: UUID) async throws {
        guard let persistentRecipe = try fetchPersistentRecipe(id: id) else {
            return
        }

        do {
            modelContext.delete(persistentRecipe)
            try modelContext.save()
        } catch {
            modelContext.rollback()
            throw error
        }
    }

    func fetchRecords() async throws -> [RecipeRecord] {
        var descriptor = FetchDescriptor<PersistentRecipe>(
            sortBy: [SortDescriptor(\.updatedAt, order: .reverse)]
        )
        descriptor.includePendingChanges = true

        return try modelContext.fetch(descriptor).map(RecipePersistenceMapper.makeRecord)
    }

    func fetchRecord(id: UUID) async throws -> RecipeRecord? {
        try fetchPersistentRecipe(id: id).map(RecipePersistenceMapper.makeRecord)
    }

    func createRecord(_ record: RecipeRecord) async throws {
        guard try fetchPersistentRecipe(id: record.id) == nil else {
            throw RecipeRecordRepositoryError.recordAlreadyExists(record.id)
        }

        do {
            modelContext.insert(try RecipePersistenceMapper.makePersistentRecord(from: record))
            try modelContext.save()
        } catch {
            modelContext.rollback()
            throw error
        }
    }

    func saveRecord(_ record: RecipeRecord) async throws {
        do {
            if let persistentRecipe = try fetchPersistentRecipe(id: record.id) {
                try RecipePersistenceMapper.update(persistentRecipe, from: record)
            } else {
                modelContext.insert(try RecipePersistenceMapper.makePersistentRecord(from: record))
            }

            try modelContext.save()
        } catch {
            modelContext.rollback()
            throw error
        }
    }

    func deleteRecord(id: UUID) async throws {
        try await deleteRecipe(id: id)
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
