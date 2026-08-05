# CookLog 구독·Paywall UX 명세

작성일: 2026-08-04  
기준 Task: `T-20260728-011`  
상태: 가격 정책 확정 전 구조 설계  
UI Source of Truth: `design/prototype/subscription.html`

## 1. 설계 목표

CookLog Pro는 기록과 재사용을 잠그는 상품이 아니라 지속 비용이 드는 AI 사용량을 확장하는 선택지다. 사용자는 결제하지 않아도 10초 기록, STEP Preview, 로컬 레시피 저장·조회와 기본 오디오 가이드를 계속 사용할 수 있다.

이 명세의 가격·할인율·quota·초기화 시점은 가설 토큰이다. `T-20260728-010` 완료 후 확정값으로 교체하고 Design QA를 다시 수행한다.

## 2. UX 원칙

1. 핵심 가치를 경험하기 전에 결제를 요구하지 않는다.
2. 사용자가 시작한 기록과 로컬 데이터 접근을 Paywall로 가로막지 않는다.
3. Paywall은 차단 이유와 계속 가능한 Free 기능을 함께 설명한다.
4. 월간·연간은 기능이 동일하며 결제 기간과 실제 청구액만 다르다.
5. 가격 조회 실패를 무료나 0원으로 표시하지 않는다.
6. 구매·복원 진행 중에는 중복 요청을 막고 화면을 임의로 닫지 않는다.
7. 사용자 취소는 오류로 취급하지 않는다.
8. 만료·환불·결제 문제 후에도 기존 레시피와 기본 오디오 가이드 유지 사실을 명시한다.

## 3. 진입점

| 진입점 | 조건 | Paywall 첫 메시지 | 닫기 후 복귀 |
|---|---|---|---|
| AI 정리하기 | Free AI 정리 잔여량 0 | 이번 기록은 보존되며 다음 초기화 전 Pro가 필요함 | Cooking Log, STEP Preview 유지 |
| AI 재정리 | Pro 전용 기능 선택 | Pro에서 AI 재정리를 사용할 수 있음 | AI Review, 편집 draft 유지 |
| 설정 > CookLog Pro | 사용자 자발적 선택 | Free/Pro 비교와 현재 사용량 | 설정 |

### 금지 진입점

- 첫 앱 실행 직후
- 첫 기록 시작 전
- 저장 레시피 조회·수정
- 기본 오디오 가이드 시작
- 사용자가 작성한 로컬 데이터 접근

## 4. 화면 구조

### 4.1 Paywall

시각·VoiceOver 순서:

1. 닫기
2. 진입 맥락에 맞는 제목과 설명
3. 현재 사용량 또는 Pro 가치 요약
4. Free/Pro 기능 비교
5. 월간·연간 플랜 선택
6. 선택 상품의 실제 청구 문구
7. 구독 CTA
8. 자동 갱신·해지 안내
9. 구매 복원
10. 이용약관·개인정보처리방침

연간 카드는 월 환산 참고값보다 `연 {annualPrice} 청구`를 더 높은 우선순위로 표시한다. 할인 배지는 `T-20260728-010`에서 확정된 계산값이 있을 때만 노출한다.

### 4.2 구독 및 사용량

- 현재 플랜: Free 또는 CookLog Pro
- AI 정리 잔여량과 전체량
- 다음 초기화 시점
- entitlement 상태 설명
- Pro 알아보기 또는 구독 관리
- 구매 복원
- 데이터 보호 안내

## 5. 핵심 흐름

### 5.1 Free 한도 도달

```text
Cooking Log / STEP 누적
-> AI 정리하기
-> quota exhausted 확인
-> Paywall / quota
-> 닫기: Cooking Log로 복귀, STEP 유지
-> 구매 성공: Pro 활성 확인
-> 사용자가 AI 정리 계속하기 선택
-> AI Review / Processing
```

구매 성공 직후 AI 정리를 자동 실행하지 않는다. 사용자가 상태를 확인하고 `AI 정리 계속하기`를 선택해야 비용 발생 행동이 시작된다.

### 5.2 Pro 재정리

```text
AI Review / 편집 draft
-> AI 재정리
-> Paywall / feature
-> 닫기: AI Review 복귀, draft 유지
-> 구매 성공
-> AI Review 복귀
```

### 5.3 자발적 진입

```text
설정
-> CookLog Pro
-> Paywall / voluntary
-> 구매 성공
-> 구독 및 사용량 / Pro Active
```

