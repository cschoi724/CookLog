# Quality Team Board

작성일: 2026-07-28
상태: Active

실제 검증 지시는 `.ai_project/tasks/`의 `verification_ready` Task가 기준이다.

| Task ID | 상태 | 제목 | 검증 범위 | 다음 조치 |
|---|---|---|---|---|
| `T-20260729-026` | `done` | 첫 공개 출시 STT 기본 경로를 Apple 기기 내 처리로 변경 | FAIL 3건 해소, strict task metadata·Task graph·기존 개발 산출물 보존 | Product QA `PASS`, Product Owner 최종 승인 완료 |

향후 검증 예정 Task:

| Task ID | 도메인 | 예정 Verification Agent | 검증 초점 |
|---|---|---|---|
| `T-20260728-003` | iOS/Design | iOS QA Agent | 기능 회귀와 Figma 정합성 |
| `T-20260728-005` | Backend | Backend QA Agent | API 계약, 보안, 개인정보 |
| `T-20260728-006` | Backend | Backend QA Agent | 계약 테스트, secret, 로그 |
| `T-20260728-008` | CI | iOS QA Agent | 실패 감지, 결과물, 회귀 검증 |

`T-20260728-004`는 전체 XCTest 종료, timeout, 로그와 `xcresult` 절차의 독립 재현을 `PASS_WITH_RISK`로 통과했습니다. Product Owner가 `QA-RISK-004-001`을 수용하고 PR #8을 `develop`에 squash merge해 `done`으로 확정했습니다. Xcode·Simulator 고정 검증은 T-008로 인계했습니다. `T-20260728-002`도 `done`으로 확정되어 추가 Design QA가 필요하지 않습니다.

`T-20260729-001`은 Product QA `PASS_WITH_RISK` 후 Product Lead 완료 검토를 통과해 `done`으로 확정했습니다.

`T-20260729-026`은 기존 Product QA `FAIL` 3건을 모두 해소해 재검증 `PASS`를 받고 Product Owner 최종 승인 후 `done`으로 확정했습니다.
