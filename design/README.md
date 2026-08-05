# 디자인

디자인 노트, 레퍼런스, 내보낸 산출물을 관리하는 디렉토리입니다.

권장 구조는 다음과 같습니다.

- `references/`: 스크린샷, 영감 자료, 제품 레퍼런스
- `exports/`: 내보낸 이미지, PDF, 핸드오프 파일
- `tmp/`: 커밋하지 않을 임시 파일

Figma 원본은 Figma에 유지합니다. 저장소에는 프로젝트에 필요한 영구 산출물이나 핸드오프 파일만 커밋합니다.

## Figma 원본

- [CookLog — MVP UI/UX v1](https://www.figma.com/design/tAvYn6TatLKb3SXDjkH1hn)
- 역할: 버전 스냅샷과 형상 보존용 미러
- 상태: Gallery·Cover 업로드 후 Design QA 재작업, Light 우선 디자인 시스템 확대 범위 승인 완료
- 기준 Task: `T-20260728-002`

## 로컬 재개 패키지

- `figma-build/manifest.json`: 토큰, 컴포넌트, 화면, 상태, Prototype 명세
- `figma-build/RUNBOOK.md`: 한도 갱신 후 실행 순서와 검증 기준
- `figma-build/RESUME_PROMPT.md`: 새 세션용 재개 프롬프트
- `figma-build/scripts/`: 작은 원자적 단위의 Foundation Plugin API 스크립트

## 로컬 디자인 프로토타입

- `prototype/index.html`
- 역할: 공식 UI Source of Truth
- Figma 한도와 무관하게 5개 MVP 화면, Light/Dark, 주요 상태와 핵심 흐름을 검토할 수 있습니다.
- 실행 방법은 `prototype/README.md`를 따릅니다.

## 구독·Paywall UX

- `subscription/PAYWALL_UX_SPEC.md`: 진입 흐름, 화면 구조, 구매·복원, 접근성·구현 계약
- `subscription/PAYWALL_STATE_MATRIX.md`: Paywall과 entitlement 상태·전이·회귀 기준
- `subscription/PAYWALL_COPY_TOKENS.md`: StoreKit·Backend 주입값과 현지화 카피 토큰
- `prototype/subscription.html`: Light/Dark와 390×844·375×667에서 검토하는 실행형 원본
- 가격·할인·quota·초기화 시점은 `T-20260728-010` 완료 전까지 가설값으로 표시합니다.
