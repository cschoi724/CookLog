# CookLog 원격 STT 계약

이 디렉터리는 기본 비활성 원격 STT adapter의 기계 검증 원본이다. 실제 endpoint,
provider SDK, secret과 활성 배포 설정은 포함하지 않는다.

## 파일

- `remote-stt-release-config.schema.json`: 첫 출시 강제 비활성 배포 profile
- `remote-stt-transcription-request.schema.json`: 향후 승인된 요청의 provider 중립 metadata
- `remote-stt-transcription-result.schema.json`: transcript 결과
- `remote-stt-deletion-receipt.schema.json`: 콘텐츠 없는 임시 음성 삭제 증적
- `fixtures/disabled-release.json`: 첫 출시 비활성 profile
- `fixtures/activation-negative.json`: 무승인 upload·fallback 차단 사례
- `fixtures/deletion-receipt.json`: 1시간 이내 삭제 사례
- `validate-contracts.sh`: schema·fixture 정책 정합성 검사

첫 출시 resolver는 Apple 기기 내 adapter만 선택한다. 이 디렉터리의 request/result
schema가 존재한다는 사실은 원격 upload endpoint 또는 활성화 승인을 의미하지 않는다.
활성화에는 별도 제품·비용·개인정보·provider·QA 승인이 필요하다.

자체 검증:

```sh
sh apps/backend/contracts/stt/validate-contracts.sh
```

