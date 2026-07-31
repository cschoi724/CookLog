# T-20260729-022 Backend QA 독립 검증 보고서

검증일: 2026-07-31
검증자: Backend QA Agent / Verification Role
검증 기준: `task/T-20260729-022-define-disabled-remote-stt-adapter-contract` `65e6424`
최종 재검증 판정: `PASS_WITH_RISK`
최종 상태 인계: `verification_in_progress -> verification_passed`

이 문서의 1~7절은 최초 독립 검증의 `FAIL`과 재작업 요청 기록이다. 8절부터는
Product Owner가 승인한 `QA-HIGH-022-001~002` 재작업의 독립 재검증 결과다.

## 1. 검증 범위

- `apps/backend/docs/REMOTE_STT_ADAPTER.md`
- `apps/backend/contracts/stt/`
- `docs/product/CookLog_PRD_v2.md`
- `docs/PROJECT_DECISIONS.md`
- 선행 T-021 공통 인증·quota·오류·idempotency 계약
- Task allowed paths, 최신 develop과 형제 T-023·T-024 상태 비회귀

문서 계약 Task이므로 실제 endpoint·provider SDK·배포가 동작한다고 간주하지 않았다.
대신 비활성 profile, 승인 gate, 재시도와 삭제 실패 시나리오가 후속 구현을 단일하게
제약하는지 독립 검증했다.

## 2. 요약

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| 첫 출시 강제 비활성 | PASS | `mode=disabled`, route/provider/egress/fallback false가 schema·fixture에 고정됐다. |
| 무승인 upload 차단 | PASS | 활성화·승인·공통 인증·one-time grant·크기 검증 전에 body 접근을 금지한다. |
| 자동 원격 fallback 금지 | PASS | 로컬 실패·미지원·권한·timeout·네트워크 복구·remote config를 원격 선택 조건에서 제외한다. |
| grant replay·동시성 | PASS | grant 원자 소비 단일 요청만 body stream에 접근하는 계약이 있다. |
| provider 오류 retry | FAIL | 오류 표는 새 사용자 요청만 허용하지만 다른 절은 같은 원격 요청의 자동 재처리 1회를 허용한다. |
| 즉시 삭제·최대 1시간 | FAIL | 삭제 실패 후 deadline 전 강제 재시도·sweeper·완료 보장이 없고 1시간 경과 시 경보만 정의한다. |
| 콘텐츠 비노출 | PASS | audio·transcript·provider ID·URI·secret의 로그·오류·queue·receipt 저장을 금지한다. |
| 공통 오류·비용 경계 | PASS | T-021 catalog와 project hard cutoff를 재사용하고 실패 시 provider 호출 전 차단한다. |
| schema·fixture 자체 검사 | PASS | 제공 script와 별도 fixture 대조가 통과했다. 단, 아래 차단 결함은 검사 범위 밖이다. |
| allowed paths·Task ID | PASS | 실행 기준 `36cf8ee..65e6424` 변경은 T-022 허용 경로 안이며 Task ID는 1개다. |

## 3. 차단 결함

### QA-HIGH-022-001 — provider 오류의 자동 재처리와 terminal 규칙 상충

동일 문서가 원격 provider 오류에 대해 서로 다른 행동을 요구한다.

- 5절 오류 표:
  - `UPSTREAM_UNAVAILABLE`: 사용자 새 요청만 허용
  - `UPSTREAM_TIMEOUT`: 사용자 새 요청만 허용
- 7절:
  - timeout은 terminal 상태이며 즉시 삭제
  - 복구 가능한 provider 기술 오류는 같은 request·adapter·audio handle에서 최대
    1회 자동 재처리 가능
- 3절:
  - 원격 요청 내부 복구 가능 오류는 같은 provider·audio handle에서 최대 1회 재처리 가능

