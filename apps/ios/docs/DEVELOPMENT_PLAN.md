# CookLog iOS 개발 계획

이 문서는 CookLog iOS의 초기 Mock Core MVP 이정표와 구현 이력을 보존하고, 현재 첫 공개 출시 Task의 진입점을 안내합니다. 현재 실행 범위는 이 문서의 과거 M0~M8 체크리스트가 아니라 배정된 `.ai_project/tasks/`와 최신 제품 Source of Truth를 따릅니다.

작성일: 2026-06-19
최종 업데이트: 2026-08-07
기준 PRD: `../../../docs/product/CookLog_PRD_v2.md`

## 현재 상태 요약

- 상태: Mock Core MVP 조건부 통과, T-20260805-002~006 완료, T-20260805-007 실행 승인
- iOS 프로젝트: `CookLog.xcodeproj` 생성 완료
- 과거 프로젝트 생성 기준 Xcode: 15.2, 현재 호환성 미보장
- 현재 설치/검증 Xcode: 26.6
- scheme: `CookLog`
- 검증 destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`
- 권장 구현: SwiftUI + Feature 중심 MVVM + UseCase + Repository/DataSource + 로컬 저장 + STT 기반 STEP Preview + AI 정리 시점 호출
- 현재 CI 기준: `macos-26`, Xcode 26.6, iPhone 17·iOS 26.5
- 우선 참고: 배정 Task, `../../../docs/product/CookLog_PRD_v2.md`, `../../../docs/product/CookLog_MVP_SCOPE.md`

## 바로 시작 가이드

새 iOS 개발 세션은 다음 순서로 시작합니다.

1. `git status -sb`로 작업트리 상태를 확인합니다.
2. 배정된 Task의 상태·의존성·허용 경로와 Source of Truth를 확인합니다.
3. `docs/GIT_WORKFLOW.md`와 `apps/ios/AGENTS.md`를 확인합니다.
4. `apps/ios/docs/STATUS.md`와 관련 기술 문서를 확인합니다.
5. Task가 지정한 제품·Design Source of Truth를 확인합니다.
6. 승인된 Task 범위만 구현합니다.
7. 변경 후 기본 빌드와 가능한 테스트를 확인합니다.
8. 확인 결과를 `STATUS.md`, 이 문서, `CHANGELOG.md`에 기록합니다.

사용자 직접 검증은 `MANUAL_QA_CHECKLIST.md`를 기준으로 진행합니다.

## 현재 첫 공개 출시 실행 순서

1. `T-20260805-002` 로컬 도메인·SwiftData migration·draft 생명주기 — `done`, PR #77 merge `3d1d012`
2. `T-20260805-003` Home·전체 보기·검색·상태별 routing — `done`, PR #86 merge `9457133`
3. `T-20260805-004` Cooking Log·STEP Preview 자동 저장·오류 상태 — `done`, Product Owner 완료·PR #90 squash merge 승인
4. `T-20260805-005` AI Review·완료 Recipe 편집·삭제 — `done`, PR #94 merge `7c26ebb`
5. `T-20260805-006` Audio Guide·핸즈프리 UI·공통 action model — `done`, PR #101 merge `dcf58d5`
6. `T-20260805-007` 앱 정보·권한·오프라인·서비스 장애 — `approved`
7. `T-20260805-008` 접근성·작은 화면·다크 모드·통합 회귀 — `proposed`

각 패키지는 iOS Agent 구현과 iOS QA 독립 검증을 분리하고, 선행 Task가 공용
`develop`에서 `done`이 된 뒤 다음 패키지를 승인합니다. 실제 Apple STT, Backend AI,
로컬 TTS·음성 인식 엔진은 각각 T-20260729-004~006의 후속 범위입니다.

### T-20260805-002 구현 결과

- [x] `draft_step_preview -> draft_ai_review -> completed` 도메인 전이 작성
- [x] STEP snapshot 잠금과 요청 식별자 보존
- [x] 단일 record UUID로 draft·완료 Recipe 전환
- [x] `RecipeRecordRepository`·DataSource·자동/수동 저장 UseCase 경계 작성
- [x] 기존 `PersistentRecipe`를 유지한 lifecycle schema 확장
- [x] SwiftData 실패 rollback과 완료 Recipe 조회 호환성 유지
- [x] 여러 draft 재실행 복구·legacy completed·저장 실패 원본 보존 테스트
- [x] iPhone 15 iOS 17.2 전체 XCTest 통과
- [x] 기존 Simulator store 위 schema 자동 migration 후 앱 실행 확인
- [x] 알 수 없는 legacy lifecycle의 Mapper·완료 Recipe 조회 fallback 통일
- [x] 원자적 record 생성과 InMemory·SwiftData UUID 충돌 시 기존 completed 보존
- [x] QA 회귀·실제 non-empty migration 포함 전체 XCTest 43개 재통과
- [x] iOS QA 집중 4/4·전체 43/43 독립 재검증과 Development Lead 완료 리뷰 통과
- [x] legacy store fixture를 테스트 resource로 고정해 깨끗한 CI runner 독립성 확보

### T-20260805-003 구현 결과

- [x] `RecipeRecord` 최근 활동순 단일 목록과 Home 최근 3개 구현
- [x] 전체 보기와 제목 우선·재료명 로컬 검색, STEP Preview 초안 제외
- [x] Home loading·empty·error·retry와 refresh 중 기존 목록 보존
- [x] 새 record 영속 생성 후 Cooking Log 진입
- [x] lifecycle별 Cooking Log·AI Review·Recipe Detail 동일 record ID route
- [x] 최초 구현 Home 선별 XCTest와 build, 전체 XCTest 48개 통과
- [x] iPhone 15 iOS 17.2 Simulator 설치·실행과 Home 빈 상태 렌더링 확인
- [x] 진행 record 전용 `⋯` 메뉴·복구 불가 확인·동일 UUID 삭제·최근 3개 backfill
- [x] 삭제 실패 시 record 보존과 실패한 삭제만 재시도
- [x] AI Review 준비 완료 배너·같은 UUID CTA와 refresh 중복 생성 방지
- [x] 완료 badge 제거와 lifecycle별 최근 활동·주요 재료·예상 시간·단계 수 표시
- [x] 조회 오류·생성 오류 분리와 생성 동작 전용 재시도
- [x] 재작업 회귀를 포함한 전체 XCTest 54/54 통과

### T-20260805-004 구현 결과

- [x] `LOG-EMPTY`, `LOG-RECORDING`, `LOG-PROCESSING`, `LOG-STEP-ADDED`, `LOG-ERROR`
- [x] 첫·반복 기록의 정확한 pending STEP 번호와 중복 기록 비활성
- [x] 같은 `RecipeRecord.id`의 STEP 추가 자동 저장과 저장 성공 전 상태 보존
- [x] 왼쪽 swipe·44pt 삭제 버튼·짧은 되돌리기와 연속 order 정규화
- [x] 권한·음성 처리·저장 실패 시 pending만 제거하고 기존 완료 STEP 보존
- [x] 누적 `[StepPreview]` 동일 snapshot을 AI Review route callback에 전달
- [x] Cooking Log 집중 10개·STEP use case 4개, 전체 XCTest 62/62와 build 통과
- [x] iPhone SE iOS 17.2 다크 모드에서 첫·반복 기록과 STEP 1·2 자동 저장 실제 확인
- [x] `bg/base|subtle|elevated`, accent, success, error 확정 Light/Dark 토큰 적용
- [x] iPhone 15 Light/Dark `LOG-STEP-ADDED`·`LOG-ERROR`와 전체 XCTest 62/62 재확인
- [x] iOS QA 독립 재검증 `PASS_WITH_RISK`, 금지 시스템 색상 0건 확인
- [x] 최신 develop 통합·PR #90 iOS build/XCTest checks와 Development Lead 완료 리뷰 통과

### T-20260805-005 구현 결과

- [x] `REVIEW-PROCESSING`, `REVIEW-EDITABLE`, `REVIEW-GENERATION-ERROR`,
  `REVIEW-SAVING`, `REVIEW-SAVE-ERROR` 구현
- [x] 같은 `RecipeRecord.id`와 동일 `[StepPreview]` snapshot 검증·Mock AI 생성
- [x] 생성 실패 시 STEP 보존·snapshot 잠금 해제, 자동 재시도 금지
- [x] 제목·재료·양·예상 시간·메모와 독립 STEP 추가·삭제·Undo·순서 이동
- [x] 수동 임시 저장, 마지막 성공 snapshot과 현재 편집본 분리, 이탈 경고·복원
- [x] 제목·최소 1개 STEP·재료명 없는 양 검증과 저장 중 중복 입력 차단
- [x] 저장 성공 후에만 동일 UUID completed 전환, 실패 시 편집본·영속 원본 보존
- [x] Recipe Detail 조회·메뉴·완료 Recipe 수정·영구 삭제 확인·실패 재시도
- [x] SwiftData 동일 UUID 완료 조회와 실패 보존 회귀 포함 전체 XCTest 72/72·build 통과
- [x] iPhone 15 iOS 17.2 기록 → STEP → Review 진입과 Light/Dark 토큰 렌더링 확인
- [x] iOS QA 독립 전체 XCTest 72/72와 Review·Detail 실패 보존 반례 통과
- [x] 최신 develop 포함·PR #94 iOS build/XCTest checks와 Development Lead 완료 리뷰 통과

### T-20260805-006 구현 결과

- [x] Player Paused·Playing·Loading·Error·No Steps와 not-found subtype 구현
- [x] 7개 핸즈프리 명령을 공통 `AudioGuideAction` reducer로 정의
- [x] 이전·다음·재생/일시정지·다시 듣기·재료 안내 버튼을 같은 action 경계에 연결
- [x] 명시적 핸즈프리 시작·종료와 버튼 fallback, 실제 권한·인식 엔진 분리
- [x] 첫/마지막·불확실 입력에서 단계·재생 상태 보존
- [x] 오디오 중단·백그라운드·잠금에서 일시정지, 이탈 시 stop과 자동 재개 금지
- [x] CookLog Light/Dark 토큰·SF Symbols·Dynamic Type·44pt 이상 네이티브 Button 유지
- [x] 집중 13/13·전체 XCTest 77/77·build 통과
- [x] 390×844·375×667 Light/Dark UIWindow 렌더링 4/4 확인
- [x] `QA-HIGH-806006-001` 하단 `safeAreaInset` 적용과 CTA·안내 문구 비겹침 4/4 재확인
- [x] 재작업 후 전체 XCTest 77/77·iOS Simulator Debug build 재통과

## 현재 개발 원칙

- 제품 기능 범위는 `CookLog_MVP_SCOPE.md`의 Core MVP와 첫 App Store 공개 출시 구분을 따릅니다.
- 과거 Core MVP 제외 항목을 첫 공개 출시 제외 항목으로 해석하지 않습니다.
- 현재 실행 순서와 성공 기준은 Roadmap과 개별 Task를 따릅니다.
- 개발 진행 중 이 문서의 체크리스트와 다음 작업 항목을 계속 갱신합니다.

## 과거 Core MVP 목표

사용자는 요리 중 10초 음성 기록을 반복해서 남기고, 앱은 각 기록을 STEP Preview로 축적합니다. 사용자가 `AI 정리하기`를 누르면 전체 STEP Preview를 레시피로 정리하고, 저장된 레시피는 오디오 가이드로 다시 소비할 수 있어야 합니다.

성공 기준:

- 사용자가 Home에서 요리 기록을 시작할 수 있습니다.
- 사용자가 10초 음성 기록을 남길 수 있습니다.
- STT 결과가 STEP Preview로 즉시 추가됩니다.
- 사용자가 10초 기록을 반복할 수 있습니다.
- 전체 STEP Preview를 AI Review로 정리할 수 있습니다.
- AI Review 결과를 수정하고 저장할 수 있습니다.
- 저장된 레시피 상세를 볼 수 있습니다.
- 저장된 레시피를 단계별 오디오 플레이어로 재생할 수 있습니다.

## 과거 Mock Core MVP 개발 순서

권장 진행 순서는 다음과 같습니다.

1. M0: Xcode 프로젝트 생성과 기본 빌드 확인
2. M1-A: 도메인 모델 작성
3. M1-B: Repository/DataSource/Service 프로토콜 작성
4. M1-C: UseCase와 Mock 구현 작성
5. M2-A: Home 화면과 샘플 레시피 목록
6. M3-A: Mock STT 기반 Cooking Log 흐름
7. M4-A: Mock AI 기반 AI Review 흐름
8. M5-A: Recipe Detail 연결
9. M6-A: Mock 또는 TTS 기반 Audio Player 연결
10. M7: SwiftData 실제 저장소 연결
11. M8: 전체 흐름 검증과 정리

아래 M0~M8은 완료된 초기 구현 이력입니다. 첫 공개 출시 기능을 이 순서로 다시 시작하지 않습니다.

## 전체 이정표

### M0. 개발 기반 준비

목표: iOS 프로젝트를 만들고 빌드 가능한 기본 앱 상태를 만든다.

권장 실행 순서:

1. Xcode에서 `apps/ios/` 위치에 새 iOS App 프로젝트를 생성합니다.
2. Product Name은 `CookLog`로 설정합니다.
3. Interface는 SwiftUI, Language는 Swift로 설정합니다.
4. Unit Tests는 포함합니다.
5. Deployment Target은 iOS 17 이상으로 설정합니다.
6. 기본 생성 파일이 `apps/ios/CookLog/`와 `apps/ios/CookLogTests/` 아래에 놓였는지 확인합니다.
7. `CookLog/` 아래에 문서 기준 폴더를 만듭니다.
8. 기본 `ContentView`는 최소 화면으로 유지하고, 실제 Home 구현은 M2에서 진행합니다.
9. `xcodebuild` 또는 Xcode로 기본 빌드를 확인합니다.
10. 가능한 경우 시뮬레이터 실행을 확인합니다.
11. 실제 생성된 scheme, destination, 빌드 명령을 이 문서와 `TESTING.md`에 기록합니다.

체크리스트:

- [x] Xcode 버전 기준 확정
- [x] 최소 iOS 버전 확정
- [x] `apps/ios/` 안에 iOS 프로젝트 생성
- [x] SwiftUI App 템플릿 적용
- [x] Unit Test 타겟 포함
- [x] 앱 이름 `CookLog` 확인
- [x] Deployment Target iOS 17 이상 확인
- [x] `CookLog/` 기본 앱 타겟 폴더 확인
- [x] `CookLogTests/` 테스트 타겟 폴더 확인
- [x] `App/`, `Domain/`, `Data/`, `Services/`, `Features/`, `Support/`, `PreviewSupport/`, `Resources/` 폴더 생성
- [x] 기본 `CookLogApp.swift` 위치 정리
- [x] 기본 `ContentView` 또는 임시 시작 화면 정리
- [x] 기본 빌드 성공
- [x] 기본 시뮬레이터 실행 성공
- [x] 프로젝트 구조 정리
- [x] `apps/ios/AGENTS.md`에 실제 프로젝트 구조 반영
- [x] `apps/ios/docs/TESTING.md`에 실제 빌드/테스트 명령 기록
- [x] `apps/ios/docs/STATUS.md`에 프로젝트 생성 결과 기록

M0 검증 결과:

- scheme: `CookLog`
- destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`
- 기본 빌드: 성공
- 테스트 번들 빌드: 성공
- 시뮬레이터 설치/실행: 성공
- `xcodebuild test`: 테스트 번들 빌드 후 XCTest runner 설치/실행 단계에서 대기해 수동 중단

