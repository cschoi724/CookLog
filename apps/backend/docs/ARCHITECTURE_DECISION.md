# Backend 런타임·AI Provider 결정안

작성일: 2026-07-30
상태: Product Owner 결정 완료, provider 활성화 gate 대기
적용 범위: 첫 공개 출시의 온라인 `AI 정리하기` gateway

## 결론

첫 공개 출시의 추천 조합은 다음과 같다.

- 런타임: Google Cloud Run, `asia-northeast3` 서울
- 과금 방식: request-based billing, `min instances = 0`, 1 vCPU, 512 MiB
- 비동기 처리: Cloud Tasks 서울 + Firestore Standard 서울의 시간 제한 job 문서
- 콘텐츠 삭제: 생성 22시간 뒤 명시적 delete task + 15분 주기 sweeper,
  Firestore TTL은 지연 삭제를 고려한 최종 안전망으로만 사용
- AI endpoint: OpenAI `kr.api.openai.com/v1/chat/completions`
- AI 모델: `gpt-5-mini-2025-08-07` 고정 snapshot
- 데이터 제어: OpenAI MAM 또는 ZDR 승인과 Modified Retention amendment를 출시 전 필수로 확보
- 요청 저장: `store=false`, 파일·Batch·Assistants·Responses background mode·외부 tool·grounding 미사용
- 인증 방향: 로그인 없이 App Attest 기반 앱 무결성 검증과 설치 단위 단기 토큰 사용
- 비용 상한: 월 KRW 50,000 운영 예산, gateway의 호출·token 원장으로 별도 hard cutoff

차선 조합은 Cloud Run 서울을 유지하고 AI만 Vertex AI EU multi-region의
`gemini-3.1-flash-lite` GA로 교체한다. 차선안도 global endpoint, grounding,
context cache와 Batch를 사용하지 않는다.

2026-08-10 Product Owner가 위 endpoint·model·저장 지역·보관 경계와
adapter·local contract 구현을 승인했다. `openai-recipe-adapter.v1`은 이 결정을
고정하지만 ZDR, Modified Retention amendment, 국외 처리 승인과 전용
credential이 모두 준비되기 전에는 외부 호출을 fail closed한다. 이 구현은
credential 등록·실제 provider 호출·결제·배포를 활성화하지 않는다.

## 변경하지 않는 제품 경계

- 첫 출시 STT는 지원되는 Apple 기기의 기기 내 처리가 기본이다.
- 기기 내 STT 실패 시 원격 STT로 자동 fallback하지 않는다.
- 음성을 Backend 또는 원격 provider로 보내지 않는다.
- 원격 STT는 기본 비활성 adapter의 향후 비교 자료일 뿐이다.
- 온라인 Backend가 처리하는 것은 사용자가 `AI 정리하기`를 실행한 시점의 텍스트
  STEP snapshot이다.
- AI 입력·결과 본문을 운영 DB, 분석 이벤트 또는 오류 로그에 영구 저장하지 않는다.
- 앱 수신 확인 전 결과 복구 캐시는 암호화하고, 확인 즉시 삭제한다.
- 미확인 콘텐츠는 생성 22시간 뒤 명시적 삭제를 시작하고 늦어도 생성 후 24시간에는
  API 접근을 차단한다. Firestore TTL은 최대 24시간 삭제의 주 메커니즘이 아니다.

## 평가 기준

| 기준 | 가중치 | 필수 조건 |
|---|---:|---|
| 개인정보·보관·학습 통제 | 30 | 비학습, endpoint별 보관 확인, 최소 보관 설정 |
| 구조화 출력 적합성 | 25 | JSON schema 출력과 고정 모델 버전 |
| 비용 통제 가능성 | 20 | 호출·token 계측, gateway hard cutoff |
| 지역·운영 단순성 | 15 | 런타임 지역 명시, 관리형 배포 |
| 교체 가능성 | 10 | provider-neutral adapter 경계 |

품질은 실제 한국어 요리 기록 golden set 검증 전에는 가격표만으로 확정할 수 없다.
추천 모델이 계약 fixture와 안전 창작 금지 기준을 통과하지 못하면 차선 모델을 포함해
재평가한다.

## 런타임 후보

### 추천: Cloud Run 서울

