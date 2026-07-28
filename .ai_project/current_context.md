# Current Agent Context

작성일: 2026-07-01
최종 업데이트: 2026-07-27
프로젝트: CookLog
상태: Active

## 1. 목적

이 문서는 Agent가 세션을 시작하거나 재개할 때 가장 먼저 확인할 현재 운영 컨텍스트를 요약합니다.

실제 실행 기준은 `.ai_project/tasks/`의 Task 파일입니다. 이 문서는 현재 초점과 주의사항을 빠르게 파악하기 위한 안내판입니다.

## 2. 현재 운영 상태

| 항목 | 값 |
|---|---|
| 현재 운영 모드 | `multi_team`, core `0.6.4` |
| 활성 Team | Product, Design, Core Development, Quality, AI Ops |
| 활성 개발 영역 | iOS 최우선, Backend foundation |
| 보류 영역 | Android, Release Role |
| 활성 Agent | Product Lead, Product Planning, Design, Development Lead, iOS, Backend, QA, AI Ops |
| 현재 우선 Task | 없음 |
| 다음 확인 위치 | `.ai_project/operating_model.md`, `.ai_project/source_of_truth.md`, `.ai_project/task_board.md` |
| Lock timeout | 240분 |

## 3. 현재 주의사항

- AI Ops Agent는 제품 Task 실행 라인에 참여하지 않고, 운영 프로세스 문제를 `.ai_project/ops_issues.md`에 기록합니다.
- CookLog의 기존 루트/플랫폼별 문서는 삭제하거나 대체하지 않고 source of truth로 연결합니다.
- `T-20260701-001`, `T-20260701-002`, `T-20260701-003`은 모두 `done`입니다.
- iOS MVP Core Loop는 조건부 통과 상태입니다.
- 기존 완료 Task는 legacy 위치에 보존하고 신규 실행 후보는 `tasks/active/` 또는 `tasks/backlog/`에 생성합니다.
- 모든 신규 실행 Task는 `standard_vnext`와 `scoped` 단계를 사용합니다.
- Task 병렬 가능 여부는 Development Lead Agent가 ownership과 dependency를 확인합니다.
- push, merge, 배포는 사용자 승인 후 진행합니다.
- `docs/GIT_WORKFLOW.md`와 신규 Branch/PR 전략, 기존 `agents.md`와 adapter 지침의 동기화는 후속 운영 결정입니다.

## 4. 세션 시작 체크

1. `git status -sb`를 확인합니다.
2. `.ai/runtime/workflow.md`와 `.ai/runtime/task_queue.md`를 확인합니다.
3. `.ai_project/operating_model.md`에서 활성 Team과 Role을 확인합니다.
4. 이 문서와 `.ai_project/source_of_truth.md`를 확인합니다.
5. `.ai_project/tasks/active/`와 legacy Task 중 현재 Role에 라우팅된 실행 후보를 확인합니다.
6. Task의 `workflow`, `status`, `approved_by`, `depends_on`, `locked_by`, `allowed_paths`, `source_of_truth`를 확인합니다.
7. 실행 가능한 Task면 lock을 획득하고 하나의 Task만 진행합니다.

## 5. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | 현재 Agent 컨텍스트 문서 초기화 |
| 2026-07-27 | iOS MVP Core Loop 조건부 통과와 새 클론 전환 준비 상태 반영 |
| 2026-07-27 | core 0.6.4 멀티팀 운영과 Role 기반 세션 시작 기준 반영 |
