---
schema: aiops.task.v1
id: T-20260729-026
title: 첫 공개 출시 STT 기본 경로를 Apple 기기 내 처리로 변경
status: done
type: docs
priority: P0
priority_reason: 월 약 10만 원으로 추정되는 원격 STT 비용을 첫 출시 고정비에서 제외하고 출시 Task와 제품 문서의 상충을 구현
  전에 해소해야 한다.
org_unit: Product Division
team: Product Team
team_lead: Product Lead Agent
workflow: docs
target_agent: Product Lead Agent
target_role: Completion Role
required_capabilities:
- parent_task_completion
depends_on:
- T-20260729-001
blocks:
- T-20260729-002
- T-20260728-005
- T-20260729-004
- T-20260728-009
parallel_group:
allowed_paths:
- docs/product/
- docs/PROJECT_STATUS.md
- docs/PROJECT_CHANGELOG.md
- docs/PROJECT_DECISIONS.md
- ".ai_project/tasks/"
- ".ai_project/reports/"
- ".ai_project/qa/"
- ".ai_project/task_board.md"
- ".ai_project/teams/product/task_board.md"
- ".ai_project/teams/design/task_board.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
source_of_truth:
- docs/product/CookLog_PRODUCT.md
- docs/product/CookLog_PRD_v2.md
- docs/product/CookLog_MVP_SCOPE.md
- docs/product/CookLog_USER_FLOW.md
- docs/product/CookLog_ROADMAP.md
- docs/PROJECT_DECISIONS.md
created_by: Product Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: '2026-07-30'
report_to: ".ai_project/reports/T-20260729-026_change-first-release-stt-policy-report.md"
qa_to: ".ai_project/qa/T-20260729-026_change-first-release-stt-policy-qa.md"
---

# 첫 공개 출시 STT 기본 경로를 Apple 기기 내 처리로 변경

## 목적

첫 공개 출시의 음성 기록 비용을 통제하면서 CookLog의 10초 기록 핵심 경험을 유지하도록 STT 기본 경로를 Apple 기기 내 처리로 변경하고, 유료 원격 STT는 기본 비활성 교체형 adapter로 분리한다.

## 승인된 변경 방향

- 기본 STT: 지원되는 Apple 기기의 기기 내 STT
- 원격 STT: 공통 인터페이스 뒤의 교체형 adapter, 기본 비활성
- 자동 fallback: 사용하지 않음
- 같은 adapter 재처리: 복구 가능한 기술 오류에 한해 최대 1회
- AI 정리: 기존처럼 Backend를 사용하는 온라인 기능
- 비용 근거: 아래 정책 검토용 사용량·단가·환율 가정에서 원격 STT 단독 월 약 10만 원

## 비용 추정 가정

- 월 활성 설치: 1,000개
- 설치당 월 요리 기록: 4회
- 기록 1회당 음성 clip: 6개
- clip 길이: 10초
- 월 처리량: `1,000 × 4 × 6 × 10초 = 240,000초 = 4,000분`
- 원격 STT 단가 가정: 분당 USD 0.016
- 원격 STT 월 비용: `4,000분 × USD 0.016 = USD 64`
- 예산 환율: 2026-07-29 정책 검토용 USD 1당 KRW 1,400
- 세금·환율 변동 buffer: 10%
- 원화 예산 추정: `USD 64 × KRW 1,400 × 1.10 = KRW 98,560`, 약 10만 원
- 포함 범위: 원격 STT 단독 비용이며 AI 비용은 제외

이 값은 실제 트래픽 측정, provider 견적 또는 확정 과금액이 아닌 첫 출시 정책 비교용 가정 기반 예산 추정이다. 실제 provider·단가·트래픽이 정해지면 별도 비용 승인에서 다시 계산한다.

## 실행 범위

- Product Charter, PRD, MVP Scope, User Flow, Roadmap와 공통 결정사항의 STT 정책 통일
- 오프라인 기록 가능 범위와 온라인 AI 경계 재정의
- 기기 내 STT 실패, 미지원 환경과 같은 adapter 1회 재처리 UX 정의
- 원격 STT 자동 fallback과 무승인 음성 전송 금지
- Backend와 iOS 상위 Task의 제목·의존성·출시 차단 관계 수정
- 출시 STT 최소 품질 게이트와 예외 결정 절차 유지

## 제외 범위

- Apple Speech 또는 다른 framework 구현
- 지원 OS·기기 목록의 기술 확정
- 원격 STT provider 선택, 계정 생성, 결제, secret 등록과 활성화
- Backend·iOS 개발 Agent가 작성한 기존 브랜치 산출물 수정
- 디자인 Prototype과 앱 코드 변경

## 개발 산출물 보존 원칙

- 개발 Agent가 별도 Task 브랜치에서 작성한 원격 STT 비용 비교, provider 추천과 아키텍처 문서는 삭제하거나 수정하지 않는다.
- 해당 산출물은 이번 제품 정책 변경의 공식 근거나 승인된 출시 기본값이 아니다.
- 향후 기기 내 STT 품질·지원 범위 문제가 확인되거나 원격 STT 수요가 생길 때 adapter 활성화 검토 자료로만 사용할 수 있다.
- 제품 Source of Truth와 충돌하면 Product Owner가 완료 승인한 이 Task의 제품 문서를 우선한다.

## 성공 기준

