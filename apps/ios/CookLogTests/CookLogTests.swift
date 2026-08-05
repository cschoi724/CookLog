import XCTest
@testable import CookLog

final class CookLogTests: XCTestCase {
    func testAppTargetIsAvailable() {
        XCTAssertTrue(true)
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
            // Expected: identifier collision or invalid backward transition.
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

    func saveRecord(_ record: RecipeRecord) async throws {
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
