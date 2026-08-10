# Backend 변경 기록

- 2026-08-10: Development Lead가 `T-20260729-003` 실제 provider·스테이징 Backend를
  provider, datastore/job, 인증, 비용·관측성, STT 비활성, 배포·rollback의 6개 하위
  Task로 scope했습니다. 외부 결정과 개별 승인 전에는 모두 `proposed`로 유지합니다.

- 2026-08-06: Product Owner가 T-20260728-006 완료 리뷰의 잔여 위험을 수용하고 최종
  완료·PR #93 squash merge를 승인했습니다. Foundation을 `done`으로 확정하고 실제
  provider·cloud production Backend는 T-20260729-003 별도 승인 범위로 유지했습니다.
- 2026-08-06: Development Lead가 `T-20260728-006` 하위 T-002~007의 독립 QA와 PR
  #70·76·79·84·87·91 병합을 집계했습니다. 최신 develop에서 Backend 100/100·계약
  validator 5종·경계 감사를 재확인해 상위 완료 리뷰를 `PASS_WITH_RISK`,
  `completion_review`로 확정하고 Product Owner 최종 완료 승인을 요청했습니다.
- 2026-08-06: `T-20260804-007` 독립 재검증에서 HIGH 해소, 전체 100/100·계약 5종·
  Node 24 non-root container 통과를 확인했다. Development Lead `PASS_WITH_RISK` 완료
  리뷰와 Product Owner 완료·PR #91 squash merge 승인으로 Foundation을 `done` 처리했다.
- 2026-08-06: T-007 재작업 commit `056d193`의 PR #91 `backend-verify`와
  `backend-container`가 통과했다. lock을 해제하고 `verification_ready`로 Backend QA에
  독립 재검증을 인계했다.
- 2026-08-06: `QA-HIGH-007-001` 재작업으로 provider 결과를 `processing/none`에 비공개
  staging하고 terminal audit 성공 뒤에만 `succeeded/available` 또는 `failed`로 전환한다.
  audit 실패 재실행은 staged terminal만 재감사해 provider 호출을 1회로 유지한다.
- 2026-08-06: terminal sink 두 번째 write 장애, reservation 거절, invalid event shape의
  직접 통합 회귀를 추가했다. 세 경우 모두 첫 실행 `telemetry_unavailable`·결과 비노출,
  재실행 복구·provider 1회를 확인했고 QA 원본 반례와 전체 100/100·계약 5종을 통과했다.
- 2026-08-06: `T-20260804-007` 독립 QA에서 전체 96/96·계약 validator 5종·Node 24
  non-root container는 통과했으나 terminal telemetry sink 장애 뒤 미감사 성공 결과가
  공개되는 `QA-HIGH-007-001`을 확인했다.
- 2026-08-06: Product Owner가 terminal 감사와 성공 결과 공개의 fail-closed 재작업,
  sink·reservation·event shape 장애 및 Provider at-most-once 회귀를 승인했다.
- 2026-08-06: PR #91에서 `backend-verify`와 `backend-container`가 통과했다. 새 clone
  `npm ci`·96/96·계약 5종과 Node 24.18.0 build/runtime, non-root, lifecycle·production
  health·SIGTERM exit 0을 확인해 T-007을 `verification_ready`로 Backend QA에 인계했다.
- 2026-08-06: `T-20260804-007`에서 T-002~006의 공통 HTTP·installation 인증·rate limit·
  idempotency·Mock AI job·비용 admission·allowlist telemetry·cleanup을 하나의 local/test
  app과 programmatic worker로 연결했다. production은 local adapter 구성을 거부한다.
- 2026-08-06: 공용 fixture 기반 실제 HTTP create·status·ACK와 exact replay, 인증·rate·비용
  선차단, 콘텐츠 telemetry canary, 비정상 clock과 원격 STT parser 전 차단 통합 테스트를
  추가했다. 호스트 전체 96/96과 계약 validator 5종·경계 감사를 통과했다.
- 2026-08-06: Node.js 24.18.0 `.nvmrc`, 단일 `npm run verify`, non-root container 검증
  스크립트와 Backend 전용 GitHub Actions를 추가했다. 로컬 host에는 Docker가 없어 실제
  container 결과는 PR CI 필수 게이트에서 확인한 뒤 Backend QA에 인계한다.
- 2026-08-06: Product Owner가 `T-20260804-007` Backend Foundation 최종 통합·보안
  검증과 로컬 실행 handoff를 별도 승인했다. T-002~006 local/mock composition, 새 clone,
  Node 24.18.0 non-root container와 전체 계약 회귀로 범위를 제한하고 실제 provider·cloud
  resource·secret·배포·원격 STT는 제외해 Backend Agent에 인계했다.
