# Core Development Team Board

작성일: 2026-07-28
상태: Active

실제 실행 지시는 `.ai_project/tasks/`의 Task 파일이 기준이다.

| Task ID | 상태 | Workstream | 제목 | 담당 Role | 의존성 | 다음 조치 |
|---|---|---|---|---|---|---|
| `T-20260728-001` | `cancelled` | iOS | iOS M8 잔여 안정화와 최종 검증 | - | - | 유효 항목 T-003/T-009 통합 |
| `T-20260728-003` | `proposed` | iOS | 확정 제품 UX·디자인과 iOS 로컬 상태 모델 적용 | Development Lead Agent | `T-20260729-002` | 7개 iOS 하위 패키지 scope |
| `T-20260728-004` | `done` | iOS | iOS XCTest runner 대기 원인 조사와 테스트 실행 안정화 | - | `T-20260729-001` 완료 | PR #8 squash merge 완료 |
| `T-20260728-005` | `scoped` | Backend | Backend AI gateway와 기본 비활성 원격 STT adapter 계약 정의 | Development Lead Agent | 하위 `T-20260729-020~025` | 각 하위 Task 실행 승인 대기 |
| `T-20260728-006` | `proposed` | Backend | Backend AI gateway와 비활성 원격 STT adapter foundation 구현 | Development Lead Agent | `T-20260728-005` | 선행 Task 대기 |
| `T-20260728-007` | `done` | CI/Ops | Git·PR·CI 운영 기준 단일화 | - | 없음 | 완료 |
| `T-20260728-008` | `scoped` | CI | iOS CI 기본 파이프라인 구축 | Development Lead Agent | 하위 `T-20260730-001~006` | 각 하위 Task 실행 승인 대기 |
| `T-20260728-009` | `proposed` | Release | iOS 첫 공개 출시 통합·TestFlight·App Store 게이트 | Development Lead Agent | R1·R2 차단 Task 전체 | 선행 검증 후 6개 하위 패키지 |
| `T-20260729-003` | `proposed` | Backend | 실제 AI provider와 배포 가능한 Backend gateway 구축 | Development Lead Agent | `T-20260728-005`, `006` | AI provider 승인 후 하위 패키지 |
| `T-20260729-004` | `proposed` | iOS | iOS 10초 녹음·권한·Apple 기기 내 STT 연동 | Development Lead Agent | `T-20260728-003`, `T-20260729-026` | 제품 정책 완료 후 scope |
| `T-20260729-005` | `proposed` | iOS | iOS AI 정리·처리 복구·AI Review 실서비스 연동 | Development Lead Agent | `T-20260728-003`, `005`, `T-20260729-003` | 선행 계약·환경 대기 |
| `T-20260729-006` | `proposed` | iOS | iOS 로컬 TTS·오디오 중단·핸즈프리 구현 | Development Lead Agent | `T-003` | 핸즈프리 spike 포함 scope |
| `T-20260729-020` | `done` | Backend | 런타임·배포·AI provider·비용 후보 결정안 | - | `T-20260729-026` 완료 | PR #26 squash merge·완료 확정 |
| `T-20260729-021` | `done` | Backend | 공통 API·인증·제한·오류 계약 | - | `T-20260729-026` 완료 | PR #32 squash merge·완료 확정 |
| `T-20260729-022` | `proposed` | Backend | 기본 비활성 원격 STT adapter 계약 | Backend Agent | `T-20260729-021` 완료 | 실행 승인 대기 |
| `T-20260729-023` | `proposed` | Backend | AI recipe job·상태 조회·결과 복구 계약 | Backend Agent | `T-20260729-020`, `021` 완료 | 실행 승인 대기 |
| `T-20260729-024` | `proposed` | Backend | 보안·개인정보·관측성·비용 guardrail | Backend Agent | `T-20260729-020`, `021` 완료 | 실행 승인 대기 |
| `T-20260729-025` | `proposed` | Backend | iOS·Backend fixture·계약 테스트 기준 | Backend Agent | `T-20260729-021~024` | 선행·승인 대기 |

`T-20260728-005`는 최신 기기 내 STT 정책을 기준으로 6개 하위 Task까지 scope했습니다. `T-20260729-021`은 Product Owner가 실행 승인을 재확인했고 기존 공통 API 계약 구현과 자체 검증을 최신 `develop`에 정렬한 뒤 Backend QA 독립 검증에서 재작업 요청을 받았습니다. 원격 STT는 `022`의 기본 비활성 문서 계약으로만 유지합니다. 나머지 하위 Task는 별도 Product Owner 승인 전 실행하지 않습니다. 일반 개발 Task는 최신 `develop` 기반 전용 worktree와 `develop` 대상 PR을 사용합니다.

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
`done`으로 확정했습니다. T-023·T-024는 T-020 의존성이 해소됐지만 T-021 완료와
별도 Product Owner 실행 승인을 계속 기다립니다.

| `T-20260730-001` | `done` | CI | 환경·명령·check 계약 | - | `T-004`, `T-007` 완료 | PR #20 squash merge·완료 확정 |
| `T-20260730-002` | `done` | CI | ios-build workflow | - | `T-20260730-001` 완료 | PR #24 squash merge·hosted check 통과·완료 확정 |
| `T-20260730-003` | `done` | CI | ios-xctest workflow | - | `T-20260730-001`, `T-20260730-002` 완료 | PR #28 squash merge·hosted 33/33·완료 확정 |
| `T-20260730-004` | `verification_passed` | CI | concurrency·진단·cache·artifact 통합 | Development Lead Agent | `T-20260730-002`, `003` 완료 | 독립 QA PASS_WITH_RISK: 격리·33/33·실패 진단 확인, hosted 취소 후속 |
| `T-20260730-005` | `proposed` | CI | PR dry run·실패 감지 검증 | iOS Agent | `T-20260730-004` | 선행·승인 대기 |
| `T-20260730-006` | `proposed` | CI/Ops | required check 외부 설정 | AI Ops Agent | `T-20260730-005` | 별도 Product Owner 승인 대기 |
| `T-20260730-007` | `done` | iOS/CI | iOS 26.5 SwiftData XCTest crash 진단과 최소 수정 | - | T-001 QA-HIGH-001 | PR #18 squash merge 완료 |

`T-20260728-008`은 6개 하위 Task까지 scope했습니다. `T-20260730-002`와
`003`은 파일 경계상 병렬 실행 가능하지만 단일 iOS Agent 운영 제약에 따라
`002 -> 003` 순차 실행합니다. T-002 PR에는 범위 밖인 T-003 상태 변경을
포함하지 않고, T-002 `done` 확정 후 최신 `develop`에서 사용자의 기존 승인
기록을 T-003 전용 브랜치에 적용합니다. required check 외부 설정 `006`은
dry run·iOS QA와 별도 Product Owner 승인 후에만 수행합니다.

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
