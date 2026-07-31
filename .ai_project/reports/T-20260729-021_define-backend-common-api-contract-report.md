# T-20260729-021 실행 보고서

작성일: 2026-07-30
작성자: Backend Agent
상태: `verification_ready`

## 결과

Backend와 iOS가 공통으로 사용할 `/v1` HTTP 계약, 설치 인증, 제한, idempotency,
timeout, retry와 오류 경계를 구현 가능한 수준으로 정의했다. 첫 출시 STT는 Apple 기기
내 처리라는 공식 정책을 유지했고 원격 STT endpoint·음성 upload·자동 fallback은
추가하지 않았다.

## 변경 파일

- `apps/backend/docs/API_CONTRACT.md`
- `apps/backend/contracts/common/README.md`
- `apps/backend/contracts/common/success-envelope.schema.json`
- `apps/backend/contracts/common/error-envelope.schema.json`
- `apps/backend/contracts/common/auth-challenge.schema.json`
- `apps/backend/contracts/common/installation-attestation.schema.json`
- `apps/backend/contracts/common/installation-token.schema.json`
- `apps/backend/contracts/common/public-error-catalog.json`
- `apps/backend/contracts/common/fixtures/error-generation-negative.json`
- `apps/backend/contracts/common/validate-contracts.sh`
- `.ai_project/tasks/backlog/T-20260729-021_define-backend-common-api-contract.md`
- `.ai_project/teams/development/task_board.md`
- `.ai_project/teams/quality/task_board.md`
- `.ai_project/reports/T-20260729-021_define-backend-common-api-contract-report.md`

## 주요 계약 결정

### 버전·request ID·응답

- 공개 endpoint를 `/v1`로 고정했다.
- 서버 생성 UUID v4를 canonical request ID로 사용하고 header와 body를 일치시킨다.
- 성공은 공통 `data/meta`, 실패는 RFC 9457 기반 Problem Details envelope를 사용한다.
- 공개 `code`와 iOS 현지화용 `user_message_key`만 외부에 노출하고 내부 오류,
  provider detail, stack, secret과 사용자 원문은 응답에서 금지했다.

### 설치 인증과 무결성

- `installation_id`는 quota용 가명 식별자이지 사용자 신원 증명이 아님을 명시했다.
- App Attest와 Firebase App Check를 `AttestationVerifier` 뒤에서 공통 claim으로
  정규화한다.
- 120초 one-time challenge, App Attest assertion counter, Firebase limited-use token
  소비를 replay 차단 경계로 정의했다.
- access token 최대 TTL을 15분으로 제한하고 production에서 verifier 장애 시 fail
  closed한다.

### 제한·idempotency·timeout

- IP, installation, project와 비용 endpoint 제한을 독립 적용한다.
- 첫 구현 상한과 emergency project limit `0` kill switch를 정의했다. T-024는 값을
  낮출 수 있고 상향은 비용·abuse 검토와 Product Owner 승인이 필요하다.
- mutation POST에 UUID v4 `Idempotency-Key`를 요구하고 scope, body hash, 24시간
  record, 동시 요청과 결과 불명확 처리를 정의했다.
- client 15초, handler 10초 등 deadline budget과 side effect 시작 여부에 따른
  `UPSTREAM_TIMEOUT`/`REQUEST_OUTCOME_UNKNOWN` 분기를 정의했다.
- iOS와 Backend의 retry 대상·횟수·key 재사용·재처리 소유권을 분리했다.

## 자체 검증

| 검증 | 결과 |
|---|---|
| 기준 branch/SHA | `task/T-20260729-021-define-backend-common-api-contract`, `8a36f22` 확인 |
| `jq empty apps/backend/contracts/common/*.json` | PASS |
| `aiops validate task ... --strict` | PASS |
| YAML front matter 단일 key·승인·QA routing 확인 | PASS |
| `git diff --check` | PASS |
| allowed paths 수동 대조 | PASS |
| 원격 STT endpoint·자동 fallback·음성 upload 부재 확인 | PASS |

JSON Schema runtime validator dependency는 여전히 T-025 범위다. 이번 재작업에서는
`validate-contracts.sh`를 추가해 JSON 문법, catalog code 유일성, schema enum과 catalog
집합 동등성, negative fixture의 고정 mapping 일치와 금지 문자열 비노출을 `jq`로
검증한다.

## Backend QA 요청

- App Attest challenge·counter와 App Check limited-use token replay
- 위조·만료·wrong audience proof와 installation/token subject 불일치
- IP·installation·project 제한 및 일일 quota 우회
- 동일 idempotency key의 동시 요청, replay와 payload 충돌
- timeout 전후 side effect와 결과 불명확 상태
- 오류 schema와 내부 정보·secret·원문 비노출
- STT 실패에서 Backend 음성 요청·원격 fallback이 생기지 않는 정책 경계
- 같은 challenge를 서로 다른 idempotency key로 동시에 소비할 때 단일 성공 보장
- T-020 project 월간 호출·token·외부비 hard cutoff의 원자 예약과 수평 우회 차단
- 공개 오류 catalog·schema enum·악성 negative fixture의 기계 정합성

## 남은 위험과 후속 소유권

- 실제 runtime·무결성 provider 선택은 T-020 소유다. runtime이 Firebase limited-use
  token 소비를 지원하지 않으면 App Check 경로를 활성화할 수 없다.
- rate/quota 상한의 더 보수적인 운영값, 비용·장애 guardrail은 T-024가 확정한다.
- schema fixture와 concurrency 계약 테스트는 T-025가 구축한다.
- datastore transaction, distributed limiter, token signing/key rotation 구현은
  후속 Backend foundation/production Task가 담당한다.
