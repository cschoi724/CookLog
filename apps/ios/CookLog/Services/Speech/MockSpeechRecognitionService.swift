import Foundation

final class MockSpeechRecognitionService: SpeechRecognitionService {
    private var transcripts: [String]
    private let authorizationStatus: SpeechAuthorizationStatus

    init(
        transcripts: [String] = [
            "삼겹살을 넣고 볶았어",
            "양파 반 개를 넣었어",
            "간장 한 스푼 넣고 더 볶았어"
        ],
        authorizationStatus: SpeechAuthorizationStatus = .authorized
    ) {
        self.transcripts = transcripts
        self.authorizationStatus = authorizationStatus
    }

    func requestAuthorization() async -> SpeechAuthorizationStatus {
        authorizationStatus
    }

    func transcribeTenSecondRecording() async throws -> String {
        if transcripts.isEmpty {
            return "새 요리 단계를 기록했어"
        }

        return transcripts.removeFirst()
    }
}
