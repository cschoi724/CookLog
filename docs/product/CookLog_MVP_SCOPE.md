# CookLog MVP Scope v2

이 문서는 PRD v2 기준의 MVP 포함/제외 범위입니다.

## Include

- Home
- 10초 음성 기록
- STT
- STEP Preview 생성
- 10초 기록 반복
- AI 정리
- 레시피 검토
- 레시피 저장
- 레시피 조회
- 오디오 플레이어

## Exclude

- 로그인
- 회원가입
- 공유
- 커뮤니티
- Import 기능
- OCR
- AI 챗
- 음성 명령
- 서버 동기화

## 구현상 중요한 구분

- STEP Preview는 STT 결과를 기반으로 즉시 생성합니다.
- STEP Preview 단계에서는 실제 AI 레시피 구조화를 수행하지 않습니다.
- AI는 사용자가 `AI 정리하기`를 선택한 시점에만 호출합니다.
- 사용자는 레시피를 직접 작성하지 않고 음성으로만 요리 과정을 기록합니다.

## 초기 실서비스 추가 범위

Core MVP 검증 후 실제 서비스로 출시할 때 다음 수익화 기능을 추가합니다.

- CookLog Free / Pro 구분
- 월간·연간 자동 갱신 구독
- StoreKit 2 구매와 복원
- Free/Pro AI 정리 사용량
- 구독 상태와 남은 사용량 표시
- Paywall과 구독 관리
- Backend entitlement와 AI quota 검증

초기 수익화 기준은 `CookLog_MONETIZATION.md`를 따릅니다. 로그인과 서버 레시피 동기화는 계속 MVP 제외 범위로 유지합니다.
