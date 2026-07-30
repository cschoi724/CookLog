# Quality Team Board

작성일: 2026-07-28
상태: Active

실제 검증 지시는 `.ai_project/tasks/`의 `verification_ready` Task가 기준이다.

| Task ID | 상태 | 제목 | 검증 범위 | 다음 조치 |
|---|---|---|---|---|
| `T-20260729-026` | `done` | 첫 공개 출시 STT 기본 경로를 Apple 기기 내 처리로 변경 | FAIL 3건 해소, strict task metadata·Task graph·기존 개발 산출물 보존 | Product QA `PASS`, Product Owner 최종 승인 완료 |
| `T-20260730-007` | `done` | iOS 26.5 SwiftData XCTest crash 진단과 최소 수정 | iOS 26.5·17.2 전체 33/33, QA-HIGH-007-001 해소 | PR #18 squash merge·완료 확정 |
| `T-20260730-001` | `done` | iOS CI 환경·명령·check 계약 확정 | 전체 XCTest 33/33, QA-HIGH-001·timeout·artifact·build 경계 확인 | PR #20 squash merge·완료 확정 |
| `T-20260729-010` | `completion_review` | Cooking Log·STEP Preview·기기 내 STT·권한·오류 디자인 | 10초 기록, 권한, 기기 내 STT, STEP 삭제·되돌리기, 오프라인과 snapshot 잠금 | develop 통합 대기 |

향후 검증 예정 Task:

| Task ID | 도메인 | 예정 Verification Agent | 검증 초점 |
|---|---|---|---|
| `T-20260728-003` | iOS/Design | iOS QA Agent | 기능 회귀와 Figma 정합성 |
| `T-20260728-005` | Backend | Backend QA Agent | API 계약, 보안, 개인정보 |
| `T-20260728-006` | Backend | Backend QA Agent | 계약 테스트, secret, 로그 |
| `T-20260728-008` | CI | iOS QA Agent | 실패 감지, 결과물, 회귀 검증 |
| `T-20260729-020` | Backend | Backend QA Agent | 공식 출처·비용 산식·지역·보관·결정표 |
| `T-20260729-021` | Backend | Backend QA Agent | 인증·제한·idempotency·오류 계약 |
| `T-20260729-022` | Backend | Backend QA Agent | 기본 비활성·무승인 업로드 방지·조건부 TTL |
| `T-20260729-023` | Backend | Backend QA Agent | AI 상태·복구·schema·timeout |
| `T-20260729-024` | Backend | Backend QA Agent | secret·개인정보·redaction·비용 guardrail |
| `T-20260729-025` | Backend | Backend QA Agent | fixture 추적성·계약 테스트·민감정보 제외 |
| `T-20260730-002` | CI | iOS QA Agent | ios-build 성공·컴파일 실패 감지 |
| `T-20260730-003` | CI | iOS QA Agent | XCTest 성공·실패·timeout artifact |
| `T-20260730-004` | CI | iOS QA Agent | concurrency·cache 회귀·진단 가능성 |
| `T-20260730-005` | CI | iOS QA Agent | 실제 PR dry run·check gate 준비도 |
| `T-20260730-006` | CI/Ops | iOS QA Agent | branch protection 실제 merge 차단 |
| `T-20260730-007` | iOS/CI | iOS QA Agent | iOS 26.5 SwiftData crash 원인·최소 수정·33/33 회귀 |

`T-20260728-004`는 전체 XCTest 종료, timeout, 로그와 `xcresult` 절차의 독립 재현을 `PASS_WITH_RISK`로 통과했습니다. Product Owner가 `QA-RISK-004-001`을 수용하고 PR #8을 `develop`에 squash merge해 `done`으로 확정했습니다. Xcode·Simulator 고정 검증은 T-008로 인계했습니다. `T-20260728-002`도 `done`으로 확정되어 추가 Design QA가 필요하지 않습니다.

`T-20260729-001`은 Product QA `PASS_WITH_RISK` 후 Product Lead 완료 검토를 통과해 `done`으로 확정했습니다.

`T-20260729-026`은 기존 Product QA `FAIL` 3건을 모두 해소해 재검증 `PASS`를 받고 Product Owner 최종 승인 후 `done`으로 확정했습니다.

`T-20260729-010`의 자동 재처리 실제 전이, 짧은 Undo 수명주기·키보드 포커스, 오프라인 기록 행동 중복과 공식 Prototype revision 결함 4건은 모두 해소됐고 기존 통과 항목에도 회귀가 없습니다. Design Lead 완료 검토를 통과해 `completion_review`로 인계됐으며 Quality Team의 추가 조치는 재작업 발생 시 독립 재검증입니다.

`T-20260729-008`은 완료 Recipe Card badge와 Manifest–Gallery variant 누락 해소 및 무회귀 독립 재검증, Design Lead 완료 검토를 통과했습니다. PR #11로 `develop`에 squash merge되어 `done`으로 확정됐으며 추가 Design QA는 필요하지 않습니다.

`T-20260729-009`의 Home 최근 활동순 계산, 영구 삭제 다이얼로그 키보드 포커스와 실제 재료 검색 상태 전이 결함 3건은 모두 해소됐고 기존 통과 항목에도 회귀가 없습니다. Design Lead 완료 검토 후 PR #16으로 `develop`에 squash merge되어 `done`으로 확정됐으며 추가 Design QA는 필요하지 않습니다.

`T-20260729-010`은 첫 기록 권한 안내, 10초 자동 종료, Apple 기기 내 STT와 자동 재처리 1회, STEP 자동 저장·삭제·되돌리기, 오프라인 기록과 AI snapshot 잠금 구현을 완료했습니다. Design QA Agent는 제품 정책 일치, 실제 상호작용과 접근성을 독립 검증합니다.
