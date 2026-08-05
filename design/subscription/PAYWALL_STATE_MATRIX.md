# CookLog Paywall 상태 매트릭스

작성일: 2026-08-04  
기준 Task: `T-20260728-011`

## 1. URL 검토 상태

로컬 프로토타입:

```text
subscription.html?view=paywall&state=ready&entry=quota
subscription.html?view=paywall&state=purchasing
subscription.html?view=paywall&state=product-loading
subscription.html?view=paywall&state=product-error
subscription.html?view=status&state=free-exhausted
subscription.html?view=status&state=pro-active&theme=dark
subscription.html?view=status&state=expired&viewport=small
```

## 2. Paywall 상태

| 상태 키 | 트리거 | 필수 UI | 가능 행동 | 종료 |
|---|---|---|---|---|
| `ready` | 상품 조회 성공 | 비교표, 월/연, 총 청구액, 법적 고지 | 플랜 선택, 구매, 복원, 닫기 | purchasing/복원/원래 화면 |
| `product-loading` | 상품 조회 중 | skeleton, 조회 중 설명 | 닫기 | StoreKit 결과로 ready/error |
| `product-error` | 상품 조회 실패 | 가격 미표시, 다시 시도, 구매 복원 | 다시 시도, 복원, 닫기 | loading/restoring/원래 화면 |
| `offline` | 네트워크 없음 | 마지막 가격을 구매 가능 가격처럼 표시하지 않음, 복원 비활성 사유 | 다시 시도, 닫기 | 연결 후 loading/원래 화면 |
| `purchasing` | 구매 시작 | 선택 상품, progress, 중복 방지 | 없음 | StoreKit·검증 결과로 success/cancelled/failed/pending |
| `success` | 거래·entitlement 검증 성공 | Pro 활성, 다음 행동 | 계속하기 | 진입 맥락 또는 status |
| `cancelled` | 사용자 취소 | 중립 인라인 안내 | 다시 선택, 닫기 | ready/원래 화면 |
| `failed` | 구매 실패 | 오류 안내, 데이터 보호 문구 | 다시 시도, 닫기 | purchasing/원래 화면 |
| `pending` | Ask to Buy 등 승인 대기 | 보류 안내, 중복 구매 금지 | 완료 | 원래 화면 |
| `restoring` | 복원 시작 | progress, 중복 방지 | 없음 | StoreKit 동기화·검증 결과로 restored/none/restore-failed |
| `restored` | entitlement 복원 성공 | 현재 Pro 상태 | 계속 | status |
| `restore-none` | 복원 항목 없음 | 중립 안내 | 확인 | ready |
| `restore-failed` | 복원 실패 | 오류 안내 | 다시 시도, 닫기 | restoring/원래 화면 |

## 3. 진입 맥락

| entry | 제목 | 보조 설명 | 구매 성공 후 CTA |
|---|---|---|---|
| `quota` | 이번 달 Free AI 정리를 모두 사용했어요 | STEP Preview와 기록은 그대로 보관됨 | AI 정리 계속하기 |
| `feature` | AI 재정리는 CookLog Pro에서 | 편집한 레시피 draft는 그대로 유지됨 | 레시피로 돌아가기 |
| `voluntary` | 기록은 그대로, AI는 더 넉넉하게 | Free/Pro 차이를 자발적으로 비교 | 구독 상태 보기 |

### 부모 화면 종료 목적지

| 맥락 | 닫기 | 구매 성공 CTA | 보존 |
|---|---|---|---|
| quota | Cooking Log / STEP Preview | AI Review / Processing | STEP Preview, 녹음 세션 |
| feature | AI Review / Editable | AI Review / Editable | 편집 draft |
| voluntary | 설정 | 구독 및 사용량 / Pro Active | 현재 또는 검증된 Pro entitlement |
| 구독 및 사용량 | 설정 | 해당 없음 | 현재 entitlement 표시 상태 |

독립 프로토타입은 앱 프레임 밖 목적지 패널과 `cooklog:subscription-route` 이벤트로 이동을 표현한다. Paywall `ready`, `free-normal` 또는 다른 entitlement 상태로 대체하지 않는다.

## 4. 사용량·entitlement 상태

