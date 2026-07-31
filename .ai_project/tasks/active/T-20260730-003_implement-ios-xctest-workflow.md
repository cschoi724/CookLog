---
schema: aiops.task.v1
id: T-20260730-003
title: ios-xctest 직렬 실행·timeout·artifact workflow 구현
status: verification_passed
type: feature
priority: P0
priority_reason: 전체 XCTest 결과와 timeout을 PR에서 재현 가능하게 만들어야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Completion Role
required_capabilities:
- ios_qa
- regression_test
depends_on:
- T-20260730-001
blocks:
- T-20260728-008
- T-20260730-004
parallel_group: ios-ci-workflows
allowed_paths:
- ".github/workflows/ios-xctest.yml"
- apps/ios/docs/TESTING.md
- ".ai_project/tasks/backlog/T-20260730-003_implement-ios-xctest-workflow.md"
- ".ai_project/tasks/active/T-20260730-003_implement-ios-xctest-workflow.md"
- ".ai_project/reports/T-20260730-003_implement-ios-xctest-workflow-report.md"
- ".ai_project/qa/T-20260730-003_implement-ios-xctest-workflow-qa.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
source_of_truth:
- apps/ios/Scripts/run-xctest.sh
- apps/ios/docs/TESTING.md
- docs/GIT_WORKFLOW.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: '2026-07-31'
report_to: ".ai_project/reports/T-20260730-003_implement-ios-xctest-workflow-report.md"
qa_to: ".ai_project/qa/T-20260730-003_implement-ios-xctest-workflow-qa.md"
---

# ios-xctest 직렬 실행·timeout·artifact workflow 구현

## 범위

- `Scripts/run-xctest.sh`를 사용하는 `ios-xctest` workflow
- timeout 124와 일반 실패 구분
- 성공·실패 시 log, `xcresult`, `TIMED_OUT` artifact 업로드

## 성공·검증 기준

- 전체 XCTest가 고정 환경에서 명확히 종료된다.
- iOS QA Agent가 통과·테스트 실패·timeout artifact를 독립 검증한다.

## 승인 및 실행 순서

- 2026-07-30 Product Owner가 T-002와 T-003의 순차 실행을 승인했다.
- 2026-07-31 `T-20260730-002`가 PR #24·#25를 거쳐 `done`으로 확정됐다.
- 최신 `origin/develop`의 완료 SHA `54053d2`에서 전용 worktree와 Task
  브랜치를 생성했다.
- iOS Agent가 lock을 획득하고 `in_progress`로 전환한 뒤 구현한다.
- 구현 완료 후 iOS QA Agent의 독립 검증과 Development Lead 완료 검토를
  거친다.

## 실행 결과

- `develop`·`main` 대상 pull request와 수동 실행에서 단일 `ios-xctest`
  check를 생성하는 workflow를 구현했다.
- 고정 Xcode·Simulator preflight 후 기존 `run-xctest.sh`만 실행한다.
- script의 정상 종료, 일반 실패와 timeout 124를 workflow 결과로 그대로
  전달한다.
- log, 조건부 xcresult와 `TIMED_OUT`만 성공·실패와 무관하게 14일
  artifact 대상으로 지정하고 DerivedData는 제외했다.
- 권한은 `contents: read`이며 checkout credential, secret, 원격 STT 설정을
  사용하지 않는다.
- 로컬 iPhone 17·iOS 26.5에서 전체 XCTest 33/33, 일반 실패 65,
  timeout 124와 각 artifact를 재현했다.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-30 | Product Owner | approve | T-002 done 후 T-003 순차 실행 승인 |
| 2026-07-31 | Development Lead Agent | prepare execution branch | T-002 완료 SHA 54053d2 기반 전용 worktree와 Task 브랜치 준비 |
| 2026-07-31 | iOS Agent | lock | 전용 worktree에서 구현 시작 |
| 2026-07-31 | iOS Agent | transition: approved -> in_progress | workflow 구현과 개발자 검증 착수 |
| 2026-07-31 | iOS Agent | transition: in_progress -> verification_ready | XCTest 33/33, 일반 실패 65, timeout 124·artifact 및 정적 검증 완료 |
| 2026-07-31 | iOS QA Agent | transition: verification_ready -> verification_in_progress | ios-xctest workflow 정상·일반 실패·timeout·artifact 경계 독립 검증 |
| 2026-07-31 | iOS QA Agent | transition: verification_in_progress -> verification_passed | 독립 QA PASS_WITH_RISK: XCTest 33/33, 일반 실패 65, timeout 124 및 artifact 경계 확인; QA-RISK-003-001 hosted 실행 후속 확인 |
