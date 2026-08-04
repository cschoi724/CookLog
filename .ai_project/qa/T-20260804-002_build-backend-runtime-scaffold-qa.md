# T-20260804-002 Backend QA 독립 검증 보고서

검증일: 2026-08-04
검증자: Backend QA Agent / Verification Role
검증 기준: `task/T-20260804-002-build-backend-runtime-scaffold` `2f7357e`
기준 develop: `origin/develop` `a1fa8d0`
현재 판정: `FAIL`
현재 상태 인계: `verification_in_progress -> rework_requested`

## 1. 검증 범위

- Node.js·TypeScript·Fastify·npm lockfile 재현성
- typed runtime config와 production fail-closed
- 실제 local server와 고정 `GET /healthz` 응답
- AI·원격 STT route 부재
- 정상·deadline 초과 graceful shutdown
- Dockerfile build/runtime 경계와 non-root 실행 선언
- secret·사용자 콘텐츠 비노출
- 기존 common·STT·AI·security·공용 fixture 계약 무회귀
- Task allowed paths와 최신 `origin/develop` 정렬

## 2. 요약

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| `npm ci` 재현 | PASS_WITH_RISK | lockfile 설치 성공. 검증 host는 Node 26이라 Node 24 engine 경고가 있었고 실제 Node 24 실행은 container 후속 검증이 필요하다. |
| typecheck·build·test | PASS | sandbox 밖에서 `npm run check`와 10/10 테스트가 통과했다. |
| production config | PASS | 필수 `PORT`, Cloud Run identity 누락과 provider/file credential 설정이 listener 전에 exit 1로 거부된다. |
| health 계약 | PASS | 실제 `GET /healthz`가 세 필드 고정 응답을 반환하고 환경·secret·콘텐츠를 포함하지 않는다. |
| 금지 route 부재 | PASS | 원격 STT POST와 AI GET이 404이며 요청 콘텐츠를 응답에 반사하지 않는다. |
| 정상 SIGTERM | PASS | 실제 server가 SIGTERM 후 exit 0으로 종료됐다. |
| shutdown deadline | FAIL | `app.close()`가 멈추면 deadline 뒤에도 listener와 프로세스가 계속 살아 있다. |
| dependency audit | PASS | production dependency audit 취약점 0건이다. |
| secret 비노출 | PASS | source·health·startup 오류에서 실제 key/token/JWT/raw audio를 발견하지 못했다. |
| 기존 계약 validator | PASS | common·STT·AI·security·공용 fixture validator가 모두 통과했다. |
| Docker build/run | NOT_RUN | 현재 환경에 Docker CLI가 없어 실제 Node 24 image와 non-root runtime을 재현하지 못했다. |

최초 sandbox 실행의 lifecycle 테스트 `listen EPERM`과 npm audit DNS 실패는 환경 제한이었다.
동일 명령을 승인된 실행 환경에서 재실행해 10/10 및 audit 0건을 확인했으므로 제품 결함으로
분류하지 않는다.

## 3. 차단 결함

### QA-HIGH-002-001 — shutdown deadline이 프로세스 종료를 강제하지 못함

`closeWithDeadline`은 `app.close()`와 timeout Promise를 경쟁시키고 deadline에서 오류를
반환한다. 그러나 `startServer`의 signal handler는 catch에서 `process.exitCode = 1`만
설정한다. exit code 설정은 활성 server handle을 닫거나 프로세스를 종료하지 않는다.

독립 장애 반례:

1. 실제 Fastify server를 `127.0.0.1` 임시 port에서 시작한다.
2. `app.close()`를 완료되지 않는 Promise로 대체해 shutdown hang을 모사한다.
3. 프로세스 자신에게 SIGTERM을 보낸다.
4. 1초 deadline 뒤 상태를 확인한다.

결과:

```text
after_deadline_listening=true,exitCode=1
```

프로세스는 계속 실행됐고 후속 SIGINT도 `shutdownStarted` guard에서 즉시 반환해 종료되지
않았다. 테스트 프로세스는 별도로 SIGKILL해 정리했다. 이는 ADR의 “SIGTERM 후 최대 9초
안에 종료”와 Task의 graceful shutdown 성공 기준을 만족하지 못한다. Cloud Run에서는
10초 경계의 플랫폼 SIGKILL에 의존하며 in-flight 정리 실패를 앱이 통제하지 못한다.

