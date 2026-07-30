---
id: T-20260729-002
title: 확정 제품 UX 기반 디자인 시스템·프로토타입 갱신
status: proposed
type: feature
priority: P0
priority_reason: 완료된 T-20260728-002 이후 기록·초안·AI Review·핸즈프리 요구가 추가 확정되어 iOS 디자인 적용 전에 새 상태와 흐름을 반영해야 한다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design Lead Agent
target_role: Lead Role
required_capabilities:
  - design_scoping
  - design_dependency_management
depends_on:
  - T-20260729-001
  - T-20260729-026
blocks:
  - T-20260728-003
parallel_group:
allowed_paths:
  - design/prototype/
  - design/figma-build/
  - design/exports/
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
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
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260729-002_refresh-design-for-approved-product-ux-report.md
qa_to: .ai_project/qa/T-20260729-002_refresh-design-for-approved-product-ux-qa.md
---

# 확정 제품 UX 기반 디자인 시스템·프로토타입 갱신

## 목적

완료된 MVP UI/UX v1을 보존하면서 이후 확정된 제품 상태, 편집 구조와 출시 필수 핸즈프리 경험을 UI Source of Truth와 Figma 미러에 반영한다.

## 제안 범위

- 진행 단계가 다른 레시피를 하나의 Home 목록에 표시하고 현재 단계로 이어가는 카드 상태
- 여러 진행 레시피와 진행 기록 전체 삭제 흐름
- STEP Preview 삭제·되돌리기와 시간순 고정
- AI Review 임시 저장, 이탈 경고와 최종 저장 상태
- 조리 단계별 독립 입력 카드, 추가·삭제·재배열
- 완료 레시피 수정 모드
- Audio Guide 버튼 조작과 핸즈프리 시작·종료·인식 실패 fallback
- 재료 듣기, 마지막 단계, 자동 재생 대기와 화면 잠금 상태
- 마이크·녹음·기기 내 STT와 온라인 AI 장애의 원인별 안내, 원격 STT 자동 fallback 금지와 사용자 재실행 상태
- 앱 정보의 이메일 문의, 개인정보처리방침, 이용약관과 데이터 보관 안내
- Light·Dark, 작은 화면, Dynamic Type와 접근성 상태

## 제외 범위

- iOS 또는 Backend 구현
- 제품 문서에서 미확정으로 남은 항목의 임의 결정
- 수익화·Paywall 디자인
- 기존 완료 Task `T-20260728-002`의 상태 재개방

## 성공 기준

- Product 문서의 모든 확정 상태가 프로토타입에서 도달 가능하다.
- AI Review와 완료 레시피 수정이 같은 폼 구조와 서로 다른 저장 행동으로 표현된다.
- Audio Guide의 버튼과 음성 명령이 동일한 액션 모델을 사용한다.
- 핸즈프리 실패 시 버튼으로 계속 진행하는 fallback이 표현된다.
- 온라인 장애가 로컬 레시피 조회·검색·Audio Guide를 차단하지 않고 실패한 행동만 다시 실행하는 흐름이 표현된다.
- 로컬 저장과 복구 경계, 문의·법적 문서가 앱 정보에서 확인 가능하다.
- 독립 Design QA가 핵심 흐름, 오류 상태, 접근성과 핸드오프 정합성을 통과시킨다.

## 사용자 결정 필요 항목

- Product 문서화 Task 완료 후 Design Lead scope 승인
- Figma MCP 사용 가능 여부는 실행 차단 조건이 아니며 로컬 Prototype과 Manifest를 우선한다.

## Coordination 메모

- `T-20260728-002`는 완료 상태를 유지하고 본 Task가 후속 변경을 담당한다.
- `T-20260728-003`은 본 Task의 승인된 디자인 기준이 나오기 전까지 시작하지 않는다.

## Design Lead 하위 Task 분해 요구

1. Foundation·token·공통 component와 상태 variant 갱신
2. Home·전체 보기·검색·상태별 recipe card와 routing
3. Cooking Log·STEP Preview·권한·STT 오류와 오프라인 상태
4. AI 처리·AI Review·임시 저장·완료 편집·삭제 상태
5. Audio Guide·핸즈프리·오디오 중단·버튼 fallback 상태
6. 앱 정보·개인정보·법적 문서·문의와 서비스 장애 상태
7. Light·Dark·작은 화면·Dynamic Type·접근성 및 구현 핸드오프

각 하위 Task는 Prototype 상태, Manifest 변경과 Design QA 확인 항목을 함께 가져야 한다. Figma 미러는 호출 가능할 때 같은 결과를 동기화하되 완료 판정을 차단하지 않는다.
