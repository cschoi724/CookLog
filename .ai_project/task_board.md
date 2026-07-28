# Task Board

작성일: 2026-07-01
프로젝트: CookLog
상태: Active

## 1. 목적

이 문서는 `.ai_project/tasks/`의 Task Queue를 빠르게 파악하기 위한 요약 보드입니다.

Task 실행 기준은 항상 개별 Task 파일입니다. 이 문서와 Task 파일이 충돌하면 Task 파일을 우선합니다.

## 2. 현재 Task 요약

| 상태 | 개수 |
|---|---:|
| `proposed` | 7 |
| `scoped` | 0 |
| `approved` | 1 |
| `in_progress` | 1 |
| `verification_ready` | 0 |
| `verification_in_progress` | 0 |
| `verification_passed` | 0 |
| `completion_review` | 0 |
| `rework_requested` | 0 |
| `blocked` | 0 |
| `done` | 3 |
| `cancelled` | 0 |

기존 Task에 기록된 `ready_for_qa`, `qa_in_progress`, `qa_passed` 상태 이력은 변경하지 않습니다. 신규 Task부터 vNext 상태를 사용합니다.

## 3. Active Tasks

현재 실행 중인 Task가 1건 있으며, 실행 승인 후 대기 중인 Task가 1건 있습니다.

Team별 요약:

| Team | Active | In Verification | Blocked | Board |
|---|---:|---:|---:|---|
| Product | 0 | 0 | 0 | `.ai_project/teams/product/task_board.md` |
| Design | 1 | 0 | 0 | `.ai_project/teams/design/task_board.md` |
| Core Development | 1 | 0 | 0 | `.ai_project/teams/development/task_board.md` |
| Quality | 0 | 0 | 0 | `.ai_project/teams/quality/task_board.md` |

## 4. Next Candidates

`T-20260728-002`는 실행 중이며, `T-20260728-007`은 Lead scope와 Product Owner 승인을 완료하고 실행을 기다리고 있습니다. 나머지 신규 후보는 `proposed` 상태이며 각 Lead scope와 Product Owner 승인이 필요합니다.

| Task ID | Priority | 제목 | 담당 Lead | 의존성 |
|---|---|---|---|---|
| `T-20260728-001` | P0 | iOS M8 잔여 안정화와 최종 검증 | Development Lead Agent | `T-20260701-002`, `T-20260701-003` |
| `T-20260728-002` | P0 | CookLog Figma 프로젝트 생성과 MVP UI/UX v1 설계 | UI/UX Design Agent | 없음 |
| `T-20260728-003` | P1 | 승인된 Figma MVP UI/UX를 iOS 앱에 적용 | Development Lead Agent | `T-20260728-001`, `T-20260728-002` |
| `T-20260728-004` | P0 | iOS XCTest runner 대기 원인 조사와 테스트 실행 안정화 | Development Lead Agent | 없음 |
| `T-20260728-005` | P1 | Backend AI 프록시 아키텍처와 API 계약 정의 | Development Lead Agent | 없음 |
| `T-20260728-006` | P1 | Backend AI 프록시 foundation 구현 | Development Lead Agent | `T-20260728-005` |
| `T-20260728-007` | P0 | Git·PR·CI 운영 기준 단일화 | Development Lead Agent | 승인 완료 |
| `T-20260728-008` | P1 | iOS CI 기본 파이프라인 구축 | Development Lead Agent | `T-20260728-004`, `T-20260728-007` |
| `T-20260728-009` | P1 | iOS 실서비스 전환 준비도와 릴리즈 게이트 정의 | Development Lead Agent | `T-20260728-001`, `T-20260728-002`, `T-20260728-005`, `T-20260728-007` |

완료된 주요 Task:

| Task ID | 제목 | 상태 | 비고 |
|---|---|---|---|
| `T-20260701-001` | 루트 프로젝트 상태 문서 동기화 | `done` | 루트/iOS 상태 문서 동기화 완료 |
| `T-20260701-002` | iOS MVP 수동 QA 체크리스트 수행 | `done` | iOS MVP Core Loop 조건부 통과 완료 |
| `T-20260701-003` | AI Review에 STEP Preview가 전달되지 않는 문제 수정 | `done` | `QA-HIGH-001` 수정 완료 |

## 5. Backlog Candidates

기존 Backlog 후보는 다음 Task에 반영했습니다.

- AI Review 문자열 편집, 키보드 가림, 2단계 Audio Player 검증: `T-20260728-001`
- `xcodebuild test` 대기 이슈: `T-20260728-004`

## 6. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | Task Board 초기화 |
| 2026-07-01 | 첫 proposed Task `T-20260701-001` 등록 |
| 2026-07-01 | `T-20260701-001` Product Owner 승인 반영 |
| 2026-07-01 | `T-20260701-001` PM Agent 실행 시작 |
| 2026-07-01 | `T-20260701-001` 문서 동기화 완료 및 QA 대기 전환 |
| 2026-07-01 | `T-20260701-001` QA 통과 반영 |
| 2026-07-01 | `T-20260701-001` PM 완료 확정 및 `T-20260701-002` proposed 등록 |
| 2026-07-01 | `T-20260701-002` Product Owner 승인 반영 |
| 2026-07-01 | `T-20260701-002` QA 시도 후 환경 권한 차단으로 blocked 반영 |
| 2026-07-01 | `T-20260701-002` 권한 차단 해소 후 재개 승인 반영 |
| 2026-07-01 | `T-20260701-002` QA 재개 및 in_progress 반영 |
| 2026-07-01 | `T-20260701-002` 핵심 흐름 결함 확인 후 rework_requested 반영 |
| 2026-07-01 | `QA-HIGH-001` 대응 개발 Task `T-20260701-003` proposed 등록 |
| 2026-07-01 | `T-20260701-003` Product Owner 승인 반영 |
| 2026-07-01 | `T-20260701-003` 개발 수정 및 검증 완료, ready_for_qa 전환 |
| 2026-07-01 | `T-20260701-003` QA 통과 반영 |
| 2026-07-01 | `T-20260701-003` PM 완료 확정 |
| 2026-07-14 | `T-20260701-002` 재개 승인 반영 |
| 2026-07-14 | QA Agent가 재검증을 시작하고 Task 잠금을 획득 |
| 2026-07-27 | QA Agent가 저장 이후 전체 MVP 흐름과 선별 테스트 18개를 확인하고 qa_passed 전환 |
| 2026-07-27 | PM Agent가 `T-20260701-002` 완료 확정 |
| 2026-07-27 | 기존 완료 Task를 보존하고 신규 Task용 vNext 상태와 Team board 연결 추가 |
| 2026-07-28 | iOS M8, Figma UI/UX, Backend AI 프록시, Git/CI, 실서비스 준비 후보 Task 9개를 proposed로 등록 |
| 2026-07-28 | `T-20260728-002` Design Lead scope와 Product Owner 승인을 반영하고 UI/UX Design Agent에 실행 라우팅 |
| 2026-07-28 | `T-20260728-007` Development Lead scope와 Product Owner 승인을 반영하고 권장 Git·PR·CI 기준으로 실행 대기 전환 |
