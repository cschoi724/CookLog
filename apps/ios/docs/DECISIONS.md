# CookLog iOS 의사결정 로그

이 문서는 iOS 개발 중 내려진 기술적, 제품적 결정을 기록합니다. 결정이 바뀌면 기존 내용을 삭제하기보다 새 항목을 추가해 변경 이유를 남깁니다.

작성일: 2026-06-19
최종 업데이트: 2026-07-28

## 기록 방식

각 결정은 다음 형식으로 남깁니다.

```text
## YYYY-MM-DD - 결정 제목

- 상태: 제안됨 | 확정 | 변경됨 | 보류
- 결정:
- 이유:
- 영향:
- 후속 작업:
```

## 2026-07-28 - XCTest는 단일 Simulator worker와 제한 시간으로 실행

- 상태: 확정
- 결정: CookLog의 전체 XCTest는 병렬 worker를 사용하지 않고 `Scripts/run-xctest.sh`를 통해 단일 worker, 기본 600초 제한, 로그와 `xcresult` 보존 조건으로 실행합니다.
- 이유: Xcode 15.2 환경에서 병렬 worker materialization이 종료되지 않은 이력이 있고, 현재 toolchain에서도 병렬 실행은 불필요한 Simulator clone과 진단 변동성을 만듭니다.
- 영향: 로컬과 CI의 `ios-xctest`는 같은 스크립트를 사용하며 timeout은 종료 코드 124로 구분합니다.
- 후속 작업: iOS QA Agent가 절차를 독립 재현하고, T-20260728-008이 Hosted Runner destination과 artifact upload를 연결합니다.

## 2026-06-19 - iOS MVP를 네이티브 SwiftUI 앱으로 시작

- 상태: 확정
- 결정: CookLog iOS MVP는 SwiftUI 기반 네이티브 앱으로 시작합니다.
- 이유: 현재 우선순위가 iOS 단일 MVP이고, 기록, 목록, 상세, 오디오 플레이어 중심의 화면을 빠르게 만들기 좋습니다. Speech, AVFoundation 같은 Apple 플랫폼 기능과도 직접 연결하기 쉽습니다.
- 영향: React Native, Flutter, 웹뷰 기반 앱은 MVP 초기 선택지에서 제외합니다.
- 후속 작업: Xcode 프로젝트 생성 시 Interface를 SwiftUI로 선택합니다.

## 2026-06-19 - 초기 아키텍처는 가벼운 MVVM 사용

- 상태: 변경됨
- 결정: 초기 구조는 SwiftUI View, ViewModel, Model, Service/Store로 나누는 가벼운 MVVM을 사용합니다.
- 이유: MVP 단계에서 과한 아키텍처는 개발 속도를 늦출 수 있습니다. 다만 AI, STT, TTS, 저장소는 인터페이스로 분리해야 이후 교체가 쉽습니다.
- 영향: TCA, VIPER, Clean Architecture는 초기 도입하지 않습니다.
- 후속 작업: 2026-06-22 결정에 따라 Feature 중심 MVVM + UseCase + Repository/DataSource 구조로 변경합니다.

## 2026-06-19 - 실제 AI API보다 Mock AI 흐름을 먼저 구현

- 상태: 변경됨
- 결정: `RecipeGenerationRepository`와 `RecipeAIDataSource` 인터페이스를 만들고 Mock 구현을 먼저 사용합니다. 실제 AI API 연동은 전체 앱 흐름이 동작한 뒤 검토합니다. PRD v2 기준으로 AI는 STEP Preview 누적 후 `AI 정리하기` 시점에만 호출합니다.
- 이유: CookLog의 핵심 검증은 API 연동 자체가 아니라 10초 음성 기록이 STEP Preview로 쌓이고, 이후 레시피가 되어 다시 요리할 수 있는 흐름입니다.
- 영향: 초기 구현에서는 외부 네트워크와 API 키 없이 개발할 수 있습니다.
- 후속 작업: STEP Preview 배열을 입력으로 받는 `MockRecipeAIDataSource`와 Repository 구현을 만들고, AI Review 화면 저장 흐름을 먼저 완성합니다.

## 2026-06-19 - 오디오 가이드는 TTS 기반으로 시작

