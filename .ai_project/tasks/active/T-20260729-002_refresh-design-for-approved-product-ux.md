---
id: T-20260729-002
title: 확정 제품 UX 기반 디자인 시스템·프로토타입 갱신
status: in_progress
type: feature
priority: P0
priority_reason: 완료된 T-20260728-002 이후 기록·초안·AI Review·핸즈프리 요구가 추가 확정되어 iOS 디자인 적용 전에 새 상태와 흐름을 반영해야 한다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design Lead Agent
target_role: Lead Role
required_capabilities:
  - design_scoping
  - design_dependency_management
depends_on:
  - T-20260729-001
  - T-20260729-026
  - T-20260729-008
  - T-20260729-009
  - T-20260729-010
  - T-20260729-011
  - T-20260729-012
  - T-20260729-013
  - T-20260729-014
blocks:
  - T-20260728-003
parallel_group:
allowed_paths:
  - design/prototype/
  - design/figma-build/
  - design/exports/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - design/prototype/
created_by: Product Lead Agent
approved_by: Product Owner
locked_by: Design Lead Agent
locked_at: 2026-07-29T15:52:00+09:00
lock_session: /root/design_lead_t002
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-29
report_to: .ai_project/reports/T-20260729-002_refresh-design-for-approved-product-ux-report.md
qa_to: .ai_project/qa/T-20260729-002_refresh-design-for-approved-product-ux-qa.md
---

# 확정 제품 UX 기반 디자인 시스템·프로토타입 갱신

## 목적

완료된 MVP UI/UX v1을 보존하면서 이후 확정된 제품 상태, 편집 구조와 출시 필수 핸즈프리 경험을 UI Source of Truth와 Figma 미러에 반영한다.

## 제안 범위

- 진행 단계가 다른 레시피를 하나의 Home 목록에 표시하고 현재 단계로 이어가는 카드 상태
- 여러 진행 레시피와 진행 기록 전체 삭제 흐름
- STEP Preview 삭제·되돌리기와 시간순 고정
- AI Review 임시 저장, 이탈 경고와 최종 저장 상태
- 조리 단계별 독립 입력 카드, 추가·삭제·재배열
- 완료 레시피 수정 모드
- Audio Guide 버튼 조작과 핸즈프리 시작·종료·인식 실패 fallback
- 재료 듣기, 마지막 단계, 자동 재생 대기와 화면 잠금 상태
- 마이크·녹음·기기 내 STT와 온라인 AI 장애의 원인별 안내, 원격 STT 자동 fallback 금지와 사용자 재실행 상태
- 앱 정보의 이메일 문의, 개인정보처리방침, 이용약관과 데이터 보관 안내
- Light·Dark, 작은 화면, Dynamic Type와 접근성 상태

## 제외 범위

- iOS 또는 Backend 구현
- 제품 문서에서 미확정으로 남은 항목의 임의 결정
- 수익화·Paywall 디자인
- 기존 완료 Task `T-20260728-002`의 상태 재개방

## 성공 기준

- Product 문서의 모든 확정 상태가 프로토타입에서 도달 가능하다.
- AI Review와 완료 레시피 수정이 같은 폼 구조와 서로 다른 저장 행동으로 표현된다.
- Audio Guide의 버튼과 음성 명령이 동일한 액션 모델을 사용한다.
- 핸즈프리 실패 시 버튼으로 계속 진행하는 fallback이 표현된다.
- 온라인 장애가 로컬 레시피 조회·검색·Audio Guide를 차단하지 않고 실패한 행동만 다시 실행하는 흐름이 표현된다.
- 로컬 저장과 복구 경계, 문의·법적 문서가 앱 정보에서 확인 가능하다.
- 독립 Design QA가 핵심 흐름, 오류 상태, 접근성과 핸드오프 정합성을 통과시킨다.

## Coordination 메모

