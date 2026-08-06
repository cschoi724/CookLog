# T-20260805-004 iOS Cooking Log·STEP Preview 독립 QA 보고서

작성일: 2026-08-06
작성 Role: iOS QA Agent / Verification Role
검증 대상: `d8af7875e3116cb46b3d4d35d3f52bba44f9df6d`
기준 상태: `origin/develop@69cbf81df0d215b08b6feaf657ba3a4b0e8ce4b5`
판정: `FAIL — rework_requested`

## 1. 검증 범위

- `LOG-EMPTY`, `LOG-RECORDING`, `LOG-PROCESSING`, `LOG-STEP-ADDED`, `LOG-ERROR`
- 첫·반복 기록의 pending STEP 번호와 같은 `RecipeRecord.id` 자동 저장
- 저장·음성 처리 실패 시 실패한 pending만 제거하고 기존 STEP·draft 보존
- STEP 삭제, order 정규화, 5초 Undo와 저장 실패 원본 보존
- 누적 `[StepPreview]` snapshot의 AI Review route 전달
- Cooking Log 신규 화면의 확정 색상 토큰 계약
- 전체 XCTest와 변경 경로 회귀

## 2. 환경과 방법

- 독립 QA worktree: `/private/tmp/cooklog-qa-T-20260805-004`
- Xcode 26.6, iPhone 15 Simulator iOS 17.2
- iPhone SE (3rd generation) Simulator iOS 17.2 설치·실행
- 구현 diff와 `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md`,
  `design/figma-build/manifest.json`, `apps/ios/docs/SERVICES.md` 독립 대조
- 구현 상태 그대로 전체 XCTest 실행
- 변경 파일과 Task `allowed_paths`, `git diff --check` 확인

## 3. 통과 항목

- 전체 XCTest `62/62`, 실패·skip 0
  - xcresult:
    `/private/tmp/cooklog-derived-t004-qa/Logs/Test/Test-CookLog-2026.08.06_10-19-45-+0900.xcresult`
- `idle -> recording -> processing -> idle|error`와 중복 기록 차단: 통과
- 첫 STEP 1, 반복 기록의 다음 pending 번호와 성공 후 order 증가: 통과
- 같은 record UUID에 저장하고 저장 성공 후에만 화면 session을 교체하는 commit 경계: 통과
- 인식·저장 실패 시 pending만 제거하고 기존 완료 STEP·저장 draft 보존: 통과
- 삭제 성공 후 order 정규화, 같은 STEP ID의 원위치 Undo와 실패 시 원본 보존: 통과
- STEP이 있을 때 누적 배열과 AI Review callback snapshot 일치: 통과
- Mock Speech 사용과 실제 Apple STT 후속 Task 분리: 통과
- 구현 변경 파일 16개가 Task `allowed_paths` 안에 있고 구현 diff의
  `git diff --check`가 통과함

## 4. 결함

### QA-MEDIUM-805004-001 — Cooking Log 고유 배경·accent·status 슬롯이 시스템 색상으로 대체됨

- 위치:
  - `CookingLogView.recordingPanel`
  - `CookingLogView.messageSection`
  - `StepPreviewRowView`, `PendingStepPreviewRowView`
- 기준:
  - `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md` 5.1은 화면·카드 배경의
    `secondarySystemGroupedBackground` 사용과 CookLog accent·success·error 슬롯의
    system blue/green/red 대체를 명시적으로 금지한다.
  - 같은 문서 9.3은 이 슬롯의 system semantic color 사용을 불합격으로 규정하고,
    9.4는 명확한 토큰 편차를 Medium·원칙상 불합격으로 분류한다.
  - Manifest 값은 `bg/elevated` `#FFFFFF/#302C35`, accent
    `#C93610/#FF9A7A`, success `#176B4A/#7EE0B4`, error
    `#B42318/#FF8C84`다.
- 실제:
  - 기록 패널과 완료·pending STEP 카드가
    `Color(.secondarySystemGroupedBackground)`를 사용한다.
  - STEP 번호는 `Color.accentColor`, 성공 배너는 `.green`, 오류 배너와 삭제 아이콘은
    `.red`를 사용한다.
  - 최상위 `List(.insetGrouped)`에도 CookLog `bg/base` 배경 토큰을 지정하지 않았다.
- 영향: Light/Dark에서 OS별 시스템 팔레트가 확정 CookLog 팔레트를 대체해 Cooking Log
  핵심 상태의 화면 정체성과 상태 의미 색이 Source of Truth와 달라진다.
- 수용 기준:
  - 확정 Light/Dark 값을 가진 이름 있는 Color Asset 또는 프로젝트 토큰을 추가·재사용한다.
  - 화면은 `bg/base`, 보조 영역은 `bg/subtle`, 카드·기록 패널은 `bg/elevated`, 주요
    CTA·STEP 표시는 accent, 성공·오류 배너는 각 status 토큰으로 연결한다.
  - `.primary`, `.secondary`, separator와 네이티브 컨트롤 내부 렌더링만 허용된 system
    semantic color로 유지한다.
  - Light/Dark에서 `LOG-STEP-ADDED`, `LOG-ERROR`를 다시 캡처하고 토큰 값 대조 결과를
    자체 검증에 포함한다.

## 5. 비차단 관찰

- iPhone SE 설치·실행은 성공했다. 캡처에서 확인되는 앱 viewport 레터박스는 T-003부터
  기록된 기존 launch configuration 기준선이며 이번 구현 diff 밖이다. 계획된
  `T-20260805-008`에서 실제 full-screen viewport와 Accessibility 3·VoiceOver 행렬을
  통합 검증한다.
- 실제 마이크·Apple 기기 내 STT, AI Review 내부 동작과 앱 전역 권한·오프라인 상태는
  각각 후속 T-20260729-004, T-005, T-007 범위로 유지한다.

## 6. 판정과 인계

핵심 상태 전이, 동일 UUID 자동 저장, 실패 시 데이터 보존, 삭제·Undo와 전체 XCTest는
통과했다. 그러나 신규 Cooking Log의 배경·accent·success·error 슬롯이 확정 계약에서
명시적으로 금지한 시스템 색상으로 구현됐고 승인 예외가 없다.

따라서 `QA-MEDIUM-805004-001`을 차단 결함으로 확정하고 Task를
`rework_requested`로 iOS Agent / Execution Role에 반환한다. 재작업은 색상 토큰 적용과
Light/Dark 증빙에 한정하며 통과한 상태·저장 로직을 변경하지 않는다. 수정 후 전체 XCTest와
`LOG-STEP-ADDED`, `LOG-ERROR` 화면을 포함해 독립 재검증을 다시 요청해야 한다.
