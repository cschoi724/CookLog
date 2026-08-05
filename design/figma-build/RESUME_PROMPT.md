# 재개 프롬프트

아래 문장을 새 디자인 실행 세션에 전달합니다.

> `T-20260803-001`의 Figma 재작업을 재개해줘. Figma File Key는 `tAvYn6TatLKb3SXDjkH1hn`, Run ID는 `cooklog-mvp-v1-design-system-20260803`이야. `figma-use`, `figma-generate-design`, `figma-generate-library` 스킬과 `design/figma-build/RUNBOOK.md`, `state.json`, `manifest.json`을 사용해. 먼저 로컬 Gallery의 누락 상태 9개와 Components 잘림을 MCP 없이 수정·검증하고, Figma를 read-only rehydrate해. Light Foundation과 7개 공통 컴포넌트를 우선 한 종류씩 생성·검증하고 호출 여유가 있을 때만 Dark로 확장해. MCP 호출은 안전한 최소 단위로 줄이되 컴포넌트를 일괄 생성하거나 검증을 생략하지 마. 실제 rate limit 또는 quota 오류가 발생하면 즉시 lock을 해제하고 `blocked`로 보류하며, 마지막 성공 Task ID와 반환 ID를 state ledger에 기록해 다음 세션이 이어서 진행할 수 있게 해.
