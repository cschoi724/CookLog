import Foundation

protocol AudioGuideService {
    func play(step: RecipeStep) async
    func stop()
    func pause()
}
