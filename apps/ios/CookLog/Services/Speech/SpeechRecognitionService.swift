import Foundation

protocol SpeechRecognitionService {
    func requestAuthorization() async -> SpeechAuthorizationStatus
    func transcribeTenSecondRecording() async throws -> String
}
