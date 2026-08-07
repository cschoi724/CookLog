import SwiftUI

struct IngredientEditorRowView: View {
    @Binding var ingredient: Ingredient
    let isDisabled: Bool
    let onDelete: () -> Void

    private var hasAmountWithoutName: Bool {
        ingredient.name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            && !amountText.wrappedValue.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 10) {
                TextField("재료 이름", text: $ingredient.name)
                    .textFieldStyle(.roundedBorder)
                    .accessibilityLabel("재료 이름")

                TextField("양", text: amountText)
                    .textFieldStyle(.roundedBorder)
                    .frame(minWidth: 76, idealWidth: 96, maxWidth: 110)
                    .accessibilityLabel("재료 양")

                Button(action: onDelete) {
                    Image(systemName: "trash")
                        .frame(minWidth: 44, minHeight: 44)
                }
                .buttonStyle(.borderless)
                .foregroundStyle(HomeTheme.error)
                .accessibilityLabel("재료 삭제")
            }

            if hasAmountWithoutName {
                Text("양을 입력한 행에는 재료 이름도 입력해주세요.")
                    .font(.footnote)
                    .foregroundStyle(HomeTheme.error)
            }
        }
        .disabled(isDisabled)
    }

    private var amountText: Binding<String> {
        Binding(
            get: { ingredient.amountText ?? "" },
            set: { ingredient.amountText = $0 }
        )
    }
}
