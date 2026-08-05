import XCTest
@testable import CookLog

@MainActor
final class HomeViewModelTests: XCTestCase {
    func testLoadRecordsShowsThreeMostRecentMixedLifecycleRecords() async throws {
        let records = try makeMixedRecords()
        let repository = HomeTestRecipeRecordRepository(records: records)
        let viewModel = makeViewModel(repository: repository)

        await viewModel.loadRecords()

        XCTAssertEqual(viewModel.records.map(\.id), records.sorted { $0.updatedAt > $1.updatedAt }.map(\.id))
        XCTAssertEqual(viewModel.recentRecords.count, 3)
        XCTAssertFalse(viewModel.isEmpty)
        XCTAssertNil(viewModel.loadErrorMessage)
    }

    func testLoadRecordsExposesLoadingAndEmptyStates() async {
        let repository = HomeTestRecipeRecordRepository(records: [], fetchDelayNanoseconds: 100_000_000)
        let viewModel = makeViewModel(repository: repository)

        let loadTask = Task { await viewModel.loadRecords() }
        await Task.yield()

        XCTAssertTrue(viewModel.isLoading)
        XCTAssertFalse(viewModel.isEmpty)

        await loadTask.value

        XCTAssertFalse(viewModel.isLoading)
        XCTAssertTrue(viewModel.isEmpty)
    }

    func testRefreshFailurePreservesPreviouslyLoadedRecordsAndRetryRecovers() async throws {
        let records = try makeMixedRecords()
        let repository = HomeTestRecipeRecordRepository(records: records)
        let viewModel = makeViewModel(repository: repository)
        await viewModel.loadRecords()
        await repository.setFetchErrorEnabled(true)

        await viewModel.loadRecords()

        XCTAssertEqual(viewModel.records, records.sorted { $0.updatedAt > $1.updatedAt })
        XCTAssertEqual(viewModel.loadErrorMessage, "요리 기록을 불러오지 못했습니다.")

        await repository.setFetchErrorEnabled(false)
        await viewModel.loadRecords()

        XCTAssertEqual(viewModel.records, records.sorted { $0.updatedAt > $1.updatedAt })
        XCTAssertNil(viewModel.loadErrorMessage)
    }

    func testSearchPrioritizesTitleThenIngredientAndExcludesStepPreviewDraft() async throws {
        let titleMatch = RecipeRecord(completedRecipe: makeRecipe(
            title: "두부조림",
            ingredients: [Ingredient(name: "고춧가루")],
            updatedAt: Date(timeIntervalSince1970: 100)
        ))
        let ingredientMatch = RecipeRecord(completedRecipe: makeRecipe(
            title: "된장찌개",
            ingredients: [Ingredient(name: "두부")],
            updatedAt: Date(timeIntervalSince1970: 300)
        ))
        let stepDraft = RecipeRecord(
            id: UUID(),
            stepPreviews: [StepPreview(order: 1, transcript: "두부를 썰었어")],
            createdAt: Date(timeIntervalSince1970: 200),
            updatedAt: Date(timeIntervalSince1970: 200)
        )
        let repository = HomeTestRecipeRecordRepository(records: [ingredientMatch, stepDraft, titleMatch])
        let viewModel = makeViewModel(repository: repository)
        await viewModel.loadRecords()

        let results = viewModel.searchResults(for: " 두부 ")

        XCTAssertEqual(results.map(\.record.id), [titleMatch.id, ingredientMatch.id])
        XCTAssertEqual(results.map(\.match), [.title, .ingredient])
    }

    func testBlankSearchReturnsEveryRecordInRecentActivityOrder() async throws {
        let records = try makeMixedRecords()
        let repository = HomeTestRecipeRecordRepository(records: records)
        let viewModel = makeViewModel(repository: repository)
        await viewModel.loadRecords()

        let results = viewModel.searchResults(for: "  ")

        XCTAssertEqual(results.map(\.record.id), records.sorted { $0.updatedAt > $1.updatedAt }.map(\.id))
        XCTAssertTrue(results.allSatisfy { $0.match == nil })
    }

