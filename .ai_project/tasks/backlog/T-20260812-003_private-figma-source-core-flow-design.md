---
schema: aiops.task.v1
id: T-20260812-003
title: CookLog 비공개 Figma 원천 전환과 팝 키치 핵심 흐름 UI/UX 원본 구축
status: scoped
type: feature
priority: P1
priority_reason: 비공개 Figma를 독립적인 UI/UX 원천으로 전환해 디자인·구현 간 불일치를 줄여야 한다.
  T-20260812-004의 재정렬이 완료됐으므로 Home baseline부터 통합 QA까지 직렬 하위 Task로 실행한다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design Lead Agent
target_role: Lead Role
planned_execution_agent: UI/UX Design Agent
planned_execution_role: Execution Role
required_capabilities:
  - design_scoping
  - design_dependency_management
ownership:
  paths:
    - ".ai_project/tasks/backlog/T-20260812-003_private-figma-source-core-flow-design.md"
    - ".ai_project/tasks/active/T-20260813-001_figma-foundations-home-visual-baseline.md"
    - ".ai_project/tasks/active/T-20260813-002_figma-core-record-recipe-flow.md"
    - ".ai_project/tasks/active/T-20260813-003_figma-audio-info-82-state-completion.md"
    - ".ai_project/tasks/active/T-20260813-004_figma-integrated-handoff-design-qa.md"
    - ".ai_project/task_board.md"
    - ".ai_project/teams/design/task_board.md"
    - ".ai_project/source_of_truth.md"
    - "design/figma-build/manifest.json"
    - "design/COOKLOG_MVP_UIUX_V1_HANDOFF.md"
  domains:
    - figma-private-source
    - pop-kitsch-core-flow-design
    - design-to-implementation-handoff
  documents:
    - docs/product/
    - design/
ownership_review:
  required: true
  reviewer: Product Lead Agent
depends_on:
  - T-20260812-004
  - T-20260813-001
  - T-20260813-002
  - T-20260813-003
  - T-20260813-004
child_tasks:
  - T-20260813-001
  - T-20260813-002
  - T-20260813-003
  - T-20260813-004
blocks:
  - T-20260805-008
parallel_group: private-figma-source-transition
allowed_paths:
  - ".ai_project/tasks/backlog/T-20260812-003_private-figma-source-core-flow-design.md"
  - ".ai_project/tasks/active/T-20260813-001_figma-foundations-home-visual-baseline.md"
  - ".ai_project/tasks/active/T-20260813-002_figma-core-record-recipe-flow.md"
  - ".ai_project/tasks/active/T-20260813-003_figma-audio-info-82-state-completion.md"
  - ".ai_project/tasks/active/T-20260813-004_figma-integrated-handoff-design-qa.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/design/task_board.md"
  - ".ai_project/teams/quality/task_board.md"
  - ".ai_project/source_of_truth.md"
  - "design/figma-build/manifest.json"
  - "design/COOKLOG_MVP_UIUX_V1_HANDOFF.md"
  - ".ai_project/reports/T-20260812-003_private-figma-source-core-flow-design-report.md"
  - ".ai_project/qa/T-20260812-003_private-figma-source-core-flow-design-qa.md"
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_POP_KITSCH_UX_PLAN.md
  - design/concepts/2026-08-11-home-options/a-pop-kitsch-recipe-club.png
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - ".ai_project/tasks/active/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions.md"
  - ".ai_project/tasks/active/T-20260812-004_rebaseline-private-figma-delivery-flow.md"
  - docs/product/CookLog_FIGMA_DELIVERY_FLOW.md
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (URL·파일 키·조직 식별자는 저장소에 기록하지 않음)"
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-12
updated_at: 2026-08-13
report_to: ".ai_project/reports/T-20260812-003_private-figma-source-core-flow-design-report.md"
qa_to: ".ai_project/qa/T-20260812-003_private-figma-source-core-flow-design-qa.md"
status_ref: origin/develop
status_ref_sha: bcbd3aa6bd5d307da03238aabd5c0ebcd811d583
worktree_path: "/private/tmp/cooklog-t20260812-003-scope"
worktree_role: Lead Role
base_ref: origin/develop
base_sha: bcbd3aa6bd5d307da03238aabd5c0ebcd811d583
branch:
  name: task/T-20260812-003-scope
  base: develop
