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
  - apps/ios/agents.md
  - apps/ios/docs/ARCHITECTURE.md
  - apps/ios/docs/STATUS.md
  - T-20260728-002의 승인된 Figma 파일과 핸드오프
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
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

## 사용자 결정 필요 항목

- 구현 중 Figma와 플랫폼 관례가 충돌할 때 iOS 관례를 우선할 수 있는 범위
- Visual QA에서 허용할 치수·렌더링 차이 기준

## Coordination 메모

- Development Lead Agent가 화면 또는 컴포넌트 단위 하위 작업 분할 여부를 판단한다.
- 디자인 변경이 필요하면 iOS Agent가 임의 수정하지 않고 Design Lead Agent에게 재조율을 요청한다.
- `T-20260728-002`는 Design QA 통과 후 PR #6으로 `develop`에 병합되어 완료됐다.
- `T-20260728-001`은 아직 `proposed`이므로 T-003의 실행 차단은 유지한다.
