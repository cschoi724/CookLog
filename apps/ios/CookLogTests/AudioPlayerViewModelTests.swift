import SwiftUI
import UIKit
import XCTest
@testable import CookLog

@MainActor
final class AudioPlayerViewModelTests: XCTestCase {
    func testPlayerRendersRequiredViewportAndColorSchemeMatrix() async throws {
        let matrix: [(name: String, size: CGSize, style: UIUserInterfaceStyle)] = [
            ("390x844-light", CGSize(width: 390, height: 844), .light),
            ("390x844-dark", CGSize(width: 390, height: 844), .dark),
            ("375x667-light", CGSize(width: 375, height: 667), .light),
            ("375x667-dark", CGSize(width: 375, height: 667), .dark)
        ]

        for item in matrix {
            let environment = AppEnvironment.mock()
            let viewModel = AudioPlayerViewModel(
                recipeID: SampleRecipes.soyPorkBelly.id,
                fetchRecipeUseCase: environment.fetchRecipeUseCase,
                playRecipeStepUseCase: environment.playRecipeStepUseCase,
                audioGuideService: environment.audioGuideService
            )
            await viewModel.loadRecipe()

            let host = UIHostingController(
                rootView: NavigationStack {
                    AudioPlayerView(viewModel: viewModel)
                }
            )
            host.overrideUserInterfaceStyle = item.style
            let window = UIWindow(frame: CGRect(origin: .zero, size: item.size))
            window.rootViewController = host
            window.overrideUserInterfaceStyle = item.style
            window.makeKeyAndVisible()
            host.view.setNeedsLayout()
            host.view.layoutIfNeeded()
            try await Task.sleep(nanoseconds: 50_000_000)

            let renderer = UIGraphicsImageRenderer(size: item.size)
            let image = renderer.image { context in
                window.layer.render(in: context.cgContext)
            }

            XCTAssertEqual(image.size, item.size)
            XCTAssertFalse(image.isUniformColor, "\(item.name) 렌더링이 빈 단색 화면입니다.")
            let attachment = XCTAttachment(image: image)
            attachment.name = "T-20260805-006-player-\(item.name)"
            attachment.lifetime = .keepAlways
            add(attachment)
            window.isHidden = true
        }
    }

    func testLoadRecipeInitializesFirstStepWithoutAutomaticPlaybackOrHandsfree() async {
        let service = SpyAudioGuideService()
        let recipe = SampleRecipes.soyPorkBelly
        let viewModel = makeViewModel(recipe: recipe, audioGuideService: service)

        await viewModel.loadRecipe()

        XCTAssertEqual(viewModel.recipe, recipe)
        XCTAssertEqual(viewModel.currentStepIndex, 0)
        XCTAssertEqual(viewModel.currentStep, recipe.steps[0])
        XCTAssertTrue(viewModel.canPlay)
        XCTAssertFalse(viewModel.isPlaying)
        XCTAssertFalse(viewModel.isHandsfreeActive)
        XCTAssertEqual(service.prepareCallCount, 1)
        XCTAssertTrue(service.playedSteps.isEmpty)
    }

    func testPreviousAndNextActionsUseSameReducerAndPauseAtDestination() async {
        let service = SpyAudioGuideService()
        let viewModel = makeViewModel(audioGuideService: service)

        await viewModel.loadRecipe()
        await viewModel.send(.resume)
        await viewModel.send(.next)

        XCTAssertEqual(viewModel.currentStepIndex, 1)
        XCTAssertFalse(viewModel.isPlaying)
        XCTAssertEqual(service.stopCallCount, 2)

        await viewModel.send(.previous)

        XCTAssertEqual(viewModel.currentStepIndex, 0)
        XCTAssertFalse(viewModel.canMoveToPreviousStep)
        XCTAssertFalse(viewModel.isPlaying)
    }

    func testFirstAndLastBoundariesPreserveIndexAndPause() async {
        let service = SpyAudioGuideService()
        let viewModel = makeViewModel(audioGuideService: service)

        await viewModel.loadRecipe()
        await viewModel.send(.previous)

        XCTAssertEqual(viewModel.currentStepIndex, 0)
        XCTAssertEqual(viewModel.feedbackMessage, "첫 단계예요. 이전 단계는 없습니다.")

        while viewModel.canMoveToNextStep {
            await viewModel.send(.next)
        }
        let lastIndex = viewModel.currentStepIndex
        await viewModel.send(.next)

        XCTAssertEqual(viewModel.currentStepIndex, lastIndex)
        XCTAssertEqual(viewModel.feedbackMessage, "마지막 단계예요. 다음 단계는 없습니다.")
        XCTAssertFalse(viewModel.isPlaying)
    }

