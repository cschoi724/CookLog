# Figma Light 우선 디자인 시스템 재작업 Runbook

기준 Task: `T-20260803-001`
실행 원칙: Light 필수, Dark 조건부, 호출 최소화, rate limit 즉시 보류

## Phase 0 Checklist — 로컬 준비와 Discovery

- `P0.a` 누락 앱 상태 9개 추가
- `P0.b` 앱 상태 수와 전체 카드 수 분리
- `P0.c` Components Gallery 잘림 해소
- `P0.d` 로컬 JavaScript·JSON·HTTP·시각 검증
- `P0.e` Figma 파일·페이지·변수·스타일·컴포넌트 read-only discovery
- `P0.f` Code Connect·기존 화면·라이브러리 확인
- `P0.g` 로컬 Manifest ↔ Figma gap analysis
- Exit: Light token·style·component 목록 고정, 쓰기 전 충돌 해소

## Phase 1 Checklist — Light Foundation

- `P1.a` Primitives·Light Color·Dimension collection 확인 또는 생성
- `P1.b` Primitive Color 21개
- `P1.c` Light Semantic Color 15개 alias
- `P1.d` Spacing 7개·Radius 5개
- `P1.e` Text Style 6개·Effect Style 2개
- `P1.f` 모든 scope와 WEB/iOS code syntax
- `P1.g` Foundation 문서 Section과 Light 샘플
- `P1.h` 변수 수·alias·scope·syntax·시각 검증
- Exit: Foundation 검증 통과, unresolved token 없음

## Phase 2 Checklist — File Structure

- `P2.a` Starter 3페이지 구조 유지
- `P2.b` `01 — System & Handoff`에 Foundations·Components Section 구성
- `P2.c` `02 — MVP Screens & Prototype`에 수정 Gallery 기준 연결
- `P2.d` 페이지·Section 명명과 Source of Truth 표시 검증
- Exit: Foundation과 Component 작업 위치가 명확하고 기존 Gallery와 충돌 없음

## Phase 3 Checklist — Light Components

각 컴포넌트는 한 종류씩 생성하고 다음 컴포넌트로 넘어가기 전에 검증한다.

- `P3.a` Button
- `P3.b` Record Control
- `P3.c` Recipe Card
- `P3.d` STEP Row
- `P3.e` Status Banner
- `P3.f` Form Field
- `P3.g` Player Controls
- `P3.h` variant count·property·binding·44pt·명칭 통합 검사
- Exit: 7개 Light 컴포넌트와 상태가 Manifest와 일치

## Phase 4 Checklist — Light Integration과 QA 준비

- `P4.a` 수정 Gallery 반영
- `P4.b` 앱 상태 23개와 전체 카드 수 별도 검증
- `P4.c` Components Gallery 전체 높이·잘림 검증
- `P4.d` Light Foundation·Component·Gallery 정합성
- `P4.e` 접근성·이름·미해결 binding audit
- `P4.f` state ledger·실행 보고·핸드오프 갱신
- Exit: Light 결과가 독립 Design QA에 인계 가능한 상태

## Phase 5 Checklist — 조건부 Dark

진입 조건: P0~P4 통과, rate limit 경고 없음, state ledger 일치.

- `P5.a` Dark Semantic Color 15개
- `P5.b` Light 구조에 Dark 변수 적용
- `P5.c` 7개 Dark Component 상태 확인
- `P5.d` Dark Gallery 잘림·대비·상태 회귀
- `P5.e` state ledger와 핸드오프 갱신
- Exit: 가능하면 Dark 완료, 불가능하면 정확한 pending 지점 기록

## 호출 최소화 규칙

- MCP 전 로컬 검사를 모두 끝낸다.
- 변수는 관련된 작은 원자 묶음으로 생성하되 실패 원인을 분리할 수 있는 크기를 유지한다.
- 컴포넌트는 한 호출에 한 종류만 다룬다.
- 생성 결과에서 metadata와 inline screenshot을 함께 반환할 수 있으면 활용한다.
- 별도 검증 호출을 줄여도 컴포넌트별 구조·시각 검증은 생략하지 않는다.
- 한 호출에서 page 전환은 최대 한 번이다.
- Figma mutation은 순차 실행한다.
- 반환 ID를 state ledger에 기록한 후 다음 호출로 넘어간다.

## Rate Limit 보류 절차

1. rate limit·quota·호출 한도 오류를 확인하면 즉시 중단한다.
2. 자동 재시도, 대체 도구 호출, 새 capture 시작을 하지 않는다.
3. 성공한 마지막 Phase·Task ID와 모든 반환 ID를 기록한다.
4. Task lock을 해제하고 `blocked`로 전환한다.
5. 실행 보고에 오류 원문과 재개 조건을 기록한다.
6. 다음 세션은 read-only rehydrate 후 미완료 Task ID부터 재개한다.

## 완료·인계

- Light 필수 범위가 끝나면 Dark 진행 여부와 관계없이 Light 완료 결과를 명확히 기록한다.
- Dark를 시작했다가 한도에 걸리면 Light 완료 상태와 Dark 중단 상태를 분리한다.
- 필수 QA 결함과 Light 디자인 시스템이 완료되면 `verification_ready`로 Design QA Agent에 인계한다.
