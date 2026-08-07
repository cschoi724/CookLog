import SwiftUI
import SwiftData

@main
struct CookLogApp: App {
    private let modelContainer: ModelContainer
    private let environment: AppEnvironment
    @State private var path: [AppRoute] = []
    @State private var homeRefreshToken = 0

    @MainActor
    init() {
        _path = State(initialValue: Self.launchesWithAppInfo ? [.appInfo] : [])
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
                    viewModel: makeHomeViewModel(),
                    refreshToken: homeRefreshToken,
                    onShowAllRecipes: {
                        path.append(.recipeLibrary)
                    },
                    onShowAppInfo: {
                        path.append(.appInfo)
                    },
                    networkErrorState: Self.launchesWithNetworkError
                        ? HomeNetworkErrorState()
                        : nil,
                    onOpenRecord: { destination in
                        path.append(AppRoute(destination))
                    }
                )
                .navigationDestination(for: AppRoute.self) { route in
                    switch route {
                    case .recipeLibrary:
                        RecipeLibraryView(
                            viewModel: makeHomeViewModel(),
                            onOpenRecord: { destination in
                                path.append(AppRoute(destination))
                            }
                        )
                    case .cookingLog(let recordID, let stepPreviews):
                        CookingLogView(
                            viewModel: CookingLogViewModel(
                                speechRecognitionService: environment.speechRecognitionService,
                                addStepPreviewUseCase: environment.addStepPreviewUseCase,
                                saveStepPreviewDraftUseCase: environment.saveStepPreviewDraftUseCase,
                                session: CookingLogSession(id: recordID, stepPreviews: stepPreviews)
                            ),
                            onGenerateRecipeDraft: { stepPreviews in
                                path.append(.aiReview(recordID: recordID, stepPreviews: stepPreviews))
                            }
                        )
                    case .aiReview(let recordID, let stepPreviews):
                        AIReviewView(
                            viewModel: AIReviewViewModel(
                                recordID: recordID,
                                stepPreviews: stepPreviews,
                                fetchRecipeRecordUseCase: environment.fetchRecipeRecordUseCase,
                                generateAIReviewDraftUseCase: environment.generateAIReviewDraftUseCase,
                                saveAIReviewDraftUseCase: environment.saveAIReviewDraftUseCase,
                                completeRecipeRecordUseCase: environment.completeRecipeRecordUseCase
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
                                fetchRecipeUseCase: environment.fetchRecipeUseCase,
                                deleteRecipeUseCase: environment.deleteRecipeUseCase
                            ),
                            onEdit: { recipe in
                                path.append(.recipeEditor(recipe.id))
                            },
                            onDeletionCommitted: {
                                homeRefreshToken += 1
                            },
                            onReturnHome: {
                                path = []
                            },
                            onStartAudioGuide: { recipe in
                                path.append(.audioPlayer(recipe.id))
                            }
                        )
                    case .recipeEditor(let recipeID):
                        AIReviewView(
                            viewModel: AIReviewViewModel(
                                recipeID: recipeID,
                                fetchRecipeUseCase: environment.fetchRecipeUseCase,
                                saveRecipeUseCase: environment.saveRecipeUseCase
                            ),
                            onSaved: { recipe in
                                homeRefreshToken += 1
                                path = [.recipeDetail(recipe.id)]
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
                    case .appInfo:
                        AppInfoView()
                    }
                }
            }
            .modelContainer(modelContainer)
        }
    }

    private static var launchesWithNetworkError: Bool {
        ProcessInfo.processInfo.arguments.contains("--cooklog-home-network-error")
    }

    private static var launchesWithAppInfo: Bool {
        ProcessInfo.processInfo.arguments.contains("--cooklog-app-info")
    }

    private func makeHomeViewModel() -> HomeViewModel {
        HomeViewModel(
            fetchRecordsUseCase: environment.fetchRecipeRecordsUseCase,
            createRecordUseCase: environment.createRecipeRecordUseCase,
            deleteRecordUseCase: environment.deleteRecipeRecordUseCase
        )
    }
}