    func testPauseResumeReplayAndIngredientsActionsPreserveExpectedState() async {
        let service = SpyAudioGuideService()
        let recipe = SampleRecipes.soyPorkBelly
        let viewModel = makeViewModel(recipe: recipe, audioGuideService: service)

        await viewModel.loadRecipe()
        await viewModel.send(.resume)
        await viewModel.send(.pause)
        await viewModel.send(.resume)
        await viewModel.send(.replay)
        let indexBeforeIngredients = viewModel.currentStepIndex
        await viewModel.send(.readIngredients)

        XCTAssertEqual(service.playedSteps.count, 2)
        XCTAssertEqual(service.resumeCallCount, 1)
        XCTAssertEqual(service.playedIngredientLists, [recipe.ingredients])
        XCTAssertEqual(viewModel.currentStepIndex, indexBeforeIngredients)
        XCTAssertFalse(viewModel.isPlaying)
    }

    func testHandsfreeExitAndUncertainCommandPreservePlaybackAndStep() async {
        let service = SpyAudioGuideService()
        let viewModel = makeViewModel(audioGuideService: service)

        await viewModel.loadRecipe()
        await viewModel.send(.resume)
        viewModel.startHandsfree()
        let index = viewModel.currentStepIndex
        let pauseCount = service.pauseCallCount

        viewModel.receiveUncertainCommand()
        await viewModel.send(.endHandsfree)

        XCTAssertEqual(viewModel.currentStepIndex, index)
        XCTAssertTrue(viewModel.isPlaying)
        XCTAssertFalse(viewModel.isHandsfreeActive)
        XCTAssertEqual(service.pauseCallCount, pauseCount)
    }

    func testAudioInterruptionPausesAndRequiresManualResume() async {
        let service = SpyAudioGuideService()
        let viewModel = makeViewModel(audioGuideService: service)

        await viewModel.loadRecipe()
        await viewModel.send(.resume)
        viewModel.startHandsfree()
        viewModel.handleAudioInterruption()

        XCTAssertFalse(viewModel.isPlaying)
        XCTAssertFalse(viewModel.isHandsfreeActive)
        XCTAssertNotNil(viewModel.interruptionMessage)

        await viewModel.send(.resume)

        XCTAssertTrue(viewModel.isPlaying)
        XCTAssertFalse(viewModel.isHandsfreeActive)
        XCTAssertNil(viewModel.interruptionMessage)
    }

    func testBackgroundOrLockPausesAndDoesNotReactivateHandsfree() async {
        let viewModel = makeViewModel()

        await viewModel.loadRecipe()
        await viewModel.send(.resume)
        viewModel.startHandsfree()
        viewModel.handleBackgroundOrLock()

        XCTAssertFalse(viewModel.isPlaying)
        XCTAssertFalse(viewModel.isHandsfreeActive)
        XCTAssertNotNil(viewModel.interruptionMessage)
    }

    func testStopOnDisappearStopsPlaybackAndHandsfree() async {
        let service = SpyAudioGuideService()
        let viewModel = makeViewModel(audioGuideService: service)

        await viewModel.loadRecipe()
        await viewModel.send(.resume)
        viewModel.startHandsfree()
        viewModel.stopOnDisappear()

        XCTAssertFalse(viewModel.isPlaying)
        XCTAssertFalse(viewModel.isHandsfreeActive)
        XCTAssertEqual(service.stopCallCount, 2)
    }

    func testEmptyStepsRecipeIsNotPlayable() async {
        let recipe = Recipe(title: "단계 없는 레시피", ingredients: [], steps: [])
        let viewModel = makeViewModel(recipe: recipe)

        await viewModel.loadRecipe()

        XCTAssertTrue(viewModel.isEmptySteps)
        XCTAssertFalse(viewModel.canPlay)
        XCTAssertFalse(viewModel.isNotFound)
    }

    func testMissingRecipeUsesNotFoundSubtype() async {
        let viewModel = makeViewModel(recipes: [])

        await viewModel.loadRecipe()

        XCTAssertTrue(viewModel.isNotFound)
        XCTAssertNil(viewModel.errorMessage)
        XCTAssertFalse(viewModel.canPlay)
    }

