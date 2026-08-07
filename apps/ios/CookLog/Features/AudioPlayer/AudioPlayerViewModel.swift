import Foundation

@MainActor
final class AudioPlayerViewModel: ObservableObject {
    @Published private(set) var isLoading = false
    @Published private(set) var recipe: Recipe?
    @Published private(set) var currentStepIndex = 0
    @Published private(set) var isPlaying = false
    @Published private(set) var errorMessage: String?
    @Published private(set) var isNotFound = false
    @Published private(set) var isHandsfreeActive = false
    @Published private(set) var feedbackMessage = "재생 준비가 되었어요."
    @Published private(set) var interruptionMessage: String?

    private let recipeID: UUID
    private let fetchRecipeUseCase: FetchRecipeUseCase
    private let playRecipeStepUseCase: PlayRecipeStepUseCase
    private let audioGuideService: AudioGuideService
    private var hasStartedCurrentStep = false

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
        audioGuideService.stop()
        isLoading = true
        errorMessage = nil
        isNotFound = false
        currentStepIndex = 0
        isPlaying = false
        isHandsfreeActive = false
        interruptionMessage = nil
        hasStartedCurrentStep = false

        do {
            let loadedRecipe = try await fetchRecipeUseCase.execute(id: recipeID)
            recipe = loadedRecipe
            isNotFound = loadedRecipe == nil
            if loadedRecipe != nil {
                do {
                    try await audioGuideService.prepare()
                    feedbackMessage = "재생 준비가 되었어요. 자동으로 재생하지 않습니다."
                } catch {
                    errorMessage = "음성 재생을 준비하지 못했습니다. 다시 시도해주세요."
                }
            }
        } catch {
            recipe = nil
            errorMessage = "오디오 가이드를 불러오지 못했습니다. 다시 시도해주세요."
        }

        isLoading = false
    }

    func send(_ action: AudioGuideAction) async {
        guard canPlay else { return }

        switch action {
        case .previous:
            guard canMoveToPreviousStep else {
                pausePreservingPosition()
                feedbackMessage = "첫 단계예요. 이전 단계는 없습니다."
                return
            }
            currentStepIndex -= 1
            pauseForStepChange(message: "이전 단계로 이동했어요. 재생을 눌러 들으세요.")
        case .next:
            guard canMoveToNextStep else {
                pausePreservingPosition()
                feedbackMessage = "마지막 단계예요. 다음 단계는 없습니다."
                return
            }
            currentStepIndex += 1
            pauseForStepChange(message: "다음 단계로 이동했어요. 재생을 눌러 들으세요.")
        case .pause:
            pausePreservingPosition()
            feedbackMessage = "현재 위치에서 일시정지했어요."
        case .resume:
            guard let currentStep else { return }
            if hasStartedCurrentStep {
                await audioGuideService.resume()
            } else {
                await playRecipeStepUseCase.execute(step: currentStep)
                hasStartedCurrentStep = true
            }
            isPlaying = true
            interruptionMessage = nil
            feedbackMessage = "현재 단계를 재생하고 있어요."
        case .replay:
            guard let currentStep else { return }
            await playRecipeStepUseCase.execute(step: currentStep)
            hasStartedCurrentStep = true
            isPlaying = true
            interruptionMessage = nil
            feedbackMessage = "현재 단계를 처음부터 다시 들려드려요."
        case .readIngredients:
            guard let recipe else { return }
            await audioGuideService.play(ingredients: recipe.ingredients)
            audioGuideService.pause()
            isPlaying = false
            feedbackMessage = recipe.ingredients.isEmpty
                ? "저장된 재료가 없습니다. 현재 단계는 그대로예요."
                : "재료를 안내했어요. 현재 단계는 그대로예요."
        case .endHandsfree:
            isHandsfreeActive = false
            feedbackMessage = "핸즈프리를 종료했어요. 버튼과 현재 오디오는 유지됩니다."
        }
    }

    func startHandsfree() {
        isHandsfreeActive = true
        interruptionMessage = nil
        feedbackMessage = "핸즈프리가 켜졌어요. 7개 명령을 사용할 수 있어요."
    }

    func receiveUncertainCommand() {
        feedbackMessage = "명령을 이해하지 못했어요. 재생 위치와 현재 단계는 그대로입니다."
    }

    func handleAudioInterruption() {
        pausePreservingPosition()
        isHandsfreeActive = false
        interruptionMessage = "다른 오디오로 일시정지했어요. 자동으로 다시 재생하지 않습니다."
        feedbackMessage = "재생 버튼으로 직접 이어서 들을 수 있어요."
    }

    func handleBackgroundOrLock() {
        pausePreservingPosition()
        isHandsfreeActive = false
        interruptionMessage = "백그라운드 또는 잠금으로 핸즈프리가 종료됐어요."
        feedbackMessage = "돌아와도 자동으로 재생하거나 핸즈프리를 켜지 않습니다."
    }

    func stopOnDisappear() {
        audioGuideService.stop()
        isPlaying = false
        isHandsfreeActive = false
    }

    private func pauseForStepChange(message: String) {
        audioGuideService.stop()
        isPlaying = false
        hasStartedCurrentStep = false
        interruptionMessage = nil
        feedbackMessage = message
    }

    private func pausePreservingPosition() {
        audioGuideService.pause()
        isPlaying = false
    }
}
