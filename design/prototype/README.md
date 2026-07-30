# CookLog 로컬 디자인 프로토타입

Figma MCP 한도와 무관하게 CookLog MVP UI/UX v1을 검토하기 위한 로컬 HTML/CSS/JavaScript 프로토타입입니다.

이 디렉토리는 Product Owner가 승인한 CookLog의 공식 UI Source of Truth입니다.

현재 Prototype revision은 `cooking-log-on-device-stt-20260730`이며 `design/figma-build/manifest.json`과 동일합니다.

## 실행

저장소 루트에서:

```bash
python3 -m http.server 8765 --directory design/prototype
```

브라우저에서 `http://127.0.0.1:8765`를 엽니다.

전체 화면 비교 Gallery:

```text
http://127.0.0.1:8765/gallery.html
```

`gallery.html`은 Finder에서 직접 열어도 동작하지만, 브라우저 보안 정책과 URL 상태 확인을 동일하게 유지하려면 위 로컬 서버 방식을 권장합니다.

공통 컴포넌트 상태:

```text
http://127.0.0.1:8765/components.html
```

화면·상태·테마를 URL로 바로 열 수도 있습니다.

```text
http://127.0.0.1:8765/?screen=log&state=recording
http://127.0.0.1:8765/?screen=log&state=intro
http://127.0.0.1:8765/?screen=log&state=permission-denied
http://127.0.0.1:8765/?screen=log&state=retrying
http://127.0.0.1:8765/?screen=log&state=undo-delete
http://127.0.0.1:8765/?screen=log&state=offline
http://127.0.0.1:8765/?screen=log&state=stt-error
http://127.0.0.1:8765/?screen=log&state=ai-lock
http://127.0.0.1:8765/?screen=log&state=processing&stt-path=success
http://127.0.0.1:8765/?screen=log&state=processing&stt-path=retry-success
http://127.0.0.1:8765/?screen=log&state=processing&stt-path=retry-failure
http://127.0.0.1:8765/?screen=player&state=playing&theme=dark
http://127.0.0.1:8765/?screen=review&state=save-error
http://127.0.0.1:8765/?screen=home&state=content&viewport=small
http://127.0.0.1:8765/?screen=home&state=delete-confirm
http://127.0.0.1:8765/?screen=library&state=all
http://127.0.0.1:8765/?screen=library&state=search-title
http://127.0.0.1:8765/?screen=library&state=no-results&theme=dark
```

## 포함

- Home
- 전체 보기·로컬 검색
- Cooking Log
- AI Review
- Recipe Detail
- Audio Player
- Light / Dark
- 주요 빈 상태, 로딩, 녹음, 처리, 오류, 비활성, 재생 상태
- 최근 활동순 혼합 목록, 진행 상태별 routing, 진행 기록 영구 삭제 확인
- 제목·재료명 즉시 검색, 제목 일치 우선, 검색어 지우기와 결과 없음
- 기록 흐름과 다시 요리 흐름의 기본 인터랙션
- 첫 기록 마이크 사용 이유, 권한 거부와 설정 이동
- 10초 자동 종료, Apple 기기 내 STT 처리와 같은 adapter의 자동 재처리 1회
- `stt-path=success|retry-success|retry-failure` 검토 시나리오로 제품 화면에 테스트 행동을 노출하지 않고 자동 전이 분기를 재현
- 원문 STEP의 녹음 시간순 자동 저장, 왼쪽 스와이프 삭제와 짧은 되돌리기
- 지원 환경의 오프라인 기록, 오프라인 AI 연결 안내와 AI snapshot 잠금
- 기기 내 STT 미지원·최종 실패 시 원격 fallback 없이 기존 STEP 보존
- 390×844와 실제 375×667 레이아웃
- Button, Status Banner, Form Field, Recipe Card, Player Control 상태 보드

## 역할

- 공식 시각·UX 검토 기준
- Git 기반 디자인 변경 이력
- Figma 한도 갱신 후 화면 재현 기준
- `design/figma-build/manifest.json`의 시각적 보조 자료

이 프로토타입은 앱 구현 코드가 아니며 `T-20260728-003`에서 그대로 제품 코드로 복사하지 않습니다.
