# CookLog iOS 수동 검증 체크리스트

이 문서는 사용자가 iOS MVP를 직접 실행해 제품 흐름을 확인하기 위한 체크리스트입니다. 체크 후 결과를 루트 관리 에이전트에게 전달하면, 개발 에이전트가 수정 항목을 이어서 처리합니다.

작성일: 2026-06-22
기준 PRD: `../../../docs/product/CookLog_PRD_v2.md`
대상 앱: `apps/ios/CookLog.xcodeproj`

## QA Agent 확인 기록

- 확인일: 2026-07-01
- 확인자: QA Agent
- 실행 환경:
  - 빌드: `xcodebuild ... build -quiet` 성공
  - 테스트 빌드: `xcodebuild ... build-for-testing -quiet` 성공
  - 기본 대상: iPhone 15, iOS 17.2 시뮬레이터
  - 대체 대상: iPhone SE (3rd generation), iOS 17.2 시뮬레이터
- 확인 범위:
  - 최초 시도에서는 iPhone 15 시뮬레이터 Apple ID Verification 팝업과 macOS 보조 접근 권한 미허용으로 Home 이후 검증이 차단됐다.
  - 재개 승인 후 iPhone SE (3rd generation), iOS 17.2 시뮬레이터에서 새 설치 기준으로 Home -> Cooking Log -> 10초 기록 -> STEP Preview 생성 -> AI 정리하기 진입까지 확인했다.
  - STEP Preview 1개가 Cooking Log에 표시된 상태에서 `AI 정리하기`를 누르면 AI Review가 레시피 초안 대신 `정리할 STEP Preview가 없습니다.` 오류를 표시하는 핵심 흐름 결함을 확인했다.
  - 개발 에이전트가 2026-07-01에 AI Review route 입력 전달 결함을 수정했으며, 이 체크리스트 기준 재검증이 필요하다.
  - 수정 후 iPhone SE (3rd generation), iOS 17.2 시뮬레이터에서 새 설치 기준으로 Home -> Cooking Log -> 10초 기록 2회 -> STEP Preview 2개 누적 -> AI Review 초안 표시까지 재검증했다.
  - AI Review 하단 저장 버튼까지의 스크롤 자동화가 안정적으로 전달되지 않아 저장 이후 터치 검증은 완료하지 못했다.
  - 저장, Recipe Detail, Audio Player, SwiftData 저장소 경로는 선별 XCTest 18개 통과로 코드 레벨 검증했다.
- 증거 스크린샷:
  - `/private/tmp/cooklog-se-after-console-launch.png`
  - `/private/tmp/cooklog-se-home-dark-2.png`
  - `/private/tmp/cooklog-qa-home-light.png`
  - `/private/tmp/cooklog-qa-cookinglog-empty.png`
  - `/private/tmp/cooklog-qa-recording.png`
  - `/private/tmp/cooklog-qa-step-preview-1.png`
  - `/private/tmp/cooklog-after-drag-scroll.png`
  - `/private/tmp/cooklog-qa-ai-review.png`
  - `/private/tmp/cooklog-reqa-launch-console.png`
  - `/private/tmp/cooklog-reqa-cookinglog-3.png`
  - `/private/tmp/cooklog-reqa-recording-immediate.png`
  - `/private/tmp/cooklog-reqa-after-drag-step.png`
  - `/private/tmp/cooklog-reqa-ai-review-fixed-2.png`

## 1. 검증 전 준비

### 환경

- [x] Xcode 15.2에서 `apps/ios/CookLog.xcodeproj`를 연다.
- [x] scheme이 `CookLog`인지 확인한다.
- [x] 실행 대상이 `iPhone 15`, iOS 17.2 또는 사용 가능한 iOS 17 이상 시뮬레이터인지 확인한다.
- [x] 앱이 정상 빌드되고 실행되는지 확인한다.

### 선택 사항

기존 저장 데이터가 검증에 방해되면 시뮬레이터에서 앱을 삭제한 뒤 다시 실행한다.

- [x] 새 설치 상태로 검증했다.
- [ ] 기존 저장 데이터가 있는 상태로 검증했다.

## 2. 핵심 MVP 흐름

### Home

- [x] 앱 실행 시 Home 화면이 표시된다.
- [x] `요리 기록 시작` 버튼이 보인다.
- [x] 저장된 레시피가 없을 때 빈 상태 문구가 자연스럽다.
- [ ] 저장된 레시피가 있을 때 목록에 표시된다.
- [ ] 저장된 레시피 행을 누르면 Recipe Detail로 이동한다.

메모:

