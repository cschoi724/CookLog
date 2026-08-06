---
schema: aiops.task.v1
id: T-20260805-004
title: iOS Cooking Log·STEP Preview 자동 저장·오류 상태 구현
status: verification_ready
type: feature
priority: P0
priority_reason: 10초 기록 반복과 STEP Preview 보존이 CookLog 핵심 기록 경험이다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: iOS QA Agent
target_role: Verification Role
required_capabilities: [ios_implementation, swiftui, state_management]
depends_on: [T-20260805-003]
blocks: [T-20260805-005, T-20260728-003]
parallel_group:
allowed_paths:
  - apps/ios/CookLog/App/AppEnvironment.swift
  - apps/ios/CookLog/App/CookLogApp.swift
  - apps/ios/CookLog/Features/CookingLog/
  - apps/ios/CookLog/Domain/
  - apps/ios/CookLogTests/
  - apps/ios/docs/STATUS.md
  - apps/ios/docs/DEVELOPMENT_PLAN.md
  - apps/ios/docs/CHANGELOG.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
  - apps/ios/docs/SERVICES.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-05
updated_at: 2026-08-06
report_to: .ai_project/reports/T-20260805-004_ios-cooking-log-step-preview-report.md
qa_to: .ai_project/qa/T-20260805-004_ios-cooking-log-step-preview-qa.md
---

# iOS Cooking Log·STEP Preview 자동 저장·오류 상태 구현

## 범위

- Mock Service 기반 10초 기록 반복과 idle·recording·processing 상태
- STEP Preview 자동 저장·삭제·되돌리기·순서 보존
- pending STEP, 권한·녹음·처리 오류와 기존 STEP 보존
- 누적 `[StepPreview]`의 AI Review route 전달

## 성공 기준

- Cooking Log Core Loop 5개 인수 상태와 반복 기록·오류 회복을 검증한다.
- 실패한 pending만 제거하고 기존 완료 STEP과 draft를 보존한다.
- 실제 Apple STT 구현은 `T-20260729-004` 범위로 남긴다.

## 승인 및 실행 경계

- 2026-08-05: 공용 `develop@9457133`에서 선행 `T-20260805-003`의 `done`과 PR #86
  squash merge를 확인했다.
- 2026-08-05: Product Owner가 `T-20260805-004`의 별도 실행을 승인했다. Development
  Lead Agent가 `proposed -> approved`로 전환하고 iOS Agent에 인계한다.
- 2026-08-06: iOS Agent가 최신 `origin/develop@69cbf81` 기반 전용 worktree에서 lock을
  획득하고 `approved -> in_progress`로 전환했다.
- 2026-08-06: Product Owner가 실제 STEP 자동 저장 DI에 필요한
  `AppEnvironment.swift`와 `CookLogApp.swift`의 최소 허용 경로 확장을 승인했다.
- 2026-08-06: iOS Agent가 Cooking Log 5개 상태, 같은 record STEP 자동 저장,
  삭제·되돌리기와 오류 보존을 구현했다. 집중 14개·전체 XCTest 62/62·build와 iPhone SE
  실제 반복 기록을 통과해 `in_progress -> verification_ready`로 전환하고 lock을 해제했다.
- 구현은 기존 Mock Service를 이용한 `idle -> recording -> processing -> idle|error`,
  반복 기록과 STEP Preview 자동 저장·삭제·되돌리기·순서 보존으로 제한한다.
- 첫 처리와 반복 처리 모두 pending STEP 번호를 정확히 표시하고, 실패 시 실패한 pending만
  제거하며 기존 완료 STEP과 같은 `RecipeRecord.id`의 draft를 보존한다.
- `AI 정리하기`는 누적된 동일 `[StepPreview]` snapshot을 다음 route로 전달하는 경계까지만
  구현한다. AI 생성·Review 내부 동작은 `T-20260805-005`에서 수행한다.
- 실제 마이크 녹음·Apple 기기 내 STT는 `T-20260729-004`, 앱 전역 권한·오프라인·서비스
  장애 경험은 `T-20260805-007`, 접근성·작은 화면 통합 회귀는 `T-20260805-008` 범위다.
- 최신 `origin/develop` 기반 전용 worktree에서 lock을 획득한 후 `in_progress`로 전환한다.
  자체 구현 완료 뒤 보고서와 테스트 결과를 남기고 iOS QA Agent에 독립 검증을 인계한다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 iOS QA Agent / Verification Role이야.
Task T-20260805-004는 구현과 자체 검증을 완료한 Cooking Log 독립 검증 Task야.

- 현재 상태: `verification_ready`
- public source: `origin/develop@69cbf81`
- 선행 상태: `T-20260805-003 done`, PR #86 squash merge 완료
- 구현 ref: `task/T-20260805-004-implement-ios-cooking-log-step-preview`
- 시작 절차: 독립 QA worktree에서 구현 ref 검증, Task lock 획득,
  `verification_ready -> verification_in_progress`
- 필수 상태: `LOG-EMPTY`, `LOG-RECORDING`, `LOG-PROCESSING`, `LOG-STEP-ADDED`,
  `LOG-ERROR`
- 데이터 계약: 같은 `RecipeRecord.id`, 완료 STEP 순서·원문 보존, 실패한 pending만 제거,
  반복 성공 때 order 증가, 누적 `[StepPreview]` snapshot 전달
- 구현 완료: Mock 기록 상태, pending STEP, 자동 저장, swipe·44pt 삭제, 제한 시간 Undo,
  오류별 복구와 저장 실패 원본 보존
- 자체 검증: 집중 XCTest 14개, 전체 62/62, build, iPhone SE 375×667 Dark 첫·반복 기록
- 구현 경계: 실제 녹음·Apple STT, AI Review 내부 구현, T-005~008 범위는 검증 대상 아님
- 기준 문서: `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md`,
  `apps/ios/docs/SERVICES.md`, `apps/ios/docs/NAVIGATION.md`
- 허용 경로: Task frontmatter의 `allowed_paths`
- 완료 조건: QA 보고서에 5개 상태, 동일 ID 자동 저장·재실행, 삭제·Undo와 실패 보존,
  기존 전체 회귀를 기록하고 QA workflow에 따라 Development Lead에 인계해.
