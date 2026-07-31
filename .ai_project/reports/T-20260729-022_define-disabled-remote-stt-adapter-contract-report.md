# T-20260729-022 실행 보고서

작성자: Backend Agent  
작성일: 2026-07-31  
상태: 자체 검증 완료, Backend QA 독립 검증 대기

## 실행 결과

첫 공개 출시에서 원격 STT가 실제로 호출될 수 없도록 강제 비활성 배포 profile을
정의하고, 향후 별도 승인 후 사용할 provider 중립 request/result/deletion 계약을
작성했다.

현재 계약은 다음을 강제한다.

- Apple 기기 내 STT가 첫 출시의 유일한 선택 경로
- 원격 upload route·provider·audio egress 미등록
- 기기 내 STT 실패·미지원·네트워크 복구를 원격 fallback 조건으로 사용 금지
- 별도 제품·비용·개인정보·provider·QA 승인 전 활성화 금지
- 사용자 one-time authorization을 body read 전에 원자 소비
- 활성 원격 adapter의 복구 가능한 기술 오류는 같은 request·provider에서 최대 1회만
  재처리하고 다른 provider fallback·새 upload·deadline 연장 금지
- 성공·실패·취소·timeout 후 즉시 삭제와 접수 후 최대 1시간 deadline
- audio·transcript·provider 식별자·secret의 로그·오류·queue·receipt 저장 금지

## 산출물

- `apps/backend/docs/REMOTE_STT_ADAPTER.md`
- `apps/backend/contracts/stt/README.md`
- `apps/backend/contracts/stt/remote-stt-release-config.schema.json`
- `apps/backend/contracts/stt/remote-stt-transcription-request.schema.json`
- `apps/backend/contracts/stt/remote-stt-transcription-result.schema.json`
- `apps/backend/contracts/stt/remote-stt-deletion-receipt.schema.json`
- `apps/backend/contracts/stt/fixtures/disabled-release.json`
- `apps/backend/contracts/stt/fixtures/activation-negative.json`
- `apps/backend/contracts/stt/fixtures/deletion-receipt.json`
- `apps/backend/contracts/stt/validate-contracts.sh`

## 주요 계약

### 기본 비활성

첫 출시 profile은 `mode=disabled`, `upload_route_registered=false`,
`provider_configured=false`, `audio_egress_allowed=false`,
`automatic_fallback=false`를 schema와 fixture로 고정했다. 계약 파일이 존재해도
endpoint와 provider가 활성화되지 않는다.

### 무승인 upload 차단

향후 활성화 시에도 배포 승인, 공통 인증·quota, 원격 전송 고지 revision과 clip에
결합된 one-time grant를 body read 전에 검증한다. 한 조건이라도 빠지면 audio stream,
temporary object, provider call과 retry job을 만들지 않는다.

### 삭제 수명주기

terminal 상태에서 음성 접근을 즉시 차단하고 삭제를 시작한다. TTL/lifecycle은
비정상 종료 backstop일 뿐 즉시 삭제를 대신하지 않는다. 삭제 deadline은 최초 접수
시각에서 최대 1시간이며 retry·idempotency·앱 수신 실패가 이를 연장할 수 없다.

### iOS 교체 경계

공통 `SpeechTranscribing` 인터페이스 뒤에 Apple 기기 내 adapter와 비활성 원격
adapter를 분리한다. 첫 출시 resolver는 Apple adapter만 반환한다. 로컬 실패를 원격
요청으로 변환하지 않으며, 미래 활성화 후에도 사용자가 해당 기록에 대해 명시적으로
선택한 새 요청만 허용한다.

## 자체 검증

| 검증 | 결과 |
|---|---|
| `sh apps/backend/contracts/stt/validate-contracts.sh` | PASS |
| STT 계약 JSON 전체 `jq empty` | PASS |
| 첫 출시 강제 비활성 fixture | PASS |
| 무승인·provider 보관 미승인·fallback·grant replay 6개 negative case | PASS |
| 삭제 receipt 최대 1시간·시각 순서 | PASS |
| request JSON audio payload·provider URL 부재 | PASS |
| deletion receipt transcript·provider ID·storage URI 부재 | PASS |
| T-021 공개 오류 catalog code 연결 | PASS |
| `git diff --check` | PASS |

## 범위 외

- 공개 upload endpoint와 runtime 구현
- provider SDK·계정·secret·결제·배포
- 실제 provider 보관·삭제 설정 검증
- iOS `SpeechTranscribing` 구현
- 원격 STT 활성화와 비용 승인

위 항목은 별도 승인 Task 없이는 실행하지 않는다.

## 남은 위험과 후속 소유권

- JSON Schema runtime validator와 iOS·Backend fixture 실행은 T-20260729-025가 담당한다.
- 개인정보·로그·비용 guardrail의 공통 운영 기준은 T-20260729-024가 담당한다.
- provider가 물리 삭제 확인을 지원하지 않는 경우 활성화 가능 여부를 Privacy/Security와
  Product Owner가 별도 결정해야 한다.
- Object Storage lifecycle/TTL만으로 즉시 삭제를 증명할 수 없으므로 활성 구현은
  explicit delete 결과와 cleanup SLA를 staging에서 검증해야 한다.

## Backend QA 인계

Backend QA Agent는 문서의 9절을 기준으로 기본 상태에서 원격 호출 가능성이 없는지,
무승인 요청이 body read 전에 차단되는지, 자동 fallback이 금지되는지, 삭제 deadline과
콘텐츠 비노출이 fixture와 일치하는지 독립 검증한다.

## 최신 develop 통합

- 기준 `origin/develop`: `22fe75f`
- T-022~024 병렬 실행 승인 커밋: `36cf8ee`
- 최신 T-20260730-004 공용 보드 상태: 보존
- 형제 T-20260729-023·024 승인 상태: 보존
- 최신 `origin/develop` 대비 뒤처짐: 0