```text
QA Agent 2026-07-01:
- iPhone SE (3rd generation), iOS 17.2 시뮬레이터에서 앱 설치와 실행을 확인했다.
- Home 화면, `요리 기록 시작` 버튼, 저장된 레시피 빈 상태 문구를 확인했다.
- AI Review 단계 결함으로 레시피 저장까지 진행하지 못해 저장된 레시피 목록과 행 선택은 확인하지 못했다.
```

### Cooking Log

- [x] Home에서 `요리 기록 시작`을 누르면 요리 기록 화면으로 이동한다.
- [x] `10초 기록` 버튼이 보인다.
- [x] STEP Preview가 없을 때 `AI 정리하기` 버튼이 비활성화된다.
- [x] `10초 기록`을 누르면 기록 중 상태와 남은 시간이 표시된다.
- [x] 기록 완료 후 STEP Preview가 1개 추가된다.
- [x] 여러 번 기록하면 STEP Preview가 순서대로 누적된다.
- [x] STEP Preview가 1개 이상이면 `AI 정리하기` 버튼이 활성화된다.

메모:

```text
QA Agent 2026-07-01:
- 재개 승인 후 iPhone SE 시뮬레이터에서 Home -> Cooking Log 이동, 10초 기록, STEP Preview 1개 생성, `AI 정리하기` 버튼 표시를 확인했다.
- 여러 번 기록 누적은 AI Review 결함 확인 후 중단해 별도 확인하지 않았다.

개발 에이전트 2026-07-01 재검증:
- 수정 후 새 설치 상태에서 10초 기록을 2회 실행했고 STEP Preview가 `1`, `2` 순서로 누적되는 것을 확인했다.
```

### AI Review

- [x] `AI 정리하기`를 누르면 AI Review 화면으로 이동한다.
- [x] 로딩 후 레시피 초안이 표시된다.
- [ ] 제목을 수정할 수 있다.
- [ ] 재료 이름과 양을 수정할 수 있다.
- [ ] 재료를 추가할 수 있다.
- [ ] 재료를 삭제할 수 있다.
- [ ] 조리 순서를 수정할 수 있다.
- [ ] 조리 순서를 추가할 수 있다.
- [ ] 조리 순서를 삭제할 수 있다.
- [ ] 예상 시간을 수정할 수 있다.
- [ ] 메모를 수정할 수 있다.
- [ ] 필수 정보가 있을 때 저장 버튼이 활성화된다.
- [ ] 저장을 누르면 Recipe Detail로 이동한다.

메모:

```text
QA Agent 2026-07-01:
- STEP Preview 1개가 있는 상태에서 `AI 정리하기`를 눌렀으나 AI Review가 레시피 초안 대신 `정리할 STEP Preview가 없습니다.` 오류를 표시했다.
- 뒤로 돌아가 Cooking Log를 확인했을 때 STEP Preview 1개는 여전히 표시되어 있었다.
- 이 결함으로 AI Review 입력 수정, 저장, Recipe Detail 이동은 진행하지 못했다.

개발 에이전트 2026-07-01 재검증:
- 수정 후 STEP Preview 2개가 있는 상태에서 `AI 정리하기`를 눌렀고 AI Review가 오류 대신 레시피 초안을 표시하는 것을 확인했다.
- 제목 `나의 요리 기록`, 재료 `기록한 재료`, 조리 순서 STEP 1 `삼겹살을 넣고 볶았어`가 표시됐다.
- AI Review 하단 저장 버튼까지의 스크롤 자동화가 안정적으로 전달되지 않아 저장 터치 검증은 완료하지 못했다.
```

### Recipe Detail

- [ ] 저장 후 Recipe Detail 화면이 표시된다.
- [ ] 제목이 표시된다.
- [ ] 재료 목록이 표시된다.
- [ ] 조리 순서가 표시된다.
- [ ] 예상 시간이 표시된다.
- [ ] 메모가 표시된다.
- [ ] `오디오 가이드 시작` 버튼이 보인다.
- [ ] 조리 순서가 있을 때 `오디오 가이드 시작` 버튼이 활성화된다.

메모:

```text
QA Agent 2026-07-01:
- 저장 후 Recipe Detail 진입은 이번 세션에서 확인하지 못했다.
- AI Review가 STEP Preview를 받지 못하는 결함으로 저장 단계까지 진행하지 못했다.

개발 에이전트 2026-07-01:
- 저장 후 Recipe Detail 터치 검증은 AI Review 하단 스크롤 자동화 한계로 완료하지 못했다.
- `RecipeDetailViewModelTests` 3개 통과로 Recipe Detail 조회, 없음, 실패 상태를 코드 레벨에서 재확인했다.
```

### Audio Player

