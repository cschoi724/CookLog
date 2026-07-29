---
id: T-20260729-003
title: 실제 STT·AI provider와 배포 가능한 Backend gateway 구축
status: proposed
type: feature
priority: P0
priority_reason: 첫 공개 출시의 온라인 음성 변환과 AI 정리를 실제 환경에서 안전하게 제공하는 필수 경로다.
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
  - T-20260728-005
  - T-20260728-006
blocks:
  - T-20260729-004
  - T-20260729-005
  - T-20260728-009
parallel_group: release-r2-services
allowed_paths:
  - apps/backend/
  - docs/
  - .github/
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
  - docs/PROJECT_DECISIONS.md
  - T-20260728-005에서 승인된 Backend 계약
  - T-20260728-006에서 검증된 Backend foundation
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260729-003_build-production-stt-ai-backend-gateway-report.md
qa_to: .ai_project/qa/T-20260729-003_build-production-stt-ai-backend-gateway-qa.md
---

# 실제 STT·AI provider와 배포 가능한 Backend gateway 구축

## 목적

승인된 계약과 foundation에 실제 STT·AI provider를 연결하고, 개인정보·비용·장애 정책을 지키는 개발·스테이징 배포 후보를 만든다.

## 제안 범위

- 승인된 STT와 AI provider adapter
- 10초 음성 upload·transcription과 음성 즉시 삭제·최대 1시간 TTL
- AI generation·status 조회와 결과 수신 확인·최대 24시간 복구 cache
- 요청 idempotency, rate limit, timeout, 오류 매핑과 사용자 재실행 경계
- prompt·model·schema version과 structured output 검증
- secret manager 또는 동등한 안전한 secret 주입
- 사용자 콘텐츠 없는 운영 metadata·비용 계측과 최대 30일 보관
- redacted log, health, readiness와 최소 observability
- 개발·스테이징 배포 자동화, rollback과 service disable 절차
- provider sandbox·계약·보안·개인정보 테스트

## 제외 범위

- iOS client 구현
- 사용자 계정과 레시피 서버 저장
- Product Owner 승인 없는 production 환경 생성·트래픽 전환
- 콘텐츠 logging, 모델 학습용 데이터 수집과 24시간을 넘는 AI 콘텐츠 보관

## 성공 기준

- 실제 10초 음성이 계약대로 텍스트로 변환되고 임시 음성이 정책 시간 안에 삭제된다.
- 실제 AI가 versioned schema의 Review를 반환하며 invalid output은 명시적 오류로 처리된다.
- 같은 request id가 중복 레시피나 중복 과금 요청을 만들지 않는다.
- AI 결과 복구 cache, 운영 metadata와 로그가 확정 TTL·redaction 정책을 준수한다.
- provider 장애, timeout, rate limit과 비용 상한을 테스트할 수 있고 rollback 절차가 문서화된다.
- Backend QA Agent가 계약·보안·개인정보·비용·장애 검증을 통과시킨다.

## 사용자 결정 필요 항목

- `T-20260728-005`가 추천한 provider·model·runtime·배포 환경과 비용 상한 승인
- 외부 개발·스테이징 환경 생성과 secret 설정 승인
- production 전환은 `T-20260728-009`에서 별도 승인

## Development Lead 하위 Task 분해 요구

1. STT provider adapter와 음성 lifecycle
2. AI provider adapter·prompt·schema validation
3. idempotency·status·result acknowledgement와 TTL cleanup
4. rate limit·비용 계측·service disable
5. secret·redacted logging·observability·보안 hardening
6. 개발·스테이징 배포·rollback·runbook
7. Backend QA 계약·개인정보·장애·비용 검증
