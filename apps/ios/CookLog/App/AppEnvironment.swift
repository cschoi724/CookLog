import Foundation
import SwiftData

struct AppEnvironment {
    let fetchRecipesUseCase: FetchRecipesUseCase
    let fetchRecipeUseCase: FetchRecipeUseCase
    let fetchRecipeRecordsUseCase: FetchRecipeRecordsUseCase
    let createRecipeRecordUseCase: CreateRecipeRecordUseCase
    let saveRecipeUseCase: SaveRecipeUseCase
    let deleteRecipeUseCase: DeleteRecipeUseCase
    let addStepPreviewUseCase: AddStepPreviewUseCase
    let generateRecipeDraftUseCase: GenerateRecipeDraftUseCase
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
            createRecipeRecordUseCase: CreateRecipeRecordUseCase(repository: recipeRecordRepository),
            saveRecipeUseCase: SaveRecipeUseCase(recipeRepository: recipeRepository),
            deleteRecipeUseCase: DeleteRecipeUseCase(recipeRepository: recipeRepository),
            addStepPreviewUseCase: AddStepPreviewUseCase(),
            generateRecipeDraftUseCase: GenerateRecipeDraftUseCase(recipeGenerationRepository: recipeGenerationRepository),
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
            createRecipeRecordUseCase: CreateRecipeRecordUseCase(repository: recipeRecordRepository),
            saveRecipeUseCase: SaveRecipeUseCase(recipeRepository: recipeRepository),
            deleteRecipeUseCase: DeleteRecipeUseCase(recipeRepository: recipeRepository),
            addStepPreviewUseCase: AddStepPreviewUseCase(),
            generateRecipeDraftUseCase: GenerateRecipeDraftUseCase(recipeGenerationRepository: recipeGenerationRepository),
            playRecipeStepUseCase: PlayRecipeStepUseCase(audioGuideService: audioGuideService),
            speechRecognitionService: speechRecognitionService,
            audioGuideService: audioGuideService
        )
    }
}
