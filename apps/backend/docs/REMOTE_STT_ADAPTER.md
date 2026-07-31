# CookLog 원격 STT adapter 계약

상태: T-20260729-022 구현 계약  
버전: v1  
작성일: 2026-07-31

## 1. 목적과 현재 상태

이 문서는 향후 별도 승인을 받아 원격 STT를 도입할 때 사용할 provider 중립 adapter,
승인 경계와 임시 음성 삭제 계약을 정의한다. 첫 공개 출시의 실제 STT 경로는 Apple
기기 내 처리다.

첫 출시 배포 프로필은 다음 상태를 모두 만족해야 한다.

- `mode=disabled`
- Backend 공개 upload endpoint 미등록
- provider·credential·egress 목적지 미설정
- Backend가 audio body를 읽거나 임시 저장소를 만드는 코드 경로 비활성
- 기기 내 STT 실패 시 원격 STT 자동 fallback 금지

기계 검증 원본은
`apps/backend/contracts/stt/remote-stt-release-config.schema.json`이다. 이 Task는
endpoint, provider SDK, secret, 배포 설정과 활성화를 구현하지 않는다.

## 2. 활성화 승인 경계

원격 adapter 활성화는 단순 feature flag 변경이 아니다. 다음 조건을 모두 만족하는 새
제품 변경 Task와 배포 승인이 필요하다.

1. Product Owner의 원격 STT 제품 정책 승인
2. 월 사용량·provider 단가·환율·세금을 포함한 비용 승인
3. 개인정보처리방침에 처리 목적, 전달 대상, 지역, 보관·삭제 조건 반영
4. provider의 학습 사용 비활성, 처리 지역과 가장 짧은 보관 설정 검증
5. provider가 CookLog의 Backend 임시 음성 최대 1시간 삭제 SLA를 방해하지 않는다는
   Privacy/Security 승인
6. project·installation quota와 emergency kill switch 설정
7. 사용자에게 원격 전송을 사전 고지하고 명시적으로 선택받는 iOS 흐름 승인
8. Backend QA의 무승인 업로드·삭제·로그 비노출 검증 통과

승인 ID는 서로 다른 문서의 실제 revision을 가리켜야 한다. 빈 값, placeholder,
만료된 승인, 환경이 다른 승인은 fail closed한다. 활성화 작업은 별도 Task에서 release
config schema와 배포 manifest를 변경해야 하며, T-022 산출물만으로 활성화할 수 없다.

## 3. iOS service 경계

iOS는 공통 `SpeechTranscribing` 인터페이스 뒤에서 adapter를 선택한다.

```text
SpeechTranscribing.transcribe(localAudio) -> TranscriptionResult
├─ AppleOnDeviceSpeechAdapter  # 첫 출시에서 유일하게 선택 가능
└─ RemoteSpeechAdapter         # 빌드·runtime 모두 비활성
```

선택 규칙:

- 첫 출시 resolver는 항상 `AppleOnDeviceSpeechAdapter`를 반환한다.
- 기기 내 adapter의 미지원, 권한 거부, timeout, 빈 결과와 최종 실패는 원격 adapter
  선택 조건이 아니다.
- 복구 가능한 오류의 자동 재처리는 같은 기기 내 adapter에서 최대 1회만 수행한다.
- 원격 adapter가 미래에 활성화돼도 사용자가 해당 기록에 대해 원격 처리를 명시적으로
  선택한 새 요청에만 사용할 수 있다. 실패한 로컬 요청을 이어받지 않는다.
- 앱 재실행, 네트워크 복구, remote config 변경과 server 응답은 원격 전송을 자동
  시작하지 못한다.

## 4. Backend 요청 진입 순서

향후 endpoint를 구현할 때 gateway는 body를 읽거나 temporary object를 만들기 전에
아래 순서로 검사한다.

1. 배포 profile과 runtime kill switch가 모두 활성인지 확인
2. 제품·비용·개인정보·provider 승인 revision과 환경 일치 확인
3. T-021 installation access token, installation ID, rate·project quota 확인
4. 원격 전송 고지 revision에 동의한 one-time authorization grant 확인
5. grant의 installation, clip ID, request ID, expiry와 미사용 상태 확인
6. `Content-Length`, media type과 최대 10초 제한 확인
7. grant를 원자적으로 소비한 단일 요청만 body stream에 접근

1~6 중 하나라도 실패하면 body를 소비하지 않고 임시 음성 object, provider 호출,
retry/outbox 작업을 만들지 않는다. 비활성 상태는 공통 공개 오류
`503 SERVICE_DISABLED`로 응답한다. 잘못되거나 재사용된 grant는 안전한
`400 INVALID_REQUEST`로 응답하며 provider명, 승인 문서와 음성 정보를 노출하지 않는다.

future request metadata는 `remote-stt-transcription-request.schema.json`을 따른다.
원본 audio bytes는 JSON, 로그, queue payload와 idempotency record에 넣지 않고 승인
후 열린 수명 제한 stream 또는 불투명한 `audio_handle`로만 adapter에 전달한다.

## 5. provider 중립 adapter

```text
RemoteSTTAdapter.transcribe(requestMetadata, ephemeralAudioStream)
  -> RemoteSTTTranscriptionResult
RemoteSTTAdapter.deleteProviderCopy(providerRequestHandle)
  -> deletion confirmation
```

adapter는 provider SDK 오류를 공통 공개 오류로 정규화한다.