완료 기준:

- `xcodebuild` 또는 Xcode에서 기본 앱이 빌드됩니다.
- 다음 세션이 프로젝트를 열어 바로 개발을 시작할 수 있습니다.
- 앱 기능은 아직 없어도 됩니다.

### M1. 도메인 모델과 서비스 경계

목표: PRD v2 흐름에 맞는 최소 도메인 모델과 서비스 인터페이스를 만든다.

권장 구현 순서:

1. `Domain/Models/`에 도메인 모델을 작성합니다.
2. `Domain/Repositories/`에 Repository 프로토콜을 작성합니다.
3. `Services/Speech/`, `Services/AudioGuide/`에 Service 프로토콜을 작성합니다.
4. `Domain/UseCases/`에 주요 UseCase를 작성합니다.
5. `Data/DataSources/`와 `Data/Repositories/`에 Mock 기반 구현을 작성합니다.
6. `PreviewSupport/`에 샘플 Recipe와 StepPreview를 작성합니다.
7. STEP Preview 누적 로직 단위 테스트를 작성합니다.

체크리스트:

- [x] `CookingLogSession` 모델 작성
- [x] `StepPreview` 모델 작성
- [x] `Recipe` 모델 작성
- [x] `Ingredient` 모델 작성
- [x] `RecipeStep` 모델 작성
- [x] `RecipeDraft` 모델 작성
- [x] `RecipeGenerationInput` 모델 작성
- [x] `RecipeSource` 모델 작성
- [x] `SyncStatus` 모델 작성
- [x] `SpeechRecognitionService` 프로토콜 작성
- [x] `RecipeGenerationRepository` 프로토콜 작성
- [x] `RecipeRepository` 프로토콜 작성
- [x] `RecipeLocalDataSource` 프로토콜 작성
- [x] `RecipeAIDataSource` 프로토콜 작성
- [x] `AudioGuideService` 프로토콜 작성
- [x] `FetchRecipesUseCase` 작성
- [x] `FetchRecipeUseCase` 작성
- [x] `SaveRecipeUseCase` 작성
- [x] `DeleteRecipeUseCase` 작성
- [x] `AddStepPreviewUseCase` 작성
- [x] `GenerateRecipeDraftUseCase` 작성
- [x] `PlayRecipeStepUseCase` 작성
- [x] `MockSpeechRecognitionService` 작성
- [x] `MockRecipeAIDataSource` 작성
- [x] `InMemoryRecipeLocalDataSource` 또는 Mock 저장소 작성
- [x] `MockAudioGuideService` 작성
- [x] 샘플 STEP Preview와 샘플 Recipe 데이터 작성
- [x] STEP Preview 추가 로직 단위 테스트 작성
- [x] Repository 저장/조회/삭제 단위 테스트 작성
- [x] Mock AI 기반 RecipeDraft 생성 단위 테스트 작성

