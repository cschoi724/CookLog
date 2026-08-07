---
schema: aiops.task.v1
id: T-20260805-007
title: iOS 앱 정보·권한·오프라인·서비스 장애 상태 구현
status: approved
type: feature
priority: P0
priority_reason: 첫 공개 출시에서 법적·데이터 안내와 서비스 실패 시 데이터 보존 경계를 제공해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: iOS Agent
target_role: Execution Role
required_capabilities: [ios_implementation, swiftui, error_handling]
depends_on: [T-20260805-006]
blocks: [T-20260805-008, T-20260728-003]
parallel_group:
allowed_paths:
  - apps/ios/CookLog/Features/AppInfo/
  - apps/ios/CookLog/Features/Home/
  - apps/ios/CookLog/Features/CookingLog/
  - apps/ios/CookLog/Features/AIReview/
  - apps/ios/CookLog/App/AppEnvironment.swift
  - apps/ios/CookLog/App/AppRoute.swift
  - apps/ios/CookLog/App/CookLogApp.swift
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
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/prototype/
  - design/figma-build/manifest.json
  - docs/product/CookLog_PRD_v2.md
  - .ai_project/tasks/active/T-20260729-013_design-app-info-data-and-service-failure-states.md
  - .ai_project/reports/T-20260729-013_design-app-info-data-and-service-failure-states-report.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-05
updated_at: 2026-08-05
report_to: .ai_project/reports/T-20260805-007_ios-app-info-offline-failures-report.md
qa_to: .ai_project/qa/T-20260805-007_ios-app-info-offline-failures-qa.md
---

# iOS 앱 정보·권한·오프라인·서비스 장애 상태 구현

## 범위

- 앱 정보, 문의, 개인정보처리방침·이용약관·데이터 보관 안내
- 권한 거부·오프라인·서비스 장애·재시도 상태
- 실패 중 기존 draft·Recipe 보존과 접근 가능한 fallback

## 성공 기준

- 통합 핸드오프의 App Info·권한·service-failure 상태를 구현한다.
- 외부 URL 미설정은 명시적 비차단 안내로 처리하고 임의 URL을 만들지 않는다.
- 실패가 로컬 데이터 삭제나 완료로 오인되지 않는다.

## 승인 및 실행 경계

- 2026-08-07: 선행 `T-20260805-006`이 PR #101 squash merge `dcf58d5`와 완료 정합화를
  거쳐 최신 공용 `origin/develop@fe58f95`에서 `done`이 되어 의존성이 해소됐다.
- 2026-08-07: Development Lead Agent가 Design T-013의 App Info 11개 상태와 Home
  Network Error, Cooking Log STT Final Failure, AI Review Generation Error·Save Error를
  구현 범위로 조율했다. Product Owner가 실행을 승인해 `proposed -> approved`로 전환하고
  iOS Agent / Execution Role에 인계한다.
- 실제 문의 이메일 주소, 개인정보처리방침·이용약관의 실제 문안과 공개 URL은 이번 Task에서
  임의 생성하지 않는다. 값이 없으면 명시적인 미설정·열기 실패 상태를 제공한다.
- 문의에는 사용자 콘텐츠를 자동 첨부하지 않는다. 앱 버전만 기본 제공하고 OS 버전,
  오류 발생 화면·시각, 비콘텐츠 진단 범주는 사용자가 명시적으로 선택한 경우만 포함한다.
- 네트워크·STT·AI·로컬 저장 실패는 실패한 행동만 다시 시도하며 기존 draft, STEP Preview,
  완료 Recipe와 로컬 탐색 기능을 삭제하거나 차단하지 않는다.
- 실제 네트워크 감시·Apple STT·Backend AI·법적 운영 설정·서비스 상태 페이지는 제외한다.
  현재 Mock·placeholder 경계 안에서 상태와 데이터 보존을 구현한다.
- 자체 검증은 관련 집중 테스트와 전체 XCTest, build, 390×844·375×667 Light/Dark의
  App Info·실패 상태와 44pt·스크롤 도달을 포함한다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 iOS Agent / Execution Role이야.
Task T-20260805-007은 승인된 실행 Task야.

- 현재 상태: `approved`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `fe58f959a6a88d7de7f1d38c12ed232e1ba1c2b8`
- 다음에 해야 할 일: 최신 `origin/develop` 기반 전용 worktree에서 lock을 획득하고,
  allowed_paths 안에서 App Info 11개 상태와 지정된 4개 실패 범주를 구현해.
- 기준 문서: Task `source_of_truth` 전체
- 허용 경로: Task frontmatter의 `allowed_paths`만 사용
- 참고 산출물: T-20260729-013 Task·report, Prototype·Manifest의 App Info와 failure 상태
- 변경/검토 대상: App Info route·화면, 문의 동의, 데이터 보관, 법적 링크 placeholder,
  Home Network Error, STT Final Failure, AI Generation Error·Save Error
- 남은 리스크: 실제 문의 주소·법적 문안·공개 URL은 출시 통합 전 확정 필요
- 차단/결정 필요: 허용 경로 밖 공통 서비스나 실제 운영 값이 필요하면 구현을 중단하고
  Development Lead와 Product Owner에게 최소 범위 확장을 요청해.
- 완료 시: 자체 검증과 report를 작성하고 lock을 해제한 뒤 `verification_ready`로 전환해
  iOS QA Agent / Verification Role에 독립 검증을 요청해.
