---
schema: aiops.task.v1
id: T-20260730-002
title: ios-build·build-for-testing workflow 구현
status: verification_passed
type: feature
priority: P0
priority_reason: 모든 develop PR에서 컴파일과 테스트 빌드 실패를 자동 차단해야 한다.
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
- ".github/workflows/ios-build.yml"
- apps/ios/docs/TESTING.md
- ".ai_project/tasks/backlog/T-20260730-002_implement-ios-build-workflow.md"
- ".ai_project/tasks/active/T-20260730-002_implement-ios-build-workflow.md"
- ".ai_project/reports/T-20260730-002_implement-ios-build-workflow-report.md"
- ".ai_project/qa/T-20260730-002_implement-ios-build-workflow-qa.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
source_of_truth:
- docs/GIT_WORKFLOW.md
- apps/ios/docs/TESTING.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: '2026-07-30'
report_to: ".ai_project/reports/T-20260730-002_implement-ios-build-workflow-report.md"
qa_to: ".ai_project/qa/T-20260730-002_implement-ios-build-workflow-qa.md"
---

# ios-build·build-for-testing workflow 구현

## 범위

- `develop`·`main` 대상 PR의 `ios-build` workflow
- build와 build-for-testing 실행, 명확한 실패 반환
- 최소 권한과 secret 비노출

## 성공·검증 기준

- 성공·컴파일 실패를 재현할 수 있다.
- iOS QA Agent가 check 이름과 실패 감지를 독립 검증한다.

## 승인 및 실행 순서

- 2026-07-30 Product Owner가 실행을 승인했다.
- 단일 iOS Agent 운영 기준으로 이 Task를 먼저 실행한다.
- 최신 `origin/develop` 기반 전용 worktree와 Task 브랜치를 사용한다.
- 구현 완료 후 iOS QA Agent의 독립 검증과 Development Lead 완료 검토를 거친다.
- `T-20260730-003`은 이 Task가 `done`으로 확정된 뒤 시작한다.

## 실행 결과

- `develop`·`main` 대상 pull request와 수동 실행에서 단일 `ios-build`
  check를 생성하는 workflow를 구현했다.
- 고정 Xcode·Simulator preflight 뒤 같은 DerivedData에서 `build`,
  `build-for-testing`을 순차 실행한다.
- `set -euo pipefail`로 `tee` 뒤에서도 컴파일 실패 종료 코드를 보존한다.
- build log 두 개만 성공·실패와 무관하게 14일 artifact로 업로드한다.
- 권한은 `contents: read`이며 checkout credential, secret, 원격 STT 설정을
  사용하지 않는다.
- 로컬 iPhone 17·iOS 26.5에서 정상 build 두 단계와 의도적 컴파일 실패
  종료 코드 65를 재현했다.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-30 | Product Owner | approve | T-002 실행과 T-003 이전 순차 처리 승인 |
| 2026-07-30 | iOS Agent | lock | 전용 worktree에서 구현 시작 |
| 2026-07-30 | iOS Agent | transition: approved -> in_progress | workflow 구현과 개발자 검증 착수 |
| 2026-07-30 | iOS Agent | transition: in_progress -> verification_ready | 정상 build·build-for-testing과 컴파일 실패 감지, YAML·허용 경로 검증 완료 |
| 2026-07-30 | iOS QA Agent | transition: verification_ready -> verification_in_progress | ios-build workflow trigger·권한·preflight·정상/컴파일 실패·artifact 경계 독립 검증 |
| 2026-07-30 | iOS QA Agent | transition: verification_in_progress -> verification_passed | preflight·정상 build/build-for-testing·컴파일 실패 종료 코드 65·권한·artifact 계약 독립 검증 PASS_WITH_RISK, hosted dry run은 T-005 인계 |
