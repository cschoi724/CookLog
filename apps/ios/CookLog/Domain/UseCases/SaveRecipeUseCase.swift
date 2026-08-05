import Foundation

struct SaveRecipeUseCase {
    private let recipeRepository: RecipeRepository

    init(recipeRepository: RecipeRepository) {
        self.recipeRepository = recipeRepository
    }

    func execute(_ recipe: Recipe) async throws {
        try await recipeRepository.saveRecipe(recipe)
    }
}

enum RecipeRecordUseCaseError: Error, Equatable {
    case recordNotFound(UUID)
}

struct CreateRecipeRecordUseCase {
    private let repository: RecipeRecordRepository

    init(repository: RecipeRecordRepository) {
        self.repository = repository
    }

    func execute(
        id: UUID = UUID(),
        createdAt: Date = Date()
    ) async throws -> RecipeRecord {
        let record = RecipeRecord(id: id, createdAt: createdAt, updatedAt: createdAt)
        try await repository.createRecord(record)
        return record
    }
}

struct FetchRecipeRecordsUseCase {
    private let repository: RecipeRecordRepository

    init(repository: RecipeRecordRepository) {
        self.repository = repository
    }

    func execute() async throws -> [RecipeRecord] {
        try await repository.fetchRecords()
    }
}

struct SaveStepPreviewDraftUseCase {
    private let repository: RecipeRecordRepository

    init(repository: RecipeRecordRepository) {
        self.repository = repository
    }

    func execute(
        recordID: UUID,
        stepPreviews: [StepPreview],
        updatedAt: Date = Date()
    ) async throws -> RecipeRecord {
        var record = try await requiredRecord(id: recordID, repository: repository)
        try record.replaceStepPreviews(stepPreviews, updatedAt: updatedAt)
        try await repository.saveRecord(record)
        return record
    }
}

struct SaveAIReviewDraftUseCase {
    private let repository: RecipeRecordRepository

    init(repository: RecipeRecordRepository) {
        self.repository = repository
    }

    func execute(
        recordID: UUID,
        draft: RecipeDraft,
        updatedAt: Date = Date()
    ) async throws -> RecipeRecord {
        var record = try await requiredRecord(id: recordID, repository: repository)
        try record.saveReviewDraft(draft, updatedAt: updatedAt)
        try await repository.saveRecord(record)
        return record
    }
}

struct CompleteRecipeRecordUseCase {
    private let repository: RecipeRecordRepository

    init(repository: RecipeRecordRepository) {
        self.repository = repository
    }

    func execute(
        recordID: UUID,
        recipe: Recipe,
        updatedAt: Date = Date()
    ) async throws -> RecipeRecord {
        var record = try await requiredRecord(id: recordID, repository: repository)
        try record.complete(with: recipe, updatedAt: updatedAt)
        try await repository.saveRecord(record)
        return record
    }
}

private func requiredRecord(
    id: UUID,
    repository: RecipeRecordRepository
) async throws -> RecipeRecord {
    guard let record = try await repository.fetchRecord(id: id) else {
        throw RecipeRecordUseCaseError.recordNotFound(id)
    }
    return record
}
