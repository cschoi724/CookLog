# T-20260813-001 비공개 Figma Foundations·Home Visual Baseline 실행 보고서

## 현재 상태

- 이전 실행 산출물 상태: `verification_ready`
- 현재 Task 상태: `approved` (DQA-001·002 touch target 재작업 실행 대기)
- 공용 기준: `origin/develop@86aa81c`
- 실행 worktree: `task/T-20260813-001-figma-foundation-home-baseline`
- 보안: Figma URL·파일 키·조직·초대 대상 식별자는 이 보고서에 기록하지 않는다.

## 진행 기록

- Phase 0 Discovery에서 CookLog Legacy 기준을 확인했다. `390×844pt`, Light Home 선승인, 중앙 기록 CTA, 최근 레시피 2열, 단일 전체 요리책 텍스트 액션, 비챗봇 AI 도우미, Home 9개 상태와 Light/Dark·44pt·AX3 계약을 Foundation/Component 범위로 확정했다.
- 저장소의 기존 Figma 미러는 명시적으로 Legacy/Baseline이므로 사용하지 않는다. `design/prototype/`의 제품·표현·상태 계약을 새 CookLog 전용 비공개 Draft Figma의 입력으로 사용한다.
- Product Owner가 지정한 공간에 새 비공개 Draft를 생성했다. 공개 링크, 공유 설정, Community 게시, 외부 라이브러리 연결은 수행하지 않았다. 식별자는 저장소에 기록하지 않는다.
- Phase 1에서 CookLog 로컬 Primitive·Semantic Color(Light/Dark), Layout 변수(390×844, safe area, spacing, radius, touch target), Typography 및 Elevation styles를 생성했다. 외부 라이브러리는 연결되지 않은 상태임을 확인했다.
- Phase 2에서 Cover/Foundations/Components/Core Flow/States/Legacy/Archive 페이지 구조와 Foundation 보드를 구성했다.
- Phase 3에서 local variant component인 `CTA / Record`, `Card / Recipe`, `Helper / AI`, `Navigation / Tab Item`을 구성했다. Home은 이 컴포넌트 instance와 local variable mode만 사용한다.
- Phase 4에서 `Home / Content / 390×844 / Light` 신규 frame을 만들고 렌더로 확인했다. 흰 계열 캔버스, 워드마크·짧은 라벨, 중앙 토마토 CTA, 최근 레시피 2열, 단일 `전체 요리책 보기` 텍스트 액션, AI helper, 44pt 이상 CTA를 포함한다. CTA 내부의 중복 보조 카피는 숨기고, 탭의 레이블 override와 버터 옐로 burst token을 적용했다.
- 당시 다음 진행 조건은 Product Owner의 `Home Visual Baseline v1` 승인이었으며, 아래 승인 기록 이후 Home 나머지 8개 상태·Dark mode·QA 인계를 진행했다.

## First Visual Gate (Product Owner)

| 확인 항목 | 현재 frame에서 확인한 내용 | 상태 |
|---|---|---|
| 기준 크기 | `390×844pt`, Light mode | 준비 완료 |
| 시안 위계 | 상단 brand·yellow burst·pot doodle → 중앙 CTA → 2열 recent card → AI helper → tab bar | 준비 완료 |
| 단일 진입점 | 최근 레시피 헤더 오른쪽 `전체 요리책 보기` 한 곳만 존재 | 준비 완료 |
| 재사용성 | local variable mode 및 local component instance 사용 | 준비 완료 |
| 보안·원천 | 비공개 Draft, 외부 library/공개 링크/공개 게시 미사용 | 준비 완료 |
| 승인 결과 | Product Owner가 Home Visual Baseline v1으로 승인 | PASS |

## Product Owner Approval

- 2026-08-13: Product Owner가 `Home / Content / 390×844 / Light`를 **Home Visual Baseline v1**로 승인했다.
- 승인 이후 범위: 동일 구조·정보 위계를 보존한 Home 나머지 8개 상태와 Dark mode 9개 상태, Accessibility 검증, 독립 Design QA 인계.
- 보안: 승인 과정에서도 Figma URL·파일 키·조직·초대 대상 식별자는 기록하지 않는다.

## 완료한 Figma 범위

### Home 상태 frame

- `Home / Content / 390×844 / Light` 및 `Dark`
- `Home / Multiple drafts / 390×844 / Light` 및 `Dark`
- `Home / AI review ready / 390×844 / Light` 및 `Dark`
- `Home / Network error / 390×844 / Light` 및 `Dark`
- `Home / Record menu / 390×844 / Light` 및 `Dark`
- `Home / Delete confirm / 390×844 / Light` 및 `Dark`
- `Home / Empty / 390×844 / Light` 및 `Dark`
- `Home / Loading / 390×844 / Light` 및 `Dark`
- `Home / Error / 390×844 / Light` 및 `Dark`

### 개발·QA 보조 원천

- `Home / State contracts`: 9개 상태의 발생 조건, 다음 행동, 보존/복구 계약을 한 보드에 기록했다.
- `AX3 / Home Content / 390×844 / Light`, `AX3 / Home Network error / 390×844 / Light`, `AX3 / Home Delete confirm / 390×844 / Light`: 큰 글자에서 1열 카드, 오류·삭제 확인의 56pt 세로 행동을 확인하는 대표 위험 frame이다.
- 로컬 Variables·Styles·Components만 사용했다. CTA, Recipe card, AI helper, Tab item은 재사용 component instance로 배치했다.