Cloud Run은 서울 `asia-northeast3`에서 사용할 수 있고, request-based billing은
요청 처리 시간에 CPU·메모리를 과금하며 `min instances = 0`이면 유휴 인스턴스 비용을
피할 수 있다. 첫 출시의 작은 비정기 트래픽과 맞는다.

앱이 화면을 벗어나도 AI 정리가 계속되는 제품 계약을 만족하도록 API service가
Cloud Tasks 서울 queue에 콘텐츠가 없는 job ID만 넣고, private Cloud Run worker가
처리한다. job 상태와 암호화된 STEP snapshot·결과 cache는 Firestore Standard 서울에
두고 앱 수신 확인 즉시 명시적으로 삭제한다. 영구 레시피 DB로 사용하지 않는다.

미확인 콘텐츠에는 `created_at`, `delete_after = created_at + 22시간`,
`expires_at = created_at + 24시간`, `ttl_safety_at = created_at + 24시간`을 서버가
설정한다. `delete_after` 시각에는 별도 Cloud Tasks cleanup task가 Firestore document를
명시적으로 삭제한다. Cloud Scheduler가 15분마다 private cleanup endpoint를 호출해
`delete_after <= now`인 잔존 문서를 다시 삭제한다. Firestore TTL은 삭제가 즉시
수행되지 않고 만료 뒤 통상 24시간이 더 걸릴 수 있으므로 `ttl_safety_at`은 명시적
삭제가 모두 실패했을 때의 최종 안전망일 뿐, 생성 후 24시간 보장의 근거로 사용하지
않는다.

모든 상태 조회·결과 복구 API는 Firestore 조회 결과를 반환하기 전에 서버 시각으로
`expires_at`을 검사한다. 현재 시각이 같거나 늦으면 응답 본문을 복호화하거나 반환하지
않고 동기 delete를 시도한 뒤 `expired`만 반환한다. 구체적인 state machine과 retry는
T-20260729-023에서 확정하되 이 시간 경계를 완화할 수 없다.

고정 가정:

- region: `asia-northeast3`
- request-based billing
- 1 vCPU, 512 MiB
- `min instances = 0`
- concurrency: 최초에는 1, 실측 후 상향
- 평균 billable time: provider 대기 포함 15초/호출
- 월 provider 호출: 4,400회
- 장기 실행 worker와 GPU 없음

서울은 Cloud Run 공식 가격표에서 Tier 2 가격 지역이다. 2026-07-30 기준 Google
Cloud Platform SKU의 request-based on-demand 단가는 다음과 같다.

- Tier 2 CPU: SKU `085C-A237-027A`, `USD 0.0000264/vCPU-second`
- Tier 2 Memory: SKU `600C-3782-6708`, `USD 0.00000275/GiB-second`
- Requests: SKU `2DA5-55D3-E679`, `USD 0.40/백만 요청`

CPU와 Memory의 Tier 2 단가는 공식 Tier 1 단가 `USD 0.000024`,
`USD 0.0000025`의 정확히 1.10배다. 따라서 10%는 임의의 보수적 가산이 아니라 공식
Tier 2 SKU 단가에서 재현되는 차이다. Requests는 별도 Tier 2 SKU가 없으므로 10%를
가산하지 않고 공식 Requests SKU 단가를 그대로 사용한다.

월 사용량과 free tier 적용 전 비용은 다음과 같다.

| 항목 | 산식 | 월 사용량 | 비용 |
|---|---|---:|---:|
| CPU | `4,400 × 15초 × 1 vCPU` | 66,000 vCPU-s | USD 1.7424 |
| 메모리 | `4,400 × 15초 × 0.5 GiB` | 33,000 GiB-s | USD 0.09075 |
| 요청 | `4,400 / 1,000,000 × USD 0.40` | 4,400회 | USD 0.00176 |
| 합계 | 위 합계 | - | **USD 1.83491 ≈ USD 1.83** |

Cloud Run free tier는 billing account 단위의 spending-based discount이며 서울에도
적용되지만 Tier 1 가격을 기준으로 환산된다. 현재 가정은 공식 free tier
180,000 vCPU-s, 360,000 GiB-s, 2백만 요청보다 작으므로 다른 서비스가 free tier를
소진하지 않았다면 compute 실청구는 USD 0으로 예상한다. 비교와 상한 계산에서는
free tier를 보장하지 않고 반올림 전 USD 1.83491을 사용한다.

포함하지 않은 비용:

