# T-20260810-006 Backend QA 독립 검증 보고서

검증일: 2026-08-11
검증자: Backend QA Agent / Verification Role
통합 기준: `develop@92de3f60b0d5a7219759601673d9641747a6c197`
검증 branch: `task/T-20260810-006-staging-composition-gate-a`
검증 worktree: `/private/tmp/cooklog-t20260810-006-staging-composition-gate-a`
판정: `FAIL`
상태 인계: `verification_in_progress -> rework_requested`

## 1. 검증 범위와 실행 경계

- Task의 `WP-C1~C5`, 구현 보고서, T-001~005 회귀를 기준으로 production composition,
  external adapter fail-closed, secret/identity 비노출, synthetic App Attest·token·restart/replay·
  provider at-most-once·ACK, service disable, manifest/workflow와 rollback 증거를 검증했다.
- worktree HEAD와 로컬 캐시 `origin/develop`은 요청된 전체 SHA `92de3f60...`와 일치한다.
  canonical 재조회용 fetch는 `.git/FETCH_HEAD` 쓰기 권한 오류로 ref 갱신 전에 종료됐다.
- Docker·Podman 실행 파일이 없어 `npm run verify:container`는 실행하지 못했다.
- Gate B workflow, cloud resource·secret·WIF/environment, image build/push, staging 배포·traffic,
  Google/Apple/provider endpoint는 호출하거나 변경하지 않았다.

## 2. 요약

| 검증 항목 | 결과 | 독립 근거 |
|---|---|---|
| 전체 Backend 회귀 | PASS | Node 26.4.0에서 172/172, 계약 validator 5/5, staging·boundary audit 통과 |
| Gate A targeted suite | PASS | 14/14 통과. synthetic restart/replay·provider 1회·ACK·STT 0 포함 |
| production composition entrypoint | FAIL | production 서버가 config/adapters 없이 health-only root를 생성해 `/readyz`와 AI job이 모두 404 |
| external adapter startup gate | FAIL | external 문자열 binding과 무관한 local facade 객체가 startup assertion을 통과 |
| manifest strict validation | FAIL | 외부 LB ingress, Gate A profile, `latest` secret version 변형을 모두 허용 |
| deploy·smoke·rollback 연결 | FAIL | template 미적용, zero-traffic candidate 비지정 smoke, 이전 상태·post-check 불완전 |
| Node 24 non-root container | NOT RUN | Docker·Podman 실행기 없음 |
| 외부 변경·제품 호출 | PASS | Gate B·workflow·cloud/provider/Apple/traffic 변경·호출 0건 |

## 3. 차단 결함

### QA-HIGH-006-001 — production 진입점이 staging composition을 조립하지 않음

`server.ts`의 production 분기는 `createProductionRuntime(config)`만 호출한다. 이 호출은
composition config와 adapter bundle이 모두 없으면 의도적으로 `serviceEnabled: false`인
health-only runtime을 반환한다. `loadProductionCompositionConfig()`는 server 진입점에서
호출되지 않으며 production adapter bundle을 만드는 factory도 없다.

독립 재현:

```text
createProductionRuntime(productionRuntimeConfig)
=> { serviceEnabled: false, /readyz: 404, POST /v1/ai/recipe-jobs: 404 }
```

따라서 service template에 `external-staging` 설정을 제공해도 애플리케이션 composition에는
연결되지 않는다. 이는 단일 production composition root와 private staging에서 핵심 AI job을
재현해야 하는 WP-C1 및 Task acceptance를 직접 위반한다.

필수 재작업:

1. production entrypoint가 typed config를 로드하고 서버 소유 factory로 adapter bundle을
   조립한 뒤 `createProductionRuntime()`에 함께 전달하게 한다.
2. external profile에서 config/driver/secret reference가 하나라도 없으면 health-only로 조용히
   낮추지 말고 listen 전에 fail closed한다.
3. 실제 entrypoint 수준에서 `/readyz`, 인증·AI job, remote STT 0을 검증한다.

