import Foundation

@MainActor
final class HomeViewModel: ObservableObject {
    @Published private(set) var recipes: [Recipe] = []
    @Published private(set) var isLoading = false
    @Published private(set) var errorMessage: String?

    var isEmpty: Bool {
        !isLoading && recipes.isEmpty
    }

    private let fetchRecipesUseCase: FetchRecipesUseCase

    init(fetchRecipesUseCase: FetchRecipesUseCase) {
        self.fetchRecipesUseCase = fetchRecipesUseCase
    }

    func loadRecipes() async {
        isLoading = true
        errorMessage = nil

        do {
            recipes = try await fetchRecipesUseCase.execute()
        } catch {
            errorMessage = "레시피를 불러오지 못했습니다."
            recipes = []
        }

        isLoading = false
    }
}
