import XCTest
@testable import CookLog

@MainActor
final class AIReviewViewModelTests: XCTestCase {
    func testLoadDraftGeneratesDraftFromStepPreviews() async {
        let viewModel = makeViewModel()

        await viewModel.loadDraft()

        XCTAssertEqual(viewModel.title, "나의 요리 기록")
        XCTAssertEqual(viewModel.ingredients.map(\.name), ["기록한 재료"])
        XCTAssertEqual(viewModel.steps.map(\.text), [
            "삼겹살을 볶았어",
            "양파를 넣었어"
        ])
        XCTAssertEqual(viewModel.estimatedMinutesText, "10")
        XCTAssertNil(viewModel.errorMessage)
    }

    func testEditableDraftStateIsReflected() async {
        let viewModel = makeViewModel()

        await viewModel.loadDraft()
        viewModel.title = "수정한 레시피"
        viewModel.ingredients[0].name = "삼겹살"
        viewModel.ingredients[0].amountText = "200g"
        viewModel.steps[0].text = "삼겹살을 노릇하게 볶습니다."
        viewModel.estimatedMinutesText = "12"
        viewModel.memo = "중불 유지"

        XCTAssertEqual(viewModel.title, "수정한 레시피")
        XCTAssertEqual(viewModel.ingredients[0].name, "삼겹살")
        XCTAssertEqual(viewModel.ingredients[0].amountText, "200g")
        XCTAssertEqual(viewModel.steps[0].text, "삼겹살을 노릇하게 볶습니다.")
        XCTAssertEqual(viewModel.estimatedMinutesText, "12")
        XCTAssertEqual(viewModel.memo, "중불 유지")
    }

    func testSaveCreatesRecipeAndCallsSaveUseCase() async {
        let repository = SpyRecipeRepository()
        let viewModel = makeViewModel(recipeRepository: repository)

        await viewModel.loadDraft()
        viewModel.title = "저장할 레시피"
        viewModel.estimatedMinutesText = "15"

        let savedRecipe = await viewModel.saveRecipe()

        XCTAssertEqual(savedRecipe?.title, "저장할 레시피")
        XCTAssertEqual(savedRecipe?.estimatedTime, 15 * 60)
        XCTAssertEqual(repository.savedRecipes.first?.id, savedRecipe?.id)
    }

    func testLoadDraftSetsErrorMessageWhenGenerationFails() async {
        let repository = SpyRecipeRepository()
        let viewModel = AIReviewViewModel(
            stepPreviews: SampleStepPreviews.basic,
            generateRecipeDraftUseCase: GenerateRecipeDraftUseCase(
                recipeGenerationRepository: FailingRecipeGenerationRepository()
            ),
            saveRecipeUseCase: SaveRecipeUseCase(recipeRepository: repository)
        )

        await viewModel.loadDraft()

        XCTAssertEqual(viewModel.errorMessage, "AI 정리에 실패했습니다. 다시 시도해주세요.")
        XCTAssertTrue(viewModel.title.isEmpty)
    }

    private func makeViewModel(
        recipeRepository: SpyRecipeRepository = SpyRecipeRepository()
    ) -> AIReviewViewModel {
        AIReviewViewModel(
            stepPreviews: [
                StepPreview(order: 1, transcript: "삼겹살을 볶았어"),
                StepPreview(order: 2, transcript: "양파를 넣었어")
            ],
            generateRecipeDraftUseCase: GenerateRecipeDraftUseCase(
                recipeGenerationRepository: DefaultRecipeGenerationRepository(
                    aiDataSource: MockRecipeAIDataSource()
                )
            ),
            saveRecipeUseCase: SaveRecipeUseCase(recipeRepository: recipeRepository)
        )
    }
}

private final class SpyRecipeRepository: RecipeRepository {
    private(set) var savedRecipes: [Recipe] = []

    func fetchRecipes() async throws -> [Recipe] {
        savedRecipes
    }

    func fetchRecipe(id: UUID) async throws -> Recipe? {
        savedRecipes.first { $0.id == id }
    }

    func saveRecipe(_ recipe: Recipe) async throws {
        savedRecipes.append(recipe)
    }

    func deleteRecipe(id: UUID) async throws {
        savedRecipes.removeAll { $0.id == id }
    }
}

private struct FailingRecipeGenerationRepository: RecipeGenerationRepository {
    func generateRecipeDraft(from input: RecipeGenerationInput) async throws -> RecipeDraft {
        throw GenerationFailure()
    }
}

private struct GenerationFailure: Error {}