| adapter 결과 | 공개 오류 | retry |
|---|---|---|
| 비활성·kill switch | `SERVICE_DISABLED` | 자동 retry 금지 |
| 승인·grant 오류 | `INVALID_REQUEST` | 자동 retry 금지 |
| payload 크기·길이 초과 | `PAYLOAD_TOO_LARGE` | 자동 retry 금지 |
| provider 일시 장애 | `UPSTREAM_UNAVAILABLE` | 사용자 새 요청만 허용 |
| provider timeout | `UPSTREAM_TIMEOUT` | 사용자 새 요청만 허용 |
| 내부 삭제·안전 경계 실패 | `INTERNAL_ERROR` | 자동 retry 금지 |

provider payload, 모델명, request handle, transcript, audio hash와 secret은 외부 오류
envelope에 포함하지 않는다. 공개 오류 mapping은 T-021
`public-error-catalog.json`을 그대로 사용한다.

## 6. 음성 수명주기와 삭제 SLA

음성은 입력 도구이며 Backend의 영구 resource가 아니다.

| 시점 | 필수 동작 |
|---|---|
| 승인된 upload 접수 | `received_at`과 `delete_deadline_at <= received_at + 1시간` 기록 |
| 처리 중 | 암호화된 격리 임시 영역 또는 memory stream만 사용 |
| 성공·최종 실패·취소·timeout | 즉시 접근 차단하고 삭제 시작 |
| 삭제 성공 | object·multipart part·buffer·provider copy 삭제 확인 후 receipt 기록 |
| 삭제 실패 | 접근 불가능한 격리 상태 유지, cleanup retry와 운영 경보 |
| 생성 후 1시간 | 물리 사본이 남으면 SLA breach로 경보; 처리·다운로드는 계속 금지 |

구체 규칙:

- 가능하면 저장 없이 provider로 stream한다.
- 임시 저장이 필요하면 object 생성 시점에 암호화, 단일 request ACL과 절대
  `delete_deadline_at`을 함께 기록한다.
- terminal 상태가 되면 transcript 응답 전 삭제를 시도한다. provider가 삭제 확인을
  제공하면 확인 완료 후 성공 응답한다.
- 삭제 확인이 불가능하거나 실패하면 transcript를 성공으로 확정하지 않고
  `INTERNAL_ERROR`로 종료하며 cleanup은 별도 안전 작업으로 계속한다.
- cleanup retry가 음성 bytes를 queue 또는 dead-letter queue에 복제하면 안 된다.
  cleanup 작업에는 불투명한 handle과 deadline만 둔다.
- TTL/lifecycle은 비정상 종료용 backstop이며 즉시 삭제를 대체하지 않는다.
- 원본 음성을 운영 DB, backup, analytics, crash report, trace, metric label, 일반 로그,
  idempotency 응답 cache와 고객지원 첨부에 넣지 않는다.
- transcript도 사용자 콘텐츠이므로 운영·오류 로그에 넣지 않는다.

`remote-stt-deletion-receipt.schema.json`은 콘텐츠가 없는 삭제 증적 형태를 정의한다.
receipt는 request ID, opaque audio handle, 시각, 삭제 결과만 포함하며 provider 식별자나
storage URI를 포함하지 않는다.

## 7. timeout·재시도·idempotency

- 전체 gateway deadline은 T-021 공통 API timeout보다 짧거나 같아야 하며, 정확한 값은
  provider 활성화 Task에서 확정한다.
- timeout은 terminal 상태다. audio 접근을 즉시 차단하고 삭제를 시작한다.
- Backend는 음성 변환을 자동 재실행하지 않는다. 사용자가 다시 선택하면 새 clip,
  one-time grant와 idempotency key로 새 요청을 만든다.
- 동일 idempotency key 재전송은 새 upload나 provider 호출을 만들지 않는다.
- idempotency record에는 body hash, 상태와 안전한 result pointer만 두고 audio 또는
  transcript를 넣지 않는다.
- 결과를 앱이 받지 못한 경우에도 삭제 deadline을 연장하지 않는다.

## 8. 관측성과 비용 차단

허용 metadata:

- canonical request ID
- installation의 비가역 partition key
- 시작·종료 시각, latency bucket
- 성공 여부와 안전한 오류 code
- audio duration bucket, byte-size bucket
- 삭제 시도 횟수, deadline 준수 여부
- provider 비용 계산용 비콘텐츠 사용량

금지 metadata:

- audio bytes, transcript, audio hash
- storage URI, provider request ID
- authorization header, grant, secret
- 사용자 레시피·STEP 내용

provider 호출 전 T-021 project hard cutoff와 T-024 비용 guardrail을 원자 예약한다. 예약
실패, limiter 장애와 emergency limit `0`은 provider 호출과 upload를 fail closed한다.

## 9. QA 인계 기준

Backend QA Agent는 최소한 다음을 독립 검증한다.

1. 첫 출시 config가 disabled이며 upload route·provider·egress를 등록하지 않는지
2. 비활성 상태에서 body read, 임시 object, provider 호출이 모두 0인지
3. 로컬 adapter 실패·미지원·네트워크 복구가 원격 fallback을 만들지 않는지
4. 승인 revision 또는 one-time grant 하나라도 없으면 body 전 단계에서 거부하는지
5. 동일 grant 동시 요청이 정확히 한 요청만 통과하는지
6. 성공·실패·취소·timeout에서 즉시 삭제와 최대 1시간 deadline을 지키는지
7. cleanup retry와 idempotency가 audio를 복제하거나 TTL을 연장하지 않는지
8. 로그·trace·metric·오류·receipt에 audio, transcript, provider 정보와 secret이 없는지
9. schema·fixture와 `validate-contracts.sh`가 통과하는지

