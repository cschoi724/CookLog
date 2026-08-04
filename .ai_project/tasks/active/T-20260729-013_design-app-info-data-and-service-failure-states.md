---
id: T-20260729-013
title: 앱 정보·데이터 보관·법적 문서·서비스 장애 디자인
status: done
type: feature
priority: P0
priority_reason: 첫 공개 출시에서 로컬 보관 한계와 온라인 장애를 정확히 안내하고 지원·법적 정보로 접근할 수 있어야 한다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent:
target_role:
required_capabilities:
  - ux_flow
  - ui_design
  - prototyping
  - design_handoff
depends_on:
  - T-20260729-012
blocks:
  - T-20260729-014
  - T-20260729-002
parallel_group: design-refresh-sequential
allowed_paths:
  - design/prototype/
  - design/figma-build/manifest.json
  - design/exports/
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
  - .ai_project/tasks/active/T-20260729-012_design-audio-guide-and-handsfree-states.md
  - design/prototype/
created_by: Design Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-29
updated_at: 2026-07-31
report_to: .ai_project/reports/T-20260729-013_design-app-info-data-and-service-failure-states-report.md
qa_to: .ai_project/qa/T-20260729-013_design-app-info-data-and-service-failure-states-qa.md
---

# 앱 정보·데이터 보관·법적 문서·서비스 장애 디자인

## 목적

사용자가 로컬 데이터 보관 범위, 지원 경로와 법적 정보를 찾을 수 있고 온라인 장애 중에도 가능한 로컬 행동을 이해하게 한다.

## 실행 범위

- Home의 앱 정보 진입
- 이메일 문의하기
- 개인정보처리방침과 이용약관 링크 상태
- 데이터 보관 안내
- 앱 삭제, 기기 초기화·분실과 저장소 손상 시 유실 가능성
- CookLog 자체 백업·복구·동기화 미제공 안내
- 문의에 사용자 콘텐츠 자동 첨부 없음
- 사용자 선택 시 앱 버전·비콘텐츠 진단 정보 포함
- 인터넷 연결, 음성 변환, AI 정리와 로컬 저장 실패의 사용자 원인 범주
- 실패한 온라인 행동만 다시 실행하는 CTA
- 장애 중 계속 사용 가능한 진행·완료 레시피, 검색과 Audio Guide 안내
- 링크 로딩·열기 실패와 이메일 앱 사용 불가 상태

## 제외 범위

- 실제 법률 문안 작성과 URL·문의 이메일 운영 설정
- 서비스 상태 페이지, 실시간 채팅과 24시간 고객지원
- 장애 복구 푸시와 자동 화면 이동
- 콘텐츠가 포함된 진단 로그

## 성공 기준

- 앱 정보에서 문의, 개인정보처리방침, 이용약관과 데이터 보관 안내에 도달할 수 있다.
- 자체 백업·복구를 제공하지 않는 경계가 과도한 상시 경고 없이 정확히 전달된다.
- 온라인 장애와 로컬 저장 실패가 다른 행동으로 안내된다.
- 실패 화면에서 사용 가능한 로컬 기능이 불필요하게 차단되지 않는다.
- 문의 동의와 콘텐츠 비첨부 원칙이 명확하다.
- Design QA Agent가 정보 접근성, 장애별 행동과 오해 가능성을 독립 검증한다.

## 사용자 결정 필요 항목

- 실제 문의 이메일, 개인정보처리방침 URL과 이용약관 URL은 출시 통합 Task에서 확정해야 한다.

이 값은 화면 구조와 placeholder 상태 설계를 막지 않지만 실제 링크 검증과 공개 출시를 차단한다.

## Design Lead 준비 결과

