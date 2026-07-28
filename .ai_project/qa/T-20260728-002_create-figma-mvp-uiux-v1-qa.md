# T-20260728-002 Design QA 재검증 보고서

작성일: 2026-07-28
작성자: Design QA Agent
대상 Task: `T-20260728-002`
판정: `rework_requested`

## 1. 재검증 요약

기존 결함 6건 중 4건은 해소됐고 2건은 부분 해소에 그쳐 통과하지 못했다. 재작업 과정에서 Cooking Log 첫 Processing의 STEP 번호가 잘못 표시되는 보통 심각도 결함 1건도 추가 확인했다.

- 해소: `DQA-HIGH-001`, `DQA-MEDIUM-001`, `DQA-MEDIUM-002`, `DQA-MEDIUM-003`
- 미해소: `DQA-HIGH-002`
- 부분 해소·미통과: `DQA-HIGH-003`
- 신규 결함: `DQA-MEDIUM-004`
- 최종 판정: 재작업 요청
- `verification_passed` 인계: 수행하지 않음
- Task 완료 전환: 수행하지 않음

## 2. 검증 대상

- `design/prototype/`
- `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`
- `design/figma-build/`
- `.ai_project/reports/T-20260728-002_create-figma-mvp-uiux-v1-report.md`

Figma Starter 호출 한도에 따른 부분 미러는 기존 결정대로 비차단 제약으로 취급했다. 독립 판정은 로컬 UI Source of Truth를 기준으로 수행했다.

## 3. 결함별 재검증 결과

| 결함 | 결과 | 재검증 근거 |
|---|---|---|
| `DQA-HIGH-001` 핵심 기록 흐름 중단 | 해소 | Processing이 1.6초 뒤 STEP Added로 전환되고, 즉시 완료 버튼과 `10초 더 기록`, `AI 정리하기`가 연결됨 |
| `DQA-HIGH-002` WCAG AA 대비 미달 | 미해소 | 주요 CTA 대비는 개선됐으나 STEP 번호·STEP 칩의 실제 색상 조합이 Light `4.21:1`, Dark `4.25:1`로 4.5:1 미달 |
| `DQA-HIGH-003` Save Error 누락 | 부분 해소·미통과 | Save Error와 재시도 UI는 추가됐지만 제목·조리 순서·시간·메모 수정값이 상태 전환 시 보존되지 않음 |
| `DQA-MEDIUM-001` 저장·다시 듣기 불완전 | 해소 | 저장은 Saving을 거쳐 Detail로 이동하고, 다시 듣기·이전·다음에 상태 및 `aria-live` 피드백이 있음 |
| `DQA-MEDIUM-002` 작은 iPhone 프레임 부재 | 해소 | 375×667 실제 기기 변수와 전용 레이아웃, 5개 작은 화면 갤러리가 추가됨 |
| `DQA-MEDIUM-003` 컴포넌트 상태 부족 | 해소 | Light·Dark 컴포넌트 갤러리와 Button, Banner, Form Field, Recipe Card, Player 상태가 추가됨 |

## 4. 남은 결함

### DQA-HIGH-002 — STEP 텍스트 대비 미달

- 위치:
  - Cooking Log STEP 번호
  - Recipe Detail 조리 순서 번호
  - Audio Player `STEP n / total` 칩
- 심각도: 높음
- 재현:
  1. Light에서 `?screen=log&state=steps` 또는 `?screen=player&state=paused`를 연다.
  2. STEP 번호 또는 STEP 칩의 전경·배경 토큰을 확인한다.
  3. Dark로 전환해 같은 조합을 확인한다.
- 실제 조합:
  - Light: `#C93610` / `#FFE1CF` = `4.21:1`
  - Dark: `#FF9A7A` / `#5C4638` = `4.25:1`
- 기대 결과:
  - 12~13px STEP 텍스트는 일반 텍스트 기준인 `4.5:1` 이상이어야 한다.
- 실제 결과:
  - 핸드오프가 검증한 Accent/Base 조합은 통과하지만, 실제 STEP 컴포넌트가 사용하는 Accent/Accent Muted 조합은 통과하지 못한다.
- 영향:
  - 기존 접근성 결함이 일부 실제 컴포넌트에 남아 있어 Foundation 전체를 승인할 수 없다.
- 근거:
  - `design/prototype/styles.css`의 `--bg-accent`, `--bg-accent-muted`, `.step-number`, `.step-chip`