pr:
  url:
  status:
blocker: 하위 T-20260813-001~004 scope의 Product Lead Agent 제품 계약 ownership review와 Product Owner의 비공개 Figma 실행 승인이 필요하다.
next_decision: Product Lead ownership review에서 Light-only 출시 시각 기준과 82개 기능·상태 계약의 비충돌을 확인한 뒤 Product Owner가 UI/UX Design Agent 실행을 승인한다.
---

# CookLog 비공개 Figma 원천 전환과 팝 키치 핵심 흐름 UI/UX 원본 구축

## Goal

Product Owner가 지정한 비공개 Draft Figma 파일을 팝 키치 레시피 클럽 UI/UX의 원천으로 전환한다. 핵심 흐름을 Figma에서 완결한 뒤에만 구현 동기화를 한 단위로 준비해, 러프한 로컬 구현이 디자인 의도를 대체하거나 디자인과 앱이 서로 달라지는 문제를 줄인다.

## Privacy and External Resource Rules

- 작업 대상은 Product Owner가 지정한 CookLog 전용 비공개 Draft 파일 하나로 한정한다. URL, 파일 키, 초대 대상, 팀·조직 정보는 저장소·Task·보고서·스크린샷에 기록하지 않는다.
- 공유 설정은 직접 초대한 사용자만 접근 가능한 비공개 상태여야 한다. 공개 링크, Community 게시, 공개 프로토타입, 외부 공개 export를 만들지 않는다.
- 회사 Library·Variables·폰트·자산, 다른 프로젝트 파일, 회사명·내부 서비스명·직원 정보·소스 코드·API 주소·키·실사용자 데이터를 열람·연결·복사하지 않는다.
- Figma 파일 내부에 CookLog 전용 로컬 Variables·Components·Styles·자산만 만든다. 외부 팀 Library 의존성과 Publish Library 연결은 금지한다.
- Figma MCP를 쓸 때에도 위 파일과 필요한 CookLog 산출물 범위만 다룬다. 다른 Figma 파일 또는 팀 자산을 탐색하지 않는다.
- 비공개 설정 확인 사실은 민감 식별자 없이 QA 보고서에 체크 결과만 남긴다.
- Product Owner는 2026-08-13 회사 Draft의 개인 프로젝트 사용, `.fig` 내보내기·개인 팀 이전, 회사의 소유권·사용권 비주장, 외부 MCP 접근 허용을 관리자에게 확인했다고 고지했다. 저장소에는 승인 사실만 남기고 회사·관리자·조직 식별자는 기록하지 않는다.

## Scope

- 기존 로컬 Prototype과 Git 원격 UI 산출물을 `Legacy/Baseline` 참고물로 보존하고, Figma 완료본을 향후 UI/UX 원천으로 전환하는 기준을 정의한다.
- Figma에 `Foundations`, `Components`, `Core Flow Screens`, `States & Flows`, `Legacy/Baseline`, `Archive`를 구분한 구조를 만든다.
- CookLog 전용 로컬 color·typography·spacing·radius·elevation·semantic state Variables와 재사용 Components·Variants·Styles를 구성한다.
- 파일 페이지는 `00 Cover & Status`, `01 Foundations`, `02 Components`, `03 Core Flow Screens`, `04 States & Flows`, `90 Legacy/Baseline`, `99 Archive` 순서로 고정한다.
- `390×844pt`를 기준으로 팝 키치 레시피 클럽 핵심 흐름을 설계한다.
  - Home → 요리 기록 시작 → 말한 요리 순서 → 레시피로 정리 → 저장된 레시피 → 다시 요리/오디오 가이드
  - Library와 검색·빈 상태, AI 처리·복구, 편집·삭제, 오류·권한·로딩 등 필수 상태와 연결을 포함한다.
