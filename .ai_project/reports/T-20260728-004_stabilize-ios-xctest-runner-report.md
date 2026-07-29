# T-20260728-004 작업 보고서

작성일: 2026-07-28
작성자: iOS Agent
Task: iOS XCTest runner 대기 원인 조사와 테스트 실행 안정화

## 결과

전체 XCTest의 병렬 worker를 비활성화하고 단일 worker, 기본 600초 제한, 로그와 `xcresult` 보존 절차를 확정했다. SwiftData mapper 테스트의 실제 저장 조건 불일치를 수정한 뒤 전체 33개 테스트를 같은 destination에서 3회 연속 통과했다.

## 진단

- 과거 Xcode 15.2 실행은 `waiting for workers to materialize`에서 종료되지 않았다.
- 현재 Mac에는 Xcode 26.6만 설치되어 있어 Xcode 15.2의 동일 toolchain 재현은 불가능했다.
- 공유 scheme의 테스트 타겟은 `parallelizable = YES`였고 현재 환경에서도 기본 실행이 여러 Simulator clone worker를 생성했다.
- Xcode 26.6의 기본 전체 실행은 약 48초 안에 종료됐지만 `RecipePersistenceMapperTests` 2건이 crash했다.
- crash diagnostics는 두 테스트 모두 unmanaged `PersistentRecipe.ingredients` relationship getter의 `SIGTRAP`을 가리켰다.
- Test Host, Bundle Loader, simulator signing과 bundle identifier에는 runner 실행을 막는 설정 오류가 없었다.

## 변경 범위

- `apps/ios/CookLog.xcodeproj/xcshareddata/xcschemes/CookLog.xcscheme`
  - `CookLogTests` 병렬 실행 비활성화
- `apps/ios/CookLogTests/RecipePersistenceMapperTests.swift`
  - persistent model을 in-memory `ModelContainer`에 삽입한 뒤 relationship 검증
- `apps/ios/Scripts/run-xctest.sh`
  - 단일 worker 전체 XCTest 실행
  - 기본 600초 timeout과 종료 코드 124
  - 실행별 `xcodebuild.log`, `CookLogTests.xcresult`, timeout marker 보존
- iOS README, Testing, Status, Development Plan, Decisions, Changelog
  - 표준 실행 명령, 진단 근거, 반복 결과와 CI 인계 기준 기록
- 루트 Project Status, Project Changelog
  - 전체 프로젝트 상태 동기화

## 개발자 검증

환경:

- Xcode 26.6 (`17F113`)
- iPhone 15 Simulator
- iOS 17.2 (`21C62`)

결과:

| 항목 | 결과 |
|---|---|
| 전체 XCTest 1회 | 33/33 통과, 종료 코드 0, 22.493초 |
| 전체 XCTest 2회 | 33/33 통과, 종료 코드 0, 20.917초 |
| 전체 XCTest 3회 | 33/33 통과, 종료 코드 0, 20.781초 |
| scheme 직렬 `test-without-building` | 성공, 종료 코드 0 |
| `build` | 성공, 종료 코드 0 |
| `build-for-testing` | 성공, 종료 코드 0 |
| 1초 timeout smoke test | 종료 코드 124, 로그 보존 |
| `bash -n Scripts/run-xctest.sh` | 통과 |
| `git diff --check` | 통과 |

개발자 반복 실행 artifact:

- `/private/tmp/cooklog-t004-script-check/20260728-162520-72557/`
- `/private/tmp/cooklog-t004-repeat-2/20260728-163003-78177/`
- `/private/tmp/cooklog-t004-repeat-3/20260728-163224-81100/`

## CI 인계

- `T-20260728-008`의 `ios-xctest` check는 `apps/ios/Scripts/run-xctest.sh`를 실행한다.
- Hosted Runner의 설치 runtime에 맞게 `COOKLOG_XCTEST_DESTINATION`을 지정한다.
- `COOKLOG_XCTEST_TIMEOUT_SECONDS=600`을 유지하고 workflow job timeout은 15분을 권장한다.
- 성공/실패와 무관하게 `xcodebuild.log`, `CookLogTests.xcresult`, `TIMED_OUT` marker를 artifact로 업로드한다.

## 잔여 위험

- Xcode 15.2 설치본이 없어 과거 worker 대기 증상을 동일 toolchain에서 다시 확인하지 못했다.
- 현재 검증은 Xcode 26.6과 iOS 17.2 Simulator 조합이다.
- 공식 toolchain 변경 여부는 이 Task에서 결정하지 않았으며 별도 승인 대상이다.

## 최신 develop 통합 재검증

2026-07-29 최신 `origin/develop` `abfdcf0`을 기존 T-004 브랜치에 merge했다.

- 최신 제품 출시 계획과 T-004 구현·독립 QA·위험 수용 기록을 함께 보존했다.
- T-004의 선행 조건에 완료된 `T-20260729-001`을, 차단 대상에 `T-20260728-009`를 추가했다.
- T-004는 PR merge 전이므로 `completion_review`를 유지했다.
- Task 20개의 YAML front matter, ID 중복, 누락 의존성·차단 참조와 순환을 검사해 통과했다.
- `git diff --check`, `bash -n Scripts/run-xctest.sh`를 통과했다.
- 전체 XCTest 33개를 1회 재실행해 33개 통과, 0개 실패와 종료 코드 0을 확인했다.

재검증 artifact:

- `/private/tmp/cooklog-t004-merge-validation/20260729-155629-64488/xcodebuild.log`
- `/private/tmp/cooklog-t004-merge-validation/20260729-155629-64488/CookLogTests.xcresult`

프로젝트 전체 strict validator는 T-004 밖의 기존 운영 문서 front matter와 archive Task schema 누락을 보고했다. `.ai_project/tasks` 디렉터리 검사와 별도 Task graph 검사는 통과했으며 이 기존 운영 문서 이슈는 T-004 구현·QA 판정을 변경하지 않는다.

## 다음 Agent에게 전달할 말

```text
Task: T-20260728-004
현재 상태: verification_ready
검증 담당: iOS QA Agent
Worktree: /private/tmp/cooklog-t004
표준 명령:
  cd apps/ios
  Scripts/run-xctest.sh
필수 확인:
- 종료 코드 0
- 전체 33개 테스트 통과
- 600초 안에 명확히 종료
- xcodebuild.log와 CookLogTests.xcresult 생성
- 1초 timeout override에서 종료 코드 124와 로그 생성
검증 결과 위치:
- .ai_project/qa/T-20260728-004_stabilize-ios-xctest-runner-qa.md
```
