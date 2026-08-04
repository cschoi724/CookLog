# T-20260729-014 독립 Design QA 보고서

작성일: 2026-08-04
검증자: Design QA Agent / Verification Role
판정: `FAIL`
Task 전이: `verification_ready -> rework_requested`
인계 대상: UI/UX Design Agent / Execution Role

## 1. 검증 대상

- 기준: `origin/develop@e4bab3a`
- 대상 커밋: `650b2c8`
- Prototype revision: `integrated-accessibility-handoff-20260804`
- Figma MCP: 호출하지 않음

## 2. 통과 항목

- Prototype·Manifest·README·HTML의 revision이 일치한다.
- Manifest의 7개 화면군, 82개 상태, 13개 컴포넌트 수가 Prototype 선언과 일치한다.
- 기록·재사용·완료 수정·삭제·검색·App Info·법적 문서·서비스 장애 흐름과 routing·데이터 보존 계약이 있다.
- Light/Dark Semantic Token, 390×844·375×667, 최소 44pt, WCAG AA 대비 기준과 Dynamic Type·VoiceOver·Reduce Motion 수용 기준이 문서화됐다.
- 실제 Chrome에서 Home Light, Cooking Log 375×667, Audio Player Dark 오류 상태가 렌더링됐다.
- `node --check design/prototype/app.js`, `jq empty design/figma-build/manifest.json`은 통과했다.
- 구 revision, 23개 상태, T-012~014 반영 대기 문구는 남아 있지 않다.

## 3. 필수 재작업

### DQA-HIGH-014-001 — 전체 화면·녹음 타이머 live region 반복 낭독

`design/prototype/index.html`의 앱 루트 전체에 `aria-live="polite"`가 있고,
`design/prototype/app.js`의 녹음 남은 시간에도 `aria-live="polite"`가 있다. 녹음 중
`render()`가 1초마다 앱 전체 `innerHTML`을 교체하므로 VoiceOver가 타이머 또는 화면
콘텐츠를 매초 반복 낭독할 수 있다. 이는 핸드오프의 “매초 전체 화면을 다시 읽지 않음”과
“필요한 시점에만 상태 알림” 수용 기준에 직접 위배된다.

수용 기준:

- 앱 루트 전체를 live region으로 사용하지 않는다.
- 시각 타이머는 매초 갱신하되 접근성 알림은 의미 있는 경계만 전용 status/live region으로 전달한다.
- 처리 완료·오류·단계 이동 알림은 중복 없이 해당 상태 영역에서만 전달한다.
- 녹음 10초 전이에서 포커스가 소실되지 않고 전체 화면 반복 낭독이 발생하지 않음을 독립 재검증할 수 있어야 한다.

### DQA-MEDIUM-014-001 — 자체 검증 보고서와 실제 diff 검사 불일치

실행 보고서는 `git diff --check: PASS`라고 기록했지만 실제
`git diff --check origin/develop...HEAD`는 보고서의 trailing whitespace 2건과 EOF
blank line 1건으로 실패한다. 검증 증거가 실제 결과와 일치해야 한다.

수용 기준:

- whitespace 오류를 제거한다.
- 동일 기준 명령을 다시 실행해 PASS 결과만 보고서에 기록한다.

## 4. 판정

핵심 Source of Truth 통합은 정합하지만 VoiceOver 알림 수용 기준을 충족하지 못하고
자체 검증 증거도 실제 결과와 다르다. `FAIL`, `rework_requested`로 UI/UX Design
Agent에 반환한다. 디자인 원본 수정, commit, push와 merge는 수행하지 않았다.

## 5. 재작업 독립 재검증 — 2026-08-04

- 기준: `origin/develop@55992a5`
- 대상 HEAD: `774f6b2`
- `DQA-MEDIUM-014-001`: 해소. `git diff --check origin/develop...HEAD`가 통과했고 실행 보고서의 실제 비교 기준과 일치한다.
- `DQA-HIGH-014-001`: 부분 해소. 앱 루트와 timer 자체의 live 속성은 제거됐다. Chrome에서 녹음 2초 뒤 같은 timer DOM, 같은 포커스, `08` 표시를 확인했고 10초 종료 뒤 처리 제목 포커스도 확인했다.
- `DQA-HIGH-014-001`: 미해소. 10초 종료 후 DOM에는 `step-row.is-processing[aria-live=polite]`와 전용 `#announcer[aria-live=polite]`가 동시에 존재한다. 처리 상태 본문과 종료 메시지가 중복 낭독될 수 있어 “단일 announcer” 수용 기준을 충족하지 않는다.
- 기존 통과 항목: revision, 7개 화면군·82개 상태·13개 컴포넌트, routing·보존 계약, Light/Dark·viewport·44pt·대비·Dynamic Type·Reduce Motion 문서 계약에 회귀가 없다.

최종 재검증 판정은 `FAIL`이다. Task를 `rework_requested`로 유지하고 UI/UX Design Agent에 반환한다. 처리 전이에서 전용 announcer만 live region으로 남기거나, 처리 STEP 영역의 live 속성을 제거해 동일 이벤트가 한 번만 전달되도록 보완해야 한다.
