import XCTest
@testable import CookLog

@MainActor
final class AIReviewViewModelTests: XCTestCase {
    func testLoadDraftGeneratesFromOriginalStepPreviewsAndPersistsReviewState() async throws {
        let fixture = makeReviewFixture()

        await fixture.viewModel.loadDraft()

        XCTAssertEqual(fixture.viewModel.title, "나의 요리 기록")
        XCTAssertEqual(fixture.viewModel.sourceStepPreviews, fixture.stepPreviews)
        XCTAssertNil(fixture.viewModel.errorMessage)
        XCTAssertFalse(fixture.viewModel.hasUnsavedChanges)

        let storedRecord = try await fixture.repository.fetchRecord(id: fixture.recordID)
        XCTAssertEqual(storedRecord?.id, fixture.recordID)
        XCTAssertEqual(storedRecord?.lifecycleState, .draftAIReview)
        XCTAssertEqual(storedRecord?.stepPreviews, fixture.stepPreviews)
        XCTAssertEqual(storedRecord?.reviewDraft?.title, "나의 요리 기록")
        XCTAssertFalse(storedRecord?.isAISnapshotLocked ?? true)
    }

    func testGenerationFailurePreservesOriginalStepsAndUnlocksSnapshot() async throws {
        let fixture = makeReviewFixture(generationRepository: FailingRecipeGenerationRepository())

        await fixture.viewModel.loadDraft()

        XCTAssertEqual(fixture.viewModel.errorMessage, "AI 정리에 실패했습니다. STEP Preview는 그대로 보존했습니다.")
        XCTAssertEqual(fixture.viewModel.sourceStepPreviews, fixture.stepPreviews)
        let storedRecord = try await fixture.repository.fetchRecord(id: fixture.recordID)
        XCTAssertEqual(storedRecord?.lifecycleState, .draftStepPreview)
        XCTAssertEqual(storedRecord?.stepPreviews, fixture.stepPreviews)
        XCTAssertFalse(storedRecord?.isAISnapshotLocked ?? true)
    }

    func testManualDraftSaveReplacesSnapshotAndDiscardRestoresIt() async {
        let fixture = makeReviewFixture()
        await fixture.viewModel.loadDraft()
        fixture.viewModel.title = "임시 저장 제목"
        fixture.viewModel.ingredients[0].name = "삼겹살"
        fixture.viewModel.memo = "중불"

        let didSaveDraft = await fixture.viewModel.saveDraft()
        XCTAssertTrue(didSaveDraft)
        XCTAssertFalse(fixture.viewModel.hasUnsavedChanges)
        XCTAssertEqual(fixture.viewModel.draftFeedbackMessage, "임시 저장했어요. 계속 편집할 수 있습니다.")

        fixture.viewModel.title = "버릴 제목"
        fixture.viewModel.memo = "버릴 메모"
        XCTAssertTrue(fixture.viewModel.hasUnsavedChanges)

        fixture.viewModel.discardChanges()

        XCTAssertEqual(fixture.viewModel.title, "임시 저장 제목")
        XCTAssertEqual(fixture.viewModel.memo, "중불")
        XCTAssertFalse(fixture.viewModel.hasUnsavedChanges)
    }

    func testManualDraftSaveFailurePreservesEditorAndLastSuccessfulSnapshot() async throws {
        let fixture = makeReviewFixture()
        await fixture.viewModel.loadDraft()
        fixture.viewModel.title = "실패해도 남을 임시 제목"
        fixture.viewModel.memo = "실패해도 남을 메모"
        await fixture.repository.failNextSave()

        let didSave = await fixture.viewModel.saveDraft()

        XCTAssertFalse(didSave)
        XCTAssertEqual(fixture.viewModel.title, "실패해도 남을 임시 제목")
        XCTAssertEqual(fixture.viewModel.memo, "실패해도 남을 메모")
        XCTAssertTrue(fixture.viewModel.hasUnsavedChanges)
        XCTAssertEqual(
            fixture.viewModel.draftSaveErrorMessage,
            "임시 저장하지 못했습니다. 현재 편집값은 그대로 유지했어요."
        )
        XCTAssertNil(fixture.viewModel.saveErrorMessage)
        let storedRecord = try await fixture.repository.fetchRecord(id: fixture.recordID)
        XCTAssertEqual(storedRecord?.reviewDraft?.title, "나의 요리 기록")

        let didRetrySave = await fixture.viewModel.saveDraft()
        XCTAssertTrue(didRetrySave)
        let retriedRecord = try await fixture.repository.fetchRecord(id: fixture.recordID)
        XCTAssertEqual(retriedRecord?.reviewDraft?.title, "실패해도 남을 임시 제목")
    }

