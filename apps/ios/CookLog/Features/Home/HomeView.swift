import SwiftUI

struct HomeView: View {
    @StateObject private var viewModel: HomeViewModel
    private let refreshToken: Int
    private let onShowAllRecipes: () -> Void
    private let onOpenRecord: (HomeRecordDestination) -> Void

    init(
        viewModel: HomeViewModel,
        refreshToken: Int = 0,
        onShowAllRecipes: @escaping () -> Void,
        onOpenRecord: @escaping (HomeRecordDestination) -> Void
    ) {
        _viewModel = StateObject(wrappedValue: viewModel)
        self.refreshToken = refreshToken
        self.onShowAllRecipes = onShowAllRecipes
        self.onOpenRecord = onOpenRecord
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                hero
                startButton
                preservationNote
                recentSection
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 24)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .background(HomeTheme.backgroundBase)
        .navigationTitle("CookLog")
        .task(id: refreshToken) {
            await viewModel.loadRecords()
        }
        .refreshable {
            await viewModel.loadRecords()
        }
    }

    private var hero: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("나의 주방 기록")
                .font(.caption.weight(.semibold))
                .foregroundStyle(HomeTheme.accent)
                .textCase(.uppercase)

            Text("오늘의 맛을\n잊지 않도록")
                .font(.largeTitle.bold())
                .fixedSize(horizontal: false, vertical: true)

            Text("요리하면서 10초씩 말해보세요.\n다시 만들 수 있는 레시피로 남겨드려요.")
                .font(.body)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private var startButton: some View {
        Button {
            Task {
                if let destination = await viewModel.startNewRecord() {
                    onOpenRecord(destination)
                }
            }
        } label: {
            HStack(spacing: 10) {
                if viewModel.isCreatingRecord {
                    ProgressView()
                        .tint(HomeTheme.textOnAccent)
                } else {
                    Image(systemName: "mic.fill")
                }
                Text(viewModel.isCreatingRecord ? "기록 준비 중" : "10초 요리 기록 시작")
            }
            .font(.headline)
            .foregroundStyle(HomeTheme.textOnAccent)
            .frame(maxWidth: .infinity, minHeight: 52)
        }
        .buttonStyle(.borderedProminent)
        .tint(HomeTheme.accent)
        .disabled(viewModel.isCreatingRecord)
        .accessibilityHint("새 진행 기록을 만들고 요리 기록 화면을 엽니다.")
    }

    private var preservationNote: some View {
        Label("새 기록을 시작해도 기존 진행 기록은 그대로 보존됩니다.", systemImage: "checkmark.shield")
            .font(.footnote)
            .foregroundStyle(.secondary)
            .fixedSize(horizontal: false, vertical: true)
    }

    private var recentSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(alignment: .firstTextBaseline) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(viewModel.records.isEmpty ? "나의 요리 기록" : "최근 레시피")
                        .font(.title3.bold())
                    Text("최근 활동순 · 최대 3개")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Spacer()

                Button("전체 보기", action: onShowAllRecipes)
                    .font(.callout.weight(.semibold))
                    .foregroundStyle(HomeTheme.accent)
                    .frame(minHeight: 44)
            }

            if viewModel.isLoading && viewModel.records.isEmpty {
                HomeFeedbackCard(
                    kind: .loading,
                    title: "레시피를 불러오는 중",
                    message: "나의 요리 기록을 정리하고 있어요."
                )
            } else if let errorMessage = viewModel.errorMessage, viewModel.records.isEmpty {
                HomeFeedbackCard(
                    kind: .error,
                    title: "레시피를 불러오지 못했어요",
                    message: errorMessage,
                    retry: { Task { await viewModel.loadRecords() } }
                )
            } else if viewModel.isEmpty {
                emptyState
            } else {
                if viewModel.isLoading {
                    Label("최근 기록을 새로고침하는 중", systemImage: "arrow.clockwise")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                } else if let errorMessage = viewModel.errorMessage {
                    HomeInlineError(message: errorMessage) {
                        Task { await viewModel.loadRecords() }
                    }
                }

                LazyVStack(spacing: 12) {
                    ForEach(viewModel.recentRecords) { record in
                        recordButton(record)
                    }
                }
            }
        }
    }

    private func recordButton(_ record: RecipeRecord) -> some View {
        Button {
            onOpenRecord(viewModel.destination(for: record))
        } label: {
            RecipeRecordRowView(record: record)
        }
        .buttonStyle(.plain)
        .accessibilityHint("기록 상태에 맞는 화면을 엽니다.")
    }

    private var emptyState: some View {
        HomeFeedbackCard(
            kind: .empty,
            title: "아직 요리 기록이 없어요",
            message: "위의 기록 시작 버튼으로 첫 요리를 10초씩 남겨보세요."
        )
    }
}

struct RecipeLibraryView: View {
    @StateObject private var viewModel: HomeViewModel
    @State private var searchText = ""
    private let onOpenRecord: (HomeRecordDestination) -> Void

