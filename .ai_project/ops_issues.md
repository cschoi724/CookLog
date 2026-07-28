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

## OI-20260727-003 - 기존 Git 문서와 신규 Branch/PR 전략 충돌

- 상태: open
- 발견한 운영 이슈: `docs/GIT_WORKFLOW.md`는 `main` 직접 작업을 기준으로 하지만 승인된 운영 모델은 `feature_branch_pr`를 사용합니다.
- 영향: Agent가 서로 다른 branch, push, merge 기준을 적용할 수 있습니다.
- 임시 대응: `.ai_project/branch_pr_strategy.md`와 사용자 승인 원칙을 따르고 `main` 직접 push를 하지 않습니다.
- 개선 후보: Product/Docs Task로 `docs/GIT_WORKFLOW.md` 동기화
- 사용자 승인 필요: 제품 문서 수정

## OI-20260727-004 - 기존 `agents.md`와 신규 adapter 지침 정합성 미확인

- 상태: open
- 발견한 운영 이슈: 원격 저장소는 기존 `agents.md`를 사용하며 core migration 검증은 `AGENTS.md` adapter 갱신을 `needs_user_decision`으로 보고했습니다.
- 영향: 도구와 세션에 따라 서로 다른 운영 지침을 읽을 수 있습니다.
- 임시 대응: 제품/플랫폼 기준은 기존 문서를 보존하고 AI 실행 기준은 `.ai/`와 `.ai_project/operating_model.md`를 확인합니다.
- 개선 후보: 기존 내용을 보존하는 adapter 병합안 작성
- 사용자 승인 필요: `AGENTS.md` 또는 `agents.md` 변경

## OI-20260727-005 - Backend와 Figma source of truth 미확정

- 상태: open
- 발견한 운영 이슈: Backend 코드 경로·API 계약 문서와 Figma 원본 링크가 아직 없습니다.
- 영향: Backend 구현 및 디자인 핸드오프 Task를 안전하게 승인할 수 없습니다.
- 임시 대응: 관련 Task 승인 전까지 `unresolved`와 생성 후보로 유지합니다.
- 개선 후보: Product/Design/Development Lead가 각 기준을 제안
- 사용자 승인 필요: 기준 문서 또는 외부 링크 확정

## OI-20260727-006 - CI 필수 check 미확정

- 상태: open
- 발견한 운영 이슈: `feature_branch_pr`를 선택했지만 자동 CI 기준은 확인되지 않았습니다.
- 영향: PR merge gate가 수동 검증에 의존합니다.
- 임시 대응: CI 구성 전에는 Task별 빌드·테스트·수동 QA 결과를 PR에 기록합니다.
- 개선 후보: iOS와 Backend CI 설계 Task
- 사용자 승인 필요: 외부 CI 설정 변경 시 필요

## 3. 닫힌 운영 이슈

현재 닫힌 운영 이슈가 없습니다.

## 4. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | Ops Issues 문서 초기화 |
| 2026-07-27 | Git 전략, adapter drift, Backend/Figma, CI 미확정 이슈 추가 |
