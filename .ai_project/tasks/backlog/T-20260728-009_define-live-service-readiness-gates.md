---
id: T-20260728-009
title: iOS 첫 공개 출시 통합·TestFlight·App Store 게이트
status: proposed
type: feature
priority: P0
priority_reason: 실제 서비스 구현을 하나의 배포 후보로 통합하고 최소 품질·개인정보·운영 기준을 통과해야 Mission을 완료할 수 있다.
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
  - T-20260728-003
  - T-20260728-004
  - T-20260728-008
  - T-20260729-003
  - T-20260729-004
  - T-20260729-005
  - T-20260729-006
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
  - T-20260729-002의 승인된 디자인 기준
  - T-20260728-005의 승인된 Backend 계약
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260728-009_define-live-service-readiness-gates-report.md
qa_to: .ai_project/qa/T-20260728-009_define-live-service-readiness-gates-qa.md
---

# iOS 첫 공개 출시 통합·TestFlight·App Store 게이트

## 목적

검증된 iOS·Backend 결과를 실제 환경의 하나의 릴리즈 후보로 통합하고 내부 TestFlight와 첫 App Store 공개 출시 게이트를 순서대로 통과시킨다.

## 제안 범위

- 실제 개발·스테이징 환경 설정과 iOS 통합
- 전체 기록·STT·AI Review·저장·재실행·Audio Guide 회귀
- 서비스 장애, 보관 TTL, secret redaction, 비용 상한과 rollback 확인
- App ID, signing, version/build, archive와 내부 TestFlight 배포 준비
- 실제 iPhone 1대·내부 1명의 최소 출시 품질 게이트 수행
- 개인정보처리방침·이용약관·지원 URL·문의 이메일과 App Store privacy 응답 정합성
- App Store metadata, screenshots, review notes와 제출 체크리스트
- 잔여 리스크와 Product Owner 출시 승인 기록

## 제외 범위

- 선행 기능의 대규모 재설계
- Product Owner 승인 없는 Backend production 전환, TestFlight 배포와 App Store 제출
- 수익화·StoreKit·Pro 구독
- Android 활성화

## 성공 기준

- 실제 환경의 핵심 전체 흐름이 3회 연속 성공한다.
- PRD의 STT·AI·핸즈프리 최소 표본과 데이터 손실 0건 기준을 통과한다.
- 필수 CI가 통과하고 미해결 P0·P1 결함이 없다.
- 보안·개인정보·TTL·비용·장애 fallback과 rollback 증거가 남는다.
- TestFlight 결과와 App Store 제출 자료가 서로 일치한다.
- Product Owner가 외부 변경과 최종 제출을 단계별로 승인한다.

## 사용자 결정 필요 항목

- 실제 Backend production 환경 생성·전환 승인
- TestFlight 업로드와 외부 테스터 범위 승인
- 개인정보처리방침·이용약관·지원 URL과 문의 이메일 실제 값
- App Store 가격·지역·등급·metadata와 최종 제출 승인

## Development Lead 하위 Task 분해 요구

1. iOS·Backend 스테이징 통합과 end-to-end smoke
2. secret·TTL·비용 상한·장애·rollback 운영 검증
3. archive·signing·TestFlight 내부 배포 준비
4. 실제 iPhone 최소 품질 게이트와 iOS/Backend QA 통합 결과
5. 법적·지원 URL, App Store privacy와 제출 metadata
6. release candidate 수용 검토와 Product Owner 단계별 승인
