# T-20260804-006 Backend QA 독립 검증 보고서

검증일: 2026-08-05
검증자: Backend QA Agent / Verification Role
검증 기준: `task/T-20260804-006-implement-backend-safety-runtime` `52b5f3a`
기준 develop: `origin/develop` `9457133`
최종 판정: `FAIL`
상태 인계: `verification_ready -> verification_in_progress -> rework_requested`

## 1. 결론

공식 T-006 20/20, Backend 전체 86/86과 common·STT·AI·security·shared fixture
validator는 통과했다. 비용 fixture의 operation 전액 승인·거절, KRW 50,000 합계,
delayed reserve 정산과 정상 cleanup 장애 사례도 통과했으며 실제 cloud·provider·network·
credential 경로는 추가되지 않았다.

그러나 allowlist logger가 승인 build ID가 아닌 자유 문자열을 `deployment_version`으로
허용해 restricted content를 sink에 기록한다. 또한 가격 manifest와 raw metadata cleanup이
비정상 시각 `NaN`을 유효 상태처럼 처리해 비용 요청과 30일 접근 차단을 fail open한다.
성공 기준인 콘텐츠 telemetry 0건과 비용·삭제 fail-closed를 깨므로 HIGH 2건으로 차단한다.

## 2. 검증 결과

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| lockfile 설치·audit | PASS_WITH_RISK | `npm ci --ignore-scripts`, audit 0건. Host Node 26으로 목표 Node 24 engine 경고가 있다. |
| T-006 전용 | PASS | security·cleanup 20/20 통과. |
| Backend 전체 runtime | PASS | 86/86 통과. |
| 공용 계약 validator | PASS | common·STT·AI·security·shared fixture 모두 통과. |
| 비용 합계·정산 정상/fixture | PASS | 전액 승인·거절, 50,000원 상한과 delayed reserve 정산이 통과했다. |
| cleanup 정상/fixture | PASS | ACK·+22h·+24h, raw metadata 6개 장애 fixture가 통과했다. |
| cloud·provider·network 부재 | PASS | 신규 실행 경로·dependency·credential 0개. |
| 콘텐츠 telemetry canary | FAIL | `deployment_version=grandmas_kimchi_recipe_notes`가 sink에 기록됐다. |
| 비정상 비용 시각 fail-closed | FAIL | `now=NaN`과 `lastReconciledAt=NaN` manifest가 `allowed: true`다. |
| 비정상 cleanup 시각 fail-closed | FAIL | `now=NaN`으로 raw record 생성과 이후 read가 계속 허용된다. |

## 3. 차단 결함

### QA-HIGH-006-001 — 승인되지 않은 자유 문자열이 telemetry sink에 기록됨

`SafeLogger.validValue()`는 `deployment_version`과 `manifest_version`을 승인 ID가 아닌
일반 `fixedValuePattern`으로 검사한다. 이 패턴은 영문·숫자·구분자 96자를 허용하므로
사용자 콘텐츠에서 파생된 문자열도 통과한다. redaction scanner는 일부 literal canary만
찾기 때문에 다음 restricted content가 정상 이벤트로 sink에 기록됐다.

```text
event_name: ai_job_state_changed
deployment_version: grandmas_kimchi_recipe_notes
emit result: true
sink events: 1
```

계약은 사용자의 자유 형식 문자열과 레시피 파생값을 restricted content로 분류하고 모든
telemetry 계층 0건을 요구한다. `deployment_version`도 승인된 build ID여야 한다.

필수 재작업:

1. build·manifest version을 호출자 자유 문자열이 아닌 서버 소유 승인 allowlist 또는
   검증된 불변 ID로 제한한다.
2. allowlist 대상이 아니면 event 전체를 drop하고 고정 counter만 증가시킨다.
3. 각 자유 문자열 허용 후보 필드에 recipe·STEP·prompt 형태의 비literal canary를 넣어
   sink 0건을 회귀 테스트한다.

### QA-HIGH-006-002 — 비정상 clock이 비용·보존 경계를 fail open함

`validatePriceManifest()`는 `now`와 `lastReconciledAt`의 finite 여부를 먼저 검사하지 않는다.
JavaScript에서 `NaN` 비교는 모두 false이므로 만료·미래·6시간 reconciliation 검사를
우회하고 `allowed: true`를 반환한다. 같은 문제로 raw metadata repository의 모든 deadline이
`NaN`이 되어 +28일 cleanup과 +30일 접근 차단이 영구히 발생하지 않는다.

독립 반례:

```text
valid manifest + lastReconciledAt=NaN -> allowed: true
valid manifest + now=NaN -> allowed: true
raw metadata now=NaN -> create 성공, read 결과 7
```

필수 재작업:

1. 비용 validator는 `now`, `lastReconciledAt`이 유한한 안전 정수 epoch인지 검사하고
   아니면 `MANIFEST_INVALID` 또는 `BILLING_RECONCILIATION_STALE`로 차단한다.
2. cleanup clock이 유효하지 않으면 신규 raw event 생성과 read·export·aggregate를
   fail closed하고 고정 incident 상태를 남긴다.
3. `NaN`, `Infinity`, 음수·범위 밖 시각을 비용 admission과 raw metadata lifecycle의
   직접 회귀 테스트로 추가한다.

## 4. 수행 증거

```text
npm ci --ignore-scripts: PASS, audit 0건, Node 26 engine warning
npm run build: PASS
T-006 security·cleanup: PASS, 20/20
Backend 전체 runtime: PASS, 86/86
common·STT·AI·security·shared fixture validator: PASS
금지 cloud·provider·network·credential 정적 scan: PASS
/private/tmp/t006-adversarial.mjs: FAIL
  contentAccepted=true, emittedEvents=1
  invalidReconciliationAccepted=true
  invalidClockAccepted=true
  invalidClockRawDataReadable=true
```

## 5. 인계

최종 판정은 `FAIL`이다. Task를 `rework_requested`로 전환하고 Development Lead Agent /
Lead Role에 재작업 범위 조율을 인계한다. Quality Team은 구현을 수정하거나 `done` 처리·
병합하지 않는다. T-007은 T-006 재검증 통과 전 선행 완료로 간주할 수 없다.
