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
- 결정: 기존 `agents.md`, `docs/`, `apps/*/docs/` 문서를 유지하고 `.ai_project/source_of_truth.md`에서 기준 문서로 연결합니다.
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
