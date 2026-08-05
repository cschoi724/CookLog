# Core Development Team Board

작성일: 2026-07-28
상태: Active

실제 실행 지시는 `.ai_project/tasks/`의 Task 파일이 기준이다.

| Task ID | 상태 | Workstream | 제목 | 담당 Role | 의존성 | 다음 조치 |
|---|---|---|---|---|---|---|
| `T-20260728-001` | `cancelled` | iOS | iOS M8 잔여 안정화와 최종 검증 | - | - | 유효 항목 T-003/T-009 통합 |
| `T-20260728-003` | `scoped` | iOS | 확정 제품 UX·디자인과 iOS 로컬 상태 모델 적용 | Development Lead Agent | 하위 `T-20260805-002~008` | Product Owner 진행 승인, T-002 iOS Agent 인계 |
| `T-20260728-004` | `done` | iOS | iOS XCTest runner 대기 원인 조사와 테스트 실행 안정화 | - | `T-20260729-001` 완료 | PR #8 squash merge 완료 |
| `T-20260728-005` | `done` | Backend | Backend AI gateway와 기본 비활성 원격 STT adapter 계약 정의 | - | 하위 `T-20260729-020~025` 완료 | PR #65 squash merge `4e0bca4`·완료 확정 |
| `T-20260728-006` | `scoped` | Backend | Backend AI gateway와 비활성 원격 STT adapter foundation 구현 | Development Lead Agent | 하위 `T-20260804-002~007` | Product Owner 진행 승인, T-002 Backend Agent 인계 |
| `T-20260728-007` | `done` | CI/Ops | Git·PR·CI 운영 기준 단일화 | - | 없음 | 완료 |
| `T-20260728-008` | `scoped` | CI | iOS CI 기본 파이프라인 구축 | Development Lead Agent | 하위 `T-20260730-001~006` | T-001~005 완료, T-006 별도 승인 대기 |
| `T-20260728-009` | `proposed` | Release | iOS 첫 공개 출시 통합·TestFlight·App Store 게이트 | Development Lead Agent | R1·R2 차단 Task 전체 | 선행 검증 후 6개 하위 패키지 |
| `T-20260729-003` | `proposed` | Backend | 실제 AI provider와 배포 가능한 Backend gateway 구축 | Development Lead Agent | `T-20260728-005` 완료, `006` 대기 | T-006과 AI provider 승인 후 하위 패키지 |
| `T-20260729-004` | `proposed` | iOS | iOS 10초 녹음·권한·Apple 기기 내 STT 연동 | Development Lead Agent | `T-20260728-003`, `T-20260729-026` | 제품 정책 완료 후 scope |
| `T-20260729-005` | `proposed` | iOS | iOS AI 정리·처리 복구·AI Review 실서비스 연동 | Development Lead Agent | `T-20260728-005` 완료, `003`, `T-20260729-003` 대기 | 나머지 선행 구현·환경 대기 |
| `T-20260729-006` | `proposed` | iOS | iOS 로컬 TTS·오디오 중단·핸즈프리 구현 | Development Lead Agent | `T-003` | 핸즈프리 spike 포함 scope |
| `T-20260729-020` | `done` | Backend | 런타임·배포·AI provider·비용 후보 결정안 | - | `T-20260729-026` 완료 | PR #26 squash merge·완료 확정 |
| `T-20260729-021` | `done` | Backend | 공통 API·인증·제한·오류 계약 | - | `T-20260729-026` 완료 | PR #32 squash merge·완료 확정 |
| `T-20260729-022` | `done` | Backend | 기본 비활성 원격 STT adapter 계약 | - | `T-20260729-021`, `026` 완료 | PR #40 checks 통과·squash merge·완료 확정 |
| `T-20260729-023` | `done` | Backend | AI recipe job·상태 조회·결과 복구 계약 | - | `T-20260729-020`, `021` 완료 | 완료 검토·Product Owner 승인 완료, T-025 인계 |
| `T-20260729-024` | `done` | Backend | 보안·개인정보·관측성·비용 guardrail | - | `T-20260729-020`, `021` 완료 | PR #50 squash merge `00feb017`·완료 확정, T-025 착수 |
| `T-20260729-025` | `done` | Backend | iOS·Backend fixture·계약 테스트 기준 | - | `T-20260729-021~024` 완료 | PR #63 squash merge `8eea645`·완료 확정 |
| `T-20260728-012` | `proposed` | Backend/계약 | 구독 entitlement와 AI quota 계약 | Development Lead Agent | `T-20260728-005`, `006`, `009`, `010` | 수익화 activation gate 대기 |
| `T-20260728-014` | `proposed` | iOS | StoreKit 2 CookLog Pro 구현 | Development Lead Agent | `T-20260728-003`, `011~013` | 수익화 선행 Task 대기 |
| `T-20260728-015` | `proposed` | Backend | 구독 검증과 AI quota 구현 | Development Lead Agent | `T-20260728-006`, `012`, `013` | 수익화 선행 Task 대기 |
| `T-20260728-016` | `proposed` | Cross-platform | 수익화 이벤트와 AI 비용 관측성 | Development Lead Agent | `T-20260728-014`, `015` | 구현 완료 후 scope |
| `T-20260728-017` | `proposed` | QA/Release | 구독 Sandbox·TestFlight 통합 검증 | Development Lead Agent | `T-20260728-008`, `014~016` | 외부 설정 별도 승인 필요 |
| `T-20260804-002` | `done` | Backend | runtime scaffold·환경 설정·health | - | `T-20260728-005` 완료 | Product Owner 최종 승인·PR #70 병합, T-003 별도 실행 승인 검토 |
| `T-20260804-003` | `done` | Backend | 공통 HTTP·인증·제한·idempotency middleware | - | `T-20260804-002` 완료 | Product Owner 잔여 위험 수용·PR #76 병합, T-004 완료 |
| `T-20260804-004` | `done` | Backend | Mock AI recipe job·status·ACK·복구 | - | `T-20260804-002`, `003` 완료 | Product Owner 최종 승인·PR #79 squash merge `a73a028` |
| `T-20260804-005` | `done` | Backend | 원격 STT 비활성 확장 경계·활성화 차단 | - | `T-20260804-002`, `003` 완료 | Product Owner 완료·PR #84 squash merge 승인, develop 병합 확인 |
| `T-20260804-006` | `verification_ready` | Backend | redacted logging·비용 원장·TTL cleanup | Backend QA Agent | `T-20260804-003~005` 완료 | T-006 20/20·전체 86/86·공용 validator 통과, 독립 QA 대기 |
| `T-20260804-007` | `proposed` | Backend | Foundation 통합 계약·보안 검증·handoff | Backend Agent | `T-20260804-002~006` | 최종 통합 패키지 |
| `T-20260805-002` | `done` | iOS | 로컬 도메인·SwiftData migration·draft 생명주기 | - | 디자인 기준 완료 | PR #77 squash merge `3d1d012`·완료 확정 |
| `T-20260805-003` | `done` | iOS | Home·전체 보기·검색·상태별 routing | - | `T-20260805-002` 완료 | 완료 리뷰 PASS_WITH_RISK·병합 승인, 공용 효력은 develop 병합 후 |
| `T-20260805-004` | `approved` | iOS | Cooking Log·STEP Preview 자동 저장·오류 상태 | iOS Agent | `T-20260805-003` 완료 | Product Owner 별도 실행 승인, clean worktree lock 후 구현 |
| `T-20260805-005` | `proposed` | iOS | AI Review·완료 Recipe 편집·삭제 | iOS Agent | `T-20260805-004` | Cooking Log 완료 대기 |
| `T-20260805-006` | `proposed` | iOS | Audio Guide·핸즈프리 UI·공통 action model | iOS Agent | `T-20260805-005` | Review·Recipe 완료 대기 |
| `T-20260805-007` | `proposed` | iOS | 앱 정보·권한·오프라인·서비스 장애 | iOS Agent | `T-20260805-006` | Audio UI 완료 대기 |
| `T-20260805-008` | `proposed` | iOS | 접근성·작은 화면·다크 모드·통합 회귀 | iOS Agent | `T-20260805-002~007` | 전체 구현 완료 후 통합 검증 |

