# CookLog 로컬 디자인 프로토타입

Figma MCP 한도와 무관하게 CookLog MVP UI/UX v1을 검토하기 위한 로컬 HTML/CSS/JavaScript 프로토타입입니다.

이 디렉토리는 Product Owner가 승인한 CookLog의 공식 UI Source of Truth입니다.

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

구독·Paywall UX:

```text
http://127.0.0.1:8765/subscription.html
http://127.0.0.1:8765/subscription.html?view=paywall&state=ready&entry=quota
http://127.0.0.1:8765/subscription.html?view=status&state=pro-active&theme=dark
```

화면·상태·테마를 URL로 바로 열 수도 있습니다.

```text
http://127.0.0.1:8765/?screen=log&state=recording
http://127.0.0.1:8765/?screen=player&state=playing&theme=dark
http://127.0.0.1:8765/?screen=review&state=save-error
http://127.0.0.1:8765/?screen=home&state=content&viewport=small
```

## 포함

- Home
- Cooking Log
- AI Review
- Recipe Detail
- Audio Player
- Light / Dark
- 주요 빈 상태, 로딩, 녹음, 처리, 오류, 비활성, 재생 상태
- 기록 흐름과 다시 요리 흐름의 기본 인터랙션
- 390×844와 실제 375×667 레이아웃
- Button, Status Banner, Form Field, Recipe Card, Player Control 상태 보드
- Paywall 상품 조회·구매·복원과 Free/Pro 구독·사용량 상태

## 역할

- 공식 시각·UX 검토 기준
- Git 기반 디자인 변경 이력
- Figma 한도 갱신 후 화면 재현 기준
- `design/figma-build/manifest.json`의 시각적 보조 자료

이 프로토타입은 앱 구현 코드가 아니며 `T-20260728-003`에서 그대로 제품 코드로 복사하지 않습니다.
