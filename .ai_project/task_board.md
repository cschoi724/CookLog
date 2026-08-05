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
| `proposed` | 15 |
| `scoped` | 0 |
| `approved` | 1 |
| `in_progress` | 0 |
| `verification_ready` | 0 |
| `verification_in_progress` | 0 |
| `verification_passed` | 1 |
| `completion_review` | 0 |
| `rework_requested` | 0 |
| `blocked` | 1 |
| `done` | 5 |
| `cancelled` | 0 |

기존 Task에 기록된 `ready_for_qa`, `qa_in_progress`, `qa_passed` 상태 이력은 변경하지 않습니다. 신규 Task부터 vNext 상태를 사용합니다.

## 3. Active Tasks

현재 Figma 재작업 Design Task 1건은 Starter MCP 호출 한도가 복구될 때까지 보류합니다. 구독·Paywall UX Design Task 1건은 구조 QA를 통과했고 정책값 완료 게이트 검토 대기입니다. iOS 구현 인수 기준 Design Task는 완료됐습니다. Development Task 대기열은 별도 Development Lead 범위입니다.

Team별 요약:

| Team | Active | In Verification | Blocked | Board |
|---|---:|---:|---:|---|
| Product | 0 | 0 | 0 | `.ai_project/teams/product/task_board.md` |
| Design | 0 | 1 | 1 | `.ai_project/teams/design/task_board.md` |
| Core Development | 1 | 0 | 0 | `.ai_project/teams/development/task_board.md` |
| Quality | 0 | 0 | 0 | `.ai_project/teams/quality/task_board.md` |

## 4. Next Candidates

`T-20260728-002`는 2026-08-03 `done`으로 확정됐습니다. `T-20260803-001`은 Figma Starter MCP 호출 한도가 복구될 때까지 보류합니다. `T-20260728-011`은 `DQA-HIGH-001~006` 구조 QA를 통과했으며 최종 가격 문구는 정책 확정 후 잠급니다.

| Task ID | Priority | 제목 | 담당 Lead | 의존성 |
|---|---|---|---|---|
| `T-20260803-001` | P1 | Figma 미러 재작업과 Light 우선 디자인 시스템 구축 | Design Lead Agent | 장기 보류, Starter MCP 한도 복구 확인 시 재개 |
| `T-20260728-001` | P0 | iOS M8 잔여 안정화와 최종 검증 | Development Lead Agent | `T-20260701-002`, `T-20260701-003` |
| `T-20260728-003` | P1 | 승인된 Figma MVP UI/UX를 iOS 앱에 적용 | Development Lead Agent | `T-20260728-001`, `T-20260728-002`, `T-20260805-001` |
| `T-20260728-004` | P0 | iOS XCTest runner 대기 원인 조사와 테스트 실행 안정화 | Development Lead Agent | 없음 |
| `T-20260728-005` | P1 | Backend AI 프록시 아키텍처와 API 계약 정의 | Development Lead Agent | 없음 |
| `T-20260728-006` | P1 | Backend AI 프록시 foundation 구현 | Development Lead Agent | `T-20260728-005` |
| `T-20260728-007` | P0 | Git·PR·CI 운영 기준 단일화 | Development Lead Agent | 승인 완료 |
| `T-20260728-008` | P1 | iOS CI 기본 파이프라인 구축 | Development Lead Agent | `T-20260728-004`, `T-20260728-007` |
| `T-20260728-009` | P1 | iOS 실서비스 전환 준비도와 릴리즈 게이트 정의 | Development Lead Agent | `T-20260728-001`, `T-20260728-002`, `T-20260728-005`, `T-20260728-007` |
| `T-20260728-010` | P1 | 수익화 가격·원가와 출시 정책 확정 | Development Lead Agent | `T-20260728-006`, `T-20260728-009` |
| `T-20260728-011` | P1 | 구독·Paywall UX 설계 | Design Lead Agent | 구조 QA 통과, `T-20260728-010` 정책값 완료 게이트 검토 |
| `T-20260728-012` | P1 | 구독 entitlement와 AI quota Backend 계약 정의 | Development Lead Agent | `T-20260728-005`, `006`, `009`, `010` |
| `T-20260728-013` | P1 | App Store 구독 상품과 법무·운영 정보 준비 | Development Lead Agent | `T-20260728-007`, `009`, `010` |
| `T-20260728-014` | P1 | iOS StoreKit 2 CookLog Pro 구현 | Development Lead Agent | `T-20260728-003`, `011`, `012`, `013` |
| `T-20260728-015` | P1 | Backend 구독 검증과 AI quota 구현 | Development Lead Agent | `T-20260728-006`, `012`, `013` |
| `T-20260728-016` | P1 | 수익화 이벤트와 AI 비용 관측성 구현 | Development Lead Agent | `T-20260728-014`, `015` |
| `T-20260728-017` | P1 | 구독 Sandbox·TestFlight 통합 검증 | Development Lead Agent | `T-20260728-008`, `014`, `015`, `016` |
| `T-20260728-018` | P1 | 초기 실서비스 수익화 출시 준비 완료 판정 | Development Lead Agent | `T-20260728-017` |

