---
schema: aiops.task.v1
id: T-20260805-007
title: iOS 앱 정보·권한·오프라인·서비스 장애 상태 구현
status: done
type: feature
priority: P0
priority_reason: 첫 공개 출시에서 법적·데이터 안내와 서비스 실패 시 데이터 보존 경계를 제공해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Completion Role
required_capabilities: [development_child_completion]
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
updated_at: 2026-08-07
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
- 2026-08-07: iOS Agent가 `origin/develop@a173953` 기반 전용 worktree에서 App Info route,
  11개 상태, 문의 정보 선택, 데이터 보관 경계와 법적 링크 placeholder를 구현했다.
- 2026-08-07: iPhone 15 iOS 17.2 build와 전체 XCTest 79/79, `git diff --check`를 통과해
  lock을 해제하고 `in_progress -> verification_ready`로 iOS QA Agent에 인계했다.
- 2026-08-07: iOS QA Agent가 전체 XCTest 79/79와 Debug build를 통과했으나 Home
  Network Error 누락 `QA-HIGH-807007-001`, 문의 opt-in 결과 미반영
  `QA-HIGH-807007-002`, viewport 증거 부재 `QA-MEDIUM-807007-003`을 확인해 `FAIL`,
  `verification_in_progress -> rework_requested`로 판정했다.
- 2026-08-07: Development Lead Agent가 QA 결함을 `WP-R1` Mock Home Network Error와
  자동 재실행 금지, `WP-R2` 문의 초안 모델·앱 버전·진단 opt-in·콘텐츠 비포함,
  `WP-R3` 390×844·375×667 Light/Dark 시각 증빙으로 제한했다. Product Owner가 세
  패키지의 재작업을 승인해 `rework_requested -> approved`로 전환하고 iOS Agent에
  재인계한다. 실제 네트워크 감시와 운영 문의·법적 값은 계속 제외한다.
- 2026-08-07: iOS Agent가 `origin/develop@596d779` 기반으로 `WP-R1~R3`을 재작업했다.
  주입형 Home Network Error와 자동 재실행 금지 계약, 실제 메일 초안 모델과 진단 opt-in,
  390×844·375×667 Light/Dark App Info·Network Error 증빙을 추가했다.
- 2026-08-07: iPhone 15 iOS 17.2 build, 전체 XCTest 82/82와 `git diff --check`를 통과해
  lock을 해제하고 `in_progress -> verification_ready`로 동일 iOS QA Agent에 재인계했다.
- 2026-08-07: iOS QA Agent가 독립 전체 XCTest 82/82, Debug build와 8개 viewport를
  확인해 `QA-HIGH-807007-001~002`, `QA-MEDIUM-807007-003` 해소를 판정했다. 운영 값과
  실서비스 연결을 후속 위험으로 남겨 `PASS_WITH_RISK`, `verification_passed`로
  Development Lead Agent에 인계했다.
- 2026-08-07: Development Lead Agent가 `origin/develop@596d779` 기준 재작업 diff,
  허용 경로, 구현·QA 보고서, 독립 XCTest 82/82, Debug build와 8개 viewport를 직접
  검토했다. QA 결함 3건 해소와 성공 기준 충족을 확인해 완료 리뷰를 `PASS_WITH_RISK`로
  수용하고 `verification_passed -> completion_review`로 전환했다. 실제 문의 주소·법적
  문안·공개 URL과 실제 네트워크·STT·Backend 연결은 출시 통합·후속 Task 위험으로
  유지한다. 재작업 브랜치에는 아직 PR이 없어 required checks와 mergeability 확인은
  Product Owner의 완료·병합 승인 후 커밋·푸시·PR 생성 단계에서 수행한다.
- 2026-08-07: Product Owner가 Lead `PASS_WITH_RISK`와 잔여 위험을 수용하고 완료·병합을
  승인했다. PR #106은 최신 `develop` rebase 후 `ios-build`, `ios-xctest`와 변경 감지
  체크를 모두 통과했으며 squash merge SHA `2f309ed`로 공용 `develop`에 병합됐다.
  `completion_review -> done`으로 완료를 확정한다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Development Lead Agent야.
Task T-20260805-007은 독립 QA와 완료 리뷰를 통과하고 PR #106으로 `develop`에 병합된 `done` Task야.

- 현재 상태: `done`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `2f309ed`
- 검증 대상 commit: `235469745229ad5da404a6183a77f42b13c353be`
- PR #106: squash merge 완료
- merge SHA: `2f309edc73afabc90e42425c8ce65fbcbb7fc389`
- 다음에 해야 할 일: 후속 T-20260805-008의 별도 실행 승인 여부를 Product Owner에게 확인해.
- 기준 문서: Task `source_of_truth` 전체
- 허용 경로: Task frontmatter의 `allowed_paths`
- 참고 산출물: `.ai_project/reports/T-20260805-007_ios-app-info-offline-failures-report.md`,
  `.ai_project/qa/T-20260805-007_ios-app-info-offline-failures-qa.md`
- 변경/검토 대상: Home Network Error, SupportMailDraft, App Info 11개 상태, 8개 viewport
- 남은 리스크: 실제 문의 주소·법적 문안·공개 URL과 실제 네트워크·STT·Backend 연결은
  출시 통합·후속 Task에서 확정 필요
- 차단/결정 필요: T-008은 별도 실행 승인 전 `proposed` 유지
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
