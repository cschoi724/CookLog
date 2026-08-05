---
id: T-20260728-011
title: 구독·Paywall UX 설계
status: verification_passed
type: feature
priority: P1
priority_reason: 확정된 Free/Pro 정책을 사용자에게 명확하고 오인 없이 제시할 디자인 기준이 필요하다.
org_unit: Experience Division
team: Design Team
team_lead: Design Lead Agent
workflow: feature
target_agent: Design Lead Agent
target_role: Lead Role
required_capabilities:
  - design_scoping
  - design_dependency_management
depends_on:
  - T-20260728-002
completion_gate:
  - T-20260728-010
blocks:
  - T-20260728-014
parallel_group: monetization-design-and-contract
allowed_paths:
  - design/
  - docs/product/
  - .ai_project/tasks/
  - .ai_project/reports/
  - .ai_project/qa/
  - .ai_project/task_board.md
  - .ai_project/teams/design/task_board.md
  - .ai_project/teams/quality/task_board.md
source_of_truth:
  - docs/product/CookLog_MONETIZATION.md
  - T-20260728-002의 승인된 Figma MVP UI/UX
  - T-20260728-010의 확정 가격과 Free/Pro 정책
created_by: Product Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-28
updated_at: 2026-08-04
report_to: .ai_project/reports/T-20260728-011_design-subscription-paywall-ux-report.md
qa_to: .ai_project/qa/T-20260728-011_design-subscription-paywall-ux-qa.md
---

# 구독·Paywall UX 설계

## Activation Gate

- MVP UI/UX 원본: `T-20260728-002` 완료로 충족
- UX 구조 실행: Product Owner가 2026-08-04 선행 착수를 승인해 충족
- 가격·quota 최종 문구 잠금: `T-20260728-010` 완료 전까지 보류

## 목적

구독 전환을 유도하면서도 핵심 기록 경험을 방해하지 않는 Paywall과 구독 상태 UX를 로컬 UI Source of Truth에 추가하고, Figma 한도 복구 후 미러할 수 있는 핸드오프를 만든다.

## 승인된 실행 원칙

- Figma MCP는 사용하지 않는다. 공식 작업 원본은 `design/prototype/`과 텍스트 핸드오프다.
- `docs/product/CookLog_MONETIZATION.md`의 월 4,900원·연 39,000원, Free 3회·Pro 30회는 **가설 표시용 기준값**으로만 사용한다.
- 가격, 할인율, quota, 초기화 시점은 UI 내부에서 교체 가능한 토큰으로 정의하고 확정값처럼 코드나 이미지에 고정하지 않는다.
- StoreKit 현지화 가격이 주입될 위치와 연간 총 청구액 표시 위치를 명확히 구분한다.
- 첫 앱 실행, 첫 기록 시작 전, 저장 레시피 조회, 기본 오디오 가이드에는 Paywall을 노출하지 않는다.
- 로컬 레시피와 기본 오디오 가이드는 구독 상태와 무관하게 접근 가능해야 한다.

## 작업 패키지

### WP-1 — 정보 구조와 진입 흐름

- Free 한도 도달 후 `AI 정리하기`
- Pro 전용 AI 재정리 선택
- 설정의 `CookLog Pro` 자발적 진입
- 금지 진입점과 닫기·뒤로가기 동작

### WP-2 — Paywall과 플랜 선택

- Free/Pro 기능 비교
- 월간·연간 선택, 연간 총 결제액, 월 환산 참고값
- 자동 갱신·해지 안내, 이용약관, 개인정보처리방침, 구매 복원
- 가격 조회 중·상품 조회 실패·오프라인 상태

### WP-3 — 구매·복원 상태

- 구매 중, 성공, 사용자 취소, 실패, 승인 대기
- 복원 중, 복원 성공, 복원할 구매 없음, 복원 실패
- 중복 결제 방지와 진행 중 CTA 비활성

### WP-4 — 구독과 사용량 상태

- Free 잔여량, 한도 임박, 한도 소진
- Pro 활성, 결제 유예·재시도, 만료, 취소 예정, 환불·철회, 검증 불가
- 다음 초기화 시점과 구독 관리 진입
- 만료 후에도 기존 레시피와 기본 오디오 가이드가 유지됨을 명시

### WP-5 — 반응형·테마·접근성·핸드오프

