# Backend Runtime Foundation 결정

결정일: 2026-08-04
상태: T-20260804-007 local/mock 통합 기준

## 결정

- Runtime: Node.js `24.x` LTS, container patch `24.18.0` 고정
- 언어: TypeScript `7.0.2`
- HTTP framework: Fastify `5.11.2`
- package manager: npm `11.x`, `package-lock.json`과 `npm ci`
- module: ESM / NodeNext
- test runner: Node.js 내장 `node:test`

## 비교

| 후보 | Cloud Run | 계약·테스트 | 운영 복잡도 | 결정 |
|---|---|---|---|---|
| Node.js + Fastify + TypeScript | `PORT`, host, signal을 명시적으로 제어 | Fastify schema 경계와 기존 JSON fixture를 후속 Task에서 직접 연결 가능 | npm lockfile 하나, 내장 test runner | 선택 |
| Node.js 내장 HTTP + TypeScript | 호환 | routing·schema·lifecycle을 자체 구현해야 함 | 의존성은 적지만 공통 middleware 구현량이 큼 | 제외 |
| Go + 표준 HTTP | 호환, 단일 binary | JSON Schema·fixture용 별도 toolchain 필요 | 빠른 시작이지만 iOS handoff DTO와 공통 계약 도구가 분리됨 | 제외 |

Node.js 공식 정책은 production에 Active 또는 Maintenance LTS 사용을 권장합니다. 결정
시점에 Node.js 24는 LTS이며 Fastify 5는 지원되는 Node.js LTS 라인을 검증합니다.

공식 근거:

- Node.js release policy: <https://nodejs.org/en/about/previous-releases>
- Fastify LTS: <https://fastify.dev/docs/v5.10.x/Reference/LTS/>
- Fastify TypeScript: <https://fastify.dev/docs/latest/Reference/TypeScript/>

## Cloud Run 계약

- ingress는 `PORT`에 지정된 port를 사용하고 `0.0.0.0`에 bind합니다.
- TLS는 container에서 종료하지 않습니다.
- `SIGTERM` 수신 후 새 요청 수락을 중단하고 최대 9초 안에 종료합니다. Cloud Run의
  10초 종료 창보다 짧게 제한합니다.
- 첫 `SIGTERM`/`SIGINT`는 graceful close를 시작합니다. 정상 close는 명시적 exit 0,
  deadline 초과는 활성 connection을 정리한 뒤 명시적 exit 1로 종료합니다.
- shutdown 진행 중 두 번째 signal은 deadline을 기다리지 않고 즉시 exit 1로
  강제 종료합니다.
- container는 non-root `node` 사용자로 실행합니다.
- production은 `PORT`, `K_SERVICE`, `K_REVISION`, `K_CONFIGURATION` 누락 시 HTTP
  listener 생성 전에 실패합니다.

공식 근거: <https://docs.cloud.google.com/run/docs/container-contract>

## 설정 경계

`loadRuntimeConfig`가 raw `process.env`를 typed immutable config로 바꿉니다.

- `COOKLOG_ENV`: `local`, `test`, `production`
- `PORT`: 정수 port. production 필수
- `HOST`: production은 `0.0.0.0`만 허용
- `SHUTDOWN_TIMEOUT_MS`: 1,000~9,000ms
- `COOKLOG_REMOTE_STT_ENABLED=true`: 모든 환경에서 startup 거부
- production의 `OPENAI_API_KEY`, `GOOGLE_APPLICATION_CREDENTIALS`,
  `COOKLOG_ALLOW_INSECURE_CONFIG`: foundation에서 startup 거부

금지 변수는 provider나 file credential을 production에 우발적으로 연결하는 것을 막는
현재 foundation 경계입니다. 실제 provider·service identity 설정은 별도 승인 Task에서
정의합니다.

## Health 계약

`GET /healthz`는 항상 다음 세 필드만 반환합니다.

```json
{"status":"ok","service":"cooklog-backend","contract_version":"health.v1"}
```

