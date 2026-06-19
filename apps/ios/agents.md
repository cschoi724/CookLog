# CookLog iOS agents.md

이 문서는 `apps/ios/` 전담 개발 에이전트가 추가 컨텍스트 없이 CookLog iOS 앱을 개발하기 위한 기준입니다.

## 역할

이 폴더의 에이전트는 CookLog iOS 앱을 실제로 설계하고 구현합니다.

- 작업 범위는 기본적으로 `apps/ios/` 안으로 제한합니다.
- 루트 문서나 제품 문서를 수정해야 하면 변경 이유를 명확히 남깁니다.
- 루트 `agents.md`와 `docs/product/` 문서를 제품 기준으로 삼습니다.
- iOS 개발 환경과 기술 선택은 `docs/development/CookLog_iOS_Development_Environment.md`를 우선 참고합니다.
- 개발 진행 순서와 체크리스트는 `docs/development/CookLog_iOS_Development_Plan.md`를 계속 업데이트하며 따릅니다.
- 기술 결정이 생기면 `docs/development/CookLog_iOS_Decision_Log.md`에 기록합니다.
- 구현 중 제품 판단이 필요한 경우 현재 MVP 범위를 우선합니다.

## 제품 기준

CookLog는 개인 요리 기록 앱입니다. 사용자가 요리 중 또는 요리 후 남긴 짧은 기록을 AI가 레시피로 정리하고, 저장된 레시피를 오디오 가이드로 다시 재생할 수 있어야 합니다.

핵심 가치는 다음 세 가지입니다.

- 요리 기록
- 개인 레시피 저장소
- 오디오 플레이어

## MVP 포함 기능

- 10초 기록
- STT
- STEP 생성
- AI 정리
- 레시피 저장
- 레시피 목록
- 레시피 검색
- 레시피 상세 조회
- 단계별 오디오 플레이어
- 이전 단계, 재생/정지, 다음 단계, 다시 듣기

## MVP 제외 기능

- 로그인
- 회원가입
- 공유
- 커뮤니티
- 공개 레시피
- AI 채팅
- 블로그 Import
- 유튜브 Import
- 이미지 OCR
- 음성 명령

## 사용자 흐름

### 기록 흐름

Home -> 요리 기록 시작 -> 10초 기록 -> STEP 생성 -> AI 정리 -> 저장 -> 레시피 상세

### 다시 요리 흐름

Home -> 저장된 레시피 -> 오디오 가이드 시작

## 화면 기준

### Home

- 요리 기록 시작 버튼
- 최근 레시피
- 저장된 레시피 목록
- 검색 진입

### Cooking Log

- 음성 또는 텍스트 기록 입력
- 10초 기록 상태 표시
- 생성된 STEP 리스트
- AI 정리하기 버튼

### AI Review

- AI가 정리한 결과 확인
- 제목
- 재료
- 조리 순서
- 시간
- 메모
- 저장 버튼

### Recipe Detail

- 제목
- 재료
- 조리 순서
- 메모
- 오디오 가이드 시작 버튼

### Audio Player

- 현재 단계 표시
- 단계 본문 표시
- 이전 단계
- 재생/정지
- 다음 단계
- 다시 듣기

## 권장 iOS 구현 방향

프로젝트 생성 전이라면 SwiftUI 기반 iOS 앱으로 시작합니다.

- 언어: Swift
- UI: SwiftUI
- 아키텍처: 가벼운 MVVM
- 최소 OS 버전: 프로젝트 생성 시 최신 안정 Xcode 기준으로 과도하게 낮추지 않습니다.
- 저장소: 초기 MVP는 로컬 저장을 우선합니다.
- AI/STT/TTS: 실제 연동 전에도 교체 가능한 서비스 인터페이스로 분리합니다.

초기에는 네트워크나 계정 기능보다 앱 내부 흐름이 동작하는 것을 우선합니다.

자세한 개발 환경 기준은 `docs/development/CookLog_iOS_Development_Environment.md`를 따릅니다.

개발 진행 중에는 `docs/development/CookLog_iOS_Development_Plan.md`의 현재 이정표, 체크리스트, 최근 작업 로그를 업데이트합니다.

## 권장 모듈 구조

프로젝트가 생성되면 다음 구조를 우선 고려합니다.

```text
apps/ios/
├── agents.md
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

실제 Xcode 프로젝트 구조에 맞춰 조정할 수 있지만, 책임 분리는 유지합니다.

## 도메인 모델 초안

초기 구현에서 최소한 다음 개념을 분리합니다.

### Recipe

- id
- title
- ingredients
- steps
- memo
- createdAt
- updatedAt

### RecipeStep

- id
- order
- text
- durationSeconds
- note

### CookingLog

- id
- rawText
- createdAt

### AI 정리 결과

- title
- ingredients
- steps
- memo

## 서비스 인터페이스 기준

실제 API 연동 전에도 다음 서비스를 교체 가능하게 둡니다.

- `SpeechRecognitionService`: 음성 입력을 텍스트로 변환
- `RecipeAIService`: 원본 로그를 레시피 구조로 변환
- `RecipeStore`: 레시피 저장, 조회, 검색
- `AudioGuideService`: 단계별 안내 재생

초기 MVP에서는 Mock 또는 로컬 구현을 사용해도 됩니다.

## UI 기준

- 첫 화면은 기록 시작과 최근 레시피에 집중합니다.
- 사용자가 처음부터 복잡한 레시피 폼을 작성하게 만들지 않습니다.
- 저장 전 AI Review 화면에서 결과를 확인하고 수정할 수 있게 합니다.
- 오디오 플레이어는 현재 단계와 이동 컨트롤이 명확해야 합니다.
- 디자인은 조용하고 실용적인 개인 도구 톤을 우선합니다.

## 개발 절차

1. 작업 전 `git status -sb`를 확인합니다.
2. `docs/product/`와 이 파일을 읽고 현재 범위를 확인합니다.
3. iOS 프로젝트가 없다면 `apps/ios/` 안에 생성합니다.
4. 기능은 사용자 흐름 단위로 작게 구현합니다.
5. 빌드 또는 테스트를 실행하고 결과를 남깁니다.
6. 사용자 변경사항은 임의로 되돌리지 않습니다.

## Git 기준

- 커밋 메시지는 한글 설명을 기본으로 하고 영문 타입 prefix를 붙입니다.
- 예시: `feat: iOS 홈 화면 추가`
- 예시: `feat: 레시피 로컬 저장 구현`
- 예시: `fix: 오디오 플레이어 다음 단계 이동 수정`

## 주의사항

- MVP에서 로그인이나 서버 저장을 먼저 만들지 않습니다.
- 공유, 커뮤니티, Import 기능은 만들지 않습니다.
- 실제 AI, STT, TTS API 키를 저장소에 커밋하지 않습니다.
- 임시 Mock 데이터는 개발용임을 코드나 문서에서 명확히 구분합니다.
- 제품 핵심은 "AI 생성"보다 "기록하고 다시 요리하는 경험"입니다.
