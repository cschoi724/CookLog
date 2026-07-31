# Quality Team Board

작성일: 2026-07-28
상태: Active

실제 검증 지시는 `.ai_project/tasks/`의 `verification_ready` Task가 기준이다.

| Task ID | 상태 | 제목 | 검증 범위 | 다음 조치 |
|---|---|---|---|---|
| `T-20260729-026` | `done` | 첫 공개 출시 STT 기본 경로를 Apple 기기 내 처리로 변경 | FAIL 3건 해소, strict task metadata·Task graph·기존 개발 산출물 보존 | Product QA `PASS`, Product Owner 최종 승인 완료 |
| `T-20260730-007` | `done` | iOS 26.5 SwiftData XCTest crash 진단과 최소 수정 | iOS 26.5·17.2 전체 33/33, QA-HIGH-007-001 해소 | PR #18 squash merge·완료 확정 |
| `T-20260730-001` | `done` | iOS CI 환경·명령·check 계약 확정 | 전체 XCTest 33/33, QA-HIGH-001·timeout·artifact·build 경계 확인 | PR #20 squash merge·완료 확정 |
| `T-20260729-010` | `done` | Cooking Log·STEP Preview·기기 내 STT·권한·오류 디자인 | 10초 기록, 권한, 기기 내 STT, STEP 삭제·되돌리기, 오프라인과 snapshot 잠금 | PR #22 squash merge·완료 확정 |
| `T-20260730-002` | `done` | ios-build·build-for-testing workflow 구현 | PR #24 runs 30592350218·30592508288 전 단계 성공, artifact 확인 | 최종 PASS·squash merge·완료 확정 |
| `T-20260729-020` | `done` | Backend 런타임·배포·AI provider·비용 후보 결정안 | 고정 커밋 동등성·QA-HIGH-020-003·비용·최신 보드 비회귀 | PASS_WITH_RISK 수용·PR #26 squash merge·완료 확정 |
| `T-20260730-003` | `done` | ios-xctest 직렬 실행·timeout·artifact workflow 구현 | 독립 33/33·실패 65·timeout 124, hosted 33/33·artifact | PR #28 squash merge·완료 확정, 실패 dry run은 T-005 |
| `T-20260729-011` | `done` | AI 처리·AI Review·완료 레시피 편집·삭제 디자인 | snapshot 복원·완료 갱신·저장 경계·dialog/STEP/menu 포커스·STEP 정규화 | PR #30 checks 통과·squash merge·완료 확정 |
| `T-20260729-012` | `done` | Audio Guide·핸즈프리·오디오 중단 상태 디자인 | 자동 완료 포커스와 기존 HIGH 4건·TTS fallback·접근성 무회귀 | PR #42 checks 통과·squash merge·완료 확정 |
| `T-20260729-021` | `done` | Backend 공통 API·인증·제한·오류 계약 정의 | replay·abuse·timeout·제한 초과·idempotency·오류 정보 비노출 | PR #32 checks 통과·squash merge·완료 확정 |
| `T-20260731-001` | `done` | 활성 문서 Source of Truth 정합성 복구 | 제품·운영·iOS·Design 문서 우선순위, 최신 상태와 잔여 충돌 문구 | Product Owner 최종 승인·완료 확정 |
| `T-20260730-004` | `done` | iOS CI concurrency·진단·cache·artifact 통합 | 격리·cache 미적용 build·33/33·hosted 진단·artifact | PR #34 checks 통과·squash merge·완료 확정 |
| `T-20260729-022` | `done` | 기본 비활성 원격 STT adapter 계약 | 오류별 retry/terminal·deadline worker·5분 sweeper·비정상 삭제 8개 fixture | PR #40 checks 통과·squash merge·완료 확정 |
| `T-20260730-005` | `done` | iOS CI PR dry run·실패 감지·회귀 검증 | 최신 PR #36 33/33, #37~#39 실패 65·timeout 124·취소·artifact | PR #36 squash merge `a5c6503`·완료 확정 |
| `T-20260729-023` | `done` | AI recipe job·상태 조회·결과 복구 계약 | result version ACK·provider 시작 전후 timeout 6개·quota create HTTP 429 | 완료 확정, PASS_WITH_RISK 잔여 위험은 staging 인계 |
| `T-20260729-024` | `approved` | Backend 보안·개인정보·관측성·비용 guardrail | secret·콘텐츠 0건, provider gate, 보존·삭제, 비용 hard cutoff·incident | Backend Agent 재작업 후 QA 독립 재검증 |

향후 검증 예정 Task:

