# T-20260805-003 iOS Home·검색·routing 독립 QA 보고서

작성일: 2026-08-05
작성 Role: iOS QA Agent / Verification Role
대상 구현: `9b1e44cb2f622902b382f335a39b22528e6d5efe`
기준 상태: `origin/develop@865f508ae505e3b1a80d9f3cda1c5bf6f8d5c0a7`
최종 판정: `FAIL — rework_requested`

## 1. 검증 범위

- Home Content·Empty·Loading·Error와 retry, 최근 활동순 최대 3개
- 전체 보기, 제목 우선·재료 검색, 결과 없음, STEP Preview 초안 검색 제외
- `draft_step_preview`·`draft_ai_review`·`completed`별 동일 UUID route
- refresh·앱 재실행 복구 기반과 NavigationStack/back swipe 무회귀
- 공식 Prototype·Manifest의 Home 통합 상태와 상태별 카드 계약
- Light/Dark, 375×667, Dynamic Type·VoiceOver 기본 구현
- 변경 경로와 전체 XCTest 회귀

## 2. 환경과 방법

- Xcode 26.6, iPhone 15 Simulator iOS 17.2
- iPhone SE 3세대 Simulator iOS 17.2, 375×667
- 구현 diff와 `design/prototype/`, `design/figma-build/manifest.json`, iOS 디자인 인수
  계약, `NAVIGATION.md` 독립 대조
- 구현 상태 그대로 전체 XCTest 실행
- iPhone 15 Light/Dark·Dynamic Type 및 iPhone SE Light 실제 설치·실행·렌더링 확인

## 3. 통과 항목

- 전체 XCTest `48/48`, 실패·skip 0
  - xcresult: `/private/tmp/cooklog-derived-t003-qa/Logs/Test/Test-CookLog-2026.08.05_15-46-04-+0900.xcresult`
- 최근 활동순 혼합 record와 최근 3개 제한: 통과
- 검색하지 않을 때 전체 record 최근 활동순, 검색 시 제목 일치 우선·재료 일치 후순위:
  통과
- `draft_step_preview` 검색 제외, 검색 결과 없음과 검색어 지우기: 통과
- lifecycle별 Cooking Log·AI Review·Recipe Detail route에 동일 record UUID 전달: 통과
- 새 기록은 route 전 영속 생성되고 기존 목록에 같은 UUID로 추가: 통과
- refresh 실패 시 기존 record 보존, retry 성공 시 복구: 통과
- `NavigationStack`과 시스템 back 동작을 막는 커스텀 back 구현 없음: 통과
- Light/Dark semantic color와 375×667 스크롤 레이아웃에서 가로 잘림 없음
- 조작 버튼 최소 높이와 접근성 hint·카드 결합 semantics 기본 구현 확인
- 변경 파일 15개가 Task `allowed_paths` 안에 있고 `git diff --check` 통과

## 4. 결함

### QA-HIGH-805003-001 — 진행 기록을 삭제할 경로가 없음

- 위치: `HomeView`, `RecipeLibraryView`, `RecipeRecordRowView`, `HomeViewModel`
- 기준:
  - Prototype `recipeCard`: 진행 record에 `⋯` 메뉴와 `진행 기록 삭제` 제공
  - Manifest `homeRules.progressDeletion`: More menu + irreversible confirmation
  - Manifest Home 상태: `Record Menu`, `Delete Confirmation`
- 실제: 모든 카드는 단일 route 버튼뿐이며 진행 record 메뉴, 영구 삭제 확인창,
  `deleteRecord` 호출과 삭제 후 최근 3개 backfill이 구현되지 않았다.
- 영향: 사용자는 잘못 만들거나 더 이상 필요 없는 STEP/Review 진행 기록을 Home과 전체
  보기 어디에서도 삭제할 수 없고, 개수 제한 없이 누적되는 로컬 초안을 정리할 수 없다.
- 수용 기준: 진행 record에만 접근 가능한 `⋯` 메뉴와 복구 불가 설명·취소 기본 행동을
  포함한 확인창을 제공하고, 성공 시 같은 UUID를 영구 삭제한 뒤 최근 목록을 재정렬·
  backfill한다. 삭제 실패에는 record를 보존하고 실패한 삭제만 재시도한다.

### QA-MEDIUM-805003-002 — AI 정리 완료 Home 통합 상태가 없음

- 위치: `HomeView`
- 기준: 공식 Prototype Home `ai-ready`, Manifest Home `AI Review Ready`
- 실제: `draft_ai_review` 카드는 표시되지만 AI 정리 완료를 알리는 성공 배너와
  `레시피 검토하기` 행동이 없다.
