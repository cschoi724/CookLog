# T-20260731-003 iOS 독립 QA 요청

작성일: 2026-07-31
작성자: iOS Agent
대상 Task: `T-20260731-003`
상태: `verification_ready`

## 검증 대상

- `.github/workflows/ios-build.yml`
- `.github/workflows/ios-xctest.yml`
- `docs/GIT_WORKFLOW.md`
- `apps/ios/docs/TESTING.md`
- `.ai_project/reports/T-20260731-003_optimize-github-actions-usage-report.md`

## 필수 판정

1. iOS runtime-impact 경로가 두 workflow에서 동일하게 `true`인지 확인한다.
2. 문서·Task·Backend·Design만 바뀌면 required job은 Linux에서 성공하고
   macOS·Xcode·Simulator·artifact 단계를 실행하지 않는지 확인한다.
3. 혼합 변경은 iOS 경로 하나만 포함해도 `macos-26`으로 라우팅되는지 확인한다.
4. 판정 API·job 실패와 유효하지 않은 output이 required job 실패인지 확인한다.
5. check 이름 `ios-build`, `ios-xctest`와 T-006 등록 후보가 유지되는지 확인한다.
6. `workflow_dispatch`는 두 workflow 모두 전체 macOS 검증인지 확인한다.
7. 같은 PR의 이전 동일 workflow만 취소되고 다른 PR·workflow는 유지되는지 확인한다.
8. build·build-for-testing·33/33과 실패 65·timeout 124·artifact 경계에
   회귀가 없는지 확인한다.

## 역할 경계

- iOS QA Agent: WP-1~5 독립 검증과 판정
- AI Ops Agent: WP-6~7 수동·야간·사용량·Budget·required check 운영 검증
- repository ruleset·Budget 설정 변경: 이 Task의 iOS Agent 범위 아님

## 인계

```text
Task: T-20260731-003
현재 상태: verification_ready
다음 담당: iOS QA Agent / Verification Role
검증 범위: WP-1~5
운영 후속: WP-6~7 AI Ops Agent
required check 후보: ios-build, ios-xctest
```
