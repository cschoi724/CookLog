# Audio Guide·핸즈프리·오디오 중단 상태 디자인 실행 보고서

작성일: 2026-07-31
작성자: UI/UX Design Agent
판정: `verification_ready`

## 1. 작업 결과

버튼 기반 Audio Guide와 사용자가 명시적으로 시작하는 핸즈프리, 권한·명령 실패와 오디오 중단 복구를 공식 로컬 UI Source of Truth에 반영했다.

- 시각·인터랙션 원본: `design/prototype/`
- 토큰·컴포넌트·상태 계약: `design/figma-build/manifest.json`
- Prototype revision: `audio-guide-focus-rework-20260731`
- Figma는 수정하지 않았으며 로컬 원본과 이후 동기화할 버전 미러다.

## 2. 버튼 기반 Audio Guide

- 진입 시 STEP 1을 준비하고 자동 재생하지 않는다.
- 이전, 재생·일시정지, 다음, 현재 단계 다시 듣기, 재료 듣기와 가이드 종료를 제공한다.
- 한 단계 낭독이 끝나면 같은 단계에서 다음 행동을 기다린다.
- 다음·이전은 이동한 단계를 처음부터 읽고, 다시 듣기는 현재 단계를 처음부터 읽는다.
- 마지막 단계에서 다음을 선택하면 이동하지 않고 `마지막 단계예요`를 안내한다.
- 재료 낭독은 현재 단계를 바꾸지 않고 종료 후 일시정지한다.
- 읽기 속도는 느리게·보통·빠르게이며 재생 중 변경은 현재 문장이 끝난 뒤 적용하고 다음 가이드에도 유지하는 계약이다.

## 3. 핸즈프리

- Audio Guide 진입 시 꺼져 있고 `핸즈프리 시작`을 사용자가 직접 선택해야 한다.
- 첫 시작에서 사용 이유를 설명한 뒤 마이크·음성인식 권한을 요청한다.
- 권한 거부 후 시스템 권한창을 반복하지 않고 설정 이동과 버튼 기반 가이드를 유지한다.
- 다음, 이전, 멈춰, 계속, 다시 들려줘, 재료 알려줘, 핸즈프리 종료 7개 명령을 동일 버튼 행동과 연결했다.
- 불확실한 명령은 아무 행동도 실행하지 않고 현재 단계·재생 위치를 유지한다.
- `핸즈프리 종료`는 마이크만 끄고 현재 오디오와 버튼을 유지한다.
- 일시정지 중에도 명령을 듣고 TTS 중 `멈춰`를 받을 수 있다는 계약을 명시했다.

## 4. 오디오 중단

- 전화, Siri, 다른 오디오, Bluetooth·이어폰 연결 해제 시 현재 단계와 위치를 유지하고 일시정지한다.
- 연결 해제 뒤 기기 스피커로 갑자기 재생하지 않는다.
- 중단 종료 뒤 자동 재생하거나 핸즈프리를 자동 활성화하지 않고 `수동 재개`를 제공한다.
- 앱 백그라운드와 직접 잠금 뒤 핸즈프리를 종료하고 복귀 후에도 자동 재활성화하지 않는다.
- Audio Guide가 열려 있는 동안 자동 잠금 방지 안내를 표시한다.

## 5. 제공 상태

Audio Player에 24개 상태를 제공한다.

- 준비, 일시정지, 재생, 단계 완료, 마지막 단계, 재료 듣기, 읽기 속도
- 첫 핸즈프리 안내, 권한 거부, 활성, 듣는 중
- 7개 명령 결과, 불확실 명령
- 오디오 중단, 백그라운드·잠금 종료
- 로딩, 오류, 단계 없음

## 6. 변경 파일

- `design/prototype/index.html`
- `design/prototype/app.js`
- `design/prototype/styles.css`
- `design/prototype/gallery.html`
- `design/prototype/README.md`
- `design/figma-build/manifest.json`
- T-012 Task, 실행 보고서, QA 인계 문서와 관련 Task Board

## 7. 자체 검증

- `node --check design/prototype/app.js`: 통과
- Manifest JSON 파싱: 통과
- Chrome 재작업 결함 동적 시나리오: 전부 통과
  - 저장 완료 레시피 수정값이 단계 수·문장·재료 낭독에 즉시 반영됨
  - 첫 단계 음성 `이전`과 마지막 단계 음성 `다음`이 버튼과 같은 경계 결과를 냄
  - `나중에` 뒤 재시작 시 권한 전 핸즈프리가 활성화되지 않음
  - 불확실 명령과 핸즈프리 종료 뒤 기존 재생 완료 시점에 `step-complete`로 정상 전이
  - 재생·단계·속도·핸즈프리 행동 뒤 동등 control 또는 안전한 첫 행동에 포커스 유지
  - 재생 버튼·다음 이동·다시 듣기 뒤 `step-complete`, 마지막 단계 다시 듣기 뒤 `last-step` 자동 렌더링에서 갱신된 재생 control로 포커스 복원
  - 로컬 TTS 오류에서 저장 단계 내용·이전·다음·가이드 종료·재시도 제공
- 375×667 Light·Dark Audio Guide 상태 조합 `48/48`: overflow·clipping·44pt 실패 없음
- 375×667 접근성 글자 크기 Audio Guide 상태 조합 `24/24`: overflow·clipping·44pt 실패 없음
- Reduce Motion: listening orb·wave `0.00001s`, 반복 `1` 확인
- Prototype·Gallery·README·Manifest revision 일치: 통과
- `git diff --check`: 통과

