import SwiftUI

struct AudioPlayerView: View {
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
                    onPrevious: {
                        viewModel.moveToPreviousStep()
                    },
                    onNext: {
                        viewModel.moveToNextStep()
                    },
                    onReplay: {
                        Task {
                            await viewModel.replayCurrentStep()
                        }
                    },
                    onPlay: {
                        Task {
                            await viewModel.playCurrentStep()
                        }
                    },
                    onStop: {
                        viewModel.stop()
                    }
                )
            }
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("오디오")
        .task {
            await viewModel.loadRecipe()
        }
        .onDisappear {
            viewModel.stopOnDisappear()
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
                .foregroundStyle(.red)

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
                .font(.body)
                .fontWeight(.medium)

            Text("삭제되었거나 아직 저장되지 않은 레시피입니다.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 24)
    }

    private var emptyStepsState: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("재생할 조리 순서가 없습니다.")
                .font(.body)
                .fontWeight(.medium)

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
                    .font(.title2)
                    .fontWeight(.semibold)
                    .fixedSize(horizontal: false, vertical: true)

                Text(viewModel.currentStepNumberText)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            VStack(alignment: .leading, spacing: 10) {
                Text("현재 단계")
                    .font(.headline)

                Text(step.text)
                    .font(.title3)
                    .fontWeight(.medium)
                    .fixedSize(horizontal: false, vertical: true)
            }
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
