# T-20260729-025 Backend QA 독립 검증 보고서

검증일: 2026-08-04
검증자: Backend QA Agent / Verification Role
검증 기준: `task/T-20260729-025-create-ios-backend-contract-fixtures` `f6a7a64`
기준 develop: `origin/develop` `890a6c6`
현재 판정: `PASS_WITH_RISK`
현재 상태 인계: `verification_in_progress -> verification_passed`

## 1. 검증 범위

- `apps/backend/contracts/fixtures/`
- `apps/backend/tests/contracts/validate-shared-fixtures.sh`
- `apps/backend/docs/API_CONTRACT.md`
- `apps/backend/docs/AI_RECIPE_CONTRACT.md`
- `apps/backend/docs/REMOTE_STT_ADAPTER.md`
- `apps/backend/contracts/common/`, `ai/`, `stt/`, `security/`
- `apps/ios/docs/SERVICES.md`
- Task allowed paths, 선행 Task와 최신 `origin/develop` 상태

Backend와 iOS가 같은 fixture에서 동일한 요청·응답 계약을 얻는지, validator가 정상
fixture뿐 아니라 잘못된 version·error·추가 필드도 실제로 차단하는지, fixture에 실제
secret·사용자 콘텐츠·개인정보가 포함되지 않는지를 독립 검증했다.

## 2. 요약

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| 선행 Task·작업 보고 | PASS | T-021~024가 `done`이고 실행 보고서와 검증 명령이 존재한다. |
| allowed paths | PASS | 변경 파일은 Task 허용 경로 안에 있다. |
| 정상 AI 상태·draft·ACK 값 | PASS | canonical request·draft·SHA-256과 result version 연결이 일치한다. |
| 오류·timeout·만료·STT 비활성 | PASS | 공개 catalog mapping, terminal snapshot 보존, 만료 시 본문 없음, body read·egress 0을 확인했다. |
| 공통 요청 header 추적성 | FAIL | create·ACK fixture가 공통 필수 header를 누락하고 계약에 없는 header를 요구한다. |
| negative case 차단력 | FAIL | 7개 중 4개의 expected·mutation을 잘못 변경해도 validator가 성공한다. |
| 민감정보 비포함 | PASS | 실제 token, key, JWT, email, raw/base64 audio와 production 콘텐츠를 발견하지 못했다. |
| 기존 validator·문법 | PASS | 공용 validator와 common·STT·AI·security validator, shell syntax, JSON, diff check가 통과했다. |

## 3. 차단 결함

### QA-HIGH-025-001 — 공용 success fixture의 필수 header가 API 계약과 불일치

`apps/backend/docs/API_CONTRACT.md` 3.1은 보호 endpoint의
`Authorization`, `CookLog-Installation-ID`, body가 있는 요청의 `Content-Type`, side
effect POST의 `Idempotency-Key`를 필수로 정의한다.

그러나 `ai-recipe-success.json`은 다음과 다르다.

- create: `CookLog-Installation-ID`, `Content-Type` 누락
- create: 기준 계약에 없는 `X-CookLog-App-Attest-Assertion` 추가
- ACK: `CookLog-Installation-ID`, `Content-Type` 누락

`X-CookLog-App-Attest-Assertion`은 Backend 문서·schema에서 endpoint 필수 header로
정의되지 않았다. 이 fixture를 그대로 소비하면 iOS mock client와 Backend 테스트가
서로는 일치해도 공식 API 계약에는 맞지 않는 요청을 만들 수 있다. 현재 validator는
`required_headers`를 검사하지 않으므로 이 불일치 상태에서도 PASS한다.

필수 재작업:

1. create와 ACK의 `required_headers`를 `API_CONTRACT.md`와 일치시킨다.
2. App Attest assertion을 별도 필수 header로 사용하려면 먼저 공통 API·AI 계약에 이름,
   적용 endpoint, 검증 순서와 오류를 정의한다. 그렇지 않으면 fixture에서 제거한다.
3. GET poll을 포함해 보호 endpoint별 필수·선택 header를 validator가 source contract와
   대조하도록 한다.
4. 필수 header 누락과 미정의 header 추가 시 validator가 실패하는 negative case를
   추가한다.

