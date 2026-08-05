import Foundation

struct RecipeDraft: Equatable {
    var title: String
    var ingredients: [Ingredient]
    var steps: [RecipeStep]
    var memo: String
    var estimatedTime: TimeInterval?
    var source: RecipeSource

    init(
        title: String,
        ingredients: [Ingredient],
        steps: [RecipeStep],
        memo: String = "",
        estimatedTime: TimeInterval? = nil,
        source: RecipeSource = .voiceLog
    ) {
        self.title = title
        self.ingredients = ingredients
        self.steps = steps
        self.memo = memo
        self.estimatedTime = estimatedTime
        self.source = source
    }

    func makeRecipe(
        id: UUID,
        syncStatus: SyncStatus = .localOnly,
        ownerId: String? = nil,
        createdAt: Date,
        updatedAt: Date
    ) -> Recipe {
        Recipe(
            id: id,
            title: title,
            ingredients: ingredients,
            steps: steps,
            memo: memo,
            estimatedTime: estimatedTime,
            source: source,
            syncStatus: syncStatus,
            ownerId: ownerId,
            createdAt: createdAt,
            updatedAt: updatedAt
        )
    }
}

enum RecipeLifecycleState: String, Codable, Equatable {
    case draftStepPreview = "draft_step_preview"
    case draftAIReview = "draft_ai_review"
    case completed
}

enum RecipeRecordError: Error, Equatable {
    case invalidTransition(from: RecipeLifecycleState, to: RecipeLifecycleState)
    case stepPreviewSnapshotLocked
    case mismatchedIdentifier(expected: UUID, actual: UUID)
}

struct RecipeRecord: Identifiable, Equatable {
    let id: UUID
    private(set) var lifecycleState: RecipeLifecycleState
    private(set) var stepPreviews: [StepPreview]
    private(set) var reviewDraft: RecipeDraft?
    private(set) var completedRecipe: Recipe?
    private(set) var aiRequestID: UUID?
    private(set) var isAISnapshotLocked: Bool
    let createdAt: Date
    private(set) var updatedAt: Date

    init(
        id: UUID = UUID(),
        stepPreviews: [StepPreview] = [],
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.lifecycleState = .draftStepPreview
        self.stepPreviews = Self.normalized(stepPreviews)
        self.reviewDraft = nil
        self.completedRecipe = nil
        self.aiRequestID = nil
        self.isAISnapshotLocked = false
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }

    init(completedRecipe: Recipe) {
        self.id = completedRecipe.id
        self.lifecycleState = .completed
        self.stepPreviews = []
        self.reviewDraft = nil
        self.completedRecipe = completedRecipe
        self.aiRequestID = nil
        self.isAISnapshotLocked = false
        self.createdAt = completedRecipe.createdAt
        self.updatedAt = completedRecipe.updatedAt
    }

    init(
        id: UUID,
        lifecycleState: RecipeLifecycleState,
        stepPreviews: [StepPreview],
        reviewDraft: RecipeDraft?,
        completedRecipe: Recipe?,
        aiRequestID: UUID?,
        isAISnapshotLocked: Bool,
        createdAt: Date,
        updatedAt: Date
    ) {
        self.id = id
        self.lifecycleState = lifecycleState
        self.stepPreviews = Self.normalized(stepPreviews)
        self.reviewDraft = reviewDraft
        self.completedRecipe = completedRecipe
        self.aiRequestID = aiRequestID
        self.isAISnapshotLocked = isAISnapshotLocked
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }

    mutating func replaceStepPreviews(_ stepPreviews: [StepPreview], updatedAt: Date = Date()) throws {
        guard lifecycleState == .draftStepPreview else {
            throw RecipeRecordError.invalidTransition(from: lifecycleState, to: .draftStepPreview)
        }
        guard !isAISnapshotLocked else {
            throw RecipeRecordError.stepPreviewSnapshotLocked
        }

        self.stepPreviews = Self.normalized(stepPreviews)
        self.updatedAt = updatedAt
    }

    mutating func beginAIProcessing(requestID: UUID, updatedAt: Date = Date()) throws {
        guard lifecycleState == .draftStepPreview else {
            throw RecipeRecordError.invalidTransition(from: lifecycleState, to: .draftAIReview)
        }
        guard !isAISnapshotLocked else {
            throw RecipeRecordError.stepPreviewSnapshotLocked
        }

        aiRequestID = requestID
        isAISnapshotLocked = true
        self.updatedAt = updatedAt
    }

    mutating func finishAIProcessing(with draft: RecipeDraft, updatedAt: Date = Date()) throws {
        guard lifecycleState == .draftStepPreview else {
            throw RecipeRecordError.invalidTransition(from: lifecycleState, to: .draftAIReview)
        }

        lifecycleState = .draftAIReview
        reviewDraft = draft
        aiRequestID = nil
        isAISnapshotLocked = false
        self.updatedAt = updatedAt
    }

    mutating func failAIProcessing(updatedAt: Date = Date()) throws {
        guard lifecycleState == .draftStepPreview else {
            throw RecipeRecordError.invalidTransition(from: lifecycleState, to: .draftStepPreview)
        }

        aiRequestID = nil
        isAISnapshotLocked = false
        self.updatedAt = updatedAt
    }

    mutating func saveReviewDraft(_ draft: RecipeDraft, updatedAt: Date = Date()) throws {
        guard lifecycleState == .draftAIReview else {
            throw RecipeRecordError.invalidTransition(from: lifecycleState, to: .draftAIReview)
        }

        reviewDraft = draft
        self.updatedAt = updatedAt
    }

    mutating func complete(with recipe: Recipe, updatedAt: Date = Date()) throws {
        guard lifecycleState == .draftAIReview else {
            throw RecipeRecordError.invalidTransition(from: lifecycleState, to: .completed)
        }
        guard recipe.id == id else {
            throw RecipeRecordError.mismatchedIdentifier(expected: id, actual: recipe.id)
        }

        var completed = recipe
        completed.updatedAt = updatedAt
        lifecycleState = .completed
        stepPreviews = []
        reviewDraft = nil
        completedRecipe = completed
        aiRequestID = nil
        isAISnapshotLocked = false
        self.updatedAt = updatedAt
    }

    private static func normalized(_ stepPreviews: [StepPreview]) -> [StepPreview] {
        stepPreviews
            .sorted {
                if $0.order == $1.order {
                    return $0.createdAt < $1.createdAt
                }
                return $0.order < $1.order
            }
            .enumerated()
            .map { index, stepPreview in
                var normalizedStep = stepPreview
                normalizedStep.order = index + 1
                return normalizedStep
            }
    }
}
