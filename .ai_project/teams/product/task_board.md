# Product Team Board

작성일: 2026-07-27
상태: Active

실제 실행 지시는 `.ai_project/tasks/`의 Task 파일이 기준이다.

| Task ID | 상태 | 제목 | 담당 Role | 의존성 | 다음 조치 |
|---|---|---|---|---|---|
| `T-20260729-001` | `done` | 확정 제품 정책과 출시 계획 통합 문서화 | - | 없음 | 완료 |
| `T-20260729-026` | `done` | 첫 공개 출시 STT 기본 경로를 Apple 기기 내 처리로 변경 | - | `T-20260729-001` | 완료 |
| `T-20260731-001` | `verification_ready` | 활성 문서 Source of Truth 정합성 복구 | Product QA Agent / Verification Role | `T-20260729-026`, `T-20260729-011`, `T-20260729-020`, `T-20260730-003` | Backend 상위 요약 재작업 독립 재검증 |

첫 공개 출시 STT 정책 변경은 Product QA 재검증과 Product Lead 완료 검토를 통과하고 Product Owner 최종 승인을 받아 `done`으로 확정했습니다. `T-20260731-001`은 Product QA 재재검증에서 확인된 Development Board Backend 상위 요약을 개별 T-020~025 상태와 정렬하고 독립 재검증을 기다립니다. Product QA 통과 전에는 T-20260728-003 차단을 해제하지 않습니다. 수익화 동결 Workstream은 Core v1 출시선에 포함하지 않습니다.
