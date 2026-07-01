# Task Board

작성일: 2026-07-01  
프로젝트: CookLog  
상태: Draft

## 1. 목적

이 문서는 `.ai_project/tasks/`의 Task Queue를 빠르게 파악하기 위한 요약 보드입니다.

Task 실행 기준은 항상 개별 Task 파일입니다. 이 문서와 Task 파일이 충돌하면 Task 파일을 우선합니다.

## 2. 현재 Task 요약

| 상태 | 개수 |
|---|---:|
| `proposed` | 0 |
| `approved` | 0 |
| `in_progress` | 0 |
| `ready_for_qa` | 0 |
| `qa_in_progress` | 0 |
| `qa_passed` | 0 |
| `rework_requested` | 1 |
| `blocked` | 0 |
| `done` | 2 |
| `cancelled` | 0 |

## 3. Active Tasks

현재 실행 중인 Task가 없습니다.

## 4. Next Candidates

| Task ID | 제목 | 상태 | 우선순위 | 담당 | 비고 |
|---|---|---|---|---|---|
| `T-20260701-002` | iOS MVP 수동 QA 체크리스트 수행 | `rework_requested` | `P1` | Development Agent | STEP Preview가 AI Review에 전달되지 않는 핵심 흐름 결함 수정 필요 |
| `T-20260701-003` | AI Review에 STEP Preview가 전달되지 않는 문제 수정 | `done` | `P1` | PM Agent | `QA-HIGH-001` 수정 완료 |

## 5. Backlog Candidates

아래 후보는 아직 Task로 등록하지 않았습니다.

권장 후보:

| 후보 | 이유 | 비고 |
|---|---|---|
| `xcodebuild test` 대기 이슈 조사 | iOS 열린 질문으로 기록됨 | 개발/QA 협업 후보 |

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
