import XCTest
@testable import CookLog

final class CookLogTests: XCTestCase {
    func testAppTargetIsAvailable() {
        XCTAssertTrue(true)
    }

    func testAppInfoPlaceholderDoesNotInventOperationalLinks() {
        let configuration = AppInfoConfiguration.releasePlaceholder

        XCTAssertNil(configuration.supportEmail)
        XCTAssertNil(configuration.url(for: .privacy))
        XCTAssertNil(configuration.url(for: .terms))
        XCTAssertEqual(configuration.appVersion, "1.0.0")
    }

    func testAppInfoStateContractContainsElevenDesignStates() {
        let states: [AppInfoState] = [
            .overview,
            .dataRetention,
            .contactConsent,
            .contactReady(includeDiagnostics: false),
            .mailUnavailable,
            .legalLoading(.privacy),
            .legalUnconfigured(.privacy),
            .legalOpenError(.privacy),
            .legalLoading(.terms),
            .legalUnconfigured(.terms),
            .legalOpenError(.terms)
        ]

        XCTAssertEqual(states.count, 11)
        XCTAssertEqual(Set(states).count, 11)
    }

    func testHomeNetworkErrorRecheckDoesNotAutomaticallyRetryFailedAction() {
        let state = HomeNetworkErrorState()

        XCTAssertEqual(state.retryTitle, "연결 다시 확인")
        XCTAssertFalse(state.automaticallyRetriesFailedAction)
        XCTAssertTrue(state.message.contains("진행 기록"))
        XCTAssertTrue(state.message.contains("완료 레시피"))
        XCTAssertTrue(state.message.contains("검색"))
        XCTAssertTrue(state.message.contains("버튼 Audio Guide"))
    }

    func testSupportMailDraftIncludesOnlyAppVersionByDefault() throws {
        let draft = SupportMailDraft(
            recipient: "support@example.com",
            appVersion: "1.2.3",
            includeDiagnostics: false,
            operatingSystemVersion: "iOS Test"
        )
        let url = try XCTUnwrap(draft.mailtoURL)

        XCTAssertEqual(url.scheme, "mailto")
        XCTAssertTrue(url.absoluteString.hasPrefix("mailto:support@example.com?"))
        XCTAssertTrue(draft.body.contains("앱 버전: CookLog 1.2.3"))
        XCTAssertFalse(draft.body.contains("OS 버전: iOS Test"))
        XCTAssertFalse(draft.body.contains("오류 발생 화면·시각:"))
        XCTAssertTrue(draft.body.contains("자동 첨부되지 않았습니다"))
    }

    func testSupportMailDraftAddsNonContentDiagnosticsOnlyAfterOptIn() {
        let draft = SupportMailDraft(
            recipient: "support@example.com",
            appVersion: "1.2.3",
            includeDiagnostics: true,
            operatingSystemVersion: "iOS Test"
        )

        XCTAssertTrue(draft.body.contains("OS 버전: iOS Test"))
        XCTAssertTrue(draft.body.contains("오류 발생 화면·시각: 사용자가 직접 작성"))
        XCTAssertTrue(draft.body.contains("비콘텐츠 진단 범주: 사용자 선택으로 포함"))
        XCTAssertFalse(draft.body.contains("레시피 내용:"))
        XCTAssertFalse(draft.body.contains("STT 본문:"))
        XCTAssertFalse(draft.body.contains("검색어:"))
    }

    func testRecipeRecordKeepsIdentifierAcrossDraftAndCompletion() throws {
        let recordID = UUID()
        let step = StepPreview(order: 1, transcript: "두부를 구웠어")
        let draft = makeDraft(title: "두부구이")
        let completedRecipe = draft.makeRecipe(
            id: recordID,
            createdAt: Date(timeIntervalSince1970: 100),
            updatedAt: Date(timeIntervalSince1970: 300)
        )
        var record = RecipeRecord(
            id: recordID,
            stepPreviews: [step],
            createdAt: Date(timeIntervalSince1970: 100),
            updatedAt: Date(timeIntervalSince1970: 100)
        )

        try record.beginAIProcessing(requestID: UUID(), updatedAt: Date(timeIntervalSince1970: 150))
        try record.finishAIProcessing(with: draft, updatedAt: Date(timeIntervalSince1970: 200))
        try record.complete(with: completedRecipe, updatedAt: Date(timeIntervalSince1970: 300))

        XCTAssertEqual(record.id, recordID)
        XCTAssertEqual(record.lifecycleState, .completed)
        XCTAssertEqual(record.completedRecipe?.id, recordID)
        XCTAssertTrue(record.stepPreviews.isEmpty)
        XCTAssertNil(record.reviewDraft)
    }

