---
schema: aiops.task.v1
id: T-20260728-006
title: Backend AI gateway와 비활성 원격 STT adapter foundation 구현
status: scoped
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
  - T-20260804-002
  - T-20260804-003
  - T-20260804-004
  - T-20260804-005
  - T-20260804-006
  - T-20260804-007
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
  - .ai_project/source_of_truth.md
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - T-20260728-005에서 확정된 Backend 아키텍처와 API 계약
  - docs/product/CookLog_PRD_v2.md
  - .ai_project/source_of_truth.md
created_by: Product Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-08-04
report_to: .ai_project/reports/T-20260728-006_implement-backend-ai-proxy-foundation-report.md
qa_to: .ai_project/qa/T-20260728-006_implement-backend-ai-proxy-foundation-qa.md
---

# Backend AI gateway와 비활성 원격 STT adapter foundation 구현

## 목적

승인된 아키텍처와 API 계약을 기준으로 실제 provider 연결 전에도 AI 정리를 실행·테스트할 수 있는 Backend foundation을 만든다. 원격 STT는 기본 비활성 adapter 경계와 계약 테스트만 유지한다.

## 제안 범위

- 서버 프로젝트 scaffold와 환경별 설정
- health endpoint와 recipe generation·status endpoint
- AI provider abstraction과 Mock provider
- 원격 STT adapter 확장 지점과 무승인 활성화 방지 설정
- schema validation과 공통 오류 응답
- 환경변수 기반 secret 주입
- 구조화 로그와 민감정보 redaction
- TTL cleanup, idempotency, rate limit과 비용 계측의 테스트 가능한 경계
- 단위 테스트, 계약 테스트, 로컬 실행 문서

## 제외 범위

- 승인되지 않은 AI provider 실서비스 연결
- 원격 STT endpoint, Mock STT provider와 음성 임시 저장·삭제 구현
- iOS 원격 DataSource 연결
- 사용자 계정과 레시피 서버 저장
- 배포와 운영 트래픽 전환

## 성공 기준

- 새 클론에서 문서화된 명령으로 서버가 실행된다.
- health와 Mock AI endpoint가 계약대로 응답한다.
- 원격 STT endpoint가 존재하지 않거나 명시적인 비활성 상태이며 첫 출시 설정으로 활성화할 수 없다.
- 정상·오류 계약 테스트가 통과한다.
- secret이 코드와 로그에 노출되지 않는다.
- Backend QA Agent가 계약·보안·개인정보 검증을 통과시킨다.

## 사용자 결정 필요 항목

- 없음. 실제 provider와 배포 환경은 `T-20260729-003`에서 별도 승인 후 연결한다.

## Development Lead 하위 Task 분해 요구

1. 서버 scaffold·환경 설정·health
2. 공통 오류·인증·rate limit·idempotency middleware
3. Mock AI generation·status endpoint와 결과 복구 캐시
4. 원격 STT 확장 지점·비활성 설정과 무승인 활성화 방지 테스트
5. redacted logging·사용량 계측·TTL cleanup
6. 단위·계약·보안 테스트와 로컬 실행 문서

## Development Lead Scope 결과

| 순서 | Task | 실행 패키지 | 선행 Task |
|---:|---|---|---|
| 1 | `T-20260804-002` | Backend runtime scaffold·환경 설정·health | `T-20260728-005` |
| 2 | `T-20260804-003` | 공통 HTTP·인증·rate limit·idempotency middleware | `T-20260804-002` |
| 3 | `T-20260804-004` | Mock AI job·status·ACK·복구 저장 경계 | `T-20260804-002`, `003` |
| 4 | `T-20260804-005` | 원격 STT 비활성 확장 경계·활성화 차단 | `T-20260804-002`, `003` |
| 5 | `T-20260804-006` | redacted logging·비용 원장·TTL cleanup 경계 | `T-20260804-003~005` |
| 6 | `T-20260804-007` | 통합 계약·보안 테스트와 로컬 실행 handoff | `T-20260804-002~006` |

`T-20260804-004`와 `T-20260804-005`는 공통 middleware가 완료된 뒤 핵심 코드 경로가
분리되므로 별도 worktree에서 병렬 실행할 수 있다. package manager·lockfile과 앱
composition root는 T-002가 단일 소유하고, 최종 wiring은 T-007이 담당한다.

## 승인 및 실행 경계

- 2026-08-04 Product Owner가 `T-20260728-006` 진행을 승인했다.
- `T-20260728-005`는 `origin/develop` `be44156`에서 `done`이다.
- 첫 실행 패키지 `T-20260804-002`를 `approved`로 Backend Agent에 인계한다.
- 나머지 패키지는 `proposed`로 등록하고 각 선행 Task가 공용 `develop`에서 `done`인
  것을 확인한 뒤 Development Lead가 실행 순서를 연다.
- 실제 provider 계약·결제·secret·cloud resource 생성·배포와 원격 STT endpoint는
  승인 범위가 아니다.
- runtime 언어·framework·package manager는 T-002에서 Cloud Run 호환성, JSON Schema
  재사용성, 로컬 재현성을 비교해 ADR로 고정한다. 외부 cloud 변경 없이 local/mock
  foundation만 구현한다.

## 상태 전이 기록

- 2026-08-04: Product Owner가 Backend foundation 진행을 승인했다.
- 2026-08-04: Development Lead Agent가 6개 하위 패키지·의존성·병렬 경계·후속 QA를
  확정해 `proposed -> scoped`로 전환하고 T-002를 Backend Agent에 인계했다.
