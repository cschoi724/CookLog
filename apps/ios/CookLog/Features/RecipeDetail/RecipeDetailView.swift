import SwiftUI

struct RecipeDetailView: View {
    @StateObject private var viewModel: RecipeDetailViewModel
    @State private var isDeleteConfirmationPresented = false
    private let onEdit: (Recipe) -> Void
    private let onDeletionCommitted: () -> Void
    private let onReturnHome: () -> Void
    private let onStartAudioGuide: (Recipe) -> Void

    init(
        viewModel: RecipeDetailViewModel,
        onEdit: @escaping (Recipe) -> Void,
        onDeletionCommitted: @escaping () -> Void,
        onReturnHome: @escaping () -> Void,
        onStartAudioGuide: @escaping (Recipe) -> Void
    ) {
        _viewModel = StateObject(wrappedValue: viewModel)
        self.onEdit = onEdit
        self.onDeletionCommitted = onDeletionCommitted
        self.onReturnHome = onReturnHome
        self.onStartAudioGuide = onStartAudioGuide
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                if viewModel.isLoading {
                    loadingState
                } else if viewModel.isDeleted {
                    deletedState
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
        .background(HomeTheme.backgroundBase)
        .navigationTitle("레시피")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            if let recipe = viewModel.recipe, !viewModel.isDeleting {
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Button("레시피 수정") { onEdit(recipe) }
                        Button("레시피 삭제", role: .destructive) {
                            isDeleteConfirmationPresented = true
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                    }
                    .accessibilityLabel("레시피 메뉴")
                }
            }
        }
        .alert("완성된 레시피를 영구 삭제할까요?", isPresented: $isDeleteConfirmationPresented) {
            Button("취소", role: .cancel) {}
            Button("영구 삭제", role: .destructive) {
                Task {
                    if await viewModel.deleteRecipe() {
                        onDeletionCommitted()
                    }
                }
            }
        } message: {
            Text("\(viewModel.recipe?.title ?? "이 레시피")과 오디오 가이드를 삭제합니다. 이 작업은 되돌릴 수 없어요.")
        }
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
            Label(message, systemImage: "exclamationmark.triangle.fill")
                .font(.body)
                .foregroundStyle(HomeTheme.error)

            Button("다시 시도") {
                Task { await viewModel.loadRecipe() }
            }
            .buttonStyle(.bordered)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(HomeTheme.backgroundElevated)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }

    private var notFoundState: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("레시피를 찾을 수 없습니다.")
                .font(.headline)
            Text("삭제되었거나 아직 저장되지 않은 레시피입니다.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(HomeTheme.backgroundElevated)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }

    private var deletedState: some View {
        VStack(alignment: .leading, spacing: 16) {
            Image(systemName: "trash")
                .font(.title)
                .foregroundStyle(HomeTheme.error)
            Text("레시피를 삭제했어요")
                .font(.title2)
                .fontWeight(.bold)
            Text("완성된 레시피와 오디오 가이드를 영구 삭제했습니다.")
                .font(.body)
                .foregroundStyle(.secondary)
            Button("Home으로") { onReturnHome() }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .tint(HomeTheme.accent)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.vertical, 24)
    }

    private func detailContent(_ recipe: Recipe) -> some View {
        VStack(alignment: .leading, spacing: 24) {
            if let deleteErrorMessage = viewModel.deleteErrorMessage {
                Label(deleteErrorMessage, systemImage: "exclamationmark.triangle.fill")
                    .font(.subheadline)
                    .foregroundStyle(HomeTheme.error)
                    .padding(12)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(HomeTheme.backgroundElevated)
                    .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            }

            header(recipe)
            audioGuideButton(recipe)
            IngredientListView(ingredients: recipe.ingredients)
            RecipeStepListView(steps: recipe.steps)
            memoSection(recipe.memo)

            if viewModel.isDeleting {
                HStack(spacing: 12) {
                    ProgressView()
                    Text("레시피를 삭제하는 중입니다.")
                }
                .foregroundStyle(.secondary)
            }
        }
    }

    private func header(_ recipe: Recipe) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("MY COOKLOG")
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundStyle(HomeTheme.accent)
            Text(recipe.title)
                .font(.title2)
                .fontWeight(.bold)
                .fixedSize(horizontal: false, vertical: true)

            HStack(spacing: 8) {
                if let estimatedTimeText = estimatedTimeText(for: recipe) {
                    Label(estimatedTimeText, systemImage: "clock")
                }
                Text("재료 \(recipe.ingredients.count)개")
                Text("\(recipe.steps.count)단계")
            }
            .font(.subheadline)
            .foregroundStyle(.secondary)
        }
    }

    @ViewBuilder
    private func memoSection(_ memo: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("메모")
                .font(.headline)
            Text(memo.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? "남긴 메모가 없어요." : memo)
                .font(.body)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
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
        .tint(HomeTheme.accent)
        .disabled(recipe.steps.isEmpty || viewModel.isDeleting)
    }

    private func estimatedTimeText(for recipe: Recipe) -> String? {
        guard let estimatedTime = recipe.estimatedTime else { return nil }
        return "\(max(Int(estimatedTime / 60), 0))분"
    }
}

#Preview {
    NavigationStack {
        RecipeDetailView(
            viewModel: RecipeDetailViewModel(
                recipeID: SampleRecipes.soyPorkBelly.id,
                fetchRecipeUseCase: AppEnvironment.mock().fetchRecipeUseCase,
                deleteRecipeUseCase: AppEnvironment.mock().deleteRecipeUseCase
            ),
            onEdit: { _ in },
            onDeletionCommitted: {},
            onReturnHome: {},
            onStartAudioGuide: { _ in }
        )
    }
}
