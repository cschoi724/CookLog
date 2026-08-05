# 새 클론 환경 인수인계

작성일: 2026-07-14  
최종 업데이트: 2026-08-05
최초 작성자: PM Agent (legacy 명칭)
목적: CookLog를 새 디렉토리에 Git clone한 뒤 현재 제품/운영 흐름을 끊지 않고 이어가기 위한 인수인계 기준

## 1. 현재 전환 목표

아래 제품 체크포인트는 2026-07-27 기준 조건부 통과로 달성했다.

```text
Checkpoint 1: iOS MVP Core Loop 조건부 통과
```

Core Loop 기준:

```text
Home
-> 요리 기록 시작
-> 10초 기록
-> STEP Preview 생성
-> AI 정리하기
-> AI Review 초안 확인
-> 저장
-> Recipe Detail 확인
-> 오디오 가이드 시작
-> Audio Player 단계 이동
-> 앱 재실행
-> 저장된 Recipe 유지 확인
```

이 흐름은 iPhone SE (3rd generation), iOS 17.2 시뮬레이터에서 새 설치, 저장, 앱 재실행까지 확인했다. 남은 항목은 사람 손 입력 기반 문자열 편집 최종 확인과 2단계 이상 Audio Player 이전/다음 이동 확인이다.

## 2. 현재 상태 요약

- iOS는 MVP M8 정리와 검증 단계이며 Core Loop 조건부 통과 상태다.
- Home, Cooking Log, AI Review, Recipe Detail, Audio Player 기본 구현은 존재한다.
- SwiftData 기반 로컬 Recipe 저장 경로가 연결되어 있다.
- `QA-HIGH-001`로 발견된 AI Review STEP Preview 전달 결함은 `T-20260701-003`에서 수정 및 QA 통과 후 PM 완료 확정됐다.
- `T-20260701-002`는 2026-07-27 조건부 통과와 `done`으로 완료됐다.
- Android는 개발 대기 상태다.

## 3. 현재 Task 상태

현재 기준은 `.ai_project/task_board.md`와 개별 Task 파일이다.

중요 Task:

| Task | 상태 | 의미 |
|---|---|---|
| `T-20260701-001` | `done` | 루트 프로젝트 상태 문서 동기화 완료 |
| `T-20260701-002` | `done` | iOS MVP Core Loop 조건부 통과 |
| `T-20260701-003` | `done` | AI Review STEP Preview 전달 결함 수정 완료 |

새 환경에서 가장 먼저 확인할 것은 `docs/PROJECT_STATUS.md`, `apps/ios/docs/STATUS.md`, `.ai_project/task_board.md`의 최신 상태다.

## 4. 새 클론에 반드시 포함되어야 하는 것

Git으로 새 디렉토리에 clone할 때 아래 파일/디렉토리는 반드시 포함되어야 한다.

### 제품/프로젝트 기준

- `AGENTS.md`
- `README.md`
- `docs/`
- `docs/product/`
- `docs/PROJECT_STATUS.md`
- `docs/PROJECT_CHANGELOG.md`
- `docs/PROJECT_DECISIONS.md`
- `docs/GIT_WORKFLOW.md`

### iOS 기준

- `apps/ios/AGENTS.md`
- `apps/ios/CookLog.xcodeproj`
- `apps/ios/CookLog/`
- `apps/ios/CookLogTests/`
- `apps/ios/docs/`
- `apps/ios/docs/STATUS.md`
- `apps/ios/docs/DEVELOPMENT_PLAN.md`
- `apps/ios/docs/MANUAL_QA_CHECKLIST.md`
- `apps/ios/docs/CHANGELOG.md`

### Android 기준

- `apps/android/AGENTS.md`
- `apps/android/docs/`

Android는 아직 개발 대기 상태이므로 현재는 문서 기준만 유지한다.

### Agent 운영 상태

- `.ai_project/`
- `.ai_project/current_context.md`
- `.ai_project/source_of_truth.md`
- `.ai_project/task_board.md`
- `.ai_project/tasks/`
- `.ai_project/reports/`
- `.ai_project/qa/`
- `.ai_project/ops_issues.md`
- `.ai_project/ops_decisions.md`
- `.ai_project/new_clone_handoff.md`

