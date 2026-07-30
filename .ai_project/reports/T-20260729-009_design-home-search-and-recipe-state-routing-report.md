# T-20260729-009 실행 보고서

작성일: 2026-07-30
작성자: UI/UX Design Agent
판정: `verification_ready`

## 1. 작업 결과

확정 제품 UX와 T-20260729-008 Foundation을 기준으로 Home, 전체 보기, 로컬 검색과 레시피 상태별 복귀 흐름을 공식 로컬 UI Source of Truth에 반영했다.

- 시각·인터랙션 원본: `design/prototype/`
- 구조·상태 계약: `design/figma-build/manifest.json`
- Figma는 로컬 원본과 동기화할 버전 미러이며 이번 Task 완료 조건이 아니다.

## 2. Home

- 진행 기록과 완료 레시피를 분리하지 않고 최근 활동순 하나의 목록으로 구성했다.
- Home에는 최대 3개만 표시하고 `전체 보기`에서 나머지를 확인한다.
- `기록 중`, `AI 정리 중`, `검토 필요`, 완료 레시피 상태를 제공한다.
- 제목 없는 STEP Preview는 `작성 중인 요리`와 날짜·시간으로 구분한다.
- 완료 레시피에는 완료 badge를 표시하지 않고 날짜, 예상 시간, 재료와 단계 수만 제공한다.
- 새 요리 기록 시작 아래에 기존 진행 기록이 보존된다는 안내를 표시한다.
- 빈 목록, 여러 진행 기록, 로딩과 오류 상태를 제공한다.

## 3. 상태별 routing

| 카드 상태 | 목적지 |
|---|---|
| 기록 중 | Cooking Log의 마지막 STEP Preview |
| AI 정리 중 | AI Review의 처리 중 상태 |
| 검토 필요 | AI Review의 마지막 편집·임시 저장 상태 |
| 완료 레시피 | Recipe Detail |

카드 본문 전체를 최소 44pt 이상의 터치 대상으로 사용하고 진행 기록의 `⋯` 메뉴는 별도 44×44pt 행동으로 분리했다.

## 4. 진행 기록 삭제

- 완료 레시피가 아닌 진행 기록에만 `⋯` 메뉴를 제공한다.
- 메뉴에서 `진행 기록 삭제`를 선택하면 modal confirmation을 표시한다.
- 삭제 대상 이름, STEP Preview·임시 저장 삭제 범위와 복구 불가를 명시한다.
- 취소와 영구 삭제를 분리하며 완료 레시피 삭제는 Recipe Detail 범위로 유지한다.

## 5. 전체 보기와 로컬 검색

- 진행 기록과 완료 레시피 3개 초과 목록을 최근 활동순으로 제공한다.
- 제목·재료명을 입력하는 즉시 기기 내부 결과를 갱신한다.
- AI Review 진행 기록과 완료 레시피만 검색한다.
- 제목·재료가 없는 STEP Preview와 조리 단계·메모 본문은 검색에서 제외한다.
- 제목 일치를 재료명 일치보다 우선하고 같은 조건에서는 최근 활동순을 유지한다.
- `제목 일치`, `재료 일치` label로 결과 근거를 표시한다.
- 검색어 지우기, 결과 없음과 빈 목록 상태를 제공한다.
- 검색어와 콘텐츠를 서버나 AI로 보내지 않는다는 안내를 입력 필드 바로 아래에 표시한다.
- 별도 정렬·필터, 의미 검색과 오타 교정은 제공하지 않는다.

## 6. 변경 파일

- `design/prototype/index.html`
- `design/prototype/app.js`
- `design/prototype/styles.css`
- `design/prototype/gallery.html`
- `design/prototype/README.md`
- `design/figma-build/manifest.json`
- T-009 Task, 실행 보고서와 관련 Task Board

## 7. 자체 검증

- `node --check design/prototype/app.js`: 통과
- `jq empty design/figma-build/manifest.json design/figma-build/state.json`: 통과
- Home 7개 상태와 전체 보기 5개 상태 구조 검사: 통과
- 카드 routing 4종 계약 검사: 통과
- Home 최대 3개, 제목 없는 초안, 새 기록 보존 문구 검사: 통과
- 검색 범위·제목 우선·재료 일치·네트워크 미전송 계약 검사: 통과
- 완료 카드 badge 미사용과 진행 기록 전용 삭제 메뉴 검사: 통과
- Manifest 대비 13개 조합: 모두 4.5:1 이상, 최저 4.67:1
- 44pt 행동, focus-visible, Dynamic Type action stack과 Reduce Motion 계약 유지
- 로컬 HTTP 대표 상태 10개: 모두 200
- Safari 시각 검증:
  - Home Mixed Recent · 390×844 · Light
  - Ingredient Search · 375×667 · Dark
  - Search No Results · 390×844 · Light
  - Delete Confirmation · 375×667 · Light
- `git diff --check`: 통과

## 8. Design QA 요청

Design QA Agent는 다음을 독립 검증한다.