- iPhone SE급 작은 화면에서 CTA와 법적 고지 접근 가능
- Light와 Dark 상태, Dynamic Type, VoiceOver 읽기 순서
- 색상만으로 선택·오류·상태를 구분하지 않음
- 구현용 상태표, 카피 토큰, 이벤트·분기 계약 작성

## 산출물

- `design/subscription/PAYWALL_UX_SPEC.md`
- `design/subscription/PAYWALL_STATE_MATRIX.md`
- `design/subscription/PAYWALL_COPY_TOKENS.md`
- 필요 시 `design/prototype/`의 구독 UX 화면과 상태
- `.ai_project/reports/T-20260728-011_design-subscription-paywall-ux-report.md`

## 성공 기준

- Free 한도 도달, 월간·연간 선택, 구매 중·완료·실패, 복원, 만료 상태가 설계된다.
- 연간 총 결제액, 자동 갱신, 약관·개인정보와 구매 복원이 명확히 표시된다.
- 구독 상태와 남은 AI 사용량 화면이 설계된다.
- 작은 화면, 다크 모드, 접근성 기준이 포함된다.
- Design QA Agent 검증과 Product Owner 승인을 통과한다.

## 완료 게이트

- UX 구조와 가설 기반 시각 설계는 `T-20260728-010` 이전에 진행할 수 있다.
- 가격·할인·quota·초기화 시점의 최종 카피는 `T-20260728-010` 완료 후 교체·검증한다.
- Figma 미러는 `T-20260803-001`의 MCP 한도 복구 전까지 완료 조건에서 제외한다.

## 승인된 재작업 범위

### WP-R1 — 거래 상태 무결성 (`DQA-HIGH-001`)

- `product-loading`, `purchasing`, `restoring`의 앱 내부 임의 완료·성공 버튼을 제거한다.
- 검토용 상태 전환은 모바일 앱 프레임 밖 reviewer panel로 분리한다.
- 성공 상태는 StoreKit 거래와 entitlement 검증 결과로만 진입한다는 계약을 문서와 프로토타입에 일치시킨다.

### WP-R2 — quota 의미와 데이터 계약 (`DQA-HIGH-002`)

- 진행 막대를 `남은 사용량` 또는 `사용량` 중 하나의 의미로 통일한다.
- 모든 비율은 `used`, `limit`, `remaining` 토큰에서 계산한다.
- 결제 재시도·유예·취소 예정 상태의 임의 `72%` 값을 제거한다.

### WP-R3 — 구매 복원 경로 (`DQA-MEDIUM-003`)

- `product-error`에 구매 복원 진입을 제공한다.
- `offline`의 복원 활성 여부, 비활성 사유와 재시도 정책을 UI·상태표에서 동일하게 정의한다.

### WP-R4 — 플랜 선택 접근성 (`DQA-MEDIUM-004`)

- native radio 또는 WAI-ARIA radio pattern으로 단일 Tab stop을 구성한다.
- 방향키로 월간·연간 포커스와 선택을 이동하고 `aria-checked`와 시각 상태를 동기화한다.

### WP-R5 — 상태 알림 접근성 (`DQA-MEDIUM-005`)

- 전역 `#subscription-app`의 live region을 제거한다.
- 구매·복원 상태 메시지에만 제한된 `status` 또는 live region을 적용한다.
- 오류 `alert`와 polite 안내가 중복 낭독되지 않도록 우선순위를 분리한다.

### 재검증 기준

- 기존 23개 상태와 3개 진입 맥락을 유지한다.
- JavaScript syntax, 상태 전이, 키보드 동작, 375×667 Light/Dark 스크롤을 자체 검증한다.
- 수정 후 `verification_ready`로 전환해 Design QA Agent에 5개 결함과 기존 통과 항목 회귀 검증을 요청한다.
- Figma MCP는 호출하지 않는다.

### WP-R6 — 진입 맥락별 종료 목적지와 상태 보존 (`DQA-HIGH-006`)

