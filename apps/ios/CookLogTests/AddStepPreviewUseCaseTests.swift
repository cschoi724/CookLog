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
}
