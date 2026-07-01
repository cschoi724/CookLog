# CookLog AI Project Workspace

작성일: 2026-07-01  
프로젝트: CookLog  
상태: Draft

## 1. 목적

이 디렉토리는 CookLog 프로젝트에 종속되는 AI Agent 협업 문서 영역입니다.

`.ai/`는 여러 프로젝트에서 재사용하는 운영 가이드북이고, `.ai_project/`는 CookLog의 실제 Agent Task Queue, 운영 결정, 보고, QA 기록을 관리합니다.

## 2. 문서 목록

| 문서/폴더 | 역할 |
|---|---|
| `.ai_project/agent_registry.md` | CookLog에서 활성화된 Agent 구성 |
| `.ai_project/current_context.md` | 세션 시작 시 확인할 현재 운영 컨텍스트 |
| `.ai_project/tasks/` | Agent 실행 Task Queue |
| `.ai_project/task_board.md` | Task Queue 요약 보드 |
| `.ai_project/source_of_truth.md` | CookLog 기준 문서와 충돌 처리 기준 |
| `.ai_project/ops_decisions.md` | Agent 운영 결정 기록 |
| `.ai_project/ops_issues.md` | AI Agent 운영 프로세스 이슈와 개선 제안 |
| `.ai_project/ops_migration_plan.md` | AI Agent 운영 체계 도입 계획 |
| `.ai_project/workflow_overrides.md` | CookLog 전용 workflow 예외 |
| `.ai_project/reports/` | 개발 완료 보고 |
| `.ai_project/qa/` | QA 보고 |
| `.ai_project/release/` | 릴리즈 준비 기록 |

## 3. 운영 원칙

- `.ai_project/`는 CookLog 저장소에 포함합니다.
- `.ai/`는 `ai-agent-ops` 템플릿 체크아웃이므로 CookLog 저장소에는 포함하지 않습니다.
- `.ai/` 운영 원칙과 `.ai_project/` 상태 문서가 충돌하면 운영 원칙은 `.ai/`를 우선합니다.
- Agent 실행 지시는 `.ai_project/tasks/`의 Task 파일을 우선합니다.
- 제품, 기술, 플랫폼별 상태는 `.ai_project/source_of_truth.md`에 지정된 기존 CookLog 문서를 우선합니다.
- AI Ops Agent는 제품 Task 실행 라인에 참여하지 않고 운영 프로세스 문제를 `.ai_project/ops_issues.md`에 기록합니다.

## 4. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | `.ai_project/` 초기화 |
