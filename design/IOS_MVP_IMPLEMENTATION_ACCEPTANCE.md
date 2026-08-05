# CookLog iOS MVP 디자인 구현 인수 계약

작성일: 2026-08-04
상태: Design QA 검증 통과, Design Lead 완료 확정
기준 Task: `T-20260805-001`
적용 Task: `T-20260728-003`

## 1. 목적과 범위

이 문서는 승인된 CookLog MVP UI/UX를 SwiftUI에 적용하고 Visual QA할 때 사용하는 Core Loop 세부 인수 계약이다. `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`와 manifest의 통합 82개 상태를 상위 기준으로 보존하면서, 첫 iOS 구현 검수에 필요한 23개 핵심 상태의 우선순위, 허용 편차, 공통 컴포넌트와 에셋 정책을 구체화한다.

- UI 시각 원본: `design/prototype/`
- 토큰·상태 원본: `design/figma-build/manifest.json`
- 제품·흐름 원본: `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`
- iOS 구조 기준: `apps/ios/CookLog/`, `apps/ios/docs/NAVIGATION.md`
- Figma는 비차단 버전 미러이며 구현 또는 검수의 필수 입력이 아니다.
- 이 문서는 SwiftUI 구현, 제품 재설계, 구독·Paywall, 실제 STT·AI·TTS 연동을 포함하지 않는다.
- 배포 기준은 iOS 17 이상이다. 더 높은 OS에서만 동작하는 시각 효과는 MVP 합격 조건이 아니다.

23개 상태는 통합 82개 상태의 Core Loop 인수 집합이다. 이 문서에 포함되지 않은 통합 상태도 `T-20260728-003`의 구현·회귀 범위에 남으며, 이 문서는 상위 핸드오프나 manifest를 대체하거나 축소하지 않는다.

라우트 계약은 현재 실행 코드인 `apps/ios/CookLog/App/AppRoute.swift`와 `CookLogApp.swift`를 우선한다. `apps/ios/docs/NAVIGATION.md`의 session ID 기반 AI Review 표기는 현재 코드보다 오래된 문서 계약이므로 이번 디자인 인수 기준에는 적용하지 않는다. `T-20260728-003`에서 실제 `[StepPreview]` route를 유지하고 해당 iOS 문서를 함께 동기화한다.

## 2. 충돌 시 우선순위와 편차 승인

아래 순서를 위에서부터 우선한다.

1. 제품 의미, Core Loop, 사용자 데이터·편집값 보존
2. 접근성, 시스템 권한, 오류 회복, 조작 가능성
3. 정보 계층, 필수 콘텐츠·CTA, 상태 전이
4. CookLog 이름 있는 색상·간격·radius 토큰과 공통 컴포넌트 variant
5. `NavigationStack`, safe area, 키보드 회피, Dynamic Type, VoiceOver와 표준 SwiftUI 컨트롤 동작
6. Prototype의 정적 위치와 픽셀 렌더링

따라서 절대 좌표를 복제하기 위해 네이티브 내비게이션, 스크롤, 키보드 회피 또는 접근성을 훼손하면 불합격이다. 반대로 동일한 정보·행동·상태를 유지하는 `NavigationStack`, `List`, `Form`, `Button`, `ProgressView`의 시스템 렌더링 차이는 허용한다.

| 편차 종류 | 예시 | 처리와 승인 |
|---|---|---|
| 의미·흐름 편차 | CTA 목적지 변경, 상태 생략, STEP을 AI 결과로 표시 | 구현 중단. Design Lead와 Product Owner 승인 필요 |
| 데이터·접근성 편차 | 저장 오류 뒤 draft 소실, VoiceOver 조작 불가 | 불허. 수정 후 재검증 |
| 토큰·계층 편차 | 고유 accent 임의 변경, 주요 CTA 우선순위 변경 | Design QA 기록 후 Design Lead 승인 필요 |
| 네이티브 적응 | safe area, back swipe, 시스템 버튼·필드 높이, 키보드 회피 | 사용자 결과가 같으면 구현자 판단 허용 |
| 렌더링 편차 | SF 폰트 자간, 안티앨리어싱, 시스템 spinner 모양 | 결함 아님. 비교 증빙에 `native-rendering`으로 기록 |

