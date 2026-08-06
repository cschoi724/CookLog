# T-20260804-007 Backend QA 독립 검증 보고서

검증일: 2026-08-06
검증자: Backend QA Agent / Verification Role
검증 기준: `6acb35f` (구현 `5b96ebb`), base `origin/develop@6a1678c`
판정: `FAIL`
상태 인계: `verification_ready -> verification_in_progress -> rework_requested`

## 1. 결론

lockfile 설치, typecheck, build, Backend 전체 96/96, 공용 계약 validator 5종과 Foundation
경계 감사는 통과했다. PR #91의 Node 24.18.0 `backend-verify`와 non-root container
`backend-container`도 모두 성공했다. auth·rate·idempotency·비용·cleanup·원격 STT 비활성의
기존 정상 회귀는 확인됐다.

그러나 provider 성공 결과를 repository에 저장한 뒤 terminal telemetry 기록이 실패해도
worker가 실패를 무시하고 `completed`를 반환한다. 동일 결과는 status API에서
`succeeded`·`available`로 외부 공개된다. 관측성 장애가 mutation·비용 감사를 안전하게
남기지 못하면 동작을 fail closed해야 하는 T-006/T-007 통합 계약을 위반하므로 HIGH 1건으로
차단한다.

## 2. 검증 결과

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| `npm ci --ignore-scripts` | PASS_WITH_RISK | audit 0건. 로컬 host Node 26.4.0이라 Node 24 engine 경고가 있다. |
| `npm run verify` | PASS | typecheck, 96/96, 계약 5종, 경계 감사 통과. |
| Node 24.18/non-root container | PASS | PR #91 `backend-verify`, `backend-container` 성공. 로컬 Docker CLI는 미설치라 hosted CI로 교차 확인했다. |
| 정상 HTTP composition | PASS | health·인증 create·exact replay·worker·poll·ACK 경로 통과. |
| 비용·cleanup·redaction·STT 회귀 | PASS | 기존 자동화와 경계 감사 통과. |
| worker terminal telemetry 장애 | FAIL | 두 번째 sink write가 throw해도 `completed`, `succeeded`, `available`; sink drop 1건. |
| 변경 경로·whitespace | PASS | Task allowed paths 내부, `git diff --check` 통과. |

## 3. 차단 결함

### QA-HIGH-007-001 — 종료 telemetry 장애 뒤 미감사 성공 결과가 공개됨

`createLocalFoundationRuntime().execute()`는 시작 telemetry 성공 후 `service.execute()`를
호출한다. service가 성공 상태와 결과를 저장한 뒤 terminal `logger.emit()`의 boolean을
검사하지 않고 원래 `completed`를 그대로 반환한다. `SafeLogger`는 sink 예외를
`SINK_UNAVAILABLE`로 정확히 기록하지만 composition이 그 실패를 폐기한다.

독립 장애 주입은 sink의 첫 기록은 성공시키고 두 번째 기록만 throw하도록 구성했다.

```text
execution=completed
providerCalls=1
telemetryWrites=2
sinkUnavailableDrops=1
jobState=succeeded
resultState=available
```

즉 terminal 성공 mutation을 감사할 수 없는 상태에서도 결과가 외부에 공개된다. 이는 Task의
"programmatic worker는 telemetry 예약이 성공한 뒤에만 provider를 호출"이라는 시작 전
검사만으로는 막히지 않는 완료 경로 결함이다.

필수 재작업:

1. terminal telemetry sink 실패와 성공 상태/result commit 사이의 순서를 명시하고,
   성공 mutation을 감사할 수 없으면 외부에 `succeeded`·`available`을 공개하지 않는다.
2. sink가 첫 기록 후 장애, reservation이 terminal 시점에 거절, terminal event shape가
   거절되는 각 경우를 직접 회귀 테스트한다.
3. 재시도 시 provider-at-most-once와 기존 결과 비노출·복구 정책을 함께 보장한다.

## 4. 수행 증거

```text
npm ci --ignore-scripts: PASS, audit 0건, Node 26 engine warning
npm run verify: PASS, 96/96
contract validators: common·STT·AI·security·iOS shared fixture PASS
foundation boundary audit: PASS
/private/tmp/t007-observability-adversarial.mjs: FAIL (assertion exit 1)
PR #91 backend-verify: SUCCESS
PR #91 backend-container: SUCCESS
git diff --check: PASS
```

## 5. 인계

최종 판정은 `FAIL`이다. Task를 `rework_requested`로 전환하고 Development Lead Agent /
Lead Role에 재작업 범위 조율을 인계한다. Quality Team은 구현 수정, `done` 처리 또는 PR
병합을 수행하지 않는다.
