---
id: T-20260729-004
title: iOS 10초 녹음·권한·온라인 STT 연동
status: proposed
type: feature
priority: P0
priority_reason: 실제 음성을 STEP Preview 텍스트로 만드는 기록 경험의 필수 경로다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: feature
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities:
  - technical_planning
  - dependency_management
depends_on:
  - T-20260728-003
  - T-20260728-005
  - T-20260729-003
blocks:
  - T-20260728-009
parallel_group: release-r2-ios-services
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
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - T-20260728-005에서 승인된 STT API 계약
  - T-20260729-003에서 검증된 Backend 환경
  - apps/ios/docs/SERVICES.md
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260729-004_integrate-ios-online-stt-report.md
qa_to: .ai_project/qa/T-20260729-004_integrate-ios-online-stt-qa.md
---

# iOS 10초 녹음·권한·온라인 STT 연동

## 목적

Mock Speech를 실제 10초 녹음과 Backend 온라인 STT로 교체하고, 실패해도 기존 진행 기록을 손상하지 않는 기록 경험을 완성한다.

## 제안 범위

- 첫 기록 시점의 마이크 권한 설명·요청·거부·설정 이동
- 정확히 10초인 녹음과 자동 종료, 남은 시간·처리 중 상태
- 인터넷 사전 확인과 Backend 음성 업로드
- 복구 가능한 네트워크·업로드·STT 오류의 1회 자동 재처리
- STT 성공 시 원문 중심 STEP Preview 1개 생성·자동 저장
- 성공·최종 실패·재처리 종료 후 로컬 임시 음성 즉시 삭제
- 최종 실패 원인 안내, 기존 STEP 보존과 `다시 기록하기`
- 오프라인 음성 queue와 자동 on-device fallback 미지원
- background·audio session·temporary file cleanup 경계
- 단위·integration·실기기 권한·소음 환경 검증

## 제외 범위

- 조기 종료, 시간 연장과 녹음 일시정지·재개
- 텍스트 직접 입력과 STT 취소·수동 재처리
- 오프라인 음성 보관과 자동 로컬 STT
- AI 정리와 핸즈프리 명령

## 성공 기준

- 권한이 있는 실제 iPhone에서 10초 후 녹음이 자동 종료되고 STT 텍스트가 STEP Preview로 저장된다.
- 복구 가능한 오류는 정확히 1회만 자동 재처리하며 중복 STEP을 만들지 않는다.
- 최종 실패 시 새 STEP을 만들지 않고 기존 기록을 보존하며 임시 음성을 삭제한다.
- 앱 재실행·오프라인·권한 거부 이후에도 기존 진행·완료 레시피를 사용할 수 있다.
- PRD 최소 표본의 STT 검증을 최종 출시 Task에서 수행할 수 있는 진단 정보가 존재한다.
- iOS QA Agent가 권한, 10초 경계, 실패·삭제·중복 방지와 실제 기기 흐름을 통과시킨다.

## 사용자 결정 필요 항목

- 실제 Backend 개발·스테이징 endpoint와 인증 설정 승인
- 마이크 권한 시스템 문구의 최종 배포 문자열

## Development Lead 하위 Task 분해 요구

1. AVAudioSession·10초 recorder·temporary file lifecycle
2. 마이크 권한·설정 이동·오프라인 preflight
3. STT API client·인증·upload·1회 retry
4. error mapping·STEP 저장·중복 방지
5. background·cleanup·단위·integration test
6. 실제 iPhone 권한·일반 실내·조리 소음 QA
