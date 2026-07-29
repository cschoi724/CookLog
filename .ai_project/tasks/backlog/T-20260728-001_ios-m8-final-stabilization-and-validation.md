---
id: T-20260728-001
title: iOS M8 잔여 안정화와 최종 검증
status: cancelled
type: feature
priority: P0
priority_reason: iOS MVP Core Loop의 조건부 통과를 최종 완료 판정으로 닫기 위한 잔여 검증이다.
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
  - T-20260701-002
  - T-20260701-003
blocks: []
parallel_group: ios-m8-and-foundations
allowed_paths:
  - apps/ios/
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
  - apps/ios/agents.md
  - apps/ios/docs/STATUS.md
  - apps/ios/docs/MANUAL_QA_CHECKLIST.md
  - apps/ios/docs/TESTING.md
  - .ai_project/tasks/T-20260701-002_ios-mvp-manual-qa.md
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260728-001_ios-m8-final-stabilization-and-validation-report.md
qa_to: .ai_project/qa/T-20260728-001_ios-m8-final-stabilization-and-validation-qa.md
---

# iOS M8 잔여 안정화와 최종 검증

## 목적

조건부 통과 상태인 iOS M8의 잔여 사람 손 검증을 완료하고, 발견되는 작은 결함만 제한적으로 보정한 뒤 최종 완료 가능 여부를 판단한다.

## 제안 범위

- AI Review의 재료명, 양, STEP 본문, 예상 시간, 메모 문자열 편집 확인
- 작은 화면에서 키보드가 현재 입력 필드와 저장 동작을 가리지 않는지 확인
- 2단계 이상 저장 레시피에서 Audio Player 이전/다음/경계 동작 확인
- 발견된 P1 이상 결함 수정과 회귀 검증
- 작은 문구나 레이아웃 보정은 기능 검증에 직접 필요한 범위로 제한
- M8 최종 판정과 잔여 리스크 문서화

## 제외 범위

- Figma v1 적용을 위한 전면 UI 개편
- 실제 STT, AI API, TTS 연동
- Backend와 CI 구현
- Android 작업

## 성공 기준

- 지정된 모든 편집 필드가 사람 손 입력으로 수정·저장된다.
- 2단계 이상 레시피에서 Audio Player 이동과 경계 상태가 기대대로 동작한다.
- 신규 P1 제품 결함이 없다.
- 발견된 작은 결함은 수정되거나 명시적 잔여 리스크로 기록된다.
- iOS QA Agent가 `PASS` 또는 수용 가능한 `PASS_WITH_RISK`를 기록한다.
- `apps/ios/docs/STATUS.md`와 루트 상태 문서가 최종 판정과 일치한다.

## 사용자 결정 필요 항목

- 실제 iPhone 검증을 M8 완료의 필수 조건으로 둘지
- Simulator에서 사람이 직접 검증한 결과로 M8을 닫을 수 있는지

## Coordination 메모

- Development Lead Agent가 iOS Agent의 준비/보정 범위와 iOS QA Agent의 독립 검증 범위를 분리한다.
- Figma 설계 Task와는 병렬 가능하지만, Figma 적용 Task는 이 Task 완료 후 시작한다.

## 폐기 결정

- 2026-07-29 Product Owner의 출시 계획 재구성 요청에 따라 `cancelled`로 전환했습니다.
- 이 Task가 검증하려던 구형 Mock UI와 제한된 Audio Player 동작은 확정 제품 UX 적용으로 대체됩니다.
- 유효한 편집·작은 화면·다단계 Audio Guide 검증 항목은 `T-20260728-003` 구현 검증과 `T-20260728-009` 최종 출시 게이트에 통합합니다.
- 기존 iOS MVP Core Loop 조건부 통과 이력은 삭제하지 않고 프로젝트 상태와 완료 QA 기록에 보존합니다.