### DQA-HIGH-003 — Save Error에서 편집값 미보존

- 위치: AI Review `Editable → Save Error`
- 심각도: 높음
- 재현:
  1. `?screen=review&state=editable`을 연다.
  2. 제목, 조리 순서, 예상 시간 또는 메모를 기본값과 다르게 수정한다.
  3. 상태 패널에서 `저장 오류`를 선택한다.
  4. 같은 입력 필드의 값을 확인한다.
- 기대 결과:
  - 저장 오류 상태에서도 사용자가 수정한 모든 값이 유지되어야 한다.
- 실제 결과:
  - 제목, 조리 순서, 예상 시간, 메모가 하드코딩된 기본값으로 다시 렌더링된다.
  - 입력값을 draft 상태에 반영하는 `input` 또는 `change` 처리 로직이 없고, 상태 전환 때 `app.innerHTML`이 다시 생성된다.
  - 재료 배열의 추가·삭제만 별도 상태로 유지된다.
- 영향:
  - 화면은 “수정한 내용은 그대로 유지됩니다”라고 안내하지만 실제 동작과 일치하지 않는다.
- 근거:
  - `design/prototype/app.js`의 `reviewForm()`, `render()`, 전역 클릭 처리

### DQA-MEDIUM-004 — 첫 Processing의 STEP 번호 오류

- 위치: 첫 Cooking Log `Recording → Processing`
- 심각도: 보통
- 재현:
  1. Home에서 `10초 요리 기록 시작`을 누른다.
  2. 빈 Cooking Log에서 `10초 기록 시작`을 누른다.
  3. `기록 완료`를 눌러 첫 Processing에 진입한다.
- 기대 결과:
  - 완료된 STEP이 없는 상태이므로 처리 중인 항목만 `STEP 1`로 표시되어야 한다.
- 실제 결과:
  - 샘플 문구가 완료된 `STEP 1`로 먼저 표시되고, 처리 중 항목은 `STEP 2`로 표시된다.
  - Processing 완료 후에는 다시 STEP 1개로 줄어든다.
- 원인:
  - `stepRows(true)`가 기존 기록 수가 0이어도 `count`를 1로 올려 완료 행을 만든 다음 pending 번호에 `count + 1`을 사용한다.
- 영향:
  - 첫 기록 처리 중 단계 수와 완료 여부가 실제 상태와 다르게 보인다.
- 근거:
  - `design/prototype/app.js`의 `stepRows()`

## 5. 통과한 검증

- `node --check design/prototype/app.js`
- Figma Plugin API 스크립트 9개 `AsyncFunction` 파싱
- `jq empty design/figma-build/manifest.json design/figma-build/state.json`
- Manifest 화면 상태 합계 23개와 Prototype 상태 합계 23개 일치
- 로컬 HTTP:
  - `index.html`: `200 OK`
  - `gallery.html`: `200 OK`
  - `components.html`: `200 OK`
- 390×844, 375×667 실제 CSS 프레임 정의 확인
- Safari에서 375×667 AI Review Save Error 렌더링 확인
- Primary CTA와 Success·Error Banner 등 문서에 명시된 7개 대비 조합 통과
- `git diff --check` 통과

증거 스크린샷:

- `/private/tmp/cooklog-design-qa-retest-small-save-error.png`

## 6. 재작업 수용 기준

- STEP 번호와 STEP 칩의 Light·Dark 실제 전경/배경 조합을 모두 `4.5:1` 이상으로 조정하고 핸드오프 대비 표에 포함한다.
- AI Review의 제목, 재료 이름·양, 조리 순서, 예상 시간, 메모를 draft 상태로 관리해 Editable, Saving, Save Error 사이에서 수정값을 보존한다.
- 첫 Processing에서는 기존 완료 STEP 0개와 처리 중 STEP 1개가 정확히 표시되고, 두 번째 기록부터 기존 STEP 뒤에 pending STEP이 추가되어야 한다.
- 위 세 항목 수정 후 기존 6개 결함과 신규 `DQA-MEDIUM-004`를 동일 절차로 다시 검증한다.

## 7. 최종 판정

재작업 요청.

주요 구조와 4개 결함은 해소됐지만 접근성 대비, 저장 실패 시 데이터 보존, 첫 Processing 상태 정확성이 아직 성공 기준을 충족하지 못한다. 수정본을 `verification_ready`로 다시 인계해야 한다.
