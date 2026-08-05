---
id: T-20260803-001
title: Figma 미러 재작업과 Light 우선 디자인 시스템 구축
status: blocked
blocked_reason: figma_mcp_rate_limit
type: feature
priority: P1
priority_reason: 승인된 로컬 UI/UX 미러의 QA 결함을 해소하고 iOS 적용에 재사용할 Light 디자인 토큰과 공통 컴포넌트를 Figma에 구성한다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design Lead Agent
target_role: Lead Role
required_capabilities:
  - design_scoping
  - prototyping
  - ui_design
  - design_handoff
depends_on:
  - T-20260728-002
blocks: []
parallel_group: figma-mirror
allowed_paths:
  - design/
  - .ai_project/source_of_truth.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - design/prototype/
  - design/COOKLOG_MVP_UIUX_V1_HANDOFF.md
  - design/figma-build/manifest.json
  - design/figma-build/state.json
  - design/figma-build/RUNBOOK.md
  - .ai_project/qa/T-20260803-001_sync-approved-mvp-uiux-to-figma-mirror-qa.md
  - .ai_project/tasks/archive/2026-08/T-20260728-002_create-figma-mvp-uiux-v1.md
created_by: Design Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-08-03
updated_at: 2026-08-04
report_to: .ai_project/reports/T-20260803-001_sync-approved-mvp-uiux-to-figma-mirror-report.md
qa_to: .ai_project/qa/T-20260803-001_sync-approved-mvp-uiux-to-figma-mirror-qa.md
---

# Figma 미러 재작업과 Light 우선 디자인 시스템 구축

## 목적

Design QA에서 확인된 Figma 시각 미러 결함을 고치고, 승인된 로컬 UI/UX를 기준으로 Light Mode Foundation과 공통 컴포넌트를 Figma에 편집 가능한 디자인 시스템으로 구성한다.

Dark Mode는 Light 구축과 자체 검증을 모두 통과하고 Figma MCP 호출 여유가 확인될 때만 같은 구조로 이어서 진행한다. 공식 UI Source of Truth는 계속 `design/prototype/`이며 Figma는 구현 핸드오프와 형상 보존을 위한 미러다.

## 실행 대상

- Figma File Key: `tAvYn6TatLKb3SXDjkH1hn`
- 기존 Gallery: `59:2`
- 기존 Cover/Handoff: `57:2`
- Run ID: `cooklog-mvp-v1-design-system-20260803`
- 실행 기준: `design/figma-build/RUNBOOK.md`
- 실행 스킬: `figma-use`, `figma-generate-design`, `figma-generate-library`

## 호출 운영 원칙

- 고정 호출 상한은 두지 않되 품질을 해치지 않는 범위에서 MCP 호출을 최소화한다.
- 로컬에서 가능한 파싱, 상태 수 검사, 명암비, HTML 렌더링과 스크립트 검증을 먼저 끝낸다.
- Figma에서는 안전한 원자적 단위로 순차 실행하고 한 호출에서 여러 컴포넌트를 일괄 생성하지 않는다.
- 변수는 컴포넌트보다 먼저 생성하고 각 컴포넌트는 하나씩 생성·검증한다.
- 생성 호출에서 구조 메타데이터와 inline screenshot을 함께 반환할 수 있으면 별도 검증 호출을 줄인다.
- 한 호출에서 page 전환은 최대 한 번만 수행한다.
- 모든 생성·변경 node ID, variable ID, style ID와 호출 결과를 state ledger에 즉시 기록한다.
- 오류 발생 시 자동 재시도하지 않는다.

## 한도 차단과 보류 정책

실제 Figma MCP 호출 한도 또는 외부 rate limit 오류가 확인되면 다음과 같이 처리한다.

1. 즉시 실행을 멈추고 추가 호출을 하지 않는다.
2. 성공한 마지막 원자적 단계와 반환 ID를 state ledger에 기록한다.
3. 실행 lock을 해제하고 Task를 `blocked`로 전환한다.
4. `blocked_reason: figma_mcp_rate_limit`에 해당하는 사유와 오류 원문을 실행 보고에 남긴다.
5. 생성된 정상 산출물은 삭제하거나 다시 만들지 않는다.
6. Product Owner가 한도 갱신 또는 재개를 확인하면 같은 Task에서 읽기 전용 rehydrate 후 중단 지점부터 이어간다.

이 보류는 취소가 아니며 로컬 디자인과 iOS 적용을 차단하지 않는다.

## WP-R1 — 로컬 Gallery QA 결함 수정

MCP를 호출하기 전에 완료한다.

- Manifest 기준 누락된 앱 상태 9개를 `gallery.html`에 추가한다.
  - Home Loading/Error
  - Cooking Log Empty/Error
  - AI Review Saving
  - Recipe Detail Loading/Error
  - Audio Player Loading/Error