완료된 주요 Task:

| Task ID | 제목 | 상태 | 비고 |
|---|---|---|---|
| `T-20260701-001` | 루트 프로젝트 상태 문서 동기화 | `done` | 루트/iOS 상태 문서 동기화 완료 |
| `T-20260701-002` | iOS MVP 수동 QA 체크리스트 수행 | `done` | iOS MVP Core Loop 조건부 통과 완료 |
| `T-20260701-003` | AI Review에 STEP Preview가 전달되지 않는 문제 수정 | `done` | `QA-HIGH-001` 수정 완료 |
| `T-20260728-002` | CookLog MVP UI/UX v1 설계와 Figma 버전 미러 | `done` | Design QA 통과와 Design Lead 완료 확정 |
| `T-20260805-001` | iOS MVP 디자인 적용 기준과 Visual QA 계약 확정 | `done` | WP-R1~R2 재검증 통과와 Design Lead 완료 확정 |

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
| 2026-07-28 | `T-20260728-002` Figma 방향 선택과 Starter 별도 Light·Dark 구조 반영 후 MCP 월간 호출 한도로 blocked 전환 |
| 2026-07-28 | `design/prototype/`을 UI Source of Truth로 확정하고 Figma를 점진적 미러로 재분류해 `T-20260728-002` 실행 재개 |
| 2026-07-28 | `T-20260728-002` 로컬 UI 원본과 핸드오프를 완료하고 독립 Design QA 대기로 전환 |
| 2026-07-28 | 초기 실서비스 준비도에 따라 실행할 수익화 Task `T-20260728-010`~`018`을 proposed로 등록 |
| 2026-07-28 | `T-20260728-002` 독립 Design QA에서 핵심 흐름·접근성·상태 결함을 확인하고 rework_requested로 전환 |
| 2026-07-28 | `T-20260728-002` QA 결함 6건을 3개 순차 재작업 패키지로 조율하고 scoped로 전환 |
| 2026-07-28 | Product Owner가 `T-20260728-002` 재작업을 승인하고 UI/UX Design Agent에 재라우팅 |
| 2026-07-28 | UI/UX Design Agent가 `T-20260728-002` 재작업 lock을 획득하고 실행 시작 |
| 2026-07-28 | UI/UX Design Agent가 `T-20260728-002` QA 결함 6건의 재작업과 자체 검증을 완료하고 독립 Design QA 대기로 전환 |
| 2026-08-03 | `T-20260728-002` Design QA 재검증의 미해결 2건과 신규 1건을 반영하고 재작업 대상으로 동기화 |
| 2026-08-03 | Product Owner가 `T-20260728-002` WP-4 2차 재작업을 승인하고 UI/UX Design Agent 실행 대기로 전환 |
| 2026-08-03 | UI/UX Design Agent가 `T-20260728-002` WP-4 결함 3건 수정과 자체 검증을 완료하고 Design QA 재검증 대기로 전환 |
| 2026-08-03 | Design QA Agent가 `T-20260728-002` WP-4와 기존 결함 회귀의 독립 재검증을 통과시키고 Design Lead Agent 완료 검토로 인계 |
| 2026-08-03 | Design Lead Agent가 `T-20260728-002` 완료 검토를 통과시키고 `completion_review -> done`으로 확정 |
| 2026-08-03 | 비차단 Figma 버전 미러 후속 Task `T-20260803-001`을 `scoped`로 등록하고 Product Owner 승인 대기로 라우팅 |
| 2026-08-03 | `T-20260803-001`을 MCP 총 5회 이하의 시각 스냅샷 미러 범위로 축소하고 편집형 디자인 시스템 구축을 제외 |
| 2026-08-03 | Product Owner가 `T-20260803-001`의 5회 호출 실행을 승인하고 UI/UX Design Agent에 라우팅 |
| 2026-08-03 | Design QA Agent가 `T-20260803-001`의 앱 상태 9개 누락과 Light·Dark Components Gallery 잘림을 확인해 `rework_requested`로 Design Lead Agent에 인계 |
| 2026-08-03 | Product Owner가 `T-20260803-001`의 Light 우선 디자인 시스템 확대 재작업을 승인하고 UI/UX Design Agent에 라우팅 |
| 2026-08-04 | `T-20260803-001`의 로컬 Gallery 결함을 수정하고 Phase 0 Figma Discovery를 진행했으나 Starter MCP 호출 한도로 `blocked` 전환 |
| 2026-08-04 | UI/UX Design Agent가 `T-20260803-001`의 완료·미완료·재개 위치를 기록하고 한도 갱신 조율을 Design Lead Agent에 인계 |
| 2026-08-04 | Product Owner가 `T-20260803-001`을 한도 복구 전까지 보류하고 Design Team의 신규 실행을 일시 중단 |
| 2026-08-04 | Product Owner가 `T-20260728-011`의 변수 기반 로컬 UX 선행 설계를 승인하고 UI/UX Design Agent에 라우팅 |
| 2026-08-04 | Design QA Agent가 `T-20260728-011`의 거래 상태·quota 의미·복원·접근성 결함 5건을 확인해 `rework_requested`로 Design Lead Agent에 인계 |
| 2026-08-04 | Product Owner가 `T-20260728-011`의 WP-R1~R5 재작업을 승인하고 UI/UX Design Agent에 재라우팅 |
| 2026-08-04 | UI/UX Design Agent가 `T-20260728-011` QA 결함 5건 수정과 자체 회귀 검증을 완료하고 Design QA에 재인계 |
| 2026-08-04 | Design QA Agent가 기존 5건 통과 후 닫기·구매 성공 목적지 결함 `DQA-HIGH-006`을 확인해 `rework_requested`로 인계 |
| 2026-08-04 | Product Owner가 `DQA-HIGH-006` WP-R6 재작업을 승인하고 UI/UX Design Agent에 재라우팅 |
| 2026-08-04 | UI/UX Design Agent가 `DQA-HIGH-006` 부모 라우팅·상태 보존 수정과 실제 브라우저 전이 검증을 완료해 Design QA에 재인계 |
| 2026-08-04 | Design QA Agent가 `DQA-HIGH-006` 8개 전이와 기존 결함 최소 회귀를 통과시켜 `verification_passed`로 Design Lead Agent에 인계 |
| 2026-08-04 | iOS 적용 전 플랫폼 관례와 Visual QA 기준을 확정하는 Design Task `T-20260805-001`을 `scoped`로 등록하고 Product Owner 승인 대기로 라우팅 |
| 2026-08-04 | Product Owner가 `T-20260805-001` 실행과 `T-20260728-003` 선행 의존성 연결을 승인해 UI/UX Design Agent에 라우팅 |
| 2026-08-04 | UI/UX Design Agent가 `T-20260805-001` lock을 획득하고 iOS 상태·컴포넌트 실구조 대조를 시작 |
| 2026-08-04 | UI/UX Design Agent가 23개 상태·iOS 우선순위·Visual QA·컴포넌트 인수 계약과 자체 검증을 완료해 Design QA에 인계 |
| 2026-08-04 | Design QA Agent가 `T-20260805-001`의 실제 AI Review route 불일치와 고유 배경 토큰·system semantic 대체 기준 충돌 2건을 확인해 `rework_requested`로 Design Lead Agent에 인계 |
| 2026-08-04 | Design Lead Agent가 `DQA-MEDIUM-007~008`을 route 계약 정렬과 색상 적용 경계 단일화로 범위화하고 Product Owner 승인 후 UI/UX Design Agent에 재라우팅 |
| 2026-08-04 | UI/UX Design Agent가 `T-20260805-001` WP-R1~R2 재작업 lock을 획득하고 실행 시작 |
| 2026-08-04 | UI/UX Design Agent가 실제 `[StepPreview]` route와 CookLog 고유 색상 적용 경계를 정렬하고 회귀 검증 후 Design QA에 재인계 |
| 2026-08-04 | Design QA Agent가 `DQA-MEDIUM-007~008`과 기존 상태·대비·접근성 회귀를 통과시켜 `verification_passed`로 Design Lead Agent에 인계 |
| 2026-08-04 | Design Lead Agent가 `T-20260805-001` 완료 검토를 통과시켜 `completion_review -> done`으로 확정하고 iOS 구현·Visual QA를 `T-20260728-003` 후속 범위로 유지 |
| 2026-08-05 | 공용 완료 Task와 겹친 iOS 디자인 적용 기준의 로컬 임시 ID를 `T-20260805-001`로 재번호하고 Task·보고서·QA·보드·T-003 참조를 동기화 |
