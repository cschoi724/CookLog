# CookLog Backend 공통 계약

이 디렉터리는 Backend와 iOS가 함께 사용하는 공통 HTTP 계약의 기계 검증 원본이다.

## 계약 파일

- `success-envelope.schema.json`: 성공 응답 envelope
- `error-envelope.schema.json`: 실패 응답 Problem Details envelope
- `auth-challenge.schema.json`: 무결성 검증용 일회성 challenge 응답
- `installation-attestation.schema.json`: 설치 등록·토큰 갱신 시 정규화된 무결성 증명 요청
- `installation-token.schema.json`: 설치 단위 access token 응답
- `public-error-catalog.json`: 공개 오류 code별 고정 mapping 원본
- `fixtures/error-generation-negative.json`: raw provider 오류·secret·사용자 원문을
  안전 오류로 치환하는 negative fixture
- `validate-contracts.sh`: catalog·schema enum·negative fixture 정합성 검사

구체적인 HTTP method, header, status, 제한과 재시도 규칙은
`apps/backend/docs/API_CONTRACT.md`를 따른다. JSON Schema와 문서가 충돌하면 더 엄격한
조건을 적용하고, 충돌 자체를 계약 결함으로 처리한다.

## 검증 원칙

- 모든 schema는 JSON Schema Draft 2020-12다.
- 실패 응답은 `application/problem+json`, 성공 응답은 `application/json`이다.
- `additionalProperties: false`는 알 수 없는 필드를 차단한다. 문자열 내부의 정보
  비노출은 공개 오류 catalog allowlist와 안전 오류 renderer 경계로 별도 보장한다.
- fixture는 각 schema의 성공·실패 예제를 모두 검증해야 한다.
- Backend 자체 검증은 `sh apps/backend/contracts/common/validate-contracts.sh`를
  실행한다. runtime renderer와 전체 JSON Schema validator fixture는 T-20260729-025가
  이 원본을 사용해 확장한다.
