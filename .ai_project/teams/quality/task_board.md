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
| `T-20260729-021` | `done` | Backend 공통 API·인증·제한·오류 계약 정의 | replay·abuse·timeout·제한 초과·idempotency·오류 정보 비노출 | PR #32 checks 통과·squash merge·완료 확정 |

향후 검증 예정 Task:

| Task ID | 도메인 | 예정 Verification Agent | 검증 초점 |
|---|---|---|---|
| `T-20260728-003` | iOS/Design | iOS QA Agent | 기능 회귀와 Figma 정합성 |
| `T-20260728-005` | Backend | Backend QA Agent | API 계약, 보안, 개인정보 |
| `T-20260728-006` | Backend | Backend QA Agent | 계약 테스트, secret, 로그 |
| `T-20260728-008` | CI | iOS QA Agent | 실패 감지, 결과물, 회귀 검증 |
| `T-20260729-022` | Backend | Backend QA Agent | 기본 비활성·무승인 업로드 방지·조건부 TTL |
| `T-20260729-023` | Backend | Backend QA Agent | AI 상태·복구·schema·timeout |
| `T-20260729-024` | Backend | Backend QA Agent | secret·개인정보·redaction·비용 guardrail |
| `T-20260729-025` | Backend | Backend QA Agent | fixture 추적성·계약 테스트·민감정보 제외 |
| `T-20260730-004` | CI | iOS QA Agent | concurrency·cache 회귀·진단 가능성 |
| `T-20260730-005` | CI | iOS QA Agent | 실제 PR dry run·check gate 준비도 |
| `T-20260730-006` | CI/Ops | iOS QA Agent | branch protection 실제 merge 차단 |
| `T-20260730-007` | iOS/CI | iOS QA Agent | iOS 26.5 SwiftData crash 원인·최소 수정·33/33 회귀 |

`T-20260728-004`는 전체 XCTest 종료, timeout, 로그와 `xcresult` 절차의 독립 재현을 `PASS_WITH_RISK`로 통과했습니다. Product Owner가 `QA-RISK-004-001`을 수용하고 PR #8을 `develop`에 squash merge해 `done`으로 확정했습니다. Xcode·Simulator 고정 검증은 T-008로 인계했습니다. `T-20260728-002`도 `done`으로 확정되어 추가 Design QA가 필요하지 않습니다.

`T-20260729-001`은 Product QA `PASS_WITH_RISK` 후 Product Lead 완료 검토를 통과해 `done`으로 확정했습니다.

`T-20260729-026`은 기존 Product QA `FAIL` 3건을 모두 해소해 재검증 `PASS`를 받고 Product Owner 최종 승인 후 `done`으로 확정했습니다.

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

`T-20260729-010`의 자동 재처리 실제 전이, 짧은 Undo 수명주기·키보드 포커스, 오프라인 기록 행동 중복과 공식 Prototype revision 결함 4건은 모두 해소됐고 기존 통과 항목에도 회귀가 없습니다. Design Lead 완료 검토 후 PR #22로 `develop`에 squash merge되어 `done`으로 확정됐으며 추가 Design QA는 필요하지 않습니다.

`T-20260729-008`은 완료 Recipe Card badge와 Manifest–Gallery variant 누락 해소 및 무회귀 독립 재검증, Design Lead 완료 검토를 통과했습니다. PR #11로 `develop`에 squash merge되어 `done`으로 확정됐으며 추가 Design QA는 필요하지 않습니다.

`T-20260729-009`의 Home 최근 활동순 계산, 영구 삭제 다이얼로그 키보드 포커스와 실제 재료 검색 상태 전이 결함 3건은 모두 해소됐고 기존 통과 항목에도 회귀가 없습니다. Design Lead 완료 검토 후 PR #16으로 `develop`에 squash merge되어 `done`으로 확정됐으며 추가 Design QA는 필요하지 않습니다.

`T-20260729-010`은 첫 기록 권한 안내, 10초 자동 종료, Apple 기기 내 STT와 자동 재처리 1회, STEP 자동 저장·삭제·되돌리기, 오프라인 기록과 AI snapshot 잠금 구현을 완료했습니다. Design QA Agent는 제품 정책 일치, 실제 상호작용과 접근성을 독립 검증합니다.

`T-20260729-011`의 `변경 버리고 나가기` snapshot 복원, 완료 레시피 갱신과 저장 경계 HIGH 3건, Review 이탈 dialog·STEP 삭제·완료 레시피 메뉴 포커스와 빈 STEP 정규화 MEDIUM 4건은 모두 해소됐습니다. 기존 통과 항목에도 회귀가 없고 Design Lead 완료 검토와 PR #30의 `ios-build`·`ios-xctest`를 통과해 `develop`에 squash merge됐으며 `done`으로 확정됐습니다.
