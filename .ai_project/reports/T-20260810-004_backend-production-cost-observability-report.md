# T-20260810-004 Backend 작업 보고서

## 결과

- 상태: `verification_ready`
- 실행 Role: Backend Agent / Execution Role
- 기준: `origin/develop@09d6c21e0740c94ec724c55cd449650468430702`
- 작업 branch: `task/T-20260810-004-cost-observability`
- 작업 worktree: `/private/tmp/cooklog-t20260810-004-cost-observability`

## 실행 조건 확인

- canonical에서 T-20260810-001·002·003이 모두 `done`임을 확인했다.
- T-20260810-004는 `approved`, Backend Agent / Execution Role, Product Owner 승인,
  lock 없음 상태에서 시작했다.
- 다른 Backend Agent의 `in_progress` 또는 lock이 없음을 확인한 뒤 단일 Task lock을 얻었다.

## 구현 내용

- UTC 월별 provider 호출 5,500회, 입력 20,000,000 token, 출력 8,000,000 token,
  Backend 외부비 KRW 50,000을 독립 차원으로 가지는 원자 reservation 경계를 추가했다.
- 월 KRW 원장에는 5,000원 delayed billing reserve를 미리 포함한다. 네 차원 중 하나라도
  초과하는 operation은 일부 승인 없이 전체 거절하고 rejected decision도 immutable하게
  유지한다.
- provider operation은 입력 5,000·출력 2,000 token, attempt 1회만 허용한다. AI 입력·
  출력과 Cloud Run CPU/memory/request, Tasks, Firestore read/write/delete, network,
  Logging·Trace·Monitoring 최대 quantity가 하나라도 빠지면 fail closed한다.
- storage, authentication, logging, egress, build, TTL delete와 privacy cleanup retry도
  같은 KRW 원장에 별도 operation으로 예약한다. 이미 예약된 privacy cleanup은 kill
  switch 이후에도 확인할 수 있다.
- 동일 operation·동일 envelope는 `replayed`로 분리해 두 번째 provider 실행을 승인하지
  않고, 같은 operation ID의 다른 envelope는 conflict로 차단한다.
- price/FX snapshot, 6시간 billing reconciliation, SKU, UTC clock, ledger availability와
  telemetry sink 장애를 billable side effect 전에 확인한다.
- reservation 승인·거절은 콘텐츠 없는 bounded `cost_guardrail_changed` event가 sink에
  기록돼야 한다. sink 또는 redaction/reservation 실패 시 보수적 reservation을 유지하고
  kill switch로 새 비용 operation을 차단한다.
- provider 정산은 reserved token/cost 상한을 확인하고 terminal telemetry 기록 뒤에만
  결과 공개를 승인한다. token overflow·정산 무결성·terminal sink 장애는 결과를 숨기고
  kill switch를 켠다.
- 기존 scanner가 허용된 `input_tokens`·`output_tokens` metric을 secret token으로 오탐하던
  결함을 수정했다. 두 정수 metric만 허용하며 access token·authorization·proof·prompt·
  recipe·transcript·raw provider response는 계속 차단한다.

## QA 재작업 결과

- `QA-HIGH-004-001 / WP-R1`: provider의 13개 필수 SKU와 exact maximum quantity를
  `PRODUCTION_PROVIDER_OPERATION_ENVELOPE`와 security fixture에 서버 소유 계약으로
  고정했다. 각 service의 누락·0·과소·과대·NaN/Infinity와 unknown extra를 ledger mutation
  전에 차단하는 회귀를 추가했다.
- `QA-HIGH-004-002 / WP-R2`: reservation identity에 operation kind, 정렬된 전체
  SKU·quantity와 price manifest/SKU identity의 SHA-256 canonical hash를 저장한다.
  반올림 KRW가 같아도 다른 accepted/rejected envelope와 manifest는 conflict가 되며
  정확히 같은 identity만 replay한다.
- `QA-HIGH-004-003 / WP-R3`: runtime, tasks, firestore, TTL delete, logging, egress,
  build, privacy cleanup, authentication 9개 kind마다 exact SKU·maximum quantity 계약을
  추가했다. 각 kind의 정상과 누락·0·과소·과대·NaN/Infinity·wrong-kind·unknown extra,
  kill switch 이후 사전 예약 cleanup 권한을 검증했다.
