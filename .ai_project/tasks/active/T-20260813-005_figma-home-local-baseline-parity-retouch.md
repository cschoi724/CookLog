---
schema: aiops.task.v1
id: T-20260813-005
title: Home 로컬 기준 고정·Figma 정확 동기화
status: approved
type: feature
priority: P1
priority_reason: Home은 새 해석이 아니라 Product Owner가 만족한 로컬 시안과 측정 가능한 수준으로 일치해야 이후 화면의 시각 기준이 안정된다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: UI/UX Design Agent
target_role: Execution Role
planned_execution_agent: UI/UX Design Agent
planned_execution_role: Execution Role
required_capabilities:
  - ux_flow
  - ui_design
  - prototyping
  - design_handoff
ownership:
  paths:
    - ".ai_project/tasks/active/T-20260813-005_figma-home-local-baseline-parity-retouch.md"
    - ".ai_project/reports/T-20260813-005_figma-home-local-baseline-parity-retouch-report.md"
    - ".ai_project/qa/T-20260813-005_figma-home-local-baseline-parity-retouch-qa.md"
    - ".ai_project/task_board.md"
    - ".ai_project/teams/design/task_board.md"
  domains:
    - figma-private-source
    - home-visual-fidelity
  documents:
    - design/
ownership_review:
  required: false
  reviewer:
depends_on:
  - T-20260813-003
blocks:
  - T-20260813-006
parallel_group: private-figma-focused-visual-retouch
allowed_paths:
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (저장소 외부 작업공간; URL·파일 키·조직 식별자는 비기록)"
  - ".ai_project/tasks/active/T-20260813-005_figma-home-local-baseline-parity-retouch.md"
  - ".ai_project/reports/T-20260813-005_figma-home-local-baseline-parity-retouch-report.md"
  - ".ai_project/qa/T-20260813-005_figma-home-local-baseline-parity-retouch-qa.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/design/task_board.md"
source_of_truth:
  - ".ai_project/tasks/active/T-20260812-003_private-figma-source-core-flow-design.md"
  - ".ai_project/tasks/active/T-20260813-001_figma-foundations-home-visual-baseline.md"
  - ".ai_project/tasks/active/T-20260813-003_figma-audio-info-82-state-completion.md"
  - design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png
  - design/prototype/
  - "T-20260811-008 Home 보존 기준: task/T-20260811-008-visual-fidelity-retouch@1348f05353bd2f0383dd0441545c0f4455759926 (design/prototype/ Home 참조용, develop 병합 금지)"
  - "Home 비교 frame: design/prototype/index.html?screen=home&state=content, 390×844, Light"
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (URL·파일 키·조직 식별자는 저장소에 기록하지 않음)"
created_by: Design Lead Agent
approved_by: Product Owner (2026-08-14, 보존 Home 기준과의 정확 동기화·대표 Light 시각 승인 Gate·Design QA 독립 검증 조건으로 실행 승인)
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-13
updated_at: 2026-08-14
report_to: ".ai_project/reports/T-20260813-005_figma-home-local-baseline-parity-retouch-report.md"
qa_to: ".ai_project/qa/T-20260813-005_figma-home-local-baseline-parity-retouch-qa.md"
status_ref: origin/develop
status_ref_sha: ec91d25e6fb3e9e7535e6b6951185430a04c5b7c
base_ref: origin/develop
base_sha: ec91d25e6fb3e9e7535e6b6951185430a04c5b7c
branch:
  name: task/T-20260813-005-figma-home-local-baseline-parity-retouch
  base: develop
pr:
  url:
  status:
blocker:
next_decision: UI/UX Design Agent가 최신 canonical 승인·빈 lock을 확인하고 대표 Home Light를 기준 ref에 정확히 동기화한 뒤 Product Owner 시각 승인을 요청한다.
---

# Home 로컬 기준 고정·Figma 정확 동기화

## Goal

Product Owner가 만족한 로컬 Home 기준을 Figma Home에 임의 재해석 없이 옮겨 이후 화면의 최종 시각 기준으로 고정한다.

## Scope

