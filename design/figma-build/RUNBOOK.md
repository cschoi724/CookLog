# Figma 재개 Runbook

## 1. 재개 전

1. `figma-use`, `figma-generate-design`, `figma-generate-library` 스킬을 읽습니다.
2. `manifest.json`, `state.json`, `../COOKLOG_MVP_UIUX_V1_HANDOFF.md`를 읽습니다.
3. Figma `whoami`에서 젤리공방 권한과 호출 가능 여부를 확인합니다.
4. `use_figma` 읽기 호출 하나로 페이지, 컬렉션, 변수, 스타일, 컴포넌트를 재탐색합니다.
5. Task의 `blocked` 상태를 `in_progress`로 바꾸고 lock을 다시 획득합니다.

## 2. Foundation

아래 파일을 순서대로 호출합니다.

1. `scripts/00-collections-and-core-primitives.js`
2. `scripts/01-primitives-remaining.js`
3. `scripts/02-semantics-light-a.js`
4. `scripts/03-semantics-light-b.js`
5. `scripts/04-semantics-dark-a.js`
6. `scripts/05-semantics-dark-b.js`
7. `scripts/06-dimensions-spacing.js`
8. `scripts/07-dimensions-radius.js`
9. `scripts/08-text-and-effect-styles.js`

검증:

- 컬렉션 4개
- Primitive 22개
- Light Semantic 17개
- Dark Semantic 17개
- Spacing 7개
- Radius 5개
- Text Style 6개
- Effect Style 2개
- 모든 Variable에 제한된 scope와 WEB/iOS code syntax 존재

## 3. 페이지

Starter 페이지 한도를 지킵니다.

- 기존 `00 — Direction Gate` 유지
- `01 — System & Handoff` 생성
- `02 — MVP Screens & Prototype` 생성

`01`에는 Cover, Foundations, Components를 Section으로 배치합니다. `02`에는 Record Flow, Reuse Flow, States, Dark, Small Screen을 Section으로 배치합니다.

## 4. 컴포넌트

한 호출에서 한 컴포넌트만 만듭니다.

1. Button
2. Record Control
3. Recipe Card
4. STEP Row
5. Status Banner
6. Form Field
7. Step Edit Card
8. Toast
9. Alert
10. Player Controls
11. Handsfree Control

각 컴포넌트는 다음을 만족해야 합니다.

- Auto Layout
- Light Semantic 변수 binding
- Variant와 상태
- Text 또는 Boolean Component Property
- 44pt 이상 터치 영역
- 설명과 사용 기준
- metadata와 screenshot 검증

## 5. 화면

화면 골격과 내용을 분리해 호출합니다.

1. Home Light
2. Cooking Log Light
3. AI Review Light
4. Recipe Detail Light
5. Audio Player Light
6. 주요 상태
7. Home Dark
8. Cooking Log Dark
9. AI Review Dark
10. Recipe Detail Dark
11. Audio Player Dark
12. iPhone SE 작은 화면 검증

화면 크기:

- 기본: 390×844
- 작은 화면: 375×667

## 6. Prototype

기록 흐름:

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

재사용 흐름:

```text
Home / Recipe Card
-> Recipe Detail
-> Audio Player / Paused
```

저장 오류 복구:

```text
AI Review / Editable
-> AI Review / Save Error
-> AI Review / Saving
-> Recipe Detail
```

## 7. 검증과 완료

1. Foundation Section screenshot
2. Component Section screenshot
3. Light Flow screenshot
4. Dark Flow screenshot
5. Small Screen screenshot
6. 이름, binding, 대비, 터치 영역 audit
7. 저장소 핸드오프와 보고서 갱신
8. `verification_ready`로 전환하고 Design QA Agent에 인계
