import Foundation

struct CookingLogSession: Identifiable, Equatable {
    let id: UUID
    var stepPreviews: [StepPreview]
    var createdAt: Date
    var updatedAt: Date

    init(
        id: UUID = UUID(),
        stepPreviews: [StepPreview] = [],
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.stepPreviews = stepPreviews
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}
