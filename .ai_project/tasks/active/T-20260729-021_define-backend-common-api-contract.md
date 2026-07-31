---
schema: aiops.task.v1
id: T-20260729-021
title: Backend 공통 API·인증·제한·오류 계약 정의
status: verification_ready
type: docs
priority: P0
priority_reason: AI와 선택형 원격 STT가 같은 보안·재시도·오류 경계를 사용해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: docs
target_agent: Backend QA Agent
target_role: Verification Role
required_capabilities:
- backend_architecture
- api_contract
- backend_contract_verification
depends_on:
- T-20260729-026
blocks:
- T-20260728-005
- T-20260729-022
- T-20260729-023
- T-20260729-024
- T-20260729-025
parallel_group: backend-contract-foundation
allowed_paths:
- apps/backend/contracts/common/
- apps/backend/docs/API_CONTRACT.md
- ".ai_project/tasks/backlog/T-20260729-021_define-backend-common-api-contract.md"
- ".ai_project/tasks/active/T-20260729-021_define-backend-common-api-contract.md"
- ".ai_project/reports/T-20260729-021_define-backend-common-api-contract-report.md"
- ".ai_project/qa/T-20260729-021_define-backend-common-api-contract-qa.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
source_of_truth:
- docs/product/CookLog_PRD_v2.md
- docs/PROJECT_DECISIONS.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: '2026-07-31'
report_to: ".ai_project/reports/T-20260729-021_define-backend-common-api-contract-report.md"
qa_to: ".ai_project/qa/T-20260729-021_define-backend-common-api-contract-qa.md"
---

# Backend 공통 API·인증·제한·오류 계약 정의

## 범위

- 버전·request ID·error envelope
- 설치 단위 인증, App Attest/App Check 검증 경계
- installation·IP·project rate limit과 quota
- idempotency, timeout, retry와 재처리 소유권
- 사용자 메시지와 내부 오류 코드 분리

## 성공·검증 기준

- AI와 비활성 원격 STT 계약이 같은 공통 규칙을 참조한다.
- Backend QA Agent가 replay, abuse, timeout과 제한 초과 계약을 독립 검증한다.

## 실행 결과

- 공통 `/v1` version, canonical request ID, 성공·실패 envelope를 확정했다.
- App Attest와 Firebase App Check를 `AttestationVerifier` 경계 뒤에서 정규화하고,
  challenge·counter 또는 limited-use token 소비로 replay를 차단하는 설치 인증 계약을
  정의했다.
- installation·IP·project·비용 endpoint 제한, emergency kill switch와 limiter 장애
  동작을 정의했다.
- idempotency key scope·body hash·24시간 record, timeout 결과 불명확 상태와 iOS/Backend
  재시도 소유권을 정의했다.
- 외부 공개 오류 코드·사용자 현지화 key와 내부 오류·provider detail·secret을 분리했다.
- 첫 출시 STT는 Apple 기기 내 처리라는 정책을 유지했으며 원격 STT endpoint나 자동
  fallback은 추가하지 않았다.
- 최초 설치 challenge CAS, installation·token grant 원자 경계와 동시 요청 단일 승자
  수용 기준을 추가했다.
- 공개 오류 catalog, allowlist schema, negative fixture와 자체 검증 script로 raw
  provider 오류·secret·사용자 원문 비노출을 기계 검증 가능하게 했다.
- T-020의 project 월 호출·token·외부비 hard cutoff를 모든 installation 합산 원자
  예약 계약으로 연결했다.

## Backend QA 인계

Backend QA Agent는 별도 세션에서 다음을 독립 검증한다.

