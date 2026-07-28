---
id: T-20260728-002
title: CookLog MVP UI/UX v1 설계와 Figma 버전 미러
status: verification_ready
type: feature
priority: P0
priority_reason: 승인된 디자인 원본이 없어 이후 UI 구현과 Visual QA의 기준을 먼저 만들어야 한다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: UI/UX Design Agent
target_role: Execution Role
required_capabilities:
  - ux_flow
  - ui_design
  - prototyping
  - design_handoff
depends_on: []
blocks:
  - T-20260728-003
  - T-20260728-009
  - T-20260728-011
parallel_group: ios-m8-and-foundations
allowed_paths:
  - design/
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - docs/PROJECT_DECISIONS.md
  - docs/PROJECT_CHANGELOG.md
  - .ai_project/source_of_truth.md
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_PRD_v2.md
  - docs/product/CookLog_MVP_SCOPE.md
  - docs/product/CookLog_USER_FLOW.md
  - docs/product/CookLog_WIREFRAME.md
  - apps/ios/docs/STATUS.md
created_by: Product Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-07-28
report_to: .ai_project/reports/T-20260728-002_create-figma-mvp-uiux-v1-report.md
qa_to: .ai_project/qa/T-20260728-002_create-figma-mvp-uiux-v1-qa.md
---

# CookLog Figma 프로젝트 생성과 MVP UI/UX v1 설계

## 목적

CookLog MVP 핵심 경험을 구현 가능한 UI/UX 기준으로 설계한다. `design/prototype/`을 공식 UI Source of Truth로 관리하고 Figma는 버전 스냅샷과 형상 보존용 미러로 점진적으로 동기화한다.

## 제안 범위

- 실행 가능한 로컬 UI Prototype과 디자인 구조 정리
- 새 CookLog Figma Design 파일 생성과 버전 미러 구조 정리
- 제품 원칙과 핵심 사용자 흐름에 맞는 UX 구조 확정
- 2~3개 시각 방향 후보 제안 후 Product Owner 선택 반영
- 색상, 타이포그래피, 간격, 모서리, 아이콘 등 Foundation 정의
- 공통 컴포넌트와 상태 정의
- Home, Cooking Log, AI Review, Recipe Detail, Audio Player 설계
- 빈 상태, 로딩, 녹음 중, 처리 중, 오류, 비활성 상태 설계
- iPhone 작은 화면, 다크 모드, Dynamic Type과 기본 접근성 고려
- 기록부터 오디오 가이드까지 핵심 프로토타입 연결
- 로컬 Source of Truth, Figma 미러 링크, 핸드오프 기준과 필요한 export를 저장소 문서에 등록

## 제외 범위

- SwiftUI 코드 구현
- 실제 Backend, STT, AI, TTS 연동
- Android 전용 화면
- PRD v2의 제품 범위 변경

## 확정 실행 범위

Design Lead Agent가 다음 기준으로 ownership과 의존성을 조율했으며, Product Owner가 2026-07-28 실행을 승인했다.

- 하나의 Design 실행 Task로 진행하고 UI/UX Design Agent가 로컬 UI 원본, Figma 미러, 프로토타입, 핸드오프를 함께 작성한다.
- `design/`과 지정된 제품 문서만 수정하며 iOS 구현 코드는 수정하지 않는다.
- iOS M8 안정화 및 기반 작업과 병렬 진행할 수 있다.
- `T-20260728-003`과 `T-20260728-009`는 이 Task가 완료될 때까지 시작할 수 없다.
- `design/prototype/`을 UI Source of Truth로 등록하고 Figma 링크는 버전 미러로 등록한다.
- 시각 방향 선택, 다크 모드 상세 범위, 앱 아이콘·로고 포함 여부는 초기 탐색 산출물 이후 Product Owner 선택 게이트로 처리한다.
- 위 선택 게이트는 UX 구조, 화면·상태 목록, Foundation 초안 작업을 시작하는 데에는 영향을 주지 않는다.

## 성공 기준

