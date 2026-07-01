---
id: T-20260701-002
title: iOS MVP 수동 QA 체크리스트 수행
status: rework_requested
type: docs
priority: P1
target_agent: QA Agent
required_capabilities:
  - qa_review
  - risk_review
depends_on:
  - T-20260701-001
allowed_paths:
  - apps/ios/docs/MANUAL_QA_CHECKLIST.md
  - apps/ios/docs/STATUS.md
  - .ai_project/task_board.md
  - .ai_project/tasks/
  - .ai_project/qa/
source_of_truth:
  - .ai_project/source_of_truth.md
  - apps/ios/agents.md
  - apps/ios/docs/STATUS.md
  - apps/ios/docs/MANUAL_QA_CHECKLIST.md
  - docs/PROJECT_STATUS.md
  - docs/product/CookLog_PRD_v2.md
created_by: PM Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-01
updated_at: 2026-07-01
report_to: .ai_project/qa/T-20260701-002_qa-report.md
qa_to: .ai_project/qa/T-20260701-002_qa-report.md
---

# iOS MVP 수동 QA 체크리스트 수행

## 작업 배경

`T-20260701-001`에서 루트 프로젝트 상태 문서를 현재 iOS M8 단계와 동기화했다. 다음 우선 작업은 `apps/ios/docs/STATUS.md`에 기록된 M8 후속 작업 중 첫 항목인 `MANUAL_QA_CHECKLIST.md` 기준 전체 MVP 흐름 터치 검증이다.

현재 `apps/ios/docs/MANUAL_QA_CHECKLIST.md`에는 일부 항목이 이미 체크되어 있으나, Recipe Detail 이후 흐름과 저장 유지, 화면/사용성, 최종 판정 항목은 아직 완료 기록이 없다.

## 작업 목적

iOS MVP 핵심 흐름을 실제 앱 실행 기준으로 수동 검증하고, 통과/조건부 통과/보류 판정을 남긴다.

## 작업 범위

- `apps/ios/docs/MANUAL_QA_CHECKLIST.md` 기준 수동 QA 수행
- Home -> Cooking Log -> AI Review -> Recipe Detail -> Audio Player 흐름 확인
- 저장 후 앱 재실행 시 SwiftData Recipe 유지 여부 확인
- 작은 화면, 다크 모드, 입력 화면 사용성 확인
- 발견 이슈를 재현 순서, 기대 동작, 심각도와 함께 기록
- QA 결과 보고서를 `.ai_project/qa/T-20260701-002_qa-report.md`에 작성
- 필요 시 `apps/ios/docs/STATUS.md`에 QA 수행 결과 또는 후속 작업 요약 반영

## 제외 범위

- iOS 앱 코드 수정
- UI 문구/레이아웃 직접 수정
- `xcodebuild test` 대기 이슈 원인 조사
- Android 관련 작업
- 제품 범위 또는 PRD 변경
- 사용자 승인 없이 Task를 `approved` 또는 실행 상태로 전환

## 검증 기준

- 수동 QA 체크리스트의 각 섹션에 확인 결과가 남아 있다.
- 핵심 MVP 흐름의 통과 여부가 명확하다.
- 실패 또는 조건부 통과 항목은 재현 가능한 형태로 기록되어 있다.
- 최종 판정이 통과, 조건부 통과, 보류 중 하나로 기록되어 있다.
- QA 보고서에 잔여 리스크와 권장 후속 Task가 정리되어 있다.

## 완료 후 갱신할 문서

- `apps/ios/docs/MANUAL_QA_CHECKLIST.md`
- `.ai_project/qa/T-20260701-002_qa-report.md`
- `.ai_project/task_board.md`
- `.ai_project/tasks/T-20260701-002_ios-mvp-manual-qa.md`
- 필요 시 `apps/ios/docs/STATUS.md`

## QA Agent가 확인해야 할 항목

- 실제 앱 실행 환경, 시뮬레이터/기기, iOS 버전을 기록한다.
- 체크리스트에 이미 체크된 항목도 현재 실행 결과와 맞는지 재확인한다.
- Recipe Detail 이후 Audio Player까지 MVP 흐름이 끊기지 않는지 확인한다.
- SwiftData 저장 유지가 실제 재실행 후 확인됐는지 구분한다.
- 작은 화면과 다크 모드 확인 여부를 명확히 남긴다.

## 차단 시 보고해야 할 내용

- 앱을 실행할 수 없는 경우 실행 환경과 실패 메시지
- Xcode 또는 시뮬레이터 문제로 수동 QA를 완료할 수 없는 경우
- 체크리스트 기존 체크 상태와 실제 앱 동작이 충돌하는 경우
- Product Owner 확인이 필요한 UX 또는 제품 판단 항목

## QA 실행 결과

- 판정: 재작업 요청
- 상세 보고서: `.ai_project/qa/T-20260701-002_qa-report.md`
- `xcodebuild build -quiet`: 성공
- `xcodebuild build-for-testing -quiet`: 성공
- iPhone SE (3rd generation), iOS 17.2 시뮬레이터 앱 설치/실행: 성공
- 확인 완료:
  - Home 화면 표시
  - `요리 기록 시작` 버튼 표시
  - 저장된 레시피 빈 상태 문구
  - Home -> Cooking Log 이동
  - 10초 기록 중 상태와 타이머 표시
  - 기록 완료 후 STEP Preview 1개 생성
  - STEP Preview 생성 후 `AI 정리하기` 버튼 표시
  - 작은 화면 Home 레이아웃
  - 다크 모드 Home 가독성
- 재작업 요청:
  - Cooking Log에 STEP Preview 1개가 표시된 상태에서 `AI 정리하기`를 누르면 AI Review가 레시피 초안 대신 `정리할 STEP Preview가 없습니다.` 오류를 표시한다.
  - 뒤로 돌아가 Cooking Log를 확인하면 STEP Preview 1개는 여전히 표시되어 있어, AI Review route 또는 ViewModel 입력 전달 경로에서 STEP Preview가 비어지는 것으로 보인다.
  - 이 문제로 AI Review 저장, Recipe Detail, Audio Player, SwiftData 저장 유지 검증을 완료하지 못했다.
- 비고:
  - iPhone 15 시뮬레이터는 Apple ID Verification 시스템 팝업이 화면을 가려 앱 화면 확인이 차단되었다.
  - 최초 시도에서 차단됐던 macOS 보조 접근 권한 문제는 재개 승인 후 해소되었다.

## 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | PM Agent가 proposed Task로 최초 등록 |
| 2026-07-01 | Product Owner 승인으로 approved 전환 |
| 2026-07-01 | QA Agent가 수동 QA를 시도했으나 Simulator 클릭 자동화 권한 차단으로 blocked 전환 |
| 2026-07-01 | Product Owner가 macOS 손쉬운 사용 권한 허용 후 재개 승인, approved 전환 |
| 2026-07-01 | QA Agent가 재개 승인 기준으로 in_progress 전환 |
| 2026-07-01 | STEP Preview가 AI Review에 전달되지 않는 핵심 흐름 결함 확인 후 rework_requested 전환 |