- challenge, assertion counter와 limited-use token replay
- installation/token subject 불일치와 위조·만료·wrong audience proof
- installation·IP·project rate limit 및 일일 quota 우회
- 동일 idempotency key의 동시 요청·동일 body replay·다른 body 충돌
- timeout 전후 side effect와 `REQUEST_OUTCOME_UNKNOWN` 처리
- 모든 실패 fixture의 JSON Schema 통과와 내부 정보·secret·원문 비노출
- STT 실패가 Backend 음성 요청 또는 원격 fallback으로 이어지지 않음

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-30 | Development Lead Agent | transition: proposed -> scoped | Development Lead scope와 하위 Task 등록 완료 |
| 2026-07-30 | Product Owner | transition: scoped -> approved | Product Owner 실행 및 에이전트 인계 승인 |
| 2026-07-30 | Backend Agent | lock | task lock |
| 2026-07-30 | Backend Agent | transition: approved -> in_progress | 최신 origin/develop 기반 전용 worktree에서 실행 시작 |
| 2026-07-30 | Backend Agent | self-verification | JSON parse·schema 구조·경로·정책 경계 자체 검증 |
| 2026-07-30 | Backend Agent | transition: in_progress -> verification_ready | 공통 API 계약과 기계 검증 schema 작성 완료, Backend QA 독립 검증 인계 |
| 2026-07-31 | Product Owner | reaffirm approval | T-020 완료 후 T-021 Backend 진행 승인 재확인 |
| 2026-07-31 | Development Lead Agent | integrate latest develop | 기존 미커밋 구현을 고정하고 최신 origin/develop에 재정렬, T-020 done과 공용 보드 기록 보존 |
| 2026-07-31 | Development Lead Agent | normalize active task | verification_ready Task를 backlog에서 active 경로로 이동하고 Backend QA 인계 상태 확정 |
| 2026-07-31 | Backend QA Agent | transition: verification_ready -> verification_in_progress | replay·abuse·timeout·제한 초과·idempotency 동시성·오류 비노출·원격 STT fallback 금지 독립 검증 시작 |
| 2026-07-31 | Backend QA Agent | lock | task lock |
| 2026-07-31 | Backend QA Agent | transition: verification_in_progress -> rework_requested | QA-HIGH-021-001 초기 설치 challenge 동시 소비 원자성 누락, QA-HIGH-021-002 오류 title/detail 민감정보 비노출 기계 검증 불가 |
| 2026-07-31 | Backend QA Agent | unlock | task unlock |
| 2026-07-31 | Product Owner | approve rework | QA-HIGH-021-001~002와 QA-MEDIUM-021-001 계약 보완 재작업 승인 |
| 2026-07-31 | Development Lead Agent | transition: rework_requested -> approved | Backend Agent에 승인된 계약 재작업 범위 인계 |
| 2026-07-31 | Backend Agent | lock | task lock |
| 2026-07-31 | Backend Agent | transition: approved -> in_progress | QA-HIGH-021-001~002와 QA-MEDIUM-021-001 승인 재작업 시작 |
| 2026-07-31 | Backend Agent | transition: in_progress -> verification_ready | challenge 원자 CAS·공개 오류 catalog/negative fixture·project 누적 hard cutoff 재작업과 자체 검증 완료 |
| 2026-07-31 | Backend Agent | unlock | task unlock |
| 2026-07-31 | Backend Agent | integrate latest develop | 최신 origin/develop e939b78 위로 재정렬하고 CI T-20260730-003 보드 기록과 T-021 verification_ready 상태 보존 |

## 최신 develop 통합

- 기준 `origin/develop`: `e939b78`
- 재정렬된 구현 보존 커밋: `a7c638f`
- 기존 구현 커밋 `de04b6a`과 API 계약·JSON Schema·실행 보고서 내용 동등성: 확인
- T-20260729-020 `done` 기록: 보존
- 최신 `origin/develop` 대비 뒤처짐: 0
- 다음 담당: Backend QA Agent / Verification Role

## Next Agent Handoff

```text
너는 Backend QA Agent / Verification Role이야.
T-20260729-021의 승인된 재작업을 독립 재검증해줘.

- 기준 문서: apps/backend/docs/API_CONTRACT.md
- schema: apps/backend/contracts/common/
- QA-HIGH-021-001 challenge CAS·installation/token grant 단일 승자
- QA-HIGH-021-002 공개 오류 catalog·allowlist schema·negative fixture 비노출
- QA-MEDIUM-021-001 T-020 project 월 호출·token·외부비 hard cutoff 원자 예약
- 자체 검증: sh apps/backend/contracts/common/validate-contracts.sh
- 정책 경계: 첫 출시 STT는 Apple 기기 내 처리. 원격 STT endpoint와 자동 fallback 금지
- 공식 판정은 Backend QA Agent가 수행
```