현재 `server-lifecycle.test.ts`는 정상 `app.close()`만 검증해 이 반례를 탐지하지 않는다.

필수 재작업:

1. deadline 초과 시 활성 listener·socket을 강제 종료하거나 명시적인 프로세스 종료
   경계를 실행해 설정 시간 안에 반드시 종료되도록 한다.
2. 정상 종료는 exit 0, deadline 초과는 exit 1이며 두 경우 모두 process가 실제 종료됨을
   검증한다.
3. 두 번째 SIGTERM/SIGINT가 이미 시작된 shutdown을 무시해 무기한 생존시키지 않도록
   강제 종료 정책을 정의한다.
4. `app.close()` hang, 열린 keep-alive connection, 연속 signal을 포함한 lifecycle
   테스트를 추가한다.
5. 테스트가 실제 process 종료 시각과 9초 상한을 검증하도록 한다.

## 4. 통과 상세

### 실행·health·route

- `npm ci --ignore-scripts`, typecheck와 build가 성공했다.
- 승인된 로컬 listen 환경에서 테스트 10개가 모두 통과했다.
- 실제 local server는 HTTP 200과 정확한 `health.v1` JSON을 반환했다.
- `/v1/stt/transcriptions`, `/v1/ai/recipe-jobs/test`는 404이며 실제 provider·cloud
  resource 호출 코드는 없다.

### 설정·보안

- production 필수 설정 누락과 `OPENAI_API_KEY` 설정은 실제 entrypoint에서 body를
  listen하기 전에 exit 1로 실패했다.
- 오류에는 변수 이름만 있고 합성 secret 값은 노출되지 않았다.
- production host는 `0.0.0.0`, runtime port 범위와 shutdown timeout 1~9초가 고정된다.
- `COOKLOG_REMOTE_STT_ENABLED=true`는 모든 환경에서 거부된다.

### Container 정적 검토

- Node `24.18.0-bookworm-slim` build/runtime multi-stage 구조다.
- runtime에는 production dependency와 `dist/src`만 복사한다.
- runtime은 `USER node`를 사용하며 cloud 배포·registry push는 포함하지 않는다.
- Docker CLI가 없어 image build·health·SIGTERM·non-root 확인은 후속 검증 위험으로 남긴다.

## 5. 수행 검증

```text
origin/develop...HEAD: 0 behind / 2 ahead (QA 기록 전)
npm ci --ignore-scripts: PASS, Node 26 host engine warning
npm run typecheck: PASS
npm run build: PASS
npm run check: PASS, 10/10
npm audit --omit=dev --audit-level=high: PASS, 0 vulnerabilities
실제 GET /healthz: PASS
실제 STT·AI route 부재: PASS
실제 정상 SIGTERM: PASS, exit 0
shutdown hang 반례: FAIL, deadline 뒤 listening=true·process 생존
production 필수·금지 config entrypoint: PASS, exit 1·secret 값 비노출
common·STT·AI·security validator: PASS
iOS·Backend 공용 fixture validator: PASS
aiops validate task --strict: PASS
git diff --check: PASS
Docker build/run: NOT_RUN, Docker CLI 없음
```

## 6. 잔여 위험과 최종 판정

- 목표 Node 24·npm 11의 실제 container build/run은 Docker 가능한 환경에서 확인해야 한다.
- Docker image non-root UID, health 응답과 SIGTERM 전달은 container 검증이 필요하다.
- 공통 middleware·Mock AI·STT resolver·safe logging·cleanup은 T-003~006 범위다.

설치·빌드·정상 실행·config·health·route 부재·secret 비노출은 통과했다. 그러나 shutdown
deadline이 실제 종료 상한을 보장하지 못해 Cloud Run lifecycle 핵심 성공 기준을 충족하지
못한다. 최종 판정은 `FAIL`이다. Task를 `rework_requested`로 전환하고 Development Lead
Agent / Lead Role에 재작업 범위 조율을 인계한다.