`T-20260728-005`는 최신 기기 내 STT 정책을 기준으로 6개 하위 Task까지 scope했습니다.
T-020~025는 모두 `done`입니다. T-025는 공통 header와 negative validator 재작업,
Backend QA 독립 재검증과 완료 검토를 통과하고 PR #63으로 `develop`에 병합됐습니다.
원격 STT는 T-022의 기본 비활성 문서 계약으로만 유지합니다. 일반 개발 Task는 최신
`develop` 기반 전용 worktree와 `develop` 대상 PR을 사용합니다.

Product Owner가 T-006 진행을 승인했습니다. Development Lead는 runtime scaffold,
공통 middleware, Mock AI, STT 비활성 경계, 보안·cleanup, 통합 검증의 6개 패키지로
분해했습니다. T-002~004는 독립 QA·완료 리뷰·Product Owner 최종 승인을 통과해
`done`입니다. T-004는 PR #79 squash merge `a73a028`로 공용 완료를 확정했습니다.
Product Owner가 T-005를 별도 실행 승인해 Backend Agent에 인계했습니다. disabled
resolver·activation gate와 route·body read·queue·egress 0회 검증만 구현하며 T-006~007은
나머지 선행 완료를 기다립니다. 실제 provider·cloud 배포·원격 STT endpoint는 범위
밖입니다.

