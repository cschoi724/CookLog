import SwiftUI

struct AIReviewView: View {
    @StateObject private var viewModel: AIReviewViewModel
    private let onSaved: (Recipe) -> Void

    init(
        viewModel: AIReviewViewModel,
        onSaved: @escaping (Recipe) -> Void
    ) {
        _viewModel = StateObject(wrappedValue: viewModel)
        self.onSaved = onSaved
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                if viewModel.isLoading {
                    loadingState
                } else if let errorMessage = viewModel.errorMessage {
                    errorState(errorMessage)
                } else {
                    editorContent
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 24)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("AI 정리")
        .task {
            await viewModel.loadDraft()
        }
    }

    private var loadingState: some View {
        HStack(spacing: 12) {
            ProgressView()
            Text("STEP Preview를 레시피로 정리하는 중입니다.")
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
                    await viewModel.loadDraft()
                }
            }
            .buttonStyle(.bordered)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.vertical, 24)
    }

    private var editorContent: some View {
        VStack(alignment: .leading, spacing: 22) {
            titleSection
            ingredientsSection
            stepsSection
            estimateSection
            memoSection
            saveSection
        }
    }

    private var titleSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("제목")
                .font(.headline)

            TextField("레시피 제목", text: $viewModel.title)
                .textFieldStyle(.roundedBorder)
        }
    }

    private var ingredientsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("재료")
                    .font(.headline)

                Spacer()

                Button {
                    viewModel.addIngredient()
                } label: {
                    Image(systemName: "plus")
                }
                .buttonStyle(.bordered)
            }

            ForEach($viewModel.ingredients) { $ingredient in
                IngredientEditorRowView(
                    ingredient: $ingredient,
                    onDelete: {
                        viewModel.removeIngredient(id: ingredient.id)
                    }
                )
            }
        }
    }

    private var stepsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("조리 순서")
                    .font(.headline)

                Spacer()

                Button {
                    viewModel.addStep()
                } label: {
                    Image(systemName: "plus")
                }
                .buttonStyle(.bordered)
            }

            ForEach($viewModel.steps) { $step in
                RecipeStepEditorRowView(
                    step: $step,
                    onDelete: {
                        viewModel.removeStep(id: step.id)
                    }
                )
            }
        }
    }

    private var estimateSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("예상 시간")
                .font(.headline)

            TextField("분 단위", text: $viewModel.estimatedMinutesText)
                .keyboardType(.numberPad)
                .textFieldStyle(.roundedBorder)
        }
    }

    private var memoSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("메모")
                .font(.headline)

            TextEditor(text: $viewModel.memo)
                .frame(minHeight: 120)
                .padding(8)
                .background(Color(.secondarySystemGroupedBackground))
                .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
        }
    }

    private var saveSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            if let saveErrorMessage = viewModel.saveErrorMessage {
                Text(saveErrorMessage)
                    .font(.subheadline)
                    .foregroundStyle(.red)
            }

            Button {
                Task {
                    if let recipe = await viewModel.saveRecipe() {
                        onSaved(recipe)
                    }
                }
            } label: {
                HStack {
                    if viewModel.isSaving {
                        ProgressView()
                    }

                    Text(viewModel.isSaving ? "저장 중" : "저장")
                        .font(.headline)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .disabled(!viewModel.canSave)
        }
    }
}

#Preview {
    NavigationStack {
        AIReviewView(
            viewModel: AIReviewViewModel(
                stepPreviews: SampleStepPreviews.basic,
                generateRecipeDraftUseCase: AppEnvironment.mock().generateRecipeDraftUseCase,
                saveRecipeUseCase: AppEnvironment.mock().saveRecipeUseCase
            ),
            onSaved: { _ in }
        )
    }
}
