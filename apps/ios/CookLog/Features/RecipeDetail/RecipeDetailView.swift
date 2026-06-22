import SwiftUI

struct RecipeDetailView: View {
    @StateObject private var viewModel: RecipeDetailViewModel
    private let onStartAudioGuide: (Recipe) -> Void

    init(
        viewModel: RecipeDetailViewModel,
        onStartAudioGuide: @escaping (Recipe) -> Void
    ) {
        _viewModel = StateObject(wrappedValue: viewModel)
        self.onStartAudioGuide = onStartAudioGuide
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                if viewModel.isLoading {
                    loadingState
                } else if let errorMessage = viewModel.errorMessage {
                    errorState(errorMessage)
                } else if viewModel.isNotFound {
                    notFoundState
                } else if let recipe = viewModel.recipe {
                    detailContent(recipe)
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 24)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("레시피")
        .task {
            await viewModel.loadRecipe()
        }
    }

    private var loadingState: some View {
        HStack(spacing: 12) {
            ProgressView()
            Text("레시피를 불러오는 중입니다.")
                .font(.body)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.vertical, 24)
    }

    private func errorState(_ message: String) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(message)
                .font(.body)
                .foregroundStyle(.red)

            Button("다시 시도") {
                Task {
                    await viewModel.loadRecipe()
                }
            }
            .buttonStyle(.bordered)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.vertical, 24)
    }

    private var notFoundState: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("레시피를 찾을 수 없습니다.")
                .font(.body)
                .fontWeight(.medium)

            Text("삭제되었거나 아직 저장되지 않은 레시피입니다.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.vertical, 24)
    }

    private func detailContent(_ recipe: Recipe) -> some View {
        VStack(alignment: .leading, spacing: 24) {
            header(recipe)
            IngredientListView(ingredients: recipe.ingredients)
            RecipeStepListView(steps: recipe.steps)
            memoSection(recipe.memo)
            audioGuideButton(recipe)
        }
    }

    private func header(_ recipe: Recipe) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(recipe.title)
                .font(.title2)
                .fontWeight(.semibold)
                .fixedSize(horizontal: false, vertical: true)

            if let estimatedTimeText = estimatedTimeText(for: recipe) {
                Label(estimatedTimeText, systemImage: "clock")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
    }

    @ViewBuilder
    private func memoSection(_ memo: String) -> some View {
        if !memo.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                Text("메모")
                    .font(.headline)

                Text(memo)
                    .font(.body)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    private func audioGuideButton(_ recipe: Recipe) -> some View {
        Button {
            onStartAudioGuide(recipe)
        } label: {
            Label("오디오 가이드 시작", systemImage: "play.circle.fill")
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
        }
        .buttonStyle(.borderedProminent)
        .controlSize(.large)
        .disabled(recipe.steps.isEmpty)
    }

    private func estimatedTimeText(for recipe: Recipe) -> String? {
        guard let estimatedTime = recipe.estimatedTime else {
            return nil
        }

        let minutes = max(Int(estimatedTime / 60), 0)
        return "예상 시간 \(minutes)분"
    }
}

#Preview {
    NavigationStack {
        RecipeDetailView(
            viewModel: RecipeDetailViewModel(
                recipeID: SampleRecipes.soyPorkBelly.id,
                fetchRecipeUseCase: AppEnvironment.mock().fetchRecipeUseCase
            ),
            onStartAudioGuide: { _ in }
        )
    }
}