### QA-HIGH-006-002 — external adapter gate를 local facade가 우회함

`assertProductionAdapterBundle()`은 caller가 제공한 `bindings` 문자열·boolean과 dependency의
`constructor.name`만 검사한다. 다음과 같이 모든 binding을 external로 표기하고 local
`CloudFacade` 한 객체를 모든 port에 넣은 bundle이 예외 없이 승인됐다.

```text
bindings: 9 roles, implementation=CloudFacade, mode=external,
          durable/distributed/externalEffects=true
dependencies: local CloudFacade instances
assertProductionAdapterBundle(...): ACCEPTED
```

TypeScript structural type과 class 이름은 runtime trust boundary가 아니다. external profile에서
Local/InMemory/Mock/Fixture/Synthetic 주입을 startup 전에 거부한다는 WP-C1/C2를 보장하지 못한다.

필수 재작업:

1. caller 선언 문자열이나 constructor 이름이 아닌 서버 소유 concrete factory/capability를
   composition root가 직접 구성·검증한다.
2. exact role-to-instance 연결, region, durability/distribution과 외부 effect policy를 위조할 수
   없는 런타임 계약으로 고정한다.
3. renamed subclass, facade/wrapper, plain object, 누락·중복 role 부정 테스트를 추가한다.

### QA-HIGH-006-003 — service template validator가 배포 보안 변형을 허용함

validator는 YAML을 구조적으로 파싱하지 않고 필수 정규식의 존재 여부만 검사한다. 독립
mutation에서 다음 세 변형이 모두 `ACCEPTED`였다.

```text
run.googleapis.com/ingress: internal-and-cloud-load-balancing
COOKLOG_DEPLOYMENT_PROFILE: gate-a-validation
provider secret item key: latest
```

첫 변형은 exact private ingress를 넓히고, 세 번째는 version-pinned secret을 mutable latest로
바꾼다. 이는 manifest의 private ingress·external profile·versioned secret fail-closed 조건과
WP-C3 negative mutation acceptance를 위반한다.

필수 재작업:

1. rendered manifest를 YAML 구조로 파싱해 exact key/schema/value와 중복·unknown field를
   검사한다.
2. ingress `internal`, profile `external-staging`, digest와 각 secret numeric version을 exact로
   고정한다.
3. prefix/suffix, duplicate key, latest/alias, profile·region·identity 변형을 추가한다.

### QA-HIGH-006-004 — deploy·candidate smoke·rollback 증거가 실제 실행 경로로 연결되지 않음

- deploy job의 `gcloud run deploy`는 checked-in service template을 적용하지 않고 image,
  ingress, concurrency, min instance, service account만 전달한다. production env와 세 secret
  mount/version이 배포 명령에 없다.
- candidate를 `--no-traffic`으로 만들지만 revision tag/URL을 얻지 않은 채 service base URL을
  smoke한다. 이 URL은 zero-traffic candidate가 아니라 기존 traffic revision을 검증할 수 있다.
- 이전 상태 기록은 runner 임시 파일의 revisions 목록뿐이며 image digest, configuration,
  secret versions를 기록·전달하지 않는다. smoke 실패 시 rollback step도 없다.
- `post-rollback`은 readiness의 remote STT 0만 검사하며 Task가 요구한 ACK/22h·24h cleanup,
  cost cutoff와 required sink를 재검증하지 않는다.

따라서 정적 contract와 `validateSyntheticRollbackEvidence()` boolean 단위 테스트가 통과해도
WP-C4의 실제 rollout/rollback/disable 순서를 증명하지 못한다.

필수 재작업:

1. validated/rendered manifest를 실제 deploy 명령과 단일 source로 연결한다.
2. 생성된 candidate revision을 식별하고 그 revision의 private URL을 smoke한 뒤에만 traffic
   전환을 허용한다.
3. 이전 revision·image·configuration·secret version의 content-free rollback state를 실제
   job 간 전달하고, 실패 handler에서 이전 healthy revision 100% 복구를 보장한다.
