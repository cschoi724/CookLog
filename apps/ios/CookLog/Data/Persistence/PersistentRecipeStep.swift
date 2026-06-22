import Foundation
import SwiftData

@Model
final class PersistentRecipeStep {
    var id: UUID
    var order: Int
    var text: String
    var duration: TimeInterval?
    var note: String?

    init(
        id: UUID,
        order: Int,
        text: String,
        duration: TimeInterval?,
        note: String?
    ) {
        self.id = id
        self.order = order
        self.text = text
        self.duration = duration
        self.note = note
    }
}