- 앱 상태 수와 전체 캡처 카드 수를 별도 필드로 기록한다.
- Light·Dark Components Gallery의 viewport를 실제 콘텐츠 높이에 맞추거나 섹션별로 분할한다.
- Button, Status Banner, Form Field, Recipe Card, Player Controls 전체가 Light·Dark에서 잘림 없이 보이게 한다.
- 390×844, 375×667과 주요 Light·Dark 화면의 회귀를 로컬에서 검증한다.

## WP-R2 — Figma Discovery와 재개 상태 확정

- 기존 Gallery `59:2`, Cover `57:2`, 페이지, 변수, 스타일, 컴포넌트를 읽기 전용으로 재탐색한다.
- 기존 Run ID와 state ledger를 실제 Figma ID로 rehydrate한다.
- Code Connect 존재 여부, 기존 화면과 접근 가능한 라이브러리를 확인한다.
- 로컬 Manifest와 Figma의 gap analysis를 실행 보고에 기록한다.
- Light scope의 정확한 토큰·스타일·컴포넌트 목록을 쓰기 전에 고정한다.

## WP-R3 — Light Foundation

Starter 3페이지 구조를 유지한다.

- `00 — Direction Gate`: 기존 방향과 승인 정보 유지
- `01 — System & Handoff`: Light Foundation, Components, 사용 기준
- `02 — MVP Screens & Prototype`: 수정된 Gallery와 상태 기준

Light 우선 생성 범위:

- Color Primitives 21개
- Light Semantic Color 15개
- Spacing 7개
- Radius 5개
- Text Style 6개
- Effect Style 2개
- 모든 Variable scope와 WEB/iOS code syntax
- Semantic Color는 Primitive alias 사용
- Foundation 문서 Section과 Light 시각 샘플

Foundation 생성 후 변수 수, collection, scope, alias, code syntax와 시각 샘플을 검증한다. Foundation이 통과하기 전에는 컴포넌트를 만들지 않는다.

## WP-R4 — Light 공통 컴포넌트

아래 순서로 한 종류씩 생성·검증한다.

1. Button
2. Record Control
3. Recipe Card
4. STEP Row
5. Status Banner
6. Form Field
7. Player Controls

각 컴포넌트는 다음을 만족해야 한다.

- Auto Layout
- Light Semantic Variable binding
- Task와 Manifest의 Variant·State
- 필요한 Text·Boolean·Instance Swap Component Property
- 44pt 이상 터치 영역
- 상태별 명칭과 사용 기준
- 생성 직후 구조 메타데이터와 시각 검증
- Run ID와 logical key 기록

## WP-R5 — 수정 Gallery와 Light 통합 검증

- 수정된 전체 상태 Gallery를 Figma 미러에 반영한다.
- 앱 상태 23개와 캡처 카드 수를 별도 검증한다.
- Light Components 전체 상태가 잘림 없이 보이는지 확인한다.
- 기존 Cover/Handoff와 Source of Truth 경로를 유지한다.
- Light Foundation·Component와 Gallery 명칭·토큰·상태를 대조한다.
- 접근성 대비, 터치 영역, 이름 중복, 미해결 binding을 검사한다.

## WP-R6 — 조건부 Dark 확장

아래 진입 조건을 모두 만족할 때만 진행한다.

- WP-R1~R5 완료
- Light Foundation과 7개 컴포넌트 자체 검증 통과
- 최근 호출에서 rate limit 또는 quota 경고 없음
- state ledger가 실제 Figma ID와 일치

진입 후 범위:

- Dark Semantic Color 15개
- Light와 동일한 컴포넌트 구조에 Dark 변수 적용
- Dark Components 시각 검증
- Dark Gallery 잘림·대비·상태 회귀 검증

진입 조건을 충족하지 못하면 Dark는 `pending`으로 남기고 Light 완료 결과만 Design QA에 인계한다. Dark 미완료 자체는 Light 완료 판정을 차단하지 않는다.

## 제외 범위

- PRD 또는 승인 UX 방향 변경
- iOS 구현 코드 수정
- Paywall·구독 UX
- 앱 아이콘·그래픽 로고
- Android 전용 디자인
- 호출 수를 줄이기 위한 다중 컴포넌트 일괄 생성
- 검증하지 않은 Foundation 위에 컴포넌트 생성

## 성공 기준

필수 완료:

- Design QA 결함 2건 해소
- 앱 상태 23개가 Figma 미러에서 식별 가능
- Light·Dark Components Gallery 잘림 해소
- Light Foundation 전체 생성과 검증
- Light 공통 컴포넌트 7종 생성과 검증
- state ledger와 실행 보고 최신화
- Design QA Agent의 독립 재검증 통과

조건부 완료:

- Dark Foundation·Components는 호출 여유가 있을 때 진행
- Dark가 보류되면 중단 지점과 미완료 항목을 state ledger와 핸드오프에 기록

## 현재 의사결정 게이트

