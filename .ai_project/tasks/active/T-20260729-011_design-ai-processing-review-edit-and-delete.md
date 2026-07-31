---
id: T-20260729-011
title: AI 처리·AI Review·완료 레시피 편집·삭제 디자인
status: completion_review
type: feature
priority: P0
priority_reason: AI 처리 복구와 명시적 임시·최종 저장 경계가 데이터 손실과 중복 완료를 막는 핵심 제품 상태다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design Lead Agent
target_role: Completion Role
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
  - .ai_project/tasks/active/T-20260729-010_design-cooking-log-step-preview-and-stt-errors.md
  - design/prototype/
created_by: Design Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-31
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

## Design Lead 준비 결과

- 선행 `T-20260729-010`의 PR #22·#23 develop 병합과 `done`을 확인했다.
- AI 정리 시작 시 T-010에서 정의한 STEP snapshot 잠금을 이어받고, 성공·실패 시 잠금 해제와 동일 요청 결과 중복 생성 방지를 T-011의 상태 계약으로 연결한다.
- `10초`는 AI 실패 timeout이 아니라 장기 처리 안내 시점으로 고정하며 실제 실패 timeout 수치는 Backend 실측·승인 전 디자인에 노출하지 않는다.
- 오프라인과 실패 후에는 자동 호출·자동 화면 전환을 하지 않고 사용자가 `AI 정리하기`, `다시 정리하기`, `기록으로 돌아가기`를 명시적으로 선택하게 한다.
- AI Review는 `확정`·`AI 추정`·`누락` 필드 상태, 단계별 카드 편집, 수동 임시 저장, 이탈 확인과 최종 저장 실패 시 현재 편집값 보존을 포함한다.
- 완료 레시피 수정은 같은 폼 구조를 재사용하되 `AI DRAFT`, 임시 저장과 AI 재호출 없이 `수정 완료`로 기존 레시피를 갱신한다.
- 완료 레시피 삭제는 Recipe Detail의 `⋯` 메뉴에서만 제공하고 복구 불가 확인 후 영구 삭제하며 T-009의 진행 기록 삭제와 대상을 혼동하지 않게 구분한다.
- 공용 Prototype·Manifest 파일 충돌을 막기 위해 후속 `T-20260729-012` 범위를 포함하지 않는다.
- 전용 worktree는 `/private/tmp/cooklog-t20260729-011`, 브랜치는 `task/T-20260729-011-design-ai-review-and-completed-recipe-edit-delete`다.
- 기준점은 T-010 완료 상태와 후속 CI 통합이 반영된 최신 `origin/develop` SHA `ac01bfea050f6e320edca871982090d434c72aec`다.
- Product Owner 실행 승인 후 UI/UX Design Agent가 lock을 획득하고 `scoped -> approved -> in_progress` 순서로 전환한다.
- 실행 완료 후 자체 검증과 보고서를 작성해 Design QA Agent에 독립 검증을 요청한다.
- commit, push, PR, merge는 별도 Product Owner 승인 전 실행하지 않는다.

## 상태 전이 기록

- 2026-07-30: Design Lead Agent가 선행 Task, 제품 Source of Truth, 기존 Prototype·Manifest와 iOS 구현 경계를 확인하고 최신 develop 기반 전용 worktree를 준비해 `proposed -> scoped`로 전환했다.
- 2026-07-31: Product Owner가 T-011 실행을 승인해 `scoped -> approved`로 전환하고 UI/UX Design Agent에 라우팅했다.
- 2026-07-31: UI/UX Design Agent가 전용 worktree·브랜치·선행 Task·허용 경로를 확인하고 lock을 획득해 `approved -> in_progress`로 전환했다.
- 2026-07-31: UI/UX Design Agent가 AI 장기 처리·완료·실패, Review 단계 카드 편집·임시/최종 저장 경계, 완료 레시피 수정·영구 삭제를 Prototype·Manifest에 반영하고 자체 검증을 통과해 `in_progress -> verification_ready`로 전환했다.
- 2026-07-31: 실행 lock을 해제하고 `Design QA Agent / Verification Role`에 독립 검증을 요청했다.
- 2026-07-31: Design QA Agent가 독립 검증에서 변경 폐기 snapshot, 완료 레시피 갱신·이탈 저장 경계, Review dialog·STEP 삭제·완료 레시피 메뉴 키보드 포커스와 빈 STEP 저장 정규화 결함을 확인해 `verification_ready -> rework_requested`로 전환하고 UI/UX Design Agent에 재작업을 요청했다.
- 2026-07-31: Product Owner가 Design QA 결함 7건의 재작업을 승인해 `rework_requested -> approved`로 전환하고 UI/UX Design Agent에 다시 라우팅했다.
- 2026-07-31: UI/UX Design Agent가 전용 worktree·브랜치·허용 경로와 승인된 결함 7건을 확인하고 재작업 lock을 획득해 `approved -> in_progress`로 전환했다.
- 2026-07-31: UI/UX Design Agent가 승인된 Design QA 결함 7건을 수정하고 Chrome 동적 검사 27건과 375×667 Light·Dark 상태 40개 회귀 검증을 통과해 `in_progress -> verification_ready`로 전환했다.
- 2026-07-31: 재작업 lock을 해제하고 `Design QA Agent / Verification Role`에 독립 재검증을 요청했다.
- 2026-07-31: Design QA Agent가 HIGH 3건·MEDIUM 4건 해소와 기존 통과 항목 무회귀를 실제 브라우저 경로로 독립 재검증해 `verification_ready -> verification_passed`로 전환하고 Design Lead Agent에 인계했다.
- 2026-07-31: Design Lead Agent가 성공 기준, 최종 Design QA, allowed paths, Figma 비차단 근거와 iOS 구현 핸드오프를 완료 검토해 `verification_passed -> completion_review`로 인계했다. develop 통합 전이므로 `done` 전환과 후속 `T-20260729-012` 차단 해제는 보류했다.