M1 검증 결과:

- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test`: XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단
- 테스트 타겟은 앱 소스를 직접 포함하지 않고 `@testable import CookLog`로 앱 모듈을 참조합니다.
- M1-C Mock 구현과 샘플 데이터 추가 후에도 `build`, `build-for-testing`은 성공했습니다.
- M1-C 테스트 실행은 `com.apple.dt.xctest.target-runner`가 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.

완료 기준:

- UI 없이도 10초 기록 결과를 STEP Preview로 쌓고, 샘플 레시피로 변환할 수 있습니다.
- 실제 Speech, SwiftData, AI API 없이도 UseCase 테스트가 가능합니다.

### M2. Home과 레시피 조회

목표: 저장된 레시피를 확인하고 요리 기록을 시작할 수 있는 첫 화면을 만든다.

권장 구현 순서:

1. `AppRoute`와 기본 `NavigationStack`을 연결합니다.
2. `AppEnvironment`에서 Mock Repository/UseCase를 조립합니다.
3. `HomeViewModel`을 작성합니다.
4. `HomeView`를 작성합니다.
5. 샘플 레시피 목록을 표시합니다.
6. 요리 기록 시작 버튼을 `CookingLogView`로 연결합니다.
7. 레시피 행 선택을 `RecipeDetailView`로 연결합니다.

체크리스트:

- [x] `AppRoute` 작성
- [x] `AppEnvironment` 작성
- [x] `HomeViewModel` 작성
- [x] Home 화면 작성
- [x] 요리 기록 시작 버튼 작성
- [x] 최근 레시피 영역 작성
- [x] 레시피 목록 화면 작성
- [x] 레시피 상세 화면으로 이동 연결
- [x] 빈 상태 UI 작성
- [x] HomeViewModel 샘플 레시피 로드 테스트 작성
- [x] HomeViewModel 빈 목록 상태 테스트 작성
- [x] 검색을 MVP에 포함할지 보류/확정

M2-A 검증 결과:

- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test`: XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단
- Recipe Detail과 Cooking Log는 이후 이정표에서 실제 구현할 placeholder 화면으로 연결했습니다.

