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
        XCTAssertNil(viewModel.errorMessage)
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
        XCTAssertEqual(viewModel.errorMessage, "요리 기록을 불러오지 못했습니다.")

        await repository.setFetchErrorEnabled(false)
        await viewModel.loadRecords()

        XCTAssertEqual(viewModel.records, records.sorted { $0.updatedAt > $1.updatedAt })
        XCTAssertNil(viewModel.errorMessage)
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

    private func makeViewModel(repository: HomeTestRecipeRecordRepository) -> HomeViewModel {
        HomeViewModel(
            fetchRecordsUseCase: FetchRecipeRecordsUseCase(repository: repository),
            createRecordUseCase: CreateRecipeRecordUseCase(repository: repository)
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
}

private actor HomeTestRecipeRecordRepository: RecipeRecordRepository {
    private var recordsByID: [UUID: RecipeRecord]
    private var fetchErrorEnabled = false
    private let fetchDelayNanoseconds: UInt64

    init(records: [RecipeRecord], fetchDelayNanoseconds: UInt64 = 0) {
        recordsByID = Dictionary(uniqueKeysWithValues: records.map { ($0.id, $0) })
        self.fetchDelayNanoseconds = fetchDelayNanoseconds
    }

    func setFetchErrorEnabled(_ isEnabled: Bool) {
        fetchErrorEnabled = isEnabled
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
        guard recordsByID[record.id] == nil else {
            throw RecipeRecordRepositoryError.recordAlreadyExists(record.id)
        }
        recordsByID[record.id] = record
    }

    func saveRecord(_ record: RecipeRecord) async throws {
        recordsByID[record.id] = record
    }

    func deleteRecord(id: UUID) async throws {
        recordsByID[id] = nil
    }
}