- 각 화면은 기본·빈 상태·진행 중·처리 중·오류·완료·비활성 상태와 주요 상호작용을 정의한다.
- 82개 상태는 반드시 추적 키와 함께 Figma에서 검사 가능한 전용 frame 또는 component/state configuration으로 표현한다. 같은 시각 구조를 공유해도 상태명·발생 조건·다음 행동·데이터 보존·복구 계약을 생략하지 않는다.
- 첫 실행 게이트는 `Home / Content / 390×844 / Light` 한 장이다. 선택 시안의 구성 순서·비율·시선 흐름을 기준으로 기존 UI를 재색칠하거나 보정하지 않고 새로 구성하며, Product Owner가 `Home Visual Baseline v1`로 승인하기 전에는 나머지 화면군의 고충실도 확장을 시작하지 않는다.
- Home baseline은 흰 캔버스, 큰 CookLog 워드마크, 짧은 라벨, 중앙 대형 토마토 레드 원형 기록 CTA, 최근 레시피 2열 카드, 작은 비챗봇 AI 도우미와 짧은 카피의 위계를 시안에 맞춘다. 시안과 달라야 하는 자산·폰트 제약은 임의 대체하지 않고 Product Owner에게 차이와 대안을 먼저 제시한다.
- 타이포는 iOS에서 동일하게 사용할 수 있는 구현 안전 font family·weight·line height를 사용한다. 디자인 전용 폰트나 회사 폰트를 사용하지 않으며, 대체가 필요한 경우 기준 화면 승인에 폰트 차이도 포함한다.
- 출시 시각 승인과 고충실도 Design QA는 Light 모드만 대상으로 한다. Dark 정밀 화면·Dark 시각 일치 검수는 이번 완료 조건에서 제외하고 삭제·확정하지 않은 후속 후보로 남긴다. semantic token 이름은 향후 mode 확장을 막지 않게 구성한다.
- Light 화면에서도 일반 텍스트 대비, 최소 44pt 터치 영역, 색 외 상태 단서, 읽기 순서, Accessibility 3의 확대 원칙은 유지한다. 전체 상태의 AX3 별도 frame 복제 대신 공통 component 규칙과 대표 위험 frame으로 검증한다.
- 작은 화면 대응은 기본 완료 조건이 아니다. `390×844pt`에서 구현 위험이 확인되거나 저비용으로 해결 가능한 항목만 별도 제안한다.
- 핵심 흐름 전체의 Product Owner 시각 승인과 Design QA 검증이 끝난 뒤, Figma 기준 구현 동기화 범위·기준·순서를 한 번에 확정한다.
- 이 기준이 충족된 시점에만 `.ai_project/source_of_truth.md`와 디자인 handoff/manifest의 UI/UX 원천 우선순위를 갱신한다. Figma URL·파일 키는 어떤 저장소 문서에도 쓰지 않는다.

## Out of Scope

- 핵심 흐름 확정 전 iOS·Backend·로컬 Prototype 직접 수정 또는 부분 구현 동기화
- 기존 `T-20260811-008`, `T-20260811-005~007`의 상태·우선순위·의존성을 이 Task 등록만으로 변경하는 일
- 회사 또는 타 프로젝트의 자산·Library·Variables·폰트 재사용, 공개 공유·게시·외부 공개 export
- Figma 디자인을 근거로 승인 없는 기능·데이터 모델·routing 변경을 구현하는 일
- Dark mode 고충실도 화면 전체 제작·시각 승인·정밀 QA와 375×667pt 전체 화면 명세
- Figma 자동 생성 코드를 구현 완료물로 취급하거나, iOS·HTML/CSS 코드를 이 Task에서 직접 수정하는 일

## Acceptance Criteria

