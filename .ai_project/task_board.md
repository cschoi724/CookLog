# Task Board

작성일: 2026-07-28
프로젝트: CookLog
상태: Active

## 1. 목적

이 문서는 `.ai_project/tasks/`의 Task Queue를 빠르게 파악하기 위한 요약 보드입니다.

Task 실행 기준은 항상 개별 Task 파일입니다. 이 문서와 Task 파일이 충돌하면 Task 파일을 우선합니다.

## 2. 현재 Task 요약

| 상태 | 개수 |
|---|---:|
| `proposed` | 17 |
| `scoped` | 4 |
| `approved` | 6 |
| `in_progress` | 0 |
| `verification_ready` | 1 |
| `verification_in_progress` | 0 |
| `verification_passed` | 1 |
| `completion_review` | 0 |
| `rework_requested` | 0 |
| `blocked` | 1 |
| `done` | 44 |
| `cancelled` | 1 |

기존 Task에 기록된 `ready_for_qa`, `qa_in_progress`, `qa_passed` 상태 이력은 변경하지 않습니다. 신규 Task부터 vNext 상태를 사용합니다.

## 3. Active Tasks

Product `T-20260731-001`과 `T-20260804-001`은 Product QA·완료 리뷰·Product Owner 승인을 거쳐 `done`입니다. Design `T-20260729-002`와 하위 `T-20260729-008~014`, iOS 구현 인수 계약 `T-20260805-001`도 모두 `done`입니다. Backend T-020~025와 상위 T-005, Foundation T-20260728-006과 하위 T-20260804-002~007도 모두 `done`입니다. 실제 production Backend T-20260729-003은 6개 하위 패키지로 `scoped`이며 T-20260810-001~005는 모두 `done`입니다. T-006은 Gate A 독립 QA에서 HIGH 4건으로 FAIL했으며 Product Owner가 repository-only 재작업을 승인해 `approved`, Backend Agent 재실행 대기입니다. external staging Gate B는 계속 보류입니다. iOS T-003은 개발 검증 7개와 별도 Visual Design QA 1개, 총 8개 하위 패키지로 `scoped`입니다. T-008은 변경 중인 Prototype의 통합 Design QA와 baseline 고정을 기다려 `blocked`, 신규 T-20260812-001은 iOS 구현 Visual Fidelity 검증을 담당하며 `scoped`입니다. CI T-001~006은 모두 `done`입니다. AI Ops `T-20260731-002`는 독립 검증과 PR #48 병합을 마쳐 `done`입니다.

Team별 요약:

| Team | Active | In Verification | Blocked | Board |
|---|---:|---:|---:|---|
| Product | 2 | 1 | 0 | `.ai_project/teams/product/task_board.md` |
| Design | 5 | 0 | 0 | `.ai_project/teams/design/task_board.md` |
| Core Development | 13 | 0 | 1 | `.ai_project/teams/development/task_board.md` |
| Quality | 1 | 0 | 0 | `.ai_project/teams/quality/task_board.md` |
| AI Ops | 0 | 0 | 0 | `T-20260730-006`, `T-20260731-002` `done` |

## 4. Next Candidates

출시 Critical Path는 `T-20260729-001` 제품 기준 고정 후 Design, XCTest와 Backend Contract를 병렬 진행하고, iOS 로컬 제품·Backend production·실서비스 연동을 거쳐 `T-20260728-009`에서 통합합니다. `T-20260728-004`는 PR #8 squash merge와 완료 검토를 마쳐 `done`이며 Xcode·Simulator 고정 검증은 T-008로 인계했습니다. 구형 Mock UI 잔여 검증 `T-20260728-001`은 중복으로 폐기했습니다. Design `T-20260729-002`와 하위 `T-20260729-008~014`는 모두 `done`입니다.

