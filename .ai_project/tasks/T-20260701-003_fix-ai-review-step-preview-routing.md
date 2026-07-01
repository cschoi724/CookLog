---
id: T-20260701-003
title: AI Review에 STEP Preview가 전달되지 않는 문제 수정
status: done
type: bugfix
priority: P1
target_agent: Development Agent
required_capabilities:
  - implementation
  - developer_verification
depends_on:
  - T-20260701-002
allowed_paths:
  - apps/ios/CookLog/
  - apps/ios/CookLogTests/
  - apps/ios/docs/STATUS.md
  - apps/ios/docs/DEVELOPMENT_PLAN.md
  - apps/ios/docs/CHANGELOG.md
  - .ai_project/task_board.md
  - .ai_project/tasks/
  - .ai_project/reports/
source_of_truth:
  - .ai_project/source_of_truth.md
  - .ai_project/qa/T-20260701-002_qa-report.md
  - .ai_project/tasks/T-20260701-002_ios-mvp-manual-qa.md
  - apps/ios/agents.md
  - apps/ios/docs/STATUS.md
  - apps/ios/docs/DEVELOPMENT_PLAN.md
  - apps/ios/docs/NAVIGATION.md
  - apps/ios/docs/TESTING.md
  - docs/product/CookLog_PRD_v2.md
created_by: PM Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-01
updated_at: 2026-07-01
report_to: .ai_project/reports/T-20260701-003_dev-report.md
qa_to: .ai_project/qa/T-20260701-003_qa-report.md
related_tasks:
  - T-20260701-002
related_qa_issues:
  - QA-HIGH-001
---

# AI Review에 STEP Preview가 전달되지 않는 문제 수정

## 작업 배경

`T-20260701-002` 수동 QA 재개 결과, Home -> Cooking Log -> 10초 기록 -> STEP Preview 생성까지는 통과했다. 그러나 STEP Preview 1개가 화면에 표시된 상태에서 `AI 정리하기`를 누르면 AI Review가 레시피 초안 대신 `정리할 STEP Preview가 없습니다.` 오류를 표시했다.

QA는 Cooking Log로 돌아갔을 때 STEP Preview 1개가 여전히 표시되는 것도 확인했다. 따라서 STEP Preview 생성 자체보다 `AI 정리하기` route 또는 `AIReviewViewModel` 입력 전달 경로에서 배열이 비어지는 문제가 의심된다.

## 문제 정의

- 이슈 ID: `QA-HIGH-001`
- 위치: AI Review 진입
- 심각도: 높음
- 영향: AI 정리, 저장, Recipe Detail, Audio Player, SwiftData 저장 유지 검증이 모두 차단된다.

## 재현 절차

1. iPhone SE (3rd generation), iOS 17.2 시뮬레이터에 CookLog를 새 설치한다.
2. Home에서 `요리 기록 시작`을 누른다.
3. Cooking Log에서 `10초 기록`을 누르고 기록 완료를 기다린다.
4. STEP Preview에 `삼겹살을 넣고 볶았어` 1개가 표시되는 것을 확인한다.
5. `AI 정리하기`를 누른다.

## 기대 동작

AI Review가 Cooking Log의 STEP Preview 배열을 입력으로 받아 Mock AI 기반 레시피 초안을 표시해야 한다.

## 실제 동작

AI Review가 `정리할 STEP Preview가 없습니다.` 오류를 표시한다.

## 원인 확인 후보

- `apps/ios/CookLog/App/CookLogApp.swift`의 `aiReviewStepPreviews` 상태 저장과 `path.append(.aiReview)` 순서 또는 SwiftUI navigation destination 생성 타이밍
- `AppRoute.aiReview`가 associated value 없이 전역 상태 `aiReviewStepPreviews`에 의존하는 구조
- `AIReviewView` 또는 `AIReviewViewModel`이 View 갱신 시점에 빈 배열로 초기화되는 경로
- `CookingLogView`의 `onGenerateRecipeDraft(viewModel.stepPreviews)` 호출 시점과 ViewModel 상태 반영 타이밍

