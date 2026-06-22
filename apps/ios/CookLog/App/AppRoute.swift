import Foundation

enum AppRoute: Hashable {
    case cookingLog
    case aiReview
    case recipeDetail(UUID)
    case audioPlayer(UUID)
}
