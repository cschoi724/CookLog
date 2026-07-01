# Workflow Overrides

작성일: 2026-07-01  
프로젝트: CookLog  
상태: Draft

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
- Android 구현 Task는 Android 착수 전까지 생성하지 않습니다.
- 제품 공통 문서 Task는 `docs/`와 루트 `agents.md`를 대상으로 합니다.
- `.ai/` 수정은 사용자 승인 없이 하지 않습니다.

## 4. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | Workflow Overrides 문서 초기화 |
