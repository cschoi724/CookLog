# CookLog iOS Status

최종 업데이트: 2026-08-07

## 현재 상태

- 상태: T-20260805-008 접근성·작은 화면·다크 모드·통합 회귀 실행 승인
- 기준 PRD: `../../../docs/product/CookLog_PRD_v2.md`
- iOS 프로젝트: `CookLog.xcodeproj` 생성 완료
- 현재 CI 기준 Xcode: 26.6 (`17F113`)
- 과거 프로젝트 생성 기준 Xcode: 15.2, 현재 호환성 미보장
- 현재 설치/검증 Xcode: 26.6
- 현재 이정표: T-20260728-003 scoped, T-20260805-002~007 done, T-20260805-008 approved
- scheme: `CookLog`
- 로컬 회귀 destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`
- CI destination: `platform=iOS Simulator,name=iPhone 17,OS=26.5`

## 다음 작업

1. iOS Agent가 T-008 통합 fixture·자동화·시각 증빙을 완성하고 자체 검증
2. iOS QA Agent가 실행 세션과 분리해 접근성·작은 화면·다크 모드·통합 회귀 독립 검증
3. 실제 문의 주소·법적 문안·공개 URL을 출시 통합 전에 확정
4. T-003 완료 후 T-20260729-004 Apple 기기 내 STT와 T-20260729-006 로컬 TTS 착수
5. Backend production 준비 후 T-20260729-005 AI 정리·Review 실서비스 연동

## 최근 작업

- Product Owner가 T-008 실행을 승인했습니다. 선행 T-002~007의 공용 `done`을 확인하고
  접근성·작은 화면·다크 모드·Core Loop 23개·통합 82개 상태 검증을 iOS Agent에
  인계했습니다.
- Product Owner가 T-007 완료·병합을 승인했습니다. PR #106은 최신 `develop` 기준에서
  `ios-build`, `ios-xctest`를 통과하고 squash merge SHA `2f309ed`로 병합됐습니다.
- iOS QA가 결함 3건 해소, 전체 XCTest 82/82, Debug build와 8개 viewport를 독립
  재검증했습니다. Development Lead가 완료 리뷰를 `PASS_WITH_RISK`로 수용해 Product
  Owner의 완료·병합 승인을 기다립니다.
- T-007 재작업에서 주입 가능한 Home Network Error와 `연결 다시 확인`을 추가했습니다.
  재확인은 실패했던 온라인 행동을 자동 실행하지 않고 로컬 기능을 유지합니다.
- `SupportMailDraft`가 앱 버전을 기본 포함하고 진단 opt-in 때만 OS·오류 화면/시각·
  비콘텐츠 범주를 포함하며 사용자 콘텐츠는 첨부하지 않도록 분리했습니다.
- 전체 XCTest 82/82와 build, App Info·Network Error의 390×844·375×667 Light/Dark
  렌더링을 확인해 독립 iOS QA에 재인계했습니다.

- T-007 독립 QA에서 Home Network Error 누락과 문의 동의 결과의 실제 메일 초안 미반영
  HIGH 2건, viewport 증거 부재 MEDIUM 1건을 확인했습니다. Product Owner가 Mock Network
  Error, 문의 초안 모델, 4 viewport 증빙의 `WP-R1~R3` 재작업을 승인했습니다.
- T-007에서 Home의 앱 정보 진입과 App Info 11개 상태를 구현했습니다. 문의는 사용자
  콘텐츠를 자동 첨부하지 않고 진단 정보는 명시적 선택 뒤에만 포함합니다.
- 문의 주소·법적 URL이 없으면 임의 값을 만들지 않고 미설정·열기 실패 상태를 제공합니다.
  전체 XCTest 79/79와 iPhone 15 iOS 17.2 build를 통과했습니다.

- Product Owner가 T-007 실행을 승인했습니다. App Info 11개 상태와 Home Network Error,
  Cooking Log STT Final Failure, AI Review Generation Error·Save Error를 구현하며 실제
  문의 주소·법적 문안·공개 URL과 실서비스 연결은 범위에서 제외합니다.
- Product Owner가 T-006의 QA·완료 리뷰 잔여 위험을 수용하고 완료·병합을 승인했습니다.
  PR #101의 필수 iOS build·XCTest 통과 후 squash merge SHA `dcf58d5`를 확인했습니다.
- iOS QA 재검증에서 `QA-HIGH-806006-001` 해소, 전체 XCTest 77/77과 4개 viewport를
  확인해 `PASS_WITH_RISK`로 판정했고 캡처 타이밍 위험은 T-008에 이관했습니다.
- T-006의 ScrollView 하단을 `safeAreaInset(edge: .bottom)`으로 구성해 고정 control bar가
  마지막 `재료 알려줘` CTA와 안내 문구를 가리지 않도록 수정했습니다.
- 390×844·375×667 Light/Dark 하단 도달 캡처 4/4에서 겹침이 없음을 확인했고, 전체
  XCTest 77/77과 iOS Simulator Debug build를 재통과해 동일 iOS QA Agent에 인계했습니다.
- T-006 독립 QA에서 기능 회귀 77/77은 통과했으나 375×667 Light/Dark의 `재료 알려줘`
  CTA가 하단 고정 control bar에 가려지는 `QA-HIGH-806006-001`을 확인했습니다.
- Product Owner가 하단 safe-area/content inset 한정 재작업을 승인했습니다. 기존 Player
  5개 상태·7개 action·중단/이탈 보존과 44pt 버튼은 유지하고 4개 viewport를 재검증합니다.
- Product Owner가 T-006 Audio Guide·핸즈프리 UI·공통 action model 구현을 승인했습니다.
  기존 Recipe Detail route·App 조립은 유지하고 AudioPlayer·AudioGuide 내부에서 Player
  5개 상태, 버튼 공통 action과 중단·이탈 보존을 구현하도록 iOS Agent에 인계했습니다.
  실제 TTS·음성 인식·권한 요청은 후속 Task 범위입니다.
- Product Owner가 T-005 잔여 위험을 수용하고 완료·PR #94 squash merge를 승인했습니다.
  merge SHA `7c26ebb`로 공용 `develop`의 `done`을 확인했으며 T-006 선행은 해소됐습니다.
- iOS QA가 Review 5개 상태, 동일 UUID·STEP snapshot, 생성·저장·수정·삭제 실패 보존과
  전체 XCTest 72/72를 독립 확인해 `PASS_WITH_RISK`로 판정했습니다.
- Development Lead가 최신 develop 포함, 허용 경로·잔여 위험과 PR #94의 iOS build·
  XCTest checks 통과를 확인해 완료 리뷰를 `PASS_WITH_RISK`로 확정했습니다. Product Owner
  승인 전 PR은 Draft, T-006은 `proposed`로 유지합니다.
- T-005에서 Mock AI 생성의 processing·editable·generation error와 final saving·save error
  상태를 같은 `RecipeRecord.id`·동일 STEP snapshot에 연결했습니다. 생성 실패는 snapshot
  잠금을 해제하고, 저장 실패는 화면 편집본과 마지막 영속 snapshot을 모두 보존합니다.
- Review 필드·재료·STEP 추가/삭제/Undo/위아래 이동, 수동 임시 저장, 이탈 확인과 마지막
  성공 snapshot 복원을 구현했습니다. 완료 Recipe는 AI 재호출 없이 같은 폼에서 수정하며
  Detail 메뉴에서 복구 불가 영구 삭제와 실패 재시도를 제공합니다.
- SwiftData 동일 UUID 완료 전환·완료 조회, 임시/최종 저장 실패, 완료 수정 실패와 삭제 실패
  보존 회귀를 포함한 전체 XCTest 72/72와 build를 iPhone 15 iOS 17.2에서 통과했습니다.
- Simulator에서 Home → 기록 → STEP 자동 저장 → AI Review 진입·제목 편집과 Light/Dark
  CookLog 토큰 렌더링을 확인했습니다. 화면 증빙은 T-005 보고서에 기록했습니다.
- Product Owner가 T-005 별도 실행을 승인했습니다. Mock AI 기반 Review 5개 상태,
  편집·임시 저장·이탈 복원과 완료 Recipe 수정·삭제, 실패 시 입력·원본 보존을 iOS Agent에
  인계했습니다. 실제 Backend AI와 T-006~008은 후속 범위로 유지합니다.
- Product Owner가 T-004 잔여 위험을 수용하고 완료 확정과 PR #90 squash merge를
  승인했습니다. T-005 선행은 병합으로 해소되며 별도 실행 승인 전 `proposed`로 유지합니다.
- iOS QA가 색상 결함 해소, 금지 시스템 색상 0건, Light/Dark 상태 네 장과 전체 XCTest
  62/62를 독립 재검증해 `PASS_WITH_RISK`로 판정했습니다.
- Development Lead가 최신 `develop@04aa1bc` 통합, 허용 경로와 잔여 위험, PR #90의
  iOS build·XCTest checks 통과를 검토해 완료 리뷰를 `PASS_WITH_RISK`로 확정했습니다.
  완료 리뷰를 통과했습니다.
- Cooking Log 화면 배경은 `bg/base`, 빈 보조 영역은 `bg/subtle`, 기록 패널과 STEP
  카드는 `bg/elevated`로 연결하고 CTA·STEP·성공·오류를 기존 확정 프로젝트 토큰으로
  교체했습니다. 시스템 색상은 레이블·separator·네이티브 컨트롤 내부로 제한했습니다.
- iPhone 15 iOS 17.2에서 Light/Dark `LOG-STEP-ADDED`와 권한 거부 `LOG-ERROR`를
  캡처하고 전체 XCTest 62/62·build·`git diff --check`를 통과해 독립 재검증을 요청했습니다.
- 독립 QA에서 기능·저장 계약과 전체 XCTest 62/62는 통과했지만 Cooking Log의 시스템
  배경·accent·green·red 사용이 확정 색상 계약을 위반해 `QA-MEDIUM-805004-001`,
  `rework_requested`로 판정됐습니다.
- Product Owner가 색상 토큰 한정 재작업을 승인했습니다. 통과한 상태·저장 로직을
  보존하고 Light/Dark 상태 증빙 후 독립 재검증합니다.
- `T-20260805-004`에서 `idle -> recording -> processing -> idle|error`와 정확한 pending
  STEP 번호, 반복 기록을 구현했습니다.
- STEP 추가·삭제·되돌리기는 `SaveStepPreviewDraftUseCase`로 같은 `RecipeRecord.id`에
  자동 저장하며, 저장 성공 전 화면 세션을 변경하지 않아 실패 시 기존 완료 STEP을
  보존합니다.
- STEP row에 왼쪽 swipe와 44pt 삭제 버튼을 제공하고, 삭제 직후 제한된 시간 동안 원래
  위치로 되돌릴 수 있게 했습니다. 재정렬 뒤 order는 1부터 연속으로 정규화합니다.
- 권한·음성 처리·자동 저장 오류를 분리하고 실패한 pending만 제거하며, 기존 STEP이 있으면
  오류 상태에서도 `AI 정리하기` snapshot을 유지합니다.
- Cooking Log 집중 10개와 STEP use case 4개를 포함한 전체 XCTest 62/62, build를 iPhone
  15 iOS 17.2에서 통과했습니다.
- iPhone SE (3rd generation) iOS 17.2 다크 모드에서 LOG-EMPTY, 첫·반복 Recording,
  STEP 1·2 자동 저장 피드백과 기존 STEP 보존을 실제 확인했습니다.
- Product Owner가 `T-20260805-004`의 별도 실행을 승인했습니다. Mock Service 기반
  Cooking Log 5개 상태, 반복 기록, STEP Preview 자동 저장·삭제·되돌리기와 오류 시 기존
  STEP·동일 record draft 보존을 iOS Agent에 인계했습니다.
- 실제 마이크 녹음·Apple STT와 T-005~008 범위는 이번 Task에서 선행하지 않습니다.
- T-20260805-003 독립 재검증에서 `WP-R1~R4`, Home 13개와 전체 XCTest 54/54를
  통과했습니다. Development Lead가 최신 develop 기준 전체 54/54를 다시 실행해 완료
  리뷰를 `PASS_WITH_RISK`로 확정했고 Product Owner의 완료·병합 승인 조건을 충족했습니다.
- T-003 완료로 T-20260805-004 선행 조건은 해소됐습니다. 별도 실행 승인 전에는
  `proposed`로 유지하며, 375x667 full-screen viewport 위험은 T-008에서 확인합니다.
- 독립 QA의 `QA-HIGH-805003-001`과 MEDIUM 3건에 대해 Product Owner가 승인한
  `WP-R1~R4` 재작업을 완료했습니다.
- 진행 record 전용 `⋯` 메뉴·복구 불가 확인·동일 UUID 삭제를 추가하고, 삭제 실패 시
  목록을 보존한 채 실패한 삭제만 재시도하도록 분리했습니다. 삭제 성공 후 최근 3개는
  최근 활동순으로 다시 채웁니다.
- Home에 AI Review 준비 완료 배너와 같은 UUID의 `레시피 검토하기` CTA를 추가하고,
  refresh가 record를 중복 생성하거나 ID를 변경하지 않도록 유지했습니다.
- 완료 badge를 제거하고 lifecycle별 카드에 최근 활동, 주요 재료 최대 3개, 예상 시간과
  단계 수를 표시했습니다.
- 조회 오류와 새 기록 생성 오류를 분리해 생성 실패 재시도가 생성 동작만 다시 수행하도록
  수정했습니다.
- 결함별 HomeViewModel 회귀를 추가해 전체 XCTest 54/54를 iPhone 15 iOS 17.2에서
  통과했고, Simulator 설치·실행과 Home 빈 상태 렌더링, 기록 CTA의 Cooking Log
  실제 전환을 재확인했습니다.
- 공용 `develop`에서 T-20260805-002 완료와 PR #77 병합을 확인하고 Product Owner가
  `T-20260805-003` Home·전체 보기·검색·상태별 routing을 별도 실행 승인했습니다.
- Home Core Loop 4개 상태, 제목·재료 검색, 동일 record ID와 lifecycle별 route,
  back swipe·복구를 필수 검증 범위로 확정해 iOS Agent에 인계했습니다.
- Home을 `RecipeRecord` 단일 목록으로 전환하고 최근 활동순 최대 3개, 전체 보기,
  loading·empty·error·retry와 기존 목록을 유지하는 refresh를 구현했습니다.
- 전체 보기에서 AI Review·완료 record의 제목 우선·재료명 로컬 검색을 구현하고
  STEP Preview 초안·조리 순서·메모를 검색에서 제외했습니다.
- 새 기록은 저장된 record를 먼저 생성하며 lifecycle별 `AppRoute`가 동일 record ID와
  STEP snapshot을 유지하도록 연결했습니다.
- 최초 구현의 Home 선별 테스트와 build, 전체 XCTest 48개를 iPhone 15 iOS 17.2에서 통과하고
  Simulator에서 Home 빈 상태의 디자인 토큰·CTA 렌더링과 앱 실행을 확인했습니다.
- T-20260805-002에서 `RecipeRecord` 단일 UUID와 draft STEP·AI Review·완료 전이를 구현했습니다.
- SwiftData lifecycle schema 확장, draft 복구, 완료 Recipe 호환 조회와 실패 rollback을 추가했습니다.
- 전체 XCTest와 iPhone 15 iOS 17.2 기존 store 위 설치·실행을 통과했습니다.
- 독립 QA에서 기존 39개 XCTest와 실제 non-empty legacy migration은 통과했으나,
  알 수 없는 lifecycle 완료 행 누락과 완료 UUID의 draft 덮어쓰기 HIGH 2건을 확인했습니다.
- Product Owner가 두 결함의 데이터 무손실 재작업과 직접 회귀 테스트 통과를 승인했습니다.
- 알 수 없는 lifecycle raw value를 Mapper와 완료 Recipe 단건·목록 조회에서 동일하게
  `completed`로 복원하도록 fallback을 단일화했습니다.
- 새 record 생성용 원자적 `createRecord(_:)` 계약과 명시적 UUID 충돌 오류를 추가해
  InMemory·SwiftData의 기존 completed record와 내용을 보존합니다.
- QA 회귀 2건, SwiftData 충돌 보존 추가 회귀와 실제 non-empty migration을 포함한 전체
  XCTest 43개를 iPhone 15 iOS 17.2에서 통과했습니다.
- iOS QA 독립 재검증에서 집중 4/4·전체 43/43 XCTest와 실제 non-empty migration을
  통과했고, Development Lead 완료 리뷰와 Product Owner 완료·PR #77 병합 승인을
  받았습니다.
- PR #77의 깨끗한 runner에서 드러난 legacy store 사전 생성 의존성을 제거하고, 과거
  schema non-empty store를 테스트 resource로 복원하는 독립 실행형 migration 테스트로
  보강해 전체 XCTest 43/43을 재통과했습니다.
- 최신 develop rebase 후 hosted `ios-build`·`ios-xctest`를 통과하고 PR #77을 squash
  merge SHA `3d1d012`로 병합해 T-20260805-002를 공용 `done`으로 확정했습니다.
- T-20260730-001에서 `macos-26`, Xcode 26.6, iPhone 17·iOS 26.5 CI 계약을 확정했습니다.
- T-20260730-002와 T-20260730-003에서 `ios-build`, `ios-xctest` workflow를 구현하고 GitHub-hosted check·33/33·artifact를 검증했습니다.
- T-20260730-004에서 concurrency 격리, 공통 진단 action과 artifact 요약을 통합하고 독립 QA·PR #34를 거쳐 `done`으로 확정했습니다.
- T-20260730-007에서 iOS 26.5 SwiftData XCTest crash를 수정하고 iOS 26.5·17.2 전체 33/33을 확인했습니다.
- 아래 항목은 Mock Core MVP부터 이어진 구현·검증 이력이며 현재 다음 작업을 의미하지 않습니다.
- T-20260728-004에서 공유 scheme의 XCTest 병렬 실행을 비활성화했습니다.
- `Scripts/run-xctest.sh`를 추가해 단일 worker, 600초 제한, 로그와 `xcresult` 보존을 표준화했습니다.
- unmanaged SwiftData relationship 접근으로 crash하던 `RecipePersistenceMapperTests`를 in-memory `ModelContainer` 조건으로 수정했습니다.
- Xcode 26.6, iPhone 15 iOS 17.2 Simulator에서 전체 XCTest 33개를 3회 연속 통과했습니다.
- `build`, `build-for-testing`, scheme 직렬 실행과 timeout 종료 코드 124를 확인했습니다.
- iOS QA Agent가 전체 XCTest 33개, timeout 124, 로그와 `xcresult`, build 회귀를 독립 재현해 `PASS_WITH_RISK`로 판정했습니다.
- Product Owner가 Xcode 15.2 동일 환경 미검증 위험을 수용하고 Xcode·Simulator 고정 검증을 T-20260728-008로 인계했습니다.
- PRD v2 기준으로 iOS 개발 계획을 업데이트했습니다.
- iOS 개발 문서를 `apps/ios/docs/`로 이동했습니다.
- iOS 전담 개발 세션 기준을 `apps/ios/AGENTS.md`에 정리했습니다.
- 향후 확장을 고려한 iOS 개발 스펙을 작성했습니다.
- Core MVP 당시 Xcode 15.2를 프로젝트 생성 기준으로 정했습니다.
- 최소 iOS 버전을 iOS 17 이상으로 확정했습니다.
- MVP 로컬 저장은 SwiftData로 바로 시작하기로 확정했습니다.
- Core MVP 당시 레시피 검색을 보류했으며 첫 공개 출시에는 최신 제품 결정에 따라 제목·재료명 로컬 검색을 포함합니다.
- STT 실패 시 사용자 텍스트 입력 fallback은 제공하지 않고 다시 녹음/권한 안내를 제공하기로 결정했습니다.
- 실제 AI API는 앱 직접 호출을 피하고 추후 백엔드 프록시 방식을 우선 검토하기로 결정했습니다.
- 프로젝트는 Xcode에서 직접 생성하기로 결정했습니다.
- DI 라이브러리 없이 수동/생성자 주입으로 진행하고, 외부 패키지가 필요해지면 SPM으로 관리하기로 결정했습니다.
- SwiftData 저장 모델과 도메인 모델은 분리하기로 결정했습니다.
- iOS 개발 기술 스펙을 확정했습니다.
- Feature 중심 MVVM + UseCase + Repository/DataSource 구조를 확정했습니다.
- NavigationStack/AppRoute, AppError, 제한적 ViewState, Mock/Preview/Test 데이터 분리를 확정했습니다.
- 비대해질 수 있는 iOS 개발 스펙을 역할별 문서로 분리했습니다.
- `ARCHITECTURE.md`, `DATA_MODEL.md`, `PERSISTENCE.md`, `NAVIGATION.md`, `SERVICES.md`, `TESTING.md`를 추가했습니다.
- iOS 개발 세션이 바로 착수할 수 있도록 `DEVELOPMENT_PLAN.md`의 M0-M7 실행 순서와 체크리스트를 구체화했습니다.
- `apps/ios/` 안에 SwiftUI 기반 `CookLog.xcodeproj`를 생성했습니다.
- 앱 타겟 `CookLog`와 Unit Test 타겟 `CookLogTests`를 추가했습니다.
- `CookLog/App`, `Domain`, `Data`, `Services`, `Features`, `Support`, `PreviewSupport`, `Resources` 폴더 구조를 생성했습니다.
- 기본 시작 화면은 `CookLog/Features/Home/ContentView.swift`에 임시 화면으로 두었습니다.
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build` 성공을 확인했습니다.
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing` 성공을 확인했습니다.
- `xcrun simctl install booted .../CookLog.app`와 `xcrun simctl launch booted app.cooklog.CookLog`로 시뮬레이터 설치/실행을 확인했습니다.
- `xcodebuild test`는 테스트 번들 빌드 후 시뮬레이터 XCTest runner 설치/실행 단계에서 대기해 수동 중단했습니다.
- M1-A 도메인 모델 `CookingLogSession`, `StepPreview`, `Recipe`, `Ingredient`, `RecipeStep`, `RecipeDraft`, `RecipeGenerationInput`, `RecipeSource`, `SyncStatus`를 추가했습니다.
- M1-B Repository/DataSource/Service 프로토콜 `RecipeRepository`, `RecipeGenerationRepository`, `RecipeLocalDataSource`, `RecipeAIDataSource`, `SpeechRecognitionService`, `AudioGuideService`를 추가했습니다.
- M1-C 기본 UseCase `FetchRecipesUseCase`, `FetchRecipeUseCase`, `SaveRecipeUseCase`, `DeleteRecipeUseCase`, `AddStepPreviewUseCase`, `GenerateRecipeDraftUseCase`, `PlayRecipeStepUseCase`를 추가했습니다.
- STEP Preview 누적 로직을 검증하는 `AddStepPreviewUseCaseTests`를 추가했습니다.
- M1 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M1 변경 후 `xcodebuild test`는 기존과 동일하게 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- 테스트 타겟이 앱 소스를 직접 포함하지 않고 `@testable import CookLog`로 앱 모듈을 참조하도록 프로젝트 설정을 정리했습니다.
- M1-C Mock 구현 `DefaultRecipeRepository`, `DefaultRecipeGenerationRepository`, `InMemoryRecipeLocalDataSource`, `MockRecipeAIDataSource`, `MockSpeechRecognitionService`, `MockAudioGuideService`를 추가했습니다.
- `PreviewSupport/SampleRecipes.swift`, `PreviewSupport/SampleStepPreviews.swift`에 SwiftUI Preview와 M2 화면 개발용 샘플 데이터를 추가했습니다.
- `DefaultRecipeRepositoryTests`, `GenerateRecipeDraftUseCaseTests`를 추가해 저장/조회/삭제와 Mock AI 기반 RecipeDraft 생성을 검증할 수 있게 했습니다.
- M1-C 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M1-C 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M2-A `AppRoute`, `AppEnvironment`, `HomeViewModel`, `HomeView`, `RecipeRowView`를 추가했습니다.
- 앱 시작 화면을 `HomeView`로 교체하고 `NavigationStack` 기반 기본 내비게이션을 연결했습니다.
- Home에서 샘플 레시피 목록, 빈 상태, `요리 기록 시작` 버튼, Recipe Detail placeholder 이동을 구현했습니다.
- `HomeViewModelTests`를 추가해 샘플 레시피 로드와 빈 목록 상태를 검증할 수 있게 했습니다.
- M2-A 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M2-A 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M3-A `CookingLogView`, `CookingLogViewModel`, `StepPreviewRowView`, `RecordingState`를 추가했습니다.
- Home의 `요리 기록 시작` 이동 대상을 `CookingLogView`로 교체했습니다.
- `MockSpeechRecognitionService`와 `AddStepPreviewUseCase`를 연결해 10초 기록 후 STEP Preview가 누적되게 했습니다.
- 기록 중/처리 중 상태, 남은 시간, 실패 메시지, STEP Preview 빈 상태/목록, `AI 정리하기` 활성 상태를 구현했습니다.
- `CookingLogViewModelTests`를 추가해 초기 상태, 1회 기록, 여러 회 기록 order 증가, STT 실패 메시지를 검증할 수 있게 했습니다.
- M3-A 변경 후 `xcodebuild build`와 `xcodebuild build-for-testing` 성공을 확인했습니다.
- M3-A 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M4-A `AIReviewView`, `AIReviewViewModel`, `IngredientEditorRowView`, `RecipeStepEditorRowView`를 추가했습니다.
- Cooking Log의 `AI 정리하기` 버튼을 AI Review 흐름으로 연결했습니다.
- 누적된 STEP Preview 배열을 `GenerateRecipeDraftUseCase`에 전달해 Mock AI 기반 `RecipeDraft`를 생성하게 했습니다.
- AI Review에서 제목, 재료, 조리 순서, 예상 시간, 메모를 수정할 수 있게 했습니다.
- 저장 버튼을 `SaveRecipeUseCase`에 연결하고 저장 성공 후 Recipe Detail placeholder로 이동하게 했습니다.
- AI 정리 실패 상태와 저장 실패 상태를 화면에 표시하도록 구현했습니다.
- `AIReviewViewModelTests`를 추가해 draft 로드, 수정 상태 반영, 저장, AI 생성 실패 상태를 검증할 수 있게 했습니다.
- M4-A 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M4-A 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M5-A `RecipeDetailView`, `RecipeDetailViewModel`, `IngredientListView`, `RecipeStepListView`를 추가했습니다.
- Recipe Detail placeholder를 실제 조회 화면으로 교체했습니다.
- `FetchRecipeUseCase`로 recipeID 기반 Recipe 조회를 연결했습니다.
- Recipe Detail에서 제목, 재료, 조리 순서, 예상 시간, 메모를 표시하게 했습니다.
- `오디오 가이드 시작` 버튼과 M6용 `audioPlayer` route, `AudioPlayerPlaceholderView`를 추가했습니다.
- 삭제/편집 기능은 M5-A 범위에서 제외하고 추후 필요 여부만 문서상 유지합니다.
- `RecipeDetailViewModelTests`를 추가해 recipeID 조회, 없음 상태, 조회 실패 상태를 검증할 수 있게 했습니다.
- M5-A 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M5-A 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M6-A `AudioPlayerView`, `AudioPlayerViewModel`, `AudioPlayerControlBarView`를 추가했습니다.
- `AudioPlayerPlaceholderView`를 제거하고 `audioPlayer` route를 실제 Audio Player 화면으로 교체했습니다.
- recipeID 기반 Recipe 조회, 현재 단계 index, 이전/다음/다시 듣기/재생/정지 동작을 구현했습니다.
- `PlayRecipeStepUseCase`와 `AudioGuideService`를 Audio Player에 연결했습니다.
- 첫 단계 이전 버튼과 마지막 단계 다음 버튼 비활성화, step 없는 recipe 재생 불가 상태를 구현했습니다.
- 화면 이탈 시 `AudioGuideService.stop()`을 호출하도록 처리했습니다.
- `AudioPlayerViewModelTests`를 추가해 초기 로드, 단계 이동, 경계 상태, play/replay/stop 호출, 빈 step, 조회 실패 상태를 검증할 수 있게 했습니다.
- M6-A 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M6-A 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M7 `PersistentRecipe`, `PersistentIngredient`, `PersistentRecipeStep` SwiftData 저장 모델을 추가했습니다.
- `RecipePersistenceMapper`를 추가해 도메인 모델과 SwiftData 모델 변환을 분리했습니다.
- `SwiftDataRecipeLocalDataSource`를 추가해 Recipe 저장, 목록 조회, 단건 조회, 삭제를 구현했습니다.
- 목록 조회는 `updatedAt` 내림차순 정렬을 유지합니다.
- `AppEnvironment.live(modelContainer:)`를 추가하고 앱 실행 경로를 SwiftData 저장소로 전환했습니다.
- `AppEnvironment.mock`은 Preview와 테스트에서 기존 InMemory/Mock 경로를 계속 사용하도록 유지했습니다.
- `CookLogApp`에서 SwiftData `ModelContainer`를 생성하고 앱에 연결했습니다.
- `RecipePersistenceMapperTests`, `SwiftDataRecipeLocalDataSourceTests`를 추가했습니다.
- M7 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- M7 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- M8 점검 중 저장 성공 후 navigation path를 Home 기준 Recipe Detail로 정리했습니다.
- AI Review 저장 성공 시 Home refresh token을 증가시켜 Home 복귀 후 저장된 Recipe 목록을 다시 읽도록 보강했습니다.
- `README.md`를 추가해 iOS 빌드, 테스트 빌드, 테스트 실행 이슈, 수동 확인 흐름을 정리했습니다.
- M8 변경 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- 부팅된 iPhone 15 iOS 17.2 시뮬레이터에 앱 설치와 실행을 확인했습니다.
- M8 변경 후 `xcodebuild test`는 XCTest runner 단계에서 `waiting for workers to materialize` 상태로 대기해 수동 중단했습니다.
- 테스트 중단 후 시뮬레이터가 종료되어 스크린샷 기반 화면 확인은 완료하지 못했습니다.
- 2026-07-01 QA Agent가 `T-20260701-002` 기준 수동 QA를 시도했습니다.
- `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- iPhone SE (3rd generation) iOS 17.2 시뮬레이터에서 앱 설치/실행, Home 화면, 작은 화면 Home, 다크 모드 Home 가독성을 확인했습니다.
- iPhone 15 iOS 17.2 시뮬레이터는 Apple ID Verification 시스템 팝업으로 앱 화면 확인이 차단되었습니다.
- macOS `System Events` 보조 접근 권한 미허용으로 Simulator 터치 자동화가 차단되어 Home 이후 Cooking Log, AI Review, Recipe Detail, Audio Player, SwiftData 저장 유지 검증은 완료하지 못했습니다.
- QA 상세 보고서는 `../../../.ai_project/qa/T-20260701-002_qa-report.md`에 기록했습니다.
- 2026-07-01 Product Owner 재개 승인 후 QA Agent가 iPhone SE (3rd generation) iOS 17.2 시뮬레이터에서 새 설치 기준 수동 QA를 재개했습니다.
- Home, Cooking Log 진입, 10초 기록, STEP Preview 1개 생성, `AI 정리하기` 버튼 표시까지 확인했습니다.
- Cooking Log에 STEP Preview 1개가 표시된 상태에서 `AI 정리하기`를 누르면 AI Review가 레시피 초안 대신 `정리할 STEP Preview가 없습니다.` 오류를 표시하는 핵심 흐름 결함을 확인했습니다.
- 이 결함으로 AI Review 저장, Recipe Detail, Audio Player, SwiftData 저장 유지 검증은 완료하지 못했고, `T-20260701-002`를 `rework_requested`로 전환했습니다.
- `AI 정리하기` route가 STEP Preview 배열을 직접 들고 AI Review로 이동하도록 수정해, 전역 임시 상태가 비어 AI Review에 빈 배열이 전달될 수 있는 경로를 제거했습니다.
- 수정 후 `xcodebuild build -quiet`와 `xcodebuild build-for-testing -quiet` 성공을 확인했습니다.
- `xcodebuild ... -only-testing:CookLogTests/AIReviewViewModelTests test -quiet`로 AI Review ViewModel 테스트 4개 통과를 확인했습니다.
- 수정 후 iPhone SE (3rd generation) iOS 17.2 시뮬레이터에서 새 설치 기준 Home -> Cooking Log -> 10초 기록 2회 -> STEP Preview 2개 누적 -> AI Review 초안 표시까지 재검증했습니다.
- 기존 `정리할 STEP Preview가 없습니다.` 오류는 재현되지 않았습니다.
- AI Review 하단 저장 버튼까지의 스크롤 자동화가 안정적으로 전달되지 않아 저장 이후 터치 검증은 후속 수동 확인으로 남겼습니다.
- `AIReviewViewModelTests`, `RecipeDetailViewModelTests`, `AudioPlayerViewModelTests`, `SwiftDataRecipeLocalDataSourceTests` 선별 실행으로 총 18개 테스트 통과를 확인했습니다.
- QA Agent가 `T-20260701-003` ready_for_qa를 재검증했고, STEP Preview 1개 생성 후 AI Review 초안 표시를 확인해 `QA-HIGH-001` 수정 통과로 판정했습니다.
- QA 재검증 중 STEP Preview 2개 누적까지 확인했으나, Simulator 종료로 2개 누적 상태의 AI Review 재진입 스크린샷은 확보하지 못했습니다.
- 2026-07-27 QA Agent가 `T-20260701-002` 저장 이후 MVP 흐름을 iPhone SE (3rd generation), iOS 17.2 시뮬레이터에서 재검증했습니다.
- AI Review 저장, Recipe Detail, Audio Player 재생/정지/다시 듣기, 앱 종료·재실행 후 SwiftData 레시피 유지와 재진입을 실제 터치로 확인했습니다.
- iPhone SE 작은 화면과 Home, Cooking Log, AI Review, Recipe Detail, Audio Player의 다크 모드 가독성을 확인했습니다.
- AI Review의 재료 행과 STEP 추가·삭제를 확인했고, 문자열 편집 전체와 2단계 이전/다음 이동은 후속 사람 손 입력 확인으로 남겼습니다.
- `xcodebuild build -quiet`, `xcodebuild build-for-testing -quiet` 성공과 핵심 선별 XCTest 18개 통과를 확인했습니다.
- 신규 제품 결함은 없으며 `T-20260701-002`를 조건부 통과와 `qa_passed`로 판정했습니다.

## 열린 질문

- CI 환경·build·XCTest workflow와 T-004 진단 통합은 완료됐습니다. T-005 dry run과 T-006 required check 적용이 남아 있습니다.
- Xcode 15.2 설치본 부재 위험은 Product Owner가 수용했으며 Xcode 15.2 호환성을 보장하지 않습니다.

## 세션 시작 체크리스트

- [ ] `git status -sb` 확인
- [ ] `apps/ios/AGENTS.md` 확인
- [ ] 이 문서의 현재 상태와 다음 작업 확인
- [ ] `apps/ios/docs/DEVELOPMENT_PLAN.md` 확인
- [ ] 작업 주제에 맞는 역할별 상세 문서 확인
- [ ] `../../../docs/product/CookLog_PRD_v2.md` 확인

## 세션 종료 체크리스트

- [ ] 완료한 작업을 이 문서에 반영
- [ ] 개발 계획 체크리스트 업데이트
- [ ] 새 결정사항을 `DECISIONS.md`에 기록
- [ ] 변경사항을 `CHANGELOG.md`에 기록
- [ ] 빌드/테스트 결과 기록
