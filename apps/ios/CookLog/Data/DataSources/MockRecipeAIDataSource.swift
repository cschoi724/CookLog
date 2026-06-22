import Foundation

struct MockRecipeAIDataSource: RecipeAIDataSource {
    func generateRecipeDraft(from input: RecipeGenerationInput) async throws -> RecipeDraft {
        let stepTexts = extractStepTexts(from: input)
        let steps = stepTexts.enumerated().map { index, text in
            RecipeStep(order: index + 1, text: text)
        }

        return RecipeDraft(
            title: "나의 요리 기록",
            ingredients: [
                Ingredient(name: "기록한 재료", amountText: "적당량")
            ],
            steps: steps,
            memo: "음성 기록을 바탕으로 만든 임시 레시피입니다.",
            estimatedTime: TimeInterval(max(steps.count * 5, 10) * 60),
            source: .voiceLog
        )
    }

    private func extractStepTexts(from input: RecipeGenerationInput) -> [String] {
        switch input {
        case .stepPreviews(let stepPreviews):
            return stepPreviews
                .sorted { $0.order < $1.order }
                .map(\.transcript)
        case .plainText(let text):
            return [text]
        case .importedText(_, let text):
            return [text]
        }
    }
}
