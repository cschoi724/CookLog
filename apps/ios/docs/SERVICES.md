# CookLog iOS Services

이 문서는 CookLog iOS 앱의 플랫폼 서비스와 외부 연동 경계를 관리합니다.

최종 업데이트: 2026-07-31
상태: 확정

## 1. 서비스 원칙

- Speech와 AudioGuide는 Repository로 감싸지 않고 Service로 둡니다.
- AI 정리는 `RecipeGenerationRepository`와 `RecipeAIDataSource` 경계 뒤에 둡니다.
- 실제 AI, STT, TTS API 키를 저장소에 커밋하지 않습니다.
- Mock은 Preview·Test 또는 명시적 개발 경로로만 유지하고 첫 공개 출시 실행 Task는 실제 기기 내 STT·Backend AI·로컬 TTS 경로를 구현합니다.

## 2. Speech 스펙

첫 공개 출시 음성 입력은 지원되는 Apple 기기의 기기 내 Speech 처리를 기본으로 합니다.

### SpeechRecognitionService

```swift
protocol SpeechRecognitionService {
    func requestAuthorization() async -> SpeechAuthorizationStatus
    func transcribeTenSecondRecording() async throws -> String
}
```

초기 구현 후보:

- `MockSpeechRecognitionService`
- `AppleSpeechRecognitionService`

동작 기준:

- 사용자가 10초 기록 버튼을 누릅니다.
- 앱은 최대 10초 동안 음성을 녹음합니다.
- STT 결과를 `StepPreview`로 추가합니다.
- 복구 가능한 기술 오류는 같은 기기 내 adapter로 최대 1회 재처리합니다.
- 최종 실패 시 원격 STT로 전환하지 않고 새 STEP을 만들지 않은 채 다시 기록하기를 제공합니다.

PRD v2 기준 사용자 경험은 음성 기록 중심입니다. 텍스트 직접 입력은 MVP 사용자 기능으로 열지 않습니다.

Fallback 정책:

- STT 실패 시 다시 녹음을 제공합니다.
- 마이크 또는 음성 인식 권한 거부 시 권한 안내와 설정 이동 안내를 검토합니다.
- 개발 편의를 위한 Debug 전용 입력이나 Mock STT는 허용할 수 있습니다.

## 3. AI 정리 스펙

AI 정리는 `AI 정리하기` 시점에만 실행합니다.

### RecipeGenerationRepository

```swift
protocol RecipeGenerationRepository {
    func generateRecipeDraft(from input: RecipeGenerationInput) async throws -> RecipeDraft
}
```

현재 구현 경계:

- `DefaultRecipeGenerationRepository`
- `MockRecipeAIDataSource`는 Preview·Test 또는 개발 경로
- `RemoteRecipeAIDataSource`

원칙:

- Cooking Log 화면에서 AI를 호출하지 않습니다.
- STEP Preview는 STT 결과입니다.
- AI Review 화면 진입 전에만 전체 STEP Preview를 정리합니다.
- 실제 API Key는 저장소에 커밋하지 않습니다.
- 실제 AI API는 앱에서 직접 호출하지 않고 승인된 Backend 계약을 사용합니다.
- 요청 식별자와 상태 조회로 중복 실행·중복 Review를 방지합니다.
- 로컬 테스트가 필요하면 `.xcconfig` 기반 개발용 임시 키만 허용합니다.

## 4. 오디오 가이드 스펙

첫 공개 출시 오디오 가이드는 `AVSpeechSynthesizer` 기반 로컬 TTS와 항상 사용 가능한 버튼을 기본으로 합니다.

### AudioGuideService

```swift
protocol AudioGuideService {
    func play(step: RecipeStep) async
    func stop()
    func pause()
}
```

MVP 구현 후보:

- `SystemTTSAudioGuideService`

향후 구현 후보:

- `RemoteAudioGuideService`
- `RecordedAudioGuideService`

기본 기능:

- 재생
- 정지
- 이전 단계
- 다음 단계
- 현재 단계 다시 듣기

첫 공개 출시 추가 경계:

- 사용자가 `핸즈프리 시작`으로 활성화하는 음성 명령
- 버튼과 음성 명령이 같은 Audio Guide action model을 사용
- 인식 실패 시 현재 상태를 보존하고 버튼으로 계속 조작
- `핸즈프리 종료`와 오디오 중단 후 자동 재활성화 금지

후속 범위:

- 백그라운드 오디오
- 서버 생성 고품질 음성
- 녹음 파일 저장

## 5. 권한

필요 권한:

- 마이크 사용 권한
- 음성 인식 권한

권한 문구 예시:

```text
요리 기록을 음성으로 남기기 위해 마이크를 사용합니다.
음성 기록을 텍스트로 변환하기 위해 음성 인식을 사용합니다.
```

권한 거부 시:

- 재요청 가능한 안내를 제공합니다.
- 시스템 설정 이동 안내를 검토합니다.
- MVP에서 텍스트 입력 fallback은 사용자 기능으로 제공하지 않습니다.

## 6. Mock, Preview, Test 데이터 분리

Mock, Preview, Test 데이터를 섞지 않습니다.

기준:

- Preview용 샘플 데이터는 `PreviewSupport/`에 둡니다.
- 테스트용 Mock은 테스트 타겟 또는 테스트 helper에 둡니다.
- 개발용 Mock DataSource/Service는 앱 타겟에 둘 수 있지만 이름에 `Mock`을 명확히 붙입니다.

예시:

```text
PreviewSupport/
├── SampleRecipes.swift
└── SampleStepPreviews.swift
```
