# T-20260812-002 Product QA 독립 검증 보고서

작성일: 2026-08-12
작성자: Product QA Agent / Verification Role
대상 Task: `T-20260812-002`
최종 판정: `FAIL`
최종 상태 인계: `verification_in_progress -> rework_requested`

## 1. 검증 기준

- 공용 상태 ref: `origin/develop`
- 공용 상태 SHA: `c26c7820199c834df6fb239b0530de0dc29fb540`
- 검증 worktree: `/private/tmp/cooklog-t20260812-002-product-qa`
- 검증 branch: `task/T-20260812-002-product-qa`
- 검증 시작 HEAD: `c26c7820199c834df6fb239b0530de0dc29fb540`
- 실행 산출물 commit: `c26c7820199c834df6fb239b0530de0dc29fb540`
- 실행 보고서: `.ai_project/reports/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions-report.md`
- 검증 대상: `docs/product/CookLog_POP_KITSCH_UX_PLAN.md`

기준 문서는 Task의 `source_of_truth` 전체와 공식 Prototype의 82개 상태 계약을 사용했다.

## 2. 성공 기준별 결과

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| 핵심 제품 정의와 사용자 여정 | 통과 | 10초 기록 → STEP Preview → AI 정리 → 검토·저장 → 다시 요리 흐름과 AI 비창작 원칙이 PRD와 정렬된다. |
| 화면별 정보 구조와 첫 행동 | 통과 | Home, Library, Cooking Log, AI Review, Recipe Detail, Audio Guide, App Info의 역할·콘텐츠 순서·주/보조 CTA가 제시됐다. |
| 승인 없는 기능 확장 금지 | 통과 | 추천 피드·식단 계획·AI 채팅을 추가하지 않았고 영감 기능을 후속 Product 후보로 분리했다. |
| T-004 보존과 T-008 분리 | 통과 | T-008을 중단하지 않고 Home 변경 후보를 별도 micro-rework와 Product Owner 결정으로 분리했다. |
| 변경 경로와 정적 검증 | 통과 | 실행 commit의 5개 변경 파일이 모두 `allowed_paths` 안에 있고 `git diff --check`, Task strict validation이 통과했다. |
| 기존 기능·상태·데이터 계약 결정표 | **실패** | 공식 Prototype의 82개 상태·복구·보존 계약 중 다수가 26개 상위 수준 행에 포함되지 않으며, 각 행의 명시적 근거도 없다. |
| 두 viewport의 화면별 레이아웃·상호작용 | **실패** | `375×667pt`의 구체적 재배치 규칙은 Home 카드에만 있으며 Library부터 App Info까지 6개 화면의 작은 화면 규칙이 없다. |
| Design Lead의 무모순 handoff | **실패** | Home `전체 보기`가 헤더와 최근 카드 영역에 동시에 배치된 기준안과 결정 대기안으로 남아 적용 기준이 모호하다. |

## 3. 필수 재작업

### PQA-HIGH-812002-001: 기존 기능·상태·데이터 계약 결정표가 승인 범위를 충족하지 못함

- 심각도: 높음
- 분류: Product contract inventory / Design handoff completeness

근거:

- Task는 현재 기능·상태·데이터 계약을 화면별로 목록화하고 각 항목을 결정 분류하도록 요구한다.
- 공식 Prototype은 Home 9, Library 5, Cooking Log 14, AI Review 12, Recipe Detail 7, Audio Player 24, App Info 11의 총 82개 상태와 복구·보존 계약을 갖는다.
- UX 계획의 결정표는 26개 상위 기능 행만 제공하며 `근거` 열이 없다.
- 아래 계약은 일반적인 “유지” 문장만으로는 Design scope와 회귀 기준을 판별할 수 없거나 결정표에서 누락됐다.
  - 첫 기록·첫 Review·첫 핸즈프리의 1회 맥락 안내
  - Home 진행 기록 영구 삭제 확인과 상태별 routing
  - 기기 내 STT 1회 재처리·원격 fallback 금지·기존 STEP 보존
  - AI 처리 snapshot 잠금, 10초 경과, 백그라운드 결과 복구, 중복 Review 방지
  - AI Review STEP 추가·삭제·되돌리기·재배열, 미저장 이탈과 저장 실패 값 보존
  - 완료 레시피의 AI 재호출 없는 수정과 복구 불가 삭제
  - Player 무자동재생·마지막 단계·속도 지속·오디오/Bluetooth/백그라운드 중단과 수동 재개
  - App Info 진단정보 명시 선택, 법적 URL·메일 앱 실패와 데이터 유실 경계

