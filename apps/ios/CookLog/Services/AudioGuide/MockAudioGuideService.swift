import Foundation

final class MockAudioGuideService: AudioGuideService {
    private(set) var playedSteps: [RecipeStep] = []
    private(set) var playedIngredientLists: [[Ingredient]] = []
    private(set) var resumeCallCount = 0
    private(set) var isPaused = false
    private(set) var isStopped = true

    func prepare() async throws {}

    func play(step: RecipeStep) async {
        playedSteps.append(step)
        isPaused = false
        isStopped = false
    }

    func play(ingredients: [Ingredient]) async {
        playedIngredientLists.append(ingredients)
        isPaused = false
        isStopped = false
    }

    func resume() async {
        resumeCallCount += 1
        isPaused = false
        isStopped = false
    }

    func stop() {
        isStopped = true
        isPaused = false
    }

    func pause() {
        isPaused = true
        isStopped = false
    }
}