- 2026-08-06: Product Owner가 `T-20260804-006` 완료 리뷰와 T-007 잔여 위험 이관을
  수용하고 최종 완료·PR #87 squash merge를 승인했다. T-007 선행은 해소하되 별도 실행
  승인 전 `proposed`로 유지한다.
- 2026-08-06: Development Lead가 `T-20260804-006` HIGH 2건 해소, 허용 경로와 원본
  공격 반례·T-006 26/26·Backend 전체 92/92를 직접 재확인해 완료 리뷰를
  `PASS_WITH_RISK`로 수용했다. 실제 cloud adapter·Node 24 container·전체 composition은
  T-007 필수 통합 게이트에 유지하고 Product Owner 완료·병합 승인을 기다린다.
- 2026-08-06: `QA-HIGH-006-001` 재작업으로 `deployment_version`과
  `manifest_version`을 서버가 주입한 exact allowlist에 포함된 ID만 허용하도록 제한했다.
  미설정·미승인 version과 recipe·STEP·prompt canary는 event 전체를 폐기하고 고정
  `INVALID_VALUE` counter만 증가시킨다.
- 2026-08-06: `QA-HIGH-006-002` 재작업으로 비용의 `now`·`lastReconciledAt`과 raw
  metadata clock을 non-negative safe integer·표현 가능 epoch로 먼저 검증한다. 잘못된
  clock은 비용 admission 이전 차단, raw create·read·export·aggregate 차단과 기존 record
  무변조 `incident`로 fail closed한다. 직접 반례, T-006 26/26, 전체 92/92를 통과했다.
- 2026-08-06: Product Owner가 `T-20260804-006` 독립 QA의 자유 문자열 telemetry sink
  기록과 비정상 clock 비용·보존 fail-open HIGH 2건 재작업을 승인했다. 서버 소유 version
  allowlist와 잘못된 epoch의 비용 admission·raw metadata 생성/접근 fail-closed, 직접
  반례와 전체 회귀로 범위를 제한해 Backend Agent에 재인계했다.
- 2026-08-05: `T-20260804-006`에서 event별 exact allowlist·고정 enum을 새 객체로
  투영하는 `SafeLogger`와 secret/content pattern을 fail closed하는 redaction scanner,
  고정 reason drop counter를 구현했다.
- 2026-08-05: provider·runtime·Tasks·Firestore·TTL·logging·egress·build를 합산하는
  월 KRW 50,000 원장을 구현했다. operation 전액 승인/거절, KRW 5,000 delayed reserve
  정산, CAS·가격·FX·SKU·billing 지연 차단과 되돌릴 수 없는 100% kill switch를 검증했다.
- 2026-08-05: raw metadata의 +28일 explicit cleanup, 15분 독립 sweeper, 필수 sink 6개
  receipt와 +30일 read·export·aggregate 선차단을 구현했다. 기존 AI ACK 즉시·+22시간·
  +24시간 수명 회귀를 포함한 T-006 20/20, Backend 전체 86/86을 통과해 QA에 인계했다.
- 2026-08-05: Product Owner가 `T-20260804-006` redacted logging·전체 외부비 원장·
  콘텐츠와 raw metadata TTL cleanup 경계 구현을 별도 승인했다. 실제 cloud sink·billing·
  datastore·queue·KMS·provider와 공유 app wiring은 제외하고 local/mock deterministic
  경계와 장애·동시성 테스트로 제한해 Backend Agent에 인계했다.

- 2026-08-05: `T-20260804-005` startup validator 연결 재작업의 독립 재검증에서
  `QA-HIGH-005-001` 해소, 30/30 startup mutation·실제 process 3/3·전체 66/66을
  확인했다. Development Lead가 `PASS_WITH_RISK`를 수용하고 Product Owner가 완료와
  PR #84 squash merge를 승인했다. Node 24·container·공유 composition은 T-007로
  이관하고 T-006은 별도 실행 승인 대기로 유지한다.

- 2026-08-05: `QA-HIGH-005-001`에 따라 실제 `loadRuntimeConfig()`가 remote STT 환경
  validator를 반드시 실행하도록 연결해 listener 생성 전 무승인 설정을 fail closed했다.
- 2026-08-05: QA 설정 9종과 기존 enabled flag를 local·test·production 진입점에 입력하는
  30개 직접 반례를 추가했다. T-005 11/11, Backend 전체 66/66과 공용 validator를 통과해
  Backend QA 독립 재검증에 인계했다.
- 2026-08-05: `T-20260804-005`에서 승인 fixture와 동일한 첫 출시 disabled config,
  미승인 mode·route·provider·credential·egress·fallback 설정을 거부하는 fail-closed
  validator를 구현했다.
