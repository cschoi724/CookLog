# AI 처리·AI Review·완료 레시피 편집·삭제 디자인 실행 보고서

작성일: 2026-07-31
작성자: UI/UX Design Agent
판정: `verification_ready`

## 1. 작업 결과

AI 정리의 장기 처리·완료·실패부터 AI Review의 편집·임시 저장·최종 저장, 완료 레시피의 수정·영구 삭제까지 공식 로컬 UI Source of Truth에 반영했다.

- 시각·인터랙션 원본: `design/prototype/`
- 토큰·컴포넌트·상태 구조 계약: `design/figma-build/manifest.json`
- Prototype revision: `ai-review-edit-delete-20260731`
- Figma는 이번 Task에서 수정하지 않았으며 로컬 원본과 동기화할 버전 미러다.

## 2. AI 정리 상태와 복구

- `AI 정리하기` 시점의 정렬된 STEP Preview snapshot을 잠그고 같은 요청의 중복 실행 행동을 비활성화한다.
- 같은 요청 식별자는 검토본을 최대 하나만 만든다는 계약을 Manifest에 명시했다.
- 10초 경과는 timeout이나 실패가 아니라 장기 처리 안내 시점이다.
- 장기 처리 중 다른 화면을 사용할 수 있고 Home에는 `AI 정리 중` 상태가 유지된다.
- 완료 후 앱 내부 배너와 Home의 `검토 준비됨` 카드로 알리며 사용자가 명시적으로 Review를 연다.
- 완료 또는 실패 뒤 자동 화면 전환과 자동 AI 재시도를 하지 않는다.
- 실패는 오프라인·서비스 지연·정리할 STEP 부족 범주를 설명하고 `다시 정리하기`, `기록으로 돌아가기`를 제공한다.

## 3. AI Review 편집과 저장 경계

- 제목, 재료·양, 예상 시간, 메모를 편집할 수 있고 각 필드에 `확정`, `AI 추정`, `누락` 상태와 설명을 제공한다.
- 조리 순서는 독립 카드로 구성하며 추가, 삭제, 삭제 되돌리기, drag 재배열, 위·아래 이동을 제공한다.
- 저장 시 빈 STEP을 제외하고 화면 순서대로 다시 번호를 부여하는 계약을 명시했다.
- `임시 저장`은 명시적 행동으로만 수행하고 toast를 표시한 뒤 Review 화면에 머문다.
- 변경 후 뒤로 가면 `임시 저장하고 나가기`, `변경 버리고 나가기`, `계속 편집` 세 행동을 제공한다.
- 최종 저장은 제목과 내용이 있는 STEP 최소 1개, 양만 있는 재료 행 금지를 필드 오류와 요약으로 검증한다.
- 저장 중 중복 최종 저장을 막고 성공 후에만 Recipe Detail로 이동한다.
- 로컬 저장 실패 시 현재 입력값을 유지하고 `저장 다시 시도`를 제공한다.

## 4. 완료 레시피 수정과 삭제

- Recipe Detail의 더보기 메뉴에서 `레시피 수정`, `레시피 삭제`를 제공한다.
- 수정 화면은 AI Review와 같은 필드·STEP 카드 구조를 재사용한다.
- 완료 수정에서는 `AI DRAFT`, 임시 저장과 AI 재호출을 제거하고 `수정 완료`만 제공한다.
- 삭제 확인은 진행 기록 삭제와 구분해 완성된 레시피와 오디오 가이드가 영구 삭제되고 복구할 수 없음을 명시한다.
- 삭제 다이얼로그는 취소에 초기 포커스를 두고 Tab 순환, Escape 취소와 trigger 포커스 복귀 계약을 유지한다.

## 5. 제공 상태

- Home: AI 완료 배너와 `검토 준비됨` 카드
- AI Review: 처리 중, 10초 이상 처리, 검토 준비됨, 검토·수정, 임시 저장됨, 이탈 확인, 입력 검증, 최종 저장 중, 최종 저장 오류, AI 정리 실패, 완료 레시피 수정, 완료 수정 저장 중
- Recipe Detail: 상세, 더보기 메뉴, 완료 레시피 삭제 확인, 삭제 완료, 로딩, 오류, 찾을 수 없음

## 6. 변경 파일

- `design/prototype/index.html`
- `design/prototype/app.js`
- `design/prototype/styles.css`
- `design/prototype/gallery.html`
- `design/prototype/README.md`
- `design/figma-build/manifest.json`
- T-011 Task, 실행 보고서, QA 인계 문서와 관련 Task Board

## 7. 자체 검증

- `node --check design/prototype/app.js`: 통과
- `python3 -m json.tool design/figma-build/manifest.json`: 통과
- T-011 핵심 상태·행동 계약 정적 검사 `13/13`: 통과
- Prototype·Gallery·README·Manifest revision 일치: 통과
- 핵심 화면·Gallery·JS·CSS 로컬 HTTP 응답 `7/7`: `200`
- Chrome headless AI Review 실제 DOM 렌더링: 통과
- Chrome headless 시각 검증:
  - AI Review 편집 · 375×667 · Light: 단계/필드와 고정 임시·최종 저장 행동의 가로 잘림 없음
  - 완료 레시피 삭제 확인 · 390×844 · Light: 완료 대상·복구 불가 문구와 취소 초기 포커스가 명확함
- 44pt 단계 편집·더보기·다이얼로그 행동과 키보드 포커스 계약: 유지
- `git diff --check`: 통과

## 8. Design QA 요청

Design QA Agent는 다음을 독립 검증한다.

