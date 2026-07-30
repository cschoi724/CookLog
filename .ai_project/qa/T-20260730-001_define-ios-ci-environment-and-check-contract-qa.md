# T-20260730-001 iOS 독립 QA 보고서

작성일: 2026-07-30
작성자: iOS QA Agent
대상 Task: `T-20260730-001`
판정: `FAIL`

## 1. 검증 범위

- GitHub-hosted runner label과 architecture
- Xcode 버전·build·설치 경로
- iOS Simulator runtime과 device
- `ios-build`, `ios-xctest` 명령 책임
- timeout과 artifact 계약
- T-004 로컬 기준과 CI destination 차이
- 계약 destination에서 전체 XCTest 실행 가능 여부
- 변경 경로와 strict Task metadata

## 2. 공식 환경 계약 검증

공식 GitHub 자료를 기준으로 다음 값은 정합하다.

- `macos-26`은 arm64 표준 GitHub-hosted runner label이다.
- macOS 26 ARM64 image manifest `20260720.0258.1`은 Xcode 26.6 (`17F113`)을 `/Applications/Xcode_26.6.app`에 제공한다.
- 같은 manifest는 iOS 26.5 Simulator와 iPhone 17을 제공한다.

확인한 공식 자료:

- [GitHub-hosted runners reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)
- [GitHub Actions runner images](https://github.com/actions/runner-images)
- [macOS 26 ARM64 image manifest](https://github.com/actions/runner-images/blob/main/images/macos/macos-26-arm64-Readme.md)

문서 간 고정값도 일치한다.

- runner: `macos-26` arm64
- Xcode: 26.6 (`17F113`)
- `DEVELOPER_DIR`: `/Applications/Xcode_26.6.app/Contents/Developer`
- destination: `platform=iOS Simulator,name=iPhone 17,OS=26.5`
- check: `ios-build`, `ios-xctest`
- script timeout: 600초, 종료 코드 124
- job timeout: 15분
- artifact 보존: 14일
- required check 외부 설정: 별도 `T-20260730-006`

## 3. 정적 검증

- `aiops validate task ... --strict`: 통과
- `bash -n apps/ios/Scripts/run-xctest.sh`: 통과
- `git diff --check`: 통과
- 변경 경로: Task의 `allowed_paths` 안에 있음
- workflow와 앱 제품 구현 코드 변경: 없음
- 원격 STT secret·endpoint·활성화 flag 요구: 없음

초기 Task front matter의 실행 단계 라우팅이 `verification_ready` 상태와 맞지 않았지만, Product Owner의 직접 iOS QA 배정과 Development/Quality board 인계에 맞춰 Verification Role로 수정한 후 검증을 시작했다.

## 4. 계약 destination 독립 실행

로컬 환경:

- Xcode 26.6 (`17F113`)
- iPhone 17 Simulator
- iOS 26.5 (`23F77`)
- Device ID: `5C621868-90AD-4EFE-84A2-D240B22CADF0`

실행 명령:

```bash
COOKLOG_XCTEST_DESTINATION='platform=iOS Simulator,name=iPhone 17,OS=26.5' \
COOKLOG_XCTEST_ARTIFACT_ROOT=/private/tmp/cooklog-t20260730-001-qa \
Scripts/run-xctest.sh
```

결과:

- 종료 코드: 65
- 전체 테스트: 33개
- 통과: 30개
- 실패: 3개
- skip: 0개
- `xcresult`: `Failed`
- runner 재시작: 발생

실패 테스트:

1. `SwiftDataRecipeLocalDataSourceTests.testDeleteRecipe()`
   - `Test crashed with signal trap.`
2. `SwiftDataRecipeLocalDataSourceTests.testFetchRecipesSortsByUpdatedAtDescending()`
   - `Crash: CookLog`
3. `SwiftDataRecipeLocalDataSourceTests.testSaveAndFetchRecipe()`
   - `Crash: CookLog`

Artifact:

- `/private/tmp/cooklog-t20260730-001-qa/20260730-151107-89145/xcodebuild.log`
- `/private/tmp/cooklog-t20260730-001-qa/20260730-151107-89145/CookLogTests.xcresult`

## 5. 발견 결함

### QA-HIGH-001: 확정 CI destination에서 SwiftData 테스트 3개 crash

T-004의 Xcode 26.6·iPhone 15·iOS 17.2에서는 전체 33개 테스트가 통과했지만, 이 Task가 확정한 Xcode 26.6·iPhone 17·iOS 26.5에서는 SwiftData 저장소 테스트 3개가 crash했다.

영향:

- `ios-xctest` check가 현재 계약 그대로 구현되면 실패한다.
- 후속 `T-20260730-003`이 성공 기준을 만족할 수 없다.
- `T-20260730-002`, `003`이 이 계약을 완료된 선행 기준으로 사용할 수 없다.
- required check 적용 준비를 진행할 수 없다.

심각도: 높음

분류: CI 계약 환경 회귀 / SwiftData runtime 호환성

## 6. 재작업 요구사항

Development Lead Agent가 다음 범위를 재조율해야 한다.

1. iOS 26.5에서 발생하는 SwiftData 저장소 테스트 crash 원인을 진단한다.
2. 제품·테스트 결함이면 별도 허용 경로를 가진 iOS 수정 Task로 분리하고 수정한다.
3. 환경 계약 문제이면 GitHub-hosted image가 실제 제공하는 대체 Xcode·runtime·device 조합을 공식 근거와 함께 다시 선정하고 Product Owner 승인을 받는다.
4. 선정된 계약 destination에서 전체 33개 XCTest 종료 코드 0을 확보한다.
5. 정적 preflight, timeout 124, artifact 계약은 유지하고 수정 계약을 다시 iOS QA에 인계한다.

## 7. 최종 판정

`FAIL`.

공식 runner·Xcode·Simulator 정보와 문서 계약 자체는 정합하지만, 확정 destination에서 전체 XCTest가 30/33으로 실패했다. 이 계약을 후속 workflow 구현의 완료된 선행 기준으로 승인할 수 없다.

## 8. 다음 Agent에게 전달할 말

```text
Task: T-20260730-001
현재 상태: rework_requested
검증 판정: FAIL
다음 담당: Development Lead Agent / Lead Role
결함:
- QA-HIGH-001: iPhone 17·iOS 26.5에서 SwiftDataRecipeLocalDataSourceTests 3개 crash
필수 조치:
- iOS 26.5 SwiftData crash 원인 진단
- 제품/테스트 수정 Task 또는 공식 hosted 대체 환경 재선정
- 확정 destination에서 전체 33개 통과 후 재인계
QA 보고서:
- .ai_project/qa/T-20260730-001_define-ios-ci-environment-and-check-contract-qa.md
```