- 로컬 UI Source of Truth와 Figma 버전 미러가 저장소에 등록된다.
- 5개 MVP 화면과 주요 상태가 누락 없이 설계된다.
- 반복 UI가 재사용 가능한 컴포넌트와 일관된 토큰으로 관리된다.
- 핵심 사용자 흐름을 로컬 인터랙티브 Prototype으로 확인할 수 있다.
- iOS Agent가 별도 제품 해석 없이 구현 범위를 산정할 수 있는 핸드오프가 존재한다.
- Design QA Agent가 요구사항, 상태, 접근성, 핸드오프 검증을 통과시킨다.
- Product Owner가 최종 시각 방향과 UX를 승인한다.

## 사용자 결정 필요 항목

- 초기 시각 방향 후보 중 CookLog가 채택할 방향
- 라이트 모드만 우선할지, 라이트·다크 모드를 함께 확정할지
- 앱 아이콘과 브랜드 로고를 이번 v1 범위에 포함할지

## Coordination 메모

- UI/UX Design Agent가 로컬 UI 원본과 Figma 미러를 관리하고 Design QA Agent가 독립 검증한다.
- 현재 iOS 앱은 기능·상태 참고 자료이며 시각적 Source of Truth가 아니다.
- 승인된 로컬 UI 적용은 별도 iOS Task에서 수행한다.

## 실행 현황

