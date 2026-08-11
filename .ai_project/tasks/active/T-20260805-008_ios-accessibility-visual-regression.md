---
schema: aiops.task.v1
id: T-20260805-008
title: iOS 접근성·작은 화면·다크 모드·통합 회귀 검증
status: approved
type: qa
priority: P0
priority_reason: 82개 통합 상태와 Core Loop 23개 상태의 기능·시각·접근성 무회귀가 상위 T-003 완료 조건이다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: qa
target_agent: iOS Agent
target_role: Execution Role
required_capabilities: [ios_implementation, developer_verification, task_reporting]
depends_on:
  - T-20260805-002
  - T-20260805-003
  - T-20260805-004
  - T-20260805-005
  - T-20260805-006
  - T-20260805-007
blocks: [T-20260728-003]
parallel_group:
allowed_paths:
  - apps/ios/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
  - apps/ios/docs/TESTING.md
  - apps/ios/docs/MANUAL_QA_CHECKLIST.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-05
updated_at: 2026-08-11
report_to: .ai_project/reports/T-20260805-008_ios-accessibility-visual-regression-report.md
qa_to: .ai_project/qa/T-20260805-008_ios-accessibility-visual-regression-qa.md
---

# iOS 접근성·작은 화면·다크 모드·통합 회귀 검증

## 범위

- 390×844·375×667, Light/Dark, 기본/Accessibility 3 조합
- Dynamic Type·VoiceOver label/value/trait·순서·44×44pt
- Core Loop 23개 캡처와 통합 82개 상태 기능 회귀 fixture
- Current·Reference·Diff 증빙과 Blocker/High/Medium/Low 분류

## 성공 기준

- 작은 화면과 접근성 글자 크기에서 필수 콘텐츠·CTA가 잘리지 않는다.
- Core Loop·다시 요리·오류 회복과 draft/Recipe 데이터 보존이 통과한다.
- iOS QA Agent가 실행 역할과 분리된 독립 검증을 수행한다.
- 통합 검증 통과 후에만 상위 `T-20260728-003` 완료 리뷰로 인계한다.

## 승인 및 실행 경계

- 2026-08-07: 공용 `origin/develop@56cb68d`에서 선행 `T-20260805-002~007`이 모두
  `done`임을 확인했다. Product Owner가 실행을 승인해 `proposed -> approved`로 전환하고
  backlog에서 active로 이동해 iOS Agent / Execution Role에 인계한다.
- iOS Agent는 최신 `origin/develop` 기반 전용 worktree에서 lock을 획득하고 한 Task만
  수행한다. 통합 fixture·자동화·시각 증빙을 보강하고 발견된 iOS 결함은 `apps/ios/`
  안에서 수정할 수 있다.
- 390×844·375×667, Light/Dark, 기본/Accessibility 3, Dynamic Type, VoiceOver
  label/value/trait·순서, 44×44pt, Core Loop 23개와 통합 82개 상태를 확인한다.
- Current·Reference·Diff 증빙과 전체 XCTest·Debug build 결과를 report에 남긴다. 실제
  Apple STT·Backend AI·TTS 엔진, 운영 문의·법적 값은 이번 통합 회귀 범위에서 제외한다.
- 실행 완료 후 lock을 해제하고 `verification_ready`, iOS QA Agent / Verification Role로
  넘긴다. 독립 QA 전에는 T-008 또는 상위 T-20260728-003을 완료로 판정하지 않는다.
- 2026-08-10: iOS Agent가 통합 82개·Core Loop 23개 계약 validator, 전체 XCTest 82/82,
  Debug build와 Accessibility 3 표본 6장을 완료해 `verification_ready`로 인계했다.
- 2026-08-10: iOS QA Agent가 기능 XCTest 82/82와 validator는 통과시켰으나 Core Loop
  Current 0/23, 동일 fixture·scale Reference/Diff 0/23, 위험 조합 matrix 미완료,
  VoiceOver 런타임 0/23의 `QA-HIGH-805008-001~004`를 확인해 `FAIL`,
  `rework_requested`로 Development Lead Agent에 인계했다.
- 2026-08-10: Development Lead Agent가 결함을 `WP-R1~R4`로 범위화했고 Product Owner가
  재작업을 승인해 `rework_requested -> approved`로 전환하고 iOS Agent에 재인계한다.
- `WP-R1`: 고정된 23개 상태 ID·fixture 진입 경로로 390×844·Light·기본 글자 크기
  Current를 23/23 생성하고 상태별 필수 콘텐츠·CTA·데이터 조건을 기록한다.