    func testLifecycleDestinationAndAppRouteKeepSameRecordIdentifier() async throws {
        let records = try makeMixedRecords()
        let repository = HomeTestRecipeRecordRepository(records: records)
        let viewModel = makeViewModel(repository: repository)

        for record in records {
            let destination = viewModel.destination(for: record)
            let route = AppRoute(destination)

            switch (record.lifecycleState, route) {
            case (.draftStepPreview, .cookingLog(let recordID, let stepPreviews)):
                XCTAssertEqual(recordID, record.id)
                XCTAssertEqual(stepPreviews, record.stepPreviews)
            case (.draftAIReview, .aiReview(let recordID, let stepPreviews)):
                XCTAssertEqual(recordID, record.id)
                XCTAssertEqual(stepPreviews, record.stepPreviews)
            case (.completed, .recipeDetail(let recordID)):
                XCTAssertEqual(recordID, record.id)
            default:
                XCTFail("lifecycle에 맞는 route가 아닙니다: \(route)")
            }
        }
    }

    func testStartNewRecordPersistsAndRoutesCreatedIdentifier() async {
        let repository = HomeTestRecipeRecordRepository(records: [])
        let viewModel = makeViewModel(repository: repository)

        let destination = await viewModel.startNewRecord()
        let savedRecords = try? await repository.fetchRecords()

        guard case .cookingLog(let recordID, let stepPreviews) = destination else {
            return XCTFail("새 record는 Cooking Log로 이동해야 합니다.")
        }
        XCTAssertEqual(savedRecords?.map(\.id), [recordID])
        XCTAssertEqual(viewModel.records.map(\.id), [recordID])
        XCTAssertTrue(stepPreviews.isEmpty)
    }

    func testDeletingProgressRecordRemovesSameIdentifierAndBackfillsRecentRecords() async throws {
        let records = try makeMixedRecords()
        let repository = HomeTestRecipeRecordRepository(records: records)
        let viewModel = makeViewModel(repository: repository)
        await viewModel.loadRecords()
        let recordToDelete = try XCTUnwrap(viewModel.recentRecords.first)

        let didDelete = await viewModel.deleteRecord(recordToDelete)
        let storedRecord = try await repository.fetchRecord(id: recordToDelete.id)

        XCTAssertTrue(didDelete)
        XCTAssertNil(storedRecord)
        XCTAssertFalse(viewModel.records.contains { $0.id == recordToDelete.id })
        XCTAssertEqual(viewModel.recentRecords.count, 3)
        XCTAssertEqual(viewModel.recentRecords.map(\.id), Array(viewModel.records.prefix(3)).map(\.id))
    }

    func testDeletionFailurePreservesRecordAndRetriesOnlyFailedIdentifier() async throws {
        let records = try makeMixedRecords()
        let repository = HomeTestRecipeRecordRepository(records: records)
        let viewModel = makeViewModel(repository: repository)
        await viewModel.loadRecords()
        let recordToDelete = try XCTUnwrap(records.first { $0.lifecycleState == .draftAIReview })
        await repository.setDeleteFailureEnabled(true, for: recordToDelete.id)

        let firstAttempt = await viewModel.deleteRecord(recordToDelete)

        XCTAssertFalse(firstAttempt)
        XCTAssertTrue(viewModel.records.contains { $0.id == recordToDelete.id })
        XCTAssertNotNil(viewModel.deletionErrorMessage)
        let firstDeleteAttempts = await repository.deletedIdentifiers()
        XCTAssertEqual(firstDeleteAttempts, [recordToDelete.id])

        await repository.setDeleteFailureEnabled(false, for: recordToDelete.id)
        let retry = await viewModel.retryFailedDeletion()

        XCTAssertTrue(retry)
        XCTAssertFalse(viewModel.records.contains { $0.id == recordToDelete.id })
        let retriedDeleteAttempts = await repository.deletedIdentifiers()
        XCTAssertEqual(retriedDeleteAttempts, [recordToDelete.id, recordToDelete.id])
    }

    func testCompletedRecordCannotUseProgressDeletionPath() async throws {
        let completedRecord = RecipeRecord(completedRecipe: makeRecipe(
            title: "완료 레시피",
            ingredients: [Ingredient(name: "감자")],
            updatedAt: Date(timeIntervalSince1970: 100)
        ))
        let repository = HomeTestRecipeRecordRepository(records: [completedRecord])
        let viewModel = makeViewModel(repository: repository)
        await viewModel.loadRecords()

        let didDelete = await viewModel.deleteRecord(completedRecord)
        let deleteAttempts = await repository.deletedIdentifiers()

        XCTAssertFalse(didDelete)
        XCTAssertEqual(viewModel.records, [completedRecord])
        XCTAssertTrue(deleteAttempts.isEmpty)
    }

