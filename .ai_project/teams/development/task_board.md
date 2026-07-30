# Core Development Team Board

작성일: 2026-07-28
상태: Active

실제 실행 지시는 `.ai_project/tasks/`의 Task 파일이 기준이다.

| Task ID | 상태 | Workstream | 제목 | 담당 Role | 의존성 | 다음 조치 |
|---|---|---|---|---|---|---|
| `T-20260728-001` | `cancelled` | iOS | iOS M8 잔여 안정화와 최종 검증 | - | - | 유효 항목 T-003/T-009 통합 |
| `T-20260728-003` | `proposed` | iOS | 확정 제품 UX·디자인과 iOS 로컬 상태 모델 적용 | Development Lead Agent | `T-20260729-002` | 7개 iOS 하위 패키지 scope |
| `T-20260728-004` | `done` | iOS | iOS XCTest runner 대기 원인 조사와 테스트 실행 안정화 | - | `T-20260729-001` 완료 | PR #8 squash merge 완료 |
| `T-20260728-005` | `scoped` | Backend | Backend AI gateway와 기본 비활성 원격 STT adapter 계약 정의 | Development Lead Agent | 하위 `T-20260729-020~025` | 각 하위 Task 실행 승인 대기 |
| `T-20260728-006` | `proposed` | Backend | Backend AI gateway와 비활성 원격 STT adapter foundation 구현 | Development Lead Agent | `T-20260728-005` | 선행 Task 대기 |
| `T-20260728-007` | `done` | CI/Ops | Git·PR·CI 운영 기준 단일화 | - | 없음 | 완료 |
| `T-20260728-008` | `proposed` | CI | iOS CI 기본 파이프라인 구축 | Development Lead Agent | `T-20260728-004`, `T-20260728-007` 완료 | 별도 승인 전 자동 시작 금지 |
| `T-20260728-009` | `proposed` | Release | iOS 첫 공개 출시 통합·TestFlight·App Store 게이트 | Development Lead Agent | R1·R2 차단 Task 전체 | 선행 검증 후 6개 하위 패키지 |
| `T-20260729-003` | `proposed` | Backend | 실제 AI provider와 배포 가능한 Backend gateway 구축 | Development Lead Agent | `T-20260728-005`, `006` | AI provider 승인 후 하위 패키지 |
| `T-20260729-004` | `proposed` | iOS | iOS 10초 녹음·권한·Apple 기기 내 STT 연동 | Development Lead Agent | `T-20260728-003`, `T-20260729-026` | 제품 정책 완료 후 scope |
| `T-20260729-005` | `proposed` | iOS | iOS AI 정리·처리 복구·AI Review 실서비스 연동 | Development Lead Agent | `T-20260728-003`, `005`, `T-20260729-003` | 선행 계약·환경 대기 |
| `T-20260729-006` | `proposed` | iOS | iOS 로컬 TTS·오디오 중단·핸즈프리 구현 | Development Lead Agent | `T-003` | 핸즈프리 spike 포함 scope |
| `T-20260729-020` | `proposed` | Backend | 런타임·배포·AI provider·비용 후보 결정안 | Backend Agent | `T-20260729-026` | 실행 승인 대기 |
| `T-20260729-021` | `proposed` | Backend | 공통 API·인증·제한·오류 계약 | Backend Agent | `T-20260729-026` | 실행 승인 대기 |
| `T-20260729-022` | `proposed` | Backend | 기본 비활성 원격 STT adapter 계약 | Backend Agent | `T-20260729-021` | 선행·승인 대기 |
| `T-20260729-023` | `proposed` | Backend | AI recipe job·상태 조회·결과 복구 계약 | Backend Agent | `T-20260729-020`, `021` | 선행·승인 대기 |
| `T-20260729-024` | `proposed` | Backend | 보안·개인정보·관측성·비용 guardrail | Backend Agent | `T-20260729-020`, `021` | 선행·승인 대기 |
| `T-20260729-025` | `proposed` | Backend | iOS·Backend fixture·계약 테스트 기준 | Backend Agent | `T-20260729-021~024` | 선행·승인 대기 |

`T-20260728-005`는 최신 기기 내 STT 정책을 기준으로 6개 하위 Task까지 scope했습니다. `T-20260729-020`과 `021`은 승인 후 병렬 실행 가능하며 원격 STT는 `022`의 기본 비활성 문서 계약으로만 유지합니다. 모든 하위 Task는 별도 Product Owner 승인 전 실행하지 않습니다. 일반 개발 Task는 최신 `develop` 기반 전용 worktree와 `develop` 대상 PR을 사용합니다.
