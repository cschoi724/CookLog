import Foundation

enum RecipeGenerationInput: Equatable {
    case stepPreviews([StepPreview])
    case plainText(String)
    case importedText(source: RecipeSource, text: String)
}