- 상태: 확정
- 결정: 초기 오디오 가이드는 `AVSpeechSynthesizer` 기반 TTS로 구현합니다.
- 이유: 저장된 조리 단계를 바로 읽을 수 있고, 별도 오디오 파일 생성이나 서버 처리가 필요 없습니다.
- 영향: 녹음 파일 저장, 고품질 음성 합성, 음성 명령은 MVP 이후로 미룹니다.
- 후속 작업: `AudioGuideService` 인터페이스를 만들고 단계 이동 로직을 분리합니다.

## 2026-06-19 - 로컬 저장 우선

- 상태: 확정
- 결정: MVP는 서버 저장 없이 로컬 저장으로 시작합니다.
- 이유: 로그인과 서버 동기화는 MVP 제외 기능입니다. 개인 레시피 저장소 경험을 먼저 검증합니다.
- 영향: 계정, 백엔드, 동기화, 공유 기능은 초기 개발 범위에서 제외합니다.
- 후속 작업: SwiftData 또는 대체 로컬 저장 방식을 확정합니다.

## 2026-06-22 - PRD v2를 제품 기준으로 확정

- 상태: 확정
- 결정: iOS MVP 개발 기준을 `docs/product/CookLog_PRD_v2.md`와 `docs/product/CookLog PRD v2.pdf`로 변경합니다.
- 이유: PRD v2에서 10초 음성 기록, STEP Preview, A-Lite Strategy, AI Review 시점이 명확해졌습니다.
- 영향: 기존 텍스트 입력 중심 또는 즉시 AI 정리 중심 흐름은 MVP 기준에서 제외합니다.
- 후속 작업: 제품 문서, iOS 개발 계획, iOS 에이전트 지침을 PRD v2 기준으로 유지합니다.

## 2026-06-22 - STEP Preview는 STT 기반 중간 결과로 처리

- 상태: 확정
- 결정: STEP Preview는 AI 결과가 아니라 10초 음성 기록의 STT 결과를 순서대로 보여주는 중간 결과로 처리합니다.
- 이유: 사용자에게 실시간으로 레시피가 만들어지는 느낌을 주되, 실제 AI 구조화 비용과 구현 난이도를 줄이기 위함입니다.
- 영향: Cooking Log 화면에서는 복잡한 레시피 구조를 만들지 않고 STEP Preview 누적에 집중합니다.
- 후속 작업: `StepPreview` 모델과 누적 로직을 도메인 모델에 포함합니다.

## 2026-06-22 - Xcode 15.2를 iOS 개발 기준으로 사용

- 상태: 확정
- 결정: 현재 개발 Mac에서 Xcode를 더 이상 업데이트할 수 없으므로 Xcode 15.2를 iOS 개발 기준으로 사용합니다.
- 이유: 실제 개발 환경에서 재현 가능한 기준을 우선해야 합니다.
- 영향: 프로젝트 생성, 빌드, SwiftData 사용 가능 범위는 Xcode 15.2 기준으로 판단합니다.
- 후속 작업: 프로젝트 생성 후 실제 빌드 가능 여부를 확인합니다.

## 2026-06-22 - 최소 iOS 버전은 iOS 17 이상

- 상태: 확정
- 결정: CookLog iOS MVP의 최소 iOS 버전은 iOS 17 이상으로 합니다.
- 이유: SwiftData를 바로 사용하고, 초기 MVP 개발 속도를 우선하기 위함입니다.
- 영향: iOS 16 이하 지원은 MVP 범위에서 제외합니다.
- 후속 작업: Xcode 프로젝트 생성 시 deployment target을 iOS 17 이상으로 설정합니다.

## 2026-06-22 - 로컬 저장은 SwiftData로 시작

- 상태: 확정
- 결정: MVP 로컬 저장은 SwiftData로 바로 시작합니다.
- 이유: Recipe와 RecipeStep 중심의 개인 저장소 MVP에 적합하고, iOS 17 이상 기준과도 맞습니다.
- 영향: JSON 파일 저장과 Core Data는 초기 구현 선택지에서 제외합니다.
- 후속 작업: 도메인 모델과 SwiftData 저장 모델을 분리하고 Mapper를 둡니다.

