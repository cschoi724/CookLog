# Core Development Team Board

작성일: 2026-07-28
상태: Active

실제 실행 지시는 `.ai_project/tasks/`의 Task 파일이 기준이다.

| Task ID | 상태 | Workstream | 제목 | 담당 Role | 의존성 | 다음 조치 |
|---|---|---|---|---|---|---|
| `T-20260728-001` | `proposed` | iOS | iOS M8 잔여 안정화와 최종 검증 | Development Lead Agent | 완료 Task 2건 | scope 정리 |
| `T-20260728-003` | `proposed` | iOS | 승인된 Figma MVP UI/UX를 iOS 앱에 적용 | Development Lead Agent | `T-20260728-001` 대기, `T-20260728-002` 완료 | T-001 완료 후 scope 정리 |
| `T-20260728-004` | `completion_review` | iOS | iOS XCTest runner 대기 원인 조사와 테스트 실행 안정화 | Development Lead Agent | 없음 | 위험 수용·T-008 인계 완료, 최종 승인 준비 |
| `T-20260728-005` | `proposed` | Backend | Backend AI 프록시 아키텍처와 API 계약 정의 | Development Lead Agent | 없음 | 사용자 기술 결정 준비 |
| `T-20260728-006` | `proposed` | Backend | Backend AI 프록시 foundation 구현 | Development Lead Agent | `T-20260728-005` | 선행 Task 대기 |
| `T-20260728-007` | `done` | CI/Ops | Git·PR·CI 운영 기준 단일화 | - | 없음 | 완료 |
| `T-20260728-008` | `proposed` | CI | iOS CI 기본 파이프라인 구축 | Development Lead Agent | `T-20260728-004`, `T-20260728-007` | 선행 Task 대기 |
| `T-20260728-009` | `proposed` | Release | iOS 실서비스 전환 준비도와 릴리즈 게이트 정의 | Development Lead Agent | 4개 선행 Task | 선행 기준 확정 후 scope |

`T-20260728-004`는 iOS QA 독립 재현을 `PASS_WITH_RISK`로 통과했고 Product Owner가 `QA-RISK-004-001`을 수용해 최종 완료 준비 중입니다. Xcode·Simulator 고정 검증은 T-008로 인계했습니다. T-003은 T-001 완료 전까지 실행하지 않습니다. 일반 개발 Task는 최신 `develop`에서 분기하고 `develop` 대상 PR을 사용합니다.
