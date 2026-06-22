# CookLog iOS

CookLog iOS 앱은 SwiftUI 기반 MVP입니다. 현재 앱 실행 경로는 SwiftData 로컬 저장소를 사용하고, SwiftUI Preview와 Unit Test는 `AppEnvironment.mock` 기반 InMemory 저장소를 유지합니다.

## 개발 환경

- Xcode: 15.2
- iOS Deployment Target: 17.0 이상
- scheme: `CookLog`
- 검증 destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`

## 빌드

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build -quiet
```

## 테스트 빌드

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing -quiet
```

## 테스트 실행 참고

```bash
xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' test
```

현재 로컬 환경에서는 테스트 번들 빌드 후 XCTest runner가 `waiting for workers to materialize` 상태로 대기하는 현상이 반복되어, `build-for-testing` 성공 여부를 주요 자동 검증으로 기록합니다.

## 수동 확인 흐름

1. Home에서 요리 기록 시작
2. 10초 기록을 반복해 STEP Preview 누적
3. AI 정리하기
4. AI Review에서 내용 수정 후 저장
5. Recipe Detail 확인
6. 오디오 가이드 시작
7. 앱 재실행 후 Home에 저장된 Recipe 유지 확인
