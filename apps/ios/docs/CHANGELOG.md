# CookLog iOS Changelog

이 문서는 iOS 앱 개발 변경 기록을 관리합니다.

## 2026-08-07

- Product Owner가 `T-20260805-006`의 독립 QA·완료 리뷰 잔여 위험을 수용하고 완료·병합을
  승인했습니다. PR #101의 `ios-build`·`ios-xctest` 통과 후 squash merge SHA
  `dcf58d5`를 확인해 공용 `done`으로 확정했습니다.
- 독립 재검증에서 `QA-HIGH-806006-001` 해소, 전체 XCTest 77/77과 390×844·375×667
  Light/Dark 4종을 확인해 `PASS_WITH_RISK`로 판정했습니다. 일시적 attachment 생성
  비결정성은 `T-20260805-008` 통합 Visual QA에 이관했습니다.
- `T-20260805-006`의 Audio Player ScrollView 하단에 `safeAreaInset(edge: .bottom)`을
  적용해 375×667에서 고정 control bar가 `재료 알려줘` CTA와 안내 문구를 가리던
  `QA-HIGH-806006-001`을 수정했습니다.
- 390×844·375×667 Light/Dark 하단 도달 렌더링 4/4, 전체 XCTest 77/77과 iOS
  Simulator Debug build를 통과해 동일 iOS QA Agent에 독립 재검증을 요청했습니다.
- `T-20260805-006` 독립 QA에서 전체 XCTest 77/77과 기능 계약은 통과했으나 375×667
  Light/Dark에서 `재료 알려줘` CTA가 하단 고정 control bar에 가려지는
  `QA-HIGH-806006-001`을 확인했습니다. Product Owner가 safe-area/content inset 한정
  재작업을 승인했으며 기존 상태·action·보존 로직과 44pt 버튼은 유지합니다.
- `T-20260805-006`에서 Audio Player의 Paused·Playing·Loading·Error·No Steps와
  not-found subtype, 자동 재생 없는 첫 단계 준비를 구현했습니다.
- 이전·다음·멈춰·계속·다시 들려줘·재료 알려줘·핸즈프리 종료를 하나의
  `AudioGuideAction`으로 정의하고 버튼·테스트 입력이 같은 reducer를 사용하게 했습니다.
- 명시적 핸즈프리 시작·종료, 재료 안내, 첫/마지막·불확실 입력 보존과 오디오 중단·
  백그라운드·잠금·이탈 후 자동 재생·자동 핸즈프리 금지 상태를 추가했습니다.
- CookLog Light/Dark 토큰, Dynamic Type, SF Symbols와 44pt 이상 네이티브 버튼을 유지하고
  집중 13/13·전체 XCTest 77/77·build·4개 viewport 렌더링을 통과해 iOS QA에 인계했습니다.
- Product Owner가 `T-20260805-006` Audio Guide·핸즈프리 UI·공통 action model 구현을
  승인했습니다. 기존 route·환경 조립은 유지하고 AudioPlayer·AudioGuide 내부의 5개 Player
  상태, 버튼 공통 action, 중단·이탈 보존을 iOS Agent에 인계했습니다. 실제 TTS·음성 인식·
  권한 요청과 T-007~008은 후속 범위로 유지합니다.
- Product Owner가 `T-20260805-005`의 잔여 위험을 수용하고 완료·PR #94 squash merge를
  승인했습니다. merge SHA `7c26ebb`로 공용 `done`을 확인했으며 T-006 선행은 해소됐지만
  별도 실행 승인 전에는 `proposed`로 유지합니다.
- `T-20260805-005` 독립 QA에서 Review 5개 상태, 동일 UUID·STEP snapshot과 생성·저장·
  수정·삭제 실패 보존, 전체 XCTest 72/72를 확인해 `PASS_WITH_RISK`로 판정했습니다.
- Development Lead가 최신 develop 포함, 허용 경로·잔여 위험과 PR #94의 iOS build·
  XCTest checks 통과를 확인해 완료 리뷰를 `PASS_WITH_RISK`로 확정했습니다. Product Owner
  완료·병합 승인 전 PR은 Draft로 유지합니다.
