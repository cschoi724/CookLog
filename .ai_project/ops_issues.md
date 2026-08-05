# Ops Issues

작성일: 2026-07-01
프로젝트: CookLog
상태: Draft

## 1. 목적

이 문서는 AI Ops Agent가 발견한 Agent 운영 프로세스 이슈와 개선 제안을 기록합니다.

제품 결함, 앱 버그, QA 판정은 이 문서에서 확정하지 않습니다. 제품/개발/QA 이슈는 담당 Lead가 별도 Task 필요 여부와 라우팅을 판단합니다.

## 2. 운영 이슈 기록

## OI-20260701-001 - 루트 상태 문서와 iOS 상태 문서의 진행 상태 차이

- 상태: resolved (2026-07-01)
- 점검 범위: `docs/PROJECT_STATUS.md`, `apps/ios/docs/STATUS.md`, 실제 `apps/ios/` 파일 구조
- 발견한 운영 이슈: 루트 `docs/PROJECT_STATUS.md`는 iOS 프로젝트가 아직 생성 전이라고 기록하지만, `apps/ios/docs/STATUS.md`와 실제 파일 구조에는 `CookLog.xcodeproj`, SwiftUI 앱, 테스트 파일, M8 진행 상태가 존재합니다.
- 영향: 역할별 Agent가 서로 다른 현재 상태를 기준으로 Task를 만들거나 실행할 수 있습니다.
- 해결: `T-20260701-001`에서 루트 상태 문서를 최신 iOS 상태 기준으로 동기화했습니다.
- 수정 필요 문서: `docs/PROJECT_STATUS.md`, 필요 시 `docs/PROJECT_CHANGELOG.md`
- 사용자 승인 필요: 해결 완료

## OI-20260701-002 - AI Agent Task Queue가 아직 비어 있음

- 상태: resolved (2026-07-01)
- 점검 범위: `.ai_project/tasks/`, `.ai_project/task_board.md`
- 발견한 운영 이슈: `.ai_project/` 초기화 직후라 실행 가능한 `proposed`, `approved`, `ready_for_qa` Task가 없습니다.
- 영향: Execution Agent와 Verification Agent가 공유 Queue 기반으로 다음 작업을 선택할 수 없습니다.
- 해결: 초기 파일럿 Task를 등록·실행했고 현재 Task Queue를 운영 중입니다.
- 수정 필요 문서: `.ai_project/tasks/`, `.ai_project/task_board.md`
- 사용자 승인 필요: 해결 완료

## OI-20260727-003 - 기존 Git 문서와 신규 Branch/PR 전략 충돌

- 상태: resolved (2026-08-05)
- 발견한 운영 이슈: `docs/GIT_WORKFLOW.md`는 `main` 직접 작업을 기준으로 하지만 승인된 운영 모델은 `feature_branch_pr`를 사용합니다.
- 영향: Agent가 서로 다른 branch, push, merge 기준을 적용할 수 있습니다.
- 해결: 사용자 승인에 따라 `docs/GIT_WORKFLOW.md`를 `feature_branch_pr`와 사용자 push·merge 승인 기준으로 동기화했습니다.
- 사용자 승인 필요: 해결 완료

## OI-20260727-004 - 기존 `AGENTS.md`와 신규 adapter 역할 충돌

- 상태: resolved (2026-08-05)
- 발견한 운영 이슈: 기존 소문자 `agents.md`가 저장소 루트 세션을 존재하지 않는 `루트 관리 에이전트`로 자동 지정해 현행 Product/Design/Development/Quality/AI Ops 역할 경계와 충돌했습니다.
- 영향: AI Ops Agent가 제품 방향·작업 배정 권한까지 가진 것으로 오인되고, 도구에 따라 대소문자 파일을 다르게 읽을 수 있었습니다.
- 해결: 루트와 플랫폼별 파일명을 `AGENTS.md`로 통일하고, 루트 문서를 core 0.9.0 Codex adapter와 정확히 동기화했습니다. CookLog 고유 맥락은 `.ai_project/`, `docs/product/`, 플랫폼별 `AGENTS.md`로 분리했습니다.
- 검증: `cmp`와 `aiops doctor --strict`에서 루트 `AGENTS.md`의 adapter drift가 제거돼야 합니다.
- 사용자 승인 필요: 해결 완료

## OI-20260727-005 - Backend source of truth 미확정

- 상태: open
- 발견한 운영 이슈: Backend 코드 경로와 API 계약 문서가 아직 없습니다. Figma 미러와 로컬 UI/UX 원본은 이후 결정으로 확정됐습니다.
- 영향: Backend 구현 Task를 안전하게 승인할 수 없습니다.
- 임시 대응: Backend 관련 Task 승인 전까지 `unresolved`와 생성 후보로 유지합니다.
- 개선 후보: Product Lead와 Development Lead가 기준 후보를 제안
- 사용자 승인 필요: Backend 기준 경로와 계약 문서 확정

## OI-20260727-006 - CI 필수 check 미확정

- 상태: open
- 발견한 운영 이슈: `feature_branch_pr`를 선택했지만 자동 CI 기준은 확인되지 않았습니다.
- 영향: PR merge gate가 수동 검증에 의존합니다.
- 임시 대응: CI 구성 전에는 Task별 빌드·테스트·수동 QA 결과를 PR에 기록합니다.
- 개선 후보: iOS와 Backend CI 설계 Task
- 사용자 승인 필요: 외부 CI 설정 변경 시 필요

## OI-20260805-007 - 현재 core와 프로젝트 기록 버전 차이

- 상태: resolved (2026-08-05)
- 발견한 운영 이슈: `aiops migrate --target . --plan` 결과 현재 Homebrew core는 `0.9.0`, 프로젝트 운영 모델 기록은 `0.6.4`입니다.
- 영향: 최신 schema, adapter 및 migration 기준 일부가 프로젝트 운영 문서에 반영되지 않았을 수 있습니다.
- 해결: Product Owner 승인 후 `aiops migrate --target . --apply`를 실행해 프로젝트 core 기록, handoff 디렉토리와 Knowledge context pack 구조를 `0.9.0` 기준으로 동기화하고 자체 검증을 통과했습니다.
- 후속 범위: schema front matter, legacy Task metadata와 project-specific `AGENTS.md`는 자동 변경하지 않고 별도 수동 검토 대상으로 유지합니다.
- 사용자 승인 필요: 버전 차이 해결 완료

## 3. 상태 요약

- 해결: `OI-20260701-001`, `OI-20260701-002`, `OI-20260727-003`, `OI-20260727-004`, `OI-20260805-007`
- 열림: `OI-20260727-005`, `OI-20260727-006`

## 4. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | Ops Issues 문서 초기화 |
| 2026-07-27 | Git 전략, adapter drift, Backend/Figma, CI 미확정 이슈 추가 |
| 2026-08-05 | 역할·adapter·Git 정책 충돌 해결 기록과 core 0.9.0 버전 차이 이슈 추가 |
