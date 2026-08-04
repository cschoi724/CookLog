# Backend Runtime Foundation 결정

결정일: 2026-08-04
상태: T-20260804-002 구현 기준

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
상태를 반환하지 않습니다. 인증·AI·STT route는 T-002에서 만들지 않습니다.

## 한계와 후속 소유권

- 공통 인증·rate limit·idempotency: `T-20260804-003`
- Mock AI job과 저장: `T-20260804-004`
- 원격 STT 비활성 resolver: `T-20260804-005`
- safe logging·비용·cleanup: `T-20260804-006`
- 전체 wiring·container·계약 보안 검증: `T-20260804-007`
- 실제 provider·cloud 배포: `T-20260729-003` 별도 승인
