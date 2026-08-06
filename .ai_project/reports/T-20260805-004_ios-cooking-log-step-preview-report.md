# T-20260805-004 iOS Cooking Log·STEP Preview 구현 보고서

작성일: 2026-08-06
작성 Role: iOS Agent / Execution Role
상태: `verification_ready`

## 결과

Mock Speech Service 기반 10초 기록을 `idle -> recording -> processing -> idle|error`로
정리하고 첫·반복 기록, 정확한 pending STEP, 같은 `RecipeRecord.id` 자동 저장을
구현했습니다. STEP 삭제·되돌리기와 저장 실패는 저장 성공을 화면 상태의 commit 지점으로
사용하므로 기존 완료 STEP과 draft를 변경하지 않습니다.

## 구현 범위

- `LOG-EMPTY`, `LOG-RECORDING`, `LOG-PROCESSING`, `LOG-STEP-ADDED`, `LOG-ERROR`
- 첫·반복 기록의 남은 시간, 중복 기록 비활성, 다음 pending STEP 번호
- `SaveStepPreviewDraftUseCase`의 `AppEnvironment` 생성·`CookingLogViewModel` 주입
- 같은 record ID에 STEP 추가·삭제·되돌리기 자동 저장
- 왼쪽 swipe와 44pt 삭제 버튼, 제한 시간 Undo, 원래 위치·ID 복원
- 삭제 후 order 연속 정규화와 STT 원문 보존
- 권한·음성 처리·자동 저장 오류별 안내와 복구 행동
- 실패한 pending 제거, 기존 완료 STEP·저장 draft 보존
- 누적 `[StepPreview]` 동일 snapshot의 AI Review route callback 전달
- 시스템 `List`, `Button`, `ProgressView`, semantic color와 Dynamic Type 스타일

## 승인 범위 보완

초기 allowed path에는 실제 자동 저장 DI 조립 파일이 빠져 있었습니다. Product Owner가
2026-08-06 `apps/ios/CookLog/App/AppEnvironment.swift`와 `CookLogApp.swift`의 최소 변경을
승인했고, Task allowed path와 승인 이력에 기록했습니다. 변경은
`SaveStepPreviewDraftUseCase` 생성·주입으로 제한했습니다.

## 자체 검증

- Cooking Log ViewModel 집중 XCTest 10개: 성공
- STEP 추가·삭제·복원 UseCase XCTest 4개: 성공
- 전체 XCTest 62/62: 성공
- `xcodebuild ... build -quiet`: 성공
- 자동 검증 destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`
- Simulator 설치·실행: 성공
- iPhone SE (3rd generation) iOS 17.2, 375×667, Dark 실제 상호작용:
  - Home → `LOG-EMPTY`
  - 첫 `LOG-RECORDING` → STEP 1 자동 저장
  - 반복 `LOG-RECORDING`에서 기존 STEP 유지 → STEP 2 자동 저장
  - `10초 더 기록`과 `자동 저장됨` 상태 확인
- `git diff --check`: 성공

## 독립 QA 요청

- 첫·반복 Recording과 Processing의 기존 완료 STEP·다음 pending 번호
- 성공 후에만 STEP 노출·동일 record ID SwiftData 저장·재실행 복구
- 음성 처리·저장 실패 시 pending만 제거하고 기존 STEP·draft 보존
- swipe와 명시적 삭제 버튼, 삭제 order 정규화, 제한 시간 Undo 원위치 복원
- Undo 저장 실패와 삭제 저장 실패의 화면·저장 원본 보존
- STEP이 있을 때 오류 상태의 `AI 정리하기` 활성과 동일 배열 snapshot 전달
- 390×844 Light 기본 크기와 375×667 Dark·Dynamic Type 기본 회귀

## 제외 범위와 후속 위험

- 실제 마이크 녹음·Apple 기기 내 STT는 `T-20260729-004` 범위입니다.
- AI 생성·Review 내부 처리와 snapshot 잠금 UI는 `T-20260805-005` 범위입니다.
- 앱 전역 권한 설정 이동·오프라인·서비스 장애는 `T-20260805-007` 범위입니다.
- 전체 접근성·작은 화면·다크 모드 visual regression은 `T-20260805-008`에서 통합합니다.
