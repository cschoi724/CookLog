# CookLog Roadmap v2

## MVP

- Home
- 10초 음성 기록
- STT
- STEP Preview 생성
- AI 정리
- 레시피 저장
- 레시피 조회
- 오디오 플레이어

## 초기 실서비스 전환

- 실제 STT 연결
- Backend AI 프록시
- 실제 오디오 가이드
- CookLog Free / Pro
- 월간·연간 자동 갱신 구독
- AI 사용량과 Backend entitlement 검증
- Paywall, 구매 복원, 구독 관리
- 개인정보·이용약관·App Store Connect 준비

수익화 세부 기준은 `CookLog_MONETIZATION.md`를 따릅니다.

출시 단계:

1. 내부 TestFlight A: 실제 Core Loop
2. 내부 TestFlight B: Free/Pro 구독
3. 비공개 외부 TestFlight
4. App Store 정식 공개

비공개 외부 TestFlight 검증을 통과하기 전에는 App Store에 공개하지 않습니다.

내부 TestFlight A:

- 실제 10초 음성 기록과 STT
- Backend AI 정리
- SwiftData 로컬 저장
- 실제 TTS 오디오 가이드
- 승인된 UI

내부 TestFlight B:

- Free/Pro
- StoreKit 2 월간·연간 구독
- Backend entitlement와 AI quota
- Paywall, 구매 복원, 구독 관리

## v2

- 블로그 Import
- 유튜브 Import
- OCR

## v3

- 음성 명령 오디오 플레이어

## v4

- 레시피 공유
- 커뮤니티
- 소셜 기능
