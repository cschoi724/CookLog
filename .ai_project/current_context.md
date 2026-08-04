# Current Agent Context

작성일: 2026-07-01
최종 업데이트: 2026-08-04
프로젝트: CookLog
상태: Active

## 1. 목적

이 문서는 Agent가 세션을 시작하거나 재개할 때 가장 먼저 확인할 현재 운영 컨텍스트를 요약합니다.

실제 로컬 실행 기준은 해당 Task 브랜치의 Task 파일입니다. 다른 Agent가 공유하는 상태와 의존성 판단은 fetch를 마친 최신 `origin/develop`의 `.ai_project/tasks/`를 기준으로 합니다. 이 문서는 현재 초점과 주의사항을 빠르게 파악하기 위한 안내판입니다.

## 2. 현재 운영 상태

| 항목 | 값 |
|---|---|
| 현재 운영 모드 | `multi_team`, core `0.6.4` |
| 활성 Team | Product, Design, Core Development, Quality, AI Ops |
| 활성 개발 영역 | iOS 최우선, Backend foundation |
| 보류 영역 | Android, Release Role |
| 활성 Agent | Product Lead, Product Planning, Design Lead, UI/UX Design, Development Lead, iOS, Backend, Product QA, Design QA, iOS QA, Backend QA, AI Ops |
| 현재 우선 Task | Design T-014 독립 검증, Backend T-025 준비, CI T-006 완료선 정리 |
| 기본 작업 브랜치 | `develop` |
| 안정·릴리즈 브랜치 | `main` |
| 공용 상태 기준 | fetch를 마친 최신 `origin/develop`과 확인 SHA |
| 로컬 상태 의미 | 각 worktree·브랜치 시점의 실행 스냅샷 |
| 다음 확인 위치 | `.ai_project/operating_model.md`, `.ai_project/source_of_truth.md`, `.ai_project/task_board.md` |
| Lock timeout | 240분 |

## 3. 현재 주의사항

- AI Ops Agent는 제품 Task 실행 라인에 참여하지 않고, 운영 프로세스 문제를 `.ai_project/ops_issues.md`에 기록합니다.
- 루트의 보존 WIP와 오래된 로컬 `develop` worktree는 공용 현재 상태 조회에 사용하지 않습니다.
- 모든 상태 보고에는 확인한 `origin/develop` SHA와 로컬 worktree·branch·HEAD·미커밋 여부를 포함합니다.
- 별도 비파괴 감사와 Product Owner 승인 전에는 기존 worktree와 branch를 삭제하지 않습니다.
- CookLog의 기존 루트/플랫폼별 문서는 삭제하거나 대체하지 않고 source of truth로 연결합니다.
- `T-20260701-001`, `T-20260701-002`, `T-20260701-003`은 모두 `done`입니다.
- iOS MVP Core Loop는 조건부 통과 상태입니다.
- 구형 Mock UI 잔여 검증 `T-20260728-001`은 최종 제품 구현·출시 게이트와 중복되어 `cancelled`입니다.
- 첫 공개 출시 Critical Path는 `docs/product/CookLog_ROADMAP.md`를 따릅니다.
- `T-20260729-001`은 Product QA `PASS_WITH_RISK`와 Product Lead 완료 검토를 거쳐 `done`입니다.
- Product `T-20260731-001`은 Product QA 최종 `PASS`, Product Lead 완료 검토와 Product Owner 최종 승인을 거쳐 `done`입니다.
- Design 상위 `T-20260729-002`는 진행 중이며 하위 `T-20260729-008~013`은 `done`, 마지막 순차 Task `T-20260729-014`는 로컬 통합·자체 검증을 마쳐 독립 Design QA 대기입니다.
- Backend Contract 상위 `T-20260728-005`는 scoped 상태이며 T-020~023은 `done`, T-024·025는 `approved`이고 T-025는 T-024 완료 후 착수합니다.
- CI 상위 `T-20260728-008`은 scoped 상태이며 T-20260730-001~005는 `done`, T-006은 별도 승인 대기입니다.
- AI Ops `T-20260731-002`는 독립 검증 `PASS`와 PR #48 squash merge를 거쳐 `done`입니다.
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
- T-20260731-001의 문서 정합성 선행 차단은 해소됐습니다. T-20260728-003은 Design 상위 Task 완료와 별도 실행 승인을 확인해야 합니다.

## 4. 세션 시작 체크

1. `git status -sb`를 확인합니다.
2. `git branch --show-current`로 현재 branch를 확인합니다.
3. `git fetch origin develop`과 `git rev-parse --short origin/develop`로 최신 공용 SHA를 확인합니다.
4. `git rev-list --left-right --count origin/develop...HEAD`와 `git merge-base --is-ancestor origin/develop HEAD`로 worktree 기준점을 확인합니다.
5. `git show origin/develop:.ai_project/task_board.md`와 `git show origin/develop:<TASK_FILE>`로 공용 Task 상태와 의존성을 확인합니다.
6. 기존 실행 worktree가 최신 `origin/develop`을 포함하지 않으면 변경을 보존하고 중단 보고합니다. 자동 `reset`, `rebase`, `stash`는 하지 않습니다.
7. `.ai/runtime/workflow.md`와 `.ai/runtime/task_queue.md`를 확인합니다.
8. `.ai_project/operating_model.md`에서 활성 Team과 Role을 확인합니다.
9. 이 문서와 `.ai_project/source_of_truth.md`를 확인합니다.
10. Task의 `workflow`, 공용·로컬 `status`, `approved_by`, `depends_on`, `locked_by`, `allowed_paths`, `source_of_truth`를 확인합니다.
11. 실행 가능한 Task면 전용 worktree에서 lock을 획득하고 하나의 Task만 진행합니다.

상태 보고는 다음 최소 형식을 사용합니다.

```text
public_source: origin/develop@<SHA>
worktree: <path>
branch: <branch>
local_head: <SHA>
public_task_status: <status>
local_task_status: <status>
dirty: yes|no
```

fetch 또는 공용 SHA 확인에 실패하면 `PUBLIC_STATE_UNVERIFIED`로 보고하고, 다른 Task의 착수·의존성·완료 판단을 하지 않습니다.

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
| 2026-07-31 | 최신 develop의 T-022 completion_review·T-023~024 approved와 원격 STT adapter 계약 반영 |
| 2026-07-31 | T-022 PR #40 squash merge와 완료 확정을 반영해 `done`으로 동기화 |
| 2026-07-31 | T-001 Backend 상위 요약 재작업을 마치고 Product QA 독립 재검증 재인계 |
| 2026-07-31 | T-001 Product QA 최종 PASS 수용·Product Lead `completion_review` 전환 |
| 2026-07-31 | Product Owner 최종 승인으로 T-001 `done` 확정·develop 통합 시작 |
| 2026-07-31 | T-005 PR #36 검증 산출물·PR #46 완료 기록 병합을 반영해 CI 상태를 `done`으로 동기화 |
| 2026-07-31 | T-20260731-002에서 최신 `origin/develop` 공용 상태 조회와 로컬 worktree 상태 분리, 세션 preflight·보고 형식·정리 동결 규칙 반영 |
| 2026-07-31 | T-20260731-002 독립 AI Ops PASS와 PR #48 squash merge를 확인해 `done`으로 동기화 |
| 2026-08-04 | Design T-013 완료 정합화와 T-014 로컬 통합·자체 검증 완료, 독립 Design QA 인계 반영 |
