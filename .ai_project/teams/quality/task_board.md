# Quality Team Board

작성일: 2026-07-27
상태: Active

실제 검증 지시는 `.ai_project/tasks/`의 `verification_ready` Task가 기준이다.

| Task ID | 상태 | 제목 | 검증 범위 | 다음 조치 |
|---|---|---|---|---|
| `T-20260728-002` | `completion_review` | CookLog MVP UI/UX v1 설계와 Figma 버전 미러 | 구현 Source of Truth 우선순위 | Design Lead 검토 통과, develop 통합 대기 |

향후 검증 예정 proposed Task:

| Task ID | 도메인 | 예정 Verification Agent | 검증 초점 |
|---|---|---|---|
| `T-20260728-001` | iOS | iOS QA Agent | 사람 손 편집, 키보드, 2단계 Audio Player, M8 회귀 |
| `T-20260728-003` | iOS/Design | iOS QA Agent | 기능 회귀와 Figma 정합성 |
| `T-20260728-004` | iOS | iOS QA Agent | XCTest 절차 재현 |
| `T-20260728-005` | Backend | Backend QA Agent | API 계약, 보안, 개인정보 |
| `T-20260728-006` | Backend | Backend QA Agent | 계약 테스트, secret, 로그 |
| `T-20260728-008` | CI | iOS QA Agent | 실패 감지, 결과물, 회귀 검증 |

`T-20260728-002`의 `DQA-MEDIUM-005` 수정본을 독립 재검증했고 Design Lead 완료 검토도 통과했습니다. Task는 `completion_review`이며 추가 Design QA는 필요하지 않습니다.
