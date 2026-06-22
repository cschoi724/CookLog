import Foundation

enum SampleRecipes {
    static let soyPorkBelly = Recipe(
        title: "간장 삼겹살 볶음",
        ingredients: [
            Ingredient(name: "삼겹살", amountText: "200g"),
            Ingredient(name: "양파", amountText: "1/2개"),
            Ingredient(name: "간장", amountText: "1스푼")
        ],
        steps: [
            RecipeStep(order: 1, text: "삼겹살을 팬에 넣고 볶습니다."),
            RecipeStep(order: 2, text: "양파 반 개를 넣고 함께 볶습니다."),
            RecipeStep(order: 3, text: "간장 한 스푼을 넣고 간이 배도록 더 볶습니다.")
        ],
        memo: "중불에서 천천히 볶으면 양파 단맛이 잘 납니다.",
        estimatedTime: 15 * 60
    )

    static let all: [Recipe] = [
        soyPorkBelly
    ]
}
