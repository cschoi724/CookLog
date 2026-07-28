---
id: T-20260728-009
title: iOS 실서비스 전환 준비도와 릴리즈 게이트 정의
status: proposed
type: docs
priority: P1
priority_reason: 현재 live 환경도 STT·AI·Audio Guide가 Mock이므로 다음 실서비스 구현 범위를 명시적으로 분리해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: docs
target_agent: Development Lead Agent
target_role: Lead Role
required_capabilities:
  - technical_planning
  - dependency_management
depends_on:
  - T-20260728-001
  - T-20260728-002
  - T-20260728-005
  - T-20260728-007
blocks: []
parallel_group:
allowed_paths:
  - docs/
  - apps/ios/docs/
  - apps/backend/
  - design/
  - .ai_project/source_of_truth.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_ROADMAP.md
  - docs/PROJECT_STATUS.md
  - apps/ios/docs/STATUS.md
  - apps/ios/docs/SERVICES.md
  - apps/ios/docs/TESTING.md
  - T-20260728-002의 승인된 Figma 기준
  - T-20260728-005의 승인된 Backend 계약
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
report_to: .ai_project/reports/T-20260728-009_define-live-service-readiness-gates-report.md
qa_to: .ai_project/qa/T-20260728-009_define-live-service-readiness-gates-qa.md
---

# iOS 실서비스 전환 준비도와 릴리즈 게이트 정의

## 목적

기능 프로토타입을 내부 TestFlight 또는 외부 MVP로 전환하기 위해 필요한 실제 서비스, 개인정보, 배포와 운영 항목을 확인하고 후속 Task로 분리한다.

## 제안 범위

- Mock Speech, Mock AI, Mock Audio Guide의 실서비스 대체 범위
- Apple Speech 권한과 10초 녹음 구현 준비
- Backend AI 프록시 iOS 연결 준비
- AVSpeechSynthesizer 기반 실제 Audio Guide 준비
- 네트워크 오류, 재시도, 비용 제한과 feature flag
- 개인정보 문구, 로그 정책, 앱 내 안내
- App ID, signing, TestFlight, 버전 관리와 릴리즈 체크리스트
- crash reporting, 기본 관측성과 성공 지표 수집 범위
- 후속 구현·검증·배포 Task 분해

## 제외 범위

- 실제 서비스 구현
- App Store 제출
- 배포 또는 외부 설정 변경
- Android 활성화

## 성공 기준

- Mock에서 실서비스로 바꿔야 할 모든 경계와 우선순위가 목록화된다.
- TestFlight와 외부 MVP 각각의 진입 조건이 구분된다.
- 보안, 개인정보, 비용, 장애 대응과 rollback 기준이 정의된다.
- 각 준비 항목이 담당 Team, 의존성, 성공 기준을 가진 후속 Task 후보로 분리된다.

## 사용자 결정 필요 항목

- 다음 릴리즈 목표가 내부 TestFlight인지 외부 MVP인지
- 첫 릴리즈에 실제 Speech, AI, TTS를 모두 포함할지
- analytics와 crash reporting 도구 사용 여부
- 개인정보 처리방침과 지원 URL 준비 방식
