import Foundation

enum RecipeSource: String, Codable, Equatable {
    case voiceLog
    case textImport
    case blogImport
    case youtubeImport
    case imageOCR
    case manual
}