- Home 최근 활동순 최대 3개와 전체 보기 3개 초과 목록
- 진행·완료 카드의 같은 목록 내 상태 구분과 완료 badge 미사용
- 기록 중, AI 정리 중, 검토 필요, 완료 카드의 목적지
- 제목 없는 `작성 중인 요리`의 날짜·시간 구분
- 새 기록 시작 시 기존 진행 기록 보존 안내
- 진행 기록 `⋯` 메뉴와 복구 불가 영구 삭제 확인
- 로컬 검색 범위, 제목 일치 우선, 재료 일치, 즉시 갱신과 검색어 지우기
- STEP Preview 검색 제외, 결과 없음과 빈 목록
- Light·Dark, 390×844·375×667, 44pt와 키보드 focus

## 9. Figma 제한

이번 Task에서는 Figma 원본을 수정하지 않았다. Starter MCP 호출 제한과 무관하게 로컬 Prototype·Manifest가 공식 UI Source of Truth이며, Figma는 이후 로컬 결과와 동기화할 버전 미러로만 사용한다.

## 10. 기준점 변동

- 작업 시작 기준점은 Task에 기록된 최신 `origin/develop` `0a665758de848704b4d8a249828c3ff390db26c5`였다.
- 재작업 완료 시점의 `origin/develop`은 `8a36f22`이며 작업 기준점보다 3커밋 앞서 있다.
- 후속 3커밋은 첫 출시 기기 내 STT 정책, Backend 계약 범위와 iOS CI 범위를 갱신했다. 제품 문서의 변경도 STT·온라인 AI·음성 보관 정책에 한정되고 Home·검색·recipe routing 기준은 바뀌지 않았으며 `design/prototype/`과 Manifest는 변경하지 않는다.
- 현재 T-009 시각·UX 판정에는 영향이 없지만 병합 게이트에서는 동시에 변경된 루트 Task Board, Design·Quality Board와 상위 T-002 Task 문서를 최신 develop 기준으로 정합화해야 한다.

## 11. Design QA 재작업 결과

Product Owner가 승인한 결함 3건만 수정했으며 기존 통과 항목과 후속 T-010 범위는 변경하지 않았다.

| 결함 | 수정 결과 | 자체 검증 |
|---|---|---|
| `DQA-HIGH-009-001` | 메뉴 열림 시 삭제 항목으로 초기 포커스를 이동하고 `Escape` 닫힘 후 원래 `⋯` 트리거로 복귀시켰다. 영구 삭제 다이얼로그는 안전 행동인 `취소`를 초기 포커스로 사용하며 `Tab`·`Shift+Tab` 내부 순환, `Escape` 취소, 외부 DOM 포커스 이탈 가드와 닫힘 후 트리거 복귀를 제공한다. 삭제 확정으로 트리거가 제거되면 Home 주 행동 또는 전체 보기 검색으로 포커스를 이동한다. | 메뉴·다이얼로그 초기 포커스는 Safari에서 시각 확인했다. 포커스 선택자, 순환, `Escape`, 복귀와 이탈 가드의 정적 경로 검사를 통과했다. |
| `DQA-MEDIUM-009-001` | 각 기록의 `lastActivityAt`을 기준으로 삭제되지 않은 전체 기록을 내림차순 정렬한 뒤 Home에서 상위 3개를 계산한다. 삭제 후 같은 계산을 다시 수행하므로 다음 최근 항목이 자동 보충된다. | 초기 순서 `방금 전 -> 8분 전 -> 어제`, `visibleRecipes().slice(0, 3)`와 삭제 제외 후 재계산 경로를 확인했다. |
| `DQA-MEDIUM-009-002` | 실제 결과에 제목 일치가 하나라도 있으면 `search-title`, 재료만 일치하면 `search-ingredient`, 결과가 없으면 `no-results`로 전이한다. 혼합 결과는 제목 검색으로 유지하는 정책을 Manifest에 명시했다. | 재료 전용 예시 `애호박`, 상태 분류 함수, 결과 요약과 Manifest 상태 정책의 일치를 확인했다. |

재작업 회귀 검증 결과:

- `node --check design/prototype/app.js`: 통과
- Manifest·state JSON 파싱: 통과
- Figma Plugin API 스크립트 `9/9` 파싱: 통과
- 결함 수용 기준 정적 검사 `12/12`: 통과
- Home·삭제 확인·재료 검색·결과 없음 대표 URL `4/4`: HTTP `200`
- Manifest 대비 조합 `13개`: 모두 WCAG AA, 최저 `4.67:1`
- 44pt, `focus-visible`, Reduce Motion과 기존 routing·검색 범위 회귀: 통과
- `git diff --check`: 통과

Safari의 macOS 전체 키보드 접근 설정에 따라 `Tab`이 웹 콘텐츠에서 브라우저 주소창으로 이동할 수 있으므로, Design QA는 전체 키보드 접근을 활성화한 환경에서 다이얼로그의 `Tab`·`Shift+Tab` 순환을 독립 재검증한다. 앱 내부에는 표준 키보드 순환과 외부 DOM 포커스 이탈 가드가 모두 구현되어 있다.

현재 결과는 `verification_ready`이며, 다음 담당은 `Design QA Agent / Verification Role`이다.