영향:

- Design Lead가 T-005~007을 재-scope할 때 어떤 상태를 구조 변경 대상으로 삼고 어떤 데이터·복구 계약을 보존해야 하는지 이 문서만으로 추적할 수 없다.
- 생략된 상태가 “변경 없음”인지 “검토 누락”인지 구분되지 않아 82개 상태 회귀가 통합 QA 단계까지 늦게 발견될 수 있다.
- 실행 보고서의 “기존 기능·상태·데이터 계약 결정표 완료” 주장을 독립적으로 확인할 수 없다.

필수 조치:

1. 화면별 결정표 또는 연결된 상태 계약 매트릭스에 82개 상태를 추적 가능한 단위로 포함한다.
2. 각 항목에 결정, 근거, 영향 화면, routing·기능·데이터 보존 영향, 오류 회복, Product Owner 결정 필요 여부를 기록한다.
3. 여러 상태를 하나의 행으로 묶는 경우 포함 상태 ID와 동일 결정이 가능한 근거를 명시한다.
4. 위 누락 예시와 PRD·Prototype README의 나머지 상태를 전체 대조한 뒤 재검증을 요청한다.

### PQA-HIGH-812002-002: Home 외 화면의 375×667pt 레이아웃·상호작용 원칙이 없음

- 심각도: 높음
- 분류: Acceptance criteria / Responsive UX

근거:

- Task 성공 기준은 `390×844pt·375×667pt`에서 화면별 콘텐츠 블록·레이아웃·CTA·상호작용 원칙을 요구한다.
- UX 계획은 전체 화면이 작은 화면을 지킨다는 전역 선언과 Home 카드의 2열→1열 전환만 명시한다.
- Library, Cooking Log, AI Review, Recipe Detail, Audio Guide, App Info에는 `375×667pt`의 재배치·스크롤·고정 CTA·키보드·긴 텍스트·컨트롤 충돌 처리 기준이 없다.

영향:

- T-005·006이 작은 화면에서 하단 고정 CTA와 콘텐츠, AI Review 키보드, Player 컨트롤, App Info 긴 법적 문구를 어떻게 배치해야 하는지 결정할 수 없다.
- 작은 화면 계약을 Design QA에만 미루게 되어 이 Task의 저충실도 UX 기획 성공 기준이 충족되지 않는다.

필수 조치:

1. 7개 화면 각각에 390×844 기준과 375×667 재배치 차이를 명시한다.
2. 작은 화면의 블록 순서, 1열/다단 전환, 스크롤 도달성, safe-area 고정 CTA, 키보드 회피, Dynamic Type 시 우선순위를 기록한다.
3. Player 4개 주 컨트롤과 보조 도구, Review 하단 저장 영역, Log 녹음 CTA가 콘텐츠를 가리지 않는 기준을 포함한다.

### PQA-MEDIUM-812002-003: Home `전체 보기` 위치의 기준안과 결정 대기안이 충돌함

- 심각도: 중간
- 분류: Internal consistency / Product decision gate

근거:

