---
schema: aiops.task.v1
id: T-20260730-004
title: iOS CI concurrency·진단·cache·artifact 통합
status: completion_review
type: feature
priority: P1
priority_reason: 중복 실행 비용을 줄이고 실패 원인을 보존하되 불안정한 cache를 피해야 한다.
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
- T-20260730-002
- T-20260730-003
blocks:
- T-20260728-008
- T-20260730-005
parallel_group:
allowed_paths:
- ".github/workflows/ios-build.yml"
- ".github/workflows/ios-xctest.yml"
- ".github/actions/"
- apps/ios/docs/TESTING.md
- ".ai_project/tasks/backlog/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache.md"
- ".ai_project/tasks/active/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache.md"
- ".ai_project/reports/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache-report.md"
- ".ai_project/qa/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache-qa.md"
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
updated_at: '2026-07-31'
report_to: ".ai_project/reports/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache-report.md"
qa_to: ".ai_project/qa/T-20260730-004_harden-ios-ci-concurrency-diagnostics-and-cache-qa.md"
---

# iOS CI concurrency·진단·cache·artifact 통합

## 범위

- 같은 PR의 이전 실행 취소와 최신 실행 유지
- 실패 로그·artifact retention과 요약
- 검증된 최소 cache만 적용하고 DerivedData 오염 방지

## 성공·검증 기준

- 취소가 다른 브랜치 실행을 중단하지 않는다.
- iOS QA Agent가 cache 유무 회귀와 실패 진단 가능성을 검증한다.

## 승인 및 실행 기준

- 2026-07-31 Product Owner가 T-20260730-004 실행을 승인했다.
- 선행 T-20260730-002·003은 모두 `done`이며 hosted 정상 검증을 통과했다.
- 최신 `origin/develop` 완료 SHA `a3d1853`에서 전용 worktree와 Task 브랜치를
  생성했다.
- iOS Agent가 lock을 획득하고 `in_progress`로 전환한 뒤 구현한다.
- concurrency group은 같은 PR의 이전 실행만 취소하고 다른 PR·브랜치 실행을
  취소하지 않아야 한다.
- cache는 독립 검증으로 이득과 비회귀가 확인되는 최소 범위만 허용하며
  DerivedData 전체 cache는 기본적으로 추가하지 않는다.
- 구현 완료 후 iOS QA Agent의 독립 검증과 Development Lead 완료 검토를 거친다.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-31 | Product Owner | transition: proposed -> approved | concurrency·진단·cache·artifact 통합 실행 승인 |
| 2026-07-31 | Development Lead Agent | prepare execution branch | 최신 origin/develop a3d1853 기반 전용 worktree와 Task 브랜치 준비 |
| 2026-07-31 | iOS Agent | transition: approved -> in_progress | 공통 preflight·진단·요약, PR별 concurrency와 cache 적격성 검증 구현 시작 |
| 2026-07-31 | iOS Agent | transition: in_progress -> verification_ready | PR별 concurrency, 공통 진단·summary·artifact, cache 미적용 결정과 build·XCTest 회귀 검증 완료 |

## 실행 결과

- 두 workflow에 workflow·event·PR 번호 또는 ref 기반 concurrency group을
  적용해 같은 PR의 이전 실행만 check별로 취소한다.
- 환경 preflight와 안전한 진단 로그 생성을 공통 composite action으로
  통합했다.
- 성공·실패 결과, cache 정책과 artifact 목록을 Step Summary와
  `ci-summary.md`로 남긴다.
- 기존 build·XCTest artifact에 `ci-environment.log`, `ci-summary.md`를
  추가하고 14일 보존과 DerivedData 제외를 유지했다.
- dependency lockfile과 외부 package가 없어 cache는 적용하지 않았으며
  정책을 `disabled-no-dependency-lockfile`로 명시했다.
- cache 미적용 상태에서 build, build-for-testing과 전체 XCTest 33/33이
  모두 종료 코드 0으로 통과했다.
| 2026-07-31 | iOS QA Agent | transition: verification_ready -> verification_in_progress | concurrency 격리·공통 진단·cache 미적용 build/XCTest 회귀·artifact 경계 독립 검증 |
| 2026-07-31 | iOS QA Agent | transition: verification_in_progress -> verification_passed | 독립 QA PASS_WITH_RISK: concurrency 격리, cache 미적용 build·XCTest 33/33, 실패 진단·summary·artifact 확인; QA-RISK-004-001 hosted 취소 동작 후속 |
| 2026-07-31 | Development Lead Agent | integrate latest develop | QA 결과를 고정한 뒤 origin/develop dedfa74 위로 재정렬하고 T-20260729-021 done과 CI 산출물 동등성 보존 |
| 2026-07-31 | Development Lead Agent | transition: verification_passed -> completion_review | 성공 기준, 독립 QA PASS_WITH_RISK, 허용 경로와 비차단 잔여 위험 인계를 수용해 hosted PR 검증 대기로 전환 |

## Development Lead 완료 검토

- iOS QA 최종 판정: `PASS_WITH_RISK`
- 재정렬 전 검증 대상 커밋: `f2efd4f`
- 재정렬 후 구현 커밋: `bd109e6`
- 재정렬 후 QA 고정 커밋: `3ace799`
- workflow·composite action·TESTING·Task·보고서 내용 동등성: 확인
- concurrency group의 workflow·event·PR/ref 격리: 적합
- cache 미적용 build·build-for-testing·XCTest: 33/33 PASS
- 의도적 build 실패 65·XCTest timeout 124 진단 보존: PASS
- DerivedData·secret·사용자 입력 artifact 제외: 확인
- workflow·action YAML·XCTest runner 문법: PASS
- Task strict validation·`git diff --check`: PASS
- 변경 11개 경로: Task `allowed_paths` 안
- 최신 `origin/develop` 대비 뒤처짐: 0
- `T-20260729-021 done`과 공용 보드: 보존
- 미해결 차단 결함: 없음

`QA-RISK-004-001`의 hosted 정상 preflight·summary·artifact는 T-004 PR의
`ios-build`·`ios-xctest` 성공을 merge gate로 확인한다. 같은 PR 연속 실행 취소와
의도적 실패의 hosted 진단은 계획된 `T-20260730-005` dry run으로 인계한다.

Development Lead가 성공 기준과 독립 QA 증빙을 수용해 `completion_review`로
전환한다. 필수 hosted check 통과 후 `develop` 병합 대상으로 확정한다.
