import Foundation

struct Recipe: Identifiable, Equatable {
    let id: UUID
    var title: String
    var ingredients: [Ingredient]
    var steps: [RecipeStep]
    var memo: String
    var estimatedTime: TimeInterval?
    var source: RecipeSource
    var syncStatus: SyncStatus
    var ownerId: String?
    var createdAt: Date
    var updatedAt: Date

    init(
        id: UUID = UUID(),
        title: String,
        ingredients: [Ingredient],
        steps: [RecipeStep],
        memo: String = "",
        estimatedTime: TimeInterval? = nil,
        source: RecipeSource = .voiceLog,
        syncStatus: SyncStatus = .localOnly,
        ownerId: String? = nil,
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.title = title
        self.ingredients = ingredients
        self.steps = steps
        self.memo = memo
        self.estimatedTime = estimatedTime
        self.source = source
        self.syncStatus = syncStatus
        self.ownerId = ownerId
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}
