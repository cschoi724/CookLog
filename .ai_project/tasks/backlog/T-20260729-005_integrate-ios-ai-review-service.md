---
id: T-20260729-005
title: iOS AI 정리·처리 복구·AI Review 실서비스 연동
status: proposed
type: feature
priority: P0
priority_reason: STEP Preview를 실제 개인 레시피 초안으로 전환하고 저장까지 이어주는 필수 경로다.
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
  - T-20260728-003
  - T-20260728-005
  - T-20260729-003
blocks:
  - T-20260728-009
parallel_group: release-r2-ios-services
allowed_paths:
  - apps/ios/
  - docs/PROJECT_STATUS.md
  - docs/PROJECT_CHANGELOG.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/PROJECT_DECISIONS.md
  - T-20260728-005에서 승인된 AI API 계약
  - T-20260729-003에서 검증된 Backend 환경
  - apps/ios/docs/SERVICES.md
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260729-005_integrate-ios-ai-review-service-report.md
qa_to: .ai_project/qa/T-20260729-005_integrate-ios-ai-review-service-qa.md
---

# iOS AI 정리·처리 복구·AI Review 실서비스 연동

## 목적

Mock AI를 Backend AI 정리로 교체하고 처리 중 이탈·앱 재실행·실패에서도 동일 요청과 STEP Preview를 안전하게 유지한다.

## 제안 범위

- `AI 정리하기` 시점의 immutable STEP snapshot과 고유 request id
- Backend generation·status API client와 설치 단위 인증
- 처리 중 같은 기록의 STEP 잠금·중복 요청 방지
- 즉시 진행 상태, 10초 경과 장기 처리 안내와 다른 레시피 사용
- background·앱 재실행 후 동일 request 결과 조회
- 결과 중복 반영 방지와 최초 AI Review baseline 저장
- `확정`·`AI 추정`·`누락` field state mapping
- 오프라인·빈 입력·timeout·service·schema·limit·unknown error mapping
- 자동 재실행 없이 `다시 정리하기`와 `기록으로 돌아가기`
- 앱 내부 완료 banner와 Home `검토 준비됨`
- AI Review 임시 저장·최종 저장·저장 실패 회귀
- 단위·계약 fixture·integration·background recovery test

## 제외 범위

- 자동 AI 재처리와 AI 정리 취소
- 로컬 알림·APNs·자동 화면 이동
- 레시피 본문을 포함한 analytics·error log
- 완료 레시피 수정 시 AI 재호출

## 성공 기준

- 실제 Backend 결과가 PRD field state를 보존한 AI Review로 한 번만 생성된다.
- background와 앱 재실행 후 같은 request를 조회하고 중복 과금·Review 생성을 막는다.
- 실패해도 STEP Preview를 보존하고 사용자가 재실행 시점을 선택한다.
- AI 결과가 부족해도 `AI 추정`·`누락`으로 Review를 열며 기록에 없는 안전 정보를 확정값으로 만들지 않는다.
- 임시 저장·최종 저장과 기존 완료 레시피 수정이 서로 다른 정책대로 동작한다.
- iOS QA Agent가 성공·장기 처리·오프라인·실패·재실행·중복 방지·앱 재실행을 통과시킨다.

## 사용자 결정 필요 항목

- 실제 Backend 개발·스테이징 endpoint와 인증 설정 승인
- provider 실측 후 Backend가 제안하는 timeout 값 승인

## Development Lead 하위 Task 분해 요구

1. AI generation·status client와 request id
2. snapshot lock·processing persistence·background recovery
3. response schema·field state mapping·initial Review baseline
4. error mapping·manual retry·completion banner
5. AI Review temp/final save regression
6. contract fixture·integration·relaunch·duplicate prevention QA
