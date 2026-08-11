# Backend 개발 상태

최종 업데이트: 2026-08-11
상태: T-20260728-006·T-20260810-001~004 `done`, T-20260810-005 구현 완료·Backend QA 독립 검증 대기

## 현재 단계

- 계약 정의 `T-20260728-005`: `done`
- Foundation 구현 `T-20260728-006`: `done`, Product Owner 최종 완료·PR #93 병합 승인
- Runtime scaffold `T-20260804-002`: `done`, Backend QA `PASS_WITH_RISK`·최종 승인
- 공통 middleware `T-20260804-003`: `done`, Backend QA `PASS_WITH_RISK` 수용
- Mock AI job `T-20260804-004`: `done`, PR #79 squash merge `a73a028`
- 원격 STT 비활성 경계 `T-20260804-005`: `done`, HIGH 해소·독립 재검증·완료 리뷰·PR #84 병합 승인 완료
- 안전 runtime `T-20260804-006`: `done`, Lead `PASS_WITH_RISK`·Product Owner PR #87 병합 승인
- 최종 통합 `T-20260804-007`: `done`, `QA-HIGH-007-001` 해소·전체 100/100·계약
  validator·경계 감사·Node 24.18.0 non-root container 통과, Product Owner PR #91
  squash merge 승인

Node.js 24 LTS·TypeScript 7·Fastify 5 기반 local/mock composition에 공통 HTTP, installation
인증, rate limit, HTTP/domain idempotency, Mock AI job, 비용 admission, allowlist telemetry와
cleanup을 연결했다. production은 local adapter를 거부하고 고정 `GET /healthz`만 제공한다.
실제 provider·network·production datastore·원격 STT route는 없다.

T-20260810-001은 OpenAI 한국 저장 endpoint·고정 model·versioned prompt·strict
RecipeDraft schema를 provider-neutral 경계에 연결했다. adapter는 승인·ZDR·Modified
Retention·국외 처리·credential 게이트를 모두 요구하며, 현재 composition에
연결하지 않아 실제 외부 호출은 비활성이다.

Backend QA의 HIGH 2건에 따라 response body read 연결 유실을
`OUTCOME_UNKNOWN`으로 분리했고, provider-facing schema를 OpenAI Structured Outputs
지원 keyword subset으로 투영했다. provider에서 제외된 uniqueness·length 제약은
기존 runtime semantic validator에서 계속 fail closed한다.

T-20260810-002는 repository port와 서울 리전 Firestore·Cloud Tasks local contract
adapter를 추가했다. datastore 재구성 뒤 job·idempotency·outbox·결과·ACK 복구,
queue 장애 뒤 단일 재발행, 22시간 cleanup·15분 sweeper, 23시간 신규 job 차단,
23시간 45분 격리 삭제 전환,
24시간 접근 차단과 삭제 실패 복구를 synthetic test로 검증했다.

QA-HIGH-810002-001 재작업으로 객체 identity 기반 `WeakMap` 저장을 제거하고 선택적
durable file backing을 추가했다. 실제 child process를 네 번 재기동해 새 adapter에서
job·content·create/ACK idempotency·worker/cleanup outbox·published marker를 복구하고,
cleanup pending·delete failure도 새 adapter 연쇄에서 삭제 완료되는 것을 검증했다.

T-20260810-003은 256-bit·120초 hash-only challenge, production App Attest cryptographic
verifier 경계, 전역 key ID와 등록 공개키·receipt 고정, monotonic assertion counter,
원자 challenge/credential/idempotency/token grant를 구현했다. 최대 900초 signed
installation token의 위조·clock skew·활성/직전 key 회전·installation/JTI 폐기와
IP/installation/project/AI rate limit, non-production compatibility 하향 cap을 synthetic
test로 검증했다. 실제 Apple adapter·credential·Cloud resource·배포는 활성화하지 않았다.

