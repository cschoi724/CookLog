import XCTest
@testable import CookLog

@MainActor
final class CookingLogViewModelTests: XCTestCase {
    func testInitialState() {
        let viewModel = makeViewModel()

        XCTAssertTrue(viewModel.stepPreviews.isEmpty)
        XCTAssertEqual(viewModel.recordingState, .idle)
        XCTAssertEqual(viewModel.remainingSeconds, 0)
        XCTAssertNil(viewModel.pendingStepOrder)
        XCTAssertFalse(viewModel.canGenerateRecipeDraft)
        XCTAssertNil(viewModel.errorMessage)
    }

    func testRecordStepAddsStepPreviewAndIncrementsOrder() async {
        let viewModel = makeViewModel(transcripts: ["마늘을 볶았어", "토마토를 넣었어"])

        await viewModel.recordStep()
        await viewModel.recordStep()

        XCTAssertEqual(viewModel.stepPreviews.map(\.order), [1, 2])
        XCTAssertEqual(viewModel.stepPreviews.map(\.transcript), ["마늘을 볶았어", "토마토를 넣었어"])
        XCTAssertTrue(viewModel.canGenerateRecipeDraft)
        XCTAssertEqual(viewModel.saveFeedbackMessage, "STEP 2가 자동 저장됐어요.")
        XCTAssertNil(viewModel.errorMessage)
    }

    func testProcessingShowsNextPendingOrderAndAutoSavesSameRecord() async throws {
        let recordID = UUID()
        let existingStep = StepPreview(order: 1, transcript: "양파를 썰었어")
        let record = RecipeRecord(id: recordID, stepPreviews: [existingStep])
        let repository = CookingLogTestRecipeRecordRepository(record: record)
        let speechService = ControllableSpeechRecognitionService()
        let viewModel = makeViewModel(
            speechRecognitionService: speechService,
            record: record,
            repository: repository
        )

        let recordingTask = Task { await viewModel.recordStep() }
        await waitUntil { viewModel.recordingState == .processing }

        XCTAssertEqual(viewModel.pendingStepOrder, 2)
        XCTAssertEqual(viewModel.remainingSeconds, 0)
        XCTAssertEqual(viewModel.stepPreviews, [existingStep])

        await speechService.finish(with: .success("간장을 넣었어"))
        await recordingTask.value

        let fetchedRecord = try await repository.fetchRecord(id: recordID)
        let storedRecord = try XCTUnwrap(fetchedRecord)
        XCTAssertEqual(storedRecord.id, recordID)
        XCTAssertEqual(storedRecord.stepPreviews.map(\.order), [1, 2])
        XCTAssertEqual(storedRecord.stepPreviews.map(\.transcript), ["양파를 썰었어", "간장을 넣었어"])
        XCTAssertNil(viewModel.pendingStepOrder)
        XCTAssertEqual(viewModel.recordingState, .idle)
    }

    func testRecognitionFailureRemovesOnlyPendingAndPreservesCompletedSteps() async throws {
        let recordID = UUID()
        let existingSteps = [
            StepPreview(order: 1, transcript: "감자를 썰었어"),
            StepPreview(order: 2, transcript: "물을 부었어")
        ]
        let record = RecipeRecord(id: recordID, stepPreviews: existingSteps)
        let repository = CookingLogTestRecipeRecordRepository(record: record)
        let viewModel = makeViewModel(
            speechRecognitionService: FailingSpeechRecognitionService(),
            record: record,
            repository: repository
        )

        await viewModel.recordStep()

        let fetchedRecord = try await repository.fetchRecord(id: recordID)
        let storedRecord = try XCTUnwrap(fetchedRecord)
        XCTAssertEqual(viewModel.stepPreviews, existingSteps)
        XCTAssertEqual(storedRecord.stepPreviews, existingSteps)
        XCTAssertNil(viewModel.pendingStepOrder)
        XCTAssertEqual(viewModel.recordingState, .idle)
        XCTAssertNotNil(viewModel.errorMessage)
    }

