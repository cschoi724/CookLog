import SwiftUI

struct IngredientEditorRowView: View {
    @Binding var ingredient: Ingredient
    let onDelete: () -> Void

    var body: some View {
        HStack(spacing: 10) {
            TextField("재료", text: $ingredient.name)
                .textFieldStyle(.roundedBorder)

            TextField("양", text: amountText)
                .textFieldStyle(.roundedBorder)
                .frame(width: 96)

            Button(action: onDelete) {
                Image(systemName: "trash")
            }
            .buttonStyle(.borderless)
            .foregroundStyle(.red)
        }
    }

    private var amountText: Binding<String> {
        Binding(
            get: { ingredient.amountText ?? "" },
            set: { ingredient.amountText = $0 }
        )
    }
}
