---
schema: aiops.task.v1
id: T-20260805-001
title: iOS MVP 디자인 적용 기준과 Visual QA 계약 확정
status: done
type: docs
priority: P1
priority_reason: iOS UI 적용 Task에 플랫폼 관례 우선 범위와 Visual QA 허용 기준이 미결정으로 남아 있어 구현 전 해석 차이와 재작업을 줄여야 한다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: docs
target_agent:
target_role:
required_capabilities:
  - design_scoping
  - design_handoff
  - accessibility_review
depends_on:
  - T-20260728-002
blocks:
  - T-20260728-003
parallel_group: ios-mvp-design-handoff
allowed_paths:
  - design/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/current_context.md
  - .ai_project/source_of_truth.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - .ai_project/tasks/backlog/T-20260728-003_apply-figma-uiux-to-ios.md
  - apps/ios/agents.md
  - apps/ios/docs/STATUS.md
  - apps/ios/docs/DEVELOPMENT_SPEC.md
created_by: Design Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-04
updated_at: 2026-08-05
report_to: .ai_project/reports/T-20260805-001_define-ios-mvp-design-acceptance-contract-report.md
qa_to: .ai_project/qa/T-20260805-001_define-ios-mvp-design-acceptance-contract-qa.md
---

# iOS MVP 디자인 적용 기준과 Visual QA 계약 확정

## 목적

승인된 로컬 UI/UX 원본을 SwiftUI에 적용할 때 디자인 의도, iOS 플랫폼 관례, 접근성 요구가 충돌하지 않도록 우선순위와 검수 기준을 구현 전에 확정한다. 통합 핸드오프의 82개 상태 가운데 첫 iOS 구현·Visual QA에 필요한 Core Loop 23개 상태를 구현·검증 가능한 매트릭스로 연결해 `T-20260728-003`의 범위 산정과 독립 Visual QA에서 같은 기준을 사용하게 한다.

## 범위화 결정

- 기존 MVP UI/UX를 다시 설계하지 않고 구현 인수 기준만 명확히 한다.
- 공식 시각 원본은 `design/prototype/`이며 Figma 미러 완료 여부는 실행 조건이 아니다.
- `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`의 통합 82개 상태가 상위 제품·디자인 기준이며, 23개 상태 계약은 첫 구현 검수용 하위 집합이다. 나머지 상태를 삭제하거나 후속 구현 범위에서 제외하지 않는다.
- iOS 코드는 수정하지 않는다.
- 폐기된 구형 Mock UI 검증 `T-20260728-001`과 별도이며 해당 Task에 의존하지 않는다.
- Product Owner 승인에 따라 `T-20260728-003.depends_on`에 이 Task를 추가한다.

## 작업 패키지

### WP-1 — 화면·상태 추적 매트릭스

- Home 4개, Cooking Log 5개, AI Review 5개, Recipe Detail 4개, Audio Player 5개 등 총 23개 상태를 iOS 화면·상태 모델·검증 시나리오에 대응한다.
- 각 상태별 필수 콘텐츠, CTA, 전이, 상태 보존, 오류 회복 기준을 기록한다.
- Core Loop와 다시 요리 흐름의 필수 캡처 지점을 지정한다.

### WP-2 — 디자인과 iOS 관례의 우선순위

- 제품 의미, 정보 계층, 상태 전이, 데이터 보존, 접근성은 디자인 계약의 필수 항목으로 둔다.
- NavigationStack, safe area, 키보드 회피, 시스템 폰트와 Dynamic Type, VoiceOver, 표준 컨트롤 동작은 동일한 사용자 결과를 유지하는 범위에서 iOS 관례를 우선하는 안을 제시한다.
- 시스템 배경·레이블·구분선은 iOS semantic color에 대응하고 CookLog 고유 색상은 이름 있는 프로젝트 토큰으로 보존하는 기준을 정의한다.
- 시스템 UI 패턴은 `NavigationStack`, `List`, `Form`, `Button`, `ProgressView` 등 네이티브 컨트롤을 우선하며 Prototype의 절대 좌표를 그대로 옮기지 않는다.
- 의미·흐름·상태가 바뀌는 편차와 단순 렌더링 편차를 구분하고 승인 주체를 정한다.

### WP-3 — Visual QA 허용 기준

- 색상·간격·radius·컴포넌트 계층 등 토큰 적용 항목과 시스템 렌더링 허용 항목을 분리한다.
- 390×844와 375×667, Light·Dark, 기본 글자 크기와 접근성 글자 크기의 기준을 정한다.
- 고정 높이로 텍스트를 자르지 않으며 Dynamic Type 재배치는 픽셀 일치보다 정보·행동 보존을 우선한다.
- 결함 심각도, 스크린샷 비교 방식, 허용 편차와 예외 기록 형식을 정의한다.

