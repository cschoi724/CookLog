# T-20260804-005 Backend QA 독립 검증 보고서

검증일: 2026-08-05, 재검증 2026-08-05
검증자: Backend QA Agent / Verification Role
검증 기준: 최초 `4fc49a3`, 재작업 `ba1cda8`
기준 develop: `origin/develop` `97f434d`
최종 판정: `PASS_WITH_RISK`
최종 상태 인계: `verification_ready -> verification_in_progress -> verification_passed`

## 1. 결론

disabled fixture·resolver·activation gate와 독립 HTTP plugin은 자체 계약을 지키며,
공식 65개 테스트와 공용 계약 validator도 통과했다. 실제 STT route·upload parser·provider
SDK·audio storage·queue·network 호출이 추가되지 않은 것도 확인했다.

그러나 원격 STT 환경 validator가 실제 startup 경계에 연결되지 않았다. production
startup이 `COOKLOG_REMOTE_STT_MODE=enabled`, provider·endpoint·credential·egress·fallback
설정과 알 수 없는 원격 STT 설정을 수용한다. Task 성공 기준인 무승인 config의 startup
또는 deployment fail-closed를 만족하지 못하므로 `QA-HIGH-005-001`로 차단한다.

## 2. 검증 결과

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| lockfile 설치·의존성 감사 | PASS_WITH_RISK | `npm ci --ignore-scripts`, `npm audit --omit=dev --audit-level=high` 0건. Host Node 26으로 목표 Node 24 engine 경고가 있다. |
| T-005 전용 테스트 | PASS | 10/10 통과. |
| Backend 전체 runtime | PASS | health·auth·HTTP·AI·jobs·STT 65/65 통과. |
| 공용 계약 validator | PASS | common·STT·AI·security·shared fixture 전부 통과. |
| disabled release fixture·resolver | PASS | 승인 fixture와 동등하며 transcribe 입력 surface 없이 모든 effect가 0이다. |
| 독립 HTTP 선차단 plugin | PASS | 대상 path가 body parser 전 503 `SERVICE_DISABLED`, 계측 body read 0이다. |
| 실제 runtime 원격 STT route | PASS_WITH_RISK | 현재 `buildApp`에는 route가 없어 404이며 composition은 T-007 범위다. |
| provider·upload·storage·queue·network 부재 | PASS | 신규 source·dependency·composition에서 관련 실행 경로를 발견하지 못했다. |
| 무승인 config startup fail-closed | FAIL | production `loadRuntimeConfig()`가 활성화·연결·unknown 설정 9종을 모두 수용한다. |

## 3. 차단 결함

### QA-HIGH-005-001 — 원격 STT validator가 실제 startup/deployment 경계에서 실행되지 않음

`validateRemoteSTTEnvironment()`는 직접 호출하면 설정 mutation을 거부한다. 하지만 실제
server startup은 `loadRuntimeConfig()`만 호출하고, 이 함수는 정확히
`COOKLOG_REMOTE_STT_ENABLED === "true"`인 한 경우만 검사한다. 새 validator 또는 disabled
resolver를 `runtime-config.ts`, `build-app.ts`, `server.ts` 어디에서도 호출하지 않는다.

독립 production startup 반례에서 다음 9개 설정이 예외 없이 수용됐다.

```text
COOKLOG_REMOTE_STT_MODE
COOKLOG_REMOTE_STT_UPLOAD_ROUTE_REGISTERED
COOKLOG_REMOTE_STT_PROVIDER_CONFIGURED
COOKLOG_REMOTE_STT_AUDIO_EGRESS_ALLOWED
COOKLOG_REMOTE_STT_AUTOMATIC_FALLBACK
COOKLOG_REMOTE_STT_ACTIVATION_REQUIRES_NEW_APPROVAL
COOKLOG_REMOTE_STT_ENDPOINT
COOKLOG_REMOTE_STT_API_KEY
COOKLOG_REMOTE_STT_UNAPPROVED_FLAG
```

공식 테스트의 `every activation mutation fails closed before startup`은 startup 함수를 호출하지
않고 validator를 직접 호출하므로 이 연결 누락을 검출하지 못한다. 현재 `allowed_paths`에는
기존 startup 구성 파일도 포함되지 않아 Development Lead의 재작업 경로 조율이 필요하다.

필수 재작업:

1. 실제 startup 또는 필수 deployment validation에서 `validateRemoteSTTEnvironment()`를
   반드시 실행하고 실패 시 listener 생성 전에 종료한다.
2. 위 9개 반례와 기존 `COOKLOG_REMOTE_STT_ENABLED=true`를 production·local·test startup
   진입점에 통과시켜 모두 fail closed함을 검증한다.
