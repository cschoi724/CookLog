import Foundation

@MainActor
final class CookingLogViewModel: ObservableObject {
    @Published private(set) var session: CookingLogSession
    @Published private(set) var recordingState: RecordingState = .idle
    @Published private(set) var remainingSeconds: Int
    @Published private(set) var pendingStepOrder: Int?
    @Published private(set) var errorMessage: String?
    @Published private(set) var errorRecoveryAction: CookingLogRecoveryAction = .none
    @Published private(set) var saveFeedbackMessage: String?
    @Published private(set) var isSavingDraft = false
    @Published private(set) var canUndoDeletion = false

    var stepPreviews: [StepPreview] {
        session.stepPreviews.sorted { $0.order < $1.order }
    }

    var canGenerateRecipeDraft: Bool {
        !stepPreviews.isEmpty && recordingState == .idle && !isSavingDraft
    }

    var recipeDraftSnapshot: [StepPreview] {
        stepPreviews
    }

    var isRecording: Bool {
        recordingState == .recording || recordingState == .processing
    }

    var nextStepOrder: Int {
        (stepPreviews.map(\.order).max() ?? 0) + 1
    }

    private let speechRecognitionService: SpeechRecognitionService
    private let addStepPreviewUseCase: AddStepPreviewUseCase
    private let deleteStepPreviewUseCase: DeleteStepPreviewUseCase
    private let restoreStepPreviewUseCase: RestoreStepPreviewUseCase
    private let saveStepPreviewDraftUseCase: SaveStepPreviewDraftUseCase
    private let recordingDurationSeconds: Int
    private let undoDurationNanoseconds: UInt64
    private var lastDeletion: DeletedStepPreview?
    private var undoExpirationTask: Task<Void, Never>?

    init(
        speechRecognitionService: SpeechRecognitionService,
        addStepPreviewUseCase: AddStepPreviewUseCase,
        saveStepPreviewDraftUseCase: SaveStepPreviewDraftUseCase,
        deleteStepPreviewUseCase: DeleteStepPreviewUseCase = DeleteStepPreviewUseCase(),
        restoreStepPreviewUseCase: RestoreStepPreviewUseCase = RestoreStepPreviewUseCase(),
        session: CookingLogSession = CookingLogSession(),
        recordingDurationSeconds: Int = 10,
        undoDurationNanoseconds: UInt64 = 5_000_000_000
    ) {
        self.speechRecognitionService = speechRecognitionService
        self.addStepPreviewUseCase = addStepPreviewUseCase
        self.saveStepPreviewDraftUseCase = saveStepPreviewDraftUseCase
        self.deleteStepPreviewUseCase = deleteStepPreviewUseCase
        self.restoreStepPreviewUseCase = restoreStepPreviewUseCase
        self.session = session
        self.recordingDurationSeconds = recordingDurationSeconds
        self.remainingSeconds = recordingDurationSeconds
        self.undoDurationNanoseconds = undoDurationNanoseconds
    }

    func recordStep() async {
        guard recordingState == .idle, !isSavingDraft else { return }

        clearTransientMessages()
        expireDeletionUndo()

        let authorizationStatus = await speechRecognitionService.requestAuthorization()
        guard authorizationStatus == .authorized else {
            errorMessage = authorizationErrorMessage(for: authorizationStatus)
            errorRecoveryAction = .recordAgain
            return
        }

        recordingState = .recording
        remainingSeconds = recordingDurationSeconds

        if recordingDurationSeconds > 0 {
            for seconds in stride(from: recordingDurationSeconds, through: 1, by: -1) {
                remainingSeconds = seconds
                do {
                    try await Task.sleep(nanoseconds: 1_000_000_000)
                } catch {
                    resetRecordingState()
                    return
                }
            }
        }

        remainingSeconds = 0
        recordingState = .processing
        pendingStepOrder = nextStepOrder

        let transcript: String
        do {
            transcript = try await speechRecognitionService.transcribeTenSecondRecording()
        } catch {
            pendingStepOrder = nil
            errorMessage = "음성 기록을 처리하지 못했습니다. 기존 STEP은 그대로 보존됩니다."
            errorRecoveryAction = .recordAgain
            resetRecordingState()
            return
        }

        let candidateSession = addStepPreviewUseCase.execute(transcript: transcript, to: session)
        do {
            try await persist(candidateSession)
            session = candidateSession
            saveFeedbackMessage = "STEP \(candidateSession.stepPreviews.count)가 자동 저장됐어요."
            resetRecordingState()
        } catch {
            pendingStepOrder = nil
            errorMessage = "새 STEP을 자동 저장하지 못했습니다. 기존 STEP은 그대로 보존됩니다."
            errorRecoveryAction = .recordAgain
            resetRecordingState()
        }
    }

