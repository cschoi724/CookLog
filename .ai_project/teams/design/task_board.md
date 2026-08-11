# Design Team Board

작성일: 2026-07-29
상태: Active

실제 실행 지시는 `.ai_project/tasks/`의 Task 파일이 기준이다.

| Task ID | 상태 | 제목 | 담당 Role | 의존성 | 다음 조치 |
|---|---|---|---|---|---|
| `T-20260728-002` | `done` | CookLog MVP UI/UX v1 설계와 Figma 버전 미러 | - | 없음 | 완료 |
| `T-20260729-002` | `done` | 확정 제품 UX 기반 디자인 시스템·프로토타입 갱신 | - | `T-20260729-001`, `T-20260729-026`, `T-20260729-008~014` | 하위 전체·통합 QA·develop 병합 완료 |
| `T-20260729-008` | `done` | 확정 UX용 디자인 Foundation·공통 컴포넌트 갱신 | - | 없음 | 완료 |
| `T-20260729-009` | `done` | Home·전체 보기·검색·레시피 상태 routing 디자인 | - | `T-20260729-008` | 완료 |
| `T-20260729-010` | `done` | Cooking Log·STEP Preview·기기 내 STT·권한·오류 디자인 | - | `T-20260729-009`, `T-20260729-026` | 완료 |
| `T-20260729-011` | `done` | AI 처리·AI Review·완료 레시피 편집·삭제 디자인 | - | `T-20260729-010` | 완료 |
| `T-20260729-012` | `done` | Audio Guide·핸즈프리·오디오 중단 상태 디자인 | - | `T-20260729-011` | PR #42 squash merge·완료 |
| `T-20260729-013` | `done` | 앱 정보·데이터 보관·법적 문서·서비스 장애 디자인 | - | `T-20260729-012` | PR #53 squash merge·완료 |
| `T-20260729-014` | `done` | 디자인 통합 접근성 검증·구현 핸드오프 갱신 | - | `T-20260729-013` 완료 | PR #68 squash merge·완료 |
| `T-20260805-001` | `done` | iOS MVP 디자인 적용 기준과 Visual QA 계약 확정 | - | `T-20260728-002` 완료 | Core Loop 23개 계약·독립 Design QA PASS·완료 리뷰 확정 |
| `T-20260810-007` | `done` | Design Prototype GitHub Pages 공유 구성 | - | 없음 | PR #118 squash merge·Design QA PASS; Gate B 미승인 |
| `T-20260811-003` | `approved` | 팝 키치 레시피 클럽 Foundation·공통 컴포넌트 원본 정비 | UI/UX Design Agent | T-002 scope 완료 확인 | Foundation 구현 후 Design QA 독립 검증 |
| `T-20260811-004` | `proposed` | 팝 키치 레시피 클럽 Home·Library 원본 시안 적용 | Design Lead Agent → UI/UX Design Agent | `T-20260811-003` | Home 9 + Library 5 상태·별도 실행 승인 필요 |
| `T-20260811-005` | `proposed` | 팝 키치 레시피 클럽 Log·Review·Detail 원본 시안 적용 | Design Lead Agent → UI/UX Design Agent | `T-20260811-004` | Core Loop 33 상태·별도 실행 승인 필요 |
| `T-20260811-006` | `proposed` | 팝 키치 레시피 클럽 Player·Info·오류 원본 시안 적용 | Design Lead Agent → UI/UX Design Agent | `T-20260811-005` | Player/Info 35 상태·별도 실행 승인 필요 |
| `T-20260811-007` | `proposed` | 팝 키치 레시피 클럽 Prototype 통합 Design QA | Design Lead Agent → Design QA Agent | `T-20260811-003~006` | 82 상태 독립 QA·통합 QA 실행 승인 필요 |
| `T-20260728-011` | `proposed` | 구독·Paywall UX 설계 | Design Lead Agent | `T-20260729-002`, `T-20260728-010` | 수익화 activation gate 대기 |

`T-20260728-002`는 Design QA와 Design Lead 완료 검토를 통과하고 PR #6으로 `develop`에 squash merge되어 `done`으로 확정했습니다. `T-20260729-002`는 기존 결과를 재개방하지 않고 확정된 제품 상태를 후속 버전으로 갱신합니다.

공용 Prototype과 Manifest의 파일 충돌을 피하기 위해 `T-20260729-008 -> 009 -> 010 -> 011 -> 012 -> 013 -> 014` 순서로 실행합니다. 각 하위 Task는 UI/UX Design Agent가 실행하고 별도 Design QA Agent가 독립 검증하며, Design Lead Agent가 자기 Team 하위 Task만 완료합니다. 로컬 Prototype·Manifest가 기준이고 Figma 미러 가능 여부는 완료 차단 조건이 아닙니다.

`T-20260729-008`은 PR #11로, `T-20260729-009`는 PR #16으로, `T-20260729-010`은 PR #22로, `T-20260729-011`은 PR #30으로, `T-20260729-012`는 PR #42로, `T-20260729-013`은 PR #53으로, `T-20260729-014`는 PR #68로 `develop`에 squash merge되어 모두 `done`으로 확정했습니다. 상위 `T-20260729-002`도 성공 기준과 통합 QA를 수용해 `done`입니다.

Product Owner가 2026-08-04 `T-20260729-014`의 WP-1~4 로컬 실행, 독립 Design QA와 상위 Task 완료 검토까지 진행하도록 승인했습니다. Figma MCP는 호출하지 않으며 로컬 Prototype·Manifest·핸드오프를 완료 기준으로 사용합니다.

수익화 Design `T-20260728-011`은 Core v1 디자인과 다른 `proposed` 후보입니다. 보존 WIP의 Paywall 실행·QA 기록은 공식 완료나 의존성 해제 근거가 아닙니다.

`T-20260805-001`은 통합 핸드오프의 82개 상태를 상위 기준으로 보존하고 첫 iOS 구현·Visual QA의 Core Loop 23개 상태에 측정 가능한 합격선을 제공해 `done`으로 확정했습니다.

`T-20260810-007`은 PR #118로 `develop`에 통합됐고 Design QA PASS와 완료 검토를 거쳐 `done`으로 확정했습니다. `workflow_dispatch` 전용 Pages workflow는 `design/prototype/`만 패키징하며, Gate B 승인 전 workflow 실행과 외부 공개를 금지합니다.
