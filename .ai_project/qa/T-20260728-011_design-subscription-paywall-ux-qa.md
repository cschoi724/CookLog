# T-20260728-011 Design QA 독립 검증 보고서

작성일: 2026-08-04  
작성자: Design QA Agent  
대상 Task: `T-20260728-011`  
판정: `verification_passed`

## 1. 검증 요약

Paywall 13개와 구독·사용량 10개 상태, 3개 진입 맥락, Light/Dark와 375×667 스크롤 구조는 재현됐다. 가격·할인·quota·초기화 시점도 정책 확정 전 가설로 표시되고 교체 토큰이 문서화됐다.

초기 검증에서 확인한 5개 결함과 후속 `DQA-HIGH-006`은 재작업 후 모두 통과했다. 실제 Chrome에서 세 진입 맥락의 닫기·구매 성공 CTA 6개와 Pro Active·Expired status 닫기 2개를 재현했으며 adapter callback, route event, reviewer 표시와 source state 보존이 모두 일치했다.

- 재검증 통과: 기존 높음 2건, 중간 3건과 `DQA-HIGH-006`
- 미해결 결함: 0건
- 통과: 상태 완전성, 가설 토큰, 가격 위계, 작은 화면 스크롤, Light/Dark 기본 대비, 데이터 유지 안내
- 최종 판정: `verification_passed`
- 다음 인계: Design Lead Agent의 완료 게이트 검토
- 별도 완료 게이트: `T-20260728-010` 완료 후 정책값·출시 카피 회귀 검증

## 2. 검증 대상과 방법

- `design/subscription/PAYWALL_UX_SPEC.md`
- `design/subscription/PAYWALL_STATE_MATRIX.md`
- `design/subscription/PAYWALL_COPY_TOKENS.md`
- `design/prototype/subscription.html`
- `design/prototype/subscription.js`
- `design/prototype/subscription.css`
- `docs/product/CookLog_MONETIZATION.md`
- Chrome headless 실제 DOM·렌더링: 375×667 Dark Paywall, 상태·플랜 전이, 하단 스크롤 접근
- 정적 검사: JavaScript syntax, 상태 수, 키보드 이벤트, semantic token 대비, `git diff --check`
- 외부 기준: Apple Human Interface Guidelines의 In-App Purchase, Apple App Review Guidelines 3.1.2, WAI-ARIA APG Radio Group Pattern

## 3. 결함

### DQA-HIGH-001 — 비동기 거래 상태에서 성공을 직접 확정하는 앱 내부 버튼 노출

- 위치: `design/prototype/subscription.js`의 `blockingState()`, `product-loading`, `purchasing`, `restoring`
- 심각도: 높음
- 재검증 상태: 통과
- 기대 결과:
  - 상품 조회 중에는 닫기만 가능해야 한다.
  - 구매·복원 중에는 플랜, CTA, 닫기, 복원 등 중복·임의 조작이 없어야 한다.
  - 구매 성공은 거래와 entitlement 검증 결과로만 진입해야 한다.
- 실제 결과:
  - `product-loading` 화면 안에 `상품 불러오기 완료` 버튼이 노출된다.
  - `purchasing` 화면 안에 `구매 성공 보기` 버튼이 노출되어 클릭 즉시 `success`로 전환된다.
  - `restoring` 화면 안에 `복원 성공 보기` 버튼이 노출되어 클릭 즉시 `restored`로 전환된다.
- 영향:
  - 상태 매트릭스의 가능 행동 및 중복 결제 방지 계약과 충돌한다.
  - 구현 핸드오프가 이 UI를 따를 경우 StoreKit·entitlement 검증 전에 Pro 성공 상태를 표시할 위험이 있다.
- 재작업 기준:
  - 앱 화면에서는 비동기 결과를 임의 확정하는 조작을 제거한다.
  - 검토용 상태 전환이 필요하면 모바일 화면 밖 reviewer panel로 이동하고 production UI와 명확히 분리한다.

### DQA-HIGH-002 — 잔여량을 `사용량`으로 표시하고 예외 상태에 임의 72%를 사용

- 위치: `design/prototype/subscription.js`의 `statusContent`, `renderStatus()`
- 심각도: 높음
- 재검증 상태: 통과
- 기대 결과:
  - 구독 및 사용량 화면은 `{remaining}/{limit}`와 진행 막대의 의미가 일치해야 한다.
  - 모든 수치는 Backend 입력 `used`, `limit`, `remaining`에서 계산되고 상태와 무관하게 같은 의미를 유지해야 한다.
