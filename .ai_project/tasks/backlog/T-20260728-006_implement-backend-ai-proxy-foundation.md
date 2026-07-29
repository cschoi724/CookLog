---
id: T-20260728-006
title: Backend STT·AI gateway foundation 구현
status: proposed
type: feature
priority: P0
priority_reason: 승인된 API 계약을 실행 가능한 안전한 Backend 기반으로 전환한다.
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
blocks:
  - T-20260729-003
  - T-20260728-009
parallel_group:
allowed_paths:
  - apps/backend/
  - docs/
  - .github/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - T-20260728-005에서 확정된 Backend 아키텍처와 API 계약
  - docs/product/CookLog_PRD_v2.md
  - .ai_project/source_of_truth.md
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260728-006_implement-backend-ai-proxy-foundation-report.md
qa_to: .ai_project/qa/T-20260728-006_implement-backend-ai-proxy-foundation-qa.md
---

# Backend STT·AI gateway foundation 구현

## 목적

승인된 아키텍처와 API 계약을 기준으로 실제 provider 연결 전에도 STT와 AI 정리를 실행·테스트할 수 있는 Backend foundation을 만든다.

## 제안 범위

- 서버 프로젝트 scaffold와 환경별 설정
- health endpoint, speech transcription endpoint와 recipe generation·status endpoint
- STT·AI provider abstraction과 Mock provider
- schema validation과 공통 오류 응답
- 환경변수 기반 secret 주입
- 구조화 로그와 민감정보 redaction
- TTL cleanup, idempotency, rate limit과 비용 계측의 테스트 가능한 경계
- 단위 테스트, 계약 테스트, 로컬 실행 문서

## 제외 범위

- 승인되지 않은 AI provider 실서비스 연결
- iOS 원격 DataSource 연결
- 사용자 계정과 레시피 서버 저장
- 배포와 운영 트래픽 전환

## 성공 기준

- 새 클론에서 문서화된 명령으로 서버가 실행된다.
- health와 Mock STT·AI endpoint가 계약대로 응답한다.
- 정상·오류 계약 테스트가 통과한다.
- secret이 코드와 로그에 노출되지 않는다.
- Backend QA Agent가 계약·보안·개인정보 검증을 통과시킨다.

## 사용자 결정 필요 항목

- 없음. 실제 provider와 배포 환경은 `T-20260729-003`에서 별도 승인 후 연결한다.

## Development Lead 하위 Task 분해 요구

1. 서버 scaffold·환경 설정·health
2. 공통 오류·인증·rate limit·idempotency middleware
3. Mock STT endpoint와 음성 임시 저장·삭제
4. Mock AI generation·status endpoint와 결과 복구 캐시
5. redacted logging·사용량 계측·TTL cleanup
6. 단위·계약·보안 테스트와 로컬 실행 문서