승인된 예외는 화면 상태 ID, 사유, 사용자 결과, 승인자, 날짜를 QA 증빙에 남긴다. 구두 합의만으로 계약을 변경하지 않는다.

## 3. 23개 화면·상태 추적 매트릭스

### 3.1 공통 판정 원칙

- 아래 `iOS 상태 조건`은 현재 ViewModel 프로퍼티를 기준으로 한 목표 표현이다. 전용 enum 추가 여부는 iOS Agent가 정한다.
- 로딩, 오류, 빈 상태는 동시에 보이지 않는다. 표의 우선순위대로 한 상태만 주요 상태로 노출한다.
- 오류가 발생해도 재시도로 복구 가능한 사용자 입력, STEP, 저장된 레시피는 버리지 않는다.
- 표의 캡처 ID는 동일 fixture로 Current·Reference·Diff를 묶는 키다.

### 3.2 Home — 4개

| ID / 캡처 | iOS View·상태 조건 | 필수 콘텐츠·CTA | 전이 | 보존·회복 기준 |
|---|---|---|---|---|
| `HOME-CONTENT` / `VQA-HOM-01` | `HomeView`; `isLoading == false`, `errorMessage == nil`, `recipes` 비어 있지 않음 | CookLog 제목, 핵심 메시지, `요리 기록 시작`, 저장 레시피 카드 | 기록 CTA → `AppRoute.cookingLog`; 카드 → `recipeDetail(id)` | refresh 전후 저장 목록과 선택 대상 ID 유지 |
| `HOME-EMPTY` / `VQA-HOM-02` | `isLoading == false`, 오류 없음, `recipes.isEmpty` | 빈 이유, 한 개의 명확한 기록 시작 행동 | 기록 시작 → Cooking Log Empty | 빈 상태를 오류로 표현하지 않음 |
| `HOME-LOADING` / `VQA-HOM-03` | `isLoading == true` | 로딩 표식과 로딩 의미. 기록 CTA는 사용 가능 | 성공 → Content/Empty; 실패 → Error | 기존 목록이 있으면 갑자기 제거하지 않고 refresh 진행을 표시 가능 |
| `HOME-ERROR` / `VQA-HOM-04` | `errorMessage != nil`, 로딩 종료 | 오류 설명, `다시 시도`; 기록 시작은 차단하지 않음 | 재시도 → Loading | 실패가 저장 데이터 삭제로 보이지 않아야 함 |

### 3.3 Cooking Log — 5개

| ID / 캡처 | iOS View·상태 조건 | 필수 콘텐츠·CTA | 전이 | 보존·회복 기준 |
|---|---|---|---|---|
| `LOG-EMPTY` / `VQA-LOG-01` | `CookingLogView`; `.idle`, `stepPreviews.isEmpty`, 오류 없음 | 10초 기록 안내, `10초 기록`, 빈 STEP Preview, 비활성 `AI 정리하기` | 기록 → Recording | session은 현재 화면 생명주기 동안 유지 |
| `LOG-RECORDING` / `VQA-LOG-02` | `recordingState == .recording` | `기록 중`, 남은 초, 비활성 중복 녹음, 기존 STEP | 자동 → Processing | 기존 STEP 유지. 매초 VoiceOver 전체 재낭독 금지 |
| `LOG-PROCESSING` / `VQA-LOG-03` | `recordingState == .processing` | 처리 상태, 첫 기록은 완료 0개+pending STEP 1; 반복은 기존 완료+다음 pending | 성공 → STEP Added; 실패 → Error | 완료 STEP의 순서·원문 유지 |
| `LOG-STEP-ADDED` / `VQA-LOG-04` | `.idle`, `stepPreviews` 비어 있지 않음, 오류 없음 | 누적 STEP, `10초 더 기록`, 활성 `AI 정리하기` | 재기록 → Recording; AI 정리 → `AppRoute.aiReview(stepPreviews)` | 반복 기록마다 order 증가. `CookingLogView.onGenerateRecipeDraft`가 누적한 동일 `[StepPreview]` 배열을 `CookLogApp`의 `.aiReview(stepPreviews)`를 거쳐 `AIReviewViewModel`에 전달 |
| `LOG-ERROR` / `VQA-LOG-05` | `.idle`, `errorMessage != nil` | 권한/녹음 오류 문구, `다시 기록`; 기존 STEP과 AI 정리 가능 여부 | 재시도 → Recording 또는 권한 안내 | 실패한 pending만 제거하고 기존 완료 STEP 보존 |