- `T-20260728-002`는 완료 상태를 유지하고 본 Task가 후속 변경을 담당한다.
- `T-20260728-003`은 본 Task의 승인된 디자인 기준이 나오기 전까지 시작하지 않는다.

## Design Lead 하위 Task 분해 요구

1. Foundation·token·공통 component와 상태 variant 갱신
2. Home·전체 보기·검색·상태별 recipe card와 routing
3. Cooking Log·STEP Preview·권한·STT 오류와 오프라인 상태
4. AI 처리·AI Review·임시 저장·완료 편집·삭제 상태
5. Audio Guide·핸즈프리·오디오 중단·버튼 fallback 상태
6. 앱 정보·개인정보·법적 문서·문의와 서비스 장애 상태
7. Light·Dark·작은 화면·Dynamic Type·접근성 및 구현 핸드오프

각 하위 Task는 Prototype 상태, Manifest 변경과 Design QA 확인 항목을 함께 가져야 한다. Figma 미러는 호출 가능할 때 같은 결과를 동기화하되 완료 판정을 차단하지 않는다.

## 확정 실행 구조

Product Owner가 2026-07-29 상위 Task 착수를 승인했고 Design Lead Agent가 공용 Prototype 파일의 ownership 충돌을 검토해 아래 7개 Design 하위 Task로 분해했다.

| 순서 | Task | 실행 패키지 | 선행 Task |
|---:|---|---|---|
| 1 | `T-20260729-008` | Foundation·공통 컴포넌트·상태 variant | 없음 |
| 2 | `T-20260729-009` | Home·전체 보기·검색·상태별 카드와 routing | `T-20260729-008` |
| 3 | `T-20260729-010` | Cooking Log·STEP Preview·권한·STT 오류 | `T-20260729-009` |
| 4 | `T-20260729-011` | AI 처리·AI Review·완료 레시피 편집·삭제 | `T-20260729-010` |
| 5 | `T-20260729-012` | Audio Guide·핸즈프리·오디오 중단·버튼 fallback | `T-20260729-011` |
| 6 | `T-20260729-013` | 앱 정보·법적 문서·데이터 보관·서비스 장애 | `T-20260729-012` |
| 7 | `T-20260729-014` | Light·Dark·작은 화면·Dynamic Type·접근성·통합 핸드오프 | `T-20260729-013` |

`design/prototype/index.html`, `app.js`, `styles.css`와 `design/figma-build/manifest.json`을 여러 패키지가 공유하므로 한 UI/UX Design Agent가 위 순서대로 실행하는 것을 기본으로 한다. 선행 Task가 `done`이 되기 전 후속 Task를 구현하지 않는다.

각 하위 Task는 `proposed`로 등록한다. Product Owner가 하위 범위와 순서를 승인한 뒤에만 `scoped -> approved -> in_progress`로 전환하며, 각 Task는 실행 세션과 분리된 Design QA Agent의 검증을 거쳐 Design Lead Agent가 완료한다.

## 사용자 결정 필요 항목

- `T-20260729-008`: Product Owner 실행 승인 완료
- `T-20260729-009~014`: 각 선행 Task 완료 후 순차 실행 승인 필요

Figma MCP 호출 가능 여부, Starter 플랜 제약과 미러 동기화 완료 여부는 승인 결정이나 로컬 디자인 완료를 차단하지 않는다. 확정 제품 정책을 변경해야 하는 발견이 생기면 해당 하위 Task를 진행하지 않고 Product Lead Agent에 에스컬레이션한다.

## 상태 전이 기록

