# T-20260804-005 구현 보고서

## 결과

상태: `verification_ready`

## 재작업 결과

`QA-HIGH-005-001`에서 validator가 실제 startup 진입점에 연결되지 않은 결함을 확인했다.
승인된 재작업으로 `loadRuntimeConfig()`가 `validateRemoteSTTEnvironment()`를 반드시
실행하도록 연결했다. QA가 재현한 설정 9종과 기존 `COOKLOG_REMOTE_STT_ENABLED=true`를
local·test·production 설정에 각각 입력하는 총 30개 진입점 반례가 모두 listener 생성 전
실패한다. 기존 enabled 오류의 공개되지 않는 내부 message 호환성도 유지했다.

첫 공개 출시에서 원격 STT를 활성화할 수 없는 실행 경계를 구현했다. 승인된 release
fixture를 runtime 상수로 고정하고, mode·upload route·provider·credential·audio egress·
자동 fallback과 승인 우회 설정을 fail closed한다. 실제 endpoint, upload parser, Mock·
실제 provider, audio storage, queue와 network 호출은 추가하지 않았다.

## 구현 내용

- `remote-stt-config.ts`
  - 승인 fixture와 동일한 immutable `first_public_release` disabled config
  - 활성화 boolean, provider, endpoint, credential, egress destination 설정 거부
  - 알려지지 않은 `COOKLOG_REMOTE_STT_*`·`REMOTE_STT_*` 설정도 승인되지 않은
    mutation으로 거부
- `activation-gate.ts`, `disabled-resolver.ts`
  - `transcribe`나 audio stream 입력 surface가 없는 disabled 전용 resolver
  - direct upload와 local STT failure fallback 모두 body read 전 `SERVICE_DISABLED`
  - route, body read, temporary object, queue, provider, egress effect를 모두 0으로 고정
- `disabled-http-boundary.ts`
  - STT route를 등록하지 않고 `/v1/stt` 경로군을 Fastify `onRequest`에서 선차단
  - content type parser보다 먼저 RFC 9457 `SERVICE_DISABLED` 응답

## 반례와 검증

| 검증 | 결과 |
|---|---|
| 승인 disabled release fixture runtime 동등성 | PASS |
| mode·enabled·route·provider·egress·fallback mutation | local·test·production `loadRuntimeConfig()`에서 모두 거부 |
| provider·endpoint·credential·egress destination 주입 | 모두 fail closed |
| 알 수 없는 remote STT 승인 revision 주입 | fail closed |
| direct upload·local failure 자동 fallback | `SERVICE_DISABLED`, 모든 effect 0 |
| 변조된 release config를 gate에 직접 전달 | fail closed |
| runtime endpoint 목록 | 원격 STT route 0개 |
| HTTP audio parser 계측 | 0 byte, 응답 503 `SERVICE_DISABLED` |
| shared iOS/Backend disabled fixture | remote request·body read·egress 모두 0 |

실행 결과:

- `npm run typecheck`: PASS
- T-005 전용: 11/11 PASS
- startup 진입점 직접 반례: 10종 × 3환경 = 30/30 PASS
- Backend 전체 runtime: 66/66 PASS
- 저장소 표준 `npm test`: health/lifecycle 15/15 PASS
- common·STT·AI·security contract validator: PASS
- iOS/Backend shared fixture validator: PASS
- `aiops validate task ... --strict`: PASS
- `git diff --check`: PASS

샌드박스 실행에서는 localhost bind가 `EPERM`으로 차단돼 기존 lifecycle 6개가 실행되지
않았다. 동일 전체 명령을 네트워크 권한이 허용된 환경에서 재실행해 66/66 통과를
확인했다. 검증 환경은 Node.js 26.4.0/npm 11.17.0이며 프로젝트 기준 Node.js 24 LTS의
container 실검증은 T-007에 남긴다.

## 경계 감사

- 실제 STT endpoint·upload parser·provider SDK·audio storage·queue: 0개
- provider/network 호출·credential·secret 추가: 0개
- `package.json`, lockfile, composition root 변경: 0개
- 변경 파일: Task `allowed_paths` 내부만 사용
- 루트 dirty worktree: 변경하지 않음

## 잔여 위험과 QA 인계

- 비활성 HTTP 경계는 독립 plugin으로 제공하며 공유 `buildApp` wiring은 Task 지시대로
  T-007 composition 소유로 남긴다. Backend QA는 plugin 자체의 body parser 선차단과
  현재 app의 route 0개를 각각 검증해야 한다.
- Node.js 24 LTS, Docker/Cloud Run 호환과 전체 composition은 T-007에서 검증해야 한다.
- 실제 원격 STT 제품 승인, provider, upload, 임시 저장·최대 1시간 삭제 SLA와 iOS 원격
  선택은 이번 범위가 아니며 별도 승인 없이는 구현할 수 없다.

Backend QA Agent / Verification Role에 독립 검증을 인계한다.