Backend QA는 T-002의 shutdown deadline 뒤 listener·process 생존을
`QA-HIGH-002-001`로 확인해 `FAIL`로 인계했습니다. Product Owner가 deadline 강제 종료,
두 번째 signal, hanging close·keep-alive·실제 process 상한 테스트 재작업을 승인했습니다.
Backend Agent는 최신 `develop` 충돌을 해소하고 자체 검증 후 Backend QA에 재인계합니다.
T-003~007은 T-002가 `done`이 될 때까지 차단합니다.

Backend QA 재검증은 `QA-HIGH-002-001` 해소와 전체 15/15·기존 계약 무회귀를
`PASS_WITH_RISK`로 확인했습니다. Development Lead는 Docker·Node 24·non-root
container 실실행을 T-007 필수 통합 게이트로 이관하는 조건으로 잔여 위험을 수용하고
T-002를 `completion_review`로 전환했습니다.

Product Owner가 완료 리뷰와 Docker 잔여 위험의 T-007 이관을 승인해 T-002를
`done`으로 확정하고 PR #70 병합을 승인했습니다. T-003은 공용 `develop` 병합 후
선행 조건 해제를 확인하고 별도 실행 승인으로 착수합니다.

2026-08-05 Product Owner가 T-003 실행을 승인했습니다. Backend Agent는 공통 HTTP
envelope·설치 인증 interface/local fake·installation/IP/project limiter·idempotency
단일 승자와 replay를 허용 경로 안에서 구현하고 독립 Backend QA로 인계합니다.

Development Lead는 T-020~025의 `done`, 하위 Backend QA 최종 판정, Source of Truth
연결과 공용 계약 validator를 집계해 T-005 완료 리뷰를 `PASS_WITH_RISK`로 수용했습니다.
실제 runtime·provider·iOS·staging 위험은 후속 Task에 유지합니다. Product Owner가
잔여 위험을 수용하고 PR #65를 `develop`에 squash merge했으며 merge SHA `4e0bca4`를
확인해 `done`으로 확정했습니다.

Product Owner가 iOS T-003 진행을 승인했습니다. Development Lead는 로컬 생명주기,
Home, Cooking Log, AI Review·Recipe, Audio Guide, 앱 정보·실패 상태, 통합 접근성의
7개 패키지로 분해했습니다. T-002만 `approved`로 iOS Agent에 인계하고 T-003~008은
선행 완료 전 `proposed`로 유지합니다. 실제 STT·Backend AI·TTS는 후속 Task 범위입니다.