    func testPersistenceFailureDoesNotExposeOrPersistNewStep() async throws {
        let recordID = UUID()
        let existingStep = StepPreview(order: 1, transcript: "두부를 잘랐어")
        let record = RecipeRecord(id: recordID, stepPreviews: [existingStep])
        let repository = CookingLogTestRecipeRecordRepository(record: record)
        await repository.setSaveFailureEnabled(true)
        let viewModel = makeViewModel(
            transcripts: ["대파를 넣었어"],
            record: record,
            repository: repository
        )

        await viewModel.recordStep()

        let fetchedRecord = try await repository.fetchRecord(id: recordID)
        let storedRecord = try XCTUnwrap(fetchedRecord)
        XCTAssertEqual(viewModel.stepPreviews, [existingStep])
        XCTAssertEqual(storedRecord.stepPreviews, [existingStep])
        XCTAssertNil(viewModel.pendingStepOrder)
        XCTAssertNotNil(viewModel.errorMessage)
    }

    func testDeniedAuthorizationShowsRecoveryWithoutChangingSteps() async {
        let existingStep = StepPreview(order: 1, transcript: "재료를 준비했어")
        let record = RecipeRecord(stepPreviews: [existingStep])
        let viewModel = makeViewModel(
            speechRecognitionService: AuthorizationSpeechRecognitionService(status: .denied),
            record: record
        )

        await viewModel.recordStep()

        XCTAssertEqual(viewModel.recordingState, .idle)
        XCTAssertEqual(viewModel.stepPreviews, [existingStep])
        XCTAssertTrue(viewModel.errorMessage?.contains("권한") == true)
        XCTAssertTrue(viewModel.canGenerateRecipeDraft)
    }

    func testDeleteAutoSavesReorderedStepsAndUndoRestoresOriginalPosition() async throws {
        let steps = [
            StepPreview(order: 1, transcript: "첫 단계"),
            StepPreview(order: 2, transcript: "둘째 단계"),
            StepPreview(order: 3, transcript: "셋째 단계")
        ]
        let record = RecipeRecord(stepPreviews: steps)
        let repository = CookingLogTestRecipeRecordRepository(record: record)
        let viewModel = makeViewModel(record: record, repository: repository)

        let didDelete = await viewModel.deleteStep(steps[1])

        XCTAssertTrue(didDelete)
        XCTAssertEqual(viewModel.stepPreviews.map(\.id), [steps[0].id, steps[2].id])
        XCTAssertEqual(viewModel.stepPreviews.map(\.order), [1, 2])
        XCTAssertTrue(viewModel.canUndoDeletion)
        let fetchedDeletedRecord = try await repository.fetchRecord(id: record.id)
        let deletedRecord = try XCTUnwrap(fetchedDeletedRecord)
        XCTAssertEqual(deletedRecord.stepPreviews, viewModel.stepPreviews)

        let didUndo = await viewModel.undoLastDeletion()

        XCTAssertTrue(didUndo)
        XCTAssertEqual(viewModel.stepPreviews.map(\.id), steps.map(\.id))
        XCTAssertEqual(viewModel.stepPreviews.map(\.order), [1, 2, 3])
        XCTAssertFalse(viewModel.canUndoDeletion)
        let fetchedRestoredRecord = try await repository.fetchRecord(id: record.id)
        let restoredRecord = try XCTUnwrap(fetchedRestoredRecord)
        XCTAssertEqual(restoredRecord.stepPreviews, viewModel.stepPreviews)
    }

    func testDeleteFailurePreservesOriginalSessionAndRecord() async throws {
        let steps = [
            StepPreview(order: 1, transcript: "첫 단계"),
            StepPreview(order: 2, transcript: "둘째 단계")
        ]
        let record = RecipeRecord(stepPreviews: steps)
        let repository = CookingLogTestRecipeRecordRepository(record: record)
        await repository.setSaveFailureEnabled(true)
        let viewModel = makeViewModel(record: record, repository: repository)

        let didDelete = await viewModel.deleteStep(steps[0])

        XCTAssertFalse(didDelete)
        XCTAssertEqual(viewModel.stepPreviews, steps)
        XCTAssertFalse(viewModel.canUndoDeletion)
        XCTAssertNotNil(viewModel.errorMessage)
        let fetchedRecord = try await repository.fetchRecord(id: record.id)
        let storedRecord = try XCTUnwrap(fetchedRecord)
        XCTAssertEqual(storedRecord.stepPreviews, steps)
    }