| Task ID | 도메인 | 예정 Verification Agent | 검증 초점 |
|---|---|---|---|
| `T-20260728-003` | iOS/Design | iOS QA Agent | 기능 회귀와 Figma 정합성 |
| `T-20260728-005` | Backend | Backend QA Agent | API 계약, 보안, 개인정보 |
| `T-20260728-006` | Backend | Backend QA Agent | 계약 테스트, secret, 로그 |
| `T-20260728-008` | CI | iOS QA Agent | 실패 감지, 결과물, 회귀 검증 |
| `T-20260729-025` | Backend | Backend QA Agent | fixture 추적성·계약 테스트·민감정보 제외 |
| `T-20260730-006` | CI/Ops | iOS QA Agent | branch protection 실제 merge 차단 |

`T-20260728-004`는 전체 XCTest 종료, timeout, 로그와 `xcresult` 절차의 독립 재현을 `PASS_WITH_RISK`로 통과했습니다. Product Owner가 `QA-RISK-004-001`을 수용하고 PR #8을 `develop`에 squash merge해 `done`으로 확정했습니다. Xcode·Simulator 고정 검증은 T-008로 인계했습니다. `T-20260728-002`도 `done`으로 확정되어 추가 Design QA가 필요하지 않습니다.

`T-20260729-001`은 Product QA `PASS_WITH_RISK` 후 Product Lead 완료 검토를 통과해 `done`으로 확정했습니다.

`T-20260729-026`은 기존 Product QA `FAIL` 3건을 모두 해소해 재검증 `PASS`를 받고 Product Owner 최종 승인 후 `done`으로 확정했습니다.

`T-20260731-001`은 Product QA 독립 검증에서 활성 Team context·운영 이슈·Task
Board·Product QA routing·최신 develop 정렬 결함 4건을 확인해 `FAIL` 판정을
받았습니다. Product Owner가 필수 재작업과 추가 경로를 승인했으며 Product Lead가
최신 develop 기준 재작업과 자체 검증을 마쳐 Product QA 재검증을 기다립니다.

Product QA 재검증에서 PQA-HIGH-031-001·004와 PQA-MEDIUM-031-003 해소는
확인했지만 PQA-HIGH-031-002가 미해소됐습니다. Development Board가
T-20260730-004를 `done`으로 표시하면서 상위 행과 본문에서는 완료 검토·최종
완료 확정 대기로 안내해 `rework_requested`로 재인계했습니다.

Product Owner 승인 후 Development Board의 T-008 상위 행을 T-001~004 완료로
수정하고 T-004의 완료 검토·최종 완료 확정 대기 현재 문구를 제거했습니다.
PQA-HIGH-031-002와 기존 해소 항목의 무회귀 독립 재재검증을 기다립니다.

Product QA 재재검증에서 T-004 상태 단일화는 통과했습니다. 그러나 최신 develop의
T-022 `done`·T-023·024 `approved`를 개별 행은 반영했지만 Development Board의
T-20260728-005 상위 행과 현재 설명은 T-020·021만 완료로 안내해
PQA-HIGH-031-002를 미해소로 판정하고 `rework_requested`로 재인계했습니다.

Product Owner 승인 후 Development Board의 T-20260728-005 상위 행과 현재 설명을
T-020~022 `done`, T-023·024 `approved`, T-025 선행 대기 `proposed`로
단일화했습니다. T-004 무회귀와 Backend 하위 상태의 독립 재검증을 기다립니다.

Product QA 최종 독립 재검증에서 Backend 상위 행·현재 요약·개별 T-020~025 상태
일치, T-004 무회귀와 기존 PQA-HIGH-031-001·004·PQA-MEDIUM-031-003 해소를
확인했습니다. Task graph·허용 경로·계약 검증도 통과해 `PASS`,
`verification_passed`로 Product Lead 완료 검토에 인계했습니다.
Product Lead는 QA 증빙과 성공 기준을 수용해 `completion_review`로 전환했으며
Product Owner가 최종 완료와 develop 통합을 승인해 `done`으로 확정했습니다.

`T-20260729-021`은 Backend QA 독립 검증에서 최초 설치 challenge의 동시 소비 원자성
누락과 오류 `title/detail` 내부의 provider detail·secret·원문 비노출을 schema가
보장하지 못하는 결함을 확인해 `FAIL`로 판정했습니다. project 누적 비용 hard cutoff
연결도 보완해야 합니다. Product Owner가 `QA-HIGH-021-001~002`와
`QA-MEDIUM-021-001` 재작업을 승인했습니다. Backend Agent가 challenge 원자 CAS,
공개 오류 catalog·negative fixture와 project 월간 비용 hard cutoff 원자 예약을
반영하고 자체 검증을 통과해 `verification_ready`로 인계했습니다.