시간, hostname, revision, 환경변수, provider, secret, 사용자 콘텐츠와 상세 dependency
상태를 반환하지 않습니다. production은 이 route만 등록하며 local/test composition만
인증된 Mock AI create·status·ACK를 추가합니다. 원격 STT route는 등록하지 않고 local/test
HTTP 경계가 parser 전에 고정 `SERVICE_DISABLED`로 차단합니다.

## 종료 검증 경계

종료 정책은 같은 process의 `exitCode` 값만 확인하지 않습니다. 실제 child process를
실행해 정상 SIGTERM, 열린 idle keep-alive connection, 완료되지 않는 `app.close()`,
연속 signal을 검증합니다. 모든 시나리오는 실제 exit code와 signal 종료 여부를
assertion하고 9초 안에 끝나야 합니다.

## Cloud job storage·cleanup 계약

`T-20260810-002`는 기존 in-memory 구현을 `RecipeJobRepository` port 뒤로 분리하고,
Firestore·Cloud Tasks의 서울 리전 계약을 로컬 adapter로 검증합니다.

QA-HIGH-810002-001 재작업으로 datastore adapter는 선택적 durable file backing을
원자 임시 파일 교체 방식으로 저장합니다. 새 adapter와 실제 child process가 같은 backing을
다시 열어 job·content·idempotency·outbox·published marker·cleanup pending을 복구하며,
손상되거나 schema가 다른 상태 파일은 startup에서 fail closed합니다.

QA-HIGH-810002-002 재작업으로 durable repository의 모든 읽기·mutation은 backing별
cross-process transaction lock 안에서 최신 state를 다시 읽습니다. mutation 완료 뒤에만
원자 파일 교체를 수행하고 lock timeout·손상 state는 fail closed합니다. 따라서 먼저 열린
stale adapter끼리 경쟁해도 동일 create idempotency는 신규 job 1건과 replay 1건만 만들고,
동일 worker generation의 provider 소유권·ACK delete·cleanup·outbox marker는 단일 승자만
갖습니다.

- datastore와 task queue는 `asia-northeast3`만 허용합니다.
- job, content, create/ACK idempotency, worker·cleanup outbox는 같은 datastore 상태에서
  재구성되어 repository instance가 교체돼도 복구됩니다.
- queue payload에는 `jobId`, generation, cleanup 예정 시각만 포함하고 transcript,
  RecipeDraft, snapshot hash를 포함하지 않습니다.
- queue 장애 시 outbox는 남고 재발행은 task key로 중복 제거됩니다.
- ACK 성공은 content 삭제가 확인된 뒤에만 외부로 확정합니다.
- 생성 후 22시간부터 명시적 cleanup을 실행하고 15분 sweeper가 누락 task를 복구합니다.
- 22.5시간 warning, 23시간 critical·신규 job 차단, 23.5시간 incident를 content read 없이
  계산합니다.
- 23시간 45분에는 일반 queue retry를 끝내고 격리 삭제 경로로 전환합니다.
- 24시간에는 delete 성공 여부와 무관하게 결과 접근을 차단합니다. TTL은 최종 안전망일
  뿐 명시적 삭제 성공으로 간주하지 않습니다.
- 유효하지 않은 server time은 신규 job admission을 `SERVICE_DISABLED`로 닫습니다.

현재 durable backing은 process restart를 검증하기 위한 emulator/local fake입니다.
실제 Firestore·Cloud Tasks 리소스,
credential, provider 호출, network transport와 배포는 생성하거나 활성화하지 않습니다.

## 한계와 후속 소유권

- 공통 인증·rate limit·idempotency: `T-20260804-003`
- Mock AI job과 저장: `T-20260804-004`
- 원격 STT 비활성 resolver: `T-20260804-005`
- safe logging·비용·cleanup: `T-20260804-006`
- 전체 wiring·container·계약 보안 검증: `T-20260804-007` 구현·독립 QA·완료 리뷰 통과
- 실제 provider·cloud 배포: `T-20260729-003` 별도 승인
