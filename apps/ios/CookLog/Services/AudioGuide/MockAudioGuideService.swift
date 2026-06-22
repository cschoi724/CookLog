import Foundation

final class MockAudioGuideService: AudioGuideService {
    private(set) var playedSteps: [RecipeStep] = []
    private(set) var isPaused = false
    private(set) var isStopped = true

    func play(step: RecipeStep) async {
        playedSteps.append(step)
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