### 5.4 구매

```text
Ready -> Purchasing
Purchasing -> Success | User Cancelled | Failed | Pending Approval
```

- Purchasing에서는 플랜, 닫기, 구매 복원과 CTA를 비활성화한다.
- Product Loading, Purchasing, Restoring 화면에는 임의 완료·성공 조작을 두지 않는다.
- Success와 Restored는 StoreKit 거래·동기화와 entitlement 검증 완료 결과로만 표시한다.
- 로컬 프로토타입의 상태 전환은 모바일 앱 프레임 밖 `SCREEN STATES` 검토 패널에서만 수행한다.
- User Cancelled는 인라인 중립 메시지 후 Ready로 돌아간다.
- Failed는 원인 추정 대신 재시도와 닫기를 제공한다.
- Pending Approval은 중복 구매를 막고 나중에 상태가 반영될 수 있음을 설명한다.

### 5.5 복원

```text
Ready -> Restoring
Restoring -> Restored | Nothing To Restore | Restore Failed
```

- 복원 성공 시 현재 플랜 화면으로 이동한다.
- 복원할 구매 없음은 오류색을 사용하지 않는다.
- 실패 시 네트워크·App Store 계정 확인과 다시 시도를 제공한다.
- 상품 조회 실패에서는 기존 구매자를 위해 구매 복원을 제공한다.
- 오프라인에서는 복원을 비활성화하고 네트워크 연결이 필요한 이유를 인접 문구와 `aria-describedby`로 설명한다.

## 6. 플랜 비교

| 기능 | Free | Pro |
|---|---|---|
| 10초 음성 기록·STEP Preview | 제공 | 제공 |
| 로컬 레시피 저장·조회 | 제한 없음 | 제한 없음 |
| 기본 오디오 가이드 | 제공 | 제공 |
| AI 레시피 정리 | `{freeQuota}`/초기화 주기 | `{proQuota}`/초기화 주기 |
| AI 재정리 | 미제공 | 제공 예정 |

`AI 재정리`가 실제 구현 범위에서 제외되면 Paywall 혜택과 진입점에서도 제거한다. 향후 기능을 현재 판매 혜택처럼 표시하지 않는다.

## 7. 상태별 정책

| 상태 | 사용자 메시지 핵심 | 주요 행동 | 데이터 접근 |
|---|---|---|---|
| Free Normal | 잔여량·초기화 시점 | Pro 알아보기 | 모두 유지 |
| Free Near Limit | 곧 한도 도달 | 계속 사용 / Pro 알아보기 | 모두 유지 |
| Free Exhausted | 다음 AI 정리 제한 | Pro 알아보기 | 기존 레시피·오디오 유지 |
| Pro Active | 활성·잔여량 | 구독 관리 | 모두 유지 |
| Billing Retry | 결제 복구 시도 중 | 결제 방법 확인 | 기존 레시피·오디오 유지 |
| Grace Period | 일시적 결제 문제 | 구독 관리 | 마지막 검증 entitlement 정책 적용 |
| Expired | Free 전환 | Pro 다시 시작 | 기존 레시피·오디오 유지 |
| Cancel Scheduled | 기간 말 종료 예정 | 구독 관리 | 기간 중 Pro 유지 |
| Refunded/Revoked | Free 전환 | 문의 / Pro 알아보기 | 기존 레시피·오디오 유지 |
| Verification Unknown | 상태 확인 불가 | 다시 확인 | 로컬 데이터 접근 유지 |

## 8. 반응형과 테마

- 기준 viewport: 390×844, 375×667
- 작은 화면에서 헤더·본문은 스크롤되고 선택 상품 CTA는 플랜 목록 다음에 배치한다.
- CTA와 법적 고지가 다른 콘텐츠를 덮지 않으며 하단 safe-area와 스크롤 여백을 둔다.
- Dynamic Type에서 플랜 카드 가격·기간·배지는 줄바꿈 가능해야 한다.
- Light/Dark 모두 기존 CookLog semantic token을 사용한다.
- 선택 상태는 테두리, radio 표시, `선택됨` 텍스트를 함께 사용한다.
- 플랜 radio group은 선택 항목 하나만 Tab 순서에 두고 방향키·Home·End로 포커스와 선택을 함께 이동한다.
- 오류·성공·보류 상태는 색상뿐 아니라 아이콘과 제목으로 전달한다.

## 9. 접근성

