# Current Agent Context

작성일: 2026-07-01  
프로젝트: CookLog  
상태: Draft

## 1. 목적

이 문서는 Agent가 세션을 시작하거나 재개할 때 가장 먼저 확인할 현재 운영 컨텍스트를 요약합니다.

실제 실행 기준은 `.ai_project/tasks/`의 Task 파일입니다. 이 문서는 현재 초점과 주의사항을 빠르게 파악하기 위한 안내판입니다.

## 2. 현재 운영 상태

| 항목 | 값 |
|---|---|
| 현재 운영 모드 | AI Agent 운영 마이그레이션 초기화 |
| 활성 Agent | PM Agent, Development Agent, QA Agent, AI Ops Agent |
| 현재 우선 Task | 없음 |
| 다음 확인 위치 | `.ai_project/ops_migration_plan.md`, `.ai_project/source_of_truth.md`, `.ai_project/tasks/` |
| Lock timeout | 240분 |

## 3. 현재 주의사항

- AI Ops Agent는 제품 Task 실행 라인에 참여하지 않고, 운영 프로세스 문제를 `.ai_project/ops_issues.md`에 기록합니다.
- CookLog의 기존 루트/플랫폼별 문서는 삭제하거나 대체하지 않고 source of truth로 연결합니다.
- 현재 `.ai_project/tasks/`에는 실행 가능한 제품 Task가 없습니다.
- PM Agent가 첫 제품 Task를 만들기 전까지 Development Agent와 QA Agent는 임의로 구현/검증 Task를 시작하지 않습니다.
- 루트 `docs/PROJECT_STATUS.md`와 `apps/ios/docs/STATUS.md` 사이에 현재 iOS 진행 상태 차이가 있으므로 PM Agent의 상태 동기화가 필요합니다.

## 4. 세션 시작 체크

1. `git status -sb`를 확인합니다.
2. `.ai/workflow.md`와 `.ai/task_queue.md`를 확인합니다.
3. 이 문서를 확인합니다.
4. `.ai_project/source_of_truth.md`에서 기준 문서를 확인합니다.
5. `.ai_project/tasks/`에서 자신의 역할 또는 capability와 맞는 Task를 확인합니다.
6. Task의 `status`, `approved_by`, `depends_on`, `locked_by`, `allowed_paths`, `source_of_truth`를 확인한 뒤 진행합니다.
7. 실행 전 lock을 획득하고 하나의 Task만 진행합니다.

## 5. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | 현재 Agent 컨텍스트 문서 초기화 |