- 인터넷 egress, Artifact Registry, Cloud Build, Logging
- 세금, 유료 지원, 별도 DB
- provider 응답 시간이 15초를 넘는 경우의 추가 runtime

위 비용은 배포 견적이 아니라 검증 가능한 트래픽 가정이다. 배포 후
`billable_instance_time`, 호출 수, p50/p95 처리 시간을 월별로 재계산한다.

비동기·삭제 구성요소 가정:

- provider Cloud Tasks: 호출당 create 1회 + delivery 1회
- cleanup Cloud Tasks: 호출당 create 1회 + delivery 1회
- Cloud Tasks 합계: 월 17,600 operations, 각 payload 32KB 미만
- Firestore: 호출당 write 6회, 기존 read 4회, cleanup read 1회,
  명시적 document delete 1회
- 15분 주기 sweeper: 월 2,880회, 호출당 Cloud Run 1 vCPU·0.5GiB·1초,
  결과가 없어도 Firestore query 최소 read 1회로 보수 계산
- Firestore 월 사용량: write 26,400, read 24,880, 일반 delete 4,400
- TTL safety net: 최악의 비교 상한으로 TTL delete 4,400건을 추가 계산
- Cloud Scheduler: job 1개
- 암호화 payload와 index를 합해 1GiB 미만

Cloud Tasks 첫 1백만 operations/month와 Firestore 기본 database의 일일
50,000 reads, 20,000 writes, 20,000 일반 document deletes, 1GiB storage에는 무료
할당량이 있다. Cloud Scheduler도 billing account당 3개 job이 무료다. 그러나
비교표는 다른 workload가 무료 할당량을 소진할 수 있으므로 모든 구성요소를 free
quota 전 단가로 계산한다.

Firestore TTL deletes는 무료 사용 미지원 항목이고 기능 사용에 billing 활성화가
필요하다. 이번 설계에서는 TTL을 생성 후 24시간 삭제의 주 메커니즘으로 사용하지
않지만, 명시적 삭제가 전부 실패하는 보수적 비교 상한으로 월 4,400건
`4,400 / 100,000 × USD 0.01 = USD 0.00044`를 계속 포함한다. 정상 경로에서는 문서가
이미 명시적으로 삭제되므로 실제 TTL delete 건수는 0에 가까워야 한다.

free quota를 제외한 비교 단가는 Cloud Tasks USD 0.40/백만 operations, Firestore
서울 read USD 0.03/100k, write USD 0.09/100k, 일반·TTL delete
USD 0.01/100k, Cloud Scheduler USD 0.10/job-month다.

- Cloud Tasks:
  `17,600 / 1M × USD 0.40 = USD 0.00704`
- Firestore writes:
  `26,400 / 100k × USD 0.09 = USD 0.02376`
- Firestore reads:
  `24,880 / 100k × USD 0.03 = USD 0.007464`
- 일반 document deletes:
  `4,400 / 100k × USD 0.01 = USD 0.00044`
- TTL safety-net deletes 상한:
  `4,400 / 100k × USD 0.01 = USD 0.00044`
- 15분 sweeper Cloud Run:
  `2,880 × 1초 × (1 vCPU × 0.0000264 + 0.5 GiB × 0.00000275)
  + 2,880 / 1M × USD 0.40 = USD 0.081144`
- Cloud Scheduler 1개: USD 0.10
- 삭제·비동기 구성요소 합계: USD 0.220288
- provider worker Cloud Run 포함 runtime 합계:
  `USD 1.83491 + USD 0.220288 = USD 2.055198 ≈ USD 2.06`

비교표는 free tier 소진 여부에 좌우되지 않도록 USD 2.055198을 사용한다. Cloud
Scheduler 1개와 정상 명시적 delete는 무료 범위로 예상하지만 이를 확정 청구액으로
간주하지 않는다.

### 콘텐츠 삭제 운영 계약

- 앱 결과 수신 확인: 같은 요청에서 Firestore 콘텐츠 document를 명시적으로 삭제한다.
- 미확인 결과: 생성 22시간에 cleanup task가 idempotent delete를 실행한다.
- 보완 sweep: 15분마다 `delete_after <= now`인 잔존 document를 조회해 삭제한다.
- 접근 차단: `now >= expires_at`이면 복호화·본문 반환 없이 `expired`만 반환하고
  동기 delete를 시도한다.
- retry: cleanup queue는 생성 23시간 45분까지만 재시도하며 이후에는 sweeper와
  incident cleanup이 담당한다.