- quota Paywall 닫기는 STEP Preview와 기록 상태를 보존한 Cooking Log 복귀로 연결한다.
- feature Paywall 닫기는 편집 draft를 보존한 AI Review 복귀로 연결한다.
- voluntary Paywall 닫기는 entitlement를 변경하지 않고 설정 복귀로 연결한다.
- quota 구매 성공의 `AI 정리 계속하기`는 AI Processing/Review 흐름으로 연결한다.
- feature 구매 성공의 `레시피로 돌아가기`는 AI Review로 연결한다.
- 구독·사용량 화면 닫기는 현재 entitlement 표시를 보존한 설정 복귀로 연결한다.
- 독립 프로토타입에서는 adapter callback 또는 reviewer 전용 목적지 표시로 부모 화면 이동을 표현한다.
- 세 진입 맥락의 닫기·성공 CTA와 구독 상태 닫기를 실제 브라우저 전이 테스트로 검증한다.

## 상태 전이 기록

- 2026-08-04: Design Lead Agent가 가격 정책 미확정 상태에서 진행 가능한 범위를 변수 기반 UX 구조로 재조율했다.
- 2026-08-04: Product Owner가 로컬 Source of Truth 우선, Figma MCP 미사용, 가격 최종 잠금 후행 조건으로 실행을 승인해 `proposed -> scoped -> approved`로 전환했다.
- 2026-08-04: UI/UX Design Agent에 WP-1부터 순차 실행하도록 라우팅했다.
- 2026-08-04: UI/UX Design Agent가 실행 lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-08-04: WP-1~5 로컬 설계, 23개 상태 프로토타입과 자체 검증을 완료하고 lock을 해제해 `in_progress -> verification_ready`로 전환했다.
- 2026-08-04: 구조 검증은 Design QA Agent에 인계했으며 가격·할인·quota·초기화 시점의 최종 카피 잠금은 `T-20260728-010` 완료 후로 유지했다.
- 2026-08-04: Design QA Agent가 독립 구조 검증 lock을 획득하고 `verification_ready -> verification_in_progress`로 전환했다.
- 2026-08-04: Design QA Agent가 거래 진행 상태의 임의 성공 버튼, quota 표시 의미 오류와 접근성·복원 경로 결함 5건을 확인해 `verification_in_progress -> rework_requested`로 전환하고 Design Lead Agent에 인계했다.
- 2026-08-04: Design Lead Agent가 높음 2건·중간 3건을 WP-R1~R5로 범위화했다.
- 2026-08-04: Product Owner가 재작업을 승인해 `rework_requested -> scoped -> approved`로 전환하고 UI/UX Design Agent에 재라우팅했다.
- 2026-08-04: UI/UX Design Agent가 재작업 lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-08-04: UI/UX Design Agent가 WP-R1~R5 수정과 상태·키보드·Light/Dark·작은 화면 회귀 검증을 완료했다.
- 2026-08-04: 실행 lock을 해제하고 `in_progress -> verification_ready`로 전환해 Design QA Agent에 재인계했다.
- 2026-08-04: Design QA Agent가 재검증 lock을 획득하고 `verification_ready -> verification_in_progress`로 전환했다.
- 2026-08-04: 기존 결함 5건은 재검증을 통과했으나 닫기·구매 성공 후 목적지와 entitlement 상태 보존 결함 `DQA-HIGH-006`을 신규 확인해 `verification_in_progress -> rework_requested`로 전환하고 Design Lead Agent에 인계했다.
- 2026-08-04: Design Lead Agent가 신규 `DQA-HIGH-006`을 WP-R6 단일 재작업 범위로 조율했다.
- 2026-08-04: Product Owner가 WP-R6 재작업을 승인해 `rework_requested -> scoped -> approved`로 전환하고 UI/UX Design Agent에 재라우팅했다.
- 2026-08-04: UI/UX Design Agent가 WP-R6 재작업 lock을 획득하고 `approved -> in_progress`로 전환했다.
- 2026-08-04: 부모 화면 adapter callback, reviewer 목적지 표시와 진입 맥락별 종료 계약을 구현했다.
- 2026-08-04: 실제 Chrome에서 닫기·성공 CTA 6개와 status 닫기 2개를 검증하고 lock을 해제해 `in_progress -> verification_ready`로 Design QA Agent에 재인계했다.
- 2026-08-04: Design QA Agent가 `DQA-HIGH-006` 독립 재검증 lock을 획득하고 `verification_ready -> verification_in_progress`로 전환했다.
- 2026-08-04: 실제 Chrome 8개 전이에서 adapter·event·reviewer 목적지와 source state 보존을 확인하고 기존 5건 최소 회귀도 통과해 `verification_in_progress -> verification_passed`로 전환, Design Lead Agent에 인계했다.

