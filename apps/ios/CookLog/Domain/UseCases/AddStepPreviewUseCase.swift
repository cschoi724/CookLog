import Foundation

struct AddStepPreviewUseCase {
    func execute(
        transcript: String,
        to session: CookingLogSession,
        createdAt: Date = Date()
    ) -> CookingLogSession {
        var updatedSession = session
        let nextOrder = (updatedSession.stepPreviews.map(\.order).max() ?? 0) + 1
        let stepPreview = StepPreview(
            order: nextOrder,
            transcript: transcript,
            createdAt: createdAt
        )

        updatedSession.stepPreviews.append(stepPreview)
        updatedSession.updatedAt = createdAt
        return updatedSession
    }
}
