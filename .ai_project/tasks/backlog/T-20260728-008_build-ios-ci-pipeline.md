---
id: T-20260728-008
title: iOS CI 기본 파이프라인 구축
status: proposed
type: feature
priority: P1
priority_reason: PR 기반 개발에서 재현 가능한 build와 test 검증을 자동화해야 한다.
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
  - T-20260728-004
  - T-20260728-007
blocks:
  - T-20260728-009
parallel_group:
allowed_paths:
  - .github/
  - apps/ios/
  - docs/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - T-20260728-004에서 확정된 XCTest 실행 기준
  - T-20260728-007에서 확정된 Git·PR·CI 정책
  - apps/ios/docs/TESTING.md
  - apps/ios/README.md
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
report_to: .ai_project/reports/T-20260728-008_build-ios-ci-pipeline-report.md
qa_to: .ai_project/qa/T-20260728-008_build-ios-ci-pipeline-qa.md
---

# iOS CI 기본 파이프라인 구축

## 목적

승인된 Git/PR 정책과 안정화된 테스트 명령을 사용해 iOS build와 test를 자동 검증한다.

## 제안 범위

- GitHub Actions 기반 iOS workflow 후보
- 프로젝트 build와 build-for-testing
- 전체 또는 승인된 XCTest 실행
- timeout, 로그, `xcresult` artifact 보존
- 캐시와 동시 실행 취소 기준
- required check 적용 전 검증

## 성공 기준

- PR 또는 지정 브랜치 이벤트에서 CI가 자동 실행된다.
- build와 승인된 test command가 명확한 성공·실패 결과를 반환한다.
- 실패 시 진단 가능한 로그와 결과물이 남는다.
- secret이 workflow와 로그에 노출되지 않는다.
- iOS QA Agent가 실패 감지와 회귀 검증 기준을 확인한다.

## 사용자 결정 필요 항목

- GitHub Actions를 공식 CI로 사용할지
- 사용할 Xcode/macOS runner 버전
- 실제 repository required check와 branch protection 적용 승인