    func testGenerationRejectsDifferentStepSnapshotWithoutMutatingRecord() async throws {
        let fixture = makeReviewFixture()
        let useCase = GenerateAIReviewDraftUseCase(
            repository: fixture.repository,
            recipeGenerationRepository: FixedRecipeGenerationRepository()
        )

        do {
            _ = try await useCase.execute(
                recordID: fixture.recordID,
                stepPreviews: [StepPreview(order: 1, transcript: "다른 snapshot")]
            )
            XCTFail("route의 STEP snapshot이 저장 원본과 다르면 생성을 거부해야 합니다.")
        } catch {
            XCTAssertEqual(error as? RecipeRecordUseCaseError, .stepPreviewSnapshotMismatch)
        }

        let storedRecord = try await fixture.repository.fetchRecord(id: fixture.recordID)
        XCTAssertEqual(storedRecord?.lifecycleState, .draftStepPreview)
        XCTAssertEqual(storedRecord?.stepPreviews, fixture.stepPreviews)
        XCTAssertFalse(storedRecord?.isAISnapshotLocked ?? true)
    }

    func testFinalSaveCompletesSameRecordIDAndNormalizesSteps() async throws {
        let fixture = makeReviewFixture()
        await fixture.viewModel.loadDraft()
        fixture.viewModel.title = "완성 레시피"
        fixture.viewModel.addStep()
        fixture.viewModel.steps[0].text = " 첫 단계 "
        fixture.viewModel.steps[1].text = ""

        let savedRecipe = await fixture.viewModel.saveRecipe()

        XCTAssertEqual(savedRecipe?.id, fixture.recordID)
        XCTAssertEqual(savedRecipe?.steps.count, 1)
        XCTAssertEqual(savedRecipe?.steps.first?.order, 1)
        XCTAssertEqual(savedRecipe?.steps.first?.text, "첫 단계")
        let storedRecord = try await fixture.repository.fetchRecord(id: fixture.recordID)
        XCTAssertEqual(storedRecord?.lifecycleState, .completed)
        XCTAssertEqual(storedRecord?.completedRecipe?.id, fixture.recordID)
    }

    func testFinalSaveFailureRetainsEveryEditedValueAndStoredDraft() async throws {
        let fixture = makeReviewFixture()
        await fixture.viewModel.loadDraft()
        fixture.viewModel.title = "실패해도 남을 제목"
        fixture.viewModel.ingredients[0].name = "두부"
        fixture.viewModel.ingredients[0].amountText = "한 모"
        fixture.viewModel.steps[0].text = "두부를 굽는다"
        fixture.viewModel.estimatedMinutesText = "13"
        fixture.viewModel.memo = "약불"
        await fixture.repository.failNextSave()

        let savedRecipe = await fixture.viewModel.saveRecipe()

        XCTAssertNil(savedRecipe)
        XCTAssertEqual(fixture.viewModel.title, "실패해도 남을 제목")
        XCTAssertEqual(fixture.viewModel.ingredients[0].amountText, "한 모")
        XCTAssertEqual(fixture.viewModel.steps[0].text, "두부를 굽는다")
        XCTAssertEqual(fixture.viewModel.estimatedMinutesText, "13")
        XCTAssertEqual(fixture.viewModel.memo, "약불")
        XCTAssertEqual(fixture.viewModel.saveErrorMessage, "레시피 저장에 실패했습니다. 현재 편집값은 그대로 유지했어요.")
        let storedRecord = try await fixture.repository.fetchRecord(id: fixture.recordID)
        XCTAssertEqual(storedRecord?.lifecycleState, .draftAIReview)
        XCTAssertEqual(storedRecord?.reviewDraft?.title, "나의 요리 기록")
    }

