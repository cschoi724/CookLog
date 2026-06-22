import SwiftUI

struct StepPreviewRowView: View {
    let stepPreview: StepPreview

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
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
    }
}

#Preview {
    StepPreviewRowView(stepPreview: SampleStepPreviews.basic[0])
        .padding()
        .background(Color(.systemGroupedBackground))
}