## 2026-06-22 - 레시피 검색은 MVP에서 제외

- 상태: 확정
- 결정: 레시피 검색은 현재 MVP에 포함하지 않고 보류합니다.
- 이유: PRD v2 핵심 흐름은 10초 음성 기록, AI Review, 저장, 오디오 가이드입니다. 검색은 저장된 레시피 수가 늘어난 이후 가치가 커집니다.
- 영향: Home과 레시피 목록은 검색 없이 최근/전체 목록 조회 중심으로 구현합니다.
- 후속 작업: 검색이 필요해질 때 제목, 재료, 메모, 단계 텍스트 기반 검색을 검토합니다.

## 2026-06-22 - STT 실패 시 사용자 텍스트 입력 fallback은 제공하지 않음

- 상태: 확정
- 결정: STT 실패 시 사용자 기능으로 텍스트 입력 fallback을 제공하지 않습니다. 실패 시 다시 녹음과 권한 안내를 제공합니다.
- 이유: PRD v2의 핵심 원칙은 사용자가 레시피를 작성하지 않고 음성으로만 기록하는 것입니다.
- 영향: MVP 사용자 경험은 음성 기록 중심으로 유지됩니다.
- 후속 작업: 개발 편의를 위한 Debug Mock 입력은 별도 개발용 경로로만 허용합니다.

## 2026-06-22 - 실제 AI API는 백엔드 프록시 방식을 우선 검토

- 상태: 확정
- 결정: MVP 1차 구현은 `MockRecipeAIDataSource`로 진행하고, 실제 AI API는 앱 직접 호출을 피하며 추후 백엔드 프록시 방식을 우선 검토합니다.
- 이유: API 키 보안, 비용 관리, 호출 정책 제어를 위해 앱 직접 호출은 위험합니다.
- 영향: iOS MVP는 외부 AI API 없이도 전체 흐름을 구현할 수 있어야 합니다.
- 후속 작업: 로컬 테스트가 필요하면 `.xcconfig` 기반 개발용 임시 키만 허용합니다.

## 2026-06-22 - 프로젝트는 Xcode에서 직접 생성

- 상태: 확정
- 결정: iOS 프로젝트는 Xcode에서 직접 생성합니다.
- 이유: 현재는 단일 iOS 앱 MVP이며, 프로젝트 생성 자동화 도구를 도입할 만큼 설정 복잡도가 높지 않습니다.
- 영향: `xcodegen` 같은 프로젝트 생성 도구는 초기 도입하지 않습니다.
- 후속 작업: 프로젝트 생성 후 실제 파일 구조를 문서에 반영합니다.

## 2026-06-22 - DI 라이브러리는 사용하지 않음

- 상태: 확정
- 결정: DI 라이브러리 없이 수동 주입과 생성자 주입으로 진행합니다. 외부 패키지가 필요해지면 Swift Package Manager로 관리합니다.
- 이유: MVP 규모에서는 DI 라이브러리의 이점보다 복잡도가 더 큽니다.
- 영향: ViewModel은 UseCase, Repository, Service를 명시적 initializer로 주입받습니다.
- 후속 작업: 테스트 가능한 Mock 주입 구조를 유지합니다.

## 2026-06-22 - 도메인 모델과 SwiftData 모델 분리

- 상태: 확정
- 결정: 앱 도메인 모델과 SwiftData 저장 모델을 분리합니다.
- 이유: 원격 저장, Android 스키마, Import/OCR 같은 향후 확장 시 SwiftData에 덜 묶이기 위함입니다.
- 영향: Persistence 계층에 SwiftData 모델과 Mapper가 필요합니다.
- 후속 작업: `Models/`와 `Persistence/` 책임을 분리합니다.

## 2026-06-22 - Feature 중심 MVVM + UseCase + Repository/DataSource 사용