Backend QA 독립 재검증에서 `QA-HIGH-021-001~002`, `QA-MEDIUM-021-001` 해소와
기존 timeout·제한·idempotency·원격 STT 금지 계약 무회귀를 확인했습니다. 공통 계약
script, 오류 mapping 20개와 악성 fixture 4개가 통과해 `PASS_WITH_RISK`로
`verification_passed` 인계했습니다. runtime renderer·validator는 T-025에서 검증하고,
PR 전 최신 develop의 T-20260730-003 `done` 기록을 보존해 재정렬해야 합니다.

Development Lead가 최신 `origin/develop` 재정렬, 계약 산출물 동등성, 허용 경로와
공용 보드 비회귀를 확인해 `completion_review`로 수용했습니다.
`T-20260730-003 done`과 `T-20260729-011 done` 기록은 보존됐으며,
runtime renderer·validator 동일성 검증은 `T-20260729-025`로 인계합니다.

PR #32의 `ios-build`·`ios-xctest` 성공과 squash merge SHA `527a431`을 확인해
`done`으로 확정했습니다. 추가 독립 QA는 필요하지 않으며 실제 runtime
renderer·validator 동일성 검증은 `T-20260729-025`에서 수행합니다.

`T-20260729-022`는 첫 출시 강제 비활성, 무승인 body-read 차단과 자동 원격 fallback
금지는 통과했습니다. 다만 provider 오류의 사용자 새 요청·자동 재처리·timeout terminal
규칙이 상충하는 `QA-HIGH-022-001`과 삭제 실패 시 최대 1시간 자동 삭제를 보장할
cleanup task·sweeper·실패 fixture가 없는 `QA-HIGH-022-002`를 확인해 `FAIL`,
`rework_requested`로 인계했습니다.

재작업 독립 재검증에서 `UPSTREAM_UNAVAILABLE` 최대 1회·timeout 첫 발생 terminal
규칙, body read 전 delete task 원자 등록, T+55분 worker와 5분 독립 sweeper를 확인했다.
retry 4개·삭제 lifecycle 8개 fixture와 기존 비활성·무승인 전송 금지 무회귀가 통과해
`PASS_WITH_RISK`, `verification_passed`로 인계했다. 실제 runtime·provider 삭제 SLA는
T-025와 별도 활성화 staging gate에서 검증한다.

`T-20260729-023`은 provider 단일 호출, 동시 idempotency, invalid output 차단과
22/24시간 삭제 계약은 통과했습니다. 그러나 ACK 요청에 필수인 `result_version`이
status/result 응답에 없는 `QA-HIGH-023-001`, provider 시작 후 timeout이
`AI_TIMEOUT`과 `OUTCOME_UNKNOWN`으로 상충하는 `QA-HIGH-023-002`를 확인해
`FAIL`, `rework_requested`로 인계했습니다.

재작업 독립 재검증에서 available GET의 server-owned `result_version`, ACK 성공·
mismatch·동시·replay 4개, provider 시작 여부와 결과 확실성에 따른 timeout 6개,
quota 생성 전 HTTP 429 단일 경계를 확인했습니다. 기존 provider 단일 호출,
idempotency, invalid output 차단과 22/24시간 삭제 계약에도 회귀가 없어
`PASS_WITH_RISK`, `verification_passed`로 인계했습니다. 실제 runtime validator·CAS와
staging cleanup SLA는 T-025 및 후속 구현 검증에서 확인합니다.

`T-20260729-024`는 Secret Manager·service account 권한 분리와 회전, 콘텐츠·secret의
모든 telemetry 계층 0건, raw metadata 최대 30일, provider 지역·학습·보관 설정
activation gate를 계약으로 고정했습니다. 월 호출·token·비용은 provider 호출 전에
원자 예약하고 hard cutoff를 우회할 수 없습니다. Backend QA는 합성 canary,
동시 예약, 삭제 시각과 incident kill switch를 독립 검증합니다.

최신 `origin/develop` `0014935` 기준 독립 검증에서 secret·telemetry 비노출,
AI·Remote STT 삭제 경계, 호출·token 상한과 incident 계약은 통과했습니다. 그러나
raw metadata 최대 30일에 사전 cleanup·sweeper·접근 차단이 없는
`QA-HIGH-024-001`, 전체 Backend 외부비 원장에 runtime·Tasks·Firestore·logging·
egress 비용 반영이 없는 `QA-HIGH-024-002`를 확인해 `FAIL`,
`rework_requested`로 인계했습니다. OpenAI 한국 저장 후보와 처리 지역 gate의
불일치는 `QA-MEDIUM-024-001`로 보완해야 합니다.

