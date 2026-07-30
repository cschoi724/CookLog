---
schema: aiops.task.v1
id: T-20260730-007
title: iOS 26.5 SwiftData XCTest crash 진단과 최소 수정
status: verification_passed
type: bugfix
priority: P0
priority_reason: T-20260730-001이 확정한 CI destination에서 SwiftData 저장소 테스트 3개가 crash해
  iOS CI workflow 착수가 차단됐다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: bugfix
target_agent: Development Lead Agent
target_role: Completion Role
required_capabilities:
- ios_qa
- regression_test
depends_on:
- T-20260728-004
blocks:
- T-20260730-001
- T-20260730-003
parallel_group: ios-ci-foundation
allowed_paths:
- apps/ios/CookLogTests/
- apps/ios/CookLog/Data/DataSources/SwiftDataRecipeLocalDataSource.swift
- apps/ios/CookLog/Data/Persistence/
- ".ai_project/tasks/active/T-20260730-007_diagnose-ios26-swiftdata-test-crash.md"
- ".ai_project/reports/T-20260730-007_diagnose-ios26-swiftdata-test-crash-report.md"
- ".ai_project/qa/T-20260730-007_diagnose-ios26-swiftdata-test-crash-qa.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
source_of_truth:
- apps/ios/docs/TESTING.md
- apps/ios/CookLogTests/SwiftDataRecipeLocalDataSourceTests.swift
- T-20260730-001 iOS QA FAIL 및 QA-HIGH-001
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: '2026-07-30'
report_to: ".ai_project/reports/T-20260730-007_diagnose-ios26-swiftdata-test-crash-report.md"
qa_to: ".ai_project/qa/T-20260730-007_diagnose-ios26-swiftdata-test-crash-qa.md"
---

# iOS 26.5 SwiftData XCTest crash 진단과 최소 수정

## 목적

Xcode 26.6·iPhone 17·iOS 26.5에서 `SwiftDataRecipeLocalDataSourceTests` 3개가 crash하는 원인을 재현하고, CI 환경을 회피하지 않는 최소 수정으로 전체 XCTest를 복구한다.

## 범위

- QA artifact와 동일 destination에서 실패 3개를 우선 재현
- crash stack과 CoreData·SwiftData 진단 로그로 제품 구현, 테스트 fixture 생명주기, Simulator runtime 문제를 구분
- 원인이 저장소 또는 테스트 harness이면 허용 경로 안에서 최소 수정
- iOS 26.5 전체 XCTest 33개와 가능하면 T-004 iOS 17.2 회귀 검증
- 원인이 Apple runtime 결함으로 확인되면 공식 hosted 대체 환경 후보와 근거만 보고하고 계약은 변경하지 않음

## 제외

- CI workflow 구현
- required check 또는 repository 외부 설정
- 근거 없는 Simulator·runtime 하향 변경
- STT 정책 또는 원격 STT adapter 변경

## 성공·검증 기준

- iOS 26.5 crash 원인과 재현 절차가 보고서에 남는다.
- 최소 수정 후 Xcode 26.6·iPhone 17·iOS 26.5 전체 XCTest가 33/33, 종료 코드 0이다.
- 변경이 제품 데이터 보존·정렬·삭제 동작을 약화하지 않는다.
- iOS QA Agent가 동일 destination에서 독립 재검증할 수 있다.

## 실행 결과

- 수정 전 iOS 26.5에서 저장소 테스트 3개가 모두 `SIGTRAP`으로 crash하고
  `xcodebuild`가 65를 반환하는 현상을 재현했다.
- 세 crash stack은 모두 첫 저장 전
  `SwiftDataRecipeLocalDataSource.fetchPersistentRecipe(id:)`의
  `SwiftData.framework` 내부에서 종료됐다.
- 테스트 helper가 만든 `ModelContainer`와 `SwiftDataRecipeLocalDataSource`를
  하나의 `TestStore`가 함께 보유해 테스트 종료까지 container 수명을 보장하도록
  최소 수정했다.
- 수정 후 iOS 26.5 선택 테스트 3/3과 전체 XCTest 33/33이 종료 코드 0으로
  통과했다.
- T-004 기준 iOS 17.2 전체 XCTest도 33/33, 종료 코드 0으로 통과했다.
- 제품 저장소와 저장·조회·정렬·삭제 assertion은 변경하지 않았다.

## 상태 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-30 | Development Lead Agent | create and scope | T-20260730-001 독립 QA FAIL 재조율 |
| 2026-07-30 | Product Owner | approve | SwiftData crash 진단·최소 수정 실행 승인 |

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-30 | iOS Agent | lock | task lock |
| 2026-07-30 | iOS Agent | transition: approved -> in_progress | Product Owner 승인에 따라 iOS 26.5 SwiftData crash 진단과 최소 수정 시작 |
| 2026-07-30 | iOS Agent | transition: in_progress -> verification_ready | SwiftData test container 수명 최소 수정 후 iOS 26.5·17.2 전체 XCTest 33/33 통과 및 QA 인계 |
| 2026-07-30 | iOS QA Agent | transition: verification_ready -> verification_in_progress | Xcode 26.6 iPhone 17 iOS 26.5 및 iPhone 15 iOS 17.2 독립 XCTest와 변경 범위 검증 |
| 2026-07-30 | iOS QA Agent | transition: verification_in_progress -> rework_requested | 기능 XCTest는 iOS 26.5·17.2에서 모두 33/33 통과했으나 QA-HIGH-007-001 allowed_paths 밖 .ai_project/task_board.md 변경 확인 |
| 2026-07-30 | Product Owner | approve rework | QA-HIGH-007-001 해소를 위한 allowed_paths 밖 루트 Task board 변경 제거 승인 |
| 2026-07-30 | Development Lead Agent | transition: rework_requested -> verification_ready | `.ai_project/task_board.md`를 origin/develop과 동일하게 복원하고 승인된 변경 경로만 남겨 iOS QA 재검증 인계 |
| 2026-07-30 | iOS QA Agent | transition: verification_ready -> verification_in_progress | 61fca6d 재작업 커밋의 QA-HIGH-007-001 해소와 SwiftData 핵심 XCTest 재검증 |
| 2026-07-30 | iOS QA Agent | transition: verification_in_progress -> verification_passed | QA-HIGH-007-001 해소, 변경 파일 6개 allowed_paths 준수, 재작업 커밋 핵심 XCTest 3/3 및 기존 iOS 26.5·17.2 전체 33/33 확인 |
