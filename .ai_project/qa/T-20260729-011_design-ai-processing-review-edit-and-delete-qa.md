# T-20260729-011 Design QA 독립 재검증 보고서

작성일: 2026-07-31
작성자: Design QA Agent
대상 Task: `T-20260729-011`
판정: `verification_passed`

## 1. 재검증 요약

재작업된 `DQA-HIGH-011-001~003`, `DQA-MEDIUM-011-001~004`의 수용 기준과 기존 통과 항목의 회귀를 로컬 UI Source of Truth 기준으로 독립 재검증했다.

마지막 성공 임시 저장 snapshot과 현재 편집본이 분리되어 변경 폐기가 동작하고, 완료 레시피 수정값은 저장 후 Recipe Detail에 실제 반영된다. 완료 편집에는 임시 저장 행동이 없으며, Review 이탈 dialog·STEP 삭제·완료 레시피 메뉴의 키보드 포커스와 Escape·Tab 계약도 동작한다. 빈 STEP은 저장 전에 제외되고 표시 순서대로 다시 번호가 매겨진다.

- 기존 결함 해소: 7건
- 신규 결함: 없음
- 최종 상태: `verification_passed`
- 다음 담당: Design Lead Agent
- Task `done` 전환: 수행하지 않음

## 2. 검증 환경과 Git 위험

- Worktree: `/private/tmp/cooklog-t20260729-011`
- Branch: `task/T-20260729-011-design-ai-review-and-completed-recipe-edit-delete`
- Task HEAD: `ac01bfea050f6e320edca871982090d434c72aec`
- `origin/develop`: `e939b7810ad6c17745f1bcbd6ef7fb3966cc3c3c`
- Prototype revision: `ai-review-edit-delete-20260731`

Task branch는 `origin/develop`보다 4개 커밋 뒤에 있다. upstream 변경은 Backend·CI workflow·문서와 관련 보드에 한정되고 T-011 디자인 원본·Manifest를 변경하지 않아 디자인 판정에는 영향이 없다. 동시에 변경된 Quality Board 정합화는 병합 전 Git gate로 남긴다. 이번 검증에서는 switch, stash, reset, add, commit, push, PR과 merge를 수행하지 않았다.

## 3. 기존 결함 재검증

### DQA-HIGH-011-001 — 변경 폐기 snapshot 복원

결과: 해소

1. 제목을 `임시 저장 기준 제목`으로 바꾸고 임시 저장했다.
2. 제목을 `폐기 대상 제목`으로 다시 변경했다.
3. 뒤로 가기에서 `변경 버리고 나가기`를 선택했다.
4. 같은 세션에서 Review `editable` 상태로 재진입했다.

재진입 제목은 마지막 성공 임시 저장값인 `임시 저장 기준 제목`으로 복원됐다. `reviewSavedSnapshot`과 현재 `reviewDraft`가 독립 복제되고 임시 저장·폐기 경계에서 갱신되는 것도 정적으로 확인했다.

### DQA-HIGH-011-002 — 완료 레시피 수정 결과 반영

결과: 해소

완료 편집에서 제목, 첫 재료, 첫 STEP, 예상 시간과 메모를 각각 수정하고 `수정 완료`를 실행했다.

- 제목: `수정 반영 제목`
- 첫 재료: `목살`
- 첫 STEP: `첫 단계 수정`
- 예상 시간: `31분`
- 메모: `수정 메모`

저장 후 `detail/content`로 이동했으며 Recipe Detail의 5개 영역이 모두 변경값과 일치했다. 저장 대기본과 완료 레시피 원본을 분리하고 저장 성공 시 `completedRecipe`를 교체하는 상태 경계도 확인했다.

### DQA-HIGH-011-003 — 완료 편집 이탈 행동

결과: 해소

완료 편집에서 값을 변경하고 뒤로 가기를 실행했을 때 행동은 다음 2개만 표시됐다.

- `수정 버리고 상세로`
- `계속 편집`

임시 저장 행동은 0개였고 `수정 버리고 상세로` 선택 후 `detail/content`로 이동하며 기존 완료 제목 `달큰한 간장 삼겹살`이 복원됐다.

### DQA-MEDIUM-011-001 — Review 이탈 dialog 접근성

결과: 해소

