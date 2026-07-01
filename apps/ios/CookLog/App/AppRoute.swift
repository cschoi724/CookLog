import Foundation

enum AppRoute: Hashable {
    case cookingLog
    case aiReview([StepPreview])
    case recipeDetail(UUID)
    case audioPlayer(UUID)
}
