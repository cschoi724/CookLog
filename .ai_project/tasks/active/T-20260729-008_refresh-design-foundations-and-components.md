---
id: T-20260729-008
title: 확정 UX용 디자인 Foundation·공통 컴포넌트 갱신
status: done
type: feature
priority: P0
priority_reason: 모든 후속 화면이 공유하는 토큰과 상태 variant를 먼저 확정해야 화면별 재작업과 iOS 구현 해석 차이를 줄일 수 있다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent:
target_role:
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
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-30
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

## 실행 조율

- Design Lead Agent가 Foundation, 공통 컴포넌트, 상태 variant와 접근성 기준을 하나의 실행 패키지로 확정했다.
- 공용 `components.html`, `styles.css`, Manifest ownership 충돌을 막기 위해 추가 하위 Task로 더 분할하지 않는다.
- 후속 `T-20260729-009~014`는 이미 순차 하위 Task로 등록됐으며 각 선행 Task가 `done`일 때 별도 Product Owner 승인을 받아 실행한다.
- UI/UX Design Agent는 이 전용 worktree에서 lock을 획득한 뒤 작업을 시작한다.

## 승인된 재작업 범위

- `DQA-MEDIUM-008-001`: 완료 Recipe Card에서 별도 상태 pill과 완료 심볼을 제거하고 기본 카드 구조와 메타데이터만 유지한다.
- `DQA-MEDIUM-008-002`: Gallery에 `Form Field / Multiple`과 `Alert / Single` 대표 예시를 추가해 Manifest 선언과 일치시킨다.
- Foundation 토큰, 다른 컴포넌트와 제품 정책은 변경하지 않는다.
- 수정 후 기존 통과 항목의 회귀 여부와 Manifest–Gallery 정합성을 자체 검증하고 Design QA Agent에 다시 인계한다.
- 최신 `origin/develop` 기준 정렬과 변경 동등성 확인은 재검증 통과 후 병합 게이트에서 수행한다.

## 재작업 실행 결과

- `DQA-MEDIUM-008-001`: 완료 Recipe Card에서 `recipe-state` pill과 상태 심볼을 제거하고 날짜·예상 시간, 재료와 단계 수만 표시하는 기본 카드로 정리했다.
- `DQA-MEDIUM-008-002`: Gallery에 `Form Field / Lines=Multiple` textarea와 `Alert / Actions=Single` 장기 처리 대표 예시를 추가했다.
- Manifest의 기존 `Complete`, `Multiple`, `Single` 선언은 제품 기준과 일치하므로 변경하지 않았다.
- Manifest·Gallery 컴포넌트 이름 11개 일치, 대상 variant 정적 검사, JSON·스크립트 파싱, 로컬 HTTP 응답, Safari Light 시각 검사와 `git diff --check`를 통과했다.

## Design Lead 완료 검토

- Task 성공 기준과 실행 보고서를 대조해 Foundation 22개, Light·Dark Semantic 각 17개, 공통 컴포넌트 11개와 접근성·상태 표현·오류 행동 명세가 후속 화면 설계에 재사용 가능한 수준으로 준비됐음을 확인했다.
- 최종 Design QA의 `verification_passed` 판정과 `DQA-MEDIUM-008-001`, `DQA-MEDIUM-008-002` 해소 및 기존 통과 항목 무회귀 결과를 확인했다.
- Task 변경 경로는 선언된 `allowed_paths` 안에 있으며, JSON·JavaScript 파싱과 `git diff --check` 재검증을 통과했다.
- 로컬 Prototype·Manifest가 Source of Truth이고 Figma는 버전 미러이므로 Starter 도구 제한은 산출물 완성도와 iOS 핸드오프를 차단하지 않는다.
- 토큰, 컴포넌트 이름·variant, 상태·접근성 규칙과 Figma build Runbook이 포함되어 후속 `T-20260729-009` 및 iOS 구현을 위한 인계가 가능하다.
- 현재 Task worktree의 최신 `origin/develop` 정렬과 변경 동등성 확인은 develop 통합 전 Git 게이트로 남는다. 통합 전에는 `done`으로 전환하지 않는다.
- `T-20260729-009`는 이 Task가 develop에 병합되어 `done`이 되고 별도 실행 승인을 받기 전까지 `proposed`를 유지한다.

## 상태 전이 기록

- 2026-07-29: Design Lead Agent가 scope, allowed paths, Source of Truth, 의존성과 공용 파일 ownership을 확인해 `proposed -> scoped`로 조율했다.
- 2026-07-29: Product Owner가 `T-20260729-008` 실행을 승인해 `scoped -> approved`로 전환하고 UI/UX Design Agent에 라우팅했다.
- 2026-07-29: UI/UX Design Agent가 전용 worktree에서 lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-07-29: UI/UX Design Agent가 Foundation 22개, Light·Dark Semantic 각 17개와 공통 컴포넌트 11개를 Prototype·Manifest에 동기화하고 자체 검증을 완료한 뒤 lock을 해제해 `in_progress -> verification_ready`로 전환했다.
- 2026-07-29: Design QA Agent가 완료 Recipe Card의 별도 상태 badge와 Manifest–Gallery variant 누락 2건을 확인해 `verification_ready -> rework_requested`로 전환하고 UI/UX Design Agent에 재작업을 요청했다.
- 2026-07-29: Product Owner가 Design QA 결함 2건의 재작업을 승인해 `rework_requested -> approved`로 전환하고 UI/UX Design Agent에 다시 라우팅했다.
- 2026-07-29: UI/UX Design Agent가 전용 worktree에서 재작업 lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-07-29: UI/UX Design Agent가 결함 2건 수정과 자체 검증을 완료하고 lock을 해제해 `in_progress -> verification_ready`로 전환한 뒤 Design QA Agent에 독립 재검증을 요청했다.
- 2026-07-30: Design QA Agent가 결함 2건 해소와 기존 통과 항목의 회귀 없음을 독립 재검증해 `verification_ready -> verification_passed`로 전환하고 Design Lead Agent에 인계했다.
- 2026-07-30: Design Lead Agent가 성공 기준, 최종 Design QA, allowed paths, Figma 비차단 근거와 구현 핸드오프 완전성을 검토해 `verification_passed -> completion_review`로 인계했다. develop 통합 전이므로 `done` 전환은 보류했다.
- 2026-07-30: Product Owner 승인에 따라 PR #11을 `develop`에 squash merge했고, merge SHA `5de6a934c1cb98859e3b2e4a15c24d9ec54e9feb`을 확인해 `completion_review -> done`으로 전환했다.
