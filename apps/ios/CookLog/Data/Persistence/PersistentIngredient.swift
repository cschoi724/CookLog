import Foundation
import SwiftData

@Model
final class PersistentIngredient {
    var id: UUID
    var name: String
    var amountText: String?
    var order: Int

    init(
        id: UUID,
        name: String,
        amountText: String?,
        order: Int
    ) {
        self.id = id
        self.name = name
        self.amountText = amountText
        self.order = order
    }
}
