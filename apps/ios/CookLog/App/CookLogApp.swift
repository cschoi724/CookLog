import SwiftUI
import SwiftData

@main
struct CookLogApp: App {
    private let modelContainer: ModelContainer
    private let environment: AppEnvironment
    @State private var path: [AppRoute] = []
    @State private var aiReviewStepPreviews: [StepPreview] = []
    @State private var homeRefreshToken = 0

    @MainActor
    init() {
        do {
            let modelContainer = try ModelContainer(
                for: PersistentRecipe.self,
                PersistentIngredient.self,
                PersistentRecipeStep.self
            )
            self.modelContainer = modelContainer
            self.environment = AppEnvironment.live(modelContainer: modelContainer)
        } catch {
            fatalError("SwiftData ModelContainer 생성 실패: \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            NavigationStack(path: $path) {
                HomeView(
                    viewModel: HomeViewModel(fetchRecipesUseCase: environment.fetchRecipesUseCase),
                    refreshToken: homeRefreshToken,
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
                        CookingLogView(
                            viewModel: CookingLogViewModel(
                                speechRecognitionService: environment.speechRecognitionService,
                                addStepPreviewUseCase: environment.addStepPreviewUseCase
                            ),
                            onGenerateRecipeDraft: { stepPreviews in
                                aiReviewStepPreviews = stepPreviews
                                path.append(.aiReview)
                            }
                        )
                    case .aiReview:
                        AIReviewView(
                            viewModel: AIReviewViewModel(
                                stepPreviews: aiReviewStepPreviews,
                                generateRecipeDraftUseCase: environment.generateRecipeDraftUseCase,
                                saveRecipeUseCase: environment.saveRecipeUseCase
                            ),
                            onSaved: { recipe in
                                homeRefreshToken += 1
                                path = [.recipeDetail(recipe.id)]
                            }
                        )
                    case .recipeDetail(let recipeID):
                        RecipeDetailView(
                            viewModel: RecipeDetailViewModel(
                                recipeID: recipeID,
                                fetchRecipeUseCase: environment.fetchRecipeUseCase
                            ),
                            onStartAudioGuide: { recipe in
                                path.append(.audioPlayer(recipe.id))
                            }
                        )
                    case .audioPlayer(let recipeID):
                        AudioPlayerView(
                            viewModel: AudioPlayerViewModel(
                                recipeID: recipeID,
                                fetchRecipeUseCase: environment.fetchRecipeUseCase,
                                playRecipeStepUseCase: environment.playRecipeStepUseCase,
                                audioGuideService: environment.audioGuideService
                            )
                        )
                    }
                }
            }
            .modelContainer(modelContainer)
        }
    }
}
