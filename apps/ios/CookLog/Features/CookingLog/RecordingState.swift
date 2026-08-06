import Foundation

enum RecordingState: Equatable {
    case idle
    case recording
    case processing
}

enum CookingLogRecoveryAction: Equatable {
    case recordAgain
    case undoDeletion
    case none
}