- `WP-R2`: 승인된 디자인 Source of Truth에서 Current보다 독립적인 Reference를 동일
  fixture·상태 ID·viewport·Appearance·글자 크기·scale로 23/23 구성하고 1:1 overlay
  Diff를 만든다. Current 복제나 Current를 자기 baseline으로 사용하지 않는다.
- `WP-R3`: 계약의 필수 위험 상태를 375×667·Dark·Accessibility 3으로 추가 캡처하고
  실제 스크롤·키보드 회피·CTA 도달·잘림/겹침·44×44pt 결과를 상태별로 남긴다.
- `WP-R4`: 실제 VoiceOver를 켠 23개 상태의 focus 순서, label/value/trait,
  disabled/selected 의미, 상태 알림과 과다 낭독 여부를 상태 ID별 기계 판독 기록과
  재현 가능한 런타임 증거로 남긴다. validator는 Current/Reference/Diff 1:1 대응,
  fixture·scale 일치, 위험 matrix와 VoiceOver 23/23 완결성 누락을 실패 처리한다.
- 기존 기능 82/82와 manifest 상태 계약은 보존한다. 실제 Apple STT·Backend AI·TTS,
  운영 문의 주소·법적 값은 계속 범위 밖이다.
- 2026-08-10: iOS Agent가 첫 재작업에서 Current/Reference/Diff 23개, 위험 matrix,
  VoiceOver JSON을 보강하고 전체 XCTest 82/82를 통과해 독립 재검증에 인계했다.
- 2026-08-10: iOS QA Agent가 상태 본문 불일치·letterbox viewport·미정렬 overlay Diff·
  위험 matrix 중복 이미지·실제 VoiceOver focus/알림 누락을 확인해 다시 `FAIL`,
  `rework_requested`로 판정했다.
- 2026-08-10: Development Lead Agent가 아래 `WP-R5~R8`로 재작업 범위를 조율했고 Product
  Owner가 재작업을 승인해 `approved`, iOS Agent / Execution Role로 다시 인계한다.
- `WP-R5`: 23개 상태를 실제 fixture로 주입하고 고유 콘텐츠·CTA assertion을 통과한 뒤
  letterbox 없는 390×844 full-screen Current를 생성한다.
- `WP-R6`: Current/Reference의 safe area·fixture·viewport·scale·시간 마스크·좌표계를
  정렬하고 mask 적용 후 spacing·정렬 등 계약 허용치별 수치 Diff를 기록한다.
- `WP-R7`: 위험 matrix에서 상태별 고유 콘텐츠·CTA·오류/로딩/disabled 의미를 검증하며
  byte-identical 이미지를 서로 다른 상태 증거로 허용하지 않는다.
- `WP-R8`: 실제 VoiceOver focus 이동 또는 신뢰 가능한 접근성 자동화 결과를 상태별 독립
  기대 계약과 대조하고 상태 알림·카운트다운 과다 낭독을 이벤트 로그로 증명한다.
- 2026-08-10: iOS Agent가 `WP-R5~R8` 재작업으로 상태 설명과 `diff-metrics.json`을
  추가했으나 실제 상태 UI·Current·위험 matrix·VoiceOver 산출물을 재생성하지 않았다.
- 2026-08-10: iOS QA Agent가 전체 XCTest 82/82는 통과시켰으나 동일 High 4건이 실제
  산출물에서 그대로임을 확인해 세 번째 `FAIL`, `rework_requested`로 판정했다.
- 2026-08-10: Development Lead Agent가 아래 `WP-R9~R12`로 합격 게이트를 강화했고
  Product Owner가 재작업을 승인해 `approved`, iOS Agent / Execution Role로 다시 인계한다.
- `WP-R9`: 상태 설명 배지를 합격 증거에서 제외한다. 23개 상태별 fixture 주입 assertion과
  화면 내 고유 콘텐츠·CTA assertion이 캡처 전에 실패 가능해야 하며 Current 23개를 전부
  새로 생성한다. 산출물 생성 시각과 SHA를 report에 기록한다.
- `WP-R10`: letterbox 검출을 자동화하고 실제 이미지 픽셀에서 viewport crop·alignment·mask·
  pixel/point 편차를 계산한다. 상수 PASS/offset 0 입력을 금지하고 validator negative fixture가
  미정렬·미마스크·허용치 초과를 실제 실패시켜야 한다.
- `WP-R11`: 위험 matrix 18개 top/bottom을 전부 재생성하고 상태 간 byte-identical 이미지를
  validator가 실패 처리한다. 각 상태의 주입·스크롤·키보드·CTA 조작 로그와 assertion 결과를
  독립 필드로 기록한다.
