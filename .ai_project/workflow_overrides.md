# Workflow Overrides

작성일: 2026-07-01
프로젝트: CookLog
상태: Active

## 1. 목적

이 문서는 CookLog 프로젝트에서 `.ai/workflows/` 기본 workflow와 다르게 운영해야 하는 예외를 기록합니다.

## 2. 현재 예외

공통 workflow 자체를 대체하는 예외는 없습니다. CookLog 저장소의 상태 일관성과 Git 안전을 위한 프로젝트 로컬 guardrail은 3절을 따릅니다.

기본 workflow:

| Task 유형 | 기준 workflow |
|---|---|
| 신규 기능 또는 기능 확장 | `.ai/workflows/feature.md` |
| 버그 수정 | `.ai/workflows/bugfix.md` |
| 문서 작업 | `.ai/workflows/docs.md` |
| 배포 준비 | `.ai/workflows/release.md` |
| 운영 마이그레이션 | `.ai/workflows/ops_migration.md` |

## 3. CookLog 운영 메모

- 상태 조회와 일반 Task 시작 전 다음 preflight를 수행합니다.

```bash
git status -sb
git branch --show-current
git fetch origin develop
git rev-parse --short origin/develop
git rev-list --left-right --count origin/develop...HEAD
git merge-base --is-ancestor origin/develop HEAD
```

- 상태 보고에는 `public_source: origin/develop@<SHA>`, worktree 경로, branch, local HEAD, 공용·로컬 Task 상태, 미커밋 여부를 구분해 기록합니다.
- 공용 Task와 Board 상태는 `git show origin/develop:.ai_project/task_board.md`와 `git show origin/develop:<TASK_FILE>`로 확인합니다. 루트 WIP, 오래된 로컬 `develop`, Task worktree 파일을 공용 현재 상태로 사용하지 않습니다.
- 새 worktree 또는 아직 변경하지 않은 깨끗한 worktree가 최신 `origin/develop`을 포함하지 않으면 최신 기준으로 다시 준비한 뒤 시작합니다.
- 이미 실행 중이거나 미커밋 변경이 있는 worktree가 최신 `origin/develop`을 포함하지 않으면 작업을 보존하고 중단 보고합니다. 자동 `reset`, `rebase`, `stash`로 재정렬하지 않습니다.
- fetch 또는 SHA 확인에 실패하면 `PUBLIC_STATE_UNVERIFIED`, 전용 worktree가 없으면 `WORKTREE_REQUIRED`로 보고하고 Task 착수와 의존성 판단을 중단합니다.
- `approved`, dependency·blocks 변경, `rework_requested`, 최종 `done`, 후속 Task 차단 해제는 `develop` 병합 후에만 공용 효력이 있습니다. `in_progress`나 로컬 검증 상태는 다른 Task의 의존성을 해제하지 않습니다.
- 별도 비파괴 감사와 Product Owner 승인 전에는 worktree 또는 branch를 삭제하지 않습니다.
- iOS 구현 Task는 기본적으로 `apps/ios/`로 `allowed_paths`를 제한합니다.
- Backend 구현 Task는 코드 경로와 API 계약 source of truth를 확정한 뒤 승인합니다.
- Android 구현 Task는 Android Workstream 활성화에 대한 사용자 승인 전까지 생성하지 않습니다.
- 제품 공통 문서 Task는 `docs/`와 루트 `AGENTS.md`를 대상으로 합니다.
- `.ai/` 수정은 사용자 승인 없이 하지 않습니다.
- 2026-08-05 이후 신규 Task는 `.ai/templates/tasks/task.md`를 사용하고 front matter에 `schema: aiops.task.v1`을 포함하며, `standard_vnext`와 필수 `scoped` 단계를 적용합니다.
- 기존 legacy Task 23개의 schema·metadata·상태 이력은 일괄 변환하지 않습니다. 해당 Task를 실제로 재개할 때 Lead Role이 별도 범위와 승인을 확인해 전환합니다.
- 구현과 독립 검증은 같은 세션이 연속 수행하지 않습니다.
- Product Lead는 상위 제품 Task, Design Lead는 Design 하위 Task, Development Lead는 개발 하위 Task의 Completion Role만 담당합니다.
- Verification Agent는 `verification_passed` 이후 Task의 `target_agent`를 해당 하위 Task의 Team Lead로 지정합니다.
- Team Lead가 하위 Task를 `done`으로 전환한 뒤, 모든 `depends_on`이 해소된 상위 제품 Task만 Product Lead에게 `completion_review`로 인계합니다.
- 별도 QA Lead는 활성화하지 않고 Design/iOS/Backend QA Agent를 Task별로 라우팅합니다.
- 일반 Task 브랜치는 최신 `develop`에서 생성하고 `develop` 대상 PR로 병합합니다.
- `main` 대상 PR은 통합 QA와 Product Lead 수용 검토를 통과한 `develop -> main` 승격 또는 승인된 `hotfix/*`로 제한합니다.
- hotfix를 `main`에 병합하면 같은 변경을 `develop`에 backport합니다.

## 4. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | Workflow Overrides 문서 초기화 |
| 2026-07-27 | 멀티팀 vNext 신규 Task 운영 메모 추가, override 없음 유지 |
| 2026-07-28 | 상위/하위 Task Completion 라우팅과 도메인별 QA 병렬 운영 규칙 추가 |
| 2026-07-28 | `develop` Task 통합, `main` 승격과 hotfix backport 라우팅 추가 |
| 2026-07-31 | T-20260731-002에서 최신 `origin/develop` 공용 상태 preflight, 상태 보고 형식, stale worktree 중단과 삭제 동결 규칙 추가 |
| 2026-08-05 | Core 0.9.0 기준 신규 Task schema 적용과 legacy Task 단계적 전환 정책 추가 |
