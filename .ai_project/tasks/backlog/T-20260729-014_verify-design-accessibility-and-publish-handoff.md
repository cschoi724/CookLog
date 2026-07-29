---
id: T-20260729-014
title: 디자인 통합 접근성 검증·구현 핸드오프 갱신
status: proposed
type: feature
priority: P0
priority_reason: 화면별 변경을 하나의 Source of Truth로 통합하고 작은 화면·Dynamic Type·Light/Dark·접근성 기준을 확인해야 iOS 구현을 시작할 수 있다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: UI/UX Design Agent
target_role: Execution Role
required_capabilities:
  - ux_flow
  - ui_design
  - prototyping
  - design_handoff
depends_on:
  - T-20260729-013
blocks:
  - T-20260729-002
parallel_group: design-refresh-sequential
allowed_paths:
  - design/prototype/
  - design/figma-build/
  - design/exports/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - design/prototype/
  - design/figma-build/manifest.json
created_by: Design Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260729-014_verify-design-accessibility-and-publish-handoff-report.md
qa_to: .ai_project/qa/T-20260729-014_verify-design-accessibility-and-publish-handoff-qa.md
---

# 디자인 통합 접근성 검증·구현 핸드오프 갱신

## 목적

앞선 화면 패키지를 통합해 확정 제품 상태가 모두 도달 가능한지 확인하고 iOS Agent가 별도 제품 해석 없이 구현할 수 있는 최종 핸드오프를 만든다.

## 실행 범위

- 전체 기록·복귀·검색·AI Review·수정·삭제·Audio Guide 흐름 연결
- Prototype, Manifest와 핸드오프 상태·명칭·토큰 대조
- Light·Dark 전체 핵심·오류 상태
- 390×844와 iPhone SE 3세대 375×667 실제 레이아웃
- Dynamic Type 줄바꿈·스크롤·고정 CTA 검토
- VoiceOver 읽기 순서, label, hint와 상태 알림
- 최소 44×44pt 터치 영역과 WCAG AA 대비
- Reduce Motion과 색상 외 상태 전달
- iOS 상태·행동·빈값·오류·접근성 구현 명세
- Figma 미러 가능한 범위의 버전 동기화와 동기화 상태 기록
- 화면·상태별 검토용 export

## 제외 범위

- SwiftUI 구현과 iOS QA
- 제품 정책 변경
- Figma 미러 완료를 로컬 디자인 완료 조건으로 삼는 것

## 성공 기준

- 제품 문서의 확정 상태와 행동을 Prototype 안에서 모두 도달할 수 있다.
- Prototype과 Manifest 사이 화면·상태·컴포넌트·token 불일치가 없다.
- Light·Dark, 작은 화면, Dynamic Type, VoiceOver와 Reduce Motion 수용 기준이 핸드오프에 있다.
- iOS Agent가 카드 상태, routing, 저장 경계, 오류 행동과 Audio Guide 액션을 추가 질문 없이 구현할 수 있다.
- Figma 미러의 동기화 범위와 미동기화 항목이 명확하며 로컬 Source of Truth 우선순위가 유지된다.
- Design QA Agent가 전체 흐름, 접근성, 상태 누락과 핸드오프 정합성을 독립 검증한다.

## 사용자 결정 필요 항목

- 최종 디자인 수용은 Design QA 통과 후 Product Lead의 상위 Task 완료 검토에서 확인한다.
