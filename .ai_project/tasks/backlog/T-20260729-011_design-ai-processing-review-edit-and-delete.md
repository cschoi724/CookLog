---
id: T-20260729-011
title: AI 처리·AI Review·완료 레시피 편집·삭제 디자인
status: proposed
type: feature
priority: P0
priority_reason: AI 처리 복구와 명시적 임시·최종 저장 경계가 데이터 손실과 중복 완료를 막는 핵심 제품 상태다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: UI/UX Design Agent
target_role: Execution Role
required_capabilities:
  - ux_flow
  - ui_design
  - prototyping
  - design_handoff
depends_on:
  - T-20260729-010
blocks:
  - T-20260729-012
  - T-20260729-002
parallel_group: design-refresh-sequential
allowed_paths:
  - design/prototype/
  - design/figma-build/manifest.json
  - design/exports/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - design/prototype/
created_by: Design Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260729-011_design-ai-processing-review-edit-and-delete-report.md
qa_to: .ai_project/qa/T-20260729-011_design-ai-processing-review-edit-and-delete-qa.md
---

# AI 처리·AI Review·완료 레시피 편집·삭제 디자인

## 목적

AI 정리의 장기 처리·실패·복귀와 AI Review의 임시 저장·최종 저장·완료 레시피 수정 경계를 하나의 일관된 편집 모델로 설계한다.

## 실행 범위

- AI 정리 시작, 중복 실행 방지와 STEP snapshot 잠금
- 10초 경과 장기 처리 안내, 다른 화면 이용과 Home 상태
- 앱 내부 완료 배너, `검토 준비됨` 카드와 Review 진입
- 실패 원인 범주, `다시 정리하기`, `기록으로 돌아가기`
- `확정`, `AI 추정`, `누락` 필드 상태
- 제목, 재료·수량, 예상 시간과 메모 편집
- 단계별 독립 입력 카드, 추가·삭제·되돌리기·드래그 재배열·위아래 이동
- 임시 저장 토스트와 화면 유지
- 저장되지 않은 변경 이탈 확인 3개 행동
- 제목·조리 단계 최소 1개 검증과 필드별 오류
- 로컬 저장 실패, 현재 값 유지와 `다시 저장`
- Recipe Detail의 표시, 수정 진입과 동일 폼 재사용
- 완료 수정의 `수정 완료`, AI 재호출 없음
- 완료 레시피 영구 삭제 확인과 복구 불가 안내

## 제외 범위

- AI provider 내부 정보와 상태 코드 표시
- AI 정리 자동 재처리와 취소
- 완료 레시피 버전 기록과 삭제 복구
- AI DRAFT가 없는 완료 수정 화면의 임시 저장

## 성공 기준

- AI Review와 완료 레시피 수정은 같은 필드·단계 카드 구조를 쓰되 저장 행동과 레이블이 명확히 다르다.
- 단계는 큰 문자열이 아니라 개별 카드이며 빈 단계 제외와 재번호 부여 규칙을 표현한다.
- 임시 저장은 토스트 후 화면을 유지하고 최종 저장만 완료 상태로 전환한다.
- 실패해도 현재 편집값과 마지막 성공 임시 저장 복구 경계가 명확하다.
- AI 정리 중·완료·실패·오프라인 상태에서 자동 화면 전환이나 자동 재실행이 없다.
- Design QA Agent가 저장 경계, 실패 복구, 단계 편집과 접근성을 독립 검증한다.

## 사용자 결정 필요 항목

- 없음. AI timeout 수치는 디자인에서 고정하지 않고 Backend 측정 후 적용 가능한 상태로 둔다.
