# Ops Issues

작성일: 2026-07-01  
프로젝트: CookLog  
상태: Draft

## 1. 목적

이 문서는 AI Ops Agent가 발견한 Agent 운영 프로세스 이슈와 개선 제안을 기록합니다.

제품 결함, 앱 버그, QA 판정은 이 문서에서 확정하지 않습니다. 제품/개발/QA 이슈는 PM Agent가 별도 Task로 분리합니다.

## 2. 열린 운영 이슈

## OI-20260701-001 - 루트 상태 문서와 iOS 상태 문서의 진행 상태 차이

- 상태: open
- 점검 범위: `docs/PROJECT_STATUS.md`, `apps/ios/docs/STATUS.md`, 실제 `apps/ios/` 파일 구조
- 발견한 운영 이슈: 루트 `docs/PROJECT_STATUS.md`는 iOS 프로젝트가 아직 생성 전이라고 기록하지만, `apps/ios/docs/STATUS.md`와 실제 파일 구조에는 `CookLog.xcodeproj`, SwiftUI 앱, 테스트 파일, M8 진행 상태가 존재합니다.
- 영향: PM/Development/QA Agent가 서로 다른 현재 상태를 기준으로 Task를 만들거나 실행할 수 있습니다.
- 권장 개선안: PM Agent가 루트 `docs/PROJECT_STATUS.md`와 필요 시 `docs/PROJECT_CHANGELOG.md`를 최신 iOS 상태 기준으로 동기화하는 문서 Task를 생성합니다.
- 수정 필요 문서: `docs/PROJECT_STATUS.md`, 필요 시 `docs/PROJECT_CHANGELOG.md`
- 사용자 승인 필요: PM Agent가 제품/프로젝트 상태 문서 갱신 Task를 생성할 때 필요

## OI-20260701-002 - AI Agent Task Queue가 아직 비어 있음

- 상태: open
- 점검 범위: `.ai_project/tasks/`, `.ai_project/task_board.md`
- 발견한 운영 이슈: `.ai_project/` 초기화 직후라 실행 가능한 `proposed`, `approved`, `ready_for_qa` Task가 없습니다.
- 영향: Development Agent와 QA Agent가 공유 Queue 기반으로 다음 작업을 선택할 수 없습니다.
- 권장 개선안: PM Agent가 첫 파일럿 Task를 `proposed` 상태로 등록하고 Product Owner 승인 후 `approved`로 전환합니다.
- 수정 필요 문서: `.ai_project/tasks/`, `.ai_project/task_board.md`
- 사용자 승인 필요: 첫 파일럿 Task 선정과 승인

## 3. 닫힌 운영 이슈

현재 닫힌 운영 이슈가 없습니다.

## 4. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | Ops Issues 문서 초기화 |
