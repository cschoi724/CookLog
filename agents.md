# agents.md

이 문서는 다른 Codex/AI 세션이 CookLog 저장소의 현재 맥락과 작업 기준을 빠르게 파악하기 위한 인수인계 문서입니다.

## 프로젝트 개요

CookLog는 사용자가 요리 중 또는 요리 후 남긴 짧은 기록을 AI가 레시피 형태로 정리하고, 나중에 오디오 가이드로 다시 요리할 수 있게 해주는 개인 레시피 저장소입니다.

핵심 가치는 "AI" 자체보다 "기록"에 있습니다. 사용자가 가장 쉽게 요리를 기록하고, 나중에 가장 쉽게 다시 요리할 수 있게 만드는 것이 목표입니다.

## 현재 저장소 목적

이 폴더는 CookLog의 레포 루트입니다.

이 안에서 다음 작업을 모두 진행합니다.

- 기획
- 디자인
- iOS 개발
- Android 개발
- 추후 추가 앱 또는 백엔드 개발
- 공통 패키지와 개발 도구 관리

## 문서 작성 원칙

모든 문서는 한글로 작성합니다.

- README, 기획 문서, 디자인 문서, 개발 메모는 한글을 기본으로 합니다.
- 파일명은 필요하면 영문을 사용할 수 있습니다.
- 코드 식별자, API 이름, 명령어, 외부 서비스 고유명사는 원문 표기를 유지할 수 있습니다.
- 문서는 과하게 장식하지 않고, 다음 작업자가 바로 실행할 수 있게 구체적으로 작성합니다.

## 저장소 구조

```text
.
├── agents.md
├── README.md
├── apps/
│   ├── ios/
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

- `apps/ios/`: iOS 앱 프로젝트
- `apps/android/`: Android 앱 프로젝트

추후 필요하면 `apps/web/`, `apps/admin/`, `apps/backend/` 같은 타겟을 추가할 수 있습니다.

### `docs/`

문서 산출물을 둡니다.

- `docs/product/`: 제품 아이디어, 사용자 플로우, 와이어프레임, MVP 상세 명세, 제품 의사결정

현재 주요 문서:

- `docs/product/CookLog_Idea_v0.1.md`
- `docs/product/CookLog_MVP_Spec_v0.1.md`

### `design/`

디자인 산출물을 둡니다.

- `design/references/`: 레퍼런스, 스크린샷, 영감 자료
- `design/exports/`: 내보낸 이미지, PDF, 핸드오프 파일

Figma 원본은 Figma에 두고, 저장소에는 필요한 산출물만 커밋합니다.

### `packages/`

앱 간 공유 가능한 코드를 둡니다.

예시:

- 도메인 모델
- 검증 로직
- AI 프롬프트 템플릿
- 공통 유틸리티

### `tools/`

개발 스크립트와 로컬 자동화 도구를 둡니다.

## Git 기준

- 원격 저장소: `https://github.com/cschoi724/CookLog.git`
- 기본 브랜치: `main`
- 의미 있는 단위로 커밋합니다.
- 변경 후 가능하면 원격에 푸시합니다.
- 작업 전 `git status -sb`로 상태를 확인합니다.
- 사용자 변경사항이 있으면 임의로 되돌리지 않습니다.

## 현재까지의 주요 커밋

- `bd68d55 Initial CookLog planning docs`
- `36d0c40 Organize repository structure`
- `430747b Add repository gitignore`
- `e414ed8 Add design workspace`

## 현재 제품 범위

MVP 포함 기능:

- 텍스트 기반 요리 로그 입력
- AI 기반 레시피 자동 정리
- 레시피 저장소
- 목록, 검색, 상세 조회
- 단계별 오디오 플레이어
- 재생, 정지, 이전 단계, 다음 단계, 다시 듣기

MVP 제외 기능:

- 회원가입
- 로그인
- 커뮤니티
- 좋아요
- 댓글
- 공개 레시피
- 레시피 공유
- AI 채팅
- 음성 명령
- 블로그 Import
- 유튜브 Import
- 이미지 OCR

## 작업 시 주의사항

- 이 저장소는 아직 초기 기획 단계입니다.
- iOS/Android 프로젝트는 아직 실제로 생성되지 않았고 자리만 있습니다.
- `.gitignore`는 iOS, Android, 디자인 임시 파일, 환경 변수, 빌드 산출물 기준으로 작성되어 있습니다.
- 디자인 원본 파일보다 지속적으로 필요한 내보내기 산출물을 커밋하는 방향입니다.
- 새 문서를 만들 때는 적절한 하위 디렉토리에 두고, 루트에는 프로젝트 전체 안내 문서만 둡니다.