### 3.4 AI Review — 5개

| ID / 캡처 | iOS View·상태 조건 | 필수 콘텐츠·CTA | 전이 | 보존·회복 기준 |
|---|---|---|---|---|
| `REVIEW-PROCESSING` / `VQA-REV-01` | `AIReviewView`; `isLoading == true` | `STEP Preview를 레시피로 정리하는 중`, `ProgressView` | 성공 → Editable; 실패 → Generation Error | 입력 STEP Preview 유지 |
| `REVIEW-EDITABLE` / `VQA-REV-02` | 로딩 종료, 생성 오류 없음, `isSaving == false`, 저장 오류 없음 | 제목·재료·순서·예상시간·메모, 추가/삭제, 유효할 때 활성 `저장` | 저장 → Saving | 모든 필드를 단일 draft로 유지. 키보드가 현재 필드·저장 경로를 가리지 않음 |
| `REVIEW-GENERATION-ERROR` / `VQA-REV-03` | `errorMessage != nil` | 생성 오류 설명, `다시 시도` | 재시도 → Processing | 원본 STEP Preview 유지 |
| `REVIEW-SAVING` / `VQA-REV-04` | `isSaving == true` | 편집 결과, spinner, `저장 중`, 중복 입력 비활성 | 성공 → `recipeDetail(savedID)`; 실패 → Save Error | 저장 요청 시점 draft 유지, 중복 저장 금지 |
| `REVIEW-SAVE-ERROR` / `VQA-REV-05` | `saveErrorMessage != nil`, `isSaving == false` | 오류 설명, 상단 또는 하단의 명확한 재시도, 전체 편집 폼 | 재시도 → Saving | 제목·재료명·양·순서·시간·메모가 오류 전과 1:1 동일 |

### 3.5 Recipe Detail — 4개

| ID / 캡처 | iOS View·상태 조건 | 필수 콘텐츠·CTA | 전이 | 보존·회복 기준 |
|---|---|---|---|---|
| `DETAIL-CONTENT` / `VQA-DET-01` | `RecipeDetailView`; recipe 존재, 로딩·오류 없음 | 제목, 시간, 재료, 순서, 선택적 메모, `오디오 가이드 시작` | CTA → `audioPlayer(recipeId)` | 표시 순서와 저장된 값 동일. STEP 없으면 CTA 비활성 |
| `DETAIL-LOADING` / `VQA-DET-02` | `isLoading == true` | 로딩 표식과 설명 | 성공 → Content/Not Found; 실패 → Error | 동일 recipe ID 유지 |
| `DETAIL-ERROR` / `VQA-DET-03` | `errorMessage != nil` | 조회 오류, `다시 시도` | 재시도 → Loading | 오류를 삭제로 단정하지 않음 |
| `DETAIL-NOT-FOUND` / `VQA-DET-04` | `isNotFound == true` | 찾을 수 없음과 가능한 이유, 뒤로가기 | 시스템 뒤로가기 → 이전 화면 | 재시도와 not-found 의미를 혼합하지 않음 |

### 3.6 Audio Player — 5개

| ID / 캡처 | iOS View·상태 조건 | 필수 콘텐츠·CTA | 전이 | 보존·회복 기준 |
|---|---|---|---|---|
| `PLAYER-PAUSED` / `VQA-PLY-01` | `AudioPlayerView`; recipe·currentStep 존재, `isPlaying == false` | 제목, `STEP n / total`, 현재 단계, 이전·다시 듣기·재생·다음 | 재생/다시 듣기 → Playing; 이전/다음 → Paused의 인접 단계 | 첫 이전·마지막 다음 disabled. 현재 index 유효 |
| `PLAYER-PLAYING` / `VQA-PLY-02` | 동일하며 `isPlaying == true` | 현재 단계와 정지 우선 컨트롤 | 정지 → Paused; 단계 이동 → 새 단계 Paused | 중복 재생 금지, 화면 이탈 시 stop |
| `PLAYER-LOADING` / `VQA-PLY-03` | `isLoading == true` | 준비 중 설명과 spinner | 성공 → Paused/No Steps/Not Found; 실패 → Error | recipe ID 유지, 컨트롤 숨김 또는 비활성 |
| `PLAYER-ERROR` / `VQA-PLY-04` | `errorMessage != nil` 또는 조회 실패 | 오류 설명, `다시 시도` | 재시도 → Loading | 오류 중 재생 중지, recipe ID 유지 |
| `PLAYER-NO-STEPS` / `VQA-PLY-05` | recipe 존재, `steps.isEmpty` | 재생할 순서 없음과 이유, 뒤로가기 | 시스템 뒤로가기 → Detail | 재생 컨트롤 노출 금지. recipe 자체를 not-found로 취급하지 않음 |

