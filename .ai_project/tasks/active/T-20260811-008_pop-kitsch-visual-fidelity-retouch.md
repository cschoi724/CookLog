---
schema: aiops.task.v1
id: T-20260811-008
title: 팝 키치 레시피 클럽 Visual Fidelity 리터치 및 시각 승인
status: approved
type: feature
priority: P1
priority_reason: Home 기준 화면의 시각 완성도를 확정하기 전 다음 화면군을 진행하면 약한 기존 레이아웃과 카피 밀도가 전파될 위험이 있다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: UI/UX Design Agent
target_role: Execution Role
planned_execution_agent: UI/UX Design Agent
planned_execution_role: Execution Role
required_capabilities: [design_scoping, visual_direction, visual_fidelity_review, ux_flow, ui_design, prototyping, design_handoff]
ownership:
  paths: [design/prototype/app.js, design/prototype/styles.css, design/prototype/components.html]
  domains: [prototype-foundation, home-experience, visual-fidelity]
  documents: [design/prototype/, design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png]
ownership_review:
  required: false
  reviewer:
depends_on: [T-20260811-004]
blocks: [T-20260811-005]
parallel_group: pop-kitsch-design-sequence
allowed_paths:
  - design/prototype/app.js
  - design/prototype/styles.css
  - design/prototype/components.html
  - .ai_project/tasks/active/T-20260811-008_pop-kitsch-visual-fidelity-retouch.md
  - .ai_project/tasks/backlog/T-20260811-005_pop-kitsch-log-review-detail-prototype-design.md
  - .ai_project/reports/T-20260811-008_pop-kitsch-visual-fidelity-retouch-report.md
  - .ai_project/qa/T-20260811-008_pop-kitsch-visual-fidelity-retouch-qa.md
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
source_of_truth:
  - origin/develop@049dab0
  - .ai_project/tasks/backlog/T-20260811-002_pop-kitsch-home-concept-source-design.md
  - .ai_project/tasks/active/T-20260811-004_pop-kitsch-home-library-prototype-design.md
  - design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md
  - docs/product/CookLog_USER_FLOW.md
created_by: Design Lead Agent
approved_by: Product Owner (2026-08-12, Visual Fidelity 리터치 및 시각 승인 실행 승인)
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-11
updated_at: 2026-08-12
report_to: .ai_project/reports/T-20260811-008_pop-kitsch-visual-fidelity-retouch-report.md
qa_to: .ai_project/qa/T-20260811-008_pop-kitsch-visual-fidelity-retouch-qa.md
status_ref: origin/develop
status_ref_sha: 049dab0
base_ref: origin/develop
base_sha: 049dab0
branch:
  name: task/T-20260811-008-visual-fidelity-retouch
  base: develop
pr:
  url:
  status:
---

# 팝 키치 레시피 클럽 Visual Fidelity 리터치 및 시각 승인

## Scope

- Goal: T-004의 기능·접근성 기반 재구성 후, Home을 `a-pop-kitsch-recipe-club`에 가까운 기준 화면으로 리터치하고 Product Owner의 시각 승인을 받아 다음 화면군의 공통 방향을 확정한다.
- Home은 기존 레이아웃을 보정하는 방식이 아니라 새 조합으로 완성한다. 화이트 캔버스, 큰 CookLog 워드마크·짧은 라벨, 중앙 대형 원형 음성 기록 CTA, 최근 레시피 2열 카드, 작은 비챗봇 AI 도우미의 순서와 밀도를 시안에 가깝게 맞춘다.
- Home·Library의 기능·상태 계약은 유지하되, 기존 Hero·설명 문단·일반 버튼·세로 목록 배치를 시각 보존 대상으로 취급하지 않는다. 기본 Home의 불필요한 설명은 제거하거나 해당 상태에서만 제공한다.
- Foundation은 토큰 교체 수준이 아니라 강한 디스플레이 타이포, 토마토 레드 CTA, 코발트·버터 포인트, 제한적이지만 존재감 있는 스티커·테이프·낙서, 카드·AI 도우미 표현을 같은 체계로 정돈한다.
- Home을 다음 화면군의 기준 화면으로 삼는다. T-005·006은 Home 레이아웃을 복제하지 않되 화이트 캔버스, 큰 행동 우선, 짧은 카피, 대담한 타이포와 제한적 키치 장식의 시각 언어를 따라야 한다.
- Out of scope: Home·Library 밖 화면 구조 변경, 새로운 기능·routing·데이터 모델·iOS·Backend 변경, 외부 이미지·폰트 추가. 음식 사진과 고유 폰트의 완전 일치는 별도 자산 승인 없이는 요구하지 않는다.

