# T-20260728-007 독립 QA 보고서

작성일: 2026-07-28
작성자: iOS QA Agent
대상 Task: `T-20260728-007`
판정: `PASS`

## 0. 브랜치 재정렬 재검증

2026-07-28 최신 `origin/main` 기준 재정렬 결과를 다시 검증했다.

- 최신 `origin/main`: `aa500bd`
- 재정렬된 구현 커밋: `c69f131`
- 재정렬된 QA 커밋: `0731f9e`
- `merge-base origin/main HEAD`: `aa500bd`
- `c69f131`의 부모: `aa500bd`
- `0731f9e`의 부모: `c69f131`
- 기존 구현 커밋 `d52d168`과 `c69f131`의 stable patch-id: `1e628dec6eed9c82abd90074eef4539c323fca41`
- 기존 QA 커밋 `ac50258`과 `0731f9e`의 stable patch-id: `5bdec7d98754bcbfaf62c1da3a024fb42d487e8a`
- `origin/main...HEAD` 변경 파일: 11개
- 변경 파일 11개 모두 Task의 `allowed_paths` 안에 있음
- `git diff --check origin/main...HEAD`: 통과
- push, PR, merge: 수행하지 않음

기존 구현과 QA patch는 변경 없이 최신 `origin/main` 위로 재정렬됐으며 `QA-RISK-007-001`은 해소됐다.

## 1. 검증 대상

- Task 커밋: `d52d168` (`docs: Git PR 운영 기준 단일화 (T-20260728-007)`)
- Task 변경 기준: `b406b74..d52d168`
- 확인 문서:
  - `docs/GIT_WORKFLOW.md`
  - `.ai_project/branch_pr_strategy.md`
  - `.ai_project/operating_model.md`
  - `.ai_project/source_of_truth.md`
  - `docs/PROJECT_DECISIONS.md`
  - `docs/PROJECT_CHANGELOG.md`
  - Task, 작업 보고서, Project/Development board

## 2. 검증 결과

### 변경 범위

- `b406b74..d52d168` 기준 변경 파일 10개를 확인했다.
- 10개 파일이 모두 Task의 `allowed_paths` 안에 있다.
- `git diff --check b406b74..d52d168`가 통과했다.
- 앱 구현 코드와 GitHub Actions workflow 변경은 없다.

### Git·PR 정책 정합성

- 공식 전략은 모든 기준 문서에서 `feature_branch_pr`로 일치한다.
- 브랜치 형식은 `task/<task-id>-<slug>`로 일치한다.
- 코드, 설정, 디자인 산출물과 추적 문서가 모두 PR 대상임을 확인했다.
- `main` 직접 commit/push 금지, squash merge, merge 후 브랜치 삭제 원칙이 일치한다.
- 자동 merge와 force push 금지 기준이 명시되어 있다.
- 기존 2026-06-22 `main` 직접 작업 결정은 `대체됨`으로 표시되고 2026-07-28 결정으로 연결된다.
- `.ai_project/source_of_truth.md`는 전략 선택값과 실제 절차 문서의 책임 경계를 명확히 구분한다.

### CI 기준

- 초기 check 이름은 `ios-build`로 일치한다.
- `ios-build`는 `T-20260728-008`에서 workflow를 구축하고 검증한 뒤 required check로 적용한다.
- `ios-xctest`는 `T-20260728-004`의 XCTest 안정화와 `T-20260728-008`의 CI 구축 후 Product Owner 승인으로 승격한다.
- CI 구축 전에는 Task별 build, test, 수동 QA 결과를 PR에 기록하고 검증 실패나 결과 누락 시 merge하지 않는 기준이 있다.

### 승인 경계

- push와 merge는 Product Owner 승인 후 수행한다.
- 배포 승인 권한도 Product Owner에게 유지된다.
- 긴급 수정 예외에는 명시적 사전 승인과 사유 기록이 필요하다.
- 예외 상황에서도 독립 검증과 사후 기록을 유지한다.

## 3. 초기 발견 위험과 해소

### QA-RISK-007-001: Task 브랜치 기준점이 `main`이 아님

- 현재 `origin/main`: `5815abc`
- 현재 Task 커밋의 부모: `b406b74`
- `b406b74`는 아직 `origin/main`에 포함되지 않은 `ops/role-routing-adjustment` 커밋이다.
- `b406b74..d52d168`의 Task 고유 변경은 허용 경로 10개지만, `origin/main...d52d168` 기준으로는 운영 정비 변경까지 총 28개 경로가 포함된다.
- 현재 상태에서 `main` 대상 PR을 생성하면 `T-20260728-007` 범위 밖 변경이 함께 노출될 수 있다.

심각도: 높음
분류: 병합 전 운영 위험

필수 조치:

1. `b406b74` 운영 정비 변경을 먼저 `main`에 반영한 뒤 Task PR을 만들거나,
2. `d52d168`의 Task 고유 변경과 QA 결과를 최신 `main` 기반 브랜치로 재정렬한다.
3. PR 생성 전 `origin/main...HEAD` 변경 경로가 Task의 `allowed_paths` 안에 있는지 다시 확인한다.

초기 검증 당시에는 이 조건이 충족되기 전 Task PR 생성과 merge를 진행하면 안 되는 상태였다.

### 해소 확인

- `aa500bd`가 최신 `origin/main`이며 기존 운영 정비 변경을 포함한다.
- Task 구현 커밋 `c69f131`은 `aa500bd`를 직접 부모로 가진다.
- QA 커밋 `0731f9e`은 `c69f131`을 직접 부모로 가진다.
- 기존 커밋과 새 커밋의 stable patch-id가 각각 일치한다.
- `origin/main...HEAD`의 11개 변경 경로가 모두 `allowed_paths` 안에 있다.

따라서 Task 외 운영 변경이 PR diff에 섞이던 원인은 제거됐고 `QA-RISK-007-001`을 `resolved`로 판정한다.

## 4. 검증 제외

- GitHub Actions `ios-build`, `ios-xctest` 실제 실행
- GitHub branch protection 및 required check 외부 설정
- iOS 앱 빌드, XCTest, 기능 회귀

위 항목은 Task 범위 밖이며 각각 후속 Task에서 검증해야 한다.

## 5. 최종 판정

`PASS`.

정책 문서 단일화, 기존 결정 대체, check 명칭과 승격 조건, 사용자 승인 경계는 성공 기준을 충족한다. 최신 `origin/main` 기준 재정렬과 patch 동등성, 변경 경로 범위를 재검증했으며 `QA-RISK-007-001`은 해소됐다.

## 6. 다음 Agent에게 전달할 말

```text
Task: T-20260728-007
현재 상태: completion_review
검증 판정: PASS
다음 담당: Development Lead Agent / Completion Role
확인 결과:
- 최신 origin/main aa500bd 기준 재정렬 확인
- 기존/신규 구현 및 QA 커밋 stable patch-id 일치
- origin/main...HEAD 변경 파일 11개 모두 allowed_paths 준수
- QA-RISK-007-001 resolved
QA 보고서:
- .ai_project/qa/T-20260728-007_unify-git-pr-ci-policy-qa.md
```