## 작업 범위

- STEP Preview가 AI Review에 안정적으로 전달되도록 route 또는 상태 전달 방식을 수정한다.
- 필요한 경우 `AppRoute.aiReview`에 STEP Preview 배열 또는 session snapshot을 명시적으로 연결한다.
- `AIReviewViewModel`이 빈 STEP Preview를 받는 회귀를 막는 단위 테스트를 추가하거나 기존 테스트를 보강한다.
- 수정 후 iOS 빌드와 테스트 빌드를 확인한다.
- 가능하면 QA 재현 절차 기준으로 앱 실행 또는 수동 확인을 수행한다.
- 결과를 `apps/ios/docs/STATUS.md`, `apps/ios/docs/DEVELOPMENT_PLAN.md`, `apps/ios/docs/CHANGELOG.md`에 반영한다.
- 개발 보고서를 `.ai_project/reports/T-20260701-003_dev-report.md`에 작성한다.

## 제외 범위

- 실제 AI API 연동
- STT/TTS 실제 서비스 연동
- Recipe Detail 또는 Audio Player의 별도 UI 개선
- SwiftData 저장 구조 리팩터링
- `xcodebuild test` 대기 이슈 원인 조사
- Android 작업
- 제품 범위 또는 PRD 변경

## 검증 기준

- STEP Preview 1개 생성 후 `AI 정리하기`를 누르면 AI Review가 `정리할 STEP Preview가 없습니다.` 오류 대신 레시피 초안을 표시한다.
- `AIReviewViewModel`은 전달받은 STEP Preview를 기반으로 `GenerateRecipeDraftUseCase`를 호출한다.
- 기존 AI Review 단위 테스트가 통과하거나, 변경된 구조에 맞게 보강된 테스트가 통과한다.
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build -quiet` 성공
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing -quiet` 성공
- `xcodebuild test`는 기존 XCTest runner 대기 이슈가 있으면 재현 여부만 보고하고 차단으로 보지 않는다.
- 수정 범위가 `allowed_paths`를 벗어나지 않는다.

## 완료 후 갱신할 문서

- `.ai_project/reports/T-20260701-003_dev-report.md`
- `.ai_project/tasks/T-20260701-003_fix-ai-review-step-preview-routing.md`
- `.ai_project/task_board.md`
- `apps/ios/docs/STATUS.md`
- `apps/ios/docs/DEVELOPMENT_PLAN.md`
- `apps/ios/docs/CHANGELOG.md`

## QA Agent가 확인해야 할 항목

- `T-20260701-002`의 재현 절차로 AI Review 레시피 초안이 표시되는지 확인한다.
- 수정 후 Recipe Detail, Audio Player, SwiftData 저장 유지 검증을 이어서 수행할 수 있는지 확인한다.
- STEP Preview가 여러 개인 경우에도 AI Review 입력이 유지되는지 확인한다.
- 기존 Home, Cooking Log, 10초 기록, STEP Preview 생성 흐름이 회귀하지 않았는지 확인한다.

## 차단 시 보고해야 할 내용

- route 구조 변경 없이 안정적인 전달이 불가능한 경우
- 테스트 추가가 현재 프로젝트 구조상 어려운 경우와 그 이유
- 앱 실행 또는 시뮬레이터 확인이 환경 문제로 차단되는 경우
- 수정 범위가 `allowed_paths` 밖으로 확장되어야 하는 경우

## 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | PM Agent가 proposed Task로 최초 등록 |
| 2026-07-01 | Product Owner 승인으로 approved 전환 |
| 2026-07-01 | Development Agent가 route payload 방식으로 수정 후 ready_for_qa 전환 |
| 2026-07-01 | QA Agent가 `QA-HIGH-001` 재현 절차 통과 확인 후 qa_passed 전환 |
| 2026-07-01 | PM Agent가 QA 통과 확인 후 done 확정 |
