import XCTest
@testable import CookLog

@MainActor
final class RecipePersistenceMapperTests: XCTestCase {
    func testMapsDomainToPersistentAndBackToDomain() {
        let recipe = makeRecipe()

        let persistentRecipe = RecipePersistenceMapper.makePersistentRecipe(from: recipe)
        let mappedRecipe = RecipePersistenceMapper.makeRecipe(from: persistentRecipe)

        XCTAssertEqual(mappedRecipe, recipe)
    }

    func testMapsPersistentChildrenByStoredOrder() {
        let recipe = makeRecipe()
        let persistentRecipe = RecipePersistenceMapper.makePersistentRecipe(from: recipe)
        persistentRecipe.ingredients = persistentRecipe.ingredients.reversed()
        persistentRecipe.steps = persistentRecipe.steps.reversed()

        let mappedRecipe = RecipePersistenceMapper.makeRecipe(from: persistentRecipe)

        XCTAssertEqual(mappedRecipe.ingredients, recipe.ingredients)
        XCTAssertEqual(mappedRecipe.steps, recipe.steps)
    }

    private func makeRecipe() -> Recipe {
        Recipe(
            id: UUID(uuidString: "00000000-0000-0000-0000-000000000701")!,
            title: "저장 테스트 레시피",
            ingredients: [
                Ingredient(
                    id: UUID(uuidString: "00000000-0000-0000-0000-000000000702")!,
                    name: "두부",
                    amountText: "1모"
                ),
                Ingredient(
                    id: UUID(uuidString: "00000000-0000-0000-0000-000000000703")!,
                    name: "간장",
                    amountText: "1스푼"
                )
            ],
            steps: [
                RecipeStep(
                    id: UUID(uuidString: "00000000-0000-0000-0000-000000000704")!,
                    order: 1,
                    text: "두부를 굽습니다.",
                    duration: 120,
                    note: "중불"
                ),
                RecipeStep(
                    id: UUID(uuidString: "00000000-0000-0000-0000-000000000705")!,
                    order: 2,
                    text: "간장을 넣습니다."
                )
            ],
            memo: "테스트 메모",
            estimatedTime: 10 * 60,
            source: .voiceLog,
            syncStatus: .localOnly,
            ownerId: "local-user",
            createdAt: Date(timeIntervalSince1970: 100),
            updatedAt: Date(timeIntervalSince1970: 200)
        )
    }
}
