# CookLog Backend

CookLog Backend의 local/mock foundation입니다. 현재 공개 route는 `GET /healthz` 하나이며,
실제 AI provider, 인증, 원격 STT와 cloud resource는 연결하지 않습니다.

## 요구 버전

- Node.js `24.x` LTS
- npm `11.x`

## 새 clone 실행

```sh
cd apps/backend
npm ci
npm run check
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
docker build -t cooklog-backend:local .
docker run --rm -p 8080:8080 \
  -e PORT=8080 \
  -e K_SERVICE=cooklog-local \
  -e K_REVISION=cooklog-local-00001 \
  -e K_CONFIGURATION=cooklog-local \
  cooklog-backend:local
```

Cloud Run 배포나 registry push는 이 Task의 범위가 아닙니다.

## 검증 명령

```sh
npm run typecheck
npm test
npm run check
```

기존 JSON 계약 검증은 저장소 루트에서 별도로 실행합니다.

```sh
sh apps/backend/tests/contracts/validate-shared-fixtures.sh
```