`.ai_project/`는 CookLog 프로젝트별 협업 상태이므로 새 클론에도 포함한다.

## 5. 새 클론에 그대로 가져가지 않아도 되는 것

아래 항목은 새 클론에서 Git에 포함되지 않아도 된다.

- `.ai/`
- Xcode DerivedData
- 시뮬레이터 설치 상태
- `/private/tmp/`에 남은 QA 스크린샷
- 로컬 권한 설정
- 로컬 Codex 세션 상태

`.ai/`는 Agent 운영 템플릿 체크아웃이며 `.gitignore` 대상이다. 새 환경에서 별도 운영 템플릿을 다시 연결하거나 설치한다.

## 6. 새 클론 시작 순서

새 디렉토리에서 시작하면 아래 순서로 확인한다.

1. `git status -sb`
2. `git log --oneline -5`
3. `AGENTS.md`
4. `.ai_project/new_clone_handoff.md`
5. `.ai_project/task_board.md`
6. `.ai_project/source_of_truth.md`
7. `docs/PROJECT_STATUS.md`
8. `apps/ios/AGENTS.md`
9. `apps/ios/docs/STATUS.md`
10. `apps/ios/docs/DEVELOPMENT_PLAN.md`
11. `apps/ios/docs/MANUAL_QA_CHECKLIST.md`

그 다음 남은 후속 확인 항목을 P2/P3 Task로 분리한다.

## 7. 새 환경에서 이어갈 첫 작업

새 환경에서 가장 먼저 이어갈 작업은 Product Lead Agent의 우선순위 확인과 Product Planning Agent의 상태 문서 정리다.

- `docs/PROJECT_STATUS.md` 최종 갱신
- `apps/ios/docs/STATUS.md` 최종 갱신
- `.ai_project/task_board.md` 정리
- 남은 이슈를 P1/P2/P3로 분류
- 다음 제품/디자인/개발 Task 후보 작성

우선 분리할 후보:

- AI Review 재료명/양, STEP 본문, 예상 시간, 메모 문자열 수정과 키보드 가림 사람 손 확인
- 2단계 이상 저장 레시피에서 Audio Player 이전/다음 이동 수동 확인
- 전체 `xcodebuild test`의 XCTest runner 대기 이슈 조사

## 8. 다음 제품 단계 후보

Core Loop 검증 후 제품 개발은 아래 순서가 자연스럽다.

1. MVP 수동 QA 결과 기반 P1 버그 수정
2. 작은 화면/다크 모드/입력 UX 보정
3. 디자인 방향 정의와 Figma 기준 화면 설계
4. 실제 STT 연동 방식 결정
5. 실제 AI 정리 backend proxy 방식 결정
6. 오디오 가이드 품질 개선
7. TestFlight 후보 준비
8. Android 착수 여부 재검토

## 9. 커밋/원격 주의사항

현재 작업은 새 클론으로 이어갈 예정이므로, 새 환경에서 시작하기 전 아래를 확인한다.

- 현재 로컬 브랜치가 원격보다 앞서 있으면 push 여부를 결정한다.
- 새 클론은 원격에 push된 커밋만 가져온다.
- `.ai_project/` 상태를 새 클론에서 이어가려면 관련 커밋이 원격에 있어야 한다.
- 커밋되지 않은 Task 상태 변경이 있으면 새 클론에 반영되지 않는다.

## 10. 인수인계 결론

새 운영 환경으로 넘어가기 전 최소 제품 체크포인트인 `iOS MVP Core Loop 조건부 통과`는 달성됐다.

지금의 운영/제품 맥락을 이어가려면 `.ai_project/`와 `docs/`, `apps/ios/docs/`를 반드시 함께 가져간다. 새 클론에서는 `.ai_project/task_board.md`, `docs/PROJECT_STATUS.md`, `apps/ios/docs/STATUS.md`를 기준으로 이어가면 된다.

## 11. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-14 | 새 클론 환경 인수인계 문서 작성 |
| 2026-07-27 | iOS MVP Core Loop 조건부 통과 완료 상태로 갱신 |
