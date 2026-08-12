---
schema: aiops.task.v1
id: T-20260812-001
title: iOS 구현 Visual Fidelity Design QA
status: scoped
type: qa
priority: P0
priority_reason: 최종 iOS 구현의 시각 정합성을 개발 기능 검증과 분리해 고정 디자인 기준으로 독립 판정해야 상위 T-003을 완료할 수 있다.
org_unit: Quality Division
team: Quality Team
team_lead: Design Lead Agent
workflow: qa
target_agent: Design Lead Agent
target_role: Lead Role
planned_execution_agent: UI/UX Design Agent
planned_execution_role: Execution Role
required_capabilities: [design_scoping, design_dependency_management]
ownership:
  paths:
    - apps/ios/VisualRegression/Evidence/design-qa/
    - .ai_project/tasks/active/T-20260812-001_ios-implementation-visual-design-qa.md
    - .ai_project/reports/T-20260812-001_ios-implementation-visual-design-qa-report.md
    - .ai_project/qa/T-20260812-001_ios-implementation-visual-design-qa.md
  domains: [ios-implementation-visual-fidelity, design-conformance-qa]
  documents: [design/prototype/, design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260811-007, T-20260805-008]
blocks: [T-20260728-003]
parallel_group: ios-redesign-integration-sequential
allowed_paths:
  - apps/ios/VisualRegression/Evidence/design-qa/
  - .ai_project/tasks/active/T-20260812-001_ios-implementation-visual-design-qa.md
  - .ai_project/reports/T-20260812-001_ios-implementation-visual-design-qa-report.md
  - .ai_project/qa/T-20260812-001_ios-implementation-visual-design-qa.md
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - .ai_project/tasks/active/T-20260728-003_apply-figma-uiux-to-ios.md
  - .ai_project/tasks/active/T-20260805-008_ios-accessibility-visual-regression.md
  - .ai_project/tasks/backlog/T-20260811-007_pop-kitsch-prototype-integration-design-qa.md
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
created_by: Development Lead Agent
approved_by: Product Owner (2026-08-12, 개발·디자인 검증 분리 구조 승인)
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-12
updated_at: 2026-08-12
report_to: .ai_project/reports/T-20260812-001_ios-implementation-visual-design-qa-report.md
qa_to: .ai_project/qa/T-20260812-001_ios-implementation-visual-design-qa.md
status_ref: origin/develop
status_ref_sha: 2f64328ac8e24bb7cdaae33520155df4762047c3
base_ref: origin/develop
base_sha: 2f64328ac8e24bb7cdaae33520155df4762047c3
branch:
  name: task/T-20260812-001-ios-implementation-visual-design-qa
  base: develop
pr:
  url:
  status:
---

# iOS 구현 Visual Fidelity Design QA

## 목적

고정된 디자인 baseline과 기능·기술 접근성 검증을 통과한 고정 iOS 구현을 동일 상태로
비교해, 최종 시각 정합성을 Design QA Agent가 개발 검증과 독립적으로 판정한다.

## 범위

- UI/UX Design Agent는 고정 디자인 SHA와 고정 iOS commit을 사용해 Core 23개 상태의
  Current·Reference·Diff 비교 증거를 준비한다. 제품 코드와 Prototype 원본은 수정하지 않는다.
- 390×844 기본 상태를 중심으로 375×667, Light/Dark, Accessibility 3의 대표 위험 상태를
  비교하고 계층·색상·타이포그래피·간격·정렬·CTA와 오류/disabled 시각 의미를 확인한다.
- Design QA Agent는 증거 생성 역할과 분리해 `PASS`, `PASS_WITH_RISK`, `FAIL`, `BLOCKED`를
  판정하고 결함의 ownership을 iOS 구현 또는 디자인 Source로 명확히 라우팅한다.

## 성공 기준

- 디자인 SHA, iOS commit, 상태 ID, fixture, viewport, scale, Appearance와 글자 크기가
  증거 manifest에 고정되고 Current·Reference·Diff가 1:1로 대응한다.
- Current를 Reference로 복제하거나 tolerance를 늘려 결함을 우회하지 않으며 서로 다른
  session·fixture·좌표계를 혼합하지 않는다.
- Core 23개와 승인된 대표 위험 상태의 시각 차이가 합의된 허용치 안에 있거나, 예외가
  Product Owner 승인 위험으로 명시된다.
- 코드 결함은 `T-20260805-008` 재작업으로, 디자인 Source 결함은 해당 Design Task로
  반환하고 상위 `T-20260728-003` 완료를 차단한다.

## 제외 범위

- XCTest 기능 회귀와 기술 접근성 재판정
- iOS 제품 코드, Design Prototype 또는 디자인 원본 변경
- 실제 기기 VoiceOver 증거와 외부 공개·배포

## 활성화 및 인계

- `T-20260811-007` 통합 Design QA와 `T-20260805-008` iOS QA가 모두 완료될 때까지
  `scoped`를 유지한다.
- Design Lead Agent가 동일한 고정 디자인 SHA와 iOS commit을 확인한 뒤 Product Owner에게
  별도 실행 승인을 요청한다.
- 승인 후 UI/UX Design Agent / Execution Role이 비교 증거만 준비하고 `verification_ready`로
  전환해 Design QA Agent / Verification Role에 독립 검증을 요청한다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Design Lead Agent / Lead Role이야.
Task T-20260812-001의 활성화 조건과 Design QA ownership을 관리해줘.

- 현재 상태: `scoped`
- 선행 조건: `T-20260811-007`과 `T-20260805-008` 완료
- 다음 조치: 디자인 SHA와 iOS commit을 함께 고정하고 Product Owner의 별도 실행 승인을 받아.
- 실행 경계: UI/UX Design Agent는 비교 증거만 준비하며 제품 코드·Prototype을 수정하지 않아.
- 독립 검증: 증거 준비 후 Design QA Agent / Verification Role에 인계해 Visual Fidelity를 판정해.
