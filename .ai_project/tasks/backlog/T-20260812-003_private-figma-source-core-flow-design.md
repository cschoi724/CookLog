---
schema: aiops.task.v1
id: T-20260812-003
title: CookLog 비공개 Figma 원천 전환과 팝 키치 핵심 흐름 UI/UX 원본 구축
status: proposed
type: feature
priority: P1
priority_reason: 비공개 Figma를 독립적인 UI/UX 원천으로 전환해 디자인·구현 간 불일치를 줄여야 한다.
  다만 기존 승인된 디자인 Task를 자동 중단하지 않고, 제품 UX 기획 검증 후 Design Lead가 실행 순서를 조율한다.
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
  - ux_flow
  - ui_design
  - prototyping
  - design_handoff
  - design_source_of_truth_management
  - privacy_by_design
ownership:
  paths:
    - ".ai_project/tasks/backlog/T-20260812-003_private-figma-source-core-flow-design.md"
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
  - T-20260812-002
blocks: []
parallel_group: private-figma-source-transition
allowed_paths:
  - ".ai_project/tasks/backlog/T-20260812-003_private-figma-source-core-flow-design.md"
  - ".ai_project/task_board.md"
  - ".ai_project/teams/design/task_board.md"
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
  - "Product Owner가 지정한 비공개 Draft Figma 파일 (URL·파일 키·조직 식별자는 저장소에 기록하지 않음)"
created_by: Product Lead Agent
approved_by:
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-12
updated_at: 2026-08-12
report_to: ".ai_project/reports/T-20260812-003_private-figma-source-core-flow-design-report.md"
qa_to: ".ai_project/qa/T-20260812-003_private-figma-source-core-flow-design-qa.md"
status_ref: origin/develop
status_ref_sha: c26c7820199c834df6fb239b0530de0dc29fb540
base_ref: origin/develop
base_sha: c26c7820199c834df6fb239b0530de0dc29fb540
branch:
  name:
  base: develop
pr:
  url:
  status:
blocker: T-20260812-002의 Product QA 검증·완료 확정 전에는 UI/UX 원본 실행을 시작하지 않는다.
next_decision: Product Owner가 T-20260812-002 완료 후 Figma 실행 범위와 실행 승인을 결정한다.
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

## Scope

- 기존 로컬 Prototype과 Git 원격 UI 산출물을 `Legacy/Baseline` 참고물로 보존하고, Figma 완료본을 향후 UI/UX 원천으로 전환하는 기준을 정의한다.
- Figma에 `Foundations`, `Components`, `Core Flow Screens`, `States & Flows`, `Legacy/Baseline`, `Archive`를 구분한 구조를 만든다.
- CookLog 전용 로컬 color·typography·spacing·radius·elevation·semantic state Variables와 재사용 Components·Variants·Styles를 구성한다.
- `390×844pt`를 기준으로 팝 키치 레시피 클럽 핵심 흐름을 설계한다.
  - Home → 요리 기록 시작 → 말한 요리 순서 → 레시피로 정리 → 저장된 레시피 → 다시 요리/오디오 가이드
  - Library와 검색·빈 상태, AI 처리·복구, 편집·삭제, 오류·권한·로딩 등 필수 상태와 연결을 포함한다.
- 각 화면은 기본·빈 상태·진행 중·처리 중·오류·완료·비활성 상태와 주요 상호작용을 정의한다.
- 작은 화면 대응은 기본 완료 조건이 아니다. `390×844pt`에서 구현 위험이 확인되거나 저비용으로 해결 가능한 항목만 별도 제안한다.
- 핵심 흐름 전체의 Product Owner 시각 승인과 Design QA 검증이 끝난 뒤, Figma 기준 구현 동기화 범위·기준·순서를 한 번에 확정한다.
- 이 기준이 충족된 시점에만 `.ai_project/source_of_truth.md`와 디자인 handoff/manifest의 UI/UX 원천 우선순위를 갱신한다. Figma URL·파일 키는 어떤 저장소 문서에도 쓰지 않는다.

## Out of Scope

