import Foundation

@MainActor
final class RecipeDetailViewModel: ObservableObject {
    @Published private(set) var isLoading = false
    @Published private(set) var recipe: Recipe?
    @Published private(set) var errorMessage: String?
    @Published private(set) var isNotFound = false
    @Published private(set) var isDeleting = false
    @Published private(set) var deleteErrorMessage: String?
    @Published private(set) var isDeleted = false

    private let recipeID: UUID
    private let fetchRecipeUseCase: FetchRecipeUseCase
    private let deleteRecipeUseCase: DeleteRecipeUseCase

    init(
        recipeID: UUID,
        fetchRecipeUseCase: FetchRecipeUseCase,
        deleteRecipeUseCase: DeleteRecipeUseCase
    ) {
        self.recipeID = recipeID
        self.fetchRecipeUseCase = fetchRecipeUseCase
        self.deleteRecipeUseCase = deleteRecipeUseCase
    }

    func loadRecipe() async {
        isLoading = true
        errorMessage = nil
        isNotFound = false
        isDeleted = false

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

    func deleteRecipe() async -> Bool {
        guard recipe != nil, !isDeleting else { return false }

        isDeleting = true
        deleteErrorMessage = nil

        do {
            try await deleteRecipeUseCase.execute(id: recipeID)
            recipe = nil
            isDeleted = true
            isDeleting = false
            return true
        } catch {
            deleteErrorMessage = "레시피를 삭제하지 못했습니다. 저장된 원본은 그대로 유지했어요."
            isDeleting = false
            return false
        }
    }
}
