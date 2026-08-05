import Foundation

enum RecipePersistenceMapper {
    static func makePersistentRecipe(from recipe: Recipe) -> PersistentRecipe {
        PersistentRecipe(
            id: recipe.id,
            title: recipe.title,
            ingredients: makePersistentIngredients(from: recipe.ingredients),
            steps: makePersistentSteps(from: recipe.steps),
            memo: recipe.memo,
            estimatedTime: recipe.estimatedTime,
            sourceRawValue: recipe.source.rawValue,
            syncStatusRawValue: recipe.syncStatus.rawValue,
            ownerId: recipe.ownerId,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt,
            lifecycleStateRawValue: RecipeLifecycleState.completed.rawValue
        )
    }

    static func update(_ persistentRecipe: PersistentRecipe, from recipe: Recipe) {
        persistentRecipe.title = recipe.title
        persistentRecipe.ingredients = makePersistentIngredients(from: recipe.ingredients)
        persistentRecipe.steps = makePersistentSteps(from: recipe.steps)
        persistentRecipe.memo = recipe.memo
        persistentRecipe.estimatedTime = recipe.estimatedTime
        persistentRecipe.sourceRawValue = recipe.source.rawValue
        persistentRecipe.syncStatusRawValue = recipe.syncStatus.rawValue
        persistentRecipe.ownerId = recipe.ownerId
        persistentRecipe.createdAt = recipe.createdAt
        persistentRecipe.updatedAt = recipe.updatedAt
        persistentRecipe.lifecycleStateRawValue = RecipeLifecycleState.completed.rawValue
        persistentRecipe.stepPreviewsData = nil
        persistentRecipe.hasReviewDraft = false
        persistentRecipe.aiRequestID = nil
        persistentRecipe.isAISnapshotLocked = false
    }

    static func makeRecipe(from persistentRecipe: PersistentRecipe) -> Recipe {
        Recipe(
            id: persistentRecipe.id,
            title: persistentRecipe.title,
            ingredients: persistentRecipe.ingredients
                .sorted { $0.order < $1.order }
                .map(makeIngredient),
            steps: persistentRecipe.steps
                .sorted { $0.order < $1.order }
                .map(makeRecipeStep),
            memo: persistentRecipe.memo,
            estimatedTime: persistentRecipe.estimatedTime,
            source: RecipeSource(rawValue: persistentRecipe.sourceRawValue) ?? .voiceLog,
            syncStatus: SyncStatus(rawValue: persistentRecipe.syncStatusRawValue) ?? .localOnly,
            ownerId: persistentRecipe.ownerId,
            createdAt: persistentRecipe.createdAt,
            updatedAt: persistentRecipe.updatedAt
        )
    }

    static func makePersistentRecord(from record: RecipeRecord) throws -> PersistentRecipe {
        let persistentRecipe: PersistentRecipe

        switch record.lifecycleState {
        case .draftStepPreview:
            persistentRecipe = makeEmptyPersistentRecipe(id: record.id, createdAt: record.createdAt, updatedAt: record.updatedAt)
        case .draftAIReview:
            guard let draft = record.reviewDraft else {
                throw RecipePersistenceMappingError.missingReviewDraft(record.id)
            }
            persistentRecipe = makePersistentRecipe(from: draft, id: record.id, createdAt: record.createdAt, updatedAt: record.updatedAt)
        case .completed:
            guard let recipe = record.completedRecipe else {
                throw RecipePersistenceMappingError.missingCompletedRecipe(record.id)
            }
            guard recipe.id == record.id else {
                throw RecipePersistenceMappingError.mismatchedIdentifier(expected: record.id, actual: recipe.id)
            }
            persistentRecipe = makePersistentRecipe(from: recipe)
        }

        try updateLifecycleFields(persistentRecipe, from: record)
        return persistentRecipe
    }

