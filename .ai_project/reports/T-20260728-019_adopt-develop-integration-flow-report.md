# T-20260728-019 실행 보고

작성일: 2026-07-28
작성자: AI Ops Agent
판정: `done`

## 변경 내용

- 일반 Task의 기준과 PR 대상을 `develop`로 변경했다.
- `main`을 릴리즈 가능한 안정 브랜치로 정의했다.
- `develop -> main` 통합 검증·승격 절차를 추가했다.
- `hotfix/* -> main -> develop` 역반영 절차를 추가했다.
- `main`과 `develop`의 직접 commit/push 금지 기준을 일치시켰다.
- 기존 미커밋 디자인·제품 변경과 분리된 worktree에서 전환했다.

## 검증

- 정책 문서의 `base_branch`, `stable_branch`, PR 대상과 명령 예시 정합성 확인
- `main` 직접 작업을 권장하는 현재 기준 문구가 남지 않았는지 검색
- `git diff --check`
- `aiops knowledge lint`
- `aiops doctor --strict` 경고 분류
- GitHub PR의 head SHA와 merge 가능 상태 확인

## 잔여 운영 항목

- `ios-build`와 `ios-xctest` CI 구축 및 branch protection 적용은 기존 Task에서 진행한다.
- 진행 중인 디자인·수익화 변경은 전환 후 `develop` 기반 Task 브랜치로 분리한다.
- GitHub 기본 브랜치 변경이 저장소 설정에서 별도 권한을 요구하면 Product Owner 권한으로 적용한다.