| Task ID | Priority | 제목 | 담당 Lead | 의존성 |
|---|---|---|---|---|
| `T-20260728-001` | - | iOS M8 잔여 안정화와 최종 검증 | - | `cancelled`, 유효 항목은 T-003/T-009로 통합 |
| `T-20260728-002` | P0 | CookLog MVP UI/UX v1 설계와 Figma 버전 미러 | - | `done` |
| `T-20260728-003` | P0 | 확정 제품 UX·디자인과 iOS 로컬 상태 모델 적용 | Development Lead Agent | `scoped`; 개발 검증 T-008과 별도 Design QA T-20260812-001 모두 필요 |
| `T-20260805-001` | P1 | iOS MVP 디자인 적용 기준과 Visual QA 계약 확정 | - | `done`, 통합 82개 상태 아래 Core Loop 23개 인수 계약 |
| `T-20260728-004` | P0 | iOS XCTest runner 대기 원인 조사와 테스트 실행 안정화 | - | `done`, PR #8 squash merge |
| `T-20260728-005` | P0 | Backend AI gateway와 기본 비활성 원격 STT adapter 계약 정의 | - | `done`, PR #65 squash merge `4e0bca4` |
| `T-20260728-006` | P0 | Backend AI gateway와 비활성 원격 STT adapter foundation 구현 | - | `done`; PASS_WITH_RISK 수용·PR #93 병합 승인 |
| `T-20260728-007` | P0 | Git·PR·CI 운영 기준 단일화 | Development Lead Agent | `done` |
| `T-20260728-019` | P0 | develop 통합 브랜치 기반 Git 운영 전환 | AI Ops Agent | `done` |
| `T-20260731-002` | P0 | 프로젝트 공용 상태 일관성 및 Git 안전 guardrail | - | `done`, 독립 AI Ops PASS·PR #48 squash merge |
| `T-20260728-008` | P0 | iOS CI 기본 파이프라인 구축 | Development Lead Agent | `scoped`; T-001~006 모두 `done`, 상위 완료 검토 준비 |
| `T-20260728-009` | P0 | iOS 첫 공개 출시 통합·TestFlight·App Store 게이트 | Development Lead Agent | R1·R2 차단 Task 전체 |
| `T-20260729-001` | P0 | 확정 제품 정책과 출시 계획 통합 문서화 | - | `done` |
| `T-20260729-002` | P0 | 확정 제품 UX 기반 디자인 시스템·프로토타입 갱신 | - | `done`, 하위 T-008~014·통합 Design QA·PR #68 완료 |
| `T-20260810-007` | P2 | Design Prototype GitHub Pages 공유 구성 | - | `done`, PR #118 squash merge·Design QA PASS; Gate B 미승인 |
| `T-20260811-002` | P1 | 팝 키치 레시피 클럽 앱 전반 디자인 방향 확정 및 원본 발전 | Product Lead Agent | `scoped`, 앱 전반 범위·82개 상태·화면군별 실행 순서 확정; P0 Task 무중단 |
| `T-20260812-002` | P1 | 팝 키치 레시피 클럽 UX 구조·핵심 기능 재기획 | - | `done`, Product QA `PASS_WITH_RISK`·Product Lead 완료 수용; 375×667 Legacy 충돌은 T-20260812-004로 인계 |
| `T-20260812-003` | P1 | CookLog 비공개 Figma 원천 전환과 팝 키치 핵심 흐름 UI/UX 원본 구축 | Design Lead Agent | `proposed`, T-002 완료 후 비공개 Figma 범위·기존 디자인 Task 영향 조율 및 실행 승인 필요 |
| `T-20260812-004` | P0 | 비공개 Figma 원천 전환 기반 Task 흐름·의존성 재정렬 | Product Lead Agent | `scoped`, T-003 중심의 기존 디자인·iOS·QA Task 유지·흡수·재범위화·종료 후보 및 실행 순서 승인 대기 |
| `T-20260811-003` | P1 | 팝 키치 레시피 클럽 Foundation·공통 컴포넌트 원본 정비 | - | `done`, Design QA PASS·Design Lead 완료 리뷰·Product Owner 병합 승인 |
| `T-20260811-004` | P1 | 팝 키치 레시피 클럽 Foundation·Home·Library 원본 시안 재작업 | - | `done`, 독립 Design QA PASS·Design Lead 완료 수용·PR #138 병합 승인; T-008 실행 기준 충족 |
| `T-20260811-008` | P1 | 팝 키치 레시피 클럽 Visual Fidelity 리터치 및 시각 승인 | UI/UX Design Agent | `approved`, T-004 완료·Home 고충실도·Product Owner 시각 승인 |
| `T-20260811-005` | P1 | 팝 키치 레시피 클럽 Log·Review·Detail 원본 시안 적용 | Design Lead Agent → UI/UX Design Agent | `proposed`, T-004·T-008 이후·Core Loop 33 상태 |
| `T-20260811-006` | P1 | 팝 키치 레시피 클럽 Player·Info·오류 원본 시안 적용 | Design Lead Agent → UI/UX Design Agent | `proposed`, `T-005` 이후·35 상태 |
| `T-20260811-007` | P1 | 팝 키치 레시피 클럽 Prototype 통합 Design QA | Design Lead Agent → Design QA Agent | `proposed`, 화면군 완료 뒤 82 상태 독립 QA |
| `T-20260812-001` | P0 | iOS 구현 Visual Fidelity Design QA | Design Lead Agent → UI/UX Design Agent → Design QA Agent | `scoped`, T-20260811-007·T-20260805-008 완료 뒤 별도 실행 승인 |
| `T-20260729-003` | P0 | 실제 AI provider와 배포 가능한 Backend gateway 구축 | Development Lead Agent | `scoped`, T-20260810-001~005 실행 승인·T-006 통합 대기 |
| `T-20260729-004` | P0 | iOS 10초 녹음·권한·Apple 기기 내 STT 연동 | Development Lead Agent | `T-20260728-003`, `T-20260729-026` |
| `T-20260729-005` | P0 | iOS AI 정리·처리 복구·AI Review 실서비스 연동 | Development Lead Agent | `T-20260728-003`, `T-20260728-005`, `T-20260729-003` |
| `T-20260729-006` | P0 | iOS 로컬 TTS·오디오 중단·핸즈프리 Audio Guide 구현 | Development Lead Agent | `T-20260728-003` |
| `T-20260729-007` | P1 | Product QA Agent 운영 등록과 루트 제품 안내 동기화 | AI Ops Agent | T-001 재작업에서 등록 범위 충족, 중복 범위 재조정·폐기 검토 |
| `T-20260729-026` | P0 | 첫 공개 출시 STT 기본 경로를 Apple 기기 내 처리로 변경 | - | `done`, Product QA PASS·Product Owner 최종 승인 |
| `T-20260731-001` | P0 | 활성 문서 Source of Truth 정합성 복구 | - | `done`, Product QA PASS·Product Lead 완료 검토·Product Owner 최종 승인 |

Design `T-20260729-002` 하위 실행 후보:

