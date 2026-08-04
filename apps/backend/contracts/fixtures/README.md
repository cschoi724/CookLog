# CookLog iOS·Backend 공용 계약 fixture

이 디렉터리는 Backend 계약 테스트와 iOS mock client가 함께 읽는 단일 fixture
원본이다. 앱 bundle이나 production runtime에는 포함하지 않는다.

## 파일

- `manifest.json`: case ID, 원본 schema·정책, iOS·Backend 소비자와 민감정보 등급
- `ai-recipe-success.json`: create 202, polling 성공, RecipeDraft와 ACK
- `ai-recipe-error-cases.json`: 공개 HTTP 오류와 iOS 오류 mapping
- `ai-recipe-timeout-recovery.json`: queue/provider timeout과 outcome unknown
- `ai-recipe-expired.json`: 24시간 만료·본문 없는 복구 상태
- `remote-stt-disabled.json`: 첫 출시 원격 STT 비활성·무승인 upload 차단
- `negative-contract-cases.json`: version, error, idempotency, ACK, header와 STT drift 차단

## 사용 규칙

- 모든 사용자형 문자열과 ID는 합성값이다. production 응답·로그·secret·token·실제
  개인정보를 fixture로 복사하지 않는다.
- `fixture_version=ios-backend-fixture.v1`과 각 payload의 계약 version을 별도로
  검증한다.
- iOS 테스트 target은 이 디렉터리의 JSON을 리소스로 복사해 decode한다. 동일 payload를
  Swift literal이나 별도 JSON으로 재작성하지 않는다.
- Backend는 `apps/backend/tests/contracts/validate-shared-fixtures.sh`로 원본
  schema·catalog·fixture와의 정합성, 상태 전이와 민감정보 비포함을 검증한다.
- create·poll·ACK의 `required_headers`와 `optional_headers`는
  `API_CONTRACT.md` 3.1의 이름만 표현한다. access token과 실제 idempotency secret
  값을 포함하지 않으며 계약에 없는 header를 추가하지 않는다.
- negative case는 descriptor의 이름만 검사하지 않는다. canonical payload에 version,
  error code, status field, header와 STT config mutation을 실제 적용하고 decoder·계약
  validator가 거부하는지 확인한다.

검증:

```sh
sh apps/backend/tests/contracts/validate-shared-fixtures.sh
```