- 첫 출시 STT 기본값, 원격 adapter 상태와 자동 fallback 금지가 모든 제품 문서에서 일치한다.
- 인터넷이 없어도 지원 환경의 10초 기록·STEP Preview 생성은 가능하고 AI 정리만 온라인 의존으로 구분된다.
- 기기 내 STT 실패가 원격 음성 전송을 일으키지 않으며 사용자에게 `다시 기록하기`를 제공한다.
- 최소 STT 품질 기준 미달 시 자동 원격 전환이 아니라 Product Owner 결정으로 에스컬레이션한다.
- Backend·iOS Critical Path에서 온라인 STT가 첫 출시 필수 의존성으로 남지 않는다.
- 개발 Agent 기존 산출물이 변경되지 않고 비공식 참고자료로 명시된다.
- Product QA가 문서·Task graph 정합성과 출시 위험을 독립 검증한다.

## Product Owner 완료 승인 항목

- 위 정책을 첫 공개 출시의 최종 STT 기준으로 확정할지
- 실제 기기 검증에서 품질·지원 범위가 기준 미달일 때 지원 범위 조정, 출시 연기와 원격 adapter 도입 중 어떤 결정 절차를 사용할지
- 원격 STT 활성화는 별도 제품 정책 변경과 비용 승인 없이는 수행하지 않는다는 경계를 확정할지

## 상태 전이 기록

- 2026-07-29: Product Owner가 별도 제품 정책 변경 Task 생성, Product Lead 작성, Product QA 검증과 Product Owner 완료 승인 절차를 요청했다.
- 2026-07-29: Product Lead가 `proposed -> scoped -> approved -> in_progress`를 순차 적용하고 최신 `origin/develop` 전용 worktree에서 제품 문서와 출시 Task를 갱신했다.
- 2026-07-29: Product Lead 자체 검증 준비를 마치고 기존 개발 Agent 산출물을 수정하지 않은 채 `in_progress -> verification_ready`로 Product QA Agent에 인계했다.
- 2026-07-30: Product QA Agent가 온라인 STT Critical Path 잔존, 첫 출시 Backend 음성 정책 충돌과 비용 근거 추적성 부족을 확인해 `verification_in_progress -> rework_requested`로 인계했다.
- 2026-07-30: Product Owner가 QA 필수 재작업을 승인하고 Product Lead Agent가 `rework_requested -> scoped -> approved -> in_progress`로 재개했다.
- 2026-07-30: Product Lead Agent가 Backend Task 차단·완료 조건, 조건부 Backend 음성 TTL, 가정 기반 비용 산식과 Task schema를 보완하고 `in_progress -> verification_ready`로 Product QA 재검증을 요청했다.
- 2026-07-30: Product QA Agent가 기존 FAIL 3건, strict Task metadata, 21개 Task graph와 T-020 보존을 재검증해 `verification_ready -> verification_in_progress -> verification_passed`로 전환하고 Product Lead Agent / Completion Role에 인계했다.
- 2026-07-30: Product Lead Agent가 QA `PASS`, 잔여 위험, 출시 영향과 후속 Team 차단 관계를 수용해 `verification_passed -> completion_review`로 전환했다. Product Owner 명시적 완료 승인은 아직 대기한다.
- 2026-07-30: Product Owner가 최종 완료를 명시적으로 승인해 Product Lead Agent가 `completion_review -> done`으로 전환하고 `develop` 통합을 진행한다.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-30 | Product QA Agent | transition: verification_in_progress -> rework_requested | Task graph에 온라인 STT 출시 필수 경로가 남고 첫 출시 Backend 음성 정책 및 비용 근거 추적성이 충돌하여 Product Lead 재작업 필요 |
| 2026-07-30 | Product Lead Agent | transition: rework_requested -> verification_ready | Product Owner 재작업 승인 후 QA 필수 조치 3건과 strict task metadata 보완 완료 |
| 2026-07-30 | Product QA Agent | transition: verification_ready -> verification_in_progress | 기존 QA FAIL 3건, strict task validation, Task graph와 개발 worktree 보존 독립 재검증 시작 |
| 2026-07-30 | Product QA Agent | transition: verification_in_progress -> verification_passed | 기존 FAIL 3건 해소, T-026 strict validation·21개 Task graph·allowed paths·T-020 보존 재검증 PASS; Product Owner 승인 전 done 금지 |
| 2026-07-30 | Product Lead Agent | transition: verification_passed -> completion_review | QA PASS 수용, Product Owner 명시적 완료 승인 대기 |
| 2026-07-30 | Product Lead Agent | transition: completion_review -> done | Product Owner 최종 완료 승인에 따라 정책 확정 및 develop 통합 진행 |

## Next Agent Handoff

```text
너는 Product Lead Agent / Completion Role이야.
Task T-20260729-026의 완료 상태와 통합 결과를 확인해줘.

- 현재 상태: done
- 다음에 해야 할 일: 승인된 첫 출시 STT 정책을 후속 Design·Development Task의 실행 기준으로 사용해줘.
- 기준 문서: docs/product/CookLog_PRODUCT.md, docs/product/CookLog_PRD_v2.md, docs/product/CookLog_MVP_SCOPE.md, docs/product/CookLog_USER_FLOW.md, docs/product/CookLog_ROADMAP.md, docs/PROJECT_DECISIONS.md
- 허용 경로: 이 Task의 allowed_paths
- 참고 산출물: .ai_project/reports/T-20260729-026_change-first-release-stt-policy-report.md, .ai_project/qa/T-20260729-026_change-first-release-stt-policy-qa.md
- 검증 결과: Product QA 재검증 PASS, T-026 strict validation PASS, Task graph PASS
- 차단/결정 필요: 없음. 원격 STT 활성화는 별도 제품 정책 변경과 비용 승인이 필요해.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
```
