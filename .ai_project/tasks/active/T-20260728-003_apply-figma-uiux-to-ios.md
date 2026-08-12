---
schema: aiops.task.v1
id: T-20260728-003
title: 확정 제품 UX·디자인과 iOS 로컬 상태 모델 적용
status: scoped
type: feature
priority: P0
priority_reason: 첫 공개 출시의 모든 iOS 화면과 로컬 데이터 생명주기를 실제 서비스 연동 전에 확정해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities:
  - technical_planning
  - dependency_management
depends_on:
  - T-20260729-002
  - T-20260805-001
  - T-20260805-002
  - T-20260805-003
  - T-20260805-004
  - T-20260805-005
  - T-20260805-006
  - T-20260805-007
  - T-20260805-008
  - T-20260812-001
child_tasks:
  - T-20260805-002
  - T-20260805-003
  - T-20260805-004
  - T-20260805-005
  - T-20260805-006
  - T-20260805-007
  - T-20260805-008
  - T-20260812-003
  - T-20260812-001
blocks:
  - T-20260729-004
  - T-20260729-005
  - T-20260729-006
  - T-20260728-009
parallel_group:
allowed_paths:
  - apps/ios/
  - design/exports/
  - docs/PROJECT_STATUS.md
  - docs/PROJECT_CHANGELOG.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - .ai_project/source_of_truth.md
  - apps/ios/AGENTS.md
  - apps/ios/docs/ARCHITECTURE.md
  - apps/ios/docs/STATUS.md
  - docs/product/CookLog_FIGMA_DELIVERY_FLOW.md
  - .ai_project/tasks/backlog/T-20260812-003_private-figma-source-core-flow-design.md
  - design/prototype/ # Legacy/Baseline 참고
  - design/figma-build/manifest.json # Legacy 상태 계약 참고
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
  - .ai_project/tasks/active/T-20260812-001_ios-implementation-visual-design-qa.md
  - T-20260729-002의 승인된 디자인 핸드오프
  - T-20260805-001의 승인된 Core Loop 구현·Visual QA 계약
created_by: Product Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-08-12
report_to: .ai_project/reports/T-20260728-003_apply-figma-uiux-to-ios-report.md
qa_to: .ai_project/qa/T-20260728-003_apply-figma-uiux-to-ios-qa.md
---

# 확정 제품 UX·디자인과 iOS 로컬 상태 모델 적용

## T-20260812-004 재정렬

- 기존 완료 iOS 기능·로컬 상태 모델은 재구현하지 않고 Legacy 기능 baseline으로 보존한다.
- T-20260812-003의 Figma baseline 고정 후 변경된 UI/UX 차이만 하나의 iOS 동기화 범위로 확정한다.
- 완료 게이트는 `T-20260812-003 → iOS 일괄 동기화 및 T-20260805-008 → T-20260812-001 → 상위 완료 리뷰` 순서다.

## 목적

확정된 제품 상태와 승인 디자인을 현재 SwiftUI 아키텍처에 반영하고, 실제 온라인 서비스가 없어도 모든 로컬 생명주기와 화면 상태를 검증할 수 있게 한다.

## 제안 범위

- 디자인 토큰과 공통 SwiftUI 컴포넌트 구성
- Home 단일 목록, 상태별 카드, 전체 보기와 제목·재료 로컬 검색
- 여러 진행 레시피와 `draft_step_preview -> draft_ai_review -> completed` 로컬 상태 모델
- STEP Preview 자동 저장·삭제·되돌리기와 AI Review 수동 임시 저장·이탈 경고
- 조리 단계별 편집, 완료 레시피 수정·영구 삭제와 저장 실패 보존
- Audio Guide와 핸즈프리의 전체 화면 상태·버튼 fallback UI
- 앱 정보의 문의·개인정보처리방침·이용약관·데이터 보관 안내
- 오프라인·서비스 장애·권한·빈 상태·처리 중·오류 상태
- 작은 화면, 다크 모드, Dynamic Type, 접근성 보정
- 승인된 로컬 Prototype과 Manifest 에셋 적용
- 기존 Navigation, ViewModel, UseCase 동작 보존
- 로컬 Mock Service 기반 기능 회귀 테스트와 디자인 정합성 QA

## 제외 범위

- 디자인 승인 전 임의 구현
- 디자인 자동 생성 코드를 제품 코드로 그대로 반영
- Apple 기기 내 STT, Backend AI와 TTS 실제 구현
- 실제 핸즈프리 음성 인식 엔진
- App Store 설정과 외부 URL 생성

## 성공 기준

