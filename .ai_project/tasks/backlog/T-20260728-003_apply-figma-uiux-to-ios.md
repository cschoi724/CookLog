---
id: T-20260728-003
title: 승인된 Figma MVP UI/UX를 iOS 앱에 적용
status: proposed
type: feature
priority: P1
priority_reason: 기능 기준과 디자인 기준이 모두 확정된 뒤 MVP를 제품 수준 UI로 전환한다.
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
  - T-20260728-001
  - T-20260728-002
  - T-20260805-001
blocks:
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
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-08-03
report_to: .ai_project/reports/T-20260728-003_apply-figma-uiux-to-ios-report.md
qa_to: .ai_project/qa/T-20260728-003_apply-figma-uiux-to-ios-qa.md
---

# 승인된 Figma MVP UI/UX를 iOS 앱에 적용

## 목적

승인된 Figma MVP 디자인을 현재 SwiftUI 아키텍처와 기능 흐름에 맞게 구현하고 기능 회귀와 디자인 정합성을 검증한다.

## 제안 범위

- 디자인 토큰과 공통 SwiftUI 컴포넌트 구성
- 5개 MVP 화면과 주요 상태 적용
- 작은 화면, 다크 모드, Dynamic Type, 접근성 보정
- Figma 에셋 적용
- 기존 Navigation, ViewModel, UseCase 동작 보존
- 기능 회귀 테스트와 Figma 대비 Visual QA

## 제외 범위

- 디자인 승인 전 임의 구현
- Figma 자동 생성 코드를 제품 코드로 그대로 반영
- Backend, 실제 STT/AI/TTS 구현
- 제품 범위 확장

## 성공 기준

- 승인된 Figma 화면과 상태가 SwiftUI에 일관되게 구현된다.
- M8에서 검증한 Core Loop가 회귀 없이 동작한다.
- iPhone 작은 화면과 다크 모드에서 레이아웃 결함이 없다.
- 접근성 라벨과 Dynamic Type의 핵심 흐름을 사용할 수 있다.
- iOS QA Agent가 기능 회귀와 디자인 정합성 검증을 통과시킨다.

## 해결된 결정 항목

- `T-20260805-001`에서 제품 의미·상태·데이터·접근성을 우선하고, 동일한 사용자 결과를 유지하는 네이티브 시스템 동작·렌더링은 iOS 관례를 우선하도록 확정했다.
- `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md`에서 23개 상태, 토큰별 치수 허용치, 시스템 렌더링 예외, 결함 심각도와 증빙 형식을 확정했다.

## Coordination 메모

- Development Lead Agent가 화면 또는 컴포넌트 단위 하위 작업 분할 여부를 판단한다.
- 디자인 변경이 필요하면 iOS Agent가 임의 수정하지 않고 Design Lead Agent에게 재조율을 요청한다.
- 2026-08-03: `T-20260728-002`가 Design QA와 Design Lead 완료 검토를 통과해 해당 의존성이 충족됐다. `T-20260728-001` 완료 후 Development Lead scope를 진행한다.
- 2026-08-04: Product Owner 승인에 따라 iOS 플랫폼 관례와 Visual QA 인수 기준을 확정하는 `T-20260805-001`을 선행 의존성으로 추가했다.
- 2026-08-04: `T-20260805-001` 실행 산출물로 기존 사용자 결정 필요 항목을 닫고 구현 Source of Truth에 인수 계약을 추가했다.
- 2026-08-04: Design QA 재작업에서 실제 `AppRoute.aiReview([StepPreview])`를 유지하고, 과거 session ID 기반 route를 기록한 `apps/ios/docs/NAVIGATION.md`는 이 Task의 iOS 문서 갱신 범위에 포함하도록 확정했다.
- 2026-08-04: CookLog 화면·카드·섹션 배경은 manifest의 고유 Light/Dark 토큰을 정확히 적용하며 system semantic color는 레이블·구분선·네이티브 컨트롤 내부 슬롯에만 사용하도록 확정했다.
