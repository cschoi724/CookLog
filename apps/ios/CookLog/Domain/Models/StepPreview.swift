import Foundation

struct StepPreview: Identifiable, Equatable {
    let id: UUID
    var order: Int
    var transcript: String
    var createdAt: Date

    init(
        id: UUID = UUID(),
        order: Int,
        transcript: String,
        createdAt: Date = Date()
    ) {
        self.id = id
        self.order = order
        self.transcript = transcript
        self.createdAt = createdAt
    }
}