    func testRecipeRecordRejectsStepChangesWhileAISnapshotIsLocked() throws {
        let originalStep = StepPreview(order: 1, transcript: "기존 기록")
        var record = RecipeRecord(stepPreviews: [originalStep])
        try record.beginAIProcessing(requestID: UUID())

        XCTAssertThrowsError(
            try record.replaceStepPreviews([StepPreview(order: 1, transcript: "변경 기록")])
        ) { error in
            XCTAssertEqual(error as? RecipeRecordError, .stepPreviewSnapshotLocked)
        }
        XCTAssertEqual(record.stepPreviews, [originalStep])
    }

    func testSaveFailurePreservesLastSuccessfulStepPreviewSnapshot() async throws {
        let originalStep = StepPreview(order: 1, transcript: "마지막 성공 기록")
        let record = RecipeRecord(stepPreviews: [originalStep])
        let dataSource = FailingRecipeRecordLocalDataSource(records: [record])
        let repository = DefaultRecipeRecordRepository(localDataSource: dataSource)
        let useCase = SaveStepPreviewDraftUseCase(repository: repository)
        await dataSource.failNextSave()

        do {
            _ = try await useCase.execute(
                recordID: record.id,
                stepPreviews: [StepPreview(order: 1, transcript: "저장 실패 변경")]
            )
            XCTFail("저장 실패가 전달되어야 합니다.")
        } catch is TestPersistenceError {
            // Expected
        }

        let restored = try await repository.fetchRecord(id: record.id)
        XCTAssertEqual(restored?.stepPreviews, [originalStep])
    }

    func testCreatingDraftWithCompletedRecordIdentifierDoesNotOverwriteCompletedRecipe() async throws {
        let recordID = UUID()
        let completedRecipe = makeDraft(title: "보존되어야 할 완료 레시피").makeRecipe(
            id: recordID,
            createdAt: Date(timeIntervalSince1970: 100),
            updatedAt: Date(timeIntervalSince1970: 200)
        )
        let completedRecord = RecipeRecord(completedRecipe: completedRecipe)
        let dataSource = InMemoryRecipeRecordLocalDataSource(records: [completedRecord])
        let repository = DefaultRecipeRecordRepository(localDataSource: dataSource)
        let useCase = CreateRecipeRecordUseCase(repository: repository)

        do {
            _ = try await useCase.execute(
                id: recordID,
                createdAt: Date(timeIntervalSince1970: 300)
            )
            XCTFail("완료 record 식별자를 재사용한 역방향 전이는 거부되어야 합니다.")
        } catch {
            XCTAssertEqual(
                error as? RecipeRecordRepositoryError,
                .recordAlreadyExists(recordID)
            )
        }

        let restored = try await repository.fetchRecord(id: recordID)
        XCTAssertEqual(restored, completedRecord)
    }

    private func makeDraft(title: String) -> RecipeDraft {
        RecipeDraft(
            title: title,
            ingredients: [Ingredient(name: "두부", amountText: "1모")],
            steps: [RecipeStep(order: 1, text: "두부를 굽습니다.")],
            memo: "노릇하게",
            estimatedTime: 10 * 60
        )
    }
}

private enum TestPersistenceError: Error {
    case saveFailed
}

private actor FailingRecipeRecordLocalDataSource: RecipeRecordLocalDataSource {
    private var recordsByID: [UUID: RecipeRecord]
    private var shouldFailNextSave = false

    init(records: [RecipeRecord]) {
        recordsByID = Dictionary(uniqueKeysWithValues: records.map { ($0.id, $0) })
    }

    func failNextSave() {
        shouldFailNextSave = true
    }

    func fetchRecords() async throws -> [RecipeRecord] {
        Array(recordsByID.values)
    }

    func fetchRecord(id: UUID) async throws -> RecipeRecord? {
        recordsByID[id]
    }

    func createRecord(_ record: RecipeRecord) async throws {
        guard recordsByID[record.id] == nil else {
            throw RecipeRecordRepositoryError.recordAlreadyExists(record.id)
        }
        try save(record)
    }

    func saveRecord(_ record: RecipeRecord) async throws {
        try save(record)
    }

    private func save(_ record: RecipeRecord) throws {
        if shouldFailNextSave {
            shouldFailNextSave = false
            throw TestPersistenceError.saveFailed
        }
        recordsByID[record.id] = record
    }

    func deleteRecord(id: UUID) async throws {
        recordsByID[id] = nil
    }
}