    func testUndoAvailabilityExpiresWithoutChangingSavedDeletion() async throws {
        let step = StepPreview(order: 1, transcript: "삭제할 단계")
        let record = RecipeRecord(stepPreviews: [step])
        let repository = CookingLogTestRecipeRecordRepository(record: record)
        let viewModel = makeViewModel(
            record: record,
            repository: repository,
            undoDurationNanoseconds: 1_000_000
        )

        let didDelete = await viewModel.deleteStep(step)
        XCTAssertTrue(didDelete)
        try await Task.sleep(nanoseconds: 10_000_000)

        XCTAssertFalse(viewModel.canUndoDeletion)
        let didUndo = await viewModel.undoLastDeletion()
        XCTAssertFalse(didUndo)
        let fetchedRecord = try await repository.fetchRecord(id: record.id)
        let storedRecord = try XCTUnwrap(fetchedRecord)
        XCTAssertTrue(storedRecord.stepPreviews.isEmpty)
    }

    func testRecipeDraftSnapshotMatchesAccumulatedStepArray() {
        let steps = [
            StepPreview(order: 1, transcript: "첫 단계"),
            StepPreview(order: 2, transcript: "둘째 단계")
        ]
        let viewModel = makeViewModel(record: RecipeRecord(stepPreviews: steps))

        XCTAssertEqual(viewModel.recipeDraftSnapshot, steps)
    }

    private func makeViewModel(
        transcripts: [String] = ["마늘을 볶았어"],
        record: RecipeRecord = RecipeRecord(),
        repository: CookingLogTestRecipeRecordRepository? = nil,
        undoDurationNanoseconds: UInt64 = 5_000_000_000
    ) -> CookingLogViewModel {
        makeViewModel(
            speechRecognitionService: MockSpeechRecognitionService(transcripts: transcripts),
            record: record,
            repository: repository,
            undoDurationNanoseconds: undoDurationNanoseconds
        )
    }

    private func makeViewModel(
        speechRecognitionService: SpeechRecognitionService,
        record: RecipeRecord,
        repository: CookingLogTestRecipeRecordRepository? = nil,
        undoDurationNanoseconds: UInt64 = 5_000_000_000
    ) -> CookingLogViewModel {
        let resolvedRepository = repository ?? CookingLogTestRecipeRecordRepository(record: record)
        return CookingLogViewModel(
            speechRecognitionService: speechRecognitionService,
            addStepPreviewUseCase: AddStepPreviewUseCase(),
            saveStepPreviewDraftUseCase: SaveStepPreviewDraftUseCase(repository: resolvedRepository),
            session: CookingLogSession(id: record.id, stepPreviews: record.stepPreviews),
            recordingDurationSeconds: 0,
            undoDurationNanoseconds: undoDurationNanoseconds
        )
    }

    private func waitUntil(
        timeoutNanoseconds: UInt64 = 1_000_000_000,
        condition: @escaping @MainActor () -> Bool
    ) async {
        let deadline = ContinuousClock.now + .nanoseconds(Int64(timeoutNanoseconds))
        while !condition(), ContinuousClock.now < deadline {
            await Task.yield()
        }
        XCTAssertTrue(condition())
    }
}

private struct FailingSpeechRecognitionService: SpeechRecognitionService {
    func requestAuthorization() async -> SpeechAuthorizationStatus { .authorized }

    func transcribeTenSecondRecording() async throws -> String {
        throw CookingLogTestError.speechFailure
    }
}

private struct AuthorizationSpeechRecognitionService: SpeechRecognitionService {
    let status: SpeechAuthorizationStatus

    func requestAuthorization() async -> SpeechAuthorizationStatus { status }
    func transcribeTenSecondRecording() async throws -> String { "사용되지 않음" }
}

private actor ControllableSpeechRecognitionService: SpeechRecognitionService {
    private var continuation: CheckedContinuation<String, Error>?

    func requestAuthorization() async -> SpeechAuthorizationStatus { .authorized }

    func transcribeTenSecondRecording() async throws -> String {
        try await withCheckedThrowingContinuation { continuation in
            self.continuation = continuation
        }
    }

    func finish(with result: Result<String, Error>) {
        continuation?.resume(with: result)
        continuation = nil
    }
}

private enum CookingLogTestError: Error {
    case speechFailure
    case saveFailure
}

private actor CookingLogTestRecipeRecordRepository: RecipeRecordRepository {
    private var record: RecipeRecord?
    private var saveFailureEnabled = false

    init(record: RecipeRecord) {
        self.record = record
    }

    func setSaveFailureEnabled(_ isEnabled: Bool) {
        saveFailureEnabled = isEnabled
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
        guard !saveFailureEnabled else {
            throw CookingLogTestError.saveFailure
        }
        self.record = record
    }

    func deleteRecord(id: UUID) async throws {
        if record?.id == id {
            record = nil
        }
    }
}
