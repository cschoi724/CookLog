---
schema: aiops.task.v1
id: T-20260805-008
title: iOS 접근성·작은 화면·다크 모드·통합 회귀 검증
status: verification_ready
type: qa
priority: P0
priority_reason: 82개 통합 상태와 Core Loop 23개 상태의 기능·시각·접근성 무회귀가 상위 T-003 완료 조건이다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: qa
target_agent: iOS QA Agent
target_role: Verification Role
required_capabilities: [ios_qa, regression_test, design_fidelity_review]
depends_on:
  - T-20260805-002
  - T-20260805-003
  - T-20260805-004
  - T-20260805-005
  - T-20260805-006
  - T-20260805-007
blocks: [T-20260728-003]
parallel_group:
allowed_paths:
  - apps/ios/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
  - apps/ios/docs/TESTING.md
  - apps/ios/docs/MANUAL_QA_CHECKLIST.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-05
updated_at: 2026-08-10
report_to: .ai_project/reports/T-20260805-008_ios-accessibility-visual-regression-report.md
qa_to: .ai_project/qa/T-20260805-008_ios-accessibility-visual-regression-qa.md
---

# iOS 접근성·작은 화면·다크 모드·통합 회귀 검증

## 범위

- 390×844·375×667, Light/Dark, 기본/Accessibility 3 조합
- Dynamic Type·VoiceOver label/value/trait·순서·44×44pt
- Core Loop 23개 캡처와 통합 82개 상태 기능 회귀 fixture
- Current·Reference·Diff 증빙과 Blocker/High/Medium/Low 분류

## 성공 기준

- 작은 화면과 접근성 글자 크기에서 필수 콘텐츠·CTA가 잘리지 않는다.
- Core Loop·다시 요리·오류 회복과 draft/Recipe 데이터 보존이 통과한다.
- iOS QA Agent가 실행 역할과 분리된 독립 검증을 수행한다.
- 통합 검증 통과 후에만 상위 `T-20260728-003` 완료 리뷰로 인계한다.

## 승인 및 실행 경계

- 2026-08-07: 공용 `origin/develop@56cb68d`에서 선행 `T-20260805-002~007`이 모두
  `done`임을 확인했다. Product Owner가 실행을 승인해 `proposed -> approved`로 전환하고
  backlog에서 active로 이동해 iOS Agent / Execution Role에 인계한다.
- iOS Agent는 최신 `origin/develop` 기반 전용 worktree에서 lock을 획득하고 한 Task만
  수행한다. 통합 fixture·자동화·시각 증빙을 보강하고 발견된 iOS 결함은 `apps/ios/`
  안에서 수정할 수 있다.
- 390×844·375×667, Light/Dark, 기본/Accessibility 3, Dynamic Type, VoiceOver
  label/value/trait·순서, 44×44pt, Core Loop 23개와 통합 82개 상태를 확인한다.
- Current·Reference·Diff 증빙과 전체 XCTest·Debug build 결과를 report에 남긴다. 실제
  Apple STT·Backend AI·TTS 엔진, 운영 문의·법적 값은 이번 통합 회귀 범위에서 제외한다.
- 실행 완료 후 lock을 해제하고 `verification_ready`, iOS QA Agent / Verification Role로
  넘긴다. 독립 QA 전에는 T-008 또는 상위 T-20260728-003을 완료로 판정하지 않는다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 iOS QA Agent / Verification Role이야.
Task T-20260805-008의 실행 결과를 독립적으로 검증해줘.

- 현재 상태: `verification_ready`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `099047e`
- 다음에 해야 할 일: report와 변경 파일을 기준으로 82개 기능 회귀, Core Loop 23개,
  390×844·375×667 Light/Dark·기본/Accessibility 3, VoiceOver 순서와 44pt를 독립 검증해.
- 기준 문서: Task `source_of_truth` 전체
- 허용 경로: Task frontmatter의 `allowed_paths`
- 실행 보고서: `.ai_project/reports/T-20260805-008_ios-accessibility-visual-regression-report.md`
- 변경/검토 대상: `apps/ios/VisualRegression/`,
  `apps/ios/Scripts/validate-visual-regression-contract.js`, 전체 iOS 화면·테스트
- 남은 리스크: 23개 기본 Current 전체와 동일 scale pixel Reference/Diff, 23개 전체
  VoiceOver 런타임 순서 증거는 아직 없다. 우선 반례로 확인하고 합격 조건 미충족이면
  `FAIL`로 Lead Role에 반환해.
- 범위 제외: 실제 Apple STT·Backend AI·TTS 엔진, 운영 문의·법적 값
- 통과 시: QA 문서를 작성하고 허용 workflow에 따라 Completion Role로 인계해.
- 실패 시: 결함 ID·심각도·재현 증거를 남기고 Lead Role에 `rework_requested` 범위를 요청해.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