- JSON Schema `format`과 `contentEncoding`은 validator에 따라 annotation으로만
  처리될 수 있으므로 구현 validator 설정 또는 명시적 runtime 검사가 필요하다.

## 최신 develop 통합

2026-07-31 Product Owner가 T-021 실행 승인을 재확인했다. Development Lead가
기존 미커밋 구현을 커밋 `de04b6a`로 보존한 뒤 `origin/develop` 위로 재정렬했다.
승인된 재작업 완료 후에는 최신 `origin/develop` `e939b78` 위로 다시 재정렬해
CI T-20260730-003 변경과 T-021 변경을 함께 보존했다.

- 현재 재정렬된 구현 보존 커밋: `a7c638f`
- API 계약·공통 JSON Schema·실행 보고서의 의미 변경: 없음
- T-20260729-020 `done`과 최신 공용 보드 기록: 보존
- Task 위치: `backlog`에서 `active`로 정규화
- 현재 상태: `verification_ready`
- 다음 담당: Backend QA Agent

## Backend QA 실패와 재작업 승인

Backend QA는 검증 기준 `068deb2`에서 다음 결함을 확인해 `FAIL`로 판정했다.

- `QA-HIGH-021-001`: 최초 설치 challenge 동시 소비의 원자적 단일 승자 보장 누락
- `QA-HIGH-021-002`: 오류 허용 문자열 내부의 provider 정보·secret·원문 비노출을
  schema와 fixture로 기계 검증하지 못함
- `QA-MEDIUM-021-001`: T-020 project 일·월 비용 hard cutoff와 공통 quota 연결 누락

2026-07-31 Product Owner가 세 항목의 계약 보완 재작업을 승인했다. Backend Agent는
원자적 challenge 소비, 공개 오류 고정 mapping·negative fixture, project 누적 비용
차단 연결을 반영하고 자체 검증 후 Backend QA에 독립 재검증을 다시 요청한다.

## 승인된 재작업 결과

### QA-HIGH-021-001

- challenge `unused -> consumed` compare-and-set, installation/App Attest credential
  등록, idempotency record와 committed token grant를 하나의 transaction 또는 동등한
  원자적 단일 승자 경계로 고정했다.
- 서로 다른 idempotency key가 같은 challenge를 동시에 제출해도 정확히 한 요청만
  성공하며 패배 요청은 401 `ATTESTATION_REPLAYED`가 된다.
- Firebase limited-use token은 `consume=true`의 `alreadyConsumed=false`만 허용한다.

### QA-HIGH-021-002

- `public-error-catalog.json`에 모든 공개 code의 고정
  `type/title/status/detail/user_message_key/retryable/retry_after_policy` mapping을
  정의했다.
- renderer가 raw exception·provider payload·secret·사용자 원문을 받지 못하고
  catalog 값만 복사하도록 생성기 경계를 고정했다.
- error schema의 title/detail/code/message key와 violation field/reason을 allowlist로
  제한했다.
- provider 오류, authorization, token, stack, 사용자 STEP과 unsafe violation을
  포함한 negative fixture가 안전 mapping으로 치환되는지 검사한다.

### QA-MEDIUM-021-001

- T-020의 project 월 5,500 provider 호출, 입력 20M, 출력 8M token과 KRW 50,000
  외부비 hard cutoff를 모든 installation·IP 합산 원장으로 연결했다.
- outbound provider 호출 전에 최대 사용량과 비용을 원자 예약하고 원장 장애 시
  503 `LIMITER_UNAVAILABLE`, 초과 시 429 `QUOTA_EXCEEDED`로 fail closed한다.

## 재작업 자체 검증

| 검증 | 결과 |
|---|---|
| `sh apps/backend/contracts/common/validate-contracts.sh` | PASS |
| `jq empty apps/backend/contracts/common/*.json apps/backend/contracts/common/fixtures/*.json` | PASS |
| `aiops validate task ... --strict` | PASS |
| `git diff --check` | PASS |
| 원격 STT endpoint·자동 fallback·음성 upload 추가 없음 | PASS |

Backend Agent 재작업 범위는 완료했다. 공식 판정은 Backend QA Agent의 독립 재검증
범위이며 이 보고서는 개발자 자체 검증 결과만 기록한다.

## Development Lead 완료 검토

Backend QA 결과를 커밋 `36ef1b4`로 고정한 뒤 최신 `origin/develop`
`44c7dd9` 위로 재정렬했다. 재정렬된 계약 재작업 커밋은 `92b471f`, QA 결과
커밋은 `8e222cc`다.

- 재정렬 전후 계약·Task·실행 보고서·QA 보고서 내용: 동일
- 최신 `origin/develop` 대비 behind: 0
- `T-20260730-003 done`, `T-20260729-011 done`: 보존
- `sh apps/backend/contracts/common/validate-contracts.sh`: PASS
- JSON 문법·Task strict validation·`git diff --check`: PASS
- 공개 오류 catalog 20개 mapping·악성 fixture 4개: PASS
- 전체 변경 경로: Task `allowed_paths` 안
- Backend QA: `PASS_WITH_RISK`
- 차단 결함: 없음

실제 runtime validator와 catalog renderer 동일성 테스트는
`T-20260729-025`로 인계할 수 있는 비차단 위험이다. Development Lead가 성공
기준과 독립 QA 증빙을 수용해 `completion_review`로 전환한다. `develop` 대상
PR 병합 후 `done`으로 확정한다.