완료 기준:

- 사용자가 Home에서 기록을 시작하거나 저장된 레시피 상세로 이동할 수 있습니다.
- 이 단계에서는 Mock 샘플 데이터 기반이어도 됩니다.

### M3. 10초 음성 기록과 STEP Preview

목표: 사용자가 10초 음성 기록을 반복하고, 각 기록이 STEP Preview로 쌓이게 한다.

권장 구현 순서:

1. `CookingLogViewModel`을 작성합니다.
2. `MockSpeechRecognitionService`를 연결합니다.
3. 10초 기록 버튼을 누르면 Mock STT 결과가 `StepPreview`로 추가되게 합니다.
4. 실제 10초 타이머 UI를 작성합니다.
5. STEP Preview 리스트를 작성합니다.
6. STEP Preview가 1개 이상일 때 `AI 정리하기` 버튼을 활성화합니다.
7. AI Review 화면으로 STEP Preview를 전달합니다.

체크리스트:

- [x] `CookingLogViewModel` 작성
- [x] Cooking Log 화면 작성
- [x] 10초 기록 버튼 작성
- [x] 녹음 중 상태 UI 작성
- [x] 남은 시간 표시
- [x] STT 결과 표시
- [x] STEP Preview 리스트 작성
- [x] 10초 기록 반복 동작 작성
- [x] 기록 실패 상태 작성
- [x] STT 실패 시 텍스트 fallback 미제공 정책 반영
- [x] AI 정리하기 버튼 작성
- [x] STEP Preview가 없을 때 AI 정리하기 비활성화
- [x] STEP Preview가 1개 이상일 때 AI 정리하기 활성화
- [x] CookingLogViewModel 초기 상태 테스트 작성
- [x] 1회 기록 시 STEP Preview 추가 테스트 작성
- [x] 여러 회 기록 시 order 증가 테스트 작성
- [x] STT 실패 시 에러 메시지 테스트 작성