- 실제 결과:
  - Free Normal은 `2회 남음`과 67% 막대를 보여주지만 막대 제목은 `AI 정리 사용량`이다. 실제 사용량은 33%다.
  - Pro Active도 `27/30회 남음`과 90%를 `사용량`으로 표시한다.
  - Billing Retry, Grace Period, Cancel Scheduled에는 잔여 횟수 없이 근거 없는 72%가 고정된다.
- 영향:
  - 사용자가 사용한 양과 남은 양을 반대로 이해할 수 있으며, quota 핵심 상태가 Backend 계약과 연결되지 않는다.
- 재작업 기준:
  - `남은 사용량`으로 명명하고 remaining 비율을 유지하거나, `사용량`으로 명명하고 used 비율을 표시한다.
  - 예외 상태도 실제 quota 토큰을 사용하며 magic number를 제거한다.

### DQA-MEDIUM-003 — 상품 오류·오프라인 상태의 구매 복원 경로 불일치

- 위치: `design/prototype/subscription.js`의 `product-error`, `offline`; `PAYWALL_STATE_MATRIX.md` CTA 규칙
- 심각도: 중간
- 재검증 상태: 통과
- 기대 결과:
  - 상태 매트릭스에 따라 상품 조회 실패·오프라인에서도 기존 구독자를 위한 복원 경로가 제공돼야 한다.
  - 기술적으로 오프라인 복원이 불가능하다면 비활성 사유와 재시도 정책을 문서·UI에서 동일하게 정의해야 한다.
- 실제 결과:
  - 두 화면 모두 닫기와 `다시 확인`만 있고 `구매 복원`이 없다.
  - 프로토타입과 상태 매트릭스의 CTA 활성 규칙이 서로 다르다.
- 영향:
  - 신규 구매 상품 조회 실패와 기존 구매 복구 실패가 같은 막힌 흐름이 된다.
- 재작업 기준:
  - `product-error`에서 복원 진입을 제공하고, `offline`은 실제 StoreKit 제약에 맞춰 활성/비활성 정책과 설명을 하나로 정렬한다.

### DQA-MEDIUM-004 — custom radio의 키보드 상호작용 미구현

- 위치: `design/prototype/subscription.js`의 `planCard()`와 document click handler
- 심각도: 중간
- 재검증 상태: 통과
- 기대 결과:
  - radio group 진입 시 선택된 항목이 하나의 Tab stop이 되고 방향키로 월간·연간 선택과 포커스가 이동해야 한다.
- 실제 결과:
  - `role="radiogroup"`, `role="radio"`, `aria-checked`는 있으나 두 button이 모두 Tab 순서에 남는다.
  - `ArrowUp/Down/Left/Right` 처리와 roving `tabindex`가 없다.
- 영향:
  - 시맨틱 선언과 실제 키보드 동작이 달라 보조기술 사용자의 예측 가능한 플랜 선택을 보장하지 못한다.
- 재작업 기준:
  - native radio를 사용하거나 WAI-ARIA Radio Group Pattern의 방향키·포커스·단일 Tab stop을 구현한다.

### DQA-MEDIUM-005 — 전체 앱을 live region으로 사용해 진행 상태 알림 범위가 과도함

- 위치: `design/prototype/subscription.html`의 `#subscription-app[aria-live="polite"]`, 전체 재렌더링 방식
- 심각도: 중간
- 재검증 상태: 통과
- 기대 결과:
  - 구매·복원 진행 메시지처럼 동적으로 바뀐 핵심 상태만 적절한 live region 또는 status로 전달돼야 한다.
- 실제 결과:
  - 플랜 변경과 모든 상태 전환 때 `#subscription-app` 전체 `innerHTML`이 교체된다.
  - 실패 notice의 `role="alert"`와 전역 polite live region이 중첩되고, loading 자체에는 제한된 status/label이 없다.
- 영향:
  - VoiceOver가 화면 전체를 반복 안내하거나 오류를 중복 안내할 수 있다.
- 재작업 기준:
  - live region을 상태 메시지 컨테이너로 한정하고 loading/status/error의 우선순위를 분리한다.

## 4. 통과한 항목

