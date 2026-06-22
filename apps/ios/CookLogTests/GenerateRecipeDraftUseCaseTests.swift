import XCTest
@testable import CookLog

final class GenerateRecipeDraftUseCaseTests: XCTestCase {
    func testExecuteGeneratesDraftFromStepPreviewsUsingMockAI() async throws {
        let dataSource = MockRecipeAIDataSource()
        let repository = DefaultRecipeGenerationRepository(aiDataSource: dataSource)
        let useCase = GenerateRecipeDraftUseCase(recipeGenerationRepository: repository)
        let input = RecipeGenerationInput.stepPreviews([
            StepPreview(order: 2, transcript: "양파 반 개를 넣었어"),
            StepPreview(order: 1, transcript: "삼겹살을 넣고 볶았어")
        ])

        let draft = try await useCase.execute(from: input)

        XCTAssertEqual(draft.title, "나의 요리 기록")
        XCTAssertEqual(draft.source, .voiceLog)
        XCTAssertEqual(draft.steps.map(\.text), [
            "삼겹살을 넣고 볶았어",
            "양파 반 개를 넣었어"
        ])
        XCTAssertEqual(draft.steps.map(\.order), [1, 2])
    }
}