1. 비공개 접근·외부 의존성 금지·민감정보 비기록 원칙이 Figma 작업과 QA 체크에 적용되고, 저장소에는 URL·파일 키·조직 식별자가 남지 않는다.
2. Figma 파일은 CookLog 전용 로컬 Foundations, Components, Styles와 화면·상태 페이지 구조를 갖고 외부 팀 Library에 의존하지 않는다.
3. `Home / Content / 390×844 / Light`는 선택 시안의 정보 위계·구성 비율·여백·타이포·CTA·카드·AI 도우미를 고충실도로 재현하고, Product Owner가 `Home Visual Baseline v1`로 승인한다.
4. 승인된 Home baseline의 시각 언어로 `390×844pt Light` 핵심 흐름 7개 화면군과 82개 상태·상호작용·복구 계약을 추적 가능하게 완성한다.
5. Product Owner가 전체 핵심 흐름 완성본의 시각 방향을 승인하고, Design QA가 Light 기준 흐름·82개 상태·대비·44pt·색 외 상태 단서·읽기 순서·Accessibility 3 대표 위험 frame·handoff·비공개 운영 정합성을 독립 판정한다. Dark 정밀 시각 QA와 375×667 전체 화면 QA는 판정 대상이 아니다.
6. Figma 기준 구현 동기화는 핵심 흐름 전체의 승인·QA 통과 후에만 하나의 후속 구현 범위로 제안된다. 그 전 로컬/Git UI는 Legacy/Baseline으로 유지된다.
7. 원천 전환 후 저장소의 Source of Truth·handoff·manifest는 Figma 우선과 Legacy 처리 원칙을 서로 모순 없이 설명한다. 단, 실제 Figma URL·파일 키는 포함하지 않는다.

## Execution Plan

1. `T-20260813-001`: 비공개 접근·MCP 경계를 확인하고 CookLog Foundations·Components와 Home 9개 상태를 만든다. `Home / Content / 390×844 / Light`는 Product Owner의 `Home Visual Baseline v1` 승인을 받아야 한다.
2. `T-20260813-002`: 승인 Home baseline을 기준으로 Library 5개·Cooking Log 14개·AI Review 12개·Recipe Detail 7개 상태와 기록→저장→재사용 흐름을 완성한다.
3. `T-20260813-003`: Audio Guide 24개·App Info 11개 상태와 전체 `States & Flows`를 완성하고 82개 상태 추적성을 닫는다. Product Owner가 전체 Light 핵심 흐름을 시각 승인한다.
4. `T-20260813-004`: UI/UX Design Agent가 manifest·handoff·Source of Truth 변경안과 QA 증거를 준비하고, Design QA Agent가 82개 상태·접근성·비공개 운영·handoff를 독립 검증한다.
5. 하위 4개가 모두 `done`이면 Design Lead가 상위 T-20260812-003 Completion Review에서 Figma baseline을 고정하고 T-20260805-008 인계 조건을 해제한다.

## Fidelity and Handoff Contract

- Figma frame·component·variable 이름은 화면/상태/의미를 식별할 수 있어야 하며 임의 레이어명과 detached 복제본을 최소화한다.
- spacing, size, type, color, radius, stroke, shadow, asset ratio를 Dev Mode/MCP에서 읽을 수 있도록 실제 속성과 local variables로 구성한다.
- 동일한 `390×844pt` iOS 구현은 향후 고정 Figma baseline의 geometry·spacing·typography·copy·color·component hierarchy를 임의 재해석하지 않는 계약을 handoff에 명시한다.
- safe area·native control behavior·접근성 대응처럼 플랫폼 적응이 필요한 항목은 frame annotation에 `고정`, `반응형`, `플랫폼 적응` 중 하나로 표시한다.
- Figma 파일 전체를 반복 조회하지 않고 필요한 page/frame/node만 MCP로 다루며, 파일 식별자는 저장소가 아닌 승인된 비공개 작업 컨텍스트에서만 전달한다.

## Coordination Notes

- 이 Task는 T-20260812-004의 Product QA 검증과 완료 확정 뒤에 Design Lead가 `proposed -> scoped`로 전환한다.
- T-008 및 T-005~007은 T-20260812-004에서 `cancelled` 처리됐고, 기존 산출물과 WIP는 삭제하지 않은 `Legacy/Baseline` 입력으로만 사용한다.
- Product Owner의 Figma 실행 승인 후 UI/UX Design Agent가 전용 private Figma 파일에서만 화면·컴포넌트 작업을 실행한다.
- Design QA Agent는 외부 공유 여부와 설정 식별자를 수집하지 않고, 민감정보 비기록·외부 의존성 미사용·화면 상태·handoff 완결성만 독립 검토한다.
- Product Lead Agent는 실행 승인 전에 Light-only 출시 시각 기준이 PRD·82개 기능/상태·접근성 의미 계약을 축소하지 않는지 ownership review한다. Dark 정밀 디자인 제외는 기능·데이터·routing 삭제 승인이 아니다.
- T-20260805-008, T-20260812-001 및 iOS UI 동기화는 Figma baseline 고정 전까지 시작하지 않는다. Backend 독립 Task는 기존 흐름을 유지한다.
- 같은 Figma 파일·Variables·Components를 공유하므로 T-20260813-001→002→003→004를 직렬 실행한다. 여러 UI/UX Agent가 같은 파일을 동시에 수정하는 병렬 실행은 허용하지 않는다.

