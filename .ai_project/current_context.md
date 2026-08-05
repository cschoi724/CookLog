# Current Agent Context

작성일: 2026-07-01
최종 업데이트: 2026-08-04
프로젝트: CookLog
상태: Active

## 1. 목적

이 문서는 Agent가 세션을 시작하거나 재개할 때 가장 먼저 확인할 현재 운영 컨텍스트를 요약합니다.

실제 실행 기준은 `.ai_project/tasks/`의 Task 파일입니다. 이 문서는 현재 초점과 주의사항을 빠르게 파악하기 위한 안내판입니다.

## 2. 현재 운영 상태

| 항목 | 값 |
|---|---|
| 현재 운영 모드 | `multi_team`, core `0.9.0` |
| 활성 Team | Product, Design, Core Development, Quality, AI Ops |
| 활성 개발 영역 | iOS 최우선, Backend foundation |
| 보류 영역 | Android, Release Role |
| 활성 Agent | Product Lead, Product Planning, Design Lead, UI/UX Design, Development Lead, iOS, Backend, Design QA, iOS QA, Backend QA, AI Ops |
| 현재 우선 Task | `T-20260728-011` 정책값 완료 게이트 검토, `T-20260803-001` Figma 한도 복구 대기 |
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
- Design/Development Lead는 자기 Team 하위 Task만 완료하고 Product Lead는 상위 제품 Task만 완료합니다.
- Quality Team은 별도 QA Lead 없이 도메인별 Verification Agent 세션을 Task 라우팅으로 병렬 운영합니다.
- push, merge, 배포는 사용자 승인 후 진행합니다.
- Figma Task `T-20260803-001`은 로컬 Gallery 결함 수정을 완료했으나 실제 Starter MCP 호출 한도가 발생해 `blocked` 상태입니다. Product Owner 결정에 따라 당분간 보류하며, 한도 복구가 별도로 확인될 때만 UI/UX Design Agent에 재라우팅해 WP-R2부터 재개합니다.
- `T-20260728-011`은 `DQA-HIGH-001~006` 구조 재검증을 모두 통과해 `verification_passed`입니다. 가격·quota 최종 문구는 `T-20260728-010` 완료 후 잠그고 회귀 검증합니다.
- `T-20260805-001`은 `DQA-MEDIUM-007~008` 재작업과 독립 재검증을 통과하고 Design Lead 완료 검토를 거쳐 `done`입니다. 실제 SwiftUI 구현·Visual QA와 Navigation 문서 동기화는 `T-20260728-003`에서 수행합니다.
- `docs/GIT_WORKFLOW.md`와 Branch/PR 전략을 동기화했으며, 루트 `AGENTS.md`는 core 0.9.0 Codex adapter와 정확히 일치합니다.
- CookLog 고유 맥락은 이 문서, `.ai_project/source_of_truth.md`, `docs/product/`, 플랫폼별 `AGENTS.md`에서 관리합니다.
- Homebrew core와 프로젝트 운영 기록은 `0.9.0`으로 동기화했습니다. 신규 Task부터 `aiops.task.v1` schema를 적용하고 기존 Task는 legacy로 보존합니다.

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
| 2026-08-04 | Figma 한도 미복구에 따른 디자인 작업 장기 보류와 다음 디자인 후보의 선행 정책 대기 반영 |
| 2026-08-04 | `T-20260728-011`의 변수 기반 선행 설계를 승인하고 UI/UX Design Agent에 라우팅 |
| 2026-08-04 | `T-20260728-011` 독립 구조 검증에서 결함 5건을 확인하고 Design Lead Agent 재작업 조율로 인계 |
| 2026-08-05 | 루트 역할 자동 부여 제거, `AGENTS.md` 파일명과 Git 정책 정합화, core 0.9.0 차이 기록 |
| 2026-08-05 | 승인된 migration-safe Apply로 프로젝트 core 기록을 0.9.0에 동기화 |
| 2026-08-05 | 루트 `AGENTS.md`를 core adapter로 정규화하고 CookLog 고유 컨텍스트를 프로젝트 문서로 분리 |
| 2026-08-05 | 신규 Task부터 `aiops.task.v1` schema를 적용하고 기존 Task를 legacy로 보존하는 운영 기준 확정 |
| 2026-08-04 | Product Owner가 `T-20260728-011`의 WP-R1~R5 재작업을 승인하고 UI/UX Design Agent에 재라우팅 |
| 2026-08-04 | `T-20260728-011` 재검증에서 기존 5건 통과 후 신규 `DQA-HIGH-006`을 확인해 Design Lead Agent에 인계 |
| 2026-08-04 | Product Owner가 `DQA-HIGH-006` WP-R6 재작업을 승인하고 UI/UX Design Agent에 재라우팅 |
| 2026-08-04 | `DQA-HIGH-006` 8개 전이와 기존 결함 회귀를 독립 검증해 `T-20260728-011`을 `verification_passed`로 인계 |
| 2026-08-04 | `T-20260805-001` 실행과 iOS 적용 Task 선행 의존성 연결을 승인하고 UI/UX Design Agent에 인계 |
| 2026-08-04 | `T-20260805-001`의 `DQA-MEDIUM-007~008` 재작업 추천안을 승인하고 UI/UX Design Agent에 재라우팅 |
| 2026-08-04 | `T-20260805-001` 재검증과 Design Lead 완료 검토를 통과해 `done`으로 확정 |
| 2026-08-05 | iOS 디자인 적용 기준 Task를 `T-20260805-001`로 재번호해 공용 수익화 Task ID와의 충돌을 해소 |
