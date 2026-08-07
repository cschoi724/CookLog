# T-20260805-006 iOS Audio Guide·핸즈프리 UI 독립 QA 보고서

요청일: 2026-08-07
검증일: 2026-08-07
검증 Role: iOS QA Agent / Verification Role
검증 기준 commit: `8d0321e0c8e523e8ee3626253c63a2b116fccbc1`
QA commit: `fb74ef4`
최종 판정: **PASS_WITH_RISK — 재작업 독립 재검증 통과**

## 검증 환경과 통과 범위

- iPhone 15 Simulator, iOS 17.2, Light/Dark
- 독립 XCTest: **77/77 passed**, failure·skip 0
- Player loading/error/not-found/no-steps와 재생 control 경계 통과
- 진입 직후 STEP 1·Paused·핸즈프리 Off와 자동 play/handsfree 없음 통과
- `AudioGuideAction` 7개와 버튼·테스트 입력의 공통 `send(_:)` 경계 통과
- 첫/마지막 단계, 불확실 입력, 재료 안내와 interruption·background·이탈 보존 통과

## QA-HIGH-806006-001

- 심각도: **High**
- 재현: 3-step Audio Guide를 375×667 Light 또는 Dark로 표시
- 기대: `재료 알려줘` CTA와 안내 문구가 하단 control bar와 겹치지 않고 스크롤로 완전히
  도달 가능해야 한다.
- 실제: 고정 control bar가 CTA 하단을 덮어 라벨과 버튼 일부가 잘린다.
- 코드 근거: `AudioPlayerView.swift`의 ScrollView에 하단 inset이 없고 같은 VStack의
  바깥에 control bar가 고정돼 있다.
- 증빙: `/private/tmp/T006Attachments3/61F4D468-5886-44B9-9ED7-931313A7760F.png`,
  `/private/tmp/T006Attachments3/71C3BF6B-5FC5-47CD-A706-E095B0CA0A4A.png`

## 재검증 조건

- 하단 safe-area/content inset을 적용해 CTA와 안내 문구의 겹침·잘림·도달 불가 0건
- 44×44pt 터치 영역 유지
- 전체 XCTest 77개 이상과 build 통과
- 390×844·375×667 Light/Dark 4종 재촬영
- 기존 Player 상태·action reducer·중단/이탈 보존 무회귀

## 재작업 재검증 요청

- 요청일: 2026-08-07
- 상태: `verification_ready`
- 변경: ScrollView의 고정 control bar를 `safeAreaInset(edge: .bottom)`으로 배치
- 개발 자체 검증: 전체 XCTest 77/77, iOS Simulator Debug build 성공
- 재촬영: 390×844·375×667 Light/Dark `4/4`
  - `/private/tmp/T006ReworkVisual4.xcresult`
  - `/private/tmp/T006ReworkAttachments4/`
- 자체 관찰: 네 조합 모두 `재료 알려줘` CTA와 안내 문구가 control bar 위에 완전히 노출됨
- 요청: 기존 FAIL 판정과 `QA-HIGH-806006-001` 이력을 보존하고 동일 결함의 해소 여부를
  독립 판정한다.

## 독립 재검증 결과

- 검증 기준 commit: `64e6d36ff4e15e69a658677468ea27c4f4a01c28`
- public source: `origin/develop@6eab9ec`
- 독립 전체 XCTest: **77/77 passed**, failure·skip 0
  - log: `/var/folders/2_/vyvgp5h54fg0vy8j133f4mph0000gn/T/CookLog-XCTest/20260807-125527-58856/xcodebuild.log`
  - xcresult: `/var/folders/2_/vyvgp5h54fg0vy8j133f4mph0000gn/T/CookLog-XCTest/20260807-125527-58856/CookLogTests.xcresult`
- iPhone 15 iOS 17.2 Debug build: 성공
- 시각 matrix 집중 재실행: **1/1 passed**, attachment 4/4 정상
  - xcresult: `/private/tmp/T006QAVisualRerun.xcresult`
  - attachments: `/private/tmp/T006QAVisualRerunAttachments/`
- `375×667` Light/Dark와 `390×844` Light/Dark 모두에서 `재료 알려줘` CTA와 안내 문구가
  control bar 위까지 완전히 도달하며 겹침·잘림이 없다.
- 기존 Player 5개 상태, 7개 공통 action, 첫/마지막 경계, 불확실 입력, 재료 안내,
  interruption·background·화면 이탈 계약은 전체 회귀에서 통과했다.
- `QA-HIGH-806006-001`: **해소**

## 잔여 위험

- 전체 XCTest 첫 실행의 `375×667 Dark` attachment 1장이 단색 배경으로 생성됐으나 같은
  고정 commit의 시각 matrix 집중 재실행에서는 4/4 정상 렌더링됐다. 제품 UI 결함은
  재현되지 않았으며 XCTest 기반 SwiftUI attachment 생성의 일시적 타이밍 위험으로 분류한다.
- T-008 통합 Visual QA에서 동일 viewport의 반복 렌더링 안정성을 다시 확인한다.

## 최종 판정

`QA-HIGH-806006-001`은 해소됐고 기능·빌드·전체 회귀가 통과했다. 시각 attachment 생성의
일시적 비결정성을 잔여 위험으로 남겨 **PASS_WITH_RISK**로 판정하며 Development Lead
Agent / Completion Role에 완료 검토를 인계한다.
