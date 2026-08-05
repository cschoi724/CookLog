# T-20260804-004 Backend QA 독립 검증 보고서

검증일: 2026-08-05
검증자: Backend QA Agent / Verification Role
검증 기준: `task/T-20260804-004-implement-mock-ai-recipe-jobs` `9b2f77f`
기준 develop: `origin/develop` `5bfc350`
현재 판정: `FAIL`
현재 상태 인계: `verification_in_progress -> rework_requested`

## 1. 검증 범위

- 승인 shared fixture의 create·status·ACK·timeout·만료 흐름
- snapshot SHA-256 무결성과 strict request/date-time 검증
- logical job당 provider 최대 1회와 duplicate worker·late result CAS
- invalid provider output 비저장·비노출
- create·ACK idempotency와 result version CAS
- +22시간 cleanup·+24시간 expiry gate·삭제 실패 복구
- 다른 installation ownership 404 정규화와 인증 선차단
- 실제 network·credential·logging·원격 STT 부재
- 기존 health/lifecycle·T-003·공용 계약 validator 무회귀

## 2. 요약

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| lockfile 설치·audit | PASS_WITH_RISK | 설치와 audit 0건. Host Node 26으로 목표 Node 24 engine 경고가 있다. |
| 기존 health/lifecycle | PASS | `npm run check`, 15/15 통과. |
| T-003·T-004 suite | PASS | T-003 24개와 T-004 13개, 합계 37/37 통과. |
| 공용 계약 validator | PASS | common·STT·AI·security·shared fixture validator가 모두 통과했다. |
| provider 단일 호출 | PASS | duplicate worker·timeout·late result에서 logical job당 최대 1회다. |
| invalid output | PASS | 잘못된 evidence/order/shape/안전 온도는 `OUTPUT_INVALID`, content 비저장이다. |
| idempotency·ACK | PASS_WITH_RISK | create replay·body 충돌·ACK version CAS·delete retry 기본 경계가 통과했다. |
| 승인 snapshot fixture | FAIL | fixture 원문의 선언 hash와 runtime 계산이 달라 create가 `invalid_request`다. |
| +24시간 삭제 정합성 | FAIL | 동기 delete 실패에도 `expired_deleted`를 반환하면서 content record가 남는다. |
| RFC 3339 date-time | FAIL | 존재하지 않는 `2026-02-30T00:00:00Z` create·ACK 시각을 허용한다. |
| network·credential·logging | PASS | 신규 source에서 금지 패턴을 발견하지 못했다. |

## 3. 차단 결함

### QA-HIGH-004-001 — 승인 shared fixture를 runtime이 그대로 수용하지 못함

계약 validator는 `recipe-job-create.json`의 `steps`를 `jq -cS`로 직렬화한 SHA-256과
fixture의 `snapshot_sha256`이 같은지 강제한다. 선언 값은 다음과 같다.

```text
contract/fixture: fede90d1e0e1c53df3b6108f474ef6857179d08ac360fa1328b7b8d2ff872805
runtime computed: fcc3f74c87c8555377d44e6a6cf268e195b103df56c53b303ca4f4c6ebaf0564
validateRecipeJobCreate(original fixture): rejected
RecipeJobService.createJob(original fixture): invalid_request
```

공식 integration test는 fixture를 읽은 뒤 `snapshot_sha256`을 runtime 값으로 교체하므로
승인 fixture 원문을 검증하지 않는다. Task 성공 기준은 shared fixture의 정상 흐름이
runtime integration test를 통과하는 것이며, 테스트가 계약 입력을 변형하면 충족되지 않는다.

필수 재작업:

1. 계약 validator와 동일한 canonical byte 규칙을 runtime·iOS가 공유하도록 명시한다.
2. 승인 fixture의 `snapshot_sha256`을 변경하지 않고 실제 service/HTTP create가 202를
   반환하도록 한다.
3. canonical key order·UTF-8·배열 순서·개행 경계를 golden vector로 고정한다.
4. hash mismatch는 job·outbox·provider 호출 전에 422로 차단하는 기존 경계를 유지한다.

### QA-HIGH-004-002 — +24시간 delete 실패를 `expired_deleted`로 거짓 확정함

`#expireIfDue`는 job을 먼저 `expired/expired_deleted`로 전환한 뒤 `#deleteContent` 결과를
확인하지 않는다. 동기 삭제가 실패해도 상태는 삭제 완료로 남고 content record는 보존된다.

