# CookLog Backend

CookLog Backend의 local/mock foundation입니다. production 공개 route는 `GET /healthz`만
활성화하며, local/test runtime은 인증·제한·idempotency·비용·redaction·cleanup이
연결된 Mock AI create/status/ACK 경로를 제공합니다. 실제 AI provider, 원격 STT와 cloud
resource는 연결하지 않습니다.

## 요구 버전

- Node.js `24.18.0` LTS
- npm `11.x`

## 새 clone 실행

```sh
cd apps/backend
npm ci
npm run verify
npm run dev
```

다른 터미널에서 확인합니다.

```sh
curl --fail --silent http://127.0.0.1:8080/healthz
```

고정 응답:

```json
{"status":"ok","service":"cooklog-backend","contract_version":"health.v1"}
```

`.env.example`은 변수 이름 예시이며 자동 로딩하지 않습니다. 필요한 값은 shell 또는
실행 환경에서 명시적으로 주입합니다. 실제 secret과 사용자 콘텐츠를 `.env`나 저장소에
추가하지 않습니다.

## Container 확인

```sh
npm run verify:container
```

이 명령은 Node.js 24.18.0 build stage에서 lifecycle·통합 테스트를 실행하고 runtime
image의 non-root user, production `PORT`/`0.0.0.0`, health와 SIGTERM exit 0을 확인합니다.
Cloud Run 배포나 registry push는 이 Task의 범위가 아닙니다.

## 검증 명령

```sh
npm run verify
```

`verify`는 typecheck, 전체 runtime test, common·STT·AI·security·iOS shared fixture
validator와 cloud/provider/credential 경계 감사를 순서대로 실행합니다.
