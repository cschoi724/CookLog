# CookLog 루트 Agent 안내

이 문서는 CookLog 저장소에서 작업하는 Agent가 담당 범위와 최신 기준 문서를 빠르게 찾기 위한 최상위 안내서입니다.

제품 정책, 화면 요구사항, 기술 결정, 현재 Task 상태를 이 문서에 복제하지 않습니다. 세부 내용은 아래 Source of Truth를 직접 확인합니다.

## 1. 루트 관리 역할

루트 관리 Agent는 다음을 담당합니다.

- 제품 방향과 출시 우선순위 조율
- 제품·디자인·개발·QA Task의 의존성과 책임 경계 관리
- 공통 문서 구조와 Source of Truth 정합성 관리
- Team별 결과의 제품 기준 수용 검토
- 하위 Agent가 추가 구두 설명 없이 작업할 수 있도록 기준 문서와 Task 인계 유지

플랫폼 구현 코드는 해당 플랫폼 Agent가 담당합니다. 루트 관리 Agent는 별도 요청이나 Task 배정 없이 앱 구현 코드를 직접 수정하지 않습니다.

## 2. 세션 시작 순서

모든 Agent는 작업 전에 다음 순서로 현재 기준을 확인합니다.

1. `git status -sb`
2. `git branch --show-current`
3. `.ai/runtime/workflow.md`
4. `.ai_project/operating_model.md`
5. `.ai_project/current_context.md`
6. `.ai_project/source_of_truth.md`
7. `.ai_project/task_board.md`
8. 자신에게 배정된 `.ai_project/tasks/`의 Task 파일
9. 담당 영역의 Team board와 세부 기준 문서

전용 worktree에 `.ai`가 없으면 원본 workspace의 `.ai/runtime/workflow.md`를 확인합니다. `.ai_project/`는 현재 worktree의 파일을 사용합니다.

Task 파일과 요약 보드가 다르면 Task 파일을 우선하고, 오래된 요약 문서는 별도 문서 정합성 작업으로 갱신합니다.

## 3. Source of Truth

최종 기준과 충돌 처리 순서는 `.ai_project/source_of_truth.md`를 따릅니다.

주요 진입점:

| 영역 | 먼저 확인할 문서 |
|---|---|
| 제품 방향 | `docs/product/CookLog_PRODUCT.md` |
| 상세 제품 요구사항 | `docs/product/CookLog_PRD_v2.md` |
| 출시 범위 | `docs/product/CookLog_MVP_SCOPE.md` |
| 사용자 흐름 | `docs/product/CookLog_USER_FLOW.md` |
| 화면 구조 | `docs/product/CookLog_WIREFRAME.md` |
| 출시 계획 | `docs/product/CookLog_ROADMAP.md` |
| 공통 결정 | `docs/PROJECT_DECISIONS.md` |
| 전체 진행 상태 | `docs/PROJECT_STATUS.md` |
| UI/UX 기준 | `.ai_project/source_of_truth.md`의 UI/UX 원본 항목 |
| Git·PR 절차 | `docs/GIT_WORKFLOW.md` |
| 현재 Task 상태 | 개별 `.ai_project/tasks/` 파일과 `.ai_project/task_board.md` |

사용자의 최신 승인 결정이 문서보다 우선합니다. 승인된 변경은 제품 결정 문서와 관련 Task에 반영해 다음 세션에서도 추적 가능하게 유지합니다.

## 4. Team별 작업 진입점

### Product

- `.ai_project/teams/product/task_board.md`
- `docs/product/`
- `docs/PROJECT_STATUS.md`
- `docs/PROJECT_DECISIONS.md`

### Design

- `.ai_project/teams/design/task_board.md`
- `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`
- `.ai_project/source_of_truth.md`의 UI/UX 기준
- 실행 대상 Design Task의 `source_of_truth`와 `allowed_paths`

### Core Development

- `.ai_project/teams/development/task_board.md`
- 실행 대상 Development Task의 `source_of_truth`와 `allowed_paths`
- 플랫폼 또는 Backend 세부 문서

### Quality

- `.ai_project/teams/quality/task_board.md`
- 실행 대상 Task의 `qa_to`
- 담당 도메인의 QA·Testing 문서

### AI Ops

- `.ai_project/operating_model.md`
- `.ai_project/agent_registry.md`
- `.ai_project/branch_pr_strategy.md`
- `.ai_project/ops_issues.md`

## 5. 플랫폼별 기준

### iOS

iOS 작업은 다음 문서를 우선 확인합니다.

1. 실행 대상 `.ai_project/tasks/` 파일
2. Task가 지정한 제품·디자인 Source of Truth
3. `apps/ios/agents.md`
4. `apps/ios/docs/STATUS.md`
5. `apps/ios/docs/DEVELOPMENT_PLAN.md`

iOS Agent는 원칙적으로 `apps/ios/` 안에서 구현합니다. 루트 공용 문서 변경이 필요하면 Task의 `allowed_paths`와 담당 Lead의 조율을 먼저 확인합니다.
플랫폼 문서의 제품 범위가 실행 Task나 최신 제품 Source of Truth와 다르면 제품 문서를 우선하고 충돌을 보고합니다.

### Backend

Backend 작업은 실행 Task와 `.ai_project/source_of_truth.md`의 Backend 기준을 먼저 확인합니다. 승인된 아키텍처·API 계약 문서가 생기면 해당 문서를 구현 기준으로 사용합니다.

### Android

Android 작업은 `apps/android/agents.md`와 `apps/android/docs/`를 따릅니다. 활성화 시점과 우선순위는 최신 Roadmap과 Task Board에서 확인합니다.

## 6. 작업 및 Git 원칙

- Git 운영은 `docs/GIT_WORKFLOW.md`와 `.ai_project/branch_pr_strategy.md`를 따릅니다.
- 일반 Task는 최신 `origin/develop` 기반 전용 worktree에서 수행합니다.
- 현재 루트 WIP 작업 폴더를 일반 Task 구현에 사용하지 않습니다.
- 자신에게 배정된 Task의 `allowed_paths`만 수정합니다.
- 사용자 변경사항과 다른 Agent의 worktree를 임의로 수정하거나 되돌리지 않습니다.
- Task 상태 전이, commit, push, PR, merge와 외부 배포는 현재 승인 범위를 확인한 뒤 수행합니다.
- 작업 완료 후 관련 상태·결정·검증 문서의 갱신 필요성을 확인합니다.

## 7. 문서 유지 원칙

- 문서는 한글을 기본으로 작성합니다.
- 제품 세부 정책을 이 루트 안내에 중복 기록하지 않습니다.
- 변동 가능한 값, 기능 범위, 현재 진행률과 기술 선택은 담당 Source of Truth에만 기록합니다.
- 루트 안내에는 역할, 탐색 경로, 우선순위 규칙과 책임 경계만 유지합니다.
- 문서 간 충돌을 발견하면 임의 해석으로 숨기지 않고 최종 기준, 영향 범위와 정리 필요 항목을 보고합니다.
