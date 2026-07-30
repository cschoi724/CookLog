---
id: T-20260729-010
title: Cooking Log·STEP Preview·기기 내 STT·권한·오류 디자인
status: done
type: feature
priority: P0
priority_reason: 10초 기록과 텍스트 STEP 보존은 CookLog의 핵심 입력 경험이며 Apple 기기 내 STT의 권한·지원·실패 상태가 기존 기록을 손상하지 않아야 한다.
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
  - T-20260729-009
  - T-20260729-026
blocks:
  - T-20260729-011
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
  - .ai_project/tasks/active/T-20260729-026_change-first-release-stt-policy.md
  - design/prototype/
created_by: Design Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-30
report_to: .ai_project/reports/T-20260729-010_design-cooking-log-step-preview-and-stt-errors-report.md
qa_to: .ai_project/qa/T-20260729-010_design-cooking-log-step-preview-and-stt-errors-qa.md
---

# Cooking Log·STEP Preview·기기 내 STT·권한·오류 디자인

## 목적

고정 10초 기록, 원문 STEP Preview 축적과 실패 복구를 사용자가 레시피 폼 작성 없이 반복할 수 있는 흐름으로 설계한다.

## 실행 범위

- 첫 기록 맥락형 안내와 마이크 사용 이유
- 마이크 권한 요청, 거부와 `설정으로 이동`
- 10초 고정 녹음, 남은 시간과 자동 종료
- Apple 기기 내 STT 처리 중과 같은 adapter의 1회 자동 재처리 상태
- 10초 기록 1개당 원문 STEP 1개
- 녹음 시간순 고정, 직접 수정·재배열 없음
- 왼쪽 스와이프 삭제와 짧은 되돌리기
- STEP 추가·삭제 자동 저장 피드백
- 지원 환경에서 오프라인 10초 기록과 STEP Preview 생성
- 기기 내 STT 미지원·인식 실패 구분, 원격 자동 fallback·외부 음성 전송 없음 안내
- STT 최종 실패 후 원본 삭제, 기존 STEP 유지와 `다시 기록하기`
- 오프라인 `AI 정리하기` 선택 시 인터넷 연결 필요 안내와 STEP Preview 유지
- AI 처리 중 snapshot 잠금 상태에서 STEP 조작 비활성

## 제외 범위

- 조기 종료, 시간 연장과 녹음 일시정지·재개
- STT 취소·수동 재시도와 오프라인 대기열
- on-device STT 선택 UI
- 원격 STT 활성화·provider 선택·업로드 상태
- STEP 본문 직접 수정과 순서 변경

## 성공 기준

- 기록 시작부터 STEP 추가와 반복 기록까지 앱 내부 조작만으로 완주할 수 있다.
- 녹음, 처리, 자동 재처리, 성공과 최종 실패가 시각·문구로 구분된다.
- 실패 상태에서도 기존 STEP과 진행 기록이 보존되는 것이 명확하다.
- 마이크 거부와 기기 내 STT 미지원·실패가 Home·기존 레시피 기능을 막지 않는다.
- 지원 환경에서는 오프라인 기록이 가능하고 AI 정리만 온라인 의존으로 구분된다.
- 기기 내 STT 실패가 원격 fallback이나 Backend·외부 제공업체 음성 전송을 일으키지 않는다.
- 삭제와 되돌리기, 자동 저장, 처리 중 잠금 상태를 Prototype에서 확인할 수 있다.
- Design QA Agent가 핵심 기록 흐름, 오류 행동과 접근성을 독립 검증한다.

## 사용자 결정 필요 항목

- 없음. 10초 고정과 Product Owner가 완료 승인한 Apple 기기 내 STT 정책을 그대로 표현한다.

## Design Lead 준비 결과

- 선행 `T-20260729-009`의 develop 병합과 `done`, 제품 정책 `T-20260729-026`의 `done`을 확인했다.
- 기존 초안의 온라인 STT, 업로드 처리, 오프라인 기록 차단 전제를 제거하고 Apple 기기 내 STT와 오프라인 기록 가능 기준으로 scope를 교정했다.
- 공용 Prototype·Manifest 파일 충돌을 막기 위해 T-010 단일 실행 패키지로 유지하고 후속 `T-20260729-011` 범위를 포함하지 않는다.
- 전용 worktree는 `/private/tmp/cooklog-t20260729-010`, 브랜치는 `task/T-20260729-010-design-cooking-log-step-preview-and-stt-errors`다.
- 기준점은 PR #17까지 반영된 최신 `origin/develop` SHA `af4b9594fabce998dacf7c56aca8309a4cb154b6`다.
- Product Owner 실행 승인 후 UI/UX Design Agent가 lock을 획득하고 `approved -> in_progress`로 전환한다.
- 실행 완료 후 자체 검증과 보고서를 작성해 `verification_ready`로 Design QA Agent에 독립 검증을 요청한다.
- commit, push, PR, merge는 별도 Product Owner 승인 전 실행하지 않는다.

