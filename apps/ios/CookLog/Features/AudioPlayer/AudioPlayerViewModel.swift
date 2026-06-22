import Foundation

@MainActor
final class AudioPlayerViewModel: ObservableObject {
    @Published private(set) var isLoading = false
    @Published private(set) var recipe: Recipe?
    @Published private(set) var currentStepIndex = 0
    @Published private(set) var isPlaying = false
    @Published private(set) var errorMessage: String?
    @Published private(set) var isNotFound = false

    private let recipeID: UUID
    private let fetchRecipeUseCase: FetchRecipeUseCase
    private let playRecipeStepUseCase: PlayRecipeStepUseCase
    private let audioGuideService: AudioGuideService

    init(
        recipeID: UUID,
        fetchRecipeUseCase: FetchRecipeUseCase,
        playRecipeStepUseCase: PlayRecipeStepUseCase,
        audioGuideService: AudioGuideService
    ) {
        self.recipeID = recipeID
        self.fetchRecipeUseCase = fetchRecipeUseCase
        self.playRecipeStepUseCase = playRecipeStepUseCase
        self.audioGuideService = audioGuideService
    }

    var steps: [RecipeStep] {
        recipe?.steps.sorted { $0.order < $1.order } ?? []
    }

    var currentStep: RecipeStep? {
        guard steps.indices.contains(currentStepIndex) else {
            return nil
        }

        return steps[currentStepIndex]
    }

    var currentStepNumberText: String {
        guard !steps.isEmpty else {
            return "STEP 0 / 0"
        }

        return "STEP \(currentStepIndex + 1) / \(steps.count)"
    }

    var canPlay: Bool {
        currentStep != nil
    }

    var canMoveToPreviousStep: Bool {
        currentStepIndex > 0
    }

    var canMoveToNextStep: Bool {
        currentStepIndex < steps.count - 1
    }

    var isEmptySteps: Bool {
        recipe != nil && steps.isEmpty
    }

    func loadRecipe() async {
        isLoading = true
        errorMessage = nil
        isNotFound = false
        currentStepIndex = 0
        isPlaying = false

        do {
            let loadedRecipe = try await fetchRecipeUseCase.execute(id: recipeID)
            recipe = loadedRecipe
            isNotFound = loadedRecipe == nil
        } catch {
            recipe = nil
            errorMessage = "오디오 가이드를 불러오지 못했습니다. 다시 시도해주세요."
        }

        isLoading = false
    }

    func playCurrentStep() async {
        guard let currentStep else {
            return
        }

        await playRecipeStepUseCase.execute(step: currentStep)
        isPlaying = true
    }

    func replayCurrentStep() async {
        await playCurrentStep()
    }

    func stop() {
        audioGuideService.stop()
        isPlaying = false
    }

    func moveToPreviousStep() {
        guard canMoveToPreviousStep else {
            return
        }

        currentStepIndex -= 1
        stop()
    }

    func moveToNextStep() {
        guard canMoveToNextStep else {
            return
        }

        currentStepIndex += 1
        stop()
    }

    func stopOnDisappear() {
        stop()
    }
}
