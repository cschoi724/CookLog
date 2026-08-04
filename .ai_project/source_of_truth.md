# Source Of Truth

작성일: 2026-07-01
프로젝트: CookLog
상태: Active

## 1. 목적

이 문서는 CookLog에서 어떤 문서와 코드가 최종 기준인지 정의합니다.

`.ai/`는 Agent 운영 가이드북이고, `.ai_project/`는 Agent 협업 상태입니다. 실제 제품, 기술 스택, 구현 계획, 아키텍처, QA 기준은 기존 CookLog 문서 영역을 기준으로 관리합니다.

## 2. 프로젝트 프로필

| 항목 | 값 |
|---|---|
| 제품/서비스명 | CookLog |
| 개발 대상 | iOS 우선, Backend foundation, Android deferred |
| 주 기술스택 | SwiftUI, SwiftData, iOS 17+, Backend/Android 추후 결정 |
| 저장소 | `https://github.com/cschoi724/CookLog.git` |
| 기본 작업 브랜치 | `develop` |
| 안정·릴리즈 브랜치 | `main` |
| 배포 대상 | iOS 실서비스 우선, Backend 연동 후속, Android 보류 |

## 3. Source Of Truth 매트릭스

| 영역 | 최종 기준 | 보조 기준 | 충돌 시 처리 |
|---|---|---|---|
| Agent 운영 원칙 | `.ai/` | `.ai_project/` | 운영 원칙은 `.ai/` 우선 |
| 프로젝트 운영 구성 | `.ai_project/operating_model.md` | `.ai/bootstrap/project_bootstrap_policy.md` | CookLog 선택값은 `operating_model.md` 우선 |
| Agent 구성 | `.ai_project/agent_registry.md` | `.ai/models/agent_registry.md`, `.ai/models/role_model.md` | 프로젝트 활성 구성은 `.ai_project/` 우선 |
| Agent 실행 Task | 최신 `origin/develop`의 `.ai_project/tasks/` | 로컬 Task 브랜치의 Task 파일, report/QA 문서 | 공용 판단은 최신 `origin/develop`의 Task 파일 우선. 로컬 파일은 해당 브랜치의 실행 스냅샷 |
| Agent 작업 상태 요약 | 최신 `origin/develop`의 `.ai_project/task_board.md` | 최신 `origin/develop`의 `.ai_project/tasks/` | 충돌 시 최신 `origin/develop`의 Task 파일 기준으로 보드 갱신 |
| 제품 방향 요약 | `docs/product/CookLog_PRODUCT.md` | `agents.md` | 상세 동작 충돌 시 PRD v2 우선 |
| 제품 기준 | `docs/product/CookLog_PRD_v2.md` | `docs/product/CookLog_PRODUCT.md`, `agents.md` | PRD v2와 사용자 최신 결정 우선. `CookLog PRD v2.pdf`는 2026-06-22 역사적 스냅샷 |
| MVP 범위 | `docs/product/CookLog_MVP_SCOPE.md` | `docs/product/CookLog_PRD_v2.md`, `agents.md` | PRD v2와 MVP Scope를 함께 확인 |
| 사용자 흐름 | `docs/product/CookLog_USER_FLOW.md` | `agents.md`, 플랫폼별 `agents.md` | PRD v2와 User Flow 우선 |
| 와이어프레임 | `docs/product/CookLog_WIREFRAME.md` | 디자인 산출물 | 최신 승인 산출물 우선 |
| UI/UX 원본 | `design/prototype/` | `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`, `design/figma-build/manifest.json` | Product Owner가 승인한 로컬 Prototype과 Manifest 우선 |
| Figma 미러 | [CookLog — MVP UI/UX v1](https://www.figma.com/design/tAvYn6TatLKb3SXDjkH1hn) | `design/figma-build/` | 버전 스냅샷·형상 보존용이며 충돌 시 로컬 UI/UX 원본 우선 |
| 출시 Roadmap | `docs/product/CookLog_ROADMAP.md` | `docs/PROJECT_STATUS.md`, `.ai_project/task_board.md` | Roadmap은 단계·의존성, Task 파일은 실행 상태를 담당 |
| 전체 현재 상태 | `docs/PROJECT_STATUS.md` | 플랫폼별 `apps/*/docs/STATUS.md` | 플랫폼 문서가 더 최신이면 PM Agent가 루트 상태 갱신 필요 |
| 전체 결정사항 | `docs/PROJECT_DECISIONS.md` | 플랫폼별 `DECISIONS.md` | 공통 결정은 루트, 플랫폼 결정은 플랫폼 문서 우선 |
| 전체 변경 이력 | `docs/PROJECT_CHANGELOG.md` | 플랫폼별 `CHANGELOG.md`, Git commit | 누락 시 PM Agent가 갱신 |
| Branch / PR 운영 | `.ai_project/branch_pr_strategy.md` | `docs/GIT_WORKFLOW.md`, `.ai/policies/branch_pr_policy.md` | 전략 선택값은 `.ai_project/branch_pr_strategy.md`, 실제 작업 절차는 `docs/GIT_WORKFLOW.md`를 따르며 두 문서는 일치해야 함 |
| iOS 세션 기준 | `apps/ios/agents.md` | 루트 `agents.md` | iOS 구현 판단은 iOS 문서 우선 |
| iOS 현재 상태 | `apps/ios/docs/STATUS.md` | `apps/ios/docs/CHANGELOG.md`, 코드 상태 | 코드/검증 결과 확인 후 갱신 |
| iOS 구현 계획 | `apps/ios/docs/DEVELOPMENT_PLAN.md` | `apps/ios/docs/STATUS.md` | 계획 변경은 Product Lead Agent 또는 iOS Agent가 문서화 |
| iOS 기술 스펙 | `apps/ios/docs/DEVELOPMENT_SPEC.md` | `apps/ios/docs/ARCHITECTURE.md`, `DATA_MODEL.md`, `PERSISTENCE.md`, `NAVIGATION.md`, `SERVICES.md`, `TESTING.md` | 세부 영역 문서와 실제 코드 모두 확인 |
| iOS QA 기준 | `apps/ios/docs/MANUAL_QA_CHECKLIST.md` | `apps/ios/docs/TESTING.md`, `.ai_project/qa/` | iOS QA Agent가 리스크 분류 |
| Backend 세션 기준 | `apps/backend/agents.md` | 루트 `agents.md` | Backend 구현·검증은 승인 Task와 확정 계약을 우선 |
| Backend 현재 상태 | `apps/backend/docs/STATUS.md` | `apps/backend/docs/CHANGELOG.md` | 공용 `origin/develop`과 실행 Task 상태를 함께 확인 |
| Backend 구현 계획·스펙 | `apps/backend/docs/DEVELOPMENT_PLAN.md`, `apps/backend/docs/DEVELOPMENT_SPEC.md` | `apps/backend/docs/DECISIONS.md` | Foundation과 실제 provider·배포 범위를 분리 |
| Backend 런타임·AI provider 추천안 | `apps/backend/docs/ARCHITECTURE_DECISION.md` | T-20260729-020 report·QA | Task 완료와 최종 provider 선택을 구분하며 실제 계약·배포 전 Product Owner 승인 필요 |
| Backend 공통 API 계약 | `apps/backend/docs/API_CONTRACT.md`, `apps/backend/contracts/common/` | T-20260729-021 report·QA | T-021 완료 상태와 후속 job·보안·fixture 계약을 함께 확인 |
| 기본 비활성 원격 STT adapter 계약 | `apps/backend/docs/REMOTE_STT_ADAPTER.md`, `apps/backend/contracts/stt/` | T-20260729-022 report·QA | 첫 출시 기본 비활성·자동 fallback 없음, 활성화는 별도 제품 승인 |
| Android 세션 기준 | `apps/android/agents.md` | 루트 `agents.md` | Android 착수 전 Android 문서 우선 |
| Android 현재 상태 | `apps/android/docs/STATUS.md` | Android 개발 문서 | Android는 iOS MVP 안정화 후 착수 |
| AI Knowledge | `.ai_knowledge/` | 이 Source Of Truth 매트릭스 | Wiki는 원본이 아니며 충돌 시 이 문서의 원본 우선 |

## 4. 공용 상태와 로컬 실행 상태

프로젝트의 공용 현재 상태는 fetch를 마친 최신 `origin/develop`만 기준으로 합니다.

```bash
git fetch origin develop
git rev-parse --short origin/develop
```

- 모든 상태 보고에는 확인한 `origin/develop` SHA를 `public_source`로 기록합니다.
- 루트 WIP, 로컬 `develop`, Task worktree의 문서는 각 브랜치 시점의 스냅샷이며 공용 현재 상태가 아닙니다.
- 다른 Task의 착수·의존성·차단 해제를 판단할 때는 worktree 파일을 직접 읽지 않고 다음처럼 확인합니다.

```bash
git show origin/develop:.ai_project/task_board.md
git show origin/develop:<TASK_FILE>
```

- PR 병합 전 로컬 Task의 `done`은 로컬 완료 후보일 뿐 공용 완료가 아닙니다.
- `approved`, `depends_on`·`blocks` 변경, `rework_requested`, 최종 `done`, 후속 Task 차단 해제는 `develop` 병합 후에만 다른 Agent의 공용 판단 근거가 됩니다.
- `in_progress`, 로컬 검증 진행 상태는 다른 Task의 의존성을 해제하지 않습니다.
- fetch에 실패하거나 최신 SHA를 확인하지 못하면 `PUBLIC_STATE_UNVERIFIED`로 보고하고, 다른 Task의 착수·의존성·완료 판단을 중단합니다.

## 5. 프로젝트 문서 위치

현재 CookLog 기준 문서 위치:

```text
docs/
docs/product/
apps/ios/docs/
apps/android/docs/
.ai_project/
.ai_knowledge/  # 온보딩용, source of truth 아님
```

## 6. 빌드/검증 기준

| 목적 | 명령 또는 절차 | 실행 주체 |
|---|---|---|
| iOS 빌드 | `apps/ios/`에서 `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build` | iOS Agent |
| iOS 테스트 빌드 | `apps/ios/`에서 `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing` | iOS Agent |
| iOS 테스트 | `apps/ios/Scripts/run-xctest.sh`와 `.github/workflows/ios-xctest.yml`; 단일 worker·timeout·로그·xcresult 기준 | iOS Agent / iOS QA Agent |
| iOS 수동 QA | `apps/ios/docs/MANUAL_QA_CHECKLIST.md` 기준 | iOS QA Agent |
| Backend 공통 계약 검증 | `apps/backend/contracts/common/validate-contracts.sh`, T-20260729-021 report·QA | Backend Agent / Backend QA Agent |
| 원격 STT adapter 계약 검증 | `apps/backend/contracts/stt/validate-contracts.sh`, T-20260729-022 report·QA | Backend Agent / Backend QA Agent |
| Backend 후속 계약 검증 | T-20260729-023~025의 job·보안·fixture 계약과 runtime renderer·validator 동일성 | Backend Agent / Backend QA Agent |
| Backend Foundation 검증 | `apps/backend/docs/DEVELOPMENT_PLAN.md`, T-20260804-002~007 runtime test·QA | Backend Agent / Backend QA Agent |
| Android 검증 | Android 착수 후 확정 | Android 착수 후 Execution/Verification Agent 확정 |

## 7. 충돌 해결 원칙

1. 사용자 승인 결정이 최우선입니다.
2. 실제 코드 동작과 문서가 다르면 코드와 검증 결과를 먼저 확인합니다.
3. 문서가 오래되었으면 PM Agent가 갱신 필요성을 보고합니다.
4. Agent 운영 문서와 프로젝트 기술 문서가 충돌하면 영역을 분리해 해석합니다.
5. 충돌 해결 후 관련 Task 파일과 `.ai_project/task_board.md`를 갱신합니다.

## 8. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | Source Of Truth 문서 초기화 |
| 2026-07-27 | 멀티팀 운영, Branch/PR, Backend/Figma 미확정 기준과 Knowledge 경계 추가 |
| 2026-07-28 | 멀티팀 역할 조정에 맞춰 iOS·Backend 실행/검증 담당을 도메인 Agent로 명시하고 Android 담당은 착수 시점에 확정하도록 변경 |
| 2026-07-28 | `T-20260728-007`에 따라 Branch/PR 전략과 실제 Git 절차의 충돌을 해소하고 문서 책임 경계 확정 |
| 2026-07-28 | `T-20260728-019`에 따라 기본 작업 브랜치를 `develop`, 안정·릴리즈 브랜치를 `main`으로 분리 |
| 2026-07-28 | CookLog MVP UI/UX v1 Figma 작업 파일 생성과 링크 등록 |
| 2026-07-28 | Product Owner 결정으로 `design/prototype/`을 공식 UI Source of Truth, Figma를 점진적 미러로 전환 |
| 2026-07-29 | Product Charter와 첫 공개 출시 Roadmap 역할, Backend 계약 확정 Task를 Source of Truth 매트릭스에 반영 |
| 2026-07-31 | PDF를 역사적 스냅샷으로 명시하고 Backend 추천안·API 계약 경계와 iOS CI 검증 기준을 최신화 |
| 2026-07-31 | T-20260731-001 재작업에서 Backend 계약 검증 script·후속 계약 경계와 Product QA 운영 정합성 반영 |
| 2026-07-31 | T-20260731-002에서 다중 worktree 공용 상태를 최신 `origin/develop`로 고정하고 로컬 실행 상태와 의존성 판단 경계를 명시 |
| 2026-08-04 | T-20260728-006 scope에서 Backend 세션·상태·계획·스펙과 Foundation 검증 경계를 등록 |