## 상태 전이 기록

- 2026-07-30: Design Lead Agent가 선행 Task, 최신 제품 정책, Source of Truth, allowed paths와 공용 파일 ownership을 확인하고 온라인 STT 전제를 기기 내 STT 기준으로 교정해 `proposed -> scoped`로 전환했다.
- 2026-07-30: Product Owner가 T-010 실행을 승인해 `scoped -> approved`로 전환하고 UI/UX Design Agent에 라우팅했다.
- 2026-07-30: UI/UX Design Agent가 전용 worktree·브랜치·선행 Task·허용 경로를 확인하고 lock을 획득해 `approved -> in_progress`로 전환했다.
- 2026-07-30: UI/UX Design Agent가 Cooking Log·STEP Preview·기기 내 STT·권한·오류 상태 구현과 자체 검증을 완료하고 lock을 해제해 `in_progress -> verification_ready`로 전환한 뒤 Design QA Agent에 인계했다.
- 2026-07-30: Design QA Agent가 독립 검증에서 자동 재처리 전이, 짧은 Undo 수명주기·포커스, 오프라인 기록 행동 중복과 Prototype 버전 표기 결함을 확인해 `verification_ready -> rework_requested`로 전환하고 UI/UX Design Agent에 재작업을 요청했다.
- 2026-07-30: Product Owner가 Design QA 결함 4건의 재작업을 승인해 `rework_requested -> approved`로 전환하고 UI/UX Design Agent에 다시 라우팅했다.
- 2026-07-30: UI/UX Design Agent가 전용 worktree에서 재작업 lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-07-30: UI/UX Design Agent가 승인된 결함 4건을 수정하고 동적·접근성 회귀 검증을 통과해 lock을 해제한 뒤 `in_progress -> verification_ready`로 전환하고 Design QA Agent에 독립 재검증을 요청했다.
- 2026-07-30: Design QA Agent가 결함 4건 해소와 기존 통과 항목 무회귀를 실제 브라우저 경로로 독립 재검증해 `verification_ready -> verification_passed`로 전환하고 Design Lead Agent에 인계했다.
- 2026-07-30: Design Lead Agent가 성공 기준, 최종 Design QA, allowed paths, Figma 비차단 근거와 iOS 구현 핸드오프를 완료 검토해 `verification_passed -> completion_review`로 인계했다. develop 통합 전이므로 `done` 전환과 후속 `T-20260729-011` 차단 해제는 보류했다.
- 2026-07-30: Product Owner 승인으로 PR #22를 `develop`에 squash merge하고 merge SHA `aaa6ff26a6a395851c3a61ac62777406c68dfc75`를 확인해 `completion_review -> done`으로 확정했다.

## 실행 결과

- 첫 기록 마이크 사용 이유, 권한 거부와 설정 이동 상태를 추가하고 권한 없이도 기존 기능이 유지됨을 명시했다.
- 10초 고정 카운트다운과 자동 종료, Apple 기기 내 STT 처리, 같은 adapter의 자동 재처리 1회 상태를 구현했다.
- 기기 내 STT 미지원·최종 실패에서 원격 fallback과 외부 음성 전송이 없고 임시 음성 삭제·기존 STEP 보존·명시적 다시 기록 행동을 제공했다.
- 원문 STEP의 녹음 시간순 고정, 추가·삭제·되돌리기 자동 저장, 왼쪽 스와이프와 접근 가능한 삭제 행동을 구현했다.
- 지원 환경의 오프라인 기록, 오프라인 AI 연결 안내와 AI 정리 snapshot 잠금 상태를 구현했다.
- Prototype·Gallery·README와 Manifest revision `cooking-log-on-device-stt-20260730`을 동기화했다.
- JavaScript·JSON·Figma 스크립트 파싱, 계약 검사 `23/23`, 대표 상태 HTTP `14/14`, Safari 시각·자동 전이와 접근성 회귀 검증을 통과했다.

## Design QA 재작업 요청

