import XCTest
@testable import CookLog

@MainActor
final class CookingLogViewModelTests: XCTestCase {
    func testInitialState() {
        let viewModel = makeViewModel()

        XCTAssertTrue(viewModel.stepPreviews.isEmpty)
        XCTAssertEqual(viewModel.recordingState, .idle)
        XCTAssertEqual(viewModel.remainingSeconds, 0)
        XCTAssertFalse(viewModel.canGenerateRecipeDraft)
        XCTAssertNil(viewModel.errorMessage)
    }

    func testRecordStepAddsStepPreview() async {
        let viewModel = makeViewModel(transcripts: ["마늘을 볶았어"])

        await viewModel.recordStep()

        XCTAssertEqual(viewModel.stepPreviews.count, 1)
        XCTAssertEqual(viewModel.stepPreviews[0].order, 1)
        XCTAssertEqual(viewModel.stepPreviews[0].transcript, "마늘을 볶았어")
        XCTAssertTrue(viewModel.canGenerateRecipeDraft)
        XCTAssertNil(viewModel.errorMessage)
    }

    func testRecordStepIncrementsOrder() async {
        let viewModel = makeViewModel(transcripts: ["마늘을 볶았어", "토마토를 넣었어"])

        await viewModel.recordStep()
        await viewModel.recordStep()

        XCTAssertEqual(viewModel.stepPreviews.map(\.order), [1, 2])
        XCTAssertEqual(viewModel.stepPreviews.map(\.transcript), ["마늘을 볶았어", "토마토를 넣었어"])
    }

    func testRecordStepSetsErrorMessageWhenSpeechFails() async {
        let viewModel = CookingLogViewModel(
            speechRecognitionService: FailingSpeechRecognitionService(),
            addStepPreviewUseCase: AddStepPreviewUseCase(),
            recordingDurationSeconds: 0
        )

        await viewModel.recordStep()

        XCTAssertTrue(viewModel.stepPreviews.isEmpty)
        XCTAssertEqual(viewModel.recordingState, .idle)
        XCTAssertEqual(viewModel.errorMessage, "음성 기록에 실패했습니다. 다시 시도해주세요.")
    }

    private func makeViewModel(
        transcripts: [String] = ["마늘을 볶았어"]
    ) -> CookingLogViewModel {
        CookingLogViewModel(
            speechRecognitionService: MockSpeechRecognitionService(transcripts: transcripts),
            addStepPreviewUseCase: AddStepPreviewUseCase(),
            recordingDurationSeconds: 0
        )
    }
}

private struct FailingSpeechRecognitionService: SpeechRecognitionService {
    func requestAuthorization() async -> SpeechAuthorizationStatus {
        .authorized
    }

    func transcribeTenSecondRecording() async throws -> String {
        throw SpeechFailure()
    }
}

private struct SpeechFailure: Error {}
