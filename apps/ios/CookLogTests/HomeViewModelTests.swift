import XCTest
@testable import CookLog

@MainActor
final class HomeViewModelTests: XCTestCase {
    func testLoadRecipesLoadsSampleRecipes() async {
        let viewModel = HomeViewModel(
            fetchRecipesUseCase: AppEnvironment.mock(recipes: SampleRecipes.all).fetchRecipesUseCase
        )

        await viewModel.loadRecipes()

        XCTAssertEqual(viewModel.recipes, SampleRecipes.all)
        XCTAssertFalse(viewModel.isEmpty)
        XCTAssertNil(viewModel.errorMessage)
    }

    func testLoadRecipesHandlesEmptyList() async {
        let viewModel = HomeViewModel(
            fetchRecipesUseCase: AppEnvironment.mock(recipes: []).fetchRecipesUseCase
        )

        await viewModel.loadRecipes()

        XCTAssertTrue(viewModel.recipes.isEmpty)
        XCTAssertTrue(viewModel.isEmpty)
        XCTAssertNil(viewModel.errorMessage)
    }
}
