import XCTest
@testable import CookLog

final class AddStepPreviewUseCaseTests: XCTestCase {
    func testExecuteAddsStepPreviewWithNextOrder() {
        let createdAt = Date(timeIntervalSince1970: 100)
        let session = CookingLogSession(
            stepPreviews: [
                StepPreview(order: 1, transcript: "삼겹살을 볶았어", createdAt: createdAt)
            ],
            createdAt: createdAt,
            updatedAt: createdAt
        )
        let useCase = AddStepPreviewUseCase()

        let updatedSession = useCase.execute(
            transcript: "양파 반 개를 넣었어",
            to: session,
            createdAt: Date(timeIntervalSince1970: 200)
        )

        XCTAssertEqual(updatedSession.stepPreviews.count, 2)
        XCTAssertEqual(updatedSession.stepPreviews[1].order, 2)
        XCTAssertEqual(updatedSession.stepPreviews[1].transcript, "양파 반 개를 넣었어")
        XCTAssertEqual(updatedSession.updatedAt, Date(timeIntervalSince1970: 200))
    }

    func testExecuteStartsOrderAtOneForEmptySession() {
        let session = CookingLogSession()
        let useCase = AddStepPreviewUseCase()

        let updatedSession = useCase.execute(transcript: "물 올렸어", to: session)

        XCTAssertEqual(updatedSession.stepPreviews.count, 1)
        XCTAssertEqual(updatedSession.stepPreviews[0].order, 1)
    }

    func testDeleteRemovesSameIdentifierAndNormalizesFollowingOrder() throws {
        let steps = [
            StepPreview(order: 1, transcript: "첫 단계"),
            StepPreview(order: 2, transcript: "둘째 단계"),
            StepPreview(order: 3, transcript: "셋째 단계")
        ]
        let session = CookingLogSession(stepPreviews: steps)

        let result = try XCTUnwrap(
            DeleteStepPreviewUseCase().execute(id: steps[1].id, from: session)
        )

        XCTAssertEqual(result.deletion.stepPreview.id, steps[1].id)
        XCTAssertEqual(result.deletion.originalIndex, 1)
        XCTAssertEqual(result.session.stepPreviews.map(\.id), [steps[0].id, steps[2].id])
        XCTAssertEqual(result.session.stepPreviews.map(\.order), [1, 2])
    }

    func testRestoreReturnsDeletedIdentifierToOriginalPositionAndNormalizesOrder() throws {
        let steps = [
            StepPreview(order: 1, transcript: "첫 단계"),
            StepPreview(order: 2, transcript: "둘째 단계"),
            StepPreview(order: 3, transcript: "셋째 단계")
        ]
        let session = CookingLogSession(stepPreviews: steps)
        let deletion = try XCTUnwrap(
            DeleteStepPreviewUseCase().execute(id: steps[1].id, from: session)
        )

        let restoredSession = RestoreStepPreviewUseCase().execute(
            deletion.deletion,
            to: deletion.session
        )

        XCTAssertEqual(restoredSession.stepPreviews.map(\.id), steps.map(\.id))
        XCTAssertEqual(restoredSession.stepPreviews.map(\.order), [1, 2, 3])
    }
}
