# T-20260730-005 실행 보고서

작성일: 2026-07-31
작성자: iOS Agent
상태: `verification_ready`

## 결과

실제 GitHub Actions에서 정상·build 실패·XCTest assertion 실패·timeout을
분리 실행했다. 두 check 이름과 실패 코드, 진단 artifact, 같은 PR의 이전 실행
취소가 계약대로 동작했다. 실패 fixture는 workflow에만 두었고 검증 PR 3개는
`develop`에 병합하지 않고 닫았다.

## 실제 PR 검증

| 경로 | PR | `ios-build` | `ios-xctest` | 판정 |
|---|---:|---|---|---|
| 정상 Task | [#36](https://github.com/cschoi724/CookLog/pull/36) | run `30603291076` 성공 | run `30603291074` 성공·33/33 | 통과 |
| build 실패 | [#37](https://github.com/cschoi724/CookLog/pull/37) | run `30603556803` 실패 65 | run `30603556798` 성공·33/33 | 기대 실패 감지 |
| XCTest 실패 | [#38](https://github.com/cschoi724/CookLog/pull/38) | run `30603771279` 성공 | run `30603771271` 실패 65·32/33 | 기대 실패 감지 |
| timeout | [#39](https://github.com/cschoi724/CookLog/pull/39) | run `30603584112` 성공 | run `30603584038` 실패 124 | 기대 timeout 감지 |

정상 PR #36은 최종 병합 후보로 draft 상태를 유지한다. #37~#39는 모두
draft·미병합 상태로 닫아 실패 fixture가 `develop`에 들어가지 않도록 했다.

## 정상 경로와 artifact

정상 `ios-build`:

- `BUILD SUCCEEDED`, `TEST BUILD SUCCEEDED`
- artifact: `cooklog-ios-build-30603291076-1`
- 포함: build log 2개, `ci-environment.log`, `ci-summary.md`
- 보존 만료: 2026-08-14

정상 `ios-xctest`:

- 33개 실행, 실패 0, `TEST SUCCEEDED`
- artifact: `cooklog-ios-xctest-30603291074-1`
- 포함: `xcodebuild.log`, 전체 `CookLogTests.xcresult`,
  `ci-environment.log`, `ci-summary.md`
- 보존 만료: 2026-08-14

두 artifact 모두 실제로 내려받아 파일과 결과 내용을 확인했다. DerivedData,
secret, 사용자 입력은 포함되지 않았다.

## 실패 감지와 진단

### build 실패

workflow 환경에 알 수 없는 Swift compiler flag
`-cooklog-t005-intentional-build-failure`를 주입했다.

- `ios-build`: 종료 코드 65, `BUILD FAILED`
- `ios-xctest`: 33/33 성공
- artifact: `cooklog-ios-build-30603556803-1`
- 포함: `xcodebuild-build.log`, `ci-environment.log`, `ci-summary.md`
- 원래 build 실패가 summary·artifact 단계에서 성공으로 바뀌지 않음

### XCTest assertion 실패

workflow 실행 중 저장소 checkout의 테스트 한 줄만 의도적 `XCTFail`로
치환했다. 제품·테스트 소스 변경은 커밋하지 않았다.

- `ios-build`: 성공
- `ios-xctest`: 종료 코드 65
- 33개 실행, 1개 실패
- 실패: `CookLogTests.testAppTargetIsAvailable`
- 메시지: `T-20260730-005 intentional failure`
- artifact: `cooklog-ios-xctest-30603771271-1`
- 포함: `xcodebuild.log`, 실패 `CookLogTests.xcresult`,
  `ci-environment.log`, `ci-summary.md`

최초 fixture 커밋 `3930855`는 정규식 escaping 오류로 주입 검증 단계에서
실패했다. 이를 실제 XCTest 실패 증빙으로 사용하지 않고 `b401b2d`에서
fixture를 수정해 assertion 실패·xcresult·종료 코드 65를 다시 확인했다.

### timeout

`COOKLOG_XCTEST_TIMEOUT_SECONDS=1`을 주입했다.

- `ios-build`: 성공
- `ios-xctest`: 종료 코드 124
- console: `XCTest timed out after 1s.`
- artifact: `cooklog-ios-xctest-30603584038-1`
- 포함: `xcodebuild.log`, `TIMED_OUT`, `ci-environment.log`,
  `ci-summary.md`

hosted 1초 timeout에서는 xcodebuild가 result bundle을 만들기 전에 종료돼
부분 xcresult가 없었다. xcresult는 조건부 artifact이므로 정상이며, log와
`TIMED_OUT`, 환경·summary가 timeout 원인과 종료 코드를 보존했다.

## concurrency 실제 취소

PR #37에 probe commit 두 개를 연속 push했다.

- 이전 `ios-build` run `30603789373`: `cancelled`
- 이전 `ios-xctest` run `30603789377`: `cancelled`
- 최신 `ios-build` run `30603800964`: 기대한 build 실패 65
- 최신 `ios-xctest` run `30603800916`: 33/33 성공

두 workflow의 이전 실행이 각각 취소됐고 최신 실행은 서로를 취소하지 않았다.
동시에 존재한 다른 PR #36·#38·#39의 실행도 취소되지 않아 PR 번호와 workflow
이름을 포함한 concurrency group의 교차 격리를 확인했다.

## check gate 준비도

- 안정된 check 이름: `ios-build`, `ios-xctest`
- 정상 PR: 두 check 모두 성공
- build 실패: `ios-build`만 실패, `ios-xctest` 성공
- XCTest 실패·timeout: `ios-build` 성공, `ios-xctest` 실패
- 실패 뒤에도 environment·summary와 원인별 log·marker·조건부 xcresult 보존
- 동일 PR의 오래된 run은 취소되고 최신 run만 gate 후보로 유지

따라서 T-006에서 두 이름을 required check로 설정할 준비가 됐다. branch
protection 실제 변경은 이 Task 범위가 아니며 별도 Product Owner 승인 후
수행한다.

## 변경 파일

- `apps/ios/docs/TESTING.md`
- `.ai_project/tasks/active/T-20260730-005_verify-ios-ci-pr-dry-run.md`
- `.ai_project/reports/T-20260730-005_verify-ios-ci-pr-dry-run-report.md`
- `.ai_project/qa/T-20260730-005_verify-ios-ci-pr-dry-run-qa.md`
- `.ai_project/teams/development/task_board.md`
- `.ai_project/teams/quality/task_board.md`

실패 검증 PR에서는 각 PR의 `.github/workflows/ios-build.yml` 또는
`.github/workflows/ios-xctest.yml`만 임시 변경했으며 모두 미병합 종료했다.

## QA 요청

iOS QA Agent는 GitHub의 고정 run과 artifact를 독립 확인한다.

- PR #36의 `ios-build`, `ios-xctest` 정상 성공과 XCTest 33/33
- PR #37의 build 실패 65와 동반 XCTest 성공
- PR #38의 실제 assertion 실패 65와 실패 xcresult
- PR #39의 timeout 124와 `TIMED_OUT`
- run `30603789373`, `30603789377`의 취소와 다른 PR 교차 취소 부재
- check 이름과 artifact 이름·내용·14일 보존
- #37~#39가 `merged: false`, `closed`인지
- T-006 required check 설정 준비도와 잔여 위험