    func testReviewReadyBannerRecordKeepsIdentifierAcrossRefresh() async throws {
        let records = try makeMixedRecords()
        let repository = HomeTestRecipeRecordRepository(records: records)
        let viewModel = makeViewModel(repository: repository)
        await viewModel.loadRecords()
        let firstReadyRecord = try XCTUnwrap(viewModel.reviewReadyRecord)

        await viewModel.loadRecords()
        let refreshedReadyRecord = try XCTUnwrap(viewModel.reviewReadyRecord)

        XCTAssertEqual(refreshedReadyRecord.id, firstReadyRecord.id)
        XCTAssertEqual(
            viewModel.destination(for: refreshedReadyRecord),
            .aiReview(recordID: firstReadyRecord.id, stepPreviews: firstReadyRecord.stepPreviews)
        )
        let refreshCreateAttempts = await repository.createAttemptCount()
        XCTAssertEqual(refreshCreateAttempts, 0)
    }

    func testCardMetadataUsesIngredientsActivityTimeAndStepsWithoutCompletedBadge() throws {
        let recipe = Recipe(
            title: "재료가 많은 레시피",
            ingredients: ["감자", "양파", "당근", "대파"].map { Ingredient(name: $0) },
            steps: [
                RecipeStep(order: 1, text: "썰기"),
                RecipeStep(order: 2, text: "끓이기")
            ],
            estimatedTime: 20 * 60,
            createdAt: Date(timeIntervalSince1970: 50),
            updatedAt: Date(timeIntervalSince1970: 100)
        )
        let row = RecipeRecordRowView(record: RecipeRecord(completedRecipe: recipe))

        XCTAssertNil(row.stateLabel)
        XCTAssertEqual(row.metadataLines.first, "감자 · 양파 · 당근")
        XCTAssertTrue(row.metadataLines.last?.contains("약 20분") == true)
        XCTAssertTrue(row.metadataLines.last?.contains("2단계") == true)
        XCTAssertTrue(row.metadataLines.last?.contains("최근 활동") == true)

        var reviewRecord = RecipeRecord(
            stepPreviews: [StepPreview(order: 1, transcript: "재료를 준비했어")],
            createdAt: Date(timeIntervalSince1970: 50),
            updatedAt: Date(timeIntervalSince1970: 50)
        )
        try reviewRecord.beginAIProcessing(requestID: UUID(), updatedAt: Date(timeIntervalSince1970: 75))
        try reviewRecord.finishAIProcessing(
            with: RecipeDraft(
                title: "검토 레시피",
                ingredients: ["두부", "대파", "간장", "참기름"].map { Ingredient(name: $0) },
                steps: [RecipeStep(order: 1, text: "조리")]
            ),
            updatedAt: Date(timeIntervalSince1970: 100)
        )
        let reviewRow = RecipeRecordRowView(record: reviewRecord)

        XCTAssertEqual(reviewRow.stateLabel, "검토 준비됨")
        XCTAssertEqual(reviewRow.metadataLines.first, "두부 · 대파 · 간장")
        XCTAssertTrue(reviewRow.metadataLines.last?.contains("최근 활동") == true)
    }

    func testCreationFailureUsesDedicatedErrorAndRetriesOnlyCreation() async {
        let repository = HomeTestRecipeRecordRepository(records: [])
        let viewModel = makeViewModel(repository: repository)
        await repository.failNextCreate()

        let failedDestination = await viewModel.startNewRecord()

        XCTAssertNil(failedDestination)
        XCTAssertNil(viewModel.loadErrorMessage)
        XCTAssertNotNil(viewModel.creationErrorMessage)
        XCTAssertTrue(viewModel.records.isEmpty)
        let failedCreateAttempts = await repository.createAttemptCount()
        XCTAssertEqual(failedCreateAttempts, 1)

        let retriedDestination = await viewModel.startNewRecord()

        guard case .cookingLog(let recordID, _) = retriedDestination else {
            return XCTFail("생성 재시도는 새 Cooking Log record로 이동해야 합니다.")
        }
        XCTAssertNil(viewModel.creationErrorMessage)
        XCTAssertEqual(viewModel.records.map(\.id), [recordID])
        let retriedCreateAttempts = await repository.createAttemptCount()
        XCTAssertEqual(retriedCreateAttempts, 2)
    }

    private func makeViewModel(repository: HomeTestRecipeRecordRepository) -> HomeViewModel {
        HomeViewModel(
            fetchRecordsUseCase: FetchRecipeRecordsUseCase(repository: repository),
            createRecordUseCase: CreateRecipeRecordUseCase(repository: repository),
            deleteRecordUseCase: DeleteRecipeRecordUseCase(repository: repository)
        )
    }