M3-A 검증 결과:

- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test`: XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단
- `AI 정리하기` 실제 이동은 M4에서 구현합니다.

완료 기준:

- 사용자가 10초 기록을 여러 번 수행하고 STEP Preview를 누적할 수 있습니다.
- 실제 Apple Speech 연결 전에도 Mock STT로 흐름을 확인할 수 있습니다.

### M4. A-Lite와 AI Review

목표: STEP Preview는 STT 기반으로 유지하고, `AI 정리하기` 시점에만 레시피 구조화를 수행한다.

권장 구현 순서:

1. `GenerateRecipeDraftUseCase`를 `AIReviewViewModel`에 연결합니다.
2. `MockRecipeAIDataSource`가 STEP Preview 배열을 `RecipeDraft`로 변환하게 합니다.
3. `AIReviewView`에서 제목, 재료, 조리순서, 예상시간, 메모를 수정 가능하게 표시합니다.
4. 저장 버튼을 `SaveRecipeUseCase`에 연결합니다.
5. 저장 후 `RecipeDetailView`로 이동합니다.
6. AI 정리 실패와 저장 실패 상태를 표시합니다.

체크리스트:

- [x] `AIReviewViewModel` 작성
- [x] `RecipeGenerationRepository` Mock 경로 작성
- [x] `MockRecipeAIDataSource` 작성
- [x] 전체 STEP Preview를 AI Review 입력으로 전달
- [x] AI Review 화면 작성
- [x] 레시피 제목 표시/수정
- [x] 재료 표시/수정
- [x] 조리순서 표시/수정
- [x] 예상시간 표시/수정
- [x] 메모 표시/수정
- [x] 저장 버튼 작성
- [x] 저장 후 Recipe Detail 이동 연결
- [x] AI 정리 실패 상태 작성
- [x] Mock AI 변환 단위 테스트 작성
- [x] RecipeDraft 수정 상태 반영 테스트 작성
- [x] 저장 시 Recipe 생성과 SaveRecipeUseCase 호출 테스트 작성

M4-A 검증 결과:

- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build -quiet`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing -quiet`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test`: XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단
- 결과 번들: `/Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Logs/Test/Test-CookLog-2026.06.22_16-03-00-+0900.xcresult`

완료 기준:

- 사용자가 누적한 STEP Preview가 레시피 형태로 정리되고, 모든 내용을 수정한 뒤 저장할 수 있습니다.
- 실제 AI API 없이도 전체 저장 흐름이 동작합니다.

### M5. Recipe Detail

목표: 저장된 레시피를 다시 볼 수 있는 상세 화면을 만든다.

권장 구현 순서:

1. `RecipeDetailViewModel`을 작성합니다.
2. `FetchRecipeUseCase`로 레시피를 조회합니다.
3. 제목, 재료, 조리순서, 메모, 예상시간을 표시합니다.
4. 오디오 가이드 시작 버튼을 `AudioPlayerView`로 연결합니다.
5. 삭제 또는 편집은 MVP에서 바로 넣지 말고 필요 여부만 결정합니다.

체크리스트:

- [x] `RecipeDetailViewModel` 작성
- [x] Recipe Detail 화면 작성
- [x] 제목 표시
- [x] 재료 표시
- [x] 조리순서 표시
- [x] 메모 표시
- [x] 예상시간 표시
- [x] 오디오 가이드 시작 버튼 작성
- [x] 삭제 또는 편집 필요 여부 결정

M5-A 검증 결과:

- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build -quiet`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing -quiet`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test`: XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단
- 결과 번들: `/Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Logs/Test/Test-CookLog-2026.06.22_16-28-03-+0900.xcresult`
- 삭제/편집 기능은 MVP 현재 단계에서는 추가하지 않았고, 필요 여부는 추후 이정표에서 판단합니다.

완료 기준:

- 저장된 레시피의 핵심 정보가 읽기 좋게 표시됩니다.
- 오디오 플레이어로 진입할 수 있습니다.

### M6. 오디오 플레이어

목표: 저장된 레시피를 단계별 오디오 가이드로 재생한다.

권장 구현 순서:

1. `AudioPlayerViewModel`을 작성합니다.
2. 현재 단계 index 상태를 관리합니다.
3. 이전, 다음, 다시 듣기 동작을 먼저 Mock으로 구현합니다.
4. `SystemTTSAudioGuideService`로 `AVSpeechSynthesizer`를 연결합니다.
5. 화면 이탈 시 재생을 정리합니다.
6. 단계 이동 로직 단위 테스트를 작성합니다.

체크리스트:

- [x] `AudioPlayerViewModel` 작성
- [x] `AudioGuideService` 구현 작성
- [ ] `AVSpeechSynthesizer` 기반 재생 작성
- [x] Audio Player 화면 작성
- [x] 현재 단계 표시
- [x] 현재 단계 본문 표시
- [x] 재생 버튼 작성
- [x] 정지 버튼 작성
- [x] 이전 단계 버튼 작성
- [x] 다음 단계 버튼 작성
- [x] 현재 단계 다시 듣기 버튼 작성
- [x] 마지막 단계 처리
- [x] 화면 이탈 시 재생 정리
- [x] 단계 이동 로직 단위 테스트 작성

M6-A 검증 결과:

- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build -quiet`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing -quiet`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test`: XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단
- 결과 번들: `/Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Logs/Test/Test-CookLog-2026.06.22_16-41-02-+0900.xcresult`
- 실제 TTS는 이번 단계 범위에서 제외했고, 기존 `MockAudioGuideService` 기반으로 플레이어 흐름을 완성했습니다.

완료 기준:

- 사용자가 저장된 레시피를 버튼 기반 오디오 가이드로 소비할 수 있습니다.

### M7. 로컬 영구 저장

목표: 앱을 종료해도 저장된 레시피가 유지되게 한다.

권장 구현 순서:

1. `PersistentRecipe`, `PersistentRecipeStep`, `PersistentIngredient`를 작성합니다.
2. 도메인 모델과 SwiftData 모델 Mapper를 작성합니다.
3. `SwiftDataRecipeLocalDataSource`를 작성합니다.
4. `DefaultRecipeRepository`를 SwiftData DataSource와 연결합니다.
5. 기존 Mock 저장소를 실제 저장소로 교체할 수 있게 `AppEnvironment`를 정리합니다.
6. 앱 재실행 후 데이터 유지 여부를 확인합니다.

체크리스트:

- [x] SwiftData 적용 가능 여부 확정
- [x] SwiftData 모델 또는 저장 모델 작성
- [x] `RecipeRepository` 실제 구현 작성
- [x] `SwiftDataRecipeLocalDataSource` 작성
- [x] Mock 저장소와 실제 저장소 교체 지점 정리
- [x] 저장, 조회 동작 확인
- [ ] 앱 재실행 후 데이터 유지 확인
- [x] 저장 실패 에러 처리 작성

M7 검증 결과:

- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build -quiet`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing -quiet`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test`: XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단
- 결과 번들: `/Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Logs/Test/Test-CookLog-2026.06.22_16-55-39-+0900.xcresult`
- SwiftData 저장소의 저장/단건 조회/목록 정렬/삭제는 in-memory `ModelContainer` 기반 테스트로 컴파일 검증했습니다.
- 앱 재실행 후 데이터 유지 여부는 M8 수동 검증 항목으로 남깁니다.

완료 기준:

- 레시피가 로컬에 저장되고 앱 재실행 후에도 유지됩니다.

### M8. MVP 정리와 검증

목표: PRD v2 MVP 흐름을 끝까지 다듬고 다음 단계로 넘길 수 있게 한다.

체크리스트:

- [ ] 전체 기록 흐름 수동 테스트
- [x] 10초 기록 반복 흐름 수동 테스트
- [ ] AI Review 수정/저장 수동 테스트
- [ ] 전체 다시 요리 흐름 수동 테스트
- [x] 주요 단위 테스트 실행
- [x] 전체 XCTest 3회 연속 실행
- [ ] 빈 상태와 에러 상태 확인
- [ ] 권한 거부 상태 확인
- [ ] 작은 화면에서 레이아웃 확인
- [ ] 다크 모드 필요 여부 확인
- [ ] 앱 아이콘 또는 임시 아이콘 결정
- [x] README 또는 실행 방법 문서 업데이트
- [x] 저장 후 Home refresh/navigation path 보정
- [ ] 남은 이슈 정리

M8 검증 결과:

- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build -quiet`: 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing -quiet`: 성공
- `xcrun simctl install booted .../CookLog.app`: 성공
- `xcrun simctl launch booted app.cooklog.CookLog`: 성공, process id `42163`
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test`: XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단
- 결과 번들: `/Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Logs/Test/Test-CookLog-2026.06.22_17-06-55-+0900.xcresult`
- 테스트 중단 후 시뮬레이터가 종료되어 스크린샷 기반 화면 확인은 완료하지 못했습니다.
- 전체 터치 흐름, 앱 재실행 후 저장 유지, 작은 화면/다크 모드 확인은 후속 수동 검증 항목으로 남깁니다.
- 2026-07-01 QA에서 Cooking Log의 STEP Preview 1개가 AI Review에 빈 입력으로 전달되는 결함을 확인했습니다.
- 2026-07-01 `AppRoute.aiReview`가 `[StepPreview]`를 직접 포함하도록 수정해 AI Review 입력 전달 경로를 보정했습니다.
- 수정 후 `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build -quiet`: 성공
- 수정 후 `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing -quiet`: 성공
- 수정 후 `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' -only-testing:CookLogTests/AIReviewViewModelTests test -quiet`: 성공, 4개 테스트 통과
- 수정 후 iPhone SE (3rd generation) iOS 17.2 시뮬레이터에서 Home -> Cooking Log -> 10초 기록 2회 -> STEP Preview 2개 누적 -> AI Review 초안 표시까지 확인했습니다.
- 수정 후 `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' -only-testing:CookLogTests/AIReviewViewModelTests -only-testing:CookLogTests/RecipeDetailViewModelTests -only-testing:CookLogTests/AudioPlayerViewModelTests -only-testing:CookLogTests/SwiftDataRecipeLocalDataSourceTests test -quiet`: 성공, 18개 테스트 통과
- AI Review 하단 저장 버튼까지의 스크롤 자동화가 안정적으로 전달되지 않아 저장 이후 터치 검증은 후속 수동 확인으로 남겼습니다.
- 2026-07-28 T-20260728-004에서 XCTest 병렬 worker를 비활성화하고 timeout, 로그, `xcresult`를 보존하는 `Scripts/run-xctest.sh`를 추가했습니다.
- `RecipePersistenceMapperTests`가 SwiftData 모델을 in-memory `ModelContainer`에 삽입한 뒤 relationship을 검증하도록 수정했습니다.
- Xcode 26.6, iPhone 15 iOS 17.2 Simulator에서 전체 XCTest 33개를 3회 연속 통과했습니다.

