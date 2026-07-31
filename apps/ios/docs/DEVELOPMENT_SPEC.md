# CookLog iOS Development Spec

이 문서는 CookLog iOS의 기술 기준과 상세 문서 위치를 정리합니다. 제품 기능 범위는 배정 Task와 루트 제품 Source of Truth에서 관리합니다.

작성일: 2026-06-19
최종 업데이트: 2026-07-31
상태: 확정
기준 PRD: `../../../docs/product/CookLog_PRD_v2.md`

## 1. 스펙 방향

CookLog iOS 앱은 SwiftUI 기반 네이티브 앱으로 시작합니다.

과거 Mock Core MVP와 첫 App Store 공개 출시 범위를 구분합니다. 구현 여부는 이 기술 문서의 오래된 목록이 아니라 승인된 Task와 `CookLog_MVP_SCOPE.md`를 따릅니다.

핵심 원칙:

- 제품 경험은 PRD v2를 따른다.
- 10초 음성 기록은 STEP Preview를 만드는 단위다.
- STEP Preview는 STT 기반 중간 결과이며 AI 결과가 아니다.
- AI는 `AI 정리하기` 시점에만 호출한다.
- ViewModel은 SwiftData, Speech, AVFoundation, 실제 AI API에 직접 의존하지 않는다.
- 도메인 모델은 저장소 구현과 분리한다.
- 제품 범위를 기술 편의로 축소하지 않고 Task가 요구한 교체 지점과 모델 확장성을 고려한다.

## 2. 확정 기술 기준

- 언어: Swift
- UI: SwiftUI
- 아키텍처: Feature 중심 MVVM + UseCase + Repository/DataSource
- 현재 CI 검증 Xcode: 26.6 (`macos-26`)
- 과거 프로젝트 생성 Xcode: 15.2, 현재 호환성 미보장
- 최소 iOS 버전: iOS 17 이상
- 로컬 저장: SwiftData
- 음성 입력: Apple Speech
- 오디오 안내: `AVSpeechSynthesizer`
- AI 정리: `RecipeGenerationRepository`와 `RecipeAIDataSource` 경계 유지, 첫 공개 출시는 Backend 연동
- 실제 AI API: 앱 직접 호출 금지, 승인된 Backend 계약 사용
- 테스트: 도메인 로직과 서비스 Mock 중심의 Unit Test 우선

## 3. 확정된 추가 결정

- 프로젝트는 Xcode에서 직접 생성합니다.
- DI 라이브러리는 사용하지 않고 `AppEnvironment`와 생성자 주입으로 시작합니다.
- 외부 패키지가 필요해지면 Swift Package Manager로 관리합니다.
- Swinject는 사용하지 않습니다.
- 도메인 모델과 SwiftData 저장 모델은 분리합니다.
- UseCase 계층을 둡니다.
- Repository 패턴과 DataSource 패턴을 사용합니다.
- Navigation은 `NavigationStack`과 `AppRoute`로 관리합니다.
- 에러는 `AppError`로 통일합니다.
- 비동기 화면 상태는 필요한 화면에서 `ViewState` 패턴을 제한적으로 사용합니다.

## 4. 상세 문서

역할별 상세 기준은 다음 문서에서 관리합니다.

- `ARCHITECTURE.md`: 앱 계층 구조, 폴더 구조, UseCase, AppEnvironment, AppState, Error/ViewState
- `DATA_MODEL.md`: 도메인 모델, 저장 전 Draft, 향후 확장 모델
- `PERSISTENCE.md`: SwiftData 저장 모델, Repository 구현, Mapper 기준
- `NAVIGATION.md`: `NavigationStack`, `AppRoute`, 화면 이동 규칙
- `SERVICES.md`: Speech, AI 정리, AudioGuide, 권한, Mock/Preview/Test 데이터 분리
- `TESTING.md`: 테스트 우선순위, Mock/Fixture, 검증 기준
- `DEVELOPMENT_PLAN.md`: 이정표, 체크리스트, 진행 상태
- `DECISIONS.md`: 변경 이력이 필요한 기술 결정
- `STATUS.md`: 현재 상태와 다음 작업
- `CHANGELOG.md`: iOS 개발 문서 및 코드 변경 기록

## 5. 프로젝트 생성 기준

Xcode에서 새 프로젝트를 만들 때 다음 기준을 사용합니다.

- Platform: iOS
- Template: App
- Product Name: CookLog
- Interface: SwiftUI
- Language: Swift
- Tests: Unit Tests 포함
- UI Tests: 초기에는 선택 사항
- Package Manager: 필요 시 Swift Package Manager 사용

프로젝트 위치:

```text
apps/ios/
```

예상 구조:

```text
apps/ios/
├── agents.md
├── docs/
├── CookLog.xcodeproj
├── CookLog/
│   ├── App/
│   ├── Domain/
│   ├── Data/
│   ├── Services/
│   ├── Features/
│   ├── Support/
│   ├── PreviewSupport/
│   └── Resources/
└── CookLogTests/
```

## 6. 제품 범위 참조

- Core MVP와 첫 App Store 공개 출시 포함·제외: `../../../docs/product/CookLog_MVP_SCOPE.md`
- 상세 상태·저장·오류·핸즈프리 계약: `../../../docs/product/CookLog_PRD_v2.md`
- 실행 순서: `../../../docs/product/CookLog_ROADMAP.md`와 개별 Task
- 로컬 검색, 진행 기록 저장과 공개 출시 핸즈프리는 현재 제품 문서와 Task에 따라 구현하며 과거 제외 목록을 적용하지 않습니다.

기술 확장 지점:

- `RecipeSource`
- `RecipeGenerationInput`
- `SyncStatus`
- `ownerId`
- Repository/DataSource/Service 프로토콜
- 도메인 모델과 SwiftData 모델 분리

## 7. 과거 첫 구현 순서

1. SwiftUI 프로젝트 생성
2. 도메인 모델 작성
3. Repository/Service 프로토콜 작성
4. UseCase 작성
5. Mock Repository/DataSource/Service 작성
6. Home과 샘플 레시피 목록 작성
7. Cooking Log에서 Mock STT 기반 STEP Preview 누적 구현
8. Mock AI 기반 AI Review 구현
9. Recipe 저장/상세 연결
10. TTS 기반 Audio Player 구현
11. SwiftData 저장소 구현
12. Apple Speech 실제 구현 연결
13. 실제 AI API 연결 검토

현재 첫 공개 출시 구현은 위 과거 순서가 아니라 최신 Roadmap과 개별 Task를 따릅니다.

## 8. 참고 공식 문서

- Apple Xcode: https://developer.apple.com/xcode/
- Apple SwiftUI: https://developer.apple.com/documentation/swiftui
- Apple SwiftData: https://developer.apple.com/documentation/swiftdata
- Apple Speech: https://developer.apple.com/documentation/speech
- Apple AVSpeechSynthesizer: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer
