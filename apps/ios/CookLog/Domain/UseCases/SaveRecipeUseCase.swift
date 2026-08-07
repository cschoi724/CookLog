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
    case stepPreviewSnapshotMismatch
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

struct FetchRecipeRecordUseCase {
    private let repository: RecipeRecordRepository

    init(repository: RecipeRecordRepository) {
        self.repository = repository
    }

    func execute(id: UUID) async throws -> RecipeRecord? {
        try await repository.fetchRecord(id: id)
    }
}

struct GenerateAIReviewDraftUseCase {
    private let repository: RecipeRecordRepository
    private let recipeGenerationRepository: RecipeGenerationRepository

    init(
        repository: RecipeRecordRepository,
        recipeGenerationRepository: RecipeGenerationRepository
    ) {
        self.repository = repository
        self.recipeGenerationRepository = recipeGenerationRepository
    }

    func execute(
        recordID: UUID,
        stepPreviews: [StepPreview],
        requestID: UUID = UUID(),
        updatedAt: Date = Date()
    ) async throws -> RecipeDraft {
        var record = try await requiredRecord(id: recordID, repository: repository)
        guard record.stepPreviews == stepPreviews else {
            throw RecipeRecordUseCaseError.stepPreviewSnapshotMismatch
        }
        try record.beginAIProcessing(requestID: requestID, updatedAt: updatedAt)
        try await repository.saveRecord(record)

        do {
            let draft = try await recipeGenerationRepository.generateRecipeDraft(
                from: .stepPreviews(stepPreviews)
            )
            var lockedRecord = try await requiredRecord(id: recordID, repository: repository)
            try lockedRecord.finishAIProcessing(with: draft, updatedAt: updatedAt)
            try await repository.saveRecord(lockedRecord)
            return draft
        } catch {
            await unlockSnapshotAfterFailure(recordID: recordID, updatedAt: updatedAt)
            throw error
        }
    }

    private func unlockSnapshotAfterFailure(recordID: UUID, updatedAt: Date) async {
        guard var record = try? await repository.fetchRecord(id: recordID),
              record.lifecycleState == .draftStepPreview,
              record.isAISnapshotLocked else {
            return
        }

        try? record.failAIProcessing(updatedAt: updatedAt)
        try? await repository.saveRecord(record)
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
