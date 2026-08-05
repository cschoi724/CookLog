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
    @Published private(set) var errorMessage: String?

    var recentRecords: [RecipeRecord] {
        Array(records.prefix(3))
    }

    var isEmpty: Bool {
        !isLoading && errorMessage == nil && records.isEmpty
    }

    private let fetchRecordsUseCase: FetchRecipeRecordsUseCase
    private let createRecordUseCase: CreateRecipeRecordUseCase

    init(
        fetchRecordsUseCase: FetchRecipeRecordsUseCase,
        createRecordUseCase: CreateRecipeRecordUseCase
    ) {
        self.fetchRecordsUseCase = fetchRecordsUseCase
        self.createRecordUseCase = createRecordUseCase
    }

    func loadRecords() async {
        guard !isLoading else { return }

        isLoading = true
        errorMessage = nil

        do {
            records = try await fetchRecordsUseCase.execute()
        } catch {
            errorMessage = "요리 기록을 불러오지 못했습니다."
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
            errorMessage = nil
            return destination(for: record)
        } catch {
            errorMessage = "새 요리 기록을 시작하지 못했습니다. 다시 시도해주세요."
            return nil
        }
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
