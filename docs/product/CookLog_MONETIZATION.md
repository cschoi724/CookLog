# CookLog 수익화 운영 지침

작성일: 2026-07-28
최종 검토일: 2026-08-04
상태: 초기 실서비스 가설·실행 동결
문서 책임: Product Lead Agent
승인 책임: Product Owner

## 1. 목적

이 문서는 CookLog의 비즈니스 모델, Free/Pro 경계, 가격, AI 사용량, 구독 UX, 원가, 성공 지표와 변경 절차를 관리하는 수익화 Source of Truth입니다.

PRD v2는 핵심 제품 경험을 정의하고, 이 문서는 초기 실서비스 수익화 정책을 보완합니다. 가격이나 사용량을 변경할 때 PRD 전체를 수정하지 않고 이 문서와 관련 결정 로그를 갱신합니다.

`T-20260728-010~018`은 공식 후보로 보존하지만 모두 `proposed` 상태이며 Core v1 출시 Critical Path를 차단하지 않습니다. Core v1 막바지에 Backend 원가와 실제 출시 범위를 확인한 뒤 Product Owner 승인으로 순차 활성화합니다.

## 2. 수익화 원칙

1. CookLog의 핵심 가치는 기록과 재사용이며 Paywall이 기록 습관 형성을 막아서는 안 됩니다.
2. 로컬에 저장된 사용자 레시피는 구독 만료 후에도 삭제하거나 열람을 차단하지 않습니다.
3. 기본 오디오 가이드는 핵심 재사용 경험이므로 Free에서도 제공합니다.
4. 지속 비용이 발생하는 AI 정리와 이후 고급 기능을 Pro 가치로 만듭니다.
5. 앱 실행 직후 결제를 요구하지 않고 사용자가 핵심 가치를 경험한 뒤 Pro를 제안합니다.
6. 실제 제공하지 않는 향후 기능을 현재 Pro 상품의 혜택으로 판매하지 않습니다.
7. AI 원가와 사용 패턴을 확인하기 전에는 무제한 사용을 약속하지 않습니다.
8. 가격, 한도, Paywall은 사용자 오인 없이 단순하고 명확하게 설명합니다.

## 3. 초기 비즈니스 모델

초기 실서비스는 광고 없는 Freemium 모델을 사용합니다.

```text
CookLog Free
  -> 핵심 기록과 재사용 경험 제공

CookLog Pro
  -> AI 사용량 확대와 고급 AI 기능 제공
  -> 월간 또는 연간 자동 갱신 구독
```

초기에는 하나의 Pro 등급만 운영합니다.

- 월간과 연간 상품은 동일한 기능을 제공합니다.
- 주간 구독은 제공하지 않습니다.
- 평생 이용권은 제공하지 않습니다.
- 소모성 AI 이용권은 초기 출시 범위에서 제외합니다.
- 광고 수익 모델은 사용하지 않습니다.

## 4. Free / Pro 기능 정책

### 4.1 초기 기능표

| 기능 | Free | Pro | 정책 상태 |
|---|---|---|---|
| 10초 음성 기록 | 제공 | 제공 | 확정 |
| STEP Preview 누적 | 제공 | 제공 | 확정 |
| AI 레시피 정리 | 월 3회 | 월 30회 | 출시 가설 |
| 레시피 검토·수정 | 제공 | 제공 | 확정 |
| 로컬 레시피 저장 | 제한 없음 | 제한 없음 | 확정 |
| 저장 레시피 조회 | 제공 | 제공 | 확정 |
| 기본 오디오 가이드 | 제공 | 제공 | 확정 |
| AI 재정리·재생성 | 미제공 | 제공 | 구현 검토 필요 |
| 클라우드 동기화 | 미제공 | 미제공 | 향후 후보 |
| 블로그·유튜브·OCR Import | 미제공 | 미제공 | v2 후보 |
| 핸즈프리 음성 명령 | 제공 | 제공 | 첫 공개 출시 핵심 경험, 수익화 제외 |

### 4.2 AI 사용량 기준

초기 가설:

- Free: 매월 AI 정리 3회
- Pro: 매월 AI 정리 30회
- 한 번의 `AI 정리하기` 성공을 1회로 계산합니다.
- 네트워크 또는 서버 오류로 결과가 생성되지 않으면 사용량을 차감하지 않습니다.
- 사용자가 같은 결과 화면에서 단순 편집하는 것은 추가 사용으로 계산하지 않습니다.
- AI 재생성을 Pro 기능으로 제공할 경우 성공한 재생성 1회를 별도 차감합니다.

