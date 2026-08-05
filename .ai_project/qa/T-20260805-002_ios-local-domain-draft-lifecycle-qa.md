# T-20260805-002 iOS 로컬 lifecycle 독립 QA 보고서

작성일: 2026-08-05
작성 Role: iOS QA Agent / Verification Role
대상 구현: `f9c86a0751488ab4ff7741d410b045d2692c445c`
기준 상태: `origin/develop@39468f455b20234b4cc237cf84c718a170376419`
판정: `FAIL — rework_requested`

## 1. 검증 범위

- `draft_step_preview -> draft_ai_review -> completed` 생명주기와 단일 UUID 불변식
- 여러 draft의 최근 활동 순 정렬과 SwiftData 재실행 복구
- 기존 완료 Recipe 조회 호환과 legacy lifecycle fallback
- non-empty 구버전 SwiftData store의 경량 migration과 데이터 보존
- 저장 실패 시 마지막 성공 snapshot 보존과 금지된 역방향 전이
- 변경 경로, 문서, 전체 XCTest 회귀

## 2. 환경과 방법

- Xcode 26.6 (`17F113`)
- iPhone 15 Simulator, iOS 17.2 (`3210F1DE-54D5-4B79-9066-0925FA8BB442`)
- 구현 diff와 `DATA_MODEL.md`, `PERSISTENCE.md`, PRD v2를 독립 대조
- 구현 상태 그대로 전체 XCTest 실행
- QA 회귀 테스트 3개 추가
  - 알 수 없는 legacy lifecycle의 완료 Recipe 조회 호환
  - 완료 UUID 재사용 시 역방향 전이·덮어쓰기 방지
  - 실제 non-empty 구버전 store migration

## 3. 검증 결과

### 통과

- 구현 상태 전체 XCTest: `39/39` 통과
  - xcresult: `/private/tmp/cooklog-qa-T-20260805-002-derived/Logs/Test/Test-CookLog-2026.08.05_12-03-03-+0900.xcresult`
- `git diff --check`: 통과
- 변경 파일은 Task `allowed_paths` 안에 있음
- 여러 record 저장·최근 활동 순 복구와 draft/completed 분리 조회: 기존 테스트 통과
- AI snapshot 잠금 중 STEP 변경 거부, 다른 UUID 완료 거부, 저장 실패 시 마지막 성공 snapshot 보존: 기존 테스트 통과
- 실제 non-empty 구버전 schema store를 새 schema로 열어 제목·재료·STEP과 동일 UUID를 보존: 통과
  - xcresult: `/private/tmp/cooklog-qa-T-20260805-002-derived/Logs/Test/Test-CookLog-2026.08.05_12-06-46-+0900.xcresult`

### 실패

- 알 수 없는 lifecycle의 기존 완료 Recipe가 `RecipeRecord` 조회에서는 completed로 복구되지만 기존 `RecipeRepository` 조회에서는 사라짐
- 완료 record와 같은 UUID로 새 draft를 생성하면 금지된 역방향 전이가 성공하고 완료 Recipe가 덮어써짐

## 4. 결함

### QA-HIGH-805002-001 — 알 수 없는 legacy lifecycle 행이 완료 Recipe 조회에서 숨겨짐

- 위치: `SwiftDataRecipeLocalDataSource.fetchRecipes()`, `fetchRecipe(id:)`
- 기준: `PERSISTENCE.md` 6절은 lifecycle 값이 없거나 알 수 없는 기존 행을 데이터 손실 방지를 위해 `completed`로 복원하도록 규정함
- 실제:
  - `RecipePersistenceMapper.makeRecord`는 알 수 없는 raw value를 `.completed`로 fallback함
  - `fetchRecipes()`와 `fetchRecipe(id:)`는 raw value가 정확히 `completed`인 행만 허용해 같은 행을 누락함
- 영향: 기존 완료 Recipe가 record API에서는 존재하지만 Home·상세가 사용하는 호환 조회에서는 사라져 사용자에게 데이터 유실처럼 보임
- 재현:
  - `testUnknownLegacyLifecycleRemainsVisibleThroughCompletedRecipeQueries`
  - `fetchRecord.lifecycleState == completed` 통과
  - `fetchRecipe == nil`, `fetchRecipes == []`로 2개 assertion 실패
  - xcresult: `/private/tmp/cooklog-qa-T-20260805-002-derived/Logs/Test/Test-CookLog-2026.08.05_12-03-56-+0900.xcresult`
- 수용 기준: 완료 호환 여부를 Mapper와 기존 조회에서 동일한 fallback 규칙으로 판정하고, 알 수 없는 값의 행도 내용 손실 없이 단건·목록 조회에 노출할 것

### QA-HIGH-805002-002 — 완료 UUID 재사용으로 completed record가 빈 draft로 덮어써짐

- 위치: `CreateRecipeRecordUseCase.execute(id:)`, `DefaultRecipeRecordRepository.saveRecord`, 두 LocalDataSource의 upsert
- 기준: `DATA_MODEL.md` 8절은 역방향 전이를 오류로 거부하고 완료 전환까지 같은 UUID와 데이터를 보존하도록 규정함
- 실제: 기존 completed record의 UUID를 `CreateRecipeRecordUseCase`에 전달하면 충돌 검증 없이 새 `draftStepPreview`가 저장되어 완료 Recipe가 제거됨
- 영향: 잘못된 호출이나 식별자 재사용 시 금지된 `completed -> draft_step_preview` 전이가 Repository 경계에서 가능하며 사용자 완료 데이터가 손상됨
- 재현:
  - `testCreatingDraftWithCompletedRecordIdentifierDoesNotOverwriteCompletedRecipe`
  - 생성 호출이 오류 없이 성공하고 복구 조회가 completed 대신 빈 draft를 반환해 2개 assertion 실패
  - xcresult: `/private/tmp/cooklog-qa-T-20260805-002-derived/Logs/Test/Test-CookLog-2026.08.05_12-04-51-+0900.xcresult`
- 수용 기준: 생성 시 기존 ID 존재 여부를 확인해 충돌을 명시적 오류로 거부하고, InMemory·SwiftData 모두 기존 completed record를 변경하지 않을 것

## 5. 최종 판정과 인계

실제 non-empty migration과 기존 39개 테스트는 통과했지만, 완료 Recipe 가시성과 단일 UUID 생명주기의 핵심 데이터 보존 불변식을 깨는 HIGH 결함 2건이 재현됐습니다. 따라서 `FAIL`, `rework_requested`로 판정합니다.

Development Lead Agent는 두 결함을 하나의 데이터 무손실 재작업 범위로 조율하고, 구현 수정 후 위 QA 회귀 테스트와 기존 39개 테스트를 모두 통과한 상태로 iOS QA에 재인계해야 합니다.
