# CookLog MVP UI/UX v1 핸드오프

작성일: 2026-07-28
최종 업데이트: 2026-08-04
상태: T-008~014 통합 반영·접근성 검증 준비 완료
기준 Task: `T-20260729-002`, 하위 `T-20260729-008~014`

## 1. 구현 Source of Truth 우선순위

구현 판단은 아래 순서를 따릅니다.

1. `design/prototype/` — 공식 시각적 UI Source of Truth
2. `design/figma-build/manifest.json` — 토큰·컴포넌트·화면 상태 구조 기준
3. [CookLog — MVP UI/UX v1](https://www.figma.com/design/tAvYn6TatLKb3SXDjkH1hn) — 로컬 원본과 동기화된 버전 미러로만 참고

- 제품 기준: `docs/product/CookLog_PRD_v2.md`
- 사용자 흐름: `docs/product/CookLog_USER_FLOW.md`
- 와이어프레임: `docs/product/CookLog_WIREFRAME.md`

Figma가 미동기화 상태이거나 로컬 원본과 충돌하면 `design/prototype/`과 `design/figma-build/manifest.json`을 우선합니다. iOS Agent는 현재 Figma 화면을 최우선 구현 기준으로 사용하면 안 됩니다.

이 문서는 위 두 로컬 원본의 구현 범위와 상태를 빠르게 확인하는 텍스트 핸드오프입니다. Figma 한도 갱신 후 재개 기준은 `design/figma-build/`에 있으며, Figma는 호출 가능할 때 로컬 원본을 반영하는 버전 미러로 유지합니다.

## 2. 확정 방향

- 시각 방향: `A — Warm Kitchen Journal`
- 테마: Light와 Dark 모두
- 브랜드: 텍스트 워드마크만 포함
- 앱 아이콘과 그래픽 로고: v1 제외

CookLog는 레시피 탐색 서비스보다 개인 요리 기록 도구에 가깝습니다. 따뜻한 크림색 바탕, 식욕을 해치지 않는 오렌지 포인트, 잉크색 본문으로 개인 주방 노트의 감정을 전달합니다.

## 3. Figma Starter 제한

젤리공방 Starter 플랜은 한 Variable Collection 안에서 Light/Dark 복수 모드를 지원하지 않습니다.

- 현재 Figma 화면은 MCP 월간 호출 한도로 최신 로컬 Prototype과 Manifest를 아직 동기화하지 못했습니다.
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

### AI Review

- AI 처리 중
- 생성 오류와 다시 시도
- 제목, 재료, 조리 순서, 예상 시간, 메모 편집
- 저장 중과 저장 오류
- 키보드 노출 시 현재 필드와 저장 행동이 가려지지 않도록 ScrollView 기반 구성
- 저장은 `Editable -> Saving -> Recipe Detail` 순서를 반드시 거침
- Save Error는 편집값을 유지하고 상단 `저장 다시 시도`와 하단 저장 버튼으로 복구
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
- 첫 공개 출시 필수 핸즈프리 7개 명령은 항상 보이는 버튼과 1:1로 대응합니다.
- 마이크·음성인식 권한을 분리하고, 최초 맥락 안내·거부·설정 이동·명시적 재시작 상태를 제공합니다.
- 전화·Siri·다른 오디오·Bluetooth·백그라운드·직접 잠금 중단 후 자동 재개하지 않으며 현재 단계와 재생 위치를 보존합니다.
- 로컬 TTS 오류에도 레시피 내용·단계 이동·가이드 종료를 유지합니다.

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

화면 상태는 Home 9개, All Recipes 5개, Cooking Log 14개, AI Review 12개, Recipe Detail 7개, Audio Player 24개, App Info 11개로 총 82개입니다. `design/prototype/gallery.html`에서 핵심·예외·작은 화면을, `design/prototype/components.html`에서 13개 공통 컴포넌트 상태를 비교합니다.

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
| Light STEP 텍스트 `#C93610` / `#FAF3E7` | `4.74:1` |
| Light 성공 `#176B4A` / `#ECF3F1` | `5.76:1` |
| Light 오류 `#B42318` / `#F9EDED` | `5.75:1` |
| Dark CTA `#2D1C14` / `#FF9A7A` | `7.89:1` |
| Dark STEP 텍스트 `#FF9A7A` / `#222027` | `7.79:1` |
| Dark 성공 `#7EE0B4` / `#363A3F` | `7.20:1` |
| Dark 오류 `#FF8C84` / `#41343B` | `5.25:1` |

### 실제 Viewport

- 기본: `390×844`, URL 기본값 또는 `viewport=regular`
- 작은 iPhone: `375×667`, `viewport=small`
- 작은 프레임은 CSS transform 축소를 사용하지 않고 기기 폭·높이, 여백, 제목, 녹음 컨트롤, 스크롤 영역을 실제로 재배치

## 9. 통합 Revision 반영 상태

- `T-20260729-008~011`: Home·기록·AI Review·완료 레시피·검색 흐름 반영 완료
- `T-20260729-012`: 핸즈프리 음성 명령·오디오 중단·버튼 fallback 반영 완료
- `T-20260729-013`: 앱 정보·데이터 보관·법적 문서·서비스 장애 상태 반영 완료
- `T-20260729-014`: 전체 화면 상태·테마·작은 화면·접근성·구현 인계 계약 통합 완료

공식 revision은 `integrated-accessibility-handoff-20260804`입니다. Prototype과 Manifest revision이 다르면 배포·구현 인계를 중단하고 두 로컬 원본부터 일치시킵니다.

## 10. 제품 범위 제외

- 로그인과 회원가입
- 공유와 커뮤니티
- Import, OCR, AI 챗
- 앱 아이콘과 그래픽 로고
- Android 전용 화면

## 11. iOS 구현 인계 주의사항

- 시각 구현은 `design/prototype/`을 최우선으로 따르고, 토큰·컴포넌트·상태 구조는 `design/figma-build/manifest.json`을 따른 다음, 로컬 원본과 동기화된 Figma만 보조 참고합니다.
- 현재 Figma 화면은 미동기화 상태이므로 iOS 구현의 최우선 기준으로 사용하지 않습니다. 이후에도 Figma와 로컬 원본이 충돌하면 Prototype과 Manifest를 우선합니다.
- SwiftUI 시스템 컨트롤의 접근성 동작을 보존합니다.
- Prototype의 타이포그래피 계층을 구현 기준으로 사용하되 앱에서는 시스템 폰트와 Dynamic Type을 적용합니다. 동기화된 Figma의 Inter 표시는 보조 참고입니다.
- Manifest의 Light/Dark Semantic Token을 iOS에서 하나의 동적 Color Asset 또는 `Color` 토큰으로 통합합니다.
- iOS 코드 적용은 `T-20260728-003`에서 수행합니다.

## 12. 통합 구현 계약

### Routing

- Home의 최근 활동은 진행 기록이면 Cooking Log, AI 검토 준비면 AI Review, 완료 레시피면 Recipe Detail로 이동합니다.
- 화면 전환 뒤 키보드·VoiceOver 포커스는 새 화면 제목 또는 새 선택지의 안전한 첫 행동으로 이동합니다.
- modal을 닫으면 호출한 control로, 동일 행동 뒤 재렌더링되면 동등 control로 포커스를 복원합니다.

### 데이터 보존과 재시도

- STT 최종 실패에서도 기존 STEP 원문과 순서를 보존하고 실패한 기록만 다시 실행합니다.
- AI 생성 실패는 동일 요청의 검토본을 중복 생성하지 않으며 기존 STEP snapshot을 유지합니다.
- Review 저장 실패는 현재 편집값을 유지하고 저장만 재시도합니다. 이탈 시 마지막 성공 임시 저장 snapshot 또는 완료 레시피 원본으로 복원합니다.
- 서비스 장애는 원인 범주와 영향 행동을 명시하고, 검색·로컬 레시피·버튼 Audio Guide 등 가능한 로컬 기능을 유지합니다.
- Audio Player 중단·불확실 명령·권한 실패는 현재 단계와 재생 위치를 보존하고 자동 재개하지 않습니다.

### 반응형·테마·접근성

- `390×844`와 `375×667`에서 transform 축소 없이 실제 제약으로 재배치합니다.
- 고정 높이로 Dynamic Type 텍스트를 자르지 않고 핵심 버튼·본문은 최소 두 줄 확장을 허용합니다.
- Light/Dark는 동일 Semantic Token 이름을 사용하며 상태를 색상만으로 전달하지 않습니다.
- 모든 조작 control은 최소 44×44pt, 명확한 접근성 이름·상태·disabled 속성을 제공합니다.
- 녹음 타이머·처리 완료·단계 이동은 필요한 시점에만 상태를 알리고 전체 화면의 반복 낭독을 피합니다.

### 구현 리뷰 증거

- 화면별 기본·로딩·빈 상태·오류·복구 상태를 Prototype URL과 대조합니다.
- 기록·재사용·검색·완료 수정·삭제·핸즈프리·서비스 장애 흐름의 routing과 보존 계약을 시나리오 단위로 확인합니다.
- 작은 화면, Light/Dark, Dynamic Type, VoiceOver, Reduce Motion, 터치 타깃을 구현 리뷰 체크리스트에 포함합니다.
- Figma 동기화 여부는 별도 기록하되 로컬 Prototype·Manifest와 충돌할 때 구현 승인 근거로 사용하지 않습니다.
