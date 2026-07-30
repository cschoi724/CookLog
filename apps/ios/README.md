# CookLog iOS

CookLog iOS 앱은 SwiftUI 기반 MVP입니다. 현재 앱 실행 경로는 SwiftData 로컬 저장소를 사용하고, SwiftUI Preview와 Unit Test는 `AppEnvironment.mock` 기반 InMemory 저장소를 유지합니다.

## 개발 환경

- 프로젝트 기준 Xcode: 15.2
- 2026-07-28 XCTest 안정화 검증 환경: Xcode 26.6
- iOS Deployment Target: 17.0 이상
- scheme: `CookLog`
- 검증 destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`

로컬 기준과 CI 기준은 의도적으로 구분합니다.

| 구분 | 환경 |
|---|---|
| T-004 로컬 검증 | Xcode 26.6 (`17F113`), iPhone 15, iOS 17.2 |
| GitHub-hosted CI | `macos-26` arm64, Xcode 26.6 (`17F113`), iPhone 17, iOS 26.5 |

GitHub-hosted CI는 `DEVELOPER_DIR=/Applications/Xcode_26.6.app/Contents/Developer`와 `platform=iOS Simulator,name=iPhone 17,OS=26.5`를 명시합니다. image에 이 조합이 없으면 다른 버전으로 암묵 전환하지 않고 preflight에서 실패해야 합니다. 상세 명령과 artifact 계약은 `docs/TESTING.md`의 “T-20260730-001 CI 환경·명령 계약”을 따릅니다.

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

CI의 고정 check 이름은 다음 두 개입니다.

- `ios-build`: `build`와 `build-for-testing`
- `ios-xctest`: `Scripts/run-xctest.sh`

두 check를 required로 만드는 repository 외부 설정은 workflow 구현·dry run·iOS QA 이후 별도 승인 Task에서만 수행합니다.

## 수동 확인 흐름

상세 체크리스트는 `docs/MANUAL_QA_CHECKLIST.md`를 기준으로 합니다.

1. Home에서 요리 기록 시작
2. 10초 기록을 반복해 STEP Preview 누적
3. AI 정리하기
4. AI Review에서 내용 수정 후 저장
5. Recipe Detail 확인
6. 오디오 가이드 시작
7. 앱 재실행 후 Home에 저장된 Recipe 유지 확인
