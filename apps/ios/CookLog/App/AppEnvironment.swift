import Foundation
import SwiftData

struct AppEnvironment {
    let fetchRecipesUseCase: FetchRecipesUseCase
    let fetchRecipeUseCase: FetchRecipeUseCase
    let fetchRecipeRecordsUseCase: FetchRecipeRecordsUseCase
    let fetchRecipeRecordUseCase: FetchRecipeRecordUseCase
    let createRecipeRecordUseCase: CreateRecipeRecordUseCase
    let deleteRecipeRecordUseCase: DeleteRecipeRecordUseCase
    let saveStepPreviewDraftUseCase: SaveStepPreviewDraftUseCase
    let saveRecipeUseCase: SaveRecipeUseCase
    let deleteRecipeUseCase: DeleteRecipeUseCase
    let addStepPreviewUseCase: AddStepPreviewUseCase
    let generateRecipeDraftUseCase: GenerateRecipeDraftUseCase
    let generateAIReviewDraftUseCase: GenerateAIReviewDraftUseCase
    let saveAIReviewDraftUseCase: SaveAIReviewDraftUseCase
    let completeRecipeRecordUseCase: CompleteRecipeRecordUseCase
    let playRecipeStepUseCase: PlayRecipeStepUseCase
    let speechRecognitionService: SpeechRecognitionService
    let audioGuideService: AudioGuideService

    @MainActor
    static func live(modelContainer: ModelContainer) -> AppEnvironment {
        let recipeLocalDataSource = SwiftDataRecipeLocalDataSource(modelContext: modelContainer.mainContext)
        let recipeRepository = DefaultRecipeRepository(localDataSource: recipeLocalDataSource)
        let recipeRecordRepository = DefaultRecipeRecordRepository(localDataSource: recipeLocalDataSource)
        let recipeAIDataSource = MockRecipeAIDataSource()
        let recipeGenerationRepository = DefaultRecipeGenerationRepository(aiDataSource: recipeAIDataSource)
        let audioGuideService = MockAudioGuideService()
        let speechRecognitionService = MockSpeechRecognitionService()

        return AppEnvironment(
            fetchRecipesUseCase: FetchRecipesUseCase(recipeRepository: recipeRepository),
            fetchRecipeUseCase: FetchRecipeUseCase(recipeRepository: recipeRepository),
            fetchRecipeRecordsUseCase: FetchRecipeRecordsUseCase(repository: recipeRecordRepository),
            fetchRecipeRecordUseCase: FetchRecipeRecordUseCase(repository: recipeRecordRepository),
            createRecipeRecordUseCase: CreateRecipeRecordUseCase(repository: recipeRecordRepository),
            deleteRecipeRecordUseCase: DeleteRecipeRecordUseCase(repository: recipeRecordRepository),
            saveStepPreviewDraftUseCase: SaveStepPreviewDraftUseCase(repository: recipeRecordRepository),
            saveRecipeUseCase: SaveRecipeUseCase(recipeRepository: recipeRepository),
            deleteRecipeUseCase: DeleteRecipeUseCase(recipeRepository: recipeRepository),
            addStepPreviewUseCase: AddStepPreviewUseCase(),
            generateRecipeDraftUseCase: GenerateRecipeDraftUseCase(recipeGenerationRepository: recipeGenerationRepository),
            generateAIReviewDraftUseCase: GenerateAIReviewDraftUseCase(
                repository: recipeRecordRepository,
                recipeGenerationRepository: recipeGenerationRepository
            ),
            saveAIReviewDraftUseCase: SaveAIReviewDraftUseCase(repository: recipeRecordRepository),
            completeRecipeRecordUseCase: CompleteRecipeRecordUseCase(repository: recipeRecordRepository),
            playRecipeStepUseCase: PlayRecipeStepUseCase(audioGuideService: audioGuideService),
            speechRecognitionService: speechRecognitionService,
            audioGuideService: audioGuideService
        )
    }

    static func mock(recipes: [Recipe] = SampleRecipes.all) -> AppEnvironment {
        let recipeLocalDataSource = InMemoryRecipeLocalDataSource(recipes: recipes)
        let recipeRepository = DefaultRecipeRepository(localDataSource: recipeLocalDataSource)
        let recipeRecordLocalDataSource = InMemoryRecipeRecordLocalDataSource(
            records: recipes.map(RecipeRecord.init(completedRecipe:))
        )
        let recipeRecordRepository = DefaultRecipeRecordRepository(localDataSource: recipeRecordLocalDataSource)
        let recipeAIDataSource = MockRecipeAIDataSource()
        let recipeGenerationRepository = DefaultRecipeGenerationRepository(aiDataSource: recipeAIDataSource)
        let audioGuideService = MockAudioGuideService()
        let speechRecognitionService = MockSpeechRecognitionService()

        return AppEnvironment(
            fetchRecipesUseCase: FetchRecipesUseCase(recipeRepository: recipeRepository),
            fetchRecipeUseCase: FetchRecipeUseCase(recipeRepository: recipeRepository),
            fetchRecipeRecordsUseCase: FetchRecipeRecordsUseCase(repository: recipeRecordRepository),
            fetchRecipeRecordUseCase: FetchRecipeRecordUseCase(repository: recipeRecordRepository),
            createRecipeRecordUseCase: CreateRecipeRecordUseCase(repository: recipeRecordRepository),
            deleteRecipeRecordUseCase: DeleteRecipeRecordUseCase(repository: recipeRecordRepository),
            saveStepPreviewDraftUseCase: SaveStepPreviewDraftUseCase(repository: recipeRecordRepository),
            saveRecipeUseCase: SaveRecipeUseCase(recipeRepository: recipeRepository),
            deleteRecipeUseCase: DeleteRecipeUseCase(recipeRepository: recipeRepository),
            addStepPreviewUseCase: AddStepPreviewUseCase(),
            generateRecipeDraftUseCase: GenerateRecipeDraftUseCase(recipeGenerationRepository: recipeGenerationRepository),
            generateAIReviewDraftUseCase: GenerateAIReviewDraftUseCase(
                repository: recipeRecordRepository,
                recipeGenerationRepository: recipeGenerationRepository
            ),
            saveAIReviewDraftUseCase: SaveAIReviewDraftUseCase(repository: recipeRecordRepository),
            completeRecipeRecordUseCase: CompleteRecipeRecordUseCase(repository: recipeRecordRepository),
            playRecipeStepUseCase: PlayRecipeStepUseCase(audioGuideService: audioGuideService),
            speechRecognitionService: speechRecognitionService,
            audioGuideService: audioGuideService
        )
    }
}

struct DeleteRecipeRecordUseCase {
    private let repository: RecipeRecordRepository

    init(repository: RecipeRecordRepository) {
        self.repository = repository
    }

    func execute(id: UUID) async throws {
        try await repository.deleteRecord(id: id)
    }
}