- `WP-R12`: 기존 runtime JSON을 폐기·재생성하고 실제 focus 이동/접근성 자동화 이벤트 원본을
  보존한다. 독립 기대 계약과 비교하며 필수 알림 상태의 빈 `notificationsObserved`, 고정
  `overReadingDetected: false`, actualElements 복제 계약을 validator가 실패 처리한다.
- 2026-08-10: iOS Agent가 `WP-R9~R12`와 전체 XCTest 82/82, negative fixture 7/7을
  완료하고 고정 구현 commit `8b4a989`을 독립 재검증으로 인계했다.
- 2026-08-10: iOS QA Agent가 `QA-HIGH-805008-001` 해소를 확인했으나 Diff 정렬 편차,
  위험 interaction 실패 원본·중복 이미지, 실제 VoiceOver focus 순서 미관측의
  `QA-HIGH-805008-002~004`를 확인해 `FAIL`, `rework_requested`로 판정했다.
- 2026-08-11: Development Lead Agent가 아래 `WP-R13~R15`로 재작업 범위를 조율했고
  Product Owner가 재작업과 `develop` 공용 인계를 승인해 `approved`, iOS Agent /
  Execution Role로 다시 인계한다.
- `WP-R13`: `contentFeatureOffsetPoints`를 커스텀 ±2pt·native container ±4pt 허용치에
  직접 연결하고 초과 시 Diff·validator를 실패시킨다. `HOME-ERROR -56pt`를 포함한 초과
  상태는 정렬·재캡처하며 허용치 초과 negative fixture를 보강한다.
- `WP-R14`: 위험 interaction 원본의 fixture 주입, 44pt target, 비어 있지 않은 target,
  CTA 조작 결과를 모두 필수 게이트로 연결한다. 18개 상태를 실제 성공값으로 재생성하고
  top/bottom 및 상태 간 SHA 중복을 차단하며 network error 의미와 복구 CTA를 보존한다.
- `WP-R15`: 기대 배열 index를 sequence로 쓰지 않고 실제 접근성 traversal/focus 이동을
  관측한다. Core 23개 전체를 독립 기대 계약과 비교하고 실제 VoiceOver 증거가 확보되지
  않으면 PASS로 완화하지 않고 `BLOCKED`로 보고한다.

## Next Agent Handoff

다음 Agent에게 전달할 말:

너는 iOS Agent / Execution Role이야.
Task T-20260805-008의 승인된 재작업을 진행해줘.

- 현재 상태: `approved`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `081c206f60ef6e5f3d533a5a2b3aafafaa52b133`
- 다음에 해야 할 일: 최신 canonical 기준 전용 worktree에서 lock을 획득하고
  `WP-R13~R15`만 수행한 뒤 기존 기능 회귀와 함께 자체 검증해.
- 기준 문서: Task `source_of_truth` 전체
- 허용 경로: Task frontmatter의 `allowed_paths`
- 참고 산출물: `.ai_project/qa/T-20260805-008_ios-accessibility-visual-regression-qa.md`,
  `.ai_project/reports/T-20260805-008_ios-accessibility-visual-regression-report.md`
- 변경/검토 대상: `apps/ios/VisualRegression/`,
  `apps/ios/Scripts/validate-visual-regression-contract.js`, 전체 iOS 화면·테스트
- 재작업 `WP-R13`: 실측 content feature offset을 ±2pt/±4pt 허용치에 연결하고 초과 상태 재캡처
- 재작업 `WP-R14`: 위험 interaction 54개 원본을 실제 성공값으로 재생성하고 모든 실패값·중복 SHA 차단
- 재작업 `WP-R15`: 기대 배열 순번이 아닌 실제 접근성 traversal/focus 순서를 Core 23개에서 관측
- 보존: 통합 82개·Core Loop 23개 manifest, 전체 XCTest 82/82, 기존 기능·데이터 흐름
- 남은 리스크: 네 번째 재검증에서 미정렬 Diff·실패 interaction·중복 이미지·가짜 focus 순서 반례가
  독립 재검증에서 해소되는지 미확정
- 범위 제외: 실제 Apple STT·Backend AI·TTS 엔진, 운영 문의·법적 값
- 차단/결정 필요: 실제 VoiceOver traversal/focus 증거를 만들 수 없으면 기대 배열 index를
  대체 증거로 사용하지 말고 `BLOCKED`로 Lead에 보고해.
- 완료 시: report와 iOS 문서를 갱신하고 lock을 해제한 뒤 `verification_ready`로 전환해
  동일 iOS QA Agent / Verification Role에 독립 재검증을 요청해.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