## 현재 인계 상태

- 완료: 정보 구조, 진입 흐름, Paywall, 플랜 선택, 구매·복원, entitlement·사용량, 반응형·테마·접근성·구현 계약
- 프로토타입: Paywall 13개 + 구독·사용량 10개 = 총 23개 상태
- Figma MCP 호출: 0회
- 다음 담당: Design Lead Agent
- 현재 검증 경계: 가설값의 정확성이 아니라 가설 표시·토큰 교체 가능성과 UX 구조
- Design QA 판정: `DQA-HIGH-001~006` 전체 통과, `verification_passed`
- 재작업 기준: `.ai_project/qa/T-20260728-011_design-subscription-paywall-ux-qa.md`
- 최종 완료 게이트: `T-20260728-010` 완료 후 정책 토큰 교체·회귀 검증

## 재작업 완료 요약

- `DQA-HIGH-001`: Product Loading, Purchasing, Restoring의 앱 내부 임의 완료·성공 버튼 제거. 외부 `SCREEN STATES` 패널만 검토용 전환을 수행한다.
- `DQA-HIGH-002`: 진행 막대를 `AI 정리 사용량`으로 통일하고 `used / limit`에서 계산한다. 72% 고정값을 제거하고 검증 불가 상태는 막대를 숨긴다.
- `DQA-MEDIUM-003`: Product Error에 구매 복원을 추가하고 Offline은 연결 필요 사유와 함께 복원을 비활성화했다.
- `DQA-MEDIUM-004`: roving `tabindex`, 방향키·Home·End 순환, `aria-checked`·포커스 동기화를 구현했다.
- `DQA-MEDIUM-005`: 전역 live region을 제거하고 진행·성공·보류는 제한된 status, 오류는 alert로 분리했다.
- 기존 상태: Paywall 13개, 구독·사용량 10개, 진입 맥락 3개 유지
- Figma MCP 호출: 0회

## 재검증 신규 결함

- `DQA-HIGH-006`: Paywall 닫기가 원래 화면으로 복귀하지 않고 `ready` Paywall에 남는다.
- quota·feature 구매 성공 CTA도 원래 작업 흐름 대신 `ready` Paywall로 이동한다.
- 구독 및 사용량 닫기는 현재 entitlement 표시를 보존하지 않고 `free-normal`로 바꾼다.
- 상세 재작업 기준은 QA 보고서 8절을 따른다.

## WP-R6 완료 요약

- `CookLogSubscriptionAdapter.navigate(detail)`와 `cooklog:subscription-route` 부모 이동 계약을 추가했다.
- quota 닫기 → Cooking Log / STEP Preview, 성공 → AI Review / Processing
- feature 닫기·성공 → AI Review / Editable
- voluntary 닫기 → 설정, 성공 → 구독 및 사용량 / Pro Active
- 구독 및 사용량 닫기 → source entitlement 표시를 보존한 설정
- 독립 프로토타입은 앱 프레임 밖에 목적지와 보존 상태를 표시한다.
- 닫기와 성공 CTA는 Paywall `ready`, `free-normal` 또는 다른 entitlement 상태로 대체하지 않는다.
- 실제 Chrome 8개 전이에서 callback route, reviewer 표시, 전후 source view/state 보존을 확인했다.
- 기존 23개 상태·3개 진입 맥락과 DQA-HIGH-001~MEDIUM-005 수정 유지
- Figma MCP 호출: 0회

## DQA-HIGH-006 독립 재검증 결과

- quota·feature·voluntary 닫기 3개: route·보존 정보·`ready` source state 유지 통과
- quota·feature·voluntary 성공 CTA 3개: route·보존 정보·`success` source state 유지 통과
- Pro Active·Expired status 닫기 2개: 설정 route와 각 entitlement source state 유지 통과
- adapter callback, route event와 reviewer 패널 payload 일치
- 기존 결함 5건 최소 회귀, 23개 상태, JavaScript syntax와 `git diff --check` 통과
- 최종 구조 판정: `verification_passed`
- 잔여 완료 게이트: `T-20260728-010` 완료 후 정책 토큰 교체·회귀 검증