- 선행 `T-20260729-012`의 PR #42·#44 develop 병합, 두 CI 성공과 `done`을 확인했다.
- 앱 정보, 데이터 보관 한계, 법적 링크 placeholder와 서비스 장애 상태를 최신 PRD v2 기준의 첫 공개 출시 범위로 고정했다.
- 문의 이메일·개인정보처리방침·이용약관의 실제 값은 출시 통합 Task에서 확정하며, T-013에서는 명확한 placeholder·미설정·열기 실패 상태를 제공하므로 디자인 실행을 차단하지 않는다.
- 문의 흐름은 사용자 콘텐츠를 자동 첨부하지 않고, 사용자가 동의할 때만 앱 버전과 비콘텐츠 진단 정보를 포함한다.
- 온라인 장애는 실패한 온라인 행동만 다시 실행하고 진행·완료 레시피, 검색과 버튼 Audio Guide 같은 로컬 기능을 계속 사용할 수 있게 한다.
- 로컬 저장 실패는 네트워크 장애와 다른 복구 행동을 제공하고 현재 입력·저장된 데이터를 임의로 초기화하지 않는다.
- 실제 법률 문안, 운영 URL·문의 주소 확정, 상태 페이지·실시간 지원과 후속 `T-20260729-014` 범위는 포함하지 않는다.
- 최초 실행 worktree는 `/private/tmp/cooklog-t20260729-013`, 브랜치는 `task/T-20260729-013-design-app-info-data-and-service-failure-states`였다.
- 재작업 worktree는 `/private/tmp/cooklog-t20260729-013-rework`, 브랜치는 `task/T-20260729-013-design-app-info-rework`였다.
- 완료 검토 worktree는 `/private/tmp/cooklog-t20260729-013-complete`, 브랜치는 `task/T-20260729-013-completion-review`다.
- 완료 검토 기준점은 최신 `origin/develop` SHA `153bc4432400253cb97c14313efaedbed46938fd`다.
- UI/UX Design Agent는 lock을 획득하고 `approved -> in_progress`로 전환한 뒤 확정 범위만 실행한다.
- 실행 완료 후 자체 검증과 보고서를 작성해 Design QA Agent에 독립 검증을 요청한다.
- commit, push, PR, merge는 별도 Product Owner 승인 전 실행하지 않는다.

## 상태 전이 기록

- 2026-07-31: Design Lead Agent가 선행 Task, 제품 Source of Truth, 앱 정보·데이터 보관·법적 placeholder·장애 상태 범위와 공용 파일 ownership을 확인하고 `proposed -> scoped`로 전환했다.
- 2026-07-31: Product Owner가 T-013 실행을 승인해 `scoped -> approved`로 전환하고 UI/UX Design Agent에 라우팅했다.
- 2026-07-31: UI/UX Design Agent가 전용 worktree·브랜치·선행 Task·허용 경로를 확인하고 lock을 획득해 `approved -> in_progress`로 전환했다.
- 2026-07-31: UI/UX Design Agent가 앱 정보·문의 동의·데이터 보관·법적 링크 상태와 인터넷·음성 변환·AI·로컬 저장 실패 디자인을 Prototype·Manifest에 반영했다.
- 2026-07-31: Chrome 동적 검증, 375×667 Light·Dark `22/22`, 접근성 글자 크기 `11/11`과 정적 검증을 통과해 `in_progress -> verification_ready`로 전환했다.
- 2026-07-31: 실행 lock을 해제하고 `Design QA Agent / Verification Role`에 정보 접근성·보관 경계·문의 동의·장애 fallback 독립 검증을 요청했다.
- 2026-07-31: Design QA Agent가 독립 검증에서 App Info 화면 전환 포커스와 선택형 진단 정보 명시적 동의 범위 MEDIUM 2건을 확인해 `verification_ready -> rework_requested`로 전환하고 UI/UX Design Agent에 반환했다.
- 2026-07-31: Product Owner가 `DQA-MEDIUM-013-001~002` 재작업을 승인했다. Design Lead Agent가 최신 `origin/develop` SHA `0014935` 기반 전용 worktree로 검증 대상 산출물과 QA 근거를 이관해 `rework_requested -> approved`로 전환하고 UI/UX Design Agent에 재라우팅했다.
- 2026-07-31: UI/UX Design Agent가 재작업 전용 worktree·브랜치·허용 경로와 승인 상태를 확인하고 lock을 획득해 `approved -> in_progress`로 전환했다.
- 2026-07-31: UI/UX Design Agent가 `DQA-MEDIUM-013-001~002`를 수정하고 Chrome 동적 검증, 375×667 Light·Dark 일반·접근성 글자 크기 각각 `22/22`와 정적 검증을 통과해 `in_progress -> verification_ready`로 전환했다.
- 2026-07-31: 실행 lock을 해제하고 `Design QA Agent / Verification Role`에 포커스·진단정보 동의 범위와 기존 통과 항목의 독립 재검증을 요청했다.
- 2026-07-31: Design QA Agent가 `DQA-MEDIUM-013-001~002` 해소, App Info 전체 전환 포커스, 진단 정보 동의 범위와 기존 통과 항목 무회귀를 실제 Chrome으로 독립 재검증해 `verification_ready -> verification_passed`로 전환하고 Design Lead Agent / Completion Role에 인계했다. Task는 `done`으로 변경하지 않았다.
- 2026-07-31: Design Lead Agent가 성공 기준, Design QA `PASS`, allowed paths, Figma 비차단 근거와 iOS 구현 핸드오프를 확인해 `verification_passed -> completion_review`로 인계했다. develop 통합 전이므로 `done`, 상위 `T-20260729-002` 완료와 후속 `T-20260729-014` 차단 해제는 보류한다.
- 2026-08-04: PR #53의 `develop` 병합 커밋 `3ae2b15`을 최신 `origin/develop`에서 확인하고 `completion_review -> done`으로 정합화했다. 후속 `T-20260729-014` 선행 차단을 해제한다.