| Task ID | Priority | 제목 | 담당 Agent | 의존성 |
|---|---|---|---|---|
| `T-20260729-008` | P0 | 확정 UX용 디자인 Foundation·공통 컴포넌트 갱신 | - | `done`, PR #11 squash merge |
| `T-20260729-009` | P0 | Home·전체 보기·검색·레시피 상태 routing 디자인 | - | `done`, PR #16 squash merge |
| `T-20260729-010` | P0 | Cooking Log·STEP Preview·기기 내 STT·권한·오류 디자인 | - | `done`, PR #22 squash merge |
| `T-20260729-011` | P0 | AI 처리·AI Review·완료 레시피 편집·삭제 디자인 | - | `done`, PR #30 squash merge |
| `T-20260729-012` | P0 | Audio Guide·핸즈프리·오디오 중단 상태 디자인 | - | `done`, PR #42 squash merge |
| `T-20260729-013` | P0 | 앱 정보·데이터 보관·법적 문서·서비스 장애 디자인 | - | `done`, PR #53 squash merge |
| `T-20260729-014` | P0 | 디자인 통합 접근성 검증·구현 핸드오프 갱신 | - | `done`, Design QA PASS·PR #68 squash merge |
| `T-20260810-007` | P2 | Design Prototype GitHub Pages 공유 구성 | - | `done`, PR #118 squash merge·Design QA PASS; Gate B 미승인 |

Backend `T-20260728-005` 하위 실행 후보:

| Task ID | Priority | 제목 | 담당 Agent | 의존성 |
|---|---|---|---|---|
| `T-20260729-020` | P0 | Backend 런타임·배포·AI provider·비용 후보 결정안 | - | `done`, PR #26 squash merge |
| `T-20260729-021` | P0 | Backend 공통 API·인증·제한·오류 계약 정의 | - | `done`, PR #32 squash merge |
| `T-20260729-022` | P1 | 기본 비활성 원격 STT adapter 계약 정의 | - | `done`, PR #40 squash merge·완료 확정 |
| `T-20260729-023` | P0 | AI 레시피 job·상태 조회·결과 복구 계약 정의 | - | `done`, 완료 검토·Product Owner 승인 완료 |
| `T-20260729-024` | P0 | Backend 보안·개인정보·관측성·비용 guardrail 정의 | - | `done`, PR #50·#51 squash merge·완료 확정 |
| `T-20260729-025` | P0 | iOS·Backend 공용 fixture와 계약 테스트 기준 정의 | - | `done`, PR #63·#64 squash merge |
| `T-20260804-002` | P0 | Backend runtime scaffold·환경 설정·health | - | `done`, Product Owner 최종 승인·PR #70 병합 |
| `T-20260804-003` | P0 | Backend 공통 HTTP·인증·제한·idempotency middleware | - | `done`, PR #76 squash merge |
| `T-20260804-004` | P0 | Mock AI recipe job·status·ACK·복구 저장 경계 | - | `done`, PR #79 squash merge `a73a028` |
| `T-20260804-005` | P0 | 원격 STT 비활성 확장 경계·활성화 차단 | - | `done`, PR #84 squash merge |
| `T-20260804-006` | P0 | Backend redacted logging·비용 원장·TTL cleanup | - | `done`, PR #87 squash merge |
| `T-20260804-007` | P0 | Backend Foundation 통합 계약·보안 검증·handoff | - | `done`, 100/100·PR #91 squash merge |

iOS `T-20260728-003` 하위 실행 후보:

| Task ID | Priority | 제목 | 담당 Agent | 의존성 |
|---|---|---|---|---|
| `T-20260805-002` | P0 | 로컬 도메인·SwiftData migration·draft 생명주기 | - | `done`, PR #77 squash merge `3d1d012` |
| `T-20260805-003` | P0 | Home·전체 보기·검색·상태별 routing | iOS Agent | `approved`, 실행 인계 완료 |
| `T-20260805-004` | P0 | Cooking Log·STEP Preview 자동 저장·오류 상태 | iOS Agent | `proposed`, T-003 선행 |
| `T-20260805-005` | P0 | AI Review·완료 Recipe 편집·삭제 | iOS Agent | `proposed`, T-004 선행 |
| `T-20260805-006` | P0 | Audio Guide·핸즈프리 UI·공통 action model | iOS Agent | `proposed`, T-005 선행 |
| `T-20260805-007` | P0 | 앱 정보·권한·오프라인·서비스 장애 | iOS Agent | `proposed`, T-006 선행 |
| `T-20260805-008` | P0 | iOS UI 구현·기능·기술 접근성 통합 검증 | Development Lead Agent | `blocked`, T-20260811-007·디자인 SHA 고정 후 재개 승인 |
| `T-20260812-001` | P0 | iOS 구현 Visual Fidelity Design QA | Design Lead Agent | `scoped`, T-20260811-007·T-20260805-008 완료 뒤 실행 승인 |

CI `T-20260728-008` 하위 실행 후보:

| Task ID | Priority | 제목 | 담당 Agent | 의존성 |
|---|---|---|---|---|
| `T-20260730-001` | P0 | iOS CI 환경·명령·check 계약 확정 | - | `done`, PR #20 squash merge |
| `T-20260730-002` | P0 | ios-build·build-for-testing workflow 구현 | - | `done`, PR #24 squash merge |
| `T-20260730-003` | P0 | ios-xctest 직렬 실행·timeout·artifact workflow 구현 | - | `done`, PR #28 squash merge |
| `T-20260730-004` | P1 | iOS CI concurrency·진단·cache·artifact 통합 | - | `done`, PR #34 checks·squash merge·완료 확정 |
| `T-20260730-005` | P0 | iOS CI PR dry run·실패 감지·회귀 검증 | - | `done`, PR #36·#46 squash merge |
| `T-20260730-006` | P0 | ios-build·ios-xctest required check 외부 설정 | - | `done`, PR #60 squash merge·완료 확정 |

수익화 동결 후보:

