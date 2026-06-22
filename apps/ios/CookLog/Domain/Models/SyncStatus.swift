import Foundation

enum SyncStatus: String, Codable, Equatable {
    case localOnly
    case pendingUpload
    case synced
    case failed
}