월간 초기화 시점과 시간대는 Backend 계약에서 확정합니다. 기본 후보는 사용자의 App Store 구독 기준과 무관한 매월 1일 00:00 UTC 초기화입니다.

### 4.3 구독 종료 정책

구독이 만료되거나 결제가 복구되지 않아 Free로 전환되어도 다음을 유지합니다.

- 저장된 모든 로컬 레시피
- 저장 레시피 조회와 수정
- 기본 오디오 가이드
- Free 월간 AI 한도

Pro 한도를 이미 초과한 상태에서 Free로 전환되면 다음 Free 초기화 시점까지 새로운 AI 정리만 제한합니다.

## 5. 초기 가격 정책

### 5.1 출시 가격 가설

| 상품 | 대한민국 출시 가격 | 기능 | 상태 |
|---|---:|---|---|
| CookLog Pro 월간 | 월 4,900원 | Pro 전체 기능 | 가설 |
| CookLog Pro 연간 | 연 39,000원 | Pro 전체 기능 | 가설 |

연간 가격의 월 환산액은 3,250원이며 월간 상품 12개월 대비 약 34% 할인입니다.

초기에는 별도 무료 체험을 제공하지 않습니다. Free 플랜이 제품 체험 역할을 합니다. 전환율이 낮고 제품 가치 이해에 시간이 필요하다는 근거가 쌓이면 Apple의 introductory offer를 별도 실험합니다.

### 5.2 가격 확정 조건

출시 가격은 다음 항목이 확인된 뒤 App Store Connect에 최종 등록합니다.

1. AI provider와 model별 성공 호출 1회 평균 비용
2. Free와 Pro 예상 월간 AI 사용량
3. Backend 고정비와 사용자당 변동비
4. Apple 수수료와 적용 세금
5. 한국 App Store price point
6. TestFlight 또는 제한된 베타 사용자의 결제 의향

### 5.3 가격 변경 원칙

- 가격 변경은 Product Owner 승인이 필요합니다.
- 가격 인상 전 기존 구독자 유지 가격 여부를 결정합니다.
- 국가별 가격은 단순 환율이 아니라 구매력과 App Store 가격 체계를 함께 고려합니다.
- 가격 실험 결과와 변경 이유를 이 문서의 변경 이력과 `docs/PROJECT_DECISIONS.md`에 기록합니다.

## 6. 원가와 손익 기준

### 6.1 기본 공식

```text
월 순매출 추정
= 소비자 결제 금액
  - Apple 수수료
  - 적용 세금

월 기여이익
= 월 순매출
  - AI 변동비
  - Backend 사용자당 변동비
  - 결제·관측성 사용자당 변동비
```

목표:

```text
AI와 Backend 변동비 <= Pro 순매출의 20%
```

### 6.2 보수적 출시 계산

Small Business Program 적용 전을 고려해 Apple 정산 비율을 70%로 보수적으로 가정합니다. 실제 정산액은 세금과 계약 상태에 따라 달라집니다.

| 항목 | 월간 상품 | 연간 상품 월 환산 |
|---|---:|---:|
| 소비자 가격 | 4,900원 | 3,250원 |
| 70% 정산 가정 | 3,430원 | 2,275원 |
| 변동비 20% 한도 | 686원 | 455원 |
| Pro AI 30회 기준 1회당 예산 | 약 23원 | 약 15원 |

Backend 계약 단계에서 실제 provider 원가로 다시 계산하며, 기준을 초과하면 다음 순서로 대응합니다.

1. 더 적합한 model 또는 prompt/token 구조 적용
2. 실패 재시도와 중복 호출 감소
3. Pro 한도 조정
4. 가격 조정

### 6.3 T-010 비용 비교 필수 범위

T-010은 경쟁 서비스 가격만으로 CookLog 가격을 정하지 않고 실제 지출과 목표 기여이익을 함께 비교합니다.