- 모든 조작 요소 최소 44×44pt
- 일반 텍스트 WCAG AA 4.5:1 이상
- 플랜 선택은 단일 선택 radio group으로 노출
- 가격은 VoiceOver에서 상품명, 기간, 총 청구액, 선택 상태 순으로 읽음
- 전역 앱 컨테이너에는 live region을 사용하지 않는다.
- 구매·복원 진행과 성공·보류 메시지만 한정된 `role=status`, `aria-live=polite`, `aria-atomic=true`로 알린다.
- 실패 메시지는 `role=alert`만 사용해 polite 안내와 중복 낭독하지 않는다.
- 법적 링크의 목적을 링크 텍스트만으로 이해 가능하게 작성
- Dynamic Type 확대 시 고정 높이로 카피를 자르지 않음
- Reduce Motion에서는 성공 전환과 loading 애니메이션을 축소

## 10. 구현 계약

### UI 입력

- StoreKit 현지화 상품명·가격·기간
- entitlement 상태와 마지막 검증 시각
- quota used, limit, remaining, resetAt
- 구매·복원 상태
- 이용약관·개인정보처리방침·구독 관리 URL

### UI가 가정하지 않는 것

- 클라이언트 `isPro`만으로 entitlement 확정
- 가격 문자열 직접 조합
- 월 환산액을 실제 월 청구액으로 표현
- 실패한 AI 요청의 quota 차감
- 만료 시 로컬 레시피 삭제 또는 잠금

### 부모 화면 라우팅 adapter

독립 프로토타입은 부모 화면을 Paywall 내부 상태로 대체하지 않는다. 아래 detail로 `cooklog:subscription-route` 이벤트를 발생시키고, 앱 통합 시 선택적 `CookLogSubscriptionAdapter.navigate(detail)`에 같은 값을 전달한다.

| source | action | route | 보존 상태 |
|---|---|---|---|
| quota Paywall | close | `cooking-log` | STEP Preview, 녹음 세션 |
| quota Success | success | `ai-review-processing` | STEP Preview, 녹음 세션 |
| feature Paywall | close | `ai-review-editable` | 편집 draft |
| feature Success | success | `ai-review-editable` | 편집 draft |
| voluntary Paywall | close | `settings` | 현재 entitlement |
| voluntary Success | success | `subscription-status-pro` | 검증된 Pro entitlement |
| Subscription Status | close | `settings` | 현재 화면의 entitlement 표시 상태 |

콜백 detail은 `action`, `entry`, `sourceView`, `sourceState`, `route`, `label`, `preserved`를 포함한다. 닫기 자체는 entitlement나 Paywall state를 변경하지 않는다.

### quota 표시 계산

- 화면의 진행 막대 의미는 항상 `AI 정리 사용량`이다.
- 입력값은 `used`, `limit`, `remaining`이며 `remaining = max(limit - used, 0)`을 만족해야 한다.
- 진행률은 `used / limit × 100`으로 계산하고 상태별 고정 비율을 사용하지 않는다.
- 결제 재시도·유예·취소 예정도 마지막으로 확인된 quota 값을 표시한다.
- entitlement 또는 quota 검증 불가 상태에서는 진행 막대를 숨기고 `확인 불가`로 표시한다.

### 이벤트

| 이벤트 | 최소 속성 | 금지 속성 |
|---|---|---|
| `ai_quota_viewed` | plan, remainingBand | 요리·레시피 내용 |
| `ai_quota_exhausted` | entryPoint | 음성·STEP 원문 |
| `paywall_viewed` | entryPoint, entitlementState | 사용자 작성 콘텐츠 |
| `subscription_product_selected` | productPeriod | 가격 외 민감정보 |
| `subscription_purchase_started` | productPeriod | 거래 원문 |
| `subscription_purchase_succeeded` | productPeriod | 영수증·transaction payload |
| `subscription_purchase_failed` | productPeriod, normalizedReason | 원시 오류·계정정보 |
| `subscription_restored` | result | transaction payload |
| `subscription_manage_opened` | entitlementState | 개인 콘텐츠 |

## 11. 완료 전 잠금 항목

`T-20260728-010` 완료 후 아래 토큰을 교체하고 재검증한다.

- 월간·연간 현지화 가격
- 연간 총 결제액과 월 환산 참고값
- 할인율과 할인 배지 노출 여부
- Free·Pro quota
- quota 초기화 시점·시간대 문구
- AI 재정리 출시 포함 여부
