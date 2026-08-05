# Quality Team Board

작성일: 2026-07-27
상태: Active

실제 검증 지시는 `.ai_project/tasks/`의 `verification_ready` Task가 기준이다.

| Task ID | 상태 | 제목 | 검증 범위 | 다음 조치 |
|---|---|---|---|---|
| `T-20260728-002` | `done` | CookLog MVP UI/UX v1 설계와 Figma 버전 미러 | WP-4 접근성·draft 보존·Processing STEP 정확성 및 기존 결함 회귀 | 검증·완료 종료 |
| `T-20260803-001` | `blocked` | Figma 미러 재작업과 Light 우선 디자인 시스템 | 기존 결함, Light 토큰·컴포넌트·binding·접근성, 조건부 Dark | Figma 한도 갱신과 재작업 완료 후 재인계 대기 |
| `T-20260728-011` | `verification_passed` | 구독·Paywall UX 설계 | DQA-HIGH-006 종료 목적지·상태 보존과 기존 회귀 | 구조 검증 종료, Design Lead 완료 게이트 검토 |
| `T-20260805-001` | `done` | iOS MVP 디자인 적용 기준과 Visual QA 계약 확정 | `DQA-MEDIUM-007~008`와 기존 통과 항목 회귀 | 검증·완료 종료 |

향후 검증 예정 proposed Task:

| Task ID | 도메인 | 예정 Verification Agent | 검증 초점 |
|---|---|---|---|
| `T-20260728-001` | iOS | iOS QA Agent | 사람 손 편집, 키보드, 2단계 Audio Player, M8 회귀 |
| `T-20260728-003` | iOS/Design | iOS QA Agent | 기능 회귀와 Figma 정합성 |
| `T-20260728-004` | iOS | iOS QA Agent | XCTest 절차 재현 |
| `T-20260728-005` | Backend | Backend QA Agent | API 계약, 보안, 개인정보 |
| `T-20260728-006` | Backend | Backend QA Agent | 계약 테스트, secret, 로그 |
| `T-20260728-008` | CI | iOS QA Agent | 실패 감지, 결과물, 회귀 검증 |
| `T-20260728-012` | Backend | Backend QA Agent | entitlement·quota 계약, 보안, 개인정보 |
| `T-20260728-014` | iOS | iOS QA Agent | StoreKit 구매·복원·만료와 디자인 정합성 |
| `T-20260728-015` | Backend | Backend QA Agent | Apple 거래 검증, quota, 환불·만료 |
| `T-20260728-016` | Cross-platform | iOS/Backend QA Agent | 이벤트 정확성, 비용, 개인정보 미수집 |
| `T-20260728-017` | Integration | iOS/Backend QA Agent | Sandbox·TestFlight end-to-end 구독 검증 |

`T-20260728-002`는 기존 결함 회귀와 `DQA-HIGH-002`, `DQA-HIGH-003`, `DQA-MEDIUM-004`의 독립 재검증을 통과했고 Design Lead Agent가 완료를 확정했습니다.

`T-20260803-001`은 Figma Gallery `59:2`와 Cover `57:2`를 독립 검증했으나 앱 상태 9개 누락과 Light·Dark Components Gallery 하단 잘림으로 `rework_requested` 판정했습니다.

2026-08-04 UI/UX Design Agent가 로컬 Gallery 결함 2건을 수정했으나 Figma Starter MCP 호출 한도로 Light 디자인 시스템 생성 전에 중단했습니다. 독립 재검증은 Figma 재작업 완료 후 진행합니다.

`T-20260728-011` 독립 구조 검증에서 거래 진행 상태의 임의 성공 버튼과 quota 의미 오류 2건을 높음, 복원 경로·radio 키보드·live region 결함 3건을 중간으로 판정해 `rework_requested`로 인계했습니다.

UI/UX Design Agent가 결함 5건 수정과 23개 상태·Light/Dark·작은 화면·실제 radio 키보드 자체 검증을 완료해 `verification_ready`로 재인계했습니다.

독립 재검증에서 기존 결함 5건은 모두 통과했습니다. 다만 Paywall 닫기·구매 성공 CTA·status 닫기의 목적지와 상태 보존이 문서 계약과 다른 `DQA-HIGH-006`을 신규 확인해 다시 `rework_requested`로 판정했습니다.

UI/UX Design Agent가 부모 화면 adapter callback과 reviewer 목적지 표시를 구현하고 실제 Chrome 8개 전이에서 route와 source state 보존을 자체 검증해 `verification_ready`로 재인계했습니다.

Design QA Agent가 실제 Chrome 8개 전이에서 adapter callback, route event, reviewer 목적지와 source state 보존을 확인했습니다. `DQA-HIGH-006`과 기존 결함 5건 회귀를 모두 통과해 `verification_passed`로 판정했습니다.

`T-20260805-001`은 실제 SwiftUI 상태 구조에 대응한 23개 상태 계약, 작은 화면·Light/Dark·Accessibility 3·VoiceOver, 토큰별 허용 편차·심각도·증빙 형식을 자체 확인하고 `verification_ready`로 인계됐습니다. Design QA Agent는 구현 결과가 아니라 계약의 완결성과 실행 가능성을 독립 검증합니다.

Design QA 독립 검증에서 23개 상태·캡처 ID의 무누락과 대비 수치는 통과했습니다. 실제 `[StepPreview]` AI Review route와 다른 `DQA-MEDIUM-007`, CookLog 고유 배경 토큰과 system semantic 대체 기준이 충돌하는 `DQA-MEDIUM-008`은 추가 구현 해석을 만들기 때문에 `rework_requested`로 판정했습니다.

UI/UX Design Agent가 `DQA-MEDIUM-007~008`을 수정해 실제 `[StepPreview]` route 전달 경로와 CookLog 고유 색상·system semantic 적용 슬롯을 단일 판정으로 정렬했습니다. 기존 23개 상태·캡처 ID, 대비 9개, 작은 화면·테마·접근성 기준 자체 회귀를 통과해 `verification_ready`로 재인계했습니다.

Design QA Agent가 실제 AppRoute와 STEP 배열 전달 경로, 고유 배경·accent·status와 system semantic 슬롯을 독립 대조해 두 결함을 통과시켰습니다. 23개 상태·캡처 ID, 대비 9개와 작은 화면·Light/Dark·Accessibility 3·VoiceOver·44×44pt 기준도 회귀 없이 유지돼 `verification_passed`로 판정했습니다.
