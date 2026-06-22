import Foundation

struct Ingredient: Identifiable, Equatable {
    let id: UUID
    var name: String
    var amountText: String?

    init(
        id: UUID = UUID(),
        name: String,
        amountText: String? = nil
    ) {
        self.id = id
        self.name = name
        self.amountText = amountText
    }
}
