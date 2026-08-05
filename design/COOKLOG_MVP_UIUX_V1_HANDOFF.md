# CookLog MVP UI/UX v1 핸드오프

작성일: 2026-07-28
최종 업데이트: 2026-08-04
상태: Design QA 독립 재검증 및 Design Lead 완료 확정
기준 Task: `T-20260728-002`

## 1. 원본

- UI Source of Truth: `design/prototype/`
- 구조 기준: `design/figma-build/manifest.json`
- Figma 미러: [CookLog — MVP UI/UX v1](https://www.figma.com/design/tAvYn6TatLKb3SXDjkH1hn)
- 제품 기준: `docs/product/CookLog_PRD_v2.md`
- 사용자 흐름: `docs/product/CookLog_USER_FLOW.md`
- 와이어프레임: `docs/product/CookLog_WIREFRAME.md`

로컬 Prototype은 UI의 시각적 Source of Truth이고, 이 문서는 구현 범위와 상태를 빠르게 확인하는 텍스트 핸드오프입니다.

Figma 동기화 재개 기준은 `design/figma-build/`에 있습니다.
2026-08-03 MCP 쓰기 가능 상태를 확인했으며, Design QA와 Design Lead 완료 검토를 통과한 로컬 원본을 별도 승인된 후속 Task에서 반영하는 버전 미러로 유지합니다.

## 2. 확정 방향

- 시각 방향: `A — Warm Kitchen Journal`
- 테마: Light와 Dark 모두
- 브랜드: 텍스트 워드마크만 포함
- 앱 아이콘과 그래픽 로고: v1 제외

CookLog는 레시피 탐색 서비스보다 개인 요리 기록 도구에 가깝습니다. 따뜻한 크림색 바탕, 식욕을 해치지 않는 오렌지 포인트, 잉크색 본문으로 개인 주방 노트의 감정을 전달합니다.

## 3. Figma Starter 제한

젤리공방 Starter 플랜은 한 Variable Collection 안에서 Light/Dark 복수 모드를 지원하지 않습니다.

- `CookLog / Color Light`와 `CookLog / Color Dark`를 별도 컬렉션으로 관리합니다.
- 두 컬렉션은 동일한 Semantic Token 이름을 사용합니다.
- iOS 구현에서는 두 컬렉션을 하나의 동적 `Color` 토큰 체계로 통합합니다.
- 이 제한은 화면 결과나 접근성 범위를 축소하지 않습니다.

## 4. Foundation

### Color Primitives

| 토큰 | 값 | 용도 |
|---|---:|---|
| `cream/50` | `#FFFDF8` | Light 기본 배경 |
| `cream/100` | `#FAF3E7` | Light 보조 배경 |
| `cream/200` | `#F2E3CE` | Light 경계 |
| `orange/100` | `#FFE1CF` | 포인트 약한 배경 |
| `orange/300` | `#FF9A7A` | Dark 주요 CTA |
| `orange/400` | `#FF7A52` | Dark 눌림 |
| `orange/500` | `#C93610` | Light 주요 CTA·소형 강조 텍스트 |
| `orange/600` | `#A92B0C` | Light 눌림 |
| `ink/500` | `#847064` | 보조 정보 |
| `ink/700` | `#5C4638` | 보조 본문 |
| `ink/900` | `#2D1C14` | 주요 본문 |
| `dark/800` | `#302C35` | Dark elevated |
| `dark/900` | `#222027` | Dark subtle |
| `dark/950` | `#18171B` | Dark base |
| `white/1000` | `#FFFFFF` | 반전 텍스트·카드 |
| `green/300` | `#7EE0B4` | Dark 성공 |
| `green/500` | `#176B4A` | Light 성공 |
| `red/300` | `#FF8C84` | Dark 오류 |
| `red/500` | `#B42318` | Light 오류 |
| `violet/300` | `#9B8AF0` | Dark 접근성 포커스 |
| `violet/500` | `#7057D9` | Light 접근성 포커스 |

### Semantic Color

Light와 Dark 컬렉션에 아래 이름을 동일하게 둡니다.

- `color/bg/base`
- `color/bg/subtle`
- `color/bg/elevated`
- `color/bg/accent`
- `color/bg/accent-pressed`
- `color/bg/accent-muted`
- `color/text/primary`
- `color/text/secondary`
- `color/text/on-accent`
- `color/border/default`
- `color/border/strong`
- `color/icon/primary`
- `color/status/success`
- `color/status/error`
- `color/focus`

### Spacing

| 토큰 | 값 |
|---|---:|
| `spacing/2xs` | 4 |
| `spacing/xs` | 8 |
| `spacing/sm` | 12 |
| `spacing/md` | 16 |
| `spacing/lg` | 24 |
| `spacing/xl` | 32 |
| `spacing/2xl` | 48 |

### Radius

| 토큰 | 값 |
|---|---:|
| `radius/xs` | 8 |
| `radius/sm` | 12 |
| `radius/md` | 16 |
| `radius/lg` | 24 |
| `radius/full` | 999 |

### Typography

Figma 제작 폰트는 `Inter`를 사용합니다. iOS 구현은 Dynamic Type이 적용되는 시스템 폰트를 우선하고 아래 크기와 계층을 대응합니다.

| 스타일 | 크기 / 행간 | 굵기 | iOS 대응 |
|---|---:|---|---|
| `Display` | 38 / 46 | Bold | `.largeTitle` 확장 |
| `Title` | 28 / 34 | Bold | `.title` |
| `Heading` | 20 / 26 | Bold | `.title3` |
| `Body` | 16 / 24 | Regular | `.body` |
| `Label` | 15 / 20 | Semi Bold | `.callout` |
| `Caption` | 12 / 18 | Semi Bold | `.caption` |

본문과 핵심 버튼은 Dynamic Type에서 두 줄까지 확장할 수 있어야 합니다. 높이를 고정해 텍스트를 자르지 않습니다.

## 5. 공통 컴포넌트

### Button

- Style: `Primary`, `Secondary`
- State: `Default`, `Pressed`, `Disabled`, `Loading`
- 기본 높이: 56pt
- 최소 터치 영역: 44×44pt
- Primary는 `orange/500`, Pressed는 `orange/600`
- Dark Primary는 `orange/300`, Dark Pressed는 `orange/400`, 텍스트는 `ink/900`
- Disabled는 대비와 상태 인지를 함께 유지하도록 배경·텍스트를 모두 변경
- Loading은 입력을 비활성화하고 spinner와 `저장 중` 문구를 함께 노출

### Record Control

- State: `Idle`, `Recording`, `Processing`, `Error`
- Idle: `10초 요리 기록 시작`
- Recording: 남은 초를 가장 큰 정보로 표시
- Processing: `기록을 STEP으로 바꾸는 중`
- Error: 재녹음 CTA와 짧은 오류 설명
- 녹음 중에는 색상 외에 타이머·상태 문구·파형 변화로 상태를 구분

### Recipe Card

- 제목, 예상 시간, 단계 수, 오디오 사용 가능 여부
- 카드 전체를 하나의 터치 타깃으로 사용
- 제목은 최대 두 줄, 메타 정보는 줄바꿈 가능
- Pressed는 `border-strong`, `bg/subtle`, 그림자 제거, 1pt 하강을 함께 적용

### STEP Row

- 순서 번호와 STT 원문
- STEP Preview임을 명확히 하고 AI가 정리한 결과처럼 보이지 않게 함
- STT 처리 중 skeleton과 오류 상태 제공
- 번호 텍스트는 `color/bg/accent`, 번호 배경은 `color/bg/subtle`을 사용해 작은 텍스트도 Light `4.74:1`, Dark `7.79:1`을 유지

### Status Banner

- Type: `Info`, `Success`, `Error`
- 아이콘, 제목, 설명, 선택적 액션
- 색상만으로 상태를 전달하지 않음
- Info는 `text/secondary + bg/subtle`, Success·Error는 상태색 8% tint 배경과 1pt 테두리를 사용

### Form Field

- State: `Default`, `Focused`, `Error`, `Disabled`
- AI Review의 제목, 재료, 순서, 예상 시간, 메모에 사용
- 오류는 필드 하단 텍스트로 설명
- Focused는 focus 토큰 3pt outline, Error는 error 테두리와 오류 문구, Disabled는 `bg/subtle`과 조작 불가 속성을 함께 사용

### Player Controls

- 이전, 다시 듣기, 재생/정지, 다음
- 재생/정지는 가장 큰 시각 우선순위
- 단계 이동 버튼의 비활성 상태를 명확히 표시
- 모든 아이콘 버튼에 VoiceOver Label 필요
- 이전·다음 이동과 다시 듣기는 `aria-live`에 해당하는 상태 문구로 결과를 알림
- 첫 단계 Previous와 마지막 단계 Next는 실제 disabled 속성, 낮은 강조도, 금지 커서를 함께 사용

## 6. 화면별 구현 기준

### Home

- 상단 워드마크
- `오늘의 맛을 잊지 않도록` 핵심 메시지
- `10초 요리 기록 시작` Primary CTA
- 최근 레시피
- 저장된 레시피 목록 진입
- 빈 상태에서는 기록 시작 CTA를 반복 노출하지 않고 하나의 명확한 다음 행동만 제공

### Cooking Log

- 현재 기록 상태와 남은 시간
- 큰 Record Control
- STEP Preview 누적 목록
- `AI 정리하기`
- STEP이 없으면 `AI 정리하기` 비활성
- 녹음 중, STT 처리 중, STT 오류 상태
- 사용자는 이 화면에서 레시피 폼을 직접 작성하지 않음
- Processing은 1.6초 뒤 자동으로 STEP Added로 전환되며 `STEP 추가 완료 보기`로 즉시 전환할 수도 있음
- STEP Added에는 `10초 더 기록`과 `AI 정리하기`를 함께 제공해 반복 기록을 닫힌 흐름으로 구성
- 첫 Processing은 완료 STEP 없이 pending `STEP 1`만 표시하고, 반복 기록부터 기존 완료 STEP 뒤에 다음 pending 번호를 표시

### AI Review

- AI 처리 중
- 생성 오류와 다시 시도
- 제목, 재료, 조리 순서, 예상 시간, 메모 편집
- 저장 중과 저장 오류
- 키보드 노출 시 현재 필드와 저장 행동이 가려지지 않도록 ScrollView 기반 구성
- 저장은 `Editable -> Saving -> Recipe Detail` 순서를 반드시 거침
- Save Error는 편집값을 유지하고 상단 `저장 다시 시도`와 하단 저장 버튼으로 복구
- 제목, 재료 이름·양, 조리 순서, 예상 시간, 메모는 하나의 draft 상태로 관리하며 Editable, Saving, Save Error 전환에서 모두 보존
- 재료 추가·삭제 컨트롤은 Prototype에서 실제 목록 상태를 변경

### Recipe Detail

- 제목과 예상 시간
- 재료
- 조리 순서
- 메모
- `오디오 가이드 시작` 고정 또는 화면 하단의 명확한 CTA
- 로딩, 조회 오류, 찾을 수 없음

### Audio Player

- 레시피 제목
- `현재 단계`와 `STEP n / total`
- 현재 단계 본문
- 이전, 다시 듣기, 재생/정지, 다음
- 첫 단계의 이전과 마지막 단계의 다음은 비활성
- 로딩, 준비 오류, 단계 없음

## 7. 핵심 Prototype 흐름

```text
Home
-> Cooking Log / Empty
-> Cooking Log / Recording
-> Cooking Log / Processing
-> Cooking Log / STEP Added
-> Cooking Log / Recording
-> Cooking Log / Processing
-> Cooking Log / STEP Added
-> AI Review / Processing
-> AI Review / Editable
-> AI Review / Saving
-> Recipe Detail
-> Audio Player / Paused
-> Audio Player / Playing
```

다시 요리 흐름:

```text
Home / Recipe Card
-> Recipe Detail
-> Audio Player / Paused
```

저장 실패 복구 흐름:

```text
AI Review / Editable
-> AI Review / Save Error
-> AI Review / Saving
-> Recipe Detail
```

화면 상태는 Home 4개, Cooking Log 5개, AI Review 5개, Recipe Detail 4개, Audio Player 5개로 총 23개입니다. `design/prototype/gallery.html`에서 핵심·예외·작은 화면을, `design/prototype/components.html`에서 공통 컴포넌트 상태를 비교합니다.

## 8. 접근성

- 일반 텍스트 대비 WCAG AA 4.5:1 이상
- 큰 텍스트 대비 3:1 이상
- 최소 터치 영역 44×44pt
- 색상 외에 아이콘·문구·형태로 상태 중복 전달
- VoiceOver 순서는 화면의 시각 순서와 일치
- 녹음 남은 시간은 매초 전체 화면을 다시 읽지 않도록 접근성 알림 빈도를 제어
- `Reduce Motion`에서는 파형·전환 애니메이션을 축소하거나 제거
- 작은 화면은 iPhone SE 3세대 375×667pt를 하한으로 검증

### 검증된 대비

| 조합 | 대비 |
|---|---:|
| Light CTA `#FFFFFF` / `#C93610` | `5.23:1` |
| Light 강조 텍스트 `#C93610` / `#FFFDF8` | `5.14:1` |
| Light 성공 `#176B4A` / `#ECF3F1` | `5.76:1` |
| Light 오류 `#B42318` / `#F9EDED` | `5.75:1` |
| Light STEP `#C93610` / `#FAF3E7` | `4.74:1` |
| Dark CTA `#2D1C14` / `#FF9A7A` | `7.89:1` |
| Dark 성공 `#7EE0B4` / `#363A3F` | `7.20:1` |
| Dark 오류 `#FF8C84` / `#41343B` | `5.25:1` |
| Dark STEP `#FF9A7A` / `#222027` | `7.79:1` |

### 실제 Viewport

- 기본: `390×844`, URL 기본값 또는 `viewport=regular`
- 작은 iPhone: `375×667`, `viewport=small`
- 작은 프레임은 CSS transform 축소를 사용하지 않고 기기 폭·높이, 여백, 제목, 녹음 컨트롤, 스크롤 영역을 실제로 재배치

### Design QA 2차 재작업 반영

- `DQA-HIGH-002`: STEP 번호와 STEP 칩 배경을 `color/bg/subtle`로 변경해 Light·Dark 모두 WCAG AA 일반 텍스트 기준을 통과
- `DQA-HIGH-003`: AI Review 전체 편집 항목을 draft 상태로 연결해 Save Error와 Saving에서 수정값 보존
- `DQA-MEDIUM-004`: 첫 Processing의 완료 STEP 0개·pending STEP 1개와 반복 Processing의 번호 증가를 실제 세션 상태에 맞게 수정

## 9. 제외

- 로그인과 회원가입
- 공유와 커뮤니티
- Import, OCR, AI 챗
- 음성 명령
- 앱 아이콘과 그래픽 로고
- Android 전용 화면

## 10. 구독·Paywall 후속 확장

`T-20260728-011`에서 MVP Core Loop와 분리된 로컬 구독 UX 원본을 추가했다.

- 실행형 원본: `design/prototype/subscription.html`
- UX 명세: `design/subscription/PAYWALL_UX_SPEC.md`
- 상태 매트릭스: `design/subscription/PAYWALL_STATE_MATRIX.md`
- 카피 토큰: `design/subscription/PAYWALL_COPY_TOKENS.md`
- 가격·quota·초기화 시점은 `T-20260728-010` 완료 전 가설값이며 Core MVP 확정 범위에는 포함되지 않는다.
- 구독 종료 후에도 기존 로컬 레시피와 기본 오디오 가이드를 유지한다.

## 11. iOS 구현 인계 주의사항

상세 구현·검수 계약은 `design/IOS_MVP_IMPLEMENTATION_ACCEPTANCE.md`를 단일 기준으로 사용합니다. 이 계약은 23개 상태의 실제 SwiftUI ViewModel 조건, 네이티브 관례 우선 범위, Dynamic Type·VoiceOver, Visual QA 허용 편차와 증빙 형식을 정의합니다.

- 제품 의미·흐름·상태 보존은 디자인 계약을 따르고, 동일한 사용자 결과를 유지하는 시스템 렌더링과 동작은 iOS 관례를 우선합니다.
- UI 시각 원본은 `design/prototype/`이며 Figma 미러 완료 여부는 구현 조건이 아닙니다.
- CookLog 화면·카드·섹션 배경은 `color/bg/base`, `color/bg/subtle`, `color/bg/elevated`의 Light/Dark 값을 정확히 사용하며 system background로 대체하지 않습니다. System semantic color는 레이블·구분선·네이티브 컨트롤 내부 슬롯에 한정합니다.
- AI Review 전이는 현재 코드의 `AppRoute.aiReview([StepPreview])`를 기준으로 하고 누적한 동일 STEP 배열을 전달합니다. 오래된 `apps/ios/docs/NAVIGATION.md` 표기는 iOS 적용 Task에서 동기화합니다.
- SwiftUI 시스템 컨트롤의 접근성 동작을 보존합니다.
- Figma의 Inter는 시각 기준이며 앱에서는 시스템 폰트와 Dynamic Type을 사용합니다.
- 별도 Light/Dark Figma 컬렉션은 iOS에서 하나의 동적 Color Asset 또는 `Color` 토큰으로 통합합니다.
- iOS 코드 적용은 `T-20260728-003`에서 수행합니다.
