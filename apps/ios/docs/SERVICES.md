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

## 7. iOS·Backend 공용 계약 fixture

Backend AI 연동과 iOS mock client의 단일 fixture 원본은 다음 경로다.

```text
apps/backend/contracts/fixtures/
```

iOS test target은 해당 JSON을 test resource로 복사해 `Decodable` DTO로 읽는다. 같은
payload를 Swift literal, Preview sample 또는 `apps/ios/` 아래 별도 JSON으로 복제하지
않는다. 앱 production target과 release bundle에는 fixture를 포함하지 않는다.

공용 version:

- fixture wrapper: `ios-backend-fixture.v1`
- AI job: `ai-recipe-job.v1`
- RecipeDraft: `recipe-draft.v1`
- API envelope: `v1`

알 수 없는 fixture·AI·draft version, enum과 추가 필드는 테스트 decode 실패로 처리한다.
production 응답에서 version이 지원되지 않으면 공개 `API_VERSION_UNSUPPORTED` 흐름으로
정규화하고 기존 로컬 STEP snapshot을 유지한다.

### 7.1 AI 비동기 facade

기존 `RecipeGenerationRepository.generateRecipeDraft`는 화면에 제공하는 facade다.
`RemoteRecipeAIDataSource` 내부 transport는 다음 순서를 따른다.

1. 로컬 STEP snapshot과 canonical SHA-256을 만든다.
2. 새 사용자 실행에 새 `Idempotency-Key`를 발급해
   `POST /v1/ai/recipe-jobs`를 호출한다.
3. 반환된 `job_id`, snapshot ID·revision과 상태를 로컬에 저장한다.
4. 서버가 제시한 `poll_after_seconds`에만 GET으로 상태를 조회한다.
5. `succeeded/available`의 draft와 `result_version`을 로컬 AI Review 초안으로 먼저
   저장한다.
6. 저장 commit 뒤 같은 result version으로 acknowledgement를 보낸다.
7. 앱 재실행은 저장된 job ID를 GET해 복구하며 create나 provider 호출을 자동 반복하지
   않는다.

공식 공통 header 계약은 다음과 같다. fixture와 iOS mock client도 같은 집합을 사용하며
정의되지 않은 App Attest 전용 header를 임의로 추가하지 않는다.

| 요청 | 필수 header | 선택 header |
|---|---|---|
| create POST | `Authorization`, `CookLog-Installation-ID`, `Content-Type`, `Idempotency-Key` | `Accept`, `CookLog-Client-Request-ID` |
| poll GET | `Authorization`, `CookLog-Installation-ID` | `Accept`, `CookLog-Client-Request-ID` |
| ACK POST | `Authorization`, `CookLog-Installation-ID`, `Content-Type`, `Idempotency-Key` | `Accept`, `CookLog-Client-Request-ID` |

fixture별 iOS 기대 동작:

| Fixture | iOS 검증 |
|---|---|
| `ai-recipe-success.json` | create 202 → poll → 로컬 저장 → version ACK |
| `ai-recipe-error-cases.json` | 공개 code·message key만 mapping, snapshot 보존 |
| `ai-recipe-timeout-recovery.json` | 자동 retry 없음, terminal 확인 후 사용자 수동 재실행 |
| `ai-recipe-expired.json` | draft 없음, 로컬 snapshot 보존, 자동 재생성 없음 |
| `negative-contract-cases.json` | version·error·idempotency·ACK·추가 필드·header·STT mutation 거부 |

`queued`와 `processing`은 처리 화면을 유지하고 draft를 만들지 않는다.
`failed`와 `expired`는 기존 STEP을 변경하지 않는다. 사용자 `다시 정리하기` 선택만 새
idempotency key와 새 job을 만든다. 동일 job의 GET, ACK replay와 token refresh 후
동일 요청 재전송은 provider 재호출을 의미하지 않는다.

### 7.2 공개 오류 mapping

iOS는 `title`·`detail`을 사용자 문구로 직접 표시하지 않고 `user_message_key`와 고정
`code`를 domain error로 변환한다.

| 공개 code | iOS 동작 |
|---|---|
| `TOKEN_EXPIRED` | installation token 갱신 후 동일 idempotency key 재전송 |
| `IDEMPOTENCY_KEY_REUSED` | 자동 새 job 금지, 사용자 재실행 때만 새 key |
| `VALIDATION_FAILED` | field/reason allowlist로 요청 검토, provider 재호출 금지 |
| `QUOTA_EXCEEDED` | 사용 불가 안내, snapshot 보존, 자동 retry 금지 |
| `SERVICE_DISABLED` | 기능 비활성 안내, snapshot 보존 |
| `RATE_LIMITED` | `retry_after_seconds` 이전 자동 요청 금지 |
| `UPSTREAM_UNAVAILABLE`, `UPSTREAM_TIMEOUT` | 현재 job 상태 조회 우선, 새 job은 사용자 선택 |

알 수 없는 code, provider명, stack, raw body와 자유 형식 오류 문자열을 사용자에게
노출하지 않는다. decode 불가 응답은 콘텐츠를 기록하지 않는 고정 temporary failure로
처리한다.

### 7.3 원격 STT 비활성 fixture

`remote-stt-disabled.json`은 첫 출시에서 다음을 검증한다.

- resolver가 `AppleSpeechRecognitionService`만 선택
- 기기 내 STT 최종 실패 시 다시 녹음만 제공
- Backend remote upload 요청 0회
- Backend audio body read와 egress 0 byte
- provider config가 주입돼도 승인 없이는 deployment gate 실패
- 자동 fallback과 실패 STEP 생성 없음

fixture에 request/result schema가 있어도 remote STT endpoint 활성화를 뜻하지 않는다.
별도 제품·비용·개인정보·provider·QA 승인 전 iOS production code는 remote adapter를
등록하지 않는다.

### 7.4 Fixture 보안

공용 fixture의 레시피·STEP 문자열과 UUID는 합성 데이터다. 실제 사용자 콘텐츠,
Authorization 값, App Attest proof, access token, provider key, raw audio와 개인정보를
추가하지 않는다. `required_headers`에는 header 이름만 두며 값은 test harness가
별도의 합성 credential provider로 주입한다. `optional_headers`도 이름만 두고 실제
사용자·기기 식별값을 fixture에 기록하지 않는다.

Backend 기준 검증 명령:

```sh
sh apps/backend/tests/contracts/validate-shared-fixtures.sh
```

iOS 계약 테스트는 manifest의 모든 `ios_assertion`을 test case와 1:1로 연결해야 한다.
누락 case, 별도 복제 fixture와 민감정보 scanner 실패는 merge 차단 항목이다.