`T-20260729-010`의 자동 재처리 실제 전이, 짧은 Undo 수명주기·키보드 포커스, 오프라인 기록 행동 중복과 공식 Prototype revision 결함 4건은 모두 해소됐고 기존 통과 항목에도 회귀가 없습니다. Design Lead 완료 검토 후 PR #22로 `develop`에 squash merge되어 `done`으로 확정됐으며 추가 Design QA는 필요하지 않습니다.

`T-20260729-008`은 완료 Recipe Card badge와 Manifest–Gallery variant 누락 해소 및 무회귀 독립 재검증, Design Lead 완료 검토를 통과했습니다. PR #11로 `develop`에 squash merge되어 `done`으로 확정됐으며 추가 Design QA는 필요하지 않습니다.

`T-20260729-009`의 Home 최근 활동순 계산, 영구 삭제 다이얼로그 키보드 포커스와 실제 재료 검색 상태 전이 결함 3건은 모두 해소됐고 기존 통과 항목에도 회귀가 없습니다. Design Lead 완료 검토 후 PR #16으로 `develop`에 squash merge되어 `done`으로 확정됐으며 추가 Design QA는 필요하지 않습니다.

`T-20260729-010`은 첫 기록 권한 안내, 10초 자동 종료, Apple 기기 내 STT와 자동 재처리 1회, STEP 자동 저장·삭제·되돌리기, 오프라인 기록과 AI snapshot 잠금 구현을 완료했습니다. Design QA Agent는 제품 정책 일치, 실제 상호작용과 접근성을 독립 검증합니다.

`T-20260729-011`의 `변경 버리고 나가기` snapshot 복원, 완료 레시피 갱신과 저장 경계 HIGH 3건, Review 이탈 dialog·STEP 삭제·완료 레시피 메뉴 포커스와 빈 STEP 정규화 MEDIUM 4건은 모두 해소됐습니다. 기존 통과 항목에도 회귀가 없고 Design Lead 완료 검토와 PR #30의 `ios-build`·`ios-xctest`를 통과해 `develop`에 squash merge됐으며 `done`으로 확정됐습니다.

T-20260730-004는 concurrency 격리, cache 미적용 33/33, build 실패 65와 timeout
124의 진단 보존을 독립 확인해 `PASS_WITH_RISK`를 받았습니다. Development Lead가
최신 develop 재정렬과 허용 경로를 확인해 `completion_review`로 수용했으며 hosted
정상 동작은 T-004 PR, 실제 취소·실패 dry run은 T-20260730-005에서 확인합니다.

PR #34 hosted `ios-build`·`ios-xctest`, preflight·summary·artifact와 XCTest
33/33 성공을 확인해 `done`으로 확정했습니다. 같은 PR 취소와 hosted
실패·timeout dry run은 T-20260730-005에서 검증합니다.

T-20260730-005는 정상 PR #36과 미병합 검증 PR #37~#39에서 두 check 이름,
정상 33/33, build·XCTest 실패 65, timeout 124, 원인별 artifact를
GitHub-hosted runner로 확인했습니다. 연속 push의 이전 `ios-build`와
`ios-xctest` run이 각각 취소되고 다른 PR은 유지됐습니다. iOS QA Agent가 고정
run·artifact와 #37~#39의 `closed`, `merged: false`를 독립 확인해 통과시켰고,
PR #36과 완료 기록 PR #46이 `develop`에 병합되어 `done`으로 확정됐습니다.

`T-20260729-012` 최종 독립 재검증에서 재생·다음·다시 듣기·마지막 단계 다시
듣기의 자동 완료 뒤 갱신된 재생 control로 포커스가 유지되는 것을 확인했습니다.
기존 HIGH 4건과 TTS 오류 fallback, 완료 레시피 단일 원본, 375×667 Light·Dark
48개 상태, 접근성 글자 크기, Reduce Motion과 WCAG AA에도 회귀가 없습니다.
결함 6건이 모두 해소되어 `verification_passed`로 Design Lead Agent에 인계했습니다.
Design Lead 완료 검토도 통과해 `completion_review`로 인계했으며 develop 통합
전에는 `done`으로 변경하지 않습니다.

PR #42의 `ios-build`·`ios-xctest` 성공과 squash merge SHA
`2b9b7502d521db64f2ce11ac3e6a249e7cabf210`을 확인해 `done`으로
확정했습니다. 추가 Design QA는 필요하지 않으며 후속 T-013은 별도 실행 승인
대기입니다.
