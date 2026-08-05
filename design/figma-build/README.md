# CookLog Figma 재개 패키지

이 디렉토리는 완료된 `T-20260728-002`의 승인 산출물을 Figma에 동기화하고 Light 우선 디자인 시스템으로 확장하기 위한 로컬 Source Package입니다. `T-20260803-001`은 기존 Gallery 결함을 수정한 뒤 Light Foundation과 7개 공통 컴포넌트를 필수로 구축하고, 호출 여유가 있을 때 Dark를 조건부로 확장합니다.

## 대상

- Figma File Key: `tAvYn6TatLKb3SXDjkH1hn`
- Figma: <https://www.figma.com/design/tAvYn6TatLKb3SXDjkH1hn>
- Run ID: `cooklog-mvp-v1-design-system-20260803`
- 현재 Figma 상태:
  - Gallery node `59:2`, Cover/Handoff node `57:2` 생성 완료
  - Design QA에서 앱 상태 9개 누락과 Components Gallery 잘림으로 재작업 요청
  - Light 우선 디자인 시스템 확대 재작업 승인 완료, UI/UX 실행 대기

## 로컬 파일

- `manifest.json`: 토큰, 컴포넌트, 화면, 상태, Prototype Source of Truth
- `state.json`: 이미 생성된 Figma ID와 정확한 중단 지점
- `RUNBOOK.md`: Light 필수·Dark 조건부·rate limit 보류 실행 순서
- `RESUME_PROMPT.md`: 새 세션에서 그대로 사용할 재개 지시
- `scripts/`: Foundation Plugin API 참고 스크립트이며 실행 전 Light 우선 범위와 현재 Figma 상태에 맞게 재검증

## 현재 재작업 범위

- 기준 Task: `T-20260803-001`
- 호출 정책: 고정 상한 없음, 안전한 원자 단위로 최소화
- 필수: Gallery QA 결함 수정, Light Foundation, Light 공통 컴포넌트 7종, Light 통합 검증
- 조건부: Light 완료 후 호출 여유가 있을 때 Dark Semantic·Components
- 보류: 실제 MCP rate limit 발생 즉시 `blocked`와 state ledger 기록 후 중단
- 상세 실행 순서: `RUNBOOK.md`

## Starter 플랜 구조

Starter 플랜 제약 때문에 다음 구조를 사용합니다.

- Light와 Dark는 별도 Color Collection
- Figma Design 페이지는 최대 3개
  1. `00 — Direction Gate`
  2. `01 — System & Handoff`
  3. `02 — MVP Screens & Prototype`

컴포넌트는 `01 — System & Handoff` 안에서 Section으로 구분합니다. 화면과 상태는 `02 — MVP Screens & Prototype`에서 Flow별 Section으로 구분합니다.

## 편집형 미러 실행 원칙

- `scripts/` 파일 하나를 `use_figma` 호출 하나로 실행합니다.
- 순서를 바꾸지 않습니다.
- 실패한 호출은 원자적으로 취소되므로 오류 원인을 확인하기 전 재시도하지 않습니다.
- 각 스크립트는 이름 기반으로 기존 항목을 건너뛰도록 작성되어 있습니다.
- Foundation 이후 컴포넌트는 한 종류씩, 화면은 한 Section씩 생성합니다.
- 모든 생성·변경 호출은 ID를 반환하고 로컬 상태 ledger에 반영합니다.
- Figma Starter 호출량을 아끼기 위해 구조 검증과 스크린샷 검증을 단계별로 묶습니다.

## 편집형 미러 완료 조건

- 앱 상태 23개와 Light·Dark Components Gallery가 잘림 없이 미러에 존재
- Light Foundation과 공통 컴포넌트 7종이 변수 binding과 상태를 갖고 존재
- Light 디자인 시스템의 naming, scope, alias, code syntax, 접근성 검증
- Dark를 진행하면 Light와 동일한 구조 및 검증 결과 기록
- rate limit으로 Dark를 보류하면 마지막 성공 ID와 pending 항목 기록
- Design QA 인계 문서 작성