- 영향: 다른 화면을 이용하는 동안 AI 정리가 끝난 통합 핸드오프를 Home에서 인지하고
  바로 검토로 진입하는 확정 상태가 누락된다.
- 수용 기준: 준비 완료 record를 같은 UUID의 AI Review로 여는 알림/배너 상태를 제공하고,
  반복 refresh에서도 중복 record나 새 UUID를 만들지 않는다.

### QA-MEDIUM-805003-003 — 상태별 카드 콘텐츠가 확정 계약과 다름

- 위치: `RecipeRecordRowView.stateLabel`, `summaryText`
- 기준: Prototype 완료 카드는 별도 상태 badge 없이 최근 활동·예상 시간·주요 재료·단계
  수를 표시하고, Review 카드는 주요 재료와 마지막 활동을 표시한다. 제품 기준도 완료
  badge 부재와 주요 재료 최대 3개를 명시한다.
- 실제:
  - 완료 카드에 별도 `완료` badge가 표시된다.
  - 완료 카드는 재료 이름 대신 `N개 재료`만 표시하고 마지막 활동을 표시하지 않는다.
  - Review 카드는 재료가 있으면 마지막 활동을 표시하지 않는다.
- 영향: 혼합 최근 목록에서 사용자가 카드 상태와 최근성을 비교하는 핵심 정보 계층이
  디자인 계약과 달라진다.
- 수용 기준: 완료 badge를 제거하고 lifecycle별 카드가 Prototype의 상태·최근 활동·
  주요 재료·예상 시간·단계 정보를 동일한 우선순위로 제공한다.

### QA-MEDIUM-805003-004 — 새 기록 생성 실패의 오류 제목과 재시도 행동이 다름

- 위치: `HomeViewModel.startNewRecord`, `HomeView.recentSection`
- 기준: 인수 계약은 오류 원인을 구분하고 실패한 행동만 다시 시도하도록 요구한다.
- 실제: 생성 실패도 공용 `errorMessage`에 저장되어 빈 Home에서는
  `레시피를 불러오지 못했어요` 카드로 표시되며, 카드의 `다시 시도`는 생성이 아니라
  `loadRecords()`를 호출한다.
- 영향: 사용자는 생성 실패를 조회 실패로 오인하고, 표시된 재시도 버튼으로 실패한
  생성 작업을 재시도할 수 없다. 상단 기록 CTA를 다시 누르는 우회만 가능하다.
- 수용 기준: 조회 오류와 생성 오류를 분리하고, 생성 실패 안내의 재시도는 새 record
  생성을 다시 수행하되 기존 진행 record를 변경하거나 중복 생성하지 않는다.

## 5. 판정과 인계

검색·최근 정렬·동일 UUID routing과 전체 회귀는 통과했지만, 진행 기록의 유일한 삭제
경로가 전부 누락돼 제품의 로컬 record 관리 흐름을 완료할 수 없습니다. Home 통합 완료
상태, 카드 정보 계층과 실패한 행동별 재시도도 확정 Source of Truth와 일치하지 않습니다.

따라서 `FAIL`, `rework_requested`로 판정합니다. Development Lead Agent는
`QA-HIGH-805003-001`과 `QA-MEDIUM-805003-002~004`를 하나의 Home 상태·행동 재작업
범위로 조율하고, 수정 후 기존 48개 전체 XCTest와 결함별 신규 테스트, 실제 Home·전체
보기 상호작용 증빙을 포함해 iOS QA Agent에 재인계해야 합니다.

375×667 캡처에서는 앱 전체가 실제 화면보다 작은 세로 영역에 표시되는 기존 launch
configuration 현상도 관찰했습니다. 이번 구현 diff 밖의 baseline이며 최종 시각·접근성
통합 검증 `T-20260805-008`에서 실제 full-screen viewport를 별도로 확인해야 합니다.

## 6. 재작업 승인

2026-08-05 Development Lead Agent가 `QA-HIGH-805003-001`과
`QA-MEDIUM-805003-002~004`를 하나의 Home 상태·행동 재작업 `WP-R1~R4`로
범위화했습니다. Product Owner가 재작업을 승인했으며, iOS Agent는 최신
`origin/develop`을 반영한 구현 브랜치에서 네 결함만 수정하고 자체 검증 후
`verification_ready`로 재인계합니다. 기존 `FAIL` 판정은 독립 재검증 전까지 이력으로
유지합니다.