## Ownership Review Request

```text
ownership reviewer에게 전달할 말:

너는 Product Lead Agent / Lead Role이야.
Task T-20260812-003의 제품 계약 ownership review를 진행해줘.

- 현재 상태: scoped
- 상태 소유자: Design Lead Agent / Lead Role. Product Lead는 Design Task 상태를 전이하지 않고 제품 계약 review만 수행한다.
- 기준 상태 ref: origin/develop
- 기준 상태 SHA: bcbd3aa
- 선행 조건: T-20260812-004 `done`, 해소됨.
- 다음에 해야 할 일: 하위 T-20260813-001~004의 Home 390×844 Light 선승인 → 7개 화면군·82개 상태 → 전체 시각 승인 → Design QA → baseline 고정 순서가 제품 계약과 충돌하지 않는지 검토해줘.
- 기준 문서: CookLog PRD·User Flow·팝 키치 UX 계획·선택 시안·기존 Prototype·handoff 및 Product Owner가 지정한 비공개 Figma 파일.
- 보안: Figma URL·파일 키·팀/조직 식별자·초대 대상·회사 자산 정보를 저장소나 보고서에 쓰지 마. 공개 공유·외부 Library·회사 자산 사용도 금지야.
- Product Owner 결정: 회사 Draft 사용·개인 팀 이전·외부 MCP는 관리자 허용 확인 완료. 출시 고충실도 시각 기준은 Light만이며 Dark 정밀 디자인·QA는 이번 범위에서 제외한다.
- 확인할 쟁점: Dark 제외가 기능·상태·접근성 의미 계약 삭제로 해석되지 않는지, 82개 상태 추적과 Home 단일 전체 보기 baseline이 유지되는지 확인해줘.
- 구현 동기화: 전체 핵심 흐름의 Product Owner 시각 승인과 Design QA 통과 전에는 로컬/iOS 구현을 시작하지 마. 기존 로컬·Git UI는 Legacy/Baseline으로 유지해.
- Legacy/Baseline: T-008 및 T-005~007은 T-004에서 이미 `cancelled`되어 이 Task에 흡수됐다. 기존 산출물과 미병합 WIP는 삭제하지 말고 설계 입력으로 보존해.
- 리뷰 통과 후: review 결과를 Design Lead와 Product Owner에게 인계해. Product Owner가 T-20260813-001을 승인하면 Design Lead가 UI/UX Design Agent 실행 상태로 라우팅한다.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-12 | Product Lead Agent |  | proposed | 비공개 Draft Figma 원천 전환, 독립 로컬 디자인 시스템, 핵심 흐름 완성 후 일괄 구현 동기화 원칙을 Task로 등록 |
| 2026-08-13 | Design Lead Agent | proposed | scoped | T-004 완료를 확인하고 Home Light 선승인·전체 핵심 흐름·82개 상태·로컬 디자인 시스템·독립 QA·Figma 보안 경계를 실행 가능한 범위로 조율 |
| 2026-08-13 | Design Lead Agent | scoped | scoped | 실행 범위를 T-20260813-001~004 직렬 하위 Task로 분리하고 상위 Task를 baseline 완료 집계 단위로 전환 |
| 2026-08-13 | Design Lead Agent | scoped | scoped | PR #161 재감사에서 기존 cross-team Source of Truth 참조를 보존하도록 Task 경로를 복구하고, Design Team 상태 소유자는 Design Lead로 유지하며 Product Lead는 ownership reviewer로 한정 |
