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
- 상태: Starter MCP 호출 가능 시 로컬 원본을 점진적으로 동기화
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
