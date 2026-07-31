---
schema: aiops.task.v1
id: T-20260729-020
title: Backend 런타임·배포·AI provider·비용 후보 결정안
status: verification_passed
type: docs
priority: P0
priority_reason: 첫 출시 AI gateway의 외부 비용과 운영 경계를 구현 전에 승인해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: docs
target_agent: Development Lead Agent
target_role: Completion Role
required_capabilities:
- api_qa
- security_check
- privacy_review
depends_on:
- T-20260729-026
blocks:
- T-20260728-005
- T-20260729-023
- T-20260729-024
parallel_group: backend-contract-foundation
allowed_paths:
- apps/backend/docs/ARCHITECTURE_DECISION.md
- ".ai_project/tasks/backlog/T-20260729-020_compare-backend-runtime-ai-provider-cost-options.md"
- ".ai_project/tasks/active/T-20260729-020_compare-backend-runtime-ai-provider-cost-options.md"
- ".ai_project/reports/T-20260729-020_compare-backend-runtime-ai-provider-cost-options-report.md"
- ".ai_project/qa/T-20260729-020_compare-backend-runtime-ai-provider-cost-options-qa.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
source_of_truth:
- docs/product/CookLog_PRD_v2.md
- docs/product/CookLog_ROADMAP.md
- docs/PROJECT_DECISIONS.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: '2026-07-30'
report_to: ".ai_project/reports/T-20260729-020_compare-backend-runtime-ai-provider-cost-options-report.md"
qa_to: ".ai_project/qa/T-20260729-020_compare-backend-runtime-ai-provider-cost-options-qa.md"
---

# Backend 런타임·배포·AI provider·비용 후보 결정안

## 범위

- 런타임·배포 후보와 AI 구조화 출력 provider·모델 비교
- 가정 트래픽, runtime·AI 예상 월 비용, hard cutoff와 전체 quota 결정표
- 보관·학습·처리 지역·장애 대응의 공식 출처 추적
- 추천 조합 1개와 일관된 차선 조합 1개
- 원격 STT는 기본 비활성 adapter의 향후 참고 비용·지역 정보만 기록

## 재작업 기준

- 기존 비공식 T-020의 Source of Truth 충돌, 차선 조합 불일치, 지역 가용성, endpoint별 보관, runtime 비용 가정과 strict metadata 결함을 반복하지 않는다.
- Apple 기기 내 STT 기본값과 자동 fallback 금지를 변경하지 않는다.
- 특정 provider는 Product Owner 결정 전 확정하지 않는다.

## 성공·검증 기준

- Product Owner가 런타임, AI provider, 인증 방향과 비용 상한을 항목별 승인·보류할 수 있다.
- Backend QA Agent가 공식 출처, 비용 산식, 개인정보와 지역 근거를 독립 재계산한다.

## 실행 결과

- 추천: Cloud Run 서울 + OpenAI 한국 저장 Chat Completions +
  `gpt-5-mini-2025-08-07`
- 차선: Cloud Run 서울 + Vertex AI EU + `gemini-3.1-flash-lite`
- 비동기 job은 Cloud Tasks·Firestore Standard 서울에서 시간 제한으로 처리한다.
- 앱 ACK 즉시 delete, 생성 22시간 cleanup task, 15분 sweeper와 24시간 API 접근
  차단을 사용하고 Firestore TTL은 최종 안전망으로만 둔다.
- Firestore TTL delete는 무료 할당량 대상이 아니며 billing 활성화와 유료 delete
  비용을 전제로 한다.
- Cloud Run 서울 Tier 2 CPU·Memory 단가는 공식 SKU로 추적하고 Requests 공통
  SKU에는 지역 10%를 가산하지 않는다.
- 추천안은 MAM/ZDR과 Modified Retention amendment 확보 전 출시 경로로 사용할 수 없다.
- 한국 OpenAI endpoint는 저장만 지역화되고 처리 지역은 보장되지 않는다.
- 인증은 로그인 대신 App Attest와 설치 단위 단기 token 방향으로 제안했다.
- 월 KRW 50,000과 호출 5,500회·입력 20M·출력 8M token hard cutoff를 제안했다.
- 삭제 경로 포함 runtime은 free tier 전 USD 2.055198, 추천안은 KRW 20,952,
  차선안은 KRW 19,004로 재계산했다.
- 원격 STT는 기본 비활성 참고 자료이며 자동 fallback과 Backend 음성 endpoint는 없다.

상세 근거와 공식 URL은 `apps/backend/docs/ARCHITECTURE_DECISION.md`, 실행 보고는
`.ai_project/reports/T-20260729-020_compare-backend-runtime-ai-provider-cost-options-report.md`
를 기준으로 한다.

## Backend QA Agent 검증 요청

