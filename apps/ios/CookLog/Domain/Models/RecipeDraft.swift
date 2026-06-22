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
}
