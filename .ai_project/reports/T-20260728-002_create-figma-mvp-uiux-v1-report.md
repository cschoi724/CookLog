# T-20260728-002 실행 보고

작성일: 2026-07-28
작성자: UI/UX Design Agent
판정: `verification_ready`

## 완료한 작업

- 젤리공방의 현재 미러 파일: [CookLog — MVP UI/UX v1](https://www.figma.com/design/tAvYn6TatLKb3SXDjkH1hn)
- 저장소, 제품 문서, 기존 iOS 기능, Figma 라이브러리 Discovery
- 코드와 Figma Gap 분석
- `00 — Direction Gate`에 3개 시각 방향 후보 제작
- 후보 화면의 텍스트 겹침 수정과 스크린샷 재검증
- Product Owner 선택 반영
  - `A — Warm Kitchen Journal`
  - Light와 Dark 모두
  - 텍스트 워드마크만
- Starter 플랜 대응 구조 적용
  - `CookLog / Color Light`
  - `CookLog / Color Dark`
  - `CookLog / Primitives`
  - `CookLog / Dimension`
- Primitive 색상 8개 생성
- `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md` 작성
- `design/figma-build/` 로컬 재개 패키지 작성
  - 전체 디자인 Manifest
  - Starter 3페이지 구조와 재개 Runbook
  - 새 세션 재개 프롬프트
  - Foundation Plugin API 스크립트 9개
- `jq empty`, JavaScript 함수 파싱, `git diff --check` 통과
- `design/prototype/` 로컬 인터랙티브 디자인 작성
  - 5개 MVP 화면
  - Light/Dark
  - 주요 화면 상태
  - 기록과 재사용 흐름
  - URL 기반 직접 상태 링크
  - Light·Dark 핵심 흐름과 주요 예외 상태 비교 갤러리
- 로컬 HTTP 200, JavaScript 문법, Safari Light Home·Dark Audio Player·갤러리 렌더링 검증
- Figma 링크를 `.ai_project/source_of_truth.md`와 `design/README.md`에 등록

## Design QA 재작업 결과

- `DQA-HIGH-001`
  - Cooking Log Processing이 1.6초 뒤 자동 완료되며 명시적 `STEP 추가 완료 보기`도 제공한다.
  - STEP 누적 상태에서 `10초 더 기록`과 `AI 정리하기`를 선택할 수 있다.
- `DQA-HIGH-002`
  - Light Primary `#C93610`, Success `#176B4A`, Error `#B42318`로 교체했다.
  - Dark Primary `#FF9A7A`, Success `#7EE0B4`, Error `#FF8C84`와 대응 배경을 적용했다.
  - 검증한 일반 텍스트 조합은 `5.14:1`~`7.89:1`로 모두 WCAG AA 4.5:1 이상이다.
- `DQA-HIGH-003`
  - AI Review `Save Error`와 내용 보존 후 `저장 다시 시도` 행동을 추가했다.
  - Manifest와 Prototype 화면 상태를 총 23개로 일치시켰다.
- `DQA-MEDIUM-001`
  - 저장 행동이 `Saving`을 거쳐 Recipe Detail로 이동한다.
  - Audio Player 이전·다음·현재 단계 다시 듣기에 화면 상태와 `aria-live` 피드백을 제공한다.
- `DQA-MEDIUM-002`
  - 390×844와 375×667을 축소가 아닌 실제 프레임으로 제공한다.
  - 갤러리에 375×667의 5개 MVP 화면을 추가했다.
- `DQA-MEDIUM-003`
  - Button, Status Banner, Form Field, Recipe Card, Player Controls 상태 갤러리를 추가했다.
  - 재료 추가·삭제가 실제 Prototype 상태를 변경한다.

## 재작업 자체 검증

- `node --check design/prototype/app.js` 통과
- Figma Plugin API 스크립트 9개 AsyncFunction 파싱 통과
- `jq empty design/figma-build/manifest.json design/figma-build/state.json` 통과
- Manifest 화면 상태 합계 23개 확인
- 핵심 전이, 저장 오류, Player 피드백, 재료 변경, 작은 화면 계약 정적 검사 통과
- 접근성 색상 7쌍 대비 계산 통과: 최소 `5.14:1`
- 로컬 HTTP `index.html`, `gallery.html`, `components.html` 모두 `200`
- Safari에서 전체 갤러리, Dark 컴포넌트 상태, 375×667 AI Review 저장 오류를 시각 검증
- `git diff --check` 통과

Safari의 `Allow JavaScript from Apple Events`가 꺼져 있어 브라우저 자동 클릭 스크립트는 실행하지 못했다. 대신 상태 전이 계약 검사와 각 핵심 상태의 직접 URL 렌더링을 함께 확인했다.

## 전용 worktree 인계 검토 보완

Design QA 재검증에서 남은 2건과 신규 1건을 전용 worktree에서 추가 보완했다.

- `DQA-HIGH-002`
  - STEP 번호, Recipe Detail 순서 번호, Audio Player STEP 칩의 배경을 `bg/subtle`로 변경했다.
  - 실제 조합은 Light `#C93610 / #FAF3E7 = 4.74:1`, Dark `#FF9A7A / #222027 = 7.79:1`이다.
  - Manifest와 핸드오프의 검증 대비 표에 두 조합을 추가했다.
- `DQA-HIGH-003`
  - 제목, 재료 이름·양, 조리 순서, 예상 시간, 메모를 `reviewDraft`에 반영하는 input 처리를 추가했다.
  - 상태가 다시 렌더링되어도 `Editable`, `Saving`, `Save Error` 사이에서 편집값이 유지된다.
- `DQA-MEDIUM-004`
  - Processing 행 계산을 기존 완료 STEP 수와 pending STEP으로 분리했다.
  - 첫 기록은 pending STEP 1만, 반복 기록은 기존 STEP 뒤의 pending STEP을 표시한다.

추가 자체 검증:

- 첫 Processing의 pending STEP 1 단독 표시 계약 통과
- 제목·재료·조리 순서 수정 후 Save Error 렌더링 값 보존 계약 통과
- STEP 실제 대비 Light `4.74:1`, Dark `7.79:1` 통과
- `node --check`, JSON 파싱, Figma 스크립트 9개 파싱, 화면 상태 23개, `git diff --check` 통과

## Design QA 인계

- 공식 UI Source of Truth: `design/prototype/`
- 구현 핸드오프: `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`
- 디자인 Manifest와 Figma 재개 자료: `design/figma-build/`
- 독립 검증 요청: `.ai_project/qa/T-20260728-002_create-figma-mvp-uiux-v1-qa.md`
- 검증 초점: 기존 6개 결함과 `DQA-MEDIUM-004`, draft 보존, STEP 실제 대비, 23개 상태, Light·Dark, 375×667 실제 프레임, 핵심 흐름, 구현 가능성

## DQA-MEDIUM-005 재작업

- 핸드오프의 구현 우선순위를 다음으로 통일했다.
  1. `design/prototype/` — 공식 시각적 UI Source of Truth
  2. `design/figma-build/manifest.json` — 토큰·컴포넌트·상태 구조 기준
  3. Figma — 로컬 원본과 동기화된 버전 미러
- Figma가 미동기화 상태이거나 로컬 원본과 충돌하면 Prototype과 Manifest를 우선하도록 명시했다.
- 현재 Figma 화면을 iOS Agent의 최우선 구현 기준으로 사용하지 않도록 경고를 추가했다.
- 기존 “시각 값은 승인된 Figma를 우선” 문구를 제거하고 iOS 구현 인계 지침 전체를 위 우선순위와 일치시켰다.
- 핸드오프 상태를 `DQA-MEDIUM-005 재작업 완료·Design QA 독립 재검증 대기`로 갱신했다.
- 문서 전체 검색과 계약 검사에서 Figma 우선 문구가 남아 있지 않고 필수 우선순위·충돌 규칙·iOS 경고가 모두 존재함을 확인했다.
- `git diff --check`를 통과하고 Task를 `verification_ready`로 전환해 Design QA Agent에 독립 재검증을 요청했다.

## Figma 미러 제한

- 젤리공방은 `Full / Starter` 플랜이다.
- Figma MCP 호출이 월간 한도에 도달해 파일 조회와 쓰기가 모두 거부된다.
- 권한 문제와 분당 제한 가능성을 확인했으나 권한은 정상이고 충분한 간격 뒤에도 동일 오류가 지속됐다.
- 젤리공방 프로젝트 삭제 후 재시도에서도 동일 오류가 발생해 프로젝트 슬롯과 MCP 호출 한도가 별개임을 확인했다.
- Product Owner가 새 빈 Design 파일을 만든 뒤 `generate_figma_design` 캡처를 시도했으나 동일한 Starter MCP 호출 한도 오류로 거부됐다.
- 공식 문서상 제외 도구 안내와 달리 현재 Codex–Figma 연결에서는 해당 호출도 차단됐다.
- 공식 기준: <https://developers.figma.com/docs/figma-mcp-server/plans-access-and-permissions/>

이 제한은 로컬 UI Source of Truth 제작과 Design QA를 차단하지 않는다.

## Figma 동기화 재개 조건

다음 중 하나가 충족되면 같은 Task와 Figma 파일에서 재개한다.

1. Starter 플랜의 Figma MCP 월간 호출 한도 갱신
2. Product Owner가 Pro 플랜 파일로 이전 승인

재개 시 Foundation 나머지 토큰부터 이어서 만들고, 로컬 UI 원본의 커밋 시점과 대응되는 Figma 버전 설명을 남긴다.

구체적인 실행 순서는 `design/figma-build/RUNBOOK.md`를 따른다.