    func testLoadRecipeSetsErrorAndStopsWhenFetchFails() async {
        let service = SpyAudioGuideService()
        let viewModel = AudioPlayerViewModel(
            recipeID: UUID(),
            fetchRecipeUseCase: FetchRecipeUseCase(recipeRepository: FailingAudioRecipeRepository()),
            playRecipeStepUseCase: PlayRecipeStepUseCase(audioGuideService: service),
            audioGuideService: service
        )

        await viewModel.loadRecipe()

        XCTAssertNil(viewModel.recipe)
        XCTAssertEqual(viewModel.errorMessage, "오디오 가이드를 불러오지 못했습니다. 다시 시도해주세요.")
        XCTAssertFalse(viewModel.canPlay)
        XCTAssertEqual(service.stopCallCount, 1)
    }

    func testPreparationFailureUsesPlayerErrorWithoutAutomaticPlayback() async {
        let service = SpyAudioGuideService(preparationError: AudioPreparationFailure())
        let viewModel = makeViewModel(audioGuideService: service)

        await viewModel.loadRecipe()

        XCTAssertEqual(viewModel.errorMessage, "음성 재생을 준비하지 못했습니다. 다시 시도해주세요.")
        XCTAssertFalse(viewModel.isPlaying)
        XCTAssertTrue(service.playedSteps.isEmpty)
    }

    private func makeViewModel(
        recipe: Recipe = SampleRecipes.soyPorkBelly,
        audioGuideService: SpyAudioGuideService = SpyAudioGuideService()
    ) -> AudioPlayerViewModel {
        makeViewModel(recipes: [recipe], audioGuideService: audioGuideService)
    }

    private func makeViewModel(
        recipes: [Recipe],
        audioGuideService: SpyAudioGuideService = SpyAudioGuideService()
    ) -> AudioPlayerViewModel {
        let recipeID = recipes.first?.id ?? UUID()
        return AudioPlayerViewModel(
            recipeID: recipeID,
            fetchRecipeUseCase: FetchRecipeUseCase(
                recipeRepository: StubAudioRecipeRepository(recipes: recipes)
            ),
            playRecipeStepUseCase: PlayRecipeStepUseCase(audioGuideService: audioGuideService),
            audioGuideService: audioGuideService
        )
    }
}

private final class SpyAudioGuideService: AudioGuideService {
    private let preparationError: Error?
    private(set) var prepareCallCount = 0
    private(set) var playedSteps: [RecipeStep] = []
    private(set) var playedIngredientLists: [[Ingredient]] = []
    private(set) var resumeCallCount = 0
    private(set) var stopCallCount = 0
    private(set) var pauseCallCount = 0

    init(preparationError: Error? = nil) {
        self.preparationError = preparationError
    }

    func prepare() async throws {
        prepareCallCount += 1
        if let preparationError { throw preparationError }
    }

    func play(step: RecipeStep) async {
        playedSteps.append(step)
    }

    func play(ingredients: [Ingredient]) async {
        playedIngredientLists.append(ingredients)
    }

    func resume() async {
        resumeCallCount += 1
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

    func fetchRecipes() async throws -> [Recipe] { recipes }

    func fetchRecipe(id: UUID) async throws -> Recipe? {
        recipes.first { $0.id == id }
    }

    func saveRecipe(_ recipe: Recipe) async throws {}
    func deleteRecipe(id: UUID) async throws {}
}

private struct FailingAudioRecipeRepository: RecipeRepository {
    func fetchRecipes() async throws -> [Recipe] { throw AudioFetchFailure() }
    func fetchRecipe(id: UUID) async throws -> Recipe? { throw AudioFetchFailure() }
    func saveRecipe(_ recipe: Recipe) async throws {}
    func deleteRecipe(id: UUID) async throws {}
}

private struct AudioFetchFailure: Error {}
private struct AudioPreparationFailure: Error {}

private extension UIImage {
    var isUniformColor: Bool {
        guard let cgImage,
              let data = cgImage.dataProvider?.data,
              let bytes = CFDataGetBytePtr(data) else {
            return true
        }

        let byteCount = CFDataGetLength(data)
        guard byteCount >= 4 else { return true }
        let firstPixel = Array(UnsafeBufferPointer(start: bytes, count: 4))
        let stride = max(4, byteCount / 64)
        var offset = 0
        while offset + 3 < byteCount {
            if Array(UnsafeBufferPointer(start: bytes + offset, count: 4)) != firstPixel {
                return false
            }
            offset += stride - (stride % 4)
        }
        return true
    }
}
