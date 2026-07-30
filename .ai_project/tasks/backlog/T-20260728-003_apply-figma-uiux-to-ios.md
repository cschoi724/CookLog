---
id: T-20260728-003
title: 확정 제품 UX·디자인과 iOS 로컬 상태 모델 적용
status: proposed
type: feature
priority: P0
priority_reason: 첫 공개 출시의 모든 iOS 화면과 로컬 데이터 생명주기를 실제 서비스 연동 전에 확정해야 한다.
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
  - T-20260729-002
blocks:
  - T-20260729-004
  - T-20260729-005
  - T-20260729-006
  - T-20260728-009
parallel_group:
allowed_paths:
  - apps/ios/
  - design/exports/
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
  - .ai_project/source_of_truth.md
  - apps/ios/agents.md
  - apps/ios/docs/ARCHITECTURE.md
  - apps/ios/docs/STATUS.md
  - design/prototype/
  - design/figma-build/manifest.json
  - T-20260729-002의 승인된 디자인 핸드오프
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260728-003_apply-figma-uiux-to-ios-report.md
qa_to: .ai_project/qa/T-20260728-003_apply-figma-uiux-to-ios-qa.md
---

# 확정 제품 UX·디자인과 iOS 로컬 상태 모델 적용

## 목적

확정된 제품 상태와 승인 디자인을 현재 SwiftUI 아키텍처에 반영하고, 실제 온라인 서비스가 없어도 모든 로컬 생명주기와 화면 상태를 검증할 수 있게 한다.

## 제안 범위

- 디자인 토큰과 공통 SwiftUI 컴포넌트 구성
- Home 단일 목록, 상태별 카드, 전체 보기와 제목·재료 로컬 검색
- 여러 진행 레시피와 `draft_step_preview -> draft_ai_review -> completed` 로컬 상태 모델
- STEP Preview 자동 저장·삭제·되돌리기와 AI Review 수동 임시 저장·이탈 경고
- 조리 단계별 편집, 완료 레시피 수정·영구 삭제와 저장 실패 보존
- Audio Guide와 핸즈프리의 전체 화면 상태·버튼 fallback UI
- 앱 정보의 문의·개인정보처리방침·이용약관·데이터 보관 안내
- 오프라인·서비스 장애·권한·빈 상태·처리 중·오류 상태
- 작은 화면, 다크 모드, Dynamic Type, 접근성 보정
- 승인된 로컬 Prototype과 Manifest 에셋 적용
- 기존 Navigation, ViewModel, UseCase 동작 보존
- 로컬 Mock Service 기반 기능 회귀 테스트와 디자인 정합성 QA

## 제외 범위

- 디자인 승인 전 임의 구현
- 디자인 자동 생성 코드를 제품 코드로 그대로 반영
- Apple 기기 내 STT, Backend AI와 TTS 실제 구현
- 실제 핸즈프리 음성 인식 엔진
- App Store 설정과 외부 URL 생성

## 성공 기준

- 승인된 Prototype과 Manifest의 화면·상태가 SwiftUI에 일관되게 구현된다.
- 진행 기록, 임시 저장, 완료 전환, 검색·수정·삭제와 앱 재실행 복구가 PRD와 일치한다.
- 실제 서비스 어댑터 없이도 모든 성공·처리·오류 상태를 Mock으로 검증할 수 있다.
- iPhone 작은 화면과 다크 모드에서 레이아웃 결함이 없다.
- 접근성 라벨과 Dynamic Type의 핵심 흐름을 사용할 수 있다.
- iOS QA Agent가 기능 회귀와 디자인 정합성 검증을 통과시킨다.

## 사용자 결정 필요 항목

- 없음. 기능·접근성 충돌은 iOS 표준을 우선하고 시각 변경은 Design Lead와 재조율한다.

## Coordination 메모

- Development Lead Agent가 화면 또는 컴포넌트 단위 하위 작업 분할 여부를 판단한다.
- 디자인 변경이 필요하면 iOS Agent가 임의 수정하지 않고 Design Lead Agent에게 재조율을 요청한다.
- `T-20260728-002`는 Design QA 통과 후 PR #6으로 `develop`에 병합되어 완료됐다.
- `T-20260728-001`의 유효 검증 항목은 이 Task와 최종 출시 게이트로 통합했고 기존 의존성을 제거했다.
- `T-20260729-002`의 완료·승인 전에는 구현을 시작하지 않는다.

## Development Lead 하위 Task 분해 요구

1. 로컬 도메인·SwiftData migration과 draft 생명주기
2. Home·전체 보기·검색·상태별 routing
3. Cooking Log·STEP Preview 자동 저장과 오류 상태
4. AI Review·완료 레시피 편집·삭제
5. Audio Guide·핸즈프리 화면 상태와 공통 action model
6. 앱 정보·권한·오프라인·서비스 장애 상태
7. 접근성·작은 화면·다크 모드·회귀 테스트

각 하위 Task는 iOS Agent 실행과 iOS QA 독립 검증 경계를 분리해야 한다.
