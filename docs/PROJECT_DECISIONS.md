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

## 2026-07-28 - Task branch와 Pull Request를 공식 Git 전략으로 사용

- 상태: 일부 대체됨
- 결정: CookLog의 모든 코드, 설정, 디자인 산출물과 추적 문서 변경은 `task/<task-id>-<slug>` 브랜치와 Pull Request를 거칩니다. `main` 직접 push는 금지하고, squash merge와 브랜치 삭제를 사용합니다.
- CI: 초기 required check는 `ios-build`로 시작합니다. `ios-xctest`는 `T-20260728-004`의 XCTest 안정화와 `T-20260728-008`의 CI 구축 후 Product Owner 승인으로 승격합니다.
- 승인 경계: push와 merge는 Product Owner 승인 후 수행합니다. 예외는 명시적 사전 승인과 사유 기록이 필요합니다.
- 이유: 멀티팀 병렬 작업에서 변경 범위와 검증 근거를 분리하고, 사용자 변경 및 다른 Task와의 충돌을 방지하기 위해서입니다.
- 영향: `docs/GIT_WORKFLOW.md`가 실제 절차를, `.ai_project/branch_pr_strategy.md`가 전략 선택값을 관리합니다. 2026-06-22의 `main` 직접 작업 결정은 이 결정으로 대체됩니다.
- 대체 범위: Task branch와 PR 필수 원칙은 유지하되, Task 기준 브랜치와 PR 대상을 `main`에서 `develop`로 변경하는 아래 결정이 브랜치 라우팅을 대체합니다.

## 2026-07-28 - develop 통합과 main 안정·릴리즈 브랜치 분리

- 상태: 확정
- 결정: 일반 Task는 최신 `develop`에서 분기하고 `develop` 대상 PR로 병합합니다. `main`은 통합 검증을 통과한 릴리즈 가능한 상태만 유지하며 `develop -> main` 승격 PR 또는 승인된 `hotfix/*` PR만 받습니다.
- 완료 경계: 팀별 하위 Task는 독립 검증과 `develop` 병합 후 Team Lead가 완료합니다. 상위 제품 Task와 릴리즈 목표는 필수 하위 Task 완료, cross-team 통합 QA, Product Lead 수용 검토와 Product Owner의 `main` 승격 승인을 거칩니다.
- hotfix: `main`에서 생성해 `main`에 병합하고 동일 변경을 `develop`에 즉시 backport합니다.
- 보호 원칙: `main`과 `develop` 직접 commit, push, force push를 금지합니다.
- 이유: 디자인·iOS·Backend와 문서 Task를 병렬 운영하면서도 불완전한 통합 상태가 `main`에 바로 유입되지 않도록 하기 위해서입니다.
- 영향: GitHub 기본 작업 브랜치와 신규 세션 기준은 `develop`이며 `main`은 안정·릴리즈 기준입니다.

## 2026-06-22 - 1인 개발 기준 Git 운영은 main 중심으로 단순화

- 상태: 대체됨
- 결정: Git 운영 기준은 `docs/GIT_WORKFLOW.md`에서 단일 관리합니다. 현재 기준은 `main` 직접 작업 중심이며, 큰 실험이나 파일 변화가 큰 작업만 `work/...` 임시 브랜치를 사용합니다.
- 이유: 현재는 1인 개발이며 브랜치를 세세하게 나누는 비용보다 작은 커밋과 자주 push하는 운영이 더 적합합니다.
- 영향: Git 전략이 바뀌면 `docs/GIT_WORKFLOW.md`를 우선 수정하고, 다른 문서는 해당 문서를 참조합니다.
- 대체 결정: `2026-07-28 - Task branch와 Pull Request를 공식 Git 전략으로 사용`
