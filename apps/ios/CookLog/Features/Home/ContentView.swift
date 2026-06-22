import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 12) {
            Text("CookLog")
                .font(.title)
                .fontWeight(.semibold)

            Text("요리 기록을 시작할 준비가 되었습니다.")
                .font(.body)
                .foregroundStyle(.secondary)
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
