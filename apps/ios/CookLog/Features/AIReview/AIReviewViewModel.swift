import Foundation

@MainActor
final class AIReviewViewModel: ObservableObject {
    enum Mode: Equatable {
        case review(recordID: UUID, stepPreviews: [StepPreview])
        case completedRecipe(recipeID: UUID)
    }

    private struct EditorSnapshot: Equatable {
        let title: String
        let ingredients: [Ingredient]
        let steps: [RecipeStep]
        let estimatedMinutesText: String
        let memo: String
        let source: RecipeSource
    }

    private struct DeletedStep {
        let index: Int
        let step: RecipeStep
    }

    @Published private(set) var isLoading = false
    @Published private(set) var isSaving = false
    @Published private(set) var isSavingDraft = false
    @Published private(set) var errorMessage: String?
    @Published private(set) var saveErrorMessage: String?
    @Published private(set) var draftSaveErrorMessage: String?
    @Published private(set) var draftFeedbackMessage: String?
    @Published private(set) var validationMessage: String?
    @Published private(set) var hasDeletedStepToRestore = false
    @Published var title = ""
    @Published var ingredients: [Ingredient] = []
    @Published var steps: [RecipeStep] = []
    @Published var estimatedMinutesText = ""
    @Published var memo = ""

    let mode: Mode

    var isCompletedRecipeEdit: Bool {
        if case .completedRecipe = mode { return true }
        return false
    }

    var sourceStepPreviews: [StepPreview] {
        if case .review(_, let stepPreviews) = mode { return stepPreviews }
        return []
    }

    var canSave: Bool {
        !isLoading && !isSaving && !isSavingDraft && validationIssues.isEmpty
    }