### QA-HIGH-025-002 — negative validator가 핵심 mutation을 실제로 검증하지 않음

`negative-contract-cases.json`에는 7개 case가 있지만 validator는 case 이름 목록과
다음 3개의 일부 값만 확인한다.

- `ack_result_version_mismatch`
- `same_idempotency_key_different_body`
- `remote_stt_enabled_without_approval`

다음 4개는 이름이 존재하는지만 확인하고 `expected`와 mutation 값을 검사하지 않는다.

- `unsupported_fixture_version`
- `unsupported_ai_contract_version`
- `unknown_public_error_code`
- `unexpected_status_field`

독립 반례에서 각 `expected`를 `INCORRECTLY_ACCEPTED`로 변경하거나 fixture mutation을
`ios-backend-fixture.v999`로 바꾼 입력이 모두 기존 negative predicate를 통과했다.
즉 version·unknown error·추가 field 차단이 회귀해도 현재 계약 테스트는 성공한다.

필수 재작업:

1. 7개 negative case 각각의 mutation과 expected 결과를 명시적으로 검증한다.
2. 가능한 case는 mutation descriptor의 존재 확인에 그치지 않고 실제 JSON Schema
   validator 또는 동등한 decoder/validator에 변형 payload를 넣어 reject를 확인한다.
3. unsupported fixture/AI version, unknown public error, additional field가 허용되면
   테스트가 반드시 실패하는 자기 검증 반례를 추가한다.
4. README와 실행 보고서의 “negative case PASS”를 실제 차단 범위와 일치시킨다.

## 4. 수행 검증

```text
origin/develop...HEAD: 0 behind / 1 ahead
sh -n apps/backend/tests/contracts/validate-shared-fixtures.sh: PASS
sh apps/backend/tests/contracts/validate-shared-fixtures.sh: PASS
common contract validator: PASS
remote STT contract validator: PASS
AI recipe contract validator: PASS
security/privacy/cost contract validator: PASS
poll·timeout·expired status required key 독립 검사: PASS
canonical request·draft·snapshot SHA-256: PASS
민감정보 pattern 및 production fixture 참조 검색: PASS
git diff --check: PASS
필수 header 독립 대조: FAIL
negative expected/mutation 변조 5건 차단 검사: FAIL — 모두 기존 predicate 통과
```

기존 validator의 PASS는 산출물이 현재 script의 제한된 predicate와 맞는다는 뜻이다.
공통 header drift와 검증되지 않는 negative mutation을 탐지하지 못하므로 Task 성공
기준 전체 통과로 해석할 수 없다.

## 5. 통과 항목과 잔여 위험

- manifest 6개 case와 source contract 파일의 추적성은 유지된다.
- 정상 create·poll·save·ACK 값, 공개 오류 5개, timeout 3개, 만료와 원격 STT 비활성
  상태는 현재 source fixture·catalog와 일치한다.
- fixture 콘텐츠는 합성값이며 실제 credential·개인정보·raw audio는 발견되지 않았다.
- iOS DTO·fixture loader, Backend runtime middleware·endpoint, production bundle 제외 CI,
  staging create/poll/ACK·cleanup은 후속 구현 범위이므로 이번 PASS를 실서비스 검증으로
  확대하지 않는다.

## 6. 최종 판정과 인계

fixture 데이터와 민감정보 경계의 상당 부분은 통과했지만, 공통 요청 header가 공식 API
계약과 다르고 negative validator가 핵심 회귀를 차단하지 못한다. 두 결함 모두 iOS와
Backend가 동일하지만 잘못된 계약을 공유하거나 잘못된 payload를 허용하게 만들 수 있어
구현 선행 계약 테스트의 목적을 충족하지 못한다.

최종 판정은 `FAIL`이다. Task를 `rework_requested`로 전환하고 Development Lead Agent /
Lead Role에 재작업 범위 조율을 인계한다.

## 7. 독립 재검증

재검증일: 2026-08-04
재검증 기준: `task/T-20260729-025-create-ios-backend-contract-fixtures` `1bed517`
기준 develop: `origin/develop` `e4bab3a`

### 결함 해소 결과