### WP-4 — 컴포넌트·에셋 구현 인계

- Foundation과 Button, Record Control, Recipe Card, STEP Row, Status Banner, Form Field, Player Controls를 SwiftUI 구현 단위에 대응한다.
- SF Symbols는 이름으로 대응하고 직접 codepoint를 추정하지 않는다. 시스템 자산으로 대체 가능한 항목과 별도 export가 필요한 항목을 구분한다.
- 화면별 공통 컴포넌트 재사용과 상태 variant 요구를 명시한다.

### WP-5 — 독립 Design QA

- 문서가 23개 상태, 작은 화면, Light·Dark, Dynamic Type, VoiceOver와 핵심 전이를 빠짐없이 다루는지 검증한다.
- `T-20260728-003`의 미결정 항목이 모두 닫혔는지 확인한다.
- iOS Agent와 iOS QA Agent가 추가 제품 해석 없이 구현·검증할 수 있는지 핸드오프 완결성을 판정한다.

## 산출물

- `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md`
- `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md` 통합 82개 상태 기준 보존·읽기 전용 대조
- `.ai_project/reports/T-20260805-001_define-ios-mvp-design-acceptance-contract-report.md`
- `.ai_project/qa/T-20260805-001_define-ios-mvp-design-acceptance-contract-qa.md`

## 성공 기준

- Core Loop 23개 MVP 상태가 iOS 구현 및 검증 항목과 1:1로 추적 가능하다.
- 디자인 의도와 iOS 플랫폼 관례가 충돌할 때의 우선순위와 승인 경계가 명확하다.
- 작은 화면, Light·Dark, Dynamic Type과 VoiceOver의 합격 기준이 측정 가능하게 정의된다.
- Visual QA의 허용 편차, 결함 심각도와 증빙 방식이 정의된다.
- 별도 Figma MCP 호출 없이 완료할 수 있다.
- Design QA Agent가 핸드오프 완결성 검증을 통과한다.

## 제외 범위

- SwiftUI 구현 또는 iOS 코드 수정
- MVP 화면의 재설계와 제품 범위 변경
- Figma 변수·스타일·컴포넌트 생성 또는 미러 수정
- 구독·Paywall 구현 기준과 정책 토큰 잠금
- Backend, 실제 STT·AI·TTS 연동

## 의존성과 Queue 영향

- 선행 의존성 `T-20260728-002`는 완료됐다.
- 폐기된 `T-20260728-001`의 유효 항목은 공용 기준대로 T-003/T-009에 통합돼 이 Task를 차단하지 않는다.
- `T-20260728-003`의 선행 Design 계약으로 연결했다.
- Figma 미러 호출 한도와 무관하게 로컬 Prototype·manifest로 실행 가능하다.
- `T-20260728-011`의 정책값 완료 게이트와 범위가 겹치지 않는다.

## 승인 반영

- 2026-08-04 Product Owner가 Task 실행을 승인했다.
- iOS 관례 우선 범위와 Visual QA 허용 편차의 구체안은 산출물에서 정의하고 Design QA 검증 대상으로 삼는다.
- `T-20260728-003.depends_on`에 이 Task를 추가한다.

## 승인된 재작업 범위

### WP-R1 — 실제 AI Review route 계약 정렬 (`DQA-MEDIUM-007`)

- `LOG-STEP-ADDED`의 AI 정리 전이를 실제 코드와 동일한 `AppRoute.aiReview([StepPreview])`로 수정한다.
- Cooking Log에서 누적한 동일 `[StepPreview]` 배열이 `CookLogApp`의 `.aiReview(stepPreviews)`를 통해 `AIReviewViewModel`로 전달된다는 계약을 명시한다.
- `apps/ios/docs/NAVIGATION.md`의 `aiReview(sessionId:)`는 현재 코드보다 오래된 문서임을 기록하고, 실제 코드 우선 및 iOS 개발 Task의 후속 문서 동기화 책임을 명시한다.
- 이번 Design 재작업에서는 iOS 코드와 `apps/ios/docs/`를 수정하지 않는다.

### WP-R2 — CookLog 고유 색상과 system semantic 적용 경계 단일화 (`DQA-MEDIUM-008`)

- `color/bg/base`는 CookLog 고유 토큰으로 고정하고 Light `#FFFDF8`, Dark `#18171B` 값을 가진 이름 있는 Color Asset 또는 동등한 프로젝트 토큰으로 구현하도록 확정한다.
- `color/bg/base`를 `systemBackground` 또는 `systemGroupedBackground`로 대체할 수 있다는 문구와 측정 불가능한 “온도감 동등” 기준을 제거한다.
- CookLog 고유 `bg/base`, `bg/subtle`, `bg/elevated`, accent·status 토큰은 manifest 값과 역할을 보존한다.
- system semantic color는 기본 레이블, 보조 레이블, 구분선과 네이티브 시스템 컨트롤 내부처럼 CookLog 고유 배경 슬롯과 겹치지 않는 영역에만 적용한다.
- Visual QA는 고유 토큰의 이름·Light/Dark 값 정확 일치와 semantic color의 역할 일치를 서로 다른 합격선으로 판정한다.