iOS QA는 T-20260805-002 재작업의 HIGH 2건 해소와 집중 4/4·전체 43/43 XCTest,
실제 non-empty migration 데이터 보존을 독립 확인해 `PASS`로 인계했습니다.
Development Lead 완료 리뷰와 Product Owner 완료·PR #77 병합 승인을 거쳐
squash merge SHA `3d1d012`로 공용 `done`을 확정했습니다. T-003 선행은 해소됐으며
Product Owner가 별도 실행을 승인해 iOS Agent에 인계했습니다. Home·전체 보기·검색·
상태별 routing만 구현하고 T-004~008과 실제 STT·Backend AI·TTS는 선행하지 않습니다.

T-20260805-003 독립 QA에서 전체 XCTest 48/48과 검색·동일 UUID route는 통과했으나
진행 기록 삭제 HIGH 1건과 AI 준비 배너·카드 metadata·생성 실패 재시도 MEDIUM 3건이
확인됐습니다. Development Lead가 네 결함을 `WP-R1~R4`로 범위화했고 Product Owner가
재작업을 승인해 iOS Agent에 다시 인계했습니다. T-004는 재검증 완료 전까지 차단합니다.

iOS Agent가 진행 record 삭제·backfill·실패한 삭제 전용 retry, AI Review 준비 배너,
lifecycle별 카드 metadata, 조회·생성 오류 분리를 구현했습니다. 신규 회귀를 포함한 전체
XCTest 54/54와 Simulator 설치·실행을 통과해 iOS QA Agent의 독립 재검증을 기다립니다.

iOS QA Agent 재검증에서 기존 HIGH 1건·MEDIUM 3건 해소와 Home 13개·전체 XCTest
54/54, 실제 생성·전환·재실행 복구, 375×667 Light/Dark 무회귀를 확인했습니다.
`PASS_WITH_RISK`, `verification_passed`이며 Development Lead가 완료 검토와 T-004
의존성 해제를 판단합니다. launch configuration 위험은 계획된 T-008로 인계합니다.

Development Lead가 최신 develop 기준 허용 경로와 성공 기준을 검토하고 전체 XCTest
54/54를 직접 재실행해 완료 리뷰를 `PASS_WITH_RISK`로 확정했습니다. Product Owner의
조건부 완료·병합 승인 조건을 충족해 T-003을 `done`으로 확정했으며, 공용 효력은 develop
병합 후 발생합니다. T-004 선행은 해소됐지만 별도 실행 승인 전 `proposed`로 유지합니다.

Product Owner가 `T-20260805-004` Cooking Log·STEP Preview 자동 저장·오류 상태 구현을
별도 승인했습니다. iOS Agent는 최신 develop 기반 전용 worktree와 lock으로 착수하며,
Mock Service 기반 5개 상태와 동일 record draft·완료 STEP 보존만 구현합니다. 실제 Apple
STT와 T-005~008 범위는 선행하지 않습니다.

수익화 개발 `T-20260728-012`, `014~017`은 Core v1과 분리된 `proposed` 후보입니다. T-010 정책과 각 activation gate가 완료돼도 Product Owner의 별도 실행 승인 전에는 scope·구현하지 않습니다.

T-025는 AI 정상·오류·timeout·만료, 원격 STT 비활성과 negative case를 iOS·Backend
공용 JSON fixture로 고정했습니다. manifest가 source schema와 iOS assertion을 연결하고,
Backend 통합 validator가 canonical hash·공개 오류·상태·민감정보 비포함과 기존
common·STT·AI·security 계약을 함께 검사합니다. iOS `SERVICES.md` handoff까지
동기화하고 자체 검증을 통과해 Backend QA에 인계합니다.

Backend QA 독립 검증에서 create·ACK 필수 header가 `API_CONTRACT.md`와 다른
`QA-HIGH-025-001`, negative 7개 중 4개의 expected·mutation 오류를 validator가
차단하지 못하는 `QA-HIGH-025-002`를 확인했습니다. fixture 콘텐츠와 민감정보 경계는
통과했지만 계약 drift를 허용하므로 `FAIL`, `rework_requested`로 Development Lead에
재조율을 인계했습니다.

