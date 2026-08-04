# CookLog 로컬 디자인 프로토타입

Figma MCP 한도와 무관하게 CookLog MVP UI/UX v1을 검토하기 위한 로컬 HTML/CSS/JavaScript 프로토타입입니다.

이 디렉토리는 Product Owner가 승인한 CookLog의 공식 UI Source of Truth입니다.

현재 Prototype revision은 `integrated-accessibility-handoff-20260804`이며 `design/figma-build/manifest.json`과 동일합니다.

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
http://127.0.0.1:8765/?screen=player&state=ready
http://127.0.0.1:8765/?screen=player&state=step-complete
http://127.0.0.1:8765/?screen=player&state=last-step
http://127.0.0.1:8765/?screen=player&state=handsfree-intro
http://127.0.0.1:8765/?screen=player&state=permission-denied
http://127.0.0.1:8765/?screen=player&state=listening
http://127.0.0.1:8765/?screen=player&state=command-uncertain
http://127.0.0.1:8765/?screen=player&state=interrupted
http://127.0.0.1:8765/?screen=player&state=background-ended
http://127.0.0.1:8765/?screen=review&state=save-error
http://127.0.0.1:8765/?screen=review&state=processing-long
http://127.0.0.1:8765/?screen=review&state=ready-banner
http://127.0.0.1:8765/?screen=review&state=generation-error
http://127.0.0.1:8765/?screen=review&state=validation-error
http://127.0.0.1:8765/?screen=review&state=unsaved-exit
http://127.0.0.1:8765/?screen=review&state=complete-edit
http://127.0.0.1:8765/?screen=detail&state=menu-open
http://127.0.0.1:8765/?screen=detail&state=delete-confirm
http://127.0.0.1:8765/?screen=home&state=content&viewport=small
http://127.0.0.1:8765/?screen=home&state=delete-confirm
http://127.0.0.1:8765/?screen=library&state=all
http://127.0.0.1:8765/?screen=library&state=search-title
http://127.0.0.1:8765/?screen=library&state=no-results&theme=dark
http://127.0.0.1:8765/?screen=info&state=overview
http://127.0.0.1:8765/?screen=info&state=data-retention
http://127.0.0.1:8765/?screen=info&state=contact-consent
http://127.0.0.1:8765/?screen=info&state=mail-unavailable
http://127.0.0.1:8765/?screen=info&state=privacy-unconfigured
http://127.0.0.1:8765/?screen=info&state=terms-error
http://127.0.0.1:8765/?screen=home&state=network-error
```

## 포함

- Home
- 전체 보기·로컬 검색
- Cooking Log
- AI Review
- Recipe Detail
- Audio Player
- 앱 정보·지원·데이터 보관 안내
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
- AI 정리 10초 경과 안내, 다른 화면 이용, 앱 내부 완료 배너와 명시적 Review 진입
- AI 정리 실패 범주, 자동 재시도 없는 복구와 동일 요청 검토본 중복 방지
- `확정`·`AI 추정`·`누락` 필드 상태와 단계 카드 추가·삭제·되돌리기·재배열
- 수동 임시 저장, 저장하지 않은 변경 이탈 확인, 필드 검증과 최종 저장 실패 값 보존
- 완료 레시피의 동일 폼 수정, AI 재호출 없는 `수정 완료`, 복구 불가 영구 삭제 확인
- 마지막 성공 임시 저장 snapshot·현재 편집본·완료 레시피 원본 분리와 변경 폐기 복원
- 완료 수정값의 Recipe Detail 실제 반영, 저장 전 빈 STEP 제외·표시 순서 재번호
- Review 이탈 modal, STEP 삭제 Undo, 완료 레시피 메뉴의 키보드 초기·복귀 포커스와 Escape
- 진입 시 STEP 1 준비·자동 재생 없음, 단계 완료 대기와 마지막 단계 유지
- 저장된 완료 레시피 하나에서 Audio Guide 단계·진행률·재료 낭독을 동적으로 생성
- 이전·재생/일시정지·다음·다시 듣기·재료 듣기·가이드 종료 버튼과 3단계 읽기 속도
- 첫 핸즈프리 맥락 안내와 마이크·음성인식 권한 상태 분리, 권한 허용·거부·설정 이동과 버튼 Audio Guide 보존
- 핸즈프리 7개 명령의 첫·마지막 경계를 포함한 버튼 1:1 동등성, 불확실 명령·마이크 종료 중 재생 완료 시점 보존
- Player 행동 후 동등 control 포커스 유지와 로컬 TTS 오류 시 레시피 내용·단계 이동·가이드 종료 fallback
- 재생·단계 이동·다시 듣기의 자동 완료 렌더링 뒤에도 재생 control로 키보드 포커스 복원
- 전화·Siri·다른 오디오·Bluetooth 중단과 백그라운드·직접 잠금 후 수동 재개
- Home 앱 정보 진입, 문의·개인정보처리방침·이용약관·데이터 보관 안내
- 문의 시 사용자 콘텐츠 자동 비첨부, 앱 버전 기본 제공과 사용자가 명시적으로 선택하는 OS 버전·오류 화면/시각·비콘텐츠 진단 범주
- Home·App Info 하위 화면 전환 뒤 새 화면 제목으로 이동하는 키보드 포커스
- 법적 문서 로딩·운영 URL 미설정·열기 실패와 이메일 앱 사용 불가 상태
- 앱 삭제·기기 초기화·분실·저장소 손상 유실 가능성과 자체 백업·복구·동기화 미제공 경계
- 인터넷·음성 변환·AI 서비스·로컬 저장 실패의 원인 범주와 실패한 행동만 다시 실행하는 CTA
- 온라인 장애 중 진행·완료 레시피, 검색과 버튼 Audio Guide 등 로컬 기능 유지
- 390×844와 실제 375×667 레이아웃
- Button, Status Banner, Form Field, Recipe Card, Player Control 상태 보드

## 역할

- 공식 시각·UX 검토 기준
- Git 기반 디자인 변경 이력
- Figma 한도 갱신 후 화면 재현 기준
- `design/figma-build/manifest.json`의 시각적 보조 자료

## T-014 통합 검증 기준

- 화면 상태: Home 9, All Recipes 5, Cooking Log 14, AI Review 12, Recipe Detail 7, Audio Player 24, App Info 11 — 총 82개
- 공통 컴포넌트: 13개
- 대표 사용자 흐름: 기록, 재사용, 완료 레시피 수정·삭제, 검색, 앱 정보·법적 문서, 서비스 장애 복구
- Viewport: 기본 `390×844`, 작은 iPhone `375×667`
- 테마: Light/Dark Semantic Token을 동일한 의미 이름으로 대응
- 접근성: 일반 텍스트 4.5:1, 큰 텍스트 3:1, 최소 터치 영역 44×44pt, 키보드 포커스와 상태 문구 보존
- 데이터 보존: 실패한 행동만 재시도하고 STEP 원문·편집값·완료 레시피·현재 재생 위치를 해당 흐름의 계약에 따라 유지
- Figma는 로컬 원본을 반영하는 버전 미러이며, 미동기화 또는 호출 제한은 이 revision의 검증·구현 인계를 막지 않음

이 프로토타입은 앱 구현 코드가 아니며 `T-20260728-003`에서 그대로 제품 코드로 복사하지 않습니다.
