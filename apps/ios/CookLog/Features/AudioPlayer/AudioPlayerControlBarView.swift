import SwiftUI

struct AudioPlayerControlBarView: View {
    let isPlaying: Bool
    let canMoveToPreviousStep: Bool
    let canMoveToNextStep: Bool
    let onPrevious: () -> Void
    let onNext: () -> Void
    let onReplay: () -> Void
    let onPlay: () -> Void
    let onStop: () -> Void

    var body: some View {
        HStack(spacing: 14) {
            Button(action: onPrevious) {
                Image(systemName: "backward.end.fill")
                    .frame(width: 34, height: 34)
            }
            .disabled(!canMoveToPreviousStep)

            Button(action: onReplay) {
                Image(systemName: "gobackward")
                    .frame(width: 34, height: 34)
            }

            Button(action: isPlaying ? onStop : onPlay) {
                Image(systemName: isPlaying ? "stop.fill" : "play.fill")
                    .font(.title3)
                    .frame(width: 44, height: 44)
            }
            .buttonStyle(.borderedProminent)
            .clipShape(Circle())

            Button(action: onNext) {
                Image(systemName: "forward.end.fill")
                    .frame(width: 34, height: 34)
            }
            .disabled(!canMoveToNextStep)
        }
        .buttonStyle(.bordered)
        .frame(maxWidth: .infinity)
        .padding(.horizontal, 20)
        .padding(.vertical, 14)
        .background(.regularMaterial)
    }
}