| 결함 | 결과 | 독립 재검증 근거 |
|---|---|---|
| `QA-HIGH-025-001` | RESOLVED | create·ACK에 `CookLog-Installation-ID`, `Content-Type`이 추가되고 미정의 App Attest header가 제거됐다. poll GET을 포함한 필수·선택 header 집합이 공통 API 계약과 일치하며 누락·미정의 header mutation이 거부된다. |
| `QA-HIGH-025-002` | RESOLVED | negative case 9종의 mutation·expected가 모두 고정됐다. canonical fixture에 version·error·status field·STT·header mutation을 실제 적용하고, idempotency·ACK 불변식까지 validator가 거부해야 통과한다. |

### 재검증 상세

- create POST 필수 header: `Authorization`, `CookLog-Installation-ID`, `Content-Type`,
  `Idempotency-Key`
- poll GET 필수 header: `Authorization`, `CookLog-Installation-ID`
- ACK POST 필수 header: create와 동일
- 세 요청 선택 header: `Accept`, `CookLog-Client-Request-ID`
- `X-CookLog-App-Attest-Assertion`은 정상 fixture에서 제거되고 미정의 header 거부
  negative case에만 존재한다.
- 기존 7개 negative case의 descriptor 전체와 header case 2개가 명시적으로 검증된다.
- version·AI contract·unknown error·status 추가 field·STT 활성화·header 변형은 실제
  canonical payload에 적용되며 허용되면 전체 script가 실패한다.
- idempotency body conflict와 ACK result version mismatch도 실제 불변식 판정 함수가
  거부한다.

독립 반례로 필수 header 제거, 미정의 header 추가, fixture expected 변조, unknown error
expected 변조와 status descriptor 변조를 재실행했으며 모두 reject exit `1`을 확인했다.

### 재검증 명령

```text
origin/develop...HEAD: 0 behind / 3 ahead (QA 기록 전)
sh -n apps/backend/tests/contracts/validate-shared-fixtures.sh: PASS
sh apps/backend/tests/contracts/validate-shared-fixtures.sh: PASS
common contract validator: PASS
remote STT contract validator: PASS
AI recipe contract validator: PASS
security/privacy/cost contract validator: PASS
공용 fixture JSON 문법: PASS
공통 header 독립 대조: PASS
필수 header 누락 mutation: REJECT
미정의 header 추가 mutation: REJECT
negative expected·descriptor 독립 변조 3건: REJECT
민감정보 pattern scan: PASS
production iOS target fixture 참조 검색: PASS
aiops task strict validation: PASS
git diff --check: PASS
```

## 8. 재검증 잔여 위험과 최종 판정

이번 Task는 공용 fixture와 계약 검증 기준을 정의한다. 실제 iOS DTO·fixture loader,
Backend runtime schema middleware·endpoint, release bundle fixture 제외 CI와 staging
create/poll/ACK·cleanup은 아직 구현되지 않았으므로 후속 구현·통합 QA에서 확인해야 한다.
이는 이번 재작업의 계약 결함은 아니지만 실서비스 동작 통과로 확대 해석할 수 없는
잔여 위험이다.

`QA-HIGH-025-001~002`가 모두 해소됐고 기존 정상·오류·timeout·만료·STT 비활성 및
민감정보 비포함 기준에도 회귀가 없다. 최종 판정은 `PASS_WITH_RISK`다. Task를
`verification_passed`로 전환하고 Development Lead Agent / Completion Role에 완료
검토를 인계한다.

## 9. Development Lead 완료 검토

검토일: 2026-08-04
검토 기준: `qa/T-20260729-025-reverification` `52f2a9c`
기준 develop: `origin/develop` `e4bab3a`

- 성공 기준, allowed paths와 최신 develop 포함 상태를 확인했다.
- `QA-HIGH-025-001~002` 해소와 통합 validator·독립 반례 결과를 수용했다.
- PR #63의 `ios-build`·`ios-xctest` 성공과 미해결 리뷰 스레드 0건을 확인했다.
- 잔여 위험은 실제 iOS loader, Backend runtime validator, release bundle 제외 CI와
  staging 통합 검증으로 한정해 후속 Task에 유지한다.

차단 결함이 없어 완료 리뷰를 통과하고 `completion_review`로 전환한다. Product Owner의
병합 승인에 따라 PR #63을 `develop`에 squash merge한 뒤 `done`으로 확정한다.
