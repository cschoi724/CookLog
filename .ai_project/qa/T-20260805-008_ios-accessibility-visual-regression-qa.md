# T-20260805-008 iOS 독립 검증 보고서

## 1. 판정

- 최종 판정: `FAIL`
- 검증 역할: iOS QA Agent / Verification Role
- 검증 대상: `task/T-20260805-008-ios-accessibility-regression@f165c6b`
- 공용 기준: `origin/develop@099047e`
- 사유: 기능 XCTest 82/82는 통과했지만, Visual QA와 VoiceOver의 필수 합격 증거가
  누락되어 High 결함 4건을 확인했다.

## 2. 독립 실행 결과

| 항목 | 결과 | 증거 |
|---|---|---|
| 전체 XCTest | PASS, 82/82 | `/private/tmp/CookLog-QA-T008/20260810-095418-32207/CookLogTests.xcresult` |
| XCTest 로그 | PASS, 실패 0 | `/private/tmp/CookLog-QA-T008/20260810-095418-32207/xcodebuild.log` |
| 회귀 계약 validator | PASS | `node apps/ios/Scripts/validate-visual-regression-contract.js` |
| Core Loop 23개 상태 ID 계약 | PASS, 23/23 | `visual-regression-manifest.json` |
| 23개 기본 Current | FAIL, 0/23 | required ID/fixture 기준 Current 없음 |
| 동일 fixture·scale Reference/Diff | FAIL, 0/23 | Reference/Diff 이미지 및 비교 산출물 없음 |
| 위험 조합 추가 캡처 | FAIL | App Info와 Home Network Error 표본 6장만 존재 |
| VoiceOver 런타임 순서 | FAIL, 0/23 | 실제 focus 순서·label/value/trait·상태 알림 기록 없음 |

첫 XCTest 시도는 sandbox의 CoreSimulatorService 접근 제한으로 exit 70이었으며 앱 결함으로
분류하지 않았다. Simulator 접근 권한으로 동일 스크립트를 재실행해 82개 테스트, 실패
0건과 `TEST SUCCEEDED`를 확인했다.

## 3. 결함

### QA-HIGH-805008-001 — Core Loop 23개 필수 Current 캡처 누락

- 심각도: `High`
- 기대: 23개 상태 전부를 390×844, Light, 기본 글자 크기, 한국어, Portrait와 상태별
  고정 fixture로 캡처한다.
- 실제: 저장소 Current는 App Info 4장과 Home Network Error 2장뿐이다. 승인된 Core Loop
  23개 상태 ID에 대응하는 기본 Current는 0/23이다.
- 영향: 필수 콘텐츠·CTA·상태·데이터 보존과 화면별 시각 무회귀를 판정할 수 없다.

### QA-HIGH-805008-002 — 동일 fixture·scale Reference/Diff 전량 누락

- 심각도: `High`
- 기대: 각 상태의 Reference와 Current에 동일 fixture, 상태 ID, viewport, Appearance,
  글자 크기를 사용하고 동일 scale overlay Diff를 만든다.
- 실제: Reference/Diff 이미지 디렉터리와 23개 비교 산출물이 없다. results JSON은
  prototype 문서 경로와 수동 구조 비교 설명만 기록하며 pixel baseline 부재를 명시한다.
- 영향: 토큰, spacing, radius, 정렬 및 허용 편차를 계약 수치로 검증할 수 없다.

### QA-HIGH-805008-003 — 필수 위험 조합 matrix 미완료

- 심각도: `High`
- 기대: 375×667, Dark, Accessibility 3에서 계약의 필수 위험 상태를 포함하고 모든 정보와
  CTA 도달, 잘림·겹침·키보드 가림, 44×44pt를 검증한다.
- 실제: App Info와 Home Network Error의 Accessibility 3 표본 6장만 있다. 계약이 지정한
  HOME/LOG/REVIEW/DETAIL/PLAYER 위험 상태 전체와 조작 결과가 없다.
- 영향: 작은 화면·Dark·Dynamic Type에서 핵심 Core Loop 조작 가능성을 보장할 수 없다.

### QA-HIGH-805008-004 — VoiceOver 23개 런타임 검증 누락

- 심각도: `High`
- 기대: 23개 상태에서 실제 VoiceOver를 켜고 시각 계층과 일치하는 focus 순서,
  label/value/trait, disabled/selected 의미, 상태 알림과 카운트다운 과다 낭독 방지를 확인한다.
- 실제: 소스 문자열 validator만 있으며 실제 VoiceOver 런타임 기록은 0/23이다.
- 영향: 핵심 CTA 접근, 단계 이동, 오류 회복과 상태 변화가 보조기술에서 조작 가능한지
  판정할 수 없다.

## 4. 재작업 합격 조건

1. 23개 상태별 fixture와 진입 경로를 고정하고 390×844·Light·기본 Current 23장을 만든다.
2. 각 Current에 동일 조건 Reference와 동일 scale Diff를 1:1로 연결한다.
3. 계약의 위험 상태를 375×667, Dark, Accessibility 3 조합으로 추가 캡처하고 실제 스크롤,
   키보드 회피, CTA 도달과 44×44pt 결과를 기록한다.
4. 23개 전체 VoiceOver 런타임 순서와 label/value/trait·상태 알림 결과를 상태 ID별로 남긴다.
5. validator가 파일 존재만이 아니라 상태 ID별 Current/Reference/Diff 1:1 대응, fixture·scale
   일치, 위험 matrix와 VoiceOver 결과의 완결성을 실패 조건으로 검사하게 한다.
6. 재작업 후 전체 XCTest 82개 이상과 기존 기능 흐름을 다시 실행한다.

## 5. 잔여 사항

- 기능 회귀는 독립 실행 기준 82/82 통과했다.
- 이번 판정은 증거 형식의 선택 문제가 아니라 Source of Truth의 명시적 필수 합격 조건
  미충족이다. 승인 예외 없이 `PASS_WITH_RISK`로 완화할 수 없다.
- 실제 Apple STT·Backend AI·TTS 엔진, 운영 문의·법적 값은 승인된 범위 밖이다.

## 6. 다음 Agent에게 전달할 말

너는 Development Lead Agent / Lead Role이야.
Task T-20260805-008의 재작업 범위를 조율해줘.

- 현재 상태: `rework_requested`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `099047e`
- 다음에 해야 할 일: `QA-HIGH-805008-001~004`를 23개 Current, 동일 fixture·scale
  Reference/Diff, 위험 조합 matrix, VoiceOver 23개 런타임 증거와 자동 완결성 검사로 범위화해.
- 기준 문서: Task `source_of_truth` 전체
- 허용 경로: Task frontmatter의 `allowed_paths`
- 참고 산출물: 이 QA 보고서와 실행 보고서
- 변경/검토 대상: `apps/ios/VisualRegression/`, validator, 화면 fixture·접근성 런타임
- 남은 리스크: Visual QA와 VoiceOver 합격 여부 미확정
- 차단/결정 필요: 동일 scale Reference 제작 방식과 런타임 VoiceOver 증거 형식을 확정해야 함
- 재개 가능 시: 재작업을 `approved`로 전환해 iOS Agent / Execution Role에 인계해.
