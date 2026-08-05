# CookLog Paywall 카피 토큰

작성일: 2026-08-04  
정책 상태: `T-20260728-010` 완료 전 가설 토큰

## 1. 값 토큰

| 토큰 | 가설 예시 | 주입 책임 | 잠금 조건 |
|---|---|---|---|
| `{monthlyPrice}` | `월 4,900원` | StoreKit 현지화 가격 | 상품 정책·StoreKit 확인 |
| `{annualPrice}` | `연 39,000원` | StoreKit 현지화 가격 | 상품 정책·StoreKit 확인 |
| `{annualBilling}` | `오늘 연 39,000원 결제` | StoreKit 가격+기간 | 연간 실제 총액 확인 |
| `{annualMonthlyEquivalent}` | `월 3,250원 수준` | 제품 계산값 | 반올림 규칙 확인 |
| `{annualDiscount}` | `약 34% 절약` | 제품 계산값 | 비교 기준·표시 승인 |
| `{freeQuota}` | `3회` | Backend 정책 | T-20260728-010·012 |
| `{proQuota}` | `30회` | Backend 정책 | T-20260728-010·012 |
| `{remaining}` | `0회` | Backend 응답 | quota 계약 확정 |
| `{resetAt}` | `9월 1일` | Backend 현지화 시각 | 시간대·초기화 정책 확정 |
| `{expirationDate}` | `9월 18일` | StoreKit entitlement | 현지화 날짜 규칙 확인 |

값을 문장 안에서 문자열 결합하지 말고 현지화 가능한 완성 문구의 인자로 전달한다. StoreKit이 제공한 가격 문자열을 숫자로 다시 포맷하지 않는다.

## 2. Paywall 공통

| 키 | 기본 카피 |
|---|---|
| `paywall.brand` | CookLog Pro |
| `paywall.title.voluntary` | 기록은 그대로, AI는 더 넉넉하게 |
| `paywall.title.quota` | 이번 달 Free AI 정리를 모두 사용했어요 |
| `paywall.title.feature` | AI 재정리는 CookLog Pro에서 |
| `paywall.body.voluntary` | 10초 기록과 저장 레시피는 Free에서도 계속 사용할 수 있어요. |
| `paywall.body.quota` | 지금까지 남긴 STEP Preview는 안전하게 보관돼요. Pro를 선택하거나 {resetAt} 이후 다시 정리할 수 있어요. |
| `paywall.body.feature` | 현재 편집한 레시피는 그대로 유지됩니다. |
| `paywall.close` | 닫기 |
| `paywall.compare.heading` | Free와 Pro 비교 |

## 3. 플랜과 가격

| 키 | 기본 카피 |
|---|---|
| `plan.monthly.name` | 월간 |
| `plan.monthly.price` | {monthlyPrice} |
| `plan.monthly.billing` | 매월 자동 갱신 |
| `plan.annual.name` | 연간 |
| `plan.annual.price` | {annualPrice} |
| `plan.annual.equivalent` | {annualMonthlyEquivalent} · 참고용 환산 |
| `plan.annual.billing` | {annualBilling} 후 매년 자동 갱신 |
| `plan.annual.discount` | {annualDiscount} |
| `purchase.cta.monthly` | 월간 Pro 시작하기 |
| `purchase.cta.annual` | 연간 Pro 시작하기 |
| `purchase.disclosure` | 결제는 Apple ID로 청구되며 현재 기간 종료 24시간 전까지 해지하지 않으면 자동 갱신됩니다. 구독은 App Store 설정에서 관리하거나 해지할 수 있습니다. |
| `purchase.restore` | 구매 복원 |
| `purchase.terms` | 이용약관 |
| `purchase.privacy` | 개인정보처리방침 |

`annualDiscount`는 확정 전 화면에서 `가설` 배지와 함께만 검토하며 출시 UI에서는 승인된 값일 때만 노출한다.

## 4. 상품 조회

