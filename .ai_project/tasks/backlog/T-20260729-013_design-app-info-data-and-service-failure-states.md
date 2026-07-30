---
id: T-20260729-013
title: 앱 정보·데이터 보관·법적 문서·서비스 장애 디자인
status: proposed
type: feature
priority: P0
priority_reason: 첫 공개 출시에서 로컬 보관 한계와 온라인 장애를 정확히 안내하고 지원·법적 정보로 접근할 수 있어야 한다.
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
  - design_handoff
depends_on:
  - T-20260729-012
blocks:
  - T-20260729-014
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
report_to: .ai_project/reports/T-20260729-013_design-app-info-data-and-service-failure-states-report.md
qa_to: .ai_project/qa/T-20260729-013_design-app-info-data-and-service-failure-states-qa.md
---

# 앱 정보·데이터 보관·법적 문서·서비스 장애 디자인

## 목적

사용자가 로컬 데이터 보관 범위, 지원 경로와 법적 정보를 찾을 수 있고 온라인 장애 중에도 가능한 로컬 행동을 이해하게 한다.

## 실행 범위

- Home의 앱 정보 진입
- 이메일 문의하기
- 개인정보처리방침과 이용약관 링크 상태
- 데이터 보관 안내
- 앱 삭제, 기기 초기화·분실과 저장소 손상 시 유실 가능성
- CookLog 자체 백업·복구·동기화 미제공 안내
- 문의에 사용자 콘텐츠 자동 첨부 없음
- 사용자 선택 시 앱 버전·비콘텐츠 진단 정보 포함
- 인터넷 연결, 음성 변환, AI 정리와 로컬 저장 실패의 사용자 원인 범주
- 실패한 온라인 행동만 다시 실행하는 CTA
- 장애 중 계속 사용 가능한 진행·완료 레시피, 검색과 Audio Guide 안내
- 링크 로딩·열기 실패와 이메일 앱 사용 불가 상태

## 제외 범위

- 실제 법률 문안 작성과 URL·문의 이메일 운영 설정
- 서비스 상태 페이지, 실시간 채팅과 24시간 고객지원
- 장애 복구 푸시와 자동 화면 이동
- 콘텐츠가 포함된 진단 로그

## 성공 기준

- 앱 정보에서 문의, 개인정보처리방침, 이용약관과 데이터 보관 안내에 도달할 수 있다.
- 자체 백업·복구를 제공하지 않는 경계가 과도한 상시 경고 없이 정확히 전달된다.
- 온라인 장애와 로컬 저장 실패가 다른 행동으로 안내된다.
- 실패 화면에서 사용 가능한 로컬 기능이 불필요하게 차단되지 않는다.
- 문의 동의와 콘텐츠 비첨부 원칙이 명확하다.
- Design QA Agent가 정보 접근성, 장애별 행동과 오해 가능성을 독립 검증한다.

## 사용자 결정 필요 항목

- 실제 문의 이메일, 개인정보처리방침 URL과 이용약관 URL은 출시 통합 Task에서 확정해야 한다.

이 값은 화면 구조와 placeholder 상태 설계를 막지 않지만 실제 링크 검증과 공개 출시를 차단한다.
