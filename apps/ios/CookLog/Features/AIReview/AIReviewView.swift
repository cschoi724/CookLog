import SwiftUI

struct AIReviewView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel: AIReviewViewModel
    @State private var isExitConfirmationPresented = false
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
        .scrollDismissesKeyboard(.interactively)
        .background(HomeTheme.backgroundBase)
        .navigationTitle(viewModel.isCompletedRecipeEdit ? "레시피 수정" : "레시피 검토")
        .navigationBarTitleDisplayMode(.inline)
        .navigationBarBackButtonHidden(viewModel.hasUnsavedChanges)
        .toolbar {
            if viewModel.hasUnsavedChanges {
                ToolbarItem(placement: .topBarLeading) {
                    Button("취소") {
                        isExitConfirmationPresented = true
                    }
                    .disabled(viewModel.isSaving || viewModel.isSavingDraft)
                }
            }
        }
        .alert("저장하지 않은 변경이 있어요", isPresented: $isExitConfirmationPresented) {
            exitAlertActions
        } message: {
            Text(viewModel.isCompletedRecipeEdit
                 ? "수정을 버리면 마지막으로 저장된 완성 레시피로 돌아갑니다."
                 : "마지막 임시 저장 이후의 변경을 어떻게 처리할지 선택해주세요.")
        }
        .task {
            await viewModel.loadDraft()
        }
    }

    private var loadingState: some View {
        VStack(alignment: .leading, spacing: 12) {
            ProgressView()
            Text(viewModel.isCompletedRecipeEdit
                 ? "저장된 레시피를 불러오는 중입니다."
                 : "STEP Preview를 레시피로 정리하는 중입니다.")
                .font(.body)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.vertical, 24)
        .accessibilityElement(children: .combine)
    }

    private func errorState(_ message: String) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Label(message, systemImage: "exclamationmark.triangle.fill")
                .font(.body)
                .foregroundStyle(HomeTheme.error)

            Button("다시 시도") {
                Task { await viewModel.loadDraft() }
            }
            .buttonStyle(.bordered)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(HomeTheme.backgroundElevated)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }

    private var editorContent: some View {
        VStack(alignment: .leading, spacing: 22) {
            introSection

            if let draftFeedbackMessage = viewModel.draftFeedbackMessage {
                statusBanner(message: draftFeedbackMessage, isError: false)
            }
            if let validationMessage = viewModel.validationMessage {
                statusBanner(message: validationMessage, isError: true)
            }
            if let saveErrorMessage = viewModel.saveErrorMessage {
                saveErrorBanner(saveErrorMessage)
            }
            if let draftSaveErrorMessage = viewModel.draftSaveErrorMessage {
                draftSaveErrorBanner(draftSaveErrorMessage)
            }
            if viewModel.hasDeletedStepToRestore {
                deletedStepBanner
            }

            titleSection
            ingredientsSection
            stepsSection
            estimateSection
            memoSection
            saveSection
        }
        .disabled(viewModel.isSaving)
    }

    private var introSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(viewModel.isCompletedRecipeEdit ? "SAVED RECIPE" : "AI DRAFT")
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundStyle(HomeTheme.accent)

            Text(viewModel.isCompletedRecipeEdit
                 ? "완성한 레시피를 수정해요"
                 : "내 요리와 맞는지 한 번만 확인하세요")
                .font(.title2)
                .fontWeight(.bold)

            Text(viewModel.isCompletedRecipeEdit
                 ? "AI를 다시 호출하지 않고 저장된 레시피를 바로 갱신합니다."
                 : "AI가 추정한 내용을 자유롭게 수정한 뒤 저장하세요.")
                .font(.body)
                .foregroundStyle(.secondary)
        }
    }

    private var titleSection: some View {
        formSection(label: "제목", stateLabel: "확정") {
            TextField("레시피 제목", text: $viewModel.title)
                .textFieldStyle(.roundedBorder)
                .disabled(viewModel.isSavingDraft)
            if viewModel.isTitleMissing {
                Text("레시피 제목을 입력해주세요.")
                    .font(.footnote)
                    .foregroundStyle(HomeTheme.error)
            }
        }
    }

    private var ingredientsSection: some View {
        formSection(label: "재료와 양", stateLabel: "AI 추정") {
            VStack(alignment: .leading, spacing: 12) {
                ForEach($viewModel.ingredients) { $ingredient in
                    IngredientEditorRowView(
                        ingredient: $ingredient,
                        isDisabled: viewModel.isSavingDraft,
                        onDelete: { viewModel.removeIngredient(id: ingredient.id) }
                    )
                }

                Button {
                    viewModel.addIngredient()
                } label: {
                    Label("재료 추가", systemImage: "plus")
                }
                .buttonStyle(.bordered)
                .disabled(viewModel.isSavingDraft)

                Text("이름이 없는 재료의 양은 저장할 수 없습니다.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
    }

    private var stepsSection: some View {
        formSection(label: "조리 순서", stateLabel: "확정 + AI 추정") {
            VStack(alignment: .leading, spacing: 12) {
                Text("위·아래 버튼으로 순서를 바꿀 수 있어요. 저장 시 빈 단계는 제외됩니다.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)

                ForEach(Array(viewModel.steps.enumerated()), id: \.element.id) { index, step in
                    RecipeStepEditorRowView(
                        step: binding(for: step.id),
                        isFirst: index == 0,
                        isLast: index == viewModel.steps.count - 1,
                        isDisabled: viewModel.isSavingDraft,
                        onMoveUp: { viewModel.moveStep(id: step.id, offset: -1) },
                        onMoveDown: { viewModel.moveStep(id: step.id, offset: 1) },
                        onDelete: { viewModel.removeStep(id: step.id) }
                    )
                }

                Button {
                    viewModel.addStep()
                } label: {
                    Label("STEP 추가", systemImage: "plus")
                }
                .buttonStyle(.bordered)
                .disabled(viewModel.isSavingDraft)

                if viewModel.isNonEmptyStepMissing {
                    Text("내용이 있는 조리 단계가 최소 1개 필요합니다.")
                        .font(.footnote)
                        .foregroundStyle(HomeTheme.error)
                }
            }
        }
    }

    private var estimateSection: some View {
        formSection(label: "예상 시간", stateLabel: "AI 추정") {
            VStack(alignment: .leading, spacing: 6) {
                TextField("분 단위", text: $viewModel.estimatedMinutesText)
                    .keyboardType(.numberPad)
                    .textFieldStyle(.roundedBorder)
                    .disabled(viewModel.isSavingDraft)
                Text("기록 간격과 조리 표현을 바탕으로 추정했어요.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
    }

    private var memoSection: some View {
        formSection(label: "메모", stateLabel: "누락 · 선택") {
            VStack(alignment: .leading, spacing: 6) {
                TextEditor(text: $viewModel.memo)
                    .frame(minHeight: 120)
                    .padding(8)
                    .scrollContentBackground(.hidden)
                    .background(HomeTheme.backgroundSubtle)
                    .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
                    .disabled(viewModel.isSavingDraft)
                Text("비워두어도 저장할 수 있어요.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
    }

    private var saveSection: some View {
        VStack(spacing: 12) {
            if !viewModel.isCompletedRecipeEdit {
                Button {
                    Task { _ = await viewModel.saveDraft() }
                } label: {
                    HStack {
                        if viewModel.isSavingDraft { ProgressView() }
                        Text(viewModel.isSavingDraft ? "임시 저장 중" : "임시 저장")
                            .frame(maxWidth: .infinity)
                    }
                    .padding(.vertical, 10)
                }
                .buttonStyle(.bordered)
                .controlSize(.large)
                .disabled(viewModel.isSaving || viewModel.isSavingDraft)
            }

            Button {
                Task {
                    if let recipe = await viewModel.saveRecipe() {
                        onSaved(recipe)
                    }
                }
            } label: {
                HStack {
                    if viewModel.isSaving { ProgressView() }
                    Text(saveButtonTitle)
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                }
                .padding(.vertical, 12)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .tint(HomeTheme.accent)
            .disabled(!viewModel.canSave)
        }
    }

    @ViewBuilder
    private var exitAlertActions: some View {
        if !viewModel.isCompletedRecipeEdit {
            Button("임시 저장하고 나가기") {
                Task {
                    if await viewModel.saveDraft() { dismiss() }
                }
            }
        }

        Button(viewModel.isCompletedRecipeEdit ? "수정 버리고 상세로" : "변경 버리고 나가기", role: .destructive) {
            viewModel.discardChanges()
            dismiss()
        }
        Button("계속 편집", role: .cancel) {}
    }

    private var deletedStepBanner: some View {
        HStack(spacing: 12) {
            Text("STEP을 삭제했어요. 저장 전까지 되돌릴 수 있습니다.")
                .font(.subheadline)
            Spacer()
            Button("되돌리기") { viewModel.restoreDeletedStep() }
        }
        .padding(12)
        .background(HomeTheme.backgroundElevated)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }

    private func statusBanner(message: String, isError: Bool) -> some View {
        Label(message, systemImage: isError ? "exclamationmark.triangle.fill" : "checkmark.circle.fill")
            .font(.subheadline)
            .foregroundStyle(isError ? HomeTheme.error : HomeTheme.success)
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(HomeTheme.backgroundElevated)
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }

    private func saveErrorBanner(_ message: String) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Label(message, systemImage: "exclamationmark.triangle.fill")
                .font(.subheadline)
                .foregroundStyle(HomeTheme.error)

            Button("로컬 저장 다시 시도") {
                Task {
                    if let recipe = await viewModel.saveRecipe() { onSaved(recipe) }
                }
            }
            .buttonStyle(.bordered)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(HomeTheme.backgroundElevated)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }

    private func draftSaveErrorBanner(_ message: String) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Label(message, systemImage: "exclamationmark.triangle.fill")
                .font(.subheadline)
                .foregroundStyle(HomeTheme.error)

            Button("임시 저장 다시 시도") {
                Task { _ = await viewModel.saveDraft() }
            }
            .buttonStyle(.bordered)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(HomeTheme.backgroundElevated)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }

    private func formSection<Content: View>(
        label: String,
        stateLabel: String,
        @ViewBuilder content: () -> Content
    ) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(stateLabel)
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundStyle(.secondary)
            Text(label)
                .font(.headline)
            content()
        }
        .padding(16)
        .background(HomeTheme.backgroundElevated)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }

    private func binding(for stepID: UUID) -> Binding<RecipeStep> {
        Binding(
            get: { viewModel.steps.first(where: { $0.id == stepID }) ?? RecipeStep(order: 0, text: "") },
            set: { updatedStep in
                guard let index = viewModel.steps.firstIndex(where: { $0.id == stepID }) else { return }
                viewModel.steps[index] = updatedStep
            }
        )
    }

    private var saveButtonTitle: String {
        if viewModel.isSaving {
            return viewModel.isCompletedRecipeEdit ? "수정 중" : "저장 중"
        }
        return viewModel.isCompletedRecipeEdit ? "수정 완료" : "레시피 저장"
    }
}

#Preview {
    let environment = AppEnvironment.mock()
    NavigationStack {
        AIReviewView(
            viewModel: AIReviewViewModel(
                recipeID: SampleRecipes.soyPorkBelly.id,
                fetchRecipeUseCase: environment.fetchRecipeUseCase,
                saveRecipeUseCase: environment.saveRecipeUseCase
            ),
            onSaved: { _ in }
        )
    }
}
