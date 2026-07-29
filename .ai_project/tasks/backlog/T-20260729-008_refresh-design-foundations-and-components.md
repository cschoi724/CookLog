---
id: T-20260729-008
title: 확정 UX용 디자인 Foundation·공통 컴포넌트 갱신
status: proposed
type: feature
priority: P0
priority_reason: 모든 후속 화면이 공유하는 토큰과 상태 variant를 먼저 확정해야 화면별 재작업과 iOS 구현 해석 차이를 줄일 수 있다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: UI/UX Design Agent
target_role: Execution Role
required_capabilities:
  - ui_design
  - prototyping
  - design_handoff
depends_on: []
blocks:
  - T-20260729-009
  - T-20260729-002
parallel_group: design-refresh-sequential
allowed_paths:
  - design/prototype/components.html
  - design/prototype/styles.css
  - design/figma-build/manifest.json
  - design/figma-build/
  - design/exports/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
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
report_to: .ai_project/reports/T-20260729-008_refresh-design-foundations-and-components-report.md
qa_to: .ai_project/qa/T-20260729-008_refresh-design-foundations-and-components-qa.md
---

# 확정 UX용 디자인 Foundation·공통 컴포넌트 갱신

## 목적

기존 Warm Kitchen Journal 방향을 유지하면서 새 제품 상태를 일관되게 표현할 토큰, 공통 컴포넌트와 상태 variant를 로컬 UI Source of Truth에 추가한다.

## 실행 범위

- 기존 Light·Dark semantic token의 역할과 대비 유지
- 진행 상태 Recipe Card: 기록 중, AI 정리 중, 검토 필요, 완료
- 버튼: 기본, 눌림, 비활성, 처리 중과 항상 사용 가능한 fallback
- Form Field와 단계 카드: 기본, 포커스, 오류, AI 추정, 누락, 비활성
- Toast, Banner, Alert, 삭제 확인, 되돌리기와 장기 처리 상태
- 권한, 오프라인, 서비스 오류의 아이콘·문구·행동 구조
- Audio Guide와 핸즈프리 활성·듣는 중·실패 상태에 필요한 control variant
- Manifest의 토큰·컴포넌트 명세와 Prototype component gallery 동기화

## 제외 범위

- 개별 화면의 최종 배치와 routing
- 제품 문구나 확정 정책 변경
- SwiftUI 구현
- Paywall과 수익화 디자인

## 성공 기준

- 후속 6개 화면 패키지가 별도 임시 스타일 없이 공통 토큰과 컴포넌트를 재사용할 수 있다.
- 상태가 색상만이 아니라 아이콘, 문구와 형태로 구분된다.
- 오류 컴포넌트는 원인 범주와 사용자가 할 수 있는 다음 행동을 함께 표현한다.
- 최소 44×44pt 터치 영역, Light·Dark WCAG AA 대비와 Dynamic Type 확장 규칙이 명세된다.
- Prototype component gallery와 Manifest의 이름·variant·token 값이 일치한다.
- Design QA Agent가 컴포넌트 상태와 접근성 기준을 독립 검증한다.

## 사용자 결정 필요 항목

- 없음. 기존 승인 시각 방향과 제품 정책 안에서 실행한다.

## 인계

완료 후 `T-20260729-009`가 이 Foundation을 사용한다. Figma 미러는 도구 사용이 가능할 때 동기화하되 로컬 Prototype·Manifest 완료를 차단하지 않는다.
