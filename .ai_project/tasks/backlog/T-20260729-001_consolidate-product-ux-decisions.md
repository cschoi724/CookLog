---
id: T-20260729-001
title: 확정 제품 정책과 출시 계획 통합 문서화
status: done
type: documentation
priority: P0
priority_reason: 2026-07-28~29에 확정한 기록·초안·AI Review·Audio Guide 정책이 현재 PRD와 디자인 기준에 반영되지 않았고, 핸즈프리 출시 범위는 기존 Future 정의와 충돌한다.
org_unit: Product Division
team: Product Team
team_lead: Product Lead Agent
workflow: feature
target_agent:
target_role:
required_capabilities: []
depends_on: []
blocks:
  - T-20260729-002
  - T-20260728-004
  - T-20260728-005
parallel_group:
allowed_paths:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_PRODUCT.md
  - docs/product/CookLog_MVP_SCOPE.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - docs/product/CookLog_ROADMAP.md
  - docs/PROJECT_DECISIONS.md
  - docs/PROJECT_CHANGELOG.md
  - docs/PROJECT_STATUS.md
  - .ai_project/current_context.md
  - .ai_project/source_of_truth.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/product/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/development/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_MVP_SCOPE.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - docs/PROJECT_DECISIONS.md
created_by: Product Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260729-001_consolidate-product-ux-decisions-report.md
qa_to: .ai_project/qa/T-20260729-001_consolidate-product-ux-decisions-qa.md
---

# 확정 제품 정책과 출시 계획 통합 문서화

## 목적

Product Owner와 Product Lead가 순차 논의로 확정한 기록, STEP Preview, 임시 저장, AI Review, 레시피 생명주기, Audio Guide, 핸즈프리와 운영 정책을 제품 Source of Truth에 통합하고 첫 공개 출시까지의 실행 계획과 Team별 상위 Task를 정리한다.

## 제안 범위

- 10초 고정 녹음과 조기 종료 확장 가능성
- STT 원문 중심 STEP Preview와 추가·삭제·시간순 정책
- STT 오류 분류, 복구 가능한 오류의 1회 자동 재처리, 원본 음성 즉시 삭제 정책
- STEP Preview 자동 저장과 AI Review 수동 임시 저장의 단계별 차이
- Home 단일 레시피 목록의 진행 상태 표시와 상태별 이어가기
- 여러 진행 레시피 허용, 진행 기록 전체 삭제와 복구 범위
- 첫 출시 로컬 저장 범위와 계정·클라우드 백업·내보내기 제외
- 음성·STT·AI 콘텐츠의 임시 보관, 운영 메타데이터와 외부 제공업체 개인정보 원칙
- 내부 1인·실기기 1대 기준의 첫 공개 출시 최소 품질 게이트
- 온라인 서비스 장애 중 로컬 기능 유지, 사용자 재실행과 최소 지원 채널
- 제품 문서별 역할과 우선순위 재정의
- Core v1, 내부 통합, TestFlight와 첫 공개 출시 단계·게이트
- 기존 Task 유지·수정·폐기 판단과 Design·Development 상위 Task 등록
- AI Review의 단계별 조리 순서 편집 폼
- 완료 레시피 수정, 기존 레시피 덮어쓰기와 버전 기록 제외
- 단계별 Audio Guide, 버튼 조작과 출시 필수 핸즈프리 음성 명령
- 핸즈프리 활성화·종료·오류 fallback, 재료 듣기, 마지막 단계, 자동 재생, 화면 잠금 정책
- 기존 문서의 `Future/v3 음성 명령`과 첫 App Store 출시 필수 결정 충돌 해소
- 로컬 데이터, 개인정보, 최소 출시 품질과 서비스 장애 운영 정책

## 제외 범위

- 제품·디자인·iOS·Backend 구현과 독립 검증
- Figma 또는 `design/prototype/` 수정
- 수익화 가격·Free/Pro·AI quota 정책 변경
- Task 실행 승인, commit, push, PR, merge

## 성공 기준

- PRD, MVP 범위, 사용자 흐름, 와이어프레임과 공통 결정 문서가 동일한 상태 모델을 사용한다.
- `draft_step_preview -> draft_ai_review -> completed` 생명주기와 Home 이동 규칙이 문서에 명시된다.
- AI Review 임시 저장과 최종 레시피 저장의 차이가 명확하다.
- 조리 단계가 문자열 한 개가 아니라 순서가 있는 단계 배열임을 명시한다.
- 버튼 기반 Audio Guide와 출시 필수 핸즈프리 범위가 충돌 없이 정리된다.
- Audio Guide, 오류, 권한, 로컬 데이터, 개인정보와 운영 정책이 확정 결정으로 추적된다.
- 후속 Design Task와 iOS 구현 Task가 추가 구두 설명 없이 범위를 판단할 수 있다.
- Roadmap이 출시 단계, 차단 조건, Task 의존성과 우선순위를 한 문서에서 설명한다.
- 중복되거나 오래된 Task를 폐기·수정하고 Design·Development Lead가 하위 Task로 분해할 상위 Mission Task가 등록된다.

## 사용자 결정 필요 항목

- 없음. Product Owner가 2026-07-29 추천 정책의 증분 반영과 최종 운영 정책을 확정했다.

## Coordination 메모

- 이 Task는 최신 `origin/develop` 기반 `task/T-20260729-001-consolidate-product-ux-decisions` 전용 worktree에서 준비한다.
- Product Owner의 2026-07-29 직접 요청에 따라 Product Lead가 확정 Direction 결정을 증분 기록한다.
- 이 Task의 문서 검증과 완료 전까지 `T-20260729-002` 디자인 후속 Task는 시작하지 않는다.
- 수익화 초안과 `T-20260728-010`~`018`은 기존 WIP 작업과 분리하며 이 Task에 섞지 않는다.
- 2026-07-29 Product Owner가 Product QA Agent를 추가하고 본 Task의 독립 검증 진행을 승인했다.
- Product QA `PASS_WITH_RISK`의 세 잔여 위험을 Product Lead가 수용했다. Agent 등록·루트 안내는 `T-20260729-007`, T-009 workflow·성공지표 계측은 T-009 scope에서 해소한다.
- 2026-07-29 Product Lead Completion Review를 통과해 `done`으로 확정했다.

## 상태 전이 기록

- 2026-07-29: Product Lead Agent가 제품 문서와 출시 Task 구성을 완료하고 Product QA Agent에 `verification_ready`로 인계했다.
- 2026-07-29: Product QA Agent가 lock을 획득하고 `verification_ready -> verification_in_progress`로 전환했다.
- 2026-07-29: Product QA Agent가 정책 추적, 문서 정합성, 출시 게이트와 Task graph를 `PASS_WITH_RISK`로 검증하고 `verification_in_progress -> verification_passed`로 전환한 뒤 Product Lead Agent / Completion Role에 인계했다.
