# Cooking Log·STEP Preview·기기 내 STT·권한·오류 디자인 실행 보고서

작성일: 2026-07-30
작성자: UI/UX Design Agent
판정: `verification_ready`

## 1. 작업 결과

확정 제품 UX와 Apple 기기 내 STT 정책을 기준으로 Cooking Log의 첫 권한 안내부터 반복 기록, 실패 복구와 AI 정리 진입까지 공식 로컬 UI Source of Truth에 반영했다.

- 시각·인터랙션 원본: `design/prototype/`
- 구조·상태 계약: `design/figma-build/manifest.json`
- Figma는 로컬 원본과 동기화할 버전 미러이며 이번 Task 완료 조건이 아니다.

## 2. 기록과 권한

- 첫 기록 전에 마이크 사용 이유, 10초 자동 종료와 Apple 기기 내 처리 원칙을 설명한다.
- 시스템 권한 요청 전 `마이크 권한 계속` 행동을 제공하고 사용자가 원하면 Home으로 돌아갈 수 있다.
- 권한 거부 상태에서는 시스템 권한창을 반복 호출하지 않고 `설정으로 이동`을 제공한다.
- 마이크 권한이 없어도 Home, 기존 진행 기록, 저장된 레시피와 오디오 가이드는 계속 사용할 수 있음을 명시한다.
- 녹음은 10초 고정 카운트다운 후 자동 종료하며 조기 종료, 일시정지와 시간 연장은 제공하지 않는다.

## 3. 기기 내 STT와 실패 복구

- 녹음 후 음성을 외부로 전송하지 않고 Apple 기기 안에서 STEP으로 변환하는 상태를 제공한다.
- 복구 가능한 오류는 같은 기기 내 adapter로 최대 1회만 자동 재처리하며 수동 STT 재시도는 제공하지 않는다.
- 기기 내 STT 미지원과 최종 인식 실패를 구분한다.
- 미지원·최종 실패 모두 원격 STT로 자동 전환하거나 Backend·외부 제공업체로 음성을 전송하지 않는다.
- 최종 실패 시 새 STEP을 만들지 않고 임시 음성을 삭제하며 기존 STEP과 진행 기록을 보존한다.
- 사용자는 명시적인 `다시 기록하기`로 새 10초 기록을 시작한다.

## 4. STEP Preview

- 10초 음성 1개당 원문 STEP 1개를 만들고 녹음 시간순으로 고정한다.
- STEP 본문 직접 수정과 재배열을 제공하지 않는다.
- STEP 추가·삭제·되돌리기마다 로컬 텍스트 초안 자동 저장 피드백을 제공한다.
- 왼쪽 스와이프 삭제를 구현하고 동일 행동의 접근 가능한 44pt `삭제` 버튼을 함께 제공한다.
- 삭제 직후 `되돌리기` 행동으로 원래 위치에 STEP을 복구한다.
- 화면에서 STEP Preview가 AI 결과가 아니라 말한 원문임을 반복해서 구분한다.

## 5. 오프라인과 AI snapshot

- 지원되는 Apple 기기에서는 오프라인 상태에서도 10초 기록과 STEP Preview 생성 행동을 유지한다.
- 오프라인에서 `AI 정리하기`를 선택하면 인터넷 연결 필요 안내를 표시하고 STEP Preview에 머문다.
- AI 정리를 시작하면 사용한 STEP snapshot을 잠그고 추가·삭제 행동을 비활성화한다.
- 잠금 화면에서 AI 정리 진행 상태로 이동할 수 있고, 완료 또는 실패 후 잠금 해제한다는 계약을 Manifest에 명시했다.

## 6. 제공 상태

Cooking Log에 다음 14개 검토 상태를 제공한다.

1. 첫 기록 안내
2. 마이크 권한 거부
3. 빈 상태
4. 10초 녹음
5. 기기 내 변환
6. 자동 재처리
7. STEP 누적
8. 삭제·되돌리기
9. 오프라인 기록
10. 녹음 오류
11. 기기 내 STT 미지원
12. STT 최종 실패
13. AI snapshot 잠금
14. 오프라인 AI 안내

## 7. 변경 파일

- `design/prototype/app.js`
- `design/prototype/styles.css`
- `design/prototype/gallery.html`
- `design/prototype/README.md`
- `design/figma-build/manifest.json`
- Cooking Log Task, 실행 보고서와 관련 Task Board

## 8. 자체 검증