- `T-20260805-005`에서 같은 `RecipeRecord.id`와 동일 `[StepPreview]`를 검증한 뒤 Mock AI
  생성 성공 시에만 `draft_ai_review`로 전환하고, 실패 시 STEP과 snapshot 잠금을 복구하는
  `GenerateAIReviewDraftUseCase`를 추가했습니다.
- AI Review의 5개 Core Loop 상태, 모든 필드·재료·STEP 편집, STEP 추가·삭제·Undo·순서
  이동, 수동 임시 저장과 마지막 성공 snapshot 기준 이탈 확인을 구현했습니다.
- final 저장은 동일 UUID completed 전환 성공 후에만 Recipe Detail로 이동하며, 임시·최종
  저장 실패 시 현재 편집값과 영속 원본을 보존하고 실패한 동작만 다시 시도합니다.
- Recipe Detail의 완료 Recipe 메뉴, AI 재호출 없는 동일 폼 수정, 복구 불가 삭제 확인,
  삭제 중·삭제 완료·삭제 실패 보존과 재시도를 구현했습니다.
- 확정 CookLog `bg/base|subtle|elevated`, accent·success·error 토큰과 SwiftUI 네이티브
  NavigationStack·Menu·Button·TextField·TextEditor·ProgressView를 유지했습니다.
- 동일 snapshot 거부, 생성 실패 잠금 해제, 임시/최종 저장 실패, 완료 수정·삭제 실패,
  SwiftData 동일 UUID 완료 조회 회귀를 포함한 전체 XCTest 72/72와 build를 통과했습니다.
- iPhone 15 iOS 17.2에서 기록 → STEP 자동 저장 → AI Review 진입·제목 편집과 Light/Dark
  화면을 확인해 iOS QA Agent에 `verification_ready`로 인계했습니다.

## 2026-08-06

- Product Owner가 `T-20260805-005` AI Review·완료 Recipe 편집·삭제 구현을 별도
  승인했습니다. Mock AI 기반 5개 Review 상태와 편집·임시 저장·이탈 복원, 완료 Recipe
  수정·삭제, 실패 시 입력·원본 보존 범위를 iOS Agent에 인계했습니다.
- Product Owner가 `T-20260805-004` 잔여 위험을 수용하고 완료 확정과 PR #90 squash
  merge를 승인했습니다. T-005 선행은 공용 `develop` 병합 후 해소되며 별도 실행 승인
  전에는 `proposed`로 유지합니다.
- `T-20260805-004` 독립 재검증에서 `QA-MEDIUM-805004-001` 해소, 금지 시스템 색상
  0건, Light/Dark 상태 네 장과 전체 XCTest 62/62를 확인해 `PASS_WITH_RISK`로 판정했습니다.
- Development Lead가 최신 `develop@04aa1bc` 통합, 허용 경로·잔여 위험과 PR #90의
  iOS build·XCTest checks 통과를 확인해 완료 리뷰를 `PASS_WITH_RISK`로 확정했습니다.
  Product Owner 완료·병합 승인 전 PR은 Draft로 유지합니다.
- `T-20260805-004` 독립 QA에서 기능·저장·전체 XCTest 62/62는 통과했지만 시스템 배경과
  accent·green·red 사용을 `QA-MEDIUM-805004-001` 색상 토큰 위반으로 판정했습니다.
- Product Owner가 통과한 로직을 보존하는 색상 토큰 한정 재작업과 Light/Dark
  `LOG-STEP-ADDED`·`LOG-ERROR` 재검증을 승인했습니다.
- Cooking Log의 화면·빈 보조 영역·기록 패널·STEP 카드를 확정 `bg/base`, `bg/subtle`,
  `bg/elevated`에 연결하고 CTA·STEP·성공·오류의 system accent/green/red를 기존 CookLog
  accent·success·error Light/Dark 프로젝트 토큰으로 교체했습니다.
- iPhone 15 iOS 17.2에서 Light/Dark `LOG-STEP-ADDED`와 권한 거부 `LOG-ERROR`를
  캡처하고 전체 XCTest 62/62·build·`git diff --check`를 재통과해 독립 재검증을
  요청했습니다.