- 기능 결정표는 `전체 보기`를 헤더가 아닌 최근 카드 영역의 텍스트 액션으로 우선 노출한다고 적는다.
- Home 레이아웃 명세는 상단과 최근 카드 영역 양쪽에 `전체 요리책`을 배치한다.
- Product Owner 결정표는 기존 헤더 아이콘 유지도 가능하다고 적어, 결정 전 기준이 단일하지 않다.

영향:

- T-008 이후 micro-rework와 T-005~007 인계 시 중복 진입점이 기본안인지 임시안인지 해석이 달라질 수 있다.

필수 조치:

1. 결정 전 보존 baseline과 권장 변경 후보를 분리한다.
2. Product Owner 결정 전에는 어느 위치 하나만 적용 기준인지, 둘 다 유지하는 경우 그 이유를 명시한다.
3. 결정 결과가 T-008 후속 micro-rework 필요 여부와 어떻게 연결되는지 기록한다.

## 4. 통과 항목과 독립 검증 증거

- `aiops validate task ... --strict`: PASS
- 실행 commit 변경 경로: Task, Project Board, Product Board, 실행 보고서, UX 계획의 5개 허용 파일만 변경
- `git diff --check 5cd5c22..c26c782`: PASS
- Task source of truth와 참고 이미지·실행 보고서 존재: PASS
- 정보 구조 한 장: PASS
- 10초 기록·STEP 원문·AI 비창작·임시 저장·완료 수정/삭제·버튼 Audio Guide·명시적 핸즈프리 시작: 상위 원칙 보존
- 추천·AI 채팅·클라우드 동기화·Import/OCR의 무단 신규 구현 지시: 0건
- Prototype·iOS·Backend 직접 변경: 0건
- T-008 자동 중단·범위 변경: 0건

## 5. 판정

`FAIL`.

핵심 제품 방향, 사용자 여정, 기능 확장 금지, T-008 분리와 허용 경로는 통과했다. 그러나 기존 기능·상태·데이터 계약의 결정표와 두 viewport의 화면별 UX 명세가 Task 성공 기준에 미달한다. 이 문서를 그대로 T-005~007 재-scope 기준으로 사용하면 누락 상태와 작은 화면 배치가 후속 Design 실행에서 임의 해석될 위험이 있어 재작업이 필요하다.

다음 Agent에게 전달할 말:

너는 Product Lead Agent / Lead Role이야.
Task `T-20260812-002`의 재작업 범위를 조율해줘.

- 현재 상태: `rework_requested`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `c26c7820199c834df6fb239b0530de0dc29fb540`
- 다음에 해야 할 일: `PQA-HIGH-812002-001~002`, `PQA-MEDIUM-812002-003`에 따라 기존 82개 상태·데이터/복구 계약의 추적 가능한 결정표, 7개 화면의 390×844·375×667 레이아웃 차이, Home 전체 보기의 단일 baseline을 보완해줘.
- 기준 문서: Task의 `source_of_truth`, `design/prototype/README.md`, `docs/product/CookLog_PRD_v2.md`, `docs/product/CookLog_USER_FLOW.md`
- 허용 경로: Task의 `allowed_paths`
- 참고 산출물: `.ai_project/reports/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions-report.md`, `.ai_project/qa/T-20260812-002_replan-pop-kitsch-ux-structure-and-core-functions-qa.md`
- 변경/검토 대상: `docs/product/CookLog_POP_KITSCH_UX_PLAN.md`, Task와 Product/Project Board
- 남은 리스크: T-008은 계속 별도 승인 범위에서 진행하며 자동 중단하지 않는다. T-005~007은 이 Task의 재작업과 재검증 완료 전 재-scope 기준을 확정하지 않는다.
- 차단/결정 필요: Home 최근 섹션명·전체 보기 위치·사용자 노출 카피는 Product Owner 결정값으로 유지한다.
- 재개 가능 시: 재작업 범위를 `scoped` 또는 `approved`로 전환할지 사용자 승인 기준으로 판단해줘.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
