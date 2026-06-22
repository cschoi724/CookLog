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
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                recordingPanel
                messageSection
                stepPreviewSection
                generateButton
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 24)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("요리 기록")
    }

    private var recordingPanel: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 8) {
                Text(recordingTitle)
                    .font(.title3)
                    .fontWeight(.semibold)

                Text("요리 중 떠오르는 내용을 짧게 말하면 STEP Preview로 쌓입니다.")
                    .font(.body)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            HStack(alignment: .center, spacing: 14) {
                Text("\(viewModel.remainingSeconds)")
                    .font(.system(size: 44, weight: .semibold, design: .rounded))
                    .monospacedDigit()
                    .frame(width: 72, alignment: .leading)

                VStack(alignment: .leading, spacing: 4) {
                    Text("남은 시간")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)

                    Text(recordingStateText)
                        .font(.body)
                        .fontWeight(.medium)
                }

                Spacer()
            }

            Button {
                Task {
                    await viewModel.recordStep()
                }
            } label: {
                Label(recordButtonTitle, systemImage: "mic.fill")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .disabled(viewModel.isRecording)
        }
        .padding(16)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
    }

    @ViewBuilder
    private var messageSection: some View {
        if let errorMessage = viewModel.errorMessage {
            Text(errorMessage)
                .font(.subheadline)
                .foregroundStyle(.red)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    private var stepPreviewSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("STEP Preview")
                .font(.headline)

            if viewModel.stepPreviews.isEmpty {
                emptyState
            } else {
                LazyVStack(spacing: 10) {
                    ForEach(viewModel.stepPreviews) { stepPreview in
                        StepPreviewRowView(stepPreview: stepPreview)
                    }
                }
            }
        }
    }

    private var emptyState: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("아직 기록된 단계가 없습니다.")
                .font(.body)
                .fontWeight(.medium)

            Text("10초 기록을 시작하면 STT 결과가 이곳에 추가됩니다.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.vertical, 20)
    }

    private var generateButton: some View {
        Button {
            onGenerateRecipeDraft(viewModel.stepPreviews)
        } label: {
            Label("AI 정리하기", systemImage: "sparkles")
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
        }
        .buttonStyle(.bordered)
        .controlSize(.large)
        .disabled(!viewModel.canGenerateRecipeDraft)
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
            return "STEP Preview를 만드는 중입니다."
        }
    }

    private var recordButtonTitle: String {
        viewModel.isRecording ? "기록 중" : "10초 기록"
    }
}

#Preview {
    NavigationStack {
        CookingLogView(
            viewModel: CookingLogViewModel(
                speechRecognitionService: MockSpeechRecognitionService(),
                addStepPreviewUseCase: AddStepPreviewUseCase()
            )
        )
    }
}