- 핵심 흐름 확정 전 iOS·Backend·로컬 Prototype 직접 수정 또는 부분 구현 동기화
- 기존 `T-20260811-008`, `T-20260811-005~007`의 상태·우선순위·의존성을 이 Task 등록만으로 변경하는 일
- 회사 또는 타 프로젝트의 자산·Library·Variables·폰트 재사용, 공개 공유·게시·외부 공개 export
- Figma 디자인을 근거로 승인 없는 기능·데이터 모델·routing 변경을 구현하는 일

## Acceptance Criteria

1. 비공개 접근·외부 의존성 금지·민감정보 비기록 원칙이 Figma 작업과 QA 체크에 적용되고, 저장소에는 URL·파일 키·조직 식별자가 남지 않는다.
2. Figma 파일은 CookLog 전용 로컬 Foundations, Components, Styles와 화면·상태 페이지 구조를 갖고 외부 팀 Library에 의존하지 않는다.
3. `390×844pt` 기준 핵심 흐름과 모든 필수 상태·상호작용이 팝 키치 컨셉과 T-20260812-002의 UX 구조를 충족한다.
4. Product Owner가 핵심 흐름 완성본의 시각 방향을 확인하고, Design QA가 흐름·상태·접근성·handoff 정합성을 독립 판정한다.
5. Figma 기준 구현 동기화는 핵심 흐름 전체의 승인·QA 통과 후에만 하나의 후속 구현 범위로 제안된다. 그 전 로컬/Git UI는 Legacy/Baseline으로 유지된다.
6. 원천 전환 후 저장소의 Source of Truth·handoff·manifest는 Figma 우선과 Legacy 처리 원칙을 서로 모순 없이 설명한다. 단, 실제 Figma URL·파일 키는 포함하지 않는다.

## Coordination Notes

- 이 Task는 T-20260812-002의 Product QA 검증과 완료 확정 뒤에 Design Lead가 `proposed -> scoped`로 전환한다.
- Design Lead는 T-008 및 T-005~007을 자동 취소하지 않는다. 새 Figma 원천 기준과 충돌하는 부분, 재사용 가능한 산출물, 순서 조정 필요성을 별도 scope 제안으로 Product Owner에게 보고한다.
- Product Owner의 Figma 실행 승인 후 UI/UX Design Agent가 전용 private Figma 파일에서만 화면·컴포넌트 작업을 실행한다.
- Design QA Agent는 외부 공유 여부와 설정 식별자를 수집하지 않고, 민감정보 비기록·외부 의존성 미사용·화면 상태·handoff 완결성만 독립 검토한다.

## Handoff

```text
다음 Agent에게 전달할 말:

너는 Design Lead Agent / Lead Role이야.
Task T-20260812-003은 CookLog의 UI/UX 원천을 비공개 Draft Figma로 전환하고, 팝 키치 핵심 흐름을 완성한 뒤 한 번에 구현 동기화하기 위한 제안 Task야.

- 현재 상태: proposed
- 선행 조건: T-20260812-002가 Product QA 검증과 완료 확정을 마쳐야 한다.
- 다음에 해야 할 일: T-002 완료 후 비공개 운영 원칙, ownership, 기존 T-008·T-005~007과의 충돌·재사용·순서, Figma 실행 산출물과 QA 게이트를 scoped로 조율해줘.
- 기준 문서: CookLog PRD·User Flow·팝 키치 UX 계획·선택 시안·기존 Prototype·handoff 및 Product Owner가 지정한 비공개 Figma 파일.
- 보안: Figma URL·파일 키·팀/조직 식별자·초대 대상·회사 자산 정보를 저장소나 보고서에 쓰지 마. 공개 공유·외부 Library·회사 자산 사용도 금지야.
- 구현 동기화: 핵심 흐름 전체의 Product Owner 시각 승인과 Design QA 통과 전에는 로컬/iOS 구현을 시작하지 마. 기존 로컬·Git UI는 Legacy/Baseline으로 유지해.
- 주의: T-008 및 T-005~007의 상태를 자동 변경하지 말고, 변경 필요 시 Product Owner에게 별도 scope 제안을 올려줘.
```

## Activity

| 날짜 | Agent | 이전 상태 | 다음 상태 | 요약 |
|---|---|---|---|---|
| 2026-08-12 | Product Lead Agent |  | proposed | 비공개 Draft Figma 원천 전환, 독립 로컬 디자인 시스템, 핵심 흐름 완성 후 일괄 구현 동기화 원칙을 Task로 등록 |
