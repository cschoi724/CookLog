import Foundation

enum HomeRecordDestination: Equatable {
    case cookingLog(recordID: UUID, stepPreviews: [StepPreview])
    case aiReview(recordID: UUID, stepPreviews: [StepPreview])
    case recipeDetail(recordID: UUID)
}

enum HomeSearchMatch: Equatable {
    case title
    case ingredient

    var label: String {
        switch self {
        case .title:
            return "제목 일치"
        case .ingredient:
            return "재료 일치"
        }
    }
}

struct HomeSearchResult: Identifiable, Equatable {
    let record: RecipeRecord
    let match: HomeSearchMatch?

    var id: UUID { record.id }
}

@MainActor
final class HomeViewModel: ObservableObject {
    @Published private(set) var records: [RecipeRecord] = []
    @Published private(set) var isLoading = false
    @Published private(set) var isCreatingRecord = false
    @Published private(set) var isDeletingRecord = false
    @Published private(set) var loadErrorMessage: String?
    @Published private(set) var creationErrorMessage: String?
    @Published private(set) var deletionErrorMessage: String?

    var recentRecords: [RecipeRecord] {
        Array(records.prefix(3))
    }

    var isEmpty: Bool {
        !isLoading && loadErrorMessage == nil && records.isEmpty
    }

    var reviewReadyRecord: RecipeRecord? {
        records.first { $0.lifecycleState == .draftAIReview }
    }

    private let fetchRecordsUseCase: FetchRecipeRecordsUseCase
    private let createRecordUseCase: CreateRecipeRecordUseCase
    private let deleteRecordUseCase: DeleteRecipeRecordUseCase
    private var failedDeletionRecordID: UUID?

    init(
        fetchRecordsUseCase: FetchRecipeRecordsUseCase,
        createRecordUseCase: CreateRecipeRecordUseCase,
        deleteRecordUseCase: DeleteRecipeRecordUseCase
    ) {
        self.fetchRecordsUseCase = fetchRecordsUseCase
        self.createRecordUseCase = createRecordUseCase
        self.deleteRecordUseCase = deleteRecordUseCase
    }

    func loadRecords() async {
        guard !isLoading else { return }

        isLoading = true
        loadErrorMessage = nil

        do {
            records = try await fetchRecordsUseCase.execute()
        } catch {
            loadErrorMessage = "요리 기록을 불러오지 못했습니다."
        }

        isLoading = false
    }

    func startNewRecord() async -> HomeRecordDestination? {
        guard !isCreatingRecord else { return nil }

        isCreatingRecord = true
        defer { isCreatingRecord = false }

        do {
            let record = try await createRecordUseCase.execute()
            records.insert(record, at: 0)
            creationErrorMessage = nil
            return destination(for: record)
        } catch {
            creationErrorMessage = "새 요리 기록을 시작하지 못했습니다. 기존 기록은 그대로 보존됩니다."
            return nil
        }
    }

    func deleteRecord(_ record: RecipeRecord) async -> Bool {
        guard record.lifecycleState != .completed, !isDeletingRecord else { return false }

        isDeletingRecord = true
        deletionErrorMessage = nil

        do {
            try await deleteRecordUseCase.execute(id: record.id)
            records.removeAll { $0.id == record.id }
            failedDeletionRecordID = nil
            isDeletingRecord = false
            return true
        } catch {
            failedDeletionRecordID = record.id
            deletionErrorMessage = "진행 기록을 삭제하지 못했습니다. 기록은 그대로 보존됩니다."
            isDeletingRecord = false
            return false
        }
    }

    func retryFailedDeletion() async -> Bool {
        guard let recordID = failedDeletionRecordID,
              let record = records.first(where: { $0.id == recordID }) else {
            return false
        }
        return await deleteRecord(record)
    }

    func dismissDeletionError() {
        deletionErrorMessage = nil
        failedDeletionRecordID = nil
    }

    func hideDeletionError() {
        deletionErrorMessage = nil
    }

    func destination(for record: RecipeRecord) -> HomeRecordDestination {
        switch record.lifecycleState {
        case .draftStepPreview:
            return .cookingLog(recordID: record.id, stepPreviews: record.stepPreviews)
        case .draftAIReview:
            return .aiReview(recordID: record.id, stepPreviews: record.stepPreviews)
        case .completed:
            return .recipeDetail(recordID: record.id)
        }
    }

    func searchResults(for query: String) -> [HomeSearchResult] {
        let normalizedQuery = normalized(query)
        guard !normalizedQuery.isEmpty else {
            return records.map { HomeSearchResult(record: $0, match: nil) }
        }

        var titleMatches: [HomeSearchResult] = []
        var ingredientMatches: [HomeSearchResult] = []

        for record in records where record.lifecycleState != .draftStepPreview {
            if normalized(record.homeTitle).contains(normalizedQuery) {
                titleMatches.append(HomeSearchResult(record: record, match: .title))
            } else if record.homeIngredients.contains(where: { normalized($0.name).contains(normalizedQuery) }) {
                ingredientMatches.append(HomeSearchResult(record: record, match: .ingredient))
            }
        }

        return titleMatches + ingredientMatches
    }

    private func normalized(_ value: String) -> String {
        value
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .folding(options: [.caseInsensitive, .diacriticInsensitive], locale: Locale(identifier: "ko_KR"))
    }
}

extension RecipeRecord {
    var homeTitle: String {
        switch lifecycleState {
        case .draftStepPreview:
            return "작성 중인 요리"
        case .draftAIReview:
            return reviewDraft?.title.nonEmpty ?? "검토 중인 요리"
        case .completed:
            return completedRecipe?.title.nonEmpty ?? "완료 레시피"
        }
    }

    var homeIngredients: [Ingredient] {
        switch lifecycleState {
        case .draftStepPreview:
            return []
        case .draftAIReview:
            return reviewDraft?.ingredients ?? []
        case .completed:
            return completedRecipe?.ingredients ?? []
        }
    }
}

private extension String {
    var nonEmpty: String? {
        let trimmed = trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed.isEmpty ? nil : trimmed
    }
}
