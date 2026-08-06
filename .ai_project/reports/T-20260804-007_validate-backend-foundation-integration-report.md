# T-20260804-007 구현 보고서

## 결과

상태: `verification_ready` — 구현·새 clone·Node 24.18.0 container 자체 검증 완료

T-002~006에서 독립 구현한 runtime, 공통 HTTP·인증·제한·idempotency, Mock AI job,
원격 STT 비활성 경계, 비용·logging·cleanup을 하나의 local/test composition으로 연결했다.
실제 provider, cloud resource, credential, 배포와 원격 STT endpoint·upload는 추가하지 않았다.

## 구현 내용

- local/test server가 공통 HTTP, disabled remote STT boundary와 인증된 Mock AI
  create·status·ACK route를 조립한다.
- production server는 local token·Mock provider·in-memory repository 구성을 거부하고 기존
  고정 health route만 등록한다.
- mutation은 인증, project/installation rate limit, HTTP exact-response idempotency를 거친
  뒤 domain idempotency와 비용 admission으로 진입한다.
- programmatic worker는 승인 deployment ID의 content-free telemetry 예약이 성공한 뒤에만
  provider를 호출하며 raw metadata cleanup record를 함께 생성한다.
- `npm run verify` 한 명령으로 typecheck, 96개 runtime test, 공용 계약 validator 5종,
  cloud/provider/credential/STT 경계 감사를 수행한다.
- Node 24.18.0 build/runtime image, non-root user, lifecycle·통합 test, production
  `PORT`/`0.0.0.0`, health와 SIGTERM exit 0을 `npm run verify:container`로 검증한다.
- 같은 명령을 Pull Request마다 실행하는 `backend-verify`·`backend-container` CI를 추가했다.

## 자체 검증

| 검증 | 결과 |
|---|---|
| `npm run verify` | PASS |
| Backend runtime | 96/96 PASS |
| common·STT·AI·security·iOS shared fixture validator | 5종 PASS |
| Foundation 경계 감사 | PASS |
| HTTP health·create·status·ACK·exact replay | PASS |
| 인증·rate·KRW 50,000 비용 선차단 | PASS |
| 콘텐츠·secret telemetry canary | sink 0건 |
| 비정상 clock·production local adapter·remote STT | side effect 전 차단 PASS |
| 새 clone `npm ci && npm run verify` | PASS, 96/96·audit 0건 |
| PR #91 `backend-verify` | PASS |
| PR #91 `backend-container` | PASS, Node 24.18.0·non-root·lifecycle·health·SIGTERM |

검증 host는 Node.js 26.4.0/npm 11.17.0이다. 목표 Node.js 24.18.0은 `.nvmrc`, pinned
container와 GitHub Actions에서 별도로 강제한다.

## 재현 명령

```sh
cd apps/backend
npm ci
npm run verify
npm run verify:container
```

## 경계 감사

- 신규 production dependency: 0개, 기존 `fastify`만 유지
- 실제 provider·cloud·network·credential·secret·배포: 0개
- 원격 STT route·audio parser·upload·queue·provider·egress: 0개
- production local/mock adapter 활성화: 0개
- 변경 범위: Task `allowed_paths` 내부

## 남은 절차와 QA 인계

PR #91에서 Node 24.18.0 lockfile·container 검증을 통과했고 Task lock을 해제해
`verification_ready`로 전환했다. Backend QA Agent는 새 clone에서 위 재현 명령, 실제 HTTP
fixture 동등성, provider-at-most-once, exact idempotency replay, shutdown deadline, 비용
hard cutoff, telemetry canary, 콘텐츠/raw metadata cleanup과 원격 STT side effect 0건을
독립 검증한다. QA 통과 전에는 PR을 병합하거나 Task를 `done` 처리하지 않는다.