- 승인된 Prototype과 Manifest의 화면·상태가 SwiftUI에 일관되게 구현된다.
- 통합 82개 상태는 상위 구현·회귀 범위로 유지하고, Core Loop 23개 상태는 `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md`의 측정 가능한 인수 기준으로 검증한다.
- 진행 기록, 임시 저장, 완료 전환, 검색·수정·삭제와 앱 재실행 복구가 PRD와 일치한다.
- 실제 서비스 어댑터 없이도 모든 성공·처리·오류 상태를 Mock으로 검증할 수 있다.
- iPhone 작은 화면과 다크 모드에서 레이아웃 결함이 없다.
- 접근성 라벨과 Dynamic Type의 핵심 흐름을 사용할 수 있다.
- iOS QA Agent가 기능 회귀와 기술 접근성 검증을 통과시킨다.
- Design QA Agent가 동일한 고정 디자인 SHA와 iOS 구현 commit을 기준으로 시각 정합성을 별도 검증한다.
- 개발 검증과 디자인 검증이 모두 통과한 뒤에만 상위 Task 완료 리뷰를 진행한다.

## 사용자 결정 필요 항목

- 없음. 기능·접근성 충돌은 iOS 표준을 우선하고 시각 변경은 Design Lead와 재조율한다.

## Coordination 메모

- Development Lead Agent가 화면 또는 컴포넌트 단위 하위 작업 분할 여부를 판단한다.
- 디자인 변경이 필요하면 iOS Agent가 임의 수정하지 않고 Design Lead Agent에게 재조율을 요청한다.
- `T-20260728-002`는 Design QA 통과 후 PR #6으로 `develop`에 병합되어 완료됐다.
- `T-20260728-001`의 유효 검증 항목은 이 Task와 최종 출시 게이트로 통합했고 기존 의존성을 제거했다.
- `T-20260729-002`의 완료·승인 전에는 구현을 시작하지 않는다.
- `T-20260805-001`은 완료됐으며 Core Loop 23개 상태 인수 계약을 제공한다. 이 하위 계약은 통합 핸드오프의 82개 상태를 축소하거나 대체하지 않는다.
- 2026-08-12: Product Owner가 개발 검증과 디자인 검증의 책임 분리를 승인했다. 기존
  `T-20260805-008`의 시각 증거와 실패 이력은 진단 자료로 보존하되 최종 Visual Fidelity
  판정은 신규 `T-20260812-001`에서 Design QA Agent가 수행한다.
- T-20260812-003의 비공개 Figma 핵심 흐름·Product Owner 시각 승인·독립 Design QA와
  Figma baseline 고정 전에는 iOS UI 동기화와 최종 시각 판정을 시작하지 않는다.

## Development Lead 하위 Task 분해 요구

1. 로컬 도메인·SwiftData migration과 draft 생명주기
2. Home·전체 보기·검색·상태별 routing
3. Cooking Log·STEP Preview 자동 저장과 오류 상태
4. AI Review·완료 레시피 편집·삭제
5. Audio Guide·핸즈프리 화면 상태와 공통 action model
6. 앱 정보·권한·오프라인·서비스 장애 상태
7. iOS UI 구현·기능 회귀·기술 접근성 통합 검증
8. 고정 디자인과 고정 iOS 구현 간 Visual Fidelity Design QA

각 하위 Task는 iOS Agent 실행과 iOS QA 독립 검증 경계를 분리해야 한다.

## 승인된 실행 계획

| 순서 | Task | 패키지 | 상태 |
|---:|---|---|---|
| 1 | `T-20260805-002` | 로컬 도메인·SwiftData migration·draft 생명주기 | `approved` |
| 2 | `T-20260805-003` | Home·전체 보기·검색·상태별 routing | `proposed` |
| 3 | `T-20260805-004` | Cooking Log·STEP Preview 자동 저장·오류 상태 | `proposed` |
| 4 | `T-20260805-005` | AI Review·완료 레시피 편집·삭제 | `proposed` |
| 5 | `T-20260805-006` | Audio Guide·핸즈프리 UI·공통 action model | `proposed` |
| 6 | `T-20260805-007` | 앱 정보·권한·오프라인·서비스 장애 | `proposed` |
| 7 | `T-20260805-008` | iOS UI 구현·기능·기술 접근성 통합 검증 | `blocked` |
| 8 | `T-20260812-001` | iOS 구현 Visual Fidelity Design QA | `scoped` |

- 2026-08-05: Product Owner가 T-003 진행을 승인했다.
- Development Lead가 7개 구현·독립 QA 패키지로 범위화해 `proposed -> scoped`로 전환했다.
- 공유 모델·저장 경계를 먼저 고정하기 위해 T-002만 `approved`로 iOS Agent에 인계한다.
- 후속 Task는 선행 Task가 공용 `develop`에서 `done`이 된 뒤 별도 실행 승인한다.
- `T-20260805-008`은 최신 디자인 baseline이 고정된 뒤 iOS Agent가 재개하고 iOS QA Agent가
  기능·기술 접근성을 독립 검증한다. 이후 `T-20260812-001`에서 UI/UX Design Agent가 비교
  증거를 준비하고 Design QA Agent가 시각 정합성을 독립 판정한다.
