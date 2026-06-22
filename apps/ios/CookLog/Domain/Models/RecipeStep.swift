import Foundation

struct RecipeStep: Identifiable, Equatable {
    let id: UUID
    var order: Int
    var text: String
    var duration: TimeInterval?
    var note: String?

    init(
        id: UUID = UUID(),
        order: Int,
        text: String,
        duration: TimeInterval? = nil,
        note: String? = nil
    ) {
        self.id = id
        self.order = order
        self.text = text
        self.duration = duration
        self.note = note
    }
}
