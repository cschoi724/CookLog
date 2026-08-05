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
- 결정: 기존 `AGENTS.md`, `docs/`, `apps/*/docs/` 문서를 유지하고 `.ai_project/source_of_truth.md`에서 기준 문서로 연결합니다.
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
| apply_scope | safe_auto_fix only |
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

## 2026-08-05 - 루트 관리 에이전트 모델 폐기와 AGENTS.md 정규화

- 상태: 적용
- 결정:
  - CookLog 운영에서 별도의 `루트 관리 에이전트`를 사용하지 않습니다.
  - 저장소 루트의 `AGENTS.md`는 특정 역할을 부여하지 않고 공통 컨텍스트와 Role 라우팅만 제공합니다.
  - 루트 `AGENTS.md`는 core 0.9.0 Codex adapter와 정확히 일치시키고 CookLog 고유 맥락은 프로젝트별 source of truth에서 관리합니다.
  - 세션 Role은 사용자 지정, `.ai_project/agent_registry.md`, Task의 `target_agent`와 `target_role`로 결정합니다.
  - 루트와 플랫폼별 지침 파일명은 대문자 `AGENTS.md`로 통일합니다.
- 이유: 과거 단일 관리 세션 모델이 현행 멀티팀 Role/Capability 경계와 충돌하고 AI Ops Agent의 권한 오인을 유발했습니다.
- 영향: 제품 방향은 Product Lead, 개발 조율은 Development Lead, 검증은 도메인 Verification Agent, 운영체계 점검은 AI Ops가 담당합니다.
- 승인: Product Owner, 2026-08-05

## 2026-08-05 - Git 기준을 feature branch와 PR 흐름으로 통일

- 상태: 적용
- 결정: `docs/GIT_WORKFLOW.md`를 승인된 `feature_branch_pr` 전략과 동기화합니다.
- 권한: push와 merge는 Product Owner 승인 후 진행하고, `main` 직접 push를 금지합니다.
- 영향: `docs/GIT_WORKFLOW.md`와 `.ai_project/branch_pr_strategy.md`의 충돌을 해소합니다.
- 승인: Product Owner, 2026-08-05

## 2026-08-05 - core 0.9.0 마이그레이션 분리 후 적용

- 상태: 적용
- 결정: 역할·adapter·Git 문서 정합화와 core `0.9.0` migration-safe Apply를 분리해 검토한 뒤 승인된 안전 범위를 적용합니다.
- 이유: schema front matter와 Task metadata는 별도 판단이 필요하므로 버전 기록·필수 디렉토리·운영 기록만 먼저 동기화해야 합니다.
- 영향: core version은 `0.9.0`으로 갱신했으며 Task 상태, Role 매핑, 제품 코드와 제품 문서는 자동 변경하지 않았습니다.
- 승인: Product Owner, 2026-08-05

## Migration Decision - 2026-08-05

| 결정 | 값 |
|---|---|
| core_version | 0.9.0 |
| apply_scope | safe_auto_fix only |
| manual_only | product code, product Docs, source_of_truth, Task metadata/status, Role mapping, branch/PR, commit/push/deploy |
| review_needed | schema front matter and adapter drift are reported but not rewritten automatically |

## 2026-08-05 - 신규 Task부터 v1 schema 적용

- 상태: 적용
- 결정: 이 결정 이후 생성하는 신규 Task는 core 0.9.0의 `.ai/templates/tasks/task.md`를 기준으로 `schema: aiops.task.v1` front matter를 필수 적용합니다.
- 기존 Task 처리: 기존 Task는 legacy 이력으로 보존하고 schema와 metadata를 일괄 변환하지 않습니다.
- 운영 방식: Task를 생성하는 Agent가 템플릿 필수 필드를 작성하고 AI Ops 점검에서 `aiops validate`로 형식을 확인합니다.
- 이유: 과거 Task 이력을 불필요하게 변경하지 않으면서 신규 Task의 자동 검증 품질을 확보하기 위함입니다.
- 승인: Product Owner, 2026-08-05