| 키 | 기본 카피 |
|---|---|
| `product.loading.title` | 구독 상품을 확인하고 있어요 |
| `product.loading.body` | App Store의 현재 가격을 불러옵니다. |
| `product.error.title` | 구독 상품을 불러오지 못했어요 |
| `product.error.body` | 가격을 확인할 수 없어 지금은 구매를 진행할 수 없습니다. |
| `product.offline.title` | 인터넷 연결을 확인해주세요 |
| `product.offline.body` | 연결 후 App Store의 현재 가격을 다시 확인할 수 있어요. |
| `product.offline.restoreDisabled` | 구매 복원은 네트워크 연결 후 사용할 수 있어요. |
| `product.retry` | 다시 확인 |

## 5. 구매·복원

| 키 | 기본 카피 |
|---|---|
| `purchase.purchasing.title` | 구매를 확인하고 있어요 |
| `purchase.purchasing.body` | App Store 확인이 끝날 때까지 잠시 기다려주세요. |
| `purchase.success.title` | CookLog Pro가 시작됐어요 |
| `purchase.success.body` | StoreKit 거래와 entitlement 검증을 완료했습니다. 이제 Pro AI 사용량을 이용할 수 있어요. |
| `purchase.cancelled.title` | 구매를 취소했어요 |
| `purchase.cancelled.body` | 결제되지 않았습니다. Free 기능은 그대로 사용할 수 있어요. |
| `purchase.failed.title` | 구매를 완료하지 못했어요 |
| `purchase.failed.body` | 결제되지 않았습니다. 잠시 후 다시 시도해주세요. |
| `purchase.pending.title` | 승인을 기다리고 있어요 |
| `purchase.pending.body` | 승인이 완료되면 구독 상태에 자동으로 반영됩니다. 중복 구매할 필요가 없어요. |
| `restore.restoring.title` | 구매 내역을 확인하고 있어요 |
| `restore.success.title` | 검증된 CookLog Pro를 복원했어요 |
| `restore.none.title` | 복원할 구매를 찾지 못했어요 |
| `restore.none.body` | 현재 Apple ID에서 활성 구독을 확인하지 못했습니다. |
| `restore.failed.title` | 구매를 복원하지 못했어요 |

## 6. 사용량·entitlement

| 키 | 기본 카피 |
|---|---|
| `quota.free.normal` | 이번 주기 AI 정리 {remaining} 남음 |
| `quota.free.near` | AI 정리가 1회 남았어요 |
| `quota.free.exhausted` | Free AI 정리를 모두 사용했어요 |
| `quota.reset` | {resetAt}에 다시 사용할 수 있어요. |
| `quota.pro` | Pro AI 정리 {remaining}/{proQuota} 남음 |
| `status.active` | CookLog Pro 사용 중 |
| `status.billingRetry` | 결제를 다시 확인하고 있어요 |
| `status.grace` | 결제 정보를 확인해주세요 |
| `status.cancelScheduled` | {expirationDate}까지 Pro를 사용할 수 있어요 |
| `status.expired` | CookLog Free로 전환됐어요 |
| `status.refunded` | 구독이 종료되어 Free로 전환됐어요 |
| `status.unknown` | 구독 상태를 확인할 수 없어요 |
| `status.dataSafe` | 저장한 레시피와 기본 오디오 가이드는 계속 사용할 수 있어요. |
| `status.manage` | 구독 관리 |
| `status.refresh` | 상태 다시 확인 |

## 7. 잠금 체크리스트

- [ ] 모든 가격이 StoreKit 현지화 문자열과 일치한다.
- [ ] 연간 총 청구액이 월 환산액보다 명확하다.
- [ ] 할인율 계산·반올림 기준이 승인됐다.
- [ ] Free·Pro quota와 초기화 시점이 Backend 계약과 일치한다.
- [ ] AI 재정리가 출시 상품에 실제 포함된다.
- [ ] 이용약관·개인정보처리방침 URL이 준비됐다.
- [ ] 한국어 VoiceOver 가격 읽기와 Dynamic Type을 실제 기기에서 확인했다.
