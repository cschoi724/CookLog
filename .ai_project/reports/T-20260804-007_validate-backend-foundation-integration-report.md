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

## Backend QA 독립 검증 결과

2026-08-06 Backend QA는 전체 96/96, 공용 계약 validator 5종, 경계 감사와 PR #91의
Node 24.18/non-root container CI 성공을 독립 확인했다. 다만 provider 성공 commit 뒤
terminal telemetry sink 장애가 발생해도 `completed`를 반환하고 status API가
`succeeded`·`available` 결과를 공개하는 `QA-HIGH-007-001`을 확인했다.

최종 판정은 `FAIL`, 상태는 `rework_requested`다. Development Lead가 terminal telemetry와
성공 결과 commit의 fail-closed 재작업 범위를 확정한 뒤 Backend Agent 자체 검증과 Backend
QA 독립 재검증이 필요하다. QA는 구현 수정·병합·`done` 처리를 수행하지 않았다.

## QA-HIGH-007-001 재작업

- provider 성공·실패 terminal을 즉시 공개하지 않고 repository의 `processing/none` 상태에
  비공개 staging한다.
- terminal telemetry의 allowlist shape 검증, 비용 reservation과 sink write가 성공한
  경우에만 staged terminal을 최종 상태로 전환한다.
- terminal audit 실패는 `telemetry_unavailable`을 반환하고 status API에는 result를
  `null`로 유지한다.
- 재실행은 staged terminal audit만 다시 수행해 provider를 재호출하지 않는다.
- timeout failure는 staged provider terminal을 덮어쓰지 못하므로 기존 결과의 감사 전
  비노출과 provider-at-most-once가 함께 유지된다.

### 재작업 자체 검증

| 검증 | 결과 |
|---|---|
| QA 원본 `/private/tmp/t007-observability-adversarial.mjs` | PASS, `processing/none`, provider 1회 |
| terminal sink 두 번째 write 실패 | PASS, 비노출 후 재실행 복구 |
| terminal reservation 거절 | PASS, 비노출 후 재실행 복구 |
| terminal event invalid shape | PASS, 비노출 후 재실행 복구 |
| 각 장애 전후 provider-at-most-once | PASS, 모두 1회 |
| `npm run verify` | PASS, Backend 100/100·계약 5종·경계 감사 |
| PR #91 재작업 `backend-verify` | PASS, 100/100·계약 5종·경계 감사 |
| PR #91 재작업 `backend-container` | PASS, Node 24.18.0·non-root·lifecycle·통합 경로 |

재작업 commit `056d193`의 PR CI까지 통과했다. Task lock을 해제하고
`verification_ready`로 Backend QA Agent에 원본 반례와 전체 독립 재검증을 인계한다.
QA 통과 전에는 PR을 병합하거나 Task를 `done` 처리하지 않는다.

## Backend QA 재검증 결과

2026-08-06 Backend QA는 재작업 커밋 `056d193`을 독립 재검증했다. 원본 sink 장애 반례는
`telemetry_unavailable`·`processing`·`result_state=none`으로 fail closed 되었고 provider는
1회만 호출됐다. sink·reservation·event shape 장애 모두 비공개 staging 후 재실행 복구가
확인됐다. 전체 runtime 100/100, 계약 validator 5종, 경계 감사 및 PR #91 Node 24.18
non-root container CI도 통과했다.

`QA-HIGH-007-001` 해소를 확인해 최종 판정 `PASS_WITH_RISK`, 상태
`verification_passed`로 Development Lead Agent 완료 검토에 인계한다. QA는 병합 및
`done` 처리를 수행하지 않았다.

## Development Lead 완료 리뷰

Development Lead는 원본 HIGH 해소, terminal 장애 3종 복구와 Provider at-most-once,
전체 100/100·계약 validator 5종·경계 감사, Node 24.18.0 non-root container CI를 확인해
`PASS_WITH_RISK`로 수용했다. 잔여 위험은 실제 Provider·Cloud·배포가 승인 범위 밖이라
미구현인 점과 로컬 호스트가 Node 26인 점이며, 목표 Node 24는 CI container로 검증됐다.

Product Owner가 완료 확정과 PR #91 squash merge를 승인했다. Task를 `done`으로 전환하되
실제 Provider·Cloud·credential·배포·원격 STT 활성화는 별도 승인 전까지 금지한다.