    static func update(_ persistentRecipe: PersistentRecipe, from record: RecipeRecord) throws {
        switch record.lifecycleState {
        case .draftStepPreview:
            clearRecipeFields(persistentRecipe)
        case .draftAIReview:
            guard let draft = record.reviewDraft else {
                throw RecipePersistenceMappingError.missingReviewDraft(record.id)
            }
            updateRecipeFields(persistentRecipe, from: draft)
        case .completed:
            guard let recipe = record.completedRecipe else {
                throw RecipePersistenceMappingError.missingCompletedRecipe(record.id)
            }
            guard recipe.id == record.id else {
                throw RecipePersistenceMappingError.mismatchedIdentifier(expected: record.id, actual: recipe.id)
            }
            updateRecipeFields(persistentRecipe, from: recipe)
        }

        persistentRecipe.createdAt = record.createdAt
        persistentRecipe.updatedAt = record.updatedAt
        try updateLifecycleFields(persistentRecipe, from: record)
    }

    static func makeRecord(from persistentRecipe: PersistentRecipe) throws -> RecipeRecord {
        let lifecycleState = RecipeLifecycleState(rawValue: persistentRecipe.lifecycleStateRawValue) ?? .completed
        let stepPreviews = try decodeStepPreviews(persistentRecipe.stepPreviewsData)

        switch lifecycleState {
        case .draftStepPreview:
            return RecipeRecord(
                id: persistentRecipe.id,
                lifecycleState: lifecycleState,
                stepPreviews: stepPreviews,
                reviewDraft: nil,
                completedRecipe: nil,
                aiRequestID: persistentRecipe.aiRequestID,
                isAISnapshotLocked: persistentRecipe.isAISnapshotLocked,
                createdAt: persistentRecipe.createdAt,
                updatedAt: persistentRecipe.updatedAt
            )
        case .draftAIReview:
            let draft = RecipeDraft(
                title: persistentRecipe.title,
                ingredients: persistentRecipe.ingredients.sorted { $0.order < $1.order }.map(makeIngredient),
                steps: persistentRecipe.steps.sorted { $0.order < $1.order }.map(makeRecipeStep),
                memo: persistentRecipe.memo,
                estimatedTime: persistentRecipe.estimatedTime,
                source: RecipeSource(rawValue: persistentRecipe.sourceRawValue) ?? .voiceLog
            )
            return RecipeRecord(
                id: persistentRecipe.id,
                lifecycleState: lifecycleState,
                stepPreviews: stepPreviews,
                reviewDraft: draft,
                completedRecipe: nil,
                aiRequestID: persistentRecipe.aiRequestID,
                isAISnapshotLocked: persistentRecipe.isAISnapshotLocked,
                createdAt: persistentRecipe.createdAt,
                updatedAt: persistentRecipe.updatedAt
            )
        case .completed:
            return RecipeRecord(completedRecipe: makeRecipe(from: persistentRecipe))
        }
    }

    private static func makeEmptyPersistentRecipe(id: UUID, createdAt: Date, updatedAt: Date) -> PersistentRecipe {
        PersistentRecipe(
            id: id,
            title: "",
            ingredients: [],
            steps: [],
            memo: "",
            estimatedTime: nil,
            sourceRawValue: RecipeSource.voiceLog.rawValue,
            syncStatusRawValue: SyncStatus.localOnly.rawValue,
            ownerId: nil,
            createdAt: createdAt,
            updatedAt: updatedAt
        )
    }

    private static func makePersistentRecipe(
        from draft: RecipeDraft,
        id: UUID,
        createdAt: Date,
        updatedAt: Date
    ) -> PersistentRecipe {
        PersistentRecipe(
            id: id,
            title: draft.title,
            ingredients: makePersistentIngredients(from: draft.ingredients),
            steps: makePersistentSteps(from: draft.steps),
            memo: draft.memo,
            estimatedTime: draft.estimatedTime,
            sourceRawValue: draft.source.rawValue,
            syncStatusRawValue: SyncStatus.localOnly.rawValue,
            ownerId: nil,
            createdAt: createdAt,
            updatedAt: updatedAt
        )
    }

    private static func clearRecipeFields(_ persistentRecipe: PersistentRecipe) {
        persistentRecipe.title = ""
        persistentRecipe.ingredients = []
        persistentRecipe.steps = []
        persistentRecipe.memo = ""
        persistentRecipe.estimatedTime = nil
        persistentRecipe.sourceRawValue = RecipeSource.voiceLog.rawValue
        persistentRecipe.syncStatusRawValue = SyncStatus.localOnly.rawValue
        persistentRecipe.ownerId = nil
    }