`AudioPlayerView`의 현재 `isNotFound` 분기는 `PLAYER-ERROR` 증빙에 `not-found subtype`으로 함께 기록한다. 승인된 23개 디자인 상태 수를 늘리지는 않되, 찾을 수 없음 문구와 재생 중지 여부를 기능 QA에서 확인한다.

## 4. 필수 흐름과 캡처 지점

### 4.1 기록 Core Loop

아래 순서를 동일 session/fixture로 검증한다. `*`는 필수 시각 캡처다.

```text
HOME-CONTENT *
→ LOG-EMPTY *
→ LOG-RECORDING *
→ LOG-PROCESSING *
→ LOG-STEP-ADDED *
→ LOG-RECORDING
→ LOG-PROCESSING * (기존 STEP + 다음 pending 번호)
→ LOG-STEP-ADDED * (order 증가)
→ REVIEW-PROCESSING *
→ REVIEW-EDITABLE *
→ REVIEW-SAVING *
→ DETAIL-CONTENT *
→ PLAYER-PAUSED *
→ PLAYER-PLAYING *
```

### 4.2 다시 요리 흐름

```text
HOME-CONTENT의 Recipe Card *
→ DETAIL-CONTENT *
→ PLAYER-PAUSED *
```

### 4.3 오류 회복 필수 흐름

- `HOME-ERROR → HOME-LOADING → HOME-CONTENT|EMPTY`
- `LOG-ERROR → LOG-RECORDING → LOG-PROCESSING → LOG-STEP-ADDED`
- `REVIEW-GENERATION-ERROR → REVIEW-PROCESSING → REVIEW-EDITABLE`
- `REVIEW-EDITABLE → REVIEW-SAVE-ERROR → REVIEW-SAVING → DETAIL-CONTENT`; draft 전후 값 비교 필수
- `DETAIL-ERROR → DETAIL-LOADING → DETAIL-CONTENT|NOT-FOUND`
- `PLAYER-ERROR → PLAYER-LOADING → PLAYER-PAUSED|NO-STEPS`

## 5. Foundation의 SwiftUI 대응

### 5.1 색상

CookLog 고유 색상은 Light/Dark 값을 가진 이름 있는 Color Asset 또는 동일 역할의 프로젝트 토큰으로 구현한다. hex를 화면에 반복 작성하지 않는다. CookLog가 소유한 배경·accent·status 슬롯은 아래 값이 단일 합격선이며 system semantic color로 대체할 수 없다.

| 디자인 토큰 | Light / Dark | SwiftUI 역할 |
|---|---|---|
| `color/bg/base` | `#FFFDF8` / `#18171B` | 모든 CookLog 화면의 기본 배경. `systemBackground`, `systemGroupedBackground` 대체 불가 |
| `color/bg/subtle` | `#FAF3E7` / `#222027` | 보조 섹션·STEP 번호 배경. system grouped background 대체 불가 |
| `color/bg/elevated` | `#FFFFFF` / `#302C35` | 카드·입력·떠 있는 영역. secondary system grouped background 대체 불가 |
| `color/bg/accent` | `#C93610` / `#FF9A7A` | CookLog 주요 CTA |
| `color/bg/accent-pressed` | `#A92B0C` / `#FF7A52` | 주요 CTA pressed variant |
| `color/bg/accent-muted` | `#FFE1CF` / `#5C4638` | 약한 accent 배경 |
| `color/text/primary`, `color/text/secondary` | system semantic | 기본·보조 레이블은 `.primary`, `.secondary` 사용 허용. 대비 기준은 별도 유지 |
| `color/border/default`, `color/border/strong` | system semantic | 단순 구분선은 `separator`/`opaqueSeparator` 사용 허용. CookLog 커스텀 outline은 manifest 토큰 사용 |
| `color/icon/primary` | system semantic | 기본 레이블과 같은 의미의 시스템 아이콘은 `.primary` 사용 허용 |
| `color/status/success` | `#176B4A` / `#7EE0B4` | 성공. system green 대체 불가 |
| `color/status/error` | `#B42318` / `#FF8C84` | 오류. system red 대체 불가 |
| `color/focus` | `#7057D9` / `#9B8AF0` | CookLog 커스텀 포커스 표시 |

