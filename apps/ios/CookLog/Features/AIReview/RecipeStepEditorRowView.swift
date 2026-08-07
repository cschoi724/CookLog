import SwiftUI

struct RecipeStepEditorRowView: View {
    @Binding var step: RecipeStep
    let isFirst: Bool
    let isLast: Bool
    let isDisabled: Bool
    let onMoveUp: () -> Void
    let onMoveDown: () -> Void
    let onDelete: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("STEP \(step.order)")
                    .font(.subheadline)
                    .fontWeight(.semibold)

                Spacer()

                Button(action: onMoveUp) {
                    Image(systemName: "arrow.up")
                        .frame(minWidth: 44, minHeight: 44)
                }
                .buttonStyle(.borderless)
                .disabled(isFirst || isDisabled)
                .accessibilityLabel("STEP \(step.order) 위로 이동")

                Button(action: onMoveDown) {
                    Image(systemName: "arrow.down")
                        .frame(minWidth: 44, minHeight: 44)
                }
                .buttonStyle(.borderless)
                .disabled(isLast || isDisabled)
                .accessibilityLabel("STEP \(step.order) 아래로 이동")

                Button(action: onDelete) {
                    Image(systemName: "trash")
                        .frame(minWidth: 44, minHeight: 44)
                }
                .buttonStyle(.borderless)
                .foregroundStyle(HomeTheme.error)
                .disabled(isDisabled)
                .accessibilityLabel("STEP \(step.order) 삭제")
            }

            TextEditor(text: $step.text)
                .frame(minHeight: 84)
                .padding(8)
                .scrollContentBackground(.hidden)
                .background(HomeTheme.backgroundSubtle)
                .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
                .disabled(isDisabled)
                .accessibilityLabel("STEP \(step.order) 조리 내용")
        }
        .padding(12)
        .background(HomeTheme.backgroundElevated)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }
}
