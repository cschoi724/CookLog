# T-20260804-004 실행 보고서

작성일: 2026-08-05
작성자: Backend Agent
상태: Product Owner 최종 승인·PR #79 squash merge `a73a028`·done 확정

## 결과

실제 provider와 network 없이 AI recipe job 계약을 실행 검증할 수 있는 local/mock 경계를
구현했다. composition root와 production cloud·queue·datastore는 변경하지 않았다.

- `RecipeAIProvider` interface와 결과를 고정하거나 함수로 주입하는 deterministic Mock을
  추가했다.
- create request의 strict field, UUID, 연속 order, 중복 STEP, RFC 3339, locale와 canonical
  snapshot SHA-256을 provider 호출 전에 검증한다.
- RecipeDraft의 strict shape, evidence ID, 연속 order, inferred review flag와 근거 없는
  temperature 안전값을 검증하고 invalid output을 `failed/OUTPUT_INVALID`로 폐기한다.
- in-memory transaction에서 job, content, create idempotency, 콘텐츠 없는 worker outbox와
  +22시간 cleanup task를 함께 생성한다.
- duplicate worker CAS, crash-before-provider 복구와 logical job당 provider attempt 최대 1회를
  구현했다. provider 시작 후 late result는 terminal state CAS에 실패해 저장되지 않는다.
- queue/provider/worker timeout decision table, provider 5xx 단일 실패와 사용자 수동 새 key
  재실행 경계를 구현했다.
- GET ownership을 존재하지 않는 job과 같은 404로 정규화하고, +24시간에는 content read 전에
  expired 전환·삭제해 draft를 반환하지 않는다.
- ACK result version CAS, wrong/stale version 거부, 동시 삭제 1회, replay와 delete failure의
  외부 성공 미확정을 구현했다.
- 인증 pre-handler를 재사용하는 create·status·ACK Fastify route installer를 추가했다.

## 보안·개인정보 경계

- 새 코드에 `fetch`, HTTP client, provider credential, API key, logger와 console 사용이 없다.
- provider exception과 invalid raw output은 공개 응답에 포함하지 않는다.
- 다른 installation의 job ID는 `RESOURCE_NOT_FOUND`로 정규화한다.
- worker outbox에는 `job_id`와 execution generation만 있고 STEP·transcript·draft가 없다.
- ACK·terminal failure·expiry에서 content를 삭제하며 expiry GET은 content read count가
  증가하지 않음을 검증했다.

## 자체 검증

| 검증 | 결과 |
|---|---|
| `npm ci --ignore-scripts` | PASS, audit 취약점 0건, Host Node 26 engine 경고 |
| `npm run check` | PASS, 기존 health/lifecycle 15/15 |
| `node --test dist/tests/ai/*.test.js dist/tests/jobs/*.test.js` | PASS, T-004 16/16 |
| T-003 HTTP/auth + T-004 전체 | PASS, 40/40 |
| 전체 runtime 합계 | PASS, 55/55 |
| timeout decision fixture 6종·late result | PASS, provider 최대 1회 |
| invalid output 4종·ACK 동시성·expiry before-read | PASS |
| common·STT·AI·security·shared fixture validator | PASS |
| source network·credential·logging 정적 scan | PASS, 금지 패턴 0건 |
| `aiops validate task --strict`·`git diff --check` | 문서 완료 후 재실행 |

## QA 재작업 결과

| 결함 | 해소 내용 | 직접 회귀 |
|---|---|---|
| `QA-HIGH-004-001` | canonical JSON 뒤 LF 한 바이트를 포함해 계약의 `jq -cS` byte 규칙과 동일하게 SHA-256 계산 | 승인 shared fixture 원문 service·HTTP create 202, key order·UTF-8·배열 순서·LF golden vector |
| `QA-HIGH-004-002` | +24시간 delete 실패를 내부 `cleanupPending`으로 유지하고 공개 status는 500 fail closed, 신규 job은 503 차단 | 반복 delete 실패·content read 0·sweeper 복구 후에만 `expired_deleted`, 차단 자동 해제 |
| `QA-MEDIUM-004-003` | regex capture의 실제 Gregorian 일수·윤년·시각·timezone 범위를 검증 | create·ACK의 2월 30일·비윤년 2월 29일·24시·잘못된 offset 거부, 윤년 승인 |

재작업 후 기존 15개, T-003 24개와 T-004 16개, 공통·STT·AI·security·shared fixture
validator가 모두 통과했다. 최신 `origin/develop` `865f508` 대비 behind 0으로 정렬했다.

## 제한과 후속 소유권

- content는 production encryption adapter가 아닌 process-local in-memory test record다.
  process 재시작 내구성, 실제 encryption, datastore transaction, Cloud Tasks와 sweeper는
  production adapter 또는 T-006~007 통합 게이트 범위다.
- T-002 소유 `package.json`은 허용 경로가 아니므로 T-004 suite는 별도 Node 명령으로
  실행한다. 전체 check wiring은 T-007이 담당한다.
- +22시간 local cleanup은 content가 사라진 available 결과를 노출하지 않도록 안전하게
  `expired_deleted`로 전환한다. production의 세부 retention·incident gate는 T-006 소유다.

## Backend QA 인계

Backend QA Agent는 clean 환경에서 기존 15개, T-003 24개와 T-004 16개를 재실행한다.
shared fixture의 정상·오류·timeout·만료 상태, worker 중복·crash 전후 provider 1회, output
invalid 비저장, GET 무호출 복구, ACK delete CAS, expiry before-read와 민감정보 비노출을
독립 반례로 검증한다. 특히 승인 fixture 원문 create, canonical bytes golden vector,
expiry delete 반복 실패·sweeper 복구·신규 job 차단과 invalid calendar date를 재실행한다.
