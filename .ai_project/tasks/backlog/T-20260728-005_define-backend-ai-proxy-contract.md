---
id: T-20260728-005
title: Backend STT·AI gateway 아키텍처와 API 계약 정의
status: proposed
type: docs
priority: P0
priority_reason: 실제 온라인 STT와 AI 정리 모두 iOS에 secret을 두지 않는 공통 Backend 계약이 선행되어야 한다.
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
  - T-20260729-001
blocks:
  - T-20260728-006
  - T-20260729-003
  - T-20260729-004
  - T-20260729-005
  - T-20260728-009
parallel_group: ios-m8-and-foundations
allowed_paths:
  - apps/backend/
  - docs/
  - apps/ios/docs/SERVICES.md
  - .ai_project/source_of_truth.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - apps/ios/docs/SERVICES.md
  - apps/ios/docs/DEVELOPMENT_SPEC.md
  - docs/PROJECT_DECISIONS.md
  - .ai_project/source_of_truth.md
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260728-005_define-backend-ai-proxy-contract-report.md
qa_to: .ai_project/qa/T-20260728-005_define-backend-ai-proxy-contract-qa.md
---

# Backend STT·AI gateway 아키텍처와 API 계약 정의

## 목적

iOS가 provider API Key를 보유하지 않고 10초 음성을 텍스트로 변환하고 STEP Preview를 안전하게 레시피 초안으로 구조화할 수 있도록 Backend 경계와 계약을 확정한다.

## 제안 범위

- Backend 코드 경로와 기술 스택 후보 비교 및 결정안
- 10초 Speech transcription endpoint의 업로드·요청·응답 스키마
- Recipe generation endpoint의 요청·응답 스키마
- Ingredient, RecipeStep, 예상 시간, 메모 필드 계약
- 인증, rate limit, timeout, retry, 오류 코드와 idempotency 기준
- STT·AI provider abstraction과 모델 교체 경계
- secret 관리, 입력·출력 로그 redaction, 개인정보와 보존 정책
- 음성 최대 1시간, AI 결과 복구 최대 24시간, 운영 메타데이터 최대 30일 TTL 계약
- AI 처리 상태 조회와 동일 요청 결과 복구 계약
- 프롬프트 버전과 응답 스키마 검증 정책
- 비용 상한, 과다 요청 차단과 서비스 비활성화 기준
- 로컬 개발과 계약 테스트 기준

## 성공 기준

- Backend 코드 경로와 아키텍처 문서가 Source of Truth로 등록된다.
- iOS와 Backend가 공유할 STT·AI 버전 API 계약이 존재한다.
- 정상·오류·timeout·제한 초과 응답이 정의된다.
- API Key와 사용자 입력이 안전하게 처리되는 기준이 명시된다.
- Backend QA Agent가 계약, 보안, 개인정보 기준을 검토할 수 있다.

## 사용자 결정 필요 항목

- Backend 런타임·배포 환경, STT·AI provider와 초기 모델의 추천안을 비교해 Product Owner 승인을 요청해야 한다.
- 설치 단위 인증과 초기 월 비용·호출량 상한의 추천안을 준비해야 한다.
- 콘텐츠 보관 정책은 PRD의 확정값을 변경하지 않는다.

## Coordination 메모

- Backend Agent가 계약 초안을 작성하고 iOS 경계와 충돌 여부를 Development Lead Agent가 조율한다.
- 실제 서버 구현과 iOS 연결은 별도 Task로 유지한다.

## Development Lead 하위 Task 분해 요구

1. 런타임·배포·provider·비용 후보 비교와 결정안
2. 공통 인증·rate limit·idempotency·오류 모델
3. STT 업로드·변환 계약과 음성 TTL
4. AI 정리·상태 조회·결과 복구 계약과 콘텐츠 TTL
5. 보안·개인정보·로그 redaction·관측성 계약
6. iOS client fixture와 Backend 계약 테스트 fixture
