import SwiftUI

struct AudioPlayerView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.scenePhase) private var scenePhase
    @StateObject private var viewModel: AudioPlayerViewModel

    init(viewModel: AudioPlayerViewModel) {
        _viewModel = StateObject(wrappedValue: viewModel)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    if viewModel.isLoading {
                        loadingState
                    } else if let errorMessage = viewModel.errorMessage {
                        errorState(errorMessage)
                    } else if viewModel.isNotFound {
                        notFoundState
                    } else if viewModel.isEmptySteps {
                        emptyStepsState
                    } else if let recipe = viewModel.recipe, let currentStep = viewModel.currentStep {
                        playerContent(recipe: recipe, step: currentStep)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 24)
                .frame(maxWidth: .infinity, alignment: .leading)
            }

            if viewModel.canPlay {
                AudioPlayerControlBarView(
                    isPlaying: viewModel.isPlaying,
                    canMoveToPreviousStep: viewModel.canMoveToPreviousStep,
                    canMoveToNextStep: viewModel.canMoveToNextStep,
                    onAction: send
                )
            }
        }
        .background(HomeTheme.backgroundBase)
        .navigationTitle("오디오 가이드")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            if viewModel.canPlay {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("가이드 종료") {
                        viewModel.stopOnDisappear()
                        dismiss()
                    }
                }
            }
        }
        .tint(HomeTheme.accent)
        .task {
            await viewModel.loadRecipe()
        }
        .onDisappear {
            viewModel.stopOnDisappear()
        }
        .onChange(of: scenePhase) { _, newPhase in
            if newPhase != .active, viewModel.canPlay {
                viewModel.handleBackgroundOrLock()
            }
        }
    }

    private var loadingState: some View {
        HStack(spacing: 12) {
            ProgressView()
            Text("오디오 가이드를 준비하는 중입니다.")
                .font(.body)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 24)
    }

    private func errorState(_ message: String) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(message)
                .font(.body)
                .foregroundStyle(HomeTheme.error)

            Button("다시 시도") {
                Task {
                    await viewModel.loadRecipe()
                }
            }
            .buttonStyle(.bordered)
        }
        .padding(.vertical, 24)
    }

    private var notFoundState: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("레시피를 찾을 수 없습니다.")
                .font(.body.weight(.medium))

            Text("삭제되었거나 아직 저장되지 않은 레시피입니다.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 24)
    }

    private var emptyStepsState: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("재생할 조리 순서가 없습니다.")
                .font(.body.weight(.medium))

            Text("조리 순서가 있는 레시피만 오디오 가이드로 들을 수 있습니다.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 24)
    }

    private func playerContent(recipe: Recipe, step: RecipeStep) -> some View {
        VStack(alignment: .leading, spacing: 22) {
            VStack(alignment: .leading, spacing: 8) {
                Text(recipe.title)
                    .font(.title2.weight(.semibold))
                    .fixedSize(horizontal: false, vertical: true)

                Text(viewModel.currentStepNumberText)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            VStack(alignment: .leading, spacing: 10) {
                Text("현재 단계")
                    .font(.headline)

                Text(step.text)
                    .font(.title3.weight(.medium))
                    .fixedSize(horizontal: false, vertical: true)
            }
            .padding(18)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(HomeTheme.backgroundElevated, in: RoundedRectangle(cornerRadius: 18))

            statusCard
            handsfreeCard

            Button {
                send(.readIngredients)
            } label: {
                Label("재료 알려줘", systemImage: "list.bullet.clipboard")
                    .frame(maxWidth: .infinity, minHeight: 44)
            }
            .buttonStyle(.bordered)
            .accessibilityHint("현재 단계를 유지하고 저장된 재료를 안내합니다.")

            Text("기기를 직접 잠그거나 앱을 벗어나면 자동 재생과 핸즈프리는 다시 켜지지 않습니다.")
                .font(.footnote)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private var statusCard: some View {
        VStack(alignment: .leading, spacing: 6) {
            if let interruptionMessage = viewModel.interruptionMessage {
                Label(interruptionMessage, systemImage: "pause.circle.fill")
                    .font(.headline)
                    .foregroundStyle(HomeTheme.accent)
            }

            Text(viewModel.feedbackMessage)
                .font(.body)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(HomeTheme.backgroundSubtle, in: RoundedRectangle(cornerRadius: 14))
        .accessibilityElement(children: .combine)
    }

    private var handsfreeCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label(
                viewModel.isHandsfreeActive ? "핸즈프리 켜짐" : "핸즈프리 꺼짐",
                systemImage: viewModel.isHandsfreeActive ? "mic.fill" : "mic.slash.fill"
            )
            .font(.headline)

            Text(viewModel.isHandsfreeActive
                 ? AudioGuideAction.allCases.map(\.rawValue).joined(separator: " · ")
                 : "사용자가 시작하기 전에는 명령 입력을 사용하지 않습니다.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            Button {
                if viewModel.isHandsfreeActive {
                    send(.endHandsfree)
                } else {
                    viewModel.startHandsfree()
                }
            } label: {
                Label(
                    viewModel.isHandsfreeActive ? "핸즈프리 종료" : "핸즈프리 시작",
                    systemImage: viewModel.isHandsfreeActive ? "mic.slash" : "mic"
                )
                .frame(maxWidth: .infinity, minHeight: 44)
            }
            .buttonStyle(.borderedProminent)
        }
        .padding(16)
        .background(HomeTheme.backgroundElevated, in: RoundedRectangle(cornerRadius: 16))
    }

    private func send(_ action: AudioGuideAction) {
        Task {
            await viewModel.send(action)
        }
    }
}

#Preview {
    NavigationStack {
        AudioPlayerView(
            viewModel: AudioPlayerViewModel(
                recipeID: SampleRecipes.soyPorkBelly.id,
                fetchRecipeUseCase: AppEnvironment.mock().fetchRecipeUseCase,
                playRecipeStepUseCase: AppEnvironment.mock().playRecipeStepUseCase,
                audioGuideService: AppEnvironment.mock().audioGuideService
            )
        )
    }
}
