import SwiftUI

struct StepPreviewRowView: View {
    let stepPreview: StepPreview
    var onDelete: (() -> Void)?
    var isDeletionDisabled = false

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Text("\(stepPreview.order)")
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundStyle(.white)
                .frame(width: 28, height: 28)
                .background(Color.accentColor)
                .clipShape(Circle())

            Text(stepPreview.transcript)
                .font(.body)
                .foregroundStyle(.primary)
                .fixedSize(horizontal: false, vertical: true)

            Spacer(minLength: 0)

            if let onDelete {
                Button(role: .destructive, action: onDelete) {
                    Image(systemName: "trash")
                        .frame(width: 44, height: 44)
                }
                .buttonStyle(.plain)
                .foregroundStyle(.red)
                .disabled(isDeletionDisabled)
                .accessibilityLabel("STEP \(stepPreview.order) 삭제")
                .accessibilityHint("삭제 후 잠시 동안 되돌릴 수 있습니다.")
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
    }
}

struct PendingStepPreviewRowView: View {
    let order: Int

    var body: some View {
        HStack(alignment: .center, spacing: 12) {
            Text("\(order)")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white)
                .frame(width: 28, height: 28)
                .background(Color.accentColor.opacity(0.7))
                .clipShape(Circle())

            VStack(alignment: .leading, spacing: 4) {
                Text("STEP \(order) 처리 중")
                    .font(.body.weight(.medium))
                Text("말한 원문을 STEP Preview로 만드는 중입니다.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Spacer(minLength: 0)
            ProgressView()
                .accessibilityHidden(true)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
        .accessibilityElement(children: .combine)
        .accessibilityLabel("STEP \(order) 처리 중")
    }
}

#Preview {
    StepPreviewRowView(stepPreview: SampleStepPreviews.basic[0])
        .padding()
        .background(Color(.systemGroupedBackground))
}