- 10초 안내가 실패 timeout으로 오해되지 않고 다른 화면 이용과 Home 상태가 유지되는지
- 완료 시 자동 이동 없이 앱 내부 배너·`검토 준비됨` 카드에서 명시적으로 Review에 진입하는지
- 실패 후 자동 재시도 없이 STEP 보존과 두 복구 행동이 제공되는지
- 동일 AI 요청의 중복 실행·중복 검토본 생성이 방지되는지
- `확정`·`AI 추정`·`누락` 상태와 편집 가능한 필드가 일관적인지
- STEP 카드의 추가·삭제·되돌리기·drag·위아래 이동과 저장 시 빈 단계 제외·재번호가 일관적인지
- 임시 저장이 화면에 머물고 이탈 확인 세 행동 및 최종 검증·저장 실패 값 보존이 동작하는지
- 완료 수정에 AI DRAFT·임시 저장·AI 재호출이 없고 `수정 완료`만 있는지
- 완료 레시피 삭제가 Recipe Detail에만 있고 진행 기록 삭제와 문구·대상이 구분되는지
- Light·Dark, 390×844·375×667, Dynamic Type, Reduce Motion, 44pt와 키보드 포커스 무회귀

## 9. Figma 제한

이번 Task에서는 Figma 원본을 수정하지 않았다. Figma Starter 한도와 동기화 여부는 완료 차단 조건이 아니며, 로컬 Prototype과 Manifest가 구현 및 Design QA의 우선 기준이다.

## 10. Git 인계 주의

작업 시작 뒤 `origin/develop`에 CI Task 완료 문서 커밋 `54053d2`가 추가되어 현재 브랜치는 1커밋 뒤에 있다. 디자인 원본과 Manifest에는 upstream 변경이 없지만 `.ai_project/teams/quality/task_board.md`는 양쪽에서 변경됐으므로 병합 전 최신 develop 기준으로 보드 정합성을 확인해야 한다. 이번 실행에서는 Git 규칙에 따라 switch, stash, reset, add, commit, push, PR과 merge를 수행하지 않았다.

## 11. Design QA 재작업 결과

Product Owner가 승인한 HIGH 3건·MEDIUM 4건만 수정했으며 기존 통과 항목과 후속 디자인 범위는 변경하지 않았다.

| 결함 | 수정 결과 | 자체 검증 |
|---|---|---|
| `DQA-HIGH-011-001` | 마지막 성공 임시 저장 snapshot과 현재 편집본을 분리했다. 임시 저장 시 snapshot을 교체하고 `변경 버리고 나가기`에서 해당 snapshot을 복원한다. | `임시 저장 기준 제목 -> 버릴 제목 -> 변경 버리기 -> Review 재진입` 후 임시 저장 기준 제목 복원 확인 |
| `DQA-HIGH-011-002` | 완료 레시피 원본·현재 수정본·저장 대기본을 분리하고 `수정 완료` 성공 시 정규화된 제목·재료·단계·시간·메모를 기존 완료 레시피에 반영했다. Recipe Detail을 동적 저장값으로 렌더링한다. | 5개 편집 영역 변경 후 Detail 실제 값 일치 확인 |
| `DQA-HIGH-011-003` | 완료 편집 이탈 dialog에서 임시 저장 행동을 완전히 제거했다. `수정 버리고 상세로`는 마지막 완료 원본을 복원해 Recipe Detail로 이동하고 `계속 편집`만 함께 제공한다. | 완료 이탈 행동 2개, draft save 행동 0개와 Detail 경계 복귀 확인 |
| `DQA-MEDIUM-011-001` | Review 이탈 확인을 `aria-modal` alertdialog와 scrim으로 변경했다. `계속 편집` 초기 포커스, Tab·Shift+Tab 순환, Escape 취소와 뒤로 trigger 복귀를 구현했다. 배경 폼은 dialog 중 비활성이다. | 실제 Chrome 키보드 초기 포커스·양방향 순환·Escape 복귀 확인 |
| `DQA-MEDIUM-011-002` | Review STEP 삭제 직후 Undo로 포커스를 이동하고, Undo 성공 후 복원된 STEP 입력으로 포커스를 돌린다. | 삭제 후 `undo-review-step`, 복원 후 `review-step-0` 확인 |
| `DQA-MEDIUM-011-003` | 완료 레시피 메뉴 열림 시 첫 `레시피 수정` 항목, 닫힘·Escape 시 `레시피 메뉴` trigger로 포커스를 이동한다. | 실제 Chrome 메뉴 열림·Escape·복귀 포커스 확인 |
| `DQA-MEDIUM-011-004` | 최종 저장 직전에 필드 공백을 정리하고 빈 STEP을 제거하며 현재 배열 순서로 Detail의 번호 목록을 다시 생성한다. | 빈 STEP 추가 후 완료 저장 결과 STEP 3개와 1부터 시작하는 Detail ordered list 확인 |

재작업 회귀 검증 결과:

- Design QA 결함 수용 기준 Chrome 동적 검사 `27/27`: 통과
- 375×667 Light·Dark T-011 관련 상태 조합 `40/40`: overflow·clipping·44pt 실패 없음
- JavaScript 문법과 Manifest JSON 파싱: 통과
- Prototype·Manifest 계약 정적 검사: 통과
- `git diff --check`: 통과

현재 브랜치는 `origin/develop`보다 3커밋 뒤에 있다. upstream은 T-011 디자인 원본·Manifest를 변경하지 않지만 Quality Board 동시 변경은 병합 전 Git gate에서 정합화해야 한다.
