# Workflow Overrides

작성일: 2026-07-01
프로젝트: CookLog
상태: Active

## 1. 목적

이 문서는 CookLog 프로젝트에서 `.ai/workflows/` 기본 workflow와 다르게 운영해야 하는 예외를 기록합니다.

## 2. 현재 예외

현재 등록된 workflow override는 없습니다.

기본 workflow:

| Task 유형 | 기준 workflow |
|---|---|
| 신규 기능 또는 기능 확장 | `.ai/workflows/feature.md` |
| 버그 수정 | `.ai/workflows/bugfix.md` |
| 문서 작업 | `.ai/workflows/docs.md` |
| 배포 준비 | `.ai/workflows/release.md` |
| 운영 마이그레이션 | `.ai/workflows/ops_migration.md` |

## 3. CookLog 운영 메모

- iOS 구현 Task는 기본적으로 `apps/ios/`로 `allowed_paths`를 제한합니다.
- Backend 구현 Task는 코드 경로와 API 계약 source of truth를 확정한 뒤 승인합니다.
- Android 구현 Task는 Android Workstream 활성화에 대한 사용자 승인 전까지 생성하지 않습니다.
- 제품 공통 문서 Task는 `docs/`와 루트 `AGENTS.md`를 대상으로 합니다.
- `.ai/` 수정은 사용자 승인 없이 하지 않습니다.
- 신규 Task는 `standard_vnext`와 필수 `scoped` 단계를 사용합니다.
- 2026-08-05 이후 생성하는 신규 Task는 `.ai/templates/tasks/task.md`를 사용하고 `schema: aiops.task.v1` front matter를 필수로 적용합니다.
- 기존 Task는 legacy 기록으로 보존하며 schema나 metadata를 일괄 변환하지 않습니다.
- 기존 legacy Task의 상태 이력은 자동 변환하지 않습니다.
- 구현과 독립 검증은 같은 세션이 연속 수행하지 않습니다.
- Product Lead는 상위 제품 Task, Design Lead는 Design 하위 Task, Development Lead는 개발 하위 Task의 Completion Role만 담당합니다.
- Verification Agent는 `verification_passed` 이후 Task의 `target_agent`를 해당 하위 Task의 Team Lead로 지정합니다.
- Team Lead가 하위 Task를 `done`으로 전환한 뒤, 모든 `depends_on`이 해소된 상위 제품 Task만 Product Lead에게 `completion_review`로 인계합니다.
- 별도 QA Lead는 활성화하지 않고 Design/iOS/Backend QA Agent를 Task별로 라우팅합니다.

## 4. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | Workflow Overrides 문서 초기화 |
| 2026-07-27 | 멀티팀 vNext 신규 Task 운영 메모 추가, override 없음 유지 |
| 2026-07-28 | 상위/하위 Task Completion 라우팅과 도메인별 QA 병렬 운영 규칙 추가 |
| 2026-08-05 | 신규 Task부터 `aiops.task.v1` schema를 적용하고 기존 Task는 legacy로 보존하는 기준 추가 |