- `QA-MEDIUM-004-001 / WP-R4`: `provider_call_completed` logger schema가 input token
  5,000·output token 2,000 상한을 직접 강제한다. 0, 경계-1, 경계, 경계+1, 음수,
  비정수와 1B 원본 반례를 검증했다.
- 기존 월 4차원 hard cutoff, delayed reserve, 동시 단일 승자, price/FX/billing/clock,
  admission·terminal sink 장애, 결과 비공개와 콘텐츠·secret 비로깅 회귀를 유지했다.

## QA 2차 재작업 결과

- `QA-HIGH-004-004 / WP-R5`: provider와 billable request의 exact top-level key를
  property descriptor로 한 번만 읽어 불변 local projection으로 만든다. operation ID,
  token·attempt, operation kind와 quantity는 이후 재평가하지 않으며 validation, 가격 계산,
  canonical hash와 repository request가 같은 projection을 사용한다.
- accessor와 Node `Proxy`는 getter/trap을 실행하지 않고 `service_disabled`로 종료한다.
  token-changing getter는 read 0회·ledger token 0건, kind-changing getter는 read 0회·
  privacy cleanup 권한 false로 고정했다.
- `QA-MEDIUM-004-002 / WP-R6`: `Reflect.ownKeys()`와 descriptor 기반으로 enumerable string
  data property의 exact key set만 수용한다. symbol, non-enumerable, unknown extra,
  accessor, custom prototype와 invalid operation kind를 예외 전파·ledger mutation 없이
  차단한다.
- 기존 QA 4건, exact envelope/replay/token metric, 월 4차원 hard cutoff, delayed reserve,
  sink/result fail-closed와 콘텐츠·secret 비로깅 회귀를 모두 유지했다.

## 변경 파일

- `apps/backend/src/cost/production-cost-observability.ts`
- `apps/backend/src/observability/safe-logger.ts`
- `apps/backend/tests/security/production-cost-observability.test.ts`
- `apps/backend/tests/security/safe-logger.test.ts`
- `apps/backend/contracts/security/fixtures/production-cost-hard-cutoffs.json`
- `apps/backend/contracts/security/validate-contracts.sh`
- `apps/backend/contracts/security/README.md`
- `apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md`
- `apps/backend/docs/STATUS.md`
- `apps/backend/docs/CHANGELOG.md`
- Task·Development/Quality board·이 보고서

## 자체 검증

실행 명령: `cd apps/backend && npm run verify`

- TypeScript typecheck/build: PASS
- Node runtime tests: 153/153 PASS
- common contract validation: PASS
- remote STT contract validation: PASS
- AI recipe contract validation: PASS
- security/privacy/observability contract validation: PASS
- iOS/Backend shared fixture contract validation: PASS
- Backend foundation boundary audit: PASS
- 첫 전체 실행에서 범위 밖 기존 App Attest forgery fixture가 base64url 마지막 문자 변조의
  동일-byte decoding 간헐 조건으로 152/153 실패했으나, 변경 없이 즉시 전체 재실행해
  153/153 PASS했다. T-004 전용 targeted suite는 양 실행 모두 16/16 PASS했다.
- 실제 provider/network/Cloud Billing 호출: 0건
- 실제 credential 등록·Google Cloud 리소스 생성·배포: 0건

## 남은 리스크

- 제공한 production repository는 원자 의미론을 검증하는 process-local contract
  implementation이다. 실제 Firestore transaction과 여러 Cloud Run instance의 경합,
  월 ledger 생성·복구는 T-20260810-006 composition에서 검증해야 한다.
- 가격 fixture의 일부 SKU ID와 단가는 합성값이다. 실제 Cloud Billing Catalog 조회,
  Billing export reconciliation과 환율 snapshot은 외부 변경 승인 뒤 연결해야 한다.
- 실제 Logging/Trace/Monitoring sink와 비용 reservation의 재귀·장애 의미론은 synthetic
  sink에서만 검증했다. T-006에서 required sink health와 결과 비공개 복구를 재검증해야 한다.