    func deleteStep(_ stepPreview: StepPreview) async -> Bool {
        guard recordingState == .idle,
              !isSavingDraft,
              let result = deleteStepPreviewUseCase.execute(id: stepPreview.id, from: session) else {
            return false
        }

        clearTransientMessages()

        do {
            try await persist(result.session)
            session = result.session
            lastDeletion = result.deletion
            canUndoDeletion = true
            saveFeedbackMessage = "STEP \(stepPreview.order)를 삭제하고 자동 저장했어요."
            scheduleUndoExpiration()
            return true
        } catch {
            errorMessage = "STEP을 삭제하지 못했습니다. 기존 STEP은 그대로 보존됩니다."
            errorRecoveryAction = .none
            return false
        }
    }

    func undoLastDeletion() async -> Bool {
        guard recordingState == .idle,
              !isSavingDraft,
              let lastDeletion else {
            return false
        }

        errorMessage = nil
        let candidateSession = restoreStepPreviewUseCase.execute(lastDeletion, to: session)

        do {
            try await persist(candidateSession)
            session = candidateSession
            self.lastDeletion = nil
            canUndoDeletion = false
            undoExpirationTask?.cancel()
            errorRecoveryAction = .none
            saveFeedbackMessage = "삭제한 STEP을 되돌리고 자동 저장했어요."
            return true
        } catch {
            errorMessage = "STEP을 되돌리지 못했습니다. 현재 STEP은 그대로 보존됩니다."
            errorRecoveryAction = .undoDeletion
            return false
        }
    }

    func dismissSaveFeedback() {
        saveFeedbackMessage = nil
    }

    private func persist(_ candidateSession: CookingLogSession) async throws {
        isSavingDraft = true
        defer { isSavingDraft = false }
        _ = try await saveStepPreviewDraftUseCase.execute(
            recordID: candidateSession.id,
            stepPreviews: candidateSession.stepPreviews,
            updatedAt: candidateSession.updatedAt
        )
    }

    private func clearTransientMessages() {
        errorMessage = nil
        errorRecoveryAction = .none
        saveFeedbackMessage = nil
    }

    private func resetRecordingState() {
        pendingStepOrder = nil
        remainingSeconds = recordingDurationSeconds
        recordingState = .idle
    }

    private func authorizationErrorMessage(for status: SpeechAuthorizationStatus) -> String {
        switch status {
        case .denied:
            return "마이크와 음성 인식 권한이 꺼져 있습니다. 권한을 확인한 뒤 다시 기록해주세요."
        case .restricted:
            return "이 기기에서는 음성 기록 권한을 사용할 수 없습니다."
        case .notDetermined:
            return "음성 기록 권한을 확인하지 못했습니다. 다시 기록해주세요."
        case .authorized:
            return ""
        }
    }

    private func scheduleUndoExpiration() {
        undoExpirationTask?.cancel()
        undoExpirationTask = Task { [weak self] in
            do {
                try await Task.sleep(nanoseconds: self?.undoDurationNanoseconds ?? 0)
            } catch {
                return
            }
            guard !Task.isCancelled else { return }
            self?.lastDeletion = nil
            self?.canUndoDeletion = false
        }
    }

    private func expireDeletionUndo() {
        undoExpirationTask?.cancel()
        lastDeletion = nil
        canUndoDeletion = false
    }
}