system semantic color는 기본·보조 레이블(`.primary`, `.secondary`), 구분선(`Color(.separator)`), 그리고 네이티브 컨트롤이 내부적으로 그리는 배경·fill·material에만 사용한다. 화면과 CookLog 카드·섹션의 배경 슬롯에는 `systemBackground`, `systemGroupedBackground`, `secondarySystemGroupedBackground`를 사용하지 않는다. 네이티브 컨트롤의 시스템 렌더링은 외부 CookLog 배경 토큰 위에서 동작하며, CookLog accent·status로 지정된 슬롯을 임의 system blue/green/red로 바꾸지 않는다.

### 5.2 타이포그래피

Inter 고정 폰트 설치는 요구하지 않는다. SF 시스템 폰트와 Dynamic Type을 우선한다.

| 디자인 역할 | 기본 SwiftUI 대응 | 합격 기준 |
|---|---|---|
| Display | `.largeTitle.bold()` | 화면 최상위 메시지, 확대 시 줄바꿈 |
| Title | `.title.bold()` 또는 내비게이션 제목 | 화면/콘텐츠 제목 계층 유지 |
| Heading | `.title3.bold()` 또는 `.headline` | 섹션 제목이 Body와 구분 |
| Body | `.body` | 본문 생략 없이 확대 가능 |
| Label | `.callout.weight(.semibold)` 또는 `.headline` | CTA·필드 레이블 의미 유지 |
| Caption | `.caption.weight(.semibold)` | 보조 정보이며 필수 의미를 단독 축소하지 않음 |

타이머의 rounded/monospaced digit처럼 정보 판독에 필요한 장식은 `relativeTo:`가 있는 scalable font 또는 semantic style을 사용한다. 필수 문구에 고정 높이와 강제 한 줄을 사용하지 않는다.

### 5.3 간격·radius·레이아웃

- spacing은 `4, 8, 12, 16, 24, 32, 48pt`, radius는 `8, 12, 16, 24pt` 토큰을 우선한다.
- 화면 기본 좌우 여백은 20pt를 기준으로 하되 375pt 폭과 Dynamic Type에서 콘텐츠 보존을 위해 16pt까지 적응할 수 있다.
- Prototype의 status bar, home indicator, 브라우저 frame은 구현 에셋이 아니다.
- `NavigationStack`의 safe area와 interactive back swipe를 보존한다.
- 하단 CTA·Player Controls를 `safeAreaInset`으로 고정할 수 있지만 마지막 콘텐츠와 키보드 포커스를 가리면 안 된다.
- 절대 좌표와 기기별 수동 status bar padding을 사용하지 않는다.

## 6. 공통 컴포넌트·에셋 인계

