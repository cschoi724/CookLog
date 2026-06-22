import Foundation

struct PlayRecipeStepUseCase {
    private let audioGuideService: AudioGuideService

    init(audioGuideService: AudioGuideService) {
        self.audioGuideService = audioGuideService
    }

    func execute(step: RecipeStep) async {
        await audioGuideService.play(step: step)
    }
}
