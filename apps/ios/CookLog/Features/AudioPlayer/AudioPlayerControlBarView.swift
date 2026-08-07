import SwiftUI

struct AudioPlayerControlBarView: View {
    let isPlaying: Bool
    let canMoveToPreviousStep: Bool
    let canMoveToNextStep: Bool
    let onAction: (AudioGuideAction) -> Void

    var body: some View {
        HStack(spacing: 14) {
            controlButton(
                action: .previous,
                systemImage: "backward.end.fill",
                accessibilityLabel: "이전 단계"
            )
            .disabled(!canMoveToPreviousStep)

            controlButton(
                action: .replay,
                systemImage: "gobackward",
                accessibilityLabel: "현재 단계 다시 듣기"
            )

            Button {
                onAction(isPlaying ? .pause : .resume)
            } label: {
                Image(systemName: isPlaying ? "pause.fill" : "play.fill")
                    .font(.title3)
                    .frame(width: 44, height: 44)
            }
            .buttonStyle(.borderedProminent)
            .buttonBorderShape(.circle)
            .accessibilityLabel(isPlaying ? "일시정지" : "재생")

            controlButton(
                action: .next,
                systemImage: "forward.end.fill",
                accessibilityLabel: "다음 단계"
            )
            .disabled(!canMoveToNextStep)
        }
        .tint(HomeTheme.accent)
        .frame(maxWidth: .infinity)
        .padding(.horizontal, 20)
        .padding(.vertical, 14)
        .background(HomeTheme.backgroundElevated)
    }

    private func controlButton(
        action: AudioGuideAction,
        systemImage: String,
        accessibilityLabel: String
    ) -> some View {
        Button {
            onAction(action)
        } label: {
            Image(systemName: systemImage)
                .frame(width: 44, height: 44)
        }
        .buttonStyle(.bordered)
        .buttonBorderShape(.circle)
        .accessibilityLabel(accessibilityLabel)
    }
}
