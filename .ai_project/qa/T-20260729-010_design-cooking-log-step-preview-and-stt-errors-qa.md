# T-20260729-010 Design QA 독립 재검증 보고서

작성일: 2026-07-30
작성자: Design QA Agent
대상 Task: `T-20260729-010`
판정: `verification_passed`

## 1. 재검증 요약

재작업된 `DQA-HIGH-010-001`, `DQA-MEDIUM-010-001~003`의 수용 기준과 기존 통과 항목의 회귀를 로컬 UI Source of Truth 기준으로 독립 재검증했다.

성공·자동 재처리 성공·자동 재처리 최종 실패가 제품 화면의 수동 행동 없이 실제 분기되고, Undo 5초 만료와 성공·만료 후 키보드 포커스 복귀가 동작한다. 오프라인 기록 행동은 한 개로 정리됐고 Prototype·Gallery·README·Manifest revision도 일치한다. 기존 10초 기록, STEP 보존, 외부 전송 금지, 오프라인 AI 안내, snapshot 잠금과 접근성 계약에도 회귀가 없다.

- 기존 결함 해소: 4건
- 신규 결함: 없음
- 최종 상태: `verification_passed`
- 다음 담당: Design Lead Agent
- Task `done` 전환: 수행하지 않음

## 2. 검증 환경과 잔여 Git 위험

- Worktree: `/private/tmp/cooklog-t20260729-010`
- Branch: `task/T-20260729-010-design-cooking-log-step-preview-and-stt-errors`
- Task HEAD: `af4b9594fabce998dacf7c56aca8309a4cb154b6`
- `origin/develop`: `2a4751eaad940215080772f5cc8e2e544aa381ab`
- 공통 기준점: `af4b9594fabce998dacf7c56aca8309a4cb154b6`

Task branch는 `origin/develop`보다 4커밋 뒤에 있다. upstream 변경은 iOS SwiftData·CI 진단, 테스트 문서와 관련 보드에 한정되며 `design/prototype/`과 Manifest는 변경하지 않아 이번 디자인 판정에는 영향이 없다. 동시에 변경된 Quality Board 정합화와 최신 develop 기준 patch 확인은 병합 전 Git gate로 남긴다.

## 3. 기존 결함 재검증

### DQA-HIGH-010-001 — 기기 내 STT 자동 재처리 실제 전이

결과: 해소

- `stt-path=success`: `processing -> steps`
- `stt-path=retry-success`: `processing -> retrying -> steps`
- `stt-path=retry-failure`: `processing -> retrying -> stt-error`
- 세 경로 모두 사용자 행동 없이 timer 기반으로 전이한다.
- 제품 화면 내부의 `자동 재처리 상태 보기` 검토용 행동은 제거됐다.
- 최종 실패에서 기존 STEP 2개를 유지하고 새 STEP을 만들지 않으며 임시 음성 삭제·원격 fallback 없음 안내를 제공한다.

Chrome headless에서 세 상태 배열과 STEP 수, 실패 안내를 실제 DOM으로 독립 확인했다.

### DQA-MEDIUM-010-001 — Undo 만료와 키보드 포커스

결과: 해소

- STEP 삭제 직후 `되돌리기`로 포커스가 이동한다.
- 안내 문구가 `5초 안에 되돌릴 수 있어요`로 수명주기를 명시한다.
- 5초 안에 되돌리면 원래 위치에 STEP이 복구되고 해당 STEP의 `삭제` 행동으로 포커스가 이동한다.
- 5초가 지나면 Undo가 제거되고 삭제가 확정되며 가장 가까운 STEP의 `삭제` 행동으로 포커스가 이동한다.
- STEP이 남지 않는 경우에는 기록 행동으로 포커스를 이동하는 fallback 계약이 있다.

Undo 성공과 5.25초 만료를 각각 실제 브라우저에서 재현했다.

### DQA-MEDIUM-010-002 — 오프라인 기록 행동 중복

결과: 해소

