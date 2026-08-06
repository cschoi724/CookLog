import SwiftUI

struct CookingLogView: View {
    @StateObject private var viewModel: CookingLogViewModel
    private let onGenerateRecipeDraft: ([StepPreview]) -> Void

    init(
        viewModel: CookingLogViewModel,
        onGenerateRecipeDraft: @escaping ([StepPreview]) -> Void = { _ in }
    ) {
        _viewModel = StateObject(wrappedValue: viewModel)
        self.onGenerateRecipeDraft = onGenerateRecipeDraft
    }

    var body: some View {
        List {
            Section {
                recordingPanel
                    .listRowInsets(EdgeInsets())
                    .listRowBackground(Color.clear)
                    .listRowSeparator(.hidden)
            }

            if viewModel.errorMessage != nil || viewModel.saveFeedbackMessage != nil {
                Section {
                    messageSection
                        .listRowInsets(EdgeInsets())
                        .listRowBackground(Color.clear)
                        .listRowSeparator(.hidden)
                }
            }

            Section {
                if viewModel.stepPreviews.isEmpty && viewModel.pendingStepOrder == nil {
                    emptyState
                } else {
                    ForEach(viewModel.stepPreviews) { stepPreview in
                        StepPreviewRowView(
                            stepPreview: stepPreview,
                            onDelete: {
                                Task { _ = await viewModel.deleteStep(stepPreview) }
                            },
                            isDeletionDisabled: viewModel.isRecording || viewModel.isSavingDraft
                        )
                        .listRowInsets(EdgeInsets(top: 5, leading: 0, bottom: 5, trailing: 0))
                        .listRowBackground(Color.clear)
                        .listRowSeparator(.hidden)
                        .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                            Button("삭제", role: .destructive) {
                                Task { _ = await viewModel.deleteStep(stepPreview) }
                            }
                            .disabled(viewModel.isRecording || viewModel.isSavingDraft)
                        }
                    }

                    if let pendingStepOrder = viewModel.pendingStepOrder {
                        PendingStepPreviewRowView(order: pendingStepOrder)
                            .listRowInsets(EdgeInsets(top: 5, leading: 0, bottom: 5, trailing: 0))
                            .listRowBackground(Color.clear)
                            .listRowSeparator(.hidden)
                    }
                }
            } header: {
                Text("STEP Preview")
            } footer: {
                Text("STEP Preview는 AI 결과가 아니라 말한 원문이며, 추가·삭제·되돌리기 후 기기에 자동 저장됩니다.")
            }

            Section {
                generateButton
                    .listRowInsets(EdgeInsets())
                    .listRowBackground(Color.clear)
                    .listRowSeparator(.hidden)
            }
        }
        .listStyle(.insetGrouped)
        .navigationTitle("요리 기록")
    }

    private var recordingPanel: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 8) {
                Text(recordingTitle)
                    .font(.title3.weight(.semibold))

                Text("요리 중 떠오르는 내용을 짧게 말하면 STEP Preview로 쌓입니다.")
                    .font(.body)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            HStack(alignment: .center, spacing: 14) {
                Text("\(viewModel.remainingSeconds)")
                    .font(.system(.largeTitle, design: .rounded, weight: .semibold))
                    .monospacedDigit()
                    .frame(minWidth: 72, alignment: .leading)
                    .accessibilityLabel("남은 시간 \(viewModel.remainingSeconds)초")

                VStack(alignment: .leading, spacing: 4) {
                    Text("남은 시간")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)

                    Text(recordingStateText)
                        .font(.body.weight(.medium))
                }

                Spacer()
            }

            Button {
                Task { await viewModel.recordStep() }
            } label: {
                if viewModel.recordingState == .processing || viewModel.isSavingDraft {
                    HStack {
                        ProgressView()
                        Text(recordButtonTitle)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                } else {
                    Label(recordButtonTitle, systemImage: "mic.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                }
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .disabled(viewModel.isRecording || viewModel.isSavingDraft)
            .accessibilityHint("최대 10초 동안 말한 내용을 새 STEP Preview로 기록합니다.")
        }
        .padding(16)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }

    @ViewBuilder
    private var messageSection: some View {
        if let errorMessage = viewModel.errorMessage {
            CookingLogStatusBanner(
                systemImage: "exclamationmark.triangle.fill",
                title: errorTitle,
                message: errorMessage,
                color: .red,
                actionTitle: errorActionTitle,
                action: errorAction
            )
        } else if let saveFeedbackMessage = viewModel.saveFeedbackMessage {
            CookingLogStatusBanner(
                systemImage: "checkmark.circle.fill",
                title: "자동 저장됨",
                message: saveFeedbackMessage,
                color: .green,
                actionTitle: viewModel.canUndoDeletion ? "되돌리기" : nil,
                action: viewModel.canUndoDeletion
                    ? { Task { _ = await viewModel.undoLastDeletion() } }
                    : nil
            )
        }
    }

    private var emptyState: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("아직 기록된 단계가 없습니다.")
                .font(.body.weight(.medium))

            Text("10초 기록을 시작하면 STT 원문이 이곳에 추가됩니다.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.vertical, 12)
    }

    private var generateButton: some View {
        Button {
            onGenerateRecipeDraft(viewModel.recipeDraftSnapshot)
        } label: {
            Label("AI 정리하기", systemImage: "sparkles")
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
        }
        .buttonStyle(.bordered)
        .controlSize(.large)
        .disabled(!viewModel.canGenerateRecipeDraft)
        .accessibilityHint("현재까지 자동 저장된 STEP Preview 전체를 레시피 검토 화면으로 전달합니다.")
    }

    private var recordingTitle: String {
        switch viewModel.recordingState {
        case .idle:
            return "10초 음성 기록"
        case .recording:
            return "기록 중"
        case .processing:
            return "음성을 정리하는 중"
        }
    }

    private var recordingStateText: String {
        switch viewModel.recordingState {
        case .idle:
            return "준비됨"
        case .recording:
            return "말하고 있는 내용을 기록합니다."
        case .processing:
            return "STEP \(viewModel.pendingStepOrder ?? viewModel.nextStepOrder)을 만드는 중입니다."
        }
    }

    private var recordButtonTitle: String {
        switch viewModel.recordingState {
        case .recording:
            return "기록 중"
        case .processing:
            return "처리 중"
        case .idle:
            if viewModel.errorRecoveryAction == .recordAgain {
                return "다시 기록"
            }
            return viewModel.stepPreviews.isEmpty ? "10초 기록" : "10초 더 기록"
        }
    }

    private var errorActionTitle: String? {
        switch viewModel.errorRecoveryAction {
        case .recordAgain:
            return "다시 기록"
        case .undoDeletion:
            return "되돌리기 재시도"
        case .none:
            return nil
        }
    }

    private var errorTitle: String {
        switch viewModel.errorRecoveryAction {
        case .recordAgain:
            return "기록을 완료하지 못했어요"
        case .undoDeletion:
            return "STEP을 되돌리지 못했어요"
        case .none:
            return "STEP을 변경하지 못했어요"
        }
    }

    private var errorAction: (() -> Void)? {
        switch viewModel.errorRecoveryAction {
        case .recordAgain:
            return { Task { await viewModel.recordStep() } }
        case .undoDeletion:
            return { Task { _ = await viewModel.undoLastDeletion() } }
        case .none:
            return nil
        }
    }
}

private struct CookingLogStatusBanner: View {
    let systemImage: String
    let title: String
    let message: String
    let color: Color
    var actionTitle: String? = "다시 기록"
    var action: (() -> Void)?

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: systemImage)
                .foregroundStyle(color)
                .accessibilityHidden(true)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                Text(message)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Spacer(minLength: 8)

            if let actionTitle, let action {
                Button(actionTitle, action: action)
                    .font(.callout.weight(.semibold))
                    .frame(minHeight: 44)
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(color.opacity(0.1), in: RoundedRectangle(cornerRadius: 12))
        .accessibilityElement(children: .contain)
    }
}

#Preview {
    let record = RecipeRecord()
    let localDataSource = InMemoryRecipeRecordLocalDataSource(records: [record])
    let repository = DefaultRecipeRecordRepository(localDataSource: localDataSource)

    NavigationStack {
        CookingLogView(
            viewModel: CookingLogViewModel(
                speechRecognitionService: MockSpeechRecognitionService(),
                addStepPreviewUseCase: AddStepPreviewUseCase(),
                saveStepPreviewDraftUseCase: SaveStepPreviewDraftUseCase(repository: repository),
                session: CookingLogSession(id: record.id)
            )
        )
    }
}
