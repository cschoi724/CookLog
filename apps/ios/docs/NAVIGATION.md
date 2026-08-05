# CookLog iOS Navigation

이 문서는 CookLog iOS 앱의 화면 이동 기준을 관리합니다.

최종 업데이트: 2026-08-05
상태: 확정

## 1. Navigation 기준

Navigation은 `NavigationStack`과 `AppRoute`로 관리합니다.

```swift
enum AppRoute: Hashable {
    case recipeLibrary
    case cookingLog(recordID: UUID, stepPreviews: [StepPreview])
    case aiReview(recordID: UUID, stepPreviews: [StepPreview])
    case recipeDetail(UUID)
    case audioPlayer(UUID)
}
```

기준:

- 화면 이동은 `AppRoute`로 표현합니다.
- 문자열 기반 route는 사용하지 않습니다.
- MVP에서는 거대한 전역 Router 객체를 만들지 않습니다.
- 화면별 modal이 꼭 필요할 때만 `sheet`를 사용합니다.

## 2. MVP 화면 이동

기록 흐름:

```text
Home
-> RecipeLibrary
-> CookingLog | AIReview | RecipeDetail
```

기록 흐름:

```text
Home
-> CookingLog
-> AIReview
-> RecipeDetail
-> AudioPlayer
```

다시 요리 흐름:

```text
Home
-> RecipeDetail
-> AudioPlayer
```

## 3. Route별 입력

- `recipeLibrary`: 진행 기록과 완료 레시피 전체 보기·로컬 검색을 표시합니다.
- `cookingLog(recordID:stepPreviews:)`: 새 기록 또는 `draft_step_preview`를 동일 record ID와 STEP으로 복원합니다.
- `aiReview(recordID:stepPreviews:)`: `draft_ai_review`를 동일 record ID로 열며, Review 내부 복구·저장은 T-20260805-005에서 이 route 입력을 사용합니다.
- `recipeDetail(_:)`: `completed` record와 같은 UUID의 저장 레시피를 조회합니다.
- `audioPlayer(_:)`: 저장된 레시피의 단계를 오디오 가이드로 재생합니다.

Home route 기준:

- `draft_step_preview` → `cookingLog(recordID:stepPreviews:)`
- `draft_ai_review` → `aiReview(recordID:stepPreviews:)`
- `completed` → `recipeDetail(_:)`
- 앱 재실행·새로고침·검색 전후에도 선택한 `RecipeRecord.id`를 새 UUID로 바꾸지 않습니다.
- 전체 보기 검색은 `draft_ai_review`와 `completed`의 제목·재료명만 기기 안에서 검색하며 STEP Preview 초안·조리 순서·메모는 제외합니다.

## 4. Modal 기준

MVP에서는 기본적으로 push navigation을 사용합니다.

Modal 사용 후보:

- 권한 안내
- 저장 실패 안내
- 삭제 확인

기준:

- 주요 사용자 흐름은 modal 안에 가두지 않습니다.
- AI Review와 Audio Player는 독립 화면으로 둡니다.