독립 반례:

```text
failNextContentDelete()
now = created_at + 24h
GET status.state = expired
GET status.result_state = expired_deleted
repository.contents = 1
repository.contentDeletes = 0
```

AI 계약은 +24시간 GET gate에서 복호화 전에 접근 차단하고 동기 삭제하며, 24시간 이상
content가 하나라도 있으면 원격 AI 기능을 재개하거나 출시할 수 없다고 규정한다. 삭제
성공 receipt 전 완료로 표시하지 않는 보안 계약에도 어긋난다.

필수 재작업:

1. +24시간 접근 차단은 유지하되 delete 성공 전 `expired_deleted`를 확정하지 않는다.
2. delete 실패를 안전한 별도 상태/내부 cleanup pending으로 기록하고 sweeper 재시도
   대상에서 제거하지 않는다.
3. delete 성공 후에만 `expired_deleted`와 cleanup 완료를 원자 확정한다.
4. expiry GET delete failure·반복 failure·sweeper recovery·신규 job 차단 반례를 추가한다.

## 4. 중간 결함

### QA-MEDIUM-004-003 — 존재하지 않는 달력 날짜가 `date-time` 검증을 통과함

`isRfc3339`는 정규식과 `Date.parse` finite 여부만 확인한다. JavaScript `Date.parse`는
`2026-02-30`을 다음 달로 정규화하므로 존재하지 않는 날짜가 승인된다.

```text
recorded_at = 2026-02-30T00:00:00Z -> createAccepted=true
saved_locally_at = 2026-02-30T00:00:00Z -> acknowledgementAccepted=true
```

두 계약 schema는 해당 필드를 `format: date-time`으로 정의한다. 실제 달력 일자와 timezone,
leap-year를 검증하는 RFC 3339 parser를 사용하고 create·ACK 양쪽에 invalid calendar
golden case를 추가해야 한다.

## 5. 통과 상세

- 인증 실패와 다른 installation job 조회는 domain/provider 전에 안전하게 차단된다.
- create idempotency replay는 같은 job을 반환하고 body 변경은 409 경계로 차단된다.
- duplicate worker 20개와 crash-before-provider 복구에서 provider call은 1회다.
- provider 시작 후 timeout·connection loss의 late result는 terminal CAS에 실패한다.
- provider error·unknown code·invalid output은 raw payload를 status에 포함하지 않는다.
- ACK wrong version은 content를 삭제하지 않고 정상 ACK·동시 ACK는 한 번만 삭제한다.
- ACK delete failure는 외부 성공을 확정하지 않고 다음 요청에서 복구된다.
- expiry GET은 content read count를 증가시키지 않아 접근 차단 자체는 유지한다.
- 신규 구현에 실제 HTTP client, provider credential, logger·console 사용이 없다.

## 6. 수행 검증

```text
origin/develop...HEAD: 0 behind / 1 ahead (QA 기록 전)
npm ci --ignore-scripts: PASS, audit 0건, Node 26 host engine warning
npm run check: PASS, 기존 15/15
node --test HTTP/auth/AI/jobs: PASS, 37/37
전체 runtime 합계: PASS, 52/52
common·STT·AI·security validator: PASS
iOS·Backend shared fixture validator: PASS
승인 fixture 원문 runtime create: FAIL, invalid_request
+24h delete failure 반례: FAIL, expired_deleted이지만 contents=1
invalid calendar date create·ACK: FAIL, 둘 다 accepted
network·credential·logging 정적 scan: PASS
aiops validate task --strict: QA 인계 전 실행
git diff --check: QA 인계 전 실행
```

## 7. 최종 판정과 인계

공식 52개 테스트와 공용 validator는 통과했지만, 테스트가 승인 fixture hash를 runtime 값으로
교체해 핵심 계약 불일치를 숨긴다. 또한 +24시간 삭제 실패를 삭제 완료로 확정해 개인정보
수명 상태가 실제 저장 상태와 다르다. HIGH 2건과 date-time MEDIUM 1건으로 최종 판정은
`FAIL`이다. Task를 `rework_requested`로 전환하고 Development Lead Agent / Lead Role에
재작업 범위 조율을 인계한다. T-006~007은 T-004 재검증 통과 전 열지 않는다.
