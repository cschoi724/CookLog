---
schema: aiops.task.v1
id: T-20260805-006
title: iOS Audio Guide·핸즈프리 UI·공통 action model 구현
status: completion_review
type: feature
priority: P0
priority_reason: 저장 Recipe를 다시 요리하는 핵심 경험과 향후 음성·버튼 입력의 동등한 action 경계를 고정해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Completion Role
required_capabilities: [development_child_completion]
depends_on: [T-20260805-005]
blocks: [T-20260805-007, T-20260728-003]
parallel_group:
allowed_paths:
  - apps/ios/CookLog/Features/AudioPlayer/
  - apps/ios/CookLog/Services/AudioGuide/
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
  - .ai_project/tasks/active/T-20260729-012_design-audio-guide-and-handsfree-states.md
  - .ai_project/reports/T-20260729-012_design-audio-guide-and-handsfree-states-report.md
  - apps/ios/docs/SERVICES.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-05
updated_at: 2026-08-07
report_to: .ai_project/reports/T-20260805-006_ios-audio-guide-handsfree-ui-report.md
qa_to: .ai_project/qa/T-20260805-006_ios-audio-guide-handsfree-ui-qa.md
---

# iOS Audio Guide·핸즈프리 UI·공통 action model 구현

## 범위

- 이전·재생/정지·다음·현재 단계 다시 듣기와 경계 상태
- Audio Player 로딩·오류·단계 없음·not-found subtype
- 버튼과 향후 핸즈프리 입력이 공유하는 action model·fallback UI
- 오디오 중단·화면 이탈 시 재생 보존·중지 화면 상태

## 성공 기준

- Audio Player 5개 Core Loop 상태와 통합 핸즈프리 상태를 검증한다.
- 버튼만으로 모든 핵심 action을 수행할 수 있다.
- `다음`, `이전`, `멈춰`, `계속`, `다시 들려줘`, `재료 알려줘`, `핸즈프리 종료`를
  하나의 공통 action model로 정의하고 버튼·테스트 입력이 같은 reducer 경계를 사용한다.
- 첫·마지막 단계, 불확실 입력, 오디오 중단과 화면 이탈에서 현재 단계·재생 상태를
  보존하거나 명시적으로 정지하며 자동 재생·자동 핸즈프리 재활성화를 하지 않는다.
- 실제 로컬 TTS와 음성 인식 엔진은 `T-20260729-006` 범위로 남긴다.

## 승인 및 실행 경계

- 2026-08-07: iOS QA Agent가 고정 commit `64e6d36`을 독립 재검증해 전체 XCTest 77/77,
  Debug build와 390×844·375×667 Light/Dark 4종을 통과했다. `QA-HIGH-806006-001`은
  해소됐고, 첫 전체 실행의 Dark 375 attachment 1장 비결정성을 T-008 잔여 위험으로 남겨
  `PASS_WITH_RISK`, `verification_passed`로 Development Lead Agent에 인계했다.
- 2026-08-07: Development Lead Agent가 구현 commit `64e6d36`, 허용 경로, 구현·QA
  보고서, 독립 XCTest 77/77과 4개 viewport 증빙을 직접 검토했다. 차단 제품 결함이 없어
  완료 리뷰를 `PASS_WITH_RISK`로 수용하고 `verification_passed -> completion_review`로
  전환했다. Dark 375 attachment의 일시적 비결정성은 T-008 통합 Visual QA에 유지한다.
  구현 브랜치 PR이 아직 없어 필수 `ios-build`·`ios-xctest`와 merge 가능성은 미확인 상태이며,
  QA·완료 리뷰 기록 커밋, push, PR 생성과 checks 통과 후 Product Owner 완료·병합 승인을
  요청한다.
- 2026-08-07: iOS Agent가 재작업 승인된 공용 `origin/develop@6eab9ec` 위로 구현 patch를
  재정렬하고 lock을 획득해 `rework_requested -> in_progress`로 전환했다.
- 2026-08-07: iOS Agent가 `QA-HIGH-806006-001`에 한정해 ScrollView 하단에
  `safeAreaInset(edge: .bottom)`을 적용했다. 390×844·375×667 Light/Dark 하단 도달
  캡처 4/4, 전체 XCTest 77/77과 build를 통과하고 lock을 해제해
  `in_progress -> verification_ready`로 동일 iOS QA Agent에 재검증을 요청했다.