- `T-20260805-004`의 Cooking Log 5개 상태와 첫·반복 10초 Mock 기록을 구현했습니다.
- Processing 동안 기존 완료 STEP과 정확한 다음 pending 번호를 함께 표시하고, 성공 시
  같은 `RecipeRecord.id`에 자동 저장된 뒤에만 화면 세션을 갱신합니다.
- STEP row에 왼쪽 swipe와 접근 가능한 44pt 삭제 버튼을 추가하고, 삭제 자동 저장과
  제한 시간 내 원래 위치 되돌리기·연속 order 정규화를 구현했습니다.
- 권한·음성 처리·자동 저장 오류를 분리해 실패한 pending만 제거하고 기존 STEP과 AI 정리
  snapshot을 보존하도록 했습니다.
- Product Owner 승인으로 `AppEnvironment.swift`·`CookLogApp.swift` 최소 범위를 확장해
  `SaveStepPreviewDraftUseCase`를 실제 앱 경로에 생성자 주입했습니다.
- Cooking Log 집중 10개·STEP use case 4개를 포함한 전체 XCTest 62/62와 build를
  통과하고, iPhone SE iOS 17.2 다크 모드에서 첫·반복 기록과 STEP 1·2 자동 저장을
  실제 확인했습니다.

## 2026-08-05

- Product Owner가 `T-20260805-004` Cooking Log·STEP Preview 자동 저장·오류 상태 구현을
  별도 승인했습니다. Mock Service 기반 5개 상태와 반복 기록·데이터 보존 경계를 확정해
  iOS Agent에 인계하고 실제 Apple STT와 T-005~008은 후속 범위로 유지했습니다.
- `T-20260805-003` 재작업 독립 재검증에서 Home 13개·전체 XCTest 54/54와
  `QA-HIGH-805003-001`, `QA-MEDIUM-805003-002~004` 해소를 확인했습니다.
- Development Lead가 최신 develop 기준 전체 XCTest 54/54를 재실행하고 완료 리뷰를
  `PASS_WITH_RISK`로 확정했습니다. Product Owner의 완료·병합 승인 조건을 충족했으며,
  T-004 선행은 해소하고 375x667 full-screen 위험은 T-008에 유지합니다.
- `T-20260805-003` 독립 QA의 진행 기록 삭제 HIGH 1건과 AI Review 준비 배너·카드
  metadata·생성 실패 재시도 MEDIUM 3건에 대해 승인된 `WP-R1~R4`를 반영했습니다.
- 진행 record에만 `⋯` 메뉴와 복구 불가 삭제 확인을 제공하고, 같은 UUID 삭제·최근 3개
  backfill·실패 record 보존·실패한 삭제만 재시도하는 흐름을 추가했습니다.
- AI Review 준비 완료 성공 배너와 같은 UUID의 `레시피 검토하기` CTA를 추가했습니다.
- 완료 badge를 제거하고 카드에 lifecycle별 최근 활동, 주요 재료 최대 3개, 예상 시간과
  단계 수를 표시했습니다.
- 조회 오류와 새 기록 생성 오류를 분리하고 생성 실패 재시도가 생성만 다시 수행하도록
  수정했습니다.
- 결함별 회귀 테스트를 추가해 iPhone 15 iOS 17.2 전체 XCTest 54/54를 통과하고
  Simulator 설치·실행, Home 빈 상태 렌더링과 기록 CTA의 Cooking Log 실제 전환을
  재확인했습니다.
- 공용 `develop`에서 T-20260805-002의 `done`과 PR #77 병합을 확인하고 Product Owner가
  `T-20260805-003` Home·전체 보기·검색·상태별 routing 구현을 별도 승인했습니다.
- Home Core Loop 4개 상태, 제목·재료 로컬 검색, lifecycle별 동일 record ID routing,
  앱 재실행·refresh와 back swipe·복구 무회귀를 구현·검증 경계로 확정했습니다.
- Home 데이터 원본을 완료 Recipe 목록에서 진행·완료 `RecipeRecord` 단일 목록으로 전환하고
  최근 활동순 3개 카드, 전체 보기, loading·empty·error·retry를 구현했습니다.
- AI Review·완료 record의 제목 우선·재료명 로컬 검색을 추가하고 STEP Preview 초안·
  조리 순서·메모는 검색하지 않도록 범위를 고정했습니다.