    init(
        viewModel: HomeViewModel,
        onOpenRecord: @escaping (HomeRecordDestination) -> Void
    ) {
        _viewModel = StateObject(wrappedValue: viewModel)
        self.onOpenRecord = onOpenRecord
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                intro
                searchPrivacy
                resultSummary
                resultContent
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 24)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .background(HomeTheme.backgroundBase)
        .navigationTitle("전체 보기")
        .navigationBarTitleDisplayMode(.inline)
        .searchable(text: $searchText, prompt: "제목·재료명 검색")
        .task {
            await viewModel.loadRecords()
        }
        .refreshable {
            await viewModel.loadRecords()
        }
    }

    private var results: [HomeSearchResult] {
        viewModel.searchResults(for: searchText)
    }

    private var isSearching: Bool {
        !searchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    private var intro: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("MY COOKLOG")
                .font(.caption.weight(.semibold))
                .foregroundStyle(HomeTheme.accent)
            Text("모든 요리 기록")
                .font(.title.bold())
            Text("진행 중인 기록과 완료 레시피를 최근 활동순으로 모았습니다.")
                .font(.body)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private var searchPrivacy: some View {
        Label("기기 안에서만 검색하며 서버나 AI로 보내지 않습니다.", systemImage: "lock")
            .font(.caption)
            .foregroundStyle(.secondary)
            .fixedSize(horizontal: false, vertical: true)
    }

    private var resultSummary: some View {
        HStack(alignment: .firstTextBaseline) {
            Text(isSearching ? "\(results.count)개 결과" : "최근 활동순 · \(results.count)개")
                .font(.headline)
            Spacer()
            Text(isSearching ? "STEP Preview 초안 제외" : "정렬·필터 없음")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }

    @ViewBuilder
    private var resultContent: some View {
        if viewModel.isLoading && viewModel.records.isEmpty {
            HomeFeedbackCard(
                kind: .loading,
                title: "요리 기록을 불러오는 중",
                message: "기기에 저장된 기록을 확인하고 있어요."
            )
        } else if let errorMessage = viewModel.errorMessage, viewModel.records.isEmpty {
            HomeFeedbackCard(
                kind: .error,
                title: "요리 기록을 불러오지 못했어요",
                message: errorMessage,
                retry: { Task { await viewModel.loadRecords() } }
            )
        } else if results.isEmpty {
            HomeFeedbackCard(
                kind: .empty,
                title: isSearching ? "일치하는 레시피가 없어요" : "아직 요리 기록이 없어요",
                message: isSearching
                    ? "제목이나 재료명을 다시 확인하거나 검색어를 지워보세요."
                    : "Home에서 첫 요리 기록을 시작해보세요.",
                retryTitle: isSearching ? "검색어 지우기" : nil,
                retry: isSearching ? { searchText = "" } : nil
            )
        } else {
            if viewModel.isLoading {
                ProgressView("새로고침 중")
                    .font(.footnote)
            } else if let errorMessage = viewModel.errorMessage {
                HomeInlineError(message: errorMessage) {
                    Task { await viewModel.loadRecords() }
                }
            }

            LazyVStack(spacing: 12) {
                ForEach(results) { result in
                    Button {
                        onOpenRecord(viewModel.destination(for: result.record))
                    } label: {
                        RecipeRecordRowView(record: result.record, searchMatch: result.match)
                    }
                    .buttonStyle(.plain)
                    .accessibilityHint("기록 상태에 맞는 화면을 엽니다.")
                }
            }
        }
    }
}

private struct HomeInlineError: View {
    let message: String
    let retry: () -> Void

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(HomeTheme.error)
            Text(message)
                .font(.footnote)
                .frame(maxWidth: .infinity, alignment: .leading)
            Button("다시 시도", action: retry)
                .font(.footnote.weight(.semibold))
        }
        .padding(12)
        .background(HomeTheme.error.opacity(0.1), in: RoundedRectangle(cornerRadius: 12))
    }
}

private struct HomeFeedbackCard: View {
    enum Kind: Equatable {
        case loading
        case empty
        case error
    }

    let kind: Kind
    let title: String
    let message: String
    var retryTitle: String? = "다시 시도"
    var retry: (() -> Void)?

    var body: some View {
        VStack(spacing: 12) {
            if kind == .loading {
                ProgressView()
            } else {
                Image(systemName: kind == .error ? "exclamationmark.triangle" : "book.closed")
                    .font(.title2)
                    .foregroundStyle(kind == .error ? HomeTheme.error : HomeTheme.accent)
            }

            Text(title)
                .font(.headline)
                .multilineTextAlignment(.center)

            Text(message)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)

            if let retry, let retryTitle {
                Button(retryTitle, action: retry)
                    .buttonStyle(.bordered)
                    .tint(HomeTheme.accent)
                    .frame(minHeight: 44)
            }
        }
        .padding(24)
        .frame(maxWidth: .infinity, minHeight: 180)
        .background(HomeTheme.backgroundElevated)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}

#Preview {
    let environment = AppEnvironment.mock()
    NavigationStack {
        HomeView(
            viewModel: HomeViewModel(
                fetchRecordsUseCase: environment.fetchRecipeRecordsUseCase,
                createRecordUseCase: environment.createRecipeRecordUseCase
            ),
            onShowAllRecipes: {},
            onOpenRecord: { _ in }
        )
    }
}