    private static func updateRecipeFields(_ persistentRecipe: PersistentRecipe, from draft: RecipeDraft) {
        persistentRecipe.title = draft.title
        persistentRecipe.ingredients = makePersistentIngredients(from: draft.ingredients)
        persistentRecipe.steps = makePersistentSteps(from: draft.steps)
        persistentRecipe.memo = draft.memo
        persistentRecipe.estimatedTime = draft.estimatedTime
        persistentRecipe.sourceRawValue = draft.source.rawValue
        persistentRecipe.syncStatusRawValue = SyncStatus.localOnly.rawValue
        persistentRecipe.ownerId = nil
    }

    private static func updateRecipeFields(_ persistentRecipe: PersistentRecipe, from recipe: Recipe) {
        persistentRecipe.title = recipe.title
        persistentRecipe.ingredients = makePersistentIngredients(from: recipe.ingredients)
        persistentRecipe.steps = makePersistentSteps(from: recipe.steps)
        persistentRecipe.memo = recipe.memo
        persistentRecipe.estimatedTime = recipe.estimatedTime
        persistentRecipe.sourceRawValue = recipe.source.rawValue
        persistentRecipe.syncStatusRawValue = recipe.syncStatus.rawValue
        persistentRecipe.ownerId = recipe.ownerId
    }

    private static func updateLifecycleFields(_ persistentRecipe: PersistentRecipe, from record: RecipeRecord) throws {
        persistentRecipe.lifecycleStateRawValue = record.lifecycleState.rawValue
        persistentRecipe.stepPreviewsData = try encodeStepPreviews(record.stepPreviews)
        persistentRecipe.hasReviewDraft = record.reviewDraft != nil
        persistentRecipe.aiRequestID = record.aiRequestID
        persistentRecipe.isAISnapshotLocked = record.isAISnapshotLocked
    }

    private static func encodeStepPreviews(_ stepPreviews: [StepPreview]) throws -> Data? {
        guard !stepPreviews.isEmpty else { return nil }
        let values = stepPreviews.map(PersistedStepPreview.init)
        return try JSONEncoder().encode(values)
    }

    private static func decodeStepPreviews(_ data: Data?) throws -> [StepPreview] {
        guard let data else { return [] }
        return try JSONDecoder().decode([PersistedStepPreview].self, from: data).map(\.domainModel)
    }

    private static func makePersistentIngredients(from ingredients: [Ingredient]) -> [PersistentIngredient] {
        ingredients.enumerated().map { index, ingredient in
            PersistentIngredient(
                id: ingredient.id,
                name: ingredient.name,
                amountText: ingredient.amountText,
                order: index
            )
        }
    }

    private static func makePersistentSteps(from steps: [RecipeStep]) -> [PersistentRecipeStep] {
        steps.map { step in
            PersistentRecipeStep(
                id: step.id,
                order: step.order,
                text: step.text,
                duration: step.duration,
                note: step.note
            )
        }
    }

    private static func makeIngredient(from persistentIngredient: PersistentIngredient) -> Ingredient {
        Ingredient(
            id: persistentIngredient.id,
            name: persistentIngredient.name,
            amountText: persistentIngredient.amountText
        )
    }

    private static func makeRecipeStep(from persistentStep: PersistentRecipeStep) -> RecipeStep {
        RecipeStep(
            id: persistentStep.id,
            order: persistentStep.order,
            text: persistentStep.text,
            duration: persistentStep.duration,
            note: persistentStep.note
        )
    }
}

enum RecipePersistenceMappingError: Error, Equatable {
    case missingReviewDraft(UUID)
    case missingCompletedRecipe(UUID)
    case mismatchedIdentifier(expected: UUID, actual: UUID)
}

private struct PersistedStepPreview: Codable {
    let id: UUID
    let order: Int
    let transcript: String
    let createdAt: Date

    init(_ stepPreview: StepPreview) {
        id = stepPreview.id
        order = stepPreview.order
        transcript = stepPreview.transcript
        createdAt = stepPreview.createdAt
    }

    var domainModel: StepPreview {
        StepPreview(id: id, order: order, transcript: transcript, createdAt: createdAt)
    }
}
