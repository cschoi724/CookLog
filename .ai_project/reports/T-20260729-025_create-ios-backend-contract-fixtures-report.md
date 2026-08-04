# T-20260729-025 실행 보고서

작성자: Backend Agent
작성일: 2026-07-31
상태: QA 차단 결함 재작업 자체 검증 완료, Backend QA 독립 재검증 대기

## 실행 결과

Backend 계약 테스트와 iOS mock client가 동일 파일을 소비하는 공용 fixture 6종과 통합
검증기를 작성하고 iOS 서비스 handoff 문서를 동기화했다.

## 산출물

- `apps/backend/contracts/fixtures/README.md`
- `apps/backend/contracts/fixtures/manifest.json`
- `apps/backend/contracts/fixtures/ai-recipe-success.json`
- `apps/backend/contracts/fixtures/ai-recipe-error-cases.json`
- `apps/backend/contracts/fixtures/ai-recipe-timeout-recovery.json`
- `apps/backend/contracts/fixtures/ai-recipe-expired.json`
- `apps/backend/contracts/fixtures/remote-stt-disabled.json`
- `apps/backend/contracts/fixtures/negative-contract-cases.json`
- `apps/backend/tests/contracts/README.md`
- `apps/backend/tests/contracts/validate-shared-fixtures.sh`
- `apps/ios/docs/SERVICES.md`

## 계약 구조

### 단일 fixture 원본

`apps/backend/contracts/fixtures/`를 Backend와 iOS test의 단일 JSON 원본으로 정했다.
iOS는 test resource로 이 파일을 복사해 decode하며 Swift literal이나 별도 JSON으로
payload를 복제하지 않는다. fixture는 test/Preview 경로에만 사용하고 production
target·release bundle에는 포함하지 않는다.

`manifest.json`은 각 case의 source schema·정책, Backend/iOS 소비자, iOS assertion과
민감정보 등급을 연결한다. 검증기는 모든 fixture와 source contract 파일이 실제로
존재하는지 확인한다.

### AI 정상 흐름

`ai-recipe-success.json`은 canonical STEP snapshot, create HTTP 202 `queued`, poll
`succeeded/available`, `result_version=1`, RecipeDraft, 로컬 저장 후 ACK를 한 흐름으로
고정한다. create request와 draft는 T-023 canonical fixture와 값이 같고 STEP canonical
SHA-256도 재계산한다.

### 오류·timeout·만료

- 공개 오류 5개를 T-021 catalog의 type·title·status·detail·message key·retry와 대조
- queue timeout, provider 미실행 확정 timeout, provider 결과 불명확 상태 분리
- 모든 terminal failure에서 snapshot 보존, 자동 retry 금지, 사용자 수동 재실행
- 24시간 expired 상태에서 result·version 없음, decrypt·provider 호출 0
- version, unknown error, idempotency body conflict, ACK mismatch와 추가 field negative
  case

### 원격 STT 비활성

첫 출시 config는 T-022 canonical fixture와 동일하다. 기기 내 STT 최종 실패,
무승인 upload와 provider config 주입에서 remote request, Backend body read와 audio
egress가 모두 0이며 STEP도 생성하지 않는다.

### iOS handoff

`SERVICES.md`에 fixture/version 로딩, create→poll→save→ACK, 앱 재실행 GET 복구,
공개 오류 mapping, timeout·만료와 remote STT 비활성 기대 동작을 추가했다.
`RecipeGenerationRepository`는 화면 facade를 유지하고 transport 세부는
`RemoteRecipeAIDataSource` 경계에 둔다.

## 추적성

| 공용 fixture | 원본 계약 | 핵심 검증 |
|---|---|---|
| AI success | common success, AI create/status/draft/ACK | canonical hash·queued→succeeded→ACK |
| HTTP errors | common error schema/catalog | 고정 공개 mapping·retry-after |
| timeout recovery | AI status/timeout decision | provider 시작·결과 확실성·수동 retry |
| expired | AI status/recovery lifecycle | 24시간 result 0·decrypt 0 |
| STT disabled | STT release config/disabled release | request·body read·egress 0 |
| negative | common·AI·STT schema | version·idempotency·ACK·unknown field 차단 |

## 자체 검증