오류 표가 열거한 두 provider 오류 모두 새 사용자 요청만 허용하고 timeout은 terminal로
정의돼, 자동 재처리 대상이 어떤 공개/내부 오류인지 남지 않는다. 구현자는
`UPSTREAM_UNAVAILABLE`을 즉시 종료할 수도, 자동 재처리할 수도 있다. timeout 역시
삭제를 먼저 시작할지 동일 audio handle을 유지할지 결정할 수 없다.

이 모호성은 provider 중복 호출, terminal 이후 audio 재접근 또는 사용자 선택 없이
처리 재개를 만들 수 있어 차단 결함이다.

필수 재작업:

- 자동 재처리 가능한 내부 오류를 명시적으로 열거한다.
- `UPSTREAM_UNAVAILABLE`, `UPSTREAM_TIMEOUT` 각각에 대해 자동 재처리 여부와
  terminal 전환 시점을 하나로 통일한다.
- timeout이 terminal이면 자동 재처리 대상에서 명시적으로 제외한다.
- 자동 재처리를 허용한다면 동일 request/provider/audio handle·동일 provider
  idempotency key, 최대 1회와 delete deadline 불변을 오류 표에도 반영한다.
- 각 오류별 호출 횟수, terminal 전환, 삭제 시작을 검증하는 fixture를 추가한다.

### QA-HIGH-022-002 — 삭제 실패 시 최대 1시간 자동 삭제 보장 누락

Source of Truth는 향후 Backend 임시 음성도 즉시 삭제하고 비정상 잔존 사본을 최초
생성 후 최대 1시간 안에 자동 삭제하도록 요구한다.

현재 계약은 정상 삭제 receipt 한 건만 검증하며 삭제 실패 시 다음만 정의한다.

- 접근 불가능한 격리 상태 유지
- cleanup retry와 운영 경보
- 1시간에 사본이 남으면 SLA breach 경보
- TTL/lifecycle은 비정상 종료 backstop

그러나 cleanup 작업의 예약 시각·재시도 종료 시각·보완 sweeper 주기와 deadline 이전
강제 삭제 경로가 없다. `delete_deadline_at`은 기록될 뿐 enforcement가 아니며, 1시간
경과 뒤 경보는 이미 제품의 최대 보관 기준을 위반한 이후다. lifecycle/TTL만으로 정확한
삭제 시각을 보장할 수 없다는 점도 실행 보고서가 인정한다.

필수 재작업:

- 임시 object 생성과 동시에 deadline 기반 명시적 delete task를 원자 등록한다.
- 1시간 전에 종료되는 retry window와 더 짧은 주기의 독립 sweeper를 정의한다.
- worker crash, queue delivery 실패, multipart 잔존과 provider copy 삭제 실패를
  포함해 deadline 이전 삭제를 시도하는 이중 경로를 정의한다.
- deadline 이후에는 접근 차단뿐 아니라 incident cleanup과 출시/활성화 차단 기준을
  명시한다.
- 성공·최종 실패·취소·timeout·worker crash·delete 실패 각각의 receipt/상태 fixture와
  `deletion_completed_at <= received_at + 1시간` 검사를 추가한다.
- provider가 1시간 이내 물리 삭제 확인을 제공하지 못하면 활성화 승인을 금지한다.

## 4. 통과 상세

### 기본 비활성·승인 경계

- 첫 출시 schema는 비활성 값 외 구성을 허용하지 않는다.
- 공개 upload endpoint·provider credential·audio egress가 등록되지 않는다.
- 제품·비용·개인정보·provider·QA 승인과 사용자 one-time grant가 모두 필요하다.
- 하나라도 누락되면 body read, temporary object, provider call과 retry/outbox는 0이다.
- grant는 installation·clip·request·expiry·미사용 상태를 검증하고 원자 소비한다.

### 자동 fallback 금지

- 첫 출시 resolver는 Apple 기기 내 adapter만 반환한다.
- 로컬 STT 실패·미지원·권한 거부·timeout·빈 결과는 원격 선택 조건이 아니다.
- 앱 재실행, 네트워크 복구, remote config와 server 응답도 원격 전송을 시작하지 못한다.
- 미래 활성화 후에도 사용자가 해당 기록에 명시적으로 선택한 새 요청만 허용한다.

