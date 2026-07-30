---
id: T-20260729-010
title: Cooking Log·STEP Preview·권한·STT 오류 디자인
status: proposed
type: feature
priority: P0
priority_reason: 10초 기록과 텍스트 STEP 보존은 CookLog의 핵심 입력 경험이며 온라인 STT 실패가 기존 기록을 손상하지 않는 상태가 필요하다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: UI/UX Design Agent
target_role: Execution Role
required_capabilities:
  - ux_flow
  - ui_design
  - prototyping
depends_on:
  - T-20260729-009
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
  - design/prototype/
created_by: Design Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260729-010_design-cooking-log-step-preview-and-stt-errors-report.md
qa_to: .ai_project/qa/T-20260729-010_design-cooking-log-step-preview-and-stt-errors-qa.md
---

# Cooking Log·STEP Preview·권한·STT 오류 디자인

## 목적

고정 10초 기록, 원문 STEP Preview 축적과 실패 복구를 사용자가 레시피 폼 작성 없이 반복할 수 있는 흐름으로 설계한다.

## 실행 범위

- 첫 기록 맥락형 안내와 마이크 사용 이유
- 마이크 권한 요청, 거부와 `설정으로 이동`
- 10초 고정 녹음, 남은 시간과 자동 종료
- 업로드·STT 처리 중과 1회 자동 재처리 상태
- 10초 기록 1개당 원문 STEP 1개
- 녹음 시간순 고정, 직접 수정·재배열 없음
- 왼쪽 스와이프 삭제와 짧은 되돌리기
- STEP 추가·삭제 자동 저장 피드백
- 오프라인 기록 시작 차단과 인터넷 연결 안내
- STT 최종 실패 후 기존 STEP 유지와 `다시 기록하기`
- AI 처리 중 snapshot 잠금 상태에서 STEP 조작 비활성

## 제외 범위

- 조기 종료, 시간 연장과 녹음 일시정지·재개
- STT 취소·수동 재시도와 오프라인 대기열
- on-device STT 선택 UI
- STEP 본문 직접 수정과 순서 변경

## 성공 기준

- 기록 시작부터 STEP 추가와 반복 기록까지 앱 내부 조작만으로 완주할 수 있다.
- 녹음, 처리, 자동 재처리, 성공과 최종 실패가 시각·문구로 구분된다.
- 실패 상태에서도 기존 STEP과 진행 기록이 보존되는 것이 명확하다.
- 마이크 거부와 오프라인 상태가 Home·기존 레시피 기능을 막지 않는다.
- 삭제와 되돌리기, 자동 저장, 처리 중 잠금 상태를 Prototype에서 확인할 수 있다.
- Design QA Agent가 핵심 기록 흐름, 오류 행동과 접근성을 독립 검증한다.

## 사용자 결정 필요 항목

- 없음. 10초 고정과 온라인 STT 정책을 그대로 표현한다.