- 새 기록을 먼저 로컬에 생성하고 lifecycle별 Cooking Log·AI Review·Recipe Detail route에
  동일 record ID와 STEP snapshot을 전달하도록 `AppRoute`를 확장했습니다.
- Home 선별 테스트와 build, 전체 XCTest 48개를 통과하고 iPhone 15 iOS 17.2
  Simulator에서 디자인 토큰·핵심 메시지·기록 CTA의 빈 상태 렌더링을 확인했습니다.
- Product Owner가 `T-20260728-003` iOS 로컬 제품 적용 진행을 승인했습니다.
- Development Lead가 T-003을 `T-20260805-002~008` 7개 구현·독립 QA 패키지로 분해했습니다.
- 첫 `T-20260805-002` 로컬 도메인·SwiftData migration·draft 생명주기를 iOS Agent에 실행 승인 인계했습니다.
- `RecipeRecord`와 `draft_step_preview -> draft_ai_review -> completed` 상태 전이를 추가했습니다.
- STEP snapshot 잠금, AI 요청 ID, Review draft snapshot과 완료 Recipe의 단일 UUID 전환을 구현했습니다.
- `RecipeRecordRepository`, SwiftData/InMemory DataSource와 자동 STEP·수동 Review·완료 저장 UseCase를 추가했습니다.
- 기존 `PersistentRecipe`를 lifecycle 필드로 확장하고 완료 Recipe 조회 호환성과 저장 실패 rollback을 유지했습니다.
- 여러 draft 복구, legacy completed 기본값, 완료 목록 분리와 저장 실패 원본 보존 테스트를 추가했습니다.
- iPhone 15 iOS 17.2에서 build, build-for-testing, 전체 XCTest와 기존 store 위 앱 설치·실행을 확인했습니다.
- iOS QA가 알 수 없는 legacy lifecycle 완료 행의 기존 Recipe 조회 누락과 완료 UUID의
  draft 덮어쓰기 `QA-HIGH-805002-001~002`를 재현해 `FAIL`로 판정했습니다.
- Product Owner가 legacy 완료 조회 fallback 통일, UUID 충돌 거부와 QA 회귀 테스트
  통과를 데이터 무손실 재작업 범위로 승인해 iOS Agent에 다시 인계했습니다.
- 알 수 없는 lifecycle raw value를 `completed`로 복원하는 단일 규칙을 Mapper와 완료
  Recipe 단건·목록 조회에 적용해 구버전 레시피가 숨겨지지 않게 수정했습니다.
- `createRecord(_:)` 저장 계약과 `recordAlreadyExists` 오류를 추가해 InMemory·SwiftData에서
  기존 UUID의 새 draft 생성을 원자적으로 거부하고 completed 내용을 보존했습니다.
- QA 회귀 2건과 SwiftData UUID 충돌 보존 테스트를 통과했으며, 실제 non-empty legacy
  migration을 포함한 전체 XCTest 43개를 iPhone 15 iOS 17.2에서 재통과했습니다.
- iOS QA 독립 재검증에서 집중 4/4·전체 43/43 XCTest와 실제 non-empty migration을
  통과했으며 신규 결함과 잔여 위험이 없음을 확인했습니다.
- Development Lead 완료 리뷰와 Product Owner 완료·PR #77 병합 승인을 거쳐
  T-20260805-002를 `done`으로 확정했습니다.
- PR #77 `ios-xctest`에서 확인된 로컬 Simulator legacy store 의존성을 제거하고,
  과거 schema non-empty store fixture를 테스트 resource에서 고유 임시 경로로 복원해
  migration을 검증하도록 보강했습니다. 전체 XCTest 43/43을 재통과했습니다.
- 최신 develop rebase 후 hosted `ios-build`·`ios-xctest` required checks를 통과하고
  PR #77을 squash merge SHA `3d1d012`로 병합했습니다.

## 2026-07-31

