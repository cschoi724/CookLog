---
schema: aiops.task.v1
id: T-20260805-005
title: iOS AI Review·완료 Recipe 편집·삭제 구현
status: done
type: feature
priority: P0
priority_reason: 기록을 사용자가 검토 가능한 Recipe로 전환하고 수정·저장 실패에서도 입력을 보존해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Completion Role
required_capabilities: [ios_implementation, swiftui, state_management]
depends_on: [T-20260805-004]
blocks: [T-20260805-006, T-20260728-003]
parallel_group:
allowed_paths:
  - apps/ios/CookLog/App/AppEnvironment.swift
  - apps/ios/CookLog/App/AppRoute.swift
  - apps/ios/CookLog/App/CookLogApp.swift
  - apps/ios/CookLog/Features/AIReview/
  - apps/ios/CookLog/Features/RecipeDetail/
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
  - apps/ios/docs/NAVIGATION.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-05
updated_at: 2026-08-07
report_to: .ai_project/reports/T-20260805-005_ios-ai-review-recipe-editing-report.md
qa_to: .ai_project/qa/T-20260805-005_ios-ai-review-recipe-editing-qa.md
---

# iOS AI Review·완료 Recipe 편집·삭제 구현

## 범위

- Mock AI 처리·오류·재시도와 Review 필드·단계 편집
- 수동 임시 저장, 이탈 경고, 변경 버리기 snapshot 복원
- 완료 Recipe 수정·영구 삭제·저장 실패 보존
- 키보드 회피와 `[StepPreview]` 입력 유지

## 성공 기준

- AI Review 5개 Core Loop 상태와 Recipe Detail 관련 상태를 검증한다.
- 생성·저장 실패에서도 모든 입력과 원본 STEP Preview가 보존된다.
- 실제 Backend AI 연동은 `T-20260729-005` 범위로 남긴다.

## 승인 및 실행 경계

- 2026-08-06: 공용 `develop@4a86bf7`에서 선행 `T-20260805-004`의 `done`과 PR #90
  squash merge를 확인했다.
- 2026-08-06: Product Owner가 `T-20260805-005`의 별도 실행을 승인했다. Development
  Lead Agent가 `proposed -> approved`로 전환하고 iOS Agent에 인계한다.
- 2026-08-06: Product Owner가 동일 record ID와 완료 Recipe 편집·삭제 DI·routing에
  필요한 `AppEnvironment.swift`, `AppRoute.swift`, `CookLogApp.swift`의 최소 허용 경로
  확장을 승인했다. iOS Agent가 최신 `origin/develop@493743e` 기반 전용 worktree에서
  lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-08-07: iOS Agent가 동일 UUID·STEP snapshot Mock AI 생성, Review 편집·임시 저장·
  이탈 복원, 완료 Recipe 수정·영구 삭제와 실패 보존을 구현했다. 전체 XCTest 72/72,
  build와 iPhone 15 Light/Dark Review 실제 화면을 확인해 `in_progress ->
  verification_ready`로 전환하고 lock을 해제했다.
- 2026-08-07: iOS QA Agent가 구현 커밋 `fad09ed`를 고정한 별도 QA worktree에서 lock을
  획득하고 `verification_ready -> verification_in_progress`로 전환했다.
- 2026-08-07: iOS QA Agent가 Review 5개 상태, 동일 UUID·STEP snapshot, 생성·임시/최종
  저장 실패 보존, 완료 Recipe 수정·삭제 실패 재시도와 전체 XCTest 72/72를 독립 확인했다.
  차단 결함이 없어 `verification_in_progress -> verification_passed`로 전환하고
  Development Lead Agent / Completion Role에 인계했다.
- 2026-08-07: Development Lead Agent가 최신 `origin/develop@02e6d80` 포함 여부, 허용
  경로, 구현·QA 보고서와 PR #94 iOS build·XCTest checks를 검토했다. 차단 결함이 없어
  완료 리뷰를 `PASS_WITH_RISK`로 확정하고 `verification_passed -> completion_review`로
  전환해 Product Owner의 완료·병합 승인을 요청한다.
- 2026-08-07: Product Owner가 후속 Task로 이관한 잔여 위험을 수용하고 완료·병합을
  승인했다. PR #94를 `develop`에 squash merge하고 merge SHA
  `7c26ebbcd2f98bb883d017dc420399c19aead8cf`를 확인해 `completion_review -> done`으로
  확정했다. T-006 선행은 공용 `develop`에서 해소됐지만 별도 실행 승인 전에는
  `proposed`로 유지한다.
- AI 생성은 기존 Mock 경계를 사용하고 실제 Backend provider·네트워크 연동을 선행하지 않는다.
- Cooking Log에서 전달된 동일 `[StepPreview]`와 `RecipeRecord.id`를 유지하며, 생성·저장·
  삭제 실패가 기존 입력이나 저장 원본을 변경하지 않게 한다.
- `REVIEW-PROCESSING`, `REVIEW-EDITABLE`, `REVIEW-GENERATION-ERROR`, `REVIEW-SAVING`,
  `REVIEW-SAVE-ERROR`와 Recipe Detail 조회·편집·삭제 경계를 구현한다.
- Audio Guide·핸즈프리 UI는 `T-20260805-006`, 전역 권한·오프라인·서비스 장애는
  `T-20260805-007`, 통합 접근성·시각 회귀는 `T-20260805-008` 범위로 유지한다.
- 최신 `origin/develop` 기반 전용 worktree에서 lock을 획득한 후 `in_progress`로 전환한다.
  자체 구현 완료 뒤 보고서와 테스트 결과를 남기고 iOS QA Agent에 독립 검증을 인계한다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Development Lead Agent야.
Task T-20260805-005는 독립 QA와 완료 리뷰를 통과하고 PR #94로 `develop`에 병합된
`done` Task야.

- public source: `origin/develop@7c26ebb`
- PR #94: squash merge 완료
- merge SHA: `7c26ebbcd2f98bb883d017dc420399c19aead8cf`
- 후속 `T-20260805-006`: 선행 해소, 별도 Product Owner 실행 승인 대기
- 실제 Backend AI·네트워크는 `T-20260729-005`, 로컬 TTS·음성 인식 엔진은
  `T-20260729-006` 범위로 유지해.
