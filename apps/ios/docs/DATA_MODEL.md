# CookLog iOS Data Model

이 문서는 CookLog iOS 앱의 도메인 모델 기준을 관리합니다.

최종 업데이트: 2026-08-05
상태: 확정

## 1. 모델 원칙

도메인 모델은 SwiftData `@Model`에 직접 묶지 않습니다.

기준:

- 앱 내부 행위는 도메인 모델 기준으로 작성합니다.
- SwiftData 저장 모델은 `Data/Persistence/`에 따로 둡니다.
- 저장 모델과 도메인 모델 변환은 Mapper 또는 initializer로 분리합니다.
- 향후 서버 저장, Android 스키마, Import/OCR이 추가되어도 도메인 모델을 기준으로 확장합니다.

## 2. Recipe

```swift
struct Recipe: Identifiable, Equatable {
    let id: UUID
    var title: String
    var ingredients: [Ingredient]
    var steps: [RecipeStep]
    var memo: String
    var estimatedTime: TimeInterval?
    var source: RecipeSource
    var syncStatus: SyncStatus
    var ownerId: String?
    var createdAt: Date
    var updatedAt: Date
}
```

MVP 사용:

- `source`는 `.voiceLog`
- `syncStatus`는 `.localOnly`
- `ownerId`는 `nil`

## 3. Ingredient

```swift
struct Ingredient: Identifiable, Equatable {
    let id: UUID
    var name: String
    var amountText: String?
}
```

## 4. RecipeStep

```swift
struct RecipeStep: Identifiable, Equatable {
    let id: UUID
    var order: Int
    var text: String
    var duration: TimeInterval?
    var note: String?
}
```

## 5. StepPreview

```swift
struct StepPreview: Identifiable, Equatable {
    let id: UUID
    var order: Int
    var transcript: String
    var createdAt: Date
}
```

MVP에서는 저장 전 작성 중 상태로만 사용합니다. 레시피 저장 후에는 `RecipeStep`으로 변환됩니다.

## 6. CookingLogSession

```swift
struct CookingLogSession: Identifiable, Equatable {
    let id: UUID
    var stepPreviews: [StepPreview]
    var createdAt: Date
    var updatedAt: Date
}
```

MVP에서는 메모리 상태로 시작합니다. 작성 중 세션 복원이 필요해지면 영구 저장을 검토합니다.

## 7. RecipeDraft

```swift
struct RecipeDraft: Equatable {
    var title: String
    var ingredients: [Ingredient]
    var steps: [RecipeStep]
    var memo: String
    var estimatedTime: TimeInterval?
    var source: RecipeSource
}
```

`RecipeDraft`는 AI Review 화면의 수정 가능한 저장 전 결과입니다.

흐름:

```text
StepPreview[] -> RecipeGenerationRepository -> RecipeDraft -> 사용자 수정 -> Recipe 저장
```

## 8. RecipeRecord와 생명주기

첫 공개 출시에서는 진행 기록과 완료 레시피를 `RecipeRecord` 단일 식별자로 관리합니다.

```text
draft_step_preview -> draft_ai_review -> completed
```

- `draft_step_preview`: 순서가 정규화된 `StepPreview` 배열과 선택적 AI 요청 식별자를 가집니다.
- `draft_ai_review`: 마지막으로 성공한 수동 임시 저장 `RecipeDraft` snapshot을 가집니다.
- `completed`: 같은 UUID를 가진 `Recipe`를 가집니다.
- AI 처리 중에는 STEP snapshot을 잠그고 성공 또는 실패 시 잠금을 해제합니다.
- 허용되지 않은 역방향 전이와 다른 UUID로 완료 전환하는 동작은 오류로 거부합니다.
- 완료 전환 시 진행 중 STEP과 Review draft를 제거해 같은 기록의 중복 Recipe 생성을 막습니다.

`RecipeRecordRepository`는 여러 진행 기록과 완료 레시피를 최근 활동 시간순으로 조회하고,
자동 STEP 저장·수동 Review 임시 저장·완료 전환을 같은 record 단위로 영속화합니다.

## 9. RecipeGenerationInput

```swift
enum RecipeGenerationInput: Equatable {
    case stepPreviews([StepPreview])
    case plainText(String)
    case importedText(source: RecipeSource, text: String)
}
```

MVP에서는 `.stepPreviews`만 사용합니다. 향후 블로그 Import, 유튜브 Import, OCR 입력을 같은 AI 정리 경계로 연결하기 위한 확장 지점입니다.

## 10. RecipeSource

```swift
enum RecipeSource: String, Codable {
    case voiceLog
    case textImport
    case blogImport
    case youtubeImport
    case imageOCR
    case manual
}
```

MVP에서는 `.voiceLog`만 사용합니다.

## 11. SyncStatus

```swift
enum SyncStatus: String, Codable {
    case localOnly
    case pendingUpload
    case synced
    case failed
}
```

MVP에서는 `.localOnly`만 사용합니다. 서버 저장이나 동기화 기능은 구현하지 않습니다.
