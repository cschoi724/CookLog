# CookLog iOS Testing

이 문서는 CookLog iOS 앱의 테스트 기준을 관리합니다.

최종 업데이트: 2026-06-22
상태: 확정

## 1. 테스트 원칙

- MVP 초기에는 Unit Test를 우선합니다.
- 도메인 모델, UseCase, Repository Mock, Service Mock 중심으로 검증합니다.
- UI 테스트는 핵심 흐름이 안정된 뒤 추가합니다.
- Mock, Preview, Test Fixture는 용도별로 분리합니다.

## 2. 우선순위

우선 테스트 대상:

- STEP Preview 누적 로직
- Mock STT 결과 처리
- Mock AI 정리 결과 생성
- RecipeDraft -> Recipe 변환
- Recipe 저장/조회
- Audio Player 단계 이동 로직

## 3. Mock과 Fixture

기준:

- 테스트용 Mock은 테스트 타겟 또는 테스트 helper에 둡니다.
- 앱 실행용 Mock DataSource/Service는 앱 타겟에 둘 수 있지만 이름에 `Mock`을 명확히 붙입니다.
- SwiftUI Preview 샘플은 `PreviewSupport/`에 둡니다.
- 테스트 Fixture는 Preview 샘플과 공유하지 않는 것을 기본으로 합니다.

## 4. 검증 시점

각 이정표 종료 시 최소 검증:

- M1: 도메인 모델과 STEP Preview 누적 로직 단위 테스트
- M3: Mock STT 기반 10초 기록 흐름 수동 테스트
- M4: Mock AI 변환 단위 테스트
- M6: Audio Player 단계 이동 로직 단위 테스트
- M7: 저장/조회 동작 확인
- M8: 전체 MVP 흐름 수동 테스트

## 5. 빌드 확인

M0 기준 실제 scheme과 destination은 다음과 같습니다.

- scheme: `CookLog`
- destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`
- bundle id: `app.cooklog.CookLog`

기본 빌드:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build
```

결과:

- 2026-06-22 확인 완료
- `** BUILD SUCCEEDED **`

테스트 번들 빌드:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing
```

결과:

- 2026-06-22 확인 완료
- `** TEST BUILD SUCCEEDED **`

테스트 실행:

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test
```

현재 결과:

- 테스트 번들 빌드까지는 진행됩니다.
- 시뮬레이터 XCTest runner 설치/실행 단계에서 결과 없이 대기합니다.
- `waiting for workers to materialize`, `_IDEInstalliPhoneSimulatorWorker`, `IDELaunchiPhoneSimulatorLauncher` 대기 상태를 확인했습니다.
- 2026-06-22에는 장시간 대기 후 수동 중단했습니다.

시뮬레이터 수동 실행 확인:

```bash
xcrun simctl install booted /Users/annyeongjelly/Library/Developer/Xcode/DerivedData/CookLog-fioakfrksuvtmzamofbkooesugqt/Build/Products/Debug-iphonesimulator/CookLog.app
xcrun simctl launch booted app.cooklog.CookLog
```

결과:

- 2026-06-22 확인 완료
- 설치 성공
- 실행 성공, process id `7842` 확인
