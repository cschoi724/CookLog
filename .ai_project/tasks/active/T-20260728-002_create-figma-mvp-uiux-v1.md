---
id: T-20260728-002
title: CookLog Figma 프로젝트 생성과 MVP UI/UX v1 설계
status: in_progress
type: feature
priority: P0
priority_reason: 승인된 디자인 원본이 없어 이후 UI 구현과 Visual QA의 기준을 먼저 만들어야 한다.
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
depends_on: []
blocks:
  - T-20260728-003
  - T-20260728-009
parallel_group: ios-m8-and-foundations
allowed_paths:
  - design/
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - docs/PROJECT_DECISIONS.md
  - docs/PROJECT_CHANGELOG.md
  - .ai_project/source_of_truth.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_MVP_SCOPE.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - apps/ios/docs/STATUS.md
created_by: Product Lead Agent
approved_by: Product Owner
locked_by: UI/UX Design Agent
locked_at: 2026-07-28
lock_session: codex-design-20260728
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
report_to: .ai_project/reports/T-20260728-002_create-figma-mvp-uiux-v1-report.md
qa_to: .ai_project/qa/T-20260728-002_create-figma-mvp-uiux-v1-qa.md
---

# CookLog Figma 프로젝트 생성과 MVP UI/UX v1 설계

## 목적

CookLog의 첫 공식 Figma 프로젝트를 생성하고, MVP 핵심 경험을 구현 가능한 UI/UX 기준으로 설계한다. 승인된 Figma 파일은 CookLog UI의 Source of Truth로 관리한다.

## 제안 범위

- 새 CookLog Figma Design 파일 생성과 프로젝트 구조 정리
- 제품 원칙과 핵심 사용자 흐름에 맞는 UX 구조 확정
- 2~3개 시각 방향 후보 제안 후 Product Owner 선택 반영
- 색상, 타이포그래피, 간격, 모서리, 아이콘 등 Foundation 정의
- 공통 컴포넌트와 상태 정의
- Home, Cooking Log, AI Review, Recipe Detail, Audio Player 설계
- 빈 상태, 로딩, 녹음 중, 처리 중, 오류, 비활성 상태 설계
- iPhone 작은 화면, 다크 모드, Dynamic Type과 기본 접근성 고려
- 기록부터 오디오 가이드까지 핵심 프로토타입 연결
- Figma 링크, 핸드오프 기준과 필요한 export를 저장소 문서에 등록

## 제외 범위

- SwiftUI 코드 구현
- 실제 Backend, STT, AI, TTS 연동
- Android 전용 화면
- PRD v2의 제품 범위 변경

## 확정 실행 범위

Design Lead Agent가 다음 기준으로 ownership과 의존성을 조율했으며, Product Owner가 2026-07-28 실행을 승인했다.

- 하나의 Design 실행 Task로 진행하고 UI/UX Design Agent가 Figma 원본, 프로토타입, 핸드오프를 함께 작성한다.
- `design/`과 지정된 제품 문서만 수정하며 iOS 구현 코드는 수정하지 않는다.
- iOS M8 안정화 및 기반 작업과 병렬 진행할 수 있다.
- `T-20260728-003`과 `T-20260728-009`는 이 Task가 완료될 때까지 시작할 수 없다.
- 새 Figma Design 파일을 생성하고 생성된 링크를 Source of Truth에 등록한다.
- 시각 방향 선택, 다크 모드 상세 범위, 앱 아이콘·로고 포함 여부는 초기 탐색 산출물 이후 Product Owner 선택 게이트로 처리한다.
- 위 선택 게이트는 UX 구조, 화면·상태 목록, Foundation 초안 작업을 시작하는 데에는 영향을 주지 않는다.

## 성공 기준

- 새 Figma 파일이 생성되고 공식 링크가 Source of Truth에 등록된다.
- 5개 MVP 화면과 주요 상태가 누락 없이 설계된다.
- 반복 UI가 재사용 가능한 컴포넌트와 일관된 토큰으로 관리된다.
- 핵심 사용자 흐름을 Figma Prototype으로 확인할 수 있다.
- iOS Agent가 별도 제품 해석 없이 구현 범위를 산정할 수 있는 핸드오프가 존재한다.
- Design QA Agent가 요구사항, 상태, 접근성, 핸드오프 검증을 통과시킨다.
- Product Owner가 최종 시각 방향과 UX를 승인한다.

## 사용자 결정 필요 항목

- 초기 시각 방향 후보 중 CookLog가 채택할 방향
- 라이트 모드만 우선할지, 라이트·다크 모드를 함께 확정할지
- 앱 아이콘과 브랜드 로고를 이번 v1 범위에 포함할지

## Coordination 메모

- UI/UX Design Agent가 Figma 원본을 만들고 Design QA Agent가 독립 검증한다.
- 현재 iOS 앱은 기능·상태 참고 자료이며 시각적 Source of Truth가 아니다.
- Figma 적용은 별도 iOS Task에서 수행한다.

## 상태 전이 기록

- 2026-07-28: Design Lead Agent가 ownership, 실행 경로, 의존성과 병렬 가능성을 확인하고 `proposed -> scoped`로 조율했다.
- 2026-07-28: Product Owner가 실행을 승인해 `scoped -> approved`로 전환하고 UI/UX Design Agent에 라우팅했다.
- 2026-07-28: UI/UX Design Agent가 실행 lock을 획득하고 `approved -> in_progress`로 전환했다.
