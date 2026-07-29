# Quality Team Board

작성일: 2026-07-28
상태: Active

실제 검증 지시는 `.ai_project/tasks/`의 `verification_ready` Task가 기준이다.

| Task ID | 상태 | 제목 | 검증 범위 | 다음 조치 |
|---|---|---|---|---|
| 없음 | - | 검증 대기 Task 없음 | - | Verification Role이 Queue 확인 |

향후 검증 예정 proposed Task:

| Task ID | 도메인 | 예정 Verification Agent | 검증 초점 |
|---|---|---|---|
| `T-20260728-003` | iOS/Design | iOS QA Agent | 기능 회귀와 Figma 정합성 |
| `T-20260728-004` | iOS | iOS QA Agent | XCTest 절차 재현 |
| `T-20260728-005` | Backend | Backend QA Agent | API 계약, 보안, 개인정보 |
| `T-20260728-006` | Backend | Backend QA Agent | 계약 테스트, secret, 로그 |
| `T-20260728-008` | CI | iOS QA Agent | 실패 감지, 결과물, 회귀 검증 |

`T-20260728-002`는 최종 `verification_passed` 후 PR #6으로 `develop`에 병합되어 `done`으로 확정했습니다. 추가 Design QA는 필요하지 않습니다.

`T-20260729-001`은 Product QA `PASS_WITH_RISK` 후 Product Lead 완료 검토를 통과해 `done`으로 확정했습니다.