Backend QA 독립 재검증에서 create·poll·ACK header 계약, 누락·미정의 header 거부와
negative 9종의 canonical payload mutation 차단을 확인했습니다. `QA-HIGH-025-001~002`가
해소되고 기존 계약·민감정보 경계에도 회귀가 없어 `PASS_WITH_RISK`,
`verification_passed`로 Development Lead 완료 검토에 인계했습니다. 실제 iOS loader,
Backend runtime validator와 staging 흐름은 후속 구현·통합 QA에서 확인합니다.

Development Lead는 성공 기준·허용 경로·최신 develop 정렬, 통합 validator와 독립 반례,
PR #63의 필수 check와 미해결 리뷰 스레드 0건을 확인했습니다. 잔여 위험을 후속 구현·통합
QA로 유지하고 `completion_review`로 수용했습니다. Product Owner 승인에 따라 PR #63을
`develop`에 squash merge했고 merge SHA `8eea645`을 확인해 `done`으로 확정했습니다.
상위 `T-20260728-005`는 별도 완료 검토가 필요합니다.

Backend QA가 `T-20260729-021`에서 최초 설치 challenge의 동시 소비 원자성 누락
`QA-HIGH-021-001`, 오류 허용 문자열 내부 민감정보 비노출을 기계적으로 보장하지 못하는
`QA-HIGH-021-002`를 확인해 `rework_requested`로 인계했습니다. project 누적 비용
hard cutoff 연결 `QA-MEDIUM-021-001`도 함께 확인했습니다. Product Owner가 세 항목의
재작업을 승인해 Backend Agent에 다시 인계했으며 완료 후 독립 재검증해야 합니다.

Backend Agent는 최초 설치 challenge 원자 CAS·단일 승자, 공개 오류 고정 catalog와
negative fixture, T-020 project 월간 비용 hard cutoff 원자 예약을 계약에 반영했습니다.
공통 계약 검증 script와 JSON 문법·strict Task·diff 자체 검증 후 Backend QA에
`verification_ready`로 인계합니다.

Backend QA는 승인된 결함 3건 해소, 오류 catalog 20개 mapping·악성 fixture 4개와 기존
timeout·제한·idempotency·원격 STT 금지 계약의 무회귀를 독립 확인해
`PASS_WITH_RISK`로 `verification_passed` 인계했습니다. runtime validator·renderer는
T-025에서 검증하고 최신 `origin/develop`의 T-20260730-003 `done` 기록을 보존한
재정렬 후 완료 검토해야 합니다.

Development Lead는 QA 결과를 고정하고 최신 `origin/develop` `44c7dd9` 위로
재정렬해 Backend 계약 산출물 내용 동등성, 허용 경로, 계약 script와 공용 보드
비회귀를 확인했습니다. 차단 결함이 없어 `completion_review`로 수용했으며
`develop` 대상 PR 병합 후 `done`으로 확정합니다. runtime validator·renderer
동일성 검증은 `T-20260729-025`로 인계합니다.

PR #32의 `ios-build`·`ios-xctest` 통과와 squash merge SHA `527a431`을 확인해
T-20260729-021을 `done`으로 확정했습니다. T-20260729-022·023·024의 T-021
선행 조건은 해소됐지만 각 Task는 별도 Product Owner 실행 승인을 기다립니다.

Product Owner가 T-20260729-022·023·024 실행을 함께 승인했습니다. 세 Task는
`backend-contract-foundation` 병렬 그룹이며 STT 계약, AI job 계약, 보안·비용
guardrail의 핵심 경로가 분리돼 병렬 실행할 수 있습니다. 각 Task는 독립
worktree·브랜치·Backend Agent 세션을 사용하고, 공유 Development·Quality 보드는
QA 인계와 PR 직전에 최신 `develop` 재정렬로 형제 Task 상태를 보존합니다.

T-20260729-022 재작업은 Backend QA `PASS_WITH_RISK`를 받고 Development Lead 완료
검토로 전환했습니다. retry/terminal 충돌과 1시간 삭제 보장 누락을 해소했으며,
runtime cleanup 장애 복구와 provider 물리 삭제 SLA는 T-025·staging gate로 인계합니다.

