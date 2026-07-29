---
id: T-20260729-006
title: iOS 로컬 TTS·오디오 중단·핸즈프리 Audio Guide 구현
status: proposed
type: feature
priority: P0
priority_reason: 저장된 개인 레시피를 실제 요리에서 다시 사용하는 제품의 핵심 재사용 경험이다.
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
  - T-20260729-002의 승인된 Audio Guide 디자인
  - apps/ios/docs/SERVICES.md
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260729-006_implement-ios-audio-guide-handsfree-report.md
qa_to: .ai_project/qa/T-20260729-006_implement-ios-audio-guide-handsfree-qa.md
---

# iOS 로컬 TTS·오디오 중단·핸즈프리 Audio Guide 구현

## 목적

저장된 레시피를 단계별 로컬 TTS로 들으며 버튼과 사용자가 활성화한 음성 명령으로 안전하게 조작할 수 있게 한다.

## 제안 범위

- AVSpeechSynthesizer 또는 승인된 로컬 TTS service
- 화면 진입 시 자동 재생 없음, 단계 낭독 후 사용자 행동 대기
- 이전·다음·일시정지·재생·다시 듣기와 마지막 단계 안내
- 숫자·요리 단위의 deterministic 음성 출력 변환
- 느리게·보통·빠르게 속도와 설정 유지
- 재료 듣기와 현재 단계 보존
- 전화·Siri·다른 오디오·Bluetooth 해제·background 중단 처리
- Audio Guide 화면의 자동 잠금 방지와 수동 잠금 후 자동 재활성화 금지
- 첫 `핸즈프리 시작` 권한·활성화와 화면 밖 비활성화
- 호출어 없는 다음·이전·멈춰·계속·다시 들려줘·재료 알려줘·핸즈프리 종료
- TTS 재생 중 명령 인식과 공통 action model
- 불확실한 명령 미실행, 인식 실패 후 버튼 fallback
- 단위·audio interruption·실기기·조리 소음 검증

## 제외 범위

- Audio Guide 화면 밖 상시 듣기와 호출어
- 서버 생성 TTS와 녹음 파일 저장
- background 지속 핸즈프리와 자동 재활성화
- 사용자 명령 음성 장기 저장

## 성공 기준

- 모든 버튼이 단계·재생 상태를 잃지 않고 동일 action model을 실행한다.
- TTS가 화면 데이터를 바꾸지 않고 승인된 숫자·단위만 자연스럽게 읽는다.
- 오디오 중단과 Bluetooth 해제 시 즉시 일시정지하고 자동 재생하지 않는다.
- 사용자가 시작한 동안만 7개 명령이 동작하며 `핸즈프리 종료`는 mic만 끈다.
- 인식 실패·권한 거부 후에도 버튼으로 모든 행동을 이어간다.
- iOS QA Agent가 실제 기기, TTS 중 명령, 오디오 중단, 화면 잠금과 조리 소음 흐름을 통과시킨다.

## 사용자 결정 필요 항목

- 핸즈프리 구현 spike 결과로 제안되는 Apple framework 조합과 지원 기기 범위 승인
- 마이크·음성 인식 권한 시스템 문구의 최종 배포 문자열

## Development Lead 하위 Task 분해 요구

1. local TTS·단위 normalization·속도
2. Audio Guide state machine과 공통 button action
3. audio session interruption·Bluetooth·screen lifecycle
4. handsfree activation·permission·command recognizer spike
5. 7개 명령과 TTS 동시 동작·button fallback
6. 단위·integration·실기기·조리 소음 QA