## 승인된 재작업 결과

- `DQA-MEDIUM-013-001`: Home에서 App Info로 진입하거나 App Info 하위 화면으로 전환하면 각 화면 제목으로 포커스를 이동한다. 제목은 프로그래밍 방식 포커스와 가시적 포커스 링을 제공하며, 법적 문서 로딩 상태도 로딩 제목을 화면 시작점으로 사용한다.
- `DQA-MEDIUM-013-002`: 앱 버전만 기본 제공하고 OS 버전, 오류 발생 화면·시각, 비콘텐츠 진단 범주는 사용자가 선택한 경우에만 포함한다고 명시했다. 문의 준비 결과에서도 선택된 세 범위를 그대로 확인할 수 있다.

## Design Lead 완료 검토

- 앱 정보 4개 목적지, 데이터 보관·유실 경계, 자체 백업·복구·동기화 미제공, 법적 placeholder, 문의 콘텐츠 비첨부와 장애별 복구 행동이 성공 기준을 충족한다.
- Design QA 재검증은 `DQA-MEDIUM-013-001~002` 해소와 기존 통과 항목 무회귀를 확인해 `PASS`했다.
- Prototype·Manifest·Task·실행 보고서·QA와 Board 변경은 모두 `allowed_paths` 안에 있다.
- Figma 미수정은 비차단이다. 로컬 Prototype과 Manifest가 구현·검증 Source of Truth이며 Figma는 한도 회복 후 동기화하는 버전 미러다.
- iOS 구현에는 App Info 11개 상태, Home Network Error, STT Final Failure, AI Generation Error, Save Error, 포커스 전이, 문의 메타데이터 선택 계약, 데이터 보존과 CTA가 Prototype·README·Manifest에 제공된다.
- 실제 문의 이메일, 개인정보처리방침·이용약관 문안과 공개 URL은 출시 통합에서 확정해야 하며 디자인 완료를 차단하지 않는다.
- 최신 develop의 Backend T-024 변경은 T-013 디자인 경로를 수정하지 않아 검증 결과와 충돌하지 않는다.
- develop 병합 전에는 `done`으로 변경하지 않고 상위 Product Task를 완료하지 않는다.
- 기존 데이터 보관, 법적 placeholder, 이메일 앱 사용 불가와 인터넷·STT·AI·로컬 저장 실패 흐름은 변경하지 않고 회귀 검증했다.