- Paywall 13개, 구독·사용량 10개로 총 23개 상태가 실제 렌더링된다.
- Free 한도 도달, Pro 재정리, 설정 자발적 진입 카피가 구분된다.
- 월간·연간은 단일 선택되고 CTA와 청구 문구가 선택 상품에 맞춰 바뀐다.
- 연간 총 청구액이 월 환산 참고값보다 명확하게 표시된다.
- 가격·할인·quota·초기화 시점은 `*`와 가설 안내로 구분되고 카피 토큰 주입 책임이 문서화됐다.
- 375×667에서 본문이 스크롤되며 CTA, 구매 복원, 이용약관·개인정보처리방침 영역까지 도달할 수 있다.
- Light/Dark 주요 텍스트 조합의 계산 대비는 4.61:1 이상이다.
- 조작 요소는 원본 CSS 기준 최소 44px 높이를 사용하고 Reduce Motion 규칙이 있다.
- 오류·성공·보류 상태는 색상 외 아이콘과 제목으로도 구분된다.
- 만료·환불·검증 불가를 포함해 로컬 레시피와 기본 오디오 가이드 유지 안내가 있다.
- `node --check design/prototype/subscription.js`: 통과
- `node --check design/prototype/app.js`: 통과
- `git diff --check`: 통과

## 5. 보류 게이트

다음 항목은 이번 구조 판정의 결함 수에 포함하지 않고 기존 완료 게이트로 유지한다.

- `T-20260728-010` 완료 후 월간·연간 가격, 할인율, Free·Pro quota, 초기화 시점 잠금
- AI 재정리의 실제 출시 포함 여부 확정 후 혜택·진입점 정리
- 이용약관·개인정보처리방침·구독 관리 실제 URL 연결
- StoreKit 상품과 실제 기기의 VoiceOver·Dynamic Type·Sandbox 회귀 검증

## 6. 초기 판정

`rework_requested`.

상태 범위와 시각 구조는 충분하지만 거래 성공 확정 경로와 quota 의미 오류가 핵심 UX·구현 계약을 위반한다. Design Lead Agent가 5개 결함을 재작업 범위로 조율하고 수정본을 다시 `verification_ready`로 인계해야 한다. 이후 구조 재검증과 `T-20260728-010` 완료 후 정책값 회귀 검증을 별도로 수행한다.

## 7. 재작업 재검증 요청

2026-08-04 UI/UX Design Agent가 `DQA-HIGH-001~002`, `DQA-MEDIUM-003~005` 수정과 자체 회귀 검증을 완료해 `verification_ready`로 재인계했다.

- 앱 내부 비동기 완료·성공 조작 제거
- quota를 `used / limit` 기반 사용량으로 통일하고 magic number 제거
- Product Error 복원 활성, Offline 복원 비활성 사유 연결
- radio roving tabindex와 방향키·Home·End 동작
- 전역 live region 제거와 status/alert 범위 분리

기존 `rework_requested` 판정은 독립 재검증 전까지 이력으로 유지한다.

## 8. 재작업 독립 재검증 결과

판정: `verification_passed`

### 기존 결함 회귀

- `DQA-HIGH-001`: 통과 — Product Loading에는 닫기만 있고 Purchasing·Restoring에는 앱 내부 조작 버튼이 없다.
- `DQA-HIGH-002`: 통과 — 10개 상태가 `used/limit` 의미로 정렬되고 검증 불가 상태에는 progressbar가 없다.
- `DQA-MEDIUM-003`: 통과 — Product Error 복원 활성, Offline 복원 비활성 및 사유 연결을 확인했다.
- `DQA-MEDIUM-004`: 통과 — 선택 radio 한 개만 `tabindex=0`이며 `ArrowRight` 후 선택·포커스가 annual에서 monthly로 순환했다.
- `DQA-MEDIUM-005`: 통과 — 전역 live region이 없고 Purchasing은 status 1개, Failed는 alert 1개만 사용한다.

### DQA-HIGH-006 — 닫기·구매 성공 CTA가 진입 맥락으로 복귀하지 않고 구독 상태를 변형

- 위치: `design/prototype/subscription.js`의 `resultState()` 호출과 document click handler
- 심각도: 높음
- 재검증 상태: 통과
- 기대 결과:
  - quota Paywall 닫기: STEP Preview를 유지한 Cooking Log로 복귀한다.
  - feature Paywall 닫기: 편집 draft를 유지한 AI Review로 복귀한다.
  - quota 구매 성공의 `AI 정리 계속하기`: AI Processing/Review 흐름으로 이동한다.
  - feature 구매 성공의 `레시피로 돌아가기`: AI Review로 이동한다.
  - 구독 및 사용량 닫기: entitlement를 바꾸지 않고 설정으로 복귀한다.
- 실제 결과:
  - Paywall의 닫기는 모든 진입 맥락에서 `setState("ready")`를 실행해 Paywall에 그대로 남는다.
  - quota와 feature 구매 성공 CTA는 모두 `ready`로 이동해 다시 Paywall을 표시한다.
  - status 화면의 닫기는 `free-normal`로 이동해 Pro Active·만료 등 현재 표시 상태를 Free 기본으로 바꾼다.
  - voluntary 구매 성공만 `pro-active`로 정상 이동한다.
