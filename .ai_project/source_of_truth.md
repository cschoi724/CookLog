# Source Of Truth

작성일: 2026-07-01  
프로젝트: CookLog  
상태: Draft

## 1. 목적

이 문서는 CookLog에서 어떤 문서와 코드가 최종 기준인지 정의합니다.

`.ai/`는 Agent 운영 가이드북이고, `.ai_project/`는 Agent 협업 상태입니다. 실제 제품, 기술 스택, 구현 계획, 아키텍처, QA 기준은 기존 CookLog 문서 영역을 기준으로 관리합니다.

## 2. 프로젝트 프로필

| 항목 | 값 |
|---|---|
| 제품/서비스명 | CookLog |
| 개발 대상 | iOS 우선, Android 대기 |
| 주 기술스택 | SwiftUI, SwiftData, iOS 17+, Android 추후 결정 |
| 저장소 | `https://github.com/cschoi724/CookLog.git` |
| 기본 브랜치 | `main` |
| 배포 대상 | iOS MVP 우선, Android 후속 |

## 3. Source Of Truth 매트릭스

| 영역 | 최종 기준 | 보조 기준 | 충돌 시 처리 |
|---|---|---|---|
| Agent 운영 원칙 | `.ai/` | `.ai_project/` | 운영 원칙은 `.ai/` 우선 |
| Agent 구성 | `.ai_project/agent_registry.md` | `.ai/agent_registry.md` | 프로젝트 활성 구성은 `.ai_project/` 우선 |
| Agent 실행 Task | `.ai_project/tasks/` | `.ai_project/task_board.md`, report/QA 문서 | Task 파일 우선 |
| Agent 작업 상태 요약 | `.ai_project/task_board.md` | `.ai_project/tasks/` | 충돌 시 Task 파일 기준으로 보드 갱신 |
| 제품 기준 | `docs/product/CookLog_PRD_v2.md` | `docs/product/CookLog PRD v2.pdf`, `docs/product/CookLog_PRODUCT.md`, `agents.md` | PRD v2와 사용자 최신 결정 우선 |
| MVP 범위 | `docs/product/CookLog_MVP_SCOPE.md` | `docs/product/CookLog_PRD_v2.md`, `agents.md` | PRD v2와 MVP Scope를 함께 확인 |
| 사용자 흐름 | `docs/product/CookLog_USER_FLOW.md` | `agents.md`, 플랫폼별 `agents.md` | PRD v2와 User Flow 우선 |
| 와이어프레임 | `docs/product/CookLog_WIREFRAME.md` | 디자인 산출물 | 최신 승인 산출물 우선 |
| 로드맵 | `docs/product/CookLog_ROADMAP.md` | `docs/PROJECT_STATUS.md` | PM Agent가 사용자 확인 후 정리 |
| 전체 현재 상태 | `docs/PROJECT_STATUS.md` | 플랫폼별 `apps/*/docs/STATUS.md` | 플랫폼 문서가 더 최신이면 PM Agent가 루트 상태 갱신 필요 |
| 전체 결정사항 | `docs/PROJECT_DECISIONS.md` | 플랫폼별 `DECISIONS.md` | 공통 결정은 루트, 플랫폼 결정은 플랫폼 문서 우선 |
| 전체 변경 이력 | `docs/PROJECT_CHANGELOG.md` | 플랫폼별 `CHANGELOG.md`, Git commit | 누락 시 PM Agent가 갱신 |
| Git 운영 | `docs/GIT_WORKFLOW.md` | `.ai/commit_policy.md` | CookLog 저장소 운영은 `docs/GIT_WORKFLOW.md` 우선, Agent 승인 원칙은 `.ai/commit_policy.md` 확인 |
| iOS 세션 기준 | `apps/ios/agents.md` | 루트 `agents.md` | iOS 구현 판단은 iOS 문서 우선 |
| iOS 현재 상태 | `apps/ios/docs/STATUS.md` | `apps/ios/docs/CHANGELOG.md`, 코드 상태 | 코드/검증 결과 확인 후 갱신 |
| iOS 구현 계획 | `apps/ios/docs/DEVELOPMENT_PLAN.md` | `apps/ios/docs/STATUS.md` | 계획 변경은 PM Agent 또는 iOS Development Agent가 문서화 |
| iOS 기술 스펙 | `apps/ios/docs/DEVELOPMENT_SPEC.md` | `apps/ios/docs/ARCHITECTURE.md`, `DATA_MODEL.md`, `PERSISTENCE.md`, `NAVIGATION.md`, `SERVICES.md`, `TESTING.md` | 세부 영역 문서와 실제 코드 모두 확인 |
| iOS QA 기준 | `apps/ios/docs/MANUAL_QA_CHECKLIST.md` | `apps/ios/docs/TESTING.md`, `.ai_project/qa/` | QA Agent가 리스크 분류 |
| Android 세션 기준 | `apps/android/agents.md` | 루트 `agents.md` | Android 착수 전 Android 문서 우선 |
| Android 현재 상태 | `apps/android/docs/STATUS.md` | Android 개발 문서 | Android는 iOS MVP 안정화 후 착수 |

## 4. 프로젝트 문서 위치

현재 CookLog 기준 문서 위치:

```text
docs/
docs/product/
apps/ios/docs/
apps/android/docs/
```

## 5. 빌드/검증 기준

| 목적 | 명령 또는 절차 | 실행 주체 |
|---|---|---|
| iOS 빌드 | `apps/ios/`에서 `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build` | Development Agent |
| iOS 테스트 빌드 | `apps/ios/`에서 `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing` | Development Agent |
| iOS 테스트 | `apps/ios/`에서 `xcodebuild test` 실행. 현재 로컬 XCTest runner 대기 이슈가 있어 별도 확인 필요 | Development Agent / QA Agent |
| iOS 수동 QA | `apps/ios/docs/MANUAL_QA_CHECKLIST.md` 기준 | QA Agent |
| Android 검증 | Android 착수 후 확정 | Development Agent / QA Agent |

## 6. 충돌 해결 원칙

1. 사용자 승인 결정이 최우선입니다.
2. 실제 코드 동작과 문서가 다르면 코드와 검증 결과를 먼저 확인합니다.
3. 문서가 오래되었으면 PM Agent가 갱신 필요성을 보고합니다.
4. Agent 운영 문서와 프로젝트 기술 문서가 충돌하면 영역을 분리해 해석합니다.
5. 충돌 해결 후 관련 Task 파일과 `.ai_project/task_board.md`를 갱신합니다.

## 7. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | Source Of Truth 문서 초기화 |
