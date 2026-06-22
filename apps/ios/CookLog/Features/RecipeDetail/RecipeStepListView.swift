import SwiftUI

struct RecipeStepListView: View {
    let steps: [RecipeStep]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("조리 순서")
                .font(.headline)

            if steps.isEmpty {
                Text("기록된 조리 순서가 없습니다.")
                    .font(.body)
                    .foregroundStyle(.secondary)
            } else {
                VStack(alignment: .leading, spacing: 14) {
                    ForEach(steps.sorted { $0.order < $1.order }) { step in
                        HStack(alignment: .top, spacing: 12) {
                            Text("\(step.order)")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundStyle(.white)
                                .frame(width: 28, height: 28)
                                .background(Circle().fill(Color.accentColor))

                            Text(step.text)
                                .font(.body)
                                .fixedSize(horizontal: false, vertical: true)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }
                }
            }
        }
    }
}
