import Foundation
import SwiftData

@Model
final class PersistentRecipe {
    @Attribute(.unique) var id: UUID
    var title: String
    @Relationship(deleteRule: .cascade) var ingredients: [PersistentIngredient]
    @Relationship(deleteRule: .cascade) var steps: [PersistentRecipeStep]
    var memo: String
    var estimatedTime: TimeInterval?
    var sourceRawValue: String
    var syncStatusRawValue: String
    var ownerId: String?
    var createdAt: Date
    var updatedAt: Date
    var lifecycleStateRawValue: String = "completed"
    var stepPreviewsData: Data?
    var hasReviewDraft: Bool = false
    var aiRequestID: UUID?
    var isAISnapshotLocked: Bool = false

    init(
        id: UUID,
        title: String,
        ingredients: [PersistentIngredient],
        steps: [PersistentRecipeStep],
        memo: String,
        estimatedTime: TimeInterval?,
        sourceRawValue: String,
        syncStatusRawValue: String,
        ownerId: String?,
        createdAt: Date,
        updatedAt: Date,
        lifecycleStateRawValue: String = "completed",
        stepPreviewsData: Data? = nil,
        hasReviewDraft: Bool = false,
        aiRequestID: UUID? = nil,
        isAISnapshotLocked: Bool = false
    ) {
        self.id = id
        self.title = title
        self.ingredients = ingredients
        self.steps = steps
        self.memo = memo
        self.estimatedTime = estimatedTime
        self.sourceRawValue = sourceRawValue
        self.syncStatusRawValue = syncStatusRawValue
        self.ownerId = ownerId
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.lifecycleStateRawValue = lifecycleStateRawValue
        self.stepPreviewsData = stepPreviewsData
        self.hasReviewDraft = hasReviewDraft
        self.aiRequestID = aiRequestID
        self.isAISnapshotLocked = isAISnapshotLocked
    }
}
