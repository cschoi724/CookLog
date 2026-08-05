# T-20260805-002 iOS 로컬 lifecycle 구현 보고서

작성일: 2026-08-05
작성 Role: iOS Agent / Execution Role
상태: `verification_ready`

## 결과

`draft_step_preview -> draft_ai_review -> completed`를 단일 `RecipeRecord.id`로 관리하는
도메인·Repository·SwiftData 경계를 구현했습니다. 기존 `RecipeRepository`는 완료 Recipe
전용 호환 경계로 유지하고 새 `RecipeRecordRepository`가 진행 기록과 완료 Recipe를 함께
다룹니다.

## 구현 범위

- `RecipeRecord`, `RecipeLifecycleState`와 허용 전이·snapshot 잠금·UUID 불변식
- STEP 자동 저장, AI Review 수동 임시 저장, 완료 전환 UseCase 계약
- InMemory·SwiftData `RecipeRecordLocalDataSource`와 기본 Repository
- 기존 `PersistentRecipe`의 lifecycle·STEP snapshot·AI 요청 필드 확장
- 기존 lifecycle 값이 없는 Recipe를 `completed`로 읽는 호환 경계
- 완료 Recipe 조회에서 진행 draft를 제외하는 기존 API 호환성
- SwiftData 저장·삭제 실패 시 `ModelContext.rollback()`
- 여러 draft 재실행 복구, 저장 실패 원본 보존과 legacy completed 테스트

## 자체 검증

- `xcodebuild ... build -quiet`: 성공
- `xcodebuild ... build-for-testing -quiet`: 성공
- lifecycle·SwiftData·Mapper 선별 XCTest: 성공
- 전체 `xcodebuild ... test -quiet`: 성공
- iPhone 15 iOS 17.2 기존 설치 위 새 앱 설치·실행: 성공, PID 반환 확인
- 기존 `default.store`가 유지된 상태에서 lifecycle 컬럼 추가 확인
- `git diff --check`: 성공

검증 destination:

```text
platform=iOS Simulator,name=iPhone 15,OS=17.2
```

## Migration 증빙과 잔여 위험

기존 Simulator의 SwiftData store를 제거하지 않고 앱을 덮어 설치했으며 새 schema로 앱이
정상 실행됐습니다. store 생성 시각과 파일을 유지하면서 lifecycle 컬럼이 추가됐습니다.
다만 해당 store의 `PersistentRecipe` 행은 0개였으므로 실제 legacy 행 보존은
`testLegacyRecipeDefaultsToCompletedRecordWithoutDataLoss`와 기존 Mapper 회귀 테스트로
확인했습니다. non-empty 실제 store migration은 iOS QA가 추가 fixture로 보강할 수 있습니다.

## 제외 범위

- 화면·Navigation·AppEnvironment 연결
- 실제 STT·AI·TTS와 Backend 연동
- Home 검색·Cooking Log·AI Review UI 변경

이 항목들은 후속 `T-20260805-003~007`에서 현재 계약을 사용해 구현합니다.
