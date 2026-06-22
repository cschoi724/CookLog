import Foundation

@MainActor
final class CookingLogViewModel: ObservableObject {
    @Published private(set) var session: CookingLogSession
    @Published private(set) var recordingState: RecordingState = .idle
    @Published private(set) var remainingSeconds: Int
    @Published private(set) var errorMessage: String?
    @Published var infoMessage: String?

    var stepPreviews: [StepPreview] {
        session.stepPreviews.sorted { $0.order < $1.order }
    }

    var canGenerateRecipeDraft: Bool {
        !stepPreviews.isEmpty
    }

    var isRecording: Bool {
        recordingState == .recording || recordingState == .processing
    }

    private let speechRecognitionService: SpeechRecognitionService
    private let addStepPreviewUseCase: AddStepPreviewUseCase
    private let recordingDurationSeconds: Int

    init(
        speechRecognitionService: SpeechRecognitionService,
        addStepPreviewUseCase: AddStepPreviewUseCase,
        session: CookingLogSession = CookingLogSession(),
        recordingDurationSeconds: Int = 10
    ) {
        self.speechRecognitionService = speechRecognitionService
        self.addStepPreviewUseCase = addStepPreviewUseCase
        self.session = session
        self.recordingDurationSeconds = recordingDurationSeconds
        self.remainingSeconds = recordingDurationSeconds
    }

    func recordStep() async {
        guard !isRecording else {
            return
        }

        errorMessage = nil
        infoMessage = nil

        let authorizationStatus = await speechRecognitionService.requestAuthorization()
        guard authorizationStatus == .authorized else {
            errorMessage = "마이크 권한을 확인한 뒤 다시 시도해주세요."
            return
        }

        recordingState = .recording
        remainingSeconds = recordingDurationSeconds

        if recordingDurationSeconds > 0 {
            for seconds in stride(from: recordingDurationSeconds, through: 1, by: -1) {
                remainingSeconds = seconds
                try? await Task.sleep(nanoseconds: 1_000_000_000)
            }
        }

        recordingState = .processing

        do {
            let transcript = try await speechRecognitionService.transcribeTenSecondRecording()
            session = addStepPreviewUseCase.execute(transcript: transcript, to: session)
            remainingSeconds = recordingDurationSeconds
            recordingState = .idle
        } catch {
            errorMessage = "음성 기록에 실패했습니다. 다시 시도해주세요."
            remainingSeconds = recordingDurationSeconds
            recordingState = .idle
        }
    }

    func handleGenerateRecipeDraftTapped() {
        guard canGenerateRecipeDraft else {
            return
        }

        infoMessage = "AI 정리 화면은 M4에서 연결합니다."
    }
}