| 검증 | 결과 |
|---|---|
| `sh -n apps/backend/tests/contracts/validate-shared-fixtures.sh` | PASS |
| `sh apps/backend/tests/contracts/validate-shared-fixtures.sh` | PASS |
| common contract validator | PASS |
| remote STT contract validator | PASS |
| AI recipe contract validator | PASS |
| security/privacy/cost contract validator | PASS |
| 공용 JSON 전체 `jq empty` | PASS |
| manifest fixture·source contract 파일 추적 | PASS |
| canonical STEP SHA-256·request·draft 일치 | PASS |
| 공개 오류 catalog·retry-after mapping | PASS |
| timeout·만료·STT 비활성·negative case | PASS |
| secret·token·개인정보·raw audio pattern scan | PASS |
| `aiops validate task ... --strict` | PASS |
| `git diff --check` | PASS |

## 민감정보 경계

- 레시피와 STEP 문자열·UUID는 합성 데이터만 사용했다.
- 실제 access token, App Attest proof, provider key, JWT, email, raw audio와 base64
  audio를 포함하지 않는다.
- `required_headers`는 header 이름만 가지며 값은 test harness의 별도 합성 credential
  provider가 주입한다.
- 공개 오류 fixture에 provider명, model, stack, raw request·response를 넣지 않는다.

## 범위 외

- iOS XCTest target의 DTO·fixture loader 실제 구현
- Backend runtime endpoint·JSON Schema middleware 구현
- 실제 App Attest·access token과 provider 연동
- production fixture bundle 포함 여부를 검사하는 CI job
- staging create/poll/ACK·cleanup 통합 시험

## 남은 위험과 후속 소유권

- iOS 연동 Task는 manifest의 모든 `ios_assertion`을 XCTest와 1:1 연결해야 한다.
- Backend foundation 구현은 같은 fixture를 runtime schema validator와 endpoint
  integration test에 연결해야 한다.
- 실제 콘텐츠 삭제, IAM, quota·비용 ledger와 provider 설정은 후속 staging gate에서
  검증한다.
- fixture가 production bundle에 포함되지 않는지는 iOS 구현·CI 단계에서 확인한다.

## Backend QA 인계

Backend QA Agent는 정상·공개 오류·timeout·만료·STT 비활성·negative case가 source
계약과 1:1 추적되는지, iOS와 Backend가 동일 JSON을 소비할 수 있는지, secret·실제
콘텐츠·개인정보가 없는지 독립 검증한다.

공식 QA 판정은 Backend QA Agent가 수행하며 Backend Agent의 자체 검증은 이를 대체하지
않는다.

## 2026-08-04 QA 재작업

Backend QA `FAIL`의 `QA-HIGH-025-001~002`를 다음과 같이 수정했다.

- create·ACK 필수 header에 `CookLog-Installation-ID`, `Content-Type`을 추가했다.
- 계약에 없는 `X-CookLog-App-Attest-Assertion`을 제거했다.
- poll GET 요청 fixture를 추가하고 create·poll·ACK의 필수·선택 header 집합을
  `API_CONTRACT.md` 3.1과 정확히 대조한다.
- 필수 header 누락과 미정의 필수 header 추가 negative case를 추가했다.
- 기존 7개를 포함한 negative 9종의 mutation과 expected를 모두 명시적으로 검증한다.
- version·공개 error·status 추가 field·원격 STT·header mutation을 canonical payload에
  실제 적용하고 decoder·계약 validator가 허용하면 검증 script가 실패하게 했다.
- idempotency body conflict와 ACK version mismatch도 각 불변식을 실제 확인한다.

재작업 후 shell 문법, JSON 문법, common·STT·AI·security validator와 공용 통합
validator, 민감정보 scan, `git diff --check`를 다시 실행해 모두 PASS했다.

## 최신 develop 기준

- 최초 구현 기준 `origin/develop`: `153bc44`
- 최초 QA 인계 재정렬 기준 `origin/develop`: `890a6c6`
- 재작업 최종 재정렬 기준 `origin/develop`: `e4bab3a`
- T-20260729-021~024 `done`: 보존
- 최신 `origin/develop` 대비 뒤처짐: 0
- 재정렬 후 공용 계약 검증 5종과 `git diff --check` 재실행: PASS