| 디자인 컴포넌트 | SwiftUI 구현 단위 | 필수 variant와 계약 |
|---|---|---|
| Foundation | 프로젝트 Color/spacing/radius/typography token | Light/Dark 동적 대응, 화면별 하드코딩 금지 |
| Button | `Button`, `ButtonStyle`, 필요 시 `ProgressView` 조합 | Primary/Secondary × Default/Pressed/Disabled/Loading; 최소 44×44, 로딩 중 중복 입력 금지 |
| Record Control | `Button` 기반 record panel + timer + 상태 문구 | Idle/Recording/Processing/Error; 색상 외 문구·타이머, 기존 STEP 보존 |
| Recipe Card | 재사용 row/card + `Button` 또는 `NavigationLink` | Default/Pressed, Audio Available/Unavailable; 카드 전체 한 타깃 |
| STEP Row | `StepPreviewRowView` 계열 | Default/Processing/Error; order와 STT 원문, pending 번호 정확성 |
| Status Banner | 재사용 banner view | Info/Success/Error; 아이콘·제목·설명·선택 액션, 접근성 한 그룹 |
| Form Field | `TextField`, `TextEditor`, 필요 시 `FocusState` wrapper | Default/Focused/Error/Disabled, Single/Multiple; 오류 문구와 draft binding |
| Player Controls | `AudioPlayerControlBarView` 계열 | Paused/Playing, Previous/Next enabled/disabled; 정지/재생이 가장 높은 우선순위 |

### 6.1 SF Symbols

SF Symbols는 아래 이름 또는 의미가 같은 공식 심볼 이름으로만 사용한다. codepoint, 임의 glyph, 텍스트 화살표 추정은 금지한다.

| 의미 | 현재 iOS 이름 |
|---|---|
| 기록 | `mic.fill` |
| AI 정리 | `sparkles` |
| 레시피 이동 | `chevron.right` |
| 시간 | `clock` |
| 오디오 시작 | `play.circle.fill` |
| 항목 추가/삭제 | `plus`, `trash` |
| 이전 단계 | `backward.end.fill` |
| 현재 단계 다시 듣기 | `gobackward` |
| 재생/정지 | `play.fill`, `stop.fill` |
| 다음 단계 | `forward.end.fill` |

아이콘 버튼에는 보이는 문구가 없어도 한국어 VoiceOver label, 필요 시 hint와 value를 제공한다. 심볼 모양의 OS별 미세 차이는 허용하지만 의미 변경은 허용하지 않는다.

### 6.2 별도 export 정책

- v1은 텍스트 워드마크와 SF Symbols를 사용하므로 필수 별도 이미지 export가 없다.
- 앱 아이콘, 그래픽 로고, 장식 일러스트는 MVP 제외다.
- 향후 시스템 심볼로 대체할 수 없는 자산은 이름·용도·Light/Dark 필요 여부·원본 frame을 기록하고 vector PDF 또는 Xcode 지원 SVG로 전달한다.
- 스크린샷, status bar, home indicator를 이미지로 잘라 앱에 넣지 않는다.

## 7. iOS 네이티브 동작 인수 기준

- 내비게이션: `NavigationStack`과 `AppRoute`를 유지한다. 주요 흐름을 modal 안에 가두지 않는다.
- 뒤로가기: 시스템 back 버튼과 edge swipe가 동작하고, 취소 확인이 제품상 필요한 경우만 별도 조율한다.
- 스크롤: 375×667과 접근성 글자 크기에서 모든 정보와 CTA에 스크롤로 도달한다.
- 키보드: AI Review의 활성 필드, 오류 문구, 저장 경로가 키보드에 영구 가려지지 않는다. 시스템 keyboard avoidance를 우선한다.
- 컨트롤: `Button`, `TextField`, `TextEditor`, `ProgressView`의 기본 입력·포커스·disabled 의미를 보존한다.
- 시스템 상태: 마이크 권한 거부는 오류 상태에서 원인과 회복 방법을 알려야 한다.
- 모션: Reduce Motion 사용 시 필수 정보 전이는 유지하고 파형·장식 전환은 축소하거나 제거한다.

## 8. 접근성 합격 기준

### 8.1 Dynamic Type

기본 글자 크기와 `Accessibility 3`에서 각 23개 상태를 확인한다.

- 필수 텍스트가 잘리거나 겹치지 않는다.
- 버튼 제목이 필요하면 여러 줄 또는 세로 재배치되며 터치 영역 44×44pt를 유지한다.
- 가로 control row는 의미 순서를 유지한 채 세로/다단 재배치할 수 있다.
- AI Review 전체 필드와 저장 CTA, Player 현재 단계와 모든 control에 도달한다.
- 제목 두 줄 제한은 정보 손실이 없는 카드 요약에만 허용하며 상세 화면 제목은 전체 표시한다.

### 8.2 VoiceOver

