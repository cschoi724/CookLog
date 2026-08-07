# Ops Decisions

작성일: 2026-07-01
프로젝트: CookLog
상태: Draft

## 1. 목적

이 문서는 CookLog의 AI Agent 운영 결정사항을 기록합니다.

제품 결정은 `docs/PROJECT_DECISIONS.md` 또는 플랫폼별 `DECISIONS.md`에 기록하고, 이 문서에는 Agent 운영 방식과 `.ai_project/` 운용 결정을 기록합니다.

## 2. 결정 기록

## 2026-07-01 - AI Ops Agent 활성화

- 상태: 적용
- 결정: CookLog 운영 마이그레이션을 위해 AI Ops Agent를 활성화합니다.
- 이유: `.ai/` 기반 Agent 운영 체계를 CookLog에 도입하고, PM/Development/QA 실행 흐름과 분리된 운영 점검 기준이 필요합니다.
- 영향: AI Ops Agent는 제품 Task 실행 라인에 참여하지 않고, 운영 이슈를 `.ai_project/ops_issues.md`에 기록합니다.
- 승인: Product Owner 요청 기반

## 2026-07-01 - `.ai/`는 저장소에서 제외하고 `.ai_project/`는 포함

- 상태: 적용
- 결정: `.ai/`는 `ai-agent-ops` 템플릿 체크아웃으로 보고 CookLog 저장소에서 제외합니다. `.ai_project/`는 CookLog 프로젝트 운영 기록으로 저장소에 포함합니다.
- 이유: 템플릿 업데이트와 프로젝트별 운영 기록을 분리해야 합니다.
- 영향: `.gitignore`에 `.ai/`를 추가하고, `.ai_project/` 문서는 추적 대상에 둡니다.
- 승인: 운영 마이그레이션 요청 범위 내 적용

## 2026-07-01 - 기존 CookLog 문서는 삭제하지 않고 source of truth로 연결

- 상태: 적용
- 결정: 제품·플랫폼 문서는 유지하고 `.ai_project/source_of_truth.md`에서 기준 문서로 연결합니다. 루트 `AGENTS.md`는 Core adapter로 관리하고 플랫폼별 `AGENTS.md`는 작업 영역 지침으로 유지합니다.
- 이유: CookLog에는 이미 루트/플랫폼별 운영 문서가 있고, AI 운영 체계는 이를 대체하지 않고 실행 큐와 Agent 협업 레이어를 추가해야 합니다.
- 영향: 기존 문서 이동, 삭제, 백업 파일 생성은 하지 않습니다.
- 승인: 운영 마이그레이션 요청 범위 내 적용

## 3. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | Ops Decisions 문서 초기화 |

## Migration Decision - 2026-07-27

| 결정 | 값 |
|---|---|
| core_version | 0.6.4 |
| apply_scope | safe_auto_fix + Product Owner 승인 수동 정합화 |
| manual_only | product code, product Docs, Task status, Role mapping, branch/PR, commit/push/deploy |

## 2026-07-27 - Guided Full 멀티팀 운영 구성 승인

- 상태: 적용
- 결정: Product, Design, Core Development, Quality, AI Ops Team을 활성화하고 iOS를 최우선, Backend를 foundation phase, Android를 deferred로 운영합니다.
- Workflow: `standard_vnext`, 모든 신규 Task에 `scoped` 필수
- Ownership / Coordination: `path_plus_domain`, `lead_coordinated_parallel`
- Board: project board와 Product/Design/Development/Quality Team board
- Branch / PR: `feature_branch_pr`, push·merge는 사용자 승인 필요
- Knowledge: `full`, 원본 문서를 대체하지 않음
- 승인: Product Owner, 2026-07-27

## 2026-07-27 - 기존 운영 기록 보존

- 상태: 적용
- 결정: 기존 완료 Task, reports, QA 결과와 제품 문서를 자동 변환하거나 삭제하지 않습니다.
- 영향: 기존 Task는 legacy 위치와 상태 이력을 유지하고 신규 Task부터 vNext 디렉터리와 상태 체계를 사용합니다.
- 승인: Product Owner, 2026-07-27

