# Product Team Board

작성일: 2026-07-27
상태: Active

실제 실행 지시는 `.ai_project/tasks/`의 Task 파일이 기준이다.

| Task ID | 상태 | 제목 | 담당 Role | 의존성 | 다음 조치 |
|---|---|---|---|---|---|
| `T-20260729-001` | `done` | 확정 제품 정책과 출시 계획 통합 문서화 | - | 없음 | 완료 |
| `T-20260729-026` | `done` | 첫 공개 출시 STT 기본 경로를 Apple 기기 내 처리로 변경 | - | `T-20260729-001` | 완료 |
| `T-20260731-001` | `done` | 활성 문서 Source of Truth 정합성 복구 | - | `T-20260729-026`, `T-20260729-011`, `T-20260729-020`, `T-20260730-003` | 최종 완료·develop 통합 |
| `T-20260804-001` | `done` | 수익화 Source of Truth와 T-010~018 후보 Task 복구 | - | 없음 | Product QA PASS·Product Lead 완료 리뷰·Product Owner 최종 승인, develop 통합 대기 |
| `T-20260811-002` | `proposed` | 팝 키치 레시피 클럽 앱 전반 디자인 방향 확정 및 원본 발전 | Product Lead Agent / Direction Role | 없음 | 선택 컨셉을 전체 사용자 흐름·82개 상태로 확장하는 방향 초안; Design Lead 화면군별 하위 scope와 실행 승인 대기 |
| `T-20260728-010` | `proposed` | 수익화 가격·원가와 출시 정책 확정 | Product Lead Agent / Lead Role | `T-20260728-006`, `009` | Core v1 막바지 activation gate 대기 |
| `T-20260728-013` | `proposed` | App Store 구독 상품과 법무·운영 정보 준비 | Product Lead Agent / Lead Role | `T-20260728-007`, `009`, `010` | 수익화 정책 확정 후 scope |
| `T-20260728-018` | `proposed` | 초기 실서비스 수익화 출시 준비 완료 판정 | Product Lead Agent / Lead Role | `T-20260728-017` | 통합 QA 후 scope·완료 검토 |

첫 공개 출시 STT 정책 변경은 Product QA 재검증과 Product Lead 완료 검토를 통과하고 Product Owner 최종 승인을 받아 `done`으로 확정했습니다. `T-20260731-001`도 Product QA 최종 `PASS`, Product Lead 완료 검토와 Product Owner 최종 승인을 거쳐 `done`입니다. T-20260804-001은 Product QA `PASS`, Product Lead 완료 리뷰와 Product Owner 최종 승인으로 로컬 `done`이며 develop 통합은 별도 승인 대기입니다. 수익화 Workstream은 모두 `proposed`로 동결하며 Core v1 출시선에 포함하지 않습니다.