완료 기준:

- iOS MVP의 핵심 흐름이 하나의 앱 안에서 동작합니다.
- 다음 작업자가 남은 작업을 문서만 보고 이어갈 수 있습니다.

## 세션 시작 체크리스트

새 iOS 개발 세션은 작업 시작 시 다음을 확인합니다.

- [ ] `git status -sb` 확인
- [ ] 루트 `AGENTS.md` 확인
- [ ] `apps/ios/AGENTS.md` 확인
- [ ] `../../../docs/product/CookLog_PRD_v2.md` 확인
- [ ] 이 개발 계획 문서 확인
- [ ] 최근 작업 로그 확인
- [ ] 현재 이정표와 다음 작업 확인

## 세션 종료 체크리스트

작업을 마치기 전 다음을 업데이트합니다.

- [ ] 완료한 체크리스트 항목 체크
- [ ] 현재 이정표 상태 업데이트
- [ ] 다음 작업 항목 업데이트
- [ ] 새로 생긴 결정은 의사결정 로그에 기록
- [ ] 빌드 또는 테스트 결과 기록
- [ ] 막힌 점이 있으면 명확히 기록

## 현재 진행 위치

현재 이정표: M8. MVP 정리와 검증

다음 작업:

1. 사람이 직접 Simulator 또는 실제 기기에서 AI Review 저장 후 Recipe Detail 조회 확인
2. 앱 재실행 후 저장된 Recipe 유지 확인
3. Audio Player 진입과 단계 이동 확인
4. AI Review 하단, Recipe Detail, Audio Player 작은 화면 레이아웃 확인
5. 빈 상태, 에러 상태, 다크 모드 추가 확인

## 최근 작업 로그

### 2026-07-01

- QA에서 `AI 정리하기` 후 AI Review가 `정리할 STEP Preview가 없습니다.` 오류를 표시하는 결함을 확인했습니다.
- `AppRoute.aiReview`가 `[StepPreview]`를 직접 포함하도록 변경해 Cooking Log에서 생성한 STEP Preview 배열이 AI Review 생성자까지 직접 전달되게 했습니다.
- `StepPreview`에 `Hashable` 준수를 추가했습니다.
- 수정 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- `AIReviewViewModelTests` 선별 실행으로 4개 테스트 통과를 확인했습니다.
- iPhone SE 시뮬레이터에서 STEP Preview 2개 누적과 AI Review 초안 표시를 확인했습니다.
- AI Review, Recipe Detail, Audio Player, SwiftData 저장소 선별 테스트 18개 통과를 확인했습니다.
- AI Review 저장 이후 터치 흐름은 자동화 스크롤 한계로 후속 수동 검증이 필요합니다.

### 2026-06-22