- `DQA-HIGH-010-001`: 복구 가능한 기기 내 STT 오류가 사용자 행동 없이 같은 adapter의 자동 재처리 1회로 전이되고 성공·최종 실패 분기를 실제 Prototype에서 재현하도록 한다.
- `DQA-MEDIUM-010-001`: 짧은 Undo 만료와 Undo 성공·만료 후 안정적인 키보드 포커스 복귀를 구현한다.
- `DQA-MEDIUM-010-002`: 오프라인 상태의 중복 `10초 더 기록` 행동을 하나로 정리한다.
- `DQA-MEDIUM-010-003`: 공식 Prototype의 T-009 표기를 T-010 revision과 동기화한다.
- 상세 재현 절차와 수용 기준은 `.ai_project/qa/T-20260729-010_design-cooking-log-step-preview-and-stt-errors-qa.md`를 따른다.

## 승인된 재작업 범위

- Product Owner가 2026-07-30 Design QA 결함 4건의 재작업을 승인했다.
- `DQA-HIGH-010-001`, `DQA-MEDIUM-010-001~003`과 해당 회귀 검증만 수행한다.
- 기존 통과 항목, Apple 기기 내 STT 제품 정책과 후속 `T-20260729-011` 범위는 변경하지 않는다.
- UI/UX Design Agent는 기존 전용 worktree에서 lock을 획득한 뒤 재작업을 시작하고 완료 시 자체 검증 후 Design QA Agent에 독립 재검증을 요청한다.
- 최신 `origin/develop` 정렬과 Quality Board 정합화는 재검증 통과 후 병합 전 Git gate로 유지한다.
- commit, push, PR, merge는 별도 Product Owner 승인 전 실행하지 않는다.

## 재작업 결과

- `DQA-HIGH-010-001`: 제품 화면의 검토용 수동 행동을 제거하고 `success`, `retry-success`, `retry-failure` 시나리오에서 성공·자동 재처리 성공·자동 재처리 최종 실패가 사용자 행동 없이 실제 전이되도록 구현했다.
- `DQA-MEDIUM-010-001`: Undo를 5초 후 만료시키고 삭제 직후 Undo, 성공 후 복구 STEP, 만료 후 가장 가까운 STEP 또는 기록 행동으로 키보드 포커스를 복귀시켰다.
- `DQA-MEDIUM-010-002`: 오프라인 상태의 `10초 더 기록` 행동을 하단 행동 그룹의 한 개로 통합했다.
- `DQA-MEDIUM-010-003`: Prototype·Gallery·README·Manifest revision을 `cooking-log-on-device-stt-20260730`으로 통일했다.
- 정적 수용 기준 `18/18`, STT 자동 분기 `3/3`, Undo 성공·만료·포커스와 오프라인 행동·revision 실제 DOM 검증을 통과했다.

## Design Lead 완료 검토

- 첫 권한 안내부터 10초 기록, 기기 내 STT 처리·자동 재처리, STEP 보존·삭제·되돌리기, 오프라인 기록과 AI snapshot 잠금까지 Task 성공 기준을 충족했다.
- 최종 Design QA가 결함 4건 해소, 신규 결함 없음과 기존 통과 항목 무회귀를 확인해 `verification_passed`로 판정했다.
- 변경 파일은 모두 Task의 `allowed_paths` 안에 있으며 JavaScript·JSON 파싱과 `git diff --check`를 통과했다.
- Figma 원본 미수정은 로컬 Prototype과 Manifest를 공식 UI Source of Truth로 정한 Task 계약에 따라 비차단이다.
- 상태 URL 14개, 자동 STT 분기, Undo 수명주기·포커스, 권한·오류·오프라인·snapshot 계약과 접근성 기준이 포함되어 iOS 구현에 필요한 핸드오프가 준비됐다.
- Task 브랜치는 최신 `origin/develop`보다 4커밋 뒤지만 upstream이 디자인 Source of Truth를 변경하지 않아 완료 판정을 차단하지 않는다. 최신 develop 정렬, patch 동등성 확인과 Quality Board 정합화는 병합 전 Git gate로 남긴다.
- develop 병합 전에는 `done`으로 전환하지 않으며 후속 `T-20260729-011`은 이 Task의 `done`과 별도 Product Owner 실행 승인 전까지 `proposed`를 유지한다.

## 완료 확정

- PR #22가 `develop`에 squash merge됐고 merge SHA는 `aaa6ff26a6a395851c3a61ac62777406c68dfc75`다.
- 병합 전 최신 develop 정렬, patch 동등성, Quality Board 정합화와 로컬 검증을 완료했다.
- 후속 `T-20260729-011`의 선행 차단은 해제됐지만 실행은 별도 Product Owner 승인이 필요하다.
