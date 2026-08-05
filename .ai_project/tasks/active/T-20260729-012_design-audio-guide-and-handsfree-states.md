---
id: T-20260729-012
title: Audio Guide·핸즈프리·오디오 중단 상태 디자인
status: done
type: feature
priority: P0
priority_reason: 버튼과 사용자가 시작하는 핸즈프리는 첫 공개 출시의 핵심 재사용 경험이며 실패해도 조리를 계속할 fallback이 필요하다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent:
target_role:
required_capabilities:
  - ux_flow
  - ui_design
  - prototyping
depends_on:
  - T-20260729-011
blocks:
  - T-20260729-013
  - T-20260729-002
parallel_group: design-refresh-sequential
allowed_paths:
  - design/prototype/
  - design/figma-build/manifest.json
  - design/exports/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - .ai_project/tasks/active/T-20260729-011_design-ai-processing-review-edit-and-delete.md
  - design/prototype/
created_by: Design Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-31
report_to: .ai_project/reports/T-20260729-012_design-audio-guide-and-handsfree-states-report.md
qa_to: .ai_project/qa/T-20260729-012_design-audio-guide-and-handsfree-states-qa.md
---

# Audio Guide·핸즈프리·오디오 중단 상태 디자인

## 목적

버튼과 음성 명령이 같은 Audio Guide 액션을 수행하고 인식·권한·오디오 중단 실패에서도 버튼으로 즉시 이어갈 수 있게 설계한다.

## 실행 범위

- 진입 시 1단계 준비와 자동 재생 없음
- 이전, 재생·일시정지, 다음, 다시 듣기와 가이드 종료
- 단계 완료 후 대기, 마지막 단계 유지와 안내
- 재료 듣기와 읽기 속도 3단계
- `핸즈프리 시작`과 첫 사용 맥락형 안내
- 마이크·음성인식 권한 요청, 거부와 설정 이동
- 핸즈프리 꺼짐, 듣는 중, 명령 인식, 불확실·실패와 종료
- 7개 명령: 다음, 이전, 멈춰, 계속, 다시 들려줘, 재료 알려줘, 핸즈프리 종료
- 음성 실패 시 같은 행동의 버튼 fallback 강조
- TTS 중 `멈춰`, 일시정지 중 명령 듣기
- 전화·Siri·다른 오디오·Bluetooth 중단 후 일시정지와 수동 재개
- 앱 백그라운드·직접 잠금 후 핸즈프리 종료
- Audio Guide 화면 중 자동 잠금 방지 안내가 필요한 상태

## 제외 범위

- 호출어
- Audio Guide 밖의 음성 명령
- 중단 후 자동 재생·핸즈프리 자동 재활성화
- LLM 기반 TTS 문장 재작성

## 성공 기준

- 모든 음성 명령에 동일한 버튼 행동이 존재하고 핸즈프리 실패가 재생 상태를 초기화하지 않는다.
- 핸즈프리는 사용자 시작 전 꺼져 있고 종료 시 마이크만 꺼지며 버튼·현재 오디오는 유지된다.
- 첫·마지막 단계, 재료 낭독, 속도 변경과 오디오 중단 상태를 Prototype에서 확인할 수 있다.
- 상태 결과는 매번 긴 확인 음성 없이 화면 강조·실제 재생·필요한 효과로 전달된다.
- 권한 거부 후에도 버튼 기반 Audio Guide 전체를 사용할 수 있다.
- Design QA Agent가 버튼 동등성, 7개 명령 상태, 중단 복구와 접근성을 독립 검증한다.

## 사용자 결정 필요 항목

- 2026-07-31 Product Owner가 최신 제품 결정대로 핸즈프리 음성 명령을 첫 공개 출시 범위에 포함한다고 재확인했다.
- 루트 `AGENTS.md`의 음성 명령 제외 문구는 Product Lead가 별도 동기화하며 T-012 디자인 실행을 차단하지 않는다.

## Design Lead 준비 결과