- Cloud Run 서울 Tier 2와 free tier 전 runtime 비용 독립 재계산
- 추천·차선 AI 비용과 hard cutoff 상한 독립 재계산
- OpenAI·Vertex endpoint별 저장·처리·학습·보관 조건 확인
- 추천안과 차선안의 endpoint·model·비용·운영 경계 일관성 확인
- Apple 기기 내 STT 기본값과 원격 STT 비활성·자동 fallback 금지 확인
- Firestore TTL 비즉시 삭제를 고려한 22시간 cleanup·15분 sweeper·24시간 접근 차단
  계약과 추가 runtime 비용 확인

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-30 | Development Lead Agent | transition: proposed -> scoped | Development Lead scope와 하위 Task 등록 완료 |
| 2026-07-30 | Product Owner | transition: scoped -> approved | Product Owner 실행 및 에이전트 인계 승인 |
| 2026-07-30 | Backend Agent | lock | task lock |
| 2026-07-30 | Backend Agent | transition: approved -> in_progress | 최신 origin/develop 기반 전용 worktree에서 실행 시작 |
| 2026-07-30 | Backend Agent | transition: in_progress -> verification_ready | 공식 출처·비용 산식·지역·endpoint별 보관·추천/차선 결정안 및 실행 보고 완료, Backend QA 독립 검증 요청 |
| 2026-07-30 | Backend Agent | unlock | task unlock |
| 2026-07-30 | Backend QA Agent | transition: verification_ready -> rework_requested | QA-RISK-020-001 TTL delete 무료 할당량 제외 누락, QA-RISK-020-002 Cloud Run 서울 Tier 2 10% 공식 근거 보강 요청 |
| 2026-07-30 | Backend Agent | transition: rework_requested -> in_progress | QA 위험 2건 비용 근거·산식·보고서 정합성 재작업 |
| 2026-07-30 | Backend Agent | transition: in_progress -> verification_ready | TTL delete 유료 과금 명시, Cloud Run Tier 2 공식 SKU 근거와 Requests 산식 수정, 비용표·실행 보고서 동기화 후 재검증 요청 |
| 2026-07-30 | Backend QA Agent | transition: verification_ready -> verification_in_progress | 사용자 명시적 T-020 독립 재검증 요청 |
| 2026-07-30 | Backend QA Agent | lock | task lock |
| 2026-07-30 | Backend QA Agent | transition: verification_in_progress -> rework_requested | QA-HIGH-020-003: Firestore TTL은 만료 후 지연 삭제되어 생성 후 최대 24시간 콘텐츠 삭제를 단독 보장하지 못함 |
| 2026-07-30 | Backend QA Agent | unlock | 독립 재검증 FAIL 보고서 작성 및 Development Lead 재작업 인계 완료 |
| 2026-07-30 | Development Lead Agent | transition: rework_requested -> approved | 사용자 T-020 재작업 완료 및 독립 재검증 요청 승인 |
| 2026-07-30 | Backend Agent | lock | task lock |
| 2026-07-30 | Backend Agent | transition: approved -> in_progress | QA-HIGH-020-003 삭제 보장·접근 차단·비용 재작업 시작 |
| 2026-07-30 | Backend Agent | transition: in_progress -> verification_ready | QA-HIGH-020-003 명시적 22시간 cleanup·15분 sweeper·24시간 접근 차단·추가 비용 반영 완료 |
| 2026-07-30 | Backend Agent | unlock | 재작업 자체 검증 완료 및 Backend QA 독립 재검증 인계 |
| 2026-07-30 | Backend QA Agent | transition: verification_ready -> verification_in_progress | 사용자 명시적 T-020 독립 Backend QA 재검증 요청 |
| 2026-07-30 | Backend QA Agent | lock | task lock |
| 2026-07-30 | Backend QA Agent | transition: verification_in_progress -> verification_passed | QA-HIGH-020-003 해소 확인, 공식 가격·TTL·Cloud Tasks 동작과 runtime·AI·hard cutoff 독립 재계산 PASS_WITH_RISK |
| 2026-07-30 | Backend QA Agent | unlock | task unlock |
| 2026-07-30 | Development Lead Agent | reconcile duplicate workstreams | 동일 Task ID의 구형 브랜치와 최신 execution-v2가 분기된 원인을 확인하고 Apple 기기 내 STT 기준 최신 산출물만 origin/develop 최신 상태에 통합 |
| 2026-07-30 | Development Lead Agent | transition: verification_passed -> verification_ready | 기존 PASS_WITH_RISK는 미커밋 상태 검증이므로 고정 통합 커밋 기준 변경 경로·공용 보드 비회귀와 판정 증빙을 Backend QA Agent에 재확인 요청 |
| 2026-07-30 | Backend QA Agent | transition: verification_ready -> verification_in_progress | 고정 커밋 f4408d0 기준 최신 develop 통합·비회귀 독립 재검증 시작 |
| 2026-07-30 | Backend QA Agent | lock | task lock |
| 2026-07-30 | Backend QA Agent | transition: verification_in_progress -> verification_passed | f4408d0 내용 동등성·QA-HIGH-020-003·비용·allowed paths·최신 완료 기록·Task ID 단일성 재검증 PASS_WITH_RISK |
| 2026-07-30 | Backend QA Agent | unlock | 고정 통합 커밋 독립 재검증 완료 및 Development Lead Completion Role 인계 |