- production provider/job/storage/auth composition에는 아직 연결하지 않았다. allowed path와
  외부 변경 경계상 T-006이 연결 책임을 가진다.
- 현재 실행 환경은 Node.js `v26.4.0`이며 production 기준은 Node.js 24 LTS다.
  Backend QA/CI에서 Node 24·non-root container 재검증이 필요하다.
- 범위 밖 기존 App Attest forgery test는 base64url 마지막 문자 치환이 원본과 동일 바이트로
  디코드될 수 있어 간헐 실패 가능성이 있다. T-003 또는 후속 QA에서 decoded signature가
  반드시 달라지는 mutation으로 별도 보강해야 하며, T-004 allowed path 밖이라 수정하지 않았다.

## 다음 Agent에게 전달할 말

너는 Backend QA Agent / Verification Role이야. Task T-20260810-004를 독립 검증해줘.

- 현재 상태: `verification_ready`
- 기준 상태 ref/SHA: `origin/develop@09d6c21e0740c94ec724c55cd449650468430702`
- 검증 대상: `task/T-20260810-004-cost-observability` worktree의 미커밋 변경
- 작업 보고서: `.ai_project/reports/T-20260810-004_backend-production-cost-observability-report.md`
- 중점 검증: 월 5,500 calls·20M input·8M output·KRW 50,000 독립 hard cutoff,
  delayed reserve, QA-HIGH-004-001의 provider 13-SKU exact maximum, QA-HIGH-004-002의
  full-envelope/manifest hash replay, QA-HIGH-004-003의 kind별 SKU 계약과 cleanup 권한,
  QA-MEDIUM-004-001의 5,000/2,000 strict metric, QA-HIGH-004-004의 token/kind/accessor/
  proxy 단일 projection, QA-MEDIUM-004-002의 non-enumerable·symbol·unknown·invalid-kind
  exact shape, 기존 price/FX/billing/clock·sink 장애·result 비공개·token material redaction
- 남은 리스크: process-local repository, 합성 SKU/가격, 실제 Billing export·distributed
  transaction·sink·composition·Node 24 container는 T-006/QA gate에서 검증 필요
- 금지 경계: credential 등록, 실제 provider/network/Cloud Billing 호출, Google Cloud
  리소스 생성·배포 금지
- 판정은 `PASS`, `PASS_WITH_RISK`, `FAIL`, `BLOCKED` 중 하나로 기록해줘.

## 2026-08-11 재작업 승인 이력

- Backend QA 독립 검증은 정상 회귀 146/146과 기존 비로깅 경계는 통과했으나
  `QA-HIGH-004-001~003`, `QA-MEDIUM-004-001`로 `FAIL`을 판정했다.
- Product Owner가 provider 13-SKU exact canonical envelope, full-envelope replay identity,
  operation-kind별 SKU/quantity schema, provider token metric 5,000/2,000 상한의 `WP-R1~R4`
  재작업을 승인했다.
- 현재 구현·QA 반례·보고서는 보존하며, QA 반례 네 건을 고정 회귀로 추가하고 전체 Backend
  회귀·계약 validator·boundary audit를 유지한 뒤에만 독립 재검증으로 인계한다.
- 실제 provider/network/Cloud Billing 호출, credential, Google Cloud 리소스·배포는 금지한다.

## 2026-08-11 2차 재작업 승인 이력

- Backend QA 재검증에서 기존 4건은 `RESOLVED`, 전체 151/151·계약 5종·비로깅은
  통과했으나 request accessor 재평가로 token 0/0 under-reservation과 runtime 비용으로
  privacy cleanup 권한을 얻는 `QA-HIGH-004-004`, non-enumerable extra 허용·invalid kind
  예외 전파의 `QA-MEDIUM-004-002`를 확인해 `FAIL`을 판정했다.
- Product Owner가 단일 불변 request projection과 exact own data-property schema의
  `WP-R5~R6`를 승인했고, Backend Agent가 승인 범위만 구현했다.
- 실제 provider/network/Cloud Billing 호출, credential, Google Cloud 리소스·배포는
  계속 비활성으로 유지했다.
