---
id: T-20260729-012
title: Audio Guide·핸즈프리·오디오 중단 상태 디자인
status: proposed
type: feature
priority: P0
priority_reason: 버튼과 사용자가 시작하는 핸즈프리는 첫 공개 출시의 핵심 재사용 경험이며 실패해도 조리를 계속할 fallback이 필요하다.
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
  - design/prototype/
created_by: Design Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-29
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

- 없음. 출시 필수 명령과 동작은 제품 문서에서 확정됐다.