- 경고: 가장 오래된 콘텐츠가 22시간 30분이면 warning, 23시간이면 critical을
  발생시키고 새 AI job 생성을 중지한다.
- incident: 23시간 30분 잔존 시 on-call 수동 delete와 원인 조사를 시작하며
  잔존 count가 0이 되기 전 job 생성을 재개하지 않는다.
- 지표: 콘텐츠가 있는 document의 최대 age, cleanup 성공·재시도·실패 수,
  `expires_at` 접근 차단 수와 Firestore TTL 지연을 기록하되 본문은 기록하지 않는다.
- 출시 gate: 24시간 이상 된 콘텐츠 document 0건과 ACK·22시간 cleanup·sweeper
  경로의 계약 테스트를 staging에서 확인한다.

T-20260729-023은 위 timestamp와 idempotent delete state machine을, `024`는
비콘텐츠 지표·경보·job 생성 차단·incident 절차를 필수 인수 조건으로 사용한다.

### 보류한 후보

- 상시 VM: 작은 트래픽에서도 고정비와 운영 부담이 생겨 첫 출시 기본안에서 제외한다.
- provider 전용 serverless runtime: AI provider 교체 시 런타임까지 결합되고 서울
  배치 근거가 약해 제외한다.
- Cloud Run의 항상 켜진 instance-based billing: 비동기 job이 있더라도 초기 트래픽에
  상시 CPU가 필요하다는 근거가 없어 제외한다.

## AI provider 후보

### 추천: OpenAI 한국 저장 프로젝트 + GPT-5 mini

구체적인 조합은 다음과 같다.

- endpoint: `kr.api.openai.com/v1/chat/completions`
- model: `gpt-5-mini-2025-08-07`
- Structured Outputs JSON schema 사용
- `store=false`
- MAM 또는 ZDR 적용
- prompt caching, Batch, Files, Assistants, Conversations, Responses background mode,
  web/file search와 remote MCP 미사용

선정 이유:

- GPT-5 mini는 구조화 출력을 지원하고 입력 USD 0.25/백만 token, 출력
  USD 2.00/백만 token이다.
- snapshot을 고정해 alias 이동에 따른 출력 drift를 막을 수 있다.
- 한국 endpoint는 Customer Content의 한국 저장을 지원한다.
- `Chat Completions`는 application state가 기본 `None`이며, `Responses`는 기본
  application state가 30일이므로 CookLog의 최소 보관 정책에는 전자가 더 단순하다.

중요한 제한:

- 한국 region은 regional storage만 지원하고 regional processing은 지원하지 않는다.
  추론 중 Customer Content가 한국 밖에서 처리·임시 저장될 수 있다.
- 한국 data residency는 MAM 또는 ZDR 사전 승인과 Modified Retention amendment가
  필요하다.
- 기본 abuse monitoring은 prompt·response를 포함할 수 있고 최대 30일 보관한다.
  따라서 MAM/ZDR 승인을 받지 못하면 추천안을 출시 경로로 사용하지 않는다.
- OpenAI는 API 데이터를 명시적 opt-in 없이는 모델 학습에 사용하지 않지만, 이것만으로
  30일 abuse monitoring 문제를 해소하지는 않는다.
- Structured Output schema 자체는 system data로서 data residency 대상이 아니다.
  schema에 실제 레시피 값이나 사용자 콘텐츠를 넣지 않는다.

### 차선: Vertex AI EU + Gemini 3.1 Flash-Lite

구체적인 조합은 다음과 같다.

- Cloud Run 서울 runtime 유지
- Vertex AI location: `eu`
- model: `gemini-3.1-flash-lite`
- Standard online prediction의 non-global endpoint
- response schema 사용
- grounding, context cache, session resumption, Batch 미사용
- 프로젝트 단위 in-memory data caching 비활성화
- abuse monitoring 예외 자격과 실제 project 설정을 출시 전에 검증

이 조합은 AI와 runtime을 Google Cloud IAM·billing으로 묶을 수 있고, 모델은
2026-05-07 GA이며 공식 retirement가 2027-05-07 이후다. EU multi-region은 storage와
ML processing 경계가 명시된다.

제약은 다음과 같다.

- `gemini-3.1-flash-lite`는 한국 또는 아시아 regional processing을 제공하지 않고
  global, US, EU만 제공한다. global endpoint는 사용하지 않는다.
