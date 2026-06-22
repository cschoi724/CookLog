import SwiftUI

struct IngredientListView: View {
    let ingredients: [Ingredient]

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("재료")
                .font(.headline)

            if ingredients.isEmpty {
                Text("기록된 재료가 없습니다.")
                    .font(.body)
                    .foregroundStyle(.secondary)
            } else {
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(ingredients) { ingredient in
                        HStack(alignment: .firstTextBaseline, spacing: 8) {
                            Text(ingredient.name)
                                .font(.body)

                            if let amountText = ingredient.amountText,
                               !amountText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                                Text(amountText)
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }
            }
        }
    }
}