- Design Lead가 위 재작업 범위를 `scoped`로 정리했다.
- 기존 실행 승인과 추가 호출 승인은 과거 시각 스냅샷 업로드 범위에 대한 기록으로 유지한다.
- Product Owner가 Light 디자인 시스템 구축, 조건부 Dark 확장과 rate limit 보류 정책을 포함한 확대 재작업을 승인했다.
- UI/UX Design Agent가 lock을 획득한 뒤 WP-R1 로컬 수정부터 실행한다.

## 상태 전이 요약

- 2026-08-03: 시각 스냅샷 미러를 실행하고 Gallery `59:2`, Cover `57:2`를 생성했다.
- 2026-08-03: Design QA가 앱 상태 9개 누락과 Components Gallery 잘림을 확인해 `verification_in_progress -> rework_requested`로 전환했다.
- 2026-08-03: Design Lead가 로컬 결함 수정, Light Foundation·컴포넌트, 조건부 Dark 확장과 rate limit 보류 정책으로 재조율해 `rework_requested -> scoped`로 전환했다.
- 2026-08-03: Product Owner가 확대 재작업을 승인해 `scoped -> approved`로 전환하고 UI/UX Design Agent에 라우팅했다.
- 2026-08-04: UI/UX Design Agent가 실행 lock을 획득하고 `approved -> in_progress`로 전환해 WP-R1 로컬 결함 수정과 Phase 0 Discovery를 시작했다.
- 2026-08-04: WP-R1에서 앱 상태 23개·캡처 카드 32개를 확인하고 Light·Dark Components Gallery 잘림을 해소했다.
- 2026-08-04: Phase 0 읽기 전용 탐색에서 기존 변수·스타일·컴포넌트가 없음을 확인했으나 디자인 시스템 라이브러리 검색 중 Figma Starter MCP 호출 한도 오류가 발생했다. 추가 호출 없이 lock을 해제하고 `in_progress -> blocked`로 전환했다.
- 2026-08-04: UI/UX Design Agent가 완료 범위와 재개 절차를 기록하고 `target_agent`를 Design Lead Agent로 전환해 한도 갱신 조율을 인계했다.
- 2026-08-04: Product Owner가 한도 미복구를 확인하고 Task를 당분간 `blocked`로 보류하기로 결정했다. 별도의 복구 확인 전까지 MCP를 호출하지 않으며 Design Team의 신규 실행은 다음 디자인 Task가 준비될 때까지 대기한다.

## 현재 차단 정보

- `blocked_reason`: `figma_mcp_rate_limit`
- 마지막 성공 단계: Figma 파일 구조·라이브러리 읽기 전용 탐색
- 재작업 중 새로 생성하거나 변경한 Figma node/variable/style/component ID: 없음
- 오류 원문: `You've reached the Figma MCP tool call limit on the Starter plan. Upgrade your plan for more tool calls: https://www.figma.com/files/team/1298479221859166708/all-projects?upgrade=mcp_rate_limit_paywall`
- 재개 조건: Product Owner가 한도 갱신 또는 업그레이드를 확인한 뒤 같은 Task에서 읽기 전용 rehydrate부터 재개

## Design Lead Agent 인계

### 완료된 범위

- WP-R1 로컬 Gallery 결함 수정 완료
  - 누락 앱 상태 9개 추가
  - 고유 앱 상태 23개 확인
  - 앱 캡처 카드 30개, Components 카드 2개, 총 32개 확인
  - Light·Dark Components Gallery 높이 1,900px 적용 및 잘림 해소
  - Chrome headless 1470×13000 시각 검증 통과
- WP-R2 Phase 0 일부 완료
  - Figma Page `0:1`, Gallery `59:2`, Cover `57:2` 확인
  - 기존 variable collection, variable, style, component가 모두 0개임을 확인
  - Code Connect 없음 확인
  - 접근 가능한 라이브러리 목록 확인

### 미완료 범위

- WP-R2 state rehydrate와 최종 gap 고정
- WP-R3 Light Foundation 생성·검증
- WP-R4 Light 공통 컴포넌트 7종 생성·검증
- WP-R5 수정 Gallery Figma 반영과 통합 QA
- WP-R6 조건부 Dark 확장
- Design QA 독립 재검증

### 재개 절차

1. Product Owner에게 Figma Starter MCP 한도 갱신 또는 요금제 업그레이드 여부를 확인한다.
2. 확인 전에는 Figma MCP를 호출하지 않는다.
3. 한도가 복구되면 Task를 UI/UX Design Agent에 재라우팅하고 `blocked -> approved`로 전환한다.
4. UI/UX Design Agent가 lock을 획득한 뒤 Figma 파일을 읽기 전용으로 rehydrate한다.
5. 기존 `59:2`, `57:2`와 빈 네이티브 디자인 시스템 상태를 재확인하고 WP-R2 중단 지점부터 진행한다.
6. 정상 산출물을 삭제하거나 처음부터 다시 만들지 않는다.

### 리드 결정 필요 사항

- 한도 갱신 확인 시점
- UI/UX Design Agent 재라우팅 승인
- Light 완료 후 호출 여유에 따른 Dark 진입 여부
