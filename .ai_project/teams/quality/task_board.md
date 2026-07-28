# Quality Team Board

작성일: 2026-07-27
상태: Active

실제 검증 지시는 `.ai_project/tasks/`의 `verification_ready` Task가 기준이다.

| Task ID | 상태 | 제목 | 검증 범위 | 다음 조치 |
|---|---|---|---|---|
| `T-20260728-002` | `verification_ready` | CookLog MVP UI/UX v1 설계와 Figma 버전 미러 | 로컬 UI 원본, 상태, 접근성, 핸드오프 | 기존 6개 결함 독립 재검증 |

향후 검증 예정 proposed Task:

| Task ID | 도메인 | 예정 Verification Agent | 검증 초점 |
|---|---|---|---|
| `T-20260728-001` | iOS | iOS QA Agent | 사람 손 편집, 키보드, 2단계 Audio Player, M8 회귀 |
| `T-20260728-003` | iOS/Design | iOS QA Agent | 기능 회귀와 Figma 정합성 |
| `T-20260728-004` | iOS | iOS QA Agent | XCTest 절차 재현 |
| `T-20260728-005` | Backend | Backend QA Agent | API 계약, 보안, 개인정보 |
| `T-20260728-006` | Backend | Backend QA Agent | 계약 테스트, secret, 로그 |
| `T-20260728-008` | CI | iOS QA Agent | 실패 감지, 결과물, 회귀 검증 |
| `T-20260728-011` | Design | Design QA Agent | Paywall 상태, 접근성, 가격·약관 표시 |
| `T-20260728-012` | Backend | Backend QA Agent | entitlement·quota 계약, 보안, 개인정보 |
| `T-20260728-014` | iOS | iOS QA Agent | StoreKit 구매·복원·만료와 디자인 정합성 |
| `T-20260728-015` | Backend | Backend QA Agent | Apple 거래 검증, quota, 환불·만료 |
| `T-20260728-016` | Cross-platform | iOS/Backend QA Agent | 이벤트 정확성, 비용, 개인정보 미수집 |
| `T-20260728-017` | Integration | iOS/Backend QA Agent | Sandbox·TestFlight end-to-end 구독 검증 |

`T-20260728-002` 수정본이 `verification_ready`로 재인계됐습니다. Design QA Agent는 기존 6개 결함과 수용 기준 전체를 같은 Source of Truth로 재검증합니다.