- 선행 `T-20260729-011`의 PR #30·#31 develop 병합, CI 통과와 `done`을 확인했다.
- 최신 PRD v2의 Audio Guide·핸즈프리 정책과 Product Owner의 명시적 결정을 우선해 버튼 기반 가이드와 사용자가 시작하는 핸즈프리를 첫 출시 P0 범위로 고정했다.
- 핸즈프리는 Audio Guide 진입 시 꺼져 있고 사용자가 직접 시작하며, 권한 거부·인식 실패·종료 후에도 버튼과 현재 재생 상태를 유지한다.
- 7개 명령은 동일 버튼 행동과 1:1 대응하고 호출어, Audio Guide 밖 명령, 자동 재생·자동 재활성화는 포함하지 않는다.
- 전화·Siri·다른 오디오·Bluetooth 중단, 앱 백그라운드와 직접 잠금 뒤에는 일시정지 또는 핸즈프리 종료 상태를 제공하고 사용자가 수동으로 재개한다.
- 루트 `AGENTS.md` 동기화는 Product Lead 소관이며 T-012 `allowed_paths` 밖이므로 이번 Task에서 수정하지 않는다.
- 공용 Prototype·Manifest 파일 충돌을 막기 위해 후속 `T-20260729-013` 범위를 포함하지 않는다.
- 잔존 포커스 재작업 전용 worktree는 `/private/tmp/cooklog-t20260729-012-focus-rework`, 브랜치는 `task/T-20260729-012-design-audio-guide-focus-rework`다.
- 잔존 포커스 재작업 기준점은 최신 `origin/develop` SHA `93f577e`다.
- UI/UX Design Agent는 lock을 획득하고 `approved -> in_progress`로 전환한 뒤 확정 범위만 실행한다.
- 실행 완료 후 자체 검증과 보고서를 작성해 Design QA Agent에 독립 검증을 요청한다.
- commit, push, PR, merge는 별도 Product Owner 승인 전 실행하지 않는다.

## 상태 전이 기록

- 2026-07-31: Design Lead Agent가 선행 Task, 최신 제품 Source of Truth, Audio Guide·핸즈프리 범위와 공용 파일 ownership을 확인하고 최신 develop 기반 전용 worktree를 준비해 `proposed -> scoped`로 전환했다.
- 2026-07-31: Product Owner가 최신 제품 결정대로 핸즈프리 포함과 T-012 실행을 승인해 `scoped -> approved`로 전환하고 UI/UX Design Agent에 라우팅했다.
- 2026-07-31: UI/UX Design Agent가 전용 worktree·브랜치·선행 Task·허용 경로를 확인하고 lock을 획득해 `approved -> in_progress`로 전환했다.
- 2026-07-31: UI/UX Design Agent가 버튼 Audio Guide·사용자 시작 핸즈프리·7개 명령·권한과 오디오 중단 상태를 Prototype·Manifest에 반영하고 동적·레이아웃 검증을 통과해 `in_progress -> verification_ready`로 전환했다.
- 2026-07-31: 실행 lock을 해제하고 `Design QA Agent / Verification Role`에 독립 검증을 요청했다.
- 2026-07-31: Design QA Agent가 독립 검증에서 저장 레시피와 Audio Guide 원본 불일치, 명령–버튼 경계 동등성, 권한 전 핸즈프리 활성화와 재생 상태 보존 HIGH 4건, Player 포커스와 TTS 오류 fallback MEDIUM 2건을 확인해 `verification_ready -> rework_requested`로 전환하고 UI/UX Design Agent에 재작업을 요청했다.
- 2026-07-31: Product Owner가 Design QA 결함 6건의 재작업을 승인해 `rework_requested -> approved`로 전환하고 UI/UX Design Agent에 다시 라우팅했다.
- 2026-07-31: UI/UX Design Agent가 최신 `origin/develop` SHA `22fe75f` 기반 재작업 worktree와 허용 경로를 확인하고 lock을 획득해 `approved -> in_progress`로 전환했다.
- 2026-07-31: UI/UX Design Agent가 완료 레시피 단일 원본, 명령 경계 동등성, 권한 상태 분리, 재생 완료 시점 보존, Player 포커스와 TTS 오류 fallback을 보완했다.
- 2026-07-31: 동적 결함 시나리오, 375×667 Light·Dark `48/48`, 접근성 글자 크기 `24/24`, Reduce Motion과 정적 검증을 통과해 `in_progress -> verification_ready`로 전환했다.
- 2026-07-31: 실행 lock을 해제하고 `Design QA Agent / Verification Role`에 DQA 결함 6건 독립 재검증을 요청했다.
- 2026-07-31: Design QA Agent가 재작업 독립 재검증에서 HIGH 4건과 TTS fallback 해소, 작은 화면·접근성 무회귀를 확인했으나 자동 재생 완료 뒤 포커스가 `BODY`로 소실되는 `DQA-MEDIUM-012-001` 잔존을 확인해 `verification_ready -> rework_requested`로 전환하고 UI/UX Design Agent에 반환했다.
- 2026-07-31: Product Owner가 잔존 `DQA-MEDIUM-012-001` 1건의 재작업을 승인해 `rework_requested -> approved`로 전환하고 UI/UX Design Agent에 다시 라우팅했다.
- 2026-07-31: UI/UX Design Agent가 SHA `93f577e` 기반 포커스 재작업 worktree와 허용 경로를 확인하고 lock을 획득해 `approved -> in_progress`로 전환했다.
- 2026-07-31: timer 기반 `step-complete`·`last-step` 자동 완료 렌더링에 재생 control 포커스 복원을 적용하고 재생·단계 이동·다시 듣기 완료 경로를 검증했다.
- 2026-07-31: 잔존 결함 시나리오와 기존 HIGH 4건·TTS fallback·작은 화면·접근성·Reduce Motion 무회귀를 통과해 `in_progress -> verification_ready`로 전환했다.
- 2026-07-31: 실행 lock을 해제하고 `Design QA Agent / Verification Role`에 잔존 `DQA-MEDIUM-012-001` 독립 재검증을 요청했다.
- 2026-07-31: Design QA Agent가 재생·다음·다시 듣기·마지막 단계 다시 듣기의 자동 완료 포커스와 기존 결함 6건·접근성 무회귀를 독립 재검증해 `verification_ready -> verification_passed`로 전환하고 Design Lead Agent에 인계했다.
- 2026-07-31: Design Lead Agent가 성공 기준, 최종 Design QA, allowed paths, Figma 비차단 근거와 iOS 구현 핸드오프를 완료 검토해 `verification_passed -> completion_review`로 인계했다. develop 통합 전이므로 `done` 전환과 후속 `T-20260729-013` 차단 해제는 보류했다.
- 2026-07-31: Product Owner 승인으로 PR #42를 `develop`에 squash merge하고 merge SHA `2b9b7502d521db64f2ce11ac3e6a249e7cabf210`과 `ios-build`·`ios-xctest` 성공을 확인해 `completion_review -> done`으로 확정했다.

