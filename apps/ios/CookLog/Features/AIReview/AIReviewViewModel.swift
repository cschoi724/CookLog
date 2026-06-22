import Foundation

@MainActor
final class AIReviewViewModel: ObservableObject {
    @Published private(set) var isLoading = false
    @Published private(set) var isSaving = false
    @Published private(set) var errorMessage: String?
    @Published private(set) var saveErrorMessage: String?
    @Published var title = ""
    @Published var ingredients: [Ingredient] = []
    @Published var steps: [RecipeStep] = []
    @Published var estimatedMinutesText = ""
    @Published var memo = ""

    var canSave: Bool {
        !isLoading && !isSaving && !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !steps.isEmpty
    }

    private let stepPreviews: [StepPreview]
    private let generateRecipeDraftUseCase: GenerateRecipeDraftUseCase
    private let saveRecipeUseCase: SaveRecipeUseCase
    private var draftSource: RecipeSource = .voiceLog

    init(
        stepPreviews: [StepPreview],
        generateRecipeDraftUseCase: GenerateRecipeDraftUseCase,
        saveRecipeUseCase: SaveRecipeUseCase
    ) {
        self.stepPreviews = stepPreviews
        self.generateRecipeDraftUseCase = generateRecipeDraftUseCase
        self.saveRecipeUseCase = saveRecipeUseCase
    }

    func loadDraft() async {
        guard !stepPreviews.isEmpty else {
            errorMessage = "정리할 STEP Preview가 없습니다."
            return
        }

        isLoading = true
        errorMessage = nil
        saveErrorMessage = nil

        do {
            let draft = try await generateRecipeDraftUseCase.execute(from: .stepPreviews(stepPreviews))
            apply(draft)
        } catch {
            errorMessage = "AI 정리에 실패했습니다. 다시 시도해주세요."
        }

        isLoading = false
    }

    func saveRecipe() async -> Recipe? {
        guard canSave else {
            return nil
        }

        isSaving = true
        saveErrorMessage = nil

        let recipe = makeRecipe()

        do {
            try await saveRecipeUseCase.execute(recipe)
            isSaving = false
            return recipe
        } catch {
            saveErrorMessage = "레시피 저장에 실패했습니다. 다시 시도해주세요."
            isSaving = false
            return nil
        }
    }

    func addIngredient() {
        ingredients.append(Ingredient(name: "", amountText: ""))
    }

    func removeIngredient(id: UUID) {
        ingredients.removeAll { $0.id == id }
    }

    func addStep() {
        let nextOrder = (steps.map(\.order).max() ?? 0) + 1
        steps.append(RecipeStep(order: nextOrder, text: ""))
    }

    func removeStep(id: UUID) {
        steps.removeAll { $0.id == id }
        steps = steps.enumerated().map { index, step in
            RecipeStep(
                id: step.id,
                order: index + 1,
                text: step.text,
                duration: step.duration,
                note: step.note
            )
        }
    }

    private func apply(_ draft: RecipeDraft) {
        title = draft.title
        ingredients = draft.ingredients
        steps = draft.steps
        estimatedMinutesText = draft.estimatedTime.map { String(Int($0 / 60)) } ?? ""
        memo = draft.memo
        draftSource = draft.source
    }

    private func makeRecipe() -> Recipe {
        Recipe(
            title: title.trimmingCharacters(in: .whitespacesAndNewlines),
            ingredients: ingredients.filter { !$0.name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty },
            steps: steps
                .filter { !$0.text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
                .enumerated()
                .map { index, step in
                    RecipeStep(
                        id: step.id,
                        order: index + 1,
                        text: step.text,
                        duration: step.duration,
                        note: step.note
                    )
                },
            memo: memo,
            estimatedTime: estimatedTime,
            source: draftSource
        )
    }

    private var estimatedTime: TimeInterval? {
        guard let minutes = Int(estimatedMinutesText.trimmingCharacters(in: .whitespacesAndNewlines)) else {
            return nil
        }

        return TimeInterval(max(minutes, 0) * 60)
    }
}