- 2026-08-07: iOS Agent가 공용 `origin/develop@8d3712d`에서 승인·선행 완료를 재확인하고
  전용 worktree에서 lock을 획득해 `approved -> in_progress`로 전환했다.
- 2026-08-07: 선행 `T-20260805-005`가 PR #94 squash merge
  `7c26ebbcd2f98bb883d017dc420399c19aead8cf`로 공용 `develop`에서 `done`이 되어
  의존성이 해소됐다.
- 2026-08-07: Product Owner가 T-006의 별도 실행을 승인했다. Development Lead Agent가
  `proposed -> approved`로 전환하고 iOS Agent에 인계한다.
- 2026-08-07: iOS Agent가 구현 commit `8d0321e`에서 Player 5개 상태, 7개 공통 action,
  중단·이탈 보존을 구현하고 집중 13/13·전체 XCTest 77/77, build와 4개 viewport 증빙 후
  `in_progress -> verification_ready`로 iOS QA Agent에 인계했다.
- 2026-08-07: iOS QA Agent가 고정 commit `8d0321e`를 독립 검증해 전체 XCTest 77/77과
  기능 계약은 통과했으나 375×667 Light/Dark에서 하단 control bar가 `재료 알려줘` CTA를
  가리는 `QA-HIGH-806006-001`을 확인했다. QA commit `fb74ef4`로 증빙을 보존하고
  `verification_ready -> rework_requested`로 판정했다.
- 2026-08-07: Product Owner가 `QA-HIGH-806006-001` 한정 재작업을 승인했다. 이미 통과한
  Player 상태·action reducer·보존 로직은 유지하고 하단 safe-area/content inset과 시각 회귀만
  수정한 뒤 동일 iOS QA Agent에게 독립 재검증을 요청한다.
- iOS Agent는 승인 기록이 공용 `develop`에 병합된 뒤 최신 `origin/develop` 기반 전용
  worktree에서 lock을 획득하고 `approved -> in_progress`로 전환한다.
- 기존 Recipe Detail → `audioPlayer(recipe.id)` route와 `AppEnvironment` 조립은 이미
  연결돼 있으므로 승인 경로 밖 App·Recipe Detail을 수정하지 않는다. 변경 필요가 발견되면
  구현을 멈추고 Development Lead에 최소 경로 확장을 요청한다.
- 실제 System TTS, 마이크·Speech 권한 요청, 음성 인식 엔진, 백그라운드 오디오는
  구현하지 않는다. 이번 Task는 Mock Audio Guide, 핸즈프리 UI 상태와 공통 action model,
  버튼 fallback 및 중단·이탈 보존 경계만 구현한다.
- 자체 검증은 Audio Player 집중 테스트, 전체 XCTest, build와 390×844·375×667
  Light/Dark Player 상태를 포함하고, 완료 후 iOS QA Agent에 독립 검증을 요청한다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 Product Owner야.
Task T-20260805-006은 독립 QA와 Development Lead 완료 리뷰를 통과했지만 PR 준비가 남아 있어.

- 현재 상태: `completion_review`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `6eab9ec`
- 검증 대상 commit: `64e6d36ff4e15e69a658677468ea27c4f4a01c28`
- 다음에 해야 할 일: QA·완료 리뷰 기록을 커밋하고 구현 브랜치를 push해 `develop` 대상
  Draft PR을 만든 뒤 `ios-build`·`ios-xctest`와 merge 가능성을 확인해. 모두 통과하면
  잔여 위험을 수용하고 완료·squash merge 승인 여부를 결정해.
- 기준 문서: Task `source_of_truth` 전체
- 허용 경로: Task frontmatter의 `allowed_paths`
- 참고 산출물: `.ai_project/reports/T-20260805-006_ios-audio-guide-handsfree-ui-report.md`,
  `.ai_project/qa/T-20260805-006_ios-audio-guide-handsfree-ui-qa.md`
- 변경/검토 대상: Audio Player safe-area inset, Player 기능·action 회귀, 4개 viewport
- 남은 리스크: 전체 XCTest 첫 실행의 Dark 375 attachment 1장 비결정성. 집중 재실행은
  4/4 정상이며 제품 UI 결함은 재현되지 않았다. T-008 통합 Visual QA에서 재확인한다.
- 차단/결정 필요: 현재 PR 없음, QA·완료 리뷰 변경 미커밋, GitHub 필수 checks 미확인.
  commit·push·PR·merge는 Product Owner 승인 필요
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
