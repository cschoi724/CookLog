# T-20260805-006 iOS Audio Guide·핸즈프리 UI 독립 QA 보고서

요청일: 2026-08-07
검증일: 2026-08-07
검증 Role: iOS QA Agent / Verification Role
검증 기준 commit: `8d0321e0c8e523e8ee3626253c63a2b116fccbc1`
QA worktree: `/private/tmp/cooklog-qa-T-20260805-006-independent-verification`
최종 판정: **FAIL — `rework_requested`**

## 검증 범위와 환경

- 프로젝트: `apps/ios/CookLog.xcodeproj`, scheme `CookLog`
- 실행 명령: `xcodebuild -project apps/ios/CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' -derivedDataPath /private/tmp/cooklog-derived-t006-qa test`
- 기기/OS: iPhone 15 Simulator, iOS 17.2, Light/Dark
- 독립 XCTest 결과: **77/77 passed, failure 0, skip 0**
- 결과 번들: `/tmp/cooklog-derived-t006-qa/Logs/Test/Test-CookLog-2026.08.07_11-08-03-+0900.xcresult`
- 구현 시각 증빙 검토: `/private/tmp/T006Attachments3/manifest.json` 및 4개 PNG

## 통과 확인

- Player loading/error/not-found/no-steps와 재생 상태의 control 노출 경계
- 진입 직후 STEP 1, Paused, 핸즈프리 Off, 자동 play/handsfree 없음
- `AudioGuideAction` 7개와 버튼·테스트 입력의 공통 `send(_:)` 경계
- 첫/마지막 단계 경계, 불확실 입력, 핸즈프리 종료의 index·재생 상태 보존
- 재료 안내의 현재 step 불변 및 종료 후 Paused
- interruption·background/lock·화면 이탈 시 수동 재개 요구, 자동 handsfree 재활성화 없음
- 44pt 컨트롤과 Light/Dark 렌더링 범위

## 결함

### QA-HIGH-806006-001 — 375×667에서 `재료 알려줘` CTA가 하단 고정 바에 가려짐

- 심각도: **High** (필수 CTA 겹침·도달 불가; acceptance 9.3/9.4)
- 재현: Audio Guide의 3-step recipe Player를 iPhone 15 Simulator에서 375×667로 열고 Light 또는 Dark appearance로 확인
- 기대: `재료 알려줘` 버튼 전체와 라벨이 스크롤로 도달 가능하고 하단 control bar와 겹치지 않아야 함
- 실제: 고정된 AudioPlayer control bar가 CTA 하단을 덮어 라벨/버튼 일부가 잘림. Light 증빙은 `61F4D468-5886-44B9-9ED7-931313A7760F.png`, Dark 증빙은 `71C3BF6B-5FC5-47CD-A706-E095B0CA0A4A.png` (각 1125×2001 px, 375×667 pt @3)
- 근거 코드: `AudioPlayerView.swift:14-31`의 ScrollView에 하단 inset이 없고, `:33-40`에서 같은 VStack 외부에 control bar를 고정한다. CTA는 `:146-153`에서 ScrollView 콘텐츠 끝에 배치된다.
- 기준: `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md:299-310`의 “텍스트·CTA 도달: 잘림·겹침·도달 불가 0건”, `:317-319`의 High/불합격 기준
- 수정 제안: control bar 높이와 safe-area를 반영한 `safeAreaInset(edge: .bottom)` 또는 동등한 하단 content inset/padding을 적용해 CTA와 안내 문구가 control bar 위로 완전히 스크롤되도록 한다. 44×44pt 터치 영역은 유지한다.

## 판정 및 재검증 조건

기능 테스트는 통과했으나 필수 CTA가 작은 화면에서 가려지는 High 결함이 있어 `rework_requested`로 판정한다. iOS Agent가 하단 inset을 수정한 뒤 동일 commit 기준으로 77개 회귀 테스트와 390×844·375×667 Light/Dark 4종 캡처를 다시 제출해야 한다. 375×667에서 CTA 전체가 보이고 control bar와 겹치지 않을 때 재검증한다.
