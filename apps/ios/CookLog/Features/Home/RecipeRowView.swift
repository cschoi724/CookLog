import SwiftUI

struct RecipeRowView: View {
    let recipe: Recipe

    var body: some View {
        HStack(alignment: .center, spacing: 12) {
            VStack(alignment: .leading, spacing: 6) {
                Text(recipe.title)
                    .font(.body)
                    .fontWeight(.semibold)
                    .foregroundStyle(.primary)
                    .lineLimit(2)

                Text(summaryText)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }

            Spacer(minLength: 12)

            Image(systemName: "chevron.right")
                .font(.footnote.weight(.semibold))
                .foregroundStyle(.tertiary)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
    }

    private var summaryText: String {
        let ingredientCount = recipe.ingredients.count
        let stepCount = recipe.steps.count

        if let estimatedTime = recipe.estimatedTime {
            return "\(ingredientCount)개 재료 · \(stepCount)단계 · \(Int(estimatedTime / 60))분"
        }

        return "\(ingredientCount)개 재료 · \(stepCount)단계"
    }
}

#Preview {
    RecipeRowView(recipe: SampleRecipes.soyPorkBelly)
        .padding()
        .background(Color(.systemGroupedBackground))
}