| Task ID | Priority | 제목 | 담당 Lead | 실행 조건 |
|---|---|---|---|---|
| `T-20260728-010` | P1 | 수익화 가격·원가와 출시 정책 확정 | Product Lead Agent / Lead Role | `T-20260728-006`, `009` 완료 후 Product Owner 활성화 승인 |
| `T-20260728-011` | P1 | 구독·Paywall UX 설계 | Design Lead Agent | `T-20260729-002`, `T-20260728-010` |
| `T-20260728-012` | P1 | 구독 entitlement와 AI quota Backend 계약 | Development Lead Agent | `T-20260728-005`, `006`, `009`, `010` |
| `T-20260728-013` | P1 | App Store 구독 상품과 법무·운영 정보 준비 | Product Lead Agent / Lead Role | `T-20260728-007`, `009`, `010` |
| `T-20260728-014` | P1 | iOS StoreKit 2 CookLog Pro 구현 | Development Lead Agent | `T-20260728-003`, `011~013` |
| `T-20260728-015` | P1 | Backend 구독 검증과 AI quota 구현 | Development Lead Agent | `T-20260728-006`, `012`, `013` |
| `T-20260728-016` | P1 | 수익화 이벤트와 AI 비용 관측성 구현 | Development Lead Agent | `T-20260728-014`, `015` |
| `T-20260728-017` | P1 | 구독 Sandbox·TestFlight 통합 검증 | Development Lead Agent | `T-20260728-008`, `014~016` |
| `T-20260728-018` | P1 | 초기 실서비스 수익화 출시 준비 판정 | Product Lead Agent / Lead Role | `T-20260728-017` |

위 9개 Task는 모두 `proposed`이며 Core v1 Critical Path를 차단하지 않습니다. Product Lead Agent의 Lead Role은 Product Team 후보 T-010·013·018의 scope 조율에만 적용합니다. 가격·quota와 출시 포함 여부는 T-010에서 실제 비용을 비교하고 Product Owner가 승인하기 전까지 가설입니다.

완료된 주요 Task:

| Task ID | 제목 | 상태 | 비고 |
|---|---|---|---|
| `T-20260701-001` | 루트 프로젝트 상태 문서 동기화 | `done` | 루트/iOS 상태 문서 동기화 완료 |
| `T-20260701-002` | iOS MVP 수동 QA 체크리스트 수행 | `done` | iOS MVP Core Loop 조건부 통과 완료 |
| `T-20260701-003` | AI Review에 STEP Preview가 전달되지 않는 문제 수정 | `done` | `QA-HIGH-001` 수정 완료 |
| `T-20260728-007` | Git·PR·CI 운영 기준 단일화 | `done` | QA `PASS`, PR #3 squash merge 완료 |
| `T-20260728-019` | develop 통합 브랜치 기반 Git 운영 전환 | `done` | `develop` 통합과 `main` 승격 정책 전환 |
| `T-20260728-002` | CookLog MVP UI/UX v1 설계와 Figma 버전 미러 | `done` | Design QA 통과, PR #6 squash merge 완료 |
| `T-20260728-004` | iOS XCTest runner 대기 원인 조사와 테스트 실행 안정화 | `done` | iOS QA 통과, 위험 수용, PR #8 squash merge 완료 |
| `T-20260729-008` | 확정 UX용 디자인 Foundation·공통 컴포넌트 갱신 | `done` | Design QA·완료 검토 통과, PR #11 squash merge 완료 |
| `T-20260729-009` | Home·전체 보기·검색·레시피 상태 routing 디자인 | `done` | Design QA·완료 검토 통과, PR #16 squash merge 완료 |
| `T-20260729-010` | Cooking Log·STEP Preview·기기 내 STT·권한·오류 디자인 | `done` | Design QA·완료 검토 통과, PR #22 squash merge 완료 |
| `T-20260729-011` | AI 처리·AI Review·완료 레시피 편집·삭제 디자인 | `done` | Design QA·완료 검토 통과, PR #30 squash merge 완료 |
| `T-20260729-020` | Backend 런타임·배포·AI provider·비용 후보 결정안 | `done` | Backend QA·완료 검토 통과, PR #26 squash merge 완료 |
| `T-20260729-021` | Backend 공통 API·인증·제한·오류 계약 정의 | `done` | Backend QA·완료 검토 통과, PR #32 squash merge 완료 |
| `T-20260730-001~003` | iOS CI 계약·build·XCTest workflow | `done` | hosted check·33/33·artifact 검증과 PR #20·24·28 통합 완료 |
| `T-20260730-004` | iOS CI concurrency·진단·cache·artifact 통합 | `done` | PR #34 hosted checks·artifact·33/33과 완료 확정 |
| `T-20260730-005` | iOS CI PR dry run·실패 감지·회귀 검증 | `done` | PR #36 검증 산출물 통합·PR #46 완료 기록 통합 |

## 5. Backlog Candidates

기존 Backlog 후보는 다음 Task에 반영했습니다.

- AI Review 문자열 편집과 키보드 가림: `T-20260728-003`
- 다단계 Audio Guide와 실제 기기 검증: `T-20260729-006`, `T-20260728-009`
- `xcodebuild test` 대기 이슈: `T-20260728-004`

