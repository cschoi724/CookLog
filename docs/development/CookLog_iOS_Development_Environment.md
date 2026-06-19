# CookLog iOS 개발 환경 권장안

이 문서는 CookLog iOS MVP를 어떤 환경과 기술 조합으로 개발할지 정리한 기준 문서입니다.

작성일: 2026-06-19

## 결론

CookLog iOS 앱은 SwiftUI 기반 네이티브 앱으로 시작합니다.

- IDE: Xcode
- 언어: Swift
- UI: SwiftUI
- 아키텍처: 가벼운 MVVM
- 저장소: 초기 MVP는 로컬 저장
- 로컬 데이터: SwiftData 우선 검토
- 음성 입력: Apple Speech 프레임워크 우선 검토
- 오디오 안내: AVFoundation의 `AVSpeechSynthesizer` 우선 검토
- AI 정리: 초기에는 Mock 또는 로컬 규칙 기반 구현 후, 서비스 인터페이스 뒤에 실제 API를 연결

이 조합은 CookLog MVP의 핵심인 기록, 저장, 다시 듣기 흐름을 가장 빠르게 검증하기 좋습니다. React Native, Flutter, 서버 우선 구조보다 iOS 단일 MVP를 작게 완성하기 쉽고, STT/TTS 같은 Apple 플랫폼 기능을 직접 활용하기 좋습니다.

## 현재 로컬 환경

현재 저장소에서 확인한 개발 도구는 다음과 같습니다.

```text
Xcode 15.2
Build version 15C500b
```

현재 머신 기준으로도 SwiftUI 앱 개발은 가능합니다. 다만 새 iOS 프로젝트를 본격적으로 시작하기 전에는 Xcode를 최신 안정 버전으로 업데이트하는 것을 권장합니다.

## 권장 Xcode 기준

새로 세팅한다면 App Store 또는 Apple Developer에서 제공하는 최신 안정 Xcode를 사용합니다.

Apple 공식 Xcode 페이지 기준으로 Xcode는 Apple 플랫폼 앱을 개발, 테스트, 배포하기 위한 도구이며 SwiftUI 프리뷰, Simulator, 테스트, 디버깅, Instruments 등을 포함합니다.

주의할 점:

- 베타 Xcode는 새 OS 대응이나 실험 목적일 때만 사용합니다.
- MVP 개발 기준은 안정 버전 Xcode를 우선합니다.
- 팀 내 Xcode 버전이 다르면 `.xcodeproj` 또는 `.pbxproj` 변경 충돌이 생길 수 있으므로 프로젝트 생성 직후 기준 버전을 문서에 고정합니다.

## 최소 iOS 버전

초기 권장값은 iOS 17 이상입니다.

이유:

- SwiftData를 사용할 수 있습니다.
- SwiftUI 기반 앱을 단순하게 구성하기 좋습니다.
- 개인 저장소 MVP에서는 아주 낮은 OS 버전 지원보다 개발 속도와 안정성이 더 중요합니다.

단, 실제 배포 대상 사용자의 기기 범위를 넓히고 싶다면 iOS 16 이상으로 낮출 수 있습니다. 이 경우 SwiftData 대신 파일 기반 JSON 저장, SQLite, Core Data 중 하나를 선택해야 합니다.

## 프로젝트 생성 권장 설정

Xcode에서 새 프로젝트를 만들 때 다음 기준을 사용합니다.

- Platform: iOS
- Template: App
- Product Name: CookLog
- Interface: SwiftUI
- Language: Swift
- Storage: SwiftData 사용 가능하면 SwiftData, 아니면 None 선택 후 직접 구성
- Tests: Unit Tests 포함
- UI Tests: 초기에는 선택 사항

프로젝트 위치:

```text
apps/ios/
```

프로젝트 생성 후 예상 구조:

```text
apps/ios/
├── agents.md
├── CookLog.xcodeproj
├── CookLog/
│   ├── App/
│   ├── Models/
│   ├── Services/
│   ├── Stores/
│   ├── ViewModels/
│   ├── Views/
│   └── Resources/
└── CookLogTests/
```

## 기술 선택

### SwiftUI

CookLog는 화면 수가 적고 입력, 목록, 상세, 플레이어 중심의 앱입니다. SwiftUI로 MVP 화면을 빠르게 만들고 상태 변화를 단순하게 표현하는 것이 적합합니다.

사용 화면:

- Home
- Cooking Log
- AI Review
- Recipe Detail
- Audio Player

### MVVM

초기에는 복잡한 아키텍처를 도입하지 않습니다.

- View: SwiftUI 화면
- ViewModel: 화면 상태와 사용자 액션 처리
- Model: Recipe, RecipeStep, CookingLog
- Service/Store: 저장, AI 정리, 음성 인식, 오디오 안내