- 오프라인 상태의 `data-action="start-recording"`은 한 개다.
- 하단 행동 그룹이 `10초 더 기록`, `AI 정리하기` 두 행동으로 구성된다.
- 375×667 Dark 화면에서 상단 중복 CTA가 제거되고 STEP Preview가 더 위에서 시작한다.

### DQA-MEDIUM-010-003 — Prototype revision 표기

결과: 해소

- Prototype title과 상단 kicker: `cooking-log-on-device-stt-20260730`
- Gallery kicker: `COOKING-LOG-ON-DEVICE-STT-20260730`
- README current revision: `cooking-log-on-device-stt-20260730`
- Manifest revision: `cooking-log-on-device-stt-20260730`
- 이전 `T-20260729-009` 표기는 공식 Prototype에서 제거됐다.

## 4. 회귀 검증

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| 첫 기록 안내 | 통과 | 권한 요청 전 마이크 이유, 10초 종료, 기기 내 처리와 외부 전송 금지 안내 |
| 권한 거부 | 통과 | 설정 이동과 Home·기존 레시피·Audio Guide 유지 안내 |
| 10초 녹음 | 통과 | 10초 timer 자동 종료, 조기 종료·일시정지·연장 행동 없음 |
| STEP 생성 | 통과 | 10초 기록 1개당 원문 STEP 1개, 녹음 순서 고정 |
| STT 상태 | 통과 | 처리·자동 재처리·성공·최종 실패를 시각·문구·전이로 구분 |
| STT 미지원 | 통과 | 원격 fallback과 외부 전송 없음, 기존 기능 유지 |
| STT 최종 실패 | 통과 | 임시 음성 삭제, 새 STEP 미생성, 기존 STEP 보존과 다시 기록 행동 |
| STEP 정책 | 통과 | 직접 편집·재배열 없음, 원문 Preview 안내 |
| STEP 삭제 | 통과 | 왼쪽 스와이프와 44pt 삭제 행동, 자동 저장 |
| 오프라인 정책 | 통과 | 지원 기기 기록 가능, AI 정리만 연결 필요, STEP 유지 |
| AI snapshot 잠금 | 통과 | STEP 삭제와 기록 추가 실제 비활성 |
| 상태 수 | 통과 | Cooking Log 14개 상태, HTTP 200 14/14 |
| Light·Dark·작은 화면 | 통과 | Offline Dark 375×667 시각 확인, 기존 First-use Light 유지 |
| WCAG AA 대비 | 통과 | Manifest 13개 조합 모두 4.5:1 이상, 최저 4.67:1 |
| 접근성 기본 계약 | 통과 | 44pt 행동, `focus-visible`, Dynamic Type action stack, Reduce Motion 유지 |

## 5. 검증 명령과 실행 확인

- `git status -sb`, `git branch --show-current`: 전용 worktree와 기존 변경 범위 확인
- `node --check design/prototype/app.js`: 통과
- Figma Plugin API 스크립트 9개 `AsyncFunction` 파싱: 통과
- `jq empty design/figma-build/manifest.json design/figma-build/state.json`: 통과
- Cooking Log 14개 상태 URL: HTTP `200` 14/14
- Manifest 대비 13개 조합: 모두 4.5:1 이상, 최저 4.67:1
- Chrome headless 동적 검증:
  - STT 자동 분기 3/3: 통과
  - Undo 성공·5초 만료·포커스 복귀: 통과
  - 오프라인 단일 기록 행동: 통과
  - revision DOM: 통과
  - AI snapshot 잠금: 통과
- Safari 시각 검증:
  - Offline Recording · 375×667 · Dark: 통과
- `git diff --check`: 통과

## 6. 최종 판정

`DQA-HIGH-010-001`, `DQA-MEDIUM-010-001~003`은 모두 해소됐고 기존 통과 항목에도 회귀가 없다.

Task를 `verification_passed`로 전환해 Design Lead Agent에 인계한다. 완료 검토와 `done` 전환은 Design Lead Agent 및 후속 통합 절차로 남긴다.
