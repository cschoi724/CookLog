# T-20260805-008 iOS 접근성·Visual Regression 실행 보고서

## 1. 실행 기준

- 역할: iOS Agent / Execution Role
- 기준 ref/SHA: `origin/develop@099047e`
- 검증 환경: Xcode 26.6 (`17F113`), iOS 17.2 Simulator
- Source of Truth:
  - `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`
  - `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md`
  - `apps/ios/docs/TESTING.md`
  - `apps/ios/docs/MANUAL_QA_CHECKLIST.md`

## 2. 구현·보강 내용

- `VisualRegression/visual-regression-manifest.json`
  - 통합 상태를 Home 9, Library 5, Cooking Log 14, AI Review 12,
    Recipe Detail 7, Audio Player 24, App Info 11로 고정했다.
  - Core Loop 23개 상태 ID를 Home 4, Cooking Log 5, AI Review 5,
    Recipe Detail 4, Audio Player 5로 중복 없이 고정했다.
  - 390×844·375×667, Light/Dark, 기본/Accessibility 3, 44pt와 위험 상태
    조합을 독립 QA 실행 계약으로 기록했다.
- `Scripts/validate-visual-regression-contract.js`
  - 통합 82개·Core Loop 23개 개수와 prefix, viewport, appearance,
    content size, 44pt, 독립 QA 요구를 자동 검증한다.
  - Home Network Error, 녹음 타이머, STEP 편집, Recipe 메뉴, Player control,
    App Info의 접근성 이름·최소 높이 계약을 소스 단위로 확인한다.
  - 주요 화면 파일의 고정 system font size 사용을 거부한다.
- `VisualRegression/visual-regression-results.json`
  - 실제 Current 표본, Reference Source of Truth, 구조적 Diff 방식과
    `native-rendering` 허용 편차를 기계 판독 가능한 형식으로 기록했다.
- `VisualRegression/Evidence/current/`
  - 격리된 iPhone 14(390×844)와 iPhone SE 3세대(375×667)에서
    Accessibility 3 표본 6장을 저장소 증거로 생성했다.

## 3. 개발자 검증 결과

| 항목 | 결과 | 증빙 |
|---|---|---|
| Debug build | PASS | iPhone 15 / iOS 17.2, `xcodebuild ... build` |
| 전체 XCTest | PASS, 82/82 | `CookLog-XCTest/20260810-092833-42359/CookLogTests.xcresult` |
| 회귀 계약 validator | PASS | `visual regression contract valid: 82 integrated / 23 core states` |
| JSON parse | PASS | manifest/results `jq empty` |
| 44pt·접근성 이름 정적 감사 | PASS | validator source assertions |

전체 XCTest artifact:

`/var/folders/2_/vyvgp5h54fg0vy8j133f4mph0000gn/T/CookLog-XCTest/20260810-092833-42359`

첫 XCTest 시도는 sandbox의 CoreSimulatorService 연결 제한으로 exit 70이었고, 동일
표준 스크립트를 Simulator 접근 권한으로 재실행해 82/82를 통과했다. 이는 앱 테스트
실패로 분류하지 않는다.

## 4. 실제 viewport·Dynamic Type 표본

아래 Current는 `Accessibility 3`에 해당하는
`accessibility-extra-extra-extra-large`로 실제 Simulator에서 확인했다.

| 상태 | 390×844 | 375×667 | 결과 |
|---|---|---|---|
| App Info / Light | `VisualRegression/Evidence/current/app-info-390x844-light-a3.png` | `VisualRegression/Evidence/current/app-info-375x667-light-a3.png` | 스크롤로 필수 목적지 도달 |
| App Info / Dark | `VisualRegression/Evidence/current/app-info-390x844-dark-a3.png` | `VisualRegression/Evidence/current/app-info-375x667-dark-a3.png` | 텍스트 재배치·테마 유지 |
| Home Network Error / Dark | `VisualRegression/Evidence/current/home-network-error-390x844-dark-a3.png` | `VisualRegression/Evidence/current/home-network-error-375x667-dark-a3.png` | 원인·로컬 기능 보존·재확인 CTA 유지 |

접근성 크기에서 긴 문구가 여러 줄로 재배치되고 ScrollView로 하단 콘텐츠와 CTA에
도달한다. 캡처는 화면 상단 기준이며, 잘림이 아니라 viewport 아래 스크롤 콘텐츠임을
독립 QA에서 실제 조작으로 재확인해야 한다.

## 5. Current / Reference / Diff

- Reference: `design/prototype/`, `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`,
  `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md`
- Current: 저장소의 6개 Simulator 캡처와 선행 T-003~007 보고서
- Diff: repository에 동일 scale의 pixel baseline asset이 없어 구조·정보 계층·CTA·
  토큰·접근성 기준의 수동 비교로 수행했다.
- 허용 편차: SwiftUI navigation typography, system back label, spinner·glyph의 OS별 차이는
  `native-rendering`으로 분류한다. 필수 콘텐츠·CTA·44pt·데이터 보존 편차는 허용하지 않는다.

## 6. 미해소 위험과 독립 QA 필수 확인

1. **High 후보 — 23개 전체 이미지 matrix 미완료**
   - 23개 ID와 fixture 조건은 manifest로 고정했고 기능 상태는 82/82 XCTest로 회귀했지만,
     동일 390×844·Light·기본 글자 크기의 23장을 모두 새로 캡처하지 않았다.
   - 독립 QA는 23개 Current와 위험 조합 추가 캡처를 실제 생성하고, 누락 시 `FAIL`로
     분류해야 한다.
2. **High 후보 — pixel Reference/Diff 부재**
   - repository에 SwiftUI와 동일 fixture·scale의 baseline 이미지가 없어 자동 pixel diff를
     수행하지 못했다. 독립 QA는 Prototype reference와 동일 scale 증거를 구성하거나,
     구조적 비교만 허용할지 Design Lead/Product Owner 승인 경계를 확인해야 한다.
3. **High 후보 — VoiceOver 런타임 순서**
   - label·trait에 영향을 주는 소스 계약은 감사했으나, VoiceOver를 실제 켠 상태의 focus
     이동 순서와 상태 알림을 23개 전체에서 기계 추출하지 않았다.
4. 실제 Apple STT, Backend AI, TTS 엔진, 운영 문의·법적 값은 Task 승인 범위 밖이다.

개발자 표본에서는 필수 콘텐츠나 CTA가 잘리는 Blocker를 발견하지 않았다. 다만 위 세
항목은 최종 합격 증거가 아니므로 iOS QA Agent의 독립 판정 전에는 T-008 또는 상위
`T-20260728-003`을 완료 처리할 수 없다.

## 7. 판정

- Execution 결과: `verification_ready` — 회귀 계약·기능 테스트·위험 viewport 표본 준비
- 완료 판정: 보류
- 다음 역할: iOS QA Agent / Verification Role
- QA 권고: 미해소 증거 3건을 우선 반례로 검증하고 `PASS`, `PASS_WITH_RISK`, `FAIL`,
  `BLOCKED` 중 하나로 독립 판정한다.