- 2026-08-05: transcribe/audio 입력 surface가 없는 disabled resolver·activation gate와
  route 등록 없이 `onRequest`에서 `SERVICE_DISABLED`를 반환하는 HTTP 경계를 추가했다.
- 2026-08-05: T-005 10/10, Backend 전체 65/65, 표준 health 15/15와 common·STT·AI·
  security·shared fixture validator를 통과해 Backend QA 독립 검증에 인계했다.
- 2026-08-05: 공용 `develop`에서 T-002·T-003 완료를 확인하고 Product Owner가
  `T-20260804-005` 원격 STT 비활성 확장 경계·무승인 활성화 차단 구현을 별도 승인했다.
- 2026-08-05: disabled resolver·activation gate와 route·body read·queue·egress 0회
  검증만 Backend Agent에 인계하고 endpoint·provider·secret·audio storage는 제외했다.
- 2026-08-05: Product Owner가 T-20260804-004의 QA·Lead `PASS_WITH_RISK`와 T-006~007
  잔여 위험 이관을 수용하고 최종 완료·PR #79 병합을 승인했다.
- 2026-08-05: PR #79를 squash merge SHA `a73a028`로 `develop`에 반영해 T-004를
  공용 `done`으로 확정하고 T-005 별도 실행 승인 검토로 인계했다.
- 2026-08-05: Backend QA가 T-20260804-004의 HIGH 2건·MEDIUM 1건 해소, 전체 55/55와
  공용 계약 무회귀를 `PASS_WITH_RISK`로 확인했다.
- 2026-08-05: Development Lead가 성공 기준·허용 경로, PR #79 `CLEAN`과 필수 check를
  재확인하고 production adapter·재시작 내구성을 T-006~007에 이관하는 조건으로 완료
  리뷰를 수용해 Product Owner 최종 승인 단계로 전환했다.
- 2026-08-05: `QA-HIGH-004-001`에 따라 snapshot canonical JSON에 LF 종결 byte를 포함해
  계약 `jq -cS`와 일치시켰고 승인 fixture 원문 service·HTTP create와 golden vector를
  추가했다.
- 2026-08-05: `QA-HIGH-004-002`에 따라 +24시간 delete 실패는 내부 cleanup pending과
  공개 500으로 fail closed하고 신규 job을 503으로 차단한다. sweeper 삭제 성공 후에만
  `expired_deleted`를 확정한다.
- 2026-08-05: `QA-MEDIUM-004-003`에 따라 Gregorian 달력·윤년·timezone 범위를 검증하고
  create·ACK invalid date 반례를 추가했다. 전체 55/55와 공용 validator를 통과했다.
- 2026-08-05: Product Owner가 `T-20260804-004` 독립 QA의 shared fixture snapshot hash
  불일치, +24시간 삭제 실패 거짓 완료 HIGH 2건과 invalid calendar date 허용 MEDIUM 1건의
  제한된 재작업을 승인해 Backend Agent에 다시 인계했다.
- 2026-08-05: 원본 fixture 무변조 성공·canonical golden vector, cleanup pending/retry·
  sweeper 복구, strict RFC 3339 create·ACK 반례를 필수 회귀 범위로 확정했다.
- 2026-08-05: `T-20260804-004`에서 `RecipeAIProvider` interface와 deterministic Mock,
  strict create/output validator를 구현했다.
- 2026-08-05: 원자 in-memory job/content/idempotency/outbox 저장, duplicate worker CAS,
  provider 최대 1회, timeout decision과 late result 폐기 경계를 추가했다.
- 2026-08-05: 인증 기반 create·status·ACK route, result version 동시 삭제 1회·replay,
  +22시간 cleanup과 +24시간 content read 전 expiry를 구현했다.
- 2026-08-05: T-004 13/13, T-003 포함 37/37, 기존 15/15와 공용 계약 validator를 통과해
  Backend QA에 인계했다. shared fixture snapshot hash canonicalization 불명확성은 QA 위험으로
  명시했다.
- 2026-08-05: 공용 `develop`에서 T-002·T-003 완료를 확인하고 Product Owner가
  `T-20260804-004` deterministic Mock AI recipe job·status·ACK·복구 저장 경계 구현을
  별도 승인해 Backend Agent에 인계했다.
- 2026-08-05: 실제 provider·network·credential·production 저장소·cloud와 app 전체
  wiring은 제외하고 단일 호출·timeout·result version·ACK 삭제 불변식을 유지했다.
- 2026-08-05: Backend QA가 `T-20260804-003` 재검증에서 HIGH 2건·MEDIUM 1건 해소와
  기존 15/15·T-003 24/24·공용 계약 무회귀를 확인해 `PASS_WITH_RISK`로 판정했다.
