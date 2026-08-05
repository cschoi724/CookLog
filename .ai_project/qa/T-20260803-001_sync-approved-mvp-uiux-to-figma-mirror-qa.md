# T-20260803-001 Design QA 독립 검증 보고서

작성일: 2026-08-03
작성자: Design QA Agent
대상 Task: `T-20260803-001`
판정: `rework_requested`

## 1. 검증 요약

Figma Gallery `59:2`와 Cover/Handoff `57:2`가 실제 파일에 존재하고 주요 Light·Dark·작은 화면 및 메타데이터도 정상임을 확인했다. 그러나 Task 성공 기준의 전체 23개 앱 상태가 Figma 미러에 포함되지 않았고, Light·Dark Components Gallery가 고정 viewport에서 잘려 필수 컴포넌트 상태 일부를 시각적으로 확인할 수 없어 통과하지 못했다.

- 높은 심각도 결함: 2건
- 통과: Figma 노드 존재·명칭, Cover/Handoff, 주요 Light·Dark 화면, 375×667 화면, 주요 오류 상태
- 신규 Figma 변경: 수행하지 않음
- 최종 판정: `rework_requested`
- 다음 인계: Design Lead Agent의 재작업 범위 조율

## 2. 검증 대상

- Figma File Key: `tAvYn6TatLKb3SXDjkH1hn`
- Gallery: `59:2`
- Cover/Handoff: `57:2`
- `design/prototype/gallery.html`
- `design/prototype/components.html`
- `design/figma-build/manifest.json`
- `design/figma-build/state.json`
- `design/figma-build/RUNBOOK.md`
- `.ai_project/reports/T-20260803-001_sync-approved-mvp-uiux-to-figma-mirror-report.md`

## 3. 결함

### DQA-HIGH-001 — 23개 앱 상태 미러 미충족

- 위치: Figma Gallery `59:2`, 로컬 `design/prototype/gallery.html`
- 심각도: 높음
- 기대 결과:
  - Manifest와 Task 성공 기준에 정의된 Home 4개, Cooking Log 5개, AI Review 5개, Recipe Detail 4개, Audio Player 5개 상태가 모두 Figma 스냅샷에서 확인 가능해야 한다.
- 실제 결과:
  - Figma Gallery의 Article은 총 23개지만 구성은 앱 iframe 21개와 Components iframe 2개다.
  - 앱 iframe의 화면·상태 조합을 중복 제거하면 14개 상태만 존재한다.
  - `galleryFrameCount: 23`은 앱 상태 수가 아니라 전체 iframe 수다.
- 누락된 9개 상태:
  - `Home / Loading`
  - `Home / Error`
  - `Cooking Log / Empty`
  - `Cooking Log / Error`
  - `AI Review / Saving`
  - `Recipe Detail / Loading`
  - `Recipe Detail / Error`
  - `Audio Player / Loading`
  - `Audio Player / Error`
- 영향:
  - Figma 한 파일에서 전체 상태를 확인한다는 성공 기준을 충족하지 못하며 후속 iOS 디자인 정합성 QA의 예외 상태 기준이 누락된다.

### DQA-HIGH-002 — Components Gallery 하단 잘림

- 위치: Figma Gallery `59:2`의 `Light · Components`, `Dark · Components`
- 심각도: 높음
- 기대 결과:
  - Button, Status Banner, Form Field, Recipe Card, Player Controls 상태 전체를 Light·Dark에서 시각적으로 확인할 수 있어야 한다.
- 실제 결과:
  - 두 Components Article의 Body 높이는 각각 `844px`이고 `clipsContent=true`다.
  - Body 내부 `Main Content` 높이는 각각 약 `1882.16px`다.
  - Figma 미리보기에서는 Button과 Status Banner 일부까지만 보이고 Form Field, Recipe Card, Player Controls가 잘린다.
  - 해당 텍스트와 프레임은 Figma 구조 안에 존재하지만 스냅샷 viewport 밖에 있어 시각 산출물로 검토할 수 없다.
- 원인 근거:
  - `gallery.html`의 모든 일반 iframe은 높이 `844px`로 고정된다.
  - capture 평탄화 시 clone 높이를 `frame.clientHeight`로 고정하고 `.capture-frame`에 `overflow: hidden`을 적용한다.
- 영향:
  - Task에서 명시한 Components Gallery 보존과 잘림 검증 성공 기준을 충족하지 못한다.

## 4. 통과한 항목

- Gallery node `59:2` 존재
  - 이름: `CookLog / MVP UIUX v1 / Gallery / 2026-08-03`
  - 크기: `2560 × 7858`
  - Article 23개
- Cover/Handoff node `57:2` 존재
  - 이름: `CookLog / MVP UIUX v1 / Cover & Handoff / 2026-08-03`
  - 승인일, Run ID, Source of Truth, Manifest, Handoff 경로 표시
- Light Core Flow의 5개 MVP 화면 확인
- 375×667 작은 화면의 5개 MVP 화면 확인
- Dark Core Flow의 5개 MVP 화면 확인
- Critical States 6개 확인
- Light·Dark 테마 구분과 주요 화면 시각 렌더링 확인
- Figma Gallery 하위 텍스트 452개, Frame 1,056개 기록과 현재 구조가 일치
- `node --check design/prototype/app.js` 통과
- `jq empty design/figma-build/manifest.json design/figma-build/state.json` 통과
- `git diff --check` 통과

## 5. 재작업 수용 기준

- 누락된 앱 상태 9개를 Gallery에 추가해 Manifest의 23개 화면 상태를 모두 Figma 미러에서 식별할 수 있게 한다.
- 앱 상태 수와 전체 캡처 카드 수를 별도 필드로 기록해 `23개 상태`와 `23개 iframe`을 혼동하지 않게 한다.
- Components Gallery 캡처 높이를 실제 콘텐츠 높이에 맞추거나 섹션별로 분할해 5개 필수 컴포넌트가 Light·Dark 모두 잘림 없이 보이게 한다.
- 수정한 로컬 Gallery를 시각 검증한 뒤 Figma Gallery를 갱신하고 최종 node ID와 스크린샷을 state ledger에 기록한다.
- 기존 Cover/Handoff와 주요 Light·Dark·작은 화면에 회귀가 없는지 다시 확인한다.

## 6. 최종 판정

`rework_requested`.

Figma 업로드와 주요 화면 미러는 성공했지만 전체 상태 완전성과 Components Gallery 가시성이 Task 성공 기준에 미달한다. Design Lead Agent가 재작업 범위와 추가 Figma 호출 예산을 조율한 뒤 수정본을 다시 `verification_ready`로 인계해야 한다.