3. validator 직접 호출만으로 startup을 주장하지 않도록 integration test를 실제
   `loadRuntimeConfig()` 또는 server process 경계에 연결한다.
4. 이를 위해 필요한 기존 config/composition 경로를 Task `allowed_paths`에 명시적으로
   추가 승인한다. T-007 composition 범위와의 소유권 충돌도 Lead가 정리한다.

## 4. 수행 명령과 증거

```text
npm ci --ignore-scripts: PASS, audit 0건, Node 26 engine warning
npm run build: PASS
node --test dist/tests/...: PASS, 65/65
node --test dist/tests/stt/*.test.js: PASS, 10/10
common·STT·AI·security validator: PASS
iOS·Backend shared fixture validator: PASS
/private/tmp/t005-adversarial-startup.mjs: FAIL, startup mutation 9종 수용 재현
```

## 5. 인계

최종 판정은 `FAIL`이다. Task를 `rework_requested`로 전환하고 Development Lead Agent /
Lead Role에 재작업 범위 조율을 인계한다. Quality Team은 구현을 수정하거나 Task를 `done`
처리하지 않는다. `T-20260804-006~007`은 T-005 재검증 통과 전 선행 완료로 간주하지 않는다.

## 6. 재작업 승인

2026-08-05 Development Lead Agent가 `QA-HIGH-005-001`을 실제 `loadRuntimeConfig()`
startup 연결과 local·test·production 설정 반례 검증으로 범위화했습니다. Product Owner가
재작업을 승인했으며, 허용 경로에 `apps/backend/src/config/runtime-config.ts`를 추가해
Backend Agent에 재인계합니다. 기존 `FAIL` 판정은 독립 재검증 전까지 이력으로 유지하고
`T-20260804-006~007` 차단도 유지합니다.

## 7. 독립 재검증 결론

`QA-HIGH-005-001`은 해소됐다. `loadRuntimeConfig()`가 모든 runtime 환경에서
`validateRemoteSTTEnvironment()`를 실행하며, 최초 QA의 9개 mutation과 기존 enabled
flag를 local·test·production에 각각 주입한 30개 반례가 모두 listener 생성 전에
fail closed한다. 최초 독립 스크립트도 이제 통과하고, 실제 server child process는 mode,
endpoint, unknown 설정에서 exit 1로 종료한다.

T-005 11/11, Backend 전체 66/66과 common·STT·AI·security·shared fixture validator가
모두 통과했다. 재작업에는 실제 STT endpoint·upload parser·provider SDK·audio storage·
queue·network 호출이 추가되지 않았다. 신규 HIGH·MEDIUM 결함은 없다.

## 8. 재검증 결과

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| `QA-HIGH-005-001` | PASS | 실제 `loadRuntimeConfig()`에서 활성화·연결·unknown 설정을 거부한다. |
| 환경별 startup mutation | PASS | 10종 × local·test·production = 30/30 거부. |
| 최초 독립 반례 | PASS | `/private/tmp/t005-adversarial-startup.mjs` exit 0. |
| 실제 server process | PASS | mode·endpoint·unknown 설정 3종 모두 listener 전 exit 1. |
| T-005 전용·전체 runtime | PASS | 11/11, 66/66 통과. |
| 공용 계약 validator | PASS | common·STT·AI·security·shared fixture 전부 통과. |
| 금지 실행 경로 정적 감사 | PASS | provider·upload·storage·queue·network 신규 경로 0개. |
| 목표 Node 24·전체 composition | DEFERRED | Host는 Node 26이며 Node 24/container와 HTTP plugin wiring은 T-007 범위다. |

## 9. 재검증 수행 증거

```text
npm ci --ignore-scripts: PASS, audit 0건, Node 26 engine warning
npm run build: PASS
node --test 전체 runtime: PASS, 66/66
node --test T-005: PASS, 11/11
startup mutation: PASS, 30/30 fail closed
최초 adversarial startup script: PASS
실제 server process mode·endpoint·unknown: PASS, 모두 exit 1
common·STT·AI·security·shared fixture validator: PASS
금지 provider·upload·network 정적 scan: PASS
aiops strict·git diff check: PASS
```

## 10. 최종 인계

최종 판정은 `PASS_WITH_RISK`다. Task를 `verification_passed`로 전환하고 Development
Lead Agent / Lead Role에 완료 검토를 인계한다. Quality Team은 직접 `done` 처리하거나
병합하지 않는다. 목표 Node 24/container와 독립 HTTP boundary의 공유 app composition은
승인된 T-007 필수 통합 검증에서 확인해야 한다.