## 자체 검증 결과

| 검증 | 결과 | 근거 |
|---|---|---|
| Product Owner 선시각 승인 | PASS | 2026-08-13에 `Home / Content / 390×844 / Light`를 Home Visual Baseline v1으로 승인받았다. |
| Home 상태 완결 | PASS | Light 9개·Dark 9개, 총 18개 Home frame과 상태 계약 9개를 확인했다. |
| 기준 size·이름 | PASS | 모든 Home frame은 `390×844`; 중복 frame 이름 0건이다. |
| 단일 전체 요리책 진입 | PASS | 각 Home frame에 최근 레시피 영역의 `전체 요리책 보기` 텍스트 액션 1개만 존재한다. |
| 조작 영역 | PASS | CTA instance `200×192`, tab item 4개 모두 `88×56`; AX3 retry/cancel/delete 행동은 각각 높이 `56pt`다. |
| Light/Dark token 적용 | PASS | semantic mode로 9개 Dark frame을 생성했고, Dark 대표 렌더에서 CTA·AI helper·카드·텍스트 token 적용을 재확인했다. |
| 색 외 상태 단서 | PASS | 상태 배너/카드에는 제목·아이콘·행동을 병기했고 Delete confirm에는 복구 불가 문구를 넣었다. |
| AX3 대표 위험 | PASS | Content·Network error·Delete confirm 3개 frame을 만들고 필수 행동의 44pt 이상 조건을 확인했다. |
| local-only 원천 | PASS | Figma 파일의 `libraries_added_to_file`는 0개이며 외부 Library, 공개 링크, Community 게시, 외부 자산을 사용하지 않았다. |
| component token audit | PASS | local component의 unbound solid fill/stroke 0건을 재검증했다. |

## 잔여 범위·리스크

- `375×667pt` 전체 설계는 이 Task의 완료 조건이 아니다. 실제 iOS 구현에서 가림·스크롤 도달 위험이 확인되면 후속 범위로 분리한다.
- Figma frame은 구현 계약과 시각 원천이다. 실제 VoiceOver, Dynamic Type, 네이티브 safe area와 데이터 보존 동작은 iOS 구현·QA 단계에서 독립 재검증해야 한다.
- Figma 공유 권한을 바꾸지 않았다. Design QA는 승인된 내부 Draft 접근 권한으로만 검증하며, 공개 링크를 만들거나 외부에 게시하면 안 된다.

## QA 인계 준비

- Task를 `verification_ready`로 전환하고 Design QA Agent / Verification Role에 인계한다.
- QA 기준과 재현 절차는 `.ai_project/qa/T-20260813-001_figma-foundations-home-visual-baseline-qa.md`에 기록한다.

## 재인계 확인 — 2026-08-13

- 기존 `BLOCKED` 사유였던 비공개 Draft read-only 입력과 원격 task branch 재현 경로는 Design Lead 확인 기록으로 해소됐다.
- UI/UX Design Agent가 동일 Draft를 다시 read-only로 대조했다. 외부 Library 연결 0개, Home frame 18개(Light 9·Dark 9), 전부 `390×844`, 중복 이름 0개, local component set 4개, 상태 계약 1개, AX3 대표 frame 3개가 유지된다.
- Task를 다시 `verification_ready`로 인계한다. Design QA는 같은 Draft의 비공개 read-only 입력을 받아 실제 구조·시각·token·접근성 계약을 독립 판정해야 한다.
- 기존 리스크는 유지한다. 일반 Home 오류·삭제 상태의 32~34pt action container가 실제 hit area인지와 Light `#FFF8E8` base가 승인된 흰 캔버스 기준을 충족하는지는 Design QA가 판정한다.

## 재작업 승인 — 2026-08-13

- Product Owner가 Design QA `FAIL`의 DQA-001·002 재작업을 승인했다.
- 실행 범위는 일반 Home Light/Dark Error의 retry와 Delete confirm의 cancel/delete를 각각 최소 `44×44pt` local action component/container로 수정하는 것으로 한정한다.
- `#FFF8E8` 배경, AX3 frame, 다른 Home 상태·시각 위계와 기존 PASS 범위는 변경하지 않는다.
- UI/UX Design Agent는 수정 후 네 action target을 직접 측정하고 이 보고서를 갱신한 뒤 Design QA에 재인계한다.

## Phase 0 Gap Analysis

| 영역 | Legacy/제품 기준 | 지정 비공개 Figma | 처리 |
|---|---|---|---|
| Foundations | 색·타이포·spacing·radius·elevation·semantic state 토큰 필요 | 대상 파일 미지정으로 조사 불가 | Figma local collection·mode·style을 먼저 조사한 뒤 생성 |
| Components | 기록 CTA, recipe card, 상태 라벨, AI helper, tab bar, text action 필요 | 대상 파일 미지정으로 조사 불가 | 외부 Library 없이 local component/variant로 구성 |
| Home baseline | 390×844 Light, 팝 키치 정보 위계·단일 전체 요리책 진입점 필요 | 대상 frame 미지정 | Foundation 완료 후 신규 frame으로 구성하고 Product Owner에게 승인 요청 |
| 보안 | 기존 Figma 미러는 Legacy, 외부 Library·공개 공유 금지 | 접근 대상 미확인 | 지정 파일 하나만 다루고 식별자는 보고서에 남기지 않음 |