- AI model별 성공 호출 비용, 재시도와 중복 호출 비용
- Backend·DB·로그·모니터링·배포의 고정비와 사용자당 변동비
- Apple 수수료, 적용 세금과 결제 관련 비용
- 무료 사용자, 체험 사용자와 실패 호출에서 발생하는 비용
- 고객지원, 법무, 도메인과 필수 운영 도구 비용
- 사용자당 월평균·피크 AI 사용량과 quota 악용 시 최대 손실
- 가격별 월간·연간 순매출, 기여이익과 손익분기 유료 사용자 수
- 보수·기준·성장 시나리오별 지속 가능성

첫 출시 기본값인 Apple 기기 내 STT는 별도 원격 호출비가 없는 경로로 계산합니다. 유료 원격 STT는 기본 원가와 자동 fallback에 포함하지 않고 향후 명시적 활성화 선택지의 별도 비용 시나리오로 관리합니다.

## 7. Paywall 정책

### 7.1 노출 위치

Paywall은 다음 시점에만 노출합니다.

- Free AI 정리 한도를 모두 사용한 뒤 `AI 정리하기`를 선택했을 때
- Pro 전용 AI 재정리 기능을 선택했을 때
- 설정 또는 계정 영역에서 사용자가 `CookLog Pro`를 직접 선택했을 때

### 7.2 금지 위치

- 첫 앱 실행 직후
- 첫 기록 시작 전
- 저장된 레시피 조회 중
- 기본 오디오 가이드 시작 시
- 사용자가 작성한 로컬 데이터에 접근하려 할 때

### 7.3 Paywall 필수 정보

- 상품명과 구독 기간
- Free와 Pro 기능 차이
- 실제 자동 갱신 결제 금액
- 연간 상품의 실제 연간 청구액
- 자동 갱신과 해지 안내
- 구매 복원
- 구독 관리 이동
- 개인정보처리방침
- 이용약관

## 8. 구독 제품과 기술 경계

### 8.1 App Store 구성

- Subscription Group: `CookLog Pro`
- 등급: Pro 1개
- 기간: 1개월, 1년
- iOS 구현: StoreKit 2
- 상품 식별자는 iOS 구현 Task에서 확정하고 이 문서에 기록합니다.

### 8.2 iOS 책임

- 상품 조회와 현지화 가격 표시
- 구매와 거래 검증
- 현재 entitlement 관찰
- 구매 복원
- 구독 관리 화면 이동
- 결제 중, 성공, 실패, 만료 상태 UI
- 오프라인 상태에서 마지막으로 검증된 entitlement 처리

### 8.3 Backend 책임

- Apple 서명 거래 또는 신뢰 가능한 entitlement 검증
- Free/Pro AI 사용량 집계
- quota 초과 차단
- 성공한 AI 결과에만 사용량 반영
- 환불, 취소, 만료와 billing 상태 반영
- App Store Server Notifications 연동 검토
- 클라이언트가 보내는 단순 `isPro` 값을 신뢰하지 않음

로그인 없는 초기 MVP에서는 구독 entitlement와 사용량을 어떤 식별자에 연결할지 Backend 계약에서 결정해야 합니다. 레시피 데이터는 기존 방침대로 로컬에 유지할 수 있습니다.

## 9. Apple 운영·심사 기준

자동 갱신 구독은 지속적인 가치를 제공해야 하며 구독 기간은 최소 7일이어야 합니다. 구독은 사용자가 지원하는 모든 기기에서 사용할 수 있어야 하고 구매 복원과 구독 관리 경로를 제공해야 합니다.

구독 구매 화면은 다음을 명확히 표시해야 합니다.

- 구독 이름과 기간
- 구독으로 제공하는 기능
- 자동 갱신 가격
- 연간 상품의 실제 총 청구 금액
- 무료 체험이 있다면 체험 기간과 종료 후 가격
- 구매 복원
- 이용약관과 개인정보처리방침

Apple 관련 기준은 구현과 출시 직전에 다시 확인합니다.

