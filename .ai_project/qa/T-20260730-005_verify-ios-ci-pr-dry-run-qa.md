# T-20260730-005 iOS 독립 QA 요청

작성일: 2026-07-31
작성자: iOS Agent
대상 Task: `T-20260730-005`
상태: `verification_ready`

## 검증 대상

- 정상 draft PR: [#36](https://github.com/cschoi724/CookLog/pull/36)
- build 실패 검증 PR: [#37](https://github.com/cschoi724/CookLog/pull/37)
- XCTest 실패 검증 PR: [#38](https://github.com/cschoi724/CookLog/pull/38)
- timeout 검증 PR: [#39](https://github.com/cschoi724/CookLog/pull/39)
- 실행 보고서:
  `.ai_project/reports/T-20260730-005_verify-ios-ci-pr-dry-run-report.md`

## 독립 확인 항목

- PR #36의 `ios-build` run `30603291076`, `ios-xctest` run
  `30603291074`가 성공하고 XCTest가 33/33인지
- PR #37의 `ios-build` run `30603556803`이 build 실패 65를 보존하고
  동반 `ios-xctest` run `30603556798`은 성공하는지
- PR #38의 run `30603771271`이 실제 XCTest assertion 1건 실패,
  전체 33개, 종료 코드 65와 실패 xcresult를 보존하는지
- PR #39의 run `30603584038`이 timeout 124와 `TIMED_OUT`을 보존하는지
- concurrency probe run `30603789373`, `30603789377`이 각각
  `cancelled`이고 최신 run과 다른 PR은 유지되는지
- check 이름이 정확히 `ios-build`, `ios-xctest`인지
- 정상·실패 artifact의 환경·summary·log·조건부 xcresult·marker 경계와
  14일 보존이 계약과 일치하는지
- 검증 PR #37~#39가 모두 `closed`, `merged: false`인지
- T-006 required check 외부 설정에 넘길 차단 결함이나 잔여 위험이 있는지

## 인계

```text
Task: T-20260730-005
현재 상태: verification_ready
다음 담당: iOS QA Agent / Verification Role
정상 후보: PR #36
검증 전용: PR #37~#39, 모두 미병합 종료
required check 후보: ios-build, ios-xctest
```
