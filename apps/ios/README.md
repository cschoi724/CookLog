# CookLog iOS

CookLog iOS 앱은 SwiftUI 기반 MVP입니다. 현재 앱 실행 경로는 SwiftData 로컬 저장소를 사용하고, SwiftUI Preview와 Unit Test는 `AppEnvironment.mock` 기반 InMemory 저장소를 유지합니다.

## 개발 환경

- 프로젝트 기준 Xcode: 15.2
- 2026-07-28 XCTest 안정화 검증 환경: Xcode 26.6
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

## 전체 테스트

```bash
Scripts/run-xctest.sh
```

이 스크립트는 XCTest를 직렬 실행하고 기본 600초 제한을 적용하며 실행별 로그와 `xcresult`를 임시 artifact 폴더에 보존합니다.

환경에 맞게 다음 값을 바꿀 수 있습니다.

```bash
COOKLOG_XCTEST_DESTINATION='platform=iOS Simulator,name=iPhone 15,OS=17.2' \
COOKLOG_XCTEST_TIMEOUT_SECONDS=600 \
COOKLOG_XCTEST_ARTIFACT_ROOT=/tmp/CookLog-XCTest \
Scripts/run-xctest.sh
```

- 성공: `0`
- 테스트 실패: `xcodebuild` 종료 코드
- 제한 시간 초과: `124`

## 수동 확인 흐름

상세 체크리스트는 `docs/MANUAL_QA_CHECKLIST.md`를 기준으로 합니다.

1. Home에서 요리 기록 시작
2. 10초 기록을 반복해 STEP Preview 누적
3. AI 정리하기
4. AI Review에서 내용 수정 후 저장
5. Recipe Detail 확인
6. 오디오 가이드 시작
7. 앱 재실행 후 Home에 저장된 Recipe 유지 확인