- 서울 Cloud Run에서 EU로 텍스트를 보내므로 지연시간과 국외 이전을 별도 검증해야 한다.
- Google은 사전 허락 없이 고객 데이터로 managed model을 학습하지 않는다.
- Google model은 조건에 따라 abuse monitoring prompt logging을 할 수 있다.
  zero retention이 필요하면 공식 예외 절차가 필요하다.
- 기본 in-memory cache는 project 격리, 최대 24시간 TTL이므로 CookLog의 최소 보관
  원칙에 따라 명시적으로 끈다.

### 추천안과 차선안 비교

| 항목 | 추천안 | 차선안 |
|---|---|---|
| Runtime | Cloud Run 서울 | Cloud Run 서울 |
| AI | OpenAI GPT-5 mini snapshot | Vertex AI Gemini 3.1 Flash-Lite GA |
| Endpoint | 한국 저장 / 처리 지역 미보장 | EU 저장·처리 |
| 구조화 출력 | 지원 | 지원 |
| 비학습 | 기본 비학습 | 사전 허락 없는 학습 금지 |
| 최소 보관 전제 | MAM/ZDR 승인 필수 | cache off + abuse monitoring 예외 검증 |
| 운영 장점 | 한국 저장, 단순 Chat Completions | 단일 GCP IAM·billing |
| 핵심 위험 | 한국 밖 추론, 별도 계약 필요 | EU 왕복 지연, 한국 지역 없음 |

차선안은 AI provider만 바꾸며 런타임·인증·quota·데이터 삭제 정책은 동일하다.
두 조합을 섞어 추천하거나 Gemini의 global endpoint를 차선으로 사용하지 않는다.

## AI 비용 산식

정책 비교용 공통 가정:

| 항목 | 값 |
|---|---:|
| 월 활성 설치 | 1,000 |
| 설치당 월 AI 정리 | 4회 |
| 월 logical job | 4,000 |
| 재처리·실패 allowance | 10% |
| 월 provider 호출 | 4,400 |
| 호출당 입력 | 2,500 token |
| 호출당 출력 | 1,000 token |
| 월 입력 | 11,000,000 token |
| 월 출력 | 4,400,000 token |
| 예산 환율 | USD 1 = KRW 1,400 |
| 환율·세금 변동 buffer | 10% |

입력은 system prompt, JSON schema와 평균 6개 STEP을 포함한 상한 가정이다. 출력은
레시피 제목·재료·단계·메모·추정 표시를 포함한 상한 가정이다. 실제 token 계측값이
아니며, production sample로 월별 보정한다.

| 조합 | AI 산식 | AI 월 비용 | Runtime 포함 | KRW 환산·10% buffer |
|---|---|---:|---:|---:|
| 추천 | `11M × 0.25 + 4.4M × 2.00` / 1M | USD 11.55 | USD 13.61 | **KRW 20,952** |
| 차선 | `11M × 0.275 + 4.4M × 1.65` / 1M | USD 10.285 | USD 12.34 | **KRW 19,004** |

Runtime 포함 값은 free tier를 제외한 보수적 USD 2.055198을 더하고 소수 둘째 자리로
표시했다. KRW는 반올림 전 USD 합계에 `1,400 × 1.10`을 적용한 뒤 원 단위로
반올림했다. 네트워크·build·artifact·logging은 포함하지 않는다.

## Quota와 hard cutoff

월 KRW 50,000은 승인용 전체 Backend 외부비 예산이다. provider console의 budget
경고만 hard cutoff로 간주하지 않는다. gateway가 outbound 요청 전에 원자적으로 quota를
예약하고, 다음 중 하나에 도달하면 새 AI 호출을 거절한다.

| 제어 | 경고 | Hard cutoff |
|---|---|---:|
| provider 호출 | 4,400회 | 5,500회/월 |
| 입력 token | 11M | 20M/월 |
| 출력 token | 4.4M | 8M/월 |
| 요청당 입력 | 4,000 token | 5,000 token |
| 요청당 출력 | 1,500 token | 2,000 token |
| 동시 provider 호출 | 실측 후 조정 | 10 |
| 월 추정 외부비 | KRW 25k/37.5k/45k 알림 | KRW 50k 운영 중지 게이트 |

상한 token을 모두 사용했을 때:

- 추천 AI: `20M × 0.25 + 8M × 2.00 = USD 21.00`
- 차선 AI: `20M × 0.275 + 8M × 1.65 = USD 18.70`
- 5,500회 × 15초 Cloud Run과 삭제·비동기 구성요소의 free tier 전 비용:
  약 USD 2.52
- 추천 합계의 환율·10% buffer: 약 KRW 36,226
- 차선 합계의 환율·10% buffer: 약 KRW 32,684

따라서 KRW 50,000에는 현재 산식에 없는 egress·logging과 계측 지연 여유가 있다.
provider 측 token usage가 돌아오면 예약값과 정산하고, 응답이 없어도 예약 상한을
해제하지 않아 장애가 비용 폭증으로 이어지지 않게 한다.

Cloud Billing 일반 budget은 자동 hard cap이 아니며, 지원되는 spend cap도 추정 비용
처리 지연과 서비스 범위가 있다. 플랫폼 설정은 2차 방어로만 사용하고 gateway quota를
1차 제어로 유지한다.

quota 도달 시:

- 기존 STEP과 진행 기록을 보존한다.
- provider를 자동 전환하지 않는다.
- 자동 retry하지 않는다.
- 사용자에게 내부 provider나 비용을 노출하지 않고 일시적 `AI 정리하기` 사용 불가와
  수동 재실행을 안내한다.
- Product Owner가 quota·예산 상향 또는 기능 재개를 승인하기 전까지 차단을 유지한다.

## 인증 방향

CookLog 첫 출시는 로그인·회원가입이 없으므로 user account 인증을 추가하지 않는다.
그렇다고 앱 bundle에 정적 Backend API key를 넣지도 않는다.

결정안:

1. 앱이 서버의 일회성 challenge를 받아 App Attest key를 attestation한다.
2. 서버가 attestation을 검증한 뒤 설치 범위의 짧은 수명 access token을 발급한다.
3. AI job 생성 같은 비용 발생 요청은 request body와 challenge에 대한 App Attest
   assertion, access token, idempotency key를 검증한다.
4. 서버는 App Attest counter로 replay를 차단하고 설치별 rate limit·quota를 적용한다.
5. 개인 레시피 본문을 설치 식별 metadata와 함께 장기 저장하지 않는다.

Apple은 App Attest가 모든 기기에서 지원되지 않을 수 있으므로 compatibility 경로가
필요하다고 명시한다. 그 경로는 무제한 익명 접근이 아니라 더 낮은 quota의 단기
installation token과 위험 기반 제한으로 설계한다. 구체적인 token TTL, 지원 불가
처리와 오류 계약은 T-20260729-021에서 확정한다.

## 장애와 provider 전환

- timeout·5xx·rate limit은 같은 idempotency key의 상태 조회·사용자 수동 재실행
  계약으로 처리한다.
- provider 간 자동 fallback은 하지 않는다. schema·안전 동작과 비용이 다른 provider로
  무통제 전환하면 중복 과금과 결과 drift가 생긴다.
- 추천 provider 장애가 지속되면 Product Owner가 차선 adapter 활성화를 승인하고,
  golden set·계약 fixture·보관 설정·quota를 다시 검증한 뒤 수동 전환한다.
- 모델 alias를 사용하지 않고 snapshot 또는 GA model ID를 고정한다.
- provider retirement 최소 90일 전에 후속 모델의 회귀 검증 Task를 연다.

## 출시 전 승인 게이트

| 항목 | 필요한 결정·증빙 | 미충족 시 |
|---|---|---|
| Runtime | Cloud Run 서울·request-based·min 0 승인 | 배포 금지 |
| AI provider | 추천 또는 차선 조합 선택 | 실제 provider 연동 금지 |
| 국외 처리 | 추천안의 한국 밖 처리 또는 차선안의 EU 처리 수용 | 출시 경로 사용 금지 |
| 보관 | MAM/ZDR 또는 Google 예외와 실제 project 설정 화면·계약 | 출시 경로 사용 금지 |
| 모델 | golden set의 구조·안전·한국어 품질 통과 | 모델 재선정 |
| 인증 | App Attest + 제한된 compatibility 경로 승인 | public API 배포 금지 |
| 비용 | KRW 50,000와 quota/hard cutoff 승인 | 유료 API 활성화 금지 |

## 공식 출처

모든 URL은 2026-07-30에 확인했다.

### Google Cloud Run

