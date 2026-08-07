import Foundation

enum AudioGuideAction: String, CaseIterable, Equatable {
    case previous = "이전"
    case next = "다음"
    case pause = "멈춰"
    case resume = "계속"
    case replay = "다시 들려줘"
    case readIngredients = "재료 알려줘"
    case endHandsfree = "핸즈프리 종료"
}

protocol AudioGuideService {
    func prepare() async throws
    func play(step: RecipeStep) async
    func play(ingredients: [Ingredient]) async
    func resume() async
    func stop()
    func pause()
}