## Design QA 재작업 요구

- `DQA-HIGH-011-001`: 마지막 성공 임시 저장 snapshot과 현재 편집본을 분리하고 `변경 버리고 나가기`에서 snapshot을 복원한다.
- `DQA-HIGH-011-002`: 완료 편집의 제목·재료·단계·시간·메모를 기존 완료 레시피에 실제 반영하고 Recipe Detail에서 확인 가능하게 한다.
- `DQA-HIGH-011-003`: 완료 편집의 모든 경로에서 임시 저장 행동을 제거하고 이탈 결과를 Recipe Detail 경계와 일치시킨다.
- `DQA-MEDIUM-011-001`: Review 이탈 확인에 modal semantics, 초기 포커스, Tab trap, Escape 취소와 트리거 복귀를 구현한다.
- `DQA-MEDIUM-011-002`: Review STEP 삭제 후 Undo 또는 인접 조작 요소로 키보드 포커스를 이동한다.
- `DQA-MEDIUM-011-003`: 완료 레시피 메뉴 열림·닫힘·Escape에 메뉴 항목과 트리거 사이의 포커스 이동을 구현한다.
- `DQA-MEDIUM-011-004`: 최종 저장 직전에 빈 STEP을 제외하고 표시 순서대로 재번호를 부여한다.

## 승인된 재작업 범위

- Product Owner가 2026-07-31 Design QA 결함 7건의 재작업을 승인했다.
- `DQA-HIGH-011-001~003`, `DQA-MEDIUM-011-001~004`와 해당 회귀 검증만 수행한다.
- 기존 통과 항목, 제품 정책, 선행 T-009·T-010 결과와 후속 `T-20260729-012` 범위는 변경하지 않는다.
- UI/UX Design Agent는 기존 전용 worktree에서 lock을 획득한 뒤 재작업하고, 완료 시 자체 검증 후 Design QA Agent에 독립 재검증을 요청한다.
- 최신 `origin/develop` 정렬과 동시에 변경된 Quality Board 정합화는 재검증 통과 후 병합 전 Git gate로 유지한다.
- commit, push, PR, merge는 별도 Product Owner 승인 전 실행하지 않는다.

## Design QA 독립 재검증 결과

- `DQA-HIGH-011-001~003`: 해소
- `DQA-MEDIUM-011-001~004`: 해소
- 기존 AI 장기 처리·명시적 Review 진입·AI 실패 복구·입력 검증·완료 삭제 dialog: 무회귀
- 375×667 Light·Dark T-011 관련 상태: 40/40 통과
- 신규 결함: 없음
- 최종 상태: `verification_passed`
- 다음 담당: Design Lead Agent / Completion Role
- Task `done` 전환: 수행하지 않음

## Design Lead 완료 검토

- AI 장기 처리·명시적 Review 진입·실패 복구, AI Review 저장 경계와 완료 레시피 수정·영구 삭제까지 Task 성공 기준을 충족했다.
- 최종 Design QA가 HIGH 3건·MEDIUM 4건 해소, 신규 결함 없음과 기존 통과 항목 무회귀를 확인해 `verification_passed`로 판정했다.
- 변경 파일은 모두 Task의 `allowed_paths` 안에 있으며 JavaScript·Manifest 파싱과 `git diff --check`를 통과했다.
- Figma 원본 미수정은 로컬 Prototype과 Manifest를 공식 UI Source of Truth로 정한 Task 계약에 따라 비차단이다.
- 상태·저장 snapshot·완료 갱신·정규화·오류 복구·키보드 포커스 계약과 375×667 Light·Dark 상태가 포함되어 iOS 구현에 필요한 핸드오프가 준비됐다.
- Task 브랜치는 최신 `origin/develop`보다 4커밋 뒤지만 upstream이 T-011 디자인 Source of Truth를 변경하지 않아 완료 판정을 차단하지 않는다. 최신 develop 정렬, patch 동등성 확인과 Quality Board 정합화는 병합 전 Git gate로 남긴다.
- develop 병합 전에는 `done`으로 전환하지 않으며 후속 `T-20260729-012`는 이 Task의 `done`과 별도 Product Owner 실행 승인 전까지 `proposed`를 유지한다.