    var isTitleMissing: Bool {
        title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    var isNonEmptyStepMissing: Bool {
        !steps.contains { !$0.text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
    }

    var hasUnsavedChanges: Bool {
        guard let savedSnapshot else { return false }
        return currentSnapshot != savedSnapshot
    }

    private let fetchRecipeRecordUseCase: FetchRecipeRecordUseCase?
    private let generateAIReviewDraftUseCase: GenerateAIReviewDraftUseCase?
    private let saveAIReviewDraftUseCase: SaveAIReviewDraftUseCase?
    private let completeRecipeRecordUseCase: CompleteRecipeRecordUseCase?
    private let fetchRecipeUseCase: FetchRecipeUseCase?
    private let saveRecipeUseCase: SaveRecipeUseCase?
    private var draftSource: RecipeSource = .voiceLog
    private var savedSnapshot: EditorSnapshot?
    private var loadedRecipe: Recipe?
    private var loadedRecord: RecipeRecord?
    private var deletedStep: DeletedStep?

    init(
        recordID: UUID,
        stepPreviews: [StepPreview],
        fetchRecipeRecordUseCase: FetchRecipeRecordUseCase,
        generateAIReviewDraftUseCase: GenerateAIReviewDraftUseCase,
        saveAIReviewDraftUseCase: SaveAIReviewDraftUseCase,
        completeRecipeRecordUseCase: CompleteRecipeRecordUseCase
    ) {
        mode = .review(recordID: recordID, stepPreviews: stepPreviews)
        self.fetchRecipeRecordUseCase = fetchRecipeRecordUseCase
        self.generateAIReviewDraftUseCase = generateAIReviewDraftUseCase
        self.saveAIReviewDraftUseCase = saveAIReviewDraftUseCase
        self.completeRecipeRecordUseCase = completeRecipeRecordUseCase
        fetchRecipeUseCase = nil
        saveRecipeUseCase = nil
    }

    init(
        recipeID: UUID,
        fetchRecipeUseCase: FetchRecipeUseCase,
        saveRecipeUseCase: SaveRecipeUseCase
    ) {
        mode = .completedRecipe(recipeID: recipeID)
        fetchRecipeRecordUseCase = nil
        generateAIReviewDraftUseCase = nil
        saveAIReviewDraftUseCase = nil
        completeRecipeRecordUseCase = nil
        self.fetchRecipeUseCase = fetchRecipeUseCase
        self.saveRecipeUseCase = saveRecipeUseCase
    }

    func loadDraft() async {
        isLoading = true
        errorMessage = nil
        saveErrorMessage = nil
        draftSaveErrorMessage = nil
        validationMessage = nil

        do {
            switch mode {
            case .review(let recordID, let stepPreviews):
                guard !stepPreviews.isEmpty else {
                    throw AIReviewLoadError.emptyStepPreviews
                }
                guard let fetchRecipeRecordUseCase,
                      let generateAIReviewDraftUseCase,
                      let record = try await fetchRecipeRecordUseCase.execute(id: recordID) else {
                    throw AIReviewLoadError.recordNotFound
                }

                loadedRecord = record
                if let savedDraft = record.reviewDraft {
                    apply(savedDraft)
                } else {
                    let generatedDraft = try await generateAIReviewDraftUseCase.execute(
                        recordID: recordID,
                        stepPreviews: stepPreviews
                    )
                    apply(generatedDraft)
                    loadedRecord = try await fetchRecipeRecordUseCase.execute(id: recordID)
                }
            case .completedRecipe(let recipeID):
                guard let fetchRecipeUseCase,
                      let recipe = try await fetchRecipeUseCase.execute(id: recipeID) else {
                    throw AIReviewLoadError.recipeNotFound
                }
                loadedRecipe = recipe
                apply(recipe)
            }

            savedSnapshot = currentSnapshot
        } catch {
            errorMessage = isCompletedRecipeEdit
                ? "레시피를 불러오지 못했습니다. 다시 시도해주세요."
                : "AI 정리에 실패했습니다. STEP Preview는 그대로 보존했습니다."
        }

        isLoading = false
    }

    func saveDraft() async -> Bool {
        guard case .review(let recordID, _) = mode,
              let saveAIReviewDraftUseCase,
              !isSaving,
              !isSavingDraft else {
            return false
        }

        isSavingDraft = true
        saveErrorMessage = nil
        draftSaveErrorMessage = nil
        draftFeedbackMessage = nil

        do {
            let record = try await saveAIReviewDraftUseCase.execute(
                recordID: recordID,
                draft: makeDraft()
            )
            loadedRecord = record
            savedSnapshot = currentSnapshot
            draftFeedbackMessage = "임시 저장했어요. 계속 편집할 수 있습니다."
            isSavingDraft = false
            return true
        } catch {
            draftSaveErrorMessage = "임시 저장하지 못했습니다. 현재 편집값은 그대로 유지했어요."
            isSavingDraft = false
            return false
        }
    }

    func saveRecipe() async -> Recipe? {
        validationMessage = nil
        let issues = validationIssues
        guard issues.isEmpty, !isSaving, !isSavingDraft else {
            if !issues.isEmpty {
                validationMessage = "제목, 재료와 조리 단계를 확인해주세요."
            }
            return nil
        }

        isSaving = true
        saveErrorMessage = nil
        draftSaveErrorMessage = nil
        draftFeedbackMessage = nil
        let recipe = makeRecipe()

        do {
            switch mode {
            case .review(let recordID, _):
                guard let completeRecipeRecordUseCase else {
                    throw AIReviewSaveError.missingDependency
                }
                _ = try await completeRecipeRecordUseCase.execute(
                    recordID: recordID,
                    recipe: recipe
                )
            case .completedRecipe:
                guard let saveRecipeUseCase else {
                    throw AIReviewSaveError.missingDependency
                }
                try await saveRecipeUseCase.execute(recipe)
                loadedRecipe = recipe
            }

            savedSnapshot = currentSnapshot
            isSaving = false
            return recipe
        } catch {
            saveErrorMessage = "레시피 저장에 실패했습니다. 현재 편집값은 그대로 유지했어요."
            isSaving = false
            return nil
        }
    }

    func discardChanges() {
        guard let savedSnapshot else { return }
        apply(savedSnapshot)
        clearTransientFeedback()
    }

    func addIngredient() {
        ingredients.append(Ingredient(name: "", amountText: ""))
        clearValidationFeedback()
    }

    func removeIngredient(id: UUID) {
        ingredients.removeAll { $0.id == id }
        clearValidationFeedback()
    }

    func addStep() {
        steps.append(RecipeStep(order: steps.count + 1, text: ""))
        normalizeStepOrder()
        clearValidationFeedback()
    }

    func removeStep(id: UUID) {
        guard let index = steps.firstIndex(where: { $0.id == id }) else { return }
        deletedStep = DeletedStep(index: index, step: steps.remove(at: index))
        hasDeletedStepToRestore = true
        normalizeStepOrder()
        clearValidationFeedback()
    }

    func restoreDeletedStep() {
        guard let deletedStep else { return }
        steps.insert(deletedStep.step, at: min(deletedStep.index, steps.count))
        self.deletedStep = nil
        hasDeletedStepToRestore = false
        normalizeStepOrder()
    }

    func moveStep(id: UUID, offset: Int) {
        guard let sourceIndex = steps.firstIndex(where: { $0.id == id }) else { return }
        let destinationIndex = sourceIndex + offset
        guard steps.indices.contains(destinationIndex) else { return }
        steps.swapAt(sourceIndex, destinationIndex)
        normalizeStepOrder()
    }

    func dismissDraftFeedback() {
        draftFeedbackMessage = nil
    }

    private var validationIssues: [AIReviewValidationIssue] {
        var issues: [AIReviewValidationIssue] = []
        if isTitleMissing {
            issues.append(.missingTitle)
        }
        if isNonEmptyStepMissing {
            issues.append(.missingStep)
        }
        if ingredients.contains(where: {
            $0.name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                && !($0.amountText ?? "").trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        }) {
            issues.append(.ingredientAmountWithoutName)
        }
        return issues
    }

    private var currentSnapshot: EditorSnapshot {
        EditorSnapshot(
            title: title,
            ingredients: ingredients,
            steps: steps,
            estimatedMinutesText: estimatedMinutesText,
            memo: memo,
            source: draftSource
        )
    }

    private func apply(_ draft: RecipeDraft) {
        title = draft.title
        ingredients = draft.ingredients
        steps = draft.steps
        estimatedMinutesText = draft.estimatedTime.map { String(Int($0 / 60)) } ?? ""
        memo = draft.memo
        draftSource = draft.source
        normalizeStepOrder()
    }

    private func apply(_ recipe: Recipe) {
        title = recipe.title
        ingredients = recipe.ingredients
        steps = recipe.steps
        estimatedMinutesText = recipe.estimatedTime.map { String(Int($0 / 60)) } ?? ""
        memo = recipe.memo
        draftSource = recipe.source
        normalizeStepOrder()
    }

    private func apply(_ snapshot: EditorSnapshot) {
        title = snapshot.title
        ingredients = snapshot.ingredients
        steps = snapshot.steps
        estimatedMinutesText = snapshot.estimatedMinutesText
        memo = snapshot.memo
        draftSource = snapshot.source
        normalizeStepOrder()
    }

    private func makeDraft() -> RecipeDraft {
        RecipeDraft(
            title: title,
            ingredients: ingredients,
            steps: steps,
            memo: memo,
            estimatedTime: estimatedTime,
            source: draftSource
        )
    }

    private func makeRecipe() -> Recipe {
        let metadataRecipe = loadedRecipe
        let recordID: UUID
        let createdAt: Date
        let syncStatus: SyncStatus
        let ownerID: String?

        switch mode {
        case .review(let id, _):
            recordID = id
            createdAt = loadedRecord?.createdAt ?? Date()
            syncStatus = .localOnly
            ownerID = nil
        case .completedRecipe(let id):
            recordID = id
            createdAt = metadataRecipe?.createdAt ?? Date()
            syncStatus = metadataRecipe?.syncStatus ?? .localOnly
            ownerID = metadataRecipe?.ownerId
        }

        return Recipe(
            id: recordID,
            title: title.trimmingCharacters(in: .whitespacesAndNewlines),
            ingredients: ingredients.filter {
                !$0.name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            },
            steps: steps
                .filter { !$0.text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
                .enumerated()
                .map { index, step in
                    RecipeStep(
                        id: step.id,
                        order: index + 1,
                        text: step.text.trimmingCharacters(in: .whitespacesAndNewlines),
                        duration: step.duration,
                        note: step.note
                    )
                },
            memo: memo,
            estimatedTime: estimatedTime,
            source: draftSource,
            syncStatus: syncStatus,
            ownerId: ownerID,
            createdAt: createdAt,
            updatedAt: Date()
        )
    }

    private var estimatedTime: TimeInterval? {
        guard let minutes = Int(estimatedMinutesText.trimmingCharacters(in: .whitespacesAndNewlines)) else {
            return nil
        }
        return TimeInterval(max(minutes, 0) * 60)
    }

    private func normalizeStepOrder() {
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

    private func clearValidationFeedback() {
        validationMessage = nil
    }

    private func clearTransientFeedback() {
        validationMessage = nil
        saveErrorMessage = nil
        draftSaveErrorMessage = nil
        draftFeedbackMessage = nil
        deletedStep = nil
        hasDeletedStepToRestore = false
    }
}

private enum AIReviewLoadError: Error {
    case emptyStepPreviews
    case recordNotFound
    case recipeNotFound
}

private enum AIReviewSaveError: Error {
    case missingDependency
}

private enum AIReviewValidationIssue {
    case missingTitle
    case missingStep
    case ingredientAmountWithoutName
}