- [ ] `오디오 가이드 시작`을 누르면 Audio Player 화면으로 이동한다.
- [ ] 레시피 제목이 표시된다.
- [ ] 현재 단계 번호가 표시된다.
- [ ] 현재 단계 본문이 표시된다.
- [ ] 첫 단계에서는 이전 버튼이 비활성화된다.
- [ ] 재생 버튼을 누를 수 있다.
- [ ] 정지 버튼을 누를 수 있다.
- [ ] 다시 듣기 버튼을 누를 수 있다.
- [ ] 다음 버튼을 누르면 다음 단계로 이동한다.
- [ ] 마지막 단계에서는 다음 버튼이 비활성화된다.
- [ ] 이전 버튼을 누르면 이전 단계로 이동한다.

메모:

```text
QA Agent 2026-07-01:
- Audio Player 진입과 단계 이동 컨트롤은 이번 세션에서 확인하지 못했다.
- AI Review가 STEP Preview를 받지 못하는 결함으로 Recipe Detail과 Audio Player 단계까지 진행하지 못했다.

개발 에이전트 2026-07-01:
- Audio Player 터치 검증은 저장 이후 화면 진입을 완료하지 못해 진행하지 못했다.
- `AudioPlayerViewModelTests` 8개 통과로 초기 로드, 단계 이동, 경계 상태, 재생/다시 듣기/정지 호출, 빈 step, 조회 실패 상태를 코드 레벨에서 재확인했다.
```

## 3. 저장 유지 검증

- [ ] Recipe Detail 또는 Home까지 이동한 상태에서 앱을 종료한다.
- [ ] 앱을 다시 실행한다.
- [ ] Home에 방금 저장한 레시피가 표시된다.
- [ ] 저장된 레시피를 눌러 Recipe Detail로 이동할 수 있다.
- [ ] Recipe Detail 내용이 저장 전 입력한 내용과 일치한다.
- [ ] Audio Player에 다시 진입할 수 있다.

메모:

```text
QA Agent 2026-07-01:
- 저장 생성 흐름을 터치 검증하지 못해 SwiftData 저장 유지 여부는 이번 세션에서 확인하지 못했다.
- AI Review가 STEP Preview를 받지 못하는 결함으로 레시피 저장 자체를 수행하지 못했다.

개발 에이전트 2026-07-01:
- SwiftData 저장 유지 터치 검증은 저장 버튼 터치 자동화 한계로 완료하지 못했다.
- `SwiftDataRecipeLocalDataSourceTests` 3개 통과로 저장/조회, 목록 정렬, 삭제 경로를 코드 레벨에서 재확인했다.
```

## 4. 화면과 사용성 확인

### 기본 화면

- [x] 버튼 문구가 이해하기 쉽다.
- [x] 빈 상태 문구가 어색하지 않다.
- [ ] 에러 문구가 어색하지 않다.
- [ ] 화면 이동이 예상과 다르지 않다.
- [ ] 뒤로 가기 동작이 자연스럽다.

### 입력 화면

- [ ] AI Review의 제목 입력이 불편하지 않다.
- [ ] 재료 입력 행이 좁거나 깨지지 않는다.
- [ ] 조리 순서 TextEditor가 사용하기 어렵지 않다.
- [ ] 예상 시간 입력이 이해하기 쉽다.
- [ ] 키보드가 중요한 버튼을 과하게 가리지 않는다.

### 작은 화면

가능하면 작은 시뮬레이터 또는 실제 기기에서도 확인한다.

- [x] Home에서 텍스트와 버튼이 겹치지 않는다.
- [x] Cooking Log에서 타이머와 버튼이 겹치지 않는다.
- [ ] AI Review에서 입력 필드가 지나치게 좁지 않다.
- [ ] Recipe Detail에서 조리 순서가 읽기 좋다.
- [ ] Audio Player 하단 컨트롤이 잘리지 않는다.

### 다크 모드

- [x] Home 가독성이 괜찮다.
- [ ] Cooking Log 가독성이 괜찮다.
- [ ] AI Review 가독성이 괜찮다.
- [ ] Recipe Detail 가독성이 괜찮다.
- [ ] Audio Player 가독성이 괜찮다.

메모:

```text
QA Agent 2026-07-01:
- iPhone SE 작은 화면에서 Home 텍스트, 버튼, 빈 상태 문구가 겹치지 않는 것을 확인했다.
- iPhone SE 작은 화면에서 Cooking Log 타이머, 기록 버튼, STEP Preview, `AI 정리하기` 버튼이 겹치지 않는 것을 확인했다.
- iPhone SE 다크 모드에서 Home 가독성이 유지되는 것을 확인했다.
- AI Review 이후 화면은 핵심 흐름 결함으로 확인하지 못했다.

개발 에이전트 2026-07-01 재검증:
- iPhone SE 작은 화면에서 AI Review 상단의 제목, 재료 입력 행, 조리 순서 STEP 1 표시가 겹치지 않는 것을 확인했다.
- AI Review 전체 하단, Recipe Detail, Audio Player 레이아웃은 후속 수동 검증이 필요하다.
```

