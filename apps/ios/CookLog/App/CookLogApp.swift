import SwiftUI

@main
struct CookLogApp: App {
    private let environment = AppEnvironment.mock()
    @State private var path: [AppRoute] = []

    var body: some Scene {
        WindowGroup {
            NavigationStack(path: $path) {
                HomeView(
                    viewModel: HomeViewModel(fetchRecipesUseCase: environment.fetchRecipesUseCase),
                    onStartCooking: {
                        path.append(.cookingLog)
                    },
                    onSelectRecipe: { recipe in
                        path.append(.recipeDetail(recipe.id))
                    }
                )
                .navigationDestination(for: AppRoute.self) { route in
                    switch route {
                    case .cookingLog:
                        CookingLogPlaceholderView()
                    case .recipeDetail(let recipeID):
                        RecipeDetailPlaceholderView(recipeID: recipeID)
                    }
                }
            }
        }
    }
}