## Design QA 재작업 요구

- `DQA-HIGH-012-001`: Audio Guide 단계·진행률·재료 낭독을 현재 저장된 완료 레시피의 단일 원본에서 동적으로 생성한다.
- `DQA-HIGH-012-002`: 첫 단계 `이전`과 마지막 단계 `다음`을 포함해 7개 음성 명령이 대응 버튼과 같은 상태·안내 결과를 내게 한다.
- `DQA-HIGH-012-003`: 첫 안내 확인과 마이크·음성인식 권한 상태를 분리하고 명시적 권한 허용 전 핸즈프리를 활성화하지 않는다.
- `DQA-HIGH-012-004`: 불확실 명령과 핸즈프리 종료가 진행 중 오디오의 위치와 정상 완료 전이를 보존하게 한다.
- `DQA-MEDIUM-012-001`: Player의 재생·단계·재료·속도·핸즈프리·수동 재개 행동 후 예측 가능한 키보드 포커스를 유지하거나 이동한다.
- `DQA-MEDIUM-012-002`: 로컬 TTS 오류의 안내 문구, 유지되는 버튼·레시피 내용과 Manifest fallback 계약을 일치시킨다.

## 승인된 재작업 범위

- Product Owner가 2026-07-31 Design QA의 HIGH 4건과 MEDIUM 2건 재작업을 승인했다.
- 저장된 완료 레시피 단일 원본, 명령–버튼 경계 동등성, 권한 상태 분리, 재생 완료 전이 보존, 키보드 포커스와 TTS 오류 fallback만 수정한다.
- 기존에 통과한 작은 화면·Dark Mode, 기본 버튼 진행, 속도·재료, 오디오 중단 수동 복구, Reduce Motion과 핸즈프리 포함 제품 정책은 변경하지 않는다.
- 후속 `T-20260729-013` 범위는 포함하지 않는다.
- UI/UX Design Agent는 최신 `origin/develop` 기반 재작업 전용 worktree를 확인한 뒤 lock을 획득하고 `approved -> in_progress`로 전환한다.
- 기존 worktree의 변경과 최신 develop의 Quality Board 변경이 겹쳐 기존 worktree를 직접 병합하지 않고, 최신 SHA `22fe75f` 기반 재작업 worktree로 허용 경로 산출물을 옮겨 정합화했다.
- 재작업 완료 후 자체 검증과 보고서를 갱신하고 Design QA Agent에 독립 재검증을 요청한다.
- commit, push, PR, merge는 별도 Product Owner 승인 전 실행하지 않는다.