T-20260810-004는 UTC 월 단위 provider 5,500회·입력 20M·출력 8M token·외부비
KRW 50,000을 하나의 원자 reservation에서 독립 hard cutoff한다. provider envelope에
Cloud Run·Tasks·Firestore·network·telemetry 비용을 필수화하고 storage·인증·logging·
cleanup retry도 같은 KRW 원장에 포함했다. admission·terminal telemetry 장애는 provider
side effect와 결과 공개 전에 kill switch로 닫히며 콘텐츠·secret field는 허용하지 않는다.

Backend QA의 HIGH 3건·MEDIUM 1건 재작업으로 provider 13-SKU exact maximum envelope와
operation kind별 SKU·quantity 계약을 고정했다. kind·전체 envelope·price manifest의
canonical hash가 같은 경우만 replay하고, 0·과소·과대·누락·wrong-kind·unknown extra와
같은 반올림 KRW의 다른 envelope를 차단한다. provider terminal token metric도
입력 5,000·출력 2,000 상한을 logger schema에서 직접 강제한다.

2차 QA의 HIGH 1건·MEDIUM 1건 재작업으로 provider·billable request를 exact enumerable
own data-property schema에서 한 번만 불변 projection한다. accessor·Proxy·symbol·
non-enumerable·unknown field·invalid kind는 getter 실행이나 ledger mutation 없이
`service_disabled`가 되며, token·kind·quantity의 동일 projection을 검증·가격·hash·원장에
사용해 under-reservation과 privacy cleanup 권한 전환을 차단한다.

QA-HIGH-810002-002 재작업으로 backing별 cross-process transaction lock과 transaction
진입 시 최신 state 재로딩을 추가했다. 먼저 열린 stale adapter 및 barrier로 동시에 시작한
child process 경쟁에서 create는 신규 1건+replay 1건, worker는 provider 총 1회만 허용했고,
ACK/delete·cleanup pending·outbox/published marker도 단일 승자를 유지했다.

T-20260810-005는 첫 출시 production profile의 upload route·audio body parser·queue·
storage·provider·audio egress·automatic fallback 등록을 모두 0으로 고정했다. source,
package dependency, Dockerfile과 Backend workflow/deployment manifest를 검사하는 fail-closed
감사와 production health-only 후보 audio POST negative test를 추가했다. container gate는
Node 24 non-root image에서 remote STT 환경·audio/test asset 부재, 활성화 startup 거부와
후보 upload 404·입력 비반사를 검증하며 실제 원격 STT·음성 upload 구현은 없다.

## 다음 조치

1. Foundation local/mock 범위는 `done`으로 유지한다.
2. `T-20260810-002`는 HIGH 2건 해소와 Backend QA `PASS_WITH_RISK`를 Development Lead와
   Product Owner가 수용해 최종 완료·병합을 승인했다. 실제 Firestore·Cloud Tasks 통합
   검증은 `T-20260810-006` 외부 변경 게이트에서 수행한다.
3. credential 등록·실제 sandbox/production 호출·Cloud 리소스·배포는 별도
   외부 변경 승인 전까지 비활성으로 유지한다.
4. `T-20260810-003`은 Backend QA·Development Lead `PASS_WITH_RISK`와 Product Owner
   위험 수용을 거쳐 `done`이다. process 재생성 후 durable revocation과 key 회전 중
   replay 응답 정책, 실제 Apple·Firestore·KMS·기기 proof는 T-006 필수 gate로 유지한다.
   PR #122의 canonical 병합 확인 후 T-20260810-004 선행 조건을 해제한다.
5. `T-20260810-004`는 QA 6건 해소와 Product Owner 위험 수용 후 PR #123으로 병합돼
   canonical `done`이다.
6. `T-20260810-005`는 `verification_ready`이며 Backend QA가 production config·route·
   body parser·queue·storage·provider·egress zero-capability, image/manifest audit와 전체
   155/155를 독립 재검증한다. Docker가 있는 QA/CI에서 container gate를 실행한다.

## 차단 경계

- 실제 AI provider 호출·배포·secret: ZDR·credential·외부 변경 승인 전까지 비활성
- 원격 STT endpoint·audio upload: 별도 제품 승인 전 금지
- 후속 패키지: 선행 Task가 `develop`에서 `done`이 되기 전 착수 금지