- 위치: https://docs.cloud.google.com/run/docs/locations
- 가격·free tier·billing 방식·지역 tier:
  https://cloud.google.com/run/pricing
- request-based Tier 2 CPU SKU `085C-A237-027A`:
  https://cloud.google.com/skus?currency=USD&filter=085C-A237-027A
- request-based Tier 2 Memory SKU `600C-3782-6708`:
  https://cloud.google.com/skus?currency=USD&filter=600C-3782-6708
- Requests SKU `2DA5-55D3-E679`:
  https://cloud.google.com/skus?currency=USD&filter=2DA5-55D3-E679
- Cloud Run SKU group:
  https://cloud.google.com/skus/sku-groups/cloud-run
- Cloud Run 개요와 scale-to-zero:
  https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run
- Cloud Tasks 가격·위치:
  https://cloud.google.com/tasks/pricing
  https://docs.cloud.google.com/tasks/docs/locations
- Firestore 가격·서울 위치·TTL delete 무료 할당량 제외:
  https://cloud.google.com/firestore/pricing
  https://docs.cloud.google.com/firestore/docs/locations
- Firestore TTL 지연 삭제 동작:
  https://firebase.google.com/docs/firestore/ttl
- Cloud Scheduler 가격:
  https://cloud.google.com/scheduler/pricing
- Cloud Tasks future schedule과 retry:
  https://docs.cloud.google.com/tasks/docs/creating-http-target-tasks
- 일반 budget이 hard cap이 아니라는 주의:
  https://docs.cloud.google.com/billing/docs/how-to/budgets
- spend cap 동작과 제한:
  https://docs.cloud.google.com/billing/docs/how-to/budgets-spend-caps

### OpenAI

- GPT-5 mini 가격·snapshot·Structured Outputs:
  https://developers.openai.com/api/docs/models/gpt-5-mini
- endpoint별 학습·보관·ZDR/MAM과 지역:
  https://developers.openai.com/api/docs/guides/your-data

### Vertex AI

- Gemini 3.1 Flash-Lite GA·지역·retirement·보안 제어:
  https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-lite
- Gemini 가격:
  https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing
- 비학습·zero retention·in-memory cache:
  https://docs.cloud.google.com/vertex-ai/generative-ai/docs/vertex-ai-zero-data-retention
- response schema:
  https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/control-generated-output

### Apple App Attest

- 앱 무결성:
  https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity
- 서버 검증·challenge·counter:
  https://developer.apple.com/documentation/devicecheck/validating-apps-that-connect-to-your-server

### 향후 원격 STT 참고

- Google Speech-to-Text 가격:
  https://cloud.google.com/speech-to-text/pricing
- Google Speech-to-Text 데이터 사용:
  https://docs.cloud.google.com/speech-to-text/docs/v1/data-usage-faq
- Google Speech-to-Text logging opt-in:
  https://docs.cloud.google.com/speech-to-text/docs/v1/data-logging-terms
- OpenAI Whisper 가격:
  https://developers.openai.com/api/docs/models/whisper-1
- OpenAI audio endpoint 보관·지역:
  https://developers.openai.com/api/docs/guides/your-data

## 향후 원격 STT 비용 참고

이 절은 비활성 adapter의 향후 검토 자료이며 첫 출시 기본값을 바꾸지 않는다.

제품 정책의 월 4,000분 가정에서:

| 후보 | 공식 단가 | 월 비용 | KRW·10% buffer | 처리·보관 주의 |
|---|---:|---:|---:|---|
| Google STT V2 standard | USD 0.016/분 | USD 64 | KRW 98,560 | V1 FAQ는 global 처리 또는 EU/US multi-region, logging opt-in 금지 |
| OpenAI Whisper | USD 0.006/분 | USD 24 | KRW 36,960 | audio transcription은 application/abuse retention `None`; regional processing은 US/EU만 |

Google V2의 실제 recognizer location과 V2 데이터 조건은 adapter 활성화 Task에서 다시
공식 검증한다. V1 data usage FAQ를 V2의 지역 보장으로 확대 해석하지 않는다.

어느 후보도 자동 fallback, 기본 활성화, Backend 음성 endpoint 구현을 의미하지 않는다.
향후 별도 Product Owner 승인 시에만 음성 업로드 동의, Backend 즉시 삭제·최대 1시간
TTL, provider 조건, 한국어 품질과 비용을 다시 검증한다.