VIPER, Clean Architecture, TCA 같은 무거운 구조는 MVP 이후 필요성이 명확할 때 검토합니다.

### SwiftData

초기 로컬 저장은 SwiftData를 우선 검토합니다.

적합한 이유:

- Recipe, RecipeStep 같은 단순 도메인 모델 저장에 적합합니다.
- SwiftUI와 함께 쓰기 좋습니다.
- MVP에서 서버 없이 개인 저장소 경험을 만들기 좋습니다.

주의할 점:

- SwiftData를 쓰면 최소 iOS 버전이 iOS 17 이상이어야 합니다.
- 나중에 Android나 서버와 데이터 모델을 공유할 가능성이 있으므로 도메인 개념은 SwiftData 어노테이션에 과하게 묶지 않습니다.

대안:

- iOS 16 이하 지원이 필요하면 JSON 파일 저장 또는 Core Data를 검토합니다.
- 데이터 쿼리와 마이그레이션 요구가 커지면 SQLite 계열을 검토할 수 있습니다.

### Speech

MVP의 STT는 Apple Speech 프레임워크를 우선 검토합니다.

초기 구현 방향:

- 권한 요청 흐름을 명확히 둡니다.
- 음성 입력 실패 시 텍스트 입력으로 대체할 수 있게 합니다.
- 실제 음성 인식 구현은 `SpeechRecognitionService` 뒤에 숨깁니다.

### AVSpeechSynthesizer

오디오 가이드는 초기에는 TTS 기반으로 구현합니다.

초기 구현 방향:

- 각 RecipeStep의 텍스트를 단계별로 읽습니다.
- 이전, 재생/정지, 다음, 다시 듣기를 지원합니다.
- 구현은 `AudioGuideService` 뒤에 숨깁니다.

녹음된 오디오 파일을 저장하는 방식은 MVP 이후 검토합니다.

### AI 정리

MVP 초기에는 실제 AI API 연동을 바로 넣지 않아도 됩니다.

권장 순서:

1. `RecipeAIService` 인터페이스를 먼저 정의합니다.
2. Mock 구현으로 입력 로그를 Recipe 구조로 변환합니다.
3. 전체 앱 흐름을 완성합니다.
4. 이후 실제 AI API를 연결합니다.

API 키는 저장소에 커밋하지 않습니다. 실제 연동 시 `.xcconfig`, 환경 변수, 또는 별도 시크릿 관리 방식을 정합니다.

## 권장 첫 구현 순서

1. SwiftUI 프로젝트 생성
2. 기본 도메인 모델 작성
3. Mock `RecipeStore`로 Home, 목록, 상세 화면 구성
4. Cooking Log 화면에서 텍스트 입력으로 로그 작성
5. Mock `RecipeAIService`로 AI Review 화면 연결
6. 저장 후 Recipe Detail로 이동
7. `AVSpeechSynthesizer` 기반 Audio Player 구현
8. SwiftData 저장소로 교체
9. Speech 기반 STT 연결
10. 실제 AI API 연결 검토

이 순서가 좋은 이유는 외부 API와 권한 처리 없이도 CookLog의 핵심 경험을 먼저 확인할 수 있기 때문입니다.

## 테스트 기준

초기부터 과한 테스트를 만들 필요는 없지만, 도메인과 저장 흐름은 테스트할 가치가 있습니다.

우선순위:

- Recipe 생성 결과 검증
- Mock AI 정리 결과 검증
- Recipe 검색 로직 검증
- 오디오 플레이어 단계 이동 로직 검증

UI 테스트는 핵심 흐름이 안정된 뒤 추가합니다.

## 권한과 Info.plist

STT와 마이크 기능을 구현할 때는 권한 설명이 필요합니다.

예상 권한:

- 마이크 사용 권한
- 음성 인식 권한

권한 문구는 기능 설명이 아니라 사용자 관점의 이유를 적습니다.

예시:

```text
요리 기록을 음성으로 남기기 위해 마이크를 사용합니다.
음성 기록을 텍스트로 변환하기 위해 음성 인식을 사용합니다.
```

## 배포 전까지 보류할 것

다음은 MVP 구현 초기에 만들지 않습니다.

- 로그인
- 회원가입
- 서버 저장
- 커뮤니티
- 공유
- 블로그 Import
- 유튜브 Import
- 이미지 OCR
- 음성 명령
- 복잡한 디자인 시스템

## 참고 공식 문서

- Apple Xcode: https://developer.apple.com/xcode/
- Apple SwiftUI: https://developer.apple.com/documentation/swiftui
- Apple SwiftData: https://developer.apple.com/documentation/swiftdata
- Apple Speech: https://developer.apple.com/documentation/speech
- Apple AVSpeechSynthesizer: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer
