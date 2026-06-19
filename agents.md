# CookLog agents.md

이 문서는 CookLog 저장소의 최상위 인수인계 문서입니다. 현재 세션은 전체 서비스를 관리하는 에이전트이며, 실제 iOS 구현은 `apps/ios/` 안에서 별도 개발 에이전트 세션이 담당합니다.

## 현재 역할

### 루트 관리 에이전트

- 제품 방향, 문서 구조, 저장소 구조, 작업 분리를 관리합니다.
- 실제 앱 구현 코드는 직접 작성하지 않는 것을 기본으로 합니다.
- iOS, Android, 공통 패키지, 디자인, 문서 작업이 충돌하지 않도록 기준을 정리합니다.
- 하위 개발 에이전트가 추가 컨텍스트 없이 진행할 수 있도록 각 작업 영역의 `agents.md`를 유지합니다.

### iOS 개발 에이전트

- `apps/ios/` 안에서만 iOS 앱을 설계하고 구현합니다.
- iOS 개발 기준은 `apps/ios/agents.md`를 우선 따릅니다.
- 루트 제품 문서와 이 문서를 참고하되, 실제 구현 판단은 iOS 문서에 맞춰 진행합니다.

## 프로젝트 개요

CookLog는 사용자가 요리 중 또는 요리 후 남긴 짧은 기록을 AI가 레시피 형태로 정리하고, 나중에 오디오 가이드로 다시 요리할 수 있게 해주는 개인 레시피 저장소입니다.

핵심 가치는 AI 자체보다 기록에 있습니다. 사용자가 가장 쉽게 요리를 기록하고, 나중에 가장 쉽게 다시 요리할 수 있게 만드는 것이 목표입니다.

## 현재 제품 기준

현재 기준 문서는 `docs/product/`의 v1 문서입니다.

- `docs/product/CookLog_PRODUCT.md`
- `docs/product/CookLog_MVP_SCOPE.md`
- `docs/product/CookLog_USER_FLOW.md`
- `docs/product/CookLog_WIREFRAME.md`
- `docs/product/CookLog_ROADMAP.md`
- `docs/product/CookLog_Idea_v0.1.md`

iOS 개발 진행 기준 문서는 `docs/development/`에 둡니다.

- `docs/development/CookLog_iOS_Development_Environment.md`
- `docs/development/CookLog_iOS_Development_Plan.md`
- `docs/development/CookLog_iOS_Decision_Log.md`

기존 v0.1 MVP 상세 문서 일부는 현재 작업트리에서 삭제 상태이고, 새 v1 문서가 추가되어 있습니다. 사용자 변경사항으로 보고 임의로 되돌리지 않습니다.

## 제품 요약

### 한 줄 설명

요리 중 남긴 짧은 기록을 AI가 레시피로 정리해주고, 다음에는 오디오 가이드로 다시 요리할 수 있게 해주는 개인 레시피 저장소입니다.

### Core Value

- 요리 기록
- 개인 레시피 저장소
- 오디오 플레이어

### MVP 포함

- 10초 기록
- STT
- STEP 생성
- AI 정리
- 레시피 저장
- 저장된 레시피 목록, 검색, 상세 조회
- 오디오 플레이어
- 이전 단계, 재생/정지, 다음 단계, 다시 듣기

### MVP 제외

- 로그인
- 회원가입
- 공유
- 커뮤니티
- 좋아요
- 댓글
- 공개 레시피
- AI 채팅
- 블로그 Import
- 유튜브 Import
- 이미지 OCR
- 음성 명령

## 핵심 사용자 흐름

### 기록 흐름

Home -> 요리 기록 시작 -> 10초 기록 -> STEP 생성 -> AI 정리 -> 저장 -> 레시피 상세

### 다시 요리 흐름

Home -> 저장된 레시피 -> 오디오 가이드 시작

## MVP 화면

### Home

- 요리 기록 시작
- 최근 레시피
- 저장된 레시피 목록 진입

### Cooking Log

- 10초 기록
- STEP 리스트
- AI 정리하기

### AI Review

- 제목
- 재료
- 순서
- 시간
- 메모
- 저장

### Recipe Detail

- 레시피 정보 조회
- 오디오 가이드 시작

### Audio Player

- 이전
- 재생/정지
- 다음
- 다시 듣기
- 현재 단계 표시

## 저장소 구조

```text
.
├── agents.md
├── README.md
├── apps/
│   ├── ios/
│   │   └── agents.md
│   └── android/
├── design/
│   ├── exports/
│   └── references/
├── docs/
│   └── product/
├── packages/
│   └── shared/
└── tools/
```

## 디렉토리 역할

### `apps/`

앱 프로젝트를 둡니다.

- `apps/ios/`: iOS 앱 프로젝트와 iOS 개발 에이전트 문서
- `apps/android/`: Android 앱 프로젝트

### `docs/`

제품 문서와 의사결정 기록을 둡니다.

- `docs/product/`: 제품 아이디어, MVP 범위, 사용자 흐름, 와이어프레임, 로드맵

### `design/`

디자인 산출물을 둡니다.

- `design/references/`: 레퍼런스, 스크린샷, 영감 자료
- `design/exports/`: 내보낸 이미지, PDF, 핸드오프 파일

Figma 원본은 Figma에 두고, 저장소에는 필요한 산출물만 커밋합니다.

### `packages/`

앱 간 공유 가능한 코드를 둡니다.

- 도메인 모델
- 검증 로직
- AI 프롬프트 템플릿
- 공통 유틸리티

### `tools/`

개발 스크립트와 로컬 자동화 도구를 둡니다.

## 문서 작성 원칙

모든 문서는 한글로 작성합니다.

- README, 기획 문서, 디자인 문서, 개발 메모는 한글을 기본으로 합니다.
- 파일명은 필요하면 영문을 사용할 수 있습니다.
- 코드 식별자, API 이름, 명령어, 외부 서비스 고유명사는 원문 표기를 유지할 수 있습니다.
- 문서는 과하게 장식하지 않고, 다음 작업자가 바로 실행할 수 있게 구체적으로 작성합니다.

## Git 기준

- 원격 저장소: `https://github.com/cschoi724/CookLog.git`
- 기본 브랜치: `main`
- 작업 전 `git status -sb`로 상태를 확인합니다.
- 사용자 변경사항이 있으면 임의로 되돌리지 않습니다.
- 의미 있는 단위로 커밋합니다.
- 커밋 메시지는 한글 설명을 기본으로 하고, 영문 타입 prefix를 붙입니다.

예시:

- `docs: iOS 개발 에이전트 지침 추가`
- `feat: 레시피 저장 기능 추가`
- `fix: 오디오 플레이어 단계 이동 수정`
- `chore: 저장소 구조 정리`

## 하위 에이전트 운영 기준

하위 개발 세션을 시작할 때는 해당 폴더의 `agents.md`를 먼저 확인합니다.

- iOS 개발: `apps/ios/agents.md`
- Android 개발: 추후 `apps/android/agents.md` 생성
- 공통 패키지 개발: 추후 `packages/shared/agents.md` 생성

루트 관리 에이전트는 하위 에이전트가 필요한 배경 지식을 각 작업 폴더에 문서로 남겨야 합니다. 구두 설명에 의존하지 않습니다.

## 현재 우선순위

1. iOS 앱을 MVP 기준으로 먼저 개발합니다.
2. iOS 프로젝트 생성 후 로컬 저장 기반으로 핵심 흐름을 완성합니다.
3. AI 정리와 STT는 초기 구현에서 실제 API 연동 전 임시 어댑터 또는 명확한 인터페이스로 분리할 수 있습니다.
4. 저장소, 오디오 플레이어, 단계별 레시피 구조는 이후 Android와 공유 가능하도록 도메인 모델을 과하게 플랫폼에 묶지 않습니다.

## 의사결정 기준

- CookLog는 레시피 소비 앱이 아니라 개인 요리 기록 앱입니다.
- 첫 화면은 기록 시작과 저장된 레시피 재사용에 집중합니다.
- 사용자가 직접 정교한 레시피 폼을 작성하게 만들지 않습니다.
- MVP에서는 계정, 공유, 커뮤니티보다 로컬 개인 저장과 재사용 경험을 우선합니다.
- 오디오 가이드는 부가 기능이 아니라 다시 요리하는 핵심 경험입니다.

## 다음 작업자가 확인할 것

1. `git status -sb`로 현재 변경사항을 확인합니다.
2. `docs/product/`의 현재 v1 문서를 읽습니다.
3. iOS 작업이면 `apps/ios/agents.md`와 `docs/development/CookLog_iOS_Development_Plan.md`를 읽고 그 기준으로 프로젝트를 생성하거나 수정합니다.
4. 개발 진행 후 체크리스트, 최근 작업 로그, 열린 질문을 업데이트합니다.
5. 문서나 코드 변경 후 변경 범위를 요약하고, 가능하면 테스트 또는 빌드 확인 결과를 남깁니다.