- `node --check design/prototype/app.js`: 통과
- Manifest·state JSON 파싱: 통과
- Figma Plugin API 스크립트 `9/9` 파싱: 통과
- 기록·STT·STEP·오프라인·잠금 계약 정적 검사 `23/23`: 통과
- Cooking Log 대표 상태 URL `14/14`: HTTP `200`
- Manifest 대비 조합 `13개`: 모두 WCAG AA, 최저 `4.67:1`
- 44pt 대체 삭제 행동, `focus-visible`, Dynamic Type action stack과 Reduce Motion 계약: 유지
- Safari 시각 검증:
  - 첫 기록 안내 · 375×667 · Light
  - STEP 삭제·되돌리기 · 375×667 · Dark
  - 실제 10초 자동 종료 후 기기 내 처리·STEP 추가 전환
- `git diff --check`: 통과

## 9. Design QA 요청

Design QA Agent는 다음을 독립 검증한다.

- 첫 기록에서 권한 이유를 먼저 설명하고 권한 거부 후 기존 기능을 막지 않는지
- 녹음이 정확히 10초 후 자동 종료되고 조기 종료·일시정지 행동이 없는지
- 기기 내 처리와 같은 adapter의 자동 재처리 1회가 구분되는지
- 미지원·최종 실패에서 원격 fallback·외부 전송이 없고 기존 STEP을 보존하는지
- STEP 원문·녹음 시간순·직접 편집 및 재배열 부재가 일관적인지
- 왼쪽 스와이프와 접근 가능한 삭제 버튼, 자동 저장, 짧은 되돌리기가 동작하는지
- 오프라인 기록은 가능하고 AI 정리만 연결 필요 안내로 분리되는지
- AI snapshot 잠금 중 STEP 추가·삭제가 실제로 비활성인지
- Light·Dark, 390×844·375×667, Dynamic Type, Reduce Motion, 44pt와 WCAG AA 무회귀

## 10. Figma 제한

이번 Task에서는 Figma 원본을 수정하지 않았다. 로컬 Prototype과 Manifest가 공식 UI Source of Truth이며 Figma는 이후 로컬 결과와 동기화할 버전 미러로 사용한다.

## 11. Design QA 재작업 결과

Product Owner가 승인한 결함 4건만 수정했으며 기존 통과 항목과 후속 디자인 범위는 변경하지 않았다.

| 결함 | 수정 결과 | 자체 검증 |
|---|---|---|
| `DQA-HIGH-010-001` | 제품 화면의 `자동 재처리 상태 보기`와 `재처리 성공 STEP 보기` 행동을 제거했다. `stt-path=success`, `retry-success`, `retry-failure` 검토 시나리오에 따라 `processing -> steps`, `processing -> retrying -> steps`, `processing -> retrying -> stt-error`가 사용자 행동 없이 자동 전이한다. | Chrome headless에서 세 경로 모두 실제 타이머 전이와 최종 DOM을 확인했다. |
| `DQA-MEDIUM-010-001` | Undo 수명을 5초로 지정하고 접근성 안내에 남은 수명 계약을 명시했다. 삭제 직후 Undo로, 성공 후 복구된 STEP 삭제 행동으로, 만료 후 가장 가까운 남은 STEP 삭제 행동 또는 기록 행동으로 포커스를 복귀시킨다. | 실제 DOM에서 삭제 직후 `undo-step`, 성공 후 `STEP 1 삭제`, 5초 만료 후 `STEP 1 삭제` 포커스와 삭제 확정 안내를 확인했다. |
| `DQA-MEDIUM-010-002` | 오프라인 상태의 독립 상단 기록 버튼을 제거하고 하단 기록·AI 행동 그룹만 유지했다. | 실제 DOM의 `start-recording` 행동 수가 `1`임을 확인했다. |
| `DQA-MEDIUM-010-003` | Prototype·Gallery·README·Manifest의 revision을 `cooking-log-on-device-stt-20260730`으로 통일하고 이전 Prototype 표기를 제거했다. | 네 Source of Truth 표기의 문자열 일치와 이전 표기 부재를 확인했다. |

재작업 회귀 검증 결과:

- 결함 수용 기준 정적 검사 `18/18`: 통과
- 자동 STT 분기 동적 검사 `3/3`: 통과
- Undo 열림·성공·5초 만료와 포커스 동적 검사: 통과
- 오프라인 기록 행동 수 `1`, Prototype revision DOM: 통과
- JavaScript·JSON·Figma Plugin API 스크립트 `9/9` 파싱: 통과
- `git diff --check`: 통과

재작업 완료 시 작업 브랜치는 `origin/develop`보다 iOS SwiftData 테스트 안정화·완료 문서와 iOS CI 계약 3커밋 뒤에 있다. 해당 upstream은 `design/prototype/`과 Manifest를 변경하지 않아 이번 디자인 판정에는 영향이 없으며, 동시에 변경된 Quality Board는 병합 전 Git gate에서 최신 develop과 정합화한다.

현재 결과는 `verification_ready`이며 다음 담당은 `Design QA Agent / Verification Role`이다.