- 영향:
  - 사용자가 결제하지 않고 원래 작업으로 돌아갈 수 없고, 결제 성공 후에도 의도한 작업을 계속할 수 없다.
  - 닫기 동작이 entitlement 상태 변경처럼 보이므로 상태 신뢰성이 훼손된다.
- 재작업 기준:
  - 닫기와 성공 CTA를 `entry`별 부모 화면 목적지 계약에 연결한다.
  - 독립 프로토타입에서 실제 부모 화면 연결이 어렵다면 reviewer 전용 목적지 표시 또는 adapter callback으로 외부 이동을 표현하고 Paywall `ready`나 다른 entitlement 상태로 대체하지 않는다.
  - status 닫기는 entitlement 상태를 보존한 채 설정 복귀를 표현한다.
  - quota·feature·voluntary 각각의 닫기와 성공 CTA 목적지를 실제 브라우저 테스트로 고정한다.

## 9. 재검증에서 통과한 기존 항목

- Paywall 13개, 구독·사용량 10개 상태 유지
- 375×667 Light/Dark 스크롤과 법적 영역 하단 접근 유지
- 월간·연간 선택, CTA·청구 문구 동기화 유지
- 가설 토큰과 데이터 유지 안내 유지
- JavaScript syntax와 `git diff --check` 통과

## 10. 재검증 최종 판정

`verification_passed`.

기존 결함 5건과 `DQA-HIGH-006`이 모두 해소됐고 실행형 Source of Truth의 부모 라우팅 계약이 문서와 일치한다. 가격·할인·quota 최종값은 `T-20260728-010` 완료 후 별도 회귀 검증한다.

## 11. DQA-HIGH-006 재검증 요청

2026-08-04 UI/UX Design Agent가 부모 화면 adapter callback과 reviewer 목적지 표시를 구현하고 `verification_ready`로 재인계했다.

- quota: 닫기 `cooking-log`, 성공 `ai-review-processing`
- feature: 닫기·성공 `ai-review-editable`
- voluntary: 닫기 `settings`, 성공 `subscription-status-pro`
- status 닫기: `settings`, source entitlement 표시 보존
- 실제 Chrome 8개 전이의 callback, reviewer route와 전후 state 보존 자체 검증 통과

기존 `rework_requested` 판정은 독립 재검증 전까지 이력으로 유지한다.

## 12. DQA-HIGH-006 최종 재검증

실제 Chrome에서 다음 8개 전이를 독립 재현했다.

| 전이 | route | source state | 보존 정보 | 결과 |
|---|---|---|---|---|
| quota 닫기 | `cooking-log` | `ready -> ready` | STEP Preview, 녹음 세션 | 통과 |
| feature 닫기 | `ai-review-editable` | `ready -> ready` | 편집 draft | 통과 |
| voluntary 닫기 | `settings` | `ready -> ready` | 현재 entitlement | 통과 |
| quota 성공 CTA | `ai-review-processing` | `success -> success` | STEP Preview, 녹음 세션 | 통과 |
| feature 성공 CTA | `ai-review-editable` | `success -> success` | 편집 draft | 통과 |
| voluntary 성공 CTA | `subscription-status-pro` | `success -> success` | 검증된 Pro entitlement | 통과 |
| Pro Active status 닫기 | `settings` | `pro-active -> pro-active` | entitlement 표시 유지 | 통과 |
| Expired status 닫기 | `settings` | `expired -> expired` | entitlement 표시 유지 | 통과 |

각 전이에서 `CookLogSubscriptionAdapter.navigate(detail)`, `cooklog:subscription-route` 이벤트 detail과 reviewer 목적지 패널의 `route`, `entry`, `sourceState`, `preserved`가 동일했다. Paywall `ready`, `free-normal` 또는 다른 entitlement 상태로 내부 대체되지 않았다.

최소 회귀도 통과했다.

- Paywall 13개, status 10개 유지
- Purchasing·Restoring 임의 앱 버튼 없음
- Product Error 복원 활성, Offline 복원 비활성·사유 연결
- radio 단일 Tab stop과 방향키 포커스·선택 동기화
- 전역 live region 없음, 진행 status와 오류 alert 분리
- quota `used/limit`와 progressbar 값 일치
- 375×667 스크롤 하단 접근
- `node --check` 2건과 `git diff --check` 통과
