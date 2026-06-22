# CookLog Project Decisions

이 문서는 플랫폼 공통 제품 및 저장소 운영 결정사항을 관리합니다. 플랫폼별 기술 결정은 각 앱 폴더의 `docs/DECISIONS.md`에 기록합니다.

## 2026-06-22 - PRD v2를 제품 기준으로 사용

- 상태: 확정
- 결정: CookLog의 현재 제품 기준은 `docs/product/CookLog_PRD_v2.md`와 `docs/product/CookLog PRD v2.pdf`입니다.
- 이유: 10초 음성 기록, STEP Preview, A-Lite Strategy, AI Review 시점이 명확하게 정의되었습니다.
- 영향: 모든 플랫폼 개발 문서는 PRD v2를 기준으로 작성하고 갱신합니다.

## 2026-06-22 - 제품 문서와 플랫폼 개발 문서를 분리

- 상태: 확정
- 결정: 공통 제품 문서는 `docs/product/`에 두고, 플랫폼별 개발 문서는 `apps/{platform}/docs/`에 둡니다.
- 이유: iOS와 Android 개발 에이전트를 별도 세션으로 운영할 예정이므로 각 플랫폼 작업 맥락을 독립적으로 유지해야 합니다.
- 영향: iOS 개발 세션은 `apps/ios/`, Android 개발 세션은 `apps/android/`를 기본 작업 범위로 삼습니다.

## 2026-06-22 - 전체 상태 문서는 루트 docs에서 관리

- 상태: 확정
- 결정: 전체 프로젝트 상태, 변경 기록, 공통 결정사항은 `docs/PROJECT_STATUS.md`, `docs/PROJECT_CHANGELOG.md`, `docs/PROJECT_DECISIONS.md`에서 관리합니다.
- 이유: 루트 관리 에이전트가 플랫폼별 개발 상황을 한눈에 파악하고 다음 작업을 배정할 수 있어야 합니다.
- 영향: 플랫폼별 상세 진행은 각 앱 폴더에 두되, 전체 요약은 루트 문서에 반영합니다.

## 2026-06-22 - `packages/`와 `tools/`는 초기 구조에서 제거

- 상태: 확정
- 결정: 현재 실사용 코드나 스크립트가 없는 `packages/`와 `tools/` 추적 파일을 제거합니다.
- 이유: iOS MVP 착수 전에는 빈 디렉토리가 다음 개발 에이전트에게 불필요한 맥락을 줄 수 있습니다.
- 영향: 공통 코드나 자동화 스크립트가 필요해지는 시점에 다시 생성합니다.