    func testValidationRejectsAmountWithoutIngredientName() async {
        let fixture = makeReviewFixture()
        await fixture.viewModel.loadDraft()
        fixture.viewModel.ingredients = [Ingredient(name: "", amountText: "200g")]

        let savedRecipe = await fixture.viewModel.saveRecipe()

        XCTAssertNil(savedRecipe)
        XCTAssertEqual(fixture.viewModel.validationMessage, "제목, 재료와 조리 단계를 확인해주세요.")
    }

    func testStepMoveDeleteAndUndoPreserveIdentityAndOrder() async {
        let fixture = makeReviewFixture()
        await fixture.viewModel.loadDraft()
        let firstID = fixture.viewModel.steps[0].id
        let secondID = fixture.viewModel.steps[1].id

        fixture.viewModel.moveStep(id: secondID, offset: -1)
        XCTAssertEqual(fixture.viewModel.steps.map(\.id), [secondID, firstID])
        XCTAssertEqual(fixture.viewModel.steps.map(\.order), [1, 2])

        fixture.viewModel.removeStep(id: secondID)
        XCTAssertTrue(fixture.viewModel.hasDeletedStepToRestore)
        fixture.viewModel.restoreDeletedStep()

        XCTAssertEqual(fixture.viewModel.steps.map(\.id), [secondID, firstID])
        XCTAssertEqual(fixture.viewModel.steps.map(\.order), [1, 2])
    }

    func testCompletedRecipeEditDoesNotGenerateAndUpdatesExistingRecipe() async throws {
        let recipe = Recipe(
            title: "저장 원본",
            ingredients: [Ingredient(name: "감자", amountText: "1개")],
            steps: [RecipeStep(order: 1, text: "감자를 익힌다")]
        )
        let repository = TestRecipeRepository(recipes: [recipe])
        let viewModel = AIReviewViewModel(
            recipeID: recipe.id,
            fetchRecipeUseCase: FetchRecipeUseCase(recipeRepository: repository),
            saveRecipeUseCase: SaveRecipeUseCase(recipeRepository: repository)
        )

        await viewModel.loadDraft()
        viewModel.title = "수정 완료"
        let savedRecipe = await viewModel.saveRecipe()

        XCTAssertTrue(viewModel.isCompletedRecipeEdit)
        XCTAssertEqual(savedRecipe?.id, recipe.id)
        let storedRecipe = try await repository.fetchRecipe(id: recipe.id)
        XCTAssertEqual(storedRecipe?.title, "수정 완료")
    }

    func testCompletedRecipeSaveFailurePreservesEditAndStoredOriginal() async throws {
        let recipe = Recipe(
            title: "저장 원본",
            ingredients: [],
            steps: [RecipeStep(order: 1, text: "원본 단계")]
        )
        let repository = TestRecipeRepository(recipes: [recipe])
        let viewModel = AIReviewViewModel(
            recipeID: recipe.id,
            fetchRecipeUseCase: FetchRecipeUseCase(recipeRepository: repository),
            saveRecipeUseCase: SaveRecipeUseCase(recipeRepository: repository)
        )
        await viewModel.loadDraft()
        viewModel.title = "실패할 수정본"
        await repository.failNextSave()

        let savedRecipe = await viewModel.saveRecipe()
        XCTAssertNil(savedRecipe)
        XCTAssertEqual(viewModel.title, "실패할 수정본")
        let storedRecipe = try await repository.fetchRecipe(id: recipe.id)
        XCTAssertEqual(storedRecipe?.title, "저장 원본")

        viewModel.discardChanges()
        XCTAssertEqual(viewModel.title, "저장 원본")
    }

