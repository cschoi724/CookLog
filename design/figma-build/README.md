# CookLog Figma 재개 패키지

이 디렉토리는 `T-20260728-002`를 Figma MCP 한도 갱신 뒤 이어서 실행하기 위한 로컬 Source Package입니다.

## 대상

- Figma File Key: `tAvYn6TatLKb3SXDjkH1hn`
- Figma: <https://www.figma.com/design/tAvYn6TatLKb3SXDjkH1hn>
- Run ID: `cooklog-mvp-v1-20260728`
- 현재 Figma 상태:
  - Product Owner가 젤리공방에 새 빈 Design 파일 생성
  - `generate_figma_design` 첫 캡처는 Starter MCP 호출 한도로 차단
  - 한도 갱신 후 로컬 Manifest 기준으로 처음부터 동기화

## 로컬 파일

- `manifest.json`: 토큰, 컴포넌트, 화면, 상태, Prototype Source of Truth
- `state.json`: 이미 생성된 Figma ID와 정확한 중단 지점
- `RUNBOOK.md`: 호출 한도 갱신 뒤의 실행·검증 순서
- `RESUME_PROMPT.md`: 새 세션에서 그대로 사용할 재개 지시
- `scripts/`: Foundation을 작은 원자적 호출로 만드는 Plugin API 스크립트

## Starter 플랜 구조

Starter 플랜 제약 때문에 다음 구조를 사용합니다.

- Light와 Dark는 별도 Color Collection
- Figma Design 페이지는 최대 3개
  1. `00 — Direction Gate`
  2. `01 — System & Handoff`
  3. `02 — MVP Screens & Prototype`

컴포넌트는 `01 — System & Handoff` 안에서 Section으로 구분합니다. 화면과 상태는 `02 — MVP Screens & Prototype`에서 Flow별 Section으로 구분합니다.

## 실행 원칙

- `scripts/` 파일 하나를 `use_figma` 호출 하나로 실행합니다.
- 순서를 바꾸지 않습니다.
- 실패한 호출은 원자적으로 취소되므로 오류 원인을 확인하기 전 재시도하지 않습니다.
- 각 스크립트는 이름 기반으로 기존 항목을 건너뛰도록 작성되어 있습니다.
- Foundation 이후 컴포넌트는 한 종류씩, 화면은 한 Section씩 생성합니다.
- 모든 생성·변경 호출은 ID를 반환하고 로컬 상태 ledger에 반영합니다.
- Figma Starter 호출량을 아끼기 위해 구조 검증과 스크린샷 검증을 단계별로 묶습니다.

## 완료 조건

- `manifest.json`의 Foundation, Component, Screen, State 항목이 모두 Figma에 존재
- Light와 Dark 화면이 각각 존재
- 핵심 기록 흐름과 다시 요리 흐름 Prototype 연결
- 작은 화면, Dynamic Type, 대비, 터치 영역 검토
- Design QA 인계 문서 작성
