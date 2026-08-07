# T-20260805-007 구현 보고서

작성일: 2026-08-07  
작성 Role: iOS Agent / Execution Role  
기준: `origin/develop@a173953`

## 구현 결과

- Home 상단에 44pt 앱 정보 진입 버튼과 `AppRoute.appInfo`를 연결했다.
- Overview, Data Retention, Contact Consent/Ready, Mail Unavailable와 개인정보처리방침·
  이용약관의 Loading/URL Unconfigured/Open Error를 합쳐 App Info 11개 상태를 구현했다.
- 문의에는 앱 버전만 기본 제공하며 진단 정보는 사용자가 선택한 경우만 포함한다고 명시했다.
- 실제 문의 이메일과 법적 URL은 nil placeholder로 유지하고 임의 운영 값을 만들지 않았다.
- 기존 STT·AI 생성·로컬 저장 실패의 데이터 보존과 실패 동작만 재시도하는 경계를 유지했다.

## 변경 파일

- `apps/ios/CookLog/App/AppRoute.swift`
- `apps/ios/CookLog/App/CookLogApp.swift`
- `apps/ios/CookLog/Features/Home/HomeView.swift`
- `apps/ios/CookLogTests/CookLogTests.swift`
- iOS 상태·개발 계획·변경 기록과 Task 파일

## 자체 검증

- iPhone 15 iOS 17.2 Debug build: `BUILD SUCCEEDED`
- 표준 단일-worker 전체 XCTest: 79/79 통과
- App Info placeholder·11개 상태 계약 신규 테스트 2개 통과
- `git diff --check`: 통과
- xcresult: `/var/folders/2_/vyvgp5h54fg0vy8j133f4mph0000gn/T/CookLog-XCTest/20260807-141813-59869/CookLogTests.xcresult`

## 남은 리스크

- 실제 문의 주소, 개인정보처리방침·이용약관의 문안과 공개 URL은 출시 통합 전 확정이 필요하다.
- 실제 네트워크 감시·Apple STT·Backend AI·서비스 상태 페이지는 후속 Task 범위다.
- 390×844·375×667 Light/Dark 시각·스크롤 도달은 독립 iOS QA에서 검증해야 한다.

## 재작업 결과 — WP-R1~R3

- `WP-R1`: `HomeNetworkErrorState`를 주입 가능하게 추가했다. 영향 문구는 진행 기록·완료
  레시피·검색·버튼 Audio Guide 유지를 명시하고 `연결 다시 확인`은 별도 callback만 호출해
  실패했던 온라인 행동을 자동 재실행하지 않는다.
- `WP-R2`: `SupportMailDraft`가 subject/body/URL을 구성한다. 앱 버전은 기본 포함하고,
  OS 버전·오류 화면/시각·비콘텐츠 진단 범주는 opt-in 때만 포함한다. 음성·STT 본문·
  레시피 내용·검색어는 자동 첨부하지 않는다.
- `WP-R3`: App Info Overview와 Home Network Error를 390×844·375×667 Light/Dark에서
  확인했다. 화면은 ScrollView이며 관련 버튼은 최소 44pt다.

### 재작업 검증

- iPhone 15 iOS 17.2 Debug build: `BUILD SUCCEEDED`
- 표준 단일-worker 전체 XCTest: 82/82 통과
- `git diff --check`: 통과
- xcresult: `/var/folders/2_/vyvgp5h54fg0vy8j133f4mph0000gn/T/CookLog-XCTest/20260807-160355-59604/CookLogTests.xcresult`
- App Info 캡처:
  - `/private/tmp/T-20260805-007-app-info-390x844-light.png`
  - `/private/tmp/T-20260805-007-app-info-390x844-dark.png`
  - `/private/tmp/T-20260805-007-app-info-375x667-light.png`
  - `/private/tmp/T-20260805-007-app-info-375x667-dark.png`
- Home Network Error 캡처:
  - `/private/tmp/T-20260805-007-network-390x844-light-clean.png`
  - `/private/tmp/T-20260805-007-network-390x844-dark-clean.png`
  - `/private/tmp/T-20260805-007-network-375x667-light.png`
  - `/private/tmp/T-20260805-007-network-375x667-dark.png`

### 재작업 후 남은 리스크

- 실제 문의 주소·법적 문안·공개 URL은 출시 통합 전 확정이 필요하다.
- 실제 네트워크 감시·Apple STT·Backend AI는 후속 Task 범위다.
