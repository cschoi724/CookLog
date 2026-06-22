# CookLog iOS Navigation

이 문서는 CookLog iOS 앱의 화면 이동 기준을 관리합니다.

최종 업데이트: 2026-06-22
상태: 확정

## 1. Navigation 기준

Navigation은 `NavigationStack`과 `AppRoute`로 관리합니다.

```swift
enum AppRoute: Hashable {
    case cookingLog
    case aiReview(sessionId: UUID)
    case recipeDetail(recipeId: UUID)
    case audioPlayer(recipeId: UUID)
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

- `cookingLog`: 새 작성 세션을 시작합니다.
- `aiReview(sessionId:)`: 작성 중 `CookingLogSession`의 STEP Preview를 기반으로 레시피 초안을 생성합니다.
- `recipeDetail(recipeId:)`: 저장된 레시피를 조회합니다.
- `audioPlayer(recipeId:)`: 저장된 레시피의 단계를 오디오 가이드로 재생합니다.

## 4. Modal 기준

MVP에서는 기본적으로 push navigation을 사용합니다.

Modal 사용 후보:

- 권한 안내
- 저장 실패 안내
- 삭제 확인

기준:

- 주요 사용자 흐름은 modal 안에 가두지 않습니다.
- AI Review와 Audio Player는 독립 화면으로 둡니다.
