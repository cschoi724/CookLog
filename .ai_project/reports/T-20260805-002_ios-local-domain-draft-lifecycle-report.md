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
첫 자체 검증에 사용한 store의 `PersistentRecipe` 행은 0개였으나, 이후 iOS QA가 실제
non-empty legacy store fixture를 추가했습니다. 재작업 전체 XCTest에서 해당 store의 제목·
재료·단계가 새 schema의 completed record와 Recipe로 보존되는 것을 확인했습니다.

## QA 재작업 결과

- `QA-HIGH-805002-001`: 알 수 없는 lifecycle raw value를 `completed`로 복원하는 규칙을
  Mapper와 기존 완료 Recipe 단건·목록 조회에 공통 적용했습니다.
- `QA-HIGH-805002-002`: 새 record 생성용 `createRecord(_:)` 계약과
  `RecipeRecordRepositoryError.recordAlreadyExists`를 추가했습니다. InMemory actor와
  `@MainActor` SwiftData 저장 경계에서 기존 UUID를 검사하고, 충돌 시 기존 completed
  record와 Recipe를 변경하지 않습니다.
- QA 회귀 테스트 2개와 SwiftData 충돌 보존 추가 테스트를 선별 실행해 통과했습니다.
- iOS QA의 실제 non-empty legacy store migration fixture를 포함한 전체 XCTest 43개를
  `platform=iOS Simulator,name=iPhone 15,OS=17.2`에서 통과했습니다.
- `QA-HIGH-805002-001~002`의 독립 해소 확인과 기존 회귀 검증은 iOS QA Agent에
  재인계합니다.

## 제외 범위

- 화면·Navigation·AppEnvironment 연결
- 실제 STT·AI·TTS와 Backend 연동
- Home 검색·Cooking Log·AI Review UI 변경

이 항목들은 후속 `T-20260805-003~007`에서 현재 계약을 사용해 구현합니다.