PR #40의 hosted checks와 merge SHA `93f577e`를 확인해 T-20260729-022를
`done`으로 확정했습니다. T-025와 후속 원격 STT 활성화 staging gate에서
runtime cleanup과 provider 물리 삭제 SLA를 검증합니다.

Backend QA가 T-023에서 ACK 필수 `result_version`의 응답 누락
`QA-HIGH-023-001`, provider 시작 후 timeout의 `AI_TIMEOUT`/`OUTCOME_UNKNOWN`
분류 상충 `QA-HIGH-023-002`를 확인해 `rework_requested`로 인계했습니다. create 전
quota 실패와 failed job의 `QUOTA_EXCEEDED` 이중 표현도 재작업 시 정리해야 합니다.
T-024 승인 상태는 변경하지 않습니다.

Backend QA 독립 재검증에서 `QA-HIGH-023-001~002`와 `QA-MEDIUM-023-001` 해소를
확인했습니다. result version ACK 4개, timeout decision 6개, quota create HTTP 429
단일 경계와 기존 provider 단일 호출·복구·삭제 계약이 통과해 `PASS_WITH_RISK`,
`verification_passed`로 인계했습니다. runtime validator·CAS·cleanup SLA는 T-025와
후속 구현·staging 검증에서 확인하며 T-024 `approved` 상태는 보존합니다.

Backend QA가 T-022의 기본 비활성·무승인 업로드·자동 fallback 금지는 통과시켰으나,
provider 오류 retry/terminal 계약 상충 `QA-HIGH-022-001`과 삭제 실패 시 최대 1시간
자동 삭제 보장 누락 `QA-HIGH-022-002`를 확인해 `rework_requested`로 인계했습니다.
T-023·T-024의 승인·병렬 상태는 변경하지 않습니다.

Backend QA 독립 재검증에서 두 HIGH 결함 해소, retry 4개·삭제 lifecycle 8개,
T+55분 deadline worker·5분 독립 sweeper와 기존 비활성 경계 무회귀를 확인해
`PASS_WITH_RISK`, `verification_passed`로 인계했습니다. 실제 runtime·provider 물리
삭제 확인은 T-025와 별도 원격 STT 활성화 staging gate가 담당합니다.

`T-20260729-020`은 Apple 기기 내 STT 기본 정책을 보존한 런타임·AI provider
결정안으로 재작업됐습니다. Backend QA가 ACK 즉시 삭제, 생성 22시간 cleanup,
15분 sweeper, 24시간 API 접근 차단과 변경 비용을 독립 재계산해
`PASS_WITH_RISK`로 인계했습니다. 후속 `T-20260729-023`, `024` 구현과
staging에서 삭제 SLA 및 cleanup retry 비용을 검증해야 합니다.
동일 Task ID의 구형 작업선과 최신 `execution-v2` 분기를 정리해 최신
`origin/develop`에 통합했으며, 미커밋 상태에서 수행된 기존 QA 판정을 고정
통합 커밋 기준으로 다시 확인하기 위해 `verification_ready`로 인계합니다.

Backend QA가 `f4408d0` 기준 내용 동등성, `QA-HIGH-020-003`, 비용·잔여 위험,
allowed paths, T-001·T-007 완료 기록과 Task ID 단일성을 독립 재검증해
`PASS_WITH_RISK`로 통과시켰습니다. 현재 origin의 후속 T-010 완료 기록은 병합 전
최신 develop 동기화·board 충돌 해결에서 보존해야 합니다.

Development Lead가 QA 결과를 고정한 뒤 최신 develop 위로 재정렬해 T-010·T-002
완료 기록을 보존하고 원 검증 대상과 핵심 Backend 산출물의 내용 동등성을
확인했습니다. 삭제 SLA·retry 비용 계측은 후속 T-023·T-024와 staging gate로
인계하고 `completion_review`로 수용했습니다.

PR #26의 `ios-build` 통과와 squash merge SHA `a8e3a8a`를 확인해 T-020을
`done`으로 확정했습니다. T-021도 `done`이므로 T-023·T-024의 Task 선행 조건은
해소됐지만 별도 Product Owner 실행 승인을 계속 기다립니다.

