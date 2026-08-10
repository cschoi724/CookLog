# T-20260805-008 iOS 독립 재검증 보고서

## 1. 판정

- 최종 판정: `FAIL`
- 검증 역할: iOS QA Agent / Verification Role
- 검증 대상 구현 commit: `9aefd83`
- 재작업 승인 commit: `333ac2f`
- 검증 당시 공용 기준: `origin/develop@aee251a`
- 결론: 기능 XCTest 82/82는 통과했으나 `QA-HIGH-805008-001~004`가 미해소다.

## 2. 독립 실행 결과

| 항목 | 결과 | 증거 |
|---|---|---|
| 전체 XCTest | PASS, 82/82, 실패 0 | `/private/tmp/CookLog-QA-T008-Reverify-2/20260810-140252-83741/CookLogTests.xcresult` |
| XCTest 로그 | PASS | `/private/tmp/CookLog-QA-T008-Reverify-2/20260810-140252-83741/xcodebuild.log` |
| 강화 validator | 명령 PASS, 품질 게이트 FAIL | 상태 의미·실제 탐색·Diff 편차를 검증하지 못함 |
| Current/Reference/Diff 파일 수 | 각 23개 존재 | 개수·PNG 크기 확인 |
| 위험 matrix 파일 수 | top/bottom 각 18개 존재 | 서로 다른 상태의 동일 이미지 다수 확인 |
| VoiceOver JSON 수 | 23개 존재 | 실제 탐색 순서와 필수 요소 완결성 미증명 |

## 3. 결함 재검증

### QA-HIGH-805008-001 — 미해소: 상태별 Current가 필수 상태를 표현하지 않음

- `HOME-ERROR`와 `HOME-LOADING`은 상태 ID 배지만 다르고 실제 Current 본문에는 오류 카드,
  재시도 CTA 또는 loading indicator가 없다.
- iPhone 14 Current는 1170×2532 파일 안에 앱 화면이 상하 검은 영역으로 letterbox되어
  실제 390×844 full-screen viewport 증거로 사용할 수 없다.
- `9aefd83`은 상태 배지 설명만 추가했고 실제 오류·로딩 UI 주입 및 Current 이미지
  재생성을 수행하지 않았다.

### QA-HIGH-805008-002 — 미해소: 동일 조건 Reference/Diff가 아님

- 대표 `HOME-CONTENT`에서 Current와 Reference의 화면 원점·safe area·콘텐츠 배치가 다르다.
- Diff는 정렬·마스크·허용치 판정 없이 두 이미지를 50% alpha로 합성한 결과다.
- validator는 크기와 SHA 불일치만 확인하므로 동일 fixture·viewport·scale 정렬과 실제
  편차를 보장하지 않는다.
- 새 `diff-metrics.json`은 실제 마스크·alignment·픽셀/point 편차 측정 없이 이미지 크기가
  같으면 offset 0과 `alignmentPass: true`를 고정 기록하며 validator도 이 파일을 검사하지 않는다.

### QA-HIGH-805008-003 — 미해소: 위험 상태 matrix가 상태별 실행 증거가 아님

- top 캡처에서 `HOME-CONTENT`, `HOME-EMPTY`, `HOME-ERROR`, `HOME-NETWORK-ERROR`가
  byte-identical이다.
- `REVIEW-EDITABLE`, `REVIEW-SAVING`, `REVIEW-SAVE-ERROR` 및 `LOG-ERROR`,
  `LOG-STEP-ADDED`에도 동일 이미지 반례가 있다.
- 결과 JSON과 validator는 파일 수·경로·자기보고 PASS만 확인하고 상태별 실측값과 고유
  콘텐츠·CTA를 검증하지 않는다.
- `9aefd83`에서 위험 matrix 이미지와 결과 JSON을 재생성하지 않아 기존 SHA 중복이 유지됐다.

### QA-HIGH-805008-004 — 미해소: VoiceOver 실제 focus 순서·상태 알림 미검증

- `focusOrder`는 실제 VoiceOver focus 이벤트가 아니라 UIKit subview 열거 순서다.
- `LOG-RECORDING`에는 남은 시간·기록·AI 정리 제어가, `PLAYER-PLAYING`에는 이전·재생/정지·
  다음 제어가 누락됐다.
- 기대 계약을 actualElements에서 다시 복사해 누락 요소를 검출할 독립 기준이 없다.
- 23개 모두 `notificationsObserved: []`인데 로딩·오류·저장·단계 변경 알림을 통과 처리했다.
- `9aefd83`에서 VoiceOver runtime JSON과 수집 로직을 수정하지 않아 동일 반례가 유지됐다.

## 4. 재작업 합격 조건

1. 각 상태를 실제 주입하고 상태별 기대 콘텐츠·CTA assertion 후 캡처한다.
2. 390×844 앱 viewport를 letterbox 없이 full-screen으로 만들고 Current/Reference의 safe area,
   fixture, 상태 ID, 시간 마스크와 좌표계를 일치시킨다.
3. Diff 전에 alignment와 mask를 적용하고 계약 허용치별 수치 결과를 기록한다.
4. 위험 matrix에서 각 상태의 고유 콘텐츠·CTA·오류/로딩/disabled 의미를 assertion하고
   중복 이미지를 상태별 증거로 허용하지 않는다.
5. 실제 VoiceOver focus 이동 또는 신뢰 가능한 접근성 자동화로 순서를 기록하고 상태별 독립
   기대 label/value/trait/disabled/selected 계약과 비교한다.
6. 상태 알림과 카운트다운 과다 낭독 여부를 실제 이벤트 로그로 증명한다.
7. validator에 위 반례를 추가하고 전체 XCTest 82개 이상을 다시 통과시킨다.

## 5. 다음 Agent에게 전달할 말

너는 Development Lead Agent / Lead Role이야. Task T-20260805-008의 재작업 범위를 다시
조율해줘. 검증 대상은 `9aefd83`, 기준은 `origin/develop@aee251a`다. 상태 설명·고정 PASS
metadata 추가를 해소로 인정하지 말고 실제 fixture, 재생성된 이미지, 산출된 수치 Diff,
실제 VoiceOver 이벤트 증거로 `QA-HIGH-805008-001~004`를 해소해야 한다. 재개 가능 시
Product Owner 승인을 받은 뒤 iOS Agent / Execution Role에 인계해.
