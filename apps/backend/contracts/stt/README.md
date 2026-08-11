# CookLog 원격 STT 계약

이 디렉터리는 기본 비활성 원격 STT adapter의 기계 검증 원본이다. 실제 endpoint,
provider SDK, secret과 활성 배포 설정은 포함하지 않는다.

## 파일

- `remote-stt-release-config.schema.json`: 첫 출시 강제 비활성 배포 profile
- `remote-stt-transcription-request.schema.json`: 향후 승인된 요청의 provider 중립 metadata
- `remote-stt-transcription-result.schema.json`: transcript 결과
- `remote-stt-cleanup-task.schema.json`: body read 전에 등록하는 deadline 삭제 작업
- `remote-stt-deletion-receipt.schema.json`: 콘텐츠 없는 임시 음성 삭제 증적
- `fixtures/disabled-release.json`: 첫 출시 비활성 profile
- `fixtures/production-disabled-proof.json`: production runtime·image·manifest의 zero-capability 증적
- `fixtures/activation-negative.json`: 무승인 upload·fallback 차단 사례
- `fixtures/retry-terminal-cases.json`: 오류별 호출 횟수·terminal·삭제 시작 사례
- `fixtures/cleanup-policy.json`: deadline worker·독립 sweeper 정책
- `fixtures/deletion-lifecycle-cases.json`: 정상·비정상 종료와 삭제 복구 사례
- `validate-contracts.sh`: schema·fixture 정책 정합성 검사

Production proof는 upload route·audio body parser·queue publisher·audio storage adapter·
provider·audio egress destination·automatic fallback 등록이 모두 0임을 고정한다. image는
Node 24.18.0 non-root production server만 실행하고 remote STT 환경 설정이나 audio asset을
포함하지 않는다. 배포 manifest가 없거나 명시적으로 disabled인 경우만 허용하며 실제
source·Dockerfile·package·manifest 검사는 `scripts/audit-production-remote-stt-disabled.mjs`가
수행한다.

첫 출시 resolver는 Apple 기기 내 adapter만 선택한다. 이 디렉터리의 request/result
schema가 존재한다는 사실은 원격 upload endpoint 또는 활성화 승인을 의미하지 않는다.
활성화에는 별도 제품·비용·개인정보·provider·QA 승인이 필요하다.

자체 검증:

```sh
sh apps/backend/contracts/stt/validate-contracts.sh
```