- iOS Agent 안내를 제품 세부 범위 복제 없이 Task·제품·Design Source of Truth 참조 중심으로 재구성했습니다.
- 과거 Mock Core MVP 계획·스펙·결정과 첫 App Store 공개 출시 범위를 명확히 분리했습니다.
- 로컬 검색, 진행 기록 저장과 핸즈프리를 과거 제외 기능으로 오인하지 않도록 활성 문서를 갱신했습니다.
- `ios-build`, `ios-xctest` hosted 검증과 현재 CI Xcode·Simulator 기준을 상태 문서에 반영했습니다.

## 2026-07-28

- T-20260728-004에서 `CookLogTests`의 scheme 병렬 실행을 비활성화했습니다.
- 전체 XCTest에 단일 worker, 600초 timeout, 로그와 `xcresult` 보존을 적용하는 `Scripts/run-xctest.sh`를 추가했습니다.
- `RecipePersistenceMapperTests`가 unmanaged SwiftData relationship을 읽으며 crash하던 문제를 in-memory `ModelContainer` 삽입 조건으로 수정했습니다.
- Xcode 26.6, iPhone 15 iOS 17.2 Simulator에서 전체 XCTest 33개를 3회 연속 통과했습니다.
- `build`, `build-for-testing`, scheme 직렬 실행과 timeout 종료 코드 124를 확인했습니다.

## 2026-07-01

- QA에서 확인된 `AI 정리하기` 후 STEP Preview가 AI Review에 비어 전달되는 결함을 수정했습니다.
- `AppRoute.aiReview`가 `[StepPreview]`를 직접 포함하도록 변경해 Cooking Log에서 AI Review로 이동할 때 입력 배열을 route payload로 전달합니다.
- `StepPreview`에 `Hashable` 준수를 추가했습니다.
- 수정 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- `AIReviewViewModelTests` 선별 실행으로 4개 테스트 통과를 확인했습니다.
- iPhone SE 시뮬레이터에서 STEP Preview 2개 누적과 AI Review 초안 표시를 재검증했습니다.
- AI Review, Recipe Detail, Audio Player, SwiftData 저장소 선별 테스트 18개 통과를 확인했습니다.
- AI Review 저장 이후 터치 흐름은 자동화 스크롤 한계로 후속 수동 QA 대상으로 남겼습니다.

## 2026-06-22