- [Apple Auto-renewable Subscriptions](https://developer.apple.com/app-store/subscriptions/)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect 구독 설정](https://developer.apple.com/help/app-store-connect/manage-subscriptions/offer-auto-renewable-subscriptions)
- [Apple Small Business Program](https://developer.apple.com/app-store/small-business-program/)

## 10. 성공 지표

### 10.1 제품 가치 지표

- 첫 레시피 생성 완료율
- 레시피 저장 완료율
- 두 번째 레시피 저장률
- 오디오 가이드 사용률
- 저장 레시피 재사용률

### 10.2 수익화 지표

- Free 사용자 중 AI 한도 도달률
- Paywall 노출 사용자 수
- Paywall 노출 대비 구매율
- 월간·연간 상품 선택 비율
- Pro 사용자당 AI 정리 횟수
- Pro 사용자당 AI·Backend 변동비
- 구독 갱신률
- 취소율
- 환불률
- 결제 실패 복구율

### 10.3 이벤트 후보

```text
ai_quota_viewed
ai_quota_exhausted
paywall_viewed
subscription_product_selected
subscription_purchase_started
subscription_purchase_succeeded
subscription_purchase_failed
subscription_restored
subscription_expired
subscription_manage_opened
```

이벤트에는 음성 원문, STEP Preview 본문, 레시피 내용 등 사용자 요리 데이터를 포함하지 않습니다.

## 11. 출시 게이트

구독 기능은 다음 조건을 모두 만족해야 초기 실서비스에 포함할 수 있습니다.

- Free/Pro entitlement가 명세대로 동작합니다.
- 월간·연간 구매가 Sandbox에서 통과합니다.
- 구매 취소, 실패, 복원, 만료를 검증했습니다.
- 앱 재실행 후 Pro 상태가 유지됩니다.
- 구독 만료 후 사용자 레시피가 유지됩니다.
- Free와 Pro AI quota가 Backend에서 강제됩니다.
- 실패한 AI 요청은 사용량에서 제외됩니다.
- Paywall에 필수 가격·약관·복원 정보가 표시됩니다.
- 개인정보처리방침과 이용약관 URL이 준비되어 있습니다.
- AI와 Backend 예상 변동비가 순매출의 20% 이내입니다.
- TestFlight에서 실제 상품 설정과 주요 흐름을 확인했습니다.

## 12. 실행 작업 구조

수익화는 하나의 구현 Task로 처리하지 않고 다음 단위로 분리합니다.

1. 수익화 제품 정책과 가격·원가 모델 확정
2. Figma 구독 UX와 Paywall 설계
3. Backend entitlement·AI quota 계약
4. App Store Connect 상품과 법무 정보 준비
5. StoreKit 2 구독 구현
6. Backend 거래 검증과 quota 구현
7. 수익화 이벤트와 비용 관측성 구현
8. Sandbox·TestFlight 구독 QA
9. 초기 실서비스 수익화 완료 검토

각 Task는 Product, Design, Development, Quality Team의 기존 ownership과 workflow를 따릅니다.

### 12.1 등록 Task와 실행 순서

| 단계 | Task ID | 실행 조건 |
|---|---|---|
| 정책 | `T-20260728-010` | Backend foundation과 실서비스 준비도 완료 후 Product Owner 활성화 승인 |
| Design | `T-20260728-011` | 최종 로컬 UI/UX 원본과 가격·기능 정책 승인 |
| 계약 | `T-20260728-012` | Backend foundation과 가격·quota 확정 |
| 상품 준비 | `T-20260728-013` | 가격과 초기 출시 목표 확정 |
| iOS 구현 | `T-20260728-014` | Figma, 계약, App Store 상품 준비 완료 |
| Backend 구현 | `T-20260728-015` | entitlement 계약과 상품 정보 완료 |
| 관측성 | `T-20260728-016` | iOS·Backend 구독 구현 완료 |
| 통합 QA | `T-20260728-017` | CI와 구독 구현·관측성 완료 |
| 출시 판정 | `T-20260728-018` | Sandbox·TestFlight 검증 완료 |

모든 Task는 초기 등록 시 `proposed`로 유지합니다. `depends_on`이 완료되고 현재 제품 Queue에서 실서비스 수익화의 우선순위가 도래했을 때만 각 Lead가 `scoped`로 전환하며, Product Owner 승인 전에는 실행하지 않습니다. WIP 브랜치의 선행 설계나 검증 기록은 보존 자료일 뿐 `develop`에 별도 검증·통합되기 전에는 공식 상태 전이나 의존성 해제 근거로 사용하지 않습니다.

## 13. 지속 관리 규칙

### 13.1 정기 검토

- 출시 전: 각 수익화 관련 Task 완료 시
- 출시 후 첫 3개월: 매월
- 안정화 이후: 분기별

### 13.2 즉시 검토 조건

다음 상황에서는 정기 주기와 무관하게 문서를 검토합니다.

- AI provider 또는 model 변경
- App Store 수수료·정책 변경
- Pro 사용자당 변동비가 순매출의 20%를 초과
- 가격, AI 한도 또는 Pro 기능 변경
- 환불·취소 또는 결제 실패가 주요 문제로 확인
- 새로운 Import, 동기화 기능 또는 유료 원격 STT 활성화
- Android 또는 Web 결제 도입

### 13.3 변경 권한

| 변경 종류 | 제안 | 검토 | 승인 |
|---|---|---|---|
| 제품 원칙 | Product Lead Agent | 관련 Team Lead | Product Owner |
| Free/Pro 기능 경계 | Product Lead Agent | Design/Development Lead | Product Owner |
| 가격·할인·체험 | Product Lead Agent | Backend 원가 검토 | Product Owner |
| AI quota | Product Lead Agent | Backend Agent | Product Owner |
| Paywall UX | UI/UX Design Agent | Design Lead/Design QA | Product Owner |
| StoreKit·Backend 구현 | iOS/Backend Agent | Development Lead/QA | 기존 Task 승인 절차 |
| Apple 정책 반영 | Product Planning Agent | QA/Development Lead | Product Owner 필요 여부 판단 |

### 13.4 갱신 절차

1. 변경 이유와 근거 지표를 수집합니다.
2. 기존 사용자, 비용, UX와 기술 영향 범위를 작성합니다.
3. 가격·기능·한도 변경은 Product Owner 승인을 받습니다.
4. 이 문서의 관련 절과 변경 이력을 갱신합니다.
5. `docs/PROJECT_DECISIONS.md`에 확정 결정을 기록합니다.
6. 사용자에게 영향을 주는 출시 변경은 `docs/PROJECT_CHANGELOG.md`에 기록합니다.
7. 관련 Task와 Team board를 갱신합니다.

## 14. 외부 가격 참고

가격 참고 자료는 기능 범위와 국가가 다르므로 CookLog 가격을 직접 결정하는 근거가 아니라 시장 위치를 확인하는 보조 자료로만 사용합니다.

| 서비스 | 확인 가격 | 주요 유료 가치 | 확인일 |
|---|---|---|---|
| ReciMe Plus | 미국 연 $39.99 | Import, 영양 정보, 스캔 등 | 2026-07-28 |
| Samsung Food+ | 미국 연 $59.99 | 식단, 영양, 건강 기능 | 2026-07-28 |

- [ReciMe 공식 가격 안내](https://recime.app/help/en/articles/11630592-how-much-does-the-recime-subscription-cost)
- [Samsung Food+ 공식 기능·가격 안내](https://support.samsungfood.com/hc/en-us/articles/32709269852052-What-s-Included-in-Your-Samsung-Food-Subscription)

## 15. 결정 상태

### 확정

- 초기 실서비스 BM은 Free + CookLog Pro 구독입니다.
- Pro는 하나의 등급으로 월간·연간 상품을 제공합니다.
- 광고, 주간 구독, 평생 이용권은 초기 범위에서 제외합니다.
- 저장된 로컬 레시피와 기본 오디오 가이드는 구독 만료 후에도 사용할 수 있습니다.
- 실제 제공 전인 향후 기능은 현재 Pro 혜택으로 판매하지 않습니다.

### 출시 가설

- Free AI 정리 월 3회
- Pro AI 정리 월 30회
- 월 4,900원
- 연 39,000원
- 별도 무료 체험 없음
- 변동비 상한은 Pro 순매출의 20%

### 미결정

- AI provider와 model
- AI 사용량 초기화 시점
- 로그인 없는 사용자와 entitlement 연결 방식
- StoreKit 상품 식별자
- Small Business Program 적용 여부
- 구독 분석 도구
- 개인정보처리방침과 이용약관 게시 위치

## 16. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-28 | 초기 Free/Pro 모델, 가격·quota 가설, 원가 기준, Paywall, Apple 요건, 지표와 지속 관리 절차를 최초 작성 |
| 2026-07-28 | 제품 준비도에 따라 실행할 수익화 Task `T-20260728-010`~`018`과 activation gate를 연결 |
| 2026-08-04 | 최신 develop에 Source of Truth와 `proposed` 후보 Task를 복구하고 Core v1 비차단·비용 기반 T-010·기기 내 STT 원가 경계를 명확화 |
