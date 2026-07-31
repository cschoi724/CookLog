# CookLog Backend 공통 계약

이 디렉터리는 Backend와 iOS가 함께 사용하는 공통 HTTP 계약의 기계 검증 원본이다.

## 계약 파일

- `success-envelope.schema.json`: 성공 응답 envelope
- `error-envelope.schema.json`: 실패 응답 Problem Details envelope
- `auth-challenge.schema.json`: 무결성 검증용 일회성 challenge 응답
- `installation-attestation.schema.json`: 설치 등록·토큰 갱신 시 정규화된 무결성 증명 요청
- `installation-token.schema.json`: 설치 단위 access token 응답

구체적인 HTTP method, header, status, 제한과 재시도 규칙은
`apps/backend/docs/API_CONTRACT.md`를 따른다. JSON Schema와 문서가 충돌하면 더 엄격한
조건을 적용하고, 충돌 자체를 계약 결함으로 처리한다.

## 검증 원칙

- 모든 schema는 JSON Schema Draft 2020-12다.
- 실패 응답은 `application/problem+json`, 성공 응답은 `application/json`이다.
- schema의 `additionalProperties: false`는 provider 오류, stack trace, secret 또는 내부
  분류 코드가 외부 응답에 섞이는 것을 막기 위한 계약이다.
- fixture는 각 schema의 성공·실패 예제를 모두 검증해야 한다.

