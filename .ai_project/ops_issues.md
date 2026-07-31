# Ops Issues

작성일: 2026-07-01
프로젝트: CookLog
상태: Draft

## 1. 목적

이 문서는 AI Ops Agent가 발견한 Agent 운영 프로세스 이슈와 개선 제안을 기록합니다.

제품 결함, 앱 버그, QA 판정은 이 문서에서 확정하지 않습니다. 제품/개발/QA 이슈는 PM Agent가 별도 Task로 분리합니다.

## 2. 열린 운영 이슈

## OI-20260727-006 - CI 필수 check 미확정

- 상태: open
- 현재 상태: T-20260730-001~004는 `done`이며 build·XCTest·concurrency·공통 진단·artifact workflow가 통합됐습니다.
- 잔여 이슈: 실제 취소·실패 PR dry run T-005와 required check 외부 설정 T-006이 남아 있습니다.
- 영향: workflow 자체는 자동화됐지만 branch protection의 최종 merge 차단은 아직 확정되지 않았습니다.
- 임시 대응: `ios-build`, `ios-xctest` 결과와 Task별 검증 기록을 merge gate로 확인합니다.
- 해결 조건: T-005 검증과 Product Owner가 별도 승인한 T-006 외부 설정 완료

## 3. 닫힌 운영 이슈

### OI-20260701-001 - 루트·iOS 상태 차이

- 상태: closed
- 해결: T-20260701-001과 후속 상태 갱신으로 `docs/PROJECT_STATUS.md`와 iOS 상태 문서를 동기화했습니다.

### OI-20260701-002 - 초기 Task Queue 공백

- 상태: closed
- 해결: T-20260701-001부터 공유 Task Queue와 Project/Team Board를 운영 중입니다.

### OI-20260727-003 - Git 문서와 Branch/PR 전략 충돌

- 상태: closed
- 해결: T-20260728-007·019에서 `develop` 통합, `main` 승격과 사용자 Git 승인 기준을 단일화했습니다.

### OI-20260727-004 - 루트 Agent 안내와 adapter 정합성

- 상태: closed
- 해결: T-20260731-001에서 루트 `agents.md`를 역할·탐색 경로·Source of Truth 참조 중심으로 축소했습니다.

### OI-20260727-005 - Backend와 UI/UX Source of Truth 미확정

- 상태: closed
- 해결 Task: T-20260728-002, T-20260729-020, T-20260729-021, T-20260731-001
- Backend 기준: `apps/backend/docs/ARCHITECTURE_DECISION.md`, `apps/backend/docs/API_CONTRACT.md`, `apps/backend/contracts/common/`
- UI/UX 기준: `design/prototype/`, `design/figma-build/manifest.json`; Figma는 버전 미러
- 잔여 결정: 실제 Backend provider 계약·배포는 Product Owner의 별도 승인 대상이며 Source of Truth 미확정 이슈와 분리합니다.

## 4. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | Ops Issues 문서 초기화 |
| 2026-07-27 | Git 전략, adapter drift, Backend/Figma, CI 미확정 이슈 추가 |
| 2026-07-31 | T-20260731-001 재작업에서 해결된 OI-001~005를 닫고 CI 잔여 범위를 T-005~006으로 축소 |
