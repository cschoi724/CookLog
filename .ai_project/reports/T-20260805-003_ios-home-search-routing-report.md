# T-20260805-003 iOS Home·검색·routing 구현 보고서

작성일: 2026-08-05
작성 Role: iOS Agent / Execution Role
상태: `verification_ready`

## 결과

Home의 데이터 원본을 `RecipeRecord`로 통일하고 최근 활동순 혼합 카드, 전체 보기,
제목·재료 로컬 검색과 lifecycle별 동일 record ID routing을 구현했습니다. 새 기록은 화면
이동 전에 로컬 record를 생성하며, 로딩·오류·재시도 중 기존 목록을 제거하지 않습니다.

## 구현 범위

- Home 최근 활동순 최대 3개와 진행·Review·완료 상태 카드
- Home Content·Empty·Loading·Error와 retry, pull-to-refresh
- 전체 보기와 검색 결과 없음·전체 기록 없음
- `draft_ai_review`·`completed` 제목 우선·재료명 검색
- `draft_step_preview` 검색 제외와 기기 내 검색 안내
- `recipeLibrary`, `cookingLog(recordID:stepPreviews:)`,
  `aiReview(recordID:stepPreviews:)` AppRoute
- 새 record 영속 생성과 lifecycle별 동일 UUID 목적지 선택
- CookLog Home Light/Dark 색상 토큰, Dynamic Type과 시스템 NavigationStack/back 동작

## 자체 검증

- HomeViewModel 선별 XCTest 7개: 성공
- `xcodebuild ... build -quiet`: 성공
- 전체 XCTest 48개: 성공
- destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`
- Simulator 설치·실행: 성공, PID 반환 확인
- Home 빈 상태에서 핵심 메시지·기록 CTA·보존 안내·CookLog 색상 렌더링 확인
- `git diff --check`: 성공

## QA 재작업 결과

- `WP-R1`: 진행 record 전용 `⋯` 메뉴와 복구 불가 확인을 추가했습니다. 삭제 성공 시
  같은 UUID를 제거하고 최근 3개를 backfill하며, 실패 시 record를 보존하고 실패한
  UUID 삭제만 재시도합니다.
- `WP-R2`: 최신 `draft_ai_review` record를 성공 배너와 `레시피 검토하기` CTA에
  연결했습니다. refresh 전후 동일 UUID를 유지하며 새 record를 만들지 않습니다.
- `WP-R3`: 완료 badge를 제거하고 lifecycle별 카드에 최근 활동, 주요 재료 최대 3개,
  예상 시간과 단계 수를 표시합니다.
- `WP-R4`: 조회 오류와 생성 오류를 분리했습니다. 생성 실패 CTA는 기존 record를
  변경하지 않고 생성 동작만 다시 수행합니다.
- HomeViewModel 회귀 6개를 추가해 Home 테스트 13개, 전체 XCTest 54/54를 iPhone 15
  iOS 17.2에서 통과했습니다.
- Simulator 설치·실행과 Home 빈 상태의 핵심 메시지·기록 CTA 렌더링을 재확인하고,
  CTA를 실제로 눌러 새 record 생성 후 Cooking Log로 전환되는 것을 확인했습니다.
- 재작업 후 `git diff --check`: 성공

## 독립 QA 요청

- `WP-R1~R4`의 진행 record 삭제·backfill·실패 재시도, Review 준비 배너 동일 UUID,
  lifecycle별 metadata, 조회·생성 오류 분리를 우선 재검증
- Home Content·Empty·Loading·Error와 retry 후 회복
- 최근 3개·전체 보기·제목 우선·재료 검색·결과 없음
- STEP Preview 초안 검색 제외와 검색어 비전송 문구
- lifecycle별 Cooking Log·AI Review·Recipe Detail route와 동일 record ID
- 앱 재실행·refresh·검색 전후 ID 유지, NavigationStack back swipe
- 375×667, Light/Dark, Dynamic Type과 VoiceOver 기본 동작

## 제외 범위와 후속 위험

- Cooking Log 내부 자동 저장은 T-20260805-004 범위입니다.
- AI Review의 기존 review draft 직접 복원·동일 ID 완료 저장은 T-20260805-005가 이번
  `recordID` route 입력을 사용해 연결합니다.
- App Info, 실제 STT·Backend AI·TTS와 최종 82/23 상태 통합 검증은 후속 Task 범위입니다.
