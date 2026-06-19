# CookLog

CookLog는 요리 중 남긴 짧은 기록을 AI가 레시피로 정리해주고, 다음에는 오디오 가이드로 다시 요리할 수 있게 해주는 개인 레시피 저장소입니다.

이 저장소는 기획, 디자인, iOS/Android 개발, 공통 패키지, 개발 도구를 모두 담는 프로젝트 루트입니다.

## 문서 작성 기준

이 저장소의 모든 문서는 한글로 작성합니다.

- 파일명은 기존 버전 문서처럼 영문을 사용할 수 있습니다.
- 본문, README, 기획 문서, 디자인 설명, 개발 메모는 한글을 기본으로 합니다.
- 외부 API 이름, 코드 식별자, 명령어, 고유명사는 원문 표기를 유지할 수 있습니다.

## 저장소 구조

```text
.
├── apps/
│   ├── ios/
│   └── android/
├── design/
├── docs/
│   └── product/
├── packages/
│   └── shared/
└── tools/
```

## 디렉토리

### `apps/`

앱 프로젝트를 관리합니다.

- `apps/ios/`: iOS 앱 프로젝트
- `apps/android/`: Android 앱 프로젝트

필요하면 다음과 같은 앱 타겟을 추가할 수 있습니다.

- `apps/web/`
- `apps/admin/`
- `apps/backend/`

### `docs/`

프로젝트 문서를 관리합니다.

- `docs/product/`: 아이디어 문서, 사용자 플로우, 와이어프레임, MVP 명세, 제품 의사결정

### `design/`

디자인 레퍼런스, 내보낸 산출물, 핸드오프 파일을 관리합니다.

### `packages/`

공통 코드 또는 재사용 가능한 모듈을 관리합니다.

- `packages/shared/`: 공통 모델, 검증 로직, AI 프롬프트, 크로스 플랫폼 비즈니스 로직

### `tools/`

개발 스크립트와 로컬 자동화 도구를 관리합니다.

## 현재 문서

- [CookLog 아이디어 v0.1](docs/product/CookLog_Idea_v0.1.md)
- [CookLog MVP 기획 초안 v0.1](docs/product/CookLog_MVP_Spec_v0.1.md)