| 상태 키 | 표시 | CTA | AI 정리 | 로컬 데이터·기본 오디오 |
|---|---|---|---|---|
| `free-normal` | Free, 잔여 `{remaining}` | Pro 알아보기 | 잔여량 내 가능 | 유지 |
| `free-near-limit` | 1회 이하, 초기화 시점 | Pro 알아보기 | 잔여량 내 가능 | 유지 |
| `free-exhausted` | 0회, 초기화 시점 | Pro 알아보기 | 제한 | 유지 |
| `pro-active` | Pro, `{remaining}/{proQuota}` | 구독 관리 | 잔여량 내 가능 | 유지 |
| `billing-retry` | 결제 재시도 중 | 결제 방법 확인 | Backend 계약 기준 | 유지 |
| `grace-period` | 결제 유예 기간 | 구독 관리 | 마지막 검증 entitlement 기준 | 유지 |
| `cancel-scheduled` | `{expirationDate}` 종료 예정 | 구독 관리 | 기간 말까지 Pro | 유지 |
| `expired` | Free 전환 | Pro 다시 시작 | Free quota 기준 | 유지 |
| `refunded` | 환불·철회로 Free 전환 | 문의 / Pro 알아보기 | Free quota 기준 | 유지 |
| `verification-unknown` | 상태 확인 불가 | 다시 확인 | 새 유료 소비 행동 보류 | 유지 |

## 5. CTA 활성 규칙

| 조건 | 구매 CTA | 플랜 변경 | 닫기 | 복원 |
|---|---|---|---|---|
| 상품 조회 중 | 비활성 | 비활성 | 활성 | 비활성 |
| 상품 조회 실패 | 비활성 | 비활성 | 활성 | 활성 |
| 오프라인 | 비활성 | 비활성 | 활성 | 비활성—네트워크 연결 필요 |
| Ready | 활성 | 활성 | 활성 | 활성 |
| 구매·복원 중 | 비활성 | 비활성 | 비활성 | 비활성 |
| 승인 대기 | 비활성 | 비활성 | 활성 | 비활성 |
| 성공 | 맥락 CTA로 교체 | 비활성 | 활성 | 비활성 |

## 6. 회귀 체크

- Paywall을 닫아도 Cooking Log의 STEP Preview가 유지된다.
- AI Review에서 닫아도 편집 draft가 유지된다.
- 구매 성공 전 entitlement를 Pro로 표시하지 않는다.
- 사용자 취소에 오류 배너를 사용하지 않는다.
- 실패·복원 없음·오프라인을 서로 다른 카피와 상태로 구분한다.
- 만료·환불·검증 불가 상태에서도 로컬 레시피와 기본 오디오 가이드가 열린다.
- 375×667에서 CTA, 구매 복원, 약관과 개인정보 링크에 스크롤로 접근 가능하다.
- Light/Dark에서 선택·오류·성공이 색상 외 정보로 구분된다.
- Product Loading, Purchasing, Restoring의 앱 화면에 임의 완료·성공 버튼이 없다.
- 플랜 group은 선택 radio 하나만 `tabindex=0`이며 방향키·Home·End가 선택과 포커스를 동기화한다.
- 앱 전체가 live region이 아니며 진행·성공·보류는 제한된 status, 오류는 alert 하나로만 안내된다.
- 세 진입 맥락의 닫기와 구매 성공 CTA가 부모 route callback을 발생시키며 Paywall 내부 상태로 대체되지 않는다.
- 구독 및 사용량 닫기가 source entitlement 상태를 callback detail에 보존한다.

## 7. quota 표시 계약

| 필드 | 의미 | 표시 규칙 |
|---|---|---|
| `used` | 현재 주기에 성공 처리된 AI 정리 횟수 | `used/limit회 사용` |
| `limit` | 현재 plan의 주기 한도 | progressbar `aria-valuemax` |
| `remaining` | `max(limit - used, 0)` | 보조 문구와 `aria-valuetext` |
| 진행률 | `used / limit × 100` | 모든 entitlement 상태에서 동일한 `사용량` 의미 |

검증 불가 상태는 추정값이나 고정 비율을 표시하지 않고 progressbar를 숨긴다.
