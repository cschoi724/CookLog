# Backend 공용 fixture 계약 테스트

`validate-shared-fixtures.sh`는 iOS와 Backend가 함께 쓰는 fixture가 기존 common·AI·STT
계약에서 drift하지 않았는지 검사한다.

- 기존 네 계약 validator 실행
- JSON 문법, manifest case/file 추적성
- AI create hash와 canonical request·draft 일치
- 정상·오류·timeout·만료 상태와 iOS 행동
- 공개 오류 catalog mapping
- 원격 STT 비활성·body read 전 차단
- version·idempotency·ACK·unknown field negative case
- secret, token, 실제 개인정보와 raw audio 비포함

실행:

```sh
sh apps/backend/tests/contracts/validate-shared-fixtures.sh
```
