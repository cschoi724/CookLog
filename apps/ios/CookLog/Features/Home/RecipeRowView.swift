import SwiftUI
import UIKit

enum HomeTheme {
    static let backgroundBase = adaptiveColor(light: 0xFFFDF8, dark: 0x18171B)
    static let backgroundSubtle = adaptiveColor(light: 0xFAF3E7, dark: 0x222027)
    static let backgroundElevated = adaptiveColor(light: 0xFFFFFF, dark: 0x302C35)
    static let accent = adaptiveColor(light: 0xC93610, dark: 0xFF9A7A)
    static let accentMuted = adaptiveColor(light: 0xFFE1CF, dark: 0x5C4638)
    static let textOnAccent = adaptiveColor(light: 0xFFFFFF, dark: 0x2D1C14)
    static let success = adaptiveColor(light: 0x176B4A, dark: 0x7EE0B4)
    static let error = adaptiveColor(light: 0xB42318, dark: 0xFF8C84)

    private static func adaptiveColor(light: UInt32, dark: UInt32) -> Color {
        Color(uiColor: UIColor { traits in
            UIColor(rgb: traits.userInterfaceStyle == .dark ? dark : light)
        })
    }
}

struct RecipeRecordRowView: View {
    let record: RecipeRecord
    var searchMatch: HomeSearchMatch?

    var body: some View {
        HStack(alignment: .center, spacing: 12) {
            VStack(alignment: .leading, spacing: 8) {
                HStack(spacing: 8) {
                    Text(stateLabel)
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(stateColor)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(stateColor.opacity(0.12), in: Capsule())

                    if let searchMatch {
                        Text(searchMatch.label)
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(HomeTheme.accent)
                    }
                }

                Text(record.homeTitle)
                    .font(.body.weight(.semibold))
                    .foregroundStyle(.primary)
                    .lineLimit(2)

                Text(summaryText)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
            }

            Spacer(minLength: 12)

            Image(systemName: "chevron.right")
                .font(.footnote.weight(.semibold))
                .foregroundStyle(.tertiary)
                .accessibilityHidden(true)
        }
        .padding(16)
        .frame(maxWidth: .infinity, minHeight: 88, alignment: .leading)
        .background(HomeTheme.backgroundElevated)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(Color(uiColor: .separator).opacity(0.45), lineWidth: 0.5)
        }
        .contentShape(Rectangle())
        .accessibilityElement(children: .combine)
    }

    private var stateLabel: String {
        switch record.lifecycleState {
        case .draftStepPreview:
            return "기록 중"
        case .draftAIReview:
            return "검토 준비됨"
        case .completed:
            return "완료"
        }
    }

    private var stateColor: Color {
        switch record.lifecycleState {
        case .draftStepPreview:
            return HomeTheme.accent
        case .draftAIReview:
            return HomeTheme.success
        case .completed:
            return .secondary
        }
    }

    private var summaryText: String {
        switch record.lifecycleState {
        case .draftStepPreview:
            return "STEP \(record.stepPreviews.count)개 · 마지막 기록 \(record.updatedAt.formatted(date: .abbreviated, time: .shortened))"
        case .draftAIReview:
            let ingredients = record.homeIngredients.prefix(3).map(\.name).joined(separator: " · ")
            return ingredients.isEmpty ? "레시피 검토가 필요합니다." : ingredients
        case .completed:
            guard let recipe = record.completedRecipe else {
                return "저장된 레시피"
            }
            var parts = ["\(recipe.ingredients.count)개 재료", "\(recipe.steps.count)단계"]
            if let estimatedTime = recipe.estimatedTime {
                parts.append("\(Int(estimatedTime / 60))분")
            }
            return parts.joined(separator: " · ")
        }
    }
}

private extension UIColor {
    convenience init(rgb: UInt32) {
        self.init(
            red: CGFloat((rgb >> 16) & 0xFF) / 255,
            green: CGFloat((rgb >> 8) & 0xFF) / 255,
            blue: CGFloat(rgb & 0xFF) / 255,
            alpha: 1
        )
    }
}

#Preview {
    RecipeRecordRowView(record: RecipeRecord(completedRecipe: SampleRecipes.soyPorkBelly))
        .padding()
        .background(HomeTheme.backgroundBase)
}
