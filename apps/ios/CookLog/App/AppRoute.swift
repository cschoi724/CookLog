import Foundation

enum AppRoute: Hashable {
    case recipeLibrary
    case cookingLog(recordID: UUID, stepPreviews: [StepPreview])
    case aiReview(recordID: UUID, stepPreviews: [StepPreview])
    case recipeDetail(UUID)
    case recipeEditor(UUID)
    case audioPlayer(UUID)

    init(_ destination: HomeRecordDestination) {
        switch destination {
        case .cookingLog(let recordID, let stepPreviews):
            self = .cookingLog(recordID: recordID, stepPreviews: stepPreviews)
        case .aiReview(let recordID, let stepPreviews):
            self = .aiReview(recordID: recordID, stepPreviews: stepPreviews)
        case .recipeDetail(let recordID):
            self = .recipeDetail(recordID)
        }
    }
}