    private func makeMixedRecords() throws -> [RecipeRecord] {
        let stepDraft = RecipeRecord(
            id: UUID(),
            stepPreviews: [StepPreview(order: 1, transcript: "양파를 썰었어")],
            createdAt: Date(timeIntervalSince1970: 100),
            updatedAt: Date(timeIntervalSince1970: 400)
        )
        var reviewDraft = RecipeRecord(
            id: UUID(),
            stepPreviews: [StepPreview(order: 1, transcript: "두부를 구웠어")],
            createdAt: Date(timeIntervalSince1970: 100),
            updatedAt: Date(timeIntervalSince1970: 200)
        )
        try reviewDraft.beginAIProcessing(requestID: UUID(), updatedAt: Date(timeIntervalSince1970: 250))
        try reviewDraft.finishAIProcessing(
            with: RecipeDraft(
                title: "두부구이",
                ingredients: [Ingredient(name: "두부")],
                steps: [RecipeStep(order: 1, text: "굽기")]
            ),
            updatedAt: Date(timeIntervalSince1970: 300)
        )
        let completed = RecipeRecord(completedRecipe: makeRecipe(
            title: "완료 레시피",
            ingredients: [Ingredient(name: "감자")],
            updatedAt: Date(timeIntervalSince1970: 200)
        ))
        let olderCompleted = RecipeRecord(completedRecipe: makeRecipe(
            title: "오래된 레시피",
            ingredients: [Ingredient(name: "달걀")],
            updatedAt: Date(timeIntervalSince1970: 100)
        ))
        return [stepDraft, reviewDraft, completed, olderCompleted]
    }

    private func makeRecipe(
        title: String,
        ingredients: [Ingredient],
        updatedAt: Date
    ) -> Recipe {
        Recipe(
            title: title,
            ingredients: ingredients,
            steps: [RecipeStep(order: 1, text: "조리")],
            createdAt: Date(timeIntervalSince1970: 50),
            updatedAt: updatedAt
        )
    }
}

private enum HomeTestRepositoryError: Error {
    case fetchFailed
    case createFailed
    case deleteFailed
}

private actor HomeTestRecipeRecordRepository: RecipeRecordRepository {
    private var recordsByID: [UUID: RecipeRecord]
    private var fetchErrorEnabled = false
    private var shouldFailNextCreate = false
    private var deleteFailureIDs: Set<UUID> = []
    private var createAttempts = 0
    private var deleteAttempts: [UUID] = []
    private let fetchDelayNanoseconds: UInt64

    init(records: [RecipeRecord], fetchDelayNanoseconds: UInt64 = 0) {
        recordsByID = Dictionary(uniqueKeysWithValues: records.map { ($0.id, $0) })
        self.fetchDelayNanoseconds = fetchDelayNanoseconds
    }

    func setFetchErrorEnabled(_ isEnabled: Bool) {
        fetchErrorEnabled = isEnabled
    }

    func failNextCreate() {
        shouldFailNextCreate = true
    }

    func setDeleteFailureEnabled(_ isEnabled: Bool, for id: UUID) {
        if isEnabled {
            deleteFailureIDs.insert(id)
        } else {
            deleteFailureIDs.remove(id)
        }
    }

    func createAttemptCount() -> Int {
        createAttempts
    }

    func deletedIdentifiers() -> [UUID] {
        deleteAttempts
    }

    func fetchRecords() async throws -> [RecipeRecord] {
        if fetchDelayNanoseconds > 0 {
            try await Task.sleep(nanoseconds: fetchDelayNanoseconds)
        }
        guard !fetchErrorEnabled else {
            throw HomeTestRepositoryError.fetchFailed
        }
        return recordsByID.values.sorted { $0.updatedAt > $1.updatedAt }
    }

    func fetchRecord(id: UUID) async throws -> RecipeRecord? {
        recordsByID[id]
    }

    func createRecord(_ record: RecipeRecord) async throws {
        createAttempts += 1
        if shouldFailNextCreate {
            shouldFailNextCreate = false
            throw HomeTestRepositoryError.createFailed
        }
        guard recordsByID[record.id] == nil else {
            throw RecipeRecordRepositoryError.recordAlreadyExists(record.id)
        }
        recordsByID[record.id] = record
    }

    func saveRecord(_ record: RecipeRecord) async throws {
        recordsByID[record.id] = record
    }

    func deleteRecord(id: UUID) async throws {
        deleteAttempts.append(id)
        guard !deleteFailureIDs.contains(id) else {
            throw HomeTestRepositoryError.deleteFailed
        }
        recordsByID[id] = nil
    }
}