## 5. 발견 이슈 기록

아래 형식으로 문제를 적어 전달한다.

```text
위치:
AI Review 진입

문제:
Cooking Log에 STEP Preview 1개가 표시된 상태에서 `AI 정리하기`를 누르면 AI Review가 레시피 초안 대신 `정리할 STEP Preview가 없습니다.` 오류를 표시한다.

재현 순서:
1. iPhone SE (3rd generation), iOS 17.2 시뮬레이터에 CookLog를 새 설치한다.
2. Home에서 `요리 기록 시작`을 누른다.
3. Cooking Log에서 `10초 기록`을 누르고 기록 완료를 기다린다.
4. STEP Preview에 `삼겹살을 넣고 볶았어` 1개가 표시되는 것을 확인한다.
5. `AI 정리하기`를 누른다.

기대 동작:
AI Review가 STEP Preview를 입력으로 받아 레시피 초안을 표시해야 한다.

심각도:
높음

비고:
MVP 핵심 흐름인 AI 정리, 저장, Recipe Detail, Audio Player 진입을 모두 차단한다.

위치:
QA 실행 환경 > Simulator 조작

문제:
최초 시도에서는 macOS `System Events` 보조 접근 권한이 없어 QA Agent가 Simulator 창에 클릭을 보낼 수 없었다.

재현 순서:
1. iPhone SE (3rd generation), iOS 17.2 시뮬레이터에 앱 설치
2. `xcrun simctl launch --console-pty ... app.cooklog.CookLog`로 앱 실행
3. `osascript`로 Simulator 창 위치 확인 및 클릭 자동화를 시도

기대 동작:
QA Agent가 Simulator 화면을 실제 클릭하거나, 사람이 직접 터치해 체크리스트 전체를 검증할 수 있어야 한다.

심각도:
보통

비고:
재개 승인 후 권한 문제가 해소되어 제품 흐름 검증을 진행했다.

위치:
QA 실행 환경 > AI Review 스크롤 자동화

문제:
AI Review 상단 초안 표시까지는 터치 검증했으나, macOS 이벤트 기반 자동화가 AI Review 하단 저장 버튼까지의 ScrollView 스크롤을 안정적으로 전달하지 못했다.

재현 순서:
1. iPhone SE (3rd generation), iOS 17.2 시뮬레이터에서 AI Review 초안 화면에 진입한다.
2. `System Events` 클릭, CoreGraphics 드래그, 마우스 휠 이벤트로 하단 저장 버튼까지 스크롤을 시도한다.
3. 화면이 하단으로 이동하지 않는다.

기대 동작:
사람이 직접 Simulator 또는 실제 기기에서 스크롤해 저장 버튼을 누르고 저장 이후 흐름을 확인해야 한다.

심각도:
낮음

비고:
제품 앱 결함으로 확정하지 않고 QA 자동화 한계로 기록한다. 저장, 상세, 오디오, SwiftData 경로는 선별 XCTest로 재확인했다.
```

## 6. 최종 판정

하나를 선택한다.

- [ ] 통과: MVP 흐름을 그대로 다음 단계로 진행해도 된다.
- [x] 조건부 통과: 작은 수정 후 진행해도 된다.
- [ ] 보류: 핵심 흐름 문제가 있어 수정 후 다시 검증해야 한다.

최종 메모:

```text
QA Agent 2026-07-01:
- 재개 승인 후 전체 흐름을 다시 시도했고, Home -> Cooking Log -> 10초 기록 -> STEP Preview 생성까지 확인했다.
- STEP Preview 1개가 있는 상태에서 AI Review가 `정리할 STEP Preview가 없습니다.` 오류를 표시해 핵심 흐름이 중단된다.
- Recipe Detail, Audio Player, SwiftData 저장 유지 검증은 이 결함 수정 후 다시 진행해야 한다.

개발 에이전트 2026-07-01 재검증:
- 수정 후 Home -> Cooking Log -> 10초 기록 2회 -> STEP Preview 2개 누적 -> AI Review 초안 표시까지 확인했다.
- 기존 핵심 결함인 `정리할 STEP Preview가 없습니다.` 오류는 재현되지 않았다.
- 저장 이후 터치 검증은 AI Review 하단 스크롤 자동화 한계로 완료하지 못했다.
- AI Review 저장, Recipe Detail, Audio Player, SwiftData 저장소 선별 XCTest 18개는 통과했다.
- 사람 손으로 Simulator 또는 실제 기기에서 저장 버튼 이후 흐름을 한 번 더 확인해야 한다.
```
