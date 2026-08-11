# T-20260805-008 iOS 독립 재검증 보고서

## 1. 판정

- 최종 판정: `FAIL`
- 검증 역할: iOS QA Agent / Verification Role
- 고정 구현 commit: `8b4a9898b846c55c9a6613787ae4aa0cc9f07b06`
- QA 인계 commit: `ed06d5cc5a482104e7e1e6ebc3b8acbad86f1f73`
- 공용 기준: `origin/develop@081c206f60ef6e5f3d533a5a2b3aafafaa52b133`
- 결론: 전체 XCTest 82/82와 negative fixture 7/7 거부는 통과했다. 그러나 실제
  산출물에서 `QA-HIGH-805008-002~004`가 미해소라 합격 조건을 충족하지 못했다.

## 2. 독립 실행 결과

| 항목 | 결과 | 독립 증거 |
|---|---|---|
| 전체 XCTest | `PASS`, 82/82, 실패 0 | `/private/tmp/CookLog-QA-T008-WPR9R12/20260810-174542-15715/CookLogTests.xcresult` |
| XCTest 로그 | `TEST SUCCEEDED` | `/private/tmp/CookLog-QA-T008-WPR9R12/20260810-174542-15715/xcodebuild.log` |
| 최종 validator | 명령 자체는 `PASS` | 82 integrated / 23 core / 18 risk / 23 accessibility automation states |
| negative fixture | `PASS`, 7/7 실제 거부 | misaligned, letterbox, unmasked, tolerance, copied accessibility expectation, empty notification, fixed over-reading false |
| Core Current | 23/23 존재, 기존 결함 001 해소 | `HOME-ERROR`, `HOME-LOADING` 실제 상태 UI 및 full-screen viewport 확인 |
| 위험 조합 원본 | `FAIL` | 54/54 interaction JSON의 주입·44pt assertion 실패, target 0개 |
| VoiceOver 순서 | `FAIL` | 요소 존재는 확인했으나 실제 focus 이동 순서를 관측하지 않음 |

실행 명령:

```text
node apps/ios/Scripts/validate-visual-regression-contract.js --run-negative-fixtures
COOKLOG_XCTEST_ARTIFACT_ROOT=/private/tmp/CookLog-QA-T008-WPR9R12 \
COOKLOG_XCTEST_TIMEOUT_SECONDS=600 bash Scripts/run-xctest.sh
```

## 3. 결함 재검증

### QA-HIGH-805008-001 — 해소

- Current 23개가 모두 존재하고 서로 다른 SHA를 가진다.
- `HOME-ERROR`, `HOME-LOADING`은 상태별 실제 본문·CTA/indicator를 표시한다.
- 390×844 Current에 기존 상하 letterbox가 없고 letterbox negative fixture도 거부된다.

### QA-HIGH-805008-002 — 미해소: 실제 Diff 정렬 편차를 허용

- 심각도: `High`
- `HOME-ERROR`의 실측 `contentFeatureOffsetPoints`는 `x=-56pt`, `y=4pt`인데도
  `alignmentPass: true`, `tolerancePass: true`, 최종 `pass: true`다.
- 같은 상태의 `changedPixelRatio`는 약 `0.1264`, `meanAbsoluteDifference`는 약 `23.19`다.
- 생성기는 `maxMeanAbsoluteDifference: 120`, `maxChangedPixelRatio: 0.92`를 사용하고
  content feature offset을 informational 값으로만 취급한다.
- Source of Truth의 커스텀 정렬 허용치는 ±2pt이고 native container도 ±4pt이므로
  `-56pt` 편차를 합격 처리한 Reference/Diff는 동일 조건 정렬 증거가 아니다.

### QA-HIGH-805008-003 — 미해소: 위험 조합 실패 원본과 중복 이미지가 통과

- 심각도: `High`
- `Evidence/risk-interactions/*.json` 54개 전부가
  `injectionAssertionPassed: false`, `minimumTargetPass: false`,
  `interactiveTargets: []`다. 그런데 최종 validator와 실행 report는 위험 조합을
  18/18 합격으로 기록했다.
- `HOME-EMPTY`와 `HOME-NETWORK-ERROR`의 bottom PNG가 모두
  `341378c1f2d0667d3784da88f44cab6eb42e0e6eccab4b3ae296786d87db6aae`로
  byte-identical이다.
- 실제 bottom 화면에서도 network error 의미와 복구 CTA가 사라지고 empty 상태 화면으로
  바뀐다. 이는 WP-R11의 상태 고유성·조작 로그·중복 실패 조건을 직접 위반한다.

### QA-HIGH-805008-004 — 미해소: VoiceOver 실제 focus 순서를 관측하지 않음

- 심각도: `High`
- 접근성 자동화는 독립 기대 문자열을 `expected.enumerated()`로 순회하고 각 문자열을
  `XCUIApplication.descendants(...).firstMatch`로 찾은 뒤, 그 기대 배열 index를
  `sequence`로 기록한다.
- 따라서 label/value 요소 존재는 증명하지만, 실제 접근성 트리 순서나 VoiceOver focus
  이동 순서를 측정하지 않는다. 필요하면 찾을 때까지 swipe하므로 기록된 sequence를
  런타임 낭독 순서로 해석할 수도 없다.
- 알림 게시 이벤트와 필수 label 보강은 확인됐고 `simulatorVoiceOverClaimed: false`도
  정직하게 기록됐다. 하지만 사용자가 우선 요구한 23개 전체 VoiceOver 런타임 순서의
  합격 근거는 아직 없다.

## 4. Lead Role 재작업 요청

1. 실제 `contentFeatureOffsetPoints`를 Source of Truth 허용치와 비교하고 초과 시 Diff와
   validator를 실패시킨다. `HOME-ERROR -56pt`를 재정렬·재캡처한다.
2. 위험 interaction 원본의 주입·최소 44pt target·CTA 조작 결과 중 하나라도 false거나
   target이 비면 validator가 실패하도록 한다. 18개 상태를 실제 성공 결과로 재생성한다.
3. top/bottom 전체와 서로 다른 상태 사이의 SHA 중복을 검사하고, network error bottom이
   오류 의미와 복구 CTA를 유지하도록 수정·재캡처한다.
4. 기대 배열 순번이 아닌 실제 접근성 traversal/focus 이동을 관측하는 자동화 또는 실제
   VoiceOver 기기 런타임 증거로 Core 23개 순서를 검증한다.
5. 수정 후 전체 XCTest 82개 이상, Current/Reference/Diff 23개, 위험 18개,
   접근성 23개와 negative fixture를 다시 독립 검증 가능하게 인계한다.

## 5. 다음 Agent에게 전달할 말

너는 Development Lead Agent / Lead Role이야. Task T-20260805-008의 WP-R9~R12 독립
재검증 결과는 `FAIL`이야. `QA-HIGH-805008-001`은 해소됐지만
`QA-HIGH-805008-002~004`가 미해소야. 특히 위험 interaction 원본 54/54가 false·target
0개인데 validator가 통과하고, HOME-EMPTY/NETWORK-ERROR bottom이 byte-identical이며,
HOME-ERROR Diff의 실제 x 편차 -56pt도 합격 처리돼. 접근성 자동화 sequence는 기대 배열
순번이라 실제 VoiceOver focus 순서가 아니야. 이 보고서의 재작업 조건을 범위화하고
Product Owner 승인 후 iOS Agent / Execution Role에 재인계해줘.