- Figma 파일: [CookLog — MVP UI/UX v1](https://www.figma.com/design/tAvYn6TatLKb3SXDjkH1hn)
- Figma File Key: `tAvYn6TatLKb3SXDjkH1hn`
- 생성 위치: 젤리공방
- 과거 파일 완료 이력: 저장소·Figma·라이브러리 Discovery, Gap 분석, 방향 후보, 일부 Foundation
- 현재 파일: Product Owner가 새 빈 Design 파일 생성
- 확정: `A — Warm Kitchen Journal`, Light·Dark, 텍스트 워드마크
- 진행: Starter 제한에 맞춘 Light·Dark 별도 컬렉션, Primitives 1차 세트
- 저장소 핸드오프: `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`
- 로컬 재개 패키지: `design/figma-build/`
  - 디자인 시스템·화면 Source Manifest
  - Starter 제약 대응 3페이지 IA
  - 단계별 재개 Runbook과 새 세션 프롬프트
  - Foundation용 원자적 Plugin API 스크립트 9개
- 로컬 디자인 프로토타입: `design/prototype/`
  - Home, Cooking Log, AI Review, Recipe Detail, Audio Player
  - Light·Dark와 주요 상태
  - 기록 흐름과 다시 요리 흐름 인터랙션
  - URL 기반 화면·상태·테마 직접 검토
  - 전체 화면 비교 갤러리
  - Safari Light Home, Dark Audio Player, 전체 갤러리, 375×667 저장 오류, Dark 컴포넌트 상태 시각 검증
- 로컬 디자인 핸드오프: `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`
- Figma 미러 제한: 젤리공방 Starter의 Figma MCP 월간 호출 한도 도달
- Task 상태: 재작업과 통합 자체 검증 완료, Design QA 독립 재검증 대기

## Figma 미러 제한

- Figma의 파일 조회, `use_figma`, screenshot 호출이 모두 `INVALID_ARGUMENT`로 거부된다.
- `whoami` 기준 젤리공방 권한은 `Full / Starter`로 정상이다.
- 공식 Figma MCP 제한 문서상 Starter 플랜은 월간 호출 한도가 적용된다.
- 분당 제한 해제를 위해 충분한 간격을 두고 재시도했으나 동일하게 거부되어 월간 한도 차단으로 판정했다.
- 젤리공방의 기존 프로젝트를 삭제한 뒤 다시 조회했으나 동일한 Starter MCP 호출 한도 오류가 발생해 프로젝트 개수 제한과 무관함을 재확인했다.
- 새 파일에 `generate_figma_design`으로 Home 캡처를 시작했으나 동일한 Starter MCP 호출 한도 오류로 거부됐다.
- 공식 문서의 제외 도구 안내와 달리 현재 Codex–Figma 연결에서는 `generate_figma_design`도 차단됐다.
- 새 Figma 파일에는 아직 로컬 화면을 동기화하지 못했다.
- 월간 한도 갱신 전에는 Figma 컴포넌트와 캔버스 Prototype을 갱신할 수 없다.
- 로컬 UI Source of Truth와 Design QA는 계속 진행할 수 있으며 Figma 미러 제한은 Task 전체 차단으로 취급하지 않는다.

## 재작업 업무 분담

Design Lead Agent가 Design QA의 6개 결함을 아래 순차 작업 패키지로 재조율했다. 동일한 로컬 Prototype 파일을 함께 수정하므로 한 UI/UX Design Agent가 `WP-1 -> WP-2 -> WP-3 -> 통합 자체 검증` 순서로 수행한다.

### Design Lead Agent — 범위·수용 기준 관리

- QA 결함 6건과 재작업 수용 기준의 추적 관계를 유지한다.
- 재작업 범위를 MVP UI Source of Truth와 핸드오프 보완으로 제한한다.
- UI/UX 실행 결과와 독립 Design QA 결과가 일치할 때만 완료 검토한다.

### UI/UX Design Agent — WP-1 핵심 흐름과 인터랙션

대상 결함:

- `DQA-HIGH-001`
- `DQA-MEDIUM-001`

주요 작업:

- 앱 내부 조작만으로 `Home -> Recording -> Processing -> STEP 추가 -> 기록 반복 -> AI 정리 -> 검토 -> Saving -> Detail -> Audio Player` 흐름을 완주하게 한다.
- STEP 누적 상태에 반복 녹음 행동을 추가한다.
- Processing 자동 완료 또는 명시적 완료 전환을 제공한다.
- 저장 행동이 `Saving`을 거치도록 하고 Audio Player의 `현재 단계 다시 듣기`, 이전, 다음, 비활성 상태에 피드백을 제공한다.

주요 경로:

- `design/prototype/app.js`
- `design/prototype/index.html`

### UI/UX Design Agent — WP-2 접근성 Foundation과 작은 화면

대상 결함:

- `DQA-HIGH-002`
- `DQA-MEDIUM-002`

주요 작업:

- 일반 텍스트 4.5:1, 큰 텍스트 3:1 이상을 만족하도록 Primary CTA, 오렌지 소형 텍스트, 성공·오류 토큰을 수정한다.
- Light·Dark에서 변경된 토큰을 함께 검증하고 핸드오프 값과 일치시킨다.
- 390×844와 375×667을 축소가 아닌 실제 레이아웃 프레임으로 제공한다.
- 작은 화면에서 CTA, 본문, 상태 메시지의 줄바꿈·스크롤·고정 영역을 확인한다.

주요 경로:

- `design/prototype/styles.css`
- `design/prototype/gallery.html`
- `design/figma-build/manifest.json`
- `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`

### UI/UX Design Agent — WP-3 상태·컴포넌트·핸드오프 완결성

대상 결함:

- `DQA-HIGH-003`
- `DQA-MEDIUM-003`

주요 작업:

- AI Review `Save Error`와 재시도 또는 복구 행동을 추가해 Manifest의 23개 화면 상태와 Prototype을 일치시킨다.
- Form Field `Error`·`Disabled`, Recipe Card `Pressed`, Status Banner `Info`, Button과 Player Control 상태를 시각 예시 또는 구현 가능한 상태별 속성으로 정의한다.
- 재료 추가·삭제처럼 조작 가능하게 보이는 컨트롤의 실제 상태 변화 또는 비활성 표현을 명확히 한다.
- Prototype, Manifest, 핸드오프의 명칭·토큰·상태 수를 최종 대조한다.

주요 경로:

- `design/prototype/app.js`
- `design/prototype/styles.css`
- `design/figma-build/manifest.json`
- `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`

### Design QA Agent — 독립 재검증

- UI/UX Design Agent가 통합 자체 검증과 실행 보고를 완료해 `verification_ready`로 인계한 뒤에만 시작한다.
- 기존 QA 보고서의 6개 결함과 재작업 수용 기준 전체를 동일한 Source of Truth로 재검증한다.
- Figma 부분 미러는 기존 승인대로 비차단 제약으로 유지한다.

## 재작업 실행 게이트

- Design Lead의 재조율과 Product Owner 승인을 완료했다.
- UI/UX Design Agent가 `WP-1 -> WP-2 -> WP-3 -> 통합 자체 검증`을 완료하고 lock을 해제해 `verification_ready`로 인계했다.
- `T-20260728-003`, `T-20260728-009`, `T-20260728-011`의 차단은 Design QA 재검증 통과와 완료 확정 전까지 유지한다.

## 재작업 실행 결과

- `DQA-HIGH-001`: Processing 자동 완료와 명시적 완료 행동, STEP 누적 후 `10초 더 기록` 행동을 추가해 앱 내부 핵심 기록 흐름을 연결했다.
- `DQA-HIGH-002`: Light·Dark Primary, Accent, Success, Error 토큰을 교체하고 일반 텍스트 대비를 모두 4.5:1 이상으로 검증했다.
- `DQA-HIGH-003`: AI Review `Save Error`와 내용 보존 후 재시도 행동을 추가해 Manifest와 Prototype을 23개 상태로 일치시켰다.
- `DQA-MEDIUM-001`: 저장 시 `Saving`을 거치도록 하고 Player의 이전·다음·다시 듣기 행동에 `aria-live` 피드백을 추가했다.
- `DQA-MEDIUM-002`: 390×844와 375×667을 별도 실제 레이아웃으로 제공하고 작은 화면 갤러리를 추가했다.
- `DQA-MEDIUM-003`: 공통 컴포넌트 상태 갤러리와 상태별 핸드오프를 추가하고 재료 추가·삭제를 실제 상태 변화로 연결했다.

## 상태 전이 기록

- 2026-07-28: Design Lead Agent가 ownership, 실행 경로, 의존성과 병렬 가능성을 확인하고 `proposed -> scoped`로 조율했다.
- 2026-07-28: Product Owner가 실행을 승인해 `scoped -> approved`로 전환하고 UI/UX Design Agent에 라우팅했다.
- 2026-07-28: UI/UX Design Agent가 실행 lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-07-28: 젤리공방에 Figma 파일을 생성하고 3개 시각 방향 후보를 구성해 Product Owner 선택 게이트로 전환했다.
- 2026-07-28: Product Owner가 추천안인 Warm Kitchen Journal, Light·Dark, 텍스트 워드마크를 확정했다.
- 2026-07-28: Starter 플랜 유지 결정에 따라 Light·Dark 별도 컬렉션 구조를 적용했다.
- 2026-07-28: Figma MCP 월간 호출 한도 도달로 후속 캔버스 작업이 불가능해 lock을 해제하고 `in_progress -> blocked`로 전환했다.
- 2026-07-28: 한도 갱신 후 즉시 재개할 수 있도록 `design/figma-build/` 로컬 패키지와 Foundation 실행 스크립트를 준비하고 문법을 검증했다.
- 2026-07-28: Figma와 독립적으로 UI/UX를 검토할 수 있는 `design/prototype/` 로컬 인터랙티브 디자인을 만들고 Light Home과 Dark Audio Player를 시각 검증했다.
- 2026-07-28: Product Owner가 `design/prototype/`을 공식 UI Source of Truth, Figma를 점진적 버전 미러로 승인했다.
- 2026-07-28: Figma 제한을 Task 전체 차단에서 미러 동기화 제한으로 재분류하고 lock을 재획득해 `blocked -> in_progress`로 전환했다.
- 2026-07-28: 5개 MVP 화면, Light·Dark, 주요 상태, 핵심 흐름, 비교 갤러리와 핸드오프를 완료하고 lock을 해제해 `in_progress -> verification_ready`로 전환했다.
- 2026-07-28: Design QA Agent가 검증 lock을 획득하고 `verification_ready -> verification_in_progress`로 전환했다.
- 2026-07-28: 핵심 기록 반복 흐름 중단, WCAG AA 대비 미달, 저장 오류 상태 누락과 핸드오프 불완전을 확인해 lock을 해제하고 `verification_in_progress -> rework_requested`로 전환했다.
- 2026-07-28: Design Lead Agent가 QA 결함 6건을 핵심 흐름, 접근성·작은 화면, 상태·핸드오프의 3개 순차 작업 패키지로 나누고 `rework_requested -> scoped`로 전환했다.
- 2026-07-28: Product Owner가 재작업 범위를 승인해 `scoped -> approved`로 전환하고 UI/UX Design Agent에 다시 라우팅했다.
- 2026-07-28: UI/UX Design Agent가 재작업 lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-07-28: UI/UX Design Agent가 QA 결함 6건의 재작업과 통합 자체 검증을 완료하고 lock을 해제해 `in_progress -> verification_ready`로 전환했다.