T-024는 secret 최소 권한·회전, 콘텐츠·secret telemetry 0건, raw metadata 최대
30일, provider 지역·학습·보관 activation gate와 호출 전 원자 비용 예약을 계약으로
고정했습니다. Firestore TTL 삭제가 무료 할당량 대상이 아닌 유료 safety net임을
명시하고 자체 검증을 통과해 Backend QA 독립 검증에 인계합니다.

Backend QA는 최신 `origin/develop` `0014935` 위에서 기존 완료 기록을 보존해 독립
검증했습니다. raw metadata 최대 30일 삭제 보장 경로 누락 `QA-HIGH-024-001`,
전체 Backend 외부비 원장의 비provider 비용 누락 `QA-HIGH-024-002`로 `FAIL`,
`rework_requested` 판정했습니다. OpenAI 한국 저장·처리 미보장과 provider 처리 지역
gate의 불일치 `QA-MEDIUM-024-001`도 함께 보완해야 하며 T-025는 T-024 완료 선행을
계속 기다립니다.

Backend QA 최종 재검증에서 비용 operation 전액 승인·거절과 actual 초과 delayed
reserve 원자 정산이 KRW 50,000 불변식을 유지함을 확인했습니다. 이전 HIGH 2건과
MEDIUM 1건이 모두 해소돼 `PASS_WITH_RISK`, `verification_passed`로 인계했습니다.
실제 runtime·cloud 설정 검증은 T-025 및 staging gate가 담당합니다.

Backend QA 재검증에서 raw metadata 30일 삭제와 provider 저장·처리 지역 gate는
해소됐습니다. 다만 비용 fixture의 단일 operation 부분 승인과 reservation 초과
actual 정산이 KRW 50,000 불변식을 깨는 반례가 남아 `QA-HIGH-024-002`를
미해소로 유지했습니다. Task는 다시 `rework_requested`이며 T-025는 T-024 완료를
계속 기다립니다.

Backend Agent는 모든 비용 reservation을 operation ID 단위 전액 승인·전액 거절로
고정하고 accepted·rejected multiset이 요청과 일치하도록 검증기를 강화했습니다.
actual 초과분은 delayed reserve를 같은 ledger CAS에서 차감해 50,000원 불변식을
유지하며, 정상·초과 정산과 경계 직전 전액 거절 fixture를 추가했습니다. 전체 security,
common, STT, AI 검증 통과 후 Backend QA 독립 재검증에 인계합니다.

Backend Agent는 raw metadata +28일 cleanup·15분 독립 sweeper·+30일 접근 차단과
downstream receipt를 추가하고 장애 6개 fixture로 고정했습니다. 전체 Backend 외부비는
provider와 Cloud Run·Tasks·Firestore·TTL·egress·observability·build SKU를 단일 KRW
원장에서 경합시키며, 저장 region과 processing boundary·국외 처리를 독립 gate로
분리했습니다. security 계약 검증과 기존 common·STT·AI 검증을 통과해 Backend QA
독립 재검증에 인계합니다.

| `T-20260730-001` | `done` | CI | 환경·명령·check 계약 | - | `T-004`, `T-007` 완료 | PR #20 squash merge·완료 확정 |
| `T-20260730-002` | `done` | CI | ios-build workflow | - | `T-20260730-001` 완료 | PR #24 squash merge·hosted check 통과·완료 확정 |
| `T-20260730-003` | `done` | CI | ios-xctest workflow | - | `T-20260730-001`, `T-20260730-002` 완료 | PR #28 squash merge·hosted 33/33·완료 확정 |
| `T-20260730-004` | `done` | CI | concurrency·진단·cache·artifact 통합 | - | `T-20260730-002`, `003` 완료 | PR #34 checks·artifact 통과·squash merge |
| `T-20260730-005` | `done` | CI | PR dry run·실패 감지 검증 | - | `T-20260730-004` 완료 | PR #36 squash merge `a5c6503`·완료 확정, T-006 required check 설정으로 인계 |
| `T-20260730-006` | `done` | CI/Ops | required check 외부 설정 | - | `T-20260730-005` | PR #57 운영 적용·PR #59 독립 QA 병합, Billing 잔여 위험 수용 |
| `T-20260731-003` | `done` | CI/Ops | GitHub Actions 사용량 절감 및 실행 정책 최적화 | - | `T-20260730-005` | PR #52·#54 develop 병합, WP-1~7 검증 및 completion review 완료 |
| `T-20260730-007` | `done` | iOS/CI | iOS 26.5 SwiftData XCTest crash 진단과 최소 수정 | - | T-001 QA-HIGH-001 | PR #18 squash merge 완료 |