- M8 점검 중 AI Review 저장 성공 후 navigation path를 Home 기준 Recipe Detail로 정리했습니다.
- Home에 refresh token을 추가해 저장 후 Home 복귀 시 저장된 Recipe 목록을 다시 읽도록 보강했습니다.
- `README.md`를 추가해 iOS 빌드, 테스트 빌드, 테스트 실행 이슈, 수동 확인 흐름을 정리했습니다.
- M8 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- 부팅된 iPhone 15 iOS 17.2 시뮬레이터에 앱 설치와 실행을 확인했습니다.
- M8 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- M7 `PersistentRecipe`, `PersistentIngredient`, `PersistentRecipeStep` SwiftData 저장 모델을 추가했습니다.
- `RecipePersistenceMapper`를 추가해 도메인 모델과 SwiftData 모델 변환을 분리했습니다.
- `SwiftDataRecipeLocalDataSource`를 추가해 Recipe 저장, 목록 조회, 단건 조회, 삭제를 구현했습니다.
- `AppEnvironment.live(modelContainer:)`를 추가하고 앱 실행 경로를 SwiftData 저장소로 전환했습니다.
- SwiftUI Preview와 테스트용 `AppEnvironment.mock`은 기존 InMemory/Mock 경로를 유지했습니다.
- `RecipePersistenceMapperTests`, `SwiftDataRecipeLocalDataSourceTests`를 추가했습니다.
- M7 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M7 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- M6-A `AudioPlayerView`, `AudioPlayerViewModel`, `AudioPlayerControlBarView`를 추가했습니다.
- `AudioPlayerPlaceholderView`를 제거하고 `audioPlayer` route를 실제 오디오 플레이어 화면으로 교체했습니다.
- 저장된 Recipe를 recipeID로 조회해 현재 단계 번호와 본문을 표시하게 했습니다.
- 이전, 다음, 다시 듣기, 재생, 정지 동작을 `PlayRecipeStepUseCase`와 `AudioGuideService`에 연결했습니다.
- 첫 단계 이전 버튼과 마지막 단계 다음 버튼 비활성화, step 없는 recipe 재생 불가 상태, 화면 이탈 시 stop 호출을 구현했습니다.
- `AudioPlayerViewModelTests`를 추가해 초기 로드, 단계 이동, 경계 상태, play/replay/stop 호출, 빈 step, 조회 실패 상태를 검증할 수 있게 했습니다.
- M6-A 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M6-A 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- M5-A `RecipeDetailView`, `RecipeDetailViewModel`, `IngredientListView`, `RecipeStepListView`를 추가했습니다.
- Recipe Detail placeholder를 실제 조회 화면으로 교체했습니다.
- `FetchRecipeUseCase`로 recipeID 기반 Recipe 조회를 연결하고 로딩, 없음, 실패 상태를 구현했습니다.
- Recipe Detail에서 제목, 재료, 조리 순서, 예상 시간, 메모를 표시하게 했습니다.
- M6 진입점으로 `audioPlayer` route와 `AudioPlayerPlaceholderView`를 추가했습니다.
- `RecipeDetailViewModelTests`를 추가해 조회 성공, notFound, 조회 실패 상태를 검증할 수 있게 했습니다.
- M5-A 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M5-A 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- M4-A `AIReviewView`, `AIReviewViewModel`, `IngredientEditorRowView`, `RecipeStepEditorRowView`를 추가했습니다.
- Cooking Log의 `AI 정리하기` 버튼을 AI Review 화면으로 연결했습니다.
- 누적된 STEP Preview 배열을 `GenerateRecipeDraftUseCase`에 전달해 Mock AI 기반 `RecipeDraft`를 생성하게 했습니다.
- AI Review에서 제목, 재료, 조리 순서, 예상 시간, 메모를 수정할 수 있게 했습니다.
- 저장 버튼을 `SaveRecipeUseCase`에 연결하고 저장 성공 후 Recipe Detail placeholder로 이동하게 했습니다.
- `AIReviewViewModelTests`를 추가해 draft 로드, 수정 상태 반영, 저장, AI 생성 실패 상태를 검증할 수 있게 했습니다.
- M4-A 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M4-A 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- M3-A `CookingLogView`, `CookingLogViewModel`, `StepPreviewRowView`, `RecordingState`를 추가했습니다.
- Home의 `요리 기록 시작` 이동 대상을 실제 `CookingLogView`로 교체했습니다.
- `MockSpeechRecognitionService`와 `AddStepPreviewUseCase`를 연결해 10초 기록 후 STEP Preview가 누적되게 했습니다.
- 기록 중/처리 중 상태, 남은 시간, 실패 메시지, STEP Preview 목록, `AI 정리하기` 활성/비활성 상태를 구현했습니다.
- `CookingLogViewModelTests`를 추가해 초기 상태, 1회 기록, order 증가, 실패 메시지를 검증할 수 있게 했습니다.
- M3-A 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M3-A 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- M2-A `AppRoute`, `AppEnvironment`, `HomeViewModel`, `HomeView`, `RecipeRowView`를 추가했습니다.
- 앱 시작 화면을 `HomeView`로 교체하고 `NavigationStack` 기반 기본 내비게이션을 연결했습니다.
- Home에서 샘플 레시피 목록, 빈 상태, 요리 기록 시작, Recipe Detail placeholder 이동을 구현했습니다.
- `HomeViewModelTests`를 추가해 샘플 레시피 로드와 빈 목록 상태를 검증할 수 있게 했습니다.
- M2-A 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M2-A 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- M1-C Mock 구현 `DefaultRecipeRepository`, `DefaultRecipeGenerationRepository`, `InMemoryRecipeLocalDataSource`, `MockRecipeAIDataSource`, `MockSpeechRecognitionService`, `MockAudioGuideService`를 추가했습니다.
- `PreviewSupport/SampleRecipes.swift`, `PreviewSupport/SampleStepPreviews.swift`에 M2 화면 개발과 SwiftUI Preview용 샘플 데이터를 추가했습니다.
- `DefaultRecipeRepositoryTests`를 추가해 저장/조회/삭제 흐름을 검증할 수 있게 했습니다.
- `GenerateRecipeDraftUseCaseTests`를 추가해 Mock AI 기반 RecipeDraft 생성을 검증할 수 있게 했습니다.
- M1-C 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M1-C 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- M1-A 도메인 모델 `CookingLogSession`, `StepPreview`, `Recipe`, `Ingredient`, `RecipeStep`, `RecipeDraft`, `RecipeGenerationInput`, `RecipeSource`, `SyncStatus`를 추가했습니다.
- M1-B Repository/DataSource/Service 경계 프로토콜을 추가했습니다.
- M1-C 기본 UseCase `FetchRecipesUseCase`, `FetchRecipeUseCase`, `SaveRecipeUseCase`, `DeleteRecipeUseCase`, `AddStepPreviewUseCase`, `GenerateRecipeDraftUseCase`, `PlayRecipeStepUseCase`를 추가했습니다.
- STEP Preview 누적 로직을 확인하는 `AddStepPreviewUseCaseTests`를 추가했습니다.
- M1 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M1 변경 후 `xcodebuild test`의 XCTest runner 대기 현상을 재확인하고 `TESTING.md`에 기록했습니다.
- 테스트 타겟이 앱 소스를 직접 포함하지 않고 `@testable import CookLog`로 앱 모듈을 참조하도록 정리했습니다.
- `apps/ios/` 안에 SwiftUI 기반 `CookLog.xcodeproj`를 생성했습니다.
- 앱 타겟 `CookLog`와 Unit Test 타겟 `CookLogTests`를 추가했습니다.
- `CookLog/App`, `Domain`, `Data`, `Services`, `Features`, `Support`, `PreviewSupport`, `Resources` 기본 폴더 구조를 추가했습니다.
- `CookLogApp.swift`, 임시 `ContentView.swift`, 앱 `Info.plist`, 기본 `CookLogTests.swift`를 추가했습니다.
- 공유 scheme `CookLog`를 추가했습니다.
- iOS 17.0 이상 deployment target을 프로젝트 설정에 반영했습니다.
- `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- 부팅된 iPhone 15 iOS 17.2 시뮬레이터에 앱 설치와 실행을 확인했습니다.
- `xcodebuild test`가 현재 로컬 XCTest runner 실행 단계에서 대기하는 현상을 `TESTING.md`에 기록했습니다.
- iOS 개발 문서를 `apps/ios/docs/` 구조로 이동했습니다.
- `DEVELOPMENT_PLAN.md`를 PRD v2 기준으로 업데이트했습니다.
- `DEVELOPMENT_SPEC.md`에 10초 음성 기록, STEP Preview, A-Lite Strategy, 확장 가능한 Repository/DataSource/Service 경계를 반영했습니다.
- `DECISIONS.md`에 PRD v2와 STEP Preview 관련 결정사항을 반영했습니다.
- `STATUS.md`를 추가해 iOS 세션 시작 지점을 명확히 했습니다.
- Xcode 15.2, iOS 17 이상, SwiftData 사용, 레시피 검색 MVP 제외를 결정사항으로 기록했습니다.
- STT 실패 fallback 정책과 실제 AI API 연동 방향을 결정사항으로 기록했습니다.
- 프로젝트 직접 생성, DI 라이브러리 미사용, 도메인 모델과 SwiftData 모델 분리를 결정사항으로 기록했습니다.
- Feature 중심 MVVM + UseCase + Repository/DataSource 구조를 결정사항으로 기록했습니다.
- NavigationStack/AppRoute, AppError, 제한적 ViewState, Mock/Preview/Test 데이터 분리를 결정사항으로 기록했습니다.
- `DEVELOPMENT_SPEC.md`를 최상위 기술 기준과 문서 인덱스 역할로 축소했습니다.
- 아키텍처, 도메인 모델, 저장소, 내비게이션, 서비스, 테스트 기준을 역할별 문서로 분리했습니다.
- `DEVELOPMENT_PLAN.md`의 M0-M7 실행 순서와 체크리스트를 세분화해 다음 iOS 개발 세션의 시작 기준을 명확히 했습니다.

## 2026-06-19

- iOS 개발 에이전트 문서를 추가했습니다.
- iOS 개발 환경 권장안, 개발 계획, 의사결정 로그를 최초 작성했습니다.