- `role="alertdialog"`와 `aria-modal="true"` 적용
- 초기 포커스: `계속 편집`
- 마지막 행동에서 Tab: 첫 행동 `임시 저장하고 나가기`로 순환
- 첫 행동에서 Shift+Tab: 마지막 행동 `계속 편집`으로 순환
- dialog 표시 중 폼 control 25/25 비활성
- Escape: `editable`로 복귀
- 닫힘 후 포커스: 원래 `뒤로` 행동

dialog 외부로 포커스를 이동하려 할 때 초기 안전 행동으로 되돌리는 focus guard도 확인했다.

### DQA-MEDIUM-011-002 — STEP 삭제 후 포커스

결과: 해소

- `STEP 1 삭제` 직후 포커스: `undo-review-step`
- `되돌리기` 실행 후 포커스: 복원된 `review-step-0`

삭제된 DOM 요소 때문에 포커스가 `BODY`로 소실되던 회귀는 재현되지 않았다.

### DQA-MEDIUM-011-003 — 완료 레시피 메뉴 포커스·Escape

결과: 해소

- 메뉴 열림 직후 포커스: `레시피 수정`
- Escape 후 상태: `detail/content`
- 닫힘 후 포커스: `레시피 메뉴` trigger

클릭과 키보드 경로에서 동일한 포커스 의도를 사용한다.

### DQA-MEDIUM-011-004 — 빈 STEP 제외와 재번호

결과: 해소

완료 편집의 기존 STEP 3개 뒤에 빈 STEP을 추가해 저장 전 카드 수가 4개인 것을 확인한 다음 `수정 완료`를 실행했다.

- 저장 후 Detail STEP 수: 3개
- 첫 STEP: 수정값 `첫 단계 수정`
- 목록 시작 번호: 1
- 빈 STEP: 저장 결과에서 제외

`normalizedRecipeDraft()`가 STEP 문자열 공백을 정리하고 빈 값을 제거한 뒤 현재 배열 순서로 Detail ordered list를 생성한다.

## 4. 기존 통과 항목 회귀 검증

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| AI 장기 처리 | 통과 | 9초 `processing`, 10초 이후 `processing-long`, 이후 자동 완료·실패·화면 이동 없음 |
| 명시적 Review 진입 | 통과 | `ready-banner` 유지 후 사용자 선택으로만 `editable` 진입 |
| AI 실패 복구 | 통과 | 자동 재시도 없음, `다시 정리하기` 선택 후에만 `processing` 재진입 |
| 필수 입력 검증 | 통과 | 제목 공백 저장 시 `validation-error`, `aria-invalid="true"`와 오류 안내 |
| 완료 레시피 삭제 dialog | 통과 | 취소 초기 포커스, Tab·Shift+Tab 순환, Escape 닫기, 메뉴 trigger 복귀 |
| 375×667 Light·Dark | 통과 | T-011 관련 40개 조합에서 overflow·clipping·44pt 실패 없음 |
| WCAG AA 대비 | 통과 | 기존 핵심 Light·Dark 텍스트 토큰 모두 4.5:1 이상 유지 |
| Prototype·Manifest 정합성 | 통과 | 완료 이탈 2행동, Review dialog, 완료 메뉴, 저장 정규화 계약 일치 |

## 5. 검증 명령과 실행 확인

- `git status -sb`, `git branch --show-current`: 지정 전용 worktree와 Task 브랜치 확인
- `node --check design/prototype/app.js`: 통과
- `jq empty design/figma-build/manifest.json`: 통과
- Chrome headless 결함 재검증:
  - snapshot 폐기 복원: 통과
  - 완료 레시피 5개 영역 저장 반영: 통과
  - 완료 편집 이탈 행동: 통과
  - Review dialog 키보드·비활성: 통과
  - STEP 삭제·Undo 포커스: 통과
  - 완료 메뉴 포커스·Escape: 통과
  - 빈 STEP 제외·재번호: 통과
- 기존 상태 동적 회귀:
  - 장기 처리·명시적 진입·AI 실패 복구·입력 검증·완료 삭제 dialog: 통과
- 375×667 Light·Dark 상태 매트릭스: 40/40 통과
- `git diff --check`: 통과

## 6. 최종 판정

`DQA-HIGH-011-001~003`, `DQA-MEDIUM-011-001~004`는 모두 해소됐고 기존 통과 항목에도 회귀가 없다.

Task를 `verification_passed`로 전환해 Design Lead Agent에 인계한다. 완료 검토와 `done` 전환은 Design Lead Agent 및 후속 통합 절차로 남긴다.