### 콘텐츠 비노출·비용

- audio는 JSON·로그·queue·idempotency record에 넣지 않고 stream/opaque handle로만
  전달한다.
- transcript, provider/model, request handle, storage URI와 secret의 외부 오류·관측
  metadata·삭제 receipt 노출을 금지한다.
- provider 호출 전 T-021 project hard cutoff와 T-024 guardrail을 원자 예약하고
  장애·emergency limit `0`에서 fail closed한다.

## 5. 수행 검증

```text
sh -n apps/backend/contracts/stt/validate-contracts.sh
sh apps/backend/contracts/stt/validate-contracts.sh
remote STT contract validation: PASS
jq empty apps/backend/contracts/stt/*.json apps/backend/contracts/stt/fixtures/*.json
aiops validate task ... --strict
git diff --check 36cf8ee..HEAD
INDEPENDENT_STT_FIXTURE_CHECK: PASS (6 negative gates, deadline 3600s)
```

공통 검사 script는 비활성 fixture, negative gate 이름, 정상 삭제 receipt 한 건과 금지
필드 부재를 확인한다. 재시도 의미 충돌과 삭제 실패·비정상 종료의 deadline 보장은
검사하지 않으므로 script PASS를 전체 성공으로 해석하지 않았다.

## 6. 잔여 위험

### QA-RISK-022-001 — runtime schema validator와 실제 provider 조건

JSON Schema runtime validator, iOS·Backend fixture 실행과 실제 provider의 보관·삭제
설정 검증은 T-025 및 향후 별도 활성화 Task가 담당한다. 이 위험은 위 두 차단 결함과
별개로 유지한다.

### QA-RISK-022-002 — 최신 develop 재정렬 필요

검증 도중 `origin/develop`이 `0fdfe52`로 전진해 현재 브랜치는 1개 커밋 뒤다.
재작업과 다음 QA 인계 전에 최신 develop 위로 재정렬하고 T-20260730-004 `done`과
형제 T-023·T-024의 승인 상태를 공용 보드에서 보존해야 한다.

## 7. 최종 판정과 인계

첫 출시 강제 비활성, 무승인 upload와 자동 fallback 금지는 통과했다. 그러나 retry와
terminal 상태가 상충하고 최대 1시간 자동 삭제를 실패 경로에서 보장하지 못한다.

최종 판정은 `FAIL`이다. Task를 `rework_requested`로 전환하고 lock을 해제해
Development Lead Agent / Lead Role에 인계한다.

## 8. 승인된 재작업 독립 재검증

검증일: 2026-07-31
재검증 기준 커밋: `c960eed`
기준 브랜치: `task/T-20260729-022-define-disabled-remote-stt-adapter-contract`

### 8.1 QA-HIGH-022-001 해소

provider 오류별 자동 재처리와 terminal 전환이 단일 규칙으로 통일됐다.

- 연결 거부·503 등 명시적인 `UPSTREAM_UNAVAILABLE`만 같은 request, provider,
  audio handle과 provider idempotency key에서 최대 1회 재처리한다.
- provider 호출은 총 2회 이하며 두 번째 실패 또는 retry window 부족 시 terminal로
  전환하고 삭제를 시작한다.
- `UPSTREAM_TIMEOUT`은 결과 불명확 가능성 때문에 첫 발생에서 terminal로 전환하고
  자동 재처리하지 않는다.
- payload·승인·내부 안전 경계 오류도 자동 재처리하지 않는다.
- 공개 `retryable=true`와 서버 동일 요청 자동 재처리를 분리해, timeout 이후에는 삭제
  완료 후 사용자 선택으로 새 clip·grant·idempotency key를 만드는 것만 허용한다.

독립 fixture 대조:

| 사례 | provider 호출 | terminal | 공개 코드 | 결과 |
|---|---:|---|---|---|
| unavailable 후 성공 | 2 | succeeded | 없음 | PASS |
| unavailable 2회 | 2 | failed | `UPSTREAM_UNAVAILABLE` | PASS |
| 첫 timeout | 1 | failed | `UPSTREAM_TIMEOUT` | PASS |
| non-retryable provider 오류 | 1 | failed | `UPSTREAM_UNAVAILABLE` | PASS |

판정: 해소.

### 8.2 QA-HIGH-022-002 해소

삭제 실패·비정상 종료에서도 deadline 전에 삭제를 복구하는 이중 경로가 추가됐다.

- body stream을 열기 전에 audio handle, 절대 deadline, cleanup record와 delete
  task/outbox를 하나의 transaction으로 등록한다.
- deadline worker는 terminal 직후부터 T+55분까지 7회 idempotent delete를 시도한다.
- 최대 5분 주기의 독립 sweeper가 cleanup record, object prefix와 multipart upload를
  대조하고 worker crash·queue 실패·누락 task를 복구한다.
- T+50분부터 high-priority delete, T+55분 final forced delete를 실행한다.
- provider가 1시간 내 물리 삭제 확인을 제공하지 못하면 활성화를 금지한다.
- deadline breach는 P0 privacy incident와 kill switch, 출시·재활성화 차단으로
  연결된다.

정상·비정상 lifecycle 8개를 독립 계산한 결과 모든 사례가
`deletion_completed_at <= delete_deadline_at <= received_at + 3600초`를 만족했다.

- 성공
- 최종 실패
- 취소
- timeout
- worker crash
- 첫 delete 실패
- queue delivery 실패
- multipart 잔존

판정: 해소.

## 9. 기존 통과 항목 무회귀

| 항목 | 결과 |
|---|---|
| 첫 출시 강제 비활성 | PASS — route·provider·egress·automatic fallback false가 유지됐다. |
| 무승인 upload 차단 | PASS — 승인·grant 실패 시 body read·object·provider call·outbox 0 계약이 유지됐다. |
| 자동 원격 fallback 금지 | PASS — 로컬 실패·미지원·네트워크 복구·remote config가 원격 전송을 시작하지 못한다. |
| grant replay·동시성 | PASS — one-time grant 원자 소비 단일 요청 경계가 유지됐다. |
| 콘텐츠 비노출 | PASS — audio·transcript·provider ID·URI·secret의 로그·오류·queue·receipt 저장 금지가 유지됐다. |
| 공통 오류·비용 | PASS — T-021 catalog·project hard cutoff와 T-024 guardrail 연결이 유지됐다. |
| allowed paths·Task ID | PASS — 재작업 변경은 T-022 허용 경로 안이며 Task ID는 1개다. |
| 최신 develop | PASS — `origin/develop` 대비 뒤처짐 0이며 T-004 done과 T-023·T-024 승인 상태를 보존했다. |

## 10. 수행 결과

```text
remote STT contract validation: PASS
INDEPENDENT_T022_REVERIFY: PASS
  (4 retry cases, 8 deletion cases, forced delete T+3300s, sweeper 300s)
AI Ops strict Task validation: PASS
JSON syntax: PASS
git diff --check: PASS
```

## 11. 잔여 위험

### QA-RISK-022-001 — 실제 runtime·provider 삭제 SLA 검증

현재 산출물은 문서·schema·fixture 계약이다. 실제 runtime worker/sweeper의 독립 장애
복구, provider 물리 삭제 확인과 1시간 SLA는 T-025 계약 테스트 및 별도 원격 STT
활성화 Task의 staging gate에서 검증해야 한다. 확인을 제공하지 않는 provider는 계약상
활성화할 수 없다.

이 위험은 원격 STT가 강제 비활성인 현재 Task를 차단하지 않는다.

## 12. 최종 판정과 인계

`QA-HIGH-022-001`, `QA-HIGH-022-002`는 모두 해소됐고 기존 통과 항목에도 회귀가 없다.

최종 판정은 `PASS_WITH_RISK`다. Task를 `verification_passed`로 전환하고 lock을
해제해 Development Lead Agent / Completion Role에 인계한다.