`T-20260728-008`은 6개 하위 Task까지 scope했습니다. `T-20260730-002`와
`003`은 파일 경계상 병렬 실행 가능하지만 단일 iOS Agent 운영 제약에 따라
`002 -> 003` 순차 실행합니다. T-002 PR에는 범위 밖인 T-003 상태 변경을
포함하지 않고, T-002 `done` 확정 후 최신 `develop`에서 사용자의 기존 승인
기록을 T-003 전용 브랜치에 적용합니다. required check 외부 설정 `006`은
dry run·iOS QA와 별도 Product Owner 승인 후에만 수행합니다.

PR #34의 `ios-build`·`ios-xctest`, hosted preflight·summary·artifact와 XCTest
33/33 성공을 확인하고 squash merge SHA `22fe75f`로 T-20260730-004를 `done`으로
확정했습니다. 연속 실행 취소·hosted 실패 진단은 T-20260730-005로 인계했으며
T-005의 선행 조건은 해소됐지만 별도 실행 승인을 기다립니다.

Product Owner가 T-20260730-005 실행을 승인했습니다. iOS Agent는 실제 PR의 정상·실패·
timeout과 artifact/check gate를 검증용 변경으로 수행하고, iOS QA Agent는 독립
재현·판정합니다. T-006 required check 외부 설정은 T-005 검증 완료 후 진행합니다.

T-20260730-005는 PR #36에서 정상 `ios-build`·`ios-xctest` 33/33을 확인하고,
미병합 검증 PR #37~#39에서 build 실패 65, XCTest assertion 실패 65,
timeout 124와 진단 artifact를 확인했습니다. 같은 PR 연속 push의 이전 두
workflow run도 각각 취소됐습니다. 검증 PR 3개는 미병합 종료했고 iOS QA 독립
검증과 Development Lead 완료 검토를 통과했습니다. PR #36과 완료 기록 PR #46이
`develop`에 병합되어 `done`으로 확정됐으며 T-006 required check 설정으로
인계합니다.

`T-20260730-007`은 SwiftData 테스트가 `ModelContainer`를 테스트 종료까지
보유하도록 fixture 수명을 최소 수정했습니다. iOS 26.5와 iOS 17.2 전체 XCTest가
각각 33/33 통과했고 iOS QA 독립 재검증에서도 동일 결과를 확인했습니다.
`QA-HIGH-007-001` 재작업으로 allowed_paths 밖 루트 Task board 변경을 제거했고,
iOS QA 독립 재검증과 Development Lead 완료 검토를 통과했습니다. develop PR
[#18](https://github.com/cschoi724/CookLog/pull/18)에서 squash merge되어
`done`으로 확정했습니다.

`T-20260730-001`의 최초 QA에서 확인된 iPhone 17·iOS 26.5 SwiftData crash는
`T-20260730-007`에서 수정·독립 검증 후 PR #18로 develop에 병합됐습니다.
기존 CI 환경·명령 계약은 변경하지 않았고, iOS QA가 동일 destination의 전체
XCTest 33/33과 timeout·artifact·build 경계를 독립 재검증해
`verification_passed`로 인계했습니다. Development Lead가 성공 기준과 QA
증빙, 허용 경로를 수용했습니다. develop PR
[#20](https://github.com/cschoi724/CookLog/pull/20)에서 squash merge되어
`done`으로 확정했으며, 후속 `002`, `003`의 선행 의존성은 해소됐습니다.
두 Task의 실행은 별도 Product Owner 승인 전 시작하지 않습니다.