- 읽기 순서는 내비게이션 제목 → 상태/핵심 콘텐츠 → 주요 CTA → 보조 콘텐츠 순으로 시각 계층과 일치한다.
- 카드 전체를 하나의 조작 요소로 묶고 내부 장식 아이콘은 중복 낭독하지 않는다.
- 로딩, 오류, 저장 결과, STEP 추가, 현재 단계 변경은 상태 의미를 알린다.
- 녹음 카운트다운은 매초 화면 전체를 알리지 않는다. 시작, 필요한 중간 정보, 종료/처리를 짧게 알린다.
- 이전/다음 disabled, 재생/정지 선택 상태, `STEP n / total`을 label/value/trait로 식별한다.
- 색상만으로 Recording, Error, Disabled, Playing을 구분하지 않는다.

### 8.3 대비와 터치

- 일반 텍스트 4.5:1 이상, 큰 텍스트와 큰 아이콘 3:1 이상이다.
- CookLog 고유 조합은 handoff에 기록된 검증 대비를 유지한다.
- 모든 조작 요소의 실질 hit area는 44×44pt 이상이다. 인접 아이콘 버튼이 같은 hit area를 겹치지 않는다.

## 9. Visual QA 실행 계약

### 9.1 필수 조합

| 축 | 필수 값 |
|---|---|
| 기기 viewport | 390×844, 375×667 |
| Appearance | Light, Dark |
| 글자 크기 | 기본, Accessibility 3 |
| 언어 | 한국어 |
| 방향 | Portrait |

23개 상태 전부는 390×844·Light·기본 글자 크기로 캡처한다. 375×667, Dark, Accessibility 3은 각 화면의 Content/Editable/Paused 계열과 레이아웃 위험 상태를 최소 포함하고, 아래 상태는 반드시 추가 캡처한다.

- `HOME-CONTENT`, `HOME-EMPTY`
- `LOG-RECORDING`, `LOG-PROCESSING`, `LOG-STEP-ADDED`, `LOG-ERROR`
- `REVIEW-EDITABLE`, `REVIEW-SAVING`, `REVIEW-SAVE-ERROR`
- `DETAIL-CONTENT`, `DETAIL-ERROR`
- `PLAYER-PAUSED`, `PLAYER-PLAYING`, `PLAYER-NO-STEPS`

### 9.2 비교 절차

1. Reference와 Current에 동일한 fixture, 상태 ID, viewport, Appearance, 글자 크기를 사용한다.
2. status bar 시간·네트워크, caret, spinner frame, 애니메이션은 비교 마스크로 제외한다.
3. Current와 Reference를 동일 scale로 겹친 Diff를 만든다.
4. 자동 픽셀 diff만으로 합격시키지 않고 토큰·정보 계층·조작·접근성을 함께 판정한다.
5. 시스템 렌더링 예외는 `native-rendering`으로 표시하고 사용자 결과가 같은지 기록한다.

### 9.3 허용 편차

| 항목 | 합격 기준 |
|---|---|
| CookLog 색상 토큰 | 이름과 manifest Light/Dark 값 정확히 일치. 특히 `bg/base`, `bg/subtle`, `bg/elevated`, accent·status는 system semantic 대체 불가. 색 관리·안티앨리어싱에 따른 스크린샷 채널 ±2만 허용 |
| semantic system color | 기본·보조 레이블, 구분선, 네이티브 컨트롤 내부 슬롯에서만 역할 일치 필수. CookLog 고유 배경·accent·status 슬롯에 사용하면 불합격. 허용 슬롯의 OS별 실제 RGB 차이는 허용 |
| spacing | 토큰 값 일치. 커스텀 영역 실측 ±2pt, 네이티브 container 적응 ±4pt 허용 |
| radius·border | 토큰 일치. 실측 radius ±1pt, 1pt border ±0.5pt 허용 |
| 정렬 | 동일 기준선/edge의 커스텀 요소 ±2pt. 줄바꿈으로 인한 세로 이동은 허용 |
| typography | semantic text style·weight·계층 일치. glyph·자간 픽셀 일치는 요구하지 않음 |
| 시스템 컨트롤 | HIG 동작·역할·접근성 일치. OS별 크기·spinner·material 차이는 허용 |
| 터치 영역 | 44×44pt 미만 0건. 허용 편차 없음 |
| 텍스트·CTA 도달 | 잘림·겹침·키보드 영구 가림·도달 불가 0건 |
| 대비 | 4.5:1/3:1 미달 0건. 허용 편차 없음 |
| 상태·데이터 | 누락, 잘못된 전이, draft/STEP 유실 0건 |

