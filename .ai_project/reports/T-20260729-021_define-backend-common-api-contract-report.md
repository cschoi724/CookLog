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

JSON Schema runtime validator가 현재 저장소 dependency로 제공되지 않아 실제 fixture
validation은 Backend QA 및 T-025의 계약 테스트에서 수행해야 한다. 이번 자체 검증은
JSON syntax, schema 구조, 예제/문서 필드의 수동 대조까지 수행했다.

## Backend QA 요청

- App Attest challenge·counter와 App Check limited-use token replay
- 위조·만료·wrong audience proof와 installation/token subject 불일치
- IP·installation·project 제한 및 일일 quota 우회
- 동일 idempotency key의 동시 요청, replay와 payload 충돌
- timeout 전후 side effect와 결과 불명확 상태
- 오류 schema와 내부 정보·secret·원문 비노출
- STT 실패에서 Backend 음성 요청·원격 fallback이 생기지 않는 정책 경계

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
기존 미커밋 구현을 커밋 `de04b6a`로 보존한 뒤 최신 `origin/develop`
`ad06bb9` 위로 재정렬했다.

- 재정렬된 구현 보존 커밋: `a1eb57f`
- API 계약·공통 JSON Schema·실행 보고서의 의미 변경: 없음
- T-20260729-020 `done`과 최신 공용 보드 기록: 보존
- Task 위치: `backlog`에서 `active`로 정규화
- 현재 상태: `verification_ready`
- 다음 담당: Backend QA Agent
