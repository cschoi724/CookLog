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

struct DeletedStepPreview: Equatable {
    let stepPreview: StepPreview
    let originalIndex: Int
}

struct DeleteStepPreviewUseCase {
    func execute(
        id: UUID,
        from session: CookingLogSession,
        updatedAt: Date = Date()
    ) -> (session: CookingLogSession, deletion: DeletedStepPreview)? {
        guard let index = session.stepPreviews.firstIndex(where: { $0.id == id }) else {
            return nil
        }

        var updatedSession = session
        let removedStep = updatedSession.stepPreviews.remove(at: index)
        updatedSession.stepPreviews = normalized(updatedSession.stepPreviews)
        updatedSession.updatedAt = updatedAt

        return (
            updatedSession,
            DeletedStepPreview(stepPreview: removedStep, originalIndex: index)
        )
    }
}

struct RestoreStepPreviewUseCase {
    func execute(
        _ deletion: DeletedStepPreview,
        to session: CookingLogSession,
        updatedAt: Date = Date()
    ) -> CookingLogSession {
        var updatedSession = session
        let insertionIndex = min(deletion.originalIndex, updatedSession.stepPreviews.endIndex)
        updatedSession.stepPreviews.insert(deletion.stepPreview, at: insertionIndex)
        updatedSession.stepPreviews = normalized(updatedSession.stepPreviews)
        updatedSession.updatedAt = updatedAt
        return updatedSession
    }
}

private func normalized(_ stepPreviews: [StepPreview]) -> [StepPreview] {
    stepPreviews.enumerated().map { index, stepPreview in
        var normalizedStep = stepPreview
        normalizedStep.order = index + 1
        return normalizedStep
    }
}