- 2026-07-29: Product Owner가 상위 Design Task 착수를 승인했다.
- 2026-07-29: Design Lead Agent가 Source of Truth, 기존 UI v1과 공용 파일 ownership을 확인하고 `proposed -> scoped`로 전환했다.
- 2026-07-29: Product Owner의 상위 Task 착수 승인을 반영해 `scoped -> approved`로 전환했다.
- 2026-07-29: Design Lead Agent가 전용 worktree lock을 획득하고 7개 하위 Task scope와 의존성을 등록해 `approved -> in_progress`로 전환했다. 하위 Task 실행은 별도 Product Owner 승인 대기다.
- 2026-07-29: Product Owner가 첫 하위 Task `T-20260729-008` 실행을 승인했으며 Design Lead Agent가 전용 worktree와 UI/UX Design Agent 라우팅을 준비했다.
- 2026-07-29: Product Owner가 `T-20260729-008` Design QA 결함 2건의 재작업을 승인했으며 후속 Task 차단은 유지한다.
- 2026-07-30: 하위 `T-20260729-008`이 Design QA와 Design Lead 완료 검토를 통과하고 PR #11로 `develop`에 병합되어 `done`으로 확정됐다. 다음 순차 후보 `T-20260729-009`는 별도 Product Owner 실행 승인 대기다.
- 2026-07-30: Product Owner가 하위 `T-20260729-009` 실행을 승인했으며 최신 `origin/develop` 기반 전용 worktree를 준비해 UI/UX Design Agent에 라우팅했다.
- 2026-07-30: Product Owner가 하위 `T-20260729-009`의 Design QA 결함 3건 재작업을 승인했으며 후속 `T-20260729-010` 차단은 유지한다.
- 2026-07-30: 하위 `T-20260729-009`가 결함 3건 독립 재검증과 Design Lead 완료 검토를 통과해 `completion_review`로 인계됐다. develop 병합 전 `done`과 후속 `T-20260729-010` 차단 해제는 보류한다.
- 2026-07-30: 하위 `T-20260729-009`가 PR #16으로 `develop`에 병합되어 `done`으로 확정됐다. 다음 순차 후보 `T-20260729-010`은 별도 Product Owner 실행 승인 대기다.
- 2026-07-30: Design Lead Agent가 하위 `T-20260729-010`을 Apple 기기 내 STT·오프라인 기록 가능 정책에 맞춰 scope하고 전용 worktree를 준비했다. 실행은 별도 Product Owner 승인 대기다.
- 2026-07-30: Product Owner가 하위 `T-20260729-010` 실행을 승인했으며 UI/UX Design Agent가 준비된 전용 worktree에서 작업 시작 대기다.
- 2026-07-30: Product Owner가 하위 `T-20260729-010`의 Design QA 결함 4건 재작업을 승인했으며 후속 `T-20260729-011` 차단은 유지한다.
- 2026-07-30: 하위 `T-20260729-010`이 결함 4건 독립 재검증과 Design Lead 완료 검토를 통과해 `completion_review`로 인계됐다. develop 병합 전 `done`과 후속 `T-20260729-011` 차단 해제는 보류한다.
- 2026-07-30: 하위 `T-20260729-010`이 PR #22로 `develop`에 병합되어 `done`으로 확정됐다. 다음 순차 후보 `T-20260729-011`은 별도 Product Owner 실행 승인 대기다.
- 2026-07-30: Design Lead Agent가 하위 `T-20260729-011`의 AI 장기 처리·Review 저장 경계·완료 레시피 수정·삭제 범위를 scope하고 최신 `origin/develop` 기반 전용 worktree를 준비했다. 실행은 별도 Product Owner 승인 대기다.
- 2026-07-31: Product Owner가 하위 `T-20260729-011` 실행을 승인했으며 UI/UX Design Agent가 준비된 전용 worktree에서 작업 시작 대기다.
- 2026-07-31: UI/UX Design Agent가 하위 `T-20260729-011` 실행과 자체 검증을 완료해 Design QA 독립 검증으로 인계했다.
- 2026-07-31: Design QA Agent가 하위 `T-20260729-011`에서 저장 경계 HIGH 3건과 접근성·정규화 MEDIUM 4건을 확인해 `rework_requested`로 UI/UX Design Agent에 반환했으며 후속 `T-20260729-012` 차단을 유지한다.
- 2026-07-31: Product Owner가 하위 `T-20260729-011`의 Design QA 결함 7건 재작업을 승인했으며 후속 `T-20260729-012` 차단은 유지한다.
- 2026-07-31: 하위 `T-20260729-011`이 결함 7건 독립 재검증과 Design Lead 완료 검토를 통과해 `completion_review`로 인계됐다. develop 병합 전 `done`과 후속 `T-20260729-012` 차단 해제는 보류한다.
- 2026-07-31: UI/UX Design Agent가 하위 `T-20260729-011` 결함 7건 재작업과 자체 회귀 검증을 완료해 Design QA 독립 재검증으로 인계했다.
- 2026-07-31: Design QA Agent가 하위 `T-20260729-011` 결함 7건 해소와 기존 통과 항목 무회귀를 확인해 `verification_passed`로 Design Lead 완료 검토에 인계했으며 `done`과 후속 `T-20260729-012` 차단 해제는 보류한다.
- 2026-07-31: 하위 `T-20260729-011`이 PR #30으로 `develop`에 병합되어 `done`으로 확정됐다. 다음 순차 후보 `T-20260729-012`는 별도 Product Owner 실행 승인 대기다.
- 2026-07-31: Product Owner가 최신 제품 결정대로 핸즈프리를 첫 출시 범위에 포함하고 하위 `T-20260729-012` 실행을 승인했다. 루트 `agents.md` 동기화는 Product Lead가 별도 수행하며 UI/UX Design Agent는 준비된 전용 worktree에서 작업 시작 대기다.
- 2026-07-31: Product Owner가 하위 `T-20260729-012`의 Design QA 결함 6건 재작업과 최신 develop 정렬을 승인했으며, Design Lead가 SHA `22fe75f` 기반 재작업 worktree를 준비해 UI/UX Design Agent에 재라우팅했다.
- 2026-07-31: UI/UX Design Agent가 하위 `T-20260729-012` 실행과 자체 검증을 완료해 Design QA 독립 검증으로 인계했다.
- 2026-07-31: Design QA Agent가 하위 `T-20260729-012`에서 저장 레시피 원본·명령 동등성·권한·재생 보존 HIGH 4건과 포커스·TTS 오류 fallback MEDIUM 2건을 확인해 `rework_requested`로 UI/UX Design Agent에 반환했으며 후속 `T-20260729-013` 차단을 유지한다.
- 2026-07-31: 하위 `T-20260729-012` 재작업 독립 재검증에서 HIGH 4건과 TTS fallback 해소, 작은 화면·접근성 무회귀를 확인했으나 자동 재생 완료 뒤 포커스가 `BODY`로 소실되는 기존 MEDIUM 결함 1건이 남아 `rework_requested`를 유지하고 후속 `T-20260729-013` 차단을 유지한다.
- 2026-07-31: Product Owner가 하위 `T-20260729-012`의 잔존 포커스 결함 1건 재작업을 승인했으며, Design Lead가 최신 SHA `93f577e` 기반 전용 worktree를 준비해 UI/UX Design Agent에 재라우팅했다.
- 2026-07-31: Design QA Agent가 하위 `T-20260729-012`의 자동 재생 완료 포커스와 기존 결함 6건·접근성 무회귀를 독립 재검증해 `verification_passed`로 Design Lead 완료 검토에 인계했으며, `done`과 후속 `T-20260729-013` 차단 해제는 보류한다.
- 2026-07-31: Design Lead Agent가 하위 `T-20260729-012`의 성공 기준, 최종 QA, allowed paths, Figma 비차단 근거와 iOS 핸드오프를 확인해 `completion_review`로 인계했다. develop 통합 전이므로 하위 `done`, 후속 `T-20260729-013` 차단 해제와 상위 Task 완료는 보류한다.
