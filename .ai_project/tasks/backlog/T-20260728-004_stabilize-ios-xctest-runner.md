---
id: T-20260728-004
title: iOS XCTest runner 대기 원인 조사와 테스트 실행 안정화
status: proposed
type: bugfix
priority: P0
priority_reason: 전체 XCTest가 종료되지 않아 회귀 검증과 CI required check 구성이 차단된다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: bugfix
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities:
  - technical_planning
  - dependency_management
depends_on:
  - T-20260729-001
blocks:
  - T-20260728-008
  - T-20260728-009
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
  - apps/ios/agents.md
  - apps/ios/docs/TESTING.md
  - apps/ios/docs/STATUS.md
  - apps/ios/CookLog.xcodeproj/project.pbxproj
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260728-004_stabilize-ios-xctest-runner-report.md
qa_to: .ai_project/qa/T-20260728-004_stabilize-ios-xctest-runner-qa.md
---

# iOS XCTest runner 대기 원인 조사와 테스트 실행 안정화

## 목적

`waiting for workers to materialize`와 Simulator runner 설치·실행 대기의 재현 원인을 확인하고 로컬과 CI에서 사용할 안정적인 XCTest 실행 기준을 만든다.

## 제안 범위

- 현재 Xcode 15.2, iOS 17.2 Simulator 재현 조건 수집
- Scheme, test plan, test host, signing, destination과 Simulator 상태 점검
- 전체 테스트와 선별 테스트 차이 분석
- 반복 가능한 해결책 또는 신뢰 가능한 우회 명령 확정
- timeout과 `xcresult` 수집 기준 정의
- 테스트 문서와 CI 선행 조건 갱신

## 성공 기준

- 전체 XCTest가 반복 실행되어 명확한 종료 코드와 결과를 반환하거나, 환경 한계가 재현 가능한 원인으로 확정된다.
- CI에서 사용할 테스트 명령, timeout, 결과물 보존 기준이 정리된다.
- iOS QA Agent가 동일 절차로 결과를 재현한다.

## 사용자 결정 필요 항목

- Xcode 15.2 고정을 유지할지
- 로컬 제약이 해소되지 않을 경우 최신 Hosted Runner 결과를 공식 기준으로 허용할지