## 승인된 잔존 포커스 재작업 범위

- Product Owner가 2026-07-31 잔존 `DQA-MEDIUM-012-001` 1건의 재작업을 승인했다.
- `playing -> step-complete`와 같은 timer 기반 자동 완료 렌더링 뒤에도 동등한 재생 control에 키보드 포커스를 유지한다.
- 재생 버튼, 단계 이동과 다시 듣기로 시작한 재생의 자동 완료 경로를 같은 규칙으로 처리한다.
- 이미 통과한 HIGH 4건, TTS 오류 fallback, 48개 작은 화면 상태, 접근성 글자 크기, Reduce Motion과 WCAG AA는 변경하거나 회귀시키지 않는다.
- 후속 `T-20260729-013` 범위는 포함하지 않는다.
- UI/UX Design Agent는 최신 SHA `93f577e` 기반 `/private/tmp/cooklog-t20260729-012-focus-rework`에서 lock을 획득하고 `approved -> in_progress`로 전환한다.
- 완료 후 해당 자동 완료 포커스 경로와 기존 통과 항목을 자체 검증하고 Design QA Agent에 독립 재검증을 요청한다.
- commit, push, PR, merge는 별도 Product Owner 승인 전 실행하지 않는다.

## Design Lead 완료 검토

- Task 성공 기준과 최신 Design QA `PASS`를 대조해 기존 결함 6건 해소, 잔존·신규 결함 0건을 확인했다.
- 완료 레시피 단일 원본, 버튼과 7개 음성 명령 동등성, 명시적 권한 허용, 재생 상태 보존, 중단 뒤 수동 복구와 TTS 오류 fallback이 iOS 구현 가능한 상태 계약으로 정리돼 있다.
- 재생·단계 이동·다시 듣기와 마지막 단계의 timer 자동 완료 뒤 포커스 복원, 작은 화면, Light·Dark, 접근성 글자 크기, Reduce Motion과 WCAG AA 무회귀를 확인했다.
- 변경 파일은 모두 Task `allowed_paths` 안에 있고 Figma 원본·앱 구현 코드·후속 `T-20260729-013` 범위를 변경하지 않았다.
- Figma 미수정은 로컬 Prototype과 Manifest가 구현·QA 우선 Source of Truth라는 기존 정책에 따라 비차단이다.
- Prototype·README·Manifest revision `audio-guide-focus-rework-20260731`이 일치하고 실행 보고서·최종 QA가 iOS 핸드오프 근거를 제공한다.
- Task 브랜치는 최신 `origin/develop`보다 1커밋 뒤지만 upstream은 Backend T-022와 공용 보드 변경으로 디자인 판정에 영향이 없다. Quality Board 정합화는 병합 전 Git gate에서 수행한다.
- 완료 검토를 통과해 `completion_review`로 인계한다. develop 병합 전에는 `done`으로 변경하지 않으며 `T-20260729-013`과 상위 `T-20260729-002`를 완료하지 않는다.

## 완료 확정

- PR #42가 `develop`에 squash merge됐고 merge SHA는 `2b9b7502d521db64f2ce11ac3e6a249e7cabf210`이다.
- 최신 develop 재정렬 과정에서 Product T-20260731-001과 CI T-20260730-005의 공용 보드 기록을 보존했다.
- PR의 `ios-build`와 `ios-xctest`가 모두 통과했고 최종 Design QA `PASS`와 완료 검토 결과에 회귀가 없다.
- 후속 `T-20260729-013`의 선행 차단은 해제됐지만 실행은 별도 Product Owner 승인이 필요하다.
- 상위 `T-20260729-002`는 후속 `T-20260729-013~014`가 남아 있으므로 `in_progress`를 유지한다.