- 상태: 확정
- 결정: iOS 앱 구조는 Feature 중심 MVVM + UseCase + Repository/DataSource로 확정합니다.
- 이유: MVP 구현 속도를 유지하면서도 SwiftData, AI API, 향후 원격 저장소, Import/OCR 같은 구현 교체 지점을 명확히 분리하기 위함입니다.
- 영향: ViewModel은 SwiftData, Speech, AVFoundation, 실제 AI API에 직접 의존하지 않습니다. 도메인 모델, Repository 인터페이스, UseCase는 Domain에 두고, Repository 구현, DataSource, SwiftData 저장 모델, Mapper는 Data에 둡니다.
- 후속 작업: 프로젝트 생성 후 `App/`, `Domain/`, `Data/`, `Services/`, `Features/`, `Support/`, `PreviewSupport/`, `Resources/` 구조를 기준으로 정리합니다.

## 2026-06-22 - NavigationStack과 AppRoute 사용

- 상태: 확정
- 결정: 화면 이동은 `NavigationStack`과 `AppRoute`로 관리합니다.
- 이유: MVP 화면 수가 많지 않고 SwiftUI 기본 Navigation API로 충분히 명확하게 표현할 수 있습니다.
- 영향: 문자열 기반 route와 거대한 전역 Router 객체는 사용하지 않습니다.
- 후속 작업: `AppRoute`에 `cookingLog`, `aiReview`, `recipeDetail`, `audioPlayer` 경로를 정의합니다.

## 2026-06-22 - AppEnvironment와 생성자 주입 사용

- 상태: 확정
- 결정: DI 라이브러리 없이 `AppEnvironment`와 생성자 주입으로 의존성을 조립합니다.
- 이유: MVP 규모에서는 DI 컨테이너보다 명시적 조립이 이해와 테스트에 유리합니다.
- 영향: Swinject는 사용하지 않습니다. ViewModel은 전역 컨테이너를 참조하지 않고 필요한 UseCase나 Service를 initializer로 받습니다.
- 후속 작업: 앱 시작 지점에서 Repository, DataSource, UseCase, Service를 구성합니다.

## 2026-06-22 - AppError와 제한적 ViewState 사용

- 상태: 확정
- 결정: 앱 공통 에러는 `AppError`로 정리하고, 비동기 화면 상태는 필요한 화면에서만 `ViewState`를 제한적으로 사용합니다.
- 이유: 권한 거부, STT 실패, AI 정리 실패, 저장 실패 같은 상태를 일관되게 처리하되, 모든 화면에 과한 상태 머신을 적용하지 않기 위함입니다.
- 영향: 사용자 메시지는 `AppError` 매핑으로 관리하고, 목록, 상세, AI Review처럼 loading/error가 필요한 화면에만 `ViewState`를 적용합니다.
- 후속 작업: `Support/Error`와 `Support/ViewState`에 공통 타입을 둡니다.

## 2026-06-22 - Mock, Preview, Test 데이터 분리

- 상태: 확정
- 결정: 런타임 Mock, SwiftUI Preview 샘플, Unit Test Fixture를 분리합니다.
- 이유: 개발 편의용 데이터가 실제 앱 흐름이나 테스트 신뢰도를 흐리지 않게 하기 위함입니다.
- 영향: `PreviewSupport/`는 Preview 전용 샘플을 담당하고, 테스트 Fixture는 테스트 타겟에 둡니다. Mock Repository/DataSource/Service는 개발과 테스트에서 명시적으로 주입합니다.
- 후속 작업: 프로젝트 생성 후 샘플 STEP Preview와 Recipe 데이터를 각 용도에 맞게 분리합니다.

## 결정 상태 요약

### iOS 개발 기술 스펙

- 상태: 확정
- 결정: `apps/ios/docs/DEVELOPMENT_SPEC.md` 기준으로 확정

### 최소 iOS 버전

- 상태: 확정
- 결정: iOS 17 이상

### 로컬 저장 구현 방식

- 상태: 확정
- 결정: SwiftData

### 프로젝트 생성 방식

- 상태: 확정
- 결정: Xcode 직접 생성

### DI 방식

- 상태: 확정
- 결정: DI 라이브러리 없이 수동/생성자 주입

### SwiftData 모델과 도메인 모델 분리

- 상태: 확정
- 결정: 분리 확정

### 앱 아키텍처와 폴더 구조

- 상태: 확정
- 결정: Feature 중심 MVVM + UseCase + Repository/DataSource
