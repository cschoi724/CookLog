# Core Development Team Board

작성일: 2026-07-28
상태: Active

실제 실행 지시는 `.ai_project/tasks/`의 Task 파일이 기준이다.

| Task ID | 상태 | Workstream | 제목 | 담당 Role | 의존성 | 다음 조치 |
|---|---|---|---|---|---|---|
| `T-20260728-001` | `cancelled` | iOS | iOS M8 잔여 안정화와 최종 검증 | - | - | 유효 항목 T-003/T-009 통합 |
| `T-20260728-003` | `proposed` | iOS | 확정 제품 UX·디자인과 iOS 로컬 상태 모델 적용 | Development Lead Agent | `T-20260729-002` | 7개 iOS 하위 패키지 scope |
| `T-20260728-004` | `completion_review` | iOS | iOS XCTest runner 대기 원인 조사와 테스트 실행 안정화 | Development Lead Agent | `T-20260729-001` 완료 | 위험 수용·T-008 인계 완료, PR 통합 대기 |
| `T-20260728-005` | `proposed` | Backend | Backend STT·AI gateway 아키텍처와 API 계약 정의 | Development Lead Agent | `T-20260729-001` | 기술 추천안·하위 Task scope |
| `T-20260728-006` | `proposed` | Backend | Backend STT·AI gateway foundation 구현 | Development Lead Agent | `T-20260728-005` | 선행 Task 대기 |
| `T-20260728-007` | `done` | CI/Ops | Git·PR·CI 운영 기준 단일화 | - | 없음 | 완료 |
| `T-20260728-008` | `proposed` | CI | iOS CI 기본 파이프라인 구축 | Development Lead Agent | `T-20260728-004`, `T-20260728-007` | XCTest 기준 후 scope |
| `T-20260728-009` | `proposed` | Release | iOS 첫 공개 출시 통합·TestFlight·App Store 게이트 | Development Lead Agent | R1·R2 차단 Task 전체 | 선행 검증 후 6개 하위 패키지 |
| `T-20260729-003` | `proposed` | Backend | 실제 STT·AI provider와 배포 가능한 Backend gateway 구축 | Development Lead Agent | `T-20260728-005`, `006` | provider 승인 후 7개 하위 패키지 |
| `T-20260729-004` | `proposed` | iOS | iOS 10초 녹음·권한·온라인 STT 연동 | Development Lead Agent | `T-20260728-003`, `005`, `T-20260729-003` | 선행 계약·환경 대기 |
| `T-20260729-005` | `proposed` | iOS | iOS AI 정리·처리 복구·AI Review 실서비스 연동 | Development Lead Agent | `T-20260728-003`, `005`, `T-20260729-003` | 선행 계약·환경 대기 |
| `T-20260729-006` | `proposed` | iOS | iOS 로컬 TTS·오디오 중단·핸즈프리 구현 | Development Lead Agent | `T-003` | 핸즈프리 spike 포함 scope |

첫 실행 Wave는 `T-20260729-002` Design, `T-20260728-004` XCTest와 `T-20260728-005` Backend Contract입니다. `T-20260728-004`는 iOS QA 독립 재현을 `PASS_WITH_RISK`로 통과했고 Product Owner가 `QA-RISK-004-001`을 수용해 최종 완료 검토 중입니다. Xcode·Simulator 고정 검증은 T-008로 인계했습니다. 일반 개발 Task는 최신 `develop` 기반 전용 worktree와 `develop` 대상 PR을 사용합니다. proposed Task는 Lead scope와 Product Owner 승인 전 실행하지 않습니다.
