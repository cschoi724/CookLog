---
schema: aiops.task.v1
id: T-20260730-001
title: iOS CI 환경·명령·check 계약 확정
status: verification_ready
type: docs
priority: P0
priority_reason: workflow 구현 전에 지원 runner·Xcode·Simulator와 고정 check 이름을 합의해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: docs
target_agent: iOS QA Agent
target_role: Verification Role
required_capabilities:
- ios_qa
- regression_test
depends_on:
- T-20260728-004
- T-20260728-007
blocks:
- T-20260728-008
- T-20260730-002
- T-20260730-003
parallel_group: ios-ci-foundation
allowed_paths:
- apps/ios/README.md
- apps/ios/docs/TESTING.md
- docs/GIT_WORKFLOW.md
- ".ai_project/tasks/backlog/T-20260730-001_define-ios-ci-environment-and-check-contract.md"
- ".ai_project/tasks/active/T-20260730-001_define-ios-ci-environment-and-check-contract.md"
- ".ai_project/reports/T-20260730-001_define-ios-ci-environment-and-check-contract-report.md"
- ".ai_project/qa/T-20260730-001_define-ios-ci-environment-and-check-contract-qa.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
source_of_truth:
- apps/ios/docs/TESTING.md
- apps/ios/README.md
- docs/GIT_WORKFLOW.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: '2026-07-30'
report_to: ".ai_project/reports/T-20260730-001_define-ios-ci-environment-and-check-contract-report.md"
qa_to: ".ai_project/qa/T-20260730-001_define-ios-ci-environment-and-check-contract-qa.md"
---

# iOS CI 환경·명령·check 계약 확정

## 범위

- GitHub macOS runner, Xcode와 iOS Simulator 조합 명시
- `ios-build`, `ios-xctest` check 이름과 실행 명령
- `build`, `build-for-testing`, `Scripts/run-xctest.sh` 경계
- workflow·스크립트 timeout과 artifact 경로

## 성공·검증 기준

- 이후 workflow Task가 추가 해석 없이 구현할 수 있다.
- iOS QA Agent가 로컬 T-004 기준과 CI 계약의 차이를 독립 검토한다.

## 확정 계약

- GitHub-hosted runner: `macos-26` arm64
- Xcode: 26.6 (`17F113`)
- `DEVELOPER_DIR`: `/Applications/Xcode_26.6.app/Contents/Developer`
- Simulator: iPhone 17, iOS 26.5
- destination: `platform=iOS Simulator,name=iPhone 17,OS=26.5`
- check: `ios-build`, `ios-xctest`
- `ios-build`: `build` 후 `build-for-testing`, job timeout 15분
- `ios-xctest`: `Scripts/run-xctest.sh`, script timeout 600초, job timeout 15분
- timeout: script 종료 코드 124와 `TIMED_OUT`
- artifact root: `${RUNNER_TEMP}/cooklog-ci/${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}`
- artifact 보존: build log와 XCTest log·조건부 xcresult·timeout marker, 14일
- required check 외부 설정: `T-20260730-006`에서 Product Owner 별도 승인 후 수행

## 제품 정책 경계

첫 출시 STT는 Apple 기기 내 처리가 기본이며 원격 STT는 기본 비활성 adapter로만 유지한다. CI는 원격 STT secret, endpoint 또는 활성화 flag를 요구하지 않는다.

## iOS QA 인계

- T-004 로컬 기준 Xcode 26.6·iPhone 15·iOS 17.2와 CI 기준 Xcode 26.6·iPhone 17·iOS 26.5의 차이를 독립 검토한다.
- 후속 workflow dry run에서 XCTest 33개 통과, timeout 124, log·xcresult artifact와 preflight fail-fast를 재검증한다.
- GitHub-hosted image에는 같은 Xcode 26.6이 있지만 iOS 17.2 runtime이 없어 완전 동일 환경 재현은 불가능하다는 위험을 유지한다.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-30 | Development Lead Agent | transition: proposed -> scoped | Development Lead scope와 하위 Task 등록 완료 |
| 2026-07-30 | Product Owner | transition: scoped -> approved | Product Owner 실행 및 에이전트 인계 승인 |
| 2026-07-30 | iOS Agent | lock | task lock |
| 2026-07-30 | iOS Agent | transition: approved -> in_progress | 최신 origin/develop 기반 전용 worktree에서 실행 시작 |
| 2026-07-30 | iOS Agent | transition: in_progress -> verification_ready | CI 환경·명령·check·timeout·artifact 계약과 T-004 차이 문서화 및 자체 정합성 검증 완료 |
| 2026-07-30 | iOS QA Agent | routing correction and lock | Product Owner 직접 배정과 Team board 인계에 맞춰 stale 실행 라우팅을 Verification Role로 수정하고 독립 검증 시작 |
| 2026-07-30 | iOS QA Agent | transition: verification_in_progress -> rework_requested | 확정 iPhone 17·iOS 26.5 destination에서 SwiftData 저장소 테스트 3개 crash와 종료 코드 65를 확인해 FAIL 판정 |
| 2026-07-30 | Product Owner | approve rework resume | T-20260730-007 완료 근거를 반영해 T-001 재작업을 순차 재개하도록 승인 |
| 2026-07-30 | Development Lead Agent | transition: rework_requested -> verification_ready | T-007 PR #18·#19와 iOS 26.5·17.2 전체 XCTest 33/33, SwiftData crash 해소를 확인하고 기존 CI 계약 변경 없이 iOS QA 재검증 인계 |