4. rollback 후 remote STT 0뿐 아니라 인증, provider at-most-once, ACK/cleanup, cost cutoff와
   required sink fail-closed post-check를 실행한다.

## 4. 통과 항목

- 표준 suite의 gate/request/error mapping/strict schema/provider at-most-once 회귀는 통과했다.
- synthetic durable job restart/replay 후 provider 호출은 1회였고 ACK 삭제·remote STT 0이
  유지됐다.
- 9-role 누락·중복의 기본 검사, deterministic content-free Cloud Tasks name, signing rotation
  replay/conflict와 durable JTI revocation 단위 경계는 통과했다.
- inline credential·`GOOGLE_APPLICATION_CREDENTIALS`·secret reference ambiguity를 거부하고
  safe summary/readiness에 identity·resource·mount path를 노출하지 않았다.
- cleanup age, required sink, cost/Billing freshness, auth/durable repository, remote STT 위반은
  합성 service-control 함수에서 각각 새 job을 차단했다.

## 5. 수행 검증

```text
npm run verify: PASS
- TypeScript typecheck/build: PASS
- Node runtime tests: 172/172 PASS
- common/STT/AI/security/shared contracts: 5/5 PASS
- staging manifest validator 및 boundary audit: PASS

npm run verify:staging: 14/14 PASS
git diff --check: PASS
sh -n scripts/staging-control.sh: PASS
node --check staging validator/audit: PASS
aiops validate task ... --strict: PASS

독립 adversarial probe:
- production root /readyz 404, AI job 404: REPRODUCED
- spoofed external local facade bundle: ACCEPTED (결함)
- non-internal ingress mutation: ACCEPTED (결함)
- gate-a-validation service profile mutation: ACCEPTED (결함)
- latest secret version mutation: ACCEPTED (결함)

Docker/Podman: NOT AVAILABLE
npm run verify:container: NOT RUN
실제 Gate B/workflow/cloud/provider/Apple/traffic 호출·변경: 0
```

## 6. 잔여 위험

- 차단 결함을 해소한 뒤에도 Node 24.18.0 non-root container 검증이 필요하다. 현재 실행은
  Node 26.4.0 / macOS arm64뿐이다.
- 실제 Firestore/Tasks/App Attest/KMS/Billing/required sink/provider handshake와 external
  deploy·rollback은 Gate B 전까지 미검증으로 유지해야 한다.
- ZDR·Modified Retention·국외 처리·credential 승인이 없으므로 실제 provider/Apple/cloud
  호출을 활성화할 수 없다.

## 7. 최종 판정과 인계

기존 domain 회귀와 합성 의미론은 통과했지만 production entrypoint가 composition을 조립하지
않고, external adapter와 manifest gate가 우회되며, candidate smoke/rollback이 실제 revision과
연결되지 않는다. 이는 Gate B 환경 부재로 남기는 단순 위험이 아니라 Gate A repository
산출물 자체의 수용 기준 위반이다. 최종 판정은 `FAIL`이다.

다음 Agent에게 전달할 말:

너는 Development Lead Agent / Lead Role이야.
Task T-20260810-006 Gate A의 재작업 범위를 조율해줘.

- 현재 상태: `rework_requested`
- 기준 상태 ref/SHA: `origin/develop@92de3f60b0d5a7219759601673d9641747a6c197`
- 검증 판정: `FAIL`
- 다음에 해야 할 일: `QA-HIGH-006-001~004`를 production entrypoint composition, 위조 불가
  external adapter factory, parsed exact manifest, revision-specific smoke·rollback/post-check의
  repository-only 재작업으로 묶고 사용자 승인 후 Execution Role에 재인계해줘.
- 참고 산출물: 구현 보고서와 이 QA 보고서
- 남은 위험: Node 24 non-root container, 실제 distributed/cloud/Apple/provider와 Gate B 배포
- 주의: Gate B, workflow 실행, cloud/secret/WIF/environment, image push, traffic 변경과 실제
  provider·Apple 호출은 계속 금지하고 외부 변경·호출 0을 유지해줘.
