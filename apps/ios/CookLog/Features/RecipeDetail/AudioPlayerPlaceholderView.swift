import SwiftUI

struct AudioPlayerPlaceholderView: View {
    let recipeID: UUID

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("오디오 가이드")
                .font(.title2)
                .fontWeight(.semibold)

            Text("오디오 플레이어는 M6에서 구현합니다.")
                .font(.body)
                .foregroundStyle(.secondary)

            Text(recipeID.uuidString)
                .font(.caption)
                .foregroundStyle(.tertiary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding(20)
        .background(Color(.systemGroupedBackground))
        .navigationTitle("오디오")
    }
}