## 8. 재작업 결과

- `DQA-HIGH-012-001`: 별도 `playerSteps`를 제거하고 현재 저장된 `completedRecipe.steps`·`ingredients`에서 Player 문장, 단계 수, 진행률과 재료 낭독을 동적으로 생성했다.
- `DQA-HIGH-012-002`: 음성 `이전`·`다음`이 첫·마지막 단계에서 대응 버튼과 동일하게 이동·재생 없이 경계 안내 후 일시정지한다.
- `DQA-HIGH-012-003`: 첫 안내 확인 여부와 핸즈프리 권한 상태를 분리해 명시적 권한 허용 전 활성화를 차단했다.
- `DQA-HIGH-012-004`: 재생 완료 절대 시점을 보존해 불확실 명령과 핸즈프리 종료 렌더링 뒤에도 기존 오디오가 정상 완료된다.
- `DQA-MEDIUM-012-001`: 재생·단계·재료·속도·핸즈프리·수동 재개 후 동등 control, 새 선택이 나타나면 안전한 첫 행동으로 포커스를 이동한다. timer 기반 자동 완료가 `step-complete` 또는 `last-step`을 렌더링할 때도 갱신된 재생 control로 포커스를 복원한다.
- `DQA-MEDIUM-012-002`: TTS 오류에서 저장 레시피 내용, 이전·다음, 가이드 종료와 속도 설정을 유지하고 TTS 의존 행동만 비활성화하며 음성 재시도를 제공하도록 Prototype·Manifest 문구와 계약을 통일했다.

## 9. Design QA 요청

- 진입 시 STEP 1 준비와 자동 재생 없음
- 단계 완료 후 대기, 다음·이전·재청취와 마지막 단계 유지
- 재료 낭독의 단계 보존·일시정지, 읽기 속도 지연 적용
- 첫 핸즈프리 안내와 권한 허용·거부·설정 이동
- 7개 명령과 버튼 행동의 1:1 동등성
- 불확실 명령과 핸즈프리 종료가 재생 상태를 초기화하지 않는지
- 전화·Siri·다른 오디오·Bluetooth 중단 후 자동 재생·자동 핸즈프리 없음
- 백그라운드·직접 잠금 뒤 명시적 재시작
- Light·Dark, 390×844·375×667, Dynamic Type, Reduce Motion와 44pt 무회귀

특히 잔존 `DQA-MEDIUM-012-001`의 재생·단계 이동·다시 듣기 자동 완료 포커스와 기존 통과 항목의 독립 무회귀 판정을 요청한다.

## 10. Figma 및 Git

Figma 원본은 수정하지 않았다. 로컬 Prototype과 Manifest가 구현 및 Design QA 우선 기준이다. add, commit, push, PR과 merge를 수행하지 않았다.

잔존 포커스 재작업은 준비 시점의 최신 `origin/develop` SHA `93f577e`에서 시작했다. 실행 중 T-20260729-022 완료 상태 확정 커밋 `5118712`가 추가되어 현재 브랜치는 1커밋 뒤다. upstream은 Backend 계약·Task·Development/Quality Board를 변경하며 디자인 원본·Manifest는 변경하지 않았다. Quality Board는 양쪽에서 변경됐으므로 병합 전 최신 develop 기준 정합화가 필요하다.

## 11. 재작업 인계

- 재작업 worktree: `/private/tmp/cooklog-t20260729-012-focus-rework`
- 브랜치: `task/T-20260729-012-design-audio-guide-focus-rework`
- Task 상태: `verification_ready`
- 다음 담당: `Design QA Agent / Verification Role`
- 실행 lock: 해제

## 12. 잔존 포커스 재작업 결과

- timer 완료 callback이 `step-complete` 또는 `last-step`을 렌더링하기 전에 `player-playback` 포커스 의도를 지정하도록 수정했다.
- 재생 버튼, 다음 단계 이동과 다시 듣기로 시작한 `step-complete` 자동 완료 경로에서 `BUTTON[data-action="toggle-playback"][aria-label="재생"]` 포커스를 확인했다.
- 마지막 단계 다시 듣기로 시작한 `last-step` 자동 완료 경로에서도 같은 재생 control 포커스를 확인했다.
- 기존 HIGH 4건·TTS fallback 동적 시나리오, 375×667 Light·Dark `48/48`, 접근성 글자 크기 `24/24`, Reduce Motion 무회귀를 확인했다.

## 13. Design Lead 완료 검토

- 최종 Design QA `PASS`, 결함 6/6 해소와 잔존·신규 결함 0건을 확인했다.
- Task 성공 기준, allowed paths, Prototype·Manifest revision과 iOS 상태·행동 핸드오프를 확인했다.
- Figma 미수정은 로컬 Prototype·Manifest 우선 정책에 따라 비차단으로 수용했다.
- 최신 develop의 Backend T-022 완료 기록은 디자인 판정에 영향이 없으며 Quality Board 정합화는 병합 전 Git gate로 남긴다.
- `completion_review`로 인계하고 develop 병합 전에는 `done`으로 변경하지 않는다.

## 14. 완료 확정

- PR #42의 `ios-build`와 `ios-xctest`가 모두 통과했다.
- 최신 develop 재정렬과 공용 보드 정합화 후 squash merge SHA `2b9b7502d521db64f2ce11ac3e6a249e7cabf210`으로 통합됐다.
- T-012를 `done`으로 확정하고 후속 T-013의 선행 차단을 해제했다.
