# T-20260805-007 iOS 앱 정보·권한·오프라인·서비스 장애 독립 QA 보고서

요청일: 2026-08-07  
검증일: 2026-08-07  
검증 Role: iOS QA Agent / Verification Role  
검증 기준: `origin/develop@a173953` + 구현 worktree 변경  
최종 판정: **PASS_WITH_RISK — 재작업 독립 재검증 통과**

## 검증 환경과 통과 범위

- iPhone 15 Simulator, iOS 17.2
- 독립 전체 XCTest: **79/79 passed**, failure·skip 0
  - log: `/var/folders/2_/vyvgp5h54fg0vy8j133f4mph0000gn/T/CookLog-XCTest/20260807-143212-82462/xcodebuild.log`
  - xcresult: `/var/folders/2_/vyvgp5h54fg0vy8j133f4mph0000gn/T/CookLog-XCTest/20260807-143212-82462/CookLogTests.xcresult`
- iPhone 15 iOS 17.2 Debug build: 성공
- App Info route와 11개 상태 enum, 운영 URL·문의 주소 nil placeholder: 확인
- 데이터 보관 안내와 사용자 콘텐츠 자동 첨부 금지 문구: 확인
- 기존 STT·AI 생성·로컬 저장 실패의 데이터 보존 회귀 테스트: 통과
- `git diff --check`: 통과

## QA-HIGH-807007-001 — Home Network Error 상태 누락

- 기대: 공식 Prototype·Manifest의 `Home / Network Error` 상태가 인터넷 연결 오류의 영향
  범위를 설명하고, 진행·완료 레시피·검색·버튼 Audio Guide를 유지하며 `연결 다시 확인`이
  실패했던 온라인 행동을 자동 재실행하지 않아야 한다.
- 실제: iOS Home에는 로컬 repository의 `loadErrorMessage`를 표시하는 일반 목록 오류만
  존재한다. 인터넷·오프라인 영향 범주, `연결 다시 확인` 상태와 별도 전이 계약이 없다.
- 영향: 필수 서비스 장애 상태와 온라인 장애 중 로컬 기능 유지 성공 기준을 검증할 수 없다.
- 요구 재작업: 실제 네트워크 감시는 제외하되 mock/placeholder로 주입 가능한 Network
  Error 상태와 영향 안내·명시적 연결 재확인·자동 재실행 금지 테스트를 구현한다.

## QA-HIGH-807007-002 — 문의 동의 결과가 실제 메일 초안에 반영되지 않음

- 기대: 앱 버전은 기본 포함하고, 사용자가 선택했을 때만 OS 버전·오류 화면/시각·
  비콘텐츠 진단 범주를 문의 초안에 포함하며 사용자 콘텐츠는 자동 첨부하지 않아야 한다.
- 실제: `contactReady(includeDiagnostics:)`는 선택 결과가 포함될 것처럼 안내하지만
  `openSupportEmail()`은 `mailto:<address>?subject=CookLog%20문의`만 생성한다. 앱 버전과
  `includeDiagnostics` 값이 URL body 또는 별도 초안 모델에 전달되지 않는다.
- 영향: 표시한 동의 결과와 실제 외부 전달 데이터가 불일치한다.
- 요구 재작업: 메일 초안 모델/URL 구성 경계를 분리하고 앱 버전 기본값, 진단 opt-in,
  콘텐츠 비포함을 각각 검증한다. 운영 이메일 주소는 placeholder로 유지한다.

## QA-MEDIUM-807007-003 — 작은 화면 시각 검증 증거 부재

- Task는 390×844·375×667 Light/Dark의 App Info·실패 상태, 44pt와 스크롤 도달을
  요구하지만 구현 테스트는 placeholder와 상태 개수만 확인한다.
- HIGH 재작업 후 핵심 App Info 상태와 Home Network Error의 viewport matrix 증거를 남긴다.

## 최종 판정

빌드와 79개 회귀는 통과했으나 필수 Home Network Error 상태가 누락됐고 문의 동의 결과가
실제 메일 초안 경계에 반영되지 않는다. **FAIL**로 판정하고 Development Lead Agent에
재작업 범위 조율을 요청한다.

## 재작업 독립 재검증

- 재검증 기준: `origin/develop@596d779` + 재작업 worktree 변경
- 독립 전체 XCTest: **82/82 passed**, failure·skip 0
  - log: `/var/folders/2_/vyvgp5h54fg0vy8j133f4mph0000gn/T/CookLog-XCTest/20260807-161213-67301/xcodebuild.log`
  - xcresult: `/var/folders/2_/vyvgp5h54fg0vy8j133f4mph0000gn/T/CookLog-XCTest/20260807-161213-67301/CookLogTests.xcresult`
- iPhone 15 iOS 17.2 Debug build: 성공
- `git diff --check`: 통과

### 결함 해소

- `QA-HIGH-807007-001`: **해소**. `HomeNetworkErrorState`가 영향 범위와 명시적
  `연결 다시 확인`을 제공한다. callback은 네트워크 재확인만 전달하고 실패했던 온라인
  action을 자동 호출하지 않으며 관련 테스트가 통과했다.
- `QA-HIGH-807007-002`: **해소**. `SupportMailDraft`가 앱 버전을 기본 포함하고 진단
  opt-in일 때만 OS 버전·오류 화면/시각·비콘텐츠 진단 범주를 body에 추가한다. 사용자
  콘텐츠 비포함과 mailto subject/body 구성 테스트가 통과했다.
- `QA-MEDIUM-807007-003`: **해소**. App Info와 Home Network Error를 390×844·375×667
  Light/Dark 8개 조합으로 확인했다. 텍스트·CTA clipping이 없고 작은 화면의 하단 콘텐츠는
  ScrollView로 도달 가능하며 핵심 버튼은 44pt 이상이다.

### 잔여 위험

- 실제 문의 주소·개인정보처리방침·이용약관 문안과 공개 URL은 출시 통합 전 확정해야 한다.
- 실제 네트워크 감시·Apple STT·Backend AI 연결은 후속 Task 범위다.

## 재검증 최종 판정

기존 HIGH 2건과 MEDIUM 1건이 모두 해소됐고 전체 회귀와 build가 통과했다. 승인된 후속
운영 값·실서비스 연결 위험을 남겨 **PASS_WITH_RISK**로 판정하며 Development Lead Agent /
Completion Role에 완료 검토를 인계한다.