    private func makeReviewFixture(
        generationRepository: RecipeGenerationRepository = FixedRecipeGenerationRepository()
    ) -> ReviewFixture {
        let recordID = UUID()
        let stepPreviews = [
            StepPreview(order: 1, transcript: "삼겹살을 볶았어"),
            StepPreview(order: 2, transcript: "양파를 넣었어")
        ]
        let record = RecipeRecord(id: recordID, stepPreviews: stepPreviews)
        let repository = TestRecipeRecordRepository(record: record)
        let viewModel = AIReviewViewModel(
            recordID: recordID,
            stepPreviews: stepPreviews,
            fetchRecipeRecordUseCase: FetchRecipeRecordUseCase(repository: repository),
            generateAIReviewDraftUseCase: GenerateAIReviewDraftUseCase(
                repository: repository,
                recipeGenerationRepository: generationRepository
            ),
            saveAIReviewDraftUseCase: SaveAIReviewDraftUseCase(repository: repository),
            completeRecipeRecordUseCase: CompleteRecipeRecordUseCase(repository: repository)
        )
        return ReviewFixture(
            recordID: recordID,
            stepPreviews: stepPreviews,
            repository: repository,
            viewModel: viewModel
        )
    }

}

private struct ReviewFixture {
    let recordID: UUID
    let stepPreviews: [StepPreview]
    let repository: TestRecipeRecordRepository
    let viewModel: AIReviewViewModel
}

private actor TestRecipeRecordRepository: RecipeRecordRepository {
    private var record: RecipeRecord?
    private var shouldFailNextSave = false

    init(record: RecipeRecord) {
        self.record = record
    }

    func failNextSave() {
        shouldFailNextSave = true
    }

    func fetchRecords() async throws -> [RecipeRecord] {
        record.map { [$0] } ?? []
    }

    func fetchRecord(id: UUID) async throws -> RecipeRecord? {
        record?.id == id ? record : nil
    }

    func createRecord(_ record: RecipeRecord) async throws {
        self.record = record
    }

    func saveRecord(_ record: RecipeRecord) async throws {
        if shouldFailNextSave {
            shouldFailNextSave = false
            throw TestPersistenceError.failed
        }
        self.record = record
    }

    func deleteRecord(id: UUID) async throws {
        if record?.id == id { record = nil }
    }
}

private actor TestRecipeRepository: RecipeRepository {
    private var recipes: [UUID: Recipe]
    private var shouldFailNextSave = false

    init(recipes: [Recipe]) {
        self.recipes = Dictionary(uniqueKeysWithValues: recipes.map { ($0.id, $0) })
    }

    func failNextSave() {
        shouldFailNextSave = true
    }

    func fetchRecipes() async throws -> [Recipe] {
        Array(recipes.values)
    }

    func fetchRecipe(id: UUID) async throws -> Recipe? {
        recipes[id]
    }

    func saveRecipe(_ recipe: Recipe) async throws {
        if shouldFailNextSave {
            shouldFailNextSave = false
            throw TestPersistenceError.failed
        }
        recipes[recipe.id] = recipe
    }

    func deleteRecipe(id: UUID) async throws {
        recipes[id] = nil
    }
}

private struct FixedRecipeGenerationRepository: RecipeGenerationRepository {
    func generateRecipeDraft(from input: RecipeGenerationInput) async throws -> RecipeDraft {
        RecipeDraft(
            title: "나의 요리 기록",
            ingredients: [Ingredient(name: "기록한 재료", amountText: nil)],
            steps: [
                RecipeStep(order: 1, text: "삼겹살을 볶았어"),
                RecipeStep(order: 2, text: "양파를 넣었어")
            ],
            estimatedTime: 10 * 60
        )
    }
}

private struct FailingRecipeGenerationRepository: RecipeGenerationRepository {
    func generateRecipeDraft(from input: RecipeGenerationInput) async throws -> RecipeDraft {
        throw TestPersistenceError.failed
    }
}

private enum TestPersistenceError: Error {
    case failed
}
