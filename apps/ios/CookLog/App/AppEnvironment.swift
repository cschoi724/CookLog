import Foundation

struct AppEnvironment {
    let fetchRecipesUseCase: FetchRecipesUseCase
    let fetchRecipeUseCase: FetchRecipeUseCase
    let saveRecipeUseCase: SaveRecipeUseCase
    let deleteRecipeUseCase: DeleteRecipeUseCase
    let addStepPreviewUseCase: AddStepPreviewUseCase
    let generateRecipeDraftUseCase: GenerateRecipeDraftUseCase
    let playRecipeStepUseCase: PlayRecipeStepUseCase

    static func mock(recipes: [Recipe] = SampleRecipes.all) -> AppEnvironment {
        let recipeLocalDataSource = InMemoryRecipeLocalDataSource(recipes: recipes)
        let recipeRepository = DefaultRecipeRepository(localDataSource: recipeLocalDataSource)
        let recipeAIDataSource = MockRecipeAIDataSource()
        let recipeGenerationRepository = DefaultRecipeGenerationRepository(aiDataSource: recipeAIDataSource)
        let audioGuideService = MockAudioGuideService()

        return AppEnvironment(
            fetchRecipesUseCase: FetchRecipesUseCase(recipeRepository: recipeRepository),
            fetchRecipeUseCase: FetchRecipeUseCase(recipeRepository: recipeRepository),
            saveRecipeUseCase: SaveRecipeUseCase(recipeRepository: recipeRepository),
            deleteRecipeUseCase: DeleteRecipeUseCase(recipeRepository: recipeRepository),
            addStepPreviewUseCase: AddStepPreviewUseCase(),
            generateRecipeDraftUseCase: GenerateRecipeDraftUseCase(recipeGenerationRepository: recipeGenerationRepository),
            playRecipeStepUseCase: PlayRecipeStepUseCase(audioGuideService: audioGuideService)
        )
    }
}
