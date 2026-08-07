---
schema: aiops.task.v1
id: T-20260805-006
title: iOS Audio Guide·핸즈프리 UI·공통 action model 구현
status: rework_requested
type: feature
priority: P0
priority_reason: 저장 Recipe를 다시 요리하는 핵심 경험과 향후 음성·버튼 입력의 동등한 action 경계를 고정해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: iOS Agent
target_role: Execution Role
required_capabilities: [ios_implementation, swiftui, accessibility]
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

너는 iOS Agent / Execution Role이야.
Task T-20260805-006의 승인된 재작업을 진행해줘.

- 현재 상태: `rework_requested`
- public source: 재작업 승인 기록 PR이 병합된 최신 `origin/develop`
- 구현 ref: `8d0321e`, 기존 worktree `/private/tmp/cooklog-t20260805-006-ios-audio-guide`
- QA ref: `fb74ef4`, QA 보고서 `.ai_project/qa/T-20260805-006_ios-audio-guide-handsfree-ui-qa.md`
- 시작 절차: 기존 구현 patch를 보존한 채 최신 `origin/develop`을 반영하고, lock을 획득한
  뒤 `rework_requested -> in_progress`로 전환해.
- 기준 문서: Task `source_of_truth` 전체
- 허용 경로: Task frontmatter의 `allowed_paths`만 사용
- 기존 연결: Recipe Detail CTA, `AppRoute.audioPlayer`, `CookLogApp`, `AppEnvironment`는
  이미 연결돼 있으며 이번 허용 경로 밖이야.
- 재작업: `AudioPlayerView.swift`의 ScrollView와 고정 control bar 사이에
  `safeAreaInset(edge: .bottom)` 또는 동등한 content inset을 적용해 375×667에서도
  `재료 알려줘` CTA와 안내 문구가 완전히 스크롤 도달 가능하게 해.
- 보존: Player 5개 상태, 7개 action reducer, 첫/마지막·불확실 입력·중단·이탈 계약,
  44×44pt 터치 영역과 77/77 통과 기능은 변경하지 마.
- 제외: 실제 TTS, 실제 음성 인식·권한 요청, 백그라운드 오디오, T-007~008 범위
- 검증: 전체 XCTest 77개 이상, build, 390×844·375×667 Light/Dark 4종에서 CTA·안내
  도달과 control bar 비겹침, 44pt 버튼을 확인해.
- 완료 시: 보고서와 iOS 상태 문서를 갱신하고 lock 해제 후 `verification_ready`로
  동일 iOS QA Agent / Verification Role에 독립 재검증을 요청해.
