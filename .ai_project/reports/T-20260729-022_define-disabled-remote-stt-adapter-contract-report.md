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
- `apps/backend/contracts/stt/remote-stt-cleanup-task.schema.json`
- `apps/backend/contracts/stt/remote-stt-deletion-receipt.schema.json`
- `apps/backend/contracts/stt/fixtures/disabled-release.json`
- `apps/backend/contracts/stt/fixtures/activation-negative.json`
- `apps/backend/contracts/stt/fixtures/retry-terminal-cases.json`
- `apps/backend/contracts/stt/fixtures/cleanup-policy.json`
- `apps/backend/contracts/stt/fixtures/deletion-lifecycle-cases.json`
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

## 승인된 재작업 결과

### QA-HIGH-022-001

- `UPSTREAM_UNAVAILABLE`만 동일 request·provider·audio handle·provider
  idempotency key로 최대 1회 재처리하도록 단일화했다.
- 두 번째 unavailable에서 `UPSTREAM_UNAVAILABLE` terminal, 첫 timeout에서 재처리
  없이 `UPSTREAM_TIMEOUT` terminal로 전환하고 삭제를 시작한다.
- 성공 복구, unavailable 2회, 첫 timeout, non-retryable provider 오류의 provider
  호출 횟수·terminal·삭제 시작 fixture를 추가했다.

### QA-HIGH-022-002

- body read 전에 audio handle, deadline cleanup record와 delete task/outbox를 원자
  등록하도록 고정했다.
- terminal 직후부터 T+55분까지의 deadline worker retry와 최대 5분 주기의 독립
  sweeper를 정의했다.
- sweeper가 cleanup record, object prefix와 multipart upload를 대조하고 queue
  전달 실패·worker crash·multipart 잔존을 복구하도록 했다.
- 성공·최종 실패·취소·timeout·worker crash·첫 delete 실패·queue 실패·multipart
  잔존 8개 fixture가 모두 `deletion_completed_at <= received_at + 1시간`을
  만족하는지 검사한다.
- provider가 1시간 이내 물리 삭제 확인을 지원하지 않거나 deadline breach가 발생하면
  kill switch, P0 privacy incident와 원격 STT 활성화·출시 차단을 적용한다.

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
| retry/terminal 오류 4개 fixture 호출 횟수·삭제 시작 | PASS |
| cleanup 사전 원자 등록·T+55분 worker·5분 sweeper 정책 | PASS |
| 정상·비정상 삭제 8개 fixture 최대 1시간·시각 순서 | PASS |
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
- provider가 1시간 안의 물리 삭제 확인을 지원하지 않으면 원격 STT를 활성화할 수 없다.
- Object Storage lifecycle/TTL만으로 즉시 삭제를 증명할 수 없으므로 활성 구현은
  explicit delete 결과와 cleanup SLA를 staging에서 검증해야 한다.

## Backend QA 인계

Backend QA Agent는 문서의 9절을 기준으로 기본 상태에서 원격 호출 가능성이 없는지,
무승인 요청이 body read 전에 차단되는지, 자동 fallback이 금지되는지, 삭제 deadline과
콘텐츠 비노출이 fixture와 일치하는지 독립 검증한다.

## 최신 develop 통합

- 최신 기준 `origin/develop`: `0fdfe52`
- 재정렬된 T-022~024 병렬 실행 승인 커밋: `b71c737`
- 최신 T-20260730-004 `done` 공용 보드 상태: 보존
- 형제 T-20260729-023·024 승인 상태: 보존
- 최신 `origin/develop` 대비 뒤처짐: 0

## Development Lead 완료 검토

Backend QA 재검증 결과를 커밋 `2179040`으로 고정하고 최신 `origin/develop`
`0fdfe52` 기준 정합성을 확인했다. 재작업 구현 기준은 `c960eed`다.

- QA-HIGH-022-001·002: 해소
- retry/terminal fixture 4개·삭제 lifecycle fixture 8개: PASS
- T+55분 deadline worker·5분 sweeper·forced delete: PASS
- 기본 비활성·무승인 upload·자동 fallback 금지 무회귀: PASS
- 계약 script·JSON·Task strict validation·`git diff --check`: PASS
- 최신 develop 대비 behind: 0
- T-20260730-004 done·형제 T-023·T-024 상태: 보존
- 변경 경로: Task `allowed_paths` 안
- Backend QA: `PASS_WITH_RISK`
- 차단 결함: 없음

실제 runtime cleanup 장애 복구와 provider 물리 삭제 SLA는 T-025와 후속 활성화
staging gate로 인계한다. 현재 원격 STT 강제 비활성 경계가 유지되므로 비차단 위험이다.
Development Lead가 완료 검토를 통과시켜 `completion_review`로 수용한다.

## 완료

- PR: [#40](https://github.com/cschoi724/CookLog/pull/40)
- merge SHA: `93f577ee137a4bcf0017d426d6334010294bfff3`
- hosted checks: `ios-build`, `ios-xctest` 성공
- 병합 방식: `develop` 대상 squash merge

Development Lead가 구현·QA PR의 checks와 merge SHA를 확인해 `done`으로
확정했다. runtime cleanup 장애 복구와 provider 물리 삭제 SLA는 T-025 및 후속
staging gate로 인계한다.