- 실행 전에 로컬 WIP 자체가 아니라 보존된 commit/ref와 `390×844 Light` 기준 frame을 정확 비교 대상으로 기록한다.
- 워드마크, 라벨, 중앙 기록 CTA, 최근 레시피 카드, 작은 AI 도우미, 하단 navigation의 geometry·spacing·typography·copy·color·asset ratio를 측정해 Figma와 맞춘다.
- 대표 `Home / Content / 390×844 / Light`를 먼저 Product Owner에게 시각 승인받고, 승인 뒤 Home의 나머지 상태와 Dark에 같은 위계를 확장한다.
- 기존 9개 Home 상태·routing·44pt·대비·색 외 단서·읽기 순서 계약은 보존한다.

## Out of Scope

- Home의 창의적 재설계, 다른 화면 리터치, iOS·Backend·Prototype 수정, 공개 공유

## Acceptance Criteria

1. 보존된 기준 ref와 비교 frame이 보고서에 민감정보 없이 추적된다.
2. 대표 Light frame은 `390×844pt` canvas를 정확히 유지한다. 주요 bounding box 좌표·크기·간격은 기준 대비 최대 `2pt` 이내, font family·weight·size·line height·copy·color token·asset 비율과 crop은 기준과 동일해야 하며 Product Owner가 승인한다.
3. Home 9개 상태 Light/Dark가 같은 위계로 확장되고 기능·상태 계약이 유지된다.
4. 일반 텍스트 대비, 최소 44pt, 색 외 단서, 읽기 순서와 AX3 대표 위험 상태가 Design QA에서 PASS한다.
5. Figma 식별자와 외부 Library·회사 자산이 저장소에 기록되거나 연결되지 않는다.

## Coordination Notes

- 임시 worktree 경로·미커밋 상태를 Source of Truth로 승인하지 않는다.
- 기준과 Figma의 동일 크기 screenshot overlay를 비교하며, 폰트 rasterization 같은 도구별 차이를 제외한 모든 편차를 보고서에 기록한다.
- Product Owner의 대표 Light 승인 전 다른 Home 상태나 T-006을 시작하지 않는다.
- 완료 후 Design QA와 Completion Review를 거쳐 `done`일 때만 T-006을 연다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 UI/UX Design Agent / Execution Role이야.
Task T-20260813-005를 실행해줘.

- 현재 상태: approved
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: ec91d25e6fb3e9e7535e6b6951185430a04c5b7c
- Home 정확 비교 ref: task/T-20260811-008-visual-fidelity-retouch@1348f05353bd2f0383dd0441545c0f4455759926
- 비교 화면: design/prototype/index.html?screen=home&state=content, 390×844, Light
- 먼저 할 일: canonical의 approved·T-003 done·빈 lock을 확인하고 T-005 lock을 획득해.
- 실행 순서: 보존 ref의 대표 Light를 동일 크기로 캡처·계측해 비공개 Figma Home에 반영하고, 나머지 8개 상태·Dark 확장 전 Product Owner에게 시각 승인을 요청해.
- 정확도: 주요 bounding box 좌표·크기·간격 편차는 최대 2pt, font family·weight·size·line height·copy·color token·asset 비율·crop은 기준과 동일하게 맞춰.
- 필수 보존: Home 9상태 Light/Dark, 대비, 44pt, 색 외 단서, 읽기 순서, AX3 대표 위험 계약.
- 허용 범위: Product Owner가 지정한 비공개 Figma Draft와 T-005 task/report/qa·두 board만.
- 금지: design/prototype/, iOS, Backend 수정; 참조용 T-008 브랜치의 develop 병합; Figma URL·파일 키·조직 식별자 기록; 공개 공유.
- Product Owner가 대표 Light를 승인하면 나머지 Home 상태와 Dark를 확장하고, 자체 검증 후 verification_ready로 Design QA Agent에게 인계해.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-13 | Design Lead Agent |  | proposed | 로컬 Home 기준 ref 고정·Figma 정확 동기화·Product Owner 대표 화면 승인 Task 등록 |
| 2026-08-14 | Design Lead Agent | proposed | scoped | T-003 `done`과 T-008 Home 참조용 원격 ref `1348f05`를 확인하고 390×844 Light·2pt·동일 타이포·자산 비교 계약을 고정 |
| 2026-08-14 | Product Owner | scoped | approved | 보존 Home 기준 정확 동기화, 대표 Light 시각 승인 Gate, UI/UX Design Agent 실행·Design QA 독립 검증 조건으로 승인 |
