import Foundation

@MainActor
final class RecipeDetailViewModel: ObservableObject {
    @Published private(set) var isLoading = false
    @Published private(set) var recipe: Recipe?
    @Published private(set) var errorMessage: String?
    @Published private(set) var isNotFound = false

    private let recipeID: UUID
    private let fetchRecipeUseCase: FetchRecipeUseCase

    init(
        recipeID: UUID,
        fetchRecipeUseCase: FetchRecipeUseCase
    ) {
        self.recipeID = recipeID
        self.fetchRecipeUseCase = fetchRecipeUseCase
    }

    func loadRecipe() async {
        isLoading = true
        errorMessage = nil
        isNotFound = false

        do {
            let loadedRecipe = try await fetchRecipeUseCase.execute(id: recipeID)
            recipe = loadedRecipe
            isNotFound = loadedRecipe == nil
        } catch {
            recipe = nil
            errorMessage = "레시피를 불러오지 못했습니다. 다시 시도해주세요."
        }

        isLoading = false
    }
}