## 2026-07-28 - 계층형 Task 완료 책임과 도메인 QA 분리

- 상태: 적용
- 결정:
  - Product Lead Agent는 상위 제품 Task의 Direction/Completion을 담당합니다.
  - Design Lead Agent는 Design 하위 Task의 Lead/Completion을 담당합니다.
  - Development Lead Agent는 개발 하위 Task의 Lead/Completion을 담당합니다.
  - UI/UX Design Agent는 Design Execution을 담당합니다.
  - Design/iOS/Backend QA Agent는 각 도메인의 Verification을 담당합니다.
  - 별도 QA Lead Agent는 활성화하지 않습니다.
- 권한 제한:
  - Completion 권한은 각 Task의 `team`, `target_agent`, `target_role`, `depends_on`, `blocks`로 제한합니다.
  - Team Lead는 자신에게 라우팅된 자기 Team 하위 Task만 완료합니다.
  - Product Lead만 필수 하위 Task가 모두 완료된 상위 제품 Task를 완료합니다.
- 승인: Product Owner, 2026-07-28

## 2026-07-28 - develop 통합 브랜치와 main 승격 분리

- 상태: 적용
- 결정:
  - 일반 Task의 기준 브랜치와 PR 대상은 `develop`입니다.
  - `main`은 릴리즈 가능한 안정 상태만 유지합니다.
  - `develop -> main`은 cross-team 통합 QA, Product Lead 수용 검토와 Product Owner 승인을 거칩니다.
  - `hotfix/*`는 `main`에서 시작해 `main`에 병합하고 `develop`에 필수 backport합니다.
  - `main`과 `develop` 모두 직접 commit, push와 force push를 금지합니다.
- 전환: 기존 정책 아래 생성한 `T-20260728-019` PR을 `main`에 병합한 뒤 해당 커밋에서 `develop`을 생성합니다.
- 승인: Product Owner, 2026-07-28

## 2026-08-05 - Core 0.9.0 adapter와 schema 단계 도입

- 상태: 적용
- 결정:
  - 루트 `AGENTS.md`는 설치된 Core 0.9.0의 Codex adapter와 바이트 단위로 동일하게 유지합니다.
  - 프로젝트 고유 운영 구성은 `.ai_project/`에, 플랫폼 지침은 `apps/*/AGENTS.md`에 둡니다.
  - `operating_model.md`와 `agent_registry.md`에 Core 0.9 schema front matter를 적용합니다.
  - 2026-08-05 이후 신규 Task는 `.ai/templates/tasks/task.md`와 `schema: aiops.task.v1`을 사용합니다.
  - 기존 legacy Task 23개는 자동 변환하지 않고, 실제 재개 시 별도 승인 범위에서 전환합니다.
- 영향: 고정된 `루트 관리 에이전트` 역할을 제거하고 Task·Role 기반 라우팅을 단일 기준으로 사용합니다.
- 승인: Product Owner, 2026-08-05

## Migration Decision - 2026-08-05

| 결정 | 값 |
|---|---|
| core_version | 0.9.0 |
| apply_scope | safe_auto_fix only |
| manual_only | product code, product Docs, source_of_truth, Task metadata/status, Role mapping, branch/PR, commit/push/deploy |
| review_result | schema front matter·adapter·source of truth 정합화 승인 적용, legacy Task 자동 변환 제외 |

## Migration Decision - 2026-08-07

| 결정 | 값 |
|---|---|
| core_version | 0.11.1 |
| apply_scope | safe_auto_fix only |
| manual_only | product code, product Docs, source_of_truth, Task metadata/status, Role mapping, branch/PR, commit/push/deploy |
| review_needed | schema front matter and adapter drift are reported but not rewritten automatically |

## Migration Decision - 2026-08-07

| 결정 | 값 |
|---|---|
| core_version | 0.12.0 |
| apply_scope | safe_auto_fix only |
| manual_only | product code, product Docs, source_of_truth, Task metadata/status, Role mapping, branch/PR, commit/push/deploy |
| review_needed | schema front matter and adapter drift are reported but not rewritten automatically |
