# CookLog

CookLog는 요리 중 10초 음성 기록을 반복하면 앱이 STEP Preview를 쌓고, AI가 레시피로 정리해주며, 다음에는 오디오 가이드로 다시 요리할 수 있게 해주는 개인 레시피 저장소입니다.

이 저장소는 기획, 디자인, iOS/Android 개발 문서를 함께 관리하는 프로젝트 루트입니다.

## 문서 작성 기준

이 저장소의 모든 문서는 한글로 작성합니다.

- 파일명은 기존 버전 문서처럼 영문을 사용할 수 있습니다.
- 본문, README, 기획 문서, 디자인 설명, 개발 메모는 한글을 기본으로 합니다.
- 외부 API 이름, 코드 식별자, 명령어, 고유명사는 원문 표기를 유지할 수 있습니다.

## Git 운영 기준

Git 운영 기준은 [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md)를 따릅니다.

## 저장소 구조

```text
.
├── AGENTS.md
├── apps/
│   ├── ios/
│   │   ├── AGENTS.md
│   │   └── docs/
│   └── android/
│       ├── AGENTS.md
│       └── docs/
├── design/
│   ├── exports/
│   └── references/
├── docs/
│   ├── PROJECT_STATUS.md
│   ├── PROJECT_CHANGELOG.md
│   ├── PROJECT_DECISIONS.md
│   └── product/
```

## 디렉토리

### `apps/`

앱 프로젝트를 관리합니다.

- `apps/ios/`: iOS 앱 프로젝트
- `apps/android/`: Android 앱 프로젝트
- 각 앱 폴더의 `docs/`: 플랫폼별 개발 상태, 계획, 스펙, 결정, 변경 기록

필요하면 다음과 같은 앱 타겟을 추가할 수 있습니다.

- `apps/web/`
- `apps/admin/`
- `apps/backend/`

### `docs/`

프로젝트 문서를 관리합니다.

- `PROJECT_STATUS.md`: 전체 프로젝트 현재 상태
- `PROJECT_CHANGELOG.md`: 전체 프로젝트 변경 기록
- `PROJECT_DECISIONS.md`: 전체 프로젝트 결정사항
- `docs/product/`: 아이디어 문서, 사용자 플로우, 와이어프레임, MVP 명세, 제품 의사결정

### `design/`

디자인 레퍼런스, 내보낸 산출물, 핸드오프 파일을 관리합니다.

## 현재 문서

- [전체 프로젝트 상태](docs/PROJECT_STATUS.md)
- [전체 프로젝트 변경 기록](docs/PROJECT_CHANGELOG.md)
- [전체 프로젝트 결정사항](docs/PROJECT_DECISIONS.md)
- [CookLog 아이디어 v0.1](docs/product/CookLog_Idea_v0.1.md)
- [CookLog PRD v2](docs/product/CookLog_PRD_v2.md)
- [CookLog PRODUCT v2](docs/product/CookLog_PRODUCT.md)
- [CookLog MVP Scope v2](docs/product/CookLog_MVP_SCOPE.md)
- [CookLog USER FLOW v2](docs/product/CookLog_USER_FLOW.md)
- [CookLog WIREFRAME v2](docs/product/CookLog_WIREFRAME.md)
- [CookLog Roadmap v2](docs/product/CookLog_ROADMAP.md)
- [CookLog 수익화 운영 지침](docs/product/CookLog_MONETIZATION.md)
- [CookLog iOS 상태](apps/ios/docs/STATUS.md)
- [CookLog iOS 개발 계획](apps/ios/docs/DEVELOPMENT_PLAN.md)
- [CookLog Android 상태](apps/android/docs/STATUS.md)
