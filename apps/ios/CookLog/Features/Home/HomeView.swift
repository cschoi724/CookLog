import SwiftUI

struct HomeView: View {
    @StateObject private var viewModel: HomeViewModel
    private let refreshToken: Int
    private let onStartCooking: () -> Void
    private let onSelectRecipe: (Recipe) -> Void

    init(
        viewModel: HomeViewModel,
        refreshToken: Int = 0,
        onStartCooking: @escaping () -> Void,
        onSelectRecipe: @escaping (Recipe) -> Void
    ) {
        _viewModel = StateObject(wrappedValue: viewModel)
        self.refreshToken = refreshToken
        self.onStartCooking = onStartCooking
        self.onSelectRecipe = onSelectRecipe
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 28) {
                header
                startButton
                recipeSection
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 24)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("CookLog")
        .task(id: refreshToken) {
            await viewModel.loadRecipes()
        }
        .refreshable {
            await viewModel.loadRecipes()
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("오늘의 요리를 기록하세요")
                .font(.title2)
                .fontWeight(.semibold)

            Text("짧게 남긴 기록을 나중에 다시 요리할 수 있는 레시피로 정리합니다.")
                .font(.body)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private var startButton: some View {
        Button(action: onStartCooking) {
            Label("요리 기록 시작", systemImage: "mic.fill")
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
        }
        .buttonStyle(.borderedProminent)
        .controlSize(.large)
    }

    @ViewBuilder
    private var recipeSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text("저장된 레시피")
                    .font(.headline)

                Spacer()

                if viewModel.isLoading {
                    ProgressView()
                }
            }

            if let errorMessage = viewModel.errorMessage {
                Text(errorMessage)
                    .font(.body)
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.vertical, 20)
            } else if viewModel.isEmpty {
                emptyState
            } else {
                LazyVStack(spacing: 10) {
                    ForEach(viewModel.recipes) { recipe in
                        Button {
                            onSelectRecipe(recipe)
                        } label: {
                            RecipeRowView(recipe: recipe)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
        }
    }

    private var emptyState: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("저장된 레시피가 없습니다.")
                .font(.body)
                .fontWeight(.medium)

            Text("요리 기록을 시작하면 이곳에 레시피가 쌓입니다.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.vertical, 20)
    }
}

#Preview {
    NavigationStack {
        HomeView(
            viewModel: HomeViewModel(
                fetchRecipesUseCase: AppEnvironment.mock().fetchRecipesUseCase
            ),
            onStartCooking: {},
            onSelectRecipe: { _ in }
        )
    }
}