- `docs/product/CookLog PRD v2.pdf`를 기준으로 PRD v2 Markdown 문서를 추가했습니다.
- 제품 문서, MVP 범위, 사용자 흐름, 와이어프레임, 로드맵을 PRD v2 기준으로 업데이트했습니다.
- iOS 개발 계획을 10초 음성 기록, STEP Preview, A-Lite Strategy, AI Review 중심으로 재정리했습니다.
- iOS 개발 문서를 `apps/ios/docs/` 구조로 이동했습니다.
- Xcode 15.2, iOS 17 이상, SwiftData, 검색 MVP 제외를 확정했습니다.
- STT 실패 fallback 정책과 실제 AI API 연동 방향을 확정했습니다.
- 프로젝트 직접 생성, DI 라이브러리 미사용, 도메인 모델과 SwiftData 모델 분리를 확정했습니다.
- Feature 중심 MVVM + UseCase + Repository/DataSource 구조를 확정했습니다.
- NavigationStack/AppRoute, AppError, 제한적 ViewState, Mock/Preview/Test 데이터 분리를 확정했습니다.
- iOS 개발 스펙을 역할별 문서로 분리했습니다.
- `ARCHITECTURE.md`, `DATA_MODEL.md`, `PERSISTENCE.md`, `NAVIGATION.md`, `SERVICES.md`, `TESTING.md`를 추가했습니다.
- iOS 프로젝트 생성 전 개발 세션이 바로 착수할 수 있도록 M0-M7 실행 순서와 체크리스트를 구체화했습니다.
- M4-A AI Review 흐름을 추가해 STEP Preview 배열을 Mock AI 기반 RecipeDraft로 변환하고 검토/수정/저장할 수 있게 했습니다.
- Cooking Log의 `AI 정리하기` 버튼을 AI Review 화면으로 연결했습니다.
- `AIReviewViewModelTests`를 추가해 draft 로드, 수정 상태, 저장, 생성 실패 상태를 검증할 수 있게 했습니다.
- M4-A 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M4-A 변경 후 `xcodebuild test`는 XCTest runner 대기 현상으로 수동 중단했습니다.
- M5-A Recipe Detail 실제 화면을 추가하고 placeholder를 교체했습니다.
- `FetchRecipeUseCase`로 recipeID 기반 Recipe 조회를 연결했습니다.
- 제목, 재료, 조리 순서, 예상 시간, 메모 표시와 없음/실패/로딩 상태를 구현했습니다.
- M6 진입점으로 `audioPlayer` route와 `AudioPlayerPlaceholderView`를 추가했습니다.
- `RecipeDetailViewModelTests`를 추가해 조회 성공, notFound, 실패 상태를 검증할 수 있게 했습니다.
- M5-A 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M5-A 변경 후 `xcodebuild test`는 XCTest runner 대기 현상으로 수동 중단했습니다.
- M6-A Mock 기반 Audio Player 화면을 추가하고 placeholder를 교체했습니다.
- recipeID로 저장된 Recipe를 조회해 현재 단계 번호와 본문을 표시하게 했습니다.
- 이전, 다음, 다시 듣기, 재생, 정지 동작을 `PlayRecipeStepUseCase`와 `AudioGuideService`에 연결했습니다.
- 첫/마지막 단계 버튼 비활성화, step 없는 recipe 재생 불가 상태, 화면 이탈 시 stop 호출을 구현했습니다.
- `AudioPlayerViewModelTests`를 추가해 초기 로드, 단계 이동, 경계 상태, play/replay/stop 호출, 빈 step, 조회 실패 상태를 검증할 수 있게 했습니다.
- M6-A 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M6-A 변경 후 `xcodebuild test`는 XCTest runner 대기 현상으로 수동 중단했습니다.
- M7 SwiftData 저장 모델 `PersistentRecipe`, `PersistentIngredient`, `PersistentRecipeStep`을 추가했습니다.
- `RecipePersistenceMapper`로 도메인 모델과 SwiftData 모델 변환을 분리했습니다.
- `SwiftDataRecipeLocalDataSource`로 저장, 목록 조회, 단건 조회, 삭제를 구현했습니다.
- 앱 실행 경로를 `AppEnvironment.live(modelContainer:)`와 SwiftData `ModelContainer` 기반 저장소로 전환했습니다.
- Preview와 테스트는 기존 `AppEnvironment.mock`과 InMemory 저장소 경로를 유지했습니다.
- `RecipePersistenceMapperTests`, `SwiftDataRecipeLocalDataSourceTests`를 추가했습니다.
- M7 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M7 변경 후 `xcodebuild test`는 XCTest runner 대기 현상으로 수동 중단했습니다.
- M8 점검 중 저장 후 navigation path를 Home 기준 Recipe Detail로 정리하고 Home refresh token을 보강했습니다.
- `README.md`를 추가해 iOS 빌드/테스트/수동 확인 흐름을 정리했습니다.
- M8 변경 후 `xcodebuild build -quiet`, `xcodebuild build-for-testing -quiet`, 시뮬레이터 설치/실행 성공을 확인했습니다.
- M8 변경 후 `xcodebuild test`는 XCTest runner 대기 현상으로 수동 중단했습니다.

### 2026-06-19

- 루트 `AGENTS.md`를 전체 서비스 관리 에이전트 기준으로 재정리했습니다.
- `apps/ios/AGENTS.md`를 추가해 iOS 개발 에이전트 기준을 만들었습니다.
- iOS 개발 환경 권장안을 정리했습니다.
- 이 개발 계획 문서를 추가했습니다.

## 열린 질문

- `ios-build`, `ios-xctest` 구현과 hosted 검증, T-20260730-004의 concurrency·공통 진단·artifact 통합은 완료됐습니다. T-005 dry run과 T-006 required check 적용이 남아 있습니다.
- Xcode 15.2 동일 환경 미검증 위험은 Product Owner가 수용했으며 현재 CI 계약은 Xcode 26.6·iPhone 17·iOS 26.5입니다.

## 관련 문서

- `../../../docs/product/CookLog_PRD_v2.md`
- `../../../docs/product/CookLog_PRODUCT.md`
- `../../../docs/product/CookLog_MVP_SCOPE.md`
- `../../../docs/product/CookLog_USER_FLOW.md`
- `../../../docs/product/CookLog_WIREFRAME.md`
- `../../../docs/product/CookLog_ROADMAP.md`
- `apps/ios/docs/STATUS.md`
- `apps/ios/docs/DEVELOPMENT_SPEC.md`
- `apps/ios/docs/ARCHITECTURE.md`
- `apps/ios/docs/DATA_MODEL.md`
- `apps/ios/docs/PERSISTENCE.md`
- `apps/ios/docs/NAVIGATION.md`
- `apps/ios/docs/SERVICES.md`
- `apps/ios/docs/TESTING.md`
- `apps/ios/docs/DECISIONS.md`
- `apps/ios/docs/CHANGELOG.md`
- `apps/ios/AGENTS.md`