## 6. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-08-04 | Product QA가 T-20260804-001 HIGH 2건 해소, strict 10/10과 상태·Task graph·최신 develop 무회귀를 확인해 `PASS`, `verification_passed`로 인계 |
| 2026-08-04 | Product Lead가 T-20260804-001 QA PASS와 실행 동결 유지를 수용해 `completion_review`, Product Owner 최종 승인으로 로컬 `done` 확정 |
| 2026-08-04 | T-20260804-001에서 수익화 Source of Truth와 T-010~018 `proposed` 후보를 복구하고 Lead Role·schema 재작업 후 Product QA 재검증으로 인계 |
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
| 2026-07-28 | `T-20260728-007` 전용 Task branch에서 정책 문서 단일화 실행 시작 |
| 2026-07-28 | `T-20260728-007` 정책 문서와 보고서 작성을 완료하고 iOS QA 독립 검증 대기로 전환 |
| 2026-07-28 | iOS QA Agent가 `T-20260728-007`을 `PASS_WITH_RISK`로 검증하고 브랜치 기준점 재정렬을 merge gate로 기록 |
| 2026-07-28 | iOS QA Agent가 최신 `origin/main` 기준 재정렬과 patch 동등성을 확인하고 `QA-RISK-007-001` 해소 후 완료 검토로 인계 |
| 2026-07-28 | `T-20260728-007` PR #3 squash merge와 완료 검토를 마치고 `done` 확정 |
| 2026-07-28 | `T-20260728-019`에서 일반 Task의 `develop` 통합과 `main` 승격 정책을 확정 |
| 2026-07-28 | `T-20260728-002` Figma 방향 선택과 Starter 별도 Light·Dark 구조 반영 후 MCP 월간 호출 한도로 blocked 전환 |
| 2026-07-28 | `design/prototype/`을 UI Source of Truth로 확정하고 Figma를 점진적 미러로 재분류해 `T-20260728-002` 실행 재개 |
| 2026-07-28 | `T-20260728-002` 로컬 UI 원본과 핸드오프를 완료하고 독립 Design QA 대기로 전환 |
| 2026-07-28 | `T-20260728-002` 독립 Design QA에서 핵심 흐름·접근성·상태 결함을 확인하고 rework_requested로 전환 |
| 2026-07-28 | `T-20260728-002` QA 결함 6건을 3개 순차 재작업 패키지로 조율하고 scoped로 전환 |
| 2026-07-28 | Product Owner가 `T-20260728-002` 재작업을 승인하고 UI/UX Design Agent에 재라우팅 |
| 2026-07-28 | UI/UX Design Agent가 `T-20260728-002` 재작업 lock을 획득하고 실행 시작 |
| 2026-07-28 | UI/UX Design Agent가 `T-20260728-002` QA 결함 6건의 재작업과 자체 검증을 완료하고 독립 Design QA 대기로 전환 |
| 2026-07-28 | 전용 worktree 인계 검토에서 `T-20260728-002` 잔여 대비·draft 보존·첫 Processing 번호를 보완하고 verification_ready 유지 |
| 2026-07-28 | Design QA가 `T-20260728-002` 기존 결함 해소와 구현 핸드오프 Source of Truth 충돌을 확인해 rework_requested로 전환 |
| 2026-07-28 | UI/UX Design Agent가 `DQA-MEDIUM-005`를 수정·자체 검증하고 Design QA 독립 재검증 대기로 전환 |
| 2026-07-28 | Design QA Agent가 `DQA-MEDIUM-005` 해소를 독립 재검증하고 `T-20260728-002`를 verification_passed로 Design Lead Agent에 인계 |
| 2026-07-28 | `T-20260728-002` PR #6 squash merge를 확인하고 `done` 확정, T-003의 T-002 의존성 충족 반영 |
| 2026-07-28 | `T-20260728-004` 진단·안정화·반복 검증 패키지를 scope하고 Product Owner 실행 승인 대기로 전환 |
| 2026-07-28 | Product Owner가 `T-20260728-004` 실행을 승인하고 iOS Agent에 WP-1 시작 라우팅 |
| 2026-07-28 | iOS Agent가 `T-20260728-004` 전용 worktree에서 lock을 획득하고 WP-1 진단 시작 |
| 2026-07-28 | iOS XCTest 33개 3회 연속 통과와 artifact 절차 확정 후 `verification_ready`로 iOS QA Agent에 인계 |
| 2026-07-28 | iOS QA Agent가 전체 XCTest 33개, timeout 124, artifact와 build 회귀를 독립 재현하고 `PASS_WITH_RISK`로 Development Lead Agent에 인계 |
| 2026-07-28 | Product Owner가 `QA-RISK-004-001`을 수용하고 Xcode·Simulator 고정 검증을 T-008로 인계해 T-004를 `completion_review`로 전환 |
| 2026-07-29 | 확정 제품 UX의 문서화와 디자인 갱신 후보 `T-20260729-001`, `T-20260729-002`를 proposed로 분리하고 T-003 의존성에 연결 |
| 2026-07-29 | Product Owner 요청으로 T-20260729-001을 승인·실행 전환하고 확정된 제품 UX부터 Source of Truth에 증분 반영 |
| 2026-07-29 | 첫 공개 출시 Roadmap으로 Queue를 재구성하고 중복 M8 검증 T-001을 cancelled 처리 |
| 2026-07-29 | T-003·005·006·009 범위를 출시 기준으로 수정하고 T-20260729-003~006 Backend/iOS 실서비스 상위 Task 등록 |
| 2026-07-29 | T-20260729-001 문서·출시 Task 구성을 완료하고 Product QA Agent 독립 검증 대기로 전환 |
| 2026-07-29 | Product QA PASS_WITH_RISK와 Product Lead Completion Review 후 T-20260729-001 done 확정 |
| 2026-07-29 | Product QA registry·운영 모델·루트 AGENTS.md 동기화 후속 T-20260729-007 proposed 등록 |
| 2026-07-29 | Product QA Agent가 T-20260729-001을 `PASS_WITH_RISK`로 검증하고 Product Lead 완료 검토로 인계 |
| 2026-07-29 | `T-20260728-004` PR #8 squash merge SHA `58403a0`을 확인하고 `completion_review -> done` 완료 확정 |
| 2026-07-29 | 원격 STT 월 약 10만 원의 초기 비용 부담에 따라 T-20260729-026에서 첫 출시 기본값을 Apple 기기 내 STT로 변경하고 Product QA 검증 대기로 전환 |
| 2026-07-30 | Product QA가 T-20260729-026의 필수 재작업 3건과 Task graph·T-020 보존을 재검증해 verification_passed로 Product Lead 완료 검토에 인계 |
| 2026-07-30 | Product Owner가 T-20260729-026 최종 완료를 승인해 `completion_review -> done`으로 확정하고 develop 통합 진행 |
| 2026-07-29 | Product Owner 승인으로 T-20260729-002 Design Lead scope를 시작하고 순차 실행 하위 Task T-20260729-008~014를 proposed 등록 |
| 2026-07-29 | Product Owner가 첫 Design 하위 Task `T-20260729-008` 실행을 승인하고 UI/UX Design Agent 전용 worktree를 준비 |
| 2026-07-29 | UI/UX Design Agent가 `T-20260729-008` Foundation·공통 컴포넌트 갱신과 자체 검증을 완료하고 Design QA 대기로 전환 |
| 2026-07-29 | Design QA Agent가 `T-20260729-008`의 완료 카드 badge와 Manifest–Gallery variant 누락을 확인해 rework_requested로 전환 |
| 2026-07-29 | Product Owner가 `T-20260729-008` Design QA 결함 2건 재작업을 승인하고 UI/UX Design Agent에 재라우팅 |
| 2026-07-29 | UI/UX Design Agent가 `T-20260729-008` 결함 2건 재작업과 자체 검증을 완료하고 Design QA 독립 재검증 대기로 전환 |
| 2026-07-30 | Design QA Agent가 `T-20260729-008` 결함 2건 해소와 회귀 없음을 확인해 verification_passed로 Design Lead Agent에 인계 |
| 2026-07-30 | Design Lead Agent가 `T-20260729-008` 완료 검토를 통과시켜 completion_review로 인계하고 develop 통합 전 done 전환을 보류 |
| 2026-07-30 | Product Owner 승인으로 `T-20260729-008` PR #11을 develop에 squash merge하고 merge SHA `5de6a93` 확인 후 done 확정 |
| 2026-07-30 | Development Lead Agent가 T-20260728-005를 최신 기기 내 STT 정책 기준으로 scope하고 하위 T-20260729-020~025를 proposed 등록 |
| 2026-07-30 | Development Lead Agent가 T-20260728-008을 scope하고 CI 구현·검증·required check 설정 하위 T-20260730-001~006을 proposed 등록 |
| 2026-07-30 | Product Owner가 `T-20260729-009` 실행을 승인하고 최신 origin/develop 기반 전용 worktree를 준비해 UI/UX Design Agent에 라우팅 |
| 2026-07-30 | UI/UX Design Agent가 `T-20260729-009` Home·전체 보기·검색·상태 routing 구현과 자체 검증을 완료하고 Design QA 독립 검증 대기로 전환 |
| 2026-07-30 | Design QA Agent가 `T-20260729-009`의 최근 활동순 계산, 영구 삭제 키보드 포커스와 재료 검색 상태 전이 결함을 확인해 rework_requested로 전환 |
| 2026-07-30 | Design QA Agent가 `T-20260729-009` 결함 3건 해소와 기존 통과 항목 무회귀를 독립 재검증해 verification_passed로 Design Lead Agent에 인계 |
| 2026-07-30 | Product Owner가 `T-20260729-009` Design QA 결함 3건 재작업을 승인하고 UI/UX Design Agent에 재라우팅 |
| 2026-07-30 | UI/UX Design Agent가 `T-20260729-009` 결함 3건 재작업과 자체 회귀 검증을 완료하고 Design QA 독립 재검증 대기로 전환 |
| 2026-07-30 | Design Lead Agent가 `T-20260729-009` 완료 검토를 통과시켜 completion_review로 인계하고 develop 통합 전 done 전환을 보류 |
| 2026-07-30 | Product Owner 승인으로 `T-20260729-009` PR #16을 develop에 squash merge하고 merge SHA `44fc8a9` 확인 후 done 확정 |
| 2026-07-30 | Design Lead Agent가 `T-20260729-010`을 Apple 기기 내 STT·오프라인 기록 가능 기준으로 scope하고 최신 develop 기반 전용 worktree를 준비 |
| 2026-07-30 | Product Owner가 `T-20260729-010` 실행을 승인하고 UI/UX Design Agent에 라우팅 |
| 2026-07-30 | UI/UX Design Agent가 `T-20260729-010` Cooking Log·STEP Preview·기기 내 STT·권한·오류 구현과 자체 검증을 완료하고 Design QA 독립 검증 대기로 전환 |
| 2026-07-30 | Design QA Agent가 `T-20260729-010`의 자동 재처리, Undo 수명주기·포커스, 오프라인 기록 행동 중복과 Prototype 표기 결함을 확인해 rework_requested로 전환 |
| 2026-07-30 | Design QA Agent가 `T-20260729-010` 결함 4건 해소와 기존 통과 항목 무회귀를 독립 재검증해 verification_passed로 Design Lead Agent에 인계 |
| 2026-07-30 | Product Owner가 `T-20260729-010` Design QA 결함 4건 재작업을 승인하고 UI/UX Design Agent에 재라우팅 |
| 2026-07-30 | UI/UX Design Agent가 `T-20260729-010` 결함 4건 재작업과 동적·접근성 회귀 검증을 완료하고 Design QA 독립 재검증 대기로 전환 |
| 2026-07-30 | Design Lead Agent가 `T-20260729-010` 완료 검토를 통과시켜 completion_review로 인계하고 develop 통합 전 done 전환을 보류 |
| 2026-07-30 | Product Owner 승인으로 `T-20260729-010` PR #22를 develop에 squash merge하고 merge SHA `aaa6ff2` 확인 후 done 확정 |
| 2026-07-30 | Design Lead Agent가 `T-20260729-011`의 제품 범위와 최신 develop 기반 전용 worktree를 준비해 scoped로 전환하고 실행 승인 대기 |
| 2026-07-31 | Product Owner가 `T-20260729-011` 실행을 승인하고 UI/UX Design Agent에 라우팅 |
| 2026-07-31 | UI/UX Design Agent가 `T-20260729-011` AI 처리·Review 편집/저장·완료 레시피 수정/삭제 실행과 자체 검증을 완료하고 Design QA 독립 검증 대기로 전환 |
| 2026-07-31 | Design QA Agent가 `T-20260729-011`의 변경 폐기·완료 저장 경계 HIGH 3건과 키보드 포커스·STEP 정규화 MEDIUM 4건을 확인해 rework_requested로 전환 |
| 2026-07-31 | Product Owner가 `T-20260729-011` Design QA 결함 7건 재작업을 승인하고 UI/UX Design Agent에 재라우팅 |
| 2026-07-31 | UI/UX Design Agent가 `T-20260729-011` 재작업 lock을 획득하고 승인된 Design QA 결함 7건 수정 시작 |
| 2026-07-31 | UI/UX Design Agent가 `T-20260729-011` 결함 7건 재작업과 동적·레이아웃 회귀 검증을 완료하고 Design QA 독립 재검증 대기로 전환 |
| 2026-07-31 | Design QA Agent가 `T-20260729-011` 결함 7건 해소와 기존 통과 항목 무회귀를 독립 재검증해 verification_passed로 Design Lead Agent에 인계 |
| 2026-07-31 | Design Lead Agent가 `T-20260729-011` 완료 검토를 통과시켜 completion_review로 인계하고 develop 통합 전 done 전환을 보류 |
| 2026-07-31 | Product Owner 승인으로 `T-20260729-011` PR #30을 develop에 squash merge하고 merge SHA `c98741a` 확인 후 done 확정 |
| 2026-07-31 | Product Owner가 루트·운영·iOS·Design·PRD PDF 참조 정합성 복구 T-20260731-001을 승인하고 Product Lead Agent가 실행 시작 |
| 2026-07-31 | `T-20260729-021` PR #32 squash merge와 완료 확정을 반영하고 Task 상태 집계를 최신화 |
| 2026-07-31 | `T-20260731-001` 자체 검증과 최신 develop 정렬을 마치고 Product QA `verification_ready`로 인계 |
| 2026-07-31 | Product QA가 T-20260731-001 활성 문서 충돌 4건을 확인해 `rework_requested`로 인계하고 Product Owner가 재작업·추가 경로를 승인 |
| 2026-07-31 | 최신 develop의 T-20260730-004 `completion_review`를 병합하고 T-20260731-001 재작업 시작 |
| 2026-07-31 | T-20260730-004 PR #34 checks·squash merge와 최종 `done` 확정을 최신 develop에서 반영 |
| 2026-07-31 | T-20260731-001 승인 재작업 4건의 자체 검증을 마치고 Product QA `verification_ready`로 재인계 |
| 2026-07-31 | Product QA 재검증에서 Development Board의 T-004 `done`·완료 확정 대기 충돌이 남아 `rework_requested`로 재인계 |
| 2026-07-31 | Product Owner가 PQA-HIGH-031-002 재작업을 승인하고 Development Board T-004 상태를 `done`으로 단일화해 Product QA 재재검증 인계 |
| 2026-07-31 | 최신 develop `93f577e`의 T-022 `completion_review`, T-023·024 `approved` 상태와 원격 STT 계약 산출물 반영 |
| 2026-07-31 | 최신 develop `5118712`의 T-022 PR #40 squash merge·`done` 완료 확정 반영 |
| 2026-07-31 | Product QA 재재검증에서 T-004 해소를 확인했으나 Development Board Backend 상위 요약이 T-022 `done`·T-023·024 `approved`를 반영하지 않아 `rework_requested`로 재인계 |
| 2026-07-31 | Product Owner 승인으로 Development Board Backend 상위 요약을 T-020~022 `done`, T-023·024 `approved`, T-025 선행 대기로 정렬하고 Product QA 재검증 재인계 |
| 2026-07-31 | Product QA가 PQA-HIGH-031-001~004 최종 해소와 전체 무회귀를 확인해 `PASS`·`verification_passed`로 Product Lead 완료 검토에 인계 |
| 2026-07-31 | Product Lead가 QA PASS·허용 경로·최신 develop 정렬을 수용해 `completion_review`로 전환하고 Product Owner 최종 승인 대기 |
| 2026-07-31 | Product Owner가 T-20260731-001 최종 완료와 develop 통합을 승인해 `completion_review -> done` 확정 |
| 2026-07-31 | Product Owner가 최신 제품 결정대로 핸즈프리 포함과 `T-20260729-012` 실행을 승인하고 UI/UX Design Agent에 라우팅 |
| 2026-07-31 | UI/UX Design Agent가 `T-20260729-012` 전용 worktree에서 lock을 획득하고 Audio Guide·핸즈프리·오디오 중단 상태 디자인 실행 시작 |
| 2026-07-31 | UI/UX Design Agent가 `T-20260729-012` 구현과 동적·레이아웃 검증을 완료하고 Design QA 독립 검증 대기로 전환 |
| 2026-07-31 | Design QA Agent가 `T-20260729-012`의 저장 레시피 원본·명령 동등성·권한·재생 보존 HIGH 4건과 포커스·TTS fallback MEDIUM 2건을 확인해 rework_requested로 전환 |
| 2026-07-31 | Product Owner가 `T-20260729-012` Design QA 결함 6건의 재작업을 승인하고 UI/UX Design Agent에 재라우팅 |
| 2026-07-31 | UI/UX Design Agent가 최신 develop 기반 T-012 재작업 worktree에서 lock을 획득하고 결함 6건 재작업 시작 |
| 2026-07-31 | UI/UX Design Agent가 T-012 결함 6건 보완과 동적·접근성·레이아웃 자체 검증을 완료하고 Design QA 독립 재검증 대기로 전환 |
| 2026-07-31 | Design QA Agent가 `T-20260729-012` 재검증에서 HIGH 4건과 TTS fallback 해소를 확인했으나 자동 재생 완료 포커스 결함 1건이 남아 rework_requested로 반환 |
| 2026-07-31 | Product Owner가 `T-20260729-012`의 잔존 자동 완료 포커스 결함 1건 재작업을 승인하고 UI/UX Design Agent에 재라우팅 |
| 2026-07-31 | UI/UX Design Agent가 T-012 포커스 재작업 worktree에서 lock을 획득하고 자동 완료 포커스 결함 수정 시작 |
| 2026-07-31 | UI/UX Design Agent가 T-012 자동 완료 포커스 결함 수정과 무회귀 검증을 완료하고 Design QA 독립 재검증 대기로 전환 |
| 2026-07-31 | Design QA Agent가 T-012 자동 완료 포커스와 기존 결함 6건·접근성 무회귀를 독립 재검증해 verification_passed로 Design Lead Agent에 인계 |
| 2026-07-31 | Design Lead Agent가 T-012 성공 기준·최종 QA·allowed paths·Figma 비차단·iOS 핸드오프를 확인해 completion_review로 인계 |
| 2026-07-31 | Product Owner 승인으로 T-012 PR #42를 develop에 squash merge하고 merge SHA `2b9b750`·두 CI 성공 확인 후 done 확정 |
| 2026-07-31 | T-005 공용 상태 복구 PR #47 병합 후 T-20260731-002 프로젝트 상태·Git 안전 guardrail을 정식 등록하고 독립 검증으로 인계 |
| 2026-07-31 | T-20260731-002 독립 AI Ops PASS와 PR #48 squash merge를 확인해 `done`으로 확정 |
| 2026-08-04 | Development Lead가 T-020~025 `done`·독립 Backend QA·공용 계약 validator를 집계해 T-20260728-005 완료 리뷰를 `PASS_WITH_RISK`, `completion_review`로 수용 |
| 2026-08-04 | Product Owner가 T-20260728-005 잔여 위험과 병합을 승인하고 PR #65 merge SHA `4e0bca4`를 확인해 `done`으로 확정 |
| 2026-08-04 | T-20260729-014 최종 Design QA·Design Lead 완료 검토와 PR #68 merge SHA `3d9a9a4`를 확인해 `done`으로 확정 |
| 2026-08-04 | Design Lead가 T-008~014 완료·통합 QA·상위 성공 기준을 수용해 T-20260729-002를 `done`으로 확정 |
| 2026-08-05 | T-20260805-001 Core Loop 23개 iOS 구현·Visual QA 계약을 공용화하고 T-20260728-003의 선행 기준으로 연결 |
| 2026-08-04 | Product Owner가 T-20260728-006 진행을 승인하고 Development Lead가 T-20260804-002~007로 scope, T-002를 Backend Agent 실행 승인 인계 |
| 2026-08-04 | Backend QA가 T-20260804-002 shutdown deadline 결함을 FAIL로 인계하고 Product Owner가 강제 종료·process-level 회귀 재작업을 승인 |
| 2026-08-05 | T-20260804-002 Backend QA 재검증 PASS_WITH_RISK와 Lead 완료 리뷰를 수용해 `completion_review`로 전환, container 실검증은 T-007 인계 |
| 2026-08-05 | Product Owner가 T-20260804-002 완료와 PR #70 병합을 승인해 `done` 확정, 후속 T-003 실행 승인 검토로 인계 |
| 2026-08-05 | Product Owner가 iOS T-20260728-003 진행을 승인하고 7개 하위 패키지로 scope, 첫 T-20260805-002를 iOS Agent 실행 승인 인계 |
| 2026-08-05 | T-20260805-002 HIGH 2건 재작업·독립 QA·CI fixture 보강·required checks를 통과하고 PR #77 squash merge `3d1d012`로 `done` 확정, T-003 별도 실행 승인 대기 |
| 2026-08-05 | T-20260804-004 HIGH 2건·MEDIUM 1건 재작업과 독립 QA·Lead 완료 리뷰를 통과하고 PR #79 squash merge `a73a028`로 `done` 확정, T-005 별도 실행 승인 검토로 인계 |
| 2026-08-12 | Product Owner가 T-20260805-008의 개발 기능·기술 접근성 검증과 Visual Fidelity Design QA 분리를 승인; T-008은 최신 디자인 baseline 고정까지 `blocked`, 신규 T-20260812-001은 `scoped`로 등록 |