### 9.4 결함 심각도

| 심각도 | 기준 | 예시 | 합격 영향 |
|---|---|---|---|
| Blocker | Core Loop 진행 불가, 데이터 손실, 앱 사용 불가 | 저장 후 레시피 소실, CTA 무반응 | 즉시 불합격 |
| High | 필수 상태·CTA·의미·접근성 또는 대비 위반 | Processing 번호 오류, 키보드가 저장 차단, VoiceOver 조작 불가 | 불합격 |
| Medium | 토큰·계층·재사용 계약의 명확한 편차 | accent 오용, spacing 허용치 초과, 잘못된 radius | 원칙상 불합격; 승인 예외만 통과 |
| Low | 사용자 결과에 영향 없는 미세 렌더링 차이 | 그림자·안티앨리어싱 미세 차이 | 기록 후 통과 가능 |

### 9.5 증빙 형식

```text
상태 ID / 캡처 ID:
빌드 또는 commit:
기기·OS·scale:
Appearance / 글자 크기 / 언어:
Fixture와 진입 경로:
Reference / Current / Diff 경로:
실측 항목과 편차:
기능·상태 보존 결과:
VoiceOver / Dynamic Type 결과:
예외 분류·사유·승인자:
심각도 / 판정 / 담당자:
```

## 10. 구현 완료 체크리스트

### 상태와 흐름

- [ ] 23개 상태가 표의 조건·필수 콘텐츠·CTA와 1:1 대응한다.
- [ ] 기록 Core Loop, 다시 요리, 여섯 오류 회복 흐름이 통과한다.
- [ ] 반복 Processing의 pending STEP 번호와 완료 STEP 보존이 정확하다.
- [ ] Save Error와 Saving에서 AI Review draft 전체가 보존된다.
- [ ] 저장 후 Recipe Detail과 Home refresh에서 동일 recipe ID를 확인한다.
- [ ] Audio Player 첫/마지막 경계, replay, play/stop, 화면 이탈 stop이 동작한다.

### 시각·플랫폼

- [ ] CookLog 토큰을 공통 구현하고 화면별 hex 반복이 없다.
- [ ] 공통 컴포넌트와 variant를 재사용한다.
- [ ] 390×844와 375×667의 Light/Dark를 검증한다.
- [ ] safe area, 시스템 back swipe, 키보드 회피를 보존한다.
- [ ] Prototype의 절대 좌표·가짜 device chrome을 구현하지 않는다.

### 접근성·증빙

- [ ] 기본과 Accessibility 3에서 필수 정보·CTA가 잘리지 않는다.
- [ ] VoiceOver 순서, label/value/trait, 상태 알림을 확인한다.
- [ ] 44×44pt, 대비, 색상 외 상태 표현을 확인한다.
- [ ] 23개 기본 캡처와 위험 조합 추가 캡처에 동일 fixture를 사용한다.
- [ ] 모든 편차를 심각도와 승인 경계에 따라 기록한다.

## 11. Design QA 인계 판정

Design QA는 다음 조건을 모두 만족할 때 이 계약 자체를 `verification_passed`로 판정한다.

1. 23개 상태 ID가 중복·누락 없이 각 iOS ViewModel 조건과 대응한다.
2. 작은 화면, Light/Dark, Dynamic Type, VoiceOver의 합격 조건이 실행 가능하다.
3. 디자인 고유 토큰과 네이티브 시스템 렌더링의 허용 경계가 분리되어 있다.
4. 허용 편차, 심각도, 증빙 형식과 예외 승인자가 명시되어 있다.
5. `T-20260728-003` 구현자가 추가 제품 해석 없이 작업 범위를 산정할 수 있다.

이 문서 검증은 iOS 화면 구현의 Visual QA 통과를 대신하지 않는다. 실제 구현 완료 후 동일 계약으로 다시 캡처·기능·접근성 검증한다.
