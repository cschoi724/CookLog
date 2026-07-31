# Current Agent Context

작성일: 2026-07-01
최종 업데이트: 2026-07-31
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
| 활성 Agent | Product Lead, Product Planning, Design Lead, UI/UX Design, Development Lead, iOS, Backend, Product QA, Design QA, iOS QA, Backend QA, AI Ops |
| 현재 우선 Task | Design T-012, Backend T-022~024, CI T-005 준비와 문서 정합성 T-20260731-001 |
| 기본 작업 브랜치 | `develop` |
| 안정·릴리즈 브랜치 | `main` |
| 다음 확인 위치 | `.ai_project/operating_model.md`, `.ai_project/source_of_truth.md`, `.ai_project/task_board.md` |
| Lock timeout | 240분 |

## 3. 현재 주의사항

- AI Ops Agent는 제품 Task 실행 라인에 참여하지 않고, 운영 프로세스 문제를 `.ai_project/ops_issues.md`에 기록합니다.
- CookLog의 기존 루트/플랫폼별 문서는 삭제하거나 대체하지 않고 source of truth로 연결합니다.
- `T-20260701-001`, `T-20260701-002`, `T-20260701-003`은 모두 `done`입니다.
- iOS MVP Core Loop는 조건부 통과 상태입니다.
- 구형 Mock UI 잔여 검증 `T-20260728-001`은 최종 제품 구현·출시 게이트와 중복되어 `cancelled`입니다.
- 첫 공개 출시 Critical Path는 `docs/product/CookLog_ROADMAP.md`를 따릅니다.
- `T-20260729-001`은 Product QA `PASS_WITH_RISK`와 Product Lead 완료 검토를 거쳐 `done`입니다.
- Product `T-20260731-001`은 Product QA `FAIL` 4건의 승인 재작업과 자체 검증을 마치고 독립 재검증 대기 상태입니다.
- Design 상위 `T-20260729-002`는 진행 중이며 하위 `T-20260729-008~011`은 `done`, T-012는 실행 승인 대기입니다.
- Backend Contract 상위 `T-20260728-005`는 scoped 상태이며 T-020·T-021은 `done`, T-022 이후는 순차 승인 대상입니다.
- CI 상위 `T-20260728-008`은 scoped 상태이며 T-20260730-001~004는 `done`, T-005~006은 순차 승인·검증 대상입니다.
- Product QA Agent와 문서·cross-domain 정합성 capability는 T-20260731-001 재작업에서 정식 등록했습니다. 기존 T-20260729-007은 중복 범위의 재조정 또는 폐기 검토 대상입니다.
- 수익화 문서와 `T-20260728-010~018` 동결 후보는 Core v1 출시선과 분리합니다.
- 기존 완료 Task는 legacy 위치에 보존하고 신규 실행 후보는 `tasks/active/` 또는 `tasks/backlog/`에 생성합니다.
- 모든 신규 실행 Task는 `standard_vnext`와 `scoped` 단계를 사용합니다.
- Task 병렬 가능 여부는 Development Lead Agent가 ownership과 dependency를 확인합니다.
- Design/Development Lead는 자기 Team 하위 Task만 완료하고 Product Lead는 상위 제품 Task만 완료합니다.
- Quality Team은 별도 QA Lead 없이 도메인별 Verification Agent 세션을 Task 라우팅으로 병렬 운영합니다.
- push, merge, 배포는 사용자 승인 후 진행합니다.
- 일반 Task는 최신 `develop`에서 시작하고 `develop` 대상 PR로 병합합니다.
- `main`은 통합 QA와 Product Lead 수용 검토를 거친 `develop -> main` 승격 또는 승인된 hotfix만 받습니다.
- 루트·플랫폼 안내 문서와 활성 운영·Team context를 정합화한 T-20260731-001은 Product QA 독립 재검증을 받아야 합니다.

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
| 2026-07-28 | 계층형 Task 완료 권한과 도메인별 병렬 QA 세션 기준 반영 |
| 2026-07-28 | `develop` 통합과 `main` 안정·릴리즈 승격 기준 반영 |
| 2026-07-29 | 확정 제품 정책과 첫 공개 출시 Roadmap, 병렬 Foundation과 Critical Path 반영 |
| 2026-07-31 | Design T-008~011, Backend T-020·T-021, CI T-001~003 완료와 문서 정합성 T-20260731-001 반영 |
| 2026-07-31 | Product QA FAIL 4건 재작업 승인, Product QA 정식 등록과 CI T-004 done 반영 |