- 2026-08-05: Development Lead가 성공 기준·허용 경로·PR #76 CLEAN과 필수 check를
  재확인하고 Node 24·production adapter 위험을 T-007에 이관하는 조건으로 완료 리뷰를
  통과시켜 Product Owner 최종 승인 단계로 전환했다.
- 2026-08-05: Product Owner가 `PASS_WITH_RISK`와 T-007 잔여 위험 이관을 수용하고
  PR #76 `develop` 병합을 승인해 T-003을 `done`으로 확정했다. T-004는 별도 실행
  승인 후 착수한다.
- 2026-08-05: `T-20260804-003` 재작업에서 violation을 exact own descriptor로 검증한 뒤
  새 공개 객체로 투영해 extra property·getter·custom prototype·symbol·20개 초과 입력을
  `INTERNAL_ERROR`로 fail closed했다.
- 2026-08-05: strict schema required·unknown·child lookup을 own property 기준으로 통일하고
  query를 제외한 pathname으로 unsupported API version을 판정했다. 직접 반례 3개를 포함한
  T-003 전용 24개와 기존 15개, 공용 계약 validator를 통과해 독립 재검증에 인계했다.
- 2026-08-05: Backend QA가 `T-20260804-003`에서 violation 추가 필드 secret 누출과
  strict schema prototype-key 우회 HIGH 2건, query 포함 unsupported version 오분류
  MEDIUM 1건을 확인해 `FAIL`로 판정했다.
- 2026-08-05: Product Owner가 세 결함 수정과 직접 반례 회귀 테스트 추가를 재작업으로
  승인해 Backend Agent에 다시 인계했다. T-004~007 차단은 재검증 통과 전까지 유지한다.
- 2026-08-05: `T-20260804-003`에서 canonical request ID, 성공 envelope와 catalog 기반
  RFC 9457 problem renderer, fail-closed schema validation을 구현했다.
- 2026-08-05: non-production attestation verifier와 hash 저장 opaque installation token,
  인증 pre-handler를 추가했다.
- 2026-08-05: installation·IP HMAC·project fixed-window limiter, emergency limit 0과
  limiter unavailable fail-closed 경계를 추가했다.
- 2026-08-05: canonical JSON SHA-256, UUID v4 key, 24시간 in-memory record, 동시 단일
  승자·처리 중·outcome unknown·원본 response replay를 구현했다.
- 2026-08-05: 신규 HTTP/auth suite 21개와 기존 health/lifecycle 15개, 공용 계약
  validator를 통과해 Backend QA에 인계했다.

- 2026-08-05: `T-20260804-002` shutdown 재작업 독립 QA 15/15와 Lead 완료 리뷰를
  Product Owner가 승인해 `done`으로 확정했다. Docker·Node 24 container 실검증은
  `T-20260804-007` 필수 통합 게이트로 이관했다.

## 2026-08-05

- `QA-HIGH-002-001`에 따라 deadline 초과 시 connection 정리와 명시적 exit 1을 추가했다.
- shutdown 중 두 번째 SIGTERM/SIGINT가 즉시 exit 1로 강제 종료하도록 수정했다.
- 정상 SIGTERM·SIGINT, idle keep-alive, hanging close, 연속 signal의 실제 child process
  테스트 5개를 추가해 전체 15/15를 통과했다.
- 최신 `origin/develop`로 재정렬하고 공용 수익화·디자인 완료 기록을 보존했다.

## 2026-08-04

- `T-20260728-006` Foundation 구현을 6개 하위 Task로 분해했다.
- Backend Agent용 `apps/backend/AGENTS.md`와 상태·계획·스펙·결정 문서를 추가했다.
- 첫 runtime scaffold Task `T-20260804-002`를 실행 승인했다.
- 실제 provider·배포·원격 STT endpoint를 범위 밖으로 유지했다.
- Node.js 24 LTS·TypeScript 7·Fastify 5.11·npm 11 runtime을 결정했다.
- typed fail-closed 환경 설정과 고정 응답 `GET /healthz`를 구현했다.
- Cloud Run `PORT`·`0.0.0.0`·`SIGTERM` 경계와 multi-stage non-root container를 추가했다.
- config·health·remote STT route 부재·graceful close 테스트를 추가했다.
- Backend QA가 shutdown deadline 뒤 listener·process 생존 결함
  `QA-HIGH-002-001`을 확인해 `FAIL`로 판정했다.
- Product Owner가 강제 종료·두 번째 signal·hanging close·keep-alive·실제 process
  종료 상한 재작업을 승인해 Backend Agent에 재인계했다.
