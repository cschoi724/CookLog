# T-20260805-005 iOS AI Review·완료 Recipe 편집·삭제 구현 보고서

작성일: 2026-08-07
작성 Role: iOS Agent / Execution Role
상태: `verification_ready` — iOS QA Agent 독립 검증 대기

## 결과

Cooking Log가 전달한 동일 `RecipeRecord.id`와 `[StepPreview]` snapshot으로만 Mock AI를
실행하고, 성공한 검토본과 수동 임시 저장본, 현재 편집본을 분리했습니다. 생성·임시 저장·
최종 저장·완료 수정·삭제 실패는 실패한 동작만 재시도하며 화면 값과 마지막 영속 원본을
변경하지 않습니다.

## 구현 범위

- `REVIEW-PROCESSING`, `REVIEW-EDITABLE`, `REVIEW-GENERATION-ERROR`,
  `REVIEW-SAVING`, `REVIEW-SAVE-ERROR`
- STEP snapshot 불일치 생성 거부, 생성 실패 시 원본 STEP 보존·snapshot 잠금 해제
- 제목·재료명·양·예상 시간·메모, 독립 STEP 카드 추가·삭제·Undo·위아래 이동
- 제목·내용 있는 STEP 1개·재료명 없는 양 검증과 빈 STEP 저장 제외·연속 재번호
- 수동 임시 저장, 마지막 성공 snapshot 교체, 이탈 경고·저장/폐기/계속 편집
- 동일 UUID completed 전환 성공 후에만 Recipe Detail 이동, 저장 실패 편집본 보존
- Recipe Detail 메뉴의 AI 재호출 없는 완료 Recipe 수정과 복구 불가 영구 삭제
- 조회·삭제 중·삭제 완료·삭제 실패와 실패 후 저장 원본 보존·삭제 재시도
- SwiftUI 네이티브 NavigationStack·Menu·Button·TextField·TextEditor·ProgressView,
  CookLog Light/Dark 색상 토큰과 Dynamic Type 스타일

## 승인 범위 보완

초기 Task에는 실제 동일 ID DI와 수정 route 조립 파일이 빠져 있었습니다. Product Owner가
`AppEnvironment.swift`, `AppRoute.swift`, `CookLogApp.swift`의 최소 경로 확장을 승인했고
Task `allowed_paths`와 승인 이력에 기록했습니다.

## 자체 검증

- 최신 `origin/develop@02e6d80` 재정렬 후 전체 XCTest `72/72`, 실패·skip 0
  - `/private/tmp/cooklog-derived-t005-rebased/Logs/Test/Test-CookLog-2026.08.07_09-06-25-+0900.xcresult`
- iPhone 15 iOS 17.2 Simulator build: 성공
- SwiftData 통합: draft AI Review → 같은 UUID completed → Recipe 조회: 성공
- 생성 snapshot 불일치 거부·실패 잠금 해제: 성공
- 임시/최종 저장 실패의 모든 편집값·마지막 영속 snapshot 보존과 재시도: 성공
- 완료 Recipe 수정 실패·원본 복원, 삭제 실패·원본 보존·재시도: 성공
- Simulator 실제 흐름:
  - Home → 10초 기록 → STEP 1 자동 저장 → AI Review Editable
  - 제목 편집 시 unsaved 상태와 취소 control 노출
  - Light/Dark `bg/base|elevated`, accent·error 토큰 전환 확인
- 화면 증빙:
  - Light Review Editable: `/private/tmp/cooklog-t005-review.png`
  - Light Review 편집: `/private/tmp/cooklog-t005-review-keyboard2.png`
  - Dark Review 편집: `/private/tmp/cooklog-t005-review-dark2.png`
- `git diff --check`: 최종 정렬 후 재확인

## 독립 QA 요청

- Review 5개 상태가 동시에 겹치지 않고 재시도가 해당 실패 동작만 수행하는지 확인
- route·저장 record UUID와 전달·영속 STEP snapshot의 1:1 일치 확인
- generation 실패 뒤 lifecycle·잠금·원본 STEP, 임시/최종 저장 실패 뒤 편집값 비교
- 임시 저장 뒤 추가 편집을 폐기하면 마지막 성공 snapshot으로 복원되는지 확인
- STEP 추가·삭제·Undo·순서 이동·빈 STEP 제외·재번호와 검증 오류 확인
- 완료 수정에서 AI 호출 0회, 저장 성공 후 Detail 최신 값, 실패 후 원본 보존 확인
- Detail 메뉴 외 완료 삭제 진입 부재, 명시적 영구 삭제 확인·실패 보존·재시도 확인
- 390×844 Light와 375×667 Dark에서 키보드·하단 저장 경로·Dynamic Type 기본 회귀

## 제외 범위와 잔여 위험

- 실제 Backend AI·네트워크 job 복구는 `T-20260729-005` 범위입니다.
- Audio Guide·핸즈프리 UI는 `T-20260805-006`, 전역 장애는 T-007 범위입니다.
- Accessibility 3·VoiceOver 전체 행렬과 작은 화면 통합 시각 회귀는 T-008에서 수행합니다.