## Acceptance Criteria

1. 390×844 Light 기본 Home은 원본 시안과 비교해 기존 레이아웃의 흔적 없이 워드마크·첫 행동·카드·AI 도우미의 위계와 여백이 고충실도로 구현된다.
2. 375×667, Accessibility 3, Light/Dark에서 정보가 잘리지 않고 44pt, 대비, keyboard·VoiceOver·focus 계약을 보존한다.
3. Home 9개·Library 5개 상태의 routing, recipe lifecycle, 최근 3개, AI 비챗봇 의미, 로컬 검색 개인정보 안내를 보존한다.
4. UI/UX Design Agent는 QA 인계 전 Product Owner에게 대표 390×844 Light Home과 필요한 상태 preview를 제시하고, Product Owner의 시각 승인 또는 피드백을 같은 실행 Task 안에서 반영한다.
5. Design QA는 시각 취향의 최종 승인자가 아니라 기존 레이아웃 잔존·카피 과다·기능/접근성 회귀를 판정한다. Product Owner 시각 승인과 QA PASS 후에만 T-005가 시작할 수 있다.

## Execution

- Product Owner가 2026-08-12 본 Task의 실행을 승인했고, T-004는 `origin/develop@049dab0`에서 `done`이다.
- UI/UX Design Agent가 최신 `origin/develop@049dab0` 기반 전용 worktree에서 lock을 획득해 실행한다. 시각 preview 피드백은 `in_progress` 상태에서 반영하며, Product Owner가 만족을 확인한 뒤에만 `verification_ready`로 넘긴다.
- Design QA는 routing·상태·작은 화면·명도·터치 영역·키보드·VoiceOver와 명시된 카피 밀도 계약을 독립 검증한다.
- T-005는 T-008의 Product Owner 시각 승인과 Design QA 통과 전에는 실행하지 않는다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 UI/UX Design Agent / Execution Role이야.
Task T-20260811-008은 승인된 Visual Fidelity 리터치 Task야.

- 현재 상태: approved
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: 049dab0
- 다음에 해야 할 일: 최신 develop에서 전용 worktree와 lock을 획득해 Home·Library Visual Fidelity 리터치를 수행해줘.
- 기준 문서: T-002, T-004, design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png, design/prototype/
- 허용 경로: design/prototype/app.js, design/prototype/styles.css, design/prototype/components.html 및 Task frontmatter의 추적 경로
- 참고 산출물: T-004 실행·QA 보고서와 Home 대표 preview
- 변경/검토 대상: Home·Library Foundation 표현, Home의 타이포·카피 밀도·CTA·카드·AI 도우미 위계
- 남은 리스크: 외부 음식 사진·고유 폰트는 승인된 자산 없이는 사용하지 않는다.
- 차단/결정 필요: T-004 완료, Product Owner 시각 승인
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-11 | Design Lead Agent |  | proposed | T-004 후 Home 고충실도 리터치와 Product Owner 시각 승인 전담 Task 등록 |
| 2026-08-12 | Product Owner | scoped | approved | Visual Fidelity 리터치 및 시각 승인 실행을 승인했고, T-004 완료 후 UI/UX Design Agent 실행으로 인계 |
| 2026-08-12 | Design Lead Agent | proposed | scoped | T-004 후속 리터치 범위, T-005 대기 조건, 허용 경로와 기준 문서를 실행 가능하게 조율 |
| 2026-08-12 | Product Owner | scoped | approved | Visual Fidelity 리터치와 Product Owner 시각 승인 흐름 실행 승인; T-004 완료 전 실행 대기 |
