---
id: T-20260728-004
title: iOS XCTest runner 대기 원인 조사와 테스트 실행 안정화
status: completion_review
type: bugfix
priority: P0
priority_reason: 전체 XCTest가 종료되지 않아 회귀 검증과 CI required check 구성이 차단된다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: bugfix
target_agent: Development Lead Agent
target_role: Completion Role
required_capabilities:
  - development_child_completion
depends_on: []
blocks:
  - T-20260728-008
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
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
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

## Lead 확정 Scope

Development Lead Agent가 다음 기준으로 ownership, 의존성과 실행 순서를 조율했다.

- 하나의 P0 bugfix Task 안에서 3개 순차 실행 패키지와 독립 QA 단계로 진행한다.
- iOS Agent가 진단, 최소 수정과 개발자 검증을 수행하고 iOS QA Agent가 별도 세션에서 최종 절차를 재현한다.
- 진단은 현재 프로젝트 기준인 Xcode 15.2와 iOS 17.2 Simulator에서 시작한다.
- 실행 명령에는 무한 대기를 막는 제한 시간과 결과 로그·`xcresult` 보존 경로를 둔다.
- 제품 기능 코드 변경은 테스트 실행 안정화에 직접 필요한 경우만 허용한다.
- `T-20260728-007`에서 확정한 check 이름을 유지하고 `T-20260728-008`에 테스트 명령, timeout과 artifact 기준을 인계한다.
- Design, Backend와 병렬 실행할 수 있지만 다른 iOS Task와 `apps/ios/` ownership을 동시에 사용하지 않는다.

## 순차 실행 패키지

### WP-1 재현 기준선과 원인 진단

담당: iOS Agent

- Xcode, Simulator runtime, destination과 boot 상태 기록
- `build`, `build-for-testing`, 선별 테스트와 전체 테스트를 동일 destination에서 비교
- Scheme, Test Host, Bundle Loader, signing과 runner 설치·실행 설정 점검
- 제한 시간 내 종료 여부, 관련 process 상태, 로그와 `xcresult` 수집
- 원인을 프로젝트 설정, Simulator 환경, Xcode 15.2 환경 한계 중 하나 이상으로 좁힘

완료 산출물:

- 재현 명령과 관찰 결과
- 원인 가설별 근거
- WP-2에서 적용할 최소 수정안 또는 우회안

### WP-2 실행 안정화

담당: iOS Agent
선행: WP-1

- 확인된 원인에 필요한 최소 프로젝트 설정 또는 실행 절차 수정
- 전체 XCTest가 종료 코드를 반환하도록 명령과 제한 시간 확정
- 성공·실패 시 로그와 `xcresult`가 남는 절차 확정
- `apps/ios/docs/TESTING.md`, `STATUS.md`와 필요한 프로젝트 문서 동기화

### WP-3 개발자 반복 검증과 인계

담당: iOS Agent
선행: WP-2

- 동일 조건에서 전체 XCTest 3회 연속 실행
- 각 실행의 종료 코드, 소요 시간, 테스트 수와 결과물 경로 기록
- 프로젝트 설정 수정이 있으면 `build`와 `build-for-testing` 회귀 확인
- 작업 보고서 작성 후 iOS QA Agent에 독립 검증 인계

## 독립 검증

담당: iOS QA Agent

- 문서화된 절차를 별도 세션에서 재실행
- 전체 XCTest가 제한 시간 안에 명확히 종료되는지 확인
- 실패 시 진단 가능한 로그와 `xcresult` 생성 확인
- CI가 사용할 명령과 결과물 기준의 재현 가능성 판정

## 제외 범위

- 앱 UI와 제품 기능 변경
- 테스트 안정화와 무관한 iOS 리팩터링
- GitHub Actions workflow 구현과 branch protection 적용
- Xcode 또는 최소 iOS 버전의 전면 업그레이드
- 실제 STT, AI, TTS와 Backend 연동

## 성공 기준

- 전체 XCTest가 동일 조건에서 3회 연속으로 제한 시간 안에 종료 코드와 결과를 반환한다.
- 로컬 Xcode 15.2 환경 한계가 원인인 경우 원인과 재현 근거를 확정하고, 승인된 대체 환경에서 동일한 3회 반복 결과를 확보한다.
- `build`, `build-for-testing`과 전체 테스트의 표준 명령이 문서화된다.
- timeout, 로그와 `xcresult` 보존 기준이 명시된다.
- 프로젝트 설정 변경 시 기존 선별 테스트와 앱 build가 회귀하지 않는다.
- iOS QA Agent가 동일 절차를 재현해 `PASS` 또는 수용 가능한 `PASS_WITH_RISK`를 기록한다.
- `T-20260728-008`이 추가 제품 해석 없이 CI 구현을 시작할 수 있다.

## 승인된 사용자 결정

- Xcode 15.2를 로컬 진단 기준으로 유지하고 이 Task에서 toolchain을 업그레이드하지 않는다.
- 로컬 환경 한계가 재현 가능한 원인으로 확정될 때만 GitHub Hosted Runner의 지원 Xcode 결과를 공식 대체 검증으로 허용한다.
- Hosted Runner 사용은 비교·검증까지만 포함하며 실제 GitHub Actions 구현은 `T-20260728-008`에서 수행한다.
- Product Owner는 `QA-RISK-004-001`을 수용한다. T-004는 Xcode 26.6, iPhone 15, iOS 17.2에서 확인된 안정화 결과를 완료 근거로 사용하고 Xcode 15.2 호환성을 보장하지 않는다.
- `T-20260728-008`에서 CI가 사용할 Xcode와 Simulator 버전을 명시하고 동일 스크립트, timeout과 artifact 기준을 재검증한다.

## 상태 전이 기록

- 2026-07-28: Development Lead Agent가 ownership, 실행 패키지, 제외 범위, 정량 성공 기준과 T-008 인계 조건을 확인하고 `proposed -> scoped`로 전환했다.
- 2026-07-28: 구현 lock을 획득하지 않고 Product Owner 실행 승인을 요청했다.
- 2026-07-28: Product Owner가 권장 환경과 실행 범위를 승인해 `scoped -> approved`로 전환하고 iOS Agent에 라우팅했다.
- 2026-07-28: iOS Agent가 전용 worktree에서 lock을 획득하고 `approved -> in_progress`로 전환해 WP-1 진단을 시작했다.
- 2026-07-28: 직렬 XCTest 실행, timeout·artifact 절차, mapper 테스트 보정을 완료하고 전체 33개 테스트 3회 연속 통과 후 lock을 해제해 `in_progress -> verification_ready`로 전환했다.
- 2026-07-28: iOS QA Agent가 전용 worktree에서 독립 재현 lock을 획득하고 `verification_ready -> verification_in_progress`로 전환했다.
- 2026-07-28: iOS QA Agent가 전체 33개 XCTest, 정상 artifact, timeout 124와 build 회귀를 독립 재현했다. Xcode 15.2 동일 환경 미검증 위험을 기록하고 `verification_in_progress -> verification_passed`로 Development Lead Agent에 인계했다.
- 2026-07-28: Product Owner가 `QA-RISK-004-001`을 수용하고 Xcode·Simulator 고정 검증을 T-008로 인계했다. Development Lead Agent가 문서 정합성을 검토하고 `verification_passed -> completion_review`로 전환했다.