### 재검증 기준

- `DQA-MEDIUM-007~008` 수용 기준을 모두 충족한다.
- 기존 23개 상태·캡처 ID, 대비 9개, 작은 화면, Light/Dark, Accessibility 3, VoiceOver와 44×44pt 기준을 유지한다.
- 문서 검색에서 `aiReview(sessionId)`와 `color/bg/base`의 system background 대체 허용 문구가 남지 않아야 한다.
- Figma MCP와 iOS 코드 변경 없이 자체 검증 후 Design QA Agent에 재인계한다.

## 상태 전이 기록

- 2026-08-04: Design Lead Agent가 현재 Design Queue와 iOS 적용 Task의 미결정 항목을 검토했다.
- 2026-08-04: Figma 차단과 수익화 정책 대기 중에도 독립 실행 가능하며 iOS 구현 재작업을 예방하는 후보로 범위화해 `scoped`로 등록했다.
- 2026-08-04: Product Owner가 실행과 `T-20260728-003` 선행 의존성 연결을 승인해 `scoped -> approved`로 전환했다.
- 2026-08-04: `figma-swiftui`의 디자인 → 코드 지침을 반영해 semantic color, 네이티브 시스템 패턴과 SF Symbols 이름 기반 대응을 실행 기준에 추가했다.
- 2026-08-04: UI/UX Design Agent가 Task lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-08-04: WP-1~4와 자체 검증을 완료하고 lock을 해제해 `in_progress -> verification_ready`로 전환했다.
- 2026-08-04: Design QA Agent가 독립 검증 lock을 획득하고 `verification_ready -> verification_in_progress`로 전환했다.
- 2026-08-04: Design QA Agent가 실제 AppRoute 불일치 `DQA-MEDIUM-007`과 고유 배경 토큰·system semantic 대체 기준 충돌 `DQA-MEDIUM-008`을 확인해 `verification_in_progress -> rework_requested`로 전환했다.
- 2026-08-04: Design Lead Agent가 두 결함을 실제 `[StepPreview]` route 정렬과 고유 색상·system semantic 적용 슬롯 분리의 WP-R1~R2로 범위화했다.
- 2026-08-04: Product Owner가 Design Lead 추천안을 승인해 `rework_requested -> scoped -> approved`로 전환하고 UI/UX Design Agent에 재라우팅했다.
- 2026-08-04: UI/UX Design Agent가 재작업 lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-08-04: `DQA-MEDIUM-007~008` 수정과 기존 통과 항목 회귀 검증을 완료하고 lock을 해제해 `in_progress -> verification_ready`로 전환했다.
- 2026-08-04: Design QA Agent가 WP-R1~R2 독립 재검증 lock을 획득하고 `verification_ready -> verification_in_progress`로 전환했다.
- 2026-08-04: Design QA Agent가 `DQA-MEDIUM-007~008` 수용 기준과 23개 상태·대비·접근성 최소 회귀를 통과시켜 `verification_in_progress -> verification_passed`로 전환했다.
- 2026-08-04: Design Lead Agent가 QA PASS, 산출물 완결성, 잔여 리스크와 후속 Task 연결을 검토해 `verification_passed -> completion_review`로 전환했다.
- 2026-08-04: 실제 SwiftUI 화면 Visual QA와 오래된 Navigation 문서 동기화가 `T-20260728-003`에 명시돼 있어 현재 Task를 `completion_review -> done`으로 확정했다.
- 2026-08-05: Development Lead Agent가 공용 완료 Task와 겹친 로컬 임시 ID를
  `T-20260805-001`로 재번호하고 Task·보고서·QA·보드·T-003 참조를 동기화했다.
- 다음 담당: 없음 — Design Task 완료

## 완료 검토 결과

- Design QA 최종 판정 `PASS — verification_passed`를 수용한다.
- `DQA-MEDIUM-007~008` 수용 기준과 기존 23개 상태·대비·접근성 회귀 통과를 확인했다.
- `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md`, 실행 보고서와 QA 보고서가 존재하며 구현자가 추가 제품 해석 없이 사용할 수 있다.
- `T-20260728-003`에 이 Task가 선행 의존성과 Source of Truth로 연결돼 있다.
- 실제 SwiftUI 구현·화면 Visual QA와 `apps/ios/docs/NAVIGATION.md` 동기화는 `T-20260728-003`의 후속 실행 범위이며 현재 Task 완료를 차단하지 않는다.
- Figma MCP와 iOS 코드 변경은 없었다.
