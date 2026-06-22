import XCTest
@testable import CookLog

@MainActor
final class AudioPlayerViewModelTests: XCTestCase {
    func testLoadRecipeInitializesFirstStep() async {
        let recipe = SampleRecipes.soyPorkBelly
        let viewModel = makeViewModel(recipe: recipe)

        await viewModel.loadRecipe()

        XCTAssertEqual(viewModel.recipe, recipe)
        XCTAssertEqual(viewModel.currentStepIndex, 0)
        XCTAssertEqual(viewModel.currentStep, recipe.steps[0])
        XCTAssertTrue(viewModel.canPlay)
        XCTAssertFalse(viewModel.canMoveToPreviousStep)
        XCTAssertTrue(viewModel.canMoveToNextStep)
    }

    func testMoveToNextStep() async {
        let viewModel = makeViewModel(recipe: SampleRecipes.soyPorkBelly)

        await viewModel.loadRecipe()
        viewModel.moveToNextStep()

        XCTAssertEqual(viewModel.currentStepIndex, 1)
        XCTAssertTrue(viewModel.canMoveToPreviousStep)
    }

    func testMoveToPreviousStep() async {
        let viewModel = makeViewModel(recipe: SampleRecipes.soyPorkBelly)

        await viewModel.loadRecipe()
        viewModel.moveToNextStep()
        viewModel.moveToPreviousStep()

        XCTAssertEqual(viewModel.currentStepIndex, 0)
        XCTAssertFalse(viewModel.canMoveToPreviousStep)
    }

    func testCannotMoveBeforeFirstStep() async {
        let viewModel = makeViewModel(recipe: SampleRecipes.soyPorkBelly)

        await viewModel.loadRecipe()
        viewModel.moveToPreviousStep()

        XCTAssertEqual(viewModel.currentStepIndex, 0)
        XCTAssertFalse(viewModel.canMoveToPreviousStep)
    }

    func testCannotMoveAfterLastStep() async {
        let viewModel = makeViewModel(recipe: SampleRecipes.soyPorkBelly)

        await viewModel.loadRecipe()
        viewModel.moveToNextStep()
        viewModel.moveToNextStep()
        viewModel.moveToNextStep()

        XCTAssertEqual(viewModel.currentStepIndex, 2)
        XCTAssertFalse(viewModel.canMoveToNextStep)
    }

    func testPlayReplayAndStopCallAudioGuideService() async {
        let audioGuideService = SpyAudioGuideService()
        let viewModel = makeViewModel(
            recipe: SampleRecipes.soyPorkBelly,
            audioGuideService: audioGuideService
        )

        await viewModel.loadRecipe()
        await viewModel.playCurrentStep()
        await viewModel.replayCurrentStep()
        viewModel.stop()

        XCTAssertEqual(audioGuideService.playedSteps.count, 2)
        XCTAssertEqual(audioGuideService.playedSteps.first, SampleRecipes.soyPorkBelly.steps[0])
        XCTAssertEqual(audioGuideService.stopCallCount, 1)
        XCTAssertFalse(viewModel.isPlaying)
    }

    func testEmptyStepsRecipeIsNotPlayable() async {
        let recipe = Recipe(
            title: "단계 없는 레시피",
            ingredients: [],
            steps: []
        )
        let viewModel = makeViewModel(recipe: recipe)

        await viewModel.loadRecipe()

        XCTAssertTrue(viewModel.isEmptySteps)
        XCTAssertFalse(viewModel.canPlay)
        XCTAssertNil(viewModel.currentStep)
    }

    func testLoadRecipeSetsErrorMessageWhenFetchFails() async {
        let audioGuideService = SpyAudioGuideService()
        let viewModel = AudioPlayerViewModel(
            recipeID: UUID(),
            fetchRecipeUseCase: FetchRecipeUseCase(
                recipeRepository: FailingAudioRecipeRepository()
            ),
            playRecipeStepUseCase: PlayRecipeStepUseCase(audioGuideService: audioGuideService),
            audioGuideService: audioGuideService
        )

        await viewModel.loadRecipe()

        XCTAssertNil(viewModel.recipe)
        XCTAssertEqual(viewModel.errorMessage, "오디오 가이드를 불러오지 못했습니다. 다시 시도해주세요.")
        XCTAssertFalse(viewModel.canPlay)
    }

    private func makeViewModel(
        recipe: Recipe,
        audioGuideService: SpyAudioGuideService = SpyAudioGuideService()
    ) -> AudioPlayerViewModel {
        AudioPlayerViewModel(
            recipeID: recipe.id,
            fetchRecipeUseCase: FetchRecipeUseCase(
                recipeRepository: StubAudioRecipeRepository(recipes: [recipe])
            ),
            playRecipeStepUseCase: PlayRecipeStepUseCase(audioGuideService: audioGuideService),
            audioGuideService: audioGuideService
        )
    }
}

private final class SpyAudioGuideService: AudioGuideService {
    private(set) var playedSteps: [RecipeStep] = []
    private(set) var stopCallCount = 0
    private(set) var pauseCallCount = 0

    func play(step: RecipeStep) async {
        playedSteps.append(step)
    }

    func stop() {
        stopCallCount += 1
    }

    func pause() {
        pauseCallCount += 1
    }
}

private final class StubAudioRecipeRepository: RecipeRepository {
    private let recipes: [Recipe]

    init(recipes: [Recipe]) {
        self.recipes = recipes
    }

    func fetchRecipes() async throws -> [Recipe] {
        recipes
    }

    func fetchRecipe(id: UUID) async throws -> Recipe? {
        recipes.first { $0.id == id }
    }

    func saveRecipe(_ recipe: Recipe) async throws {}

    func deleteRecipe(id: UUID) async throws {}
}

private struct FailingAudioRecipeRepository: RecipeRepository {
    func fetchRecipes() async throws -> [Recipe] {
        throw AudioFetchFailure()
    }

    func fetchRecipe(id: UUID) async throws -> Recipe? {
        throw AudioFetchFailure()
    }

    func saveRecipe(_ recipe: Recipe) async throws {}

    func deleteRecipe(id: UUID) async throws {}
}

private struct AudioFetchFailure: Error {}
